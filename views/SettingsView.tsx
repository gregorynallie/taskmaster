import React from 'react';
import { useSettings } from '../contexts/SettingsProvider';
import { Mode, Theme } from '../types';
import { groupedThemes, themeCategoryOrder } from '../src/themes';
import { auth } from '../services/firebase';

export const SettingsView: React.FC = () => {
    const { 
        mode, setMode, theme, setTheme, clearAllData, resetOnboarding, 
        showSpoofedTasks, toggleShowSpoofedTasks, soundEffectsEnabled, toggleSoundEffects,
        favoriteThemes, toggleFavoriteTheme, shuffleThemesOnLoad, setShuffleThemesOnLoad 
    } = useSettings();

    const handleModeChange = (newMode: Mode) => {
        setMode(newMode);
    };

    const handleSignOut = () => {
        if (window.confirm("Are you sure you want to sign out?")) {
            auth.signOut();
        }
    }

    const RadioOption: React.FC<{ value: 'off' | 'all' | 'favorites', label: string, disabled?: boolean }> = ({ value, label, disabled = false }) => (
        <label className={`flex-1 p-3 rounded-themed border-2 text-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${shuffleThemesOnLoad === value ? 'border-accent bg-primary/10' : 'border-transparent bg-secondary/50 hover:bg-secondary'}`}>
            <input 
                type="radio" 
                name="shuffle-theme" 
                value={value}
                checked={shuffleThemesOnLoad === value}
                onChange={() => setShuffleThemesOnLoad(value)}
                className="sr-only"
                disabled={disabled}
            />
            <span className="font-semibold text-text-primary">{label}</span>
        </label>
    );

    return (
        <div className="animate-themed-enter max-w-2xl mx-auto">
            <div className="bg-surface p-6 rounded-themed shadow-themed mb-8 text-center">
                <h2 className="text-3xl font-bold mb-2 text-text-primary font-header">Settings</h2>
                <p className="text-text-secondary">Customize your experience, manage your data, and explore over 100 themes.</p>
            </div>

            <div className="bg-surface p-8 rounded-themed shadow-themed">
                 {/* Theme Shuffling */}
                 <div className="mb-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-3 font-header">Theme Shuffling</h3>
                    <div className="p-4 bg-secondary/30 rounded-themed space-y-3">
                        <p className="text-sm text-text-secondary">Automatically apply a new theme every time you open the app.</p>
                        <div className="flex flex-col sm:flex-row gap-2" role="radiogroup">
                           <RadioOption value="off" label="Off" />
                           <RadioOption value="favorites" label="Shuffle Favorites" disabled={favoriteThemes.length === 0} />
                           <RadioOption value="all" label="Shuffle All" />
                        </div>
                         {shuffleThemesOnLoad === 'favorites' && favoriteThemes.length === 0 && (
                            <p className="text-xs text-accent text-center pt-2">Add some themes to your favorites by clicking the star icon!</p>
                        )}
                    </div>
                </div>

                {/* Theme Selection */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-3 font-header">Themes</h3>
                    <div className="space-y-6">
                        {themeCategoryOrder.map(categoryName => {
                            const themesInCategory = groupedThemes[categoryName];
                            if (!themesInCategory || themesInCategory.length === 0) return null;

                            return (
                                <div key={categoryName}>
                                    <h4 className="text-md font-semibold text-text-secondary mb-3 font-header border-b border-secondary pb-2">
                                        {categoryName}
                                    </h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {themesInCategory.map((themeItem) => {
                                            const isFavorited = favoriteThemes.includes(themeItem.id);
                                            return (
                                                <div key={themeItem.id} className="text-center relative group">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleFavoriteTheme(themeItem.id); }}
                                                        className={`absolute top-1 right-1 z-10 p-1.5 rounded-full bg-surface/30 hover:bg-surface/80 backdrop-blur-sm transition-all duration-200 ${isFavorited ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                                        aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                                                    >
                                                        {isFavorited ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setTheme(themeItem.id as Theme)}
                                                        className={`w-full h-20 rounded-themed border-2 flex items-center justify-center transition-all ${theme === themeItem.id ? 'border-accent ring-2 ring-accent/50' : 'border-secondary hover:border-primary'}`}
                                                    >
                                                        <div className="flex -space-x-3">
                                                            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: themeItem.cssVariables['--bkg'], borderColor: themeItem.cssVariables['--primary'] }}></div>
                                                            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: themeItem.cssVariables['--surface'], borderColor: themeItem.cssVariables['--primary'] }}></div>
                                                            <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: themeItem.cssVariables['--primary'], borderColor: 'var(--secondary)' }}></div>
                                                        </div>
                                                    </button>
                                                    <p 
                                                    className="text-sm mt-2 font-bold truncate"
                                                    style={{ fontFamily: themeItem.font, color: themeItem.cssVariables['--primary'] }}
                                                    >
                                                    {themeItem.name}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Interface Settings */}
                 <div className="mb-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-3 font-header">Interface</h3>
                    <div className="space-y-4">
                        {/* Mode Selection */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleModeChange('rpg')}
                                className={`flex-1 p-4 rounded-themed border-2 transition-all ${mode === 'rpg' ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary'}`}
                            >
                                <h4 className="font-bold text-text-primary font-header">RPG Mode</h4>
                                <p className="text-sm text-text-secondary">A gamified, fantasy-themed interface with XP, levels, and quests.</p>
                            </button>
                             <button
                                onClick={() => handleModeChange('minimal')}
                                className={`flex-1 p-4 rounded-themed border-2 transition-all ${mode === 'minimal' ? 'border-accent bg-primary/10' : 'border-secondary hover:border-primary'}`}
                            >
                                <h4 className="font-bold text-text-primary font-header">Minimal Mode</h4>
                                <p className="text-sm text-text-secondary">A clean, professional interface focused on productivity.</p>
                            </button>
                        </div>
                         {/* Sound Effects Toggle */}
                        <div className="p-4 bg-secondary/30 rounded-themed flex justify-between items-center">
                            <div>
                                <label htmlFor="sound-toggle" className="text-text-primary font-medium">
                                    Sound Effects
                                </label>
                                <p className="text-sm text-text-secondary font-normal">Enable theme-based UI sounds.</p>
                            </div>
                            <button
                                id="sound-toggle"
                                role="switch"
                                aria-checked={soundEffectsEnabled}
                                onClick={toggleSoundEffects}
                                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary ${
                                    soundEffectsEnabled ? 'bg-primary' : 'bg-secondary'
                                }`}
                            >
                                <span
                                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                        soundEffectsEnabled ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                 {/* Data Management */}
                <div className="mb-8">
                     <h3 className="text-lg font-semibold text-text-primary mb-3 font-header">Account & Data</h3>
                     <div className="space-y-3">
                        <button onClick={handleSignOut} className="w-full text-left p-3 bg-secondary/50 hover:bg-secondary/80 rounded-themed transition-themed">
                           Sign Out
                        </button>
                        <button onClick={resetOnboarding} className="w-full text-left p-3 bg-secondary/50 hover:bg-secondary/80 rounded-themed transition-themed">
                            Show Onboarding Screen Again
                        </button>
                     </div>
                </div>

                {/* Developer Options */}
                <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-3 font-header">Developer Options</h3>
                    <div className="p-4 bg-secondary/30 rounded-themed flex justify-between items-center">
                        <div>
                            <label htmlFor="spoof-toggle" className="text-text-primary font-medium">
                                Show Demo Tasks
                            </label>
                            <p className="text-sm text-text-secondary font-normal">Toggle visibility of sample tasks for today.</p>
                        </div>
                        <button
                            id="spoof-toggle"
                            role="switch"
                            aria-checked={showSpoofedTasks}
                            onClick={toggleShowSpoofedTasks}
                            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary ${
                                showSpoofedTasks ? 'bg-primary' : 'bg-secondary'
                            }`}
                        >
                            <span
                                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
                                    showSpoofedTasks ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};