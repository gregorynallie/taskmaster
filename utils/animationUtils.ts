// utils/animationUtils.ts
import { Theme } from '../types';
import { THEMES } from '../src/themes';
import { DEFAULT_ANIMATIONS, ANIMATION_SETS, AnimationVariant, AddTaskAnimationVariant, ViewTransitionAnimationVariant } from '../src/animations';
import { AnimationType, AnimationClassification } from '../src/themeTypes';

/**
 * A universal resolver that gets the complete animation variant details for a given theme and animation type.
 * It intelligently handles theme-specific overrides defined directly in the theme file.
 */
export function getAnimationVariant<T extends AnimationVariant | AddTaskAnimationVariant | ViewTransitionAnimationVariant | AnimationClassification>(
    themeId: Theme,
    animationType: AnimationType
): T {
    const themeDef = THEMES[themeId];
    const themeOverride = themeDef?.animations?.[animationType];
    const animationSet = ANIMATION_SETS[animationType as keyof typeof ANIMATION_SETS] as T[];

    // This case handles simple animations like 'progressBar' which are not in ANIMATION_SETS.
    if (!animationSet) {
        // FIX: Always return a consistent object structure.
        const classification = (themeOverride as AnimationClassification) || DEFAULT_ANIMATIONS[animationType];
        
        let description = `A ${classification} style animation.`;
        if (animationType === 'progressBar') description = 'Animation for the progress bar fill.';
        if (animationType === 'loadingState') description = 'Animation for skeleton loader elements.';
        if (animationType === 'button') description = 'Animation for primary button interactions.';

        const minimalVariant = {
            name: classification,
            description: description,
            className: '', // Class is constructed from .type
            type: classification
        };
        return minimalVariant as T;
    }


    // Case 1: Theme provides a full, custom animation object directly in its definition.
    if (typeof themeOverride === 'object') {
        const baseDetails = {
            name: `${themeDef.name} Special`,
            type: 'theme-specific' as const,
            themeId: themeId,
        };
        return { ...baseDetails, ...themeOverride } as T;
    }

    // Case 2: Theme provides a classification string (e.g., 'playful') or is undefined.
    const classification = (themeOverride as AnimationClassification) || DEFAULT_ANIMATIONS[animationType];
    
    // Find the corresponding variant from the central ANIMATION_SETS.
    const variant = animationSet.find(v => (v as any).type === classification);
    
    // Fallback to the 'standard' animation for that type if the specific one isn't found.
    return variant || animationSet.find(v => (v as any).type === 'standard')!;
}