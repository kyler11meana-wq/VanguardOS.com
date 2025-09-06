
import { useState, useEffect } from 'react';

const useTime = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    // Remove space before AM/PM for a more compact status bar display
    return timeString.replace(' ', '');
};

export default useTime;
