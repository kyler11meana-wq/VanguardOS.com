



import React, { useContext, useRef } from 'react';
import { AppContext } from '../context.ts';
import { AppContextType, InternetMode } from '../types.ts';

interface ControlCenterProps {
    isOpen: boolean;
    onClose: () => void;
}

const ControlButton: React.FC<{
    icon: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
    onLongPress?: () => void;
    className?: string;
    iconStyle?: 'fa-solid' | 'fa-brands';
}> = ({ icon, label, isActive = false, onClick, onLongPress, className = '', iconStyle = 'fa-solid' }) => {
    const timerRef = useRef<number | null>(null);
    const isLongPressTriggered = useRef(false);

    const handlePressStart = () => {
        isLongPressTriggered.current = false;
        // If there's a long press handler, set a timer
        if (onLongPress) {
            timerRef.current = window.setTimeout(() => {
                isLongPressTriggered.current = true;
                onLongPress();
            }, 500); // 500ms for long press
        }
    };

    const handlePressEnd = () => {
        // If the timer is still active, it was a short press (click)
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        // Fire onClick only if long press was not triggered
        if (!isLongPressTriggered.current) {
            onClick?.();
        }
    };
    
    // Cancel the timer if the user's pointer leaves the button
    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const activeClasses = isActive ? 'bg-v-primary text-white' : 'bg-white/20 text-white';
    
    return (
        <div className="flex flex-col items-center space-y-2">
            <button
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handleMouseLeave}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                // Prevent default click behavior to handle it manually
                onClick={(e) => e.preventDefault()}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200 ${activeClasses} ${className}`}
                aria-pressed={isActive}
                disabled={className.includes('cursor-not-allowed')}
            >
                <i className={`${iconStyle} ${icon} text-2xl`}></i>
            </button>
            <span className="text-xs text-white font-semibold">{label}</span>
        </div>
    );
};


const ControlCenter: React.FC<ControlCenterProps> = ({ isOpen, onClose }) => {
    // FIX: Add setTargetSettingsView to context destructuring to enable deep-linking into settings.
    const { settings, setSettings, openApp, setTargetSettingsView, isCharging, setIsCharging } = useContext(AppContext) as AppContextType;

    const toggleInternetMode = (mode: InternetMode) => {
        const newMode = settings.internetMode === mode ? 'off' : mode;
        setSettings(prev => ({ ...prev, internetMode: newMode }));
    };
    
    const handleLongPress = (view: string) => {
        setTargetSettingsView(view);
        openApp('settings');
        onClose();
    };
    
    return (
        <div
            className={`absolute inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div
                className={`absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-2xl rounded-b-3xl shadow-lg transition-transform duration-300 ease-in-out transform-gpu pt-12 ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 grid grid-cols-4 gap-y-6 gap-x-4">
                    <ControlButton 
                        icon="fa-wifi" 
                        label="Wi-Fi" 
                        isActive={settings.internetMode === 'wifi'} 
                        onClick={() => toggleInternetMode('wifi')}
                        onLongPress={() => handleLongPress('internet')}
                    />
                    <ControlButton 
                        icon="fa-signal" 
                        label="Cellular" 
                        isActive={settings.internetMode === 'network'} 
                        onClick={() => toggleInternetMode('network')}
                        onLongPress={() => handleLongPress('internet')}
                    />
                    <ControlButton 
                        icon="fa-bluetooth-b" 
                        iconStyle="fa-brands"
                        label="VBluetooth" 
                        isActive={settings.internetMode === 'vbluetooth'} 
                        onClick={() => toggleInternetMode('vbluetooth')}
                        onLongPress={() => handleLongPress('internet')}
                    />
                    <ControlButton
                        icon="fa-plane"
                        label="Airplane"
                        isActive={settings.airplaneMode}
                        onClick={() => setSettings(prev => ({ ...prev, airplaneMode: !prev.airplaneMode }))}
                    />
                     <ControlButton
                        icon="fa-bolt"
                        label="Charging"
                        isActive={isCharging}
                        onClick={() => setIsCharging(prev => !prev)}
                        onLongPress={() => handleLongPress('battery')}
                    />
                    <ControlButton
                        icon="fa-leaf"
                        label="Power Save"
                        isActive={settings.powerSavingMode}
                        onClick={() => setSettings(prev => ({ ...prev, powerSavingMode: !prev.powerSavingMode }))}
                        onLongPress={() => handleLongPress('battery')}
                    />
                    <ControlButton
                        icon="fa-moon"
                        label="Dark Mode"
                        isActive={settings.theme === 'dark'}
                        onClick={() => setSettings(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))}
                        onLongPress={() => handleLongPress('personalization')}
                    />
                </div>
            </div>
        </div>
    );
};

export default ControlCenter;