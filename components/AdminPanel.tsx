import React, { useState, useMemo } from 'react';
import { useSettings } from '../contexts/SettingsProvider';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { useTasks } from '../contexts/TasksProvider';
import { Task, EnrichedTaskData } from '../types';
import { dateToYMD } from '../utils/dateUtils';
import { getAnimationVariant } from '../utils/animationUtils';
import { AnimationVariant } from '../src/animations';

export const AdminPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const { clearAllData, resetOnboarding, setCurrentView, theme } = useSettings();
    const { unlockAllRewards, addXp, setStreak } = useUserProfile();
    const { addTask } = useTasks();
    
    const [xpToAdd, setXpToAdd] = useState(100);
    const [streakToSet, setStreakToSet] = useState(7);
    
    const modalAnimation = useMemo(() => getAnimationVariant<AnimationVariant>(theme, 'modal'), [theme]);

    const handleAddSampleTasks = () => {
        const sampleEnrichedData: EnrichedTaskData = {
            title: "Sample Task",
            description: "This is a sample task added from the admin panel.",
            category: "Admin",
            subcategories: ["testing", "sample"],
            duration_min: 15,
            difficulty: 2,
            xp_estimate: 25,
        };
        const sampleTask: Task = {
            id: `sample-${new Date().toISOString()}`,
            created_at: new Date(),
            scheduled_at: new Date().toISOString(),
            completed_at: null,
            xp_awarded: null,
            ...sampleEnrichedData,
            ai_generated_json: sampleEnrichedData,
        };
        addTask(sampleTask);
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4" onClick={onClose}>
            <div 
                className={`bg-surface border border-accent rounded-themed shadow-themed w-full max-w-md p-6 text-text-primary ${modalAnimation.className}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-accent font-header">Admin Panel</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary text-2xl">&times;</button>
                </div>

                <div className="space-y-4">
                    {/* Data Management */}
                    <div>
                        <h3 className="font-bold mb-2 text-primary font-header">Data Management</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={resetOnboarding} className="bg-secondary text-text-on-secondary-bkg hover:bg-opacity-80 text-sm p-2 rounded-themed">Reset Onboarding</button>
                            <button onClick={clearAllData} className="bg-red-800 hover:bg-red-700 text-sm p-2 rounded-themed">Clear All Data</button>
                            <button onClick={handleAddSampleTasks} className="bg-secondary text-text-on-secondary-bkg hover:bg-opacity-80 text-sm p-2 rounded-themed">Add Sample Task</button>
                            <button onClick={unlockAllRewards} className="bg-secondary text-text-on-secondary-bkg hover:bg-opacity-80 text-sm p-2 rounded-themed">Unlock All Rewards</button>
                            <button 
                                onClick={() => { setCurrentView('themeSandbox'); onClose(); }}
                                className="col-span-2 bg-accent/20 text-accent hover:bg-accent/30 text-sm p-2 rounded-themed"
                            >
                                Open Theme Sandbox
                            </button>
                        </div>
                    </div>

                    {/* Gamification */}
                    <div>
                        <h3 className="font-bold mb-2 text-primary font-header">Gamification</h3>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="number"
                                value={xpToAdd}
                                onChange={e => setXpToAdd(parseInt(e.target.value, 10))}
                                className="w-20 bg-bkg p-2 rounded-themed border border-secondary"
                            />
                            <button onClick={() => addXp(xpToAdd)} className="flex-1 bg-secondary text-text-on-secondary-bkg hover:bg-opacity-80 text-sm p-2 rounded-themed">Add XP</button>
                        </div>
                         <div className="flex items-center space-x-2 mt-2">
                            <input 
                                type="number"
                                value={streakToSet}
                                onChange={e => setStreakToSet(parseInt(e.target.value, 10))}
                                className="w-20 bg-bkg p-2 rounded-themed border border-secondary"
                            />
                            <button onClick={() => setStreak(streakToSet)} className="flex-1 bg-secondary text-text-on-secondary-bkg hover:bg-opacity-80 text-sm p-2 rounded-themed">Set Streak</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};