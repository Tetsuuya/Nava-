import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../authcontext';
import {
  createNote,
  getUserNotes,
  getUserFavorites,
  getUserTrash,
  updateNote,
  toggleFavorite,
  moveToTrash,
  restoreFromTrash,
  permanentlyDeleteNote,
  searchNotes,
} from '../../firbase/firestore';
import type { Note } from '../../firbase/firestore';

interface NotesContextValue {
  notes: Note[];
  favorites: Note[];
  trash: Note[];
  loading: boolean;
  error: string | null;
  createNote: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateNote: (noteId: string, updates: Partial<Note>) => Promise<void>;
  toggleFavorite: (noteId: string, isFavorite: boolean) => Promise<void>;
  moveToTrash: (noteId: string) => Promise<void>;
  restoreFromTrash: (noteId: string) => Promise<void>;
  permanentlyDeleteNote: (noteId: string) => Promise<void>;
  searchNotes: (searchTerm: string) => Promise<Note[]>;
  refreshNotes: () => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const useNotes = (): NotesContextValue => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [favorites, setFavorites] = useState<Note[]>([]);
  const [trash, setTrash] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = async () => {
    if (!currentUser) {
      setNotes([]);
      setFavorites([]);
      setTrash([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const [userNotes, userFavorites, userTrash] = await Promise.all([
        getUserNotes(currentUser.uid),
        getUserFavorites(currentUser.uid),
        getUserTrash(currentUser.uid),
      ]);

      setNotes(userNotes);
      setFavorites(userFavorites);
      setTrash(userTrash);
    } catch (err: any) {
      console.error('Error loading notes:', err);
      setError(err?.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [currentUser]);

  const handleCreateNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!currentUser) return;

    try {
      // Create the note in Firestore
      const noteId = await createNote({
        ...noteData,
        userId: currentUser.uid,
      });

      // Create a temporary note object for immediate display with mock Firestore timestamps
      const tempNote: Note = {
        id: noteId,
        ...noteData,
        userId: currentUser.uid,
        createdAt: {
          toDate: () => new Date(),
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0,
        } as any,
        updatedAt: {
          toDate: () => new Date(),
          seconds: Math.floor(Date.now() / 1000),
          nanoseconds: 0,
        } as any,
        isFavorite: false,
        isDeleted: false,
      };

      // Add to local state immediately (optimistic update)
      setNotes(prevNotes => [tempNote, ...prevNotes]);
      
      // No need to refresh - the note is already in the UI with proper data
    } catch (err: any) {
      console.error('Error in handleCreateNote:', err);
      setError(err?.message || 'Failed to create note');
      throw err;
    }
  };

  const handleUpdateNote = async (noteId: string, updates: Partial<Note>) => {
    try {
      // Update local state immediately (optimistic update)
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, ...updates } : note
        )
      );
      
      setFavorites(prevFavorites => 
        prevFavorites.map(note => 
          note.id === noteId ? { ...note, ...updates } : note
        )
      );

      // Update in Firestore in background
      await updateNote(noteId, updates);
    } catch (err: any) {
      // Revert optimistic update on error
      await loadUserData();
      setError(err?.message || 'Failed to update note');
      throw err;
    }
  };

  const handleToggleFavorite = async (noteId: string, isFavorite: boolean) => {
    try {
      // Update local state immediately (optimistic update)
      setNotes(prevNotes => 
        prevNotes.map(note => 
          note.id === noteId ? { ...note, isFavorite: !isFavorite } : note
        )
      );
      
      // Update favorites state immediately for consistency
      if (isFavorite) {
        // Remove from favorites
        setFavorites(prevFavorites => 
          prevFavorites.filter(note => note.id !== noteId)
        );
      } else {
        // Add to favorites - find the note and add it
        const noteToAdd = notes.find(note => note.id === noteId);
        if (noteToAdd) {
          setFavorites(prevFavorites => [
            { ...noteToAdd, isFavorite: true },
            ...prevFavorites
          ]);
        }
      }
      
      // Update in Firestore in background
      await toggleFavorite(noteId, isFavorite);
    } catch (err: any) {
      // Revert optimistic update on error
      await loadUserData();
      setError(err?.message || 'Failed to toggle favorite');
      throw err;
    }
  };

  const handleMoveToTrash = async (noteId: string) => {
    try {
      // Update local state immediately (optimistic update)
      const noteToMove = notes.find(note => note.id === noteId);
      if (noteToMove) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
        // Also remove from favorites if it was there
        setFavorites(prevFavorites => prevFavorites.filter(note => note.id !== noteId));
        setTrash(prevTrash => [{ ...noteToMove, isDeleted: true }, ...prevTrash]);
      }

      // Update in Firestore in background
      await moveToTrash(noteId);
    } catch (err: any) {
      // Revert optimistic update on error
      await loadUserData();
      setError(err?.message || 'Failed to move note to trash');
      throw err;
    }
  };

  const handleRestoreFromTrash = async (noteId: string) => {
    try {
      await restoreFromTrash(noteId);
      
      // Update local state
      const noteToRestore = trash.find(note => note.id === noteId);
      if (noteToRestore) {
        setTrash(prevTrash => prevTrash.filter(note => note.id !== noteId));
        const restoredNote = { ...noteToRestore, isDeleted: false };
        setNotes(prevNotes => [restoredNote, ...prevNotes]);
        
        // If the restored note was a favorite, add it back to favorites
        if (restoredNote.isFavorite) {
          setFavorites(prevFavorites => [restoredNote, ...prevFavorites]);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to restore note');
      throw err;
    }
  };

  const handlePermanentDelete = async (noteId: string) => {
    try {
      // Call the Firestore function directly
      await permanentlyDeleteNote(noteId);
      
      // Update local state
      setTrash(prevTrash => prevTrash.filter(note => note.id !== noteId));
    } catch (err: any) {
      setError(err?.message || 'Failed to permanently delete note');
      throw err;
    }
  };

  const handleSearchNotes = async (searchTerm: string): Promise<Note[]> => {
    if (!currentUser) return [];
    
    try {
      return await searchNotes(currentUser.uid, searchTerm);
    } catch (err: any) {
      setError(err?.message || 'Failed to search notes');
      throw err;
    }
  };

  const refreshNotes = async () => {
    await loadUserData();
  };

  const value: NotesContextValue = {
    notes,
    favorites,
    trash,
    loading,
    error,
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    toggleFavorite: handleToggleFavorite,
    moveToTrash: handleMoveToTrash,
    restoreFromTrash: handleRestoreFromTrash,
    permanentlyDeleteNote: handlePermanentDelete,
    searchNotes: handleSearchNotes,
    refreshNotes,
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
