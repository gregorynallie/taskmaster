import {
    UserProfile,
    AIPersonaSummary,
    ClarificationQuestion,
    AIInsight,
    CategoryFocus
} from '../src/types/userTypes';
import {
    Task,
    Quest,
    Suggestion,
    SuggestionFeedback,
    EnrichedTaskData,
    QuestSuggestionPayload,
} from '../src/types/taskTypes';
import { OnboardingAnswers } from "../src/types/onboardingTypes";
import { Mode, SuggestionPill, TimeOfDay, AIQualityMode } from '../src/types/uiTypes';
import { Placeholder } from '../src/types/contextTypes';
import { TASK_CATEGORIES } from "../constants";
import { v4 as uuidv4 } from 'uuid';

const CLAUDE_MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const AI_GATEWAY_URL = (process.env.VITE_AI_GATEWAY_URL || '').trim();
const AI_CACHE_PREFIX = 'taskmaster_ai_cache:v1:';
const MAX_CONCURRENT_AI_REQUESTS = 2;
const MAX_RETRIES = 2;
const DEFAULT_SESSION_REQUEST_BUDGET = 120;
const DEFAULT_CLAUDE_INPUT_COST_PER_MTOK_USD = 3;
const DEFAULT_CLAUDE_OUTPUT_COST_PER_MTOK_USD = 15;
const PARSE_RETRY_MAX_TOKENS_CAP = 2600;
const AI_QUALITY_MODE_STORAGE_KEY = 'taskmaster_aiQualityMode';

type AIQualityTier = 'low' | 'standard' | 'high';

type AIFeature =
    | 'general'
    | 'onboarding'
    | 'ui_content'
    | 'explore'
    | 'task_enrich'
    | 'quest'
    | 'suggestions'
    | 'persona'
    | 'insights'
    | 'clarification';

type RequestTask = {
    id: string;
    feature: AIFeature;
    priority: number;
    run: () => Promise<void>;
};

const FEATURE_PRIORITY: Record<AIFeature, number> = {
    task_enrich: 100,
    onboarding: 90,
    quest: 85,
    suggestions: 70,
    explore: 65,
    persona: 55,
    clarification: 50,
    ui_content: 40,
    insights: 35,
    general: 20,
};

const FEATURE_COOLDOWN_MS: Record<AIFeature, number> = {
    task_enrich: 250,
    onboarding: 400,
    quest: 600,
    suggestions: 1000,
    explore: 1200,
    persona: 3000,
    clarification: 1200,
    ui_content: 1000,
    insights: 2000,
    general: 800,
};

const FEATURE_DEFAULT_TIER: Record<AIFeature, AIQualityTier> = {
    task_enrich: 'standard',
    onboarding: 'high',
    quest: 'high',
    suggestions: 'standard',
    explore: 'standard',
    persona: 'high',
    clarification: 'low',
    ui_content: 'standard',
    insights: 'standard',
    general: 'standard',
};

const FEATURE_CRITICAL_WHEN_BUDGET_EXCEEDED: Record<AIFeature, boolean> = {
    task_enrich: true,
    onboarding: true,
    quest: true,
    suggestions: false,
    explore: false,
    persona: false,
    clarification: false,
    ui_content: false,
    insights: false,
    general: false,
};

const QUALITY_TIER_TOKEN_CAP: Record<AIQualityTier, number> = {
    low: 700,
    standard: 1800,
    high: 4096,
};

type AIQualityModeConfig = {
    tokenMultiplier: number;
    suggestionDescriptionWordLimit: number;
    taskContextLimit: number;
    questContextLimit: number;
    feedbackContextLimit: number;
};

const AI_QUALITY_MODE_CONFIG: Record<AIQualityMode, AIQualityModeConfig> = {
    cost_saver: {
        tokenMultiplier: 1.0,
        suggestionDescriptionWordLimit: 24,
        taskContextLimit: 20,
        questContextLimit: 8,
        feedbackContextLimit: 5,
    },
    balanced: {
        tokenMultiplier: 1.3,
        suggestionDescriptionWordLimit: 32,
        taskContextLimit: 35,
        questContextLimit: 12,
        feedbackContextLimit: 8,
    },
    high_context: {
        tokenMultiplier: 1.8,
        suggestionDescriptionWordLimit: 40,
        taskContextLimit: 60,
        questContextLimit: 20,
        feedbackContextLimit: 12,
    },
};

const queue: RequestTask[] = [];
let activeRequests = 0;
const lastStartedAtByFeature = new Map<AIFeature, number>();

type AIRuntimeStats = {
    enqueued: number;
    started: number;
    succeeded: number;
    failed: number;
    retries: number;
    rateLimited: number;
    cacheHits: number;
    cacheMisses: number;
    budgetBlocked: number;
    qualityTierLow: number;
    qualityTierStandard: number;
    qualityTierHigh: number;
    qualityTierDowngrades: number;
    claudeInputTokens: number;
    claudeOutputTokens: number;
    claudeTotalTokens: number;
};

type LastAIActionSnapshot = {
    status: 'success' | 'error' | 'blocked';
    feature: AIFeature;
    qualityTier: AIQualityTier;
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
    estimatedUSD: number;
    timestamp: number;
    reason?: string;
};

const aiRuntimeStats: AIRuntimeStats = {
    enqueued: 0,
    started: 0,
    succeeded: 0,
    failed: 0,
    retries: 0,
    rateLimited: 0,
    cacheHits: 0,
    cacheMisses: 0,
    budgetBlocked: 0,
    qualityTierLow: 0,
    qualityTierStandard: 0,
    qualityTierHigh: 0,
    qualityTierDowngrades: 0,
    claudeInputTokens: 0,
    claudeOutputTokens: 0,
    claudeTotalTokens: 0,
};

let lastAIActionSnapshot: LastAIActionSnapshot = {
    status: 'success',
    feature: 'general',
    qualityTier: 'standard',
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedUSD: 0,
    timestamp: Date.now(),
};

