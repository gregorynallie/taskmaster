import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { useTasks } from '../contexts/TasksProvider';
import { AIInsight, Task, ClarificationQuestion, Persona } from '../types';
import { PREDEFINED_PERSONAS } from '../src/onboardingContent';

const PersonaStatusLoader = () => {
    return (
        <div className="space-y-6 skeleton-loader">
            <div>
                <div className="h-4 w-1/3 mb-2 skeleton-line"></div>
                <div className="h-5 w-full skeleton-line"></div>
                <div className="h-5 w-3/4 skeleton-line mt-2"></div>
            </div>
             <div>
                <div className="h-4 w-1/4 mb-2 skeleton-line"></div>
                <div className="flex flex-wrap gap-2 mt-1">
                    <div className="h-7 w-20 rounded-full skeleton-line"></div>
                    <div className="h-7 w-24 rounded-full skeleton-line"></div>
                    <div className="h-7 w-16 rounded-full skeleton-line"></div>
                </div>
            </div>
            <div>
                <div className="h-4 w-1/2 mb-2 skeleton-line"></div>
                <div className="h-5 w-full skeleton-line"></div>
                <div className="h-5 w-full skeleton-line mt-2"></div>
                <div className="h-5 w-5/6 skeleton-line mt-2"></div>
            </div>
        </div>
    );
};

const QuestionLoader = () => (
    <div className="space-y-2 skeleton-loader">
        <div className="h-4 w-1/3 mb-1 skeleton-line"></div>
        <div className="p-4 bg-secondary/30 rounded-lg space-y-2">
            <div className="h-5 w-4/5 skeleton-line"></div>
            <div className="flex gap-2">
                <div className="h-8 flex-1 rounded-md skeleton-line"></div>
                <div className="h-8 w-20 rounded-md skeleton-line"></div>
                <div className="h-8 w-20 rounded-md skeleton-line"></div>
            </div>
        </div>
    </div>
);

