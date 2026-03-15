import React, { useState, useMemo, useEffect } from 'react';
import { Mode } from '../types';
import { OnboardingAnswers, OnboardingStep, PredefinedPersona } from '../src/types/onboardingTypes';
import { ONBOARDING_STEPS, PREDEFINED_PERSONAS } from '../src/onboardingContent';

// --- Sub-components for better organization ---

const ProgressBar: React.FC<{ current: number; total: number }> = ({ current, total }) => (
    <div className="w-full bg-surface/50 rounded-full h-2.5">
        <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${(current / total) * 100}%` }}
        ></div>
    </div>
);

const Step: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({ title, subtitle, children }) => (
    <div className="w-full text-center animate-themed-enter">
        <h2 className="text-3xl font-bold font-header text-text-primary">{title}</h2>
        {subtitle && <p className="text-text-secondary mt-2 mb-6">{subtitle}</p>}
        <div className="mt-8">{children}</div>
    </div>
);

const LoadingView: React.FC = () => {
    const messages = useMemo(() => [
        "Building some initial tasks...",
        "Making them unique to you...",
        "Be patient... (We only have to do this once)",
        "Almost ready...",
    ], []);
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 5000);
        
        // Progress bar animation
        const startTime = Date.now();
        const duration = 20000; // 20 seconds
        const progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = Math.min(100, (elapsedTime / duration) * 100);
            setProgress(newProgress);
            if (newProgress >= 100) {
                clearInterval(progressInterval);
            }
        }, 100);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, [messages]);

    return (
        <div className="fixed inset-0 bg-bkg z-50 flex flex-col items-center justify-center animate-themed-enter text-center p-4">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-accent/40 rounded-full animate-spin [animation-duration:3s]"></div>
                <div className="absolute inset-4 text-4xl flex items-center justify-center">✨</div>
            </div>
            <div className="relative h-8 w-full max-w-sm mb-4">
                 <p key={messageIndex} className="text-xl font-semibold text-text-primary absolute inset-0 animate-themed-enter">
                    {messages[messageIndex]}
                </p>
            </div>
            <div className="w-full max-w-sm bg-surface/50 rounded-full h-2.5">
                <div 
                    className="bg-primary h-2.5 rounded-full transition-all duration-100 linear" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}

const MultiSelectStep: React.FC<{
    stepContent: OnboardingStep;
    currentAnswers: string[];
    onSelect: (option: string) => void;
    onRemove: (option: string) => void;
    onNext: () => void;
}> = ({ stepContent, currentAnswers, onSelect, onRemove, onNext }) => {
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [customInput, setCustomInput] = useState('');

    const handleOptionClick = (option: string) => {
        if (option === 'Write my own...') {
            setShowCustomInput(prev => !prev);
            return;
        }
        if (currentAnswers.includes(option)) {
            onRemove(option);
        } else {
            onSelect(option);
        }
    };
    
    const handleAddCustom = () => {
        const value = customInput.trim();
        if (value && !currentAnswers.includes(value)) {
            onSelect(value);
        }
        setCustomInput('');
    };

    return (
        <>
            <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[3rem]">
                {currentAnswers.map(item => (
                    <div key={item} className="flex items-center gap-2 bg-primary/20 text-primary font-semibold py-1 px-3 rounded-full animate-themed-enter">
                        <span>{item}</span>
                        <button onClick={() => onRemove(item)} className="text-primary/70 hover:text-primary font-bold text-lg">&times;</button>
                    </div>
                ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
                {stepContent.options.map(option => {
                    const isSelected = currentAnswers.includes(option.value) || (option.value === 'Write my own...' && showCustomInput);
                    return (
                        <button key={option.value} onClick={() => handleOptionClick(option.value)}
                            className={`py-3 px-5 rounded-themed border-2 transition-all text-lg font-semibold ${isSelected ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary bg-surface'}`}>
                            {option.emoji} {option.label}
                        </button>
                    );
                })}
            </div>
            {showCustomInput && (
                <div className="mt-6 p-4 bg-surface/50 rounded-themed animate-themed-enter">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={customInput}
                            onChange={(e) => setCustomInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); } }}
                            placeholder={`Type a custom ${stepContent.id} and press Enter`}
                            className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary"
                            autoFocus
                        />
                        <button onClick={handleAddCustom} className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed">
                            Add
                        </button>
                    </div>
                </div>
            )}
            <button onClick={onNext} className="mt-8 bg-primary hover:bg-primary-focus text-white font-bold py-2 px-8 rounded-themed transition-themed">
                Next
            </button>
        </>
    );
};


// --- Main Onboarding Component ---

