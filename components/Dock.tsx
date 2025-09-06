import React from 'react';
import { APPS, DOCK_APPS } from '../constants.tsx';
import AppIcon from './AppIcon.tsx';

const Dock: React.FC = () => {
    const dockApps = APPS.filter(app => DOCK_APPS.includes(app.id));

    return (
        <div className="flex-shrink-0 px-4 pb-2">
            <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-2 flex justify-around items-center h-[90px]">
                {dockApps.map(app => (
                    <AppIcon key={app.id} app={app} />
                ))}
            </div>
        </div>
    );
};

export default Dock;