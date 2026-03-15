import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Mode, Placeholder, SuggestionPill } from '../types';
import * as claudeService from '../services/claudeService';
import { getRandomGenericSuggestionPills } from '../src/suggestionPills';
import { getRandomGenericPlaceholder } from '../src/placeholders';

interface UsePersonaContentProps {
    user: User | null;
    userProfile: any;
    mode: Mode;
}

export const usePersonaContent = ({ user, userProfile, mode }: UsePersonaContentProps) => {
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

        const fetchContent = async () => {
            setIsTaskPlaceholdersLoading(true);
            setIsProjectPlaceholdersLoading(true);
            setIsExplorePlaceholdersLoading(true);
            setIsExplorePillsLoading(true);
            setIsProjectPillsLoading(true);
            try {
                const content = await claudeService.getInitialPersonaContent(userProfile, mode);
                if (cancelled) return;
                if (content) {
                    setPlaceholders(content.task.placeholders);
                    setExplorePlaceholders(content.explore.placeholders);
                    setProjectPlaceholders(content.project.placeholders);
                    setExploreSuggestionPills(content.explore.pills);
                    setProjectSuggestionPills(content.project.pills);
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
    }, [user, userProfile.interests, userProfile.dislikes, userProfile.longTermGoals, userProfile.dailyRhythm, userProfile.personaId, mode]);

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
