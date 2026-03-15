import React, { useMemo } from 'react';
import { useSettings } from '../contexts/SettingsProvider';
import { getAnimationVariant } from '../utils/animationUtils';
import { AnimationVariant } from '../src/animations';

export const SuggestedTaskCardSkeleton: React.FC = () => {
    const { theme } = useSettings();
    const skeletonVariant = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'loadingState'), [theme]);
    // The skeleton classes are defined in index.html like .skeleton-standard, .skeleton-playful etc.
    // The variant `type` property holds this classification.
    const skeletonAnimationClass = `skeleton-${skeletonVariant.type}`;

    return (
        <div className={`p-4 rounded-themed border-2 border-dashed border-secondary/50 bg-surface/50 min-h-[190px] flex flex-col justify-between animate-themed-enter ${skeletonAnimationClass} skeleton-loader`}>
            <div>
                <p className="font-bold text-text-secondary animate-pulse text-center mb-4">Thinking of something for you to do...</p>
                <div className="space-y-2">
                    <div className="h-5 w-4/5 rounded skeleton-line mx-auto"></div>
                    <div className="h-4 w-full rounded skeleton-line mt-3"></div>
                    <div className="h-4 w-3/4 rounded skeleton-line"></div>
                </div>
            </div>
            <div className="flex items-center gap-4 text-xs flex-wrap mt-4">
                <div className="h-6 w-24 rounded-full skeleton-line"></div>
                <div className="h-4 w-16 rounded skeleton-line"></div>
            </div>
            <div className="mt-4 flex justify-end items-center gap-2">
                <div className="h-8 w-8 rounded-themed skeleton-line"></div>
                <div className="h-10 w-24 rounded-themed skeleton-line"></div>
            </div>
        </div>
    );
};