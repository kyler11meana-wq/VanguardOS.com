
import React from 'react';
import AppContainer from '../components/AppContainer.tsx';

const HardwareUpdatesApp: React.FC = () => {
    const updates = [
        {
            title: 'Vanguard Enters Chipset Development',
            description: 'Vanguard is excited to announce its official entry into semiconductor design. This move will allow for deeper integration between our hardware and software, unlocking new levels of performance and efficiency for future devices.',
            icon: 'fa-microchip',
        },
        {
            title: 'Introducing: The Vanguard Bionic X100A',
            description: 'The first-ever chipset designed in-house by Vanguard. The Bionic X100A is built on a next-generation architecture, promising unparalleled speed, advanced AI capabilities, and significant improvements in battery life. Coming to our next flagship device.',
            icon: 'fa-meteor',
        },
    ];

    return (
        <AppContainer title="Hardware Updates">
            <div className="p-6 space-y-8">
                <div className="text-center">
                    <i className="fa-solid fa-rocket text-6xl text-v-primary mb-4"></i>
                    <h2 className="text-2xl font-bold text-v-text-light dark:text-v-text-dark">The Future of Vanguard Hardware</h2>
                    <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">Innovations on the horizon.</p>
                </div>

                <div className="space-y-6">
                    {updates.map((update, index) => (
                        <div key={index} className="bg-v-surface-light dark:bg-v-surface-dark rounded-xl p-4 flex items-start space-x-4">
                            <i className={`fa-solid ${update.icon} text-2xl text-v-accent mt-1`}></i>
                            <div>
                                <h3 className="font-bold text-lg">{update.title}</h3>
                                <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark mt-1">{update.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AppContainer>
    );
};

export default HardwareUpdatesApp;
