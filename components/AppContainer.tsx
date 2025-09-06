
import React, { useContext } from 'react';
import { AppContext } from '../context.ts';
import { AppContextType } from '../types.ts';

interface AppContainerProps {
    title: string;
    children: React.ReactNode;
}

const AppContainer: React.FC<AppContainerProps> = ({ title, children }) => {
    const { settings } = useContext(AppContext) as AppContextType;
    const paddingTopClass = settings.deviceMode === 'laptop' ? 'pt-4' : 'pt-12';
    const paddingBottomClass = settings.deviceMode === 'laptop' ? 'pb-10' : '';

    return (
        <div className={`w-full h-full flex flex-col bg-gradient-to-br from-v-bg-light to-gray-200/90 dark:from-v-bg-dark dark:to-black/80 backdrop-blur-xl text-v-text-light dark:text-v-text-dark ${paddingTopClass} ${paddingBottomClass}`}>
            <header className="flex-shrink-0 h-20 flex items-center px-6">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            </header>
            <div className="flex-grow overflow-y-auto overflow-x-hidden">
                {children}
            </div>
        </div>
    );
};

export default AppContainer;
