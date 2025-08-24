import React, { useState, useEffect, useCallback } from 'react';
import { Language, Action } from '../types.ts';
import { Note, Task } from '../types/app.ts';
import { getTasksFromDB, addTaskToDB, getNotesFromDB } from '../services/firebase.ts';
import { PlusIcon } from './Icons.tsx';

interface DashboardScreenProps {
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const ActionButton: React.FC<{ action: Action; onNavigate: (target: string) => void; language: Language; }> = ({ action, onNavigate, language }) => {
    const isGreen = action.color === 'green';
    const bgColor = isGreen ? 'bg-green-600 hover:bg-green-700' : 'bg-[#3B74B8] hover:bg-[#2D5F9D]';
    return (
        <button onClick={() => onNavigate(action.target)} className={`w-full p-4 sm:p-5 text-white font-semibold rounded-full shadow-md transition-colors text-center text-base sm:text-lg ${bgColor}`}>
            {action.label[language]}
        </button>
    );
};

const DashboardScreen: React.FC<DashboardScreenProps> = ({ actions, onNavigate, language }) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const refreshData = useCallback(async () => {
        const allTasks = await getTasksFromDB();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const overdueAndTodayTasks = allTasks.filter(t => {
            if (t.completed) return false;
            if (!t.dueDate) return false;
            const dueDate = new Date(t.dueDate + 'T00:00:00');
            return dueDate <= today;
        });
        setTasks(overdueAndTodayTasks);

        const allNotes = await getNotesFromDB();
        const todayStr = new Date().toISOString().slice(0, 10);
        const todayNotes = allNotes.filter(n => n.date === todayStr);
        const recentTodayNotes = todayNotes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
        setNotes(recentTodayNotes);
    }, []);


    useEffect(() => {
        refreshData();
        // Since we don't have a real-time listener from other tabs, we will re-fetch on focus
        const handleFocus = () => refreshData();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [refreshData]);

    const TodayTasksWidget = ({ tasks }: { tasks: Task[] }) => (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 md:p-8 lg:p-12">
            <h3 className="font-bold text-2xl md:text-3xl text-slate-800 mb-6 sm:mb-8">{language === 'Italiano' ? 'Le Mie Attività Scadute' : 'My Overdue Tasks'}</h3>
            {tasks.length > 0 ? (
                <ul className="space-y-3">
                    {tasks.slice(0, 3).map(task => (
                        <li key={task.id} className="text-slate-600 text-base sm:text-lg md:text-xl p-3 bg-slate-50 rounded-md">{task.content}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 text-base sm:text-lg md:text-xl italic">{language === 'Italiano' ? 'Nessuna attività in scadenza. Complimenti!' : 'No tasks due. Well done!'}</p>
            )}
            <button onClick={() => onNavigate('tasks')} className="mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-[#3B74B8] hover:underline">{language === 'Italiano' ? 'Vedi tutte le attività →' : 'View all tasks →'}</button>
        </div>
    );
    
    const RecentNotesWidget = ({ notes }: { notes: Note[] }) => (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 md:p-8 lg:p-12">
            <h3 className="font-bold text-2xl md:text-3xl text-slate-800 mb-6 sm:mb-8">{language === 'Italiano' ? 'Appunti di Oggi' : 'Today\'s Notes'}</h3>
            {notes.length > 0 ? (
                <ul className="space-y-3">
                    {notes.map(note => (
                        <li key={note.id} className="text-slate-600 text-base sm:text-lg md:text-xl p-3 bg-slate-50 rounded-md truncate">{note.title || (language === 'Italiano' ? 'Senza titolo' : 'Untitled')}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-slate-500 text-base sm:text-lg md:text-xl italic">{language === 'Italiano' ? 'Nessun appunto per oggi.' : 'No notes for today.'}</p>
            )}
             <button onClick={() => onNavigate('agenda')} className="mt-6 sm:mt-8 text-base sm:text-lg font-semibold text-[#3B74B8] hover:underline">{language === 'Italiano' ? 'Vai all\'agenda →' : 'Go to agenda →'}</button>
        </div>
    );

    const QuickCaptureWidget = ({ onTaskAdded }: { onTaskAdded: () => void }) => {
        const [content, setContent] = useState('');
        
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (content.trim() === '') return;
            
            const newTask: Omit<Task, 'id'> = {
                content: content.trim(),
                completed: false,
                createdAt: new Date().toISOString(),
                priority: 'medium',
                dueDate: new Date().toISOString().slice(0, 10),
                project: language === 'Italiano' ? 'Veloce' : 'Quick Capture'
            };
            await addTaskToDB(newTask);
            setContent('');
            onTaskAdded();
        };

        return (
             <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 md:p-8 lg:p-12">
                <h3 className="font-bold text-2xl md:text-3xl text-slate-800 mb-6 sm:mb-8">{language === 'Italiano' ? 'Cattura Veloce' : 'Quick Capture'}</h3>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input type="text" value={content} onChange={e => setContent(e.target.value)} placeholder={language === 'Italiano' ? 'Aggiungi per oggi...' : 'Add a task for today...'} className="w-full p-3 sm:p-4 border border-slate-300 rounded-lg text-base sm:text-xl focus:ring-2 focus:ring-[#3B74B8] focus:outline-none bg-white text-slate-800"/>
                    <button type="submit" className="p-3 sm:p-4 bg-[#3B74B8] text-white rounded-lg hover:bg-[#2D5F9D]"><PlusIcon className="h-6 w-6 sm:h-8 sm:w-8"/></button>
                </form>
            </div>
        );
    };

    const QuickAccessWidget = ({ actions }: { actions: Action[] }) => {
        const presentationActions = actions.filter(a => a.color !== 'green');
        const toolActions = actions.filter(a => a.color === 'green');

        return (
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 md:p-8 lg:p-12 md:col-span-2 lg:col-span-3">
                 <div className="space-y-8 sm:space-y-10">
                    <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{language === 'Italiano' ? 'Presentazioni' : 'Presentations'}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                            {presentationActions.map(action => <ActionButton key={action.target} action={action} onNavigate={onNavigate} language={language} />)}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">{language === 'Italiano' ? 'Strumenti' : 'Tools'}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {toolActions.map(action => <ActionButton key={action.target} action={action} onNavigate={onNavigate} language={language} />)}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in w-full">
            <div className="text-center mb-12 sm:mb-16">
                <div className="relative inline-block">
                    <h1 className="text-6xl sm:text-8xl font-bold flex items-start justify-center" style={{ color: '#2D5F9D' }}>
                        <span>Celerya</span>
                        <span className="text-3xl sm:text-5xl ml-1 sm:ml-2" style={{lineHeight: 0.8}}>®</span>
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
                <p className="text-3xl sm:text-5xl md:text-6xl text-slate-600 mt-12 sm:mt-16">
                    {language === 'Italiano' ? 'Goditi il tuo business.' : 'Enjoy your business.'}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
                <TodayTasksWidget tasks={tasks} />
                <RecentNotesWidget notes={notes} />
                <QuickCaptureWidget onTaskAdded={refreshData} />
                <QuickAccessWidget actions={actions} />
            </div>
        </div>
    );
};

export default DashboardScreen;