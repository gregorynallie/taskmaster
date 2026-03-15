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
import { Mode, SuggestionPill, TimeOfDay } from '../src/types/uiTypes';
import { Placeholder } from '../src/types/contextTypes';
import { TASK_CATEGORIES } from "../constants";
import { v4 as uuidv4 } from 'uuid';

const CLAUDE_MODEL = 'claude-sonnet-4-6';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

// ---------------------------------------------------------------------------
// Core API helper
// ---------------------------------------------------------------------------

const callClaude = async (systemPrompt: string, userPrompt: string, maxTokens = 1000): Promise<string> => {
    const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY ?? '',
            'anthropic-version': '2023-06-01',
            'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
            model: CLAUDE_MODEL,
            max_tokens: maxTokens,
            system: systemPrompt,
            messages: [{ role: 'user', content: userPrompt }],
        }),
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`Anthropic API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    const text = data.content
        .filter((block: any) => block.type === 'text')
        .map((block: any) => block.text)
        .join('');

    return text;
};

const generateJson = async <T>(systemPrompt: string, userPrompt: string, maxTokens = 1000): Promise<T> => {
    const fullSystem = `${systemPrompt}\n\nCRITICAL: Your response must be valid JSON only. No markdown fences, no preamble, no explanation — just raw JSON.`;
    const raw = await callClaude(fullSystem, userPrompt, maxTokens);
    const clean = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
        return JSON.parse(clean) as T;
    } catch (e) {
        console.error('JSON parse failed. Raw response:', raw);
        throw new Error('Failed to parse JSON from Claude response');
    }
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
- reasoning: string — 2-4 word punchy subtext explaining why suggested
- context_tag: string — brief tag like "Based on your goal to learn piano"
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
        const result = await generateJson<EnrichedTaskData[]>(system, user, 4096);
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
        const result = await generateJson<any>(system, user, 3000);
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
    const system = `You are an AI assistant for a task management app generating "explore" suggestions.
${SUGGESTION_SCHEMA}
Output a JSON array of exactly 4 suggestion objects.`;

    const user = `User Profile:
- Persona: ${userProfile.aiPersonaSummary?.persona}
- Interests: ${userProfile.interests}
- Long-term Goals: ${userProfile.longTermGoals}

Generate 4 diverse, actionable suggestions from different categories (e.g. Health, Personal Growth, Fun).
Descriptions must be immediately useful — provide actual content, steps, or links. Max 40 words per description.
reasoning must be 2-4 words only.`;

    try {
        const result = await generateJson<Suggestion[]>(system, user, 4096);
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
3. Descriptions must be immediately useful (max 40 words, markdown links OK).
4. reasoning must be 2-4 words.
5. Subtask scheduled_at values should be spread: first around ${futureDate1.toISOString()}, next around ${futureDate2.toISOString()}.
6. Apply all filters strictly.`;

    try {
        const result = await generateJson<Suggestion[]>(system, user, 4096);
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
        const result = await generateJson<{ subtext: string }>(system, user, 200);
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
        return await generateJson<Suggestion>(system, user, 600);
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
        const result = await generateJson<EnrichedTaskData[]>(system, user, 3000);
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
3. tasks: 3-7 actionable tasks, the first step schedulable for today
4. Spread scheduled_at: start today, then around ${futureDate1.toISOString()}, then ${futureDate2.toISOString()}
5. Each description must provide actual useful content — steps, tips, or resource links. No vague descriptions.`;

    return await generateJson<{ name: string; narrative: string; tasks: EnrichedTaskData[] }>(system, user, 4096);
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
- Active Tasks: ${tasks.filter(t => !t.completed_at).map(t => t.title).join(', ')}
- Active Quests: ${quests.filter(q => q.status === 'in_progress').map(q => q.name).join(', ')}
- Recent rejected suggestions: ${feedback.map(f => `"${f.suggestionTitle}" (reason: ${f.reason})`).join('; ')}
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
6. reasoning must be 2-4 words. context_tag must be brief.`;

    try {
        const result = await generateJson<Suggestion[]>(system, user, 4096);
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
        return await generateJson<Suggestion>(system, user, 600);
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

    const insights = await generateJson<any[]>(system, user, 600);
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
        const result = await generateJson<any>(system, user, 1000);
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
        return await generateJson<Partial<ClarificationQuestion>>(system, user, 400);
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
        return await generateJson<string[]>(system, user, 200);
    } catch (e) {
        return null;
    }
};
