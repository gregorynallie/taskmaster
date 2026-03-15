// src/themeTypes.ts

export type SoundPack = 'default' | 'digital' | 'organic' | 'playful' | 'minimal' | 'kawaii' | 'luxe' | 'analog' | 'vibrant';

export type AnimationCategory = 'standard' | 'playful' | 'glitch' | 'retro' | 'pop' | 'cinematic' | 'organic' | 'minimal';
export type AnimationClassification = AnimationCategory | 'theme-specific';
export type AnimationType = 
    | 'addTask' 
    | 'taskComplete' 
    | 'suggestionAccept' 
    | 'hover' 
    | 'enter' 
    | 'viewTransition' 
    | 'dismissTask'
    | 'levelUp'
    | 'progressBar'
    | 'inputField'
    | 'modal'
    | 'loadingState'
    | 'button';

// --- Animation Override Types ---

// For simple, single-class animations
export type AnimationOverride = AnimationClassification | {
  className: string;
  description: string;
};

// For complex, multi-class animations like 'addTask'
export type AddTaskAnimationOverride = AnimationClassification | {
  classes: {
    confirmEnter: string;
    confirmExit: string;
    formEnter: string;
    taskEnter: string;
  };
  description: string;
};

// For view transitions
export type ViewTransitionAnimationOverride = AnimationClassification | {
  classes: {
    enter: string;
    exit: string;
  };
  description: string;
};

// For hover effects, which are often just descriptions of CSS pseudo-class behavior
export type HoverAnimationOverride = AnimationClassification | {
  description: string;
};

export interface ThemeDefinition {
  id: string;
  name: string;
  category: string;
  font: string;
  soundPack: SoundPack;
  isLight: boolean;
  animations?: {
    addTask?: AddTaskAnimationOverride;
    taskComplete?: AnimationOverride;
    suggestionAccept?: AnimationOverride;
    hover?: HoverAnimationOverride;
    enter?: AnimationOverride;
    viewTransition?: ViewTransitionAnimationOverride;
    dismissTask?: AnimationOverride;
    levelUp?: AnimationOverride;
    progressBar?: AnimationClassification;
    inputField?: AnimationClassification;
    modal?: AnimationOverride;
    loadingState?: AnimationClassification;
    button?: AnimationClassification;
  };
  cssVariables: {
    [key: string]: string;
  };
  customCss?: string;
}