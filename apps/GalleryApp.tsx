import React, { useState, useCallback } from 'react';
import AppContainer from '../components/AppContainer.tsx';
import { generateImage } from '../services/geminiService.ts';

const images = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/id/${i + 50}/400/400`,
    largeUrl: `https://picsum.photos/id/${i + 50}/820/1180`,
    alt: `Gallery image ${i + 1}`
}));

const ImageViewer: React.FC<{
    image: { url: string, largeUrl: string, alt: string };
    nextImage: { largeUrl: string };
    prevImage: { largeUrl: string };
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}> = ({ image, onClose, onNext, onPrev, nextImage, prevImage }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center animate-scale-in" onClick={onClose}>
            <div className="relative w-full h-full p-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img src={image.largeUrl} alt={image.alt} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-black/75 transition-colors"
                    aria-label="Close image viewer"
                >
                    <i className="fa-solid fa-times"></i>
                </button>

                {/* Prev Button */}
                <button
                    onClick={onPrev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/75 transition-colors"
                    aria-label="Previous image"
                >
                    <i className="fa-solid fa-chevron-left"></i>
                </button>

                {/* Next Button */}
                <button
                    onClick={onNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full w-12 h-12 flex items-center justify-center text-2xl hover:bg-black/75 transition-colors"
                    aria-label="Next image"
                >
                    <i className="fa-solid fa-chevron-right"></i>
                </button>

                 {/* Preload adjacent images for faster navigation */}
                 <div style={{ display: 'none' }}>
                    <img src={nextImage.largeUrl} alt="Preload next" />
                    <img src={prevImage.largeUrl} alt="Preload previous" />
                </div>
            </div>
        </div>
    );
};

const GalleryView: React.FC<{ onOpenImage: (index: number) => void }> = ({ onOpenImage }) => (
    <div className="grid grid-cols-4 gap-1.5 p-1.5">
        {images.map((image, index) => (
            <div key={image.id} className="aspect-square bg-gray-200 dark:bg-gray-700 cursor-pointer rounded-lg overflow-hidden transform transition-transform hover:scale-105" onClick={() => onOpenImage(index)}>
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" loading="lazy" />
            </div>
        ))}
    </div>
);

const GeneratorView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);
        
        const result = await generateImage(prompt);
        if (result) {
            setGeneratedImage(result);
        } else {
            setError("Sorry, the image could not be generated. Please try again.");
        }
        setIsLoading(false);
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center">
                {isLoading ? (
                    <div className="text-center">
                        <i className="fa-solid fa-wand-magic-sparkles text-5xl text-v-primary animate-pulse"></i>
                        <p className="mt-4 text-v-text-secondary-light dark:text-v-text-secondary-dark">Generating your masterpiece...</p>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 p-4 bg-red-500/10 rounded-lg">
                        <i className="fa-solid fa-circle-exclamation text-3xl mb-2"></i>
                        <p>{error}</p>
                    </div>
                ) : generatedImage ? (
                    <img src={`data:image/png;base64,${generatedImage}`} alt={prompt} className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
                ) : (
                    <div className="text-center text-v-text-secondary-light dark:text-v-text-secondary-dark">
                        <i className="fa-solid fa-image text-6xl"></i>
                        <p className="mt-4">Your generated image will appear here.</p>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 pt-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A robot holding a red skateboard"
                    className="w-full p-3 rounded-lg bg-v-surface-light dark:bg-v-surface-dark focus:outline-none focus:ring-2 focus:ring-v-primary resize-none"
                    rows={3}
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full mt-2 p-3 rounded-lg bg-v-primary text-white font-semibold disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors active:scale-95"
                >
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </div>
        </div>
    );
};

const ViewSwitcher: React.FC<{ currentMode: string; onSwitch: (mode: string) => void }> = ({ currentMode, onSwitch }) => (
    <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-full p-1 flex space-x-1">
            <button onClick={() => onSwitch('gallery')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex items-center space-x-2 ${currentMode === 'gallery' ? 'bg-white dark:bg-v-bg-dark shadow-sm' : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'}`}>
                <i className="fa-solid fa-images"></i><span>Gallery</span>
            </button>
            <button onClick={() => onSwitch('generator')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex items-center space-x-2 ${currentMode === 'generator' ? 'bg-white dark:bg-v-bg-dark shadow-sm' : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'}`}>
                <i className="fa-solid fa-wand-magic-sparkles"></i><span>Generator</span>
            </button>
        </div>
    </div>
);

const GalleryApp: React.FC = () => {
    const [mode, setMode] = useState<'gallery' | 'generator'>('gallery');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const handleOpenImage = (index: number) => {
        setSelectedImageIndex(index);
    };

    const handleCloseImage = useCallback(() => {
        setSelectedImageIndex(null);
    }, []);

    const handleNextImage = useCallback(() => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex + 1) % images.length);
        }
    }, [selectedImageIndex]);

    const handlePrevImage = useCallback(() => {
        if (selectedImageIndex !== null) {
            setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length);
        }
    }, [selectedImageIndex]);
    
    const nextIndex = selectedImageIndex !== null ? (selectedImageIndex + 1) % images.length : 0;
    const prevIndex = selectedImageIndex !== null ? (selectedImageIndex - 1 + images.length) % images.length : 0;

    return (
        <AppContainer title="AI Gallery">
            <div className="flex flex-col h-full">
                <ViewSwitcher currentMode={mode} onSwitch={(newMode) => setMode(newMode as 'gallery' | 'generator')} />
                <div className="flex-grow overflow-y-auto">
                    {mode === 'gallery' ? (
                        <GalleryView onOpenImage={handleOpenImage} />
                    ) : (
                        <GeneratorView />
                    )}
                </div>
            </div>
            {selectedImageIndex !== null && (
                <ImageViewer
                    image={images[selectedImageIndex]}
                    nextImage={images[nextIndex]}
                    prevImage={images[prevIndex]}
                    onClose={handleCloseImage}
                    onNext={handleNextImage}
                    onPrev={handlePrevImage}
                />
            )}
        </AppContainer>
    );
};

export default GalleryApp;