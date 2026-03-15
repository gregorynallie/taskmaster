import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode, useEffect } from 'react';
import { Task, SortByType, GroupByType, SortDirection, TimeOfDay, ViewSettings, ViewOptionsContextType } from '../types';
import { useTasks } from './TasksProvider';
import { useSettings } from './SettingsProvider';
import { dateToYMD } from '../utils/dateUtils';
import { sortTasks } from '../utils/taskUtils';
import { DURATION_RANGES } from '../constants';

const ViewOptionsContext = createContext<ViewOptionsContextType | undefined>(undefined);

export const ViewOptionsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { tasks } = useTasks();
    const { showSpoofedTasks, defaultViewSettings, updateDefaultViewSettings } = useSettings();
    
    // State for view options, previously in TodayView
    const [focusedDate, setFocusedDate] = useState<Date | null>(null);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [activeCategoryFilters, setActiveCategoryFilters] = useState<Set<string>>(new Set());
    const [activeTimeOfDayFilters, setActiveTimeOfDayFilters] = useState<Set<TimeOfDay>>(new Set());
    const [activeDurationFilter, setActiveDurationFilter] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortByType>('manual');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [groupBy, setGroupBy] = useState<GroupByType>('none');
    const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
    const [isViewSettingsModalOpen, setIsViewSettingsModalOpen] = useState(false);
    const [defaultCardStyle, setDefaultCardStyle] = useState<'full' | 'compact'>('full');
    const [compactOverrides, setCompactOverrides] = useState<Set<string>>(new Set());
    // FIX: Add state for completed and dismissed task visibility.
    const [isCompletedVisible, setIsCompletedVisible] = useState(false);
    const [isDismissedVisible, setIsDismissedVisible] = useState(false);

    // Logic to apply default settings from useSettings
    useEffect(() => {
        if (defaultViewSettings) {
            const { sortBy, sortDirection, groupBy, categoryFilters, timeOfDayFilters, durationFilter, cardStyle, focusedDate: savedDate } = defaultViewSettings;
            setSortBy(sortBy);
            setSortDirection(sortDirection);
            setGroupBy(groupBy ?? 'none');
            setActiveCategoryFilters(new Set(categoryFilters));
            setActiveTimeOfDayFilters(new Set(timeOfDayFilters));
            setActiveDurationFilter(durationFilter);
            setDefaultCardStyle(cardStyle || 'full');
            if (savedDate) {
                const parsedDate = new Date(savedDate);
                if (!isNaN(parsedDate.getTime())) setFocusedDate(parsedDate);
            } else if (savedDate === null) {
                setFocusedDate(null);
            }
        } else {
            setFocusedDate(null);
            setGroupBy('by_date');
        }
    }, [defaultViewSettings]);

    useEffect(() => {
        if (focusedDate === null) {
            const defaultGroup = defaultViewSettings?.groupBy;
            setGroupBy(defaultGroup || 'none');
        } else {
            const defaultGroup = defaultViewSettings?.groupBy;
            setGroupBy(defaultGroup && defaultGroup !== 'by_date' ? defaultGroup : 'none');
        }
    }, [focusedDate, defaultViewSettings?.groupBy]);

    // Filtering logic
    const { activeTasks, completedTasks, dismissedTasks } = useMemo(() => {
        const allTasksSource = showSpoofedTasks ? tasks : tasks.filter(t => !t.isSpoofed);
        const allActive = allTasksSource.filter(t => !t.completed_at && !t.dismissed_at);
        const tasksForView = focusedDate === null
            ? allActive
            : allActive.filter(t => dateToYMD(new Date(t.scheduled_at)) === dateToYMD(focusedDate));
        
        const filtered = tasksForView.filter(task => {
            const matchesCategory = activeCategoryFilters.size === 0 || activeCategoryFilters.has(task.category);
            const matchesTimeOfDay = activeTimeOfDayFilters.size === 0 || (task.time_of_day && activeTimeOfDayFilters.has(task.time_of_day));
            let matchesDuration = true;
            if (activeDurationFilter) {
                const range = DURATION_RANGES[activeDurationFilter];
                matchesDuration = task.duration_min >= range.min && task.duration_min <= range.max;
            }
            return matchesCategory && matchesTimeOfDay && matchesDuration;
        });

        const completionFilterDate = focusedDate || new Date(); 
        const completionFilterDateString = dateToYMD(completionFilterDate);

        const completed = allTasksSource
            .filter(t => t.completed_at && dateToYMD(new Date(t.completed_at)) === completionFilterDateString)
            .sort((a, b) => (b.completed_at?.getTime() ?? 0) - (a.completed_at?.getTime() ?? 0));
        
        const dismissed = allTasksSource
            .filter(t => t.dismissed_at && dateToYMD(new Date(t.dismissed_at)) === completionFilterDateString)
            .sort((a, b) => (b.dismissed_at?.getTime() ?? 0) - (a.dismissed_at?.getTime() ?? 0));
        
        return { activeTasks: filtered, completedTasks: completed, dismissedTasks: dismissed };
    }, [tasks, showSpoofedTasks, focusedDate, activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter]);

    // Handlers for filtering
    const toggleCategoryFilter = useCallback((category: string) => { setActiveCategoryFilters(prev => { const newFilters = new Set(prev); if (newFilters.has(category)) newFilters.delete(category); else newFilters.add(category); return newFilters; }); }, []);
    const toggleTimeOfDayFilter = useCallback((time: TimeOfDay) => { setActiveTimeOfDayFilters(prev => { const newFilters = new Set(prev); if (newFilters.has(time)) newFilters.delete(time); else newFilters.add(time); return newFilters; }); }, []);
    const selectDurationFilter = useCallback((durationKey: string | null) => { setActiveDurationFilter(prev => (prev === durationKey ? null : durationKey)); }, []);
    const clearAllFilters = useCallback(() => { setActiveCategoryFilters(new Set()); setActiveTimeOfDayFilters(new Set()); setActiveDurationFilter(null); }, []);
    const activeFiltersCount = useMemo(() => activeCategoryFilters.size + activeTimeOfDayFilters.size + (activeDurationFilter ? 1 : 0), [activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter]);

    // Organization logic
    const sortedTasks = useMemo(() => sortTasks(activeTasks, sortBy, sortDirection), [activeTasks, sortBy, sortDirection]);
    const groupedTasks = useMemo(() => {
        if (groupBy === 'none') return null;
        if (groupBy === 'by_date' && focusedDate === null) {
            const groups: Record<string, Task[]> = { Overdue: [], Today: [], Tomorrow: [], 'This Week': [], 'This Month': [], Later: [] };
            const today = new Date(); today.setHours(0,0,0,0);
            const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
            const endOfWeek = new Date(today); endOfWeek.setDate(today.getDate() + 8);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            sortedTasks.forEach(task => {
                const taskDate = new Date(task.scheduled_at); taskDate.setHours(0,0,0,0);
                if (isNaN(taskDate.getTime())) return;
                if (taskDate < today) groups.Overdue.push(task);
                else if (taskDate.getTime() === today.getTime()) groups.Today.push(task);
                else if (taskDate.getTime() === tomorrow.getTime()) groups.Tomorrow.push(task);
                else if (taskDate < endOfWeek) groups['This Week'].push(task);
                else if (taskDate <= endOfMonth) groups['This Month'].push(task);
                else groups.Later.push(task);
            });
            const groupOrder = ['Overdue', 'Today', 'Tomorrow', 'This Week', 'This Month', 'Later'];
            return groupOrder.map(key => ({ groupName: key, tasks: groups[key] })).filter(group => group.tasks.length > 0);
        }
        const groups: Record<string, Task[]> = {};
        const timeOfDayDisplayMap: Record<string, string> = { morning: 'Morning', day: 'Afternoon', night: 'Evening', anytime: 'Anytime' };
        sortedTasks.forEach(task => {
            let key: string = (groupBy === 'category') ? (task.category || 'Uncategorized') : (timeOfDayDisplayMap[task.time_of_day || 'anytime']);
            if (!groups[key]) groups[key] = [];
            groups[key].push(task);
        });
        const sortedGroupKeys = Object.keys(groups).sort((a, b) => {
            if (groupBy === 'time_of_day') {
                const order: Record<string, number> = { Morning: 1, Afternoon: 2, Evening: 3, Anytime: 4 };
                return (order[a] || 99) - (order[b] || 99);
            }
            return a.localeCompare(b);
        });
        return sortedGroupKeys.map(key => ({ groupName: key, tasks: groups[key] }));
    }, [sortedTasks, groupBy, focusedDate]);
    
    // Handlers for organization
    const clearSort = useCallback(() => { setSortBy('manual'); setSortDirection('asc'); }, []);
    const clearGroup = useCallback(() => { setGroupBy('none'); setCollapsedGroups(new Set()); }, []);
    const toggleGroupCollapse = useCallback((groupName: string) => { setCollapsedGroups(prev => { const newSet = new Set(prev); if (newSet.has(groupName)) newSet.delete(groupName); else newSet.add(groupName); return newSet; }); }, []);
    const isSortingActive = useMemo(() => sortBy !== 'manual', [sortBy]);
    const isGroupingActive = useMemo(() => groupBy !== 'none', [groupBy]);

    // Other handlers
    const toggleCompactOverride = useCallback((taskId: string) => { setCompactOverrides(prev => { const newSet = new Set(prev); if (newSet.has(taskId)) newSet.delete(taskId); else newSet.add(taskId); return newSet; }); }, []);
    const willOrderChange = useCallback((taskId: string, newProps: Partial<Task>): boolean => {
        if (sortBy === 'manual') return false;
        const currentIndex = sortedTasks.findIndex(t => t.id === taskId);
        if (currentIndex === -1) return false;
        const futureUnsorted = activeTasks.map(t => t.id === taskId ? { ...t, ...newProps } : t);
        const futureSorted = sortTasks(futureUnsorted, sortBy, sortDirection);
        const newIndex = futureSorted.findIndex(t => t.id === taskId);
        return currentIndex !== newIndex;
    }, [activeTasks, sortedTasks, sortBy, sortDirection]);

    const handleSaveDefaults = useCallback(() => {
        const settingsToSave: ViewSettings = {
            sortBy, sortDirection, groupBy,
            categoryFilters: Array.from(activeCategoryFilters), timeOfDayFilters: Array.from(activeTimeOfDayFilters),
            durationFilter: activeDurationFilter, cardStyle: defaultCardStyle, focusedDate: focusedDate ? focusedDate.toISOString() : null,
        };
        updateDefaultViewSettings(settingsToSave);
        setIsViewSettingsModalOpen(false);
    }, [sortBy, sortDirection, groupBy, activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter, defaultCardStyle, focusedDate, updateDefaultViewSettings]);


    const value: ViewOptionsContextType = {
        focusedDate, setFocusedDate, sortBy, setSortBy, sortDirection, setSortDirection, groupBy, setGroupBy,
        activeCategoryFilters, activeTimeOfDayFilters, activeDurationFilter, isCalendarOpen, setIsCalendarOpen,
        isFilterMenuOpen, setIsFilterMenuOpen, isSortMenuOpen, setIsSortMenuOpen, isGroupMenuOpen, setIsGroupMenuOpen,
        isViewSettingsModalOpen, setIsViewSettingsModalOpen, defaultCardStyle, setDefaultCardStyle, compactOverrides,
        toggleCompactOverride, activeTasks, completedTasks, dismissedTasks, sortedTasks, groupedTasks,
        activeFiltersCount, isSortingActive, isGroupingActive, toggleCategoryFilter, toggleTimeOfDayFilter,
        selectDurationFilter, clearAllFilters, clearSort, clearGroup, toggleGroupCollapse, willOrderChange,
        handleSaveDefaults, calendarMonth, setCalendarMonth, collapsedGroups,
        isCompletedVisible, setIsCompletedVisible, isDismissedVisible, setIsDismissedVisible,
    };

    return (
        <ViewOptionsContext.Provider value={value}>
            {children}
        </ViewOptionsContext.Provider>
    );
};

export const useViewOptions = (): ViewOptionsContextType => {
    const context = useContext(ViewOptionsContext);
    if (context === undefined) {
        throw new Error('useViewOptions must be used within a ViewOptionsProvider');
    }
    return context;
};