
import React, { useState } from 'react';
import AppContainer from '../components/AppContainer.tsx';
import { APPS } from '../constants.tsx';
import { AppId, ChangelogEntry } from '../types.ts';

const AppUpdatesApp: React.FC = () => {
    const [expandedApp, setExpandedApp] = useState<AppId | null>(null);
    const userApps = APPS.filter(app => app.id !== 'boot' && app.changelog && app.changelog.length > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

    const toggleChangelog = (appId: AppId) => {
        setExpandedApp(prev => (prev === appId ? null : appId));
    };

    return (
        <AppContainer title="App Updates">
            <div className="px-6 py-4">
                <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700 mb-4">
                     <i className="fa-solid fa-check-circle text-6xl text-green-500 mb-4"></i>
                     <h2 className="text-2xl font-bold">All apps are up to date</h2>
                     <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark mt-2">Checked just now</p>
                </div>
                 <h3 className="text-lg font-semibold mb-2 px-2">Recently Updated</h3>
                 <ul className="space-y-2">
                    {userApps.map(app => (
                        <li key={app.id} className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-2">
                             <button
                                onClick={() => toggleChangelog(app.id)}
                                className="w-full flex items-center justify-between text-left py-2 px-2"
                                aria-expanded={expandedApp === app.id}
                                aria-controls={`changelog-${app.id}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 flex items-center justify-center">
                                        {app.icon}
                                    </div>
                                    <div>
                                        <span className="font-semibold">{app.name}</span>
                                        <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">Version {app.version}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                     <span className="text-xs font-semibold text-v-primary">Changelog</span>
                                     <i className={`fa-solid fa-chevron-down text-xs transition-transform ${expandedApp === app.id ? 'rotate-180' : ''}`}></i>
                                </div>
                            </button>
                            {expandedApp === app.id && (
                                <div id={`changelog-${app.id}`} className="pt-2 pl-16 pr-4 text-sm space-y-3 pb-2">
                                    {app.changelog?.map((entry: ChangelogEntry) => (
                                        <div key={entry.version}>
                                            <h4 className="font-semibold text-v-text-light dark:text-v-text-dark">Version {entry.version}</h4>
                                            <ul className="list-disc list-inside text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2">
                                                {entry.notes.map((note, index) => <li key={index}>{note}</li>)}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </AppContainer>
    );
};

export default AppUpdatesApp;