const parsePositiveNumber = (raw: string): number | null => {
    const value = Number(raw);
    if (!Number.isFinite(value) || value <= 0) return null;
    return Math.floor(value);
};

const parseNonNegativeNumber = (raw: string): number | null => {
    const value = Number(raw);
    if (!Number.isFinite(value) || value < 0) return null;
    return value;
};

const parseAIQualityMode = (raw: string | null): AIQualityMode => {
    if (raw === 'balanced' || raw === 'high_context' || raw === 'cost_saver') return raw;
    return 'cost_saver';
};

const getCurrentAIQualityMode = (): AIQualityMode => {
    try {
        if (typeof window === 'undefined') return 'cost_saver';
        const raw = window.localStorage.getItem(AI_QUALITY_MODE_STORAGE_KEY);
        if (!raw) return 'cost_saver';
        return parseAIQualityMode(JSON.parse(raw));
    } catch {
        return 'cost_saver';
    }
};

const getCurrentAIQualityModeConfig = (): AIQualityModeConfig => AI_QUALITY_MODE_CONFIG[getCurrentAIQualityMode()];

const applyQualityModeTokenMultiplier = (maxTokens: number): number => {
    const { tokenMultiplier } = getCurrentAIQualityModeConfig();
    return Math.max(200, Math.round(maxTokens * tokenMultiplier));
};

const sessionRequestBudget = parsePositiveNumber(process.env.VITE_AI_SESSION_REQUEST_BUDGET || '')
    ?? DEFAULT_SESSION_REQUEST_BUDGET;
let sessionRequestsConsumed = 0;
const claudeInputCostPerMTokUSD = parseNonNegativeNumber(process.env.VITE_CLAUDE_INPUT_COST_PER_MTOK_USD || '')
    ?? DEFAULT_CLAUDE_INPUT_COST_PER_MTOK_USD;
const claudeOutputCostPerMTokUSD = parseNonNegativeNumber(process.env.VITE_CLAUDE_OUTPUT_COST_PER_MTOK_USD || '')
    ?? DEFAULT_CLAUDE_OUTPUT_COST_PER_MTOK_USD;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseRetryAfterMs = (response: Response): number | null => {
    const retryAfterHeader = response.headers.get('retry-after');
    if (!retryAfterHeader) return null;
    const numeric = Number(retryAfterHeader);
    if (!Number.isNaN(numeric)) return Math.max(0, numeric * 1000);
    const asDate = new Date(retryAfterHeader);
    const ms = asDate.getTime() - Date.now();
    return Number.isFinite(ms) ? Math.max(0, ms) : null;
};

const processQueue = () => {
    while (activeRequests < MAX_CONCURRENT_AI_REQUESTS && queue.length > 0) {
        queue.sort((a, b) => b.priority - a.priority);
        const nextTask = queue.shift();
        if (!nextTask) break;
        activeRequests += 1;
        aiRuntimeStats.started += 1;
        void nextTask.run().finally(() => {
            activeRequests -= 1;
            processQueue();
        });
    }
};

const scheduleRequest = async <T>(feature: AIFeature, runner: () => Promise<T>): Promise<T> => {
    const priority = FEATURE_PRIORITY[feature];
    const taskId = uuidv4();
    aiRuntimeStats.enqueued += 1;
    return new Promise<T>((resolve, reject) => {
        queue.push({
            id: taskId,
            feature,
            priority,
            run: async () => {
                try {
                    const previousStart = lastStartedAtByFeature.get(feature) || 0;
                    const cooldownMs = FEATURE_COOLDOWN_MS[feature];
                    const elapsed = Date.now() - previousStart;
                    if (elapsed < cooldownMs) {
                        await sleep(cooldownMs - elapsed);
                    }
                    lastStartedAtByFeature.set(feature, Date.now());
                    const result = await runner();
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            },
        });
        processQueue();
    });
};

type CacheEnvelope<T> = {
    expiresAt: number;
    value: T;
};

const cacheKey = (key: string) => `${AI_CACHE_PREFIX}${key}`;

const readCache = <T>(key: string): T | null => {
    try {
        const raw = localStorage.getItem(cacheKey(key));
        if (!raw) return null;
        const parsed = JSON.parse(raw) as CacheEnvelope<T>;
        if (!parsed || typeof parsed.expiresAt !== 'number' || Date.now() > parsed.expiresAt) {
            localStorage.removeItem(cacheKey(key));
            return null;
        }
        aiRuntimeStats.cacheHits += 1;
        return parsed.value;
    } catch {
        return null;
    }
};

const writeCache = <T>(key: string, value: T, ttlMs: number) => {
    try {
        const envelope: CacheEnvelope<T> = { value, expiresAt: Date.now() + ttlMs };
        localStorage.setItem(cacheKey(key), JSON.stringify(envelope));
    } catch {
        // localStorage may be unavailable or full; fail silently.
    }
};

const withCache = async <T>(options: {
    key?: string;
    ttlMs?: number;
    producer: () => Promise<T>;
}): Promise<T> => {
    const { key, ttlMs, producer } = options;
    if (key && ttlMs && ttlMs > 0) {
        const cached = readCache<T>(key);
        if (cached !== null) return cached;
        aiRuntimeStats.cacheMisses += 1;
    }
    const value = await producer();
    if (key && ttlMs && ttlMs > 0) {
        writeCache(key, value, ttlMs);
    }
    return value;
};

const profileFingerprint = (userProfile?: UserProfile): string => {
    if (!userProfile) return 'none';
    return [
        userProfile.personaId || '',
        userProfile.interests || '',
        userProfile.dislikes || '',
        userProfile.longTermGoals || '',
        userProfile.dailyRhythm || '',
        userProfile.aiInsights.length.toString(),
    ].join('|').toLowerCase().trim();
};

const stableHash = (value: string): string => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash * 31 + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash).toString(36);
};

