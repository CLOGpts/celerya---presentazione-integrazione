import React, { useState, useEffect } from 'react';
import { Language, Action } from '../types.ts';
import { getTasksFromDB, addTaskToDB, updateTaskInDB, deleteTaskFromDB } from '../services/firebase.ts';
import { TrashIcon } from './Icons.tsx';

interface TasksScreenProps {
  text: string;
  actions: Action[];
  onNavigate: (targetId: string) => void;
  language: Language;
}

const TasksScreen: React.FC<TasksScreenProps> = ({ text, actions, onNavigate, language }) => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [newTask, setNewTask] = useState({ content: '', priority: 'medium', dueDate: '', project: 'Lavoro' });
    const [activeProject, setActiveProject] = useState('All');

    useEffect(() => {
        const fetchTasks = async () => {
            setTasks(await getTasksFromDB());
        };
        fetchTasks();
    }, []);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.content.trim() === '') return;

        const taskData = {
            ...newTask,
            content: newTask.content.trim(),
            project: newTask.project.trim() || (language === 'Italiano' ? 'Nessun Progetto' : 'No Project'),
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        const addedTask = await addTaskToDB(taskData);
        if (addedTask) {
            setTasks([addedTask, ...tasks]);
        }
        setNewTask({ content: '', priority: 'medium', dueDate: '', project: newTask.project });
    };

    const handleToggleTask = async (taskId: string) => {
        const taskToUpdate = tasks.find(t => t.id === taskId);
        if (!taskToUpdate) return;
        
        const updatedTaskData = { ...taskToUpdate, completed: !taskToUpdate.completed };
        await updateTaskInDB(taskId, updatedTaskData);
        
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? updatedTaskData : task
        );
        setTasks(updatedTasks);
    };

    const handleDeleteTask = async (taskId: string) => {
        await deleteTaskFromDB(taskId);
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const projects = ['All', ...Array.from(new Set(tasks.map(t => t.project)))];
    
    const filteredTasks = tasks.filter(task => {
        if (activeProject === 'All') return !task.completed;
        return task.project === activeProject && !task.completed;
    });

    const completedTasks = tasks.filter(t => t.completed);

    const groupedTasks = filteredTasks.reduce((acc, task) => {
        const project = task.project || (language === 'Italiano' ? 'Nessun Progetto' : 'No Project');
        if (!acc[project]) acc[project] = [];
        acc[project].push(task);
        return acc;
    }, {} as Record<string, any[]>);
    
    const priorityMap = {
        high: { label: language === 'Italiano' ? 'Alta' : 'High', color: 'bg-red-500' },
        medium: { label: language === 'Italiano' ? 'Media' : 'Medium', color: 'bg-yellow-500' },
        low: { label: language === 'Italiano' ? 'Bassa' : 'Low', color: 'bg-green-500' },
    };

    return (
        <div className="flex flex-col w-full animate-fade-in max-w-5xl mx-auto">
             <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold" style={{ color: '#2D5F9D' }}>{text.split('\n')[0]}</h1>
                <p className="text-lg sm:text-2xl md:text-3xl text-slate-600 mt-4">{text.split('\n')[1] || ''}</p>
             </div>

             <div className="w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 sm:p-8 md:p-10">
                <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                    <input type="text" value={newTask.content} onChange={e => setNewTask({...newTask, content: e.target.value})} placeholder={language === 'Italiano' ? 'Cosa c\'è da fare?' : 'What needs to be done?'} className="sm:col-span-4 w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none text-base sm:text-lg bg-white text-slate-800" />
                    <input type="text" value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} placeholder={language === 'Italiano' ? 'Progetto' : 'Project'} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none bg-white text-slate-800 text-base sm:text-lg" />
                    <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})} className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none bg-white text-slate-800 text-base sm:text-lg">
                        <option value="high">{priorityMap.high.label}</option>
                        <option value="medium">{priorityMap.medium.label}</option>
                        <option value="low">{priorityMap.low.label}</option>
                    </select>
                    <input 
                        type="date" 
                        value={newTask.dueDate} 
                        onChange={e => setNewTask({...newTask, dueDate: e.target.value})} 
                        className={`w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3B74B8] focus:outline-none bg-white text-base sm:text-lg ${newTask.dueDate ? 'text-slate-800' : 'text-slate-400'}`} 
                    />
                    <button type="submit" className="w-full p-3 text-white font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105 text-base sm:text-lg" style={{ backgroundColor: '#3B74B8' }}>{language === 'Italiano' ? 'Aggiungi' : 'Add'}</button>
                </form>

                <div className="border-b border-slate-200 mb-4">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {projects.map(p => <button key={p} onClick={() => setActiveProject(p as string)} className={`px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base font-semibold rounded-full transition-colors flex-shrink-0 ${activeProject === p ? 'bg-[#3B74B8] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{p as string}</button>)}
                    </div>
                </div>

                <div className="space-y-8 h-[50vh] overflow-y-auto pr-2">
                    {Object.keys(groupedTasks).length > 0 ? Object.keys(groupedTasks).map((project) => {
                        const projectTasks = groupedTasks[project];
                        return (
                        <div key={project}>
                            {activeProject === 'All' && <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">{project}</h2>}
                             <ul className="space-y-3">
                                {[...projectTasks].sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(task => (
                                    <li key={task.id} className="flex items-center gap-4 p-2 sm:p-3 rounded-lg hover:bg-slate-50 group">
                                        <input type="checkbox" checked={false} onChange={() => handleToggleTask(task.id)} className="h-5 w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-[#3B74B8] focus:ring-[#3B74B8] cursor-pointer" />
                                        <span className="flex-grow text-slate-700 text-base sm:text-lg">{task.content}</span>
                                        {task.dueDate && <span className="text-xs sm:text-sm bg-slate-200 text-slate-600 px-2 py-1 rounded-full">{new Date(task.dueDate).toLocaleDateString(language === 'Italiano' ? 'it-IT' : 'en-US')}</span>}
                                        <span className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full ${priorityMap[task.priority as keyof typeof priorityMap]?.color || 'bg-gray-400'}`}></span>
                                        <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><TrashIcon className="h-5 w-5 sm:h-6 sm:w-6" /></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}) : (<p className="text-slate-500 italic py-4 text-base sm:text-lg">{language === 'Italiano' ? 'Nessuna attività da fare. Complimenti!' : 'No tasks to do. Well done!'}</p>)}
                    
                    {completedTasks.length > 0 && activeProject === 'All' && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-slate-500 mt-8 mb-3 border-t pt-4">{language === 'Italiano' ? 'Completate' : 'Completed'}</h2>
                             <ul className="space-y-3">
                                {completedTasks.map(task => (
                                    <li key={task.id} className="flex items-center gap-4 p-2 group">
                                        <input type="checkbox" checked={true} onChange={() => handleToggleTask(task.id)} className="h-5 w-5 sm:h-6 sm:w-6 rounded border-gray-300 text-[#3B74B8] focus:ring-[#3B74B8] cursor-pointer" />
                                        <span className="flex-grow text-slate-400 line-through text-base sm:text-lg">{task.content}</span>
                                        <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100"><TrashIcon className="h-5 w-5 sm:h-6 sm:w-6" /></button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
             </div>

             <div className="flex items-center justify-center gap-4 mt-8">
                {actions.map((action, index) => <button key={index} onClick={() => onNavigate(action.target)} className="px-10 py-4 text-slate-600 font-semibold rounded-full hover:bg-gray-200/80 transition-colors text-lg sm:text-xl">{action.label[language]}</button>)}
            </div>
        </div>
    );
};

export default TasksScreen;