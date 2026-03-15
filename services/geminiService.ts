import { GoogleGenAI, Type } from "@google/genai";
import {
    UserProfile,
    AIPersonaSummary,
    ClarificationQuestion,
    AIInsight,
    CategoryFocus
} from '../src/types/userTypes';
import {
    Task,
    Quest,
    Suggestion,
    SuggestionFeedback,
    EnrichedTaskData,
    QuestSuggestionPayload,
} from '../src/types/taskTypes';
import { OnboardingAnswers } from "../src/types/onboardingTypes";
import { Mode, SuggestionPill, TimeOfDay } from '../src/types/uiTypes';
import { Placeholder } from '../src/types/contextTypes';
import { TASK_CATEGORIES } from "../constants";
import { v4 as uuidv4 } from 'uuid';

let ai: GoogleGenAI | null = null;

/**
 * Lazily initializes and returns the GoogleGenAI client instance.
 * This prevents initialization race conditions on first load.
 */
const getAiClient = (): GoogleGenAI => {
    // FIX: Per Gemini guidelines, a new instance should be created to ensure the latest API key is used, especially with aistudio key selection.
    ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai;
};

// --- Schemas for JSON responses ---

const enrichedTaskDataSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: 'A clear, actionable title for the task (e.g., "Schedule dentist appointment").' },
        description: { type: Type.STRING, description: 'A helpful, detailed description. If the task involves external resources or locations, provide useful context and, where appropriate, a search link in Markdown format. E.g., "Get hands-on instruction at the [HCC Tennis Center](https://www.google.com/search?q=HCC+Tennis+Center+Tampa+FL), they offer great beginner clinics on weekends." or "Watch a video to understand the basics: [Search YouTube for tennis rules](https://www.youtube.com/results?search_query=tennis+rules+for+beginners)"' },
        category: { type: Type.STRING, description: 'The best-fitting category for this task.', enum: TASK_CATEGORIES },
        subcategories: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 1-3 specific subcategories or tags (e.g., ["health", "appointment"]).' },
        duration_min: { type: Type.INTEGER, description: 'The estimated time in minutes to complete the task.' },
        difficulty: { type: Type.INTEGER, description: 'An estimated difficulty from 1 (very easy) to 5 (very hard).' },
        xp_estimate: { type: Type.INTEGER, description: 'An estimate of the experience points (XP) this task is worth, from 5 to 200, based on duration and difficulty.' },
        isHybrid: { type: Type.BOOLEAN, description: 'True if the task combines two categories in a creative way.' },
        hybridCategoryName: { type: Type.STRING, description: 'If isHybrid is true, provide a creative name for the combined category (e.g., "Productive Fun").' },
        deadline_at: { type: Type.STRING, description: 'An optional deadline in ISO 8601 format if the input implies one (e.g., "tomorrow EOD").' },
        scheduled_at: { type: Type.STRING, description: "If the suggestion is part of a project, or the user's input implies a schedule (e.g., 'tomorrow night'), set a logical, future-dated ISO 8601 timestamp. For projects, spread tasks out reasonably." },
        recurring: {
            type: Type.OBJECT,
            properties: {
                frequency: {
                    type: Type.STRING,
                    description: "The frequency of recurrence.",
                    enum: ['MINUTELY', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']
                },
                interval: {
                    type: Type.INTEGER,
                    description: "The interval for the frequency. E.g., for 'every 2 weeks', interval is 2 and frequency is 'WEEKLY'."
                },
                daysOfWeek: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING, enum: ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] },
                    description: "For 'WEEKLY' frequency, the days of the week the task recurs on. E.g., ['MO', 'WE', 'FR'] for Monday, Wednesday, Friday."
                },
                dayOfMonth: {
                    type: Type.INTEGER,
                    description: "For 'MONTHLY' frequency, the day of the month (1-31) the task recurs on."
                }
            },
            required: ['frequency', 'interval'],
            nullable: true,
            description: "Set for recurring tasks. For one-off tasks, this MUST be null. Examples: 'every day' -> {frequency: 'DAILY', interval: 1}. 'every other Monday' -> {frequency: 'WEEKLY', interval: 2, daysOfWeek: ['MO']}. 'monthly on the 15th' -> {frequency: 'MONTHLY', interval: 1, dayOfMonth: 15}."
        }
    },
    required: ['title', 'description', 'category', 'duration_min', 'xp_estimate']
};

const suggestionSchema = {
    type: Type.OBJECT,
    properties: {
        ...enrichedTaskDataSchema.properties,
        reasoning: { type: Type.STRING, description: 'A very short, punchy subtext explaining why this is suggested (2-4 words max).' },
        context_tag: { type: Type.STRING, description: 'A brief, user-facing tag explaining the context (e.g., "Based on your goal to learn piano").' },
        isProjectStarter: { type: Type.BOOLEAN, description: 'Set to TRUE only if this suggestion should create a new multi-step project.' },
        projectName: { type: Type.STRING, description: "If isProjectStarter is true, this is the name of the new project." },
        questNarrative: { type: Type.STRING, description: "A short, motivating narrative for the project." },
        subtasks: {
            type: Type.ARRAY,
            items: enrichedTaskDataSchema,
            description: "If isProjectStarter is true, provide 2-4 additional logical first steps for the project. These will be added as tasks. IMPORTANT: The main suggestion task should NOT be repeated here. These are the *next* steps. Intelligently spread their `scheduled_at` properties out over a reasonable future timeframe (e.g., a few days apart)."
        }
    },
    required: ['title', 'description', 'category', 'duration_min', 'xp_estimate', 'reasoning', 'context_tag']
};

