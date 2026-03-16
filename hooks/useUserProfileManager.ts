import { useState, useEffect, useCallback, useRef } from 'react';
import { UserProfile, UserStats, AIInsight, AIPersonaSummary, Task, Quest, ClarificationQuestion, Persona } from '../types';
import * as claudeService from '../services/claudeService';
import { useAuth } from '../contexts/AuthProvider';
import { db } from '../services/firebase';
import { doc, onSnapshot, setDoc, updateDoc, getDoc, writeBatch } from 'firebase/firestore';
import * as gamificationService from '../services/gamificationService';
import { PREDEFINED_PERSONAS } from '../src/onboardingContent';
import { getTemplatePersonaSummary } from '../src/templatePersonaSummary';
import { ACHIEVEMENTS } from '../constants';
import { v4 as uuidv4 } from 'uuid';

const defaultPersona = PREDEFINED_PERSONAS.find(p => p.id === 'balanced-adventurer') || PREDEFINED_PERSONAS[0];

const initialUserProfile: UserProfile = {
    personaId: defaultPersona.id,
    interests: defaultPersona.interests,
    dislikes: defaultPersona.dislikes,
    longTermGoals: defaultPersona.longTermGoals,
    dailyRhythm: defaultPersona.dailyRhythm || '',
    aiInsights: [],
    aiPersonaSummary: {
        persona: 'New User',
        keyThemes: [],
        suggestionStrategy: [],
        clarificationQuestions: [],
        lastUpdatedAt: new Date(0).toISOString(),
        status: 'stale'
    },
    categoryFocus: {},
};

const initialUserStats: UserStats = {
    xp: 0,
    level: 1,
    streak: 0,
    achievements: new Set(),
    unlockedRewards: new Set(),
};

