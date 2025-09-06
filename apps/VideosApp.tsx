import React, { useState } from 'react';
import AppContainer from '../components/AppContainer.tsx';
import { generateVideo } from '../services/geminiService.ts';

const MOCK_VIDEOS = [
    { id: 1, title: 'Coastal Drive', duration: '0:15', thumbnailUrl: 'https://images.pexels.com/photos/3354648/pexels-photo-3354648.jpeg?auto=compress&cs=tinysrgb&w=400', videoUrl: 'https://videos.pexels.com/video-files/854291/854291-hd.mp4' },
    { id: 2, title: 'Forest Hike', duration: '0:22', thumbnailUrl: 'https://images.pexels.com/photos/1528640/pexels-photo-1528640.jpeg?auto=compress&cs=tinysrgb&w=400', videoUrl: 'https://videos.pexels.com/video-files/5495824/5495824-hd.mp4' },
    { id: 3, title: 'City at Night', duration: '0:14', thumbnailUrl: 'https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=400', videoUrl: 'https://videos.pexels.com/video-files/1526909/1526909-hd.mp4' },
    { id: 4, title: 'Mountain Timelapse', duration: '0:20', thumbnailUrl: 'https://images.pexels.com/photos/371633/pexels-photo-371633.jpeg?auto=compress&cs=tinysrgb&w=400', videoUrl: 'https://videos.pexels.com/video-files/4434246/4434246-hd.mp4' },
    { id: 5, title: 'Ocean Waves', duration: '0:20', thumbnailUrl: 'https://images.pexels.com/photos/355288/pexels-photo-355288.jpeg?auto=compress&cs=tinysrgb&w=400', videoUrl: 'https://videos.pexels.com/video-files/2099538/2099538-hd.mp4' },
    { id: 6, title: 'Abstract Light', duration: '0:17', thumbnailUrl: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400', videoUrl: 'https://videos.pexels.com/video-files/3209828/3209828-hd.mp4' },
];

const VideoViewer: React.FC<{ video: typeof MOCK_VIDEOS[0]; onClose: () => void; }> = ({ video, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center animate-scale-in" onClick={onClose}>
            <div className="relative w-full h-auto p-4 flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <video
                    src={video.videoUrl}
                    controls
                    autoPlay
                    loop
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                    aria-label={video.title}
                />
                <div className="text-center text-white mt-4">
                    <h3 className="text-lg font-bold">{video.title}</h3>
                </div>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-black/75 transition-colors"
                    aria-label="Close video viewer"
                >
                    <i className="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
    );
};

const VideosView: React.FC<{ onSelectVideo: (video: typeof MOCK_VIDEOS[0]) => void }> = ({ onSelectVideo }) => (
    <div className="grid grid-cols-2 gap-2 p-2">
        {MOCK_VIDEOS.map(video => (
            <div
                key={video.id}
                className="relative aspect-video bg-gray-200 dark:bg-gray-700 cursor-pointer group rounded-lg overflow-hidden"
                onClick={() => onSelectVideo(video)}
            >
                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <i className="fa-solid fa-play text-white text-3xl"></i>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-xs font-semibold truncate">{video.title}</p>
                    <p className="text-white text-[10px]">{video.duration}</p>
                </div>
            </div>
        ))}
    </div>
);

const VideoGeneratorView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setGeneratedVideoUrl(null);

        const result = await generateVideo(prompt, setLoadingMessage);
        
        if (result) {
            setGeneratedVideoUrl(result);
        }
        
        setIsLoading(false);
    };

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center">
                {isLoading ? (
                    <div className="text-center p-4">
                        <i className="fa-solid fa-film text-5xl text-v-primary animate-pulse"></i>
                        <p className="mt-4 font-semibold text-lg text-v-text-light dark:text-v-text-dark">Crafting your video...</p>
                        <p className="mt-2 text-sm text-v-text-secondary-light dark:text-v-text-secondary-dark">{loadingMessage}</p>
                        <p className="text-xs text-v-text-secondary-light dark:text-v-text-secondary-dark mt-6">(This may take a few minutes)</p>
                    </div>
                ) : generatedVideoUrl ? (
                    <video src={generatedVideoUrl} controls autoPlay loop className="max-w-full max-h-full object-contain rounded-lg shadow-lg" />
                ) : (
                    <div className="text-center text-v-text-secondary-light dark:text-v-text-secondary-dark">
                        <i className="fa-solid fa-video text-6xl"></i>
                        <p className="mt-4">Your generated video will appear here.</p>
                    </div>
                )}
            </div>
            <div className="flex-shrink-0 pt-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A neon hologram of a cat driving at top speed"
                    className="w-full p-3 rounded-lg bg-v-surface-light dark:bg-v-surface-dark focus:outline-none focus:ring-2 focus:ring-v-primary resize-none"
                    rows={3}
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full mt-2 p-3 rounded-lg bg-v-primary text-white font-semibold disabled:bg-gray-400 dark:disabled:bg-gray-600 transition-colors active:scale-95"
                >
                    {isLoading ? 'Generating...' : 'Generate Video'}
                </button>
            </div>
        </div>
    );
};

const ViewSwitcher: React.FC<{ currentMode: string; onSwitch: (mode: string) => void }> = ({ currentMode, onSwitch }) => (
    <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-2 flex justify-center">
        <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-full p-1 flex space-x-1">
            <button onClick={() => onSwitch('videos')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex items-center space-x-2 ${currentMode === 'videos' ? 'bg-white dark:bg-v-bg-dark shadow-sm' : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'}`}>
                <i className="fa-solid fa-photo-film"></i><span>Videos</span>
            </button>
            <button onClick={() => onSwitch('generator')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors flex items-center space-x-2 ${currentMode === 'generator' ? 'bg-white dark:bg-v-bg-dark shadow-sm' : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'}`}>
                <i className="fa-solid fa-wand-magic-sparkles"></i><span>Generator</span>
            </button>
        </div>
    </div>
);


const VideosApp: React.FC = () => {
    const [mode, setMode] = useState<'videos' | 'generator'>('videos');
    const [selectedVideo, setSelectedVideo] = useState<(typeof MOCK_VIDEOS[0]) | null>(null);

    return (
        <AppContainer title="AI Videos">
            <div className="flex flex-col h-full">
                <ViewSwitcher currentMode={mode} onSwitch={(newMode) => setMode(newMode as 'videos' | 'generator')} />
                 <div className="flex-grow overflow-y-auto">
                    {mode === 'videos' ? (
                        <VideosView onSelectVideo={setSelectedVideo} />
                    ) : (
                        <VideoGeneratorView />
                    )}
                </div>
            </div>
            {selectedVideo && <VideoViewer video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
        </AppContainer>
    );
};

export default VideosApp;
