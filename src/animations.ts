import { AnimationCategory, AnimationClassification, AnimationType } from './themeTypes';

export interface AnimationVariant {
    name: string;
    description: string;
    className: string;
    type: AnimationClassification;
    themeId?: string;
}

export interface AddTaskAnimationVariant {
    name: string;
    description: string;
    type: AnimationClassification;
    themeId?: string;
    classes: {
        confirmEnter: string;
        confirmExit: string;
        formEnter: string;
        taskEnter: string;
    }
}

export interface ViewTransitionAnimationVariant {
    name: string;
    description: string;
    type: AnimationClassification;
    themeId?: string;
    classes: {
        enter: string;
        exit: string;
    }
}

export const ANIMATION_CATEGORY_OPTIONS: AnimationCategory[] = ['standard', 'playful', 'glitch', 'retro', 'pop', 'cinematic', 'organic', 'minimal'];

export const DEFAULT_ANIMATIONS: Record<AnimationType, AnimationClassification> = {
    addTask: 'standard',
    taskComplete: 'standard',
    suggestionAccept: 'standard',
    hover: 'standard',
    enter: 'standard',
    viewTransition: 'standard',
    dismissTask: 'standard',
    levelUp: 'standard',
    progressBar: 'standard',
    inputField: 'standard',
    modal: 'standard',
    loadingState: 'standard',
    button: 'standard',
};

