
import React from 'react';
import { Language, Action } from '../types.ts';

interface TitleScreenProps {
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ text, actions, onNavigate, language }) => {
  const [title, subtitle, slogan] = text.split('\n');

  const handleAction = (action: Action) => {
    if (action.action === 'next' && action.target) {
      onNavigate(action.target);
    }
  };

  const mainTitle = title.replace('®', '');

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[400px] p-4 animate-fade-in">
      <div className="relative inline-block">
        <h1 className="text-8xl md:text-9xl font-bold" style={{ color: '#2D5F9D' }}>
          {mainTitle}
          <sup className="text-4xl md:text-5xl top-[-2.5em] ml-2">®</sup>
        </h1>
        <div 
          className="w-full h-1 absolute -bottom-1"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='3' viewBox='0 0 40 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0.333984 1.5C5.33398 1.5 5.33398 -0.499999 10.334 1.5C15.334 3.5 15.334 1.5 20.334 1.5C25.334 -0.5 25.334 1.5 30.334 1.5C35.334 3.5 35.334 1.5 40.334 1.5' stroke='%23E6332A' stroke-width='1.2'/%3e%3c/svg%3e")`,
            backgroundSize: '20px 3px',
            backgroundRepeat: 'repeat-x',
          }}
        ></div>
      </div>
      
      <p className="text-4xl md:text-5xl text-slate-600 mt-12 mb-6">
        {subtitle}
      </p>

      {slogan && (
        <p className="text-3xl md:text-4xl text-slate-500 italic mb-20">
          "{slogan}"
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-6 mt-12">
        {actions.map((action) => (
          <button 
            key={action.target}
            onClick={() => handleAction(action)}
            className="min-w-[240px] flex items-center justify-center px-10 py-5 text-white font-bold text-2xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
            style={{ 
              backgroundColor: '#3B74B8', 
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

export default TitleScreen;