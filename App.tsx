
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
// FIX: Import Notification type to use in state.
import { AppDefinition, Settings, AppId, AppContextType, DeviceMode, Notification } from './types.ts';
import { APPS, DEFAULT_SETTINGS, SYSTEM_UPDATES_SIZES_MB, WIFI_NETWORKS, CELLULAR_NETWORKS, VBLUETOOTH_NETWORKS } from './constants.tsx';
import { APPS, DEFAULT_SETTINGS } from './constants.tsx';
import StatusBar from './components/StatusBar.tsx';
import HomeScreen from './components/HomeScreen.tsx';
import TaskSwitcher from './components/TaskSwitcher.tsx';
import { AppContext } from './context.ts';
import { AppContext, useStorage } from './context.ts';
import NavBar from './components/NavBar.tsx';
import AppInfo from './components/AppInfo.tsx';
import PoweredOffScreen from './components/PoweredOffScreen.tsx';
import ControlCenter from './components/ControlCenter.tsx';
// FIX: Import Shade component to render it in the app.
import Shade from './components/Shade.tsx';
import OSLogo from './components/OSLogo.tsx';
import useTime from './hooks/useTime.ts';
import useDate from './hooks/useDate.ts';

// --- Pre-Boot Splash Screen ---
const PreBootScreen: React.FC = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white overflow-hidden">
            <div className="relative flex flex-col items-center justify-center">
                {/* Pulsing background glow */}
                <div className="absolute w-32 h-32 bg-v-primary rounded-full blur-3xl animate-pre-boot-pulse opacity-50"></div>
                
                {/* Logo with fade-in animation */}
                <div className="animate-pre-boot-fade-in" style={{ animationDelay: '500ms', opacity: 0 }}>
                    <OSLogo />
                </div>

                {/* Text with fade-in animation */}
                <h1 
                    className="text-4xl font-bold tracking-wider mt-4 opacity-0 animate-pre-boot-fade-in"
                    style={{ animationDelay: '1000ms' }}
                >
                    VanguardOS
                </h1>
            </div>
        </div>
    );
};


// --- Custom Hooks ---
export const useStorage = () => {
    const totalStorageKB = 144 * 1024; // 144 MB

    const appStorageKB = useMemo(() => 
        APPS.reduce((total, app) => total + (app.storageUsageKB || 0), 0), 
        []
    );

    const otherStorageKB = 45 * 1024; // Simulated "other" files like photos
    const systemStorageKB = useMemo(() => 
        Object.values(SYSTEM_UPDATES_SIZES_MB).reduce((sum, size) => sum + size, 0) * 1024,
        []
    );

    const usedStorageKB = appStorageKB + otherStorageKB + systemStorageKB;
    const usagePercentage = (usedStorageKB / totalStorageKB) * 100;

    return { usagePercentage, usedStorageKB, totalStorageKB };
};


const ModeSelectionScreen: React.FC<{ onSelect: (mode: DeviceMode) => void }> = ({ onSelect }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#1a1a1a] text-white animate-scale-in text-center p-4">
            <OSLogo />
            <h1 className="text-4xl font-bold tracking-wider mt-4">Welcome to VanguardOS</h1>
            <p className="text-lg text-gray-400 mt-2 mb-12">Choose your experience</p>
            <div className="flex flex-wrap justify-center gap-8">
                <button onClick={() => onSelect('smartphone')} className="flex flex-col items-center p-6 space-y-3 rounded-2xl bg-gray-800 hover:bg-v-primary transition-all group">
                    <i className="fa-solid fa-mobile-screen-button text-5xl text-gray-400 group-hover:text-white transition-colors"></i>
                    <span className="text-xl font-semibold">Smartphone</span>
                </button>
                 <button onClick={() => onSelect('laptop')} className="flex flex-col items-center p-6 space-y-3 rounded-2xl bg-gray-800 hover:bg-v-primary transition-all group">
                    <i className="fa-solid fa-laptop text-5xl text-gray-400 group-hover:text-white transition-colors"></i>
                    <span className="text-xl font-semibold">Laptop</span>
                </button>
            </div>
        </div>
    );
};

