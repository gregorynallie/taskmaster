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
    completingTaskId: string | null;
    dismissingTaskId: string | null;
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
    completingTaskId,
    dismissingTaskId,
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
    const completingTaskIdRef = useRef<string | null>(completingTaskId);
    const dismissingTaskIdRef = useRef<string | null>(dismissingTaskId);
    const isFlipReadyRef = useRef(false);
    const taskGroupMapRef = useRef<Map<string, string>>(new Map());
    const groupOffsetsRef = useRef<Map<string, { top: number; left: number }>>(new Map());

    useEffect(() => {
        completingTaskIdRef.current = completingTaskId;
    }, [completingTaskId]);

    useEffect(() => {
        dismissingTaskIdRef.current = dismissingTaskId;
    }, [dismissingTaskId]);

    useEffect(() => {
        let isCancelled = false;

        const primeBoundingBoxes = () => {
            const containerNode = containerRef.current;
            if (!containerNode) return;

            const seededBoxes = new Map<string, DOMRect>();
            const seededGroups = new Map<string, string>();
            const seededGroupOffsets = new Map<string, { top: number; left: number }>();
            const groupNodes = containerNode.querySelectorAll<HTMLElement>('[data-flip-group]');
            groupNodes.forEach(node => {
                const groupName = node.dataset.flipGroup;
                if (!groupName) return;
                const rect = node.getBoundingClientRect();
                seededGroupOffsets.set(groupName, { top: rect.top, left: rect.left });
            });
            const taskNodes = containerNode.querySelectorAll<HTMLElement>('[data-task-id]');
            taskNodes.forEach(node => {
                const taskId = node.dataset.taskId;
                if (!taskId) return;
                seededBoxes.set(taskId, node.getBoundingClientRect());
                const groupContainer = node.closest<HTMLElement>('[data-flip-group]');
                seededGroups.set(taskId, groupContainer?.dataset.flipGroup || '__all__');
            });

            if (seededBoxes.size > 0) {
                boundingBoxes.current = seededBoxes;
                taskGroupMapRef.current = seededGroups;
                groupOffsetsRef.current = seededGroupOffsets;
                isInitialMount.current = false;
            }
        };

        const markFlipReady = () => {
            if (isCancelled) return;
            isFlipReadyRef.current = true;
            primeBoundingBoxes();
        };

        const fonts = 'fonts' in document ? (document as Document & { fonts: FontFaceSet }).fonts : null;
        const isFontsLoaded = !fonts || fonts.status === 'loaded';
        if (isFontsLoaded) {
            markFlipReady();
            return () => {
                isCancelled = true;
            };
        }

        const fallbackTimer = window.setTimeout(markFlipReady, 1500);
        fonts.ready
            .then(() => {
                window.clearTimeout(fallbackTimer);
                markFlipReady();
            })
            .catch(() => {
                window.clearTimeout(fallbackTimer);
                markFlipReady();
            });

        return () => {
            isCancelled = true;
            window.clearTimeout(fallbackTimer);
        };
    }, []);

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
        const newTaskGroups = new Map<string, string>();
        const newGroupOffsets = new Map<string, { top: number; left: number }>();
        const groupNodes = containerNode.querySelectorAll<HTMLElement>('[data-flip-group]');
        groupNodes.forEach(node => {
            const groupName = node.dataset.flipGroup;
            if (!groupName) return;
            const rect = node.getBoundingClientRect();
            newGroupOffsets.set(groupName, { top: rect.top, left: rect.left });
        });
        const taskNodes = containerNode.querySelectorAll<HTMLElement>('[data-task-id]');
        taskNodes.forEach(node => {
            const taskId = node.dataset.taskId;
            if (!taskId) return;
            newBoxes.set(taskId, node.getBoundingClientRect());
            const groupContainer = node.closest<HTMLElement>('[data-flip-group]');
            newTaskGroups.set(taskId, groupContainer?.dataset.flipGroup || '__all__');
        });
        const suggestionsJustLoaded = prevIsSuggestionsLoading.current && !isSuggestionsLoading;
        prevIsSuggestionsLoading.current = isSuggestionsLoading;
        const isCompletingCardStillVisible = !!completingTaskIdRef.current && newBoxes.has(completingTaskIdRef.current);
        const isDismissingCardStillVisible = !!dismissingTaskIdRef.current && newBoxes.has(dismissingTaskIdRef.current);
        if (!isFlipReadyRef.current) {
            if (newBoxes.size > 0) {
                boundingBoxes.current = newBoxes;
                taskGroupMapRef.current = newTaskGroups;
                groupOffsetsRef.current = newGroupOffsets;
                isInitialMount.current = false;
            }
            return;
        }
        if (isInitialMount.current) {
            if (newBoxes.size > 0) {
                boundingBoxes.current = newBoxes;
                taskGroupMapRef.current = newTaskGroups;
                groupOffsetsRef.current = newGroupOffsets;
                isInitialMount.current = false;
            }
            return;
        }
        if (
            suggestionsJustLoaded ||
            draggedId ||
            isDropping.current ||
            activeAnimations.size > 0 ||
            isCompletingCardStillVisible ||
            isDismissingCardStillVisible
        ) {
            boundingBoxes.current = newBoxes;
            taskGroupMapRef.current = newTaskGroups;
            groupOffsetsRef.current = newGroupOffsets;
            if (isDropping.current) isDropping.current = false;
            return;
        }
        let isAnimating = false;
        taskNodes.forEach(node => {
            const taskId = node.dataset.taskId; if (!taskId) return;
            // Let the active card's own completion/dismiss animation run without extra FLIP transforms.
            if (taskId === completingTaskIdRef.current || taskId === dismissingTaskIdRef.current) return;
            const prevBox = boundingBoxes.current.get(taskId); const newBox = newBoxes.get(taskId);
            if (prevBox && newBox) {
                const prevGroup = taskGroupMapRef.current.get(taskId) || '__all__';
                const nextGroup = newTaskGroups.get(taskId) || '__all__';
                // Avoid FLIP across group boundaries (Today -> Tomorrow, etc.) to prevent jerk.
                if (prevGroup !== nextGroup) return;
                const prevGroupOffset = groupOffsetsRef.current.get(prevGroup) || { top: 0, left: 0 };
                const nextGroupOffset = newGroupOffsets.get(nextGroup) || { top: 0, left: 0 };
                // Compute movement relative to each group's container to avoid cross-group layout jitter.
                const deltaY = (prevBox.top - prevGroupOffset.top) - (newBox.top - nextGroupOffset.top);
                const deltaX = (prevBox.left - prevGroupOffset.left) - (newBox.left - nextGroupOffset.left);
                if (Math.abs(deltaY) > 300 || Math.abs(deltaX) > 300) return;
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
        taskGroupMapRef.current = newTaskGroups;
        groupOffsetsRef.current = newGroupOffsets;
    }, [tasksToRender, draggedId, groupedTasks, groupBy, isSuggestionsLoading, activeAnimations, initiateListShuffleAnimation]);

    return {
        draggedId, liveOrderedTasks, isSelectMode, selectedTaskIds, isBulkEditModalOpen, setIsBulkEditModalOpen,
        bulkEditDate, setBulkEditDate, containerRef, isDropping, isListShuffling, tasksToRender, areAllSelected,
        toggleSelectMode, toggleTaskSelection, handleSelectAllToggle, handleDragStart, handleDragEnter, handleDrop, handleDragEnd,
    };
};