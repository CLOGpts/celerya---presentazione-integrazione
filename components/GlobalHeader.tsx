import React, { useState } from 'react';
import { SparklesIcon } from './Icons.tsx';

interface GlobalHeaderProps {
    onAskAi: (query: string) => void;
}

const GlobalHeader: React.FC<GlobalHeaderProps> = ({ onAskAi }) => {
    const [query, setQuery] = useState('');
    const [isActive, setIsActive] = useState(false);

    const handleAskAi = () => {
        if(query.trim() === '') return;
        onAskAi(query);
        setQuery('');
        setIsActive(false);
    }
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAskAi();
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 p-4 flex justify-center">
            <div className="relative w-full max-w-2xl">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setTimeout(() => setIsActive(false), 200)}
                    onKeyDown={handleKeyDown}
                    placeholder="Cerca o chiedi all'AI..."
                    className="w-full pl-5 pr-14 sm:pl-6 sm:pr-16 py-3 sm:py-4 text-base sm:text-lg bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-slate-300 focus:ring-2 focus:ring-[#3B74B8] focus:outline-none transition-all"
                />
                 {isActive && query.length > 0 && (
                    <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-fast">
                        <div className="p-2">
                             <button onClick={handleAskAi} className="w-full text-left p-3 sm:p-4 rounded-lg hover:bg-sky-50 flex items-center gap-3 sm:gap-4 transition-colors">
                                <SparklesIcon className="h-5 w-5 sm:h-6 sm:w-6 text-sky-500 flex-shrink-0"/>
                                <span className="font-semibold text-slate-700 truncate text-sm sm:text-base">Chiedi all'AI: "{query}"</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default GlobalHeader;
