import React, { useMemo } from 'react';
import { useSettings } from '../contexts/SettingsProvider';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { View } from '../types';
import { LEVEL_XP_BASE, LEVEL_XP_GROWTH } from '../constants';
import { THEMES } from '../src/themes';
import { getAnimationVariant } from '../utils/animationUtils';
import { useNurture } from '../contexts/NurtureProvider';

interface HeaderProps {
    currentView: View;
    onNavigate: (view: View) => void;
    onToggleAdmin: () => void;
    onToggleWowModal: () => void;
}

const NavItem: React.FC<{
    label: string;
    view: View;
    currentView: View;
    onNavigate: (view: View) => void;
    hidden?: boolean;
    hasNotification?: boolean;
}> = ({ label, view, currentView, onNavigate, hidden, hasNotification = false }) => {
    if (hidden) return null;
    return (
        <button
            onClick={() => onNavigate(view)}
            className={`theme-hover relative px-4 py-2 rounded-themed text-sm font-semibold transition-themed ${
                currentView === view
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-surface'
            }`}
        >
            {label}
            {hasNotification && (
                <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-accent ring-2 ring-surface"></span>
            )}
        </button>
    );
};

const MobileNavItem: React.FC<{
    label: string;
    view: View;
    currentView: View;
    onNavigate: (view: View) => void;
    icon: React.ReactNode;
    hidden?: boolean;
    hasNotification?: boolean;
}> = ({ label, view, currentView, onNavigate, icon, hidden, hasNotification = false }) => {
    if (hidden) return null;
    const isActive = currentView === view;
    return (
        <button
            onClick={() => onNavigate(view)}
            className={`theme-hover relative flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
        >
            {icon}
            <span className="mt-1">{label}</span>
            {hasNotification && (
                 <span className="absolute top-1 right-[calc(50%-16px)] block h-2 w-2 rounded-full bg-accent ring-2 ring-surface"></span>
            )}
        </button>
    );
};

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onToggleAdmin, onToggleWowModal }) => {
    const { userStats, hasPendingInsights } = useUserProfile();
    const { mode, theme, previousView, nurturePreviousView } = useSettings();
    const { iconTone, hasUnreadLetter, hasRecentMilestone } = useNurture();
    const { xp, level } = userStats;

    const themeName = THEMES[theme]?.name || 'TaskMaster';
    const progressBarAnimationClass = useMemo(() => {
        const animationVariant = getAnimationVariant(theme, 'progressBar');
        return `progress-${(animationVariant as any).type}`;
    }, [theme]);

    const xpForLevel = (l: number) => Math.floor(LEVEL_XP_BASE * Math.pow(LEVEL_XP_GROWTH, l - 1));

    let xpAtLevelStart = 0;
    for (let i = 1; i < level; i++) {
        xpAtLevelStart += xpForLevel(i);
    }
    
    const xpNeededForThisLevel = xpForLevel(level);
    const xpProgressInThisLevel = xp - xpAtLevelStart;
    const progressPercentage = Math.max(0, Math.min(100, (xpProgressInThisLevel / xpNeededForThisLevel) * 100));

    const handleSettingsClick = () => {
        if (currentView === 'settings') {
            onNavigate(previousView || 'today');
        } else {
            onNavigate('settings');
        }
    };
    
    const handleThemeButtonClick = () => {
        if (currentView === 'settings') {
            onNavigate(previousView || 'today');
        } else {
            onNavigate('settings');
        }
    };
    
    const handleInfoButtonClick = () => {
        onToggleWowModal();
    };

    const handleNurtureIconClick = () => {
        if (mode !== 'nurture') return;
        if (currentView === 'nurture') {
            onNavigate(nurturePreviousView || 'today');
            return;
        }
        onNavigate('nurture');
    };

    return (
        <>
            <header className="bg-bkg/80 backdrop-blur-sm sticky top-0 z-30 p-4 mb-8">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-text-primary font-header">
                        <span onClick={onToggleAdmin} className="cursor-pointer">{themeName}</span>
                    </h1>

                    <nav className="hidden md:flex items-center bg-secondary/30 rounded-themed p-1 space-x-1">
                        <NavItem label="Tasks" view="today" currentView={currentView} onNavigate={onNavigate} />
                        <NavItem label="Projects" view="projects" currentView={currentView} onNavigate={onNavigate} />
                        <NavItem label="Rewards" view="rewards" currentView={currentView} onNavigate={onNavigate} hidden={mode !== 'rpg'} />
                        <NavItem label="Explore" view="explore" currentView={currentView} onNavigate={onNavigate} />
                        <NavItem label="Persona" view="you" currentView={currentView} onNavigate={onNavigate} hasNotification={hasPendingInsights} />
                    </nav>

                    <div className="flex items-center gap-4">
                         {mode === 'rpg' && (
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-accent bg-accent/10 px-3 py-1 rounded-full text-lg">
                                    Lv. {level}
                                </span>
                                <div className="w-32">
                                    <div className={`h-2 bg-secondary rounded-full overflow-hidden ${progressBarAnimationClass}`}>
                                        <div 
                                            className="progress-bar-fill"
                                            style={{ width: `${progressPercentage}%`}}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-text-secondary text-center mt-1">{Math.floor(xpProgressInThisLevel)} / {xpNeededForThisLevel} XP</p>
                                </div>
                            </div>
                         )}
                         {mode === 'nurture' && (
                            <button
                                onClick={handleNurtureIconClick}
                                className={`theme-hover transition text-2xl relative ${
                                    iconTone === 'warm'
                                        ? 'text-yellow-300'
                                        : iconTone === 'muted'
                                            ? 'text-text-secondary/60'
                                            : 'text-text-secondary hover:text-text-primary'
                                } ${hasUnreadLetter ? 'animate-pulse' : ''}`}
                                aria-label="Open Nurture Mode"
                                title="Nurture Mode"
                            >
                                🐾
                                {hasRecentMilestone && (
                                    <span className="absolute -top-1 -right-1 text-xs animate-pulse">✨</span>
                                )}
                            </button>
                         )}
                         <button onClick={handleInfoButtonClick} className="theme-hover text-text-secondary hover:text-text-primary transition text-2xl relative" aria-label="Pro Tips">
                            ℹ️
                         </button>
                         <button onClick={handleThemeButtonClick} className="theme-hover text-text-secondary hover:text-text-primary transition text-2xl relative" aria-label="Change Theme">
                            🎨
                         </button>
                         <button onClick={handleSettingsClick} className="theme-hover text-text-secondary hover:text-text-primary transition text-2xl" aria-label="Settings">
                            ⚙️
                         </button>
                    </div>
                </div>
            </header>
            
            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-secondary/50 shadow-lg z-30 flex justify-around">
                <MobileNavItem 
                    label="Tasks" 
                    view="today" 
                    currentView={currentView} 
                    onNavigate={onNavigate}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                />
                 <MobileNavItem 
                    label="Projects"
                    view="projects" 
                    currentView={currentView} 
                    onNavigate={onNavigate}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10h6" /></svg>}
                />
                 <MobileNavItem 
                    label="Rewards" 
                    view="rewards" 
                    currentView={currentView} 
                    onNavigate={onNavigate}
                    hidden={mode !== 'rpg'}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
                />
                 <MobileNavItem 
                    label="Explore" 
                    view="explore" 
                    currentView={currentView} 
                    onNavigate={onNavigate}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2 1M4 7l2-1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>}
                />
                 <MobileNavItem 
                    label="Persona" 
                    view="you" 
                    currentView={currentView} 
                    onNavigate={onNavigate}
                    hasNotification={hasPendingInsights}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                />
            </nav>
        </>
    );
};