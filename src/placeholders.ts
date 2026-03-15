import { Placeholder } from './types';

export const GENERIC_TASK_PLACEHOLDERS: Placeholder[] = [
    {
        question: "What's on your mind?",
        example: "Example: Finish the weekly report by 5pm",
        subtext: "💡 Tip: The AI can understand dates and times."
    },
    {
        question: "Anything to add to the list?",
        example: "Example: Go for a run and buy milk",
        subtext: "💡 Tip: Use 'and' or ',' to add multiple tasks at once."
    },
    {
        question: "Let's get something done.",
        example: "Example: Meditate every morning",
        subtext: "💡 Tip: Use 'every' to create recurring tasks."
    },
    {
        question: "What's the next small step?",
        example: "Example: Tidy up my desk for 10 minutes",
        subtext: "💡 Tip: Be specific to make tasks more actionable."
    },
    {
        question: "Plan an adventure?",
        example: "Example: Research hiking trails for Saturday",
        subtext: "💡 Tip: Adding a day helps schedule it automatically."
    },
    {
        question: "What needs your attention?",
        example: "Example: Water the plants",
        subtext: "💡 Tip: Even small tasks feel good to complete."
    }
];

export const GENERIC_PROJECT_PLACEHOLDERS: Placeholder[] = [
    {
        question: "What's a big goal you have?",
        example: "Example: Learn to play the guitar",
        subtext: "💡 Tip: The AI will break this down into the first few steps."
    },
    {
        question: "Start a new project?",
        example: "Example: Build a personal website",
        subtext: "💡 Tip: Turn your ambitions into actionable projects."
    },
    {
        question: "What skill do you want to learn?",
        example: "Example: Get conversational in Spanish",
        subtext: "💡 Tip: Great goals are made of small, consistent steps."
    },
    {
        question: "Plan something epic?",
        example: "Example: Organize a dream vacation to Japan",
        subtext: "💡 Tip: The AI will help you plan the first few tasks."
    },
    {
        question: "What's a creative idea you have?",
        example: "Example: Write a short story",
        subtext: "💡 Tip: Get started by letting the AI create an outline."
    }
];

export const GENERIC_EXPLORE_PLACEHOLDERS: Placeholder[] = [
    {
        question: "What are you curious about?",
        example: "Example: Find a new recipe to cook this week",
        subtext: "💡 Tip: Get AI-powered suggestions for any idea."
    },
    {
        question: "Looking for something new?",
        example: "Example: Plan a day trip for the weekend",
        subtext: "💡 Tip: Discover new activities and hobbies."
    },
    {
        question: "What's a forgotten hobby?",
        example: "Example: Practice drawing for 15 minutes",
        subtext: "💡 Tip: Re-discover something you love."
    },
    {
        question: "How can you improve your space?",
        example: "Example: Find ideas to redecorate my bedroom",
        subtext: "💡 Tip: The AI can suggest themes and steps."
    },
    {
        question: "Feeling adventurous?",
        example: "Example: Try a new type of workout",
        subtext: "💡 Tip: Explore different ways to stay active and healthy."
    }
];

export const getRandomGenericPlaceholder = (context: 'task' | 'project' | 'explore'): Placeholder => {
    let list: Placeholder[];
    switch (context) {
        case 'project': 
            list = GENERIC_PROJECT_PLACEHOLDERS;
            break;
        case 'explore': 
            list = GENERIC_EXPLORE_PLACEHOLDERS;
            break;
        case 'task':
        default: 
            list = GENERIC_TASK_PLACEHOLDERS;
            break;
    }
    return list[Math.floor(Math.random() * list.length)];
};