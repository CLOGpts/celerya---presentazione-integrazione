import React from 'react';
import { Action, Language } from '../types.ts';
import { UploadIcon, CloudIcon, ChipIcon, DashboardIcon, Squares2X2Icon } from './Icons.tsx';

interface HubScreenProps {
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const getIconForTarget = (targetId: string) => {
    const iconProps = { 
        className: "h-10 w-10",
        style: { color: '#3B74B8' }
    };
    switch (targetId) {
        case 'integrations_hub': return <Squares2X2Icon {...iconProps} />;
        case 'step1': return <UploadIcon {...iconProps} />;
        case 'step2': return <CloudIcon {...iconProps} />;
        case 'step3': return <ChipIcon {...iconProps} />;
        case 'dashboard': return <DashboardIcon {...iconProps} />;
        default: return null;
    }
}

const HubScreen: React.FC<HubScreenProps> = ({ text, actions, onNavigate, language }) => {
  const [title, subtitle] = text.split('\n');
  const mainTitle = title.replace('®', '');
  const mainActions = actions.filter(a => a.target !== 'start');
  const backAction = actions.find(a => a.target === 'start');
  const gridCols = mainActions.length === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2';

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[400px] p-4 animate-fade-in">
        <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl font-bold" style={{ color: '#2D5F9D' }}>
            {mainTitle}
            <sup className="text-2xl md:text-3xl top-[-1.5em] ml-1">®</sup>
            </h1>
            <div 
            className="w-full h-1 absolute -bottom-1"
            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='40' height='3' viewBox='0 0 40 3' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M0.333984 1.5C5.33398 1.5 5.33398 -0.499999 10.334 1.5C15.334 3.5 15.334 1.5 20.334 1.5C25.334 -0.5 25.334 1.5 30.334 1.5C35.334 3.5 35.334 1.5 40.334 1.5' stroke='%23E6332A' stroke-width='1.2'/%3e%3c/svg%3e")`, backgroundSize: '20px 3px', backgroundRepeat: 'repeat-x' }}
            ></div>
        </div>
        <p className="text-xl md:text-2xl text-slate-600 mt-8 mb-12">{subtitle}</p>
        <div className={`w-full max-w-lg grid grid-cols-1 ${gridCols} gap-4 md:gap-6`}>
            {mainActions.map((action, index) => (
                <button
                    key={index}
                    onClick={() => onNavigate(action.target)}
                    className="group bg-white border border-gray-200/90 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-[#3B74B8]"
                >
                    <div className="mb-4 bg-sky-100 p-4 rounded-full transition-colors duration-300 group-hover:bg-blue-100">
                        {getIconForTarget(action.target)}
                    </div>
                    <span className="font-semibold text-slate-700 text-base">{action.label[language]}</span>
                </button>
            ))}
        </div>
        {backAction && (
             <button
                onClick={() => onNavigate(backAction.target)}
                className="mt-12 px-6 py-2 text-slate-600 font-semibold rounded-full hover:bg-gray-200/80 transition-colors duration-200 text-sm"
             >
                {backAction.label[language]}
            </button>
        )}
    </div>
  );
};

export default HubScreen;
