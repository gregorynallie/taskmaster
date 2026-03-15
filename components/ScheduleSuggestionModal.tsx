import React, { useState, useEffect, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsProvider';
import { dateToYMD } from '../utils/dateUtils';
import { getAnimationVariant } from '../utils/animationUtils';
import { AnimationVariant } from '../src/animations';

interface ScheduleSuggestionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSchedule: (date: Date) => void;
}

export const ScheduleSuggestionModal: React.FC<ScheduleSuggestionModalProps> = ({ isOpen, onClose, onSchedule }) => {
    const { theme } = useSettings();
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        if (isOpen) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0); // Default to 9 AM tomorrow
            
            setDate(dateToYMD(tomorrow));
            setTime(`${tomorrow.getHours().toString().padStart(2, '0')}:${tomorrow.getMinutes().toString().padStart(2, '0')}`);
        }
    }, [isOpen]);

    const handleSchedule = () => {
        if (!date) return;
        const datePart = new Date(date + 'T00:00:00');
        datePart.setMinutes(datePart.getMinutes() + datePart.getTimezoneOffset());
        
        if (time) {
            const [hours, minutes] = time.split(':').map(Number);
            datePart.setHours(hours, minutes, 0, 0);
        } else {
             datePart.setHours(9, 0, 0, 0); // Default if time is cleared
        }
        
        onSchedule(datePart);
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
                <h3 className="text-lg font-bold mb-4 font-header">Schedule Suggestion</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="suggestion-date-modal" className="block text-sm font-semibold text-text-secondary mb-1">Date</label>
                        <input
                            id="suggestion-date-modal"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-2"
                        />
                    </div>
                    <div>
                        <label htmlFor="suggestion-time-modal" className="block text-sm font-semibold text-text-secondary mb-1">Time</label>
                        <input
                            id="suggestion-time-modal"
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-bkg/80 border border-secondary focus:border-primary focus:ring-0 rounded-themed p-2"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="theme-hover text-sm font-semibold py-2 px-4 rounded-themed hover:bg-secondary/50 transition-themed">Cancel</button>
                    <button onClick={handleSchedule} className="theme-hover text-sm font-semibold bg-primary text-white py-2 px-4 rounded-themed hover:bg-primary-focus transition-themed">Schedule Task</button>
                </div>
            </div>
        </div>
    );
};