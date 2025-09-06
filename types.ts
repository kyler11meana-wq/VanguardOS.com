import React from 'react';

export type AppId = 'settings' | 'gallery' | 'ai_assistant' | 'notepad' | 'boot' | 'calculator' | 'calendar' | 'clock' | 'app_updates';

export type Theme = 'light' | 'dark';

export type InternetMode = 'wifi' | 'network' | 'vbluetooth' | 'off';

export type DeviceMode = 'smartphone' | 'laptop';

export interface Settings {
    theme: Theme;
    wallpaperUrl: string;
    internetMode: InternetMode;
    selectedWifiId: string;
    selectedNetworkId: string;
    selectedVBluetoothId: string;
    airplaneMode: boolean;
    deviceMode: DeviceMode;
    powerSavingMode: boolean;
}

export interface ChangelogEntry {
    version: string;
    notes: string[];
}

export interface AppDefinition {
    id: AppId;
    name: string;
    icon: React.ReactNode;
    component: React.ComponentType;
    version?: string;
    storageUsageKB?: number;
    ramUsageMB?: { min: number; max: number };
    changelog?: ChangelogEntry[];
}

// FIX: Added Notification interface to define the shape of notification objects.
export interface Notification {
    id: number;
    title: string;
    message: string;
    icon: string;
    iconColor?: string;
    timestamp: Date;
    appIdToOpen?: AppId;
    targetSettingsView?: string;
}

export interface AppContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
    openApp: (appId: AppId) => void;
    closeApp: (appId: AppId) => void;
    activeApp: AppId | null;
    setActiveApp: (appId: AppId | null) => void;
    openApps: AppId[];
    showAppInfo: (appId: AppId) => void;
    isConnected: boolean;
    batteryLevel: number;
    isCharging: boolean;
    setIsCharging: React.Dispatch<React.SetStateAction<boolean>>;
    goToHomeScreen: () => void;
    hasUnreadUpdate: boolean;
    storageUsagePercentage: number;
    // FIX: Added properties for notification shade management and deep linking into settings.
    notifications: Notification[];
    dismissNotification: (id: number) => void;
    toggleShade: () => void;
    // FIX: Add targetSettingsView property to the context type to resolve type error.
    targetSettingsView: string | null;
    setTargetSettingsView: (view: string | null) => void;
    fps: number;
    usedRamMB: number;
    totalRamMB: number;
    // FIX: Add mapping of open app IDs to their current RAM usage.
    openAppsRamUsage: { [key in AppId]?: number };
}