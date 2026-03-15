import React, { useMemo, useCallback, useEffect } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { QuickAddTask } from '../components/QuickAddTask';
import { TodayViewHeader } from '../components/today/TodayViewHeader';
import { TaskList } from '../components/today/TaskList';
import { ViewModals } from '../components/today/ViewModals';
import { TaskCard } from '../components/TaskCard';
import { useTaskInteractionAndAnimation } from '../hooks/useTaskInteractionAndAnimation';
import { useViewOptions } from '../contexts/ViewOptionsProvider';
import { dateToYMD } from '../utils/dateUtils';
import { DURATION_RANGES } from '../constants';


// Extracted Calendar Component
interface CalendarProps {
    isFrosted: boolean;
}

const Calendar: React.FC<CalendarProps> = ({ isFrosted }) => {
    const { calendarMonth, setCalendarMonth, focusedDate, setFocusedDate, setIsCalendarOpen } = useViewOptions();
    const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
    const endOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0);
    const startDayOfWeek = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();
    
    const days = [];
    for (let i = 0; i < startDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`}></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), i);
        const isToday = dateToYMD(date) === dateToYMD(new Date());
        const isSelected = focusedDate && dateToYMD(date) === dateToYMD(focusedDate);
        days.push(
            <button 
                key={i}
                onClick={() => { setFocusedDate(date); setIsCalendarOpen(false); }}
                className={`h-10 w-10 flex items-center justify-center rounded-full transition-themed ${isSelected ? 'bg-primary text-white' : 'hover:bg-secondary'} ${isToday && !isSelected ? 'border-2 border-accent' : ''}`}
            >
                {i}
            </button>
        );
    }

    return (
        <div 
            className={`p-6 rounded-themed shadow-themed max-w-sm w-full m-4 ${isFrosted ? 'bg-surface-modal-bkg backdrop-blur-md' : 'bg-surface'}`} 
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))} className="p-2 rounded-full hover:bg-secondary text-lg font-bold">‹</button>
                <h4 className="font-bold font-header">{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                <button onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))} className="p-2 rounded-full hover:bg-secondary text-lg font-bold">›</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-secondary mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 place-items-center">
                {days}
            </div>
            <div className="border-t border-secondary pt-4 mt-4 flex flex-col gap-2">
                 <button onClick={() => { setFocusedDate(null); setIsCalendarOpen(false); }} className={`w-full text-left p-3 rounded-themed text-sm font-semibold transition-themed ${focusedDate === null ? 'bg-primary text-white' : 'bg-secondary/50 hover:bg-secondary'}`}>All Tasks</button>
                 <button onClick={() => { setFocusedDate(new Date()); setIsCalendarOpen(false); }} className="w-full text-left p-3 rounded-themed text-sm font-semibold transition-themed bg-secondary/50 hover:bg-secondary">Go to Today</button>
            </div>
        </div>
    );
};

interface TodayViewProps {
    isFirstLoadAfterOnboarding?: boolean;
}

export const TodayView: React.FC<TodayViewProps> = ({ isFirstLoadAfterOnboarding = false }) => {
    const { 
        tasks, dailySuggestions, isSuggestionsLoading, suggestionsError,
        fetchDailySuggestions, acceptSuggestion, shuffleSingleSuggestion,
        reorderTasks, moveTask, bulkUpdateTasks, bulkCompleteTasks, bulkDismissTasks,
        activeAnimations, clearAnimation, completingTaskId, initiateCompletion,
        dismissingTaskId, initiateDismissal, updateTask, dismissTask,
    } = useTasks();

    const { mode, theme } = useSettings();

    const {
        focusedDate, setFocusedDate,
        isCalendarOpen, setIsCalendarOpen,
        isCompletedVisible, setIsCompletedVisible,
        isDismissedVisible, setIsDismissedVisible,
        completedTasks, dismissedTasks,
        activeTasks, sortedTasks, groupedTasks,
        groupBy,
    } = useViewOptions();

    const interaction = useTaskInteractionAndAnimation({
        tasks,
        sortedTasks,
        groupedTasks,
        updateTask,
        reorderTasks,
        isSuggestionsLoading,
        activeAnimations,
        groupBy,
    });

    useEffect(() => {
        fetchDailySuggestions();
    }, [fetchDailySuggestions]);

    const isFrosted = theme === 'ocean-mist';

    const { tasksForTodayText } = useMemo(() => {
        if (!focusedDate) return { tasksForTodayText: 'All Tasks' };
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
        const selected = new Date(focusedDate); selected.setHours(0, 0, 0, 0);
        if (selected.getTime() === today.getTime()) return { tasksForTodayText: "Today's Tasks" };
        if (selected.getTime() === tomorrow.getTime()) return { tasksForTodayText: "Tomorrow's Tasks" };
        const shortDate = selected.toLocaleDateString(undefined, { month: 'long', day: 'numeric' });
        return { tasksForTodayText: `Tasks for ${shortDate}`};
    }, [focusedDate]);

    const emptyDayText = mode === 'rpg' ? "No quests for today. A moment of peace, or a chance to add a new adventure!" : "No tasks for today. Your schedule is clear.";
    const emptyAllText = "No active tasks. A clean slate!";
    const isAnyTaskAnimating = !!interaction.draggedId || interaction.isDropping.current || activeAnimations.size > 0 || !!completingTaskId || !!dismissingTaskId || interaction.isListShuffling;
    const completedHeaderTitle = focusedDate ? 'Completed' : 'Completed Today';
    const dismissedHeaderTitle = focusedDate ? 'Dismissed' : 'Dismissed Today';
    
    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <div className="bg-surface p-6 rounded-themed shadow-themed mb-8">
                <h2 className="text-3xl font-bold mb-2 text-center text-text-primary font-header">YOUR TASKS</h2>
                <p className="text-center text-text-secondary mb-6">Add new tasks using natural language below.</p>
                <QuickAddTask selectedDate={focusedDate ?? new Date()} />
            </div>
            
            <div>
                <TodayViewHeader 
                    tasksForTodayText={tasksForTodayText}
                    isSelectMode={interaction.isSelectMode}
                    areAllSelected={interaction.areAllSelected}
                    selectedTaskIds={interaction.selectedTaskIds}
                    handleSelectAllToggle={interaction.handleSelectAllToggle}
                    setIsBulkEditModalOpen={interaction.setIsBulkEditModalOpen}
                    toggleSelectMode={interaction.toggleSelectMode}
                />
                <TaskList
                    containerRef={interaction.containerRef}
                    tasksToRender={interaction.tasksToRender}
                    dailySuggestions={dailySuggestions}
                    isSuggestionsLoading={isSuggestionsLoading}
                    suggestionsError={suggestionsError}
                    emptyDayText={emptyDayText}
                    emptyAllText={emptyAllText}
                    draggedId={interaction.draggedId}
                    isSelectMode={interaction.isSelectMode}
                    selectedTaskIds={interaction.selectedTaskIds}
                    handleDragStart={interaction.handleDragStart}
                    handleDragEnd={interaction.handleDragEnd}
                    handleDragEnter={interaction.handleDragEnter}
                    handleDrop={interaction.handleDrop}
                    moveTask={moveTask}
                    toggleTaskSelection={interaction.toggleTaskSelection}
                    acceptSuggestion={(suggestion, index, fromRect) => acceptSuggestion(suggestion, index, { fromRect, type: 'accept-full' })}
                    shuffleSingleSuggestion={shuffleSingleSuggestion}
                    activeAnimations={activeAnimations}
                    clearAnimation={clearAnimation}
                    onTaskInserted={() => {}}
                    isAnyTaskAnimating={isAnyTaskAnimating}
                    completingTaskId={completingTaskId}
                    initiateCompletion={initiateCompletion}
                    dismissingTaskId={dismissingTaskId}
                    initiateDismissal={initiateDismissal}
                />

                <>
                    {completedTasks.length > 0 && (
                        <div className="mt-8">
                            <div onClick={() => setIsCompletedVisible(!isCompletedVisible)} className="cursor-pointer p-4 bg-surface rounded-themed flex justify-between items-center">
                                <h3 className="text-lg font-bold text-text-secondary font-header">{completedHeaderTitle} ({completedTasks.length})</h3>
                                <span className={`transition-transform duration-300 ${isCompletedVisible ? 'rotate-180' : ''}`}>▼</span>
                            </div>
                            {isCompletedVisible && (
                                <div className="mt-4 space-y-4 animate-themed-enter">
                                    {completedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                </div>
                            )}
                        </div>
                    )}
                    {dismissedTasks.length > 0 && (
                        <div className="mt-8">
                            <div onClick={() => setIsDismissedVisible(!isDismissedVisible)} className="cursor-pointer p-4 bg-surface rounded-themed flex justify-between items-center">
                                <h3 className="text-lg font-bold text-text-secondary font-header">{dismissedHeaderTitle} ({dismissedTasks.length})</h3>
                                <span className={`transition-transform duration-300 ${isDismissedVisible ? 'rotate-180' : ''}`}>▼</span>
                            </div>
                            {isDismissedVisible && (
                                <div className="mt-4 space-y-4 animate-themed-enter">
                                    {dismissedTasks.map(task => <TaskCard key={task.id} task={task} />)}
                                </div>
                            )}
                        </div>
                    )}
                </>
            </div>
            
            <ViewModals 
                isFrosted={isFrosted}
                isBulkEditModalOpen={interaction.isBulkEditModalOpen} 
                setIsBulkEditModalOpen={interaction.setIsBulkEditModalOpen} 
                selectedTaskIds={interaction.selectedTaskIds} 
                bulkEditDate={interaction.bulkEditDate}
                bulkUpdateTasks={bulkUpdateTasks}
                bulkCompleteTasks={bulkCompleteTasks}
                bulkDismissTasks={bulkDismissTasks}
                toggleSelectMode={interaction.toggleSelectMode}
                setBulkEditDate={interaction.setBulkEditDate}
            />
            {isCalendarOpen && (
                 <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center animate-themed-enter" onClick={() => setIsCalendarOpen(false)}>
                    <Calendar isFrosted={isFrosted} />
                 </div>
            )}
        </div>
    );
};