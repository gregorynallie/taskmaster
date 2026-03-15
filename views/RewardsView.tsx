import React from 'react';
import { useUserProfile } from '../contexts/UserProfileProvider';
import { ACHIEVEMENTS, REWARDS } from '../constants';

export const RewardsView: React.FC = () => {
    const { userStats } = useUserProfile();

    return (
        <div className="animate-themed-enter max-w-4xl mx-auto">
            <div className="bg-surface p-6 rounded-themed shadow-themed">
                <h2 className="text-3xl font-bold mb-2 text-center text-text-primary font-header">Rewards & Achievements</h2>
                <p className="text-center text-text-secondary mb-8">Complete milestones to unlock new themes and features!</p>

                <div className="space-y-6">
                    {ACHIEVEMENTS.map(achievement => {
                        const isUnlocked = userStats.achievements.has(achievement.id);
                        const reward = REWARDS.find(r => r.id === achievement.rewardId);

                        return (
                            <div key={achievement.id} className={`p-5 rounded-themed border-2 flex items-center transition-all duration-300 ${isUnlocked ? 'border-accent bg-primary/10 shadow-lg' : 'border-secondary'}`}>
                                <div className={`text-4xl mr-5 ${isUnlocked ? 'opacity-100' : 'opacity-30'}`}>
                                    {isUnlocked ? '🏆' : '🔒'}
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`font-bold text-lg font-header ${isUnlocked ? 'text-text-primary' : 'text-text-secondary'}`}>{achievement.name}</h3>
                                    <p className="text-sm text-text-secondary">{achievement.description}</p>
                                    {reward && (
                                        <div className="mt-2 text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full inline-block">
                                            Reward: {reward.name}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};