// --- In-App Components for Lock Screen and Power Menu ---

const LockScreen: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
    const time = useTime();
    const date = useDate();
    const { settings } = React.useContext(AppContext) as AppContextType;
    const [pin, setPin] = useState('');
    const [isShaking, setIsShaking] = useState(false);
    const correctPin = '1992';

    const handlePinClick = useCallback((digit: string) => {
        setPin(currentPin => {
            if (currentPin.length < correctPin.length) {
                return currentPin + digit;
            }
            return currentPin;
        });
    }, []);

    const handleDelete = useCallback(() => {
        setPin(currentPin => currentPin.slice(0, -1));
    }, []);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key >= '0' && event.key <= '9') {
                handlePinClick(event.key);
            } else if (event.key === 'Backspace') {
                handleDelete();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlePinClick, handleDelete]);


    useEffect(() => {
        if (pin.length === correctPin.length) {
            if (pin === correctPin) {
                setTimeout(() => onUnlock(), 200);
            } else {
                setIsShaking(true);
                setTimeout(() => {
                    setIsShaking(false);
                    setPin('');
                }, 500);
            }
        }
    }, [pin, onUnlock]);

    const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
    const wallpaperStyle = {
        backgroundImage: `url(${settings.wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };
    
    // Conditional styling for laptop mode to prevent overlap on smaller heights
    const isLaptop = settings.deviceMode === 'laptop';
    const timeFontSize = isLaptop ? 'text-7xl' : 'text-7xl';
    const dateFontSize = isLaptop ? 'text-xl' : 'text-2xl';
    const timeMarginTop = isLaptop ? '-mt-12' : '-mt-24';
    const pinDotsMargin = isLaptop ? 'my-6' : 'my-8';
    const keypadGap = isLaptop ? 'gap-y-4 gap-x-6' : 'gap-y-5 gap-x-8';
    const keypadButton = isLaptop ? 'w-16 h-16 text-2xl' : 'w-20 h-20 text-3xl';


    return (
        <div 
            className="absolute inset-0 z-25 w-full h-full flex flex-col justify-center items-center text-white animate-fade-in" 
            style={wallpaperStyle}
            aria-label="Lock screen, enter PIN to unlock"
        >
            <div className={`absolute inset-0 ${settings.theme === 'dark' ? 'bg-black/50' : 'bg-white/10'}`}></div>
            <StatusBar toggleControlCenter={() => {}} />
            <div className={`relative text-center drop-shadow-lg ${timeMarginTop}`}>
                <h1 className={`${timeFontSize} font-thin`}>{time.replace('AM','').replace('PM','')}</h1>
                <p className={`${dateFontSize} mt-2`}>{date}</p>
            </div>

            <div className={`flex space-x-4 ${pinDotsMargin} transition-transform duration-100 ${isShaking ? 'animate-shake' : ''}`}>
                {Array.from({ length: correctPin.length }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-full border-2 border-white transition-all ${i < pin.length ? 'bg-white' : 'bg-transparent'}`}></div>
                ))}
            </div>

            <div className={`grid grid-cols-3 ${keypadGap}`}>
                {keypad.map((key, index) => (
                    key === '' ? <div key={index}></div> :
                    <button 
                        key={index} 
                        onClick={() => key === '⌫' ? handleDelete() : handlePinClick(key)}
                        className={`${keypadButton} rounded-full bg-white/10 backdrop-blur-sm text-white font-light flex items-center justify-center transition-all active:bg-white/30`}
                        aria-label={key === '⌫' ? 'Delete' : `Number ${key}`}
                    >
                        {key === '⌫' ? <i className="fa-solid fa-delete-left"></i> : key}
                    </button>
                ))}
            </div>
        </div>
    );
};


