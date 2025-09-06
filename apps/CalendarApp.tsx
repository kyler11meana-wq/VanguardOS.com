
import React, { useState } from 'react';
import AppContainer from '../components/AppContainer.tsx';

const CalendarApp: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, () => null);
    const calendarDays = [...blanks, ...days];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
               currentDate.getMonth() === today.getMonth() &&
               currentDate.getFullYear() === today.getFullYear();
    };

    return (
        <AppContainer title="Calendar">
            <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">{`${monthName} ${year}`}</h2>
                    <div className="space-x-2">
                        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-90" aria-label="Previous month"><i className="fa-solid fa-chevron-left"></i></button>
                        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-90" aria-label="Next month"><i className="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
                <div className="grid grid-cols-7 gap-y-4 text-center">
                    {dayNames.map(day => (
                        <div key={day} className="font-semibold text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{day}</div>
                    ))}
                    {calendarDays.map((day, index) => (
                        <div key={index} className="py-1">
                            {day && (
                                <span className={`w-9 h-9 flex items-center justify-center rounded-full mx-auto transition-colors ${isToday(day) ? 'bg-v-primary text-white shadow-lg' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                    {day}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AppContainer>
    );
};

export default CalendarApp;
