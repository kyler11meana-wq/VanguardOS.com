import React, { useState, useEffect } from 'react';
import AppContainer from '../components/AppContainer.tsx';
import { generateText } from '../services/geminiService.ts';

interface TodoItem {
    id: number;
    text: string;
    completed: boolean;
}

const NotepadApp: React.FC = () => {
    const [mode, setMode] = useState<'note' | 'todo'>('note');
    const [note, setNote] = useState('');
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [newTodo, setNewTodo] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Load note and todos from local storage on mount
    useEffect(() => {
        const savedNote = localStorage.getItem('vanguardos-note');
        if (savedNote) {
            setNote(savedNote);
        }
        const savedTodos = localStorage.getItem('vanguardos-todos');
        if (savedTodos) {
            setTodos(JSON.parse(savedTodos));
        }
    }, []);

    // Save note to local storage on change
    useEffect(() => {
        const handler = setTimeout(() => {
            localStorage.setItem('vanguardos-note', note);
        }, 500); // Debounce saving
        return () => clearTimeout(handler);
    }, [note]);

    // Save todos to local storage on change
    useEffect(() => {
        localStorage.setItem('vanguardos-todos', JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTodo.trim() === '') return;
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id: number) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const deleteTodo = (id: number) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const handleSummarize = async () => {
        if (!note.trim() || isAiLoading) return;
        setIsAiLoading(true);
        const prompt = `Please summarize the following text concisely:\n\n---\n${note}\n---`;
        const summary = await generateText(prompt);
        setNote(summary);
        setIsAiLoading(false);
    };

    const handleSuggest = async () => {
        if (!note.trim() || isAiLoading) return;
        setIsAiLoading(true);
        const prompt = `Based on the text below, continue writing, suggest related ideas, or expand on the concepts. Provide a creative and relevant continuation:\n\n---\n${note}\n---`;
        const suggestion = await generateText(prompt);
        setNote(prev => `${prev}\n\n${suggestion}`);
        setIsAiLoading(false);
    };
    
    const renderNoteView = () => (
        <div className="flex flex-col h-full relative">
            {isAiLoading && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-10 flex items-center justify-center">
                    <div className="text-center text-white">
                        <i className="fa-solid fa-sparkles text-4xl animate-pulse"></i>
                        <p className="mt-2 font-semibold">AI is thinking...</p>
                    </div>
                </div>
            )}
            <div className="flex-shrink-0 p-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
                <button
                    onClick={handleSummarize}
                    disabled={isAiLoading || !note.trim()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-v-accent/20 text-v-accent disabled:opacity-50 flex items-center space-x-2"
                >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Summarize</span>
                </button>
                 <button
                    onClick={handleSuggest}
                    disabled={isAiLoading || !note.trim()}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full bg-v-primary/20 text-v-primary disabled:opacity-50 flex items-center space-x-2"
                >
                    <i className="fa-solid fa-lightbulb"></i>
                    <span>Suggest</span>
                </button>
            </div>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Start typing or use the AI tools above..."
                className="w-full h-full p-4 bg-transparent focus:outline-none resize-none text-base leading-relaxed flex-grow"
                disabled={isAiLoading}
            />
        </div>
    );

    const renderTodoView = () => (
        <div className="flex flex-col h-full">
            <div className="flex-grow p-4 space-y-3 overflow-y-auto">
                {todos.map(todo => (
                    <div key={todo.id} className="flex items-center bg-v-surface-light dark:bg-v-surface-dark p-3 rounded-lg shadow-sm">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${todo.completed ? 'bg-v-primary border-v-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                                {todo.completed && <i className="fa-solid fa-check text-white text-xs"></i>}
                            </div>
                            <span className={`flex-grow ml-3 ${todo.completed ? 'line-through text-v-text-secondary-light dark:text-v-text-secondary-dark' : ''}`}>
                                {todo.text}
                            </span>
                        </label>
                        <button onClick={() => deleteTodo(todo.id)} className="ml-auto text-v-text-secondary-light dark:text-v-text-secondary-dark hover:text-red-500">
                            <i className="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                ))}
            </div>
            <form onSubmit={handleAddTodo} className="flex-shrink-0 p-2 border-t border-gray-200 dark:border-gray-700 flex items-center space-x-2">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-grow bg-transparent focus:outline-none px-2 py-1"
                />
                <button type="submit" className="p-2 rounded-full bg-v-primary text-white disabled:bg-gray-400" disabled={!newTodo.trim()}>
                    <i className="fa-solid fa-plus"></i>
                </button>
            </form>
        </div>
    );

    return (
        <AppContainer title="AI Notes">
            <div className="flex flex-col h-full">
                 <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-2 flex justify-center">
                    <div className="bg-v-surface-light dark:bg-v-surface-dark rounded-full p-1 flex space-x-1">
                        <button onClick={() => setMode('note')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${mode === 'note' ? 'bg-white dark:bg-v-bg-dark shadow-sm text-v-text-light dark:text-v-text-dark' : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'}`}>Note</button>
                        <button onClick={() => setMode('todo')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${mode === 'todo' ? 'bg-white dark:bg-v-bg-dark shadow-sm text-v-text-light dark:text-v-text-dark' : 'text-v-text-secondary-light dark:text-v-text-secondary-dark'}`}>To-do</button>
                    </div>
                </div>
                <div className="flex-grow">
                    {mode === 'note' ? renderNoteView() : renderTodoView()}
                </div>
            </div>
        </AppContainer>
    );
};

export default NotepadApp;