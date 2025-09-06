



import React, { useContext } from 'react';
import useTime from '../hooks/useTime.ts';
import useDate from '../hooks/useDate.ts';
import { AppContext } from '../context.ts';
// FIX: Import Notification type from types.ts
import { AppContextType, Notification } from '../types.ts';

interface ShadeProps {
    isOpen: boolean;
    onClose: () => void;
}

const formatTimeAgo = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    // FIX: Add missing properties to context destructuring to handle notifications and navigation.
    const { openApp, dismissNotification, toggleShade, setTargetSettingsView } = useContext(AppContext) as AppContextType;

    const handleClick = () => {
        if (notification.appIdToOpen) {
            if (notification.targetSettingsView) {
                setTargetSettingsView(notification.targetSettingsView);
            }
            openApp(notification.appIdToOpen);
        }
        toggleShade();
    };

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        dismissNotification(notification.id);
    };

    return (
        <div 
            className="w-full bg-white/10 backdrop-blur-lg rounded-2xl p-3 flex items-start space-x-3 cursor-pointer transition-all hover:bg-white/20 relative group" 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label={`Notification: ${notification.title}. ${notification.message}`}
        >
            <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full bg-black/30 ${notification.iconColor || 'text-white'}`}>
                <i className={notification.icon}></i>
            </div>
            <div className="flex-grow">
                <p className="font-semibold text-sm">{notification.title}</p>
                <p className="text-xs text-white/80">{notification.message}</p>
            </div>
            <div className="flex-shrink-0 text-xs text-white/60">{formatTimeAgo(notification.timestamp)}</div>
            <button
                onClick={handleDismiss}
                className="absolute top-1 right-1 w-5 h-5 bg-black/30 rounded-full flex items-center justify-center text-white/60 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label={`Dismiss notification: ${notification.title}`}
            >
                <i className="fa-solid fa-times text-xs"></i>
            </button>
        </div>
    );
};

const NotificationsView: React.FC = () => {
    // FIX: Add missing properties to context destructuring to display and manage notifications.
    const { notifications, dismissNotification } = useContext(AppContext) as AppContextType;
    const time = useTime();
    const date = useDate();

    const clearAll = () => {
        notifications.forEach(n => dismissNotification(n.id));
    };

    return (
        <div className="p-4 text-white">
            <div className="flex justify-between items-center mb-4 px-2">
                <div>
                    <p className="text-4xl font-bold">{time}</p>
                    <p className="text-md text-white/80">{date}</p>
                </div>
                {notifications.length > 0 && (
                    <button onClick={clearAll} className="px-3 py-1.5 text-xs font-semibold bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                        Clear all
                    </button>
                )}
            </div>
            <div className="space-y-2">
                {notifications.length > 0 ? (
                    notifications.map(n => <NotificationItem key={n.id} notification={n} />)
                ) : (
                    <div className="text-center py-8 bg-white/10 rounded-2xl">
                        <p className="text-white/70">No new notifications</p>
                    </div>
                )}
            </div>
        </div>
    );
};


const Shade: React.FC<ShadeProps> = ({ isOpen, onClose }) => {
    return (
        <div 
            className={`absolute inset-0 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
            aria-hidden={!isOpen}
        >
            <div 
                className={`absolute top-0 left-0 right-0 bg-black/50 backdrop-blur-2xl rounded-b-3xl shadow-lg transition-transform duration-300 ease-in-out transform-gpu pt-2 max-h-full overflow-y-auto ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <NotificationsView />
            </div>
        </div>
    );
};

export default Shade;