import React from 'react';

interface CategoryFiltersProps {
    categories: string[];
    activeFilters: Set<string>;
    onToggleFilter: (category: string) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, activeFilters, onToggleFilter }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map(category => {
                const isActive = activeFilters.has(category);
                return (
                    <button
                        key={category}
                        onClick={() => onToggleFilter(category)}
                        className={`
                            px-3 py-1 rounded-full text-xs font-semibold transition
                            ${isActive
                                ? 'bg-primary text-white'
                                : 'bg-secondary text-text-secondary hover:bg-secondary/80'
                            }
                        `}
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
};