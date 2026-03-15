import { Task, UserStats, Quest, Achievement } from '../types';
import { ACHIEVEMENTS, LEVEL_XP_BASE, LEVEL_XP_GROWTH } from '../constants';

/**
 * Calculates the total XP required to reach a certain level from level 1.
 */
const xpForLevel = (level: number): number => {
    let totalXp = 0;
    for (let i = 1; i < level; i++) {
        totalXp += Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_GROWTH, i - 1));
    }
    return totalXp;
};

/**
 * Calculates a user's level based on their total XP.
 */
export const calculateLevelFromXp = (xp: number): number => {
    let level = 1;
    while (xp >= xpForLevel(level + 1)) {
        level++;
    }
    return level;
};

/**
 * Calculates a new streak based on the last completed task.
 */
const calculateNewStreak = (currentStreak: number, allTasks: Task[]): number => {
    const completedTasks = allTasks
        .filter(t => t.completed_at)
        .sort((a, b) => b.completed_at!.getTime() - a.completed_at!.getTime());

    if (completedTasks.length <= 1) {
        return completedTasks.length > 0 ? 1 : 0;
    }

    const lastCompletion = completedTasks[0].completed_at!;
    const secondLastCompletion = completedTasks[1].completed_at!;
    
    // Normalize dates to the start of the day
    const lastDay = new Date(lastCompletion.getFullYear(), lastCompletion.getMonth(), lastCompletion.getDate());
    const secondLastDay = new Date(secondLastCompletion.getFullYear(), secondLastCompletion.getMonth(), secondLastCompletion.getDate());

    const oneDay = 24 * 60 * 60 * 1000;
    const dayDifference = (lastDay.getTime() - secondLastDay.getTime()) / oneDay;

    if (dayDifference === 0) {
        return currentStreak; // multiple tasks on the same day don't increase streak
    }
    
    if (dayDifference === 1) {
        return currentStreak + 1; // Consecutive days
    }

    return 1; // Streak is broken
};

/**
 * Updates user stats after a task is completed.
 */
export const calculateStatsOnCompletion = (
    currentStats: UserStats,
    completedTask: Task,
    allTasks: Task[]
): UserStats => {
    const xpGained = completedTask.xp_awarded || completedTask.xp_estimate || 0;
    const newXp = currentStats.xp + xpGained;
    const newStreak = calculateNewStreak(currentStats.streak, allTasks);
    const newLevel = calculateLevelFromXp(newXp);

    return {
        ...currentStats,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
    };
};

/**
 * Efficiently updates user stats after multiple tasks are completed at once.
 */
export const calculateStatsOnBulkCompletion = (
    currentStats: UserStats,
    newlyCompletedTasks: Task[],
    allTasks: Task[]
): UserStats => {
    const totalXpGained = newlyCompletedTasks.reduce((sum, task) => sum + (task.xp_awarded || task.xp_estimate || 0), 0);
    const newXp = currentStats.xp + totalXpGained;
    // Streak calculation relies on the sequence of completions, so we can reuse the existing logic
    // as it will check the most recent two completions from the full updated list.
    const newStreak = calculateNewStreak(currentStats.streak, allTasks);
    const newLevel = calculateLevelFromXp(newXp);

    return {
        ...currentStats,
        xp: newXp,
        level: newLevel,
        streak: newStreak,
    };
};

/**
 * Checks for any newly unlocked achievements and updates stats accordingly.
 */
export const checkAndAwardAchievements = (
    stats: UserStats,
    tasks: Task[],
    quests: Quest[]
): { newStats: UserStats; unlockedAchievements: Achievement[] } => {
    const unlockedAchievements: Achievement[] = [];
    const newAchievements = new Set(stats.achievements);

    ACHIEVEMENTS.forEach(achievement => {
        if (!newAchievements.has(achievement.id)) {
            // Pass the potentially updated stats to the check function
            if (achievement.check({ ...stats, achievements: newAchievements }, tasks, quests)) {
                newAchievements.add(achievement.id);
                unlockedAchievements.push(achievement);
            }
        }
    });

    return {
        newStats: { ...stats, achievements: newAchievements },
        unlockedAchievements,
    };
};