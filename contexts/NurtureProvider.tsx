import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Task, NurtureAppearance, NurtureBehaviorFlags, NurtureCategoryBalance, NurtureLetter, NurtureMood, NurtureState, NurtureTimeOfDay, NurtureUnlockKey } from '../types';
import { useTasks } from './TasksProvider';
import { useSettings } from './SettingsProvider';
import { useAuth } from './AuthProvider';
import { generateNurtureLetter } from '../services/claudeService';

type NurtureContextType = {
    state: NurtureState;
    currentMood: NurtureMood;
    appearance: NurtureAppearance;
    behaviors: NurtureBehaviorFlags;
    streakDays: number;
    weeklyCategoryBalance: NurtureCategoryBalance;
    activeGifts: NurtureLetter['gift'][];
    hasUnreadLetter: boolean;
    hasRecentMilestone: boolean;
    iconTone: 'neutral' | 'warm' | 'muted';
    habitatTimeOfDay: NurtureTimeOfDay;
    nextUnlockHint: string;
    setupPet: (name: string) => void;
    setMoodOverride: (mood: NurtureMood | null) => void;
    setTimeOverride: (time: NurtureTimeOfDay | null) => void;
    markLettersRead: () => void;
    clearLetters: () => void;
    grantUnlock: (key: NurtureUnlockKey) => void;
    forceGenerateLetter: (commit: boolean) => Promise<string | null>;
    resetNurtureState: () => void;
};

const STORAGE_KEY = 'taskmaster_nurture_state_v1';
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const ALL_UNLOCKS: NurtureUnlockKey[] = ['gym_corner', 'creative_desk', 'social_corner', 'window_view', 'bookshelf', 'growing_plant', 'reading_lamp'];

const defaultState = (): NurtureState => ({
    petName: '',
    setupComplete: false,
    moodOverride: null,
    letters: [],
    unreadLetterId: null,
    unlocks: {
        gym_corner: false,
        creative_desk: false,
        social_corner: false,
        window_view: false,
        bookshelf: false,
        growing_plant: false,
        reading_lamp: false,
    },
    recentUnlockAt: null,
    nextNoteDueAt: null,
    openedDays: [],
    timeOverride: null,
});

const NurtureContext = createContext<NurtureContextType | undefined>(undefined);

const toYmd = (d: Date): string => d.toISOString().slice(0, 10);
const normalizeCategory = (raw: string): string => raw.toLowerCase().trim();
const daysBetween = (a: Date, b: Date): number => Math.floor((a.getTime() - b.getTime()) / MS_PER_DAY);

const readState = (): NurtureState => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return defaultState();
        const parsed = JSON.parse(raw) as NurtureState;
        return { ...defaultState(), ...parsed };
    } catch {
        return defaultState();
    }
};

const randomDays = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

const countCompletedSince = (tasks: Task[], days: number, categories?: string[]): number => {
    const now = new Date();
    const threshold = new Date(now.getTime() - days * MS_PER_DAY);
    return tasks.filter(t => {
        if (!t.completed_at) return false;
        if (t.completed_at < threshold) return false;
        if (!categories || categories.length === 0) return true;
        const c = normalizeCategory(t.category || '');
        return categories.some(cat => c.includes(cat));
    }).length;
};

