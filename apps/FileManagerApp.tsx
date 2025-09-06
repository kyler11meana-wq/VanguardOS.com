

import React, { useState, useContext } from 'react';
import { MOCK_FILESYSTEM } from '../constants.tsx';
import { AppContext } from '../context.ts';
import { AppContextType } from '../types.ts';

const ICONS: { [key: string]: string } = {
    folder: 'fa-folder text-yellow-500',
    image: 'fa-file-image text-blue-500',
    audio: 'fa-file-audio text-purple-500',
    doc: 'fa-file-lines text-green-500',
};

const FileManagerApp: React.FC = () => {
    const { settings } = useContext(AppContext) as AppContextType;
    const [currentPath, setCurrentPath] = useState<string>('/'); // '/' is root
    const [currentTitle, setCurrentTitle] = useState<string>('File Manager');

    const navigateTo = (folderName: string) => {
        setCurrentPath(`/${folderName}`);
        setCurrentTitle(folderName);
    };

    const navigateBack = () => {
        setCurrentPath('/');
        setCurrentTitle('File Manager');
    };

    const renderRootView = () => (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {Object.keys(MOCK_FILESYSTEM).map(folderName => (
                 <li key={folderName}>
                    <button
                        onClick={() => navigateTo(folderName)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors"
                        aria-label={`Open folder ${folderName}`}
                    >
                        <div className="flex items-center space-x-4">
                            <i className={`fa-solid ${ICONS.folder} text-xl`}></i>
                            <span className="font-semibold">{folderName}</span>
                        </div>
                        <i className="fa-solid fa-chevron-right text-v-text-secondary-light dark:text-v-text-secondary-dark text-xs"></i>
                    </button>
                </li>
            ))}
        </ul>
    );

    const renderFolderView = () => {
        const folderName = currentPath.substring(1) as keyof typeof MOCK_FILESYSTEM;
        const files = MOCK_FILESYSTEM[folderName] || [];

        return (
             <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {files.map(file => (
                    <li key={file.name} className="w-full flex items-center justify-between p-4 text-left">
                        <div className="flex items-center space-x-4">
                            <i className={`fa-solid ${ICONS[file.type]} text-xl`}></i>
                            <div>
                                <p className="font-semibold">{file.name}</p>
                                <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark">{file.size} MB</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    };

    const paddingTopClass = settings.deviceMode === 'laptop' ? '' : 'pt-12';
    const paddingBottomClass = settings.deviceMode === 'laptop' ? 'pb-10' : '';

    return (
        <div className={`w-full h-full flex flex-col bg-v-bg-light/90 dark:bg-v-bg-dark/80 backdrop-blur-xl text-v-text-light dark:text-v-text-dark ${paddingTopClass} ${paddingBottomClass}`}>
            <header className="flex-shrink-0 h-14 flex items-center px-4 bg-white/20 dark:bg-black/20 backdrop-blur-lg">
                {currentPath !== '/' && (
                    <button
                        onClick={navigateBack}
                        className="p-2 -ml-2 rounded-full hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                        aria-label="Go back"
                    >
                        <i className="fa-solid fa-arrow-left w-5 h-5"></i>
                    </button>
                )}
                <h1 className={`text-lg font-bold ${currentPath !== '/' ? 'ml-4' : ''}`}>{currentTitle}</h1>
            </header>
            <div className="flex-grow overflow-y-auto">
                {currentPath === '/' ? renderRootView() : renderFolderView()}
            </div>
        </div>
    );
};

export default FileManagerApp;
