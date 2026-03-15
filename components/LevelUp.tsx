import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { getAnimationVariant } from '../utils/animationUtils';
import { AnimationVariant } from '../src/animations';

export const LevelUp: React.FC = () => {
    const { levelUpInfo, clearLevelUp } = useUserProfile();
    const { theme } = useSettings();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (levelUpInfo) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Allow fade-out animation to complete before clearing
                setTimeout(clearLevelUp, 500); 
            }, 3000); // Display for 3 seconds

            return () => clearTimeout(timer);
        }
    }, [levelUpInfo, clearLevelUp]);

    if (!isVisible || !levelUpInfo) {
        return null;
    }
    
    const levelUpAnimation = getAnimationVariant<AnimationVariant>(theme, 'levelUp');
    
    return (
        <div 
            className={`fixed inset-0 bg-black/70 z-50 flex items-center justify-center transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="text-center">
                <h2 className={`text-6xl md:text-8xl font-bold font-header text-accent ${levelUpAnimation.className}`} style={{ textShadow: '0 0 20px var(--accent)' }}>
                    LEVEL UP!
                </h2>
                <p className={`text-3xl md:text-4xl font-semibold mt-4 text-white ${levelUpAnimation.className}`} style={{ animationDelay: '0.2s' }}>
                    You are now Level {levelUpInfo.newLevel}
                </p>
            </div>
        </div>
    );
};