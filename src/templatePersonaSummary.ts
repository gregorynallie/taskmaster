import { v4 as uuidv4 } from 'uuid';
import { AIPersonaSummary, Persona } from './types/userTypes';

export const getTemplatePersonaSummary = (persona: Persona): AIPersonaSummary => {
    const sourceText = `${persona.interests} ${persona.longTermGoals} ${persona.dailyRhythm || ''}`.toLowerCase();
    const themedPairs: Array<{ pattern: RegExp; label: string }> = [
        { pattern: /(learn|course|read|certification|study|skill)/, label: 'Learning' },
        { pattern: /(health|fitness|workout|run|sleep|wellness|nutrition)/, label: 'Health' },
        { pattern: /(code|coding|tech|project|startup|automation|ai)/, label: 'Technology' },
        { pattern: /(creative|art|design|music|writing|portfolio)/, label: 'Creativity' },
        { pattern: /(organize|productivity|focus|workflow|planning)/, label: 'Productivity' },
        { pattern: /(family|friend|social|home)/, label: 'Life Balance' },
    ];

    const keyThemes = themedPairs.filter(t => t.pattern.test(sourceText)).map(t => t.label);
    if (keyThemes.length < 3) {
        keyThemes.push('Consistency', 'Momentum', 'Sustainable Progress');
    }

    return {
        persona: `${persona.name} with a preference for practical, low-friction progress. They respond best to actionable tasks aligned to their stated goals and daily rhythm.`,
        keyThemes: Array.from(new Set(keyThemes)).slice(0, 5),
        suggestionStrategy: [
            'Prioritize one meaningful win early in the day rhythm.',
            'Prefer small, concrete steps over broad, abstract tasks.',
            'Balance progress tasks with at least one energizing task each day.',
        ],
        clarificationQuestions: [
            {
                id: `q-${uuidv4()}`,
                category: 'Goals',
                question: 'Which goal matters most for the next two weeks?',
                exampleAnswer: 'Finish one certification module and apply it in a mini-project.',
                options: ['Career progress', 'Health routine', 'Creative output', 'Life admin'],
            },
            {
                id: `q-${uuidv4()}`,
                category: 'Schedule',
                question: 'When is your most reliable focus window?',
                exampleAnswer: 'Weeknights around 8-10 PM after dinner.',
                options: ['Early morning', 'Late morning', 'Afternoon', 'Evening'],
            },
            {
                id: `q-${uuidv4()}`,
                category: 'Task Style',
                question: 'What task size keeps you consistent?',
                exampleAnswer: '20-30 minute tasks with clear finish lines.',
                options: ['5-10 min quick wins', '20-30 min focused', '45-60 min deep work', 'Mixed'],
            },
        ],
        lastUpdatedAt: new Date().toISOString(),
        status: 'current',
    };
};
