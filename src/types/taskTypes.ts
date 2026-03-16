import { TimeOfDay } from './uiTypes';

export type RecurrenceFrequency = 'MINUTELY' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export type DayOfWeek = 'SU' | 'MO' | 'TU' | 'WE' | 'TH' | 'FR' | 'SA';

export interface RecurringInfo {
    // A temporary field for backward compatibility with old string rules
    rule?: string; 
    frequency?: RecurrenceFrequency;
    interval?: number; // Every X minutes/hours/days/weeks/months
    daysOfWeek?: DayOfWeek[]; // For weekly recurrence
    dayOfMonth?: number; // For monthly recurrence on a specific date
}

export type EnrichedTaskData = {
    title: string;
    description: string;
    category: string;
    subcategories?: string[];
    duration_min: number;
    difficulty?: number;
    xp_estimate: number;
    isHybrid?: boolean;
    hybridCategoryName?: string;
    deadline_at?: string | null;
    original_input?: string;
    ai_generated_json?: any;
    time_of_day?: TimeOfDay;
    recurring?: RecurringInfo | null;
    scheduled_at?: string; // Added to allow AI to schedule tasks
};

export type Task = EnrichedTaskData & {
    id: string;
    created_at: Date;
    scheduled_at: string; // ISO 8601 string
    completed_at: Date | null;
    dismissed_at?: Date | null;
    xp_awarded: number | null;
    // Project-first naming (preferred)
    projectId?: string;
    projectName?: string;
    // Legacy naming kept for compatibility with existing stored data
    questId?: string;
    questName?: string;
    order?: number;
    isEnriching?: boolean;
    isSpoofed?: boolean;
};

export type Project = {
    id: string;
    name: string;
    narrative: string;
    status: 'in_progress' | 'completed';
    created_at: Date;
    completed_at: Date | null;
};

// Legacy alias while older code paths are migrated.
export type Quest = Project;

export type Suggestion = EnrichedTaskData & {
    id?: string;
    reasoning: string;
    context_tag: string;
    isLoading?: boolean;
    parentTaskId?: string;
    parentTaskTitle?: string;
    // For project creation flow
    isProjectStarter?: boolean;
    projectName?: string;
    questNarrative?: string;
    subtasks?: EnrichedTaskData[];
};

export type FeedbackReason = 'irrelevant' | 'not_now' | 'too_difficult' | 'already_done';

export type SuggestionFeedback = {
    suggestionTitle: string;
    reason: FeedbackReason;
    timestamp: number;
};

export type ProjectSuggestionPayload = {
    questName: string;
    questNarrative: string;
    suggestions: Suggestion[];
};

// Legacy alias while older code paths are migrated.
export type QuestSuggestionPayload = ProjectSuggestionPayload;