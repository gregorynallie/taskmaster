import React from 'react';
import { Task, Suggestion, AnimationInfo } from '../../types';
import { TaskCard } from '../TaskCard';
import { SmartInserter } from '../SmartInserter';
import { SuggestedTaskPreviewCard } from '../SuggestedTaskPreviewCard';
import { SuggestedTaskCardSkeleton } from '../SuggestedTaskCardSkeleton';
import { useViewOptions } from '../../contexts/ViewOptionsProvider';

interface TaskListProps {
    containerRef: React.RefObject<HTMLDivElement>;
    tasksToRender: Task[];
    dailySuggestions: Suggestion[];
    isSuggestionsLoading: boolean;
    suggestionsError: string | null;
    emptyDayText: string;
    emptyAllText: string;
    draggedId: string | null;
    isSelectMode: boolean;
    selectedTaskIds: Set<string>;
    activeAnimations: Map<string, AnimationInfo>;
    clearAnimation: (taskId: string) => void;
    onTaskInserted: () => void;
    
    handleDragStart: (id: string) => void;
    handleDragEnd: () => void;
    handleDragEnter: (id: string) => void;
    handleDrop: () => void;
    moveTask: (taskId: string, direction: 'up' | 'down') => void;
    toggleTaskSelection: (id: string) => void;
    acceptSuggestion: (suggestion: Suggestion, index: number, fromRect: DOMRect) => void;
    shuffleSingleSuggestion: (index: number) => void;

    isAnyTaskAnimating: boolean;
    completingTaskId: string | null;
    initiateCompletion: (taskId: string) => void;
    dismissingTaskId: string | null;
    initiateDismissal: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = React.memo((props) => {
    const {
        containerRef, tasksToRender, dailySuggestions, isSuggestionsLoading, suggestionsError,
        emptyDayText, emptyAllText, draggedId, isSelectMode, selectedTaskIds, activeAnimations,
        clearAnimation, onTaskInserted, handleDragStart, handleDragEnd, handleDragEnter, handleDrop,
        moveTask, toggleTaskSelection, acceptSuggestion, shuffleSingleSuggestion, isAnyTaskAnimating,
        completingTaskId, initiateCompletion, dismissingTaskId, initiateDismissal
    } = props;

    const {
        groupedTasks, collapsedGroups, toggleGroupCollapse, defaultCardStyle, compactOverrides,
        toggleCompactOverride, sortBy, groupBy, activeTasks, activeCategoryFilters, activeTimeOfDayFilters,
        activeDurationFilter, willOrderChange, focusedDate
    } = useViewOptions();
    
    const activeFilters = {
        categories: Array.from(activeCategoryFilters),
        timesOfDay: Array.from(activeTimeOfDayFilters),
        duration: activeDurationFilter,
    };

    const renderTaskList = (taskList: Task[]) => {
        const smartInserterProps = { tasksForDay: activeTasks, sortBy, groupBy, activeFilters, isSelectMode, onTaskInserted };
        const items: React.ReactNode[] = [];
        taskList.forEach((task, index) => {
            const isCompact = defaultCardStyle === 'compact' ? !compactOverrides.has(task.id) : compactOverrides.has(task.id);
            items.push(
                <TaskCard
                    key={task.id} task={task} tasksForDay={taskList} selectedDate={focusedDate ?? undefined} sortBy={sortBy} 
                    willOrderChange={willOrderChange} isDraggable={!isSelectMode} isDragged={draggedId === task.id} 
                    onDragStart={() => handleDragStart(task.id)} onDragEnd={handleDragEnd} onDragEnter={() => handleDragEnter(task.id)} 
                    onDrop={handleDrop} index={index} totalTasks={taskList.length} onMove={moveTask} 
                    isSelectModeActive={isSelectMode} isSelected={selectedTaskIds.has(task.id)} onSelectToggle={toggleTaskSelection} 
                    initiateDismissal={initiateDismissal} dismissingTaskId={dismissingTaskId} isAnyTaskAnimating={isAnyTaskAnimating}
                    isCompact={isCompact} onToggleCompact={() => toggleCompactOverride(task.id)}
                    animationInfo={activeAnimations.get(task.id)} onAnimationComplete={() => clearAnimation(task.id)}
                    onTaskInserted={onTaskInserted} completingTaskId={completingTaskId} initiateCompletion={initiateCompletion}
                />
            );
            if (index < taskList.length - 1) {
                items.push( <SmartInserter key={`inserter-${task.id}`} taskAbove={task} taskBelow={taskList[index + 1]} {...smartInserterProps} /> );
            }
        });
        return items;
    };

    return (
        <div ref={containerRef}>
            {groupedTasks && groupedTasks.length > 0 ? (
                groupedTasks.map(({ groupName, tasks: groupTasks }) => (
                    <div key={groupName} className="p-2 bg-surface/50 rounded-themed mb-4">
                        <button onClick={() => toggleGroupCollapse(groupName)} className="w-full text-left flex items-center p-2 rounded-themed hover:bg-secondary/50">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-text-primary capitalize font-header">{groupName} ({groupTasks.length})</h3>
                                <span className="text-text-secondary">
                                    {collapsedGroups.has(groupName) ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /> </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}> <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /> </svg>
                                    )}
                                </span>
                            </div>
                        </button>
                        {!collapsedGroups.has(groupName) && ( <div className="pt-2"> {renderTaskList(groupTasks)} </div> )}
                    </div>
                ))
            ) : tasksToRender.length > 0 ? (
                <div className="space-y-0"> {renderTaskList(tasksToRender)} </div>
            ) : null}

            {groupBy === 'none' && activeTasks.length < 3 && !isSuggestionsLoading && !suggestionsError && dailySuggestions.length > 0 &&
                <div className="mt-4 space-y-4">
                {dailySuggestions.slice(0, 3 - activeTasks.length).map((suggestion, index) => (
                    <SuggestedTaskPreviewCard
                        key={suggestion.id || `preview-${index}`}
                        suggestion={suggestion}
                        onAccept={(fromRect) => acceptSuggestion(suggestion, index, fromRect)}
                        onShuffle={() => shuffleSingleSuggestion(index)}
                    />
                ))}
                </div>
            }
            
            {activeTasks.length === 0 && isSuggestionsLoading && ( <div className="mt-4"> <SuggestedTaskCardSkeleton /> </div> )}
            {activeTasks.length === 0 && !isSuggestionsLoading && suggestionsError && ( <div className="text-center p-8 bg-surface rounded-themed"> <p className="text-text-secondary">Try adding a task above!</p> </div> )}
            {activeTasks.length === 0 && !isSuggestionsLoading && !suggestionsError && dailySuggestions.length === 0 && ( <div className="text-center p-8 bg-surface rounded-themed"> <p className="text-text-secondary">{focusedDate === null ? emptyAllText : emptyDayText}</p> </div> )}
        </div>
    );
});