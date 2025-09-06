import React from 'react';
import { AppDefinition, Settings, AppId } from './types.ts';
import BootApp from './apps/BootApp.tsx';

// Statically import all app components to resolve module loading issues
import SettingsApp from './apps/SettingsApp.tsx';
import GalleryApp from './apps/GalleryApp.tsx';
import AIAssistantApp from './apps/AIAssistantApp.tsx';
import NotepadApp from './apps/NotepadApp.tsx';
import CalculatorApp from './apps/CalculatorApp.tsx';
import CalendarApp from './apps/CalendarApp.tsx';
import ClockApp from './apps/ClockApp.tsx';
import AppUpdatesApp from './apps/AppUpdatesApp.tsx';


export const WIFI_NETWORKS = [
    { id: 'converge', name: 'CONVERGEFIBERX-VNAAISG1-3G', signal: 2, maxSignal: 4 },
    { id: 'pldt', name: 'PLDTHOMEFIBER-VNAAISG1-2.4G', signal: 1, maxSignal: 4 },
];

export const CELLULAR_NETWORKS = [
    { id: 'tnt', name: 'Tnt3G', signal: 4, maxSignal: 5, status: 'available' },
    { id: 'globe', name: 'Globe2G', signal: 2, maxSignal: 5, status: 'available' },
    { id: 'smart', name: 'Smart4G', signal: 0, maxSignal: 5, status: 'unavailable' },
];

export const VBLUETOOTH_NETWORKS = [
    { id: 'bluenet', name: 'Bluenet3G' },
];

export const DEFAULT_SETTINGS: Settings = {
    theme: 'light',
    wallpaperUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    internetMode: 'wifi',
    selectedWifiId: 'converge',
    selectedNetworkId: 'tnt',
    selectedVBluetoothId: 'bluenet',
    airplaneMode: false,
    deviceMode: 'smartphone',
    powerSavingMode: false,
};

export const MOCK_FILESYSTEM: { [key: string]: { name: string; size: number; type: 'image' | 'audio' | 'doc' }[] } = {
    'Pictures': [
        { name: 'sunset.jpg', size: 4.2, type: 'image' },
        { name: 'family_vacation.png', size: 8.1, type: 'image' },
        { name: 'logo_draft.svg', size: 1.5, type: 'image' },
    ],
    'Music': [
        { name: 'lofi_beats.mp3', size: 5.6, type: 'audio' },
        { name: 'podcast_episode_final.wav', size: 25.2, type: 'audio' },
    ],
    'Documents': [
        { name: 'project_proposal.pdf', size: 1.2, type: 'doc' },
        { name: 'meeting_notes.txt', size: 0.1, type: 'doc' },
        { name: 'quarterly_report.docx', size: 2.8, type: 'doc' },
    ],
    'Downloads': [
        { name: 'vanguard_os_manual.pdf', size: 3.4, type: 'doc' },
    ],
};


