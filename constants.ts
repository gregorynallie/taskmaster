import { Achievement, Reward, UserStats } from "./src/types/userTypes";
import { Task, Quest } from "./src/types/taskTypes";


export const TASK_CATEGORIES = [
    'Productivity', 'Health', 'Home', 'Social', 'Personal Growth', 'Relaxation', 'Fun'
];

export const LEVEL_XP_BASE = 250;
export const LEVEL_XP_GROWTH = 1.2;

export const REWARDS: Reward[] = [
    { id: 'reward_001', name: "New 'Cyberpunk' Theme", description: "Unlock a neon-drenched theme for the app." },
    { id: 'reward_002', name: "New 'Nature' Theme", description: "Unlock a calming nature-inspired theme." },
    { id: 'reward_003', name: "Advanced AI Stats", description: "Unlock a new view with detailed statistics on your productivity." },
];

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'ach_level_5',
        name: "Level 5 Reached",
        description: "Achieve level 5 on your life quest.",
        rewardId: 'reward_001',
        check: (stats: UserStats) => stats.level >= 5,
    },
    {
        id: 'ach_first_quest',
        name: "Quest Giver",
        description: "Complete your first major quest.",
        rewardId: 'reward_002',
        check: (stats: UserStats, tasks: Task[], quests: Quest[]) => quests.filter(q => q.status === 'completed').length >= 1,
    },
    {
        id: 'ach_streak_7',
        name: "Consistent Adventurer",
        description: "Maintain a 7-day streak of completing at least one task.",
        rewardId: 'reward_003',
        check: (stats: UserStats) => stats.streak >= 7,
    },
    {
        id: 'ach_100_tasks',
        name: "Centurion",
        description: "Complete 100 tasks.",
        rewardId: 'reward_001', // Example reuse
        check: (stats: UserStats, tasks: Task[]) => tasks.filter(t => t.completed_at).length >= 100,
    }
];

export const DURATION_RANGES: Record<string, { label: string, min: number, max: number }> = {
    quick: { label: 'Quick (≤15m)', min: 0, max: 15 },
    medium: { label: 'Medium (16-60m)', min: 16, max: 60 },
    long: { label: 'Long (>60m)', min: 61, max: Infinity },
};
