
import React from 'react';

interface PoweredOffScreenProps {
    onPowerOn: () => void;
    batteryLevel: number;
    isCharging: boolean;
}

const PoweredOffScreen: React.FC<PoweredOffScreenProps> = ({ onPowerOn, batteryLevel, isCharging }) => {
    if (isCharging) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center">
                <div className="relative mb-4">
                    <i className="fa-solid fa-battery-three-quarters text-gray-500 text-9xl"></i>
                    <i className="fa-solid fa-bolt text-yellow-400 text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse"></i>
                </div>
                <p className="text-4xl font-bold mb-2">{batteryLevel}%</p>
                <p className="text-lg text-gray-400 mb-8">Charging</p>
                 <button
                    onClick={onPowerOn}
                    className="flex items-center space-x-3 px-6 py-3 rounded-full bg-v-surface-dark hover:bg-v-primary transition-colors active:scale-95"
                >
                    <i className="fa-solid fa-power-off"></i>
                    <span className="font-semibold">Power On</span>
                </button>
            </div>
        );
    }

    if (batteryLevel <= 0) {
        return (
             <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white text-center">
                <i className="fa-solid fa-battery-empty text-red-500 text-8xl mb-6"></i>
                <h2 className="text-2xl font-bold text-red-500">Battery Drained</h2>
                <p className="text-md text-gray-400 mb-8">Connect to a power source.</p>
                <button
                    disabled
                    className="flex items-center space-x-3 px-6 py-3 rounded-full bg-v-surface-dark transition-colors cursor-not-allowed opacity-50"
                >
                    <i className="fa-solid fa-power-off"></i>
                    <span className="font-semibold">Power On</span>
                </button>
            </div>
        )
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white">
            <i className="fa-solid fa-power-off text-gray-500 text-8xl mb-6"></i>
            <p className="text-xl text-gray-400 mb-8">Device is off</p>
            <button
                onClick={onPowerOn}
                className="flex items-center space-x-3 px-6 py-3 rounded-full bg-v-surface-dark hover:bg-v-primary transition-colors active:scale-95"
            >
                <i className="fa-solid fa-power-off"></i>
                <span className="font-semibold">Power On</span>
            </button>
        </div>
    );
};

export default PoweredOffScreen;
