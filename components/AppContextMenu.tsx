
import React, { useContext } from 'react';
import { AppDefinition, AppContextType } from '../types.ts';
import { AppContext } from '../context.ts';

interface AppContextMenuProps {
    app: AppDefinition;
    position: { top: number; left: number };
    onClose: () => void;
}

const AppContextMenu: React.FC<AppContextMenuProps> = ({ app, position, onClose }) => {
    const { showAppInfo } = useContext(AppContext) as AppContextType;

    const handleAppInfo = () => {
        showAppInfo(app.id);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 z-50"
            onClick={onClose}
        >
            <div
                className="absolute bg-white/30 dark:bg-black/50 backdrop-blur-xl rounded-2xl shadow-lg p-2 w-48 text-v-text-light dark:text-v-text-dark animate-scale-in"
                style={{ top: position.top, left: position.left }}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={handleAppInfo}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-white/10 transition-colors flex items-center space-x-3"
                >
                    <i className="fa-solid fa-circle-info w-4 text-center"></i>
                    <span>App Info</span>
                </button>
            </div>
        </div>
    );
};

export default AppContextMenu;