interface OnboardingProps {
  onComplete: (answers: OnboardingAnswers, mode: Mode) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0); // 0 = Welcome screen
    const [answers, setAnswers] = useState<OnboardingAnswers>({ priorities: [], interests: [], rhythm_habits: [] });
    const [customRhythm, setCustomRhythm] = useState('');
    const [finalNotes, setFinalNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const currentStepContent = ONBOARDING_STEPS[step - 1];

    const handleSelectOption = (questionId: string, option: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: option }));
        if (questionId === 'rhythm' && option === 'Write my own...') return;
        setStep(prev => prev + 1);
    };
    
    const handleMultiSelect = (questionId: string, option: string) => {
        setAnswers(prev => {
            const currentSelection = (prev[questionId] as string[] || []);
            return {
                ...prev,
                [questionId]: [...currentSelection, option]
            };
        });
    };
    
    const handleMultiRemove = (questionId: string, option: string) => {
        setAnswers(prev => {
            const currentSelection = (prev[questionId] as string[] || []);
            return {
                ...prev,
                [questionId]: currentSelection.filter(item => item !== option)
            };
        });
    };

    const handleSubmit = () => {
        setIsLoading(true);
        const finalAnswers: OnboardingAnswers = {
            ...answers,
            notes: finalNotes,
        };
        if(answers.rhythm === 'Write my own...') {
            finalAnswers.rhythm = customRhythm;
        }
        onComplete(finalAnswers, 'minimal');
    };

    const handleSelectPersona = (persona: PredefinedPersona) => {
        setIsLoading(true);
        // Use minimal mode by default, as mode selection is removed from this screen.
        onComplete({ persona: persona.id }, 'minimal');
    };

    if (isLoading) {
        return <LoadingView />;
    }

    if (step === 0) {
        return (
            <div className="fixed inset-0 bg-bkg bg-opacity-95 z-50 flex items-center justify-center animate-themed-enter p-4 overflow-y-auto">
                <div className="bg-surface p-8 rounded-themed shadow-themed max-w-2xl w-full text-center">
                    <h1 className="text-4xl font-bold text-text-primary mb-2 font-header">Let's Personalize Your Plan.</h1>
                    <p className="text-text-secondary mb-8">A great day starts with a clear plan. Answer a few questions to create a task list that’s uniquely yours.</p>
                    
                    <button onClick={() => setStep(1)} className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-12 rounded-themed transition-themed w-full text-lg mb-8">
                        Get Started
                    </button>

                    <div className="mt-4">
                        <p className="text-sm text-text-secondary mb-4">...Or, choose a template to start instantly.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PREDEFINED_PERSONAS.map(p => (
                                <button key={p.id} onClick={() => handleSelectPersona(p)} className="p-4 bg-secondary/30 hover:bg-secondary/50 rounded-themed transition-themed text-left h-full">
                                    <h5 className="font-bold font-header text-text-primary">{p.name}</h5>
                                    <p className="text-xs text-text-secondary">{p.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 bg-bkg z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl space-y-8">
                <ProgressBar current={step} total={ONBOARDING_STEPS.length + 1} />
                {currentStepContent ? (
                    <Step title={currentStepContent.question}>
                        {currentStepContent.isMultiSelect ? (
                            <MultiSelectStep
                                stepContent={currentStepContent}
                                currentAnswers={answers[currentStepContent.id] as string[] || []}
                                onSelect={(option) => handleMultiSelect(currentStepContent.id, option)}
                                onRemove={(option) => handleMultiRemove(currentStepContent.id, option)}
                                onNext={() => setStep(s => s + 1)}
                            />
                        ) : (
                            <div className="space-y-4">
                                {currentStepContent.options.map(option => (
                                    <button key={option.value} onClick={() => handleSelectOption(currentStepContent.id, option.value)}
                                        className={`w-full text-left p-4 rounded-themed border-2 transition-all text-lg ${answers[currentStepContent.id] === option.value ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary bg-surface'}`}>
                                        <span className="font-semibold">{option.emoji} {option.label}</span>
                                        <p className="text-sm text-text-secondary ml-8">{option.description}</p>
                                    </button>
                                ))}
                                {answers.rhythm === 'Write my own...' && (
                                    <div className="p-4 bg-surface/50 rounded-themed animate-themed-enter">
                                        <input
                                            type="text"
                                            value={customRhythm}
                                            onChange={(e) => setCustomRhythm(e.target.value)}
                                            placeholder="e.g., I'm a freelancer with a chaotic schedule"
                                            className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary"
                                        />
                                        <button onClick={() => setStep(s => s + 1)} disabled={!customRhythm} className="mt-4 bg-primary hover:bg-primary-focus text-white font-bold py-2 px-8 rounded-themed transition-themed disabled:bg-secondary">
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Step>
                ) : (
                    <Step title="Anything else I should know?">
                        <textarea
                            value={finalNotes}
                            onChange={(e) => setFinalNotes(e.target.value)}
                            rows={4}
                            className="w-full bg-surface border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary"
                            placeholder="Examples: 'I prefer workouts in the morning', 'Remind me to take a break around 3 PM', 'I hate phone calls, suggest texts instead'"
                        />
                        <button onClick={handleSubmit} className="mt-8 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-12 rounded-themed transition-themed text-lg">
                            Create My Plan!
                        </button>
                    </Step>
                )}
            </div>
        </div>
    );
};
