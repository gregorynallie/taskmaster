import { Mode, Theme, View, ViewSettings, SuggestionPill, TimeOfDay, SortByType, GroupByType, SortDirection } from './uiTypes';
import { UserProfile, UserStats, Persona } from './userTypes';
import { Task, Quest, Suggestion, EnrichedTaskData, FeedbackReason, QuestSuggestionPayload } from './taskTypes';
import { OnboardingAnswers } from './onboardingTypes';

export type AnimationInfo = {
    fromRect?: DOMRect;
    type: 'add' | 'accept-full' | 'accept-compact';
    animationType?: string;
};

export type SettingsContextType = {
    mode: Mode;
    setMode: (mode: Mode) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    hasOnboarded: boolean;
    setHasOnboarded: (has: boolean) => void;
    resetOnboarding: () => void;
    currentView: View;
    setCurrentView: (view: View) => void;
    previousView: View;
    soundEffectsEnabled: boolean;
    toggleSoundEffects: () => void;
    defaultViewSettings?: ViewSettings;
    updateDefaultViewSettings: (settings: ViewSettings) => void;
    showSpoofedTasks: boolean;
    toggleShowSpoofedTasks: () => void;
    clearAllData: () => void;
    favoriteThemes: string[];
    toggleFavoriteTheme: (themeId: string) => void;
    shuffleThemesOnLoad: 'off' | 'all' | 'favorites';
    setShuffleThemesOnLoad: (value: 'off' | 'all' | 'favorites') => void;
};

export type UserProfileContextType = {
    userProfile: UserProfile;
    isDataLoading: boolean;
    updateUserProfile: (updates: Partial<UserProfile>) => void;
    manageAIInsight: (insightId: string, status: 'accepted' | 'dismissed') => void;
    triggerAIInsightSynthesis: () => Promise<void>;
    generateAndSaveAIPersona: (correctiveFeedback?: string) => Promise<void>;
    regenerateAIPersona: (feedback: string) => Promise<void>;
    removeThemeFromProfile: (themeToRemove: string) => void;
    answerClarificationQuestion: (questionId: string, answer: string) => void;
    skipClarificationQuestion: (questionIdToSkip: string) => Promise<void>;
    shuffleClarificationQuestion: (questionIdToShuffle: string) => Promise<void>;
    shuffleQuestionOptions: (questionIdToShuffle: string) => Promise<void>;
    toggleCategoryFocus: (category: string) => void;
    applyPredefinedPersona: (persona: Persona) => void;
    hasPendingInsights: boolean;
};

export type GamificationContextType = {
    userStats: UserStats;
    addXp: (amount: number) => void;
    setStreak: (days: number) => void;
    unlockAllRewards: () => void;
    levelUpInfo: { previousLevel: number, newLevel: number } | null;
    clearLevelUp: () => void;
    awardXpForTaskCompletion: (completedTask: Task, allTasks: Task[], allQuests: Quest[]) => void;
    awardXpForBulkCompletion: (completedTasks: Task[], allTasks: Task[], allQuests: Quest[]) => void;
};

export type Placeholder = {
    question: string;
    example: string;
    subtext: string;
};

