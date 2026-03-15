import React, { useState, useEffect } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../contexts/TasksProvider';
import { dateToYMD } from '../../utils/dateUtils';

interface DeadlineEditorProps {
    task: Task;
    onClose: () => void;
}

export const DeadlineEditor: React.FC<DeadlineEditorProps> = ({ task, onClose }) => {
    const { updateTask } = useTasks();
    const [editedDeadlineDate, setEditedDeadlineDate] = useState('');
    const [editedDeadlineTime, setEditedDeadlineTime] = useState('');
    
    useEffect(() => {
        if (task.deadline_at) {
            const d = new Date(task.deadline_at);
            if (!isNaN(d.getTime())) {
                setEditedDeadlineDate(dateToYMD(d));
                
                const hasTime = d.getHours() !== 23 || d.getMinutes() !== 59;
                if (hasTime) {
                    const hours = d.getHours().toString().padStart(2, '0');
                    const minutes = d.getMinutes().toString().padStart(2, '0');
                    setEditedDeadlineTime(`${hours}:${minutes}`);
                } else {
                    setEditedDeadlineTime('');
                }
            }
        } else {
            // Smart defaults
            setEditedDeadlineDate(dateToYMD(new Date()));
            setEditedDeadlineTime('17:00'); // Default to 5:00 PM
        }
    }, [task.deadline_at]);

    const handleDeadlineDateChange = (direction: 'prev' | 'next') => {
        const currentDate = new Date(editedDeadlineDate + 'T00:00:00');
        if (isNaN(currentDate.getTime())) return;
        currentDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        setEditedDeadlineDate(dateToYMD(currentDate));
    };

    const handleDeadlineTimeChange = (direction: 'prev' | 'next') => {
        const currentTime = editedDeadlineTime || '09:00'; // Default if empty
        const [hours, minutes] = currentTime.split(':').map(Number);
        let totalMinutes = hours * 60 + minutes;
        
        const increment = direction === 'next' ? 30 : -30;
        totalMinutes += increment;

        if (totalMinutes < 0) totalMinutes = 24 * 60 + totalMinutes;
        else if (totalMinutes >= 24 * 60) totalMinutes = totalMinutes - 24 * 60;
        
        const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
        
        setEditedDeadlineTime(`${newHours}:${newMinutes}`);
    };

    const handleSaveDeadline = () => {
        if (!editedDeadlineDate && !editedDeadlineTime) {
            updateTask(task.id, { deadline_at: null });
            onClose();
            return;
        }
    
        const datePart = editedDeadlineDate ? new Date(editedDeadlineDate + 'T00:00:00') : new Date();
        if (editedDeadlineDate) {
            datePart.setMinutes(datePart.getMinutes() + datePart.getTimezoneOffset());
        }
    
        if (editedDeadlineTime) {
            const [hours, minutes] = editedDeadlineTime.split(':').map(Number);
            datePart.setHours(hours, minutes, 0, 0);
        } else {
            datePart.setHours(23, 59, 59, 999);
        }
    
        updateTask(task.id, { deadline_at: datePart.toISOString() });
        onClose();
    };

    const handleRemoveDeadline = () => {
        updateTask(task.id, { deadline_at: null });
        onClose();
    };

    return (
        <div className="flex items-center flex-wrap gap-2 p-2 bg-bkg rounded-themed border border-secondary w-full">
            <div className="flex items-center bg-secondary rounded-themed">
                <button onClick={() => handleDeadlineDateChange('prev')} className="px-2 py-1 hover:bg-secondary/50 rounded-l-themed transition" aria-label="Previous day">&#8249;</button>
                <input
                    type="date"
                    value={editedDeadlineDate}
                    onChange={(e) => setEditedDeadlineDate(e.target.value)}
                    className="bg-transparent border-none p-1 text-xs text-text-primary w-32 text-center focus:ring-0"
                />
                <button onClick={() => handleDeadlineDateChange('next')} className="px-2 py-1 hover:bg-secondary/50 rounded-r-themed transition" aria-label="Next day">&#8250;</button>
            </div>
            <div className="flex items-center bg-secondary rounded-themed">
                    <button onClick={() => handleDeadlineTimeChange('prev')} className="px-2 py-1 hover:bg-secondary/50 rounded-l-themed transition" aria-label="Decrease time">&#8249;</button>
                <input
                    type="time"
                    value={editedDeadlineTime}
                    onChange={(e) => setEditedDeadlineTime(e.target.value)}
                    className="bg-transparent border-none p-1 text-xs text-text-primary w-24 text-center focus:ring-0"
                />
                <button onClick={() => handleDeadlineTimeChange('next')} className="px-2 py-1 hover:bg-secondary/50 rounded-r-themed transition" aria-label="Increase time">&#8250;</button>
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-1">
                <button onClick={handleSaveDeadline} className="text-xs px-2 py-1 rounded-themed bg-primary text-white hover:bg-primary-focus">Save</button>
                <button onClick={onClose} className="text-xs px-2 py-1 rounded-themed hover:bg-secondary">Cancel</button>
                {task.deadline_at && (
                    <button onClick={handleRemoveDeadline} className="text-xs text-red-400 hover:underline">Remove</button>
                )}
            </div>
        </div>
    );
};
