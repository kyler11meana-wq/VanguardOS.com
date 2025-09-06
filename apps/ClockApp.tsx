import React, { useState, useEffect, useRef } from 'react';
import AppContainer from '../components/AppContainer.tsx';

type ClockMode = 'Clock' | 'Alarm' | 'Timer';
interface Alarm {
    id: number;
    time: string;
    enabled: boolean;
}

const ClockView: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(timerId);
    }, []);

    const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const secondsString = time.toLocaleTimeString([], { second: '2-digit' });
    const [mainTime, ampm] = timeString.split(' ');

    return (
        <div className="flex-grow flex items-center justify-center p-4 overflow-hidden">
            <div className="flex items-baseline whitespace-nowrap">
                <h1 className="text-6xl sm:text-8xl font-mono tracking-widest">{mainTime}</h1>
                <span className="text-3xl sm:text-4xl font-mono ml-2 sm:ml-3">{ampm}</span>
                <span className="text-3xl sm:text-4xl font-mono ml-1 sm:ml-2">:{secondsString}</span>
            </div>
        </div>
    );
};

const AlarmView: React.FC = () => {
    const [alarms, setAlarms] = useState<Alarm[]>([]);
    const [newAlarmTime, setNewAlarmTime] = useState('07:30');

    useEffect(() => {
        const savedAlarms = localStorage.getItem('vanguardos-alarms');
        if (savedAlarms) {
            setAlarms(JSON.parse(savedAlarms));
        } else {
            setAlarms([{ id: 1, time: '07:30', enabled: true }]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('vanguardos-alarms', JSON.stringify(alarms));
    }, [alarms]);

    const addAlarm = () => {
        const newAlarm: Alarm = {
            id: Date.now(),
            time: newAlarmTime,
            enabled: true,
        };
        setAlarms([...alarms, newAlarm]);
    };

    const toggleAlarm = (id: number) => {
        setAlarms(alarms.map(alarm =>
            alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
        ));
    };

    const deleteAlarm = (id: number) => {
        setAlarms(alarms.filter(alarm => alarm.id !== id));
    };
    
    return (
        <div className="flex-grow p-4 space-y-3 overflow-y-auto">
            <div className="flex items-center space-x-2 p-2 border-b border-gray-200 dark:border-gray-700">
                <input type="time" value={newAlarmTime} onChange={e => setNewAlarmTime(e.target.value)} className="bg-v-surface-light dark:bg-v-surface-dark rounded-md p-2 w-full" />
                <button onClick={addAlarm} className="p-2 rounded-full bg-v-primary text-white"><i className="fa-solid fa-plus"></i></button>
            </div>
            {alarms.map(alarm => (
                 <div key={alarm.id} className={`flex items-center justify-between p-3 rounded-lg ${alarm.enabled ? 'bg-v-surface-light dark:bg-v-surface-dark' : 'bg-gray-200 dark:bg-gray-800 opacity-60'}`}>
                    <div>
                        <p className={`text-3xl font-mono ${!alarm.enabled && 'line-through'}`}>{alarm.time}</p>
                        <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">Alarm</p>
                    </div>
                    <div className="flex items-center space-x-3">
                         <button onClick={() => deleteAlarm(alarm.id)} className="text-v-text-secondary-light dark:text-v-text-secondary-dark hover:text-red-500"><i className="fa-solid fa-trash-can"></i></button>
                         <button onClick={() => toggleAlarm(alarm.id)} className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors ${alarm.enabled ? 'bg-v-primary justify-end' : 'bg-gray-400 dark:bg-gray-600 justify-start'}`}><div className="w-6 h-6 bg-white rounded-full shadow-md"></div></button>
                    </div>
                 </div>
            ))}
        </div>
    );
}

const TimerView: React.FC = () => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [initialTime, setInitialTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft(t => t - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if(intervalRef.current) clearInterval(intervalRef.current);
        }
        return () => {
            if(intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft]);
    
    const setTimer = (seconds: number) => {
        if (isActive) return;
        setInitialTime(seconds);
        setTimeLeft(seconds);
    }

    const startPause = () => setIsActive(!isActive);

    const reset = () => {
        setIsActive(false);
        setTimeLeft(initialTime);
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const progress = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;

    return (
        <div className="flex-grow flex flex-col items-center justify-around p-4">
            <div className="relative w-72 h-72 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" className="text-gray-200 dark:text-gray-700" fill="transparent"/>
                    <circle cx="60" cy="60" r="54" stroke="currentColor" strokeWidth="10" className="text-v-primary" fill="transparent"
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - progress / 100)}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                        strokeLinecap="round"
                    />
                </svg>
                <span className="absolute text-5xl font-mono">{formatTime(timeLeft)}</span>
            </div>
            {initialTime === 0 && (
                 <div className="flex space-x-2">
                    <button onClick={() => setTimer(60)} className="px-3 py-1 bg-v-surface-light dark:bg-v-surface-dark rounded-full">1m</button>
                    <button onClick={() => setTimer(300)} className="px-3 py-1 bg-v-surface-light dark:bg-v-surface-dark rounded-full">5m</button>
                    <button onClick={() => setTimer(600)} className="px-3 py-1 bg-v-surface-light dark:bg-v-surface-dark rounded-full">10m</button>
                 </div>
            )}
            <div className="flex space-x-4">
                <button onClick={reset} className="w-24 h-24 rounded-full bg-v-surface-light dark:bg-v-surface-dark font-semibold text-lg shadow-md">Reset</button>
                <button onClick={startPause} className={`w-24 h-24 rounded-full font-semibold text-lg text-white shadow-lg ${isActive ? 'bg-red-500' : 'bg-green-500'}`}>{isActive ? 'Pause' : 'Start'}</button>
            </div>
        </div>
    );
}

const ClockApp: React.FC = () => {
    const [mode, setMode] = useState<ClockMode>('Clock');

    const renderView = () => {
        switch (mode) {
            case 'Clock': return <ClockView />;
            case 'Alarm': return <AlarmView />;
            case 'Timer': return <TimerView />;
            default: return null;
        }
    };

    const TabButton: React.FC<{ title: ClockMode }> = ({ title }) => (
        <button
            onClick={() => setMode(title)}
            className={`flex-1 py-3 text-sm font-semibold transition-all relative ${
                mode === title
                    ? 'text-v-primary'
                    : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'
            }`}
        >
            {title}
            {mode === title && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-v-primary rounded-full"></div>}
        </button>
    );

    return (
        <AppContainer title="Clock">
            <div className="flex flex-col h-full">
                <div className="flex-grow overflow-hidden flex flex-col">{renderView()}</div>
                <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-2 py-1 flex justify-around bg-v-surface-light/30 dark:bg-v-surface-dark/30">
                    <TabButton title="Clock" />
                    <TabButton title="Alarm" />
                    <TabButton title="Timer" />
                </div>
            </div>
        </AppContainer>
    );
};

export default ClockApp;
