import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { TaskCard } from '../components/TaskCard';
import { Quest, Task, SuggestionPill } from '../types';
import { SmartInserter } from '../components/SmartInserter';
import { HeroWithInput } from '../components/HeroWithInput';

interface QuestCardProps {
    quest: Quest;
    tasks: Task[];
    isCompleted?: boolean;
}

const QuestCard: React.FC<QuestCardProps> = React.memo(({ quest, tasks, isCompleted = false }) => {
    const { shuffleQuestTask } = useTasks();
    const [isCollapsed, setIsCollapsed] = useState(isCompleted);
    const completedTasks = tasks.filter(task => task.completed_at).length;
    const totalTasks = tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const { mode } = useSettings();

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a,b) => (a.completed_at ? 1 : -1) - (b.completed_at ? 1 : -1) || a.created_at.getTime() - b.created_at.getTime())
    }, [tasks]);

    const handleShuffle = (taskId: string) => {
        shuffleQuestTask(quest.id, taskId);
    };

    return (
        <div className="bg-surface p-6 rounded-themed shadow-themed border-[length:var(--card-border-width)] border-secondary">
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-2 font-header">{quest.name}</h3>
                    <p className="text-sm text-text-secondary mb-4 italic">"{quest.narrative}"</p>
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
                        {sortedTasks.length > 0 && <SmartInserter taskBelow={sortedTasks[0]} tasksForDay={sortedTasks} sortBy="manual" groupBy="none" activeFilters={{ categories: [], timesOfDay: [], duration: null }} isSelectMode={false} onTaskInserted={() => {}} />}
                        {sortedTasks.map((task, index) => (
                            <React.Fragment key={task.id}>
                                <TaskCard task={task} tasksForDay={tasks} onShuffle={handleShuffle}/>
                                <SmartInserter taskAbove={task} taskBelow={sortedTasks[index + 1]} tasksForDay={sortedTasks} sortBy="manual" groupBy="none" activeFilters={{ categories: [], timesOfDay: [], duration: null }} isSelectMode={false} onTaskInserted={() => {}} />
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
});

export const QuestsView: React.FC = () => {
    const { 
        quests, 
        tasks, 
        addQuest, 
        projectSuggestionPills, 
        isProjectPillsLoading,
    } = useTasks();

    const { mode, showSpoofedTasks } = useSettings();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleAddQuest = async (goal: string) => {
        if (!goal.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await addQuest(goal);
        } catch (error) {
            // Error is handled in the hook, but we could add more UI feedback here
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePillClick = (pill: SuggestionPill) => {
        handleAddQuest(pill.label);
    };

    const { inProgressQuests, completedQuests } = useMemo(() => {
        const inProgress: Quest[] = [];
        const completed: Quest[] = [];
        quests.forEach(q => {
            if (q.status === 'completed') {
                completed.push(q);
            } else {
                inProgress.push(q);
            }
        });
        return { 
            inProgressQuests: inProgress.sort((a,b) => b.created_at.getTime() - a.created_at.getTime()), 
            completedQuests: completed.sort((a,b) => b.completed_at!.getTime() - a.completed_at!.getTime())
        };
    }, [quests]);

    const tasksByQuestId = useMemo(() => {
        const tasksToDisplay = showSpoofedTasks ? tasks : tasks.filter(t => !t.isSpoofed);
        return tasksToDisplay.reduce((acc, task) => {
            if (task.questId) {
                if (!acc[task.questId]) {
                    acc[task.questId] = [];
                }
                acc[task.questId].push(task);
            }
            return acc;
        }, {} as Record<string, Task[]>);
    }, [tasks, showSpoofedTasks]);

    const title = mode === 'rpg' ? 'Manage Your Quests' : 'Manage Your Projects';
    const subtitle = mode === 'rpg' ? 'Decompose a grand goal into an epic quest with actionable steps.' : 'Break down a large goal into a structured project with clear tasks.';
    const buttonText = isSubmitting ? (mode === 'rpg' ? 'Forging Quest...' : 'Planning Project...') : (mode === 'rpg' ? 'Begin Quest' : 'Start Project');
    const inProgressTitle = mode === 'rpg' ? 'Active Quests' : 'In-Progress Projects';
    const completedTitle = mode === 'rpg' ? 'Completed Quests' : 'Completed Projects';
    const emptyText = mode === 'rpg' ? 'No new quests. A moment of peace!' : 'No new projects. Your plate is clear!';

    const hasProjects = inProgressQuests.length > 0 || completedQuests.length > 0;

    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <HeroWithInput
                title={title}
                subtitle={subtitle}
                buttonText={buttonText}
                onSubmit={handleAddQuest}
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
            </div>

            <div className="space-y-12">
                {inProgressQuests.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-header">{inProgressTitle}</h2>
                        <div className="space-y-6">
                            {inProgressQuests.map(quest => (
                                <QuestCard key={quest.id} quest={quest} tasks={tasksByQuestId[quest.id] || []} isCompleted={false} />
                            ))}
                        </div>
                    </div>
                )}

                 {completedQuests.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-text-primary mb-4 font-header">{completedTitle}</h2>
                        <div className="space-y-6">
                             {completedQuests.map(quest => (
                                <QuestCard key={quest.id} quest={quest} tasks={tasksByQuestId[quest.id] || []} isCompleted={true} />
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