const placeholderSchema = {
    type: Type.OBJECT,
    properties: {
        question: { type: Type.STRING, description: 'A short, engaging question for the input placeholder.' },
        example: { type: Type.STRING, description: 'A concrete, longer example of what a user might type in response to the question. Must start with "Example:".' },
        subtext: { type: Type.STRING, description: "A helpful, educational tip about what the app will do based on the example's syntax." }
    },
    required: ['question', 'example', 'subtext']
};

const pillSchema = {
    type: Type.OBJECT,
    properties: {
        emoji: { type: Type.STRING },
        label: { type: Type.STRING }
    },
    required: ['emoji', 'label']
};


// --- API Functions ---

const generateJson = async (prompt: string, schema: any) => {
    try {
        const response = await getAiClient().models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Failed to generate content from Gemini API.", error);
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const generateStarterTasksFromOnboarding = async (answers: OnboardingAnswers, mode: Mode): Promise<EnrichedTaskData[]> => {
    const prompt = `
    You are an AI life coach setting up a new user's account. Your goal is to create a 'wow moment' by generating a personalized starter pack of 6-8 tasks that are immediately useful, creative, and insightful, just like the "Explore" suggestions in the app.

    **CONTEXT:**
    - The current date is ${new Date().toISOString()}. All scheduled dates MUST be on or after this date.
    - App Mode: "${mode}". Use a slightly more engaging tone for "rpg" mode, but avoid overt fantasy language unless the user's answers suggest it.

    **User's Onboarding Answers (Synthesize ALL of this information):**
    - Daily Rhythm: "${answers.rhythm || 'Not specified'}"
    - Main Priorities: ${(answers.priorities || []).join(', ')}
    - Desired Daily/Weekly Habits: ${(answers.rhythm_habits || []).join(', ')}
    - Interests: ${(answers.interests || []).join(', ')}
    - Extra Notes from User: "${answers.notes || 'None'}"

    **CRITICAL INSTRUCTIONS ON TASK QUALITY:**
    Your primary goal is to generate tasks that are as useful and creative as the "Explore" suggestions in the app. This means EVERY task, whether it's a recurring habit or a one-off goal, must have a high-quality, actionable description.

    1.  **BE DIRECT & VALUABLE (FOR ALL TASKS):** The 'description' field MUST be immediately useful and provide direct value.
        -   **DO NOT** just describe the task (e.g., instead of "A task to help you stretch," write the actual stretch routine).
        -   **PROVIDE CONTENT:** For a routine, list the steps. For a topic, provide key bullet points. For a habit, give a 'pro-tip' on how to stick with it.
        -   **Example - "Stretch for 10 minutes":** A great description would be "A simple desk routine: 1. Neck Tilts (2 min), 2. Shoulder Rolls (2 min), 3. Torso Twists (2 min), 4. Wrist & Finger Stretches (2 min), 5. Standing Hamstring Stretch (2 min)."
        -   **Example - "Plan your next day":** A great description would be "Use the Ivy Lee Method: At the end of the day, write down the six most important things you need to accomplish tomorrow. Then, prioritize them."
        -   **Example - "Find a beginner recipe":** A great description would be "Find a beginner recipe for pasta aglio e olio, a simple and delicious starting point. [Search for recipes here](https://www.google.com/search?q=aglio+e+olio+recipe)."
        -   Use Markdown links for external resources where helpful.

    2.  **Generate 6-8 Tasks Total:** Create a thoughtful mix of foundational recurring habits and creative one-off tasks, all following the quality standard above.
        -   **Recurring Tasks (4-5 total):** Generate a mix of personalized habits (from their answers) and universal habits (like stretching, tidying, planning). Ensure their descriptions are highly actionable.
        -   **One-Off Tasks (2-3 total):** These should be exciting, actionable first steps towards their "Main Priorities", inspired by their "Interests".

    3.  **Smart & Correct Scheduling:**
        -   All \`scheduled_at\` timestamps MUST be in the future, based on the current date provided.
        -   Use the "Daily Rhythm" to schedule intelligently. For an "Early Bird," schedule important tasks for 9 AM. For a "Night Owl," schedule them for 8 PM. For "Flexible," spread them throughout the day. For one-off tasks scheduled for today, ensure the time is in the future.
    4.  **Recurring Logic:** Use the \`recurring\` field correctly. For one-off tasks, it MUST be null.
        -   Daily: \`{ "frequency": "DAILY", "interval": 1 }\`
        -   A task 3 times a week (e.g., Mon, Wed, Fri): \`{ "frequency": "WEEKLY", "interval": 1, "daysOfWeek": ["MO", "WE", "FR"] }\`
    5.  **FINAL OUTPUT FORMAT:** The final JSON array of task objects MUST be sorted chronologically by the \`scheduled_at\` property, from earliest to latest.
    `;
    
    try {
        const result = await generateJson(prompt, {
            type: Type.ARRAY,
            items: enrichedTaskDataSchema
        });
        if (!result || !Array.isArray(result) || result.length === 0) {
            throw new Error("Invalid response from Gemini for starter tasks");
        }
        return result;
    } catch (e) {
        console.error("generateStarterTasksFromOnboarding failed:", e);
        return []; // Return empty on failure
    }
};


export const getInitialPersonaContent = async (userProfile: UserProfile, mode: Mode): Promise<{
    task: { placeholders: Placeholder[] };
    explore: { placeholders: Placeholder[], pills: SuggestionPill[] };
    project: { placeholders: Placeholder[], pills: SuggestionPill[] };
}> => {
    const now = new Date();
    const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening';
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });

    const prompt = `
    You are an AI assistant for a task management app. Your job is to generate all the initial dynamic, personalized UI content for the user when the app loads. This includes placeholders and suggestion pills for three different contexts: "Task", "Explore", and "Project".

    **USER PROFILE (for personalization):**
    - Persona: ${userProfile.aiPersonaSummary?.persona}
    - Interests: ${userProfile.interests}
    - Long-term Goals: ${userProfile.longTermGoals}
    - Daily Rhythm: ${userProfile.dailyRhythm}
    - App Mode: ${mode}

    **CURRENT CONTEXT:**
    - Time of Day: ${timeOfDay}
    - Day of Week: ${dayOfWeek}

    **INSTRUCTIONS:**
    Generate a JSON object with three main keys: "task", "explore", and "project".

    1.  **For the "task" key:**
        -   Generate an array of 3 unique "placeholders" objects. These are for the main task input field. They should inspire small, actionable, daily tasks.
        -   Each placeholder object needs a "question", an "example", and a helpful "subtext" tip. The subtext MUST explain how the app parses the example (e.g., '...by Friday EOD' sets a deadline).

    2.  **For the "explore" key:**
        -   Generate an array of 3 unique "placeholders" objects. These are for the "Explore" page, to inspire discovery of new activities.
        -   Generate an array of 5-7 unique "pills" objects. These are short, clickable suggestion prompts for the "Explore" page.
        -   Each pill object needs an "emoji" and a short "label".

    3.  **For the "project" key:**
        -   Generate an array of 3 unique "placeholders" objects. These are for the "Projects" page, to inspire larger, multi-step goals.
        -   Generate an array of 5-7 unique "pills" objects. These are clickable project starter ideas.
        -   Each pill object needs an "emoji" and a short "label".

    Ensure all generated content is highly personalized to the user's profile and the current context. Be creative and diverse.
    The final output MUST be a single JSON object adhering to the specified schema.
    `;

    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            task: {
                type: Type.OBJECT,
                properties: {
                    placeholders: { type: Type.ARRAY, items: placeholderSchema }
                },
                required: ['placeholders']
            },
            explore: {
                type: Type.OBJECT,
                properties: {
                    placeholders: { type: Type.ARRAY, items: placeholderSchema },
                    pills: { type: Type.ARRAY, items: pillSchema }
                },
                required: ['placeholders', 'pills']
            },
            project: {
                type: Type.OBJECT,
                properties: {
                    placeholders: { type: Type.ARRAY, items: placeholderSchema },
                    pills: { type: Type.ARRAY, items: pillSchema }
                },
                required: ['placeholders', 'pills']
            }
        },
        required: ['task', 'explore', 'project']
    };

    try {
        const result = await generateJson(prompt, responseSchema);
        // Post-process to ensure subtext consistency
        const processPlaceholders = (placeholders: Placeholder[]) => {
            return placeholders.map(p => ({
                ...p,
                example: p.example.startsWith('Example: ') ? p.example : `Example: ${p.example}`,
                subtext: p.subtext.startsWith('💡') ? p.subtext : `💡 ${p.subtext}`
            }));
        };
        result.task.placeholders = processPlaceholders(result.task.placeholders);
        result.explore.placeholders = processPlaceholders(result.explore.placeholders);
        result.project.placeholders = processPlaceholders(result.project.placeholders);
        return result;

    } catch (e) {
        console.error("getInitialPersonaContent failed:", e);
        throw e; // Let the caller handle fallback
    }
};

