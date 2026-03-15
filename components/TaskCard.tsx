import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react';
import { Task, AnimationInfo, SortByType } from '../types';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { dateToYMD, formatRecurrenceRule } from '../utils/dateUtils';
import { InlineTaskSuggester } from './InlineTaskSuggester';
import { DeadlineEditor } from './task/DeadlineEditor';
import { TaskCardActions } from './task/TaskCardActions';
import { getAnimationVariant } from '../utils/animationUtils';
import { AddTaskAnimationVariant, AnimationVariant } from '../src/animations';
import { TaskCardEditor } from './task/TaskCardEditor';
import { TaskCardCompact } from './task/TaskCardCompact';
import { TaskCardScheduler } from './task/TaskCardScheduler';

interface TaskCardProps {
  task: Task;
  tasksForDay?: Task[];
  selectedDate?: Date;
  sortBy?: SortByType;
  willOrderChange?: (taskId: string, newProps: Partial<Task>) => boolean;
  isDraggable?: boolean;
  isDragged?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragEnter?: () => void;
  onDrop?: () => void;
  index?: number;
  totalTasks?: number;
  onMove?: (taskId: string, direction: 'up' | 'down') => void;
  isSelectModeActive?: boolean;
  isSelected?: boolean;
  onSelectToggle?: (taskId: string) => void;
  isCompact?: boolean;
  onToggleCompact?: () => void;
  animationInfo?: AnimationInfo;
  onAnimationComplete?: () => void;
  onTaskInserted?: () => void;
  isAnyTaskAnimating?: boolean;
  completingTaskId?: string | null;
  initiateCompletion?: (taskId: string) => void;
  dismissingTaskId?: string | null;
  initiateDismissal?: (taskId: string) => void;
  onShuffle?: (taskId: string) => void;
  // Sandbox-specific props
  isSandboxMode?: boolean;
  onCompletionAnimationEnd?: () => void;
  completionAnimationClass?: string;
}

const stringToColorStyle = (str: string) => {
    if (!str) return {};
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    const backgroundColor = `hsl(${h}, 70%, 40%)`; 
    const color = `hsl(${h}, 100%, 95%)`; 
    return { backgroundColor, color };
};

const renderDescriptionWithLinks = (text: string) => {
    if (!text) return text;
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = text.split(linkRegex);
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i += 3) {
        if (parts[i]) {
            elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
        }
        if (parts[i + 1] && parts[i + 2]) {
            elements.push(
                <a 
                    key={`link-${i}`} 
                    href={parts[i + 2]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-primary-focus transition-colors"
                    onClick={e => e.stopPropagation()}
                >
                    {parts[i + 1]}
                </a>
            );
        }
    }
    return elements;
};

const getDeadlineDisplay = (deadlineISO: string | null | undefined) => {
    if (!deadlineISO || isNaN(new Date(deadlineISO).getTime())) return null;

    const deadlineDate = new Date(deadlineISO);
    const now = new Date();
    const diffMillis = deadlineDate.getTime() - now.getTime();
    const diffHours = diffMillis / (1000 * 60 * 60);
    const diffDays = diffMillis / (1000 * 60 * 60 * 24);

    let className = 'text-text-secondary';
    if (diffHours < 0) { className = 'text-red-400 font-bold'; } 
    else if (diffHours < 24) { className = 'text-red-400 font-bold'; }
    else if (diffDays <= 7) { className = 'text-yellow-400 font-semibold'; }

    const hasTime = deadlineDate.getHours() !== 23 || deadlineDate.getMinutes() !== 59;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const deadlineDay = new Date(deadlineDate); deadlineDay.setHours(0, 0, 0, 0);

    let dateText = '';
    if (deadlineDay.getTime() === today.getTime()) { dateText = 'Today'; } 
    else if (deadlineDay.getTime() === tomorrow.getTime()) { dateText = 'Tomorrow'; }
    else if (diffDays > 1 && diffDays < 7) { dateText = deadlineDate.toLocaleDateString(undefined, { weekday: 'long' }); }
    else { dateText = deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); }

    const timeText = hasTime ? deadlineDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : '';
    let fullText = `Due ${dateText}`;
    if (timeText) { fullText += ` at ${timeText}`; }

    if (diffHours < 0) {
        const daysOverdue = Math.floor(Math.abs(diffDays));
        fullText = daysOverdue > 0 ? `Overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}` : `Overdue`;
    }
    return { text: fullText, className };
};

