import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { TodayView } from './views/TodayView';
import { ProjectsView } from './views/ProjectsView';
import { RewardsView } from './views/RewardsView';
import { ExploreView } from './views/ExploreView';
import { SettingsView } from './views/SettingsView';
import { Onboarding } from './components/Onboarding';
import { AdminPanel } from './components/AdminPanel';
import { useSettings } from './contexts/SettingsProvider';
import { Mode, Theme } from './types';
import { JournalView } from './views/JournalView';
import { YouView } from './views/YouView';
import { ThemeSandboxView } from './views/ThemeSandboxView';
import { THEMES } from './src/themes';
import { getAnimationVariant } from './utils/animationUtils';
import { ViewTransitionAnimationVariant } from './src/animations';
import { LevelUp } from './components/LevelUp';
import { WowFeaturesModal } from './components/today/WowFeaturesModal';
import { useTasks } from './contexts/TasksProvider';
import { OnboardingAnswers } from './src/types/onboardingTypes';
import { ViewOptionsProvider } from './contexts/ViewOptionsProvider';
import { useAuth } from './contexts/AuthProvider';
import { LoginScreen } from './components/LoginScreen';
import { useUserProfile } from './contexts/UserProfileProvider';
import { AIDebugFloatingStrip } from './components/AIDebugFloatingStrip';