export const YouView: React.FC = () => {
    const { 
        userProfile, 
        updateUserProfile, 
        manageAIInsight, 
        generateAndSaveAIPersona,
        regenerateAIPersona,
        removeThemeFromProfile,
        answerClarificationQuestion,
        skipClarificationQuestion,
        shuffleClarificationQuestion,
        shuffleQuestionOptions,
        applyPredefinedPersona,
    } = useUserProfile();
    const { tasks } = useTasks();

    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileEdits, setProfileEdits] = useState({
        interests: userProfile.interests,
        dislikes: userProfile.dislikes,
        longTermGoals: userProfile.longTermGoals,
        dailyRhythm: userProfile.dailyRhythm || ''
    });
    const [feedbackInput, setFeedbackInput] = useState('');
    const [clarificationAnswers, setClarificationAnswers] = useState<Record<string, string>>({});
    const [isPersonaSelectorOpen, setIsPersonaSelectorOpen] = useState(false);
    const personaSelectorRef = useRef<HTMLDivElement>(null);

    const personaSummary = userProfile.aiPersonaSummary;
    const personaStatus = personaSummary?.status ?? 'stale';

    const personaName = useMemo(() => {
        const currentPersona = PREDEFINED_PERSONAS.find(p => 
            p.interests === userProfile.interests &&
            p.dislikes === userProfile.dislikes &&
            p.longTermGoals === userProfile.longTermGoals &&
            p.dailyRhythm === userProfile.dailyRhythm
        );
        return currentPersona ? currentPersona.name : 'Custom Persona';
    }, [userProfile.interests, userProfile.dislikes, userProfile.longTermGoals, userProfile.dailyRhythm]);

    useEffect(() => {
        setProfileEdits({
            interests: userProfile.interests,
            dislikes: userProfile.dislikes,
            longTermGoals: userProfile.longTermGoals,
            dailyRhythm: userProfile.dailyRhythm || ''
        });
    }, [userProfile.interests, userProfile.dislikes, userProfile.longTermGoals, userProfile.dailyRhythm]);

    useEffect(() => {
        // If the persona is stale and we are not editing, trigger a regeneration.
        if (personaStatus === 'stale' && !isEditingProfile) {
            generateAndSaveAIPersona();
        }
    }, [personaStatus, isEditingProfile, generateAndSaveAIPersona]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (personaSelectorRef.current && !personaSelectorRef.current.contains(event.target as Node)) {
                setIsPersonaSelectorOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const handleProfileSave = () => {
        updateUserProfile(profileEdits);
        setIsEditingProfile(false);
        // The persona will become stale and regenerate automatically via useEffect.
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setClarificationAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleAnswerSubmit = (questionId: string) => {
        const answer = clarificationAnswers[questionId];
        if (answer && answer.trim()) {
            answerClarificationQuestion(questionId, answer);
            setClarificationAnswers(prev => {
                const newAnswers = { ...prev };
                delete newAnswers[questionId];
                return newAnswers;
            });
        }
    };
    
    const handleRegenerateWithFeedback = (e: React.FormEvent) => {
        e.preventDefault();
        if(feedbackInput.trim()){
            regenerateAIPersona(feedbackInput);
            setFeedbackInput('');
        }
    };

    const handleSelectPersona = (persona: Persona) => {
        applyPredefinedPersona(persona);
        setIsPersonaSelectorOpen(false);
    };

    const pendingInsights = userProfile.aiInsights.filter(i => i.status === 'pending');
    const clarificationQuestions = personaSummary?.clarificationQuestions ?? [];

    return (
        <div className="max-w-4xl mx-auto animate-themed-enter">
            <div className="bg-surface p-6 rounded-themed shadow-themed mb-8">
                <h2 className="text-3xl font-bold mb-2 text-center text-text-primary font-header">Your Persona</h2>
                <p className="text-center text-text-secondary">This is how the AI sees you. Edit your profile to refine its understanding and get better suggestions.</p>
            </div>
            <div className="space-y-8">
                {/* User Profile Section */}
                <section className="bg-surface p-6 rounded-themed shadow-themed">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-text-primary font-header">{personaName}</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative" ref={personaSelectorRef}>
                                <button 
                                    onClick={() => setIsPersonaSelectorOpen(prev => !prev)}
                                    className="bg-secondary hover:bg-opacity-80 text-text-on-secondary-bkg font-bold py-2 px-4 rounded-themed transition-themed"
                                >
                                    Select Persona
                                </button>
                                {isPersonaSelectorOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-secondary rounded-themed shadow-lg z-10 animate-themed-enter">
                                        {PREDEFINED_PERSONAS.map(persona => (
                                            <button
                                                key={persona.id}
                                                onClick={() => handleSelectPersona(persona)}
                                                className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-primary/20 transition-colors"
                                            >
                                                {persona.name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={() => {
                                    if (isEditingProfile) handleProfileSave();
                                    else setIsEditingProfile(true);
                                }}
                                className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-themed transition-themed"
                            >
                                {isEditingProfile ? 'Save Profile' : 'Edit Profile'}
                            </button>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-text-secondary">Interests</label>
                            {isEditingProfile ? (
                                <textarea value={profileEdits.interests} onChange={(e) => setProfileEdits(p => ({...p, interests: e.target.value}))} className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-text-primary mt-1" rows={3}></textarea>
                            ) : (
                                <p className="text-text-primary whitespace-pre-wrap">{userProfile.interests}</p>
                            )}
                        </div>
                         <div>
                            <label className="text-sm font-semibold text-text-secondary">Dislikes</label>
                            {isEditingProfile ? (
                                 <textarea value={profileEdits.dislikes} onChange={(e) => setProfileEdits(p => ({...p, dislikes: e.target.value}))} className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-text-primary mt-1" rows={2}></textarea>
                            ) : (
                                <p className="text-text-primary whitespace-pre-wrap">{userProfile.dislikes || 'Not specified'}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-secondary">Long-Term Goals</label>
                            {isEditingProfile ? (
                                <textarea value={profileEdits.longTermGoals} onChange={(e) => setProfileEdits(p => ({...p, longTermGoals: e.target.value}))} className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-text-primary mt-1" rows={3}></textarea>
                            ) : (
                                <p className="text-text-primary whitespace-pre-wrap">{userProfile.longTermGoals}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-text-secondary">My Daily Rhythm</label>
                            {isEditingProfile ? (
                                <textarea 
                                    value={profileEdits.dailyRhythm} 
                                    onChange={(e) => setProfileEdits(p => ({...p, dailyRhythm: e.target.value}))} 
                                    className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-text-primary mt-1" 
                                    rows={3}
                                    placeholder="e.g., Early riser, quick workout then coffee. Work 9-5. Unwind with games in the evening."
                                ></textarea>
                            ) : (
                                <p className="text-text-primary whitespace-pre-wrap">{userProfile.dailyRhythm || 'Not specified'}</p>
                            )}
                        </div>
                    </div>
                </section>
                
                {/* AI Persona Section */}
                <section className="bg-surface p-6 rounded-themed shadow-themed">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-text-primary font-header">Persona Summary</h2>
                        <button 
                            onClick={() => generateAndSaveAIPersona()}
                            className="bg-accent/20 text-accent font-bold py-2 px-4 rounded-themed transition-themed flex items-center gap-2"
                            disabled={personaStatus === 'updating'}
                        >
                             <span className={personaStatus === 'updating' ? 'animate-spin' : ''}>⟳</span> Refresh
                        </button>
                    </div>
                    {personaStatus === 'updating' || !personaSummary ? (
                        <PersonaStatusLoader />
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm font-semibold text-text-secondary">Persona</p>
                                <p className="text-text-primary whitespace-pre-wrap">{personaSummary.persona}</p>
                            </div>
                             <div>
                                <p className="text-sm font-semibold text-text-secondary">Key Themes</p>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {(personaSummary.keyThemes || []).map(theme => (
                                        <div key={theme} className="group relative bg-secondary/50 text-text-primary text-sm font-semibold px-3 py-1.5 rounded-full flex items-center gap-2">
                                            <span>{theme}</span>
                                            <button 
                                                onClick={() => removeThemeFromProfile(theme)}
                                                className="absolute inset-0 bg-red-500/80 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label={`Remove theme: ${theme}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-secondary">Suggestion Strategy</p>
                                <ul className="list-disc list-inside text-text-primary space-y-1">
                                    {(personaSummary.suggestionStrategy || []).map((s, i) => <li key={i}>{s}</li>)}
                                </ul>
                            </div>
                            <div>
                                 <p className="text-sm font-semibold text-text-secondary mt-4">Not quite right?</p>
                                 <form onSubmit={handleRegenerateWithFeedback} className="flex gap-2 items-center mt-1">
                                    <input 
                                        type="text" 
                                        value={feedbackInput}
                                        onChange={e => setFeedbackInput(e.target.value)}
                                        placeholder="e.g., 'I'm more of a morning person...'"
                                        className="flex-1 bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-text-primary placeholder:text-text-secondary"
                                    />
                                    <button type="submit" className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-themed transition-themed">Regenerate</button>
                                 </form>
                            </div>
                        </div>
                    )}
                </section>

                {/* Clarification Questions Section */}
                {(personaStatus === 'updating' || clarificationQuestions.length > 0) && (
                    <section className="bg-surface p-6 rounded-themed shadow-themed">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-text-primary font-header">Calibrate Suggestions</h2>
                            <button 
                                onClick={() => generateAndSaveAIPersona()}
                                className="bg-accent/20 text-accent font-bold py-2 px-4 rounded-themed transition-themed flex items-center gap-2"
                                disabled={personaStatus === 'updating'}
                            >
                                <span className={personaStatus === 'updating' ? 'animate-spin' : ''}>⟳</span> Refresh
                            </button>
                        </div>
                        <div className="space-y-6">
                            {personaStatus === 'updating' ? (
                                <>
                                    <QuestionLoader />
                                    <QuestionLoader />
                                    <QuestionLoader />
                                </>
                            ) : (
                                clarificationQuestions.map(q => {
                                    if (q.isLoading) {
                                        return <QuestionLoader key={q.id} />;
                                    }
                                    return (
                                        <div key={q.id}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-sm font-semibold text-text-secondary font-header uppercase tracking-wider">{q.category}</h3>
                                                <button 
                                                    onClick={() => shuffleClarificationQuestion(q.id)}
                                                    className="text-xs font-semibold py-1 px-2 rounded-themed hover:bg-secondary/50 flex items-center gap-1 text-accent"
                                                    title="Shuffle for a new category and question"
                                                >
                                                    <span className="text-base">⟳</span> Shuffle Category
                                                </button>
                                            </div>
                                            <div className="p-4 bg-secondary/30 rounded-lg">
                                                <p className="text-text-primary mb-2">{q.question}</p>
                                                
                                                {q.isShufflingOptions ? (
                                                    <div className="flex flex-wrap gap-2 mb-2 skeleton-loader">
                                                        <div className="h-8 w-24 rounded-themed skeleton-line"></div>
                                                        <div className="h-8 w-28 rounded-themed skeleton-line"></div>
                                                        <div className="h-8 w-20 rounded-themed skeleton-line"></div>
                                                        <div className="h-8 w-32 rounded-themed skeleton-line"></div>
                                                    </div>
                                                ) : (
                                                    q.options && q.options.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mb-2">
                                                            {q.options.map(option => (
                                                                <button 
                                                                    key={option} 
                                                                    onClick={() => answerClarificationQuestion(q.id, option)}
                                                                    className="text-sm font-semibold bg-secondary hover:bg-primary/50 text-text-primary py-1.5 px-3 rounded-themed transition-themed"
                                                                >
                                                                    {option}
                                                                </button>
                                                            ))}
                                                            <button 
                                                                onClick={() => shuffleQuestionOptions(q.id)}
                                                                className="text-sm font-semibold hover:bg-primary/50 text-text-primary py-1.5 px-3 rounded-themed transition-themed flex items-center gap-1.5"
                                                            >
                                                                <span className="text-base">⟳</span>
                                                                Shuffle options
                                                            </button>
                                                        </div>
                                                    )
                                                )}

                                                <div className="flex gap-2 items-center">
                                                    <input 
                                                        type="text" 
                                                        value={clarificationAnswers[q.id] || ''}
                                                        onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleAnswerSubmit(q.id)}
                                                        placeholder={q.exampleAnswer || 'Type your answer...'}
                                                        className="flex-1 bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-text-primary placeholder:text-text-secondary"
                                                    />
                                                    <button onClick={() => handleAnswerSubmit(q.id)} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-themed transition-themed">Send</button>
                                                    <button onClick={() => skipClarificationQuestion(q.id)} className="text-sm font-semibold py-2 px-4 rounded-themed hover:bg-secondary/50">Skip</button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </section>
                )}
                
                {/* Insights Section */}
                {pendingInsights.length > 0 && (
                     <section className="bg-surface p-6 rounded-themed shadow-themed">
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-header">New Insights from the AI</h2>
                        {pendingInsights.length > 0 ? (
                            <div className="space-y-4">
                                {pendingInsights.map(insight => (
                                    <div key={insight.id} className="bg-secondary/30 p-4 rounded-lg flex justify-between items-center gap-4">
                                        <p className="text-text-primary italic flex-1">"{insight.insight}"</p>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <button 
                                                onClick={() => manageAIInsight(insight.id, 'accepted')} 
                                                className="text-sm font-semibold bg-green-600/50 hover:bg-green-600/80 text-green-100 py-1.5 px-4 rounded-themed transition-themed"
                                                aria-label="Accept insight"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => manageAIInsight(insight.id, 'dismissed')} 
                                                className="text-sm font-semibold bg-secondary hover:bg-secondary/80 text-text-secondary py-1.5 px-4 rounded-themed transition-themed"
                                                aria-label="Dismiss insight"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-text-secondary">No new insights right now. As you complete more tasks, I'll learn more about you!</p>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
};