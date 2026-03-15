
import React, { useState, useEffect } from 'react';
import { Mode, Theme, View, ViewSettings } from '../types';
import { featuredThemeIds } from '../src/themes';
import { auth } from '../services/firebase';

const usePersistentState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = localStorage.getItem(key);
            // If the stored value is null or the literal string "undefined", use the default.
            if (storedValue !== null && storedValue !== 'undefined') {
                return JSON.parse(storedValue);
            }
            return defaultValue;
        } catch (error) {
            console.warn(`Error reading localStorage key "${key}":`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        try {
            // If the state is undefined, remove the item from localStorage to avoid storing "undefined".
            if (state === undefined) {
                localStorage.removeItem(key);
            } else {
                localStorage.setItem(key, JSON.stringify(state));
            }
        } catch (error) {
            console.warn(`Error setting localStorage key "${key}":`, error);
        }
    }, [key, state]);

    return [state, setState];
};

const defaultInitialViewSettings: ViewSettings = {
    sortBy: 'manual',
    sortDirection: 'asc',
    groupBy: 'by_date',
    categoryFilters: [],
    timeOfDayFilters: [],
    durationFilter: null,
    cardStyle: 'full',
    focusedDate: null,
};

export const useSettingsManager = () => {
    const [mode, setMode] = usePersistentState<Mode>('taskmaster_mode', 'minimal');
    const [theme, setTheme] = usePersistentState<Theme>('taskmaster_theme', 'warm-ember');
    const [hasOnboarded, setHasOnboarded] = usePersistentState<boolean>('taskmaster_hasOnboarded', false);
    const [currentView, _setCurrentView] = usePersistentState<View>('taskmaster_currentView', 'today');
    const [previousView, setPreviousView] = usePersistentState<View>('taskmaster_previousView', 'today');
    const [soundEffectsEnabled, setSoundEffectsEnabled] = usePersistentState<boolean>('taskmaster_soundEffectsEnabled', true);
    const [defaultViewSettings, setDefaultViewSettings] = usePersistentState<ViewSettings | undefined>('taskmaster_defaultViewSettings', defaultInitialViewSettings);
    const [showSpoofedTasks, setShowSpoofedTasks] = usePersistentState<boolean>('taskmaster_showSpoofedTasks', true);
    const [favoriteThemes, setFavoriteThemes] = usePersistentState<string[]>('taskmaster_favoriteThemes', featuredThemeIds);
    const [shuffleThemesOnLoad, setShuffleThemesOnLoad] = usePersistentState<'off' | 'all' | 'favorites'>('taskmaster_shuffleThemesOnLoad', 'off');

    const setCurrentView = (newView: View) => {
        if (currentView !== 'settings' && newView === 'settings') {
            setPreviousView(currentView);
        }
        _setCurrentView(newView);
    };

    const resetOnboarding = () => {
        setHasOnboarded(false);
    };

    const toggleSoundEffects = () => {
        setSoundEffectsEnabled(prev => !prev);
    };
    
    const updateDefaultViewSettings = (settings: ViewSettings) => {
        setDefaultViewSettings(settings);
    };

    const toggleShowSpoofedTasks = () => {
        setShowSpoofedTasks(prev => !prev);
    };

    const clearAllData = () => {
        // This function is now a no-op on the client side.
        // Data deletion should be handled via Firebase server-side rules or functions
        // for security. We will sign the user out as a safety measure.
        alert("Data is now stored in the cloud. To delete your data, please manage your account through Google or contact support.");
        auth.signOut();
    };

    const toggleFavoriteTheme = (themeId: string) => {
        setFavoriteThemes(prev => {
            const isFavorited = prev.includes(themeId);
            if (isFavorited) {
                return prev.filter(id => id !== themeId);
            } else {
                return [...prev, themeId];
            }
        });
    };

    return {
        mode,
        setMode,
        theme,
        setTheme,
        hasOnboarded,
        setHasOnboarded,
        resetOnboarding,
        currentView,
        setCurrentView,
        previousView,
        soundEffectsEnabled,
        toggleSoundEffects,
        defaultViewSettings,
        updateDefaultViewSettings,
        showSpoofedTasks,
        toggleShowSpoofedTasks,
        clearAllData,
        favoriteThemes,
        toggleFavoriteTheme,
        shuffleThemesOnLoad,
        setShuffleThemesOnLoad,
    };
};