export const getInitialExploreSuggestions = async (userProfile: UserProfile): Promise<Suggestion[]> => {
    const prompt = `
    You are an AI assistant for a task management app. Your job is to generate exactly 4 diverse and actionable "explore" suggestions for a user on page load.

    **USER PROFILE (for context and personalization):**
    - Persona: ${userProfile.aiPersonaSummary?.persona}
    - Interests: ${userProfile.interests}
    - Long-term Goals: ${userProfile.longTermGoals}

    **CRITICAL INSTRUCTIONS:**
    1.  **BE DIRECT & VALUABLE:** The 'description' MUST be immediately useful. Do not just describe the task, provide the content itself. For example, for a "15-minute mobility routine," the description should be the actual routine (e.g., "1. Cat-Cow (2 min) 2. Downward Dog (2 min) 3. Hip Circles (2 min/side)..."). For "Learn about a historical event," provide 3-5 fascinating bullet points about it. Keep descriptions under 40 words.
    2.  **CONCISE REASONING:** The 'reasoning' (which acts as subtext) must be very short (2-4 words) and punchy.
    3.  **DIVERSITY:** Provide three suggestions from different categories (e.g., one Health, one Personal Growth, one Fun).
    4.  **OUTPUT FORMAT:** The final output MUST be a JSON array of 4 suggestion objects.
    `;

    try {
        const result = await generateJson(prompt, {
            type: Type.ARRAY,
            items: suggestionSchema
        });
        if (!result || !Array.isArray(result) || result.length === 0) {
            throw new Error("Invalid response from Gemini for initial suggestions");
        }
        return result;
    } catch (e) {
        console.error("getInitialExploreSuggestions failed:", e);
        return []; // Return empty on failure
    }
};

