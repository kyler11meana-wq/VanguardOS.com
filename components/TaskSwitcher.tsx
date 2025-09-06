import React, { useContext, useState, useRef } from 'react';
import { AppContext } from '../context.ts';
import { AppContextType, AppId, AppDefinition } from '../types.ts';
import { APPS } from '../constants.tsx';

interface AppPreviewCardProps {
    appDef: AppDefinition;
    onSelect: (appId: AppId) => void;
    onClose: (appId: AppId) => void;
    wallpaperUrl: string;
}

const AppPreviewCard: React.FC<AppPreviewCardProps> = ({ appDef, onSelect, onClose, wallpaperUrl }) => {
    const [translateY, setTranslateY] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef({ y: 0, time: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleInteractionStart = (clientY: number) => {
        dragStartRef.current = { y: clientY, time: Date.now() };
        setIsDragging(true);
        if (cardRef.current) {
            cardRef.current.style.transition = 'none';
        }
    };

    const handleInteractionMove = (clientY: number) => {
        if (!isDragging) return;
        const deltaY = clientY - dragStartRef.current.y;
        // Only allow swiping upwards
        if (deltaY < 0) {
            setTranslateY(deltaY);
        }
    };

    const handleInteractionEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (cardRef.current) {
            cardRef.current.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        }
        
        const closeThreshold = -150; // pixels
        if (translateY < closeThreshold) {
             if (cardRef.current) {
                cardRef.current.style.opacity = '0';
                cardRef.current.style.transform = `translateY(${translateY-100}px) scale(0.9)`;
            }
            setTimeout(() => {
                onClose(appDef.id);
            }, 300);
        } else {
            setTranslateY(0);
        }
    };

    const handleClick = () => {
        // Only trigger select if it wasn't a drag/swipe action
        const deltaTime = Date.now() - dragStartRef.current.time;
        const deltaY = Math.abs(translateY);
        if (deltaTime < 200 && deltaY < 10) {
            onSelect(appDef.id);
        }
    };

    return (
        <div 
            ref={cardRef}
            key={appDef.id} 
            className="snap-center flex-shrink-0 w-[600px] h-[860px] rounded-3xl overflow-hidden shadow-2xl bg-black transform transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{ transform: `translateY(${translateY}px) scale(1)`, willChange: 'transform, opacity' }}
            onClick={handleClick}
            onMouseDown={(e) => handleInteractionStart(e.clientY)}
            onMouseMove={(e) => handleInteractionMove(e.clientY)}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            onTouchStart={(e) => handleInteractionStart(e.touches[0].clientY)}
            onTouchMove={(e) => handleInteractionMove(e.touches[0].clientY)}
            onTouchEnd={handleInteractionEnd}
        >
            <div 
                className="w-full h-full bg-cover bg-center relative pointer-events-none"
                style={{ backgroundImage: `url(${wallpaperUrl})` }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col justify-between">
                    <div className="p-3 flex items-center justify-between bg-black/20">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">{appDef.icon}</div>
                            <span className="text-white font-semibold text-sm truncate">{appDef.name}</span>
                        </div>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose(appDef.id);
                            }}
                            className="text-white/80 hover:text-white transition-all text-xl w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 active:scale-90 pointer-events-auto cursor-pointer"
                            aria-label={`Close ${appDef.name}`}
                        >
                            <i className="fa-solid fa-times"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


interface TaskSwitcherProps {
  isVisible: boolean;
  onAppSelect: (appId: AppId) => void;
  onDismiss: () => void;
}

const TaskSwitcher: React.FC<TaskSwitcherProps> = ({ isVisible, onAppSelect, onDismiss }) => {
  const { openApps, closeApp, settings } = useContext(AppContext) as AppContextType;

  if (!isVisible) return null;
  
  const openAppDefs = openApps
    .map(id => APPS.find(app => app.id === id))
    .filter((app): app is AppDefinition => !!app) // Type guard to filter out undefined
    .filter(app => app.id !== 'boot');

  return (
    <div 
        className="absolute inset-0 z-30 bg-black/70 backdrop-blur-xl transition-opacity duration-300"
        onClick={onDismiss}
    >
      <div 
        className="w-full h-full flex items-center overflow-x-auto snap-x snap-mandatory"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-5 sm:px-10 space-x-4 mx-auto">
            {openAppDefs.length > 0 ? openAppDefs.map((appDef) => (
              <AppPreviewCard 
                key={appDef.id}
                appDef={appDef}
                onSelect={onAppSelect}
                onClose={closeApp}
                wallpaperUrl={settings.wallpaperUrl}
              />
            )) : null}
            {openAppDefs.length === 0 && (
                 <div className="text-center text-white/70 w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">No open apps</div>
            )}
        </div>
      </div>
    </div>
  );
};

export default TaskSwitcher;