import React, { useState, useMemo } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { TaskCard } from '../components/TaskCard';
import { Project, Task, SuggestionPill } from '../types';
import { SmartInserter } from '../components/SmartInserter';
import { HeroWithInput } from '../components/HeroWithInput';

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
        projectSuggestionPills,
        isProjectPillsLoading,
    } = useTasks();

    const { showSpoofedTasks } = useSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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
        const tasksToDisplay = showSpoofedTasks ? tasks : tasks.filter(t => !t.isSpoofed);
        return tasksToDisplay.reduce((acc, task) => {
            const projectId = task.projectId || task.questId;
            if (projectId) {
                if (!acc[projectId]) {
                    acc[projectId] = [];
                }
                acc[projectId].push(task);
            }
            return acc;
        }, {} as Record<string, Task[]>);
    }, [tasks, showSpoofedTasks]);

    const title = 'Manage Your Projects';
    const subtitle = 'Break down a large goal into a structured project with clear tasks.';
    const buttonText = isSubmitting ? 'Planning Project...' : 'Start Project';
    const inProgressTitle = 'In-Progress Projects';
    const completedTitle = 'Completed Projects';
    const emptyText = 'No new projects. Your plate is clear!';

    const hasProjects = inProgressProjects.length > 0 || completedProjects.length > 0;

    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <HeroWithInput
                title={title}
                subtitle={subtitle}
                buttonText={buttonText}
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

                {!hasProjects && !isSubmitting && projectSuggestionPills.length === 0 && (
                    <div className="text-center p-8 bg-surface rounded-themed">
                        <p className="text-text-secondary">{emptyText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
