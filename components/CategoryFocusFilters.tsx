import React from 'react';
import { CategoryFocus } from '../types';
import { TASK_CATEGORIES } from '../constants';

interface CategoryFocusFiltersProps {
    focus: CategoryFocus;
    onToggle: (category: string) => void;
}

export const CategoryFocusFilters: React.FC<CategoryFocusFiltersProps> = ({ focus, onToggle }) => {
    
    const getButtonState = (category: string) => {
        const currentFocus = focus[category];
        if (currentFocus === 'more') {
            return {
                label: `+ ${category}`,
                className: 'border-green-400 bg-green-900/50 text-green-300',
            };
        }
        if (currentFocus === 'less') {
            return {
                label: `- ${category}`,
                className: 'border-red-400 bg-red-900/50 text-red-300',
            };
        }
        return {
            label: category,
            className: 'border-secondary bg-secondary/30 text-text-secondary hover:border-primary',
        };
    };

    return (
        <div className="flex flex-wrap gap-2">
            {TASK_CATEGORIES.map(category => {
                const { label, className } = getButtonState(category);
                return (
                    <button
                        key={category}
                        onClick={() => onToggle(category)}
                        className={`px-3 py-1.5 rounded-md text-sm font-semibold border transition-all duration-200 ${className}`}
                    >
                        {label}
                    </button>
                );
            })}
        </div>
    );
};