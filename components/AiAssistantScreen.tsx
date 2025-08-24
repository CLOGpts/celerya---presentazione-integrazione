import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getNotesFromDB, getTasksFromDB } from '../services/firebase.ts';
import { getAssistantResponse, fileToGenerativePart } from '../services/gemini.ts';
import { demoData } from '../data/demo.ts';
import { Language } from '../types.ts';
import { Note, Task } from '../types/app.ts';
import { CeleryaAiIcon, PaperClipIcon, UserIcon, XMarkIcon } from './Icons.tsx';

interface AiAssistantScreenProps {
    initialQuery: string;
    onClose: () => void;
    onExecuteCommands: (commands: { action: string, payload: any }[]) => void;
    language: Language;
}

const AiAssistantScreen: React.FC<AiAssistantScreenProps> = ({ initialQuery, onClose, onExecuteCommands, language }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = useCallback(async (queryOverride?: string) => {
        const userQuery = queryOverride || input;
        if (userQuery.trim() === '' && !file) return;

        setIsLoading(true);
        setInput('');
        
        const userMessage = { role: 'user', text: userQuery, file: file ? { name: file.name, type: file.type } : null };
        setMessages(prev => [...prev, userMessage]);
        
        let filePart = null;
        if (file) {
            filePart = await fileToGenerativePart(file);
            setFile(null);
        }

        try {
            // Costruisci un contesto ricco per l'AI
            const notesContextData = await getNotesFromDB();
            const tasksContextData = await getTasksFromDB();
    
            const notesContext = notesContextData.map((n: Note) => `- Appunto (ID: ${n.id}, Titolo: ${n.title})`).join('\n');
            const tasksContext = tasksContextData.map((t: Task) => `- Attività (ID: ${t.id}, Completata: ${t.completed}): ${t.content}`).join('\n');
            const dataContext = `--- APPUNTI ATTUALI (USA L'ID PER I COMANDI) ---\n${notesContext}\n\n--- ATTIVITÀ ATTUALI (USA L'ID PER I COMANDI) ---\n${tasksContext}`;
    
            const screenInfo = `
--- INFORMAZIONI SULL'APPLICAZIONE ---
- Schermate navigabili (usa l'ID per il comando 'navigate'):
    - 'start': La dashboard principale.
    - 'agenda': L'agenda per gestire gli appunti.
    - 'tasks': La lista delle cose da fare.
    - 'why_presentation': Presentazione sul 'Perché Celerya'.
    - 'ecosystem': Schermata sulla soluzione e l'ecosistema SYD.
    - 'integrations_presentation': Presentazione sulle modalità di integrazione.
    - 'pricing': Schermata con i piani tariffari.
    - 'applications_hub': Pagina con link a strumenti esterni.`;
        
            const appLinksScreen = demoData.screens.find(s => s.id === 'applications_hub');
            const linksInfo = appLinksScreen?.links?.map(l => `- ${l.label.Italiano}: ${l.href}`).join('\n') || '';
            const appContext = `\n- Link esterni (usa l'URL per il comando 'open_url'):\n${linksInfo}`;
    
            const fullContext = `${dataContext}\n\n${screenInfo}${appContext}`;

            const jsonResponse = await getAssistantResponse(userQuery, fullContext, filePart, language);

            if (jsonResponse.error) {
                setMessages(prev => [...prev, { role: 'model', text: jsonResponse.error, isError: true }]);
            } else {
                const hasCommands = jsonResponse.commands && jsonResponse.commands.length > 0;
                const hasText = jsonResponse.responseText && jsonResponse.responseText.trim() !== '';

                if (hasText) {
                    setMessages(prev => [...prev, { role: 'model', text: jsonResponse.responseText }]);
                } else if (hasCommands) {
                    const confirmation = language === 'Italiano' ? 'Ok, eseguo.' : 'Okay, done.';
                    setMessages(prev => [...prev, { role: 'model', text: confirmation }]);
                } else {
                    const fallbackError = language === 'Italiano' 
                        ? "Non ho capito bene. Puoi provare a chiedere in un altro modo?" 
                        : "I didn't quite understand. Can you try asking another way?";
                    setMessages(prev => [...prev, { role: 'model', text: fallbackError, isError: true }]);
                }
                
                if (hasCommands) {
                    onExecuteCommands(jsonResponse.commands);
                }
            }

        } catch (error) {
            console.error("Assistant Error:", error);
            const errorMessage = language === 'Italiano' 
                ? 'Oops! Qualcosa è andato storto. Riprova.' 
                : 'Oops! Something went wrong. Please try again.';
            setMessages(prev => [...prev, { role: 'model', text: errorMessage, isError: true }]);
        } finally {
            setIsLoading(false);
        }
    }, [input, file, onExecuteCommands, language]);

    useEffect(() => {
        if (initialQuery && messages.length === 0) {
            handleSendMessage(initialQuery);
        }
    }, [initialQuery, messages.length, handleSendMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    };

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] sm:h-[90vh] flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <CeleryaAiIcon />
                        <h2 className="text-xl font-bold text-slate-800">Assistente AI</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100"><XMarkIcon className="h-6 w-6" /></button>
                </header>
                
                <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-6">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-start gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'model' && <CeleryaAiIcon />}
                            <div className={`p-3 sm:p-4 rounded-2xl max-w-md sm:max-w-xl text-base sm:text-lg ${msg.role === 'user' ? 'bg-[#3B74B8] text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                {msg.file && <div className="mb-2 p-2 bg-black/10 rounded-lg text-sm">Allegato: {msg.file.name}</div>}
                                {msg.isError ? <p className="text-red-500">{msg.text}</p> : <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: (msg.text || '').replace(/\n/g, '<br />') }}></div>}
                            </div>
                            {msg.role === 'user' && <div className="bg-slate-200 rounded-full p-2 flex items-center justify-center shadow-inner"><UserIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600"/></div>}
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex items-start gap-4">
                            <CeleryaAiIcon />
                            <div className="p-3 sm:p-4 rounded-2xl bg-slate-100 text-slate-500 italic rounded-bl-none text-base sm:text-lg">Sto pensando...</div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
                
                <footer className="p-4 border-t border-slate-200 bg-white">
                    {file && <div className="flex items-center justify-between bg-sky-100 text-sky-800 p-2 rounded-lg mb-2 text-sm"><span>{file.name}</span><button onClick={() => setFile(null)}><XMarkIcon className="h-4 w-4"/></button></div>}
                    <div className="relative">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={language === 'Italiano' ? 'Chiedi qualcosa...' : 'Ask something...'}
                            className="w-full p-3 sm:p-4 pr-24 sm:pr-28 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#3B74B8] text-base sm:text-lg"
                            rows={1}
                        />
                         <div className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                             <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-500 hover:text-[#3B74B8]"><PaperClipIcon className="h-5 w-5 sm:h-6 sm:w-6"/></button>
                             <button onClick={() => handleSendMessage()} disabled={isLoading} className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#3B74B8] text-white font-semibold rounded-lg disabled:bg-slate-400 text-sm sm:text-base">Invia</button>
                         </div>
                         <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" />
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AiAssistantScreen;