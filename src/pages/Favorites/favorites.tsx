import React, { useState } from 'react';
import { useNotes } from '../../context/notescontext';
import Notebox from '../../components/notebox/notebox';
import NoteModal from '../../components/notebox/notemodal';
import type { Note } from '../../firbase/firestore';

const Favorites: React.FC = () => {
  const { favorites, loading, error, updateNote, moveToTrash, toggleFavorite } = useNotes();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleDeleteNote = async (note: Note) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await moveToTrash(note.id!);
      } catch (err) {
        console.error('Failed to delete note:', err);
      }
    }
  };

  const handleFavoriteNote = async (note: Note) => {
    try {
      await toggleFavorite(note.id!, note.isFavorite);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleUpdateNote = async (noteData: { title: string; description: string }) => {
    if (!editingNote) return;
    
    try {
      await updateNote(editingNote.id!, {
        title: noteData.title,
        content: noteData.description,
      });
      setEditingNote(null);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to update note:', err);
    }
  };

  const handleCloseModal = () => {
    setEditingNote(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading favorites...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Favorites</h1>
      <Notebox 
        notes={favorites} 
        onEdit={handleEditNote} 
        onDelete={handleDeleteNote}
        onFavorite={handleFavoriteNote}
      />
      <NoteModal
        open={modalOpen}
        onClose={handleCloseModal}
        onAddNote={handleUpdateNote}
        editNote={editingNote ? { title: editingNote.title, description: editingNote.content } : undefined}
      />
    </div>
  );
};

export default Favorites; 