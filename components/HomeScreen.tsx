

import React, { useContext } from 'react';
import AppIcon from './AppIcon.tsx';
import { APPS } from '../constants.tsx';
import { AppContext } from '../context.ts';
import { AppContextType } from '../types.ts';

interface HomeScreenProps {
    isHidden: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ isHidden }) => {
    const { settings } = useContext(AppContext) as AppContextType;
    const appsToShow = APPS.filter(app => app.id !== 'boot');

    const gridColsClass = settings.deviceMode === 'laptop' ? 'grid-cols-8' : 'grid-cols-5';
    const paddingClass = settings.deviceMode === 'laptop' ? 'pb-12' : 'pt-12';
    
    return (
        <div className={`w-full h-full flex flex-col transition-opacity duration-300 ${isHidden ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className={`flex-grow p-6 ${paddingClass}`}>
                <div className={`grid ${gridColsClass} gap-y-8`}>
                    {appsToShow.map(app => (
                        <AppIcon key={app.id} app={app} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;