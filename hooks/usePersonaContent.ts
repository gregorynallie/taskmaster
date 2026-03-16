import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Mode, Placeholder, SuggestionPill } from '../types';
import * as claudeService from '../services/claudeService';
import { getRandomGenericSuggestionPills } from '../src/suggestionPills';
import { getRandomGenericPlaceholder } from '../src/placeholders';
import { useSettings } from '../contexts/SettingsProvider';

const PERSONA_CACHE_KEY_PREFIX = 'taskmaster-persona-';
const PERSONA_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

interface UsePersonaContentProps {
    user: User | null;
    userProfile: any;
    mode: Mode;
}

function getProfileFingerprint(profile: any): string {
    return JSON.stringify({
        interests: profile.interests,
        dislikes: profile.dislikes,
        longTermGoals: profile.longTermGoals,
        dailyRhythm: profile.dailyRhythm ?? '',
    });
}

export const usePersonaContent = ({ user, userProfile, mode }: UsePersonaContentProps) => {
    const { aiQualityMode } = useSettings();
    const [placeholders, setPlaceholders] = useState<Placeholder[]>([getRandomGenericPlaceholder('task')]);
    const [projectPlaceholders, setProjectPlaceholders] = useState<Placeholder[]>([getRandomGenericPlaceholder('project')]);
    const [explorePlaceholders, setExplorePlaceholders] = useState<Placeholder[]>([getRandomGenericPlaceholder('explore')]);
    const [isTaskPlaceholdersLoading, setIsTaskPlaceholdersLoading] = useState(true);
    const [isProjectPlaceholdersLoading, setIsProjectPlaceholdersLoading] = useState(true);
    const [isExplorePlaceholdersLoading, setIsExplorePlaceholdersLoading] = useState(true);
    const [exploreSuggestionPills, setExploreSuggestionPills] = useState<SuggestionPill[]>(() => getRandomGenericSuggestionPills('explore', 5));
    const [projectSuggestionPills, setProjectSuggestionPills] = useState<SuggestionPill[]>(() => getRandomGenericSuggestionPills('project', 4));
    const [isExplorePillsLoading, setIsExplorePillsLoading] = useState(true);
    const [isProjectPillsLoading, setIsProjectPillsLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        let cancelled = false;
        const cacheKey = `${PERSONA_CACHE_KEY_PREFIX}${user.uid}-${userProfile.personaId}-${mode}-${aiQualityMode}`;
        const fingerprint = getProfileFingerprint(userProfile);

        const applyContent = (content: { task: { placeholders: Placeholder[] }; explore: { placeholders: Placeholder[]; pills: SuggestionPill[] }; project: { placeholders: Placeholder[]; pills: SuggestionPill[] } }) => {
            setPlaceholders(content.task.placeholders);
            setExplorePlaceholders(content.explore.placeholders);
            setProjectPlaceholders(content.project.placeholders);
            setExploreSuggestionPills(content.explore.pills);
            setProjectSuggestionPills(content.project.pills);
        };

        const fetchContent = async () => {
            try {
                const cached = localStorage.getItem(cacheKey);
                if (cached) {
                    const { data, profileFingerprint, timestamp } = JSON.parse(cached);
                    if (profileFingerprint === fingerprint && Date.now() - timestamp < PERSONA_CACHE_TTL_MS && data) {
                        applyContent(data);
                        if (!cancelled) {
                            setIsTaskPlaceholdersLoading(false);
                            setIsProjectPlaceholdersLoading(false);
                            setIsExplorePlaceholdersLoading(false);
                            setIsExplorePillsLoading(false);
                            setIsProjectPillsLoading(false);
                        }
                        return;
                    }
                }
            } catch (_) {
                // Invalid or missing cache; fall through to fetch
            }

            setIsTaskPlaceholdersLoading(true);
            setIsProjectPlaceholdersLoading(true);
            setIsExplorePlaceholdersLoading(true);
            setIsExplorePillsLoading(true);
            setIsProjectPillsLoading(true);
            try {
                const content = await claudeService.getInitialPersonaContent(userProfile, mode);
                if (cancelled) return;
                if (content) {
                    applyContent(content);
                    try {
                        localStorage.setItem(cacheKey, JSON.stringify({
                            data: content,
                            profileFingerprint: fingerprint,
                            timestamp: Date.now(),
                        }));
                    } catch (_) {
                        // localStorage full or disabled
                    }
                }
            } catch (e) {
                if (cancelled) return;
                console.error('Failed to fetch persona content, using fallbacks.', e);
                setPlaceholders([getRandomGenericPlaceholder('task')]);
                setExplorePlaceholders([getRandomGenericPlaceholder('explore')]);
                setProjectPlaceholders([getRandomGenericPlaceholder('project')]);
                setExploreSuggestionPills(getRandomGenericSuggestionPills('explore', 5));
                setProjectSuggestionPills(getRandomGenericSuggestionPills('project', 4));
            } finally {
                if (!cancelled) {
                    setIsTaskPlaceholdersLoading(false);
                    setIsProjectPlaceholdersLoading(false);
                    setIsExplorePlaceholdersLoading(false);
                    setIsExplorePillsLoading(false);
                    setIsProjectPillsLoading(false);
                }
            }
        };

        fetchContent();
        return () => { cancelled = true; };
    }, [user, userProfile.interests, userProfile.dislikes, userProfile.longTermGoals, userProfile.dailyRhythm, userProfile.personaId, mode, aiQualityMode]);

    return {
        placeholders,
        projectPlaceholders,
        explorePlaceholders,
        isTaskPlaceholdersLoading,
        isProjectPlaceholdersLoading,
        isExplorePlaceholdersLoading,
        exploreSuggestionPills,
        projectSuggestionPills,
        isExplorePillsLoading,
        isProjectPillsLoading,
    };
};
