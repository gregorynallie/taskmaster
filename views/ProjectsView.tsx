import React, { useEffect, useMemo, useState } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { TaskCard } from '../components/TaskCard';
import { EnrichedTaskData, Project, Task, SuggestionPill } from '../types';
import { SmartInserter } from '../components/SmartInserter';
import { HeroWithInput } from '../components/HeroWithInput';
import * as claudeService from '../services/claudeService';
import { dateToYMD } from '../utils/dateUtils';

type PlanPath = 'project' | 'day' | 'week';
type WizardStep = 'input' | 'preview' | 'success';

const MAX_DAY_OFFSET = 30;
const MAX_WEEK_OFFSET = 8;

const getTodayStart = (): Date => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};

const addDays = (date: Date, days: number): Date => {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
};

const formatDayHeading = (date: Date): string => date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

const formatDaySelectorLabel = (date: Date): string => {
    const today = getTodayStart();
    const tomorrow = addDays(today, 1);
    const dateYmd = dateToYMD(date);
    if (dateYmd === dateToYMD(today)) {
        return `Today, ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
    }
    if (dateYmd === dateToYMD(tomorrow)) {
        return `Tomorrow, ${date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`;
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};

const formatWeekRange = (start: Date): string => {
    const end = addDays(start, 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
};

const formatWeekLabel = (start: Date): string => {
    const today = getTodayStart();
    const nextWeek = addDays(today, 7);
    if (dateToYMD(start) === dateToYMD(today)) return `This week: ${formatWeekRange(start)}`;
    if (dateToYMD(start) === dateToYMD(nextWeek)) return `Next week: ${formatWeekRange(start)}`;
    return `Week: ${formatWeekRange(start)}`;
};

interface ProjectCardProps {
    project: Project;
    tasks: Task[];
    isCompleted?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ project, tasks, isCompleted = false }) => {
    const { shuffleProjectTask } = useTasks();
    const [isCollapsed, setIsCollapsed] = useState(isCompleted);
    const completedTasks = tasks.filter(task => task.completed_at).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const { mode } = useSettings();

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => (a.completed_at ? 1 : -1) - (b.completed_at ? 1 : -1) || a.created_at.getTime() - b.created_at.getTime());
    }, [tasks]);

    const handleShuffle = (taskId: string) => {
        shuffleProjectTask(project.id, taskId);
    };

    return (
        <div className="bg-surface p-6 rounded-themed shadow-themed border-[length:var(--card-border-width)] border-secondary">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2 font-header">{project.name}</h3>
                    <p className="text-sm text-text-secondary mb-4 italic">"{project.narrative}"</p>
                </div>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 rounded-full hover:bg-secondary/50"
                    aria-label={isCollapsed ? 'Expand project' : 'Collapse project'}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-text-secondary transition-transform duration-300 ${!isCollapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-1 text-sm">
                    <span className="font-semibold text-text-secondary">Progress</span>
                    <span className="font-bold text-primary">{completedTasks} / {totalTasks} {mode === 'rpg' ? 'Steps' : 'Tasks'}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2.5">
                    <div
                        className="bg-primary h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            <div className={`transition-all duration-500 ease-in-out grid ${isCollapsed ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
                <div className="overflow-hidden">
                    <div className="space-y-0 pt-4">
                        {sortedTasks.length > 0 && <SmartInserter taskBelow={sortedTasks[0]} tasksForDay={sortedTasks} sortBy="manual" groupBy="none" activeFilters={{ categories: [], timesOfDay: [], duration: null }} isSelectMode={false} onTaskInserted={() => { }} />}
                        {sortedTasks.map((task, index) => (
                            <React.Fragment key={task.id}>
                                <TaskCard task={task} tasksForDay={tasks} onShuffle={handleShuffle} />
                                <SmartInserter taskAbove={task} taskBelow={sortedTasks[index + 1]} tasksForDay={sortedTasks} sortBy="manual" groupBy="none" activeFilters={{ categories: [], timesOfDay: [], duration: null }} isSelectMode={false} onTaskInserted={() => { }} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const ProjectsView: React.FC = () => {
    const {
        projects,
        tasks,
        addProject,
        addTasksBulk,
        projectSuggestionPills,
        isProjectPillsLoading,
    } = useTasks();

    const { mode, showSpoofedTasks } = useSettings();
    const { userProfile } = useUserProfile();
    const [activePath, setActivePath] = useState<PlanPath>('project');

    // Build Project path state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Day wizard local state
    const [dayStep, setDayStep] = useState<WizardStep>('input');
    const [dayDate, setDayDate] = useState<Date>(getTodayStart());
    const [dayInput, setDayInput] = useState('');
    const [dayLoading, setDayLoading] = useState(false);
    const [dayPreviewTasks, setDayPreviewTasks] = useState<EnrichedTaskData[]>([]);
    const [dayError, setDayError] = useState<string | null>(null);

    // Week wizard local state
    const [weekStep, setWeekStep] = useState<WizardStep>('input');
    const [weekStartDate, setWeekStartDate] = useState<Date>(getTodayStart());
    const [weekInput, setWeekInput] = useState('');
    const [weekLoading, setWeekLoading] = useState(false);
    const [weekPreviewTasks, setWeekPreviewTasks] = useState<EnrichedTaskData[]>([]);
    const [weekError, setWeekError] = useState<string | null>(null);

    useEffect(() => {
        // Reset wizard state whenever mode cards are switched.
        const today = getTodayStart();
        setDayStep('input');
        setDayDate(today);
        setDayInput('');
        setDayPreviewTasks([]);
        setDayLoading(false);
        setDayError(null);
        setWeekStep('input');
        setWeekStartDate(today);
        setWeekInput('');
        setWeekPreviewTasks([]);
        setWeekLoading(false);
        setWeekError(null);
    }, [activePath]);

    const visibleTasks = useMemo(
        () => (showSpoofedTasks ? tasks : tasks.filter(t => !t.isSpoofed)),
        [tasks, showSpoofedTasks]
    );

    const handleAddProject = async (goal: string) => {
        if (!goal.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError(null);
        try {
            await addProject(goal);
        } catch (error) {
            setSubmitError('Could not create project right now. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePillClick = (pill: SuggestionPill) => {
        handleAddProject(pill.label);
    };

    const dayTasksForSelectedDate = useMemo(() => {
        const selectedYmd = dateToYMD(dayDate);
        const isToday = selectedYmd === dateToYMD(getTodayStart());
        return visibleTasks.filter(task => {
            if (task.dismissed_at) return false;
            if (dateToYMD(task.scheduled_at) !== selectedYmd) return false;
            if (isToday) return !task.completed_at;
            return true;
        });
    }, [visibleTasks, dayDate]);

    const generateDayPlan = async () => {
        if (!dayInput.trim() || dayLoading) return;
        setDayLoading(true);
        setDayError(null);
        try {
            const generated = await claudeService.generatePlanForDay({
                input: dayInput,
                targetDate: dayDate.toISOString(),
                existingTasks: dayTasksForSelectedDate.map(t => ({
                    title: t.title,
                    scheduled_at: t.scheduled_at,
                    completed: !!t.completed_at,
                })),
                userProfile,
            });
            setDayPreviewTasks(generated);
            setDayStep('preview');
        } catch (error) {
            setDayError('Could not generate a day plan right now. Please try again.');
        } finally {
            setDayLoading(false);
        }
    };

    const confirmDayPlan = async () => {
        if (!dayPreviewTasks.length || dayLoading) return;
        setDayLoading(true);
        setDayError(null);
        try {
            await addTasksBulk(dayPreviewTasks, dayDate);
            setDayStep('success');
        } catch (error) {
            setDayError('Could not add tasks right now. Please try again.');
        } finally {
            setDayLoading(false);
        }
    };

    const generateWeekPlan = async () => {
        if (!weekInput.trim() || weekLoading) return;
        setWeekLoading(true);
        setWeekError(null);
        try {
            const generated = await claudeService.generatePlanForWeek({
                input: weekInput,
                weekStartDate: weekStartDate.toISOString(),
                userProfile,
            });
            setWeekPreviewTasks(generated);
            setWeekStep('preview');
        } catch (error) {
            setWeekError('Could not generate a week plan right now. Please try again.');
        } finally {
            setWeekLoading(false);
        }
    };

    const confirmWeekPlan = async () => {
        if (!weekPreviewTasks.length || weekLoading) return;
        setWeekLoading(true);
        setWeekError(null);
        try {
            await addTasksBulk(weekPreviewTasks, weekStartDate);
            setWeekStep('success');
        } catch (error) {
            setWeekError('Could not add tasks right now. Please try again.');
        } finally {
            setWeekLoading(false);
        }
    };

    const renderModeSelector = () => {
        const cards: Array<{ path: PlanPath; emoji: string; label: string; description: string }> = [
            { path: 'day', emoji: '📅', label: 'Plan my day', description: 'Focus + intentions for any day' },
            { path: 'week', emoji: '📆', label: 'Plan my week', description: 'Spread goals across any 7 days' },
            { path: 'project', emoji: '🎯', label: 'Build a project', description: 'Break a big goal into steps' },
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {cards.map(card => {
                    const isSelected = activePath === card.path;
                    return (
                        <button
                            key={card.path}
                            onClick={() => setActivePath(card.path)}
                            className={`p-4 rounded-themed border-2 text-left transition-themed ${isSelected ? 'border-primary bg-primary/10' : 'border-secondary bg-surface hover:border-primary/60'}`}
                        >
                            <p className="text-lg font-bold text-text-primary flex items-center gap-2">
                                <span>{card.emoji}</span>
                                <span>{card.label}</span>
                            </p>
                            <p className="text-sm text-text-secondary mt-1 hidden sm:block">{card.description}</p>
                        </button>
                    );
                })}
            </div>
        );
    };

    const renderBuildProjectPath = () => (
        <>
            <HeroWithInput
                title="Build a Project"
                subtitle="Break down a large goal into a structured project with clear tasks."
                buttonText={isSubmitting ? 'Planning Project...' : 'Start Project'}
                onSubmit={handleAddProject}
                isSubmitting={isSubmitting}
                placeholderContext="project"
            />

            <div className="mb-8">
                <div className="flex flex-wrap gap-2 justify-center">
                    {isProjectPillsLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-9 w-36 rounded-full bg-surface/50 animate-pulse"></div>
                        ))
                    ) : (
                        projectSuggestionPills.map((pill, i) => (
                            <button
                                key={i}
                                onClick={() => handlePillClick(pill)}
                                disabled={isSubmitting}
                                className="theme-hover bg-surface hover:bg-primary/20 text-text-secondary font-semibold py-2 px-4 rounded-full transition-themed text-sm animate-themed-enter disabled:opacity-50 disabled:cursor-not-allowed"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                {pill.emoji} {pill.label}
                            </button>
                        ))
                    )}
                </div>
                {isSubmitting && (
                    <div className="text-center mt-4">
                        <p className="text-text-secondary animate-pulse text-lg font-semibold">Thinking...</p>
                    </div>
                )}
                {submitError && (
                    <div className="mt-4 p-3 rounded-themed border border-red-500/50 bg-red-900/20 text-center animate-themed-enter">
                        <p className="text-sm text-red-300 font-semibold">{submitError}</p>
                    </div>
                )}
            </div>
        </>
    );

    const renderDayPath = () => {
        const today = getTodayStart();
        const maxDate = addDays(today, MAX_DAY_OFFSET);
        const canGoPrev = dayDate.getTime() > today.getTime();
        const canGoNext = dayDate.getTime() < maxDate.getTime();
        const shownContextTasks = dayTasksForSelectedDate.slice(0, 5);
        const hiddenCount = dayTasksForSelectedDate.length - shownContextTasks.length;
        const isToday = dateToYMD(dayDate) === dateToYMD(today);
        const successHeading = isToday ? 'Your day is planned!' : `${dayDate.toLocaleDateString('en-US', { weekday: 'long' })} is planned!`;
        const successSubtext = isToday
            ? 'Tasks have been added to your Today view.'
            : `Tasks have been scheduled for ${dayDate.toLocaleDateString('en-US', { weekday: 'long' })}.`;

        return (
            <div className="bg-surface p-6 rounded-themed shadow-themed mb-8">
                {dayStep === 'input' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-themed border border-secondary p-2">
                            <button
                                onClick={() => canGoPrev && setDayDate(prev => addDays(prev, -1))}
                                disabled={!canGoPrev || dayLoading}
                                className="px-3 py-1 rounded-themed bg-secondary/40 hover:bg-secondary/70 disabled:opacity-40"
                            >
                                ←
                            </button>
                            <p className="font-semibold text-text-primary">{formatDaySelectorLabel(dayDate)}</p>
                            <button
                                onClick={() => canGoNext && setDayDate(prev => addDays(prev, 1))}
                                disabled={!canGoNext || dayLoading}
                                className="px-3 py-1 rounded-themed bg-secondary/40 hover:bg-secondary/70 disabled:opacity-40"
                            >
                                →
                            </button>
                        </div>

                        {dayTasksForSelectedDate.length > 0 && (
                            <div className="rounded-themed border border-secondary p-3">
                                <p className="text-sm font-semibold text-text-secondary mb-2">Already on your plate:</p>
                                <div className="flex flex-wrap gap-2">
                                    {shownContextTasks.map(task => (
                                        <span key={task.id} className="text-xs px-3 py-1 rounded-full bg-secondary/40 text-text-primary">
                                            {task.title}
                                        </span>
                                    ))}
                                    {hiddenCount > 0 && (
                                        <span className="text-xs px-3 py-1 rounded-full bg-secondary/40 text-text-primary">+{hiddenCount} more</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                void generateDayPlan();
                            }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={dayInput}
                                    onChange={(e) => setDayInput(e.target.value)}
                                    placeholder="Tasks, goals, or intentions for this day — anything works."
                                    className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary"
                                    disabled={dayLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!dayInput.trim() || dayLoading}
                                    className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-5 rounded-themed transition-themed disabled:bg-secondary disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    Generate →
                                </button>
                            </div>
                        </form>
                        {dayLoading && <p className="text-center text-text-secondary animate-pulse font-semibold">Thinking...</p>}
                        {dayError && <p className="text-sm text-red-300 text-center">{dayError}</p>}
                    </div>
                )}

                {dayStep === 'preview' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text-primary font-header">
                            Your plan for {formatDayHeading(dayDate)}
                        </h3>
                        <div className="space-y-3">
                            {dayPreviewTasks.map((task, idx) => {
                                const scheduled = new Date(task.scheduled_at || dayDate.toISOString());
                                return (
                                    <div key={`${task.title}-${idx}`} className="rounded-themed border border-secondary p-4">
                                        <p className="font-semibold text-text-primary">{task.title}</p>
                                        <p className="text-sm text-text-secondary mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {task.description}
                                        </p>
                                        <p className="text-xs text-text-secondary mt-2">
                                            {scheduled.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} • {task.duration_min} min
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => void confirmDayPlan()}
                                disabled={dayLoading || dayPreviewTasks.length === 0}
                                className="flex-1 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-4 rounded-themed transition-themed disabled:bg-secondary"
                            >
                                Add {dayPreviewTasks.length} tasks →
                            </button>
                            <button
                                onClick={() => {
                                    setDayStep('input');
                                    setDayPreviewTasks([]);
                                }}
                                disabled={dayLoading}
                                className="bg-secondary/60 hover:bg-secondary/90 text-text-primary font-semibold py-3 px-4 rounded-themed transition-themed"
                            >
                                Regenerate
                            </button>
                        </div>
                        {dayError && <p className="text-sm text-red-300 text-center">{dayError}</p>}
                    </div>
                )}

                {dayStep === 'success' && (
                    <div className="text-center space-y-3">
                        <p className="text-5xl">✅</p>
                        <h3 className="text-2xl font-bold text-text-primary font-header">{successHeading}</h3>
                        <p className="text-text-secondary">{successSubtext}</p>
                        <button
                            onClick={() => {
                                setDayStep('input');
                                setDayDate(getTodayStart());
                                setDayInput('');
                                setDayPreviewTasks([]);
                                setDayError(null);
                            }}
                            className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed"
                        >
                            Plan something else
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const renderWeekPath = () => {
        const today = getTodayStart();
        const maxWeek = addDays(today, MAX_WEEK_OFFSET * 7);
        const canGoPrev = weekStartDate.getTime() > today.getTime();
        const canGoNext = weekStartDate.getTime() < maxWeek.getTime();
        const successHeading = dateToYMD(weekStartDate) === dateToYMD(today)
            ? 'This week is planned!'
            : `Week of ${weekStartDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} is planned!`;

        return (
            <div className="bg-surface p-6 rounded-themed shadow-themed mb-8">
                {weekStep === 'input' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-themed border border-secondary p-2">
                            <button
                                onClick={() => canGoPrev && setWeekStartDate(prev => addDays(prev, -7))}
                                disabled={!canGoPrev || weekLoading}
                                className="px-3 py-1 rounded-themed bg-secondary/40 hover:bg-secondary/70 disabled:opacity-40"
                            >
                                ←
                            </button>
                            <p className="font-semibold text-text-primary">{formatWeekLabel(weekStartDate)}</p>
                            <button
                                onClick={() => canGoNext && setWeekStartDate(prev => addDays(prev, 7))}
                                disabled={!canGoNext || weekLoading}
                                className="px-3 py-1 rounded-themed bg-secondary/40 hover:bg-secondary/70 disabled:opacity-40"
                            >
                                →
                            </button>
                        </div>

                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                void generateWeekPlan();
                            }}
                            className="space-y-3"
                        >
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={weekInput}
                                    onChange={(e) => setWeekInput(e.target.value)}
                                    placeholder="Tasks, goals, or intentions for the week — anything works."
                                    className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary"
                                    disabled={weekLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!weekInput.trim() || weekLoading}
                                    className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-5 rounded-themed transition-themed disabled:bg-secondary disabled:cursor-not-allowed whitespace-nowrap"
                                >
                                    Generate →
                                </button>
                            </div>
                        </form>
                        {weekLoading && <p className="text-center text-text-secondary animate-pulse font-semibold">Thinking...</p>}
                        {weekError && <p className="text-sm text-red-300 text-center">{weekError}</p>}
                    </div>
                )}

                {weekStep === 'preview' && (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-text-primary font-header">Your plan for {formatWeekRange(weekStartDate)}</h3>
                        <div className="space-y-3">
                            {weekPreviewTasks
                                .slice()
                                .sort((a, b) => new Date(a.scheduled_at || weekStartDate.toISOString()).getTime() - new Date(b.scheduled_at || weekStartDate.toISOString()).getTime())
                                .map((task, idx) => {
                                    const scheduled = new Date(task.scheduled_at || weekStartDate.toISOString());
                                    return (
                                        <div key={`${task.title}-${idx}`} className="rounded-themed border border-secondary p-4">
                                            <p className="font-semibold text-text-primary">{task.title}</p>
                                            <p className="text-sm text-text-secondary mt-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                {task.description}
                                            </p>
                                            <p className="text-xs text-text-secondary mt-2">
                                                {scheduled.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} • {task.duration_min} min
                                            </p>
                                        </div>
                                    );
                                })}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => void confirmWeekPlan()}
                                disabled={weekLoading || weekPreviewTasks.length === 0}
                                className="flex-1 bg-primary hover:bg-primary-focus text-white font-bold py-3 px-4 rounded-themed transition-themed disabled:bg-secondary"
                            >
                                Add {weekPreviewTasks.length} tasks →
                            </button>
                            <button
                                onClick={() => {
                                    setWeekStep('input');
                                    setWeekPreviewTasks([]);
                                }}
                                disabled={weekLoading}
                                className="bg-secondary/60 hover:bg-secondary/90 text-text-primary font-semibold py-3 px-4 rounded-themed transition-themed"
                            >
                                Regenerate
                            </button>
                        </div>
                        {weekError && <p className="text-sm text-red-300 text-center">{weekError}</p>}
                    </div>
                )}

                {weekStep === 'success' && (
                    <div className="text-center space-y-3">
                        <p className="text-5xl">✅</p>
                        <h3 className="text-2xl font-bold text-text-primary font-header">{successHeading}</h3>
                        <p className="text-text-secondary">Tasks have been scheduled for this week.</p>
                        <button
                            onClick={() => {
                                setWeekStep('input');
                                setWeekStartDate(getTodayStart());
                                setWeekInput('');
                                setWeekPreviewTasks([]);
                                setWeekError(null);
                            }}
                            className="bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed"
                        >
                            Plan something else
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const { inProgressProjects, completedProjects } = useMemo(() => {
        const inProgress: Project[] = [];
        const completed: Project[] = [];
        projects.forEach(p => {
            if (p.status === 'completed') {
                completed.push(p);
            } else {
                inProgress.push(p);
            }
        });
        return {
            inProgressProjects: inProgress.sort((a, b) => b.created_at.getTime() - a.created_at.getTime()),
            completedProjects: completed.sort((a, b) => b.completed_at!.getTime() - a.completed_at!.getTime())
        };
    }, [projects]);

    const tasksByProjectId = useMemo(() => {
        return visibleTasks.reduce((acc, task) => {
            const projectId = task.projectId || task.questId;
            if (projectId) {
                if (!acc[projectId]) {
                    acc[projectId] = [];
                }
                acc[projectId].push(task);
            }
            return acc;
        }, {} as Record<string, Task[]>);
    }, [visibleTasks]);

    const inProgressTitle = mode === 'rpg' ? 'Active Quests' : 'In-Progress Projects';
    const completedTitle = mode === 'rpg' ? 'Completed Quests' : 'Completed Projects';
    const emptyText = 'Your plan is clear. Start something above.';

    const hasProjects = inProgressProjects.length > 0 || completedProjects.length > 0;

    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <div className="bg-surface p-6 rounded-themed shadow-themed mb-6">
                <h2 className="text-3xl font-bold mb-2 text-center text-text-primary font-header">Plan</h2>
                <p className="text-center text-text-secondary mb-6">Turn intentions into action.</p>
                {renderModeSelector()}
                {activePath === 'project' && renderBuildProjectPath()}
                {activePath === 'day' && renderDayPath()}
                {activePath === 'week' && renderWeekPath()}
            </div>

            <div className="space-y-12">
                {inProgressProjects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-header">{inProgressTitle}</h2>
                        <div className="space-y-6">
                            {inProgressProjects.map(project => (
                                <ProjectCard key={project.id} project={project} tasks={tasksByProjectId[project.id] || []} isCompleted={false} />
                            ))}
                        </div>
                    </div>
                )}

                {completedProjects.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-header">{completedTitle}</h2>
                        <div className="space-y-6">
                            {completedProjects.map(project => (
                                <ProjectCard key={project.id} project={project} tasks={tasksByProjectId[project.id] || []} isCompleted={true} />
                            ))}
                        </div>
                    </div>
                )}

                {!hasProjects && (
                    <div className="text-center p-8 bg-surface rounded-themed">
                        <p className="text-text-secondary">{emptyText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
