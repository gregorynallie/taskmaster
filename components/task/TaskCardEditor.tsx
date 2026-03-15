import React, { useState, useRef, useEffect } from 'react';
import { Task, RecurringInfo, DayOfWeek, RecurrenceFrequency } from '../../types';
import { dateToYMD } from '../../utils/dateUtils';

interface EditedTaskState {
    title: string;
    description: string;
    scheduled_date: string;
    scheduled_time: string;
    deadline_date: string;
    deadline_time: string;
    recurring: RecurringInfo | null | undefined;
}

interface TaskCardEditorProps {
    task: Task;
    onSave: (updates: Partial<Task>) => void;
    onCancel: () => void;
    focusOnField: 'title' | 'description';
}

const DAYS_OF_WEEK: DayOfWeek[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const RECURRENCE_UNITS: Record<RecurrenceFrequency, { singular: string, plural: string }> = {
    MINUTELY: { singular: 'minute', plural: 'minutes' },
    HOURLY: { singular: 'hour', plural: 'hours' },
    DAILY: { singular: 'day', plural: 'days' },
    WEEKLY: { singular: 'week', plural: 'weeks' },
    MONTHLY: { singular: 'month', plural: 'months' },
    YEARLY: { singular: 'year', plural: 'years' },
};

export const TaskCardEditor: React.FC<TaskCardEditorProps> = ({ task, onSave, onCancel, focusOnField }) => {
    const [editedState, setEditedState] = useState<EditedTaskState>(() => {
        const scheduled = new Date(task.scheduled_at);
        const deadline = task.deadline_at ? new Date(task.deadline_at) : null;
        let deadline_date = '';
        let deadline_time = '';
        if (deadline && !isNaN(deadline.getTime())) {
            deadline_date = dateToYMD(deadline);
            const hasTime = deadline.getHours() !== 23 || deadline.getMinutes() !== 59;
            if (hasTime) {
                deadline_time = `${deadline.getHours().toString().padStart(2, '0')}:${deadline.getMinutes().toString().padStart(2, '0')}`;
            }
        }
    
        return {
            title: task.title,
            description: task.description,
            scheduled_date: dateToYMD(scheduled),
            scheduled_time: `${scheduled.getHours().toString().padStart(2, '0')}:${scheduled.getMinutes().toString().padStart(2, '0')}`,
            deadline_date,
            deadline_time,
            recurring: task.recurring,
        };
    });

    const titleInputRef = useRef<HTMLInputElement>(null);
    const descriptionInputRef = useRef<HTMLTextAreaElement>(null);
    
    useEffect(() => {
        if (focusOnField === 'description') {
            descriptionInputRef.current?.focus();
            descriptionInputRef.current?.select();
        } else {
            titleInputRef.current?.focus();
            titleInputRef.current?.select();
        }
    }, [focusOnField]);

    const handleSave = () => {
        if (!editedState.title.trim()) {
            onCancel();
            return;
        }

        let finalDeadline: string | null = null;
        if (editedState.deadline_date) {
            const datePart = new Date(editedState.deadline_date + 'T00:00:00');
            datePart.setMinutes(datePart.getMinutes() + datePart.getTimezoneOffset());
            if (editedState.deadline_time) {
                const [hours, minutes] = editedState.deadline_time.split(':').map(Number);
                datePart.setHours(hours, minutes, 0, 0);
            } else {
                datePart.setHours(23, 59, 59, 999);
            }
            finalDeadline = datePart.toISOString();
        }

        const scheduledDatePart = new Date(editedState.scheduled_date + 'T00:00:00');
        if (editedState.scheduled_time) {
            const [hours, minutes] = editedState.scheduled_time.split(':').map(Number);
            scheduledDatePart.setHours(hours, minutes, 0, 0);
        } else {
            scheduledDatePart.setUTCHours(12,0,0,0);
        }

        onSave({ 
            title: editedState.title, 
            description: editedState.description,
            original_input: task.original_input === task.title ? editedState.title : task.original_input,
            scheduled_at: scheduledDatePart.toISOString(),
            deadline_at: finalDeadline,
            recurring: editedState.recurring,
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave(); } 
        else if (e.key === 'Escape') onCancel();
    };

    const handleToggleDayOfWeek = (day: DayOfWeek) => {
        if (!editedState.recurring || editedState.recurring.frequency !== 'WEEKLY') return;

        const currentDays = editedState.recurring.daysOfWeek || [];
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day];
        
        setEditedState(s => ({ ...s, recurring: { ...s.recurring!, daysOfWeek: newDays } }));
    };

    const getRecurrenceUnitText = () => {
        if (!editedState?.recurring?.frequency) return '';
        const unitInfo = RECURRENCE_UNITS[editedState.recurring.frequency];
        return editedState.recurring.interval === 1 ? unitInfo.singular : unitInfo.plural;
    };

    return (
        <div className="space-y-2">
            <input
                ref={titleInputRef}
                type="text"
                value={editedState.title}
                onChange={(e) => setEditedState(s => s ? {...s, title: e.target.value} : null)}
                onKeyDown={handleKeyDown}
                className="w-full bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 font-bold text-text-primary"
            />
            <textarea
                ref={descriptionInputRef}
                value={editedState.description}
                onChange={(e) => setEditedState(s => s ? {...s, description: e.target.value} : null)}
                onKeyDown={handleKeyDown}
                className="w-full bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-2 text-sm text-text-secondary"
                rows={3}
            />
            <div className="pt-4 mt-2 border-t border-secondary/30 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <label htmlFor={`schedule-date-${task.id}`} className="font-semibold text-text-secondary pr-2">Schedule for</label>
                    <div className="flex items-center gap-1">
                        <input
                            id={`schedule-date-${task.id}`}
                            type="date"
                            value={editedState.scheduled_date || ''}
                            onChange={(e) => setEditedState(s => s ? {...s, scheduled_date: e.target.value} : null)}
                            className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1 text-xs text-text-primary [color-scheme:inherit]"
                        />
                        <input
                            type="time"
                            value={editedState.scheduled_time || ''}
                            onChange={(e) => setEditedState(s => s ? {...s, scheduled_time: e.target.value} : null)}
                            className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1 text-xs text-text-primary [color-scheme:inherit]"
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <label htmlFor={`deadline-date-${task.id}`} className="font-semibold text-text-secondary pr-2">Due Date</label>
                    <div className="flex items-center gap-1">
                        <input
                            id={`deadline-date-${task.id}`}
                            type="date"
                            value={editedState.deadline_date || ''}
                            onChange={(e) => setEditedState(s => s ? {...s, deadline_date: e.target.value} : null)}
                            className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1 text-xs text-text-primary [color-scheme:inherit]"
                        />
                        <input
                            type="time"
                            value={editedState.deadline_time || ''}
                            onChange={(e) => setEditedState(s => s ? {...s, deadline_time: e.target.value} : null)}
                            className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1 text-xs text-text-primary [color-scheme:inherit]"
                        />
                        <button type="button" onClick={() => setEditedState(s => s ? {...s, deadline_date: '', deadline_time: ''} : null)} className="text-xs px-2 py-1 rounded-themed hover:bg-secondary/50">Clear</button>
                    </div>
                </div>
                <div className="text-sm space-y-3">
                    <div className="flex items-center justify-between">
                        <label htmlFor={`recurring-freq-${task.id}`} className="font-semibold text-text-secondary pr-2">Repeats</label>
                        <select
                            id={`recurring-freq-${task.id}`}
                            value={editedState.recurring?.frequency || 'NONE'}
                            onChange={(e) => {
                                const freq = e.target.value;
                                if (freq === 'NONE') {
                                    setEditedState(s => s ? { ...s, recurring: null } : null);
                                } else {
                                    setEditedState(s => s ? { ...s, recurring: { frequency: freq as RecurrenceFrequency, interval: 1, daysOfWeek: [], dayOfMonth: 1 } } : null);
                                }
                            }}
                            className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1.5 text-xs w-full max-w-[10rem] text-text-primary"
                        >
                            <option value="NONE">Does not repeat</option>
                            <option value="MINUTELY">Minutely</option>
                            <option value="HOURLY">Hourly</option>
                            <option value="DAILY">Daily</option>
                            <option value="WEEKLY">Weekly</option>
                            <option value="MONTHLY">Monthly</option>
                        </select>
                    </div>
                    {editedState.recurring && (
                        <div className="pl-4 border-l-2 border-primary/30 ml-2 space-y-3">
                            <div className="flex items-center gap-2">
                                <label htmlFor={`interval-${task.id}`} className="text-text-secondary">Every</label>
                                <input
                                    id={`interval-${task.id}`}
                                    type="number"
                                    min="1"
                                    value={editedState.recurring.interval || 1}
                                    onChange={(e) => setEditedState(s => s ? { ...s, recurring: { ...s.recurring!, interval: parseInt(e.target.value, 10) || 1 } } : null)}
                                    className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1 text-xs w-16 text-text-primary"
                                />
                                <span className="text-text-secondary">{getRecurrenceUnitText()}</span>
                            </div>
                            {editedState.recurring.frequency === 'WEEKLY' && (
                                <div className="flex flex-wrap gap-1">
                                    {DAYS_OF_WEEK.map(day => (
                                        <button
                                            key={day}
                                            onClick={() => handleToggleDayOfWeek(day)}
                                            className={`w-8 h-8 rounded-full text-xs font-bold transition-colors ${editedState.recurring?.daysOfWeek?.includes(day) ? 'bg-primary text-white' : 'bg-secondary/30 text-text-secondary hover:bg-secondary/50'}`}
                                        >{day}</button>
                                    ))}
                                </div>
                            )}
                            {editedState.recurring.frequency === 'MONTHLY' && (
                                <div className="flex items-center gap-2">
                                    <label htmlFor={`day-of-month-${task.id}`} className="text-text-secondary">On day</label>
                                    <input
                                        id={`day-of-month-${task.id}`}
                                        type="number"
                                        min="1" max="31"
                                        value={editedState.recurring.dayOfMonth || 1}
                                        onChange={(e) => setEditedState(s => s ? { ...s, recurring: { ...s.recurring!, dayOfMonth: parseInt(e.target.value, 10) || 1 } } : null)}
                                        className="bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-1 text-xs w-16 text-text-primary"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
             <div className="flex items-center gap-2 justify-end pt-2">
                <button onClick={onCancel} className="theme-hover text-sm font-semibold py-1 px-3 rounded-themed hover:bg-secondary/50 transition-themed">Cancel</button>
                <button onClick={handleSave} className="theme-hover text-sm font-semibold bg-primary text-white py-1 px-3 rounded-themed hover:bg-primary-focus transition-themed">Save</button>
            </div>
        </div>
    );
};
