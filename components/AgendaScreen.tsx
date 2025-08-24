import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Language, Action } from '../types.ts';
import { getNotesFromDB, addNoteToDB, updateNoteInDB, deleteTaskFromDB, getTasksFromDB, addTaskToDB, deleteNoteFromDB } from '../services/firebase.ts';
import { PencilIcon, TrashIcon, SparklesIcon, ChevronLeftIcon, XMarkIcon } from './Icons.tsx';

interface AgendaScreenProps {
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const AgendaScreen: React.FC<AgendaScreenProps> = ({ text, actions, onNavigate, language }) => {
    const [notes, setNotes] = useState<any[]>([]);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [currentContent, setCurrentContent] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
    const [selectionPopover, setSelectionPopover] = useState<{top: number, left: number, text: string} | null>(null);
    const [aiSuggestions, setAiSuggestions] = useState({ visible: false, tasks: [] as string[], loading: false, error: '' });

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const fetchNotes = async () => {
            const dbNotes = await getNotesFromDB();
            setNotes(dbNotes);
        };
        fetchNotes();
    }, []);
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectionPopover && !(event.target as HTMLElement).closest('.selection-popover')) {
                setSelectionPopover(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectionPopover]);

    const handleSelectNote = (note: any) => {
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
        const handler = setTimeout(() => handleSaveNote(), 500);
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
        const newTask = {
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

    const handleExtractActions = async () => {
        if (!currentContent) return;
        setAiSuggestions({ visible: true, loading: true, tasks: [], error: '' });
        
        try {
            if (!process.env.API_KEY) {
                const errorMessage = language === 'Italiano' 
                    ? "Manca la chiave API di Gemini. Configurala nell'ambiente." 
                    : "Gemini API Key is missing. Please configure it in the environment.";
                setAiSuggestions({ visible: true, loading: false, tasks: [], error: errorMessage });
                return;
            }

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const prompt = `Analizza il seguente testo e estrai una lista di attività concrete e azionabili. Restituisci il risultato come un oggetto JSON con una singola chiave 'tasks', che è un array di stringhe. Esempio: { "tasks": ["Fare follow-up con Mario riguardo al report", "Pianificare la riunione per la prossima settimana"] }. Non includere attività già completate. Il testo è:\n\n${currentContent}`;

            const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: prompt,
              config: {
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    tasks: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                },
              },
            });
            
            const jsonResponse = JSON.parse(response.text);
            const extractedTasks = jsonResponse.tasks || [];
            
            if (extractedTasks.length === 0) {
                setAiSuggestions({ visible: true, loading: false, tasks: [], error: language === 'Italiano' ? 'Nessuna azione trovata.' : 'No actionable items found.' });
            } else {
                setAiSuggestions({ visible: true, loading: false, tasks: extractedTasks, error: '' });
            }

        } catch (error) {
            console.error("Error extracting actions:", error);
            const errorMessage = language === 'Italiano' 
                ? "Errore durante la chiamata all'AI. Controlla la console e verifica che la chiave API sia corretta."
                : "Error calling AI. Check the console and verify your API key is correct.";
            setAiSuggestions({ visible: true, loading: false, tasks: [], error: errorMessage });
        }
    };
    
    const handleAddSuggestedTask = async (taskContent: string) => {
        const newTask = {
            content: taskContent,
            completed: false,
            createdAt: new Date().toISOString(),
            priority: 'medium',
            dueDate: '',
            project: language === 'Italiano' ? 'Da Agenda (AI)' : 'From Agenda (AI)'
        };
        await addTaskToDB(newTask);
        setAiSuggestions(prev => ({...prev, tasks: prev.tasks.filter(t => t !== taskContent)}));
    };

    const sortedNotes = [...notes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="flex flex-col w-full animate-fade-in max-w-7xl mx-auto">
             <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold" style={{ color: '#2D5F9D' }}>{text.split('\n')[0]}</h1>
                <p className="text-lg sm:text-2xl md:text-3xl text-slate-600 mt-4">{text.split('\n')[1] || ''}</p>
             </div>
             {selectionPopover && (
                <div 
                    className="selection-popover absolute z-10 bg-slate-800 text-white px-3 py-1 rounded-md shadow-lg text-sm font-semibold animate-fade-in-fast"
                    style={{ top: `${selectionPopover.top}px`, left: `${selectionPopover.left}px` }}
                    >
                    <button onClick={handleCreateTaskFromSelection}>
                        {language === 'Italiano' ? 'Crea Attività' : 'Create Task'}
                    </button>
                </div>
            )}
             <div className="flex flex-col md:flex-row gap-4 sm:gap-8 w-full h-[70vh] bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4">
                <div className={`w-full md:w-1/3 flex-col border-r-0 md:border-r border-slate-200 md:pr-4 ${activeNoteId ? 'hidden md:flex' : 'flex'}`}>
                    <button onClick={handleNewNote} className="w-full text-center px-4 py-3 mb-4 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B74B8] text-lg sm:text-xl" style={{ backgroundColor: '#3B74B8' }}>
                        + {language === 'Italiano' ? 'Nuovo Appunto' : 'New Note'}
                    </button>
                    <div className="overflow-y-auto flex-grow">
                        {sortedNotes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 p-4">
                                <PencilIcon className="h-16 w-16 sm:h-20 sm:w-20 mb-4" />
                                <p className="font-semibold text-lg sm:text-xl">{language === 'Italiano' ? 'Nessun appunto.' : 'No notes yet.'}</p>
                            </div>
                        ) : sortedNotes.map(note => (
                            <div key={note.id} onClick={() => handleSelectNote(note)} className={`p-3 sm:p-4 rounded-lg mb-2 cursor-pointer transition-colors ${activeNoteId === note.id ? 'bg-sky-100' : 'hover:bg-slate-100'}`}>
                                <p className="font-bold text-slate-800 truncate text-base sm:text-lg">{note.title || (language === 'Italiano' ? 'Senza Titolo' : 'Untitled')}</p>
                                <p className="text-sm sm:text-base text-slate-500">{new Date(note.date).toLocaleDateString(language === 'Italiano' ? 'it-IT' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`w-full md:w-2/3 flex-col ${activeNoteId ? 'flex' : 'hidden md:flex'}`}>
                    {activeNoteId ? (
                        <>
                           <div className="flex-shrink-0 mb-4">
                                <button onClick={() => setActiveNoteId(null)} className="md:hidden flex items-center gap-2 text-slate-600 font-semibold mb-3 p-1 -ml-1">
                                    <ChevronLeftIcon className="h-6 w-6" /><span>{language === 'Italiano' ? 'Tutti gli appunti' : 'All notes'}</span>
                                </button>
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                                    <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} className="flex-shrink-0 w-full sm:w-auto p-2 sm:p-3 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none text-base sm:text-lg" />
                                    <input type="text" placeholder={language === 'Italiano' ? 'Titolo...' : 'Title...'} value={currentTitle} onChange={(e) => setCurrentTitle(e.target.value)} className="w-full p-2 sm:p-3 border bg-white text-slate-800 border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none text-xl sm:text-2xl font-semibold"/>
                                    <div className="flex items-center self-end sm:self-center gap-2">
                                        <button onClick={handleExtractActions} className="p-2 sm:p-3 rounded-full hover:bg-yellow-100 text-yellow-500 transition-colors" title={language === 'Italiano' ? 'Estrai Azioni (AI)' : 'Extract Actions (AI)'}><SparklesIcon className="h-6 w-6 sm:h-7 sm:w-7" /></button>
                                        <button onClick={handleDeleteNote} className="p-2 sm:p-3 rounded-full hover:bg-red-100 text-red-500 transition-colors"><TrashIcon className="h-6 w-6 sm:h-7 sm:w-7" /></button>
                                    </div>
                                </div>
                            </div>
                            <textarea ref={textareaRef} onMouseUp={handleMouseUp} value={currentContent} onChange={(e) => setCurrentContent(e.target.value)} placeholder={language === 'Italiano' ? 'Scrivi qui...' : 'Write here...'} className="w-full h-full p-4 border bg-white text-slate-800 border-slate-300 rounded-lg flex-grow resize-none focus:ring-2 focus:ring-[#3B74B8] focus:outline-none text-base sm:text-lg md:text-xl leading-relaxed"></textarea>
                        </>
                    ) : (
                       <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                            <PencilIcon className="h-20 w-20 sm:h-28 sm:w-28 text-slate-300 mb-4" />
                            <p className="text-xl sm:text-3xl font-semibold">{language === 'Italiano' ? 'Seleziona un appunto' : 'Select a note'}</p>
                       </div>
                    )}
                </div>
             </div>
             <div className="flex items-center justify-center gap-4 mt-8">
                {actions.map((action, index) => <button key={index} onClick={() => onNavigate(action.target)} className="px-10 py-4 text-slate-600 font-semibold rounded-full hover:bg-gray-200/80 transition-colors text-lg sm:text-xl">{action.label[language]}</button>)}
            </div>
            {aiSuggestions.visible && (
                <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4" onClick={() => setAiSuggestions({visible: false, tasks:[], loading: false, error:''})}>
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg animate-fade-in-fast" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">{language === 'Italiano' ? 'Azioni Suggerite dall\'AI' : 'AI Suggested Actions'}</h3>
                        {aiSuggestions.loading && <p>{language === 'Italiano' ? 'Analisi in corso...' : 'Analyzing...'}</p>}
                        {aiSuggestions.error && <p className="text-red-500 font-semibold">{aiSuggestions.error}</p>}
                        {aiSuggestions.tasks.length > 0 && (
                            <ul className="space-y-2 max-h-60 overflow-y-auto">
                                {aiSuggestions.tasks.map((task, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                                        <span className="text-slate-700">{task}</span>
                                        <button onClick={() => handleAddSuggestedTask(task)} className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600">
                                            {language === 'Italiano' ? 'Aggiungi' : 'Add'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                         <button onClick={() => setAiSuggestions({visible: false, tasks:[], loading: false, error:''})} className="mt-4 w-full px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">
                            {language === 'Italiano' ? 'Chiudi' : 'Close'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgendaScreen;