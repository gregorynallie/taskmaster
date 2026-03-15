import { useState, useMemo, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { Task, GroupByType, TimeOfDay } from '../types';
import { dateToYMD, getNewDateForTimeOfDay } from '../utils/dateUtils';
import { getAnimationVariant } from '../utils/animationUtils';
import { AnimationVariant } from '../src/animations';

interface UseTaskInteractionAndAnimationProps {
    tasks: Task[];
    sortedTasks: Task[];
    groupedTasks: { groupName: string; tasks: Task[] }[] | null;
    reorderTasks: (orderedTasks: Task[]) => void;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    isSuggestionsLoading: boolean;
    activeAnimations: Map<string, any>;
    groupBy: GroupByType;
}

export const useTaskInteractionAndAnimation = ({
    tasks,
    sortedTasks,
    groupedTasks,
    reorderTasks,
    updateTask,
    isSuggestionsLoading,
    activeAnimations,
    groupBy,
}: UseTaskInteractionAndAnimationProps) => {
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [liveOrderedTasks, setLiveOrderedTasks] = useState<Task[] | null>(null);
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    const [bulkEditDate, setBulkEditDate] = useState(new Date());

    const containerRef = useRef<HTMLDivElement>(null);
    const boundingBoxes = useRef(new Map<string, DOMRect>());
    const isInitialMount = useRef(true);
    const prevIsSuggestionsLoading = useRef(isSuggestionsLoading);
    const isDropping = useRef(false);
    const shuffleTimeoutRef = useRef<number | null>(null);
    const [isListShuffling, setIsListShuffling] = useState(false);
    const dropTargetId = useRef<string | null>(null);

    const toggleSelectMode = () => { setIsSelectMode(prev => !prev); setSelectedTaskIds(new Set()); };
    const toggleTaskSelection = (taskId: string) => {
        setSelectedTaskIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(taskId)) newSet.delete(taskId);
            else newSet.add(taskId);
            return newSet;
        });
    };
    const areAllSelected = useMemo(() => {
        const selectableTasks = sortedTasks.filter(t => !t.completed_at && !t.dismissed_at);
        if (selectableTasks.length === 0) return false;
        return selectedTaskIds.size === selectableTasks.length;
    }, [selectedTaskIds, sortedTasks]);
    const handleSelectAllToggle = () => {
        if (areAllSelected) { setSelectedTaskIds(new Set()); }
        else { const allSelectableIds = sortedTasks.filter(t => !t.completed_at && !t.dismissed_at).map(t => t.id); setSelectedTaskIds(new Set(allSelectableIds)); }
    };
    
    const handleDragStart = (id: string) => { 
        setDraggedId(id); 
        setLiveOrderedTasks(sortedTasks);
        dropTargetId.current = null;
    };

    const handleDragEnter = (targetId: string) => {
        dropTargetId.current = targetId;
        if (!draggedId || !liveOrderedTasks || draggedId === targetId) return;

        // Visual reorder only for manual sorting
        if (groupBy === 'none') {
            const draggedIndex = liveOrderedTasks.findIndex(t => t.id === draggedId);
            const targetIndex = liveOrderedTasks.findIndex(t => t.id === targetId);
            if (draggedIndex === -1 || targetIndex === -1) return;
            const reordered = [...liveOrderedTasks];
            const [draggedItem] = reordered.splice(draggedIndex, 1);
            reordered.splice(targetIndex, 0, draggedItem);
            setLiveOrderedTasks(reordered);
        }
    };

    const handleDrop = () => { 
        const targetId = dropTargetId.current;
    
        // Smart Drop Logic for Grouped Views
        if (groupBy !== 'none' && draggedId && targetId && draggedId !== targetId) {
            const draggedTask = tasks.find(t => t.id === draggedId);
            const targetTask = tasks.find(t => t.id === targetId);
            
            if (!draggedTask || !targetTask) { /* error handling */ return; }
    
            let updates: Partial<Task> = {};
            const targetGroup = groupedTasks?.find(g => g.tasks.some(t => t.id === targetId));
    
            if (targetGroup) {
                switch (groupBy) {
                    case 'category':
                        if (draggedTask.category !== targetGroup.groupName) {
                            updates.category = targetGroup.groupName;
                        }
                        break;
                    
                    case 'time_of_day':
                        const timeOfDayMap: Record<string, TimeOfDay> = { Morning: 'morning', Afternoon: 'day', Evening: 'night' };
                        const newTimeOfDay = timeOfDayMap[targetGroup.groupName];
                        if (newTimeOfDay && draggedTask.time_of_day !== newTimeOfDay) {
                            updates.scheduled_at = getNewDateForTimeOfDay(new Date(draggedTask.scheduled_at), newTimeOfDay).toISOString();
                            updates.time_of_day = newTimeOfDay;
                        }
                        break;
                    
                    case 'by_date':
                        const draggedDate = new Date(draggedTask.scheduled_at);
                        const targetDate = new Date(targetTask.scheduled_at);
                        if (dateToYMD(draggedDate) !== dateToYMD(targetDate)) {
                            draggedDate.setFullYear(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
                            updates.scheduled_at = draggedDate.toISOString();
                        }
                        break;
                }
            }
    
            if (Object.keys(updates).length > 0) {
                updateTask(draggedId, updates);
            }
        } 
        // Manual Reorder Logic
        else if (liveOrderedTasks && draggedId) { 
            isDropping.current = true; 
            reorderTasks(liveOrderedTasks); 
        } 
        
        setDraggedId(null); 
        setLiveOrderedTasks(null); 
        dropTargetId.current = null;
    };

    const handleDragEnd = () => { 
        setDraggedId(null); 
        setLiveOrderedTasks(null);
        dropTargetId.current = null;
    };
    
    const tasksToRender = liveOrderedTasks ?? sortedTasks;

    const initiateListShuffleAnimation = useCallback(() => {
        if (shuffleTimeoutRef.current) clearTimeout(shuffleTimeoutRef.current);
        const durationStr = getComputedStyle(document.documentElement).getPropertyValue('--transition-duration').trim();
        const durationMs = parseFloat(durationStr) * (durationStr.endsWith('ms') ? 1 : 1000);
        setIsListShuffling(true);
        shuffleTimeoutRef.current = window.setTimeout(() => { setIsListShuffling(false); shuffleTimeoutRef.current = null; }, durationMs + 50);
    }, []);

    useLayoutEffect(() => {
        const containerNode = containerRef.current;
        if (!containerNode) return;
        const newBoxes = new Map<string, DOMRect>();
        const taskNodes = containerNode.querySelectorAll<HTMLElement>('[data-task-id]');
        taskNodes.forEach(node => { const taskId = node.dataset.taskId; if (taskId) newBoxes.set(taskId, node.getBoundingClientRect()); });
        const suggestionsJustLoaded = prevIsSuggestionsLoading.current && !isSuggestionsLoading;
        prevIsSuggestionsLoading.current = isSuggestionsLoading;
        if (isInitialMount.current) { if (newBoxes.size > 0) { boundingBoxes.current = newBoxes; isInitialMount.current = false; } return; }
        if (suggestionsJustLoaded || draggedId || isDropping.current || activeAnimations.size > 0) { boundingBoxes.current = newBoxes; if (isDropping.current) isDropping.current = false; return; }
        let isAnimating = false;
        taskNodes.forEach(node => {
            const taskId = node.dataset.taskId; if (!taskId) return;
            const prevBox = boundingBoxes.current.get(taskId); const newBox = newBoxes.get(taskId);
            if (prevBox && newBox) {
                const deltaY = prevBox.top - newBox.top; const deltaX = prevBox.left - newBox.left;
                if (deltaY !== 0 || deltaX !== 0) {
                    isAnimating = true;
                    requestAnimationFrame(() => {
                        node.style.transform = `translate(${deltaX}px, ${deltaY}px)`; node.style.transition = 'transform 0s';
                        requestAnimationFrame(() => { node.style.transform = ''; node.style.transition = 'transform var(--transition-duration) var(--animation-timing-enter)'; });
                    });
                }
            }
        });
        if (isAnimating) initiateListShuffleAnimation();
        boundingBoxes.current = newBoxes;
    }, [tasksToRender, draggedId, groupedTasks, isSuggestionsLoading, activeAnimations, initiateListShuffleAnimation]);

    return {
        draggedId, liveOrderedTasks, isSelectMode, selectedTaskIds, isBulkEditModalOpen, setIsBulkEditModalOpen,
        bulkEditDate, setBulkEditDate, containerRef, isDropping, isListShuffling, tasksToRender, areAllSelected,
        toggleSelectMode, toggleTaskSelection, handleSelectAllToggle, handleDragStart, handleDragEnter, handleDrop, handleDragEnd,
    };
};