const downgradeTier = (tier: AIQualityTier): AIQualityTier => {
    if (tier === 'high') return 'standard';
    if (tier === 'standard') return 'low';
    return 'low';
};

const shortPromptHeuristic = (prompt: string): boolean => {
    const normalized = prompt.trim();
    if (!normalized) return true;
    const words = normalized.split(/\s+/).filter(Boolean).length;
    return normalized.length <= 120 || words <= 20;
};

const resolveQualityTier = (options: {
    feature: AIFeature;
    userPrompt: string;
    requestedTier?: AIQualityTier;
}): AIQualityTier => {
    const { feature, userPrompt, requestedTier } = options;
    let tier = requestedTier ?? FEATURE_DEFAULT_TIER[feature];
    if ((feature === 'task_enrich' || feature === 'clarification') && shortPromptHeuristic(userPrompt)) {
        tier = 'low';
    }
    if (queue.length >= 6 && FEATURE_PRIORITY[feature] <= FEATURE_PRIORITY.persona) {
        const downgraded = downgradeTier(tier);
        if (downgraded !== tier) {
            aiRuntimeStats.qualityTierDowngrades += 1;
            tier = downgraded;
        }
    }
    return tier;
};

const recordClaudeUsage = (usage: any) => {
    if (!usage || typeof usage !== 'object') return;
    const inputTokens = Number(usage.input_tokens ?? 0) || 0;
    const outputTokens = Number(usage.output_tokens ?? 0) || 0;
    const cacheReadTokens = Number(usage.cache_read_input_tokens ?? 0) || 0;
    const cacheCreationTokens = Number(usage.cache_creation_input_tokens ?? 0) || 0;
    const totalTokens = inputTokens + outputTokens + cacheReadTokens + cacheCreationTokens;

    aiRuntimeStats.claudeInputTokens += inputTokens;
    aiRuntimeStats.claudeOutputTokens += outputTokens;
    aiRuntimeStats.claudeTotalTokens += totalTokens;
    return { inputTokens, outputTokens, totalTokens };
};

const estimateUSDFromTokens = (inputTokens: number, outputTokens: number): number => {
    const inputUSD = (inputTokens / 1_000_000) * claudeInputCostPerMTokUSD;
    const outputUSD = (outputTokens / 1_000_000) * claudeOutputCostPerMTokUSD;
    return inputUSD + outputUSD;
};

const setLastAIActionSnapshot = (snapshot: LastAIActionSnapshot) => {
    lastAIActionSnapshot = snapshot;
};

const extractJsonCandidate = (raw: string): string => {
    const startArray = raw.indexOf('[');
    const startObject = raw.indexOf('{');
    const starts = [startArray, startObject].filter(i => i >= 0);
    if (starts.length === 0) return raw;
    const start = Math.min(...starts);
    const slice = raw.slice(start);
    const endArray = slice.lastIndexOf(']');
    const endObject = slice.lastIndexOf('}');
    const end = Math.max(endArray, endObject);
    if (end < 0) return slice;
    return slice.slice(0, end + 1);
};

const normalizeJsonCandidate = (candidate: string): string => {
    let out = '';
    let inString = false;
    let escaped = false;
    for (let i = 0; i < candidate.length; i += 1) {
        const ch = candidate[i];
        if (inString) {
            if (escaped) {
                out += ch;
                escaped = false;
                continue;
            }
            if (ch === '\\') {
                out += ch;
                escaped = true;
                continue;
            }
            if (ch === '"') {
                out += ch;
                inString = false;
                continue;
            }
            if (ch === '\n' || ch === '\r') {
                out += '\\n';
                continue;
            }
            out += ch;
            continue;
        }
        if (ch === '"') {
            inString = true;
            out += ch;
            continue;
        }
        out += ch;
    }
    return out.replace(/,\s*([}\]])/g, '$1');
};

const parseJsonResilient = <T>(raw: string): T => {
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
        return JSON.parse(clean) as T;
    } catch {
        // Continue with fallback attempts.
    }

    const extracted = extractJsonCandidate(clean);
    try {
        return JSON.parse(extracted) as T;
    } catch {
        // Continue with normalization fallback.
    }

    const normalized = normalizeJsonCandidate(extracted);
    return JSON.parse(normalized) as T;
};

// ---------------------------------------------------------------------------
// Core API helper
// ---------------------------------------------------------------------------

