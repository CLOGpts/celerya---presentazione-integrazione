import React, { useState, useMemo, useCallback } from 'react';
import { demoData } from './data/demo.ts';
import { Language, Screen } from './types.ts';
import { getTaskFromDB, addTaskToDB, updateTaskInDB, addNoteToDB, getNoteFromDB } from './services/firebase.ts';
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
  const [activeScreenProps, setActiveScreenProps] = useState<any>({});

  const screens = useMemo(() => demoData.screens, []);
  
  const currentScreen: Screen | undefined = useMemo(() => {
    return screens.find(s => s.id === currentScreenId);
  }, [currentScreenId, screens]);

  const handleNavigation = useCallback((targetId: string) => {
    setIsExiting(true);
    setTimeout(() => {
      setActiveScreenProps({}); // Resetta le props specifiche della schermata alla navigazione
      setCurrentScreenId(targetId);
      setIsExiting(false);
      window.scrollTo(0, 0);
    }, 300); // Match animation duration
  }, []);
  
  const handleAskAi = (query: string) => {
    setAssistantQuery(query);
    setIsAssistantOpen(true);
  };

  const handleExecuteCommands = useCallback(async (commands: { action: string, payload: any }[]) => {
    if (commands.length === 0) return;

    setTimeout(async () => { // Delay to allow user to read the AI response
        setIsAssistantOpen(false); // Close assistant after executing commands
        
        for (const command of commands) {
            const { action, payload } = command;

            switch(action) {
                case 'navigate':
                    if (payload.screenId && screens.some(s => s.id === payload.screenId)) {
                        handleNavigation(payload.screenId);
                    }
                    break;
                case 'open_url':
                    if (payload.url) {
                        window.open(payload.url, '_blank', 'noopener,noreferrer');
                    }
                    break;
                case 'add_task':
                    await addTaskToDB({
                        content: payload.content || (language === 'Italiano' ? 'Nuova attività' : 'New task'),
                        completed: false,
                        createdAt: new Date().toISOString(),
                        priority: payload.priority || 'medium',
                        dueDate: payload.dueDate || '',
                        project: payload.project || (language === 'Italiano' ? 'Da AI' : 'From AI')
                    });
                    if (commands.length === 1) handleNavigation('tasks'); // Navigate only if it's the single action
                    break;
                case 'complete_task':
                    if (payload.taskId) {
                        const task = await getTaskFromDB(payload.taskId);
                        if (task) {
                            await updateTaskInDB(payload.taskId, { ...task, completed: true });
                            // You might want to add a visual confirmation here
                        }
                    }
                    break;
                case 'add_note':
                    const newNote = await addNoteToDB({
                        title: payload.title || (language === 'Italiano' ? 'Nuovo appunto' : 'New Note'),
                        content: payload.content || '',
                        date: new Date().toISOString().slice(0, 10)
                    });
                    if (newNote && commands.length === 1) { // Navigate only if it's the single action
                        setActiveScreenProps({ initialNoteId: newNote.id });
                        handleNavigation('agenda');
                    }
                    break;
                case 'open_note':
                     if (payload.noteId) {
                        setActiveScreenProps({ initialNoteId: payload.noteId });
                        handleNavigation('agenda');
                    }
                    break;
                default:
                    console.warn(`Unknown command action: "${action}"`);
            }
        }
    }, 1500); // 1.5 second delay
  }, [handleNavigation, language, screens]);

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
        return <AgendaScreen {...props} {...activeScreenProps} />;
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
              onExecuteCommands={handleExecuteCommands}
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
      
      <main className="w-full max-w-screen-2xl mx-auto z-10 transition-all duration-300 mt-28">
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