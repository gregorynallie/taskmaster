export type NurtureMood =
    | 'Curious'
    | 'Cozy'
    | 'Energized'
    | 'Restless'
    | 'Lonely'
    | 'Inspired'
    | 'Overworked'
    | 'Wistful'
    | 'Glowing';

export type NurtureTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export type NurtureUnlockKey =
    | 'gym_corner'
    | 'creative_desk'
    | 'social_corner'
    | 'window_view'
    | 'bookshelf'
    | 'growing_plant'
    | 'reading_lamp';

export type NurtureGift = {
    id: string;
    label: string;
    createdAt: string;
    expiresAt: string;
};

export type NurtureLetter = {
    id: string;
    body: string;
    createdAt: string;
    read: boolean;
    moodAtWrite: NurtureMood;
    gift?: NurtureGift;
};

export type NurtureAppearance = {
    athletic: boolean;
    artistic: boolean;
    social: boolean;
    focused: boolean;
};

export type NurtureBehaviorFlags = {
    workoutStreak3: boolean;
    lateNightPattern: boolean;
    firstAfterInactivity: boolean;
    fullDayCompletion: boolean;
    streakEnded: boolean;
    streakResumed: boolean;
};

export type NurtureState = {
    petName: string;
    setupComplete: boolean;
    moodOverride: NurtureMood | null;
    letters: NurtureLetter[];
    unreadLetterId: string | null;
    unlocks: Record<NurtureUnlockKey, boolean>;
    recentUnlockAt: string | null;
    nextNoteDueAt: string | null;
    openedDays: string[];
    timeOverride: NurtureTimeOfDay | null;
};

export type NurtureCategoryBalance = Record<string, number>;
