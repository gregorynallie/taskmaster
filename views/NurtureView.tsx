import React, { useMemo, useState } from 'react';
import { useNurture } from '../contexts/NurtureProvider';
import { useSettings } from '../contexts/SettingsProvider';
import { NurtureMood, NurtureTimeOfDay, NurtureUnlockKey } from '../types';

const moodOrder: NurtureMood[] = ['Curious', 'Cozy', 'Energized', 'Restless', 'Lonely', 'Inspired', 'Overworked', 'Wistful', 'Glowing'];
const unlockOrder: NurtureUnlockKey[] = ['gym_corner', 'creative_desk', 'social_corner', 'window_view', 'bookshelf', 'growing_plant', 'reading_lamp'];

const habitatClass = (timeOfDay: NurtureTimeOfDay): string => {
    if (timeOfDay === 'morning') return 'from-yellow-100/20 to-orange-200/20';
    if (timeOfDay === 'afternoon') return 'from-sky-200/20 to-cyan-200/20';
    if (timeOfDay === 'evening') return 'from-amber-300/20 to-purple-400/20';
    return 'from-slate-700/30 to-indigo-900/40';
};

const categoryColor = (category: string): string => {
    const normalized = category.toLowerCase();
    if (normalized.includes('health')) return '#22c55e';
    if (normalized.includes('product')) return '#3b82f6';
    if (normalized.includes('creative') || normalized.includes('art')) return '#a855f7';
    if (normalized.includes('social')) return '#f59e0b';
    if (normalized.includes('fun')) return '#ec4899';
    return '#94a3b8';
};

const moodEmoji = (mood: NurtureMood): string => {
    const map: Record<NurtureMood, string> = {
        Curious: '🙂',
        Cozy: '😊',
        Energized: '⚡',
        Restless: '😵',
        Lonely: '🥺',
        Inspired: '🎨',
        Overworked: '😮‍💨',
        Wistful: '😶',
        Glowing: '✨',
    };
    return map[mood];
};

