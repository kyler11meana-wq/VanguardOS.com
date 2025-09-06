
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamChat } from '../services/geminiService.ts';
import AppContainer from '../components/AppContainer.tsx';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const AIAssistantApp: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Hello! I'm Vanguard AI. How can I help you today?", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = useCallback(async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const aiMessageId = Date.now() + 1;
        setMessages(prev => [...prev, { id: aiMessageId, text: '', sender: 'ai' }]);
        
        await streamChat(input, (chunk) => {
            setMessages(prev => prev.map(msg => 
                msg.id === aiMessageId 
                    ? { ...msg, text: msg.text + chunk } 
                    : msg
            ));
        });

        setIsLoading(false);
    }, [input, isLoading]);

    return (
        <AppContainer title="Vanguard AI">
            <div className="flex flex-col h-full">
                <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                    {messages.map((message) => (
                        <div key={message.id} className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-md ${
                                message.sender === 'user' 
                                ? 'bg-gradient-to-br from-blue-500 to-v-primary text-white rounded-br-none' 
                                : 'bg-v-surface-light dark:bg-v-surface-dark border border-gray-200/50 dark:border-gray-700/50 rounded-bl-none'
                            }`}>
                                <p className="text-sm whitespace-pre-wrap">{message.text || '...'}</p>
                            </div>
                        </div>
                    ))}
                     {isLoading && messages[messages.length - 1]?.sender === 'user' && (
                         <div className="flex justify-start">
                             <div className="max-w-[80%] rounded-2xl px-4 py-3 shadow-md bg-v-surface-light dark:bg-v-surface-dark border border-gray-200/50 dark:border-gray-700/50 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                <div className="flex-shrink-0 p-3 bg-v-bg-light/80 dark:bg-v-bg-dark/80 backdrop-blur-sm border-t border-white/20 dark:border-black/20">
                    <div className="flex items-center space-x-2 bg-v-surface-light dark:bg-v-surface-dark rounded-full p-1.5">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-grow bg-transparent focus:outline-none px-3 py-1"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="w-9 h-9 flex items-center justify-center rounded-full bg-v-primary text-white disabled:bg-gray-400 disabled:dark:bg-gray-600 transition-all active:scale-90 flex-shrink-0">
                           {isLoading ? <i className="fa-solid fa-stop text-xs"></i> : <i className="fa-solid fa-arrow-up"></i>}
                        </button>
                    </div>
                </div>
            </div>
        </AppContainer>
    );
};

export default AIAssistantApp;
