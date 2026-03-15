import React, { useState } from 'react';
import { Task, SortByType, GroupByType, TimeOfDay } from '../types';
import { InlineTaskSuggester } from './InlineTaskSuggester';

interface SmartInserterProps {
    taskAbove?: Task;
    taskBelow?: Task;
    tasksForDay: Task[];
    sortBy: SortByType;
    groupBy: GroupByType;
    activeFilters: {
        categories: string[];
        timesOfDay: TimeOfDay[];
        duration: string | null;
    };
    isSelectMode: boolean;
    onTaskInserted: () => void;
}

export const SmartInserter: React.FC<SmartInserterProps> = (props) => {
    const [isActive, setIsActive] = useState(false);

    if (props.isSelectMode) {
        return <div className="h-2" />; // Don't show inserter during select mode
    }

    if (isActive) {
        return (
            <InlineTaskSuggester
                taskAbove={props.taskAbove}
                taskBelow={props.taskBelow}
                tasksForDay={props.tasksForDay}
                sortBy={props.sortBy}
                groupBy={props.groupBy}
                activeFilters={props.activeFilters}
                onClose={() => setIsActive(false)}
                onTaskInserted={() => {
                    props.onTaskInserted();
                    setIsActive(false);
                }}
            />
        );
    }

    return (
        <div 
            className="h-6 flex items-center justify-center group"
            onClick={() => setIsActive(true)}
        >
            <div className="w-full relative h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-full border-t-2 border-dashed border-secondary/50"></div>
                <button
                    className="absolute bg-surface p-1.5 rounded-full text-accent shadow-lg text-lg animate-glow"
                    aria-label="Add a smart task here"
                >
                    ✨
                </button>
            </div>
        </div>
    );
};