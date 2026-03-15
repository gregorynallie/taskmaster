import React from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types';

// Group tasks by date string (e.g., "2023-10-27")
const groupTasksByDay = (tasks: Task[]): Record<string, Task[]> => {
    return tasks.reduce((acc, task) => {
        if (task.completed_at) {
            const dateKey = task.completed_at.toISOString().split('T')[0];
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(task);
        }
        return acc;
    }, {} as Record<string, Task[]>);
};

export const JournalView: React.FC = () => {
    const { tasks } = useTasks();
    const { mode } = useSettings();

    const completedTasks = tasks
        .filter(task => task.completed_at)
        .sort((a, b) => b.completed_at!.getTime() - a.completed_at!.getTime());

    const groupedTasks = groupTasksByDay(completedTasks);
    const sortedDates = Object.keys(groupedTasks).sort().reverse();
    
    const title = mode === 'rpg' ? 'Quest Journal' : 'Task Log';
    const subtitle = mode === 'rpg' ? 'A log of your heroic deeds and completed quests.' : 'A log of your completed tasks.';
    const emptyText = mode === 'rpg' ? 'Your journal is empty. Complete some quests to fill its pages!' : 'Your log is empty. Complete some tasks to see your history.';

    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <div className="bg-surface p-6 rounded-themed shadow-themed">
                <h2 className="text-3xl font-bold mb-4 text-center text-text-primary font-header">{title}</h2>
                <p className="text-center text-text-secondary mb-8">{subtitle}</p>

                {sortedDates.length > 0 ? (
                    <div className="space-y-8">
                        {sortedDates.map(date => (
                            <div key={date}>
                                <h3 className="font-bold text-lg text-text-secondary border-b-2 border-secondary pb-2 mb-4 font-header">
                                    {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </h3>
                                <div className="space-y-4">
                                    {groupedTasks[date].map(task => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-8">
                        <p className="text-text-secondary">{emptyText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
