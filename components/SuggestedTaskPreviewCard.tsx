import React, { useState, useRef, useMemo } from 'react';
import { Suggestion, Theme } from '../types';
import { useSettings } from '../contexts/SettingsProvider';
import { useTasks } from '../contexts/TasksProvider';
import { getAnimationVariant } from '../utils/animationUtils';
import { AnimationVariant } from '../src/animations';
import { THEMES } from '../src/themes';

interface SuggestedTaskPreviewCardProps {
  suggestion: Suggestion;
  onAccept: (fromRect: DOMRect) => void;
  onShuffle: () => void;
  isSandboxMode?: boolean;
  onAnimationEnd?: () => void;
  isAcceptingOverride?: boolean;
  acceptAnimationClass?: string; // This can be deprecated
}

const renderDescriptionWithLinks = (text: string) => {
    if (!text) return text;
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = text.split(linkRegex);
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i += 3) {
        if (parts[i]) {
            elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
        }
        if (parts[i + 1] && parts[i + 2]) {
            elements.push(
                <a 
                    key={`link-${i}`} 
                    href={parts[i + 2]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-primary-focus transition-colors"
                    onClick={e => e.stopPropagation()}
                >
                    {parts[i + 1]}
                </a>
            );
        }
    }
    return elements;
};

export const SuggestedTaskPreviewCard: React.FC<SuggestedTaskPreviewCardProps> = ({ 
  suggestion, 
  onAccept, 
  onShuffle,
  isSandboxMode = false,
  onAnimationEnd,
  isAcceptingOverride = false,
}) => {
  const { mode, theme } = useSettings();
  const [internalIsAccepting, setInternalIsAccepting] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isAccepting = isSandboxMode ? isAcceptingOverride : internalIsAccepting;
  const acceptAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'suggestionAccept'), [theme]);

  const handleAccept = () => {
      if (isAccepting || !cardRef.current) return;
      const fromRect = cardRef.current.getBoundingClientRect();
      
      if (isSandboxMode) {
          onAccept(fromRect);
      } else {
          setInternalIsAccepting(true);
          // Add a delay to allow animation to play before calling parent
          setTimeout(() => {
              onAccept(fromRect);
          }, 500);
      }
  };
  
  const animationToUse = isAccepting ? acceptAnimation.className : 'animate-themed-enter';

  if (suggestion.isLoading) {
    return (
        <div className="p-4 rounded-themed border-2 border-dashed border-secondary/50 bg-surface/50 min-h-[190px] flex flex-col justify-center items-center relative overflow-hidden transition-all duration-300">
            <p className="text-text-secondary animate-pulse font-semibold">Thinking...</p>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/30">
                <div className="h-full bg-primary origin-left animate-fill-progress"></div>
            </div>
        </div>
    );
  }


  return (
    <div 
      ref={cardRef}
      onAnimationEnd={onAnimationEnd}
      className={`p-4 rounded-themed border-2 border-dashed border-accent bg-surface/50 flex flex-col gap-2 transition-all duration-300 ${animationToUse}`}
    >
      <div>
        <p className="font-bold text-text-primary">{suggestion.title}</p>
        <p className="text-sm text-text-secondary mt-1">{renderDescriptionWithLinks(suggestion.description)}</p>
        <p className="text-sm text-text-secondary mt-2 italic">💡 {suggestion.reasoning}</p>
      </div>
      <div className="flex items-center gap-4 text-xs flex-wrap mt-2">
        <span className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{suggestion.category}</span>
        <span className="text-text-secondary">{suggestion.duration_min} min</span>
        {mode === 'rpg' && <span className="font-bold text-accent">+{suggestion.xp_estimate} XP</span>}
      </div>
      <div className="mt-2 flex justify-end items-center gap-2">
        <button
          onClick={onShuffle}
          disabled={isAccepting}
          className="p-2 rounded-themed hover:bg-secondary transition-themed disabled:opacity-50"
          aria-label="Shuffle suggestion"
        >
          <span className="text-xl">⟳</span>
        </button>
        <button
          onClick={handleAccept}
          disabled={isAccepting}
          className="text-sm font-semibold bg-primary hover:bg-primary-focus text-white py-2 px-6 rounded-themed transition-themed disabled:bg-secondary disabled:cursor-not-allowed"
        >
          {isAccepting ? 'Adding...' : 'Accept'}
        </button>
      </div>
    </div>
  );
};