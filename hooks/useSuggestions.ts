import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'firebase/auth';
import {
    Task,
    Quest,
    Suggestion,
    EnrichedTaskData,
    SuggestionFeedback,
    FeedbackReason,
    Mode,
    AIQualityMode,
    AnimationInfo,
} from '../types';
import * as claudeService from '../services/claudeService';

const CACHE_DURATION_MS = 10 * 60 * 1000;
const SUGGESTIONS_CACHE_KEY_PREFIX = 'taskmaster-suggestions-';

const genericSuggestions: Suggestion[] = [
    {
        id: 'generic-1',
        title: 'Organize your workspace',
        description: 'A clean desk can lead to a clear mind. Take 15 minutes to tidy up.',
        category: 'Productivity',
        duration_min: 15,
        xp_estimate: 20,
        reasoning: 'Start with a quick win to build momentum.',
        context_tag: 'Quick Win',
    },
    {
        id: 'generic-2',
        title: 'Go for a 10-minute walk',
        description: 'Step outside, get some fresh air, and stretch your legs. A great way to reset.',
        category: 'Health',
        duration_min: 10,
        xp_estimate: 15,
        reasoning: 'A short break can boost your energy and focus.',
        context_tag: 'Mental Reset',
    },
];

interface UseSuggestionsProps {
    user: User | null;
    tasks: Task[];
    quests: Quest[];
    userProfile: any;
    mode: Mode;
    aiQualityMode: AIQualityMode;
    addTask: (taskData: string | Task | EnrichedTaskData, date?: Date, animation?: AnimationInfo) => Promise<void>;
    playSound: (sound: string) => void;
}

export const useSuggestions = ({ user, tasks, quests, userProfile, mode, aiQualityMode, addTask, playSound }: UseSuggestionsProps) => {
    const [dailySuggestions, setDailySuggestions] = useState<Suggestion[]>([]);
    const [suggestionPool, setSuggestionPool] = useState<Suggestion[]>([]);
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(false);
    const [suggestionsError, setSuggestionsError] = useState<string | null>(null);
    const [suggestionFeedback, setSuggestionFeedback] = useState<SuggestionFeedback[]>([]);
    const [suggestionsLastFetched, setSuggestionsLastFetched] = useState<Date | null>(null);

    const fetchDailySuggestions = useCallback(async () => {
        if (!user) return;
        const now = new Date();
        if (suggestionsLastFetched && (now.getTime() - suggestionsLastFetched.getTime() < CACHE_DURATION_MS)) return;

        const cacheKey = `${SUGGESTIONS_CACHE_KEY_PREFIX}${user.uid}`;
        try {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                const { dailySuggestions: cachedDaily, suggestionPool: cachedPool, timestamp } = JSON.parse(cached);
                if (timestamp && now.getTime() - timestamp < CACHE_DURATION_MS && Array.isArray(cachedDaily) && Array.isArray(cachedPool)) {
                    setDailySuggestions(cachedDaily);
                    setSuggestionPool(cachedPool);
                    setSuggestionsLastFetched(new Date(timestamp));
                    return;
                }
            }
        } catch (_) {
            // Invalid or missing cache; fall through to fetch
        }

        setIsSuggestionsLoading(true);
        setSuggestionsError(null);
        try {
            const budget = tasks.length === 0 ? 0 : undefined;
            const suggestionCount = aiQualityMode === 'high_context' ? 10 : aiQualityMode === 'balanced' ? 8 : 6;
            const fetched = await claudeService.getSuggestions(
                { tasks, quests, mode, feedback: suggestionFeedback.slice(-5), categoryFocus: userProfile.categoryFocus, count: suggestionCount, userProfile },
                budget,
            );
            const withIds = fetched.map(s => ({ ...s, id: `sugg-${uuidv4()}` }));
            const daily = withIds.slice(0, 3);
            const pool = withIds.slice(3);
            setDailySuggestions(daily);
            setSuggestionPool(pool);
            setSuggestionsLastFetched(new Date());
            try {
                localStorage.setItem(cacheKey, JSON.stringify({
                    dailySuggestions: daily,
                    suggestionPool: pool,
                    timestamp: Date.now(),
                }));
            } catch (_) {
                // localStorage full or disabled
            }
        } catch (e: any) {
            setSuggestionsError(e.message || 'Failed to get suggestions.');
            setDailySuggestions(genericSuggestions.slice(0, 2));
            setSuggestionPool([]);
            setSuggestionsLastFetched(null);
        } finally {
            setIsSuggestionsLoading(false);
        }
    }, [user, tasks, quests, mode, aiQualityMode, userProfile, suggestionFeedback, suggestionsLastFetched]);

    const acceptSuggestion = useCallback((suggestion: Suggestion, indexToRemove?: number, animation?: AnimationInfo) => {
        const { reasoning, context_tag, isLoading, id, isProjectStarter, projectName, questNarrative, subtasks, parentTaskId, parentTaskTitle, ...taskData } = suggestion;
        addTask(taskData as EnrichedTaskData, new Date(), animation);

        if (indexToRemove === undefined) return;

        const [replacement, ...remaining] = suggestionPool;
        setDailySuggestions(prev => {
            const next = [...prev];
            if (replacement) {
                next[indexToRemove] = replacement;
            } else {
                next.splice(indexToRemove, 1);
            }
            return next;
        });
        setSuggestionPool(remaining);
    }, [addTask, suggestionPool]);

    const shuffleSingleSuggestion = useCallback(async (indexToReplace: number, feedbackReason?: FeedbackReason) => {
        playSound('shuffle');

        if (feedbackReason) {
            const dismissed = dailySuggestions[indexToReplace];
            if (dismissed) {
                setSuggestionFeedback(prev => [...prev, { suggestionTitle: dismissed.title, reason: feedbackReason }]);
            }
        }

        const [replacement, ...remaining] = suggestionPool;
        if (replacement) {
            setDailySuggestions(prev => {
                const next = [...prev];
                next[indexToReplace] = replacement;
                return next;
            });
            setSuggestionPool(remaining);
        }
    }, [playSound, dailySuggestions, suggestionPool]);

    const scheduleSuggestion = useCallback(async (suggestion: Suggestion, date: Date) => {
        const { reasoning, context_tag, isLoading, id, isProjectStarter, projectName, questNarrative, subtasks, ...taskData } = suggestion;
        await addTask(taskData as EnrichedTaskData, date);
    }, [addTask]);

    const createQuestFromSuggestions = useCallback(async () => {
        console.warn('createQuestFromSuggestions is not implemented');
    }, []);

    return {
        dailySuggestions,
        isSuggestionsLoading,
        suggestionsError,
        fetchDailySuggestions,
        acceptSuggestion,
        shuffleSingleSuggestion,
        scheduleSuggestion,
        createQuestFromSuggestions,
    };
};
