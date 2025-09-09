export interface Note {
    id: string;
    date: string;
    title: string;
    content: string;
}

export interface Task {
    id: string;
    content: string;
    completed: boolean;
    createdAt: string;
    priority: 'high' | 'medium' | 'low';
    dueDate: string;
    project: string;
}
