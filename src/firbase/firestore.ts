import { db } from './firebase';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

export interface Note {
  id?: string;
  title: string;
  content: string;
  userId: string;
  isFavorite: boolean;
  isDeleted: boolean;
  createdAt: any;
  updatedAt: any;
  tags?: string[];
}

// Create a new note
export const createNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    console.log('Firestore: Creating note with data:', noteData);
    const docRef = await addDoc(collection(db, 'notes'), {
      ...noteData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log('Firestore: Note created successfully with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Firestore: Error creating note:', error);
    throw error;
  }
};

// Get all notes for a user
export const getUserNotes = async (userId: string): Promise<Note[]> => {
  try {
    console.log('Firestore: Getting notes for user:', userId);
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    console.log('Firestore: Query snapshot size:', querySnapshot.size);
    
    const notes: Note[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      const noteData = { id: doc.id, ...doc.data() } as Note;
      console.log('Firestore: Note data:', noteData);
      notes.push(noteData);
    });
    
    console.log('Firestore: Returning notes:', notes);
    return notes;
  } catch (error) {
    console.error('Firestore: Error getting user notes:', error);
    throw error;
  }
};

// Get favorite notes for a user
export const getUserFavorites = async (userId: string): Promise<Note[]> => {
  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('isFavorite', '==', true),
      where('isDeleted', '==', false),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      notes.push({
        id: doc.id,
        ...doc.data(),
      } as Note);
    });
    
    return notes;
  } catch (error) {
    console.error('Error getting user favorites:', error);
    throw error;
  }
};

// Get deleted notes (trash) for a user
export const getUserTrash = async (userId: string): Promise<Note[]> => {
  try {
    const q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('isDeleted', '==', true),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const notes: Note[] = [];
    
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
      notes.push({
        id: doc.id,
        ...doc.data(),
      } as Note);
    });
    
    return notes;
  } catch (error) {
    console.error('Error getting user trash:', error);
    throw error;
  }
};

// Update a note
export const updateNote = async (noteId: string, updates: Partial<Note>): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Toggle favorite status
export const toggleFavorite = async (noteId: string, isFavorite: boolean): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      isFavorite: !isFavorite,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// Move note to trash (soft delete)
export const moveToTrash = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      isDeleted: true,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error moving note to trash:', error);
    throw error;
  }
};

// Restore note from trash
export const restoreFromTrash = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await updateDoc(noteRef, {
      isDeleted: false,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error restoring note:', error);
    throw error;
  }
};

// Permanently delete note
export const permanentlyDeleteNote = async (noteId: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', noteId);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error permanently deleting note:', error);
    throw error;
  }
};

// Search notes by title or content
export const searchNotes = async (userId: string, searchTerm: string): Promise<Note[]> => {
  try {
    const allNotes = await getUserNotes(userId);
    const searchLower = searchTerm.toLowerCase();
    
    return allNotes.filter(note => 
      note.title.toLowerCase().includes(searchLower) ||
      note.content.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Error searching notes:', error);
    throw error;
  }
};
