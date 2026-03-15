import { OnboardingStep, PredefinedPersona } from "./types/onboardingTypes";

export const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        id: 'rhythm',
        question: "What's the rhythm of your day? ☀️",
        options: [
            { value: 'Early Bird', label: 'Early Bird', description: "I conquer the day before noon.", emoji: '🌅' },
            { value: 'Night Owl', label: 'Night Owl', description: "I find my focus after sundown.", emoji: '🦉' },
            { value: 'Flexible', label: 'Flexible', description: "My schedule is unpredictable!", emoji: '🤸' },
            { value: 'Write my own...', label: 'Write my own...', description: "Let me explain.", emoji: '✍️' },
        ],
    },
    {
        id: 'priorities',
        question: "Right now, what are your main focuses?",
        isMultiSelect: true,
        options: [
            { value: 'Getting Organized', label: 'Get My Life Organized', emoji: '✅' },
            { value: 'Health & Fitness', label: 'Health & Fitness Goals', emoji: '💪' },
            { value: 'Learning a New Skill', label: 'Learn a New Skill', emoji: '🧠' },
            { value: 'Career Growth', label: 'Advance My Career', emoji: '🚀' },
            { value: 'Creative Projects', label: 'Creative Projects', emoji: '🎨' },
            { value: 'Mental Wellness', label: 'Improve Mental Wellness', emoji: '🧘' },
            { value: 'Home Improvement', label: 'Home Improvement', emoji: '🏠' },
            { value: 'Social Life', label: 'Improve Social Life', emoji: '🎉' },
            { value: 'Write my own...', label: 'Write my own...', emoji: '✍️' },
        ],
    },
     {
        id: 'rhythm_habits',
        question: "What are some things you do (or want to do) every day or week?",
        isMultiSelect: true,
        options: [
            { value: 'Go for a walk', label: 'Go for a walk', emoji: '🚶' },
            { value: 'Workout 3x a week', label: 'Workout 3x a week', emoji: '🏋️' },
            { value: 'Stretch for 10 minutes', label: 'Stretch for 10min', emoji: '🤸' },
            { value: 'Stay hydrated (e.g., drink 2L of water)', label: 'Stay Hydrated', emoji: '💧' },
            { value: 'Daily journaling', label: 'Daily journaling', emoji: '📓' },
            { value: 'Review my day / Plan for tomorrow', label: 'Daily Reflection/Planning', emoji: '🤔' },
            { value: 'Weekly planning session', label: 'Weekly planning session', emoji: '📅' },
            { value: 'Read before bed', label: 'Read before bed', emoji: '📖' },
            { value: 'Mindful moment or meditation for 5 minutes', label: 'Mindful Moment (5min)', emoji: '🧘' },
            { value: 'Quick 5-minute tidy-up', label: 'Quick Tidy-up (5min)', emoji: '🧹' },
            { value: 'Cook dinner at home', label: 'Cook dinner at home', emoji: '🍳' },
            { value: 'Practice a skill for 15 minutes', label: 'Practice a skill (15min)', emoji: '💡' },
            { value: 'Connect with a friend or family member', label: 'Connect with someone', emoji: '💬' },
            { value: 'Write my own...', label: 'Write my own...', emoji: '✍️' },
        ],
    },
    {
        id: 'interests',
        question: "What are some of your interests?",
        isMultiSelect: true,
        options: [
            { value: 'Gaming', label: 'Gaming', emoji: '🎮' },
            { value: 'Reading', label: 'Reading', emoji: '📚' },
            { value: 'Movies & TV', label: 'Movies & TV', emoji: '🍿' },
            { value: 'Coding', label: 'Coding', emoji: '💻' },
            { value: 'Music', label: 'Music', emoji: '🎧' },
            { value: 'Art & Design', label: 'Art & Design', emoji: '🎨' },
            { value: 'Sports', label: 'Sports', emoji: '⚽' },
            { value: 'Cooking', label: 'Cooking', emoji: '🍳' },
            { value: 'Fitness', label: 'Fitness', emoji: '💪' },
            { value: 'Traveling', label: 'Traveling', emoji: '✈️' },
            { value: 'Writing', label: 'Writing', emoji: '✍️' },
            { value: 'Photography', label: 'Photography', emoji: '📷' },
            { value: 'Write my own...', label: 'Write my own...', emoji: '✍️' },
        ],
    }
];

