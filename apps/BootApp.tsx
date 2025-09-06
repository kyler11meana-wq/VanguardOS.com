
import React, { useEffect, useContext, useState } from 'react';
import { AppContext } from '../context.ts';
import { AppContextType } from '../types.ts';
import OSLogo from '../components/OSLogo.tsx';

const BOOT_MESSAGES = [
    'Starting core services...',
    'Calibrating sensors...',
    'Loading workspace...',
    'Optimizing applications...',
    'Finalizing setup...'
];
// Duration for each message to be on screen
const MESSAGE_DURATION = 1000; // 1 second

const BootApp: React.FC = () => {
    const { closeApp } = useContext(AppContext) as AppContextType;
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        // Total boot time is kept around 5s
        const bootDuration = 5000;

        const messageTimer = setInterval(() => {
            setCurrentMessageIndex(prev => {
                // Stop incrementing when we reach the last message
                if (prev < BOOT_MESSAGES.length - 1) {
                    return prev + 1;
                }
                clearInterval(messageTimer); // Stop the interval
                return prev;
            });
        }, MESSAGE_DURATION);

        const closingTimer = setTimeout(() => {
            closeApp('boot');
        }, bootDuration);

        return () => {
            clearInterval(messageTimer);
            clearTimeout(closingTimer);
        };
    }, [closeApp]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white font-sans overflow-hidden">
            <div className="text-center animate-boot-logo-scale">
                <OSLogo className="mx-auto" />
                <h1 className="text-5xl font-bold tracking-wider mt-4">VanguardOS</h1>
            </div>
            <div className="absolute bottom-20 h-6">
                <p key={currentMessageIndex} className="text-gray-400 animate-boot-text-fade">
                    {BOOT_MESSAGES[currentMessageIndex]}
                </p>
            </div>
        </div>
    );
};

export default BootApp;