const buildWeeklyBalance = (tasks: Task[]): NurtureCategoryBalance => {
    const now = new Date();
    const threshold = new Date(now.getTime() - 7 * MS_PER_DAY);
    const counts: NurtureCategoryBalance = {};
    tasks.forEach(t => {
        if (!t.completed_at || t.completed_at < threshold) return;
        const key = t.category || 'Other';
        counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
};

const currentStreak = (tasks: Task[]): number => {
    const completedDays = new Set<string>();
    tasks.forEach(t => {
        if (t.completed_at) completedDays.add(toYmd(t.completed_at));
    });
    let streak = 0;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    while (completedDays.has(toYmd(cursor))) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
};

export const NurtureProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { tasks } = useTasks();
    const { user } = useAuth();
    const { mode } = useSettings();
    const [state, setState] = useState<NurtureState>(() => readState());
    const noteInFlightRef = useRef(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
            // best effort
        }
    }, [state]);

    useEffect(() => {
        const today = toYmd(new Date());
        setState(prev => prev.openedDays.includes(today) ? prev : { ...prev, openedDays: [...prev.openedDays.slice(-119), today] });
    }, []);

    const streakDays = useMemo(() => currentStreak(tasks), [tasks]);
    const weeklyCategoryBalance = useMemo(() => buildWeeklyBalance(tasks), [tasks]);
    const weeklyTotal = useMemo(
        () => Object.values(weeklyCategoryBalance).reduce<number>((a, b) => a + Number(b), 0),
        [weeklyCategoryBalance]
    );
    const productivityShare = useMemo(() => {
        if (!weeklyTotal) return 0;
        const productivity = Object.entries(weeklyCategoryBalance)
            .filter(([k]) => normalizeCategory(k).includes('product'))
            .reduce<number>((sum, [, v]) => sum + Number(v), 0);
        return productivity / weeklyTotal;
    }, [weeklyCategoryBalance, weeklyTotal]);

    const behaviorSignals = useMemo(() => {
        const health7 = countCompletedSince(tasks, 7, ['health', 'fitness', 'workout']);
        const creative14 = countCompletedSince(tasks, 14, ['creative', 'art', 'music', 'writing']);
        const social7 = countCompletedSince(tasks, 7, ['social']);
        const completionByDay = new Map<string, number>();
        tasks.forEach(t => {
            if (!t.completed_at) return;
            const day = toYmd(t.completed_at);
            completionByDay.set(day, (completionByDay.get(day) || 0) + 1);
        });
        const hasFullDay = Array.from(completionByDay.values()).some(v => v >= 4);

        const lateNight = tasks.filter(t => {
            if (!t.completed_at) return false;
            const h = t.completed_at.getHours();
            return h >= 22 || h <= 3;
        }).length >= 3;

        const sortedCompletions = tasks
            .filter(t => t.completed_at)
            .sort((a, b) => (a.completed_at!.getTime() - b.completed_at!.getTime()));
        const newest = sortedCompletions[sortedCompletions.length - 1]?.completed_at;
        const previous = sortedCompletions[sortedCompletions.length - 2]?.completed_at;
        const firstAfterInactivity = !!(newest && previous && daysBetween(newest, previous) >= 3);

        const streakEnded = streakDays === 0 && sortedCompletions.length > 0;
        const streakResumed = streakDays > 0 && firstAfterInactivity;

        return {
            health7,
            creative14,
            social7,
            lateNight,
            hasFullDay,
            firstAfterInactivity,
            streakEnded,
            streakResumed,
        };
    }, [tasks, streakDays]);

    const currentMood: NurtureMood = useMemo(() => {
        if (state.moodOverride) return state.moodOverride;
        if (state.recentUnlockAt && Date.now() - new Date(state.recentUnlockAt).getTime() < 36 * 60 * 60 * 1000) return 'Glowing';
        const completed7 = countCompletedSince(tasks, 7);
        if (completed7 === 0 && state.openedDays.length >= 3) return 'Wistful';
        if (productivityShare >= 0.72 && countCompletedSince(tasks, 7, ['social', 'fun']) <= 1) return 'Overworked';
        if (countCompletedSince(tasks, 21, ['health', 'fitness', 'workout']) >= 12) return 'Energized';
        if (countCompletedSince(tasks, 14, ['creative', 'art', 'music', 'writing']) >= 8) return 'Inspired';
        if (countCompletedSince(tasks, 7, ['social']) === 0 && completed7 > 0) return 'Lonely';
        if (productivityShare > 0.58 && countCompletedSince(tasks, 7, ['fun']) === 0) return 'Restless';
        if (completed7 >= 5 && Object.keys(weeklyCategoryBalance).length >= 3) return 'Cozy';
        return 'Curious';
    }, [state.moodOverride, state.recentUnlockAt, tasks, state.openedDays.length, productivityShare, weeklyCategoryBalance]);

    const appearance = useMemo<NurtureAppearance>(() => ({
        athletic: countCompletedSince(tasks, 30, ['health', 'fitness', 'workout']) >= 15,
        artistic: countCompletedSince(tasks, 21, ['creative', 'art', 'music', 'writing']) >= 10,
        social: countCompletedSince(tasks, 30, ['social']) >= 12,
        focused: productivityShare >= 0.45,
    }), [tasks, productivityShare]);

    const behaviors = useMemo<NurtureBehaviorFlags>(() => ({
        workoutStreak3: behaviorSignals.health7 >= 3,
        lateNightPattern: behaviorSignals.lateNight,
        firstAfterInactivity: behaviorSignals.firstAfterInactivity,
        fullDayCompletion: behaviorSignals.hasFullDay,
        streakEnded: behaviorSignals.streakEnded,
        streakResumed: behaviorSignals.streakResumed,
    }), [behaviorSignals]);

    useEffect(() => {
        const updates: Partial<NurtureState> = {};
        const nowIso = new Date().toISOString();

        if (!state.unlocks.gym_corner && countCompletedSince(tasks, 30, ['health', 'fitness', 'workout']) >= 20) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), gym_corner: true };
            updates.recentUnlockAt = nowIso;
        }
        if (!state.unlocks.creative_desk && countCompletedSince(tasks, 14, ['creative', 'art', 'music', 'writing']) >= 8) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), creative_desk: true };
            updates.recentUnlockAt = nowIso;
        }
        if (!state.unlocks.social_corner && countCompletedSince(tasks, 30, ['social']) >= 12) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), social_corner: true };
            updates.recentUnlockAt = nowIso;
        }
        if (!state.unlocks.window_view && streakDays >= 30) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), window_view: true };
            updates.recentUnlockAt = nowIso;
        }
        if (!state.unlocks.bookshelf && Object.keys(weeklyCategoryBalance).length >= 4) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), bookshelf: true };
            updates.recentUnlockAt = nowIso;
        }
        if (!state.unlocks.growing_plant && state.openedDays.length >= 60) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), growing_plant: true };
            updates.recentUnlockAt = nowIso;
        }
        const highOutputDays = (() => {
            const byDay = new Map<string, number>();
            tasks.forEach(t => {
                if (!t.completed_at) return;
                const d = toYmd(t.completed_at);
                byDay.set(d, (byDay.get(d) || 0) + 1);
            });
            return Array.from(byDay.values()).filter(v => v >= 6).length;
        })();
        if (!state.unlocks.reading_lamp && highOutputDays >= 3) {
            updates.unlocks = { ...(updates.unlocks || state.unlocks), reading_lamp: true };
            updates.recentUnlockAt = nowIso;
        }

        if (updates.unlocks || updates.recentUnlockAt) {
            setState(prev => ({ ...prev, ...updates }));
        }
    }, [tasks, streakDays, weeklyCategoryBalance, state.unlocks, state.openedDays.length]);

    const activeGifts = useMemo(() => {
        const now = Date.now();
        return state.letters
            .map(l => l.gift)
            .filter((g): g is NonNullable<typeof g> => !!g && new Date(g.expiresAt).getTime() > now);
    }, [state.letters]);

    const hasUnreadLetter = !!state.unreadLetterId;
    const hasRecentMilestone = !!state.recentUnlockAt && Date.now() - new Date(state.recentUnlockAt).getTime() < 24 * 60 * 60 * 1000;
    const iconTone: 'neutral' | 'warm' | 'muted' = currentMood === 'Wistful' || currentMood === 'Lonely' ? 'muted' : (currentMood === 'Cozy' || currentMood === 'Glowing' ? 'warm' : 'neutral');

    const habitatTimeOfDay = useMemo<NurtureTimeOfDay>(() => {
        if (state.timeOverride) return state.timeOverride;
        const h = new Date().getHours();
        if (h < 11) return 'morning';
        if (h < 17) return 'afternoon';
        if (h < 22) return 'evening';
        return 'night';
    }, [state.timeOverride]);

    const nextUnlockHint = useMemo(() => {
        if (!state.unlocks.gym_corner) {
            const remaining = Math.max(0, 20 - countCompletedSince(tasks, 30, ['health', 'fitness', 'workout']));
            return `${remaining} more health tasks -> gym corner`;
        }
        if (!state.unlocks.creative_desk) {
            const remaining = Math.max(0, 8 - countCompletedSince(tasks, 14, ['creative', 'art', 'music', 'writing']));
            return `${remaining} more creative tasks -> art desk`;
        }
        if (!state.unlocks.social_corner) {
            const remaining = Math.max(0, 12 - countCompletedSince(tasks, 30, ['social']));
            return `${remaining} more social tasks -> social corner`;
        }
        if (!state.unlocks.window_view) {
            return `${Math.max(0, 30 - streakDays)} more streak days -> window view`;
        }
        return 'Keep nurturing your routine to uncover more habitat moments.';
    }, [state.unlocks, tasks, streakDays]);

    const forceGenerateLetter = useCallback(async (commit: boolean): Promise<string | null> => {
        const body = await generateNurtureLetter({
            petName: state.petName || 'Sprout',
            mood: currentMood,
            categoryBalance: weeklyCategoryBalance,
            streakDays,
            userName: user?.displayName || user?.email || undefined,
            unlockedRecently: hasRecentMilestone,
        });
        if (!body) return null;
        if (!commit) return body;

        const giftPool = ['a tiny wrapped gift', 'a hand-drawn cake', 'a little trophy', 'a cozy tea box'];
        const gift = Math.random() < 0.35 ? {
            id: `gift-${Date.now()}`,
            label: giftPool[Math.floor(Math.random() * giftPool.length)],
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        } : undefined;

        const newLetter: NurtureLetter = {
            id: `letter-${Date.now()}`,
            body,
            createdAt: new Date().toISOString(),
            read: false,
            moodAtWrite: currentMood,
            gift,
        };
        const nextDue = new Date(Date.now() + randomDays(5, 10) * MS_PER_DAY).toISOString();
        setState(prev => ({
            ...prev,
            letters: [newLetter, ...prev.letters].slice(0, 24),
            unreadLetterId: newLetter.id,
            nextNoteDueAt: nextDue,
        }));
        return body;
    }, [state.petName, currentMood, weeklyCategoryBalance, streakDays, user?.displayName, user?.email, hasRecentMilestone]);

    useEffect(() => {
        if (mode !== 'nurture' || !state.setupComplete) return;
        if (noteInFlightRef.current) return;
        const now = Date.now();
        const dueAt = state.nextNoteDueAt ? new Date(state.nextNoteDueAt).getTime() : 0;
        const enoughSignal = countCompletedSince(tasks, 10) >= 4;
        const minGapOk = (() => {
            const last = state.letters[0];
            if (!last) return true;
            return now - new Date(last.createdAt).getTime() >= 3 * MS_PER_DAY;
        })();
        if ((dueAt && now < dueAt) || !enoughSignal || !minGapOk) return;

        noteInFlightRef.current = true;
        void forceGenerateLetter(true).finally(() => {
            noteInFlightRef.current = false;
        });
    }, [mode, state.setupComplete, state.nextNoteDueAt, state.letters, tasks, forceGenerateLetter]);

    const value: NurtureContextType = {
        state,
        currentMood,
        appearance,
        behaviors,
        streakDays,
        weeklyCategoryBalance,
        activeGifts,
        hasUnreadLetter,
        hasRecentMilestone,
        iconTone,
        habitatTimeOfDay,
        nextUnlockHint,
        setupPet: (name: string) => setState(prev => ({ ...prev, petName: name.trim() || 'Mochi', setupComplete: true })),
        setMoodOverride: (mood) => setState(prev => ({ ...prev, moodOverride: mood })),
        setTimeOverride: (time) => setState(prev => ({ ...prev, timeOverride: time })),
        markLettersRead: () => setState(prev => ({
            ...prev,
            unreadLetterId: null,
            letters: prev.letters.map(l => ({ ...l, read: true })),
        })),
        clearLetters: () => setState(prev => ({ ...prev, letters: [], unreadLetterId: null })),
        grantUnlock: (key) => setState(prev => ({
            ...prev,
            unlocks: { ...prev.unlocks, [key]: true },
            recentUnlockAt: new Date().toISOString(),
        })),
        forceGenerateLetter,
        resetNurtureState: () => {
            if (!window.confirm('Reset all Nurture state to day one?')) return;
            setState(defaultState());
        },
    };

    return <NurtureContext.Provider value={value}>{children}</NurtureContext.Provider>;
};

export const useNurture = (): NurtureContextType => {
    const ctx = useContext(NurtureContext);
    if (!ctx) throw new Error('useNurture must be used within NurtureProvider');
    return ctx;
};
