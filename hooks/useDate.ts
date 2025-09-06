
import { useState, useEffect } from 'react';

const useDate = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            // Update once a minute is sufficient for the date string
            if (new Date().getDate() !== date.getDate()) {
               setDate(new Date());
            }
        }, 60000);

        return () => {
            clearInterval(timerId);
        };
    }, [date]);

    return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
};

export default useDate;
