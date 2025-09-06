
import React from 'react';
import AppContainer from '../components/AppContainer.tsx';

const VboardApp: React.FC = () => {
    const keys = [
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'del'],
        ['123', 'mic', 'space', '.', 'return']
    ];

    const Key = ({ value }: { value: string }) => {
        const specialClasses: { [key: string]: string } = {
            'shift': 'w-16', 'del': 'w-16', 'return': 'w-24',
            '123': 'w-16', 'mic': 'w-16', 'space': 'flex-grow'
        };
        const baseClass = "h-12 flex items-center justify-center rounded-md text-lg capitalize transition-colors duration-150";
        const themeClass = "bg-gray-300 dark:bg-gray-700 active:bg-gray-400 dark:active:bg-gray-600";
        const finalClass = `${baseClass} ${themeClass} ${specialClasses[value] || 'w-10'}`;

        return <button className={finalClass}>{value}</button>;
    };

    return (
        <AppContainer title="V-Board">
            <div className="flex flex-col h-full justify-end bg-gray-200 dark:bg-gray-800 p-2">
                <div className="space-y-2">
                    {keys.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex justify-center space-x-1.5">
                            {row.map(key => <Key key={key} value={key} />)}
                        </div>
                    ))}
                </div>
            </div>
        </AppContainer>
    );
};

export default VboardApp;
