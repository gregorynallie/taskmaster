import React, { useState, useEffect, useMemo } from 'react';
import { Task, Suggestion, Theme } from '../types';
import { TaskCard } from '../components/TaskCard';
import { SuggestedTaskPreviewCard } from '../components/SuggestedTaskPreviewCard';
import { useSettings } from '../contexts/SettingsProvider';
import { THEMES } from '../src/themes';
import { ANIMATION_SETS, AddTaskAnimationVariant, AnimationVariant, DEFAULT_ANIMATIONS, ANIMATION_CATEGORY_OPTIONS, ViewTransitionAnimationVariant } from '../src/animations';
import { AnimationType, AnimationClassification } from '../src/themeTypes';
import { getAnimationVariant } from '../utils/animationUtils';

// --- MOCK DATA ---
const sampleTask: Task = {
  id: 'sandbox-task-1',
  title: 'Sandbox Task Example ✨',
  description: 'This is a description to see how text flows within the card. You can edit this task.',
  category: 'Productivity',
  duration_min: 30,
  xp_estimate: 50,
  created_at: new Date(),
  scheduled_at: new Date().toISOString(),
  completed_at: null,
  xp_awarded: null,
  original_input: 'Sandbox Task Example ✨',
};

const sampleSuggestion: Suggestion = {
    id: 'sandbox-suggestion-1',
    title: 'Suggested Task',
    description: 'This is an AI-powered suggestion to try something new.',
    category: 'Personal Growth',
    duration_min: 20,
    xp_estimate: 40,
    reasoning: "Based on your profile, this could be a great next step.",
    context_tag: "From 'Explore' feature"
};

// --- ANIMATION TEST COMPONENTS ---

const TaskCompleteAnimationTest: React.FC<{ animation: AnimationVariant }> = ({ animation }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [cardKey, setCardKey] = useState(0);

  const startCompletion = () => {
    if (!isCompleting) {
      setIsCompleting(true);
    }
  };

  const handleCompletionAnimationEnd = () => {
    // Removed setTimeout for better responsiveness.
    setIsCompleting(false);
    setCardKey(prevKey => prevKey + 1);
  };

  const taskId = `sandbox-complete-${cardKey}`;

  return (
    <div className="space-y-4">
      <div className="min-h-[260px]">
        <TaskCard
          key={taskId}
          task={{ ...sampleTask, id: taskId }}
          isSandboxMode={true}
          onCompletionAnimationEnd={handleCompletionAnimationEnd}
          initiateCompletion={startCompletion}
          completingTaskId={isCompleting ? taskId : null}
          completionAnimationClass={animation.className}
        />
      </div>
    </div>
  );
};

const AcceptFullSuggestionTest: React.FC<{ animation: AnimationVariant }> = ({ animation }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [cardKey, setCardKey] = useState(0);

    const handleAccept = () => {
        if (isAnimating) return;
        setIsAnimating(true);
    };

    const handleAnimationEnd = () => {
        // Removed setTimeout for better responsiveness.
        setIsAnimating(false);
        setCardKey(k => k + 1);
    };

    return (
        <div className="min-h-[190px]">
            <SuggestedTaskPreviewCard
                key={cardKey}
                suggestion={{ ...sampleSuggestion, id: `full-sugg-${cardKey}` }}
                onAccept={handleAccept}
                onShuffle={() => setCardKey(k => k + 1)} // Reset on shuffle
                isSandboxMode={true}
                isAcceptingOverride={isAnimating}
                onAnimationEnd={isAnimating ? handleAnimationEnd : undefined}
            />
        </div>
    );
};


