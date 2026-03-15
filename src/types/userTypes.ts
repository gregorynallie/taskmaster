export type Reward = {
    id: string;
    name: string;
    description: string;
};

export type Achievement = {
    id: string;
    name: string;
    description: string;
    rewardId: string;
    check: (stats: UserStats, tasks: any[], quests: any[]) => boolean;
};

export type UserStats = {
    xp: number;
    level: number;
    streak: number;
    achievements: Set<string>;
    unlockedRewards: Set<string>;
};

export type AIInsight = {
    id: string;
    insight: string;
    source: string;
    confidence: number;
    status: 'pending' | 'accepted' | 'dismissed';
};

export type ClarificationQuestion = {
    id: string;
    category: string;
    question: string;
    exampleAnswer?: string;
    options?: string[];
    isLoading?: boolean;
    isShufflingOptions?: boolean;
};

export type AIPersonaSummary = {
    persona: string;
    keyThemes: string[];
    suggestionStrategy: string[];
    clarificationQuestions: ClarificationQuestion[];
    lastUpdatedAt: string;
    status?: 'stale' | 'updating' | 'current';
};

export type CategoryFocusLevel = 'more' | 'less';
export type CategoryFocus = Record<string, CategoryFocusLevel>;

export type UserProfile = {
    personaId?: string;
    interests: string;
    dislikes: string;
    longTermGoals: string;
    aiInsights: AIInsight[];
    aiPersonaSummary: AIPersonaSummary | null;
    categoryFocus: CategoryFocus;
    chronotype?: string;
    dailyRhythm?: string;
};

export type Persona = Pick<UserProfile, 'interests' | 'dislikes' | 'longTermGoals' | 'dailyRhythm'> & {
    id: string;
    name: string;
};