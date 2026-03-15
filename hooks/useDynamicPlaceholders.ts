import { useState, useEffect, useRef } from 'react';
import { useTasks } from '../contexts/TasksProvider';
import { getRandomGenericPlaceholder } from '../src/placeholders';
import { Placeholder } from '../types';

export const useDynamicPlaceholders = (context: 'task' | 'project' | 'explore') => {
    const { 
        placeholders, 
        projectPlaceholders, 
        explorePlaceholders,
        isTaskPlaceholdersLoading,
        isProjectPlaceholdersLoading,
        isExplorePlaceholdersLoading,
    } = useTasks();

    const isLoading = context === 'project' 
        ? isProjectPlaceholdersLoading 
        : context === 'explore' 
            ? isExplorePlaceholdersLoading 
            : isTaskPlaceholdersLoading;
            
    const fetchedData = context === 'project' 
        ? projectPlaceholders 
        : context === 'explore'
            ? explorePlaceholders
            : placeholders;
    
    // This state holds what is actually shown in the UI. Initialize with a single random placeholder.
    const [displayData, setDisplayData] = useState<Placeholder[]>([getRandomGenericPlaceholder(context)]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFading, setIsFading] = useState(false); // For cycling
    const [isTransitioning, setIsTransitioning] = useState(false); // For data source change
    const inputRef = useRef({ value: '' });
    
    // Effect to handle switching between generic and fetched data
    useEffect(() => {
        if (isLoading) {
            setDisplayData([getRandomGenericPlaceholder(context)]);
            setCurrentIndex(0);
        } else if (!isLoading && fetchedData.length > 0 && fetchedData[0].question !== displayData[0].question) {
            setIsTransitioning(true);
            setTimeout(() => {
                setDisplayData(fetchedData);
                setCurrentIndex(0);
                setIsTransitioning(false);
            }, 500);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, fetchedData]);


    // Effect for cycling through the current display data
    useEffect(() => {
        if (displayData.length <= 1 || isLoading || isTransitioning) return;

        const intervalId = setInterval(() => {
            if (inputRef.current.value.length > 0) return;
            setIsFading(true);
            setTimeout(() => {
                setCurrentIndex(prev => (prev + 1) % displayData.length);
                setIsFading(false);
            }, 500);
        }, 8000);

        return () => clearInterval(intervalId);
    }, [displayData, isLoading, isTransitioning]);

    const currentPlaceholder = displayData[currentIndex % displayData.length] || getRandomGenericPlaceholder(context);

    const shouldBeFading = isFading || isTransitioning;

    return { currentPlaceholder, isFading: shouldBeFading, inputRef };
};