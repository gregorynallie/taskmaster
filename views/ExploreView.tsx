import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { SuggestedTaskCard } from '../components/SuggestedTaskCard';
import { Suggestion, SuggestionPill } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as claudeService from '../services/claudeService';
import { HeroWithInput } from '../components/HeroWithInput';
import { ScheduleSuggestionModal } from '../components/ScheduleSuggestionModal';

const EXPLORE_CACHE_PREFIX = 'taskmaster-explore-suggestions';
const EXPLORE_CACHE_TTL_MS = 15 * 60 * 1000;
const FETCH_DEBOUNCE_MS = 650;
const REQUEST_COOLDOWN_MS = 2500;

type ExploreFetchType = 'initial' | 'dynamic';

const normalizePrompt = (value: string): string => value.trim().toLowerCase().replace(/\s+/g, ' ');

const getProfileFingerprint = (profile: any): string =>
    JSON.stringify({
        personaId: profile.personaId || '',
        interests: profile.interests || '',
        longTermGoals: profile.longTermGoals || '',
        dailyRhythm: profile.dailyRhythm || '',
    });

const buildCacheKey = (fetchType: ExploreFetchType, prompt: string, profileFingerprint: string): string => (
    `${EXPLORE_CACHE_PREFIX}:${fetchType}:${prompt}:${profileFingerprint}`
);

