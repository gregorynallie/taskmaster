import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { SuggestedTaskCard } from '../components/SuggestedTaskCard';
import { Suggestion, SuggestionPill } from '../types';
import { v4 as uuidv4 } from 'uuid';
import * as geminiService from '../services/claudeService';
import { HeroWithInput } from '../components/HeroWithInput';
import { ScheduleSuggestionModal } from '../components/ScheduleSuggestionModal';

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
    
    // Fetch initial suggestions on mount or when core persona attributes change.
    useEffect(() => {
        let isMounted = true;
        const getInitialSuggestions = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const initialApiSuggestions = await geminiService.getInitialExploreSuggestions(userProfile);
                if (isMounted) {
                    const suggestionsWithIds = initialApiSuggestions.map(s => ({...s, id: uuidv4() }));
                    setSuggestions(suggestionsWithIds);
                }
            } catch (e: any) {
                if (isMounted) {
                    setError(e.message || "Failed to generate initial suggestions.");
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        getInitialSuggestions();
        
        return () => { isMounted = false; };
    }, [userProfile.personaId, userProfile.interests, userProfile.longTermGoals]);


    const fetchSuggestions = useCallback((currentPrompt: string) => {
        if (!currentPrompt.trim()) {
            setSuggestions([]);
            return;
        };
        setActivePrompt(currentPrompt);
        setAcceptedSuggestionId(null);
        
        setIsTransitioning(true); // Fade out current suggestions
        setTimeout(async () => {
            setIsLoading(true); // Show "Thinking..." loader
            setSuggestions([]); // Clear the list so only the loader shows
            try {
                const fetchedSuggestions = await geminiService.getDynamicSuggestions({
                    prompt: currentPrompt,
                    userProfile,
                    count: 4,
                });
                const suggestionsWithIds = fetchedSuggestions.map(s => ({ ...s, id: uuidv4() }));
                setSuggestions(suggestionsWithIds);
            } catch (e: any) {
                setError(e.message || "Failed to generate suggestions.");
                setSuggestions([]);
            } finally {
                setIsLoading(false); // Hide "Thinking..." loader
                setIsTransitioning(false); // Fade in new suggestions
            }
        }, 300); // This duration should match the CSS transition
    }, [userProfile]);

    const handleFormSubmit = (prompt: string) => {
        fetchSuggestions(prompt);
    };

    const handlePillClick = (pill: SuggestionPill) => {
        fetchSuggestions(pill.label);
    };

    const handleAccept = (suggestionToAccept: Suggestion) => {
        setAcceptedSuggestionId(suggestionToAccept.id!);

        if (suggestionToAccept.isProjectStarter) {
            createProjectFromSuggestion(suggestionToAccept);
            setTimeout(() => {
                setCurrentView('quests');
            }, 1000);
        } else {
            acceptSuggestion(suggestionToAccept);
             setTimeout(() => {
                setActivePrompt('');
                setAcceptedSuggestionId(null);
                // After accepting, re-fetch initial suggestions.
                const getInitialSuggestions = async () => {
                    const initialApiSuggestions = await geminiService.getInitialExploreSuggestions(userProfile);
                    const suggestionsWithIds = initialApiSuggestions.map(s => ({...s, id: uuidv4() }));
                    setIsTransitioning(true);
                    setTimeout(() => {
                        setSuggestions(suggestionsWithIds);
                        setIsTransitioning(false);
                    }, 300);
                };
                getInitialSuggestions();
            }, 1000);
        }
    };

    const handleSchedule = (suggestion: Suggestion | null, date: Date) => {
        if (!suggestion) return;
        setAcceptedSuggestionId(suggestion.id!);
        scheduleSuggestion(suggestion, date);
        setSchedulingSuggestion(null);

        setTimeout(() => {
            setActivePrompt('');
            setAcceptedSuggestionId(null);
             const getInitialSuggestions = async () => {
                const initialApiSuggestions = await geminiService.getInitialExploreSuggestions(userProfile);
                const suggestionsWithIds = initialApiSuggestions.map(s => ({...s, id: uuidv4() }));
                setIsTransitioning(true);
                setTimeout(() => {
                    setSuggestions(suggestionsWithIds);
                    setIsTransitioning(false);
                }, 300);
            };
            getInitialSuggestions();
        }, 1000);
    };
    
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
                                onShuffle={() => fetchSuggestions(activePrompt || 'something new')}
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