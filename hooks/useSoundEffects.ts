import { useCallback } from 'react';
import { Theme } from '../types';
import { SOUND_PACKS, SoundName } from '../assets/sounds';
import { THEMES } from '../src/themes';

export const useSoundEffects = (theme: Theme, isEnabled: boolean) => {
    
    const playSound = useCallback((soundName: SoundName) => {
        if (!isEnabled) return;
        
        try {
            const soundPackName = THEMES[theme]?.soundPack || 'default';
            const soundPack = SOUND_PACKS[soundPackName];
            const soundSrc = soundPack[soundName];
            
            if (soundSrc) {
                const audio = new Audio(soundSrc);
                audio.play().catch(e => {
                    // This can happen if the user hasn't interacted with the page yet.
                    // It's a browser security feature.
                    console.warn("Sound playback was interrupted:", e.message);
                });
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }

    }, [isEnabled, theme]);

    return { playSound };
};