export const getDynamicSuggestions = async (options: {
    prompt: string;
    userProfile: UserProfile;
    count: number;
    filters?: { duration?: string | null; categories?: string[] };
}): Promise<Suggestion[]> => {
    const { prompt, userProfile, count, filters } = options;
    const now = new Date();
    const nowISO = now.toISOString();
    
    // Set dates for the example. Be careful not to mutate the same Date object.
    const futureDate1 = new Date(now.getTime());
    futureDate1.setDate(futureDate1.getDate() + 2);
    const futureDate1ISO = futureDate1.toISOString();
    
    const futureDate2 = new Date(now.getTime());
    futureDate2.setDate(futureDate2.getDate() + 7);
    const futureDate2ISO = futureDate2.toISOString();

    const fullPrompt = `
    You are an AI assistant for a task management app. Your job is to analyze a user's prompt and generate a list of ${count} relevant, actionable suggestions.

    **Current Date:** ${nowISO}

    **USER PROFILE (for context and personalization):**
    - Persona: ${userProfile.aiPersonaSummary?.persona}
    - Interests: ${userProfile.interests}
    - Long-term Goals: ${userProfile.longTermGoals}
    - Assumed Location: Tampa, FL, USA

    **USER PROMPT:** "${prompt}"

    **CRITICAL INSTRUCTIONS:**
    1.  **INTERPRET INTENT:** Analyze the user's prompt. Are they asking for a simple task, a recurring habit, or a large multi-step goal?
    2.  **GENERATE A MIX:** Provide a variety of suggestions.
        - **If the prompt is a large goal (e.g., "learn to play tennis"):** At least ONE suggestion MUST be a "Project Starter". Set \`isProjectStarter\` to true, provide a \`projectName\`, a \`questNarrative\`, and generate 2-4 logical \`subtasks\`. The main suggestion should be the very first step. Intelligently schedule the subtasks by setting their \`scheduled_at\` properties spread out over a reasonable timeframe (e.g., a few days apart, starting from the current date).
        - **If the prompt is for a habit (e.g., "exercise more"):** At least ONE suggestion should be a recurring task. Populate the \`recurring\` field.
    3.  **BE DIRECT & VALUABLE:** The 'description' MUST be immediately useful and concise (under 40 words). Do not just describe the task, provide the content itself. For a routine, list the steps. For a topic, provide key bullet points. For a local activity, find a specific venue in Tampa, FL, and provide a useful tip. Use Markdown for links where appropriate.
    4.  **CONCISE REASONING:** The 'reasoning' (which acts as subtext) must be very short (2-4 words) and punchy.
    5.  **APPLY FILTERS:** If filters are provided, all suggestions must adhere to them. Filters: ${JSON.stringify(filters || {}, null, 2)}
    6.  **OUTPUT FORMAT:** The final output MUST be a JSON array of ${count} suggestion objects.

    **EXAMPLE for prompt "learn tennis":**
    [
      {
        "isProjectStarter": true,
        "projectName": "Become a Tennis Ace",
        "questNarrative": "From basics to your first match.",
        "title": "Learn the Rules & Scoring",
        "description": "Key points: Love-15-30-40, Deuce at 40-40, win by 2. Best of 3 or 5 sets. [Watch a 5-min guide](https://www.youtube.com/results?search_query=tennis+rules+in+5+minutes).",
        "category": "Personal Growth", "duration_min": 20, "xp_estimate": 30, "reasoning": "Essential first step.", "context_tag": "Project Starter",
        "subtasks": [
          { "title": "Find a Beginner Racket", "description": "Look for a racket with a large head size (100+ sq. in.). The Head TI S6 or Wilson Hyper Hammer are popular choices. [Search for local sports stores](https://www.google.com/search?q=sports+stores+Tampa+FL).", "category": "Productivity", "duration_min": 45, "xp_estimate": 40, "scheduled_at": "${futureDate1ISO}" },
          { "title": "Book a lesson at HCC Tennis Center", "description": "Located at 3901 W Tampa Bay Blvd, they have great beginner clinics on weekends. Call to reserve a spot.", "category": "Health", "duration_min": 90, "xp_estimate": 120, "scheduled_at": "${futureDate2ISO}" }
        ]
      }
    ]
    `;

    try {
        const result = await generateJson(fullPrompt, {
            type: Type.ARRAY,
            items: suggestionSchema
        });
        if (!result || !Array.isArray(result) || result.length === 0) {
            throw new Error("Invalid response from Gemini");
        }
        return result;
    } catch (e) {
        console.error("getDynamicSuggestions failed:", e);
        throw e;
    }
};

