import { RecurringInfo, DayOfWeek, TimeOfDay } from '../types';

export const dateToYMD = (date: Date | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) {
        console.warn("Invalid date provided to dateToYMD:", date);
        return '0000-00-00';
    }
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const DAY_MAP: DayOfWeek[] = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const calculateNextOccurrence = (baseDate: Date, recurrence: RecurringInfo): Date => {
    let nextDate = new Date(baseDate);

    if (!recurrence.frequency || !recurrence.interval) {
        // Fallback for invalid recurrence object, advance by one week
        nextDate.setDate(baseDate.getDate() + 7);
        return nextDate;
    }

    switch (recurrence.frequency) {
        case 'MINUTELY':
            nextDate.setMinutes(baseDate.getMinutes() + recurrence.interval);
            break;
        
        case 'HOURLY':
            nextDate.setHours(baseDate.getHours() + recurrence.interval);
            break;

        case 'DAILY':
            nextDate.setDate(baseDate.getDate() + recurrence.interval);
            break;
        
        case 'WEEKLY': {
            if (!recurrence.daysOfWeek || recurrence.daysOfWeek.length === 0) {
                // If no specific days, just advance by interval weeks
                nextDate.setDate(baseDate.getDate() + (recurrence.interval * 7));
                break;
            }
            const currentDay = baseDate.getDay(); // 0 = Sunday
            const targetDays = recurrence.daysOfWeek.map(d => DAY_MAP.indexOf(d)).sort((a, b) => a - b);

            let nextDayIndex = -1;
            for (const day of targetDays) {
                if (day > currentDay) {
                    nextDayIndex = day;
                    break;
                }
            }
            
            if (nextDayIndex !== -1) {
                // Next occurrence is this week
                nextDate.setDate(baseDate.getDate() + (nextDayIndex - currentDay));
            } else {
                // Next occurrence is in a future week
                const daysUntilNextIntervalWeek = (recurrence.interval - 1) * 7;
                const firstTargetDay = targetDays[0];
                const daysToAdd = daysUntilNextIntervalWeek + (7 - currentDay + firstTargetDay);
                nextDate.setDate(baseDate.getDate() + daysToAdd);
            }
            break;
        }

        case 'MONTHLY': {
            if (recurrence.dayOfMonth) {
                const initialDate = new Date(baseDate);
                initialDate.setDate(recurrence.dayOfMonth);

                if (initialDate <= baseDate) {
                    initialDate.setMonth(initialDate.getMonth() + recurrence.interval);
                }
                nextDate = initialDate;

            } else {
                nextDate.setMonth(baseDate.getMonth() + recurrence.interval);
            }
            break;
        }

        case 'YEARLY':
             nextDate.setFullYear(baseDate.getFullYear() + recurrence.interval);
             break;
    }
    return nextDate;
};


// --- Recurrence Formatting Helpers ---
const DAY_NAMES: Record<DayOfWeek, string> = { SU: 'Sunday', MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday', FR: 'Friday', SA: 'Saturday' };
const DAY_NAMES_SHORT: Record<DayOfWeek, string> = { SU: 'Sun', MO: 'Mon', TU: 'Tue', WE: 'Wed', TH: 'Thu', FR: 'Fri', SA: 'Sat' };

const getOrdinalSuffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
    }
};

export const getNewDateForTimeOfDay = (originalDate: Date, timeOfDay: TimeOfDay): Date => {
    const newDate = new Date(originalDate);
    switch (timeOfDay) {
        case 'morning':
            newDate.setHours(9, 0, 0, 0);
            break;
        case 'day':
            newDate.setHours(14, 0, 0, 0);
            break;
        case 'night':
            newDate.setHours(20, 0, 0, 0);
            break;
    }
    return newDate;
};


export const formatRecurrenceRule = (
    recurrence: RecurringInfo | null | undefined, 
    options: { concise?: boolean } = {}
): string => {
    if (!recurrence || !recurrence.frequency) return options.concise ? 'One-time' : 'Does not repeat';

    const { frequency, interval = 1, daysOfWeek, dayOfMonth } = recurrence;

    const plural = (unit: string) => interval > 1 ? `${unit}s` : unit;

    // Concise Version for display labels
    if (options.concise) {
        switch (frequency) {
            case 'MINUTELY': return `Every ${interval} ${plural('minute')}`;
            case 'HOURLY': return `Every ${interval} ${plural('hour')}`;
            case 'DAILY': return interval === 1 ? 'Daily' : `Every ${interval} days`;
            case 'WEEKLY':
                if (daysOfWeek && daysOfWeek.length > 0) {
                    if (daysOfWeek.length === 1 && interval === 1) return `Every ${DAY_NAMES[daysOfWeek[0]]}`;
                    
                    const daysStr = daysOfWeek.map(d => DAY_NAMES_SHORT[d]).join(', ');
                    if (interval === 1) return `Weekly on ${daysStr}`;
                    return `Every ${interval} weeks on ${daysStr}`;
                }
                return interval === 1 ? 'Weekly' : `Every ${interval} weeks`;
            case 'MONTHLY':
                if (dayOfMonth) {
                    const dayStr = `${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}`;
                    if (interval === 1) return `Monthly on the ${dayStr}`;
                    return `On the ${dayStr}, every ${interval} months`;
                }
                return interval === 1 ? 'Monthly' : `Every ${interval} months`;
            case 'YEARLY':
                return interval === 1 ? 'Yearly' : `Every ${interval} years`;
            default:
                return 'Recurring';
        }
    }

    // Verbose Version for tooltips
    let parts = ['Repeats'];
    switch (frequency) {
        case 'MINUTELY': parts.push(`every ${interval} ${plural('minute')}`); break;
        case 'HOURLY': parts.push(`every ${interval} ${plural('hour')}`); break;
        case 'DAILY': parts.push(interval === 1 ? 'daily' : `every ${interval} days`); break;
        case 'WEEKLY':
            parts.push(interval === 1 ? 'weekly' : `every ${interval} weeks`);
            if (daysOfWeek && daysOfWeek.length > 0) {
                parts.push('on');
                parts.push(daysOfWeek.map(d => DAY_NAMES[d]).join(', '));
            }
            break;
        case 'MONTHLY':
            parts.push(interval === 1 ? 'monthly' : `every ${interval} months`);
            if (dayOfMonth) {
                parts.push(`on the ${dayOfMonth}${getOrdinalSuffix(dayOfMonth)}`);
            }
            break;
        case 'YEARLY':
            parts.push(interval === 1 ? 'annually' : `every ${interval} years`);
            break;
    }

    return parts.join(' ');
};