const callClaude = async (
    systemPrompt: string,
    userPrompt: string,
    maxTokens = 1000,
    feature: AIFeature = 'general',
    requestedTier?: AIQualityTier
): Promise<string> => {
    return scheduleRequest(feature, async () => {
        let lastError: Error | null = null;
        const qualityTier = resolveQualityTier({ feature, userPrompt, requestedTier });
        if (qualityTier === 'low') aiRuntimeStats.qualityTierLow += 1;
        if (qualityTier === 'standard') aiRuntimeStats.qualityTierStandard += 1;
        if (qualityTier === 'high') aiRuntimeStats.qualityTierHigh += 1;
        const qualityModeTokens = applyQualityModeTokenMultiplier(maxTokens);
        const effectiveMaxTokens = Math.min(qualityModeTokens, QUALITY_TIER_TOKEN_CAP[qualityTier]);

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
            if (
                sessionRequestsConsumed >= sessionRequestBudget &&
                !FEATURE_CRITICAL_WHEN_BUDGET_EXCEEDED[feature]
            ) {
                aiRuntimeStats.budgetBlocked += 1;
                setLastAIActionSnapshot({
                    status: 'blocked',
                    feature,
                    qualityTier,
                    inputTokens: 0,
                    outputTokens: 0,
                    totalTokens: 0,
                    estimatedUSD: 0,
                    timestamp: Date.now(),
                    reason: `Session budget ${sessionRequestBudget} reached`,
                });
                throw new Error(`AI session budget exceeded (${sessionRequestBudget} requests).`);
            }
            sessionRequestsConsumed += 1;

            const usingGateway = !!AI_GATEWAY_URL;
            const response = usingGateway
                ? await fetch(AI_GATEWAY_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        model: CLAUDE_MODEL,
                        maxTokens: effectiveMaxTokens,
                        systemPrompt,
                        userPrompt,
                    }),
                })
                : await fetch(ANTHROPIC_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
                        'anthropic-version': '2023-06-01',
                        'anthropic-dangerous-direct-browser-access': 'true',
                    },
                    body: JSON.stringify({
                        model: CLAUDE_MODEL,
                        max_tokens: effectiveMaxTokens,
                        system: systemPrompt,
                        messages: [{ role: 'user', content: userPrompt }],
                    }),
                });

            if (response.ok) {
                aiRuntimeStats.succeeded += 1;
                const data = await response.json();
                const usage = usingGateway ? (data as any).usage : data.usage;
                const usageTotals = recordClaudeUsage(usage) || { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
                setLastAIActionSnapshot({
                    status: 'success',
                    feature,
                    qualityTier,
                    inputTokens: usageTotals.inputTokens,
                    outputTokens: usageTotals.outputTokens,
                    totalTokens: usageTotals.totalTokens,
                    estimatedUSD: estimateUSDFromTokens(usageTotals.inputTokens, usageTotals.outputTokens),
                    timestamp: Date.now(),
                });
                const text = usingGateway
                    ? String((data as any).content ?? '')
                    : (data.content || [])
                        .filter((block: any) => block.type === 'text')
                        .map((block: any) => block.text)
                        .join('');
                return text;
            }

            const errText = await response.text();
            const error = new Error(`Anthropic API error ${response.status}: ${errText}`);
            lastError = error;

            if (response.status === 429 && attempt < MAX_RETRIES) {
                aiRuntimeStats.rateLimited += 1;
                aiRuntimeStats.retries += 1;
                const retryAfterMs = parseRetryAfterMs(response);
                const backoffBase = 600 * Math.pow(2, attempt);
                const jitter = Math.floor(Math.random() * 250);
                await sleep(Math.max(retryAfterMs ?? 0, backoffBase + jitter));
                continue;
            }

            aiRuntimeStats.failed += 1;
            setLastAIActionSnapshot({
                status: 'error',
                feature,
                qualityTier,
                inputTokens: 0,
                outputTokens: 0,
                totalTokens: 0,
                estimatedUSD: 0,
                timestamp: Date.now(),
                reason: `HTTP ${response.status}`,
            });
            throw error;
        }

        aiRuntimeStats.failed += 1;
        setLastAIActionSnapshot({
            status: 'error',
            feature,
            qualityTier,
            inputTokens: 0,
            outputTokens: 0,
            totalTokens: 0,
            estimatedUSD: 0,
            timestamp: Date.now(),
            reason: 'Unknown Claude API error',
        });
        throw lastError ?? new Error('Unknown Claude API error');
    });
};

const generateJson = async <T>(
    systemPrompt: string,
    userPrompt: string,
    maxTokens = 1000,
    options?: { feature?: AIFeature; qualityTier?: AIQualityTier; cache?: { key: string; ttlMs: number } }
): Promise<T> => {
    const fullSystem = `${systemPrompt}\n\nCRITICAL: Your response must be valid JSON only. No markdown fences, no preamble, no explanation — just raw JSON.`;
    return withCache<T>({
        key: options?.cache?.key,
        ttlMs: options?.cache?.ttlMs,
        producer: async () => {
            const feature = options?.feature ?? 'general';
            const raw = await callClaude(
                fullSystem,
                userPrompt,
                maxTokens,
                feature,
                options?.qualityTier
            );
            try {
                return parseJsonResilient<T>(raw);
            } catch (e) {
                // Parse failures are frequently caused by truncated JSON.
                // Retry once at high tier with a larger token budget for robustness.
                try {
                    const retryMaxTokens = Math.min(Math.max(maxTokens, 1200), PARSE_RETRY_MAX_TOKENS_CAP);
                    const retryRaw = await callClaude(
                        fullSystem,
                        userPrompt,
                        retryMaxTokens,
                        feature,
                        'high'
                    );
                    return parseJsonResilient<T>(retryRaw);
                } catch {
                    console.error('JSON parse failed. Raw response:', raw);
                    throw new Error('Failed to parse JSON from Claude response');
                }
            }
        },
    });
};

// ---------------------------------------------------------------------------
// Shared schema descriptions for JSON responses
// ---------------------------------------------------------------------------

const TASK_CATEGORIES_LIST = TASK_CATEGORIES.join(', ');

const ENRICHED_TASK_SCHEMA = `
Each task object must have:
- title: string — clear, actionable title
- description: string — immediately useful description; include markdown links where relevant
- category: one of [${TASK_CATEGORIES_LIST}]
- subcategories: string[] — 1-3 tags
- duration_min: number — estimated minutes
- difficulty: number 1-5
- xp_estimate: number 5-200
- isHybrid: boolean
- hybridCategoryName?: string — if isHybrid true
- deadline_at?: string — ISO 8601 if implied
- scheduled_at?: string — ISO 8601 if implied
- recurring: null | { frequency: "MINUTELY"|"HOURLY"|"DAILY"|"WEEKLY"|"MONTHLY"|"YEARLY", interval: number, daysOfWeek?: ("SU"|"MO"|"TU"|"WE"|"TH"|"FR"|"SA")[], dayOfMonth?: number }
  — MUST be null for one-off tasks
`;

const SUGGESTION_SCHEMA = `
${ENRICHED_TASK_SCHEMA}
Additionally each suggestion object must also have:
- reasoning: string — 1-3 word punchy subtext explaining why suggested
- context_tag: string — brief tag (max 5 words)
- isProjectStarter?: boolean
- projectName?: string
- questNarrative?: string
- subtasks?: array of task objects (same schema as above, without suggestion fields)
`;

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

