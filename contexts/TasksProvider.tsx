import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useTaskManager } from '../hooks/useTaskManager';
import { useSuggestions } from '../hooks/useSuggestions';
import { usePersonaContent } from '../hooks/usePersonaContent';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { TasksContextType, AIPersonaSummary } from '../types';
import { UserProfileContext, useUserProfile } from './UserProfileProvider';
import { useSettings } from './SettingsProvider';
import * as claudeService from '../services/claudeService';
import { useAuth } from './AuthProvider';

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const userProfileManager = useUserProfile();
    const settingsManager = useSettings();

    const { playSound } = useSoundEffects(settingsManager.theme, settingsManager.soundEffectsEnabled);

    const taskManager = useTaskManager({
        user,
        userProfile: userProfileManager.userProfile,
        gamificationActions: {
            awardXpForTaskCompletion: userProfileManager.awardXpForTaskCompletion,
            awardXpForBulkCompletion: userProfileManager.awardXpForBulkCompletion,
        },
        settings: {
            setHasOnboarded: settingsManager.setHasOnboarded,
        },
        userProfileActions: {
            updateUserProfile: userProfileManager.updateUserProfile,
        },
        playSound,
    });

    const suggestions = useSuggestions({
        user,
        tasks: taskManager.tasks,
        quests: taskManager.quests,
        userProfile: userProfileManager.userProfile,
        mode: settingsManager.mode,
        addTask: taskManager.addTask,
        playSound,
    });

    const personaContent = usePersonaContent({
        user,
        userProfile: userProfileManager.userProfile,
        mode: settingsManager.mode,
    });

    // These functions live here because they need both task history and user profile —
    // two separate contexts that only come together at this composition layer.
    const triggerAIInsightSynthesis = useCallback(async () => {
        const newInsights = await claudeService.synthesizeAIInsights(userProfileManager.userProfile, taskManager.tasks);
        if (newInsights.length > 0) {
            const existingIds = new Set(userProfileManager.userProfile.aiInsights.map((i: any) => i.id));
            const trulyNew = newInsights.filter(i => !existingIds.has(i.id));
            if (trulyNew.length > 0) {
                userProfileManager.updateUserProfile({ aiInsights: [...userProfileManager.userProfile.aiInsights, ...trulyNew] });
            }
        }
    }, [userProfileManager, taskManager.tasks]);

    const generateAndSaveAIPersona = useCallback(async (correctiveFeedback?: string) => {
        userProfileManager.updateUserProfile({ aiPersonaSummary: { ...userProfileManager.userProfile.aiPersonaSummary, status: 'updating' } as AIPersonaSummary });
        const summary = await claudeService.synthesizeUserProfileIntoPersona(userProfileManager.userProfile, correctiveFeedback);
        if (summary) {
            userProfileManager.updateUserProfile({ aiPersonaSummary: { ...summary, status: 'current' } });
        } else {
            userProfileManager.updateUserProfile({ aiPersonaSummary: { ...userProfileManager.userProfile.aiPersonaSummary, status: 'current' } as AIPersonaSummary });
        }
    }, [userProfileManager]);

    const composedUserProfileContextValue = {
        ...userProfileManager,
        triggerAIInsightSynthesis,
        generateAndSaveAIPersona,
    };

    const composedTasksContextValue: TasksContextType = {
        ...taskManager,
        ...suggestions,
        ...personaContent,
        updateDemoTasksForPersona: () => {},
    };

    return (
        <TasksContext.Provider value={composedTasksContextValue}>
            <UserProfileContext.Provider value={composedUserProfileContextValue}>
                {children}
            </UserProfileContext.Provider>
        </TasksContext.Provider>
    );
};

export const useTasks = (): TasksContextType => {
    const context = useContext(TasksContext);
    if (context === undefined) {
        throw new Error('useTasks must be used within a TasksProvider');
    }
    return context;
};
