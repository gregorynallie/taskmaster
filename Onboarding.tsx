import React, { useState, useMemo, useEffect } from 'react';
import { Mode } from './types';
import { OnboardingAnswers, OnboardingStep, PredefinedPersona } from './src/types/onboardingTypes';
import { ONBOARDING_STEPS, PREDEFINED_PERSONAS } from './src/onboardingContent';

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
        "Building your starter tasks...",
        "Analyzing your chosen path...",
        "Uncovering hidden tasks...",
        "Let's get this adventure started!",
    ], []);
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prev => (prev + 1) % messages.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [messages]);

    return (
        <div className="fixed inset-0 bg-bkg z-50 flex flex-col items-center justify-center animate-themed-enter text-center p-4">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-accent/40 rounded-full animate-spin [animation-duration:3s]"></div>
                <div className="absolute inset-4 text-4xl flex items-center justify-center">✨</div>
            </div>
            <div className="relative h-8 w-full max-w-sm">
                 <p key={messageIndex} className="text-xl font-semibold text-text-primary absolute inset-0 animate-themed-enter">
                    {messages[messageIndex]}
                </p>
            </div>
        </div>
    );
}


// --- Main Onboarding Component ---

interface OnboardingProps {
  onComplete: (answers: OnboardingAnswers, mode: Mode) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0); // 0 = Welcome screen
    const [answers, setAnswers] = useState<OnboardingAnswers>({});
    const [customRhythm, setCustomRhythm] = useState('');
    const [finalNotes, setFinalNotes] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMode, setSelectedMode] = useState<Mode>('minimal');

    const currentStepContent = ONBOARDING_STEPS[step - 1];

    const handleSelectOption = (questionId: string, option: string, isMultiSelect = false) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };
            if (isMultiSelect) {
                const currentSelection = (newAnswers[questionId] as string[] || []);
                const isSelected = currentSelection.includes(option);
                if (isSelected) {
                    newAnswers[questionId] = currentSelection.filter(item => item !== option);
                } else if (currentSelection.length < 2) { // Limit to 2 selections
                    newAnswers[questionId] = [...currentSelection, option];
                }
            } else {
                newAnswers[questionId] = option;
            }
            return newAnswers;
        });
        if (!isMultiSelect) {
            if (questionId === 'rhythm' && option === 'Write my own...') return;
            setStep(prev => prev + 1);
        }
    };

    const finalStepPrompt = useMemo(() => {
        let prompt = "I'm looking to improve my daily habits.";
        if (answers.rhythm) {
            prompt += ` I'm a ${answers.rhythm?.toLowerCase()}.`;
        }
        if (answers.priorities && Array.isArray(answers.priorities) && answers.priorities.length > 0) {
            prompt += ` My main focus right now is on ${answers.priorities.join(' and ').toLowerCase()}.`;
        }
        if (answers.interests && Array.isArray(answers.interests) && answers.interests.length > 0) {
            prompt += ` I enjoy activities like ${answers.interests.join(', ').toLowerCase()}.`;
        }
        return prompt;
    }, [answers]);

    useEffect(() => {
        if (step === ONBOARDING_STEPS.length + 1) {
            setFinalNotes(finalStepPrompt);
        }
    }, [step, finalStepPrompt]);
    
    const handleSubmit = () => {
        setIsLoading(true);
        const finalAnswers: OnboardingAnswers = {
            ...answers,
            notes: finalNotes,
        };
        if(answers.rhythm === 'Write my own...') {
            finalAnswers.rhythm = customRhythm;
        }
        onComplete(finalAnswers, selectedMode);
    };

    const handleSelectPersona = (persona: PredefinedPersona) => {
        setIsLoading(true);
        onComplete({ persona: persona.id }, selectedMode);
    };

    if (isLoading) {
        return <LoadingView />;
    }

    if (step === 0) {
        return (
            <div className="fixed inset-0 bg-bkg bg-opacity-95 z-50 flex items-center justify-center animate-themed-enter">
                <div className="bg-surface p-8 rounded-themed shadow-themed max-w-2xl w-full text-center">
                    <h1 className="text-4xl font-bold text-text-primary mb-2 font-header">Let's Build Your Legend.</h1>
                    <p className="text-text-secondary mb-6">A great plan starts with a clear path. Answer a few questions to build a task list that’s uniquely yours.</p>
                    <div className="flex gap-4 mb-8">
                        <button onClick={() => setSelectedMode('minimal')} className={`flex-1 p-4 rounded-themed border-2 transition-all ${selectedMode === 'minimal' ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary'}`}>
                            <h4 className="font-bold text-text-primary font-header">Minimal Mode</h4>
                            <p className="text-sm text-text-secondary">A clean, professional interface.</p>
                        </button>
                        <button onClick={() => setSelectedMode('rpg')} className={`flex-1 p-4 rounded-themed border-2 transition-all ${selectedMode === 'rpg' ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary'}`}>
                            <h4 className="font-bold text-text-primary font-header">Gamified Mode</h4>
                            <p className="text-sm text-text-secondary">A gamified, fantasy-themed task system.</p>
                        </button>
                    </div>

                    <button onClick={() => setStep(1)} className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-12 rounded-themed transition-themed w-full text-lg">
                        Start My Plan
                    </button>
                    <div className="mt-8">
                        <p className="text-sm text-text-secondary mb-4">...Or choose a prebuilt path to start instantly.</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {PREDEFINED_PERSONAS.map(p => (
                                <button key={p.id} onClick={() => handleSelectPersona(p)} className="p-4 bg-secondary/30 hover:bg-secondary/50 rounded-themed transition-themed text-left">
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
        <div className="fixed inset-0 bg-bkg z-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-8">
                <ProgressBar current={step} total={ONBOARDING_STEPS.length + 1} />
                {currentStepContent ? (
                    <Step title={currentStepContent.question}>
                        {currentStepContent.isMultiSelect ? (
                            <>
                                <div className="flex flex-wrap justify-center gap-3">
                                    {currentStepContent.options.map(option => {
                                        const isSelected = (answers[currentStepContent.id] as string[] || []).includes(option.value);
                                        return (
                                            <button key={option.value} onClick={() => handleSelectOption(currentStepContent.id, option.value, true)}
                                                className={`py-3 px-5 rounded-themed border-2 transition-all text-lg font-semibold ${isSelected ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary bg-surface'}`}>
                                                {option.emoji} {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setStep(s => s + 1)} className="mt-8 bg-primary hover:bg-primary-focus text-white font-bold py-2 px-8 rounded-themed transition-themed">
                                    Next
                                </button>
                            </>
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
                            placeholder="e.g., I want to read more non-fiction, but I hate cleaning the kitchen."
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