export const getParsingSubtext = async (
    taskInput: string,
    userProfile: UserProfile
): Promise<string> => {
    if (!taskInput || taskInput.trim().length < 4) {
        return "";
    }
    const prompt = `
    You are an AI assistant for a task management app. Your job is to analyze a user's raw text input and generate a single, short, helpful "subtext" string explaining how the app will parse it. The subtext should ALWAYS start with "💡 Tip: ".

    **USER INPUT:** "${taskInput}"

    **CRITICAL INSTRUCTIONS:**
    1.  **Analyze the Input:** Look for patterns like multiple tasks (e.g., separated by commas, 'and', or new lines), recurring patterns (e.g., 'every day', 'on Tuesdays', 'weekly'), or specific dates/times (e.g., 'tomorrow at 6pm', 'by Friday EOD').
    2.  **Generate a Two-Part Subtext:**
        *   **Part 1 (What I'll do):** Start with a clear statement about the action the app will take.
        *   **Part 2 (How to change it):** Briefly explain how the user could modify their input to get a different result. This teaches them the syntax.
        *   Keep the total subtext under 20 words.
    3.  **Output Format:** The final output MUST be a single JSON object with one key: "subtext". If no special parsing is detected, the value should be an empty string.

    **EXAMPLES:**
    - Input: "Buy milk, walk the dog" -> Output: { "subtext": "💡 Tip: I'll create 2 tasks. To create one, try 'and' instead of a comma." }
    - Input: "Water the plants every day" -> Output: { "subtext": "💡 Tip: I'll create a recurring daily task. For a one-time task, just say 'Water the plants'." }
    - Input: "Finish the report by tomorrow EOD" -> Output: { "subtext": "💡 Tip: I'll schedule this for tomorrow. To just add it to your list, remove the date." }
    - Input: "Clean my room" -> Output: { "subtext": "" }
    `;

    try {
        const result = await generateJson(prompt, {
            type: Type.OBJECT,
            properties: {
                subtext: { type: Type.STRING, description: 'A short, two-part tip about how the app will parse the input. Starts with "💡 Tip: ". Returns an empty string if no special parsing is detected.' }
            },
            required: ['subtext']
        });
        return result.subtext || "";
    } catch (e) {
        console.error("getParsingSubtext failed:", e);
        return ""; // Return empty string on failure
    }
};

export const getQuestTaskAlternate = async (
    quest: Quest,
    taskToReplace: Task,
    allQuestTasks: Task[]
): Promise<Suggestion | null> => {
    const prompt = `
    A user is working on a project ("Quest") and wants an alternative for a specific task.
    
    **QUEST:**
    - Name: "${quest.name}"
    - Narrative: "${quest.narrative}"
    
    **ALL TASKS IN QUEST:**
    ${allQuestTasks.map(t => `- ${t.title} (${t.completed_at ? 'Completed' : 'Pending'})`).join('\n')}
    
    **TASK TO REPLACE:**
    - Title: "${taskToReplace.title}"
    - Description: "${taskToReplace.description}"
    
    **TASK:**
    Generate ONE creative and logical alternative task that still helps achieve the overall quest goal but replaces the one specified. The new task should be different but comparable in scope.
    The output must be a single JSON object.
    `;

    try {
        return await generateJson(prompt, suggestionSchema);
    } catch (e) {
        return null;
    }
};

export const enrichTaskWithAI = async (
    taskInput: string,
    userProfile: UserProfile
): Promise<EnrichedTaskData[]> => {
    const now = new Date();
    const nowISO = now.toISOString();

    const prompt = `
    Analyze the user task input and enrich it with structured data. The input may contain multiple tasks.
    
    **CONTEXT:**
    - Current Date and Time (ISO): ${nowISO}
    - Current Day of the Week: ${new Date().toLocaleDateString('en-US', { weekday: 'long' })}

    User Profile for context:
    - Interests: ${userProfile.interests}
    - Dislikes: ${userProfile.dislikes}
    - Long-term Goals: ${userProfile.longTermGoals}
    - Daily Rhythm: ${userProfile.dailyRhythm}

    User Input: "${taskInput}"

    **Instructions:**
    1.  Break down the input into one or more distinct tasks. For each task, provide the structured data.
    2.  **CRITICAL Date/Time Parsing:**
        -   Analyze the input for any date or time information (e.g., 'tomorrow', 'Friday', 'at 6pm', 'in 2 days', 'next week').
        -   Based *only* on the **Current Date and Time** provided above, calculate the *exact* future ISO 8601 timestamp for 'scheduled_at' or 'deadline_at'.
        -   **'Tomorrow' means exactly one calendar day after the Current Date.** For example, if today is Thursday, 'tomorrow' is Friday.
        -   If a time is given (e.g., '6pm'), use it. If not, use a sensible default (e.g., 9 AM for morning tasks, 7 PM for evening tasks).
        -   If no date/time is mentioned, do not set 'scheduled_at' or 'deadline_at'.
    3.  **Recurring Tasks:** If the input implies a recurring task (e.g., 'water the plants every day'), extract the pattern into the 'recurring' field. For one-off tasks, this field MUST be null.
    4.  If the input is a single task, return an array with one object. If it's multiple (e.g., "buy milk, walk the dog"), return an array of objects.
    
    IMPORTANT: The final output MUST be an array of JSON objects, even if there is only one task.
    `;

    const createFallback = (message: string): EnrichedTaskData[] => [{
        title: taskInput,
        description: message,
        category: 'Productivity',
        duration_min: 15,
        xp_estimate: 20,
        original_input: taskInput,
    }];

    try {
        const result = await generateJson(prompt, {
            type: Type.ARRAY,
            items: enrichedTaskDataSchema
        });

        if (!result || !Array.isArray(result) || result.length === 0) {
            console.warn("Gemini returned empty or invalid data for task enrichment. Falling back.");
            return createFallback(''); // Return with empty description if just empty.
        }
        
        return result.map((item: any) => ({ ...item, original_input: taskInput }));
    } catch (error) {
        console.error("enrichTaskWithAI failed, creating fallback task data:", error);
        return createFallback('Could not get AI details. You can edit this task manually.');
    }
};