const AddTaskAnimationTest: React.FC<{ animation: AddTaskAnimationVariant }> = ({ animation }) => {
    const [uiState, setUiState] = useState<'idle' | 'confirming' | 'exiting'>('idle');
    const [formKey, setFormKey] = useState(0);
    const [taskKey, setTaskKey] = useState(0);
    const [showTask, setShowTask] = useState(false);

    const handleTest = () => {
        if (uiState !== 'idle') return;
        setUiState('confirming');
        setShowTask(true);
        setTaskKey(k => k + 1);
    };

    useEffect(() => {
        let timer1: number, timer2: number, timer3: number;
        if (uiState === 'confirming') {
            timer1 = window.setTimeout(() => setUiState('exiting'), 1200);
        } else if (uiState === 'exiting') {
            timer2 = window.setTimeout(() => {
                setUiState('idle');
                setFormKey(k => k + 1);
            }, 500); 
            timer3 = window.setTimeout(() => setShowTask(false), 2500);
        }
        return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
    }, [uiState]);

    const animationClasses = animation.classes;
    const currentConfirmClass = uiState === 'confirming' ? animationClasses.confirmEnter : animationClasses.confirmExit;
    const creativeCopy = "Consider it done.";

    return (
        <div className="space-y-4">
            <div className="relative min-h-[110px]">
                {uiState === 'idle' && (
                    <div key={formKey} className={`absolute inset-0 ${animationClasses.formEnter}`}>
                        <div className="p-4 bg-surface rounded-themed shadow-themed">
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    defaultValue="Plan your week: What's priority #1?"
                                    readOnly
                                    className="w-full bg-bkg border-2 border-secondary focus:border-primary focus:ring-0 rounded-themed p-3 text-text-primary placeholder:text-text-secondary transition-themed"
                                />
                                <button
                                    onClick={handleTest}
                                    className="theme-hover bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed"
                                >
                                    Add Task
                                </button>
                            </div>
                            <p className="text-xs text-text-secondary mt-2 pl-1">💡 Tip: Try typing 'Review report for Monday' to quickly schedule.</p>
                        </div>
                    </div>
                )}
                {(uiState === 'confirming' || uiState === 'exiting') && (
                     <div className={`absolute inset-0 p-4 bg-surface rounded-themed shadow-themed ${currentConfirmClass}`}>
                        <div className="flex items-center justify-center gap-3 h-[88px]">
                            <span className="text-3xl">✔️</span>
                            <span className="text-xl font-bold text-text-primary">{creativeCopy}</span>
                        </div>
                    </div>
                )}
            </div>
            <div className="min-h-[260px] relative">
                {showTask && (
                    <div key={taskKey} className={`absolute inset-0 ${animationClasses.taskEnter}`}>
                        <TaskCard task={{...sampleTask, id: `anim-task-add-${taskKey}`}} />
                    </div>
                )}
            </div>
        </div>
    );
};

const LevelUpTest: React.FC<{ animation: AnimationVariant }> = ({ animation }) => {
    const [key, setKey] = useState(0);
    return (
        <div>
            <button onClick={() => setKey(k => k + 1)} className="w-full theme-hover bg-primary text-white font-bold py-2 px-4 rounded-themed mb-4">
                Trigger Level Up
            </button>
            <div key={key} className="relative h-24 bg-secondary/30 rounded-themed flex items-center justify-center overflow-hidden">
                 <div className="text-center">
                    <h2 className={`text-4xl font-bold font-header text-accent ${animation.className}`} style={{ textShadow: '0 0 10px var(--accent)' }}>
                        LEVEL UP!
                    </h2>
                </div>
            </div>
        </div>
    );
};

const ProgressBarTest: React.FC = () => {
    const { theme } = useSettings();
    const [progress, setProgress] = useState(25);
    const progressBarAnimationClass = useMemo(() => `progress-${(getAnimationVariant(theme, 'progressBar') as any).type}`, [theme]);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setProgress(p => (p > 90 ? 25 : p + 25));
      }, 1000);
      return () => clearTimeout(timer);
    }, [progress]);
    
    return (
      <div className={`h-4 bg-secondary rounded-full overflow-hidden ${progressBarAnimationClass}`}>
        <div 
          className="progress-bar-fill"
          style={{ width: `${progress}%`}}
        ></div>
      </div>
    );
};

const ButtonTest: React.FC = () => {
    const { theme } = useSettings();
    const buttonAnimationClass = useMemo(() => `btn-${(getAnimationVariant(theme, 'button') as any).type}`, [theme]);
    return (
        <button className={`w-full btn-primary transition-transform duration-100 ${buttonAnimationClass}`}>
            Click Me!
        </button>
    );
}