const PowerMenu: React.FC<{ onPowerOff: () => void; onReboot: () => void; onClose: () => void; }> = ({ onPowerOff, onReboot, onClose }) => {
    return (
        <div 
            className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center animate-fade-in"
            onClick={onClose}
        >
            <div className="flex space-x-12" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center space-y-3">
                    <button onClick={onPowerOff} className="w-20 h-20 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center text-white text-3xl transition-colors active:scale-95" aria-label="Power off">
                        <i className="fa-solid fa-power-off"></i>
                    </button>
                    <span className="font-semibold text-white">Power off</span>
                </div>
                 <div className="flex flex-col items-center space-y-3">
                    <button onClick={onReboot} className="w-20 h-20 rounded-full bg-blue-500/80 hover:bg-blue-500 flex items-center justify-center text-white text-3xl transition-colors active:scale-95" aria-label="Reboot">
                        <i className="fa-solid fa-arrows-rotate"></i>
                    </button>
                    <span className="font-semibold text-white">Reboot</span>
                </div>
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [preBootFinished, setPreBootFinished] = useState<boolean>(false);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [openApps, setOpenApps] = useState<AppId[]>([]);
    const [activeApp, setActiveApp] = useState<AppId | null>(null);
    const [showTaskSwitcher, setShowTaskSwitcher] = useState<boolean>(false);
    const [isControlCenterOpen, setIsControlCenterOpen] = useState<boolean>(false);
    const [viewingAppInfo, setViewingAppInfo] = useState<AppId | null>(null);
    const [batteryLevel, setBatteryLevel] = useState<number>(100);
    const [isCharging, setIsCharging] = useState<boolean>(false);
    const [isPoweredOff, setIsPoweredOff] = useState<boolean>(false);
    const [modeSelected, setModeSelected] = useState<boolean>(false);
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [showPowerMenu, setShowPowerMenu] = useState<boolean>(false);
    // FIX: Add state for notification shade visibility, the notifications themselves, and for deep-linking into settings.
    const [isShadeOpen, setIsShadeOpen] = useState<boolean>(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [targetSettingsView, setTargetSettingsView] = useState<string | null>(null);
    const { usagePercentage } = useStorage();
    const [hasUnreadUpdate, setHasUnreadUpdate] = useState<boolean>(true);
    const [fps, setFps] = useState(0);
    const frameCountRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const [usedRamMB, setUsedRamMB] = useState(0);
    const totalRamMB = 80;
    // FIX: Add state to track memory usage per open app.
    const [openAppsRamUsage, setOpenAppsRamUsage] = useState<{ [key in AppId]?: number }>({});

    // --- Pre-Boot Timer ---
    useEffect(() => {
        const timer = setTimeout(() => {
            setPreBootFinished(true);
        }, 3500); // Wait for the splash animation
        return () => clearTimeout(timer);
    }, []);


    // --- RAM Simulation based on open apps ---
    useEffect(() => {
        const baseRamUsage = 50; // OS background processes
        
        const openAppDefs = openApps
            .map(id => APPS.find(app => app.id === id))
            .filter((app): app is AppDefinition => !!app && !!app.ramUsageMB);

        let totalAppsRamUsage = 0;
        const newAppsRamUsage: { [key in AppId]?: number } = {};

        openAppDefs.forEach(app => {
            const { min, max } = app.ramUsageMB!;
            const usage = min + Math.random() * (max - min);
            newAppsRamUsage[app.id] = usage;
            totalAppsRamUsage += usage;
        });

        setOpenAppsRamUsage(newAppsRamUsage);
        setUsedRamMB(Math.min(baseRamUsage + totalAppsRamUsage, totalRamMB));
    }, [openApps]);


    // --- FPS Counter ---
    useEffect(() => {
        const ramUsagePercentage = (usedRamMB / totalRamMB) * 100;
        let animationFrameId: number;

        const calculateFps = (now: number) => {
            // Introduce lag if RAM usage is high
            if (ramUsagePercentage >= 90) {
                // More usage = more lag.
                // Scale the lag from 0 (at 90%) to a max value (at 100%).
                const lagFactor = (ramUsagePercentage - 90) / 10;
                // This loop blocks the main thread, reducing FPS.
                // Adjust the multiplier to control the maximum lag severity.
                for (let i = 0; i < lagFactor * 3000000; i++) {
                    // This is intentionally a blocking, synchronous operation.
                }
            }

            frameCountRef.current++;
            const delta = now - lastTimeRef.current;
            if (delta >= 1000) { // Update FPS every second
                const calculatedFps = Math.round((frameCountRef.current * 1000) / delta);
                setFps(calculatedFps);
                frameCountRef.current = 0;
                lastTimeRef.current = now;
            }
            animationFrameId = requestAnimationFrame(calculateFps);
        };
        animationFrameId = requestAnimationFrame(calculateFps);
        return () => cancelAnimationFrame(animationFrameId);
    }, [usedRamMB, totalRamMB]);


    const isConnected = useMemo(() => {
        return !settings.airplaneMode && settings.internetMode !== 'off';
    }, [settings.airplaneMode, settings.internetMode]);
    
    const batteryIntervalRef = useRef<number | null>(null);
    
    const stopBatteryInterval = useCallback(() => {
        if (batteryIntervalRef.current) {
            clearInterval(batteryIntervalRef.current);
            batteryIntervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (isPoweredOff) {
            stopBatteryInterval();
            return;
        }
        
        stopBatteryInterval();

        const drainInterval = settings.powerSavingMode ? 9000 : 7000; // 9s in power saving, 7s otherwise
        const chargeInterval = drainInterval * 2; // 18s in power saving, 14s otherwise

        if(isCharging) {
            batteryIntervalRef.current = window.setInterval(() => {
                setBatteryLevel(prev => {
                    if (prev >= 100) return 100;
                    return prev + 1;
                });
            }, chargeInterval);
        } else {
             batteryIntervalRef.current = window.setInterval(() => {
                setBatteryLevel(prev => {
                    if (prev <= 1) {
                        setIsPoweredOff(true);
                        setOpenApps([]);
                        setActiveApp(null);
                        setShowTaskSwitcher(false);
                        setViewingAppInfo(null);
                        setIsCharging(false); // Can't charge if dead
                        return 0;
                    }
                    return prev - 1;
                });
            }, drainInterval);
        }

        return () => stopBatteryInterval();
    }, [isPoweredOff, isCharging, stopBatteryInterval, settings.powerSavingMode]);

    // FIX: Add a sample notification after the boot sequence completes to demonstrate the feature.
    
    useEffect(() => {
        if (!modeSelected) return; // Only run after mode is selected and boot starts
        const timer = setTimeout(() => {
            setNotifications([
                {
                    id: 1,
                    title: 'System Update',
                    message: 'VanguardOS 9 is now available.',
                    icon: 'fa-solid fa-cloud-arrow-down',
                    iconColor: 'text-cyan-400',
                    timestamp: new Date(),
                    appIdToOpen: 'app_updates',
                }
            ]);
        }, 6000); // After boot animation (5s) + 1s delay

        return () => clearTimeout(timer);
    }, [modeSelected]);
    

    const handleModeSelect = (mode: DeviceMode) => {
        setSettings(prev => ({...prev, deviceMode: mode}));
        setModeSelected(true);
        setOpenApps(['boot']);
        setActiveApp('boot');
    };
    
    const resetSystemState = useCallback(() => {
        setOpenApps([]);
        setActiveApp(null);
        setShowTaskSwitcher(false);
        setIsControlCenterOpen(false);
        setViewingAppInfo(null);
        setIsLocked(false);
        setShowPowerMenu(false);
    }, []);

    const handlePowerOn = useCallback(() => {
        setIsPoweredOff(false);
        if (batteryLevel === 0) {
            setBatteryLevel(5); // Give a little juice to start up
        }
        setOpenApps(['boot']);
        setActiveApp('boot');
    }, [batteryLevel]);
    
    const handlePowerOff = useCallback(() => {
        setShowPowerMenu(false);
        setIsPoweredOff(true);
        resetSystemState();
    }, [resetSystemState]);

    const handleReboot = useCallback(() => {
        resetSystemState();
        setShowPowerMenu(false);
        setOpenApps(['boot']);
        setActiveApp('boot');
    }, [resetSystemState]);

    const openApp = useCallback((appId: AppId) => {
        if (appId === 'app_updates') {
            setHasUnreadUpdate(false);
        }
        if (!openApps.includes(appId)) {
            setOpenApps(prev => [...prev, appId]);
        }
        setActiveApp(appId);
        setShowTaskSwitcher(false);
    }, [openApps]);

    const closeApp = useCallback((appId: AppId) => {
        setOpenApps(prev => prev.filter(id => id !== appId));
        if (activeApp === appId) {
            setActiveApp(null);
        }
        if (openApps.filter(id => id !== 'boot' && id !== appId).length === 0) {
            setShowTaskSwitcher(false);
        }
        if (appId === 'boot') {
            setIsLocked(true);
        }
    }, [activeApp, openApps, setIsLocked]);
    
    const goToHomeScreen = useCallback(() => {
        setActiveApp(null);
        setShowTaskSwitcher(false);
    }, []);

    const toggleTaskSwitcher = useCallback(() => {
        if (!showTaskSwitcher) {
           setActiveApp(null);
        }
        setShowTaskSwitcher(prev => !prev);
    }, [showTaskSwitcher]);
    
    const toggleControlCenter = useCallback(() => {
        setIsControlCenterOpen(prev => !prev);
    }, []);

    // FIX: Add handlers for managing the notification shade.
    const toggleShade = useCallback(() => setIsShadeOpen(prev => !prev), []);
    const dismissNotification = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const showAppInfo = useCallback((appId: AppId) => setViewingAppInfo(appId), []);
    const hideAppInfo = useCallback(() => setViewingAppInfo(null), []);
    const handleLock = useCallback(() => setIsLocked(true), []);
    const handleUnlock = useCallback(() => setIsLocked(false), []);
    const handleShowPowerMenu = useCallback(() => setShowPowerMenu(true), []);
    const handleClosePowerMenu = useCallback(() => setShowPowerMenu(false), []);

    // FIX: Update context value to provide notification and deep-link functionality to child components.
    
    const contextValue = useMemo(() => ({
        settings, setSettings, openApp, closeApp, activeApp, setActiveApp, openApps, showAppInfo, isConnected, batteryLevel, isCharging, setIsCharging, goToHomeScreen, hasUnreadUpdate, storageUsagePercentage: usagePercentage,
        notifications, dismissNotification, toggleShade, setTargetSettingsView, targetSettingsView, fps, usedRamMB, totalRamMB,
        // FIX: Add openAppsRamUsage to context value and dependency array.
        openAppsRamUsage,
    }), [settings, openApp, closeApp, activeApp, openApps, showAppInfo, isConnected, batteryLevel, isCharging, setIsCharging, goToHomeScreen, hasUnreadUpdate, usagePercentage, notifications, dismissNotification, toggleShade, targetSettingsView, setTargetSettingsView, fps, usedRamMB, totalRamMB, openAppsRamUsage]);

    const isBooting = activeApp === 'boot' && openApps.includes('boot');
    const BootAppComponent = useMemo(() => APPS.find(app => app.id === 'boot')?.component, []);
    const appToShowInfo = useMemo(() => viewingAppInfo ? APPS.find(app => app.id === viewingAppInfo) : null, [viewingAppInfo]);

    const wallpaperStyle = {
        backgroundImage: `url(${settings.wallpaperUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    const deviceModeClasses = settings.deviceMode === 'laptop' ? 'sm:aspect-video sm:w-full sm:max-w-6xl' : 'sm:aspect-[41/59] sm:w-auto sm:max-w-full';
    const dynamicContainerClasses = !modeSelected ? 'sm:aspect-video sm:w-full sm:max-w-4xl' : deviceModeClasses;

    return (
        <AppContext.Provider value={contextValue}>
            <div className="w-screen h-screen bg-cover bg-center" style={{ backgroundImage: `url(${settings.wallpaperUrl})` }}>
                <div className="w-full h-full bg-black/50 backdrop-blur-lg flex justify-center items-center p-0 sm:p-2 md:p-4 lg:p-6">
                    <div className={`w-full h-full sm:h-auto sm:max-h-full rounded-none sm:rounded-[60px] shadow-2xl overflow-hidden relative flex flex-col bg-black transition-all duration-500 ${settings.theme} ${dynamicContainerClasses}`}>
                        {!preBootFinished ? (
                             <PreBootScreen />
                        ) : !modeSelected ? (
                            <ModeSelectionScreen onSelect={handleModeSelect} />
                        ) : isPoweredOff ? (
                            <PoweredOffScreen onPowerOn={handlePowerOn} batteryLevel={batteryLevel} isCharging={isCharging} />
                        ) : (
                            <>
                                {isBooting && BootAppComponent ? (
                                    <BootAppComponent />
                                ) : (
                                    <>
                                        <div style={wallpaperStyle} className="absolute inset-0 transition-all duration-500">
                                            <div className={`absolute inset-0 ${settings.theme === 'dark' ? 'bg-black/50' : 'bg-white/10'}`}></div>
                                        </div>

                                        {!isLocked && (
                                            <div className="relative z-10 grid grid-rows-[1fr_auto] h-full">
                                                <main className="relative overflow-hidden">
                                                    <StatusBar toggleControlCenter={toggleControlCenter} onLock={handleLock} onShowPowerMenu={handleShowPowerMenu} />
                                                    {/* FIX: Hide HomeScreen when the notification shade is open. */}
                                                    <HomeScreen isHidden={!!activeApp || showTaskSwitcher || isControlCenterOpen || isShadeOpen} />
                                                    <TaskSwitcher isVisible={showTaskSwitcher} onAppSelect={openApp} onDismiss={toggleTaskSwitcher} />

                                                    {openApps.map(appId => {
                                                        if (appId === 'boot') return null;
                                                        const AppToRender = APPS.find(app => app.id === appId)?.component;
                                                        if (!AppToRender) return null;
                                                        return (
                                                            <div key={appId} className={`absolute inset-0 z-20 transition-transform duration-300 ease-in-out ${activeApp === appId ? 'translate-x-0' : 'translate-x-full pointer-events-none'}`}>
                                                                <AppToRender />
                                                            </div>
                                                        );
                                                    })}
                                                </main>
                                                
                                                {settings.deviceMode === 'smartphone' && (
                                                    <NavBar onHome={goToHomeScreen} onLock={handleLock} onShowPowerMenu={handleShowPowerMenu} />
                                                )}

                                            </div>
                                        )}
                                        
                                        {/* FIX: Render the Shade and ControlCenter components. */}
                                        <Shade isOpen={isShadeOpen} onClose={toggleShade} />
                                        <ControlCenter isOpen={isControlCenterOpen} onClose={toggleControlCenter} />
                                        {viewingAppInfo && appToShowInfo && (
                                            <AppInfo app={appToShowInfo} onClose={hideAppInfo} />
                                        )}
                                        {isLocked && <LockScreen onUnlock={handleUnlock} />}
                                        {showPowerMenu && <PowerMenu onPowerOff={handlePowerOff} onReboot={handleReboot} onClose={handleClosePowerMenu} />}
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AppContext.Provider>
    );
};

export default App;