export const ExploreView: React.FC = () => {
    const { createProjectFromSuggestion, acceptSuggestion, scheduleSuggestion, exploreSuggestionPills, isExplorePillsLoading } = useTasks();
    const { setCurrentView } = useSettings();
    const { userProfile } = useUserProfile();
    
    const [activePrompt, setActivePrompt] = useState('');
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [acceptedSuggestionId, setAcceptedSuggestionId] = useState<string | null>(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [schedulingSuggestion, setSchedulingSuggestion] = useState<Suggestion | null>(null);
    const [suggestionPool, setSuggestionPool] = useState<Suggestion[]>([]);

    const debounceTimerRef = useRef<number | null>(null);
    const requestCounterRef = useRef(0);
    const latestRequestRef = useRef(0);
    const inFlightRef = useRef<Map<string, Promise<Suggestion[]>>>(new Map());
    const lastRequestAtRef = useRef<Map<string, number>>(new Map());
    const profileFingerprint = useMemo(() => getProfileFingerprint(userProfile), [userProfile]);
    
    const readCachedSuggestions = useCallback((fetchType: ExploreFetchType, prompt: string): Suggestion[] | null => {
        const cacheKey = buildCacheKey(fetchType, prompt, profileFingerprint);
        try {
            const raw = localStorage.getItem(cacheKey);
            if (!raw) return null;
            const parsed = JSON.parse(raw);
            if (Date.now() - parsed.timestamp > EXPLORE_CACHE_TTL_MS) return null;
            if (!Array.isArray(parsed.suggestions)) return null;
            return parsed.suggestions;
        } catch (_) {
            return null;
        }
    }, [profileFingerprint]);

    const writeCachedSuggestions = useCallback((fetchType: ExploreFetchType, prompt: string, suggestionsToCache: Suggestion[]) => {
        const cacheKey = buildCacheKey(fetchType, prompt, profileFingerprint);
        try {
            localStorage.setItem(
                cacheKey,
                JSON.stringify({
                    timestamp: Date.now(),
                    suggestions: suggestionsToCache,
                }),
            );
        } catch (_) {
            // Cache best-effort only.
        }
    }, [profileFingerprint]);

    const fetchSuggestionsCore = useCallback(async (fetchType: ExploreFetchType, prompt: string): Promise<Suggestion[]> => {
        const normalizedPrompt = normalizePrompt(prompt);
        const requestKey = `${fetchType}:${normalizedPrompt}:${profileFingerprint}`;

        const cached = readCachedSuggestions(fetchType, normalizedPrompt);
        if (cached && cached.length > 0) return cached;

        const now = Date.now();
        const lastAt = lastRequestAtRef.current.get(requestKey) ?? 0;
        const inFlight = inFlightRef.current.get(requestKey);
        if (inFlight) return inFlight;
        if (now - lastAt < REQUEST_COOLDOWN_MS) return [];

        const requestPromise = (async () => {
            if (fetchType === 'dynamic') {
                const dynamic = await claudeService.getDynamicSuggestions({
                    prompt,
                    userProfile,
                    count: 6,
                });
                const withIds = dynamic.map(s => ({ ...s, id: uuidv4() }));
                writeCachedSuggestions(fetchType, normalizedPrompt, withIds);
                return withIds;
            }
            const initial = await claudeService.getInitialExploreSuggestions(userProfile);
            const withIds = initial.map(s => ({ ...s, id: uuidv4() }));
            writeCachedSuggestions(fetchType, normalizedPrompt, withIds);
            return withIds;
        })();

        inFlightRef.current.set(requestKey, requestPromise);
        lastRequestAtRef.current.set(requestKey, now);

        try {
            return await requestPromise;
        } finally {
            inFlightRef.current.delete(requestKey);
        }
    }, [profileFingerprint, readCachedSuggestions, userProfile, writeCachedSuggestions]);

    const runFetch = useCallback(async (fetchType: ExploreFetchType, prompt: string, immediate = false) => {
        if (debounceTimerRef.current) {
            window.clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        const execute = async () => {
            const requestId = ++requestCounterRef.current;
            latestRequestRef.current = requestId;
            setIsTransitioning(true);
            setIsLoading(true);
            setError(null);

            try {
                const fetched = await fetchSuggestionsCore(fetchType, prompt);
                if (latestRequestRef.current !== requestId) return; // stale response

                const nextSuggestions = fetched.slice(0, 4);
                const nextPool = fetched.slice(4);
                setSuggestions(nextSuggestions);
                setSuggestionPool(nextPool);
            } catch (e: any) {
                if (latestRequestRef.current !== requestId) return;
                setError(e.message || 'Failed to generate suggestions.');
                setSuggestions([]);
                setSuggestionPool([]);
            } finally {
                if (latestRequestRef.current === requestId) {
                    setIsLoading(false);
                    setIsTransitioning(false);
                }
            }
        };

        if (immediate) {
            void execute();
            return;
        }

        debounceTimerRef.current = window.setTimeout(() => {
            void execute();
        }, FETCH_DEBOUNCE_MS);
    }, [fetchSuggestionsCore]);

    // Fetch initial suggestions on mount or when core persona attributes change.
    useEffect(() => {
        void runFetch('initial', '', true);
        return () => {
            if (debounceTimerRef.current) {
                window.clearTimeout(debounceTimerRef.current);
            }
        };
    }, [runFetch, userProfile.personaId, userProfile.interests, userProfile.longTermGoals, userProfile.dailyRhythm]);

    const fetchSuggestions = useCallback((currentPrompt: string) => {
        const normalizedPrompt = currentPrompt.trim();
        if (!normalizedPrompt) return;
        setActivePrompt(normalizedPrompt);
        setAcceptedSuggestionId(null);
        void runFetch('dynamic', normalizedPrompt, false);
    }, [runFetch]);

    const handleFormSubmit = (prompt: string) => {
        fetchSuggestions(prompt);
    };

    const handlePillClick = (pill: SuggestionPill) => {
        fetchSuggestions(pill.label);
    };

    const fillFromPool = useCallback((index: number): boolean => {
        let replaced = false;
        setSuggestionPool(prevPool => {
            if (prevPool.length === 0) return prevPool;
            const [replacement, ...remaining] = prevPool;
            setSuggestions(prev => {
                if (!prev[index]) return prev;
                const next = [...prev];
                next[index] = replacement;
                return next;
            });
            replaced = true;
            return remaining;
        });
        return replaced;
    }, []);

    const handleAccept = useCallback((suggestionToAccept: Suggestion) => {
        setAcceptedSuggestionId(suggestionToAccept.id!);

        if (suggestionToAccept.isProjectStarter) {
            createProjectFromSuggestion(suggestionToAccept);
            setTimeout(() => {
                setCurrentView('quests');
            }, 1000);
        } else {
            acceptSuggestion(suggestionToAccept);
            setTimeout(() => {
                setAcceptedSuggestionId(null);
                setSuggestions(prev => prev.filter(s => s.id !== suggestionToAccept.id));
                if (!fillFromPool(0) && activePrompt) {
                    void runFetch('dynamic', activePrompt, true);
                }
            }, 500);
        }
    }, [acceptSuggestion, activePrompt, createProjectFromSuggestion, fillFromPool, runFetch, setCurrentView]);

    const handleSchedule = (suggestion: Suggestion | null, date: Date) => {
        if (!suggestion) return;
        setAcceptedSuggestionId(suggestion.id!);
        void scheduleSuggestion(suggestion, date);
        setSchedulingSuggestion(null);

        setTimeout(() => {
            setAcceptedSuggestionId(null);
            setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
            if (!fillFromPool(0) && activePrompt) {
                void runFetch('dynamic', activePrompt, true);
            }
        }, 500);
    };

    const handleShuffleSuggestion = useCallback((index: number) => {
        const replaced = fillFromPool(index);
        if (replaced) return;
        if (activePrompt) {
            void runFetch('dynamic', activePrompt, true);
            return;
        }
        void runFetch('initial', '', true);
    }, [activePrompt, fillFromPool, runFetch]);
    
    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <HeroWithInput
                title="Explore New Tasks"
                subtitle="Type an idea, goal, or simple task to get AI-powered suggestions."
                buttonText="Suggest"
                onSubmit={handleFormSubmit}
                isSubmitting={isLoading && !!activePrompt} // Only show 'Thinking' on user submit
                placeholderContext="explore"
            />

            {!activePrompt && (
                 <div className="mb-8">
                     <div className="flex flex-wrap gap-2 justify-center">
                         {isExplorePillsLoading ? (
                             Array.from({ length: 5 }).map((_, i) => (
                                 <div key={i} className="h-9 w-36 rounded-full bg-surface/50 animate-pulse"></div>
                             ))
                         ) : (
                             exploreSuggestionPills.map((pill, i) => (
                                 <button
                                     key={i}
                                     onClick={() => handlePillClick(pill)}
                                     className="theme-hover bg-surface hover:bg-primary/20 text-text-secondary font-semibold py-2 px-4 rounded-full transition-themed text-sm animate-themed-enter"
                                     style={{ animationDelay: `${i * 50}ms` }}
                                 >
                                     {pill.emoji} {pill.label}
                                 </button>
                             ))
                         )}
                     </div>
                 </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isLoading && suggestions.length === 0 && (
                    <div className="col-span-full p-8 rounded-themed flex items-center justify-center min-h-[240px] animate-themed-enter">
                        <p className="text-text-secondary animate-pulse text-lg font-semibold">Thinking...</p>
                    </div>
                )}

                {!isLoading && error && (
                    <div className="col-span-full p-8 rounded-themed border-2 border-dashed border-red-500/50 bg-red-900/20 text-center animate-themed-enter">
                        <p className="text-red-300 font-semibold">Oops! Something went wrong.</p>
                        <p className="text-red-400/80 mt-2">{error}</p>
                    </div>
                )}
                
                {suggestions.length > 0 && (
                    <div className={`col-span-full grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                        {suggestions.map((suggestion, index) => (
                            <SuggestedTaskCard 
                                key={suggestion.id}
                                suggestion={suggestion}
                                index={index}
                                onAccept={() => handleAccept(suggestion)}
                                onShuffle={() => handleShuffleSuggestion(index)}
                                acceptButtonText={acceptedSuggestionId === suggestion.id ? 'Done!' : 'Accept'}
                                isAcceptDisabled={!!acceptedSuggestionId && acceptedSuggestionId !== suggestion.id}
                                showScheduleButton={true}
                                onSchedule={() => setSchedulingSuggestion(suggestion)}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <ScheduleSuggestionModal
                isOpen={!!schedulingSuggestion}
                onClose={() => setSchedulingSuggestion(null)}
                onSchedule={(date) => handleSchedule(schedulingSuggestion, date)}
            />
        </div>
    );
};