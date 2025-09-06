import React, { useContext, useState, useMemo, useEffect } from 'react';
import AppContainer from '../components/AppContainer.tsx';
import { AppContext } from '../context.ts';
import { AppContextType, InternetMode, AppDefinition, AppId } from '../types.ts';
import { WALLPAPERS, APPS, WIFI_NETWORKS, CELLULAR_NETWORKS, VBLUETOOTH_NETWORKS, SYSTEM_UPDATES_SIZES_MB } from '../constants.tsx';
import OSLogo from '../components/OSLogo.tsx';

// --- Constants for storage breakdown ---
const IMAGE_STORAGE_KB = 45 * 1024; // 45 images * 1MB/image
const TOTAL_STORAGE_MB = 144;


// --- Helper Functions ---
const formatStorage = (kb: number): string => {
    if (kb < 1024) return `${kb} KB`;
    return `${Math.round(kb / 1024)} MB`;
};

// --- Generic Components ---
const SubViewContainer: React.FC<{ title: string; children: React.ReactNode; onBack: () => void, settings: AppContextType['settings'] }> = ({ title, onBack, children, settings }) => {
    const paddingTopClass = settings.deviceMode === 'laptop' ? 'pt-4' : 'pt-12';
    const paddingBottomClass = settings.deviceMode === 'laptop' ? 'pb-10' : '';

    return (
        <div className={`w-full h-full flex flex-col bg-gradient-to-br from-v-bg-light to-gray-200/90 dark:from-v-bg-dark dark:to-black/80 backdrop-blur-xl text-v-text-light dark:text-v-text-dark ${paddingTopClass} ${paddingBottomClass}`}>
            <header className="flex-shrink-0 h-20 flex items-center px-4">
                <button
                    onClick={onBack}
                    className="p-3 -ml-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                    aria-label="Go back"
                >
                    <i className="fa-solid fa-arrow-left w-5 h-5"></i>
                </button>
                <h1 className="text-2xl font-bold ml-2 tracking-tight">{title}</h1>
            </header>
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </div>
    );
};


const SignalStrengthIndicator: React.FC<{ level: number, maxLevel: number }> = ({ level, maxLevel }) => (
    <div className="flex items-end space-x-0.5 h-4 w-5">
        {Array.from({ length: maxLevel }).map((_, i) => (
            <div
                key={i}
                className={`w-1 rounded-full ${i < level ? 'bg-v-text-light dark:bg-v-text-dark' : 'bg-gray-300 dark:bg-gray-600'}`}
                style={{ height: `${((i + 1) / maxLevel) * 100}%` }}
            />
        ))}
    </div>
);

const WifiSignalIndicator: React.FC<{ level: number }> = ({ level }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8.82a19 19 0 0 1 20 0" className={level >= 4 ? 'opacity-100' : 'opacity-30'}></path>
        <path d="M5 12.55a11 11 0 0 1 14.08 0" className={level >= 3 ? 'opacity-100' : 'opacity-30'}></path>
        <path d="M8.5 16.05a6 6 0 0 1 7 0" className={level >= 2 ? 'opacity-100' : 'opacity-30'}></path>
        <line x1="12" y1="20" x2="12.01" y2="20" className={level >= 1 ? 'opacity-100' : 'opacity-30'}></line>
    </svg>
);


// --- View Components ---

