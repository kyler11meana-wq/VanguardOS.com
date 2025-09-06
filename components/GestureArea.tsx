
import React, { useRef } from 'react';

interface GestureAreaProps {
    onHome: () => void;
    onSwitchTasks: () => void;
}

const GestureArea: React.FC<GestureAreaProps> = ({ onHome, onSwitchTasks }) => {
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    const handleInteractionStart = (clientY: number) => {
        touchStartY.current = clientY;
        touchStartTime.current = Date.now();
    };

    const handleInteractionEnd = (clientY: number) => {
        const touchEndTime = Date.now();
        
        const deltaY = touchStartY.current - clientY;
        const deltaTime = touchEndTime - touchStartTime.current;

        // Thresholds for swipe detection
        const swipeDistanceThreshold = 50; // pixels
        const quickSwipeTimeThreshold = 250; // ms

        if (deltaY > swipeDistanceThreshold) { // Swiped up
            if (deltaTime < quickSwipeTimeThreshold) { // Quick swipe
                onHome();
            } else { // Slower swipe, interpreted as "swipe and hold"
                onSwitchTasks();
            }
        }
    };
    
    // Touch events
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        handleInteractionStart(e.touches[0].clientY);
    };
    const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
        handleInteractionEnd(e.changedTouches[0].clientY);
    };

    // Mouse events for desktop testing
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        handleInteractionStart(e.clientY);
    };
    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        handleInteractionEnd(e.clientY);
    };

    return (
        <div
            className="absolute bottom-0 left-0 right-0 h-10 z-50 flex items-end justify-center pb-2 sm:pb-5 cursor-pointer"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            aria-label="Gesture navigation area"
        >
            <div className="w-32 h-1.5 bg-white/50 rounded-full transition-colors hover:bg-white/80"></div>
        </div>
    );
};

export default GestureArea;
