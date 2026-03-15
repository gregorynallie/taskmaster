import React, { useState, useEffect, useMemo } from 'react';
import { Suggestion, Theme } from '../types';
import { useSettings } from '../contexts/SettingsProvider';
import { useTasks } from '../contexts/TasksProvider';
import { THEMES } from '../src/themes';
import { formatRecurrenceRule } from '../utils/dateUtils';

interface SuggestedTaskCardProps {
  suggestion: Suggestion;
  onAccept: () => void;
  onShuffle: () => void;
  index: number;
  isShuffleDisabled?: boolean;
  acceptButtonText?: string;
  isAcceptDisabled?: boolean;
  showScheduleButton?: boolean;
  onSchedule?: () => void;
}

// Generates a subtle, theme-aware color style from a string.
const stringToSubtleColorStyle = (str: string, isLight: boolean) => {
    if (!str) return {};
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = hash % 360;
    const s = isLight ? 50 : 35; // Saturation
    const l_border = isLight ? 80 : 40; // Lightness for border
    const l_text = isLight ? 25 : 88; // Lightness for badge text

    return {
        border: `hsl(${h}, ${s}%, ${l_border}%)`,
        borderHover: `hsl(${h}, ${s + 15}%, ${l_border + (isLight ? -5 : 10)}%)`,
        badgeBackground: `hsla(${h}, ${s}%, ${l_border}%, ${isLight ? 0.3 : 0.1})`,
        badgeColor: `hsl(${h}, ${s + 20}%, ${l_text}%)`,
    };
};

const renderDescriptionWithLinks = (text: string) => {
    if (!text) return text;
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts = text.split(linkRegex);
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < parts.length; i += 3) {
        // Plain text part
        if (parts[i]) {
            elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
        }
        // Link part
        if (parts[i + 1] && parts[i + 2]) {
            elements.push(
                <a 
                    key={`link-${i}`} 
                    href={parts[i + 2]} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-accent underline hover:text-primary-focus transition-colors"
                    onClick={e => e.stopPropagation()} // Prevent card actions when clicking a link
                >
                    {parts[i + 1]}
                </a>
            );
        }
    }
    return elements;
};


export const SuggestedTaskCard: React.FC<SuggestedTaskCardProps> = React.memo(({ 
    suggestion, 
    onAccept, 
    onShuffle, 
    index, 
    isShuffleDisabled = false,
    acceptButtonText = 'Accept',
    isAcceptDisabled = false,
    showScheduleButton = false,
    onSchedule,
}) => {
    const { mode, theme } = useSettings();
    const [isAccepting, setIsAccepting] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [animationClass, setAnimationClass] = useState('animate-themed-enter');
    
    if (suggestion.isLoading) {
        return (
            <div className="p-4 rounded-themed border-2 border-dashed border-secondary/30 bg-surface/50 h-full flex items-center justify-center min-h-[240px]">
                <p className="text-text-secondary animate-pulse">Thinking..</p>
            </div>
        );
    }

    useEffect(() => {
        // Reset animation for new suggestion
        setAnimationClass('animate-themed-enter');
    }, [suggestion.id]);

    const isLightTheme = useMemo(() => THEMES[theme]?.isLight ?? false, [theme]);

    const subtleColors = useMemo(
      () => stringToSubtleColorStyle(suggestion.context_tag || suggestion.category, isLightTheme),
      [suggestion.context_tag, suggestion.category, isLightTheme]
    );

    const handleShuffleClick = () => {
        setAnimationClass('animate-themed-exit');
        setTimeout(() => {
            onShuffle();
        }, 300); // Wait for exit animation to complete
    };

    const handleAccept = () => {
        if (isAccepting) return;
        setIsAccepting(true);
        setTimeout(() => {
            onAccept();
        }, 500); // Match animation duration
    };
    
    const cardStyle = {
      borderColor: isHovered ? subtleColors.borderHover : subtleColors.border,
    };

    const badgeStyle = {
      backgroundColor: subtleColors.badgeBackground,
      color: subtleColors.badgeColor,
      borderColor: `hsla(0, 0%, 0%, 0.1)`, 
    };

    const suggestionTypeLabel = useMemo(() => {
        if (suggestion.isProjectStarter) {
            return `🚀 Starts a new ${mode === 'rpg' ? 'Quest' : 'Project'}`;
        }
        if (suggestion.recurring) {
            return `🔄 ${formatRecurrenceRule(suggestion.recurring, { concise: true })}`;
        }
        return null;
    }, [suggestion, mode]);
    
    return (
        <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={cardStyle}
            className={`
                theme-hover p-4 rounded-themed border-2 flex flex-col transition-all duration-themed ease-themed bg-surface relative
                ${isAccepting ? 'animate-accept-suggestion' : animationClass}
            `}
        >
            {/* Top Badge Row */}
            <div className="flex items-center justify-between mb-2">
                 {suggestion.context_tag && (
                    <span 
                        className="font-semibold px-3 py-1 rounded-full text-xs border"
                        style={badgeStyle}
                    >
                        {suggestion.context_tag}
                    </span>
                )}
                 {suggestionTypeLabel && (
                    <span className="font-semibold px-3 py-1 rounded-full text-xs border text-accent border-accent/50 bg-accent/10">
                        {suggestionTypeLabel}
                    </span>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-grow">
                <p className={`font-bold text-text-primary text-lg`}>{suggestion.title}</p>
                <div className="mt-2 text-sm text-text-secondary space-y-2 pt-2">
                        <p>{renderDescriptionWithLinks(suggestion.description)}</p>
                </div>
            </div>

            {/* Footer */}
            <div className={`mt-4 pt-3 border-t border-secondary/30`}>
                <div className="flex items-center justify-evenly text-xs mb-3 flex-wrap gap-2">
                    {suggestion.isHybrid && suggestion.hybridCategoryName ? (
                        <span style={badgeStyle} className="font-semibold px-2 py-1 rounded-full border">✨ {suggestion.hybridCategoryName}</span>
                    ) : (
                        <span className="bg-primary/10 text-primary font-semibold px-2 py-1 rounded-full">{suggestion.category}</span>
                    )}
                    <span className="text-text-secondary">{suggestion.duration_min} min</span>
                    {mode === 'rpg' && <span className="font-bold text-accent">+{suggestion.xp_estimate} XP</span>}
                </div>
                <div className="flex justify-around items-center w-full gap-4">
                    <button onClick={handleShuffleClick} disabled={isAccepting || isShuffleDisabled} className={`theme-hover p-2 rounded-themed hover:bg-secondary transition-themed disabled:opacity-50`} aria-label="Shuffle suggestion"><span className="text-xl">⟳</span></button>
                    <button onClick={handleAccept} disabled={isAccepting || isAcceptDisabled} className={`theme-hover font-semibold bg-primary hover:bg-primary-focus text-white rounded-themed transition-themed disabled:bg-secondary disabled:cursor-not-allowed py-2 px-8`}>{acceptButtonText}</button>
                    {showScheduleButton ? (
                        <button 
                            onClick={onSchedule}
                            disabled={isAccepting}
                            className={`theme-hover p-2 rounded-themed hover:bg-secondary transition-themed disabled:opacity-50`}
                            aria-label="Schedule task"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </button>
                    ) : (
                        <div className="w-10 h-10"></div> // Placeholder to keep spacing consistent
                    )}
                </div>
            </div>
        </div>
    );
});