export const TaskCard: React.FC<TaskCardProps> = React.memo(({ 
    task, 
    tasksForDay = [],
    selectedDate,
    sortBy,
    willOrderChange,
    isDraggable = true, 
    isDragged = false,
    onDragStart,
    onDragEnd,
    onDragEnter,
    onDrop,
    index,
    totalTasks,
    onMove,
    isSelectModeActive = false,
    isSelected = false,
    onSelectToggle,
    isCompact = false,
    onToggleCompact,
    animationInfo,
    onAnimationComplete,
    onTaskInserted = () => {},
    isAnyTaskAnimating = false,
    completingTaskId = null,
    initiateCompletion,
    dismissingTaskId = null,
    initiateDismissal,
    onShuffle,
    isSandboxMode = false,
    onCompletionAnimationEnd,
    completionAnimationClass,
}) => {
    const { completeTask, dismissTask, rescheduleTaskForToday, rescheduleTask, updateTask, reEnrichTask, revertTaskToOriginalText } = useTasks();
    const { mode, theme } = useSettings();
    const [isEditing, setIsEditing] = useState(false);
    const [focusOnField, setFocusOnField] = useState<'title' | 'description' | null>(null);
    const [activeInserter, setActiveInserter] = useState<'above' | 'below' | null>(null);
    const [isPickingDeadline, setIsPickingDeadline] = useState(false);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    
    const [visualDate, setVisualDate] = useState(task.scheduled_at);

    const cardRef = useRef<HTMLDivElement>(null);
    
    const isCompleting = task.id === completingTaskId;
    const isDismissing = task.id === dismissingTaskId;
    const isCompleted = !!task.completed_at;
    
    const entryAnimationClass = useMemo(() => {
        if (!animationInfo || animationInfo.type !== 'add' || animationInfo.fromRect) return '';
        const animationVariant = getAnimationVariant<AddTaskAnimationVariant>(theme, 'addTask');
        return animationVariant.classes.taskEnter;
    }, [animationInfo, theme]);
    
    const completionAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'taskComplete'), [theme]);
    const dismissAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'dismissTask'), [theme]);

    useLayoutEffect(() => {
        const cardNode = cardRef.current;
        if (!animationInfo || !cardNode || !animationInfo.fromRect) return;

        const { fromRect } = animationInfo;
        const toRect = cardNode.getBoundingClientRect();

        const deltaX = fromRect.left - toRect.left;
        const deltaY = fromRect.top - toRect.top;
        const deltaW = fromRect.width / toRect.width;
        const deltaH = fromRect.height / toRect.height;

        cardNode.style.transformOrigin = 'top left';

        const animation = cardNode.animate(
            [
                { transform: `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`, opacity: 0 },
                { transform: 'none', opacity: 1 }
            ],
            {
                duration: 500,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                fill: 'forwards'
            }
        );
        
        animation.onfinish = () => {
            onAnimationComplete?.();
        };

    }, [animationInfo, onAnimationComplete]);

    useEffect(() => {
        setVisualDate(task.scheduled_at);
    }, [task.scheduled_at]);
    
    const formatDisplayDate = (isoString: string): string => {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const scheduledDate = new Date(isoString);
        if (isNaN(scheduledDate.getTime())) return "Invalid Date";
    
        const diffTime = new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate()).getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Tomorrow";
        if (diffDays > 1 && diffDays <= 7) return scheduledDate.toLocaleString(undefined, { weekday: 'long' });
        return scheduledDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    };

    const formatDisplayTime = (isoString: string): string => {
        const scheduledDate = new Date(isoString);
        if (isNaN(scheduledDate.getTime())) return "";
        return scheduledDate.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    };

    const deadlineInfo = useMemo(() => getDeadlineDisplay(task.deadline_at), [task.deadline_at]);
    const descriptionContent = useMemo(() => renderDescriptionWithLinks(task.description), [task.description]);

    const handleRemoveDeadline = useCallback(() => {
        updateTask(task.id, { deadline_at: null });
        setIsPickingDeadline(false);
    }, [task.id, updateTask]);

    const handleCompleteClick = useCallback(() => {
        if (isCompleted || isDismissing || task.isEnriching || isEditing || !!completingTaskId) return;
        initiateCompletion?.(task.id);
    }, [isCompleted, isDismissing, task.isEnriching, isEditing, completingTaskId, initiateCompletion, task.id]);

    const handleDismissClick = useCallback(() => {
        if (isCompleted || isDismissing || task.isEnriching || isEditing || !!completingTaskId) return;
        initiateDismissal?.(task.id);
    }, [isCompleted, isDismissing, task.isEnriching, isEditing, completingTaskId, initiateDismissal, task.id]);

    const handleAnimationEnd = useCallback(() => {
        if (isCompleting) { isSandboxMode ? onCompletionAnimationEnd?.() : completeTask(task.id); }
        if (isDismissing) { dismissTask(task.id); }
        if (animationInfo) { onAnimationComplete?.(); }
    }, [isCompleting, isSandboxMode, onCompletionAnimationEnd, completeTask, task.id, isDismissing, dismissTask, animationInfo, onAnimationComplete]);
    
    const handleEdit = useCallback((fieldToFocus: 'title' | 'description') => {
        if (isCompleted || isDismissing || task.isEnriching || isSelectModeActive || isCompleting) return;
        setFocusOnField(fieldToFocus);
        setIsEditing(true);
    }, [isCompleted, isDismissing, task.isEnriching, isSelectModeActive, isCompleting]);

    const handleSave = useCallback((updates: Partial<Task>) => {
        updateTask(task.id, updates);
        setIsEditing(false);
        setFocusOnField(null);
    }, [task.id, updateTask]);

    const handleCancel = useCallback(() => {
        setIsEditing(false);
        setFocusOnField(null);
    }, []);
    
    const handleReEnrich = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        await reEnrichTask(task.id);
    }, [reEnrichTask, task.id]);

    const isUpcoming = !isCompleted && !isDismissing && dateToYMD(visualDate) > dateToYMD(new Date());
    
    const handleDateArrowClick = useCallback((direction: 'prev' | 'next') => {
        if (isSelectModeActive) return;
        const currentDate = new Date(visualDate);
        currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        const newDate = currentDate;
        setVisualDate(newDate.toISOString());
        rescheduleTask(task.id, newDate);
    }, [isSelectModeActive, visualDate, rescheduleTask, task.id]);

    const handleTimeArrowClick = useCallback((direction: 'prev' | 'next') => {
        if (isSelectModeActive) return;
        const currentDate = new Date(visualDate);
        const increment = direction === 'next' ? 30 : -30;
        currentDate.setMinutes(currentDate.getMinutes() + increment);
        const newDate = currentDate;
        setVisualDate(newDate.toISOString());
        updateTask(task.id, { scheduled_at: newDate.toISOString() });
    }, [isSelectModeActive, visualDate, updateTask, task.id]);

    const isEditable = !isCompleted && !isDismissing && !task.isEnriching && !isSelectModeActive && !isCompleting;
    const showReEnrichButton = isEditable && task.original_input && task.title === task.original_input;
    const showRevertButton = isEditable && task.original_input && task.title !== task.original_input;

    const isFrosted = theme === 'ocean-mist';
    const showInserters = !isEditing && !isSelectModeActive && !isCompleted && !isDismissing && !activeInserter && !isAnyTaskAnimating;
    
    let stateAnimationClass = '';
    if (isCompleting) stateAnimationClass = isSandboxMode ? (completionAnimationClass ?? completionAnimation.className) : completionAnimation.className;
    if (isDismissing) stateAnimationClass = dismissAnimation.className;

    if (isCompact) {
        return (
            <TaskCardCompact
                task={task}
                cardRef={cardRef}
                entryAnimationClass={entryAnimationClass}
                stateAnimationClass={stateAnimationClass}
                isCompleting={isCompleting}
                isDismissing={isDismissing}
                isCompleted={isCompleted}
                isDraggable={isDraggable}
                isSelectModeActive={isSelectModeActive}
                isSelected={isSelected}
                isAnyTaskAnimating={isAnyTaskAnimating}
                isFrosted={isFrosted}
                handleAnimationEnd={handleAnimationEnd}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragEnter={onDragEnter}
                onDrop={onDrop}
                onSelectToggle={onSelectToggle}
                handleCompleteClick={handleCompleteClick}
                onToggleCompact={onToggleCompact!}
                onDismiss={handleDismissClick}
                onEdit={handleEdit}
                onSetDueDate={() => setIsPickingDeadline(true)}
                deadlineInfo={deadlineInfo}
                displayTime={formatDisplayTime(visualDate)}
            />
        )
    }

    return (
    <div 
        ref={cardRef}
        className={`relative group/wrapper ${isActionMenuOpen ? 'z-30' : ''}`}
    >
        {activeInserter === 'above' && (
          <InlineTaskSuggester
              taskBelow={task}
              tasksForDay={tasksForDay}
              sortBy={'manual'}
              groupBy={'none'}
              activeFilters={{ categories: [], timesOfDay: [], duration: null }}
              onClose={() => setActiveInserter(null)}
              onTaskInserted={onTaskInserted}
          />
        )}
        
        <div className={`
            absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 z-20
            transition-opacity duration-200 
            ${showInserters ? 'opacity-0 group-hover/wrapper:opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
            <button
                onClick={() => setActiveInserter('above')}
                className="w-full h-full bg-primary hover:bg-primary-focus rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                aria-label="Add task above"
            >
                +
            </button>
        </div>

        <div 
            data-task-id={task.id}
            onAnimationEnd={handleAnimationEnd}
            draggable={!isCompleted && !isDismissing && !isEditing && isDraggable && !isSelectModeActive && !isCompleting}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragEnter={onDragEnter}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            onClick={() => isSelectModeActive && !isCompleted && !isDismissing && onSelectToggle?.(task.id)}
            className={`
            ${entryAnimationClass} ${stateAnimationClass} ${!isCompleting && !isDismissing ? 'theme-hover' : ''} p-4 rounded-themed shadow-themed flex items-start gap-4 relative border-[length:var(--card-border-width)]
            ${!isAnyTaskAnimating ? 'transition-[opacity,background-color,border-color] duration-themed ease-themed' : ''}
            ${ isCompleting || isDismissing
                ? `border-accent bg-surface overflow-hidden` 
                : `${isCompleted ? 'bg-surface/50 border-secondary/30 opacity-60' : 'bg-surface border-secondary'}
                    ${!isCompleted && !isDismissing && !isEditing && isDraggable && !isSelectModeActive ? 'group-hover/wrapper:border-primary cursor-grab' : ''}
                    ${isSelectModeActive && !isCompleted && !isDismissing ? 'cursor-pointer' : ''}
                    ${isSelected ? 'border-primary ring-2 ring-primary/50' : ''}
                    ${isEditing ? 'border-primary ring-2 ring-primary/50' : ''}
                    ${isDragged ? 'opacity-30' : ''}`
            }
        `}>
            <div className="flex-shrink-0 flex items-center mt-1">
                {isSelectModeActive && !isCompleted && !isDismissing ? (
                     <div 
                        className="w-6 h-6 flex items-center justify-start"
                        onClick={(e) => { e.stopPropagation(); onSelectToggle?.(task.id); }}
                    >
                        <input 
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="h-5 w-5 rounded text-primary bg-secondary border-secondary/50 focus:ring-primary focus:ring-offset-surface cursor-pointer"
                            aria-label="Select task"
                        />
                    </div>
                ) : (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleCompleteClick(); }}
                        disabled={isCompleted || isDismissing || task.isEnriching || isEditing}
                        className={`
                            ${!isCompleting ? 'theme-hover' : ''} w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                            ${(isCompleted || isCompleting) ? 'bg-accent border-accent text-white' : 'border-text-secondary hover:border-accent'}
                        `}
                        aria-label={isCompleted ? 'Task completed' : 'Complete task'}
                    >
                        {(isCompleted || isCompleting) && <span className="text-lg">✔</span>}
                    </button>
                )}
            </div>
            <div className="flex-1 min-w-0">
                {task.questName && (
                    <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1 font-header">
                        {mode === 'rpg' ? 'Quest' : 'Project'}: {task.questName}
                    </p>
                )}

                {isEditing && focusOnField ? (
                    <TaskCardEditor
                        task={task}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        focusOnField={focusOnField}
                    />
                ) : (
                    <div>
                        <div 
                            onClick={() => isEditable && handleEdit('title')}
                            className={`font-bold flex items-center gap-2 flex-wrap ${(isCompleted || isCompleting || isDismissing) ? 'text-text-secondary' : 'text-text-primary'} ${isEditable ? 'cursor-text' : ''}`}
                        >
                            <span className={(isCompleted || isCompleting || isDismissing) ? 'line-through' : ''}>{task.title}</span>
                            {task.recurring && (
                                <span 
                                    title={formatRecurrenceRule(task.recurring)} 
                                    className="text-accent/90 text-xs font-semibold inline-flex items-center gap-1.5 bg-accent/10 px-2 py-1 rounded-full"
                                >
                                    <span className="text-sm">🔄</span>
                                    <span>{formatRecurrenceRule(task.recurring, { concise: true })}</span>
                                </span>
                            )}
                            {showReEnrichButton && (
                                <button
                                    onClick={handleReEnrich}
                                    className="theme-hover text-accent/70 hover:text-accent transition opacity-50 hover:opacity-100"
                                    aria-label="Re-enrich Task with AI"
                                    disabled={task.isEnriching}
                                >✨</button>
                            )}
                        </div>
                        {task.isEnriching ? (
                             <div className="mt-2">
                               <p className="text-sm text-text-secondary animate-pulse italic">Enhancing...</p>
                            </div>
                        ) : (
                            <>
                                <p 
                                    onClick={() => isEditable && handleEdit('description')}
                                    className={`text-sm text-text-secondary mt-1 ${isEditable ? 'cursor-text' : ''}`}
                                >
                                    {descriptionContent}
                                </p>
                                {showRevertButton && (
                                    <div className="mt-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                revertTaskToOriginalText(task.id);
                                            }}
                                            className="theme-hover text-xs text-accent/80 hover:text-accent hover:underline transition"
                                        >
                                            [Use my original text instead]
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
                
                {!isEditing && !task.isEnriching && !isDismissing && (
                    <>
                        <div className="flex items-center gap-4 mt-3 text-xs flex-wrap">
                            {task.isHybrid && task.hybridCategoryName ? (
                                <span 
                                    className="font-semibold px-2 py-1 rounded-full"
                                    style={stringToColorStyle(task.hybridCategoryName)}
                                >
                                    ✨ {task.hybridCategoryName}
                                </span>
                            ) : (
                                <span className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{task.category}</span>
                            )}
                            <span className="text-text-secondary">{task.duration_min} min</span>
                            {mode === 'rpg' && <span className="font-bold text-accent">+{task.xp_estimate} XP</span>}

                            {!isPickingDeadline && !isCompleted && !isDismissing && (
                                deadlineInfo ? (
                                    <div className={`flex items-center rounded-full ${deadlineInfo.className.includes('red') ? 'bg-red-900/50' : deadlineInfo.className.includes('yellow') ? 'bg-yellow-900/50' : 'bg-secondary/30'} group`}>
                                        <button onClick={() => setIsPickingDeadline(true)} className="theme-hover flex items-center gap-1.5 pl-2 pr-1 py-1 text-left">
                                            <span className="text-sm">⏳</span>
                                            <span className={`${deadlineInfo.className}`}>{deadlineInfo.text}</span>
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleRemoveDeadline(); }}
                                            className="theme-hover pr-2 pl-1 text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                            aria-label="Clear due date"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsPickingDeadline(true)} className="theme-hover text-text-secondary hover:text-text-primary flex items-center gap-1.5 bg-secondary/30 hover:bg-secondary px-2 py-1 rounded-full transition">
                                        <span className="text-sm">📅</span>
                                        <span>Set Due Date</span>
                                    </button>
                                )
                            )}
                            {isPickingDeadline && (
                                <DeadlineEditor task={task} onClose={() => setIsPickingDeadline(false)} />
                            )}
                        </div>
                        
                        {!isCompleted && (
                             <TaskCardScheduler 
                                task={task}
                                visualDate={visualDate}
                                isSelectModeActive={isSelectModeActive}
                                isUpcoming={isUpcoming}
                                displayDateString={formatDisplayDate(visualDate)}
                                displayTimeString={formatDisplayTime(visualDate)}
                                onDateArrowClick={handleDateArrowClick}
                                onTimeArrowClick={handleTimeArrowClick}
                                isScheduleModalOpen={isScheduleModalOpen}
                                onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
                                onCloseScheduleModal={() => setIsScheduleModalOpen(false)}
                                rescheduleTaskForToday={rescheduleTaskForToday}
                             />
                        )}
                    </>
                )}
            </div>
            <div className="absolute right-2 top-2 flex flex-col items-center gap-2">
                {!isEditing && !isCompleted && !isDismissing && onToggleCompact && (
                    <button onClick={onToggleCompact} className="p-1 rounded-full hover:bg-secondary/50" aria-label="Collapse task">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                )}
                {!isCompleted && !isDismissing && !isSelectModeActive && !isEditing && (
                    <TaskCardActions 
                        task={task}
                        isCompact={false}
                        isFrosted={isFrosted}
                        updateTask={updateTask}
                        onToggleCompact={onToggleCompact!}
                        onEdit={handleEdit}
                        onSetDueDate={() => setIsPickingDeadline(true)}
                        onComplete={handleCompleteClick}
                        onDismiss={handleDismissClick}
                        onShuffle={onShuffle}
                        isMenuOpen={isActionMenuOpen}
                        setIsMenuOpen={setIsActionMenuOpen}
                    />
                )}
            </div>
        </div>
        
        <div className={`
            absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 z-20
            transition-opacity duration-200 
            ${showInserters ? 'opacity-0 group-hover/wrapper:opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
             <button
                onClick={() => setActiveInserter('below')}
                className="w-full h-full bg-primary hover:bg-primary-focus rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                aria-label="Add task below"
            >
                +
            </button>
        </div>

      {activeInserter === 'below' && (
            <InlineTaskSuggester
                taskAbove={task}
                tasksForDay={tasksForDay}
                sortBy={'manual'}
                groupBy={'none'}
                activeFilters={{ categories: [], timesOfDay: [], duration: null }}
                onClose={() => setActiveInserter(null)}
                onTaskInserted={onTaskInserted}
            />
        )}
    </div>
    );
});