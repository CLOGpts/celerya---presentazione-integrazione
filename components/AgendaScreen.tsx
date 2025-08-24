import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Language, Action } from '../types.ts';
import { Note, Task } from '../types/app.ts';
import { getNotesFromDB, addNoteToDB, updateNoteInDB, addTaskToDB, deleteNoteFromDB } from '../services/firebase.ts';
import { extractTasksFromText } from '../services/gemini.ts';
import { PencilIcon, TrashIcon, SparklesIcon, ChevronLeftIcon, XMarkIcon, PlusIcon } from './Icons.tsx';

interface AgendaScreenProps {
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
  initialNoteId?: string; // Nuova prop per aprire un appunto specifico
}

const AiSuggestionsModal: React.FC<{
    visible: boolean;
    tasks: string[];
    loading: boolean;
    error: string | null;
    language: Language;
    onClose: () => void;
    onAdd: (tasks: string[]) => void;
}> = ({ visible, tasks, loading, error, language, onClose, onAdd }) => {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);

    useEffect(() => {
        if (visible) {
            setSelectedTasks(tasks);
        }
    }, [tasks, visible]);

    if (!visible) return null;

    const toggleTaskSelection = (task: string) => {
        setSelectedTasks(prev => 
            prev.includes(task) ? prev.filter(t => t !== task) : [...prev, task]
        );
    };

    const handleAddClick = () => {
        onAdd(selectedTasks);
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-sky-500" />
                        <h2 className="text-xl font-bold text-slate-800">{language === 'Italiano' ? 'Attività Suggerite' : 'Suggested Tasks'}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100"><XMarkIcon className="h-6 w-6" /></button>
                </header>
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                    {loading && <p className="text-slate-500 italic">{language === 'Italiano' ? 'Analisi in corso...' : 'Analyzing...'}</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && !error && tasks.length === 0 && <p className="text-slate-500">{language === 'Italiano' ? 'Nessuna attività trovata.' : 'No tasks found.'}</p>}
                    {!loading && !error && tasks.length > 0 && (
                        <div className="space-y-3">
                            {tasks.map((task, index) => (
                                <div key={index} onClick={() => toggleTaskSelection(task)} className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                                    <input type="checkbox" checked={selectedTasks.includes(task)} readOnly className="h-5 w-5 rounded border-gray-300 text-[#3B74B8] focus:ring-[#3B74B8]" />
                                    <span className="text-slate-700">{task}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <footer className="p-4 border-t border-slate-200 bg-white flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 font-semibold rounded-lg hover:bg-slate-100">{language === 'Italiano' ? 'Annulla' : 'Cancel'}</button>
                    <button onClick={handleAddClick} disabled={selectedTasks.length === 0} className="px-4 py-2 bg-[#3B74B8] text-white font-semibold rounded-lg disabled:bg-slate-400">{language === 'Italiano' ? `Aggiungi ${selectedTasks.length} attività` : `Add ${selectedTasks.length} tasks`}</button>
                </footer>
            </div>
        </div>
    );
};


const AgendaScreen: React.FC<AgendaScreenProps> = ({ text, actions, onNavigate, language, initialNoteId }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentContent, setCurrentContent] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectionPopover, setSelectionPopover] = useState<{top: number, left: number, text: string} | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState<{ visible: boolean, tasks: string[], loading: boolean, error: string | null }>({ visible: false, tasks: [], loading: false, error: null });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchNotesAndSelect = async () => {
            const dbNotes = await getNotesFromDB();
            setNotes(dbNotes);
            if (initialNoteId) {
                const noteToOpen = dbNotes.find(n => n.id === initialNoteId);
                if (noteToOpen) {
                    handleSelectNote(noteToOpen);
                }
            } else if (dbNotes.length > 0) {
                handleSelectNote(dbNotes[0]);
            }
        };
        fetchNotesAndSelect();
    }, [initialNoteId]);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectionPopover && !(event.target as HTMLElement).closest('.selection-popover')) {
                setSelectionPopover(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectionPopover]);

    const handleSelectNote = (note: Note) => {
        setActiveNoteId(note.id);
        setCurrentTitle(note.title);
        setCurrentContent(note.content);
        setCurrentDate(note.date);
    };

    const handleNewNote = async () => {
        const newNoteData = {
            date: new Date().toISOString().slice(0, 10),
            title: language === 'Italiano' ? 'Nuovo Appunto' : 'New Note',
            content: ''
        };
        const newNote = await addNoteToDB(newNoteData);
        if (newNote) {
            const updatedNotes = [newNote, ...notes];
            setNotes(updatedNotes);
            handleSelectNote(newNote);
        }
    };
    
    const handleSaveNote = useCallback(async () => {
        if (!activeNoteId) return;
        
        const noteData = { title: currentTitle, content: currentContent, date: currentDate };
        await updateNoteInDB(activeNoteId, noteData);

        const updatedNotes = notes.map(note => 
            note.id === activeNoteId 
            ? { ...note, ...noteData }
            : note
        );
        setNotes(updatedNotes);
    }, [activeNoteId, currentTitle, currentContent, currentDate, notes]);
    
    useEffect(() => {
        const handler = setTimeout(() => {
            if (activeNoteId) {
                handleSaveNote();
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [currentTitle, currentContent, currentDate, activeNoteId, handleSaveNote]);

    const handleDeleteNote = async () => {
        if (!activeNoteId || !confirm(language === 'Italiano' ? 'Sei sicuro di voler eliminare questo appunto?' : 'Are you sure you want to delete this note?')) return;
        
        await deleteNoteFromDB(activeNoteId);
        const updatedNotes = notes.filter(note => note.id !== activeNoteId);
        setNotes(updatedNotes);
        setActiveNoteId(null);
    };
    
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().trim().length > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setSelectionPopover({
                top: rect.top + window.scrollY - 40,
                left: rect.left + window.scrollX + (rect.width / 2) - 30,
                text: selection.toString().trim(),
            });
        } else {
            setSelectionPopover(null);
        }
    };

    const handleCreateTaskFromSelection = async () => {
        if (!selectionPopover?.text) return;
        const newTask: Omit<Task, 'id'> = {
            content: selectionPopover.text,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: 'medium',
            dueDate: '',
            project: language === 'Italiano' ? 'Da Agenda' : 'From Agenda'
        };
        await addTaskToDB(newTask);
        setSelectionPopover(null);
        alert(language === 'Italiano' ? `Attività "${selectionPopover.text}" creata!` : `Task "${selectionPopover.text}" created!`);
    };

    const handleExtractTasks = async () => {
        if (!currentContent) return;
        setAiSuggestions({ visible: true, tasks: [], loading: true, error: null });
        const result = await extractTasksFromText(currentContent, language);
        if (result.error) {
            setAiSuggestions({ visible: true, tasks: [], loading: false, error: result.error });
        } else {
            setAiSuggestions({ visible: true, tasks: result.tasks, loading: false, error: null });
        }
    };
    
    const handleAddSelectedTasks = async (selectedTasks: string[]) => {
        for (const taskContent of selectedTasks) {
            const newTask: Omit<Task, 'id'> = {
                content: taskContent,
                completed: false,
                createdAt: new Date().toISOString(),
                priority: 'medium',
                dueDate: '',
                project: language === 'Italiano' ? 'Da Agenda' : 'From Agenda'
            };
            await addTaskToDB(newTask);
        }
        setAiSuggestions({ ...aiSuggestions, visible: false });
        alert(language === 'Italiano' ? `${selectedTasks.length} attività aggiunte!` : `${selectedTasks.length} tasks added!`);
    };

    const [title, subtitle] = text.split('\n');

    return (
        <div className="flex flex-col w-full animate-fade-in max-w-7xl mx-auto">
             <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold" style={{ color: '#2D5F9D' }}>{title}</h1>
                <p className="text-lg sm:text-2xl md:text-3xl text-slate-600 mt-4">{subtitle || ''}</p>
             </div>

             <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full min-h-[65vh] bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-6 md:p-8">
                {/* Notes List */}
                <div className="w-full md:w-1/3 flex flex-col border-r-0 md:border-r md:pr-6 border-slate-200">
                    <button onClick={handleNewNote} className="w-full mb-4 flex items-center justify-center gap-2 p-3 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105" style={{ backgroundColor: '#3B74B8' }}>
                        <PlusIcon className="h-6 w-6" />
                        {language === 'Italiano' ? 'Nuovo Appunto' : 'New Note'}
                    </button>
                    <div className="flex-grow overflow-y-auto pr-2">
                        <ul className="space-y-2">
                            {notes.map(note => (
                                <li key={note.id} onClick={() => handleSelectNote(note)} className={`p-3 rounded-lg cursor-pointer ${activeNoteId === note.id ? 'bg-sky-100' : 'hover:bg-slate-100'}`}>
                                    <h3 className={`font-bold text-slate-800 truncate ${activeNoteId === note.id ? 'text-[#3B74B8]' : ''}`}>{note.title}</h3>
                                    <p className="text-sm text-slate-500">{new Date(note.date).toLocaleDateString(language === 'Italiano' ? 'it-IT' : 'en-US')}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                
                {/* Note Editor */}
                <div className="w-full md:w-2/3 flex flex-col">
                    {activeNoteId ? (
                        <>
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <input type="text" value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder={language === 'Italiano' ? 'Titolo' : 'Title'} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none text-xl font-bold bg-white text-slate-800" />
                                <input type="date" value={currentDate} onChange={e => setCurrentDate(e.target.value)} className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none bg-white text-slate-500" />
                            </div>
                            <div className="relative flex-grow">
                                <textarea
                                    ref={textareaRef}
                                    onMouseUp={handleMouseUp}
                                    value={currentContent}
                                    onChange={e => setCurrentContent(e.target.value)}
                                    placeholder={language === 'Italiano' ? 'Scrivi qui i tuoi pensieri...' : 'Write your thoughts here...'}
                                    className="w-full h-full min-h-[40vh] p-3 border border-slate-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#3B74B8] bg-white text-slate-700 leading-relaxed text-lg"
                                />
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <button onClick={handleDeleteNote} className="p-2 text-slate-400 hover:text-red-500"><TrashIcon className="h-6 w-6" /></button>
                                <button onClick={handleExtractTasks} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-500 rounded-lg hover:bg-sky-600 shadow">
                                    <SparklesIcon className="h-5 w-5" />
                                    {language === 'Italiano' ? 'Estrai Attività con AI' : 'Extract Tasks with AI'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-500 italic text-lg">{language === 'Italiano' ? 'Seleziona un appunto o creane uno nuovo.' : 'Select a note or create a new one.'}</div>
                    )}
                </div>
             </div>

            {selectionPopover && (
                <div style={{ top: selectionPopover.top, left: selectionPopover.left }} className="absolute z-10 bg-slate-800 text-white rounded-md shadow-lg p-1 selection-popover animate-fade-in-fast">
                    <button onClick={handleCreateTaskFromSelection} className="px-3 py-1 text-sm font-semibold hover:bg-slate-700 rounded">{language === 'Italiano' ? 'Crea Attività' : 'Create Task'}</button>
                </div>
            )}

            <AiSuggestionsModal 
                visible={aiSuggestions.visible}
                tasks={aiSuggestions.tasks}
                loading={aiSuggestions.loading}
                error={aiSuggestions.error}
                language={language}
                onClose={() => setAiSuggestions({ visible: false, tasks: [], loading: false, error: null })}
                onAdd={handleAddSelectedTasks}
            />

             <div className="flex items-center justify-center gap-4 mt-8">
                {actions.map((action, index) => <button key={index} onClick={() => onNavigate(action.target)} className="px-10 py-4 text-slate-600 font-semibold rounded-full hover:bg-gray-200/80 transition-colors text-lg sm:text-xl">{action.label[language]}</button>)}
            </div>
        </div>
    );
};

export default AgendaScreen;