import React, { useState, useMemo, useCallback } from 'react';
import { demoData } from './data/demo.ts';
import { Language, Screen } from './types.ts';
import LanguageSelector from './components/LanguageSelector.tsx';
import GlobalHeader from './components/GlobalHeader.tsx';
import AiAssistantScreen from './components/AiAssistantScreen.tsx';
import DashboardScreen from './components/DashboardScreen.tsx';
import TitleScreen from './components/TitleScreen.tsx';
import PresentationScreen from './components/PresentationScreen.tsx';
import SummaryScreen from './components/SummaryScreen.tsx';
import PricingScreen from './components/PricingScreen.tsx';
import EcosystemScreen from './components/EcosystemScreen.tsx';
import ApplicationsScreen from './components/ApplicationsScreen.tsx';
import AgendaScreen from './components/AgendaScreen.tsx';
import TasksScreen from './components/TasksScreen.tsx';

const App = () => {
  const [language, setLanguage] = useState<Language>('Italiano');
  const [currentScreenId, setCurrentScreenId] = useState('start');
  const [isExiting, setIsExiting] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantQuery, setAssistantQuery] = useState('');

  const screens = useMemo(() => demoData.screens, []);
  
  const currentScreen: Screen | undefined = useMemo(() => {
    return screens.find(s => s.id === currentScreenId);
  }, [currentScreenId, screens]);

  const handleNavigation = useCallback((targetId: string) => {
    setIsExiting(true);
    setTimeout(() => {
      setCurrentScreenId(targetId);
      setIsExiting(false);
      window.scrollTo(0, 0);
    }, 300); // Match animation duration
  }, []);
  
  const handleAskAi = (query: string) => {
    setAssistantQuery(query);
    setIsAssistantOpen(true);
  };

  const handleExecuteCommand = (command: { action: string, target: string }) => {
    const { action, target } = command;

    setTimeout(() => { // Delay to allow user to read the AI response
        setIsAssistantOpen(false); // Close assistant after executing command
        
        if (action === 'navigate') {
            const screenExists = screens.some(s => s.id === target);
            if (screenExists) {
                handleNavigation(target);
            } else {
                console.warn(`Navigation target "${target}" not found.`);
            }
        } else if (action === 'open_url') {
            window.open(target, '_blank', 'noopener,noreferrer');
        }
    }, 1500); // 1.5 second delay
  };

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
      links: currentScreen.links || [],
      language,
      onNavigate: handleNavigation,
    };

    switch (currentScreen.type) {
      case 'dashboard':
        return <DashboardScreen {...props} />;
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
      case 'applications':
        return <ApplicationsScreen {...props} />;
      case 'agenda':
        return <AgendaScreen {...props} />;
      case 'tasks':
        return <TasksScreen {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen w-full flex flex-col items-center font-sans relative p-4 sm:p-6 md:p-12">
      <GlobalHeader onAskAi={handleAskAi} />
      {isAssistantOpen && (
          <AiAssistantScreen 
              initialQuery={assistantQuery} 
              onClose={() => setIsAssistantOpen(false)} 
              onExecuteCommand={handleExecuteCommand}
              language={language}
          />
      )}
      {demoData.languageSelector && (
        <div className="absolute top-4 right-4 z-20">
          <LanguageSelector
            languages={demoData.languages}
            selectedLanguage={language}
            onSelectLanguage={setLanguage}
          />
        </div>
      )}
      
      <main className={`w-full max-w-screen-2xl mx-auto z-10 mt-28`}>
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