function App() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { theme, setTheme, hasOnboarded, setHasOnboarded, currentView, setCurrentView, mode, setMode, shuffleThemesOnLoad, favoriteThemes } = useSettings();
  const { isDataLoading } = useUserProfile();
  const { completeOnboarding } = useTasks();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isWowModalOpen, setIsWowModalOpen] = useState(false);
  const [isAIDebugStripVisible, setIsAIDebugStripVisible] = useState(true);

  // State for view transitions
  const [animationClass, setAnimationClass] = useState('animate-view-enter-standard');
  const [displayedView, setDisplayedView] = useState(currentView);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // This effect handles the theme shuffling logic on initial application load.
    if (shuffleThemesOnLoad === 'off' || !hasOnboarded) {
        return;
    }

    const allThemeIds = Object.keys(THEMES);
    let themePool: string[] = [];

    if (shuffleThemesOnLoad === 'favorites') {
        // Only use favorites if the user has selected at least one.
        if (favoriteThemes.length > 0) {
            themePool = favoriteThemes;
        } else {
            return; // Don't shuffle if mode is 'favorites' but none are selected.
        }
    } else { // shuffle 'all'
        themePool = allThemeIds;
    }

    // Filter out the current theme to ensure a change, if possible.
    const availableThemes = themePool.filter(id => id !== theme);
    
    // If the pool is empty after filtering (e.g., only one favorite theme which is active), don't shuffle.
    if (availableThemes.length === 0) {
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableThemes.length);
    const newTheme = availableThemes[randomIndex];
    
    setTheme(newTheme as Theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial mount to shuffle on page load.


  useEffect(() => {
    const themeDef = THEMES[theme];
    if (!themeDef) {
        console.warn(`Theme "${String(theme)}" not found.`);
        return;
    }

    // Apply the theme class to the body for theme-specific selectors
    document.body.className = `${String(theme)} bg-bkg text-text-primary min-h-screen`;
    
    // Apply all CSS variables to the root element
    const root = document.documentElement;
    Object.entries(themeDef.cssVariables).forEach(([key, value]) => {
        if (value) {
            root.style.setProperty(String(key), String(value));
        } else {
            root.style.removeProperty(String(key));
        }
    });

    // Match native date/time picker UI to theme (light vs dark)
    document.documentElement.style.colorScheme = themeDef.isLight ? 'light' : 'dark';

    // Explicitly set the body font from the theme definition
    if (themeDef.font) {
      document.body.style.fontFamily = themeDef.font;
    }
    
    // Dynamically inject theme-specific CSS
    const styleElementId = 'theme-specific-styles';
    let styleElement = document.getElementById(styleElementId) as HTMLStyleElement | null;
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleElementId;
        document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = themeDef.customCss || '';

  }, [theme]);
  
  // Logic for handling view transitions
  useEffect(() => {
    if (isFirstRender.current) {
        const animation = getAnimationVariant<ViewTransitionAnimationVariant>(theme, 'viewTransition');
        setAnimationClass(animation.classes.enter);
        isFirstRender.current = false;
        return;
    }
    
    if (currentView === displayedView) {
        return;
    }

    const animation = getAnimationVariant<ViewTransitionAnimationVariant>(theme, 'viewTransition');
    const exitClass = animation.classes.exit;
    setAnimationClass(exitClass);

}, [currentView, theme, displayedView]);

  const handleAnimationEnd = () => {
      if (animationClass.includes('exit')) {
          setDisplayedView(currentView);
          const animation = getAnimationVariant<ViewTransitionAnimationVariant>(theme, 'viewTransition');
          setAnimationClass(animation.classes.enter);
      } else {
          setAnimationClass('');
      }
  };

  const handleOnboardingComplete = async (answers: OnboardingAnswers, selectedMode: Mode) => {
    setMode(selectedMode);
    await completeOnboarding(answers, selectedMode);
    // `setHasOnboarded` is now handled by a listener in `useSettingsManager`
    // that checks for the existence of tasks in Firestore. This is a more robust
    // way to determine if onboarding is complete.
    // For now, we keep the client-side logic as is, but this sets up future improvement.
  };
  
  const renderView = () => {
    switch (displayedView) {
      case 'today': return <TodayView isFirstLoadAfterOnboarding={isFirstRender.current && hasOnboarded} />;
      case 'projects':
      case 'quests':
        return <ProjectsView />;
      case 'rewards': return mode === 'rpg' ? <RewardsView /> : <TodayView />;
      case 'explore': return <ExploreView />;
      case 'journal': return <JournalView />;
      case 'settings': return <SettingsView />;
      case 'you': return <YouView />;
      case 'themeSandbox': return <ThemeSandboxView />;
      default: return <TodayView />;
    }
  };

  if (isAuthLoading || (user && isDataLoading)) {
    return (
        <div className="fixed inset-0 bg-bkg z-50 flex flex-col items-center justify-center animate-themed-enter text-center p-4">
             <div className="relative w-24 h-24 mb-8">
                <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                <div className="absolute inset-2 border-4 border-accent/40 rounded-full animate-spin [animation-duration:3s]"></div>
                <div className="absolute inset-4 text-4xl flex items-center justify-center">✨</div>
            </div>
            <p className="text-xl font-semibold text-text-primary">Loading your data...</p>
        </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!hasOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="text-text-primary font-body">
      {mode === 'rpg' && <LevelUp />}
      <Header 
        currentView={currentView}
        onNavigate={setCurrentView}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onToggleWowModal={() => setIsWowModalOpen(prev => !prev)}
      />
      {isAIDebugStripVisible && (
        <AIDebugFloatingStrip onClose={() => setIsAIDebugStripVisible(false)} />
      )}
      <ViewOptionsProvider>
        <main 
          className={`p-4 sm:p-6 lg:p-8 pb-24 ${animationClass}`}
          onAnimationEnd={handleAnimationEnd}
        >
          {renderView()}
        </main>
      </ViewOptionsProvider>
      {isAdminOpen && (
        <AdminPanel
          onClose={() => setIsAdminOpen(false)}
          isAIDebugStripVisible={isAIDebugStripVisible}
          onToggleAIDebugStrip={() => setIsAIDebugStripVisible(prev => !prev)}
        />
      )}
      <WowFeaturesModal isOpen={isWowModalOpen} onClose={() => setIsWowModalOpen(false)} />
    </div>
  );
}

export default App;