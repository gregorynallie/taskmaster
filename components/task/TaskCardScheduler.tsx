import React from 'react';
import { Task } from '../../types';
import { ScheduleEditorModal } from './ScheduleEditorModal';

interface TaskCardSchedulerProps {
    task: Task;
    visualDate: string;
    isSelectModeActive: boolean;
    isUpcoming: boolean;
    
    // Display strings
    displayDateString: string;
    displayTimeString: string;

    // Handlers
    onDateArrowClick: (direction: 'prev' | 'next') => void;
    onTimeArrowClick: (direction: 'prev' | 'next') => void;
    isScheduleModalOpen: boolean;
    onOpenScheduleModal: () => void;
    onCloseScheduleModal: () => void;
    rescheduleTaskForToday: (taskId: string) => void;
}

export const TaskCardScheduler: React.FC<TaskCardSchedulerProps> = ({
    task, isSelectModeActive, isUpcoming, displayDateString, displayTimeString,
    onDateArrowClick, onTimeArrowClick, isScheduleModalOpen, onOpenScheduleModal,
    onCloseScheduleModal, rescheduleTaskForToday
}) => {
    return (
        <>
            <div className="mt-4 pt-3 border-t border-secondary/30">
                <div className="flex items-center justify-between flex-wrap gap-y-2">
                    <div className={`flex items-center flex-wrap gap-x-4 gap-y-2 text-sm text-text-secondary ${isSelectModeActive ? 'opacity-50' : ''}`}>
                        {/* Date Control */}
                        <div className="flex items-center bg-secondary/30 p-1 rounded-themed">
                            <button 
                                onClick={() => onDateArrowClick('prev')} 
                                className="theme-hover px-2 py-1 rounded-themed hover:bg-secondary hover:text-text-primary transition-themed" 
                                aria-label="Move to previous day"
                                disabled={isSelectModeActive}
                            >
                                &#8249;
                            </button>
                            
                            <button
                                onClick={onOpenScheduleModal}
                                disabled={isSelectModeActive}
                                className="font-semibold w-36 text-center p-1 cursor-pointer hover:bg-secondary/50 rounded-themed"
                                aria-label="Edit schedule date"
                            >
                                {displayDateString}
                            </button>

                            <button 
                                onClick={() => onDateArrowClick('next')} 
                                className="theme-hover px-2 py-1 rounded-themed hover:bg-secondary hover:text-text-primary transition-themed" 
                                aria-label="Move to next day"
                                disabled={isSelectModeActive}
                            >
                                &#8250;
                            </button>
                        </div>
                        {/* Time Control */}
                        <div className="flex items-center bg-secondary/30 p-1 rounded-themed">
                             <button 
                                onClick={() => onTimeArrowClick('prev')} 
                                className="theme-hover px-2 py-1 rounded-themed hover:bg-secondary hover:text-text-primary transition-themed" 
                                aria-label="Decrease time by 30 minutes"
                                disabled={isSelectModeActive}
                            >
                                &#8249;
                            </button>
                            
                            <button
                                onClick={onOpenScheduleModal}
                                disabled={isSelectModeActive}
                                className="font-semibold w-24 text-center p-1 cursor-pointer hover:bg-secondary/50 rounded-themed"
                                aria-label="Edit schedule time"
                            >
                                {displayTimeString}
                            </button>

                            <button 
                                onClick={() => onTimeArrowClick('next')} 
                                className="theme-hover px-2 py-1 rounded-themed hover:bg-secondary hover:text-text-primary transition-themed" 
                                aria-label="Increase time by 30 minutes"
                                disabled={isSelectModeActive}
                            >
                                &#8250;
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {isUpcoming && !isSelectModeActive && (
                            <button
                                onClick={() => rescheduleTaskForToday(task.id)}
                                className="theme-hover text-sm font-semibold bg-accent/20 text-accent hover:bg-accent/30 py-1 px-3 rounded-themed transition-themed"
                            >
                                ➡️ Move to Today
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <ScheduleEditorModal task={task} isOpen={isScheduleModalOpen} onClose={onCloseScheduleModal} />
        </>
    );
};