export const generateStarterTasksFromOnboarding = async (answers: OnboardingAnswers, mode: Mode): Promise<EnrichedTaskData[]> => {
    const system = `You are an AI life coach setting up a new user's account. Generate a personalized starter pack of 6-8 tasks.
${ENRICHED_TASK_SCHEMA}
Output a JSON array of task objects sorted chronologically by scheduled_at.`;

    const user = `Current date: ${new Date().toISOString()}
App Mode: "${mode}"
User's Onboarding Answers:
- Daily Rhythm: "${answers.rhythm || 'Not specified'}"
- Main Priorities: ${(answers.priorities || []).join(', ')}
- Desired Daily/Weekly Habits: ${(answers.rhythm_habits || []).join(', ')}
- Interests: ${(answers.interests || []).join(', ')}
- Extra Notes: "${answers.notes || 'None'}"

INSTRUCTIONS:
1. Generate 6-8 tasks: 4-5 recurring habits + 2-3 one-off goal tasks.
2. Every description must be immediately useful — provide the actual content, steps, or a useful link. No vague descriptions.
3. Schedule intelligently using their rhythm (Early Bird → 9 AM, Night Owl → 8 PM, Flexible → spread throughout).
4. recurring MUST be null for one-off tasks.
5. All scheduled_at timestamps MUST be in the future.
6. Return a JSON array sorted by scheduled_at ascending.`;

    try {
        const result = await generateJson<EnrichedTaskData[]>(system, user, 4096, {
            feature: 'onboarding',
            qualityTier: 'high',
        });
        if (!Array.isArray(result) || result.length === 0) throw new Error('Empty result');
        return result;
    } catch (e) {
        console.error('generateStarterTasksFromOnboarding failed:', e);
        return [];
    }
};

export const getInitialPersonaContent = async (userProfile: UserProfile, mode: Mode): Promise<{
    task: { placeholders: Placeholder[] };
    explore: { placeholders: Placeholder[], pills: SuggestionPill[] };
    project: { placeholders: Placeholder[], pills: SuggestionPill[] };
}> => {
    const now = new Date();
    const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening';
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

    const system = `You are an AI assistant for a task management app. Generate personalized UI content.
Output a single JSON object with keys "task", "explore", "project".
Each has "placeholders" (array of {question, example, subtext}) and "explore"/"project" also have "pills" (array of {emoji, label}).
- placeholders[].example must start with "Example: "
- placeholders[].subtext must start with "💡 "
- Generate 3 placeholders and 5-7 pills for explore and project, 3 placeholders for task.`;

    const user = `User Profile:
- Persona: ${userProfile.aiPersonaSummary?.persona}
- Interests: ${userProfile.interests}
- Long-term Goals: ${userProfile.longTermGoals}
- Daily Rhythm: ${userProfile.dailyRhythm}
- App Mode: ${mode}
- Time of Day: ${timeOfDay}, Day: ${dayOfWeek}

Generate highly personalized, creative content for all three sections.`;

    try {
        const cacheIdentity = stableHash(`${profileFingerprint(userProfile)}|${mode}|${timeOfDay}|${dayOfWeek}`);
        const result = await generateJson<any>(system, user, 1200, {
            feature: 'ui_content',
            qualityTier: 'standard',
            cache: { key: `initial_persona_content:${cacheIdentity}`, ttlMs: 1000 * 60 * 30 },
        });
        // Ensure formatting consistency
        const fix = (placeholders: Placeholder[]) => placeholders.map(p => ({
            ...p,
            example: p.example.startsWith('Example: ') ? p.example : `Example: ${p.example}`,
            subtext: p.subtext.startsWith('💡') ? p.subtext : `💡 ${p.subtext}`,
        }));
        result.task.placeholders = fix(result.task.placeholders);
        result.explore.placeholders = fix(result.explore.placeholders);
        result.project.placeholders = fix(result.project.placeholders);
        return result;
    } catch (e) {
        console.error('getInitialPersonaContent failed:', e);
        throw e;
    }
};

export const getInitialExploreSuggestions = async (userProfile: UserProfile): Promise<Suggestion[]> => {
    const { suggestionDescriptionWordLimit } = getCurrentAIQualityModeConfig();
    const system = `You are an AI assistant for a task management app generating "explore" suggestions.
${SUGGESTION_SCHEMA}
Output a JSON array of exactly 4 suggestion objects.`;

    const user = `User Profile:
- Persona: ${userProfile.aiPersonaSummary?.persona}
- Interests: ${userProfile.interests}
- Long-term Goals: ${userProfile.longTermGoals}

Generate 4 diverse, actionable suggestions from different categories (e.g. Health, Personal Growth, Fun).
Descriptions must be immediately useful — provide actual content, steps, or links. Max ${suggestionDescriptionWordLimit} words per description.
Keep suggestions compact. Prefer one-off tasks unless a recurring pattern is clearly valuable.
reasoning must be 1-3 words only. context_tag max 5 words.`;

    try {
        const result = await generateJson<Suggestion[]>(system, user, 1400, {
            feature: 'explore',
            qualityTier: 'standard',
            cache: { key: `initial_explore:${stableHash(profileFingerprint(userProfile))}`, ttlMs: 1000 * 60 * 20 },
        });
        if (!Array.isArray(result) || result.length === 0) throw new Error('Empty result');
        return result;
    } catch (e) {
        console.error('getInitialExploreSuggestions failed:', e);
        return [];
    }
};

