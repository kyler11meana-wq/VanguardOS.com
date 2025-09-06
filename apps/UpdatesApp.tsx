
import React from 'react';
import AppContainer from '../components/AppContainer.tsx';

const SystemUpdatesApp: React.FC = () => {
    return (
        <AppContainer title="System Updates">
            <div className="px-6 py-4 space-y-8">
                <div className="text-center py-8 bg-v-surface-light dark:bg-v-surface-dark rounded-xl shadow-sm">
                    <i className="fa-solid fa-check-circle text-green-500 text-6xl mb-4"></i>
                    <h2 className="text-2xl font-bold text-v-text-light dark:text-v-text-dark">VanguardOS V</h2>
                    <p className="text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">Your system is up to date.</p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">What's New in Version V</h3>
                    <ul className="list-disc list-inside space-y-2 text-v-text-light dark:text-v-text-dark p-2">
                        <li>
                            <span className="font-semibold">Hardware Support:</span> Increased supported RAM to 72MB, ROM to 136MB, and battery to 600mAh. Added support for Snapdragon S1 chipset and Adreno 540 GPU.
                        </li>
                         <li>
                            <span className="font-semibold">Battery Life:</span> Improved battery longevity by 20% to match new hardware standards.
                        </li>
                         <li>
                            <span className="font-semibold">New App: Videos:</span> Introducing the new Videos app for browsing your video collection.
                        </li>
                         <li>
                            <span className="font-semibold">New Wallpapers:</span> Added three new high-resolution wallpapers to personalize your device.
                        </li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold mb-3 border-b pb-2 border-gray-200 dark:border-gray-700">Previous Versions</h3>
                    <div className="space-y-4 p-2">
                        <div>
                             <h4 className="font-bold">VanguardOS 4.0</h4>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>The File Manager app has been deprecated to streamline the OS.</li>
                                <li>Refined the boot screen for better text alignment on all devices.</li>
                                <li>General bug fixes and performance improvements.</li>
                            </ul>
                        </div>
                        <div>
                             <h4 className="font-bold">VanguardOS 3.0</h4>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>
                                    <span className="font-semibold">Network & Internet Management:</span> Added a new panel in Settings to control Wi-Fi, Cellular, and VBluetooth connections.
                                </li>
                                 <li>
                                    <span className="font-semibold">Dynamic Status Bar:</span> The status bar now reflects the active connection type and signal strength in real-time.
                                </li>
                            </ul>
                        </div>
                         <div>
                             <h4 className="font-bold">VanguardOS 2.0</h4>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>Added Calculator, Calendar, Clock, and App Updates.</li>
                                <li>Introduced the Permissions Manager in Settings.</li>
                                <li>Enhanced Control Center with functional Airplane Mode and Auto-Rotate.</li>
                                <li>Implemented Virtual Bluetooth technology.</li>
                            </ul>
                        </div>
                         <div>
                             <h4 className="font-bold">VanguardOS 1.0</h4>
                             <ul className="list-disc list-inside space-y-1 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark pl-2 mt-1">
                                <li>Initial release of VanguardOS.</li>
                                <li>Core apps: AI Assistant, Gallery, Notepad, Settings.</li>
                                <li>Introduced the modern UI/UX with light and dark themes.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
};

export default SystemUpdatesApp;
