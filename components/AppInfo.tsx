import React from 'react';
import { AppDefinition } from '../types.ts';

// Fix: Define the AppInfoProps interface
interface AppInfoProps {
    app: AppDefinition;
    onClose: () => void;
}

const AppInfo: React.FC<AppInfoProps> = ({ app, onClose }) => {
    const formatStorage = (kb: number | undefined) => {
        if (kb === undefined) {
            return 'N/A';
        }
        if (kb < 1024) {
            return `${kb} KB`;
        }
        return `${(kb / 1024).toFixed(2)} MB`;
    };

    return (
        <div className="absolute inset-0 z-50 bg-v-bg-light/95 dark:bg-v-bg-dark/95 backdrop-blur-xl animate-scale-in text-v-text-light dark:text-v-text-dark">
            <header className="flex-shrink-0 h-14 flex items-center px-2 bg-transparent sm:pt-9">
                <button onClick={onClose} className="flex items-center space-x-1 p-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>
                <h1 className="text-lg font-bold mx-auto pr-8">App Info</h1>
            </header>
            <div className="p-6 flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-3xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-app-icon dark:shadow-app-icon-dark mb-4">
                    <div className="transform scale-[2.5]">
                        {app.icon}
                    </div>
                </div>
                <h2 className="text-3xl font-bold">{app.name}</h2>
                <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark mb-10">Version {app.version || 'N/A'}</p>

                <div className="w-full max-w-sm space-y-2">
                     <div className="w-full p-4 bg-v-surface-light dark:bg-v-surface-dark rounded-lg text-left font-semibold flex justify-between items-center text-base">
                        <span>Storage Used</span>
                        <span className="font-normal text-v-text-secondary-light dark:text-v-text-secondary-dark">{formatStorage(app.storageUsageKB)}</span>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AppInfo;