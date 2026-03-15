import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useUserProfileManager } from '../hooks/useUserProfileManager';
import { UserProfileContextType, GamificationContextType, Task, Quest } from '../types';

type ComposedUserContextType = UserProfileContextType & GamificationContextType;

export const UserProfileContext = createContext<ComposedUserContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userProfileManager = useUserProfileManager();

    // These placeholder functions will be overridden by the TasksProvider, which has the necessary context (tasks, quests).
    const triggerAIInsightSynthesis = useCallback(async () => { console.warn("triggerAIInsightSynthesis called from incorrect provider")}, []);
    const generateAndSaveAIPersona = useCallback(async (correctiveFeedback?: string) => { console.warn("generateAndSaveAIPersona called from incorrect provider")}, []);
    const awardXpForTaskCompletion = useCallback(async (completedTask: Task, allTasks: Task[], allQuests: Quest[]) => { console.warn("awardXpForTaskCompletion called from incorrect provider")}, []);
    const awardXpForBulkCompletion = useCallback(async (completedTasks: Task[], allTasks: Task[], allQuests: Quest[]) => { console.warn("awardXpForBulkCompletion called from incorrect provider")}, []);

    const hasPendingInsights = userProfileManager.userProfile.aiInsights.some(i => i.status === 'pending');

    const contextValue: ComposedUserContextType = {
        // From useUserProfileManager (merged profile and gamification)
        userProfile: userProfileManager.userProfile,
        userStats: userProfileManager.userStats,
        isDataLoading: userProfileManager.isDataLoading,
        updateUserProfile: userProfileManager.updateUserProfile,
        manageAIInsight: userProfileManager.manageAIInsight,
        removeThemeFromProfile: userProfileManager.removeThemeFromProfile,
        answerClarificationQuestion: userProfileManager.answerClarificationQuestion,
        skipClarificationQuestion: userProfileManager.skipClarificationQuestion,
        shuffleClarificationQuestion: userProfileManager.shuffleClarificationQuestion,
        shuffleQuestionOptions: userProfileManager.shuffleQuestionOptions,
        toggleCategoryFocus: userProfileManager.toggleCategoryFocus,
        applyPredefinedPersona: userProfileManager.applyPredefinedPersona,
        
        // Placeholder functions to be overridden in TasksProvider
        triggerAIInsightSynthesis,
        generateAndSaveAIPersona,
        regenerateAIPersona: userProfileManager.regenerateAIPersona,
        hasPendingInsights,
        
        // Gamification state and actions from the merged hook
        addXp: userProfileManager.addXp,
        setStreak: userProfileManager.setStreak,
        unlockAllRewards: userProfileManager.unlockAllRewards,
        levelUpInfo: userProfileManager.levelUpInfo,
        clearLevelUp: userProfileManager.clearLevelUp,
        awardXpForTaskCompletion: userProfileManager.awardXpForTaskCompletion,
        awardXpForBulkCompletion: userProfileManager.awardXpForBulkCompletion,
    };
    
    // We create a new composed context provider that will be overridden in the TasksProvider
    // to include the full implementation of AI synthesis functions.
    const ComposedProvider = React.createElement(UserProfileContext.Provider, { value: contextValue, children });

    return ComposedProvider;
};

export const useUserProfile = (): ComposedUserContextType => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};