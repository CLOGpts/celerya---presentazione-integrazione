

import React, { useState, useMemo, useCallback } from 'react';
import { demoData } from './data/demo.ts';
import { Language, Screen } from './types.ts';
import LanguageSelector from './components/LanguageSelector.tsx';
import TitleScreen from './components/TitleScreen.tsx';
import PresentationScreen from './components/PresentationScreen.tsx';
import SummaryScreen from './components/SummaryScreen.tsx';
import PricingScreen from './components/PricingScreen.tsx';
import EcosystemScreen from './components/EcosystemScreen.tsx';

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('Italiano');
  const [currentScreenId, setCurrentScreenId] = useState<string>('start');
  const [isExiting, setIsExiting] = useState<boolean>(false);

  const screens = useMemo(() => demoData.screens, []);
  
  const currentScreen: Screen | undefined = useMemo(() => {
    return screens.find(s => s.id === currentScreenId);
  }, [currentScreenId, screens]);

  const handleNavigation = useCallback((targetId: string) => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentScreenId(targetId);
      setIsExiting(false);
    }, 300); // Match animation duration
  }, []);

  const renderScreen = () => {
    if (!currentScreen) return null;

    const props = {
      id: currentScreen.id,
      text: currentScreen.text[language],
      actions: currentScreen.actions || [],
      next: currentScreen.next,
      steps: currentScreen.steps || [],
      scenarios: currentScreen.scenarios || [],
      sydAgent: currentScreen.sydAgent,
      dataProducer: currentScreen.dataProducer,
      ecosystem: currentScreen.ecosystem,
      language,
      onNavigate: handleNavigation,
    };

    switch (currentScreen.type) {
      case 'title':
        return <TitleScreen {...props} />;
      case 'presentation':
        return <PresentationScreen {...props} />;
      case 'summary':
        return <SummaryScreen {...props} />;
      case 'pricing':
        return <PricingScreen {...props} />;
      case 'ecosystem':
        return <EcosystemScreen {...props} ecosystem={props.ecosystem!} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white text-slate-800 min-h-screen w-full flex flex-col items-center justify-center font-sans relative p-4 sm:p-8">
      {demoData.languageSelector && (
        <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20">
          <LanguageSelector
            languages={demoData.languages}
            selectedLanguage={language}
            onSelectLanguage={setLanguage}
          />
        </div>
      )}
      
      <main className="w-full max-w-5xl mx-auto z-10">
        <div 
          className={`transition-opacity duration-300 ease-in-out w-full ${isExiting ? 'opacity-0' : 'opacity-100'}`}
          key={currentScreenId}
          >
          {renderScreen()}
        </div>
      </main>
    </div>
  );
};

export default App;