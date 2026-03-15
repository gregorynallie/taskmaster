import { Suggestion } from './types';

export const GENERIC_EXPLORE_SUGGESTIONS: Suggestion[] = [
    // Productivity & Organization
    {
        title: "Tidy Up Your Digital Workspace",
        description: "Organize your desktop files into folders, clear out your downloads folder, and archive old projects. A clean digital space reduces stress.",
        category: "Productivity",
        duration_min: 15,
        xp_estimate: 25,
        reasoning: "A quick win.",
        context_tag: "Digital Declutter"
    },
    {
        title: "Plan Your Meals for the Next 3 Days",
        description: "Decide on your breakfasts, lunches, and dinners. Make a grocery list. This saves time and reduces decision fatigue during the week.",
        category: "Productivity",
        duration_min: 20,
        xp_estimate: 30,
        reasoning: "Set yourself up.",
        context_tag: "Life Admin"
    },
    {
        title: "The '2-Minute Rule'",
        description: "Find any task you've been procrastinating on that would take less than two minutes, and do it right now. Examples: reply to an email, take out the trash, make your bed.",
        category: "Productivity",
        duration_min: 2,
        xp_estimate: 10,
        reasoning: "Build momentum.",
        context_tag: "Quick Win"
    },
    // Health & Wellness
    {
        title: "10-Minute Guided Meditation",
        description: "Find a guided meditation video on YouTube for focus, stress relief, or gratitude. Just 10 minutes can significantly reset your mental state.",
        category: "Health",
        duration_min: 10,
        xp_estimate: 20,
        reasoning: "For mental clarity.",
        context_tag: "Mindfulness"
    },
    {
        title: "Full Body Stretch Routine",
        description: "Spend 15 minutes stretching major muscle groups: neck, shoulders, chest, back, hips, and legs. Hold each stretch for 30 seconds.",
        category: "Health",
        duration_min: 15,
        xp_estimate: 25,
        reasoning: "Boosts energy.",
        context_tag: "Physical Health"
    },
    {
        title: "Hydration Check",
        description: "Drink a full glass of water right now. Many people are chronically dehydrated, which can cause fatigue and headaches. Set a reminder to drink water every hour.",
        category: "Health",
        duration_min: 1,
        xp_estimate: 5,
        reasoning: "A simple boost.",
        context_tag: "Micro-Habit"
    },
    // Personal Growth
    {
        title: "Learn 5 Basic Phrases in a New Language",
        description: "Use an app like Duolingo or a quick YouTube video to learn 'Hello,' 'Goodbye,' 'Please,' 'Thank you,' and 'My name is...' in a language you're curious about.",
        category: "Personal Growth",
        duration_min: 10,
        xp_estimate: 20,
        reasoning: "Expand your world.",
        context_tag: "Skill Building"
    },
    {
        title: "Watch a 15-Minute TED Talk",
        description: "Go to TED.com and browse for a topic that interests you, whether it's technology, psychology, art, or science. Learn something new and inspiring.",
        category: "Personal Growth",
        duration_min: 15,
        xp_estimate: 25,
        reasoning: "Broaden perspective.",
        context_tag: "Learning"
    },
    {
        title: "Journal for 5 Minutes",
        description: "Write down three things you're grateful for, one challenge you're facing, and one thing you're looking forward to. Don't overthink it.",
        category: "Personal Growth",
        duration_min: 5,
        xp_estimate: 15,
        reasoning: "For self-reflection.",
        context_tag: "Mindfulness"
    },
    // Fun & Creativity
    {
        title: "Listen to a 'Discovery' Playlist",
        description: "Open your favorite music app and find a personalized discovery playlist. Listen to a few new tracks and see if you find a new favorite artist.",
        category: "Fun",
        duration_min: 20,
        xp_estimate: 20,
        reasoning: "Find new music.",
        context_tag: "Discovery"
    },
    {
        title: "Sketch Something for 10 Minutes",
        description: "It doesn't have to be good! Grab a pen and paper and draw the object closest to you, a cartoon character, or just abstract shapes.",
        category: "Fun",
        duration_min: 10,
        xp_estimate: 20,
        reasoning: "Flex creative muscles.",
        context_tag: "Creativity"
    },
    {
        title: "Plan a Fun Weekend Outing",
        description: "Research a new park, museum, cafe, or neighborhood to visit this weekend. Having something to look forward to boosts mood.",
        category: "Fun",
        duration_min: 15,
        xp_estimate: 20,
        reasoning: "Plan for joy.",
        context_tag: "Social"
    }
];

/**
 * Gets a random subset of generic suggestions.
 * @param count The number of random suggestions to return.
 * @returns An array of suggestion objects.
 */
export const getRandomGenericSuggestions = (count: number): Suggestion[] => {
    // Create a shuffled copy of the source array using the Fisher-Yates algorithm
    const shuffled = [...GENERIC_EXPLORE_SUGGESTIONS];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    // Return the first `count` items
    return shuffled.slice(0, count);
};