export const ANIMATION_SETS: {
    taskComplete: AnimationVariant[];
    suggestionAccept: AnimationVariant[];
    addTask: AddTaskAnimationVariant[];
    dismissTask: AnimationVariant[];
    levelUp: AnimationVariant[];
    modal: AnimationVariant[];
    viewTransition: ViewTransitionAnimationVariant[];
} = {
    taskComplete: [
        { name: 'standard', description: 'Task fades and scales out.', className: 'animate-complete-task-standard', type: 'standard' },
        { name: 'playful', description: 'Task bounces and pops away.', className: 'animate-complete-task-playful', type: 'playful' },
        { name: 'glitch', description: 'Task glitches out and dissolves.', className: 'animate-complete-task-glitch', type: 'glitch' },
        { name: 'retro', description: 'Task shatters into pixels.', className: 'animate-complete-task-retro', type: 'retro' },
        { name: 'pop', description: 'Task quickly scales up and fades out.', className: 'animate-complete-task-pop', type: 'pop' },
        { name: 'cinematic', description: 'Task slowly and gracefully fades out.', className: 'animate-complete-task-cinematic', type: 'cinematic' },
        { name: 'organic', description: 'Task gently dissolves like embers.', className: 'animate-complete-task-organic', type: 'organic' },
        { name: 'minimal', description: 'Task quickly and subtly fades away.', className: 'animate-complete-task-minimal', type: 'minimal' },
    ],
    suggestionAccept: [
        { name: 'standard', description: 'Suggestion card pulses with an accent color and fades.', className: 'animate-accept-suggestion-standard', type: 'standard' },
        { name: 'playful', description: 'Suggestion card bounces and pops away.', className: 'animate-accept-suggestion-playful', type: 'playful' },
        { name: 'glitch', description: 'Suggestion card glitches out and dissolves.', className: 'animate-accept-suggestion-glitch', type: 'glitch' },
        { name: 'retro', description: 'Suggestion card gets wiped away like a CRT screen.', className: 'animate-accept-suggestion-retro', type: 'retro' },
        { name: 'pop', description: 'Suggestion card quickly scales up and fades out.', className: 'animate-accept-suggestion-pop', type: 'pop' },
        { name: 'cinematic', description: 'Suggestion card slowly and gracefully fades out.', className: 'animate-accept-suggestion-cinematic', type: 'cinematic' },
        { name: 'organic', description: 'Suggestion card gently dissolves like embers.', className: 'animate-accept-suggestion-organic', type: 'organic' },
        { name: 'minimal', description: 'Suggestion card quickly and subtly fades away.', className: 'animate-accept-suggestion-minimal', type: 'minimal' },
    ],
    addTask: [
        { name: 'standard', description: 'A clean, professional animation where the confirmation slides down and out, and the new form slides in from above.', type: 'standard', classes: { confirmEnter: 'animate-standard-confirm-enter', confirmExit: 'animate-standard-confirm-exit', formEnter: 'animate-standard-form-enter', taskEnter: 'animate-standard-task-enter' } },
        { name: 'glitch', description: 'The confirmation glitches into view, then dissolves. The new form appears with a scanline effect.', type: 'glitch', classes: { confirmEnter: 'animate-glitch-confirm-enter', confirmExit: 'animate-glitch-confirm-exit', formEnter: 'animate-glitch-form-enter', taskEnter: 'animate-glitch-task-enter' } },
        { name: 'playful', description: 'A fun animation where the confirmation pops in, then bounces away. The new form bounces in from above.', type: 'playful', classes: { confirmEnter: 'animate-playful-confirm-enter', confirmExit: 'animate-playful-confirm-exit', formEnter: 'animate-playful-form-enter', taskEnter: 'animate-playful-task-enter' } },
        { name: 'retro', description: 'A retro-style animation where the confirmation pixelates in and wipes out. The new form appears with a CRT power-on effect.', type: 'retro', classes: { confirmEnter: 'animate-retro-confirm-enter', confirmExit: 'animate-retro-confirm-exit', formEnter: 'animate-retro-form-enter', taskEnter: 'animate-retro-task-enter' } },
        { name: 'pop', description: 'An impactful animation where the confirmation "POWs" into view with a hard shadow, then zips away.', type: 'pop', classes: { confirmEnter: 'animate-pop-confirm-enter', confirmExit: 'animate-pop-confirm-exit', formEnter: 'animate-pop-form-enter', taskEnter: 'animate-pop-task-enter' } },
        { name: 'cinematic', description: 'A slow, graceful fade-in for all elements.', type: 'cinematic', classes: { confirmEnter: 'animate-cinematic-confirm-enter', confirmExit: 'animate-cinematic-confirm-exit', formEnter: 'animate-cinematic-form-enter', taskEnter: 'animate-cinematic-task-enter' } },
        { name: 'organic', description: 'Elements materialize gently from a soft blur.', type: 'organic', classes: { confirmEnter: 'animate-organic-confirm-enter', confirmExit: 'animate-organic-confirm-exit', formEnter: 'animate-organic-form-enter', taskEnter: 'animate-organic-task-enter' } },
        { name: 'minimal', description: 'A very fast and subtle fade-in for all elements.', type: 'minimal', classes: { confirmEnter: 'animate-minimal-confirm-enter', confirmExit: 'animate-minimal-confirm-exit', formEnter: 'animate-minimal-form-enter', taskEnter: 'animate-minimal-task-enter' } },
    ],
    dismissTask: [
        { name: 'standard', description: 'Task fades and scales out.', className: 'animate-dismiss-task-standard', type: 'standard' },
        { name: 'playful', description: 'Task shrinks and rotates away.', className: 'animate-dismiss-task-playful', type: 'playful' },
        { name: 'glitch', description: 'Task glitches out and vanishes.', className: 'animate-dismiss-task-glitch', type: 'glitch' },
        { name: 'retro', description: 'Task collapses into a single line like a CRT screen powering off.', className: 'animate-dismiss-task-retro', type: 'retro' },
        { name: 'pop', description: 'Task quickly scales down and fades out.', className: 'animate-dismiss-task-pop', type: 'pop' },
        { name: 'cinematic', description: 'Task slowly fades to black.', className: 'animate-dismiss-task-cinematic', type: 'cinematic' },
        { name: 'organic', description: 'Task dissolves into smoke.', className: 'animate-dismiss-task-organic', type: 'organic' },
        { name: 'minimal', description: 'Task quickly fades away.', className: 'animate-dismiss-task-minimal', type: 'minimal' },
    ],
    levelUp: [
        { name: 'standard', description: "The 'Level Up' text fades and scales into view.", className: 'animate-levelup-text-standard', type: 'standard' },
        { name: 'playful', description: "The 'Level Up' text bounces into view with an overshoot effect.", className: 'animate-levelup-text-playful', type: 'playful' },
        { name: 'glitch', description: "The 'Level Up' text glitches into view with a bright flash.", className: 'animate-levelup-text-glitch', type: 'glitch' },
        { name: 'retro', description: "The 'Level Up' text blinks into view like an old arcade screen.", className: 'animate-levelup-text-retro', type: 'retro' },
        { name: 'pop', description: "The 'Level Up' text slams into view from a large size.", className: 'animate-levelup-text-pop', type: 'pop' },
        { name: 'cinematic', description: "The 'Level Up' text slowly fades in with wide letter spacing that contracts.", className: 'animate-levelup-text-cinematic', type: 'cinematic' },
        { name: 'organic', description: "The 'Level Up' text materializes from a blur.", className: 'animate-levelup-text-organic', type: 'organic' },
        { name: 'minimal', description: "The 'Level Up' text gently fades into view.", className: 'animate-levelup-text-minimal', type: 'minimal' },
    ],
    modal: [
        { name: 'standard', description: 'Modal fades and scales in from the center.', className: 'animate-modal-enter-standard', type: 'standard' },
        { name: 'playful', description: 'Modal bounces in from the top.', className: 'animate-modal-enter-playful', type: 'playful' },
        { name: 'glitch', description: 'Modal glitches into view with a flash.', className: 'animate-modal-enter-glitch', type: 'glitch' },
        { name: 'retro', description: 'Modal appears with a circular wipe effect.', className: 'animate-modal-enter-retro', type: 'retro' },
        { name: 'pop', description: 'Modal pops into view quickly.', className: 'animate-modal-enter-pop', type: 'pop' },
        { name: 'cinematic', description: 'Modal fades in slowly and smoothly.', className: 'animate-modal-enter-cinematic', type: 'cinematic' },
        { name: 'organic', description: 'Modal materializes from a blur.', className: 'animate-modal-enter-organic', type: 'organic' },
        { name: 'minimal', description: 'Modal fades in subtly.', className: 'animate-modal-enter-minimal', type: 'minimal' },
    ],
    viewTransition: [
        { name: 'standard', description: 'A simple cross-fade between views.', type: 'standard', classes: { enter: 'animate-view-enter-standard', exit: 'animate-view-exit-standard' } },
        { name: 'playful', description: 'The old view slides out while the new view slides and bounces in.', type: 'playful', classes: { enter: 'animate-view-enter-playful', exit: 'animate-view-exit-playful' } },
        { name: 'glitch', description: 'The old view glitches away and the new one glitches into place.', type: 'glitch', classes: { enter: 'animate-view-enter-glitch', exit: 'animate-view-exit-glitch' } },
        { name: 'retro', description: 'The old view wipes off screen, and the new one wipes on.', type: 'retro', classes: { enter: 'animate-view-enter-retro', exit: 'animate-view-exit-retro' } },
        { name: 'pop', description: 'The old view shrinks out and the new one pops in.', type: 'pop', classes: { enter: 'animate-view-enter-pop', exit: 'animate-view-exit-pop' } },
        { name: 'cinematic', description: 'A slow, elegant cross-fade with a slight blur.', type: 'cinematic', classes: { enter: 'animate-view-enter-cinematic', exit: 'animate-view-exit-cinematic' } },
        { name: 'organic', description: 'The old view dissolves and the new one materializes.', type: 'organic', classes: { enter: 'animate-view-enter-organic', exit: 'animate-view-exit-organic' } },
        { name: 'minimal', description: 'A very fast and subtle cross-fade.', type: 'minimal', classes: { enter: 'animate-view-enter-minimal', exit: 'animate-view-exit-minimal' } },
    ],
};