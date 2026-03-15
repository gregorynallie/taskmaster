import React, { useMemo } from 'react';
import { useViewOptions } from '../../contexts/ViewOptionsProvider';
import { DURATION_RANGES } from '../../constants';

interface TodayViewHeaderProps {
    tasksForTodayText: string;
    isSelectMode: boolean;
    areAllSelected: boolean;
    selectedTaskIds: Set<string>;
    handleSelectAllToggle: () => void;
    setIsBulkEditModalOpen: (isOpen: boolean) => void;
    toggleSelectMode: () => void;
}

export const TodayViewHeader: React.FC<TodayViewHeaderProps> = React.memo(({
    tasksForTodayText,
    isSelectMode,
    areAllSelected,
    selectedTaskIds,
    handleSelectAllToggle,
    setIsBulkEditModalOpen,
    toggleSelectMode,
}) => {
    const {
        focusedDate, setFocusedDate, sortBy, sortDirection, groupBy,
        activeFiltersCount, activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter,
        setIsCalendarOpen, setIsGroupMenuOpen, clearGroup, setIsSortMenuOpen, clearSort,
        setIsFilterMenuOpen, clearAllFilters, setIsViewSettingsModalOpen
    } = useViewOptions();

    const sortLabel = useMemo(() => {
        if (sortBy === 'manual') return null;
        return `by ${sortBy.replace(/_/g, ' ')}`;
    }, [sortBy]);
    
    const groupLabel = useMemo(() => {
        if (groupBy === 'none') return null;
        if (groupBy === 'by_date') return 'by Date';
        return `by ${groupBy.replace(/_/g, ' ')}`;
    }, [groupBy]);

    const filterLabel = useMemo(() => {
        if (activeFiltersCount === 0) return null;
        const allFilters: string[] = [];
        activeCategoryFilters.forEach(f => allFilters.push(f));
        activeTimeOfDayFilters.forEach(f => allFilters.push(f.charAt(0).toUpperCase() + f.slice(1)));
        if (activeDurationFilter) {
            const shortLabel = DURATION_RANGES[activeDurationFilter].label.split(' ')[0];
            allFilters.push(shortLabel);
        }
        if (activeFiltersCount === 1) return allFilters[0];
        return `${allFilters[0]} +${activeFiltersCount - 1}`;
    }, [activeFiltersCount, activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter]);
    
    const handleDayArrowClick = (direction: 'prev' | 'next') => () => {
        if (focusedDate) {
            const newDate = new Date(focusedDate);
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
            setFocusedDate(newDate);
        }
    };
    const handleGoToYesterday = () => { const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1); setFocusedDate(yesterday); };
    const handleGoToToday = () => { setFocusedDate(new Date()); };

    return (
        <div className="flex justify-between items-center mb-4 flex-wrap gap-y-4">
            <div className="flex items-center gap-2">
                {focusedDate ? (
                    <button 
                        onClick={handleDayArrowClick('prev')} 
                        className="p-2 rounded-full hover:bg-surface transition-themed"
                        aria-label="Previous day"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                ) : (
                        <button 
                        onClick={handleGoToYesterday} 
                        className="p-2 rounded-full hover:bg-surface transition-themed"
                        aria-label="Go to Yesterday's Tasks"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <button onClick={() => setIsCalendarOpen(true)} className="p-2 rounded-themed hover:bg-surface transition-themed">
                    <h2 className="text-2xl font-bold text-text-primary font-header">{tasksForTodayText}</h2>
                </button>
                {focusedDate ? (
                    <button 
                        onClick={handleDayArrowClick('next')} 
                        className="p-2 rounded-full hover:bg-surface transition-themed"
                        aria-label="Next day"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                ) : (
                        <button 
                        onClick={handleGoToToday} 
                        className="p-2 rounded-full hover:bg-surface transition-themed"
                        aria-label="Go to Today's Tasks"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}

                {focusedDate === null ? (
                    <button 
                        onClick={() => setFocusedDate(new Date())}
                        className="p-2 bg-secondary/50 text-text-secondary font-bold rounded-themed transition-themed hover:bg-secondary"
                        aria-label="Go to Today's Tasks"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </button>
                ) : (
                    <button 
                        onClick={() => setFocusedDate(null)}
                        className="flex items-center gap-2 bg-secondary/50 text-text-secondary font-bold rounded-themed transition-themed hover:bg-secondary py-2 px-3"
                        aria-label="Go to All Tasks"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <span>All</span>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-2 text-sm">
                <div className="relative">
                    <button
                        onClick={() => setIsGroupMenuOpen(true)}
                        className={`flex items-center gap-2 bg-secondary/50 text-text-secondary font-bold rounded-themed transition-themed hover:bg-secondary ${groupLabel ? 'py-2 pl-3 pr-8' : 'p-2'}`}
                        aria-label="Group tasks"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                        {groupLabel && <span className="capitalize">{groupLabel}</span>}
                    </button>
                    {groupLabel && (
                        <button onClick={(e) => { e.stopPropagation(); clearGroup(); }} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary" aria-label="Clear group"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsSortMenuOpen(true)}
                        className={`flex items-center gap-2 bg-secondary/50 text-text-secondary font-bold rounded-themed transition-themed hover:bg-secondary ${sortLabel ? 'py-2 pl-3 pr-8' : 'p-2'}`}
                        aria-label="Sort tasks"
                    >
                    {sortBy !== 'manual' ? (
                            sortDirection === 'asc' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 17a1 1 0 01-1-1V5.414L6.707 7.707a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V16a1 1 0 01-1 1z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v10.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                            )
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L4 9m3 3l3-3m7 12V4m0 12l3-3m-3 3l-3-3" /></svg>
                        )}
                        {sortLabel && <span className="capitalize">{sortLabel}</span>}
                    </button>
                        {sortLabel && (
                        <button onClick={(e) => { e.stopPropagation(); clearSort(); }} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary" aria-label="Clear sort"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    )}
                </div>
                <div className="relative">
                    <button
                        onClick={() => setIsFilterMenuOpen(true)}
                        className={`flex items-center gap-2 bg-secondary/50 text-text-secondary font-bold rounded-themed transition-themed hover:bg-secondary ${filterLabel ? 'py-2 pl-3 pr-8' : 'p-2'}`}
                        aria-label="Filter tasks"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" /></svg>
                    {filterLabel && <span className="capitalize">{filterLabel}</span>}
                    </button>
                    {filterLabel && (
                        <button onClick={(e) => { e.stopPropagation(); clearAllFilters(); }} className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-secondary" aria-label="Clear filters"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                    )}
                </div>
                <button
                    onClick={() => setIsViewSettingsModalOpen(true)}
                    className="p-2 bg-secondary/50 text-text-secondary font-bold rounded-themed transition-themed hover:bg-secondary"
                    aria-label="Default view settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                {isSelectMode && (
                    <button onClick={handleSelectAllToggle} className="bg-secondary/50 text-text-secondary font-bold py-2 px-4 rounded-themed transition-themed hover:bg-secondary">{areAllSelected ? 'Deselect All' : 'Select All'}</button>
                )}
                {isSelectMode && selectedTaskIds.size > 0 && (
                    <button onClick={() => setIsBulkEditModalOpen(true)} className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-themed transition-themed">Bulk Edit</button>
                )}
                <button onClick={toggleSelectMode} className={`p-2 rounded-themed transition-themed ${isSelectMode ? 'bg-primary text-white' : 'bg-secondary/50 text-text-secondary hover:bg-secondary'}`} aria-label="Select multiple tasks">
                    {isSelectMode ? (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>) : (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>)}
                </button>
            </div>
        </div>
    );
});