const ModalTest: React.FC<{ animation: AnimationVariant }> = ({ animation }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setIsOpen(true)} className="w-full theme-hover bg-primary text-white font-bold py-2 px-4 rounded-themed mb-4">
                Open Modal
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
                    <div className={`bg-surface-modal-bkg p-6 rounded-themed shadow-themed w-full max-w-sm ${animation.className}`}>
                        <h3 className="text-lg font-bold font-header mb-2">Sample Modal</h3>
                        <p className="text-sm text-text-secondary mb-4">This is a test modal window to demonstrate the entry animation.</p>
                        <button onClick={() => setIsOpen(false)} className="w-full theme-hover bg-secondary text-text-on-secondary-bkg font-bold py-2 px-4 rounded-themed">Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const SkeletonLoaderTest: React.FC = () => {
    const { theme } = useSettings();
    const skeletonAnimationClass = useMemo(() => `skeleton-${(getAnimationVariant(theme, 'loadingState') as any).type}`, [theme]);

    return (
        <div className={`space-y-4 skeleton-loader ${skeletonAnimationClass}`}>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full skeleton-line"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 skeleton-line"></div>
                    <div className="h-4 w-1/2 skeleton-line"></div>
                </div>
            </div>
            <div className="h-4 w-full skeleton-line"></div>
            <div className="h-4 w-full skeleton-line"></div>
        </div>
    );
};

// --- MAIN SANDBOX VIEW ---
const ANIMATION_TYPES: AnimationType[] = [
    'addTask',
    'taskComplete',
    'suggestionAccept',
    'hover',
    'enter',
    'viewTransition',
    'dismissTask',
    'levelUp',
    'progressBar',
    'inputField',
    'modal',
    'loadingState',
    'button',
];
const ANIMATION_CATEGORIES: Array<'All' | AnimationClassification> = ['All', 'standard', 'playful', 'glitch', 'retro', 'pop', 'cinematic', 'organic', 'minimal', 'theme-specific'];

type ActiveFilters = Record<AnimationType, 'All' | AnimationClassification>;