export const getDynamicSuggestions = async (options: {
    prompt: string;
    userProfile: UserProfile;
    count: number;
    filters?: { duration?: string | null; categories?: string[] };
}): Promise<Suggestion[]> => {
    const { prompt, userProfile, count, filters } = options;
    const { suggestionDescriptionWordLimit } = getCurrentAIQualityModeConfig();
    const now = new Date();
    const futureDate1 = new Date(now); futureDate1.setDate(futureDate1.getDate() + 2);
    const futureDate2 = new Date(now); futureDate2.setDate(futureDate2.getDate() + 7);

    const system = `You are an AI assistant for a task management app generating task suggestions.
${SUGGESTION_SCHEMA}
Output a JSON array of ${count} suggestion objects.`;

    const user = `Current Date: ${now.toISOString()}
User Profile:
- Persona: ${userProfile.aiPersonaSummary?.persona}
- Interests: ${userProfile.interests}
- Long-term Goals: ${userProfile.longTermGoals}
- Location: Tampa, FL, USA

User Prompt: "${prompt}"
Filters: ${JSON.stringify(filters || {})}

INSTRUCTIONS:
1. For large goals: at least one suggestion must be a Project Starter (isProjectStarter: true, with projectName, questNarrative, subtasks).
2. For habits: at least one suggestion should use the recurring field.
3. Descriptions must be immediately useful (max ${suggestionDescriptionWordLimit} words, markdown links OK).
4. reasoning must be 1-3 words. context_tag max 5 words.
5. Subtask scheduled_at values should be spread: first around ${futureDate1.toISOString()}, next around ${futureDate2.toISOString()}.
6. Apply all filters strictly.`;

    try {
        const result = await generateJson<Suggestion[]>(system, user, 1600, {
            feature: 'explore',
            qualityTier: 'standard',
        });
        if (!Array.isArray(result) || result.length === 0) throw new Error('Empty result');
        return result;
    } catch (e) {
        console.error('getDynamicSuggestions failed:', e);
        throw e;
    }
};

export const getParsingSubtext = async (taskInput: string, userProfile: UserProfile): Promise<string> => {
    if (!taskInput || taskInput.trim().length < 4) return '';

    const system = `You are an AI assistant analyzing task input for a task management app.
Output a JSON object: { "subtext": string }
- subtext starts with "💡 Tip: " and is under 20 words
- If no special parsing detected, subtext is ""`;

    const user = `User input: "${taskInput}"

Analyze for: multiple tasks (commas, "and", newlines), recurring patterns ("every day", "on Tuesdays"), or specific dates/times ("tomorrow at 6pm", "by Friday EOD").
Generate a two-part subtext: what the app will do + how to change it. Return JSON.`;

    try {
        const cacheIdentity = stableHash(`${taskInput.trim().toLowerCase()}|${profileFingerprint(userProfile)}`);
        const result = await generateJson<{ subtext: string }>(system, user, 200, {
            feature: 'task_enrich',
            qualityTier: 'low',
            cache: { key: `parsing_subtext:${cacheIdentity}`, ttlMs: 1000 * 60 * 20 },
        });
        return result.subtext || '';
    } catch (e) {
        console.error('getParsingSubtext failed:', e);
        return '';
    }
};

export const getQuestTaskAlternate = async (quest: Quest, taskToReplace: Task, allQuestTasks: Task[]): Promise<Suggestion | null> => {
    const system = `You are an AI assistant for a task management app. Generate one alternative task for a quest.
${SUGGESTION_SCHEMA}
Output a single JSON object (not an array).`;

    const user = `Quest: "${quest.name}" — ${quest.narrative}
All quest tasks: ${allQuestTasks.map(t => `- ${t.title} (${t.completed_at ? 'Completed' : 'Pending'})`).join('\n')}
Task to replace: "${taskToReplace.title}" — ${taskToReplace.description}

Generate ONE creative alternative task that helps achieve the quest goal but is different from the original.`;

    try {
        return await generateJson<Suggestion>(system, user, 600, {
            feature: 'quest',
            qualityTier: 'standard',
        });
    } catch (e) {
        return null;
    }
};

export const enrichTaskWithAI = async (taskInput: string, userProfile: UserProfile): Promise<EnrichedTaskData[]> => {
    const now = new Date();

    const system = `You are an AI assistant enriching task input with structured data.
${ENRICHED_TASK_SCHEMA}
Output a JSON array of task objects (even if only one task).`;

    const user = `Current Date/Time: ${now.toISOString()} (${now.toLocaleDateString('en-US', { weekday: 'long' })})

User Profile:
- Interests: ${userProfile.interests}
- Long-term Goals: ${userProfile.longTermGoals}
- Daily Rhythm: ${userProfile.dailyRhythm}

User Input: "${taskInput}"

INSTRUCTIONS:
1. Break input into one or more distinct tasks.
2. Parse dates precisely: "tomorrow" = exactly one day from now. Use the current date above.
3. If a time is mentioned use it; otherwise default to 9 AM for morning tasks, 7 PM for evening tasks.
4. For recurring patterns, populate the recurring field. For one-off tasks, recurring MUST be null.
5. Return a JSON array (always an array, even for one task).`;

    const createFallback = (): EnrichedTaskData[] => [{
        title: taskInput,
        description: 'Could not get AI details. You can edit this task manually.',
        category: 'Productivity',
        duration_min: 15,
        xp_estimate: 20,
        original_input: taskInput,
    }];

    try {
        const result = await generateJson<EnrichedTaskData[]>(system, user, 1400, {
            feature: 'task_enrich',
            qualityTier: taskInput.trim().length < 40 ? 'low' : 'standard',
        });
        if (!Array.isArray(result) || result.length === 0) return createFallback();
        return result.map((item: any) => ({ ...item, original_input: taskInput }));
    } catch (e) {
        console.error('enrichTaskWithAI failed:', e);
        return createFallback();
    }
};

