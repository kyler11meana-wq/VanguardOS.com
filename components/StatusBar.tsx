import React, { useContext, useRef, useState, useEffect } from 'react';
import useTime from '../hooks/useTime.ts';
import { AppContext } from '../context.ts';
import { AppContextType } from '../types.ts';
import { WIFI_NETWORKS, CELLULAR_NETWORKS } from '../constants.tsx';

interface StatusBarProps {
    toggleControlCenter: () => void;
    onLock?: () => void;
    onShowPowerMenu?: () => void;
}

const PowerButton: React.FC<{onClick: () => void; onLongPress: () => void;}> = ({onClick, onLongPress}) => {
    const timerRef = useRef<number | null>(null);
    const isLongPressTriggered = useRef(false);

    const handlePressStart = () => {
        isLongPressTriggered.current = false;
        timerRef.current = window.setTimeout(() => {
            isLongPressTriggered.current = true;
            onLongPress();
        }, 500);
    };

    const handlePressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (!isLongPressTriggered.current) {
            onClick();
        }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    
    return (
        <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onClick={(e) => e.preventDefault()}
            className="text-white text-xl w-16 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all active:scale-90"
            aria-label="Power options"
        >
            <i className="fa-solid fa-power-off"></i>
        </button>
    );
};


const CellularSignal: React.FC<{ level: number, maxLevel: number }> = ({ level, maxLevel }) => (
    <div className="flex items-end space-x-0.5 h-3.5 w-4">
        {Array.from({ length: maxLevel }).map((_, i) => (
            <div
                key={i}
                className={`w-1 rounded-sm ${i < level ? 'bg-white' : 'bg-white/30'}`}
                style={{ height: `${((i + 1) / maxLevel) * 90 + 10}%` }}
            />
        ))}
    </div>
);

const WifiSignal: React.FC<{ level: number }> = ({ level }) => {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 8.82a19 19 0 0 1 20 0" className={level >= 4 ? 'stroke-white' : 'stroke-white/30'}></path>
            <path d="M5 12.55a11 11 0 0 1 14.08 0" className={level >= 3 ? 'stroke-white' : 'stroke-white/30'}></path>
            <path d="M8.5 16.05a6 6 0 0 1 7 0" className={level >= 2 ? 'stroke-white' : 'stroke-white/30'}></path>
            <line x1="12" y1="20" x2="12.01" y2="20" className={level >= 1 ? 'stroke-white' : 'stroke-white/30'}></line>
        </svg>
    );
};

const ConnectionIndicator: React.FC = () => {
    const { settings } = useContext(AppContext) as AppContextType;

    if (settings.airplaneMode) {
        return <i className="fa-solid fa-plane"></i>;
    }

    if (!settings.internetMode || settings.internetMode === 'off') {
        return null;
    }

    switch (settings.internetMode) {
        case 'wifi':
            const selectedWifi = WIFI_NETWORKS.find(n => n.id === settings.selectedWifiId);
            const wifiSignalLevel = selectedWifi ? selectedWifi.signal : 0;
            return <WifiSignal level={wifiSignalLevel} />;
        case 'network':
            const selectedNetwork = CELLULAR_NETWORKS.find(n => n.id === settings.selectedNetworkId);
            const signalLevel = selectedNetwork ? selectedNetwork.signal : 0;
            const maxSignal = selectedNetwork ? selectedNetwork.maxSignal : 5;
            return <CellularSignal level={signalLevel} maxLevel={maxSignal} />;
        case 'vbluetooth':
            return <i className="fa-brands fa-bluetooth-b"></i>;
        default:
            return null;
    }
};

const BatteryIndicator: React.FC<{ level: number }> = ({ level }) => {
    let iconClass = 'fa-battery-full';
    if (level <= 20) iconClass = 'fa-battery-quarter text-red-500';
    else if (level <= 59) iconClass = 'fa-battery-half';
    else if (level <= 89) iconClass = 'fa-battery-three-quarters';

    return <i className={`fa-solid ${iconClass}`}></i>;
};


const StatusBar: React.FC<StatusBarProps> = ({ toggleControlCenter, onLock = () => {}, onShowPowerMenu = () => {} }) => {
    const currentTime = useTime();
    const { batteryLevel, settings, goToHomeScreen, isCharging, fps, storageUsagePercentage, usedRamMB, totalRamMB } = useContext(AppContext) as AppContextType;

    const ramUsagePercentage = (usedRamMB / totalRamMB) * 100;

    const positionClass = settings.deviceMode === 'laptop' ? 'bottom-0 bg-black/30 backdrop-blur-md' : 'top-0';
    const paddingXClass = settings.deviceMode === 'laptop' ? 'px-10' : 'px-4';

    return (
        <div
            className={`absolute left-0 right-0 h-10 ${paddingXClass} ${positionClass} z-30 flex items-center justify-between text-white text-xs font-semibold w-full`}
        >
            {/* Left side: Time & Performance Stats */}
            <div className="flex justify-start h-full items-center space-x-4">
                <span>{currentTime}</span>
                <div className="flex items-center space-x-3 text-[11px] font-normal opacity-80">
                    <div className="flex items-center space-x-1" title="Frames Per Second">
                        <i className="fa-solid fa-film text-[10px]"></i>
                        <span>{fps}</span>
                    </div>
                    <div className="flex items-center space-x-1" title="RAM Usage">
                        <i className="fa-solid fa-microchip text-[10px]"></i>
                        <span>{Math.round(ramUsagePercentage)}%</span>
                    </div>
                    <div className="flex items-center space-x-1" title="Storage Usage">
                        <i className="fa-solid fa-database text-[10px]"></i>
                        <span>{Math.round(storageUsagePercentage)}%</span>
                    </div>
                </div>
            </div>
            
            {/* Center: Home button in laptop mode */}
            {settings.deviceMode === 'laptop' && (
                 <div className="flex items-center space-x-2">
                    <button
                        onClick={goToHomeScreen}
                        className="text-white text-xl w-16 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all active:scale-90"
                        aria-label="Go to Home Screen"
                    >
                        <i className="fa-solid fa-house"></i>
                    </button>
                    <PowerButton onClick={onLock} onLongPress={onShowPowerMenu} />
                </div>
            )}

            {/* Right side: Indicators & Control Center Trigger */}
            <button
                onClick={toggleControlCenter}
                className="flex justify-end h-full items-center"
                aria-label="Open control center"
            >
                 <div className="flex items-center space-x-3">
                    <ConnectionIndicator />
                    <div className="flex items-center space-x-1.5">
                        {isCharging && <i className="fa-solid fa-bolt text-yellow-400"></i>}
                        {settings.powerSavingMode && <i className="fa-solid fa-leaf text-green-500"></i>}
                        <span className="font-sans font-bold">{batteryLevel}%</span>
                        <BatteryIndicator level={batteryLevel} />
                    </div>
                </div>
            </button>
        </div>
    );
};

export default StatusBar;