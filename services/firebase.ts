import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc, query, orderBy, getDoc } from "firebase/firestore";
import { Note, Task } from '../types/app.ts';

// ====================================================================================
// ISTRUZIONI
// ====================================================================================
// Incolla qui sotto l'oggetto di configurazione del TUO progetto Firebase.
// Lo trovi nelle Impostazioni Progetto > Le mie app > Configurazione SDK.
// ====================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyBpbj3bvBsBN8WJi2_--AuveNr2vY1AYRY",
  authDomain: "celerya-app-gestione.firebaseapp.com",
  projectId: "celerya-app-gestione",
  storageBucket: "celerya-app-gestione.firebasestorage.app",
  messagingSenderId: "901420314144",
  appId: "1:901420314144:web:ddef1c2b48b62ab817d645"
};

// Inizializzazione di Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const notesCollection = collection(db, "notes");
const tasksCollection = collection(db, "tasks");

// --- Funzioni per gli Appunti (Notes) ---

export const getNotesFromDB = async (): Promise<Note[]> => {
    try {
        const q = query(notesCollection, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note));
    } catch (error) {
        console.error("Errore nel caricare gli appunti da Firestore: ", error);
        alert("Impossibile caricare i dati. Verifica che le tue credenziali Firebase in services/firebase.ts siano corrette.");
        return [];
    }
};

export const getNoteFromDB = async (noteId: string): Promise<Note | undefined> => {
    try {
        const docRef = doc(db, "notes", noteId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Note) : undefined;
    } catch (error) {
        console.error("Errore nel caricare l'appunto da Firestore: ", error);
        return undefined;
    }
};

export const addNoteToDB = async (noteData: Omit<Note, 'id'>): Promise<Note | null> => {
    try {
        const docRef = await addDoc(notesCollection, noteData);
        return { id: docRef.id, ...noteData };
    } catch (error) {
        console.error("Errore nell'aggiungere l'appunto a Firestore: ", error);
        return null;
    }
};

export const updateNoteInDB = async (noteId: string, noteData: Partial<Omit<Note, 'id'>>) => {
    try {
        const noteDoc = doc(db, "notes", noteId);
        await setDoc(noteDoc, noteData, { merge: true });
    } catch (error) {
        console.error("Errore nell'aggiornare l'appunto su Firestore: ", error);
    }
};

export const deleteNoteFromDB = async (noteId: string) => {
    try {
        await deleteDoc(doc(db, "notes", noteId));
    } catch (error) {
        console.error("Errore nell'eliminare l'appunto da Firestore: ", error);
    }
};

// --- Funzioni per le Attività (Tasks) ---

export const getTasksFromDB = async (): Promise<Task[]> => {
    try {
        const q = query(tasksCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    } catch (error) {
        console.error("Errore nel caricare le attività da Firestore: ", error);
        return [];
    }
};

export const getTaskFromDB = async (taskId: string): Promise<Task | undefined> => {
    try {
        const docRef = doc(db, "tasks", taskId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? ({ id: docSnap.id, ...docSnap.data() } as Task) : undefined;
    } catch (error) {
        console.error("Errore nel caricare l'attività da Firestore: ", error);
        return undefined;
    }
};

export const addTaskToDB = async (taskData: Omit<Task, 'id'>): Promise<Task | null> => {
    try {
        const docRef = await addDoc(tasksCollection, taskData);
        return { id: docRef.id, ...taskData };
    } catch (error) {
        console.error("Errore nell'aggiungere l'attività a Firestore: ", error);
        return null;
    }
};

export const updateTaskInDB = async (taskId: string, taskData: Partial<Task>) => {
    try {
        const taskDoc = doc(db, "tasks", taskId);
        await setDoc(taskDoc, taskData, { merge: true });
    } catch (error) {
        console.error("Errore nell'aggiornare l'attività su Firestore: ", error);
    }
};

export const deleteTaskFromDB = async (taskId: string) => {
    try {
        await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
        console.error("Errore nell'eliminare l'attività da Firestore: ", error);
    }
};
