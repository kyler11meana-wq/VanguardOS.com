
import React, { useMemo } from 'react';
import { AppContextType } from './types.ts';
import { APPS } from './constants.tsx';
import { APPS, SYSTEM_UPDATES_SIZES_MB } from './constants.tsx';


export const AppContext = React.createContext<AppContextType | null>(null);

export const useStorage = () => {
    const totalStorageKB = 144 * 1024; // 144 MB

    const appStorageKB = useMemo(() => 
        APPS.reduce((total, app) => total + (app.storageUsageKB || 0), 0), 
    const appStorageKB = useMemo(() =>
        APPS.reduce((total, app) => total + (app.storageUsageKB || 0), 0),
        []
    );

    const otherStorageKB = 42 * 1024; // Simulated "other" files like photos
    const systemStorageKB = 30 * 1024; // Simulated system files
    const otherStorageKB = 45 * 1024; // Simulated "other" files like photos
    const systemStorageKB = useMemo(() =>
        Object.values(SYSTEM_UPDATES_SIZES_MB).reduce((sum, size) => sum + size, 0) * 1024,
        []
    );

    const usedStorageKB = appStorageKB + otherStorageKB + systemStorageKB;
    const usagePercentage = (usedStorageKB / totalStorageKB) * 100;

    return { usagePercentage, usedStorageKB, totalStorageKB };
};
