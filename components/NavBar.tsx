
import React, { useRef } from 'react';

interface NavBarProps {
    onHome: () => void;
    onLock: () => void;
    onShowPowerMenu: () => void;
}

const PowerButton: React.FC<{onClick: () => void; onLongPress: () => void;}> = ({onClick, onLongPress}) => {
    const timerRef = useRef<number | null>(null);
    const isLongPressTriggered = useRef(false);

    const handlePressStart = () => {
        isLongPressTriggered.current = false;
        timerRef.current = window.setTimeout(() => {
            isLongPressTriggered.current = true;
            onLongPress();
        }, 500); // 500ms for long press
    };

    const handlePressEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        if (!isLongPressTriggered.current) {
            onClick();
        }
    };

    const handleMouseLeave = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };
    
    return (
        <button
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onClick={(e) => e.preventDefault()}
            className="text-white text-xl w-16 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all active:scale-90"
            aria-label="Power options"
        >
            <i className="fa-solid fa-power-off"></i>
        </button>
    );
};

const NavBar: React.FC<NavBarProps> = ({ onHome, onLock, onShowPowerMenu }) => {
    return (
        <div className="h-[60px] flex-shrink-0 flex justify-center items-center px-4 pb-2">
            <div className="bg-white/30 backdrop-blur-xl rounded-3xl p-2 flex justify-around items-center h-full w-full max-w-xs">
                <button
                    onClick={onHome}
                    className="text-white text-xl w-16 h-12 flex items-center justify-center rounded-2xl hover:bg-white/20 transition-all active:scale-90"
                    aria-label="Go to Home Screen"
                >
                    <i className="fa-solid fa-house"></i>
                </button>
                <PowerButton onClick={onLock} onLongPress={onShowPowerMenu} />
            </div>
        </div>
    );
};

export default NavBar;