export const createQuestFromGoal = async (goal: string, userProfile: UserProfile): Promise<{ name: string; narrative: string; tasks: EnrichedTaskData[] }> => {
    const now = new Date();
    const futureDate1 = new Date(now); futureDate1.setDate(futureDate1.getDate() + 3);
    const futureDate2 = new Date(now); futureDate2.setDate(futureDate2.getDate() + 7);

    const system = `You are an AI life coach creating a "Quest" (project) for a user goal.
Output a single JSON object: { name: string, narrative: string, tasks: Task[] }
${ENRICHED_TASK_SCHEMA}`;

    const user = `Current Date: ${now.toISOString()}
User Profile:
- Interests: ${userProfile.interests}
- Long-term Goals: ${userProfile.longTermGoals}

User's Goal: "${goal}"

INSTRUCTIONS:
1. name: concise, inspiring quest name
2. narrative: 1-2 sentence motivating framing
3. tasks: 3-5 actionable tasks, the first step schedulable for today
4. Spread scheduled_at: start today, then around ${futureDate1.toISOString()}, then ${futureDate2.toISOString()}
5. Each description must provide actual useful content — steps, tips, or resource links. No vague descriptions.
6. Keep output concise and avoid unnecessary prose.`;

    return await generateJson<{ name: string; narrative: string; tasks: EnrichedTaskData[] }>(system, user, 2200, {
        feature: 'quest',
        qualityTier: 'high',
    });
};

export const getSuggestions = async (options: {
    tasks: Task[];
    quests: Quest[];
    mode: Mode;
    feedback: SuggestionFeedback[];
    categoryFocus: CategoryFocus;
    count: number;
    userProfile: UserProfile;
    duration?: string;
    categories?: string[];
}, thinkingBudget?: number): Promise<Suggestion[]> => {
    const { userProfile, tasks, quests, feedback, categoryFocus, count, mode, ...filters } = options;
    const {
        suggestionDescriptionWordLimit,
        taskContextLimit,
        questContextLimit,
        feedbackContextLimit,
    } = getCurrentAIQualityModeConfig();
    const activeTaskTitles = tasks
        .filter(t => !t.completed_at)
        .slice(0, taskContextLimit)
        .map(t => t.title)
        .join(', ');
    const activeQuestNames = quests
        .filter(q => q.status === 'in_progress')
        .slice(0, questContextLimit)
        .map(q => q.name)
        .join(', ');
    const recentFeedback = feedback
        .slice(-feedbackContextLimit)
        .map(f => `"${f.suggestionTitle}" (reason: ${f.reason})`)
        .join('; ');

    const system = `You are a brilliant AI life coach generating task suggestions.
${SUGGESTION_SCHEMA}
Output a JSON array of ${count} suggestion objects.`;

    const user = `User Profile:
- Interests: ${userProfile.interests}
- Dislikes: ${userProfile.dislikes}
- Long-term Goals: ${userProfile.longTermGoals}
- Daily Rhythm: ${userProfile.dailyRhythm}
- Persona: ${userProfile.aiPersonaSummary?.persona}

Current Context:
- Active Tasks (top ${taskContextLimit}): ${activeTaskTitles}
- Active Quests (top ${questContextLimit}): ${activeQuestNames}
- Recent rejected suggestions (last ${feedbackContextLimit}): ${recentFeedback}
- Focus MORE on: ${Object.entries(categoryFocus).filter(([, v]) => v === 'more').map(([k]) => k).join(', ') || 'None'}
- Focus LESS on: ${Object.entries(categoryFocus).filter(([, v]) => v === 'less').map(([k]) => k).join(', ') || 'None'}

Filters: ${JSON.stringify(filters, null, 2)}
App Mode: "${mode}"

MANDATES:
1. BREAK THE LOOP: Never repeat recently seen/done tasks. Don't fixate on their primary interest.
2. VARIETY: Suggestions must span different life categories (Productivity, Health, Fun, etc.).
3. SERENDIPITY: Include at least one "discovery" task — something new that expands their horizons.
4. HOLISTIC BALANCE: Cover the triad: Productivity, Well-being, Play.
5. HABIT BUILDING: Occasionally suggest recurring tasks — use the recurring field.
6. Keep each description under ${suggestionDescriptionWordLimit} words.
7. reasoning must be 1-3 words. context_tag max 5 words.`;

    try {
        const result = await generateJson<Suggestion[]>(system, user, 1600, {
            feature: 'suggestions',
            qualityTier: 'standard',
        });
        if (!Array.isArray(result)) throw new Error('Not an array');
        return result;
    } catch (e) {
        throw new Error('Failed to generate suggestions from Claude API.');
    }
};

export const getInContextSuggestion = async (context: {
    taskAbove?: Task;
    taskBelow?: Task;
    tasksForDay: Task[];
    sortBy: string;
    groupBy: string;
}): Promise<Suggestion | null> => {
    const { taskAbove, taskBelow, tasksForDay } = context;

    let insertionContext = '';
    if (taskAbove && taskBelow) {
        insertionContext = `Suggest a "bridge" task that fits BETWEEN:\n- Above: "${taskAbove.title}"\n- Below: "${taskBelow.title}"`;
    } else if (taskBelow) {
        insertionContext = `Suggest a "preparatory" task to do BEFORE: "${taskBelow.title}" — ${taskBelow.description}`;
    } else if (taskAbove) {
        insertionContext = `Suggest a "follow-up" task to do AFTER: "${taskAbove.title}" — ${taskAbove.description}`;
    } else {
        return null;
    }

    const system = `You are an AI assistant generating a single in-context task suggestion.
${SUGGESTION_SCHEMA}
Output a single JSON object (not an array).`;

    const user = `${insertionContext}
Other tasks for the day: ${tasksForDay.map(t => t.title).join(', ')}

Generate ONE task that logically fits this position. reasoning must explain the logical connection in 2-4 words.`;

    try {
        return await generateJson<Suggestion>(system, user, 600, {
            feature: 'suggestions',
            qualityTier: 'low',
        });
    } catch (e) {
        return null;
    }
};

