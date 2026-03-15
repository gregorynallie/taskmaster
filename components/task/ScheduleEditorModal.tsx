import React, { useState, useEffect, useMemo } from 'react';
import { Task } from '../../types';
import { useTasks } from '../../contexts/TasksProvider';
import { useSettings } from '../../contexts/SettingsProvider';
import { dateToYMD } from '../../utils/dateUtils';
import { getAnimationVariant } from '../../utils/animationUtils';
import { AnimationVariant } from '../../src/animations';

interface ScheduleEditorModalProps {
    task: Task;
    isOpen: boolean;
    onClose: () => void;
}

export const ScheduleEditorModal: React.FC<ScheduleEditorModalProps> = ({ task, isOpen, onClose }) => {
    const { updateTask } = useTasks();
    const { theme } = useSettings();

    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            const scheduled = new Date(task.scheduled_at);
            setDate(dateToYMD(scheduled));
            setTime(`${scheduled.getHours().toString().padStart(2, '0')}:${scheduled.getMinutes().toString().padStart(2, '0')}`);
        }
    }, [isOpen, task.scheduled_at]);

    const handleSave = () => {
        const datePart = new Date(date + 'T00:00:00');
        const [hours, minutes] = time.split(':').map(Number);
        // Adjust for timezone offset to ensure the selected date is preserved correctly
        datePart.setMinutes(datePart.getMinutes() + datePart.getTimezoneOffset());
        datePart.setHours(hours, minutes);
        updateTask(task.id, { scheduled_at: datePart.toISOString() });
        onClose();
    };

    const modalAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'modal'), [theme]);
    if (!isOpen) return null;

    const isFrosted = theme === 'ocean-mist';

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className={`p-6 rounded-themed shadow-themed w-full max-w-sm ${isFrosted ? 'bg-surface-modal-bkg backdrop-blur-md' : 'bg-surface'} ${modalAnimation.className}`}
                onClick={e => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold mb-4 font-header">Edit Schedule</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="schedule-date-modal" className="block text-sm font-semibold text-text-secondary mb-1">Date</label>
                        <input
                            id="schedule-date-modal"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="schedule-time-modal" className="block text-sm font-semibold text-text-secondary mb-1">Time</label>
                        <input
                            id="schedule-time-modal"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="theme-hover text-sm font-semibold py-2 px-4 rounded-themed hover:bg-secondary/50 transition-themed">Cancel</button>
                    <button onClick={handleSave} className="theme-hover text-sm font-semibold bg-primary text-white py-2 px-4 rounded-themed hover:bg-primary-focus transition-themed">Save</button>
                </div>
            </div>
        </div>
    );
};
