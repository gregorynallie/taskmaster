import React, { useMemo } from 'react';
import { useSettings } from '../../contexts/SettingsProvider';
import { getAnimationVariant } from '../../utils/animationUtils';
import { AnimationVariant } from '../../src/animations';
import { Theme } from '../../types';

interface ModalWrapperProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    isFrosted: boolean;
    theme: Theme;
    className?: string;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, children, isFrosted, theme, className = "max-w-2xl" }) => {
    const modalAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'modal'), [theme]);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
            <div
                className={`p-6 rounded-themed shadow-themed w-full m-4 ${isFrosted ? 'bg-surface-modal-bkg backdrop-blur-md' : 'bg-surface'} ${modalAnimation.className} ${className}`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};


interface WowFeaturesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WowFeaturesModal: React.FC<WowFeaturesModalProps> = ({ isOpen, onClose }) => {
    const { theme } = useSettings();
    const isFrosted = theme === 'ocean-mist';

    const Feature: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <div className="p-4 bg-secondary/20 rounded-themed">
            <h3 className="text-lg font-bold font-header text-primary mb-2">{title}</h3>
            <div className="text-sm text-text-secondary space-y-2">{children}</div>
        </div>
    );

    return (
        <ModalWrapper isOpen={isOpen} onClose={onClose} isFrosted={isFrosted} theme={theme}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-header text-accent">Unlock Your Inner Task Master!</h2>
                <button onClick={onClose} className="text-2xl font-bold text-text-secondary hover:text-text-primary transition-themed">&times;</button>
            </div>
            <p className="text-text-secondary mb-6">This app is smarter than it looks. Here are a few pro tips to get the most out of your day:</p>
            
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <Feature title="Suggest Tasks In-Context">
                    <p>Hover over any task to add a related task before or after it. Hover <em>between</em> tasks to add a 'bridge' task that connects them.</p>
                </Feature>

                <Feature title="Get Smarter Tasks, Instantly">
                    <p>Type a simple idea like <code>go run</code>. The AI automatically enriches it with a better title, details, and a category. Less typing, more doing.</p>
                </Feature>

                <Feature title="Use Natural Language">
                    <p>The 'Add Task' input understands you. Try <code>laundry and dinner</code> to create two tasks, or <code>call mom tomorrow at 2pm</code> to schedule it automatically.</p>
                </Feature>
                
                <Feature title="Turn Big Goals into Projects">
                    <p>In the 'Projects' tab, enter a huge goal like <code>learn guitar</code>. The AI will break it down into the first few actionable steps for you.</p>
                </Feature>

                <Feature title="Your Persona is the AI's Brain">
                    <p>All suggestions are based on your Persona profile. The more detail you add, the smarter the AI gets at suggesting things you'll actually <em>want</em> to do.</p>
                </Feature>

                <Feature title="Find Your Vibe (100+ Themes)">
                    <p>Go to Settings and explore a huge library of themes, each with unique animations. Make your tasks explode with <strong>Come Get Some</strong> or dissolve into sand with <strong>Journey</strong>.</p>
                </Feature>
            </div>

            <div className="mt-6 text-right">
                <button
                    onClick={onClose}
                    className="theme-hover bg-primary text-white font-bold py-2 px-6 rounded-themed transition-themed"
                >
                    Got it!
                </button>
            </div>
        </ModalWrapper>
    );
};