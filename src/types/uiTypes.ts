import { THEMES } from '../themes';

export type View = 'today' | 'quests' | 'rewards' | 'explore' | 'settings' | 'journal' | 'you' | 'themeSandbox';
export type Mode = 'rpg' | 'minimal';
export type TimeOfDay = 'morning' | 'day' | 'night';
export type SortByType = 'manual' | 'title' | 'category' | 'duration' | 'date_and_time';
export type GroupByType = 'none' | 'category' | 'time_of_day' | 'by_date';
export type SortDirection = 'asc' | 'desc';

export type ViewSettings = {
    sortBy: SortByType;
    sortDirection: SortDirection;
    groupBy: GroupByType;
    categoryFilters: string[];
    timeOfDayFilters: TimeOfDay[];
    durationFilter: string | null;
    cardStyle: 'full' | 'compact';
    focusedDate: string | null;
};

export type Theme = keyof typeof THEMES;

export type SuggestionPill = {
    label: string;
    emoji: string;
};