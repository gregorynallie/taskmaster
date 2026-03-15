import React, { useState, useRef, useEffect } from 'react';
import { TASK_CATEGORIES } from '../constants';
import { DURATION_RANGES } from '../constants';

type DurationFilter = 'quick' | 'medium' | 'long';

interface ExploreFiltersProps {
    onFilterChange: (filters: { categories: string[], duration: DurationFilter | null }) => void;
}

const CategoryIcon: React.FC<{ category: string }> = ({ category }) => {
    const icons: Record<string, string> = {
        'Productivity': '🚀', 'Health': '❤️', 'Home': '🏡', 'Social': '🎉',
        'Personal Growth': '🧠', 'Relaxation': '🛀', 'Fun': '🎮',
    };
    return <span className="text-xl">{icons[category] || '❓'}</span>;
};

const DurationIcon: React.FC<{ duration: DurationFilter }> = ({ duration }) => {
    const icons: Record<DurationFilter, string> = {
        'quick': '⚡️', 'medium': '⏳', 'long': '🐢',
    };
    return <span className="text-xl">{icons[duration]}</span>;
};

export const ExploreFilters: React.FC<ExploreFiltersProps> = ({ onFilterChange }) => {
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [selectedDuration, setSelectedDuration] = useState<DurationFilter | null>(null);

    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);
    const [isDurationOpen, setIsDurationOpen] = useState(false);
    const durationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        onFilterChange({
            categories: Array.from(selectedCategories),
            duration: selectedDuration,
        });
    }, [selectedCategories, selectedDuration, onFilterChange]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (durationRef.current && !durationRef.current.contains(event.target as Node)) {
                setIsDurationOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleCategory = (category: string) => {
        setSelectedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) newSet.delete(category);
            else newSet.add(category);
            return newSet;
        });
    };

    const toggleDuration = (duration: DurationFilter) => {
        setSelectedDuration(prev => prev === duration ? null : duration);
        setIsDurationOpen(false);
    };

    return (
        <div className="flex items-center justify-center gap-2">
            {/* Category Filter */}
            <div className="relative" ref={categoryRef}>
                <button
                    onClick={() => setIsCategoryOpen(prev => !prev)}
                    className={`p-2 rounded-full transition-colors ${selectedCategories.size > 0 ? 'bg-primary text-white' : 'bg-surface hover:bg-secondary/50'}`}
                    aria-label="Filter by category"
                >
                    <CategoryIcon category="Productivity" /> {/* Placeholder icon */}
                </button>
                {isCategoryOpen && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface p-2 rounded-themed shadow-lg border border-secondary/50 flex flex-wrap gap-2 w-64 z-10">
                        {TASK_CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => toggleCategory(cat)}
                                className={`w-12 h-12 flex items-center justify-center rounded-themed transition-colors ${selectedCategories.has(cat) ? 'bg-primary/80' : 'bg-secondary/30 hover:bg-secondary/50'}`}
                            >
                                <CategoryIcon category={cat} />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Duration Filter */}
            <div className="relative" ref={durationRef}>
                <button
                    onClick={() => setIsDurationOpen(prev => !prev)}
                    className={`p-2 rounded-full transition-colors ${selectedDuration ? 'bg-primary text-white' : 'bg-surface hover:bg-secondary/50'}`}
                    aria-label="Filter by duration"
                >
                    <DurationIcon duration="medium" /> {/* Placeholder icon */}
                </button>
                {isDurationOpen && (
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-surface p-2 rounded-themed shadow-lg border border-secondary/50 flex gap-2 w-auto z-10">
                        {(['quick', 'medium', 'long'] as DurationFilter[]).map(dur => (
                            <button
                                key={dur}
                                onClick={() => toggleDuration(dur)}
                                title={DURATION_RANGES[dur].label}
                                className={`w-12 h-12 flex items-center justify-center rounded-themed transition-colors ${selectedDuration === dur ? 'bg-primary/80' : 'bg-secondary/30 hover:bg-secondary/50'}`}
                            >
                                <DurationIcon duration={dur} />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};