import { Mode } from "./uiTypes";

export interface OnboardingAnswers {
    rhythm?: string;
    priorities?: string[];
    interests?: string[];
    rhythm_habits?: string[];
    notes?: string;
    persona?: string; // ID of the predefined persona
    [key: string]: any; // To allow for dynamic question IDs
}

export interface OnboardingOption {
    value: string;
    label: string;
    description?: string;
    emoji?: string;
}

export interface OnboardingStep {
    id: string;
    question: string;
    options: OnboardingOption[];
    isMultiSelect?: boolean;
}

export interface PredefinedPersona {
    id: string;
    name: string;
    description: string;
    interests: string;
    dislikes: string;
    longTermGoals: string;
    dailyRhythm: string;
}