export const createQuestFromGoal = async (
    goal: string,
    userProfile: UserProfile
): Promise<{ name: string; narrative: string; tasks: EnrichedTaskData[] }> => {
    const now = new Date();
    const todayISO = now.toISOString();
    
    // Set dates for the example. Be careful not to mutate the same Date object.
    const futureDate1 = new Date(now.getTime());
    futureDate1.setDate(futureDate1.getDate() + 3);
    const futureDate1ISO = futureDate1.toISOString();

    const futureDate2 = new Date(now.getTime());
    futureDate2.setDate(futureDate2.getDate() + 7);
    const futureDate2ISO = futureDate2.toISOString();

    const prompt = `
    A user wants to achieve a major goal. Break it down into a "Quest" with a name, a short, motivating narrative, and a series of 3-7 actionable tasks.

    **Current Date:** ${todayISO}

    **User Profile for context:**
    - Interests: ${userProfile.interests}
    - Long-term Goals: ${userProfile.longTermGoals}

    **User's Goal:** "${goal}"

    **Instructions:**
    1.  **Quest Name**: Create a concise, inspiring name for the quest based on the goal.
    2.  **Narrative**: Write a short (1-2 sentences) narrative to frame the quest and motivate the user.
    3.  **Tasks**: Generate 3-7 distinct, actionable tasks that represent the first steps to achieving the goal.
    4.  **Task Scheduling**: Intelligently spread the \`scheduled_at\` properties for each task out over a reasonable future timeframe (e.g., a few days apart, starting from the current date). The first task can be scheduled for today.

    **CRITICAL INSTRUCTION ON TASK QUALITY:**
    For every task you generate for this quest, the 'description' field MUST be immediately useful and provide direct value. Model the quality of these tasks after high-quality 'Explore' suggestions.
    -   **DO NOT** just describe the task; provide helpful content, a specific first step, an example, or a resource link.
    -   **Example - Task "Learn Music Theory Basics":** A great description would be "Start with the C Major scale and basic chords. [Watch a 10-minute intro video](https://www.youtube.com/results?search_query=music+theory+basics)."
    -   **Example - Task "Do a 15-minute workout":** A great description would be "Try this simple full-body routine: 1. Jumping Jacks (2 min), 2. Bodyweight Squats (3 sets of 10), 3. Push-ups (3 sets to failure), 4. Plank (3 sets, 30s hold)."

    **Example Output for goal "Learn to bake bread":**
    {
      "name": "Master Sourdough Baking",
      "narrative": "From starter to loaf, embark on a journey to bake delicious sourdough bread from scratch.",
      "tasks": [
        {
          "title": "Create a sourdough starter",
          "description": "Combine flour and water and begin the week-long process of daily feedings to cultivate wild yeast. [Find a simple guide here](https://www.google.com/search?q=how+to+make+sourdough+starter).",
          "category": "Home",
          "duration_min": 15,
          "xp_estimate": 30,
          "scheduled_at": "${todayISO}"
        },
        {
          "title": "Research basic baking equipment",
          "description": "Identify essential tools like a Dutch oven, digital scale, and bench scraper. You don't need everything to start.",
          "category": "Productivity",
          "duration_min": 30,
          "xp_estimate": 25,
          "scheduled_at": "${futureDate1ISO}"
        },
        {
          "title": "Bake your first 'no-knead' loaf",
          "description": "Follow a simple no-knead bread recipe to understand the basics of fermentation and baking.",
          "category": "Home",
          "duration_min": 120,
          "xp_estimate": 100,
          "scheduled_at": "${futureDate2ISO}"
        }
      ]
    }

    Return the result as a single JSON object.
    `;

    return await generateJson(prompt, {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            narrative: { type: Type.STRING },
            tasks: {
                type: Type.ARRAY,
                items: enrichedTaskDataSchema
            }
        },
        required: ['name', 'narrative', 'tasks']
    });
};

