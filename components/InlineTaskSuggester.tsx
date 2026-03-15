import React, { useState, useEffect, useRef } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { Task, Suggestion, FeedbackReason, EnrichedTaskData, SortByType, GroupByType, TimeOfDay } from '../types';
import { dateToYMD } from '../utils/dateUtils';

interface InlineTaskSuggesterProps {
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
    onClose: () => void;
    onTaskInserted: () => void;
}

const feedbackOptions: { reason: FeedbackReason; label: string }[] = [
    { reason: 'irrelevant', label: 'Irrelevant' },
    { reason: 'not_now', label: 'Not right now' },
    { reason: 'too_difficult', label: 'Too difficult' },
    { reason: 'already_done', label: 'Already did this' }
];

export const InlineTaskSuggester: React.FC<InlineTaskSuggesterProps> = ({
    taskAbove,
    taskBelow,
    tasksForDay,
    sortBy,
    groupBy,
    activeFilters,
    onClose,
    onTaskInserted,
}) => {
    const { getInContextSuggestion, insertTask, addTask } = useTasks();
    const [isLoading, setIsLoading] = useState(true);
    const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'suggest' | 'manual' | 'feedback'>('suggest');
    const [manualInput, setManualInput] = useState('');
    const [feedbackTimerId, setFeedbackTimerId] = useState<number | null>(null);
    const componentRef = useRef<HTMLDivElement>(null);

    const fetchSuggestion = async (feedback?: FeedbackReason) => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await getInContextSuggestion({
                taskAbove,
                taskBelow,
                tasksForDay,
                sortBy,
                groupBy,
            });
            setSuggestion(result);
        } catch (e) {
            setError("Could not get a suggestion. Please try again or enter a task manually.");
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSuggestion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskAbove?.id, taskBelow?.id]); // Re-fetch only if the surrounding tasks change

    const handleAccept = () => {
        if (!suggestion || !componentRef.current) return;
        const fromRect = componentRef.current.getBoundingClientRect();
        
        const enrichedData: EnrichedTaskData = suggestion;
        const anchorTask = taskBelow || taskAbove;
        if (anchorTask) {
             const position = taskBelow ? 'above' : 'below';
            insertTask(enrichedData, anchorTask.id, position, { fromRect, type: 'accept-compact' });
            onTaskInserted();
        } else {
            // Fallback if no anchor, though this case shouldn't happen with current UI
            const date = new Date();
            addTask(enrichedData, date, { fromRect, type: 'accept-compact' });
            onTaskInserted();
        }
        onClose();
    };

    const handleShuffleClick = () => {
        setViewMode('feedback');
        const timer = window.setTimeout(() => {
            setViewMode('suggest');
            fetchSuggestion();
        }, 4000);
        setFeedbackTimerId(timer);
    };

    const handleFeedbackSelect = (reason: FeedbackReason) => {
        if (feedbackTimerId) clearTimeout(feedbackTimerId);
        setViewMode('suggest');
        fetchSuggestion(reason); // Pass feedback to get a better suggestion
    };

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!manualInput.trim() || !componentRef.current) return;

        const enrichedData: EnrichedTaskData = {
            title: manualInput.trim(),
            description: '',
            category: 'Productivity', // default
            duration_min: 15, // default
            xp_estimate: 20, // default
            original_input: manualInput.trim(),
        };
        
        const anchorTask = taskBelow || taskAbove;
        if (anchorTask) {
            const fromRect = componentRef.current.getBoundingClientRect();
            const position = taskBelow ? 'above' : 'below';
            insertTask(enrichedData, anchorTask.id, position, { fromRect, type: 'accept-compact' });
            onTaskInserted();
        } else {
            const date = new Date();
            addTask(manualInput, date);
            onTaskInserted();
        }
        onClose();
    };
    
    const handleSwitchToManual = () => {
        if (suggestion) {
            setManualInput(suggestion.title);
        }
        setViewMode('manual');
    };

    const renderContent = () => {
        if (isLoading) {
            return <p className="text-text-secondary animate-pulse text-center p-4">Thinking...</p>;
        }
        if (error) {
            return <p className="text-red-400 text-center p-4">{error}</p>;
        }

        if (viewMode === 'manual') {
            return (
                <form onSubmit={handleManualSubmit} className="p-2 flex items-center gap-2">
                    <input
                        type="text"
                        value={manualInput}
                        onChange={(e) => setManualInput(e.target.value)}
                        placeholder="What's the task?"
                        className="flex-1 bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-md p-2 text-text-primary placeholder:text-text-secondary transition"
                        autoFocus
                    />
                    <button type="submit" className="p-2 rounded-md hover:bg-primary/50 text-xl" title="Confirm entry">✓</button>
                    <button type="button" onClick={() => setViewMode('suggest')} className="p-2 rounded-md hover:bg-primary/50 text-xl" title="Cancel manual entry">×</button>
                </form>
            );
        }

        if (viewMode === 'feedback') {
            return (
                <div className="p-4">
                    <p className="text-sm font-semibold text-center text-text-secondary mb-3">Why not this one?</p>
                    <div className="space-y-2">
                        {feedbackOptions.map(({ reason, label }) => (
                            <button key={reason} onClick={() => handleFeedbackSelect(reason)} className="w-full text-center text-sm py-2 px-3 rounded-md bg-secondary hover:bg-primary/50 transition">{label}</button>
                        ))}
                    </div>
                    <div className="w-full bg-secondary h-1 rounded-full mt-4 overflow-hidden"><div className="bg-primary h-1" style={{ animation: 'progress-timer 4s linear forwards' }}></div></div>
                </div>
            );
        }

        if (suggestion) {
            return (
                <div className="p-3 flex items-center justify-between gap-3">
                    <div className="flex-1">
                        <p className="font-semibold text-text-primary">{suggestion.title}</p>
                        <p className="text-xs text-text-secondary italic">💡 {suggestion.reasoning}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={handleAccept} className="p-2 rounded-md hover:bg-primary/50 text-xl" title="Accept">✓</button>
                        <button onClick={handleShuffleClick} className="p-2 rounded-md hover:bg-primary/50 text-xl" title="Shuffle">⟳</button>
                        <button onClick={handleSwitchToManual} className="p-2 rounded-md hover:bg-primary/50 text-xl" title="Edit or type manually">✏️</button>
                        <button onClick={onClose} className="p-2 rounded-md hover:bg-primary/50 text-xl" title="Dismiss">×</button>
                    </div>
                </div>
            );
        }
        
        return null;
    };

    return (
        <div ref={componentRef} className="bg-surface border-2 border-dashed border-accent rounded-lg my-2 animate-themed-enter">
            {renderContent()}
        </div>
    );
};