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
        <h1 className="text-6xl sm:text-8xl md:text-[10rem] font-bold flex items-start justify-center" style={{ color: '#2D5F9D' }}>
          <span>{mainTitle}</span>
          <span className="text-3xl sm:text-5xl md:text-7xl ml-1 sm:ml-2" style={{lineHeight: 0.8}}>®</span>
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
      
      <p className="text-2xl sm:text-4xl md:text-6xl text-slate-600 mt-12 sm:mt-16 mb-8">
        {subtitle}
      </p>

      {slogan && (
        <p className="text-xl sm:text-3xl md:text-5xl text-slate-500 italic mb-12 sm:mb-24">
          "{slogan}"
        </p>
      )}

      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 mt-8 sm:mt-16">
        {actions.map((action) => {
           const isGreen = action.color === 'green';
           const bgColor = isGreen ? '#16a34a' : '#3B74B8';
           const shadowColor = isGreen ? 'rgba(22, 163, 74, 0.3)' : 'rgba(59, 116, 184, 0.3)';
           const shadowColorLight = isGreen ? 'rgba(22, 163, 74, 0.2)' : 'rgba(59, 116, 184, 0.2)';
           const ringColor = isGreen ? '#16a34a' : '#3B74B8';

          return (
            <button 
              key={action.target}
              onClick={() => handleAction(action)}
              className="w-full max-w-xs sm:w-auto sm:min-w-[280px] flex items-center justify-center px-8 sm:px-12 py-4 sm:py-6 text-white font-bold text-xl sm:text-3xl rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50"
              style={{ 
                backgroundColor: bgColor, 
                boxShadow: `0 10px 15px -3px ${shadowColor}, 0 4px 6px -2px ${shadowColorLight}`,
                '--tw-ring-color': ringColor
              } as React.CSSProperties}
            >
              {action.label[language]}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TitleScreen;