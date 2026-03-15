import React, { createContext, useContext, ReactNode } from 'react';
import { useSettingsManager } from '../hooks/useSettingsManager';
import { SettingsContextType } from '../types';

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const settingsManager = useSettingsManager();
    return React.createElement(SettingsContext.Provider, { value: settingsManager }, children);
};

export const useSettings = (): SettingsContextType => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
