import React, { useContext, useCallback } from 'react';
import { AppDefinition, AppContextType } from '../types.ts';
import { AppContext } from '../context.ts';

interface AppIconProps {
    app: AppDefinition;
}

const AppIcon: React.FC<AppIconProps> = ({ app }) => {
    const { openApp } = useContext(AppContext) as AppContextType;
    
    const handleClick = useCallback(() => {
        openApp(app.id);
    }, [openApp, app.id]);

    return (
        <div
            className="flex flex-col items-center space-y-2 transform transition-all duration-150 active:scale-90"
            onClick={handleClick}
            onContextMenu={(e) => e.preventDefault()}
        >
            <div className="w-16 h-16 rounded-2xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-app-icon dark:shadow-app-icon-dark">
                {app.icon}
            </div>
            <span className="text-white text-xs font-medium drop-shadow-md">{app.name}</span>
        </div>
    );
};

export default AppIcon;
