import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Task } from '../../types';
import { TaskCardActions } from './TaskCardActions';
import { formatRecurrenceRule } from '../../utils/dateUtils';
import { useSettings } from '../../contexts/SettingsProvider';

// This is a subset of the full TaskCardProps, only what the compact view needs.
interface TaskCardCompactProps {
    task: Task;
    cardRef: React.RefObject<HTMLDivElement>;
    entryAnimationClass: string;
    stateAnimationClass: string;
    isCompleting: boolean;
    isDismissing: boolean;
    isCompleted: boolean;
    isDraggable: boolean;
    isSelectModeActive: boolean;
    isSelected: boolean;
    isAnyTaskAnimating: boolean;
    isFrosted: boolean;
    
    // Event Handlers
    handleAnimationEnd: () => void;
    onDragStart?: () => void;
    onDragEnd?: () => void;
    onDragEnter?: () => void;
    onDrop?: () => void;
    onSelectToggle?: (taskId: string) => void;
    handleCompleteClick: () => void;
    onToggleCompact: () => void;
    onDismiss: () => void;
    onEdit: (field: 'title' | 'description') => void;
    onSetDueDate: () => void;

    // Display helpers
    deadlineInfo: { text: string; className: string } | null;
    displayTime: string;
}

export const TaskCardCompact: React.FC<TaskCardCompactProps> = ({
    task, cardRef, entryAnimationClass, stateAnimationClass, isCompleting, isDismissing, isCompleted, isDraggable,
    isSelectModeActive, isSelected, isAnyTaskAnimating, isFrosted, handleAnimationEnd, onDragStart, onDragEnd, onDragEnter,
    onDrop, onSelectToggle, handleCompleteClick, onToggleCompact, onDismiss, onEdit, onSetDueDate, deadlineInfo, displayTime
}) => {
    const { mode } = useSettings();
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

    return (
        <div
            ref={cardRef}
            data-task-id={task.id}
            onAnimationEnd={handleAnimationEnd}
            draggable={!isCompleted && !isDismissing && isDraggable && !isSelectModeActive && !isCompleting && !isDismissing}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragEnter={onDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => isSelectModeActive && !isCompleted && !isDismissing && onSelectToggle?.(task.id)}
            className={`
            ${entryAnimationClass} ${stateAnimationClass} ${!isCompleting && !isDismissing ? 'theme-hover' : ''} p-2 rounded-themed shadow-themed flex items-center gap-3 relative border-[length:var(--card-border-width)]
            ${isActionMenuOpen ? 'z-10' : ''}
            ${ isCompleting || isDismissing
                ? `border-accent bg-surface overflow-hidden` 
                : `${!isAnyTaskAnimating ? 'transition-all duration-themed ease-themed' : ''}
                    ${isCompleted ? 'bg-surface/50 border-secondary/30 opacity-60' : 'bg-surface border-secondary'}
                    ${!isCompleted && !isDismissing && isDraggable && !isSelectModeActive ? 'hover:border-primary cursor-grab' : ''}
                    ${isSelectModeActive && !isCompleted && !isDismissing ? 'cursor-pointer' : ''}
                    ${isSelected ? 'border-primary ring-2 ring-primary/50' : ''}`
            }
        `}>
             <div className="flex-shrink-0 flex items-center">
                {isSelectModeActive && !isCompleted && !isDismissing ? (
                    <div className="w-6 h-6 flex items-center justify-start" onClick={(e) => { e.stopPropagation(); onSelectToggle?.(task.id); }}>
                        <input type="checkbox" checked={isSelected} readOnly className="h-5 w-5 rounded text-primary bg-secondary border-secondary/50 focus:ring-primary focus:ring-offset-surface cursor-pointer" aria-label="Select task" />
                    </div>
                ) : (
                    <button onClick={(e) => { e.stopPropagation(); handleCompleteClick(); }} disabled={isCompleted || isDismissing || task.isEnriching} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${(isCompleted || isCompleting) ? 'bg-accent border-accent text-white' : 'border-text-secondary hover:border-accent'} ${!isCompleting ? 'theme-hover' : ''}`} aria-label={isCompleted ? 'Task completed' : 'Complete task'}>
                        {(isCompleted || isCompleting) && <span className="text-lg">✔</span>}
                    </button>
                )}
            </div>
            <div className="flex-1 min-w-0">
                {task.questName && (
                    <p className="text-xs font-bold text-primary uppercase tracking-wider truncate font-header">
                        {mode === 'rpg' ? 'Quest' : 'Project'}: {task.questName}
                    </p>
                )}
                <p className={`font-bold truncate ${(isCompleted || isCompleting || isDismissing) ? 'line-through text-text-secondary' : 'text-text-primary'}`}>{task.title}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary flex-wrap">
                    <span className="bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">{task.category}</span>
                    {task.recurring && (
                        <span title={formatRecurrenceRule(task.recurring)} className="text-accent/80 inline-flex items-center gap-1 font-semibold">
                            <span className="text-base">🔄</span>
                            <span>{formatRecurrenceRule(task.recurring, { concise: true })}</span>
                        </span>
                    )}
                    <span className="font-semibold">{displayTime}</span>
                    <span>{task.duration_min}m</span>
                    {deadlineInfo && <span className={`font-semibold ${deadlineInfo.className}`}>⏳</span>}
                    {mode === 'rpg' && <span className="font-bold text-accent">+{task.xp_estimate} XP</span>}
                </div>
            </div>
            <div className="flex items-center gap-1">
                 <TaskCardActions 
                    task={task}
                    isCompact={true}
                    isFrosted={isFrosted}
                    updateTask={() => {}} // Not needed in compact view actions
                    onToggleCompact={onToggleCompact}
                    onDismiss={onDismiss}
                    onEdit={onEdit}
                    onSetDueDate={onSetDueDate}
                    onComplete={handleCompleteClick}
                    isMenuOpen={isActionMenuOpen}
                    setIsMenuOpen={setIsActionMenuOpen}
                 />
                <button onClick={onToggleCompact} className="p-1 rounded-full hover:bg-secondary/50" aria-label="Expand task">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
