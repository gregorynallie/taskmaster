import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../../types';

interface TaskCardActionsProps {
    task: Task;
    isCompact: boolean;
    isFrosted: boolean;
    updateTask: (taskId: string, updates: Partial<Task>) => void;
    onToggleCompact: () => void;
    onEdit: (field: 'title' | 'description') => void;
    onSetDueDate: () => void;
    onComplete: () => void;
    onDismiss: () => void;
    onShuffle?: (taskId: string) => void;
    isMenuOpen: boolean;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const TaskCardActions: React.FC<TaskCardActionsProps> = ({ 
    task, isCompact, isFrosted, updateTask, onToggleCompact, onEdit, onSetDueDate, onComplete, onDismiss, onShuffle,
    isMenuOpen, setIsMenuOpen
}) => {
    const actionMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsMenuOpen]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(prev => !prev);
    };
    
    const handleAction = (action: () => void) => {
        action();
        setIsMenuOpen(false);
    };

    const handleMakeRecurring = () => {
        handleAction(() => {
            updateTask(task.id, { recurring: { frequency: 'DAILY', interval: 1 } });
        });
    };

    return (
        <div className="relative" ref={actionMenuRef}>
            <button onClick={toggleMenu} className="p-1 rounded-full hover:bg-secondary/50" aria-label="Task actions">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            </button>
            {isMenuOpen && (
                <div className={`absolute top-full right-0 mt-1 w-48 border border-secondary rounded-themed shadow-themed py-1 animate-themed-enter z-20 ${isFrosted ? 'bg-surface-modal-bkg backdrop-blur-md' : 'bg-surface'}`}>
                    {isCompact ? (
                        <>
                            <button onClick={() => handleAction(onToggleCompact)} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Show Details</button>
                            <div className="my-1 border-t border-secondary"></div>
                            <button onClick={() => handleAction(onDismiss)} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-secondary">Dismiss</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleAction(onToggleCompact)} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Compact View</button>
                            <div className="my-1 border-t border-secondary"></div>
                            <button onClick={() => handleAction(() => onEdit('title'))} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Edit</button>
                            {onShuffle && (
                                <button onClick={() => handleAction(() => onShuffle(task.id))} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Suggest Alternative</button>
                            )}
                            <button onClick={() => handleAction(onSetDueDate)} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">
                                {task.deadline_at ? 'Edit Due Date' : 'Set Due Date'}
                            </button>
                            {task.recurring ? (
                                <button onClick={() => handleAction(() => onEdit('title'))} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Edit Recurrence</button>
                            ) : (
                                <button onClick={handleMakeRecurring} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Make Recurring</button>
                            )}
                            <div className="my-1 border-t border-secondary"></div>
                            <button onClick={() => handleAction(onComplete)} className="block w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-secondary">Complete</button>
                            <button onClick={() => handleAction(onDismiss)} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-secondary">Dismiss</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};