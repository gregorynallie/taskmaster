import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'firebase/auth';
import { db } from '../services/firebase';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    writeBatch,
    serverTimestamp,
    Timestamp,
    orderBy,
} from 'firebase/firestore';
import {
    Task,
    Quest,
    Suggestion,
    EnrichedTaskData,
    Mode,
    AnimationInfo,
    RecurringInfo,
    OnboardingAnswers,
} from '../types';
import * as claudeService from '../services/claudeService';
import { dateToYMD, calculateNextOccurrence } from '../utils/dateUtils';
import { PREDEFINED_PERSONAS } from '../src/onboardingContent';

interface TaskManagerProps {
    user: User | null;
    userProfile: any;
    gamificationActions: {
        awardXpForTaskCompletion: (completedTask: Task, allTasks: Task[], allQuests: Quest[]) => void;
        awardXpForBulkCompletion: (completedTasks: Task[], allTasks: Task[], allQuests: Quest[]) => void;
    };
    settings: {
        setHasOnboarded: (has: boolean) => void;
    };
    userProfileActions: {
        updateUserProfile: (updates: Partial<any>) => void;
    };
    playSound: (sound: string) => void;
}

const determineScheduledAt = (enrichedData: Partial<Task>, contextDate: Date): string => {
    if (enrichedData.scheduled_at) {
        try {
            const preScheduledDate = new Date(enrichedData.scheduled_at);
            if (!isNaN(preScheduledDate.getTime())) {
                return preScheduledDate.toISOString();
            }
        } catch (e) {
            console.warn('Invalid date format, falling back to default scheduling:', enrichedData.scheduled_at);
        }
    }

    const now = new Date();
    let scheduledDate = new Date(contextDate);

    if (dateToYMD(contextDate) < dateToYMD(now)) {
        scheduledDate = new Date();
    }

    const isSchedulingForToday = dateToYMD(scheduledDate) === dateToYMD(now);

    if (isSchedulingForToday) {
        const currentHour = now.getHours();
        if (currentHour < 17) {
            scheduledDate.setHours(19, 0, 0, 0);
        } else {
            scheduledDate.setHours(now.getHours() + 1, now.getMinutes(), 0, 0);
        }
    } else {
        scheduledDate.setHours(9, 0, 0, 0);
    }

    return scheduledDate.toISOString();
};