export const PREDEFINED_PERSONAS: PredefinedPersona[] = [
    {
        id: 'balanced-adventurer',
        name: 'The Balanced Achiever',
        description: 'A mix of productivity, health, and personal growth.',
        interests: 'Reading, hiking, trying new recipes',
        dislikes: 'Sitting still for too long, junk food',
        longTermGoals: 'Maintain a healthy work-life balance, learn something new each month',
        dailyRhythm: 'I like to get my most important task done in the morning, then focus on health and hobbies in the afternoon/evening.'
    },
    {
        id: 'creative-night-owl',
        name: 'The Creative Night Owl',
        description: 'For those who thrive after dark on creative projects.',
        interests: 'Art, design, video games, writing, indie music',
        dislikes: 'Early mornings, rigid schedules, creative blocks',
        longTermGoals: 'Finish my personal creative project (e.g., comic, game, album), build a portfolio',
        dailyRhythm: 'I wake up late and do my most focused, creative work between 9 PM and 2 AM. My mornings are for relaxing.'
    },
    {
        id: 'productivity-pro',
        name: 'The Productivity Pro',
        description: 'Focused on crushing goals and optimizing workflows.',
        interests: 'Tech news, startups, efficiency hacks, non-fiction books',
        dislikes: 'Wasted time, inefficient meetings, cluttered workspaces',
        longTermGoals: 'Launch a side project, get a promotion, read 50 books this year',
        dailyRhythm: 'My day is structured. I work in focused blocks, take scheduled breaks, and plan the next day every evening.'
    },
    {
        id: 'level-up-legend',
        name: 'The Lifelong Learner',
        description: "For those focused on continuous improvement and mastering new skills.",
        interests: "Online courses, documentaries, reading, practicing an instrument or language.",
        dislikes: "Stagnation, shallow knowledge, not having a new challenge.",
        longTermGoals: "Master a new skill, read a book every two weeks, complete a certification.",
        dailyRhythm: "I dedicate a specific block of time each day for learning, usually in the evening. Weekends are for deeper dives into projects."
    },
    {
        id: 'health-potion-hero',
        name: 'The Health Enthusiast',
        description: "Dedicated to fitness, nutrition, and optimizing physical and mental well-being.",
        interests: "Weightlifting, running, meal prep, mobility, wellness podcasts, mindfulness.",
        dislikes: "Junk food, skipping workouts, poor sleep.",
        longTermGoals: "Hit a new personal record in a lift or run, build a consistent nutrition plan, improve sleep quality.",
        dailyRhythm: "Morning workout, protein-focused meals throughout the day, active recovery like a walk in the evening, and a consistent wind-down routine for bed."
    },
    {
        id: 'silicon-sorcerer',
        name: 'The Tech Innovator',
        description: "Passionate about coding, building projects, and using technology to optimize life.",
        interests: "Coding, AI, startups, productivity apps, sci-fi novels, tinkering with hardware.",
        dislikes: "Inefficient code, slow internet, meetings that could have been an email.",
        longTermGoals: "Ship a side project, learn a new programming language, automate repetitive life tasks.",
        dailyRhythm: "Deep work blocks in the morning for coding, meetings in the afternoon, learning and tinkering at night."
    },
    {
        id: 'dedicated-student',
        name: 'The Dedicated Student',
        description: 'For students balancing coursework, exams, and a social life.',
        interests: 'Studying, reading, student clubs, part-time work, hanging out with friends',
        dislikes: 'All-nighters, procrastination, missing deadlines',
        longTermGoals: 'Ace my exams, finish my thesis, build a good study routine',
        dailyRhythm: 'I attend classes during the day, study in the evenings, and try to keep my weekends free for social activities.'
    },
    {
        id: 'home-organizer',
        name: 'The Home Organizer',
        description: 'For managing household chores, family schedules, and personal time.',
        interests: 'Cooking, gardening, home decor, family activities, reading',
        dislikes: 'Clutter, missed appointments, last-minute meal planning',
        longTermGoals: 'Create a smooth-running home, stick to a cleaning schedule, make more time for myself',
        dailyRhythm: 'Mornings are for getting the family ready. I handle chores and errands during the day and try to relax in the evening once everything is settled.'
    },
    {
        id: 'solo-entrepreneur',
        name: 'The Solo Entrepreneur',
        description: 'For freelancers and entrepreneurs juggling clients, projects, and business growth.',
        interests: 'Networking, business podcasts, learning new marketing skills, coffee',
        dislikes: 'Admin work, chasing invoices, burnout',
        longTermGoals: 'Grow my client base, increase my monthly revenue, achieve a better work-life balance',
        dailyRhythm: 'I structure my day in blocks. Client work in the morning, business development in the afternoon. I try to unplug completely after 6 PM.'
    }
];