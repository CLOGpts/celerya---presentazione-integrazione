
import React from 'react';
import { Action, Language } from '../types.ts';
import { CheckCircleIcon, SparklesIcon } from './Icons.tsx';

interface SummaryScreenProps {
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ text, actions, onNavigate, language }) => {
  const [title, ...descriptionParts] = text.split('\n');
  const lastLine = descriptionParts.length > 1 ? descriptionParts.pop() : '';

  const handleAction = (action: Action) => {
    if ((action.action === 'restart' || action.action === 'next') && action.target) {
        onNavigate(action.target);
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xl p-8 md:p-12 flex flex-col items-center text-center animate-slide-up-fade">
      <div className="mb-8 bg-green-100 p-6 rounded-full">
        <CheckCircleIcon className="h-24 w-24 text-green-500" />
      </div>
      <h2 className="text-6xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        {title} {actions.length === 1 && <SparklesIcon className="h-10 w-10 text-yellow-400" />}
      </h2>
      <p className="text-slate-500 max-w-lg mb-8 whitespace-pre-line text-2xl">{descriptionParts.join('\n')}</p>
      {lastLine && <p className="text-3xl font-semibold max-w-lg mb-12" style={{color: '#2D5F9D'}}>{lastLine}</p>}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="px-10 py-4 text-xl font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
            style={{ 
              backgroundColor: '#3B74B8',
              color: 'white',
              boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
            }}
          >
            {action.label[language]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SummaryScreen;