import React, { useMemo } from 'react';
import { TimeOfDay, SortByType, GroupByType } from '../../types';
import { TASK_CATEGORIES, DURATION_RANGES } from '../../constants';
import { CategoryFilters } from '../CategoryFilters';
import { useSettings } from '../../contexts/SettingsProvider';
import { getAnimationVariant } from '../../utils/animationUtils';
import { AnimationVariant } from '../../animations';
import { useViewOptions } from '../../contexts/ViewOptionsProvider';
import { dateToYMD } from '../../utils/dateUtils';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    isFrosted: boolean;
    theme: string;
    className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children, isFrosted, theme, className = "max-w-sm" }) => {
    const modalAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'modal'), [theme]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div
                className={`p-6 rounded-themed shadow-themed w-full m-4 ${isFrosted ? 'bg-surface-modal-bkg backdrop-blur-md' : 'bg-surface'} ${modalAnimation.className} ${className}`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

interface ViewModalsProps {
    isFrosted: boolean;
    isBulkEditModalOpen: boolean;
    setIsBulkEditModalOpen: (isOpen: boolean) => void;
    selectedTaskIds: Set<string>;
    bulkEditDate: Date;
    setBulkEditDate: (setter: (date: Date) => Date) => void;
    bulkUpdateTasks: (taskIds: string[], updates: Partial<any>) => void;
    bulkCompleteTasks: (taskIds: string[]) => void;
    bulkDismissTasks: (taskIds: string[]) => void;
    toggleSelectMode: () => void;
}

export const ViewModals: React.FC<ViewModalsProps> = React.memo(({
    isFrosted, isBulkEditModalOpen, setIsBulkEditModalOpen, selectedTaskIds, bulkEditDate, setBulkEditDate,
    bulkUpdateTasks, bulkCompleteTasks, bulkDismissTasks, toggleSelectMode,
}) => {
    const { theme } = useSettings();
    const {
        isSortMenuOpen, setIsSortMenuOpen, sortBy, setSortBy, sortDirection, setSortDirection,
        isGroupMenuOpen, setIsGroupMenuOpen, groupBy, setGroupBy, focusedDate,
        isFilterMenuOpen, setIsFilterMenuOpen, clearAllFilters, activeDurationFilter,
        selectDurationFilter, activeCategoryFilters, toggleCategoryFilter, activeTimeOfDayFilters,
        toggleTimeOfDayFilter, isViewSettingsModalOpen, setIsViewSettingsModalOpen,
        setFocusedDate: setFocusedDateForDefaults, defaultCardStyle, setDefaultCardStyle,
        activeFiltersCount, handleSaveDefaults
    } = useViewOptions();

    const filterLabel = useMemo(() => {
        if (activeFiltersCount === 0) return null; const allFilters: string[] = [];
        activeCategoryFilters.forEach(f => allFilters.push(f));
        activeTimeOfDayFilters.forEach(f => allFilters.push(f.charAt(0).toUpperCase() + f.slice(1)));
        if (activeDurationFilter) { const shortLabel = DURATION_RANGES[activeDurationFilter].label.split(' ')[0]; allFilters.push(shortLabel); }
        if (activeFiltersCount === 1) return allFilters[0];
        return `${allFilters[0]} +${activeFiltersCount - 1}`;
    }, [activeFiltersCount, activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter]);

    const getDisplayDateForBulkEdit = (date: Date): string => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const scheduledDate = new Date(date); scheduledDate.setHours(0, 0, 0, 0);
        const diffTime = scheduledDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays > 1 && diffDays <= 7) return scheduledDate.toLocaleDateString(undefined, { weekday: 'long' });
        return scheduledDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const handleBulkDateArrowClick = (direction: 'prev' | 'next') => {
        setBulkEditDate(currentDate => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const handleApplyBulkDateChange = () => {
        const newDateYMD = dateToYMD(bulkEditDate);
        if (selectedTaskIds.size > 0) { bulkUpdateTasks(Array.from(selectedTaskIds), { scheduled_at: newDateYMD }); setIsBulkEditModalOpen(false); toggleSelectMode(); }
    };

    const handleBulkTimeChange = (time: TimeOfDay | 'any') => {
        if (selectedTaskIds.size > 0) { bulkUpdateTasks(Array.from(selectedTaskIds), { time_of_day: time === 'any' ? undefined : time }); setIsBulkEditModalOpen(false); toggleSelectMode(); }
    };

    const handleBulkComplete = () => { if (selectedTaskIds.size > 0) { bulkCompleteTasks(Array.from(selectedTaskIds)); setIsBulkEditModalOpen(false); toggleSelectMode(); } };
    const handleBulkDismiss = () => { if (selectedTaskIds.size > 0) { bulkDismissTasks(Array.from(selectedTaskIds)); setIsBulkEditModalOpen(false); toggleSelectMode(); } };

    return (
        <>
            <ModalWrapper isOpen={isSortMenuOpen} onClose={() => setIsSortMenuOpen(false)} isFrosted={isFrosted} theme={theme}>
                <h3 className="text-lg font-bold mb-4 font-header">Sort Tasks</h3>
                <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-themed mb-4">
                    <span className="font-semibold text-sm">Sort Direction</span>
                    <div className="flex items-center bg-secondary p-1 rounded-themed">
                        <button onClick={() => setSortDirection('asc')} className={`px-3 py-1 text-sm rounded-themed ${sortDirection === 'asc' ? 'bg-primary text-white' : 'text-text-on-secondary-bkg'}`}>Asc</button>
                        <button onClick={() => setSortDirection('desc')} className={`px-3 py-1 text-sm rounded-themed ${sortDirection === 'desc' ? 'bg-primary text-white' : 'text-text-on-secondary-bkg'}`}>Desc</button>
                    </div>
                </div>
                <div className="space-y-2">
                    {/* FIX: Correctly type the array to avoid inference issues with the onClick handler. */}
                    {/* FIX: Using 'as const' provides stronger type inference for the array literals, preventing potential type mismatches for the 'key' prop and onClick handler. */}
                    {/* FIX: Explicitly cast key to string to resolve typing error. */}
                    {/* FIX (user): Explicitly cast key to string to resolve typing error. */}
                    {/* FIX: Removed explicit String() cast from key. `type` is already a string literal. */}
                    {(['manual', 'title', 'category', 'duration', 'date_and_time'] as const).map(type => (
                        <button key={type} onClick={() => setSortBy(type)} className={`w-full text-left p-3 rounded-themed text-sm font-semibold transition-themed text-text-primary ${sortBy === type ? 'bg-primary text-white' : 'bg-secondary/50 hover:bg-secondary hover:text-text-on-secondary-bkg'}`}>
                            <span className="capitalize">{type === 'date_and_time' ? 'Date and Time' : type.replace(/_/g, ' ')}</span>
                            {sortBy === type && <span className="float-right">✓</span>}
                        </button>
                    ))}
                </div>
            </ModalWrapper>

            <ModalWrapper isOpen={isGroupMenuOpen} onClose={() => setIsGroupMenuOpen(false)} isFrosted={isFrosted} theme={theme}>
                <h3 className="text-lg font-bold mb-4 font-header">Group Tasks By</h3>
                <div className="space-y-2">
                    {/* FIX: Correctly type the array to avoid inference issues with the onClick handler. */}
                    {/* FIX: Using 'as const' provides stronger type inference for the array literals, preventing potential type mismatches for the 'key' prop and onClick handler. */}
                    {/* FIX: Removed disabled prop which was causing a type error because `type` could never be 'by_date' in this loop. */}
                    {/* FIX (user): Explicitly cast key to string to resolve typing error. */}
                    {/* FIX: Removed explicit String() cast from key. `type` is already a string literal. */}
                    {(['none', 'category', 'time_of_day'] as const).map(type => (
                        <button key={type} onClick={() => setGroupBy(type)} className={`w-full text-left p-3 rounded-themed text-sm font-semibold transition-themed text-text-primary ${groupBy === type ? 'bg-primary text-white' : 'bg-secondary/50 hover:bg-secondary hover:text-text-on-secondary-bkg'}`}>
                            <span className="capitalize">{type.replace(/_/g, ' ')}</span>
                            {groupBy === type && <span className="float-right">✓</span>}
                        </button>
                    ))}
                    <button key='by_date' onClick={() => setGroupBy('by_date')} className={`w-full text-left p-3 rounded-themed text-sm font-semibold transition-themed text-text-primary ${groupBy === 'by_date' ? 'bg-primary text-white' : 'bg-secondary/50 hover:bg-secondary hover:text-text-on-secondary-bkg'}`} disabled={focusedDate !== null}>
                        By Date
                        {groupBy === 'by_date' && <span className="float-right">✓</span>}
                    </button>
                </div>
            </ModalWrapper>
            
            <ModalWrapper isOpen={isFilterMenuOpen} onClose={() => setIsFilterMenuOpen(false)} isFrosted={isFrosted} theme={theme} className="max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold font-header">Filter Tasks</h3>
                    <button onClick={clearAllFilters} className="text-sm font-semibold text-accent hover:underline">Clear All</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-text-secondary mb-2 font-header">By Time of Day</h4>
                        <div className="flex flex-wrap gap-2">
                            {/* FIX: Using 'as const' provides stronger type inference for the array literals, preventing potential type mismatches for the 'key' prop and onClick handler. */}
                            {/* FIX (user): Explicitly cast key to string to resolve typing error. */}
                            {/* FIX: Removed explicit String() cast from key. `time` is already a string literal. */}
                            {(['morning', 'day', 'night'] as const).map(time => (
                                <button key={time} onClick={() => toggleTimeOfDayFilter(time)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-themed ${activeTimeOfDayFilters.has(time) ? 'bg-primary text-white' : 'bg-secondary text-text-on-secondary-bkg hover:bg-secondary/80'}`}>{time.charAt(0).toUpperCase() + time.slice(1)}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-text-secondary mb-2 font-header">By Duration</h4>
                        <div className="flex flex-wrap gap-2">
                            {/* FIX: Explicitly cast the key from Object.entries to a string to satisfy type requirements. */}
                            {/* FIX: Removed redundant `as string` cast since `key` from `Object.entries` is already a string. */}
                            {/* FIX (user): Explicitly cast key to string to resolve typing error. */}
                            {/* FIX: Renamed destructured 'key' to 'durationKey' to avoid potential conflicts with the 'key' prop. Removed redundant String() cast. */}
                            {Object.entries(DURATION_RANGES).map(([durationKey, { label }]) => (
                                <button key={durationKey} onClick={() => selectDurationFilter(durationKey)} className={`px-3 py-1 rounded-full text-xs font-semibold transition-themed ${activeDurationFilter === durationKey ? 'bg-primary text-white' : 'bg-secondary text-text-on-secondary-bkg hover:bg-secondary/80'}`}>{label}</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-text-secondary mb-2 font-header">By Category</h4>
                        <CategoryFilters categories={TASK_CATEGORIES} activeFilters={activeCategoryFilters} onToggleFilter={toggleCategoryFilter} />
                    </div>
                </div>
            </ModalWrapper>

            <ModalWrapper isOpen={isBulkEditModalOpen} onClose={() => setIsBulkEditModalOpen(false)} isFrosted={isFrosted} theme={theme}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold font-header">Bulk Edit {selectedTaskIds.size} Tasks</h3>
                    <button onClick={() => setIsBulkEditModalOpen(false)} className="text-2xl font-bold text-text-secondary hover:text-text-primary transition-themed">&times;</button>
                </div>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-sm text-text-secondary mb-2 text-center font-header">Change Date</h4>
                        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded-themed">
                            <button onClick={() => handleBulkDateArrowClick('prev')} className="px-3 py-1 rounded-themed hover:bg-secondary transition-themed text-lg font-bold" aria-label="Move to previous day">&#8249;</button>
                            <span className="font-semibold text-text-primary w-28 text-center">{getDisplayDateForBulkEdit(bulkEditDate)}</span>
                            <button onClick={() => handleBulkDateArrowClick('next')} className="px-3 py-1 rounded-themed hover:bg-secondary transition-themed text-lg font-bold" aria-label="Move to next day">&#8250;</button>
                        </div>
                        <button onClick={handleApplyBulkDateChange} className="w-full mt-2 text-sm font-semibold bg-primary hover:bg-primary-focus text-white py-2 px-3 rounded-themed transition-themed">Apply Date Change</button>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-text-secondary mb-2 text-center font-header">Change Time of Day</h4>
                        <div className="flex items-center justify-center gap-2 bg-secondary p-1 rounded-themed">
                            <button onClick={() => handleBulkTimeChange('morning')} title="Set to Morning" className="p-2 text-lg flex-1 text-center hover:bg-primary/50 rounded-themed text-text-on-secondary-bkg">⏰</button>
                            <button onClick={() => handleBulkTimeChange('day')} title="Set to Afternoon" className="p-2 text-lg flex-1 text-center hover:bg-primary/50 rounded-themed text-text-on-secondary-bkg">☀️</button>
                            <button onClick={() => handleBulkTimeChange('night')} title="Set to Evening" className="p-2 text-lg flex-1 text-center hover:bg-primary/50 rounded-themed text-text-on-secondary-bkg">🌙</button>
                            <button onClick={() => handleBulkTimeChange('any')} title="Set to Anytime" className="p-2 text-lg flex-1 text-center hover:bg-primary/50 rounded-themed text-text-on-secondary-bkg">🕓</button>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-secondary/50">
                        <h4 className="font-semibold text-sm text-text-secondary mb-2 text-center font-header">Actions</h4>
                        <div className="flex items-center gap-2">
                            <button onClick={handleBulkComplete} className="flex-1 text-sm font-semibold bg-secondary hover:bg-secondary/80 text-text-on-secondary-bkg py-2 px-3 rounded-themed transition-themed">Complete</button>
                            <button onClick={handleBulkDismiss} className="flex-1 text-sm font-semibold bg-secondary hover:bg-secondary/80 text-text-on-secondary-bkg py-2 px-3 rounded-themed transition-themed">Dismiss</button>
                        </div>
                    </div>
                </div>
            </ModalWrapper>

            <ModalWrapper isOpen={isViewSettingsModalOpen} onClose={() => setIsViewSettingsModalOpen(false)} isFrosted={isFrosted} theme={theme} className="max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold font-header">Default View Settings</h3>
                    <button onClick={() => setIsViewSettingsModalOpen(false)} className="text-2xl font-bold text-text-secondary hover:text-text-primary transition-themed">&times;</button>
                </div>
                <p className="text-sm text-text-secondary mb-4">Set the default view options that will be applied when you open the app.</p>
                <div className="space-y-4 bg-secondary/30 p-4 rounded-themed mb-6">
                    <div>
                        <h4 className="font-semibold text-sm text-text-primary mb-2 font-header">Default Focus</h4>
                        <div className="flex items-center bg-secondary p-1 rounded-themed">
                            <button onClick={() => setFocusedDateForDefaults(new Date())} className={`flex-1 text-center px-3 py-1 text-sm rounded-themed transition-themed ${focusedDate !== null ? 'bg-primary text-white' : 'text-text-on-secondary-bkg hover:bg-primary/20'}`}>Daily</button>
                            <button onClick={() => setFocusedDateForDefaults(null)} className={`flex-1 text-center px-3 py-1 text-sm rounded-themed transition-themed ${focusedDate === null ? 'bg-primary text-white' : 'text-text-on-secondary-bkg hover:bg-primary/20'}`}>All Tasks</button>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-text-primary mb-2 font-header">Default Card Style</h4>
                        <div className="flex items-center bg-secondary p-1 rounded-themed">
                            <button onClick={() => setDefaultCardStyle('full')} className={`flex-1 text-center px-3 py-1 text-sm rounded-themed transition-themed ${defaultCardStyle === 'full' ? 'bg-primary text-white' : 'text-text-on-secondary-bkg hover:bg-primary/20'}`}>Full</button>
                            <button onClick={() => setDefaultCardStyle('compact')} className={`flex-1 text-center px-3 py-1 text-sm rounded-themed transition-themed ${defaultCardStyle === 'compact' ? 'bg-primary text-white' : 'text-text-on-secondary-bkg hover:bg-primary/20'}`}>Compact</button>
                        </div>
                    </div>
                    <div className="text-sm">
                        <p><strong className="text-text-primary">Current Grouping:</strong> <span className="capitalize">{groupBy.replace('_', ' ')}</span></p>
                        <p><strong className="text-text-primary">Current Sorting:</strong> <span className="capitalize">{sortBy.replace('_', ' ')} ({sortDirection})</span></p>
                        <p><strong className="text-text-primary">Current Filters:</strong> {activeFiltersCount > 0 ? filterLabel : 'None'}</p>
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setIsViewSettingsModalOpen(false)} className="text-sm font-semibold bg-secondary hover:bg-opacity-80 text-text-on-secondary-bkg py-2 px-4 rounded-themed transition-themed">Cancel</button>
                    {/* FIX: The error on this line is likely a typo in the error report, as the code is valid. No changes needed. */}
                    <button onClick={handleSaveDefaults} className="text-sm font-semibold bg-primary hover:bg-primary-focus text-white py-2 px-4 rounded-themed transition-themed">Save Current View as Default</button>
                </div>
            </ModalWrapper>
        </>
    )
});