const VBluetoothSelectionView: React.FC<{ setView: (view: 'internet') => void; settings: AppContextType['settings']; setSettings: AppContextType['setSettings']; }> = ({ setView, settings, setSettings }) => {
    const handleSelect = (id: string) => {
        setSettings(prev => ({ ...prev, selectedVBluetoothId: id, internetMode: 'vbluetooth' }));
        setView('internet');
    };

    return (
        <SubViewContainer title="VBluetooth" onBack={() => setView('internet')} settings={settings}>
            <div className="p-4">
                <ul className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                    {VBLUETOOTH_NETWORKS.map(net => (
                        <li key={net.id}>
                            <button onClick={() => handleSelect(net.id)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                                <span className="font-semibold">{net.name}</span>
                                {settings.selectedVBluetoothId === net.id && <i className="fa-solid fa-check text-v-primary"></i>}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </SubViewContainer>
    );
};

const NetworkSelectionView: React.FC<{ setView: (view: 'internet') => void; settings: AppContextType['settings']; setSettings: AppContextType['setSettings']; }> = ({ setView, settings, setSettings }) => {
    const handleSelect = (id: string) => {
        setSettings(prev => ({ ...prev, selectedNetworkId: id, internetMode: 'network' }));
        setView('internet');
    };

    return (
        <SubViewContainer title="Cellular Network" onBack={() => setView('internet')} settings={settings}>
            <div className="p-4">
                <ul className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                    {CELLULAR_NETWORKS.map(net => (
                        <li key={net.id}>
                            <button onClick={() => handleSelect(net.id)} disabled={net.status === 'unavailable'} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 disabled:opacity-50 disabled:hover:bg-transparent">
                                <div className="flex flex-col">
                                    <span className="font-semibold">{net.name}</span>
                                    {net.status === 'unavailable' && <span className="text-xs text-red-500">Unavailable</span>}
                                </div>
                                <div className="flex items-center space-x-3">
                                    <SignalStrengthIndicator level={net.signal} maxLevel={net.maxSignal} />
                                    {settings.selectedNetworkId === net.id && <i className="fa-solid fa-check text-v-primary"></i>}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </SubViewContainer>
    );
};

const WifiSelectionView: React.FC<{ setView: (view: 'internet') => void; settings: AppContextType['settings']; setSettings: AppContextType['setSettings']; }> = ({ setView, settings, setSettings }) => {
    const handleSelect = (wifiId: string) => {
        setSettings(prev => ({ ...prev, selectedWifiId: wifiId, internetMode: 'wifi' }));
        setView('internet');
    };
    
    return (
        <SubViewContainer title="Wi-Fi" onBack={() => setView('internet')} settings={settings}>
            <div className="p-4">
                <ul className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                    {WIFI_NETWORKS.map(net => (
                        <li key={net.id}>
                            <button onClick={() => handleSelect(net.id)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                                <span className="font-semibold">{net.name}</span>
                                <div className="flex items-center space-x-3">
                                    <WifiSignalIndicator level={net.signal} />
                                    {settings.selectedWifiId === net.id && settings.internetMode === 'wifi' && <i className="fa-solid fa-check text-v-primary"></i>}
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </SubViewContainer>
    );
};

const InternetView: React.FC<{ setView: (view: any) => void; settings: AppContextType['settings']; setSettings: AppContextType['setSettings']; }> = ({ setView, settings, setSettings }) => {
    const changeMode = (mode: InternetMode) => {
        setSettings(prev => ({...prev, internetMode: mode}));
    };
    
    const selectedWifi = WIFI_NETWORKS.find(n => n.id === settings.selectedWifiId);
    const selectedNetwork = CELLULAR_NETWORKS.find(n => n.id === settings.selectedNetworkId);
    const selectedVBluetooth = VBLUETOOTH_NETWORKS.find(n => n.id === settings.selectedVBluetoothId);
    
    return (
        <SubViewContainer title="Network & Internet" onBack={() => setView('main')} settings={settings}>
            <div className="p-4 space-y-4">
                 <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                    <button onClick={() => setView('wifi')} className="w-full flex items-center p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                        <div className="w-8 mr-2 flex items-center justify-center text-v-text-secondary-light dark:text-v-text-secondary-dark">
                            <WifiSignalIndicator level={settings.internetMode === 'wifi' ? selectedWifi?.signal ?? 0 : 0} />
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-semibold">Wi-Fi</h3>
                            <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{settings.internetMode === 'wifi' ? selectedWifi?.name : 'Off'}</p>
                        </div>
                        <input type="radio" name="internet-mode" checked={settings.internetMode === 'wifi'} onChange={() => changeMode('wifi')} className="form-radio h-5 w-5 text-v-primary bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-v-primary" />
                    </button>
                    <button onClick={() => setView('network')} className="w-full flex items-center p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                         <div className="w-8 mr-2"><i className="fa-solid fa-signal text-xl text-center"></i></div>
                        <div className="flex-grow">
                            <h3 className="font-semibold">Network</h3>
                            <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{settings.internetMode === 'network' ? selectedNetwork?.name : 'Off'}</p>
                        </div>
                         <input type="radio" name="internet-mode" checked={settings.internetMode === 'network'} onChange={() => changeMode('network')} className="form-radio h-5 w-5 text-v-primary bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-v-primary" />
                    </button>
                    <button onClick={() => setView('vbluetooth')} className="w-full flex items-center p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50">
                         <div className="w-8 mr-2"><i className="fa-brands fa-bluetooth-b text-xl text-center"></i></div>
                        <div className="flex-grow">
                            <h3 className="font-semibold">VBluetooth</h3>
                            <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{settings.internetMode === 'vbluetooth' ? selectedVBluetooth?.name : 'Off'}</p>
                        </div>
                         <input type="radio" name="internet-mode" checked={settings.internetMode === 'vbluetooth'} onChange={() => changeMode('vbluetooth')} className="form-radio h-5 w-5 text-v-primary bg-gray-200 dark:bg-gray-600 border-gray-300 dark:border-gray-500 focus:ring-v-primary" />
                    </button>
                 </div>
            </div>
        </SubViewContainer>
    );
};


const PersonalizationView: React.FC<{ setView: (view: 'main') => void; settings: AppContextType['settings']; setSettings: AppContextType['setSettings']; }> = ({ setView, settings, setSettings }) => {
    return (
        <SubViewContainer title="Personalization" onBack={() => setView('main')} settings={settings}>
            <div className="px-6 py-4">
                <div>
                    <h2 className="text-lg font-semibold mb-4">Wallpaper</h2>
                    <div className="grid grid-cols-3 gap-4">
                        {WALLPAPERS.map(wallpaper => (
                            <div key={wallpaper.name} onClick={() => setSettings(p => ({...p, wallpaperUrl: wallpaper.url}))} className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer ring-2 ${settings.wallpaperUrl === wallpaper.url ? 'ring-v-primary' : 'ring-transparent'} transition-all transform hover:scale-105`}>
                                <img src={wallpaper.url} alt={wallpaper.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20 ring-1 ring-inset ring-white/10"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SubViewContainer>
    );
};

const AboutPhoneView: React.FC<{ setView: (view: 'main') => void; settings: AppContextType['settings']; }> = ({ setView, settings }) => {
    const deviceInfo = [ { label: 'Model', value: 'VNAAIG2' }, { label: 'Chipset', value: 'Snapdragon S2' }, { label: 'Display', value: '60 FPS Support' }, { label: 'ROM', value: '144 MB' }, { label: 'RAM', value: '80 MB' }, { label: 'Battery', value: '700 mAh' }, { label: 'Build Number', value: 'VNAAISG9-120925' }, { label: 'GPU', value: 'Adreno 600' }, ];
    return (
        <SubViewContainer title="About Phone" onBack={() => setView('main')} settings={settings}>
            <div className="p-4">
                <div className="text-center mb-6 py-8 bg-v-surface-light dark:bg-v-surface-dark rounded-xl">
                    <OSLogo className="mx-auto" />
                    <h2 className="text-2xl font-bold mt-2">VanguardOS</h2>
                    <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">Version 9</p>
                </div>
                <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                    {deviceInfo.map(item => (
                        <div key={item.label} className="px-4 py-3 flex justify-between items-center">
                            <span className="font-semibold text-sm">{item.label}</span>
                            <span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark text-right">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </SubViewContainer>
    )
};

const AppsView: React.FC<{ setView: (view: 'main') => void; showAppInfo: AppContextType['showAppInfo']; settings: AppContextType['settings']; }> = ({ setView, showAppInfo, settings }) => {
    const userApps = APPS.filter(app => app.id !== 'boot' && app.storageUsageKB);
    return (
        <SubViewContainer title="Apps" onBack={() => setView('main')} settings={settings}>
            <div className="p-4">
                <ul className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                    {userApps.map(app => (
                        <li key={app.id}>
                            <button onClick={() => showAppInfo(app.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors" aria-label={`View app info for ${app.name}`}>
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 flex items-center justify-center">{app.icon}</div>
                                    <span className="font-semibold">{app.name}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{formatStorage(app.storageUsageKB!)}</span>
                                    <i className="fa-solid fa-chevron-right text-v-text-secondary-light dark:text-v-text-secondary-dark text-xs"></i>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </SubViewContainer>
    );
};

const StorageDetailView: React.FC<{ setView: (view: 'main' | 'apps') => void; totalUsedStorageMB: number; appStorageKB: number; systemStorageKB: number; settings: AppContextType['settings']; }> = ({ setView, totalUsedStorageMB, appStorageKB, systemStorageKB, settings }) => {
    return (
        <SubViewContainer title="Storage" onBack={() => setView('main')} settings={settings}>
            <div className="p-4 space-y-6">
                <div>
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="font-semibold">Device Storage</span>
                            <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(totalUsedStorageMB)} MB / {TOTAL_STORAGE_MB} MB</p>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                            <div className="bg-gradient-to-r from-v-accent to-v-primary h-4 rounded-full" style={{ width: `${(totalUsedStorageMB / TOTAL_STORAGE_MB) * 100}%` }}></div>
                        </div>
                    </div>
                </div>
                 <div>
                    <h2 className="text-sm font-semibold text-v-text-secondary-light dark:text-v-text-secondary-dark mb-2 px-2">Categories</h2>
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                        <button onClick={() => setView('apps')} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors rounded-t-xl">
                            <div className="flex items-center space-x-3"><i className="fa-solid fa-box-archive w-5 text-center text-v-primary"></i><span className="font-semibold">Apps</span></div>
                            <div className="flex items-center space-x-3"><span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{formatStorage(appStorageKB)}</span><i className="fa-solid fa-chevron-right text-v-text-secondary-light dark:text-v-text-secondary-dark"></i></div>
                        </button>
                        <div className="w-full flex items-center justify-between p-3 text-left">
                            <div className="flex items-center space-x-3"><i className="fa-solid fa-images w-5 text-center text-sky-500"></i><span className="font-semibold">Images</span></div>
                            <div className="flex items-center space-x-3"><span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{formatStorage(IMAGE_STORAGE_KB)}</span></div>
                        </div>
                        <div className="w-full flex items-center justify-between p-3 text-left rounded-b-xl">
                            <div className="flex items-center space-x-3"><i className="fa-solid fa-database w-5 text-center text-gray-500"></i><span className="font-semibold">System</span></div>
                            <div className="flex items-center space-x-3"><span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{formatStorage(systemStorageKB)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </SubViewContainer>
    );
};

const BatteryView: React.FC<{ setView: (view: 'main') => void; settings: AppContextType['settings']; setSettings: AppContextType['setSettings']; batteryLevel: number; isCharging: boolean; setIsCharging: AppContextType['setIsCharging']; }> = ({ setView, settings, setSettings, batteryLevel, isCharging, setIsCharging }) => {
    
    const getBatteryIcon = () => {
        if (isCharging) return 'fa-battery-bolt';
        if (batteryLevel <= 15) return 'fa-battery-empty';
        if (batteryLevel <= 30) return 'fa-battery-quarter';
        if (batteryLevel <= 60) return 'fa-battery-half';
        if (batteryLevel <= 90) return 'fa-battery-three-quarters';
        return 'fa-battery-full';
    };

    const getBatteryColor = () => {
        if (isCharging) return 'text-green-500';
        if (batteryLevel <= 15) return 'text-red-500';
        return 'text-v-text-light dark:text-v-text-dark';
    }

    return (
        <SubViewContainer title="Battery" onBack={() => setView('main')} settings={settings}>
            <div className="p-4 space-y-6">
                 <div className="text-center py-8 bg-v-surface-light dark:bg-v-surface-dark rounded-xl">
                    <div className="relative inline-block">
                        <i className={`fa-solid ${getBatteryIcon()} text-8xl ${getBatteryColor()}`}></i>
                        {isCharging && <i className="fa-solid fa-bolt text-yellow-400 text-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></i>}
                    </div>
                    <h2 className="text-5xl font-bold mt-4">{batteryLevel}%</h2>
                    <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{isCharging ? 'Charging' : 'Not Charging'}</p>
                </div>
                <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4 flex justify-between items-center">
                    <span className="font-semibold text-lg">Charging</span>
                    <button onClick={() => setIsCharging(prev => !prev)} aria-label={`Toggle charging ${isCharging ? 'off' : 'on'}`} className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors ${isCharging ? 'bg-v-primary justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                        <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
                    </button>
                </div>
                <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-semibold text-lg">Power Saving</span>
                            <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">Extends battery life</p>
                        </div>
                        <button onClick={() => setSettings(prev => ({ ...prev, powerSavingMode: !prev.powerSavingMode }))} aria-label={`Toggle power saving ${settings.powerSavingMode ? 'off' : 'on'}`} className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors ${settings.powerSavingMode ? 'bg-v-primary justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                            <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
                        </button>
                    </div>
                </div>
            </div>
        </SubViewContainer>
    );
};

const SystemUpdatesView: React.FC<{ setView: (view: 'main') => void; settings: AppContextType['settings']; }> = ({ setView, settings }) => {
    return (
        <SubViewContainer title="System Updates" onBack={() => setView('main')} settings={settings}>
            <div className="px-6 py-4 space-y-8">
                <div className="text-center py-8 bg-v-surface-light dark:bg-v-surface-dark rounded-xl shadow-sm">
                    <i className="fa-solid fa-check-circle text-green-500 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-bold text-v-text-light dark:text-v-text-dark">VanguardOS 9</h2>
                    <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">Your system is up to date.</p>
                </div>

                <div>
                    <div className="flex justify-between items-baseline border-b pb-2 border-gray-200 dark:border-gray-700 mb-3">
                        <h3 className="text-lg font-semibold">What's New in Version 9</h3>
                        <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['9']} MB</span>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-v-text-light dark:text-v-text-dark p-2">
                        <li>
                            <span className="font-semibold">Performance Boost:</span> Added support for 60 FPS, making the entire OS smoother and more responsive.
                        </li>
                        <li>
                            <span className="font-semibold">Performance Stats:</span> New section in Settings to monitor real-time FPS, RAM, and Storage usage.
                        </li>
                        <li>
                            <span className="font-semibold">System Stability:</span> General bug fixes and performance improvements across all apps.
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">Previous Versions</h3>
                    <div className="space-y-4 p-2">
                        <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 8</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['8']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>
                                    <span className="font-semibold">Hardware Upgrade:</span> New VNAAIG2 model with Snapdragon S2 chipset and Adreno 600 GPU.
                                </li>
                                <li>
                                    <span className="font-semibold">Increased Memory:</span> ROM increased to 144MB and RAM to 80MB.
                                </li>
                                <li>
                                    <span className="font-semibold">Enhanced Battery:</span> Capacity increased to 700mAh, improving battery drain efficiency by ~15%.
                                </li>
                            </ul>
                        </div>
                         <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 7</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['7']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>
                                    <span className="font-semibold">Power Saving Mode:</span> A new feature in the Battery settings to extend battery life.
                                </li>
                                <li>
                                    <span className="font-semibold">Status Bar Enhancements:</span> New icons to indicate charging status and active Power Saving Mode.
                                </li>
                            </ul>
                        </div>
                        <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 6</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['6']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>AI App Upgrades: Gallery and Notepad were enhanced with AI capabilities.</li>
                                <li>All core applications updated to version 6 for performance improvements.</li>
                            </ul>
                        </div>
                        <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS V</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['V']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>New Battery section in Settings with charging controls.</li>
                                <li>The power-off screen now displays charging status and low battery warnings.</li>
                                <li>Removed the Permissions section from Settings for a cleaner interface.</li>
                                <li>Increased supported RAM to 72MB, ROM to 136MB, and battery to 600mAh.</li>
                                <li>Improved battery longevity by 20% to match new hardware standards.</li>
                                <li>Added three new high-resolution wallpapers to personalize your device.</li>
                            </ul>
                        </div>
                        <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 4.0</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['4.0']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>The File Manager app has been deprecated to streamline the OS.</li>
                                <li>Refined the boot screen for better text alignment on all devices.</li>
                                <li>General bug fixes and performance improvements.</li>
                            </ul>
                        </div>
                        <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 3.0</h4>
                                  <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['3.0']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>
                                    <span className="font-semibold">Network & Internet Management:</span> Added a new panel in Settings to control Wi-Fi, Cellular, and VBluetooth connections.
                                </li>
                                 <li>
                                    <span className="font-semibold">Dynamic Status Bar:</span> The status bar now reflects the active connection type and signal strength in real-time.
                                </li>
                            </ul>
                        </div>
                         <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 2.0</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['2.0']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>Added Calculator, Calendar, Clock, and App Updates.</li>
                                <li>Introduced the Permissions Manager in Settings.</li>
                                <li>Enhanced Control Center with functional Airplane Mode and Auto-Rotate.</li>
                                <li>Implemented Virtual Bluetooth technology.</li>
                            </ul>
                        </div>
                         <div>
                             <div className="flex justify-between items-baseline">
                                 <h4 className="font-bold">VanguardOS 1.0</h4>
                                 <span className="text-sm font-medium text-v-text-secondary-light dark:text-v-text-secondary-dark">{SYSTEM_UPDATES_SIZES_MB['1.0']} MB</span>
                             </div>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>Initial release of VanguardOS.</li>
                                <li>Core apps: AI Assistant, Gallery, Notepad, Settings.</li>
                                <li>Introduced the modern UI/UX with light and dark themes.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SubViewContainer>
    );
};

const MemoryAppsView: React.FC<{ setView: (view: string) => void; context: AppContextType; }> = ({ setView, context }) => {
    const { settings, openApps, openAppsRamUsage } = context;

    // Get definitions for open apps that have RAM usage info
    const openAppDefs = openApps
        .map(id => {
            const appDef = APPS.find(app => app.id === id);
            const ramUsage = openAppsRamUsage[id];
            // Only include apps that are open, have a definition, and have a RAM usage value
            return (appDef && ramUsage) ? { ...appDef, ramUsage } : null;
        })
        .filter((app): app is (AppDefinition & { ramUsage: number }) => app !== null && app.id !== 'boot')
        .sort((a, b) => b.ramUsage - a.ramUsage); // Sort by RAM usage descending

    return (
        <SubViewContainer title="Memory Usage by App" onBack={() => setView('memory')} settings={settings}>
            <div className="p-4">
                {openAppDefs.length > 0 ? (
                    <ul className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                        {openAppDefs.map(app => (
                            <li key={app.id}>
                                <div className="w-full flex items-center justify-between p-4 text-left">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 flex items-center justify-center">{app.icon}</div>
                                        <span className="font-semibold">{app.name}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-v-text-secondary-light dark:text-v-text-secondary-dark">
                                        {Math.round(app.ramUsage)} MB
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-8 text-v-text-secondary-light dark:text-v-text-secondary-dark">No apps are currently open.</div>
                )}
            </div>
        </SubViewContainer>
    );
};

const MemoryView: React.FC<{ setView: (view: string) => void; context: AppContextType; }> = ({ setView, context }) => {
    const { settings, usedRamMB, totalRamMB, openAppsRamUsage } = context;
    const ramUsagePercentage = (usedRamMB / totalRamMB) * 100;

    // Correctly calculate total app RAM usage by summing up individual app usages
    const appsRamUsage = Object.values(openAppsRamUsage).reduce((sum, usage) => sum + (usage || 0), 0);

    // System RAM is the total used RAM minus the sum of app RAM. Ensure it's not negative.
    const systemRamUsage = Math.max(0, usedRamMB - appsRamUsage);
    const freeRamMB = totalRamMB - usedRamMB;
    
    return (
        <SubViewContainer title="Memory" onBack={() => setView('main')} settings={settings}>
            <div className="p-4 space-y-6">
                <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4">
                     <div className="flex justify-between items-baseline mb-2">
                        <span className="font-semibold">Memory Usage</span>
                        <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(usedRamMB)} MB / {totalRamMB} MB</p>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div 
                            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-sky-400 to-sky-600 rounded-full" 
                            style={{ width: `${ramUsagePercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div>
                    <h2 className="text-sm font-semibold text-v-text-secondary-light dark:text-v-text-secondary-dark mb-2 px-2">Breakdown</h2>
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
                        <div className="w-full flex items-center justify-between p-3 text-left">
                            <div className="flex items-center space-x-3">
                                <i className="fa-solid fa-server w-5 text-center text-gray-500"></i>
                                <span className="font-semibold">System</span>
                            </div>
                            <span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(systemRamUsage)} MB</span>
                        </div>
                        <button onClick={() => setView('memory_apps')} className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex items-center space-x-3">
                                <i className="fa-solid fa-box-archive w-5 text-center text-v-primary"></i>
                                <span className="font-semibold">Apps</span>
                            </div>
                            <div className="flex items-center space-x-3">
                               <span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(appsRamUsage)} MB</span>
                               <i className="fa-solid fa-chevron-right text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark"></i>
                            </div>
                        </button>
                         <div className="w-full flex items-center justify-between p-3 text-left">
                            <div className="flex items-center space-x-3">
                                <i className="fa-solid fa-circle-half-stroke w-5 text-center text-green-500"></i>
                                <span className="font-semibold">Free</span>
                            </div>
                            <span className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(freeRamMB)} MB</span>
                        </div>
                    </div>
                </div>
            </div>
        </SubViewContainer>
    );
};

const PerformanceView: React.FC<{ setView: (view: 'main') => void; context: AppContextType; }> = ({ setView, context }) => {
    const { settings, fps, usedRamMB, totalRamMB, storageUsagePercentage } = context;
    const ramUsagePercentage = (usedRamMB / totalRamMB) * 100;
    const totalStorageMB = TOTAL_STORAGE_MB;
    const usedStorageMB = (storageUsagePercentage / 100) * totalStorageMB;

    const getFpsColor = () => {
        if (fps >= 55) return 'text-green-500';
        if (fps >= 40) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <SubViewContainer title="Performance Stats" onBack={() => setView('main')} settings={settings}>
            <div className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* FPS Card */}
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <i className={`fa-solid fa-film text-4xl mb-3 ${getFpsColor()}`}></i>
                        <h3 className="font-semibold text-lg">FPS</h3>
                        <p className={`text-5xl font-bold ${getFpsColor()}`}>{fps}</p>
                        <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">Frames Per Second</p>
                    </div>

                    {/* RAM Card */}
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <i className="fa-solid fa-microchip text-4xl mb-3 text-sky-500"></i>
                        <h3 className="font-semibold text-lg">RAM</h3>
                        <p className="text-5xl font-bold text-sky-500">{Math.round(ramUsagePercentage)}<span className="text-3xl">%</span></p>
                        <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(usedRamMB)} MB / {totalRamMB} MB</p>
                    </div>

                    {/* Storage Card */}
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4 flex flex-col items-center justify-center text-center">
                        <i className="fa-solid fa-database text-4xl mb-3 text-lime-500"></i>
                        <h3 className="font-semibold text-lg">Storage</h3>
                        <p className="text-5xl font-bold text-lime-500">{Math.round(storageUsagePercentage)}<span className="text-3xl">%</span></p>
                        <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{Math.round(usedStorageMB)} MB / {totalStorageMB} MB</p>
                    </div>
                </div>
            </div>
        </SubViewContainer>
    );
};


const MainView: React.FC<{ setView: (view: any) => void; settings: AppContextType['settings']; toggleTheme: () => void; }> = ({ setView, settings, toggleTheme }) => {
    const mainSettings = [
        { view: 'internet', icon: 'fa-wifi', label: 'Network & Internet', description: 'Wi-Fi, Cellular, VBluetooth', color: 'text-blue-500' },
        { view: 'personalization', icon: 'fa-palette', label: 'Personalization', description: 'Wallpaper, colors, style', color: 'text-purple-500' },
        { view: 'performance', icon: 'fa-gauge-high', label: 'Performance Stats', description: 'Real-time FPS, RAM & Storage', color: 'text-teal-500' },
        { view: 'memory', icon: 'fa-microchip', label: 'Memory', description: 'View memory usage by app', color: 'text-sky-500' },
        { view: 'apps', icon: 'fa-box-archive', label: 'Apps', description: 'Manage installed applications', color: 'text-orange-500' },
        { view: 'battery', icon: 'fa-battery-half', label: 'Battery', description: 'View status and toggle charging', color: 'text-lime-500' },
        { view: 'storage', icon: 'fa-hard-drive', label: 'Storage', description: 'View and manage storage', color: 'text-green-500' },
        { view: 'system_updates', icon: 'fa-mobile-screen', label: 'System Updates', description: 'Check for OS updates', color: 'text-cyan-500' },
        { view: 'about', icon: 'fa-circle-info', label: 'About Phone', description: 'Device info and OS version', color: 'text-gray-500' },
    ];
    
    return (
        <AppContainer title="Settings">
            <div className="px-6 py-2 space-y-4">
                <div className="flex justify-between items-center p-4 bg-v-surface-light dark:bg-v-surface-dark rounded-xl">
                    <div className="flex items-center space-x-4">
                        <i className="fa-solid fa-moon w-6 text-center text-xl"></i>
                        <span className="font-semibold text-lg">Dark Mode</span>
                    </div>
                    <button onClick={toggleTheme} aria-label={`Toggle dark mode ${settings.theme === 'dark' ? 'off' : 'on'}`} className={`w-14 h-8 rounded-full p-1 flex items-center transition-colors ${settings.theme === 'dark' ? 'bg-v-primary justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                        <div className="w-6 h-6 bg-white rounded-full shadow-md transform transition-transform"></div>
                    </button>
                </div>
                
                <div className="space-y-2">
                    {mainSettings.map(item => (
                        <button key={item.view} onClick={() => setView(item.view)} className="w-full p-3.5 bg-v-surface-light dark:bg-v-surface-dark rounded-xl flex items-center space-x-4 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 transform hover:scale-[1.01] active:scale-100 text-left">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color.replace('text-', 'bg-')}/20 dark:bg-opacity-20 ${item.color}`}>
                                <i className={`fa-solid ${item.icon} text-lg`}></i>
                            </div>
                            <div className="flex-grow">
                                <span className="font-semibold text-md">{item.label}</span>
                                <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{item.description}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <i className="fa-solid fa-chevron-right text-v-text-secondary-light dark:text-v-text-secondary-dark text-xs"></i>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </AppContainer>
    );
};

const SettingsApp: React.FC = () => {
    // FIX: Consume targetSettingsView and setTargetSettingsView from context to enable deep-linking from other parts of the OS.
    const context = useContext(AppContext) as AppContextType;
    const { settings, setSettings, showAppInfo, batteryLevel, isCharging, setIsCharging, targetSettingsView, setTargetSettingsView } = context;
    const [view, setView] = useState<string>('main');

    // FIX: Add an effect to listen for changes to targetSettingsView and navigate to the specified settings page.
    useEffect(() => {
        if (targetSettingsView) {
            setView(targetSettingsView);
            // Reset the target view so it doesn't trigger again on re-render.
            setTargetSettingsView(null);
        }
    }, [targetSettingsView, setTargetSettingsView]);

    const toggleTheme = () => setSettings(prev => ({ ...prev, theme: prev.theme === 'light' ? 'dark' : 'light' }));
    const appStorageKB = useMemo(() => APPS.reduce((total, app) => total + (app.storageUsageKB || 0), 0), []);
    
    // FIX: Moved systemStorageKB calculation inside the component to avoid circular dependency issues at module load time.
    const systemStorageKB = useMemo(() => Object.values(SYSTEM_UPDATES_SIZES_MB).reduce((sum, size) => sum + size, 0) * 1024, []);

    const totalUsedStorageKB = useMemo(() => appStorageKB + IMAGE_STORAGE_KB + systemStorageKB, [appStorageKB, systemStorageKB]);
    const totalUsedStorageMB = totalUsedStorageKB / 1024;

    switch(view) {
        case 'personalization': return <PersonalizationView setView={setView} settings={settings} setSettings={setSettings} />;
        case 'apps': return <AppsView setView={setView} showAppInfo={showAppInfo} settings={settings} />;
        case 'storage': return <StorageDetailView setView={setView} totalUsedStorageMB={totalUsedStorageMB} appStorageKB={appStorageKB} systemStorageKB={systemStorageKB} settings={settings} />;
        case 'battery': return <BatteryView setView={setView} settings={settings} setSettings={setSettings} batteryLevel={batteryLevel} isCharging={isCharging} setIsCharging={setIsCharging} />;
        case 'system_updates': return <SystemUpdatesView setView={setView} settings={settings} />;
        case 'about': return <AboutPhoneView setView={setView} settings={settings} />;
        case 'internet': return <InternetView setView={setView} settings={settings} setSettings={setSettings} />;
        case 'wifi': return <WifiSelectionView setView={setView} settings={settings} setSettings={setSettings} />;
        case 'network': return <NetworkSelectionView setView={setView} settings={settings} setSettings={setSettings} />;
        case 'vbluetooth': return <VBluetoothSelectionView setView={setView} settings={settings} setSettings={setSettings} />;
        case 'memory': return <MemoryView setView={setView} context={context} />;
        case 'memory_apps': return <MemoryAppsView setView={setView} context={context} />;
        case 'performance': return <PerformanceView setView={setView} context={context} />;
        default: return <MainView setView={setView} settings={settings} toggleTheme={toggleTheme} />;
    }
};

export default SettingsApp;