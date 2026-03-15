import React, { useState } from 'react';
import { useDynamicPlaceholders } from '../hooks/useDynamicPlaceholders';

interface HeroWithInputProps {
    title: string;
    subtitle: string;
    buttonText: string;
    onSubmit: (value: string) => void;
    isSubmitting?: boolean;
    children?: React.ReactNode;
    placeholderContext: 'task' | 'project' | 'explore';
}

export const HeroWithInput: React.FC<HeroWithInputProps> = ({ title, subtitle, buttonText, onSubmit, isSubmitting = false, children, placeholderContext }) => {
    const [inputValue, setInputValue] = useState('');
    const { currentPlaceholder, isFading, inputRef } = useDynamicPlaceholders(placeholderContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedValue = inputValue.trim();
        if (!trimmedValue || isSubmitting) return;
        onSubmit(trimmedValue);
        setInputValue('');
        if(inputRef.current) inputRef.current.value = '';
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if(inputRef.current) inputRef.current.value = e.target.value;
    };
    
    return (
        <div className="bg-surface p-6 rounded-themed shadow-themed mb-8">
            <h2 className="text-3xl font-bold mb-2 text-center text-text-primary font-header">{title}</h2>
            <p className="text-center text-text-secondary mb-6">{subtitle}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={currentPlaceholder.question}
                        className={`w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-lg text-text-primary placeholder:text-text-secondary transition-themed placeholder:transition-opacity placeholder:duration-500 placeholder:ease-in-out ${isFading ? 'placeholder:opacity-0' : 'placeholder:opacity-100'}`}
                        disabled={isSubmitting}
                    />
                    <button
                        type="submit"
                        disabled={!inputValue.trim() || isSubmitting}
                        className="theme-hover bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed disabled:bg-secondary disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
                    >
                        {isSubmitting ? 'Thinking...' : buttonText}
                    </button>
                </div>
                <div className="flex justify-between items-center min-h-[40px]">
                    <div className="pl-1">
                        <>
                           <p className={`text-sm text-text-secondary transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                               {currentPlaceholder.example}
                           </p>
                           <p className={`text-xs text-text-secondary mt-1 transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                               {currentPlaceholder.subtext}
                           </p>
                        </>
                    </div>
                    {children}
                </div>
            </form>
        </div>
    );
};