export const synthesizeAIInsights = async (userProfile: UserProfile, tasks: Task[]): Promise<AIInsight[]> => {
    const completedTasks = tasks.filter(t => t.completed_at).slice(-20);
    if (completedTasks.length < 5) return [];

    const system = `You are an AI analyzing user productivity patterns.
Output a JSON array of 1-2 insight objects: [{ insight: string, source: string, confidence: number }]
- insight: a short, non-obvious observation (not advice)
- source: e.g. "Task completion times"
- confidence: 0.0 to 1.0`;

    const user = `User Profile:
- Interests: ${userProfile.interests}
- Goals: ${userProfile.longTermGoals}
- Persona: ${userProfile.aiPersonaSummary?.persona}

Recently Completed Tasks:
${completedTasks.map(t => `- "${t.title}" (${t.category}, ${t.duration_min}min)`).join('\n')}

Existing Insights (avoid duplicates):
${userProfile.aiInsights.map(i => `- ${i.insight}`).join('\n')}

Find 1-2 novel, non-obvious insights. Observations only — no advice.`;

    const insights = await generateJson<any[]>(system, user, 600, {
        feature: 'insights',
        qualityTier: 'low',
    });
    return insights.map(i => ({ ...i, id: `insight-${uuidv4()}`, status: 'pending' }));
};

export const synthesizeUserProfileIntoPersona = async (userProfile: UserProfile, correctiveFeedback?: string): Promise<AIPersonaSummary | null> => {
    const system = `You are an AI synthesizing a user profile into a persona summary.
Output a single JSON object:
{
  persona: string (2-3 sentence summary),
  keyThemes: string[] (3-5 themes),
  suggestionStrategy: string[] (2-3 bullet points),
  clarificationQuestions: [{ category: string, question: string, exampleAnswer: string, options?: string[] }]
}`;

    const user = `User Profile:
- Interests: ${userProfile.interests}
- Dislikes: ${userProfile.dislikes}
- Long-term Goals: ${userProfile.longTermGoals}
- Daily Rhythm: ${userProfile.dailyRhythm}
- Accepted Insights: ${userProfile.aiInsights.filter(i => i.status === 'accepted').map(i => i.insight).join('; ')}
${correctiveFeedback ? `\nPrevious Attempt Feedback: "${correctiveFeedback}"` : ''}

Generate:
1. persona: who is this person, their motivations and style
2. keyThemes: 3-5 key topic tags
3. suggestionStrategy: 2-3 bullet points on how to best suggest tasks to them
4. clarificationQuestions: 3 open-ended questions (with category, question, exampleAnswer) that would help understand them better — don't repeat anything already in the profile`;

    try {
        const cacheIdentity = stableHash(`${profileFingerprint(userProfile)}|${correctiveFeedback || ''}`);
        const result = await generateJson<any>(system, user, 1000, {
            feature: 'persona',
            qualityTier: 'high',
            cache: { key: `persona_summary:${cacheIdentity}`, ttlMs: 1000 * 60 * 20 },
        });
        const questionsWithIds = result.clarificationQuestions.map((q: any) => ({ ...q, id: `q-${uuidv4()}` }));
        return { ...result, clarificationQuestions: questionsWithIds, lastUpdatedAt: new Date().toISOString() };
    } catch (e) {
        return null;
    }
};

export const getNewClarificationQuestion = async (
    userProfile: UserProfile,
    existingQuestions: { question: string }[],
    options?: { category?: string; excludedCategories?: string[] }
): Promise<Partial<ClarificationQuestion> | null> => {
    const system = `You are an AI generating a clarification question to better understand a user's preferences.
Output a single JSON object: { category: string, question: string, exampleAnswer: string, options: string[] }
options should be 3-4 short, clickable answer suggestions.`;

    const user = `User Profile:
- Interests: ${userProfile.interests}
- Dislikes: ${userProfile.dislikes}
- Goals: ${userProfile.longTermGoals}

Existing questions (do not repeat):
${existingQuestions.map(q => `- ${q.question}`).join('\n')}

Constraints:
${options?.category ? `- Must be in category: "${options.category}"` : ''}
${options?.excludedCategories ? `- Must NOT be in categories: ${options.excludedCategories.join(', ')}` : ''}

Generate one new, open-ended question with clickable options.`;

    try {
        return await generateJson<Partial<ClarificationQuestion>>(system, user, 400, {
            feature: 'clarification',
            qualityTier: 'low',
        });
    } catch (e) {
        return null;
    }
};

export const getNewQuestionOptions = async (
    userProfile: UserProfile,
    question: string,
    existingOptions: string[]
): Promise<string[] | null> => {
    const system = `You are an AI generating answer options for a user preference question.
Output a JSON array of 4 short string options (single words or short phrases).`;

    const user = `User Profile:
- Interests: ${userProfile.interests}
- Dislikes: ${userProfile.dislikes}

Question: "${question}"
Options to avoid: ${existingOptions.join(', ')}

Generate 4 new, diverse, clickable answer options.`;

    try {
        return await generateJson<string[]>(system, user, 200, {
            feature: 'clarification',
            qualityTier: 'low',
        });
    } catch (e) {
        return null;
    }
};

export const getAIRuntimeStats = (): AIRuntimeStats => ({ ...aiRuntimeStats });
export const getAIBudgetSnapshot = () => ({
    sessionRequestBudget,
    sessionRequestsConsumed,
    remaining: Math.max(0, sessionRequestBudget - sessionRequestsConsumed),
    queueDepth: queue.length,
    activeRequests,
});

export const getLastAIActionSnapshot = (): LastAIActionSnapshot => ({ ...lastAIActionSnapshot });

export const getClaudeCostEstimateSnapshot = () => {
    const estimatedInputUSD = (aiRuntimeStats.claudeInputTokens / 1_000_000) * claudeInputCostPerMTokUSD;
    const estimatedOutputUSD = (aiRuntimeStats.claudeOutputTokens / 1_000_000) * claudeOutputCostPerMTokUSD;
    const estimatedTotalUSD = estimatedInputUSD + estimatedOutputUSD;
    return {
        model: CLAUDE_MODEL,
        inputCostPerMTokUSD: claudeInputCostPerMTokUSD,
        outputCostPerMTokUSD: claudeOutputCostPerMTokUSD,
        estimatedInputUSD,
        estimatedOutputUSD,
        estimatedTotalUSD,
    };
};