export const useTaskManager = ({ user, userProfile, gamificationActions, settings, userProfileActions, playSound }: TaskManagerProps) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeAnimations, setActiveAnimations] = useState<Map<string, AnimationInfo>>(new Map());
    const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
    const [dismissingTaskId, setDismissingTaskId] = useState<string | null>(null);

    // --- Firestore subscriptions ---

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setQuests([]);
            setIsLoading(false);
            settings.setHasOnboarded(false);
            return;
        }

        setIsLoading(true);
        const tasksQuery = query(collection(db, 'users', user.uid, 'tasks'), orderBy('created_at', 'asc'));
        const questsQuery = query(collection(db, 'users', user.uid, 'quests'), orderBy('created_at', 'asc'));

        const unsubscribeTasks = onSnapshot(tasksQuery, (snapshot) => {
            const tasksData = snapshot.docs.map(d => {
                const data = d.data();
                return {
                    ...data,
                    id: d.id,
                    created_at: (data.created_at as Timestamp)?.toDate(),
                    completed_at: (data.completed_at as Timestamp)?.toDate() || null,
                    dismissed_at: (data.dismissed_at as Timestamp)?.toDate() || null,
                } as Task;
            });
            setTasks(tasksData);
            settings.setHasOnboarded(tasksData.length > 0);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching tasks:', error);
            setIsLoading(false);
        });

        const unsubscribeQuests = onSnapshot(questsQuery, (snapshot) => {
            const questsData = snapshot.docs.map(d => {
                const data = d.data();
                return {
                    ...data,
                    id: d.id,
                    created_at: (data.created_at as Timestamp)?.toDate(),
                    completed_at: (data.completed_at as Timestamp)?.toDate() || null,
                } as Quest;
            });
            setQuests(questsData);
        }, (error) => {
            console.error('Error fetching quests:', error);
        });

        return () => {
            unsubscribeTasks();
            unsubscribeQuests();
        };
    }, [user, settings.setHasOnboarded]);

    // Keep transitional IDs active until Firestore snapshot reflects the state change.
    // This avoids a brief visual rollback that can cause completion/dismiss jitter.
    useEffect(() => {
        if (!completingTaskId) return;
        const task = tasks.find(t => t.id === completingTaskId);
        if (!task || !!task.completed_at || !!task.dismissed_at) {
            setCompletingTaskId(null);
        }
    }, [tasks, completingTaskId]);

    useEffect(() => {
        if (!dismissingTaskId) return;
        const task = tasks.find(t => t.id === dismissingTaskId);
        if (!task || !!task.dismissed_at || !!task.completed_at) {
            setDismissingTaskId(null);
        }
    }, [tasks, dismissingTaskId]);

    // --- Animation helpers ---

    const clearAnimation = useCallback((taskId: string) => {
        setActiveAnimations(prev => {
            const next = new Map(prev);
            next.delete(taskId);
            return next;
        });
    }, []);

    const initiateCompletion = useCallback((taskId: string) => {
        playSound('complete');
        setCompletingTaskId(taskId);
    }, [playSound]);

    const initiateDismissal = useCallback((taskId: string) => {
        playSound('dismiss');
        setDismissingTaskId(taskId);
    }, [playSound]);

    // --- Task CRUD ---

    const addTask = useCallback(async (taskData: string | Task | EnrichedTaskData, date: Date = new Date(), animation?: AnimationInfo): Promise<void> => {
        if (!user) return;
        playSound('add');

        const tasksRef = collection(db, 'users', user.uid, 'tasks');

        if (typeof taskData === 'string') {
            const enrichedTasksData = await claudeService.enrichTaskWithAI(taskData, userProfile);
            const batch = writeBatch(db);
            enrichedTasksData.forEach((enrichedData, index) => {
                const newDocRef = doc(tasksRef);
                const scheduled_at = determineScheduledAt(enrichedData, date);
                const newTask: Omit<Task, 'id'> = {
                    ...enrichedData,
                    created_at: new Date(Date.now() + index),
                    scheduled_at,
                    completed_at: null,
                    xp_awarded: null,
                };
                batch.set(newDocRef, newTask);
            });
            await batch.commit();
        } else {
            const scheduled_at = determineScheduledAt(taskData, date);
            const newTask: Omit<Task, 'id'> = 'created_at' in taskData && taskData.created_at
                ? { ...(taskData as Task), scheduled_at }
                : {
                    ...(taskData as EnrichedTaskData),
                    created_at: new Date(),
                    scheduled_at,
                    completed_at: null,
                    xp_awarded: null,
                };
            Object.keys(newTask).forEach(key => newTask[key as keyof typeof newTask] === undefined && delete newTask[key as keyof typeof newTask]);
            await addDoc(tasksRef, newTask);
        }
    }, [user, userProfile, playSound]);

    const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
        if (!user) return;
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
        await updateDoc(taskRef, updates);
    }, [user]);

    const completeTask = useCallback(async (taskId: string) => {
        if (!user) return;
        const taskToComplete = tasks.find(t => t.id === taskId);
        if (!taskToComplete) return;

        const completionTime = new Date();
        const batch = writeBatch(db);
        const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);

        const completedUpdates: Partial<Task> = {
            completed_at: completionTime,
            xp_awarded: taskToComplete.xp_estimate,
        };
        if (taskToComplete.recurring) {
            (completedUpdates as any).recurring = null;
        }
        batch.update(taskRef, completedUpdates);

        const completedInstanceForStats: Task = { ...taskToComplete, ...completedUpdates };

        if (taskToComplete.recurring) {
            const isTimeBased = ['MINUTELY', 'HOURLY'].includes(taskToComplete.recurring.frequency!);
            const baseDate = isTimeBased ? completionTime : new Date(taskToComplete.scheduled_at);
            const nextOccurrenceDate = calculateNextOccurrence(baseDate, taskToComplete.recurring);

            const nextInstance: Omit<Task, 'id'> = {
                ...taskToComplete,
                created_at: new Date(),
                scheduled_at: nextOccurrenceDate.toISOString(),
                completed_at: null,
                xp_awarded: null,
                order: taskToComplete.order,
            };
            Object.keys(nextInstance).forEach(key => nextInstance[key as keyof typeof nextInstance] === undefined && delete nextInstance[key as keyof typeof nextInstance]);
            batch.set(doc(collection(db, 'users', user.uid, 'tasks')), nextInstance);
        }

        await batch.commit();
        gamificationActions.awardXpForTaskCompletion(completedInstanceForStats, tasks, quests);
    }, [user, tasks, quests, gamificationActions]);

    const dismissTask = useCallback(async (taskId: string) => {
        if (!user) return;
        await updateTask(taskId, { dismissed_at: new Date() });
    }, [user, updateTask]);

    const reorderTasks = useCallback(async (orderedTasks: Task[]) => {
        if (!user) return;
        const batch = writeBatch(db);
        orderedTasks.forEach((task, index) => {
            if (task.order !== index) {
                batch.update(doc(db, 'users', user.uid, 'tasks', task.id), { order: index });
            }
        });
        await batch.commit();
    }, [user]);

    const moveTask = useCallback((taskId: string, direction: 'up' | 'down') => {
        const index = tasks.findIndex(t => t.id === taskId);
        if (index === -1) return;
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= tasks.length) return;
        const newTasks = [...tasks];
        const [movedTask] = newTasks.splice(index, 1);
        newTasks.splice(newIndex, 0, movedTask);
        setTasks(newTasks.map((t, i) => ({ ...t, order: i })));
    }, [tasks]);

    const bulkUpdateTasks = useCallback(async (taskIds: string[], updates: Partial<Task>) => {
        if (!user) return;
        const batch = writeBatch(db);
        taskIds.forEach(id => {
            batch.update(doc(db, 'users', user.uid, 'tasks', id), updates);
        });
        await batch.commit();
    }, [user]);

    const bulkCompleteTasks = useCallback(async (taskIds: string[]) => {
        if (!user) return;
        await bulkUpdateTasks(taskIds, { completed_at: new Date(), recurring: null } as Partial<Task>);
        const completedTasks = tasks.filter(t => taskIds.includes(t.id));
        gamificationActions.awardXpForBulkCompletion(completedTasks, tasks, quests);
    }, [user, tasks, quests, bulkUpdateTasks, gamificationActions]);

    const bulkDismissTasks = useCallback(async (taskIds: string[]) => {
        await bulkUpdateTasks(taskIds, { dismissed_at: new Date() });
    }, [bulkUpdateTasks]);

    const insertTask = useCallback(async (taskData: string | EnrichedTaskData, anchorId: string, position: 'above' | 'below', animation?: AnimationInfo) => {
        await addTask(taskData, new Date(), animation);
    }, [addTask]);

    const rescheduleTask = useCallback(async (taskId: string, newDate: Date) => {
        await updateTask(taskId, { scheduled_at: newDate.toISOString() });
    }, [updateTask]);

    const rescheduleTaskForToday = useCallback(async (taskId: string) => {
        await rescheduleTask(taskId, new Date());
    }, [rescheduleTask]);

    const reEnrichTask = useCallback(async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.original_input) return;
        await updateTask(taskId, { isEnriching: true });
        try {
            const enrichedData = await claudeService.enrichTaskWithAI(task.original_input, userProfile);
            if (enrichedData?.[0]) {
                await updateTask(taskId, { ...enrichedData[0], isEnriching: false });
            }
        } catch (e) {
            await updateTask(taskId, { isEnriching: false });
        }
    }, [tasks, userProfile, updateTask]);

    const revertTaskToOriginalText = useCallback(async (taskId: string) => {
        const task = tasks.find(t => t.id === taskId);
        if (!task || !task.original_input) return;
        await updateTask(taskId, { title: task.original_input, description: '' });
    }, [tasks, updateTask]);

    // --- Quest CRUD ---

    const addQuest = useCallback(async (goal: string) => {
        if (!user) return;
        const { name, narrative, tasks: questTasks } = await claudeService.createQuestFromGoal(goal, userProfile);

        const batch = writeBatch(db);
        const newQuestRef = doc(collection(db, 'users', user.uid, 'quests'));
        const newQuest: Omit<Quest, 'id'> = { name, narrative, status: 'in_progress', created_at: new Date(), completed_at: null };
        batch.set(newQuestRef, newQuest);

        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        questTasks.forEach((enrichedData, index) => {
            const newTask: Omit<Task, 'id'> = {
                ...enrichedData,
                created_at: new Date(Date.now() + index),
                scheduled_at: determineScheduledAt(enrichedData, new Date()),
                completed_at: null,
                xp_awarded: null,
                questId: newQuestRef.id,
                questName: newQuest.name,
            };
            batch.set(doc(tasksRef), newTask);
        });

        await batch.commit();
    }, [user, userProfile]);

    const shuffleQuestTask = useCallback(async (questId: string, taskId: string) => {
        if (!user) return;
        playSound('shuffle');
        await updateTask(taskId, { isEnriching: true });
        try {
            const taskToReplace = tasks.find(t => t.id === taskId);
            const quest = quests.find(q => q.id === questId);
            if (!taskToReplace || !quest) throw new Error('Task or Quest not found');

            const allQuestTasks = tasks.filter(t => t.questId === questId);
            const newSuggestion = await claudeService.getQuestTaskAlternate(quest, taskToReplace, allQuestTasks);

            if (newSuggestion) {
                const { reasoning, context_tag, isLoading, id, ...enrichedData } = newSuggestion;
                await updateTask(taskId, { ...enrichedData, isEnriching: false, original_input: enrichedData.title });
            } else {
                throw new Error('AI did not return a valid alternative.');
            }
        } catch (error) {
            console.error('Failed to shuffle quest task:', error);
            await updateTask(taskId, { isEnriching: false });
        }
    }, [user, playSound, updateTask, tasks, quests]);

    const createProjectFromSuggestion = useCallback(async (suggestion: Suggestion) => {
        if (!user || !suggestion.isProjectStarter || !suggestion.projectName) return;
        playSound('add');

        const batch = writeBatch(db);
        const newQuestRef = doc(collection(db, 'users', user.uid, 'quests'));
        const newQuest: Omit<Quest, 'id'> = {
            name: suggestion.projectName,
            narrative: suggestion.questNarrative || '',
            status: 'in_progress',
            created_at: new Date(),
            completed_at: null,
        };
        batch.set(newQuestRef, newQuest);

        const tasksRef = collection(db, 'users', user.uid, 'tasks');
        const allTasksForProject: EnrichedTaskData[] = [suggestion, ...(suggestion.subtasks || [])];
        allTasksForProject.forEach((data, index) => {
            const { reasoning, context_tag, isLoading, id, isProjectStarter, projectName, questNarrative, subtasks, parentTaskId, parentTaskTitle, ...enrichedData } = data as Suggestion;
            const newTask: Omit<Task, 'id'> = {
                ...enrichedData,
                created_at: new Date(Date.now() + index),
                scheduled_at: determineScheduledAt(enrichedData, new Date()),
                completed_at: null,
                xp_awarded: null,
                questId: newQuestRef.id,
                questName: newQuest.name,
            };
            batch.set(doc(tasksRef), newTask);
        });

        await batch.commit();
    }, [user, playSound]);

    // --- Onboarding ---

    const completeOnboarding = useCallback(async (answers: OnboardingAnswers, mode: Mode) => {
        if (!user) return;

        let profileUpdate: Partial<any> = {};
        if (answers.persona) {
            const persona = PREDEFINED_PERSONAS.find(p => p.id === answers.persona);
            if (persona) {
                profileUpdate = {
                    personaId: persona.id,
                    interests: persona.interests,
                    dislikes: persona.dislikes,
                    longTermGoals: persona.longTermGoals,
                    dailyRhythm: persona.dailyRhythm,
                };
            }
        } else {
            profileUpdate = {
                rhythm: answers.rhythm,
                interests: (answers.interests || []).join(', '),
                longTermGoals: (answers.priorities || []).join(', '),
                notes: answers.notes,
            };
        }
        userProfileActions.updateUserProfile(profileUpdate);

        const starterTasks = await claudeService.generateStarterTasksFromOnboarding(answers, mode);

        if (starterTasks.length > 0) {
            const batch = writeBatch(db);
            const tasksRef = collection(db, 'users', user.uid, 'tasks');
            const ordered = starterTasks.sort((a, b) => new Date(a.scheduled_at || 0).getTime() - new Date(b.scheduled_at || 0).getTime());
            ordered.forEach((enrichedData, index) => {
                const newTask: Omit<Task, 'id'> = {
                    ...enrichedData,
                    created_at: new Date(Date.now() + index),
                    scheduled_at: determineScheduledAt(enrichedData, new Date()),
                    completed_at: null,
                    xp_awarded: null,
                    order: index,
                };
                batch.set(doc(tasksRef), newTask);
            });
            await batch.commit();
        }

        settings.setHasOnboarded(true);
    }, [user, settings, userProfileActions]);

    // --- AI helpers ---

    const getInContextSuggestion = useCallback(async (context: {
        taskAbove?: Task;
        taskBelow?: Task;
        tasksForDay: Task[];
        sortBy: string;
        groupBy: string;
    }) => claudeService.getInContextSuggestion(context), []);

    return {
        tasks,
        quests,
        isLoading,
        addTask,
        updateTask,
        completeTask,
        dismissTask,
        reorderTasks,
        moveTask,
        bulkUpdateTasks,
        bulkCompleteTasks,
        bulkDismissTasks,
        insertTask,
        rescheduleTask,
        rescheduleTaskForToday,
        reEnrichTask,
        revertTaskToOriginalText,
        addQuest,
        shuffleQuestTask,
        createProjectFromSuggestion,
        completeOnboarding,
        getInContextSuggestion,
        activeAnimations,
        clearAnimation,
        completingTaskId,
        initiateCompletion,
        dismissingTaskId,
        initiateDismissal,
    };
};
