import React from 'react';

interface WeekNavigatorProps {
    selectedDate: Date;
    setSelectedDate: (date: Date) => void;
}

const isSameDay = (dateA: Date, dateB: Date): boolean => {
    return dateA.getFullYear() === dateB.getFullYear() &&
           dateA.getMonth() === dateB.getMonth() &&
           dateA.getDate() === dateB.getDate();
};

export const WeekNavigator: React.FC<WeekNavigatorProps> = ({ selectedDate, setSelectedDate }) => {
    const getWeekDays = (baseDate: Date): Date[] => {
        const startOfWeek = new Date(baseDate);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        startOfWeek.setDate(diff);
        
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            return date;
        });
    };

    const weekDays = getWeekDays(selectedDate);
    const today = new Date();

    const changeWeek = (direction: 'prev' | 'next') => {
        const newDate = new Date(selectedDate);
        newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
        setSelectedDate(newDate);
    };

    const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    return (
        <div className="bg-surface rounded-lg p-4 shadow-lg mb-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeWeek('prev')} className="px-3 py-1 rounded-md hover:bg-secondary transition text-lg font-bold">‹</button>
                <h3 className="font-bold text-text-primary text-lg">{monthName}</h3>
                <button onClick={() => changeWeek('next')} className="px-3 py-1 rounded-md hover:bg-secondary transition text-lg font-bold">›</button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center">
                {weekDays.map(date => {
                    const isSelected = isSameDay(date, selectedDate);
                    const isToday = isSameDay(date, today);
                    return (
                        <div key={date.toISOString()} onClick={() => setSelectedDate(date)} className="cursor-pointer">
                            <p className="text-xs text-text-secondary uppercase">{date.toLocaleDateString('default', { weekday: 'short' })}</p>
                            <div className={`
                                mt-1 w-10 h-10 rounded-full flex items-center justify-center mx-auto transition-all
                                ${isSelected ? 'bg-primary text-white font-bold' : ''}
                                ${!isSelected ? 'hover:bg-secondary' : ''}
                                ${isToday && !isSelected ? 'border-2 border-accent' : ''}
                            `}>
                                {date.getDate()}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};