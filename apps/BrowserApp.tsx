
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import AppContainer from '../components/AppContainer.tsx';
import { AppContext } from '../context.ts';
import { AppContextType } from '../types.ts';

// --- Homepage Component ---
const FAVORITE_SITES = [
    { name: 'Google', url: 'https://www.google.com/webhp?igu=1', icon: 'fa-brands fa-google' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon: 'fa-brands fa-youtube' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org', icon: 'fa-brands fa-wikipedia-w' },
    { name: 'GitHub', url: 'https://github.com', icon: 'fa-brands fa-github' },
    { name: 'Maps', url: 'https://www.openstreetmap.org/', icon: 'fa-solid fa-map-location-dot' },
    { name: 'Photos', url: 'https://picsum.photos/', icon: 'fa-solid fa-images' },
];

const Homepage: React.FC<{ onNavigate: (url: string) => void }> = ({ onNavigate }) => (
    <div className="flex-grow p-6 flex flex-col items-center justify-center text-center h-full overflow-y-auto">
        <div className="w-24 h-24 mb-4 flex-shrink-0">
            <svg viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-v-primary">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
        </div>
        <h2 className="text-2xl font-bold mb-6 flex-shrink-0">Vanguard Browser</h2>
        <div className="grid grid-cols-4 gap-4 w-full max-w-sm">
            {FAVORITE_SITES.map(site => (
                <div key={site.name} onClick={() => onNavigate(site.url)} className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors space-y-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full">
                        <i className={`${site.icon} text-2xl text-v-text-secondary-light dark:text-v-text-secondary-dark`}></i>
                    </div>
                    <span className="text-xs text-v-text-light dark:text-v-text-dark truncate w-full">{site.name}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- Offline Component ---
const OfflineComponent: React.FC<{ onRetry: () => void; shake: boolean }> = ({ onRetry, shake }) => (
    <div className="flex-grow flex flex-col items-center justify-center text-center p-6 h-full text-v-text-secondary-light dark:text-v-text-secondary-dark">
        <style>{`
          @keyframes wiggle {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
          .animate-wiggle { animation: wiggle 0.2s ease-in-out 2; }
        `}</style>
        <i className={`fa-solid fa-triangle-exclamation text-yellow-500 text-5xl mb-4 transition-transform duration-150 ${shake ? 'animate-wiggle' : ''}`}></i>
        <h2 className="text-2xl font-bold mb-2 text-v-text-light dark:text-v-text-dark">No Connection</h2>
        <p className="mb-6">You are offline. Check your connection settings.</p>
        <button
            onClick={onRetry}
            className="px-6 py-2 bg-v-primary text-white rounded-full font-semibold hover:bg-blue-600 transition-colors active:scale-95"
        >
            Retry
        </button>
    </div>
);


// --- Main Browser Component ---
const BrowserApp: React.FC = () => {
    const { isConnected } = useContext(AppContext) as AppContextType;
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [inputValue, setInputValue] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showOfflineError, setShowOfflineError] = useState<boolean>(false);
    const [lastAttemptedUrl, setLastAttemptedUrl] = useState<string>('');
    const [shake, setShake] = useState<boolean>(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const currentUrl = historyIndex > -1 ? history[historyIndex] : 'about:blank';
    const canGoBack = historyIndex > 0;
    const canGoForward = historyIndex < history.length - 1;

    useEffect(() => {
        setInputValue(currentUrl === 'about:blank' ? '' : currentUrl);
    }, [currentUrl]);

    const navigateTo = useCallback((url: string) => {
        setIsLoading(true);
        setLastAttemptedUrl(url);

        if (!isConnected) {
            setShowOfflineError(true);
            setIsLoading(false);
            return;
        }
        
        setShowOfflineError(false);
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(url);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    }, [history, historyIndex, isConnected]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let url = inputValue.trim();
        if (!url) return;

        const isUrl = url.includes('.') && !url.includes(' ');
        
        if (isUrl) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }
            navigateTo(url);
        } else {
            navigateTo(`https://www.google.com/search?igu=1&q=${encodeURIComponent(url)}`);
        }
    };

    const handleRetry = () => {
        if (isConnected) {
            if (lastAttemptedUrl) {
                navigateTo(lastAttemptedUrl);
            }
        } else {
            setShake(true);
            setTimeout(() => setShake(false), 300);
        }
    };

    const goBack = () => {
        if (canGoBack) {
            setIsLoading(true);
            const newIndex = historyIndex - 1;
            const newUrl = history[newIndex];
            setLastAttemptedUrl(newUrl);

            if (!isConnected) {
                setShowOfflineError(true);
                setIsLoading(false);
                return;
            }

            setShowOfflineError(false);
            setHistoryIndex(newIndex);
        }
    };

    const goForward = () => {
        if (canGoForward) {
            setIsLoading(true);
            const newIndex = historyIndex + 1;
            const newUrl = history[newIndex];
            setLastAttemptedUrl(newUrl);

            if (!isConnected) {
                setShowOfflineError(true);
                setIsLoading(false);
                return;
            }
            
            setShowOfflineError(false);
            setHistoryIndex(newIndex);
        }
    };
    
    const goHome = () => {
        setShowOfflineError(false);
        setHistory([]);
        setHistoryIndex(-1);
    }
    
    const refresh = () => {
        if (currentUrl !== 'about:blank') {
            setIsLoading(true);
            setLastAttemptedUrl(currentUrl);

            if (!isConnected) {
                setShowOfflineError(true);
                setIsLoading(false);
                return;
            }
            
            setShowOfflineError(false);
            if (iframeRef.current) {
                try {
                    // This might fail due to cross-origin, but is the most reliable way to refresh
                    iframeRef.current.contentWindow?.location.reload();
                } catch (error) {
                    console.warn("Could not reload iframe directly, falling back to key change.", error);
                    // Fallback for cross-origin iframes
                    setRefreshKey(k => k + 1);
                }
            } else {
                 setRefreshKey(k => k + 1);
            }
        }
    };
    
    const handleIframeLoad = () => {
        setIsLoading(false);
    };

    const NavButton: React.FC<{ onClick: () => void; disabled?: boolean; icon: string; label: string; }> = ({ onClick, disabled, icon, label }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className="flex flex-col items-center justify-center w-16 h-full text-v-text-secondary-light dark:text-v-text-secondary-dark disabled:opacity-30 transition-all active:scale-90"
            aria-label={label}
        >
            <i className={`fa-solid ${icon} text-xl`}></i>
        </button>
    );

    return (
        <AppContainer title="Browser">
            <div className="h-full flex flex-col bg-v-bg-light dark:bg-v-bg-dark">
                {/* Address Bar */}
                <div className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                    <i className="fa-solid fa-lock text-v-text-secondary-light dark:text-v-text-secondary-dark px-1"></i>
                    <form onSubmit={handleFormSubmit} className="flex-grow">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Search or type a URL"
                            className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full px-3 py-1.5 text-sm text-v-text-light dark:text-v-text-dark focus:outline-none focus:ring-2 focus:ring-v-primary"
                        />
                    </form>
                </div>
                
                {/* Loading Bar */}
                <div className="relative h-0.5 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className={`absolute top-0 left-0 bottom-0 bg-v-primary transition-all duration-500 ease-out ${isLoading ? 'w-1/2' : 'w-full opacity-0'}`} />
                </div>
                
                {/* Content Area */}
                <div className="flex-grow overflow-hidden">
                    {showOfflineError ? (
                        <OfflineComponent onRetry={handleRetry} shake={shake} />
                    ) : currentUrl === 'about:blank' ? (
                        <Homepage onNavigate={navigateTo} />
                    ) : (
                        <iframe
                            ref={iframeRef}
                            src={currentUrl}
                            onLoad={handleIframeLoad}
                            className="w-full h-full border-0"
                            title="Browser Content"
                            key={`${historyIndex}-${currentUrl}-${refreshKey}`}
                            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
                        ></iframe>
                    )}
                </div>

                {/* Bottom Nav Bar */}
                <div className="flex-shrink-0 h-16 border-t border-gray-200 dark:border-gray-700 flex justify-around items-center bg-v-surface-light/90 dark:bg-v-surface-dark/90 backdrop-blur-md">
                    <NavButton onClick={goBack} disabled={!canGoBack} icon="fa-chevron-left" label="Go back" />
                    <NavButton onClick={goForward} disabled={!canGoForward} icon="fa-chevron-right" label="Go forward" />
                    <NavButton onClick={goHome} icon="fa-house" label="Go home" />
                    <NavButton onClick={refresh} disabled={currentUrl === 'about:blank'} icon="fa-rotate-right" label="Refresh" />
                    <NavButton onClick={() => {}} icon="fa-share-alt" label="Share" />
                </div>
            </div>
        </AppContainer>
    );
};

export default BrowserApp;
