
import React from 'react';
import { Action, Language } from '../types.ts';
import { UploadIcon, CloudIcon, ChipIcon } from './Icons.tsx';

interface InteractiveScreenProps {
  id: string;
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const getIconForStep = (id: string): React.ReactNode => {
    const iconProps = { 
        className: "h-16 w-16",
        style: { color: '#3B74B8' }
    };
    switch (id) {
        case 'step1':
            return <UploadIcon {...iconProps} />;
        case 'step2':
            return <CloudIcon {...iconProps} />;
        case 'step3':
            return <ChipIcon {...iconProps} />;
        default:
            return null;
    }
};

const InteractiveScreen: React.FC<InteractiveScreenProps> = ({ id, text, actions, onNavigate, language }) => {
  const [title, ...descriptionParts] = text.split('\n');
  const description = descriptionParts.join('\n');

  const handleAction = (action: Action) => {
    if (action.action === 'next' && action.target) {
      onNavigate(action.target);
    }
  };

  return (
    <div className="bg-white border border-gray-200/90 rounded-2xl shadow-xl p-8 md:p-12 flex flex-col items-center text-center animate-slide-up-fade">
        <div className="mb-6 bg-sky-100 p-4 rounded-full">
            {getIconForStep(id)}
        </div>
      <h2 className="text-3xl font-bold text-slate-800 mb-3">{title}</h2>
      <p className="text-slate-500 max-w-md mb-8">{description}</p>
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={() => handleAction(action)}
          className="px-8 py-3 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
          style={{ 
            backgroundColor: '#3B74B8', 
            boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
          }}
        >
          {action.label[language]}
        </button>
      ))}
    </div>
  );
};

export default InteractiveScreen;