export const NurtureView: React.FC = () => {
    const {
        state,
        currentMood,
        appearance,
        behaviors,
        streakDays,
        weeklyCategoryBalance,
        activeGifts,
        habitatTimeOfDay,
        nextUnlockHint,
        setupPet,
        setMoodOverride,
        setTimeOverride,
        markLettersRead,
        clearLetters,
        grantUnlock,
        forceGenerateLetter,
        resetNurtureState,
    } = useNurture();
    const { showSpoofedTasks } = useSettings();

    const [petNameInput, setPetNameInput] = useState(state.petName || '');
    const [isLettersOpen, setIsLettersOpen] = useState(false);
    const [previewLetter, setPreviewLetter] = useState<string | null>(null);
    const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
    const [petThought, setPetThought] = useState<string>('');
    const [isDebugOpen, setIsDebugOpen] = useState(false);

    React.useEffect(() => {
        markLettersRead();
    }, [markLettersRead]);

    const total = useMemo(() => Object.values(weeklyCategoryBalance).reduce((a, b) => a + b, 0), [weeklyCategoryBalance]);

    const thoughtPool = useMemo<Record<NurtureMood, string[]>>(() => ({
        Curious: ['I wonder what today will feel like.', 'I saved a cozy spot for you.', 'I am paying attention.'],
        Cozy: ['This place feels warm lately.', 'I like our rhythm.', 'You make this room feel alive.'],
        Energized: ['I am ready to move!', 'You have been on a roll.', 'Can you feel the momentum?'],
        Restless: ['We should stretch a little.', 'My paws are pacing again.', 'Maybe a lighter moment soon?'],
        Lonely: ['I keep looking toward the door.', 'It has been a little quiet.', 'I still like waiting here for you.'],
        Inspired: ['I found a new color today.', 'I have ideas all over the walls.', 'This room feels creative.'],
        Overworked: ['You are carrying a lot right now.', 'I made tea for us.', 'You can slow down and still make progress.'],
        Wistful: ['I miss our little wins.', 'No pressure. I am still here.', 'We can begin again anytime.'],
        Glowing: ['Look what we unlocked!', 'I made you something special.', 'Today feels bright.'],
    }), []);

    const tapPet = () => {
        const pool = thoughtPool[currentMood];
        const thought = pool[Math.floor(Math.random() * pool.length)];
        setPetThought(thought);
        window.setTimeout(() => setPetThought(''), 1800);
    };

    const handleSetup = () => {
        const name = petNameInput.trim();
        if (!name) return;
        setupPet(name);
    };

    const handleGeneratePreview = async () => {
        setIsGeneratingPreview(true);
        try {
            const text = await forceGenerateLetter(false);
            setPreviewLetter(text);
        } finally {
            setIsGeneratingPreview(false);
        }
    };

    const commitPreview = async () => {
        if (!previewLetter) return;
        await forceGenerateLetter(true);
        setPreviewLetter(null);
    };

    if (!state.setupComplete) {
        return (
            <div className="animate-themed-enter max-w-2xl mx-auto">
                <div className="bg-surface p-6 rounded-themed shadow-themed">
                    <h2 className="text-3xl font-bold text-text-primary font-header mb-3">Nurture Mode</h2>
                    <p className="text-text-secondary mb-2">A small companion lives here and reflects your patterns over time.</p>
                    <p className="text-text-secondary mb-6">No pressure, no punishment, just a warm mirror of your progress and rhythms.</p>
                    <label className="block text-sm text-text-secondary mb-2" htmlFor="pet-name">Name your pet</label>
                    <div className="flex gap-3">
                        <input
                            id="pet-name"
                            value={petNameInput}
                            onChange={(e) => setPetNameInput(e.target.value)}
                            className="flex-1 bg-bkg border border-secondary rounded-themed p-3 text-text-primary"
                            placeholder="e.g. Mochi"
                            maxLength={24}
                        />
                        <button
                            onClick={handleSetup}
                            className="bg-primary hover:bg-primary-focus text-white font-semibold px-5 py-3 rounded-themed"
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-themed-enter max-w-4xl mx-auto space-y-4">
            <div className="bg-surface p-4 rounded-themed shadow-themed flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary font-header">
                    {state.petName || 'Mochi'} · {currentMood}
                </h2>
                <button
                    onClick={() => {
                        setIsLettersOpen(prev => !prev);
                        markLettersRead();
                    }}
                    className="bg-secondary/60 hover:bg-secondary px-4 py-2 rounded-themed text-sm font-semibold"
                >
                    Letters
                </button>
            </div>

            <div className={`relative rounded-themed p-6 min-h-[360px] bg-gradient-to-br ${habitatClass(habitatTimeOfDay)} border border-secondary shadow-themed overflow-hidden`}>
                <div className="absolute top-3 right-3 text-xs text-text-secondary uppercase tracking-wide">{habitatTimeOfDay}</div>
                <div className="absolute inset-x-0 bottom-0 h-16 bg-black/10"></div>
                <button
                    onClick={tapPet}
                    className="absolute left-8 bottom-16 text-6xl transition-transform hover:scale-105"
                    aria-label="Pet"
                >
                    {moodEmoji(currentMood)}
                </button>
                {petThought && (
                    <div className="absolute left-24 bottom-36 bg-surface/90 border border-secondary rounded-themed px-3 py-2 text-sm text-text-primary animate-themed-enter">
                        {petThought}
                    </div>
                )}

                <div className="absolute right-6 bottom-12 grid grid-cols-2 gap-2 text-xs">
                    {appearance.athletic && <span className="bg-surface/80 px-2 py-1 rounded-themed">🏋 gym vibe</span>}
                    {appearance.artistic && <span className="bg-surface/80 px-2 py-1 rounded-themed">🎨 paint marks</span>}
                    {appearance.social && <span className="bg-surface/80 px-2 py-1 rounded-themed">🖼 social photos</span>}
                    {appearance.focused && <span className="bg-surface/80 px-2 py-1 rounded-themed">📌 focused posture</span>}
                </div>

                <div className="absolute left-6 top-14 flex flex-wrap gap-2 max-w-[60%]">
                    {unlockOrder.filter(k => state.unlocks[k]).map(k => (
                        <span key={k} className="text-xs bg-surface/85 border border-secondary px-2 py-1 rounded-themed">
                            {k.replace('_', ' ')}
                        </span>
                    ))}
                </div>

                {activeGifts.length > 0 && (
                    <div className="absolute right-6 top-14 bg-surface/85 border border-secondary rounded-themed p-2 text-xs">
                        🎁 {activeGifts[0]?.label}
                    </div>
                )}
            </div>

            <div className="bg-surface rounded-themed p-4 shadow-themed">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-text-secondary">Current streak</p>
                        <p className="text-lg font-bold text-text-primary">{streakDays} days</p>
                    </div>
                    <div>
                        <p className="text-text-secondary mb-2">This week category balance</p>
                        <div className="flex w-full h-3 rounded-full overflow-hidden bg-secondary/40">
                            {Object.entries(weeklyCategoryBalance).map(([category, count]) => (
                                <div
                                    key={category}
                                    style={{ width: `${total ? (count / total) * 100 : 0}%`, backgroundColor: categoryColor(category) }}
                                    className="h-full"
                                    title={`${category}: ${count}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-text-secondary">Next unlock hint</p>
                        <p className="font-semibold text-text-primary">{nextUnlockHint}</p>
                    </div>
                </div>
            </div>

            {isLettersOpen && (
                <div className="bg-surface rounded-themed p-4 shadow-themed space-y-3">
                    <h3 className="text-lg font-bold text-text-primary font-header">Letters from {state.petName}</h3>
                    {state.letters.length === 0 ? (
                        <p className="text-text-secondary text-sm">No letters yet.</p>
                    ) : (
                        <div className="max-h-64 overflow-y-auto space-y-2">
                            {state.letters.map(letter => (
                                <div key={letter.id} className="bg-secondary/30 rounded-themed p-3 text-sm">
                                    <p className="text-text-primary">{letter.body}</p>
                                    <p className="text-xs text-text-secondary mt-1">{new Date(letter.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {showSpoofedTasks && (
                <div className="bg-surface rounded-themed shadow-themed">
                    <button
                        onClick={() => setIsDebugOpen(prev => !prev)}
                        className="w-full text-left p-4 font-semibold text-text-primary"
                    >
                        Nurture Debug {isDebugOpen ? '▲' : '▼'}
                    </button>
                    {isDebugOpen && (
                        <div className="p-4 border-t border-secondary space-y-4">
                            <div>
                                <p className="text-xs uppercase text-text-secondary mb-2">Mood Overrides</p>
                                <div className="flex flex-wrap gap-2">
                                    {moodOrder.map(m => (
                                        <button key={m} onClick={() => setMoodOverride(m)} className="px-2 py-1 rounded-themed bg-secondary/50 text-xs">{m}</button>
                                    ))}
                                    <button onClick={() => setMoodOverride(null)} className="px-2 py-1 rounded-themed bg-secondary/80 text-xs">Clear</button>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-text-secondary mb-2">Behavior Cues (read-only)</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                    <span>Workout streak: {behaviors.workoutStreak3 ? 'on' : 'off'}</span>
                                    <span>Late-night: {behaviors.lateNightPattern ? 'on' : 'off'}</span>
                                    <span>First after break: {behaviors.firstAfterInactivity ? 'on' : 'off'}</span>
                                    <span>Full day completion: {behaviors.fullDayCompletion ? 'on' : 'off'}</span>
                                    <span>Streak ended: {behaviors.streakEnded ? 'on' : 'off'}</span>
                                    <span>Streak resumed: {behaviors.streakResumed ? 'on' : 'off'}</span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-text-secondary mb-2">Unlock Simulators</p>
                                <div className="flex flex-wrap gap-2">
                                    {unlockOrder.map(k => (
                                        <button key={k} onClick={() => grantUnlock(k)} className="px-2 py-1 rounded-themed bg-secondary/50 text-xs">{k}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-xs uppercase text-text-secondary mb-2">Note Tools</p>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={handleGeneratePreview} className="px-3 py-1 rounded-themed bg-primary text-white text-xs" disabled={isGeneratingPreview}>
                                        {isGeneratingPreview ? 'Generating...' : 'Generate Preview'}
                                    </button>
                                    <button onClick={clearLetters} className="px-3 py-1 rounded-themed bg-secondary/70 text-xs">Clear Log</button>
                                </div>
                                {previewLetter && (
                                    <div className="mt-2 p-3 rounded-themed bg-secondary/30 text-sm">
                                        <p>{previewLetter}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button onClick={commitPreview} className="px-2 py-1 text-xs rounded-themed bg-primary text-white">Commit</button>
                                            <button onClick={() => setPreviewLetter(null)} className="px-2 py-1 text-xs rounded-themed bg-secondary/70">Discard</button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="text-xs uppercase text-text-secondary mb-2">Time Override</p>
                                <div className="flex flex-wrap gap-2">
                                    {(['morning', 'afternoon', 'evening', 'night'] as NurtureTimeOfDay[]).map(t => (
                                        <button key={t} onClick={() => setTimeOverride(t)} className={`px-2 py-1 rounded-themed text-xs ${state.timeOverride === t ? 'bg-primary text-white' : 'bg-secondary/50'}`}>{t}</button>
                                    ))}
                                    <button onClick={() => setTimeOverride(null)} className="px-2 py-1 rounded-themed bg-secondary/70 text-xs">Use real time</button>
                                </div>
                            </div>

                            <div>
                                <button onClick={resetNurtureState} className="px-3 py-2 rounded-themed bg-red-900/30 border border-red-500/40 text-red-300 text-sm">
                                    Reset State
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
