import { Task, SortByType, SortDirection } from '../types';

export const sortTasks = (tasks: Task[], sortBy: SortByType, sortDirection: SortDirection): Task[] => {
    const sorted = [...tasks];
    
    const manualSort = (a: Task, b: Task) => {
        const timeA = a.created_at instanceof Date ? a.created_at.getTime() : 0;
        const timeB = b.created_at instanceof Date ? b.created_at.getTime() : 0;
        return (a.order ?? timeA) - (b.order ?? timeB);
    };

    sorted.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'manual') {
            comparison = manualSort(a, b);
        } else {
            switch (sortBy) {
                case 'title':
                    comparison = a.title.localeCompare(b.title);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                case 'duration':
                    comparison = a.duration_min - b.duration_min;
                    break;
                case 'date_and_time':
                    comparison = new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime();
                    break;
            }
            if (comparison === 0) {
                comparison = manualSort(a, b);
            }
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
};
