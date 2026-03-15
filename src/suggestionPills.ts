import { SuggestionPill } from './types';

export const GENERIC_EXPLORE_PILLS: SuggestionPill[] = [
    { emoji: "🗺️", label: "Plan a weekend trip" },
    { emoji: "🍳", label: "Learn a new recipe" },
    { emoji: "💪", label: "Start a 30-day challenge" },
    { emoji: "🎨", label: "Try a creative hobby" },
    { emoji: "📚", label: "Find a new book to read" },
    { emoji: "🧠", label: "Learn a random fact" },
    { emoji: "🎧", label: "Discover a new podcast" },
    { emoji: "🎲", label: "Surprise me!" }
];

export const GENERIC_PROJECT_PILLS: SuggestionPill[] = [
    { emoji: "💻", label: "Build a personal website" },
    { emoji: "🎸", label: "Learn a new instrument" },
    { emoji: "📚", label: "Read a classic novel" },
    { emoji: "🏃", label: "Train for a 5k race" },
    { emoji: "🌱", label: "Start a small garden" },
    { emoji: "✍️", label: "Write a short story" },
    { emoji: "📈", label: "Learn about investing" },
    { emoji: "🗣️", label: "Practice public speaking" }
];

/**
 * Gets a random subset of generic suggestion pills for a given context.
 * @param context The page context, either 'explore' or 'project'.
 * @param count The number of random pills to return.
 * @returns An array of suggestion pills.
 */
export const getRandomGenericSuggestionPills = (context: 'explore' | 'project', count: number): SuggestionPill[] => {
    const source = context === 'explore' ? GENERIC_EXPLORE_PILLS : GENERIC_PROJECT_PILLS;
    
    // Create a shuffled copy of the source array using the Fisher-Yates algorithm
    const shuffled = [...source];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the first `count` items
    return shuffled.slice(0, count);
};