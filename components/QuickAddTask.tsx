import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { getAnimationVariant } from '../utils/animationUtils';
import { AddTaskAnimationVariant } from '../src/animations';
import { useDynamicPlaceholders } from '../hooks/useDynamicPlaceholders';

interface QuickAddTaskProps {
    selectedDate: Date;
}

export const QuickAddTask: React.FC<QuickAddTaskProps> = React.memo(({ selectedDate }) => {
    const { addTask } = useTasks();
    const { mode, theme, enrichTasksOnCreation } = useSettings();
    const [inputValue, setInputValue] = useState('');
    
    // State for the submission animation flow
    const [uiState, setUiState] = useState<'idle' | 'loading' | 'confirming' | 'exiting'>('idle');
    const [formKey, setFormKey] = useState(0);

    const { currentPlaceholder, isFading, inputRef } = useDynamicPlaceholders('task');
    const addTaskAnimationVariant = useMemo(() => getAnimationVariant<AddTaskAnimationVariant>(theme, 'addTask'), [theme]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (inputRef.current) {
            inputRef.current.value = value;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const originalInput = inputValue.trim();
        if (!originalInput || uiState !== 'idle') return;

        setUiState('loading');
        await addTask(originalInput, selectedDate, { type: 'add' });
        
        setInputValue('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
        setUiState('confirming');
    };

    useEffect(() => {
        let timer1: number, timer2: number;
        if (uiState === 'confirming') {
            timer1 = window.setTimeout(() => setUiState('exiting'), 1200);
        } else if (uiState === 'exiting') {
            timer2 = window.setTimeout(() => {
                setUiState('idle');
                setFormKey(k => k + 1);
            }, 500); 
        }
        return () => { clearTimeout(timer1); clearTimeout(timer2); };
    }, [uiState]);

    const animationClasses = addTaskAnimationVariant.classes;
    const currentConfirmClass = uiState === 'confirming' ? animationClasses.confirmEnter : animationClasses.confirmExit;

    const buttonText = mode === 'rpg' ? 'Add Quest' : 'Add Task';
    const creativeCopy = "Consider it done.";
    const loadingLabel = enrichTasksOnCreation ? 'Enriching...' : 'Adding...';

    if (uiState === 'loading') {
        return (
             <div className="relative min-h-[116px]">
                <div className="absolute inset-0 bg-surface rounded-themed shadow-themed p-4 flex items-center justify-center gap-3 h-[116px] animate-themed-enter">
                    <div className="w-6 h-6 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                    <span className="text-lg font-semibold text-text-secondary animate-pulse">{loadingLabel}</span>
                </div>
            </div>
        );
    }

    if (uiState === 'confirming' || uiState === 'exiting') {
        return (
            <div className="relative min-h-[116px]">
                <div 
                    className={`absolute inset-0 bg-surface rounded-themed shadow-themed p-4 ${currentConfirmClass}`}
                >
                    <div className="flex items-center justify-center gap-3 h-[88px]">
                        <span className="text-3xl">✔️</span>
                        <span className="text-xl font-bold text-text-primary">{creativeCopy}</span>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="relative min-h-[116px]">
             <div key={formKey} className={`absolute inset-0 ${animationClasses.formEnter}`}>
                <form onSubmit={handleSubmit}>
                    <div className="flex items-stretch gap-3">
                         <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder={currentPlaceholder.question}
                            className={`w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary placeholder:text-text-secondary transition-themed placeholder:transition-opacity placeholder:duration-500 placeholder:ease-in-out ${isFading ? 'placeholder:opacity-0' : 'placeholder:opacity-100'}`}
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim()}
                            className="theme-hover bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed disabled:bg-secondary disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {buttonText}
                        </button>
                    </div>
                     <div className="min-h-[40px] pt-2 pl-1">
                        <>
                            <p className={`text-sm text-text-secondary transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                                {currentPlaceholder.example}
                            </p>
                            <p className={`text-xs text-text-secondary mt-1 transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                                {currentPlaceholder.subtext}
                            </p>
                        </>
                    </div>
                </form>
             </div>
        </div>
    );
});