export const WALLPAPERS = [
    { name: 'Abstract', url: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Mountains', url: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Forest Path', url: 'https://images.pexels.com/photos/1528640/pexels-photo-1528640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Cityscape', url: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Ocean', url: 'https://images.pexels.com/photos/355288/pexels-photo-355288.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Neon City', url: 'https://images.pexels.com/photos/2113566/pexels-photo-2113566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Sports Car', url: 'https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
    { name: 'Aurora', url: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' },
];

export const DOCK_APPS: AppId[] = ['ai_assistant', 'calculator', 'notepad', 'gallery'];

export const SYSTEM_UPDATES_SIZES_MB = {
    '9': 9,
    '8': 4,
    '7': 2,
    '6': 3,
    'V': 20,
    '4.0': 2,
    '3.0': 10,
    '2.0': 8,
    '1.0': 15,
};

export const APPS: AppDefinition[] = [
    {
        id: 'boot',
        name: 'Boot',
        icon: <i className="fa-solid fa-power-off text-red-500 text-3xl"></i>,
        component: BootApp,
    },
    {
        id: 'settings',
        name: 'Settings',
        icon: <i className="fa-solid fa-gear text-slate-500 text-3xl"></i>,
        component: SettingsApp,
        version: '9',
        storageUsageKB: 3072,
        ramUsageMB: { min: 3, max: 3 },
        changelog: [
            { version: '9', notes: ['Added Performance Stats section for real-time monitoring.', 'UI optimizations for 60 FPS support.'] },
            { version: '8', notes: ['Full system integration with VanguardOS 8.', 'Updated hardware information in About Phone.'] },
            { version: '7', notes: ['Added Power Saving mode to extend battery life.', 'Enhanced status bar with new charging and power saving icons.'] },
            { version: '6', notes: ['Upgraded for VanguardOS 6 with UI and performance enhancements.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '4.0', notes: ['Redesigned main interface for a cleaner look.'] },
            { version: '1.0', notes: ['Initial release with theme, wallpaper, and storage management.'] }
        ]
    },
    {
        id: 'gallery',
        name: 'AI Gallery',
        icon: <i className="fa-solid fa-images text-pink-500 text-3xl"></i>,
        component: GalleryApp,
        version: '9',
        storageUsageKB: 5120,
        ramUsageMB: { min: 8, max: 8 },
        changelog: [
            { version: '9', notes: ['Upgraded for VanguardOS 9 with performance and stability improvements.'] },
            { version: '8', notes: ['Upgraded for VanguardOS 8 with performance and stability improvements.'] },
            { version: '7', notes: ['Upgraded for VanguardOS 7 with performance improvements.'] },
            { version: '6', notes: ['Enhanced with AI-powered features for smart search and organization.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '4.0', notes: ['Added a new collection of high-resolution photos.'] },
            { version: '1.0', notes: ['Initial release with grid view and image viewer.'] }
        ]
    },
    {
        id: 'ai_assistant',
        name: 'Vanguard AI',
        icon: <i className="fa-solid fa-brain text-indigo-500 text-3xl"></i>,
        component: AIAssistantApp,
        version: '9',
        storageUsageKB: 4096,
        ramUsageMB: { min: 14, max: 14 },
        changelog: [
            { version: '9', notes: ['Upgraded for VanguardOS 9 with performance and stability improvements.'] },
            { version: '8', notes: ['Upgraded for VanguardOS 8 with performance and stability improvements.'] },
            { version: '7', notes: ['Upgraded for VanguardOS 7 with performance improvements.'] },
            { version: '6', notes: ['Upgraded for VanguardOS 6 with UI and performance enhancements.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '4.0', notes: ['Upgraded core AI model for smarter, more contextual responses.'] },
            { version: '1.0', notes: ['Initial release with Gemini-powered chat.'] }
        ]
    },
    {
        id: 'notepad',
        name: 'AI Notes',
        icon: <i className="fa-solid fa-note-sticky text-yellow-400 text-3xl"></i>,
        component: NotepadApp,
        version: '9',
        storageUsageKB: 3072,
        ramUsageMB: { min: 6, max: 6 },
        changelog: [
            { version: '9', notes: ['Upgraded for VanguardOS 9 with performance and stability improvements.'] },
            { version: '8', notes: ['Upgraded for VanguardOS 8 with performance and stability improvements.'] },
            { version: '7', notes: ['Upgraded for VanguardOS 7 with performance improvements.'] },
            { version: '6', notes: ['Introducing AI summarization and idea generation capabilities.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '1.0', notes: ['Initial release with note-taking and to-do list functionality.'] }
        ]
    },
    {
        id: 'calculator',
        name: 'Calculator',
        icon: <i className="fa-solid fa-calculator text-orange-400 text-3xl"></i>,
        component: CalculatorApp,
        version: '9',
        storageUsageKB: 2048,
        ramUsageMB: { min: 2, max: 2 },
        changelog: [
            { version: '9', notes: ['Upgraded for VanguardOS 9 with performance and stability improvements.'] },
            { version: '8', notes: ['Upgraded for VanguardOS 8 with performance and stability improvements.'] },
            { version: '7', notes: ['Upgraded for VanguardOS 7 with performance improvements.'] },
            { version: '6', notes: ['Upgraded for VanguardOS 6 with UI and performance enhancements.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '1.0', notes: ['Initial release with full calculation functionality.'] }
        ]
    },
    {
        id: 'calendar',
        name: 'Calendar',
        icon: <i className="fa-solid fa-calendar-days text-red-400 text-3xl"></i>,
        component: CalendarApp,
        version: '9',
        storageUsageKB: 2048,
        ramUsageMB: { min: 2, max: 2 },
        changelog: [
            { version: '9', notes: ['Upgraded for VanguardOS 9 with performance and stability improvements.'] },
            { version: '8', notes: ['Upgraded for VanguardOS 8 with performance and stability improvements.'] },
            { version: '7', notes: ['Upgraded for VanguardOS 7 with performance improvements.'] },
            { version: '6', notes: ['Upgraded for VanguardOS 6 with UI and performance enhancements.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '1.0', notes: ['Initial release with interactive month navigation.'] }
        ]
    },
    {
        id: 'clock',
        name: 'Clock',
        icon: <i className="fa-solid fa-clock text-sky-400 text-3xl"></i>,
        component: ClockApp,
        version: '9',
        storageUsageKB: 2048,
        ramUsageMB: { min: 1, max: 1 },
        changelog: [
            { version: '9', notes: ['Upgraded for VanguardOS 9 with performance and stability improvements.'] },
            { version: '8', notes: ['Upgraded for VanguardOS 8 with performance and stability improvements.'] },
            { version: '7', notes: ['Upgraded for VanguardOS 7 with performance improvements.'] },
            { version: '6', notes: ['Upgraded for VanguardOS 6 with UI and performance enhancements.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '4.0', notes: ['Added fully functional Alarm and Timer tabs.'] },
            { version: '1.0', notes: ['Initial release with 12-hour display and interactive tabs.'] }
        ]
    },
    {
        id: 'app_updates',
        name: 'App Updates',
        icon: <i className="fa-solid fa-cloud-arrow-down text-cyan-400 text-3xl"></i>,
        component: AppUpdatesApp,
        version: '9',
        storageUsageKB: 3072,
        ramUsageMB: { min: 1, max: 1 },
        changelog: [
            { version: '9', notes: ['System updated to VanguardOS 9.', 'Added support for 60 FPS display.', 'New Performance Stats section in Settings for real-time monitoring.'] },
            { version: '8', notes: ['System updated to VanguardOS 8.', 'Hardware upgrade: VNAAIG2 model with Snapdragon S2 chipset.', 'Increased RAM to 80MB and ROM to 144MB.', 'Battery capacity increased to 700mAh for improved longevity.'] },
            { version: '7', notes: ['System updated to VanguardOS 7.'] },
            { version: '6', notes: ['Upgraded for VanguardOS 6 with UI and performance enhancements.'] },
            { version: 'V', notes: ['Complete UI overhaul for a more modern and intuitive experience.'] },
            { version: '1.0', notes: ['Initial release.'] }
        ]
    }
];