export const getSuggestions = async (options: {
    tasks: Task[],
    quests: Quest[],
    mode: Mode,
    feedback: SuggestionFeedback[],
    categoryFocus: CategoryFocus,
    count: number,
    userProfile: UserProfile,
    duration?: string,
    categories?: string[]
}, thinkingBudget?: number): Promise<Suggestion[]> => {
    const { userProfile, tasks, quests, feedback, categoryFocus, count, mode, ...filters } = options;

    const prompt = `
    You are a brilliant AI life coach. Your goal is to suggest ${count} highly relevant and actionable tasks for a user.

    MANDATES:
    1.  **BREAK THE LOOP**: Your biggest failure is being repetitive. Do NOT suggest tasks the user has recently seen or done. Do NOT get stuck on their primary interest. For example, for a "Gamer" persona, do not just suggest "Play a game" or "Clean your keyboard." Good suggestions are expansive: "Watch a documentary on game design," "Try a short yoga routine for posture," "Organize your digital files."
    2.  **VARIETY & CREATIVITY**: Ensure the ${count} suggestions are from different life categories (Productivity, Health, Fun, etc.). They must be creative and personalized.
    3.  **SERENDIPITY RULE**: Include at least one "discovery" task. This should be a suggestion that expands the user's horizons, related to their interests but introducing something new (e.g., a podcast, a new skill, a local event).
    4.  **HOLISTIC BALANCE**: Balance the triad of life: Productivity (work, goals), Well-being (health, home), and Play (hobbies, social). Frame necessary tasks (like chores) in a way that supports their main goals (e.g., "A clean desk helps you focus on your game").
    5.  **HABIT BUILDING**: Sometimes, suggest tasks that help build habits by making them recurring. For example, 'Practice guitar daily' or 'Weekly review every Friday'. When suggesting a recurring task, populate the 'recurring' field with the structured object. Examples: 'daily' -> { "frequency": "DAILY", "interval": 1 }. 'weekly on Friday' -> { "frequency": "WEEKLY", "interval": 1, "daysOfWeek": ["FR"] }. For one-off tasks, this field MUST be null.

    USER PROFILE:
    - Interests: ${userProfile.interests}
    - Dislikes: ${userProfile.dislikes}
    - Long-term Goals: ${userProfile.longTermGoals}
    - Daily Rhythm: ${userProfile.dailyRhythm}
    - Persona Summary: ${userProfile.aiPersonaSummary?.persona}

    CURRENT CONTEXT:
    - Current Active Tasks: ${tasks.filter(t => !t.completed_at).map(t => t.title).join(', ')}
    - Active Quests: ${quests.filter(q => q.status === 'in_progress').map(q => q.name).join(', ')}
    - Recent feedback on suggestions: ${feedback.map(f => `"${f.suggestionTitle}" was rejected as ${f.reason}`).join('; ')}
    - User's desired focus: More of ${Object.entries(categoryFocus).filter(([,v]) => v === 'more').map(([k]) => k).join(', ') || 'None'}. Less of ${Object.entries(categoryFocus).filter(([,v]) => v === 'less').map(([k]) => k).join(', ') || 'None'}.

    FILTERS:
    ${JSON.stringify(filters, null, 2)}
    
    TASK: Generate ${count} diverse and personalized task suggestions.
    - Each suggestion must be a JSON object adhering to the schema.
    - **Reasoning is critical**: Explain *why* you're suggesting it in a concise, user-facing way.
    - **Context Tag is critical**: Provide a very short tag for where the idea came from (e.g., "From your 'Learn Piano' goal").
    - Avoid suggesting tasks similar to ones already on their active list.
    - Tailor the tone to the app mode: "${mode}".
    - The output MUST be a JSON array of ${count} suggestion objects.
    `;

    try {
        const response = await getAiClient().models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: { type: Type.ARRAY, items: suggestionSchema },
                ...(thinkingBudget !== undefined && { thinkingConfig: { thinkingBudget } })
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        throw new Error("Failed to generate content from Gemini API.");
    }
};

export const getInContextSuggestion = async (context: {
    taskAbove?: Task;
    taskBelow?: Task;
    tasksForDay: Task[];
    sortBy: string;
    groupBy: string;
}): Promise<Suggestion | null> => {
    const { taskAbove, taskBelow, tasksForDay } = context;

    let insertionContextPrompt = '';
    if (taskAbove && taskBelow) {
        insertionContextPrompt = `The user wants to add a task that logically fits **between** two existing tasks.
- Task Above: "${taskAbove.title}" (Description: ${taskAbove.description})
- Task Below: "${taskBelow.title}" (Description: ${taskBelow.description})
Your goal is to suggest a "bridge" task that smoothly connects the two. It could be something that needs to be done after the first task but before the second. Be creative. For example, if the tasks are "Workout" and "Shower", a good bridge might be "Stretch for 10 minutes".`;
    } else if (taskBelow) {
        insertionContextPrompt = `The user wants to add a task **before** a specific task.
- The very next task is: "${taskBelow.title}" (Description: ${taskBelow.description})
Your goal is to suggest a "preparatory" task. This should be something that makes the next task easier or possible. For example, if the next task is "Cook dinner", a good preparatory task would be "Go grocery shopping". Do NOT suggest a bridge task.`;
    } else if (taskAbove) {
        insertionContextPrompt = `The user wants to add a task **after** a specific task.
- The previous task was: "${taskAbove.title}" (Description: ${taskAbove.description})
Your goal is to suggest a logical "follow-up" or "wrap-up" task. This should be something that concludes or logically follows the previous one. For example, if the previous task was "Write blog post", a good follow-up would be "Share blog post on social media". Do NOT suggest a bridge task.`;
    } else {
        // Fallback for an empty list, though this should be handled by the main suggestion component.
        return null;
    }

     const prompt = `
    Given the context of a user's task list, generate a single, highly relevant task suggestion to be inserted.
    
    CONTEXT:
    ${insertionContextPrompt}
    - Other tasks for the day: ${tasksForDay.map((t: Task) => t.title).join(', ')}
    
    TASK: Generate ONE task suggestion that logically fits the described position. The reasoning should be very short and explain the logical connection. The output must be a single JSON object.
    `;

    try {
        const response = await getAiClient().models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
                thinkingConfig: { thinkingBudget: 0 } // Always fast for inline suggestions
            }
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        return null;
    }
};