export const useUserProfileManager = () => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
    const [userStats, setUserStats] = useState<UserStats>(initialUserStats);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [levelUpInfo, setLevelUpInfo] = useState<{ previousLevel: number; newLevel: number } | null>(null);
    const isGeneratingPersonaRef = useRef(false);

    const updateUserDoc = useCallback(async (updates: { 'userProfile'?: Partial<UserProfile>; 'userStats'?: Partial<UserStats> }) => {
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        
        try {
            const batch = writeBatch(db);
            const firestoreUpdates: { [key: string]: any } = {};
    
            if (updates.userProfile) {
                for (const [key, value] of Object.entries(updates.userProfile)) {
                    firestoreUpdates[`userProfile.${key}`] = value;
                }
            }
    
            if (updates.userStats) {
                const statsToUpdate = { ...updates.userStats };
                if (statsToUpdate.achievements instanceof Set) {
                    (statsToUpdate as any).achievements = Array.from(statsToUpdate.achievements);
                }
                if (statsToUpdate.unlockedRewards instanceof Set) {
                    (statsToUpdate as any).unlockedRewards = Array.from(statsToUpdate.unlockedRewards);
                }
                for (const [key, value] of Object.entries(statsToUpdate)) {
                    firestoreUpdates[`userStats.${key}`] = value;
                }
            }
    
            batch.update(userDocRef, firestoreUpdates);
            await batch.commit();
        } catch (error) {
            console.error("Error updating user document. It might not exist. Attempting to create.", error);
            // If update fails, it might be because the document doesn't exist.
            // Let's try to create it with set and merge.
            const docToSet: { userProfile?: Partial<UserProfile>, userStats?: Partial<UserStats> } = {};
            if (updates.userProfile) docToSet.userProfile = updates.userProfile;
            if (updates.userStats) {
                 const statsToSet = { ...updates.userStats };
                 if (statsToSet.achievements instanceof Set) (statsToSet as any).achievements = Array.from(statsToSet.achievements);
                 if (statsToSet.unlockedRewards instanceof Set) (statsToSet as any).unlockedRewards = Array.from(statsToSet.unlockedRewards);
                 docToSet.userStats = statsToSet;
            }
            await setDoc(userDocRef, docToSet, { merge: true });
        }
    }, [user]);

    useEffect(() => {
        if (!user) {
            setUserProfile(initialUserProfile);
            setUserStats(initialUserStats);
            setIsDataLoading(false);
            return;
        }

        setIsDataLoading(true);
        const userDocRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                const achievements = new Set<string>(data.userStats?.achievements || []);
                const unlockedRewards = new Set<string>(data.userStats?.unlockedRewards || []);
                
                const profileData = { ...initialUserProfile, ...data.userProfile };
                const statsData = { ...initialUserStats, ...data.userStats, achievements, unlockedRewards };
                
                setUserProfile(profileData);
                setUserStats(statsData);
            } else {
                console.log("Creating new user document in Firestore...");
                const newUserDoc = {
                    userProfile: {
                        ...initialUserProfile,
                        name: user.displayName,
                        email: user.email,
                    },
                    userStats: {
                        ...initialUserStats,
                        achievements: Array.from(initialUserStats.achievements),
                        unlockedRewards: Array.from(initialUserStats.unlockedRewards),
                    }
                };
                await setDoc(userDocRef, newUserDoc);
                setUserProfile(newUserDoc.userProfile);
                setUserStats(initialUserStats);
            }
            setIsDataLoading(false);
        }, (error) => {
            console.error("Firebase onSnapshot error:", error);
            setIsDataLoading(false);
        });

        return () => unsubscribe();
    }, [user]);
    
    const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
        const hasCorePersonaChanged = 'interests' in updates || 'dislikes' in updates || 'longTermGoals' in updates || 'dailyRhythm' in updates;
        const hasExplicitPersonaSummary = Object.prototype.hasOwnProperty.call(updates, 'aiPersonaSummary');
        const computedStaleSummary = hasCorePersonaChanged && userProfile.aiPersonaSummary
            ? { ...userProfile.aiPersonaSummary, status: 'stale' as const }
            : userProfile.aiPersonaSummary;
        const nextPersonaSummary = hasExplicitPersonaSummary ? updates.aiPersonaSummary ?? null : computedStaleSummary;

        const newProfileState = {
            ...userProfile,
            ...updates,
            aiPersonaSummary: nextPersonaSummary,
        };
        const updatesToPersist: Partial<UserProfile> = hasExplicitPersonaSummary
            ? updates
            : hasCorePersonaChanged
                ? { ...updates, aiPersonaSummary: computedStaleSummary }
                : updates;

        setUserProfile(newProfileState); // Optimistic update
        updateUserDoc({ userProfile: updatesToPersist });
    }, [userProfile, updateUserDoc]);

    const addXp = useCallback((amount: number) => {
        const newXp = userStats.xp + amount;
        const newLevel = gamificationService.calculateLevelFromXp(newXp);
        if (newLevel > userStats.level) {
            setLevelUpInfo({ previousLevel: userStats.level, newLevel });
        }
        updateUserDoc({ userStats: { xp: newXp, level: newLevel } });
    }, [userStats.xp, userStats.level, updateUserDoc]);

    const setStreak = useCallback((days: number) => {
        updateUserDoc({ userStats: { streak: days } });
    }, [updateUserDoc]);

    const awardXpForTaskCompletion = useCallback((completedTask: Task, allTasks: Task[], allQuests: Quest[]) => {
        const statsAfterCompletion = gamificationService.calculateStatsOnCompletion(userStats, completedTask, allTasks);
        const { newStats, unlockedAchievements } = gamificationService.checkAndAwardAchievements(statsAfterCompletion, allTasks, allQuests);
        if (newStats.level > userStats.level) {
            setLevelUpInfo({ previousLevel: userStats.level, newLevel: newStats.level });
        }
        updateUserDoc({ userStats: newStats });
    }, [userStats, updateUserDoc]);

    const awardXpForBulkCompletion = useCallback((completedTasks: Task[], allTasks: Task[], allQuests: Quest[]) => {
        const statsAfterCompletion = gamificationService.calculateStatsOnBulkCompletion(userStats, completedTasks, allTasks);
        const { newStats } = gamificationService.checkAndAwardAchievements(statsAfterCompletion, allTasks, allQuests);
        if (newStats.level > userStats.level) {
            setLevelUpInfo({ previousLevel: userStats.level, newLevel: newStats.level });
        }
        updateUserDoc({ userStats: newStats });
    }, [userStats, updateUserDoc]);

    const unlockAllRewards = useCallback(() => {
        const allAchievementIds = new Set(ACHIEVEMENTS.map(a => a.id));
        updateUserDoc({ userStats: { achievements: allAchievementIds } });
    }, [updateUserDoc]);
    
    const clearLevelUp = () => setLevelUpInfo(null);
    
    const manageAIInsight = (insightId: string, status: 'accepted' | 'dismissed') => {
        const newInsights = userProfile.aiInsights.map(i => i.id === insightId ? {...i, status} : i);
        updateUserProfile({ aiInsights: newInsights });
    };

    const triggerAIInsightSynthesis = useCallback(async (tasks: Task[]) => {
        const newInsights = await claudeService.synthesizeAIInsights(userProfile, tasks);
        if (newInsights.length > 0) {
            const existingIds = new Set(userProfile.aiInsights.map(i => i.id));
            const trulyNew = newInsights.filter(i => !existingIds.has(i.id));
            if (trulyNew.length > 0) {
                 updateUserProfile({ aiInsights: [...userProfile.aiInsights, ...trulyNew] });
            }
        }
    }, [userProfile, updateUserProfile]);

    const generateAndSaveAIPersona = useCallback(async (correctiveFeedback?: string) => {
        if (isGeneratingPersonaRef.current || userProfile.aiPersonaSummary?.status === 'updating') return;
        isGeneratingPersonaRef.current = true;
        try {
            updateUserProfile({ aiPersonaSummary: { ...userProfile.aiPersonaSummary, status: 'updating' } as AIPersonaSummary });
            const summary = await claudeService.synthesizeUserProfileIntoPersona(userProfile, correctiveFeedback);
            if (summary) {
                updateUserProfile({ aiPersonaSummary: { ...summary, status: 'current' } });
            } else {
                updateUserProfile({ aiPersonaSummary: { ...userProfile.aiPersonaSummary, status: 'stale' } as AIPersonaSummary });
            }
        } finally {
            isGeneratingPersonaRef.current = false;
        }
    }, [userProfile, updateUserProfile]);
    
    const regenerateAIPersona = useCallback(async (feedback: string) => {
        await generateAndSaveAIPersona(feedback);
    }, [generateAndSaveAIPersona]);
    
    const removeThemeFromProfile = (themeToRemove: string) => {
        if (userProfile.aiPersonaSummary) {
            const newThemes = (userProfile.aiPersonaSummary.keyThemes || []).filter(t => t !== themeToRemove);
            updateUserProfile({
                aiPersonaSummary: { ...userProfile.aiPersonaSummary, keyThemes: newThemes, status: 'stale' }
            });
        }
    };
    const answerClarificationQuestion = (questionId: string, answer: string) => {
        if (userProfile.aiPersonaSummary) {
            const questionText = userProfile.aiPersonaSummary.clarificationQuestions.find(q => q.id === questionId)?.question;
            const newInterests = `${userProfile.interests}\n[Response to: "${questionText}"] ${answer}`;
            const newQuestions = userProfile.aiPersonaSummary.clarificationQuestions.filter(q => q.id !== questionId);
            updateUserProfile({
                interests: newInterests,
                aiPersonaSummary: { ...userProfile.aiPersonaSummary, clarificationQuestions: newQuestions, status: 'stale' }
            });
        }
    };

    const toggleCategoryFocus = useCallback((category: string) => {
        const currentFocus = userProfile.categoryFocus[category];
        const newFocus = { ...userProfile.categoryFocus };
        if (currentFocus === 'more') newFocus[category] = 'less';
        else if (currentFocus === 'less') delete newFocus[category];
        else newFocus[category] = 'more';
        updateUserProfile({ categoryFocus: newFocus });
    }, [userProfile.categoryFocus, updateUserProfile]);

    const skipClarificationQuestion = useCallback(async (questionIdToSkip: string) => {
        if (!userProfile.aiPersonaSummary) return;

        const updatedQuestions = userProfile.aiPersonaSummary.clarificationQuestions.filter(q => q.id !== questionIdToSkip);
        
        updateUserProfile({ 
            aiPersonaSummary: { 
                ...userProfile.aiPersonaSummary, 
                clarificationQuestions: updatedQuestions,
            } 
        });
    }, [userProfile, updateUserProfile]);

    const shuffleClarificationQuestion = useCallback(async (questionIdToShuffle: string) => {
        if (!userProfile.aiPersonaSummary) return;

        const currentQuestion = userProfile.aiPersonaSummary.clarificationQuestions.find(q => q.id === questionIdToShuffle);
        if (!currentQuestion) return;

        updateUserProfile({
            aiPersonaSummary: {
                ...userProfile.aiPersonaSummary,
                clarificationQuestions: userProfile.aiPersonaSummary.clarificationQuestions.map(q => q.id === questionIdToShuffle ? { ...q, isLoading: true } : q)
            }
        });

        const newQuestion = await claudeService.getNewClarificationQuestion(
            userProfile,
            userProfile.aiPersonaSummary.clarificationQuestions,
            { excludedCategories: [currentQuestion.category] }
        );

        if (newQuestion) {
            const updatedQuestions = userProfile.aiPersonaSummary.clarificationQuestions.map(q =>
                q.id === questionIdToShuffle ? { ...newQuestion, id: q.id } as ClarificationQuestion : q
            );
            updateUserProfile({ aiPersonaSummary: { ...userProfile.aiPersonaSummary, clarificationQuestions: updatedQuestions }});
        } else {
             updateUserProfile({ aiPersonaSummary: { ...userProfile.aiPersonaSummary, clarificationQuestions: userProfile.aiPersonaSummary.clarificationQuestions.map(q => q.id === questionIdToShuffle ? { ...q, isLoading: false } : q) } });
        }
    }, [userProfile, updateUserProfile]);

    const shuffleQuestionOptions = useCallback(async (questionIdToShuffle: string) => {
        if (!userProfile.aiPersonaSummary) return;
        const currentQuestion = userProfile.aiPersonaSummary.clarificationQuestions.find(q => q.id === questionIdToShuffle);
        if (!currentQuestion) return;

        updateUserProfile({
             aiPersonaSummary: {
                ...userProfile.aiPersonaSummary,
                clarificationQuestions: userProfile.aiPersonaSummary.clarificationQuestions.map(q => q.id === questionIdToShuffle ? { ...q, isShufflingOptions: true } : q)
            }
        });

        const newOptions = await claudeService.getNewQuestionOptions(userProfile, currentQuestion.question, currentQuestion.options || []);

        const updatedQuestions = userProfile.aiPersonaSummary.clarificationQuestions.map(q =>
            q.id === questionIdToShuffle ? { ...q, isShufflingOptions: false, options: newOptions || q.options } : q
        );
        updateUserProfile({ aiPersonaSummary: { ...userProfile.aiPersonaSummary, clarificationQuestions: updatedQuestions }});

    }, [userProfile, updateUserProfile]);

    const applyPredefinedPersona = (persona: Persona) => {
        const templateSummary = getTemplatePersonaSummary(persona);
        updateUserProfile({
            personaId: persona.id,
            interests: persona.interests,
            dislikes: persona.dislikes,
            longTermGoals: persona.longTermGoals,
            dailyRhythm: persona.dailyRhythm,
            aiPersonaSummary: templateSummary,
        });
    };
    
    return {
        userProfile,
        userStats,
        isDataLoading,
        updateUserProfile,
        manageAIInsight,
        triggerAIInsightSynthesis,
        generateAndSaveAIPersona,
        regenerateAIPersona,
        removeThemeFromProfile,
        answerClarificationQuestion,
        skipClarificationQuestion,
        shuffleClarificationQuestion,
        shuffleQuestionOptions,
        toggleCategoryFocus,
        applyPredefinedPersona,
        addXp,
        setStreak,
        unlockAllRewards,
        levelUpInfo,
        clearLevelUp,
        awardXpForTaskCompletion,
        awardXpForBulkCompletion,
        hasPendingInsights: userProfile.aiInsights.some(i => i.status === 'pending'),
    };
};