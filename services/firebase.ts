import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";

// ====================================================================================
// ISTRUZIONI IMPORTANTI
// ====================================================================================
// 1. Vai sulla console del tuo progetto Firebase.
// 2. Vai su "Impostazioni del progetto" (icona a forma di ingranaggio).
// 3. Nella sezione "Le mie app", clicca sull'icona </> per ottenere la configurazione
//    per un'app web.
// 4. Copia l'oggetto di configurazione (firebaseConfig) e incollalo qui sotto,
//    sostituendo l'oggetto `firebaseConfig` esistente.
//
// Esempio dell'oggetto che devi copiare da Firebase:
// const firebaseConfig = {
//   apiKey: "AIzaSy...YOUR_API_KEY",
//   authDomain: "your-project-id.firebaseapp.com",
//   projectId: "your-project-id",
//   storageBucket: "your-project-id.appspot.com",
//   messagingSenderId: "1234567890",
//   appId: "1:1234567890:web:abcdef123456"
// };
// ====================================================================================

const firebaseConfig = {
  apiKey: "AIzaSyBpbj3bvBsBN8WJi2_--AuveNr2vY1AYRY",
  authDomain: "celerya-app-gestione.firebaseapp.com",
  projectId: "celerya-app-gestione",
  storageBucket: "celerya-app-gestione.firebasestorage.app",
  messagingSenderId: "901420314144",
  appId: "1:901420314144:web:ddef1c2b48b62ab817d645"
};

// Inizializza Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const notesCollection = collection(db, "notes");
const tasksCollection = collection(db, "tasks");

// --- Funzioni per gli Appunti (Notes) ---

export const getNotesFromDB = async () => {
    try {
        const q = query(notesCollection, orderBy("date", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Errore nel caricare gli appunti da Firestore: ", error);
        return [];
    }
};

export const addNoteToDB = async (noteData: { title: string; content: string; date: string }) => {
    try {
        const docRef = await addDoc(notesCollection, noteData);
        return { id: docRef.id, ...noteData };
    } catch (error) {
        console.error("Errore nell'aggiungere l'appunto a Firestore: ", error);
        return null;
    }
};

export const updateNoteInDB = async (noteId: string, noteData: { title: string; content: string; date: string }) => {
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

export const getTasksFromDB = async () => {
    try {
        const q = query(tasksCollection, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Errore nel caricare le attività da Firestore: ", error);
        return [];
    }
};

export const addTaskToDB = async (taskData: object) => {
    try {
        const docRef = await addDoc(tasksCollection, taskData);
        return { id: docRef.id, ...taskData };
    } catch (error) {
        console.error("Errore nell'aggiungere l'attività a Firestore: ", error);
        return null;
    }
};

export const updateTaskInDB = async (taskId: string, taskData: object) => {
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