export const synthesizeAIInsights = async (userProfile: UserProfile, tasks: Task[]): Promise<AIInsight[]> => {
    const completedTasks = tasks.filter(t => t.completed_at).slice(-20); // Last 20 completed
    if (completedTasks.length < 5) return [];

    const prompt = `
    Analyze the user's profile and their recently completed tasks to find 1-2 non-obvious, actionable insights about their productivity, habits, or preferences.
    
    USER PROFILE:
    - Interests: ${userProfile.interests}
    - Dislikes: ${userProfile.dislikes}
    - Long-term Goals: ${userProfile.longTermGoals}
    - Persona Summary: ${userProfile.aiPersonaSummary?.persona}
    
    RECENTLY COMPLETED TASKS:
    ${completedTasks.map(t => `- "${t.title}" (Category: ${t.category}, Duration: ${t.duration_min}min)`).join('\n')}
    
    EXISTING INSIGHTS (to avoid duplicates):
    ${userProfile.aiInsights.map(i => `- ${i.insight}`).join('\n')}

    TASK:
    - Generate 1-2 novel insights.
    - An insight should be a short observation, like "You tend to complete 'Health' tasks in the morning." or "You often tackle creative tasks in short bursts."
    - Do not give advice, just the observation.
    - The output must be a JSON array of insight objects.
    `;

    const insights = await generateJson(prompt, {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                insight: { type: Type.STRING },
                source: { type: Type.STRING, description: "e.g., 'Task completion times'" },
                confidence: { type: Type.NUMBER, description: "From 0.0 to 1.0" }
            },
            required: ['insight', 'source', 'confidence']
        }
    });
    
    return insights.map((i: any) => ({ ...i, id: `insight-${uuidv4()}`, status: 'pending' }));
};

export const synthesizeUserProfileIntoPersona = async (userProfile: UserProfile, correctiveFeedback?: string): Promise<AIPersonaSummary | null> => {
    const prompt = `
    Synthesize the user's profile information into a coherent persona summary. Also, generate 3 clarifying questions to help refine the persona.

    USER PROFILE:
    - Interests: ${userProfile.interests}
    - Dislikes: ${userProfile.dislikes}
    - Long-term Goals: ${userProfile.longTermGoals}
    - Daily Rhythm: ${userProfile.dailyRhythm}
    - Accepted Insights: ${userProfile.aiInsights.filter(i => i.status === 'accepted').map(i => i.insight).join('; ')}

    ${correctiveFeedback ? `PREVIOUS ATTEMPT FEEDBACK: "${correctiveFeedback}"` : ''}

    TASK:
    1.  **persona**: Write a 2-3 sentence summary of who this person is, their motivations, and style.
    2.  **keyThemes**: Extract 3-5 key themes or topics from their profile (e.g., "Creative Writing", "Fitness", "Game Development").
    3.  **suggestionStrategy**: Describe in 2-3 bullet points the best strategy for suggesting tasks to this person (e.g., "Focus on breaking down large creative goals", "Suggest short, high-energy tasks in the morning").
    4.  **clarificationQuestions**: Generate 3 open-ended questions for the user that would help you understand them even better. Each question should have a category, the question text, and an example answer. Do not ask questions that are already answered in the profile.

    The output must be a single JSON object.
    `;
    try {
        const result: Omit<AIPersonaSummary, 'lastUpdatedAt'> = await generateJson(prompt, {
            type: Type.OBJECT,
            properties: {
                persona: { type: Type.STRING },
                keyThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestionStrategy: { type: Type.ARRAY, items: { type: Type.STRING } },
                clarificationQuestions: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING },
                            question: { type: Type.STRING },
                            exampleAnswer: { type: Type.STRING }
                        },
                        required: ['category', 'question']
                    }
                }
            },
            required: ['persona', 'keyThemes', 'suggestionStrategy', 'clarificationQuestions']
        });
        
        // Add IDs to questions client-side
        const questionsWithIds = result.clarificationQuestions.map(q => ({...q, id: `q-${uuidv4()}`}));

        return { ...result, clarificationQuestions: questionsWithIds, lastUpdatedAt: new Date().toISOString() };
    } catch (e) {
        return null;
    }
};

export const getNewClarificationQuestion = async (
    userProfile: UserProfile,
    existingQuestions: { question: string }[],
    options?: { category?: string; excludedCategories?: string[] }
): Promise<Partial<ClarificationQuestion> | null> => {
    const prompt = `
    Generate a single, new clarification question for a user to better understand their preferences.
    
    USER PROFILE:
    - Interests: ${userProfile.interests}
    - Dislikes: ${userProfile.dislikes}
    - Long-term Goals: ${userProfile.longTermGoals}

    EXISTING QUESTIONS (do not repeat these):
    ${existingQuestions.map(q => `- ${q.question}`).join('\n')}

    CONSTRAINTS:
    ${options?.category ? `- The question must be in the category: "${options.category}"` : ''}
    ${options?.excludedCategories ? `- The question must NOT be in any of these categories: ${options.excludedCategories.join(', ')}` : ''}

    TASK:
    Return a single JSON object with a "category", "question", "exampleAnswer", and "options" (an array of 3-4 short, clickable answer suggestions).
    `;
    try {
        return await generateJson(prompt, {
            type: Type.OBJECT,
            properties: {
                category: { type: Type.STRING },
                question: { type: Type.STRING },
                exampleAnswer: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['category', 'question']
        });
    } catch (e) {
        return null;
    }
};

export const getNewQuestionOptions = async (
    userProfile: UserProfile,
    question: string,
    existingOptions: string[]
): Promise<string[] | null> => {
    const prompt = `
    For the given question and user profile, generate 4 new, diverse, and clickable single-word or short-phrase answer options.
    
    USER PROFILE:
    - Interests: ${userProfile.interests}
    - Dislikes: ${userProfile.dislikes}
    
    QUESTION: "${question}"

    EXISTING OPTIONS TO AVOID: ${existingOptions.join(', ')}

    TASK: Return a JSON array of 4 new string options.
    `;

    try {
        return await generateJson(prompt, {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        });
    } catch (e) {
        return null;
    }
};