export type TasksContextType = {
    tasks: Task[];
    quests: Quest[];
    addTask: (taskData: string | Task | EnrichedTaskData, date?: Date, animation?: AnimationInfo) => Promise<void>;
    completeOnboarding: (answers: OnboardingAnswers, mode: Mode) => Promise<void>;
    updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
    completeTask: (taskId: string) => Promise<void>;
    dismissTask: (taskId: string) => Promise<void>;
    addQuest: (goal: string) => Promise<void>;
    createProjectFromSuggestion: (suggestion: Suggestion) => Promise<void>;
    shuffleQuestTask: (questId: string, taskId: string) => Promise<void>;
    reorderTasks: (orderedTasks: Task[]) => Promise<void>;
    moveTask: (taskId: string, direction: 'up' | 'down') => void;
    dailySuggestions: Suggestion[];
    isSuggestionsLoading: boolean;
    suggestionsError: string | null;
    fetchDailySuggestions: (prompt?: string) => Promise<void>;
    acceptSuggestion: (suggestion: Suggestion, indexToRemove?: number, animation?: AnimationInfo) => void;
    createQuestFromSuggestions: (payload: QuestSuggestionPayload) => Promise<void>;
    shuffleSingleSuggestion: (indexToReplace: number, feedbackReason?: FeedbackReason) => Promise<void>;
    getInContextSuggestion: (context: any) => Promise<Suggestion | null>;
    rescheduleTask: (taskId: string, newDate: Date) => Promise<void>;
    rescheduleTaskForToday: (taskId: string) => Promise<void>;
    reEnrichTask: (taskId: string) => Promise<void>;
    revertTaskToOriginalText: (taskId: string) => Promise<void>;
    bulkUpdateTasks: (taskIds: string[], updates: Partial<Task>) => Promise<void>;
    bulkCompleteTasks: (taskIds: string[]) => Promise<void>;
    bulkDismissTasks: (taskIds: string[]) => Promise<void>;
    insertTask: (taskData: string | EnrichedTaskData, anchorId: string, position: 'above' | 'below', animation?: AnimationInfo) => Promise<void>;
    scheduleSuggestion: (suggestion: Suggestion, date: Date) => Promise<void>;
    activeAnimations: Map<string, AnimationInfo>;
    clearAnimation: (taskId: string) => void;
    completingTaskId: string | null;
    initiateCompletion: (taskId: string) => void;
    dismissingTaskId: string | null;
    initiateDismissal: (taskId: string) => void;
    
    // Dynamic Placeholders
    placeholders: Placeholder[];
    projectPlaceholders: Placeholder[];
    explorePlaceholders: Placeholder[];
    isTaskPlaceholdersLoading: boolean;
    isProjectPlaceholdersLoading: boolean;
    isExplorePlaceholdersLoading: boolean;

    // Suggestion Pills
    exploreSuggestionPills: SuggestionPill[];
    projectSuggestionPills: SuggestionPill[];
    isExplorePillsLoading: boolean;
    isProjectPillsLoading: boolean;
};

export type ViewOptionsContextType = {
    // State
    focusedDate: Date | null;
    sortBy: SortByType;
    sortDirection: SortDirection;
    groupBy: GroupByType;
    activeCategoryFilters: Set<string>;
    activeTimeOfDayFilters: Set<TimeOfDay>;
    activeDurationFilter: string | null;
    isCalendarOpen: boolean;
    isFilterMenuOpen: boolean;
    isSortMenuOpen: boolean;
    isGroupMenuOpen: boolean;
    isViewSettingsModalOpen: boolean;
    defaultCardStyle: 'full' | 'compact';
    compactOverrides: Set<string>;
    calendarMonth: Date;
    collapsedGroups: Set<string>;
    isCompletedVisible: boolean;
    isDismissedVisible: boolean;

    // Derived State
    activeTasks: Task[];
    completedTasks: Task[];
    dismissedTasks: Task[];
    sortedTasks: Task[];
    groupedTasks: { groupName: string; tasks: Task[] }[] | null;
    activeFiltersCount: number;
    isSortingActive: boolean;
    isGroupingActive: boolean;
    
    // Handlers
    setFocusedDate: (date: Date | null) => void;
    setSortBy: (sortBy: SortByType) => void;
    setSortDirection: (direction: SortDirection) => void;
    setGroupBy: (groupBy: GroupByType) => void;
    toggleCategoryFilter: (category: string) => void;
    toggleTimeOfDayFilter: (time: TimeOfDay) => void;
    selectDurationFilter: (durationKey: string | null) => void;
    clearAllFilters: () => void;
    clearSort: () => void;
    clearGroup: () => void;
    toggleGroupCollapse: (groupName: string) => void;
    setIsCalendarOpen: (isOpen: boolean) => void;
    setIsFilterMenuOpen: (isOpen: boolean) => void;
    setIsSortMenuOpen: (isOpen: boolean) => void;
    setIsGroupMenuOpen: (isOpen: boolean) => void;
    setIsViewSettingsModalOpen: (isOpen: boolean) => void;
    setDefaultCardStyle: (style: 'full' | 'compact') => void;
    toggleCompactOverride: (taskId: string) => void;
    willOrderChange: (taskId: string, newProps: Partial<Task>) => boolean;
    handleSaveDefaults: () => void;
    setCalendarMonth: (date: Date) => void;
    setIsCompletedVisible: (visible: boolean) => void;
    setIsDismissedVisible: (visible: boolean) => void;
};

// The old monolithic type, kept for reference during transition if needed
export type LifeQuestContextType = SettingsContextType & UserProfileContextType & GamificationContextType & TasksContextType;