export const ThemeSandboxView: React.FC = () => {
    const { theme, setTheme } = useSettings();
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        addTask: 'All',
        taskComplete: 'All',
        suggestionAccept: 'All',
        hover: 'All',
        enter: 'All',
        viewTransition: 'All',
        dismissTask: 'All',
        levelUp: 'All',
        progressBar: 'All',
        inputField: 'All',
        modal: 'All',
        loadingState: 'All',
        button: 'All',
    });
    
    const [selectedCompleteAnimStyle, setSelectedCompleteAnimStyle] = useState<AnimationClassification | 'theme-default'>('theme-default');
    const [selectedAcceptFullAnimStyle, setSelectedAcceptFullAnimStyle] = useState<AnimationClassification | 'theme-default'>('theme-default');
    const [selectedAddTaskAnimStyle, setSelectedAddTaskAnimStyle] = useState<AnimationClassification | 'theme-default'>('theme-default');
    const [selectedLevelUpAnimStyle, setSelectedLevelUpAnimStyle] = useState<AnimationClassification | 'theme-default'>('theme-default');
    const [selectedModalAnimStyle, setSelectedModalAnimStyle] = useState<AnimationClassification | 'theme-default'>('theme-default');

    const themeDef = THEMES[theme];

    const sortedThemes = useMemo(() => {
        return Object.values(THEMES).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const filteredThemes = useMemo(() => {
        return sortedThemes.filter(themeItem => {
            return ANIMATION_TYPES.every(filterKey => {
                const filterValue = activeFilters[filterKey];
                if (filterValue === 'All') return true;

                const themeOverride = themeItem.animations?.[filterKey];
                if (typeof themeOverride === 'object') {
                    return filterValue === 'theme-specific';
                }
                const classification = themeOverride || DEFAULT_ANIMATIONS[filterKey];
                return classification === filterValue;
            });
        });
    }, [activeFilters, sortedThemes]);

    const handleFilterChange = (filterKey: keyof ActiveFilters, value: 'All' | AnimationClassification) => {
        setActiveFilters(prev => ({ ...prev, [filterKey]: value }));
    };

    const resolveAnimationVariantByStyle = <T extends AnimationVariant | AddTaskAnimationVariant | ViewTransitionAnimationVariant | AnimationClassification>(
        setName: keyof typeof ANIMATION_SETS,
        selectedStyle: AnimationClassification | 'theme-default',
        animationType: AnimationType
    ): T => {
        if (selectedStyle === 'theme-default') {
            return getAnimationVariant<T>(theme, animationType);
        }
        const set = ANIMATION_SETS[setName] as unknown as T[];
        const variant = set.find(a => (a as any).type === selectedStyle);
        // Fallback to standard if the selected style doesn't exist for this animation type
        return variant || set.find(a => (a as any).type === 'standard') || set[0];
    };

    const addTaskAnimToShow = useMemo(() => resolveAnimationVariantByStyle<AddTaskAnimationVariant>('addTask', selectedAddTaskAnimStyle, 'addTask'), [selectedAddTaskAnimStyle, theme]);
    const completeAnimToShow = useMemo(() => resolveAnimationVariantByStyle<AnimationVariant>('taskComplete', selectedCompleteAnimStyle, 'taskComplete'), [selectedCompleteAnimStyle, theme]);
    const acceptFullAnimToShow = useMemo(() => resolveAnimationVariantByStyle<AnimationVariant>('suggestionAccept', selectedAcceptFullAnimStyle, 'suggestionAccept'), [selectedAcceptFullAnimStyle, theme]);
    const levelUpAnimToShow = useMemo(() => resolveAnimationVariantByStyle<AnimationVariant>('levelUp', selectedLevelUpAnimStyle, 'levelUp'), [selectedLevelUpAnimStyle, theme]);
    const modalAnimToShow = useMemo(() => resolveAnimationVariantByStyle<AnimationVariant>('modal', selectedModalAnimStyle, 'modal'), [selectedModalAnimStyle, theme]);
    
    const hoverVariant = themeDef.animations?.hover;
    const themeHoverDescription = typeof hoverVariant === 'object' ? hoverVariant.description : "A subtle scale or border highlight.";

    const defaultLabels = useMemo(() => {
        const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

        const getLabel = (animationType: AnimationType): string => {
            const variant = getAnimationVariant(theme, animationType);
            let classificationText: string = (variant as any).type;
            if (classificationText === 'theme-specific') {
                classificationText = 'Theme-Specific';
            } else {
                classificationText = capitalize(classificationText);
            }
            return `Default (${classificationText})`;
        };

        return {
            addTask: getLabel('addTask'),
            taskComplete: getLabel('taskComplete'),
            suggestionAccept: getLabel('suggestionAccept'),
            levelUp: getLabel('levelUp'),
            modal: getLabel('modal'),
        };
    }, [theme]);


    return (
        <div className="max-w-4xl mx-auto space-y-12 p-4">
            <header className="text-center">
                <h1 className="text-4xl font-bold font-header">Theme & Animation Sandbox</h1>
                <p className="text-text-secondary mt-2">A place to test and preview all visual components.</p>
            </header>

            <section>
                <h2 className="text-2xl font-bold mb-4 font-header border-b-2 border-secondary pb-2">Theme Selector</h2>
                <div className="mb-4 bg-surface p-4 rounded-themed grid grid-cols-2 md:grid-cols-3 gap-4">
                    {ANIMATION_TYPES.map(type => (
                        <div key={type}>
                            <label htmlFor={`filter-${type}`} className="block text-sm font-semibold text-text-secondary mb-1 capitalize">{type.replace(/([A-Z])/g, ' $1')}</label>
                            <select
                                id={`filter-${type}`}
                                value={activeFilters[type]}
                                onChange={(e) => handleFilterChange(type, e.target.value as 'All' | AnimationClassification)}
                                className="w-full p-2 bg-bkg border border-secondary rounded-themed text-sm"
                            >
                                {ANIMATION_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    {filteredThemes.map((themeItem) => {
                        const hasCustomAnimations = ANIMATION_TYPES.some(type => typeof themeItem.animations?.[type] === 'object');
                        return (
                            <button
                                key={themeItem.id}
                                onClick={() => setTheme(themeItem.id as Theme)}
                                className={`px-3 py-1 rounded-full border-2 transition-all duration-200 text-sm font-semibold ${
                                    theme === themeItem.id
                                        ? 'bg-accent/20 border-accent text-accent shadow-lg'
                                        : 'bg-surface border-secondary hover:border-primary text-text-secondary'
                                }`}
                            >
                                {themeItem.name}
                                {hasCustomAnimations && ' ✨'}
                            </button>
                        )
                    })}
                </div>
            </section>

            <section>
                 <h2 className="text-2xl font-bold mb-4 font-header border-b-2 border-secondary pb-2">Animation Showcase</h2>
                 <p className="text-text-secondary mb-6">Select an animation from the dropdown to test it on the component below. These are independent of the main theme selector.</p>
                <div className="space-y-8">
                    
                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Add Task Animation</h3>
                        <select onChange={(e) => setSelectedAddTaskAnimStyle(e.target.value as any)} value={selectedAddTaskAnimStyle} className="w-full p-2 mb-2 bg-bkg border border-secondary rounded-themed">
                            <option value="theme-default">{defaultLabels.addTask}</option>
                            {ANIMATION_CATEGORY_OPTIONS.map(style => <option key={style} value={style}>{(style.charAt(0).toUpperCase() + style.slice(1))}</option>)}
                        </select>
                        <p className="text-sm text-text-secondary mb-4 h-10">{addTaskAnimToShow.description}</p>
                        <AddTaskAnimationTest animation={addTaskAnimToShow} />
                    </div>

                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Task Complete Animation</h3>
                        <select onChange={(e) => setSelectedCompleteAnimStyle(e.target.value as any)} value={selectedCompleteAnimStyle} className="w-full p-2 mb-2 bg-bkg border border-secondary rounded-themed">
                           <option value="theme-default">{defaultLabels.taskComplete}</option>
                           {ANIMATION_CATEGORY_OPTIONS.map(style => <option key={style} value={style}>{(style.charAt(0).toUpperCase() + style.slice(1))}</option>)}
                        </select>
                        <p className="text-sm text-text-secondary mb-4 h-10">{completeAnimToShow.description}</p>
                        <TaskCompleteAnimationTest animation={completeAnimToShow} />
                    </div>

                     <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Accept In-line Suggestion (Full Card)</h3>
                         <select onChange={(e) => setSelectedAcceptFullAnimStyle(e.target.value as any)} value={selectedAcceptFullAnimStyle} className="w-full p-2 mb-2 bg-bkg border border-secondary rounded-themed">
                            <option value="theme-default">{defaultLabels.suggestionAccept}</option>
                            {ANIMATION_CATEGORY_OPTIONS.map(style => <option key={style} value={style}>{(style.charAt(0).toUpperCase() + style.slice(1))}</option>)}
                        </select>
                        <p className="text-sm text-text-secondary mb-4 h-10">{acceptFullAnimToShow.description}</p>
                        <AcceptFullSuggestionTest animation={acceptFullAnimToShow} />
                    </div>

                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Level Up</h3>
                         <select onChange={(e) => setSelectedLevelUpAnimStyle(e.target.value as any)} value={selectedLevelUpAnimStyle} className="w-full p-2 mb-2 bg-bkg border border-secondary rounded-themed">
                            <option value="theme-default">{defaultLabels.levelUp}</option>
                            {ANIMATION_CATEGORY_OPTIONS.map(style => <option key={style} value={style}>{(style.charAt(0).toUpperCase() + style.slice(1))}</option>)}
                        </select>
                        <p className="text-sm text-text-secondary mb-4 h-10">{levelUpAnimToShow.description}</p>
                        <LevelUpTest animation={levelUpAnimToShow} />
                    </div>
                    
                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Progress Bar</h3>
                        <p className="text-sm text-text-secondary mb-4 h-10">{(getAnimationVariant(theme, 'progressBar') as any).description}</p>
                        <ProgressBarTest />
                    </div>
                    
                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Modal</h3>
                         <select onChange={(e) => setSelectedModalAnimStyle(e.target.value as any)} value={selectedModalAnimStyle} className="w-full p-2 mb-2 bg-bkg border border-secondary rounded-themed">
                            <option value="theme-default">{defaultLabels.modal}</option>
                            {ANIMATION_CATEGORY_OPTIONS.map(style => <option key={style} value={style}>{(style.charAt(0).toUpperCase() + style.slice(1))}</option>)}
                        </select>
                        <p className="text-sm text-text-secondary mb-4 h-10">{modalAnimToShow.description}</p>
                        <ModalTest animation={modalAnimToShow} />
                    </div>
                    
                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Loading Skeleton</h3>
                        <p className="text-sm text-text-secondary mb-4 h-10">{(getAnimationVariant(theme, 'loadingState') as any).description}</p>
                        <SkeletonLoaderTest />
                    </div>

                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Primary Button</h3>
                        <p className="text-sm text-text-secondary mb-4 h-10">{(getAnimationVariant(theme, 'button') as any).description}</p>
                        <ButtonTest />
                    </div>

                    <div className="p-4 bg-surface rounded-themed shadow-themed">
                        <h3 className="text-xl font-bold mb-2 font-header">Hover Animation</h3>
                        <p className="text-sm text-text-secondary mb-4 h-10">{themeHoverDescription}</p>
                        <button className="w-full p-8 bg-secondary rounded-themed theme-hover">
                            <p className="text-lg font-bold">Hover Over Me</p>
                            <p className="text-sm text-text-on-secondary-bkg">To test the theme's hover effect.</p>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};