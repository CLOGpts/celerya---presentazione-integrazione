import React from 'react';
import { Language, Action, ApplicationLink } from '../types.ts';

interface ApplicationsScreenProps {
  text: string;
  links: ApplicationLink[];
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const ApplicationsScreen: React.FC<ApplicationsScreenProps> = ({ text, links, actions, onNavigate, language }) => {
  const [title, subtitle] = text.split('\n');

  const handleAction = (action: Action) => {
    if (action.action === 'next' && action.target) {
      onNavigate(action.target);
    }
  };

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[400px] p-4 animate-fade-in">
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-6" style={{ color: '#2D5F9D' }}>{title}</h1>
      <p className="text-lg sm:text-xl md:text-3xl text-slate-600 mb-12 max-w-lg">{subtitle || ''}</p>

      <div className="flex flex-col items-center justify-center gap-6 sm:gap-8 w-full max-w-xs sm:max-w-md">
        {links.map((link) => (
          <a 
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center px-6 sm:px-8 py-4 sm:py-5 text-white font-bold text-xl sm:text-2xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
            style={{ 
              backgroundColor: '#3B74B8', 
              boxShadow: '0 10px 15px -3px rgba(59, 116, 184, 0.3), 0 4px 6px -2px rgba(59, 116, 184, 0.2)',
            }}
          >
            {link.label[language]}
          </a>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-16">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => handleAction(action)}
            className="px-10 py-4 text-slate-600 font-semibold rounded-full hover:bg-gray-200/80 transition-colors duration-200 text-lg sm:text-xl"
          >
            {action.label[language]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsScreen;
