import React, { useState } from 'react';
import { useNotes } from '../../context/notescontext';
import Addbutton from '../../components/Buttons/addnotes';
import PrevNextButtons from '../../components/Buttons/prev&nextbutton';
import NoteModal from '../../components/notebox/notemodal';
import Notebox from '../../components/notebox/notebox';
import type { Note } from '../../firbase/firestore';

const Homepage: React.FC = () => {
  const { notes, loading, error, createNote, updateNote, moveToTrash, toggleFavorite } = useNotes();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleAddNote = async (noteData: { title: string; description: string }) => {
    try {
      if (editingNote) {
        // Update existing note
        await updateNote(editingNote.id!, {
          title: noteData.title,
          content: noteData.description,
        });
      } else {
        // Create new note
        await createNote({
          title: noteData.title,
          content: noteData.description,
          userId: '', // This will be set by the context
          isFavorite: false,
          isDeleted: false,
        });
      }
      setEditingNote(null);
      setModalOpen(false);
    } catch (err) {
      console.error('Failed to save note:', err);
    }
  };

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

  const handleCloseModal = () => {
    setEditingNote(null);
    setModalOpen(false);
  };

  const handleAddNewNote = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="flex-1 flex flex-col">
          <h1 className='font-bold text-xl sm:text-2xl'>Your Notes:</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading notes...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="flex-1 flex flex-col">
          <h1 className='font-bold text-xl sm:text-2xl'>Your Notes:</h1>
          <div className="flex justify-center items-center h-64">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Left Side: Notes and Modal */}
      <div className="flex-1 flex flex-col">
        <h1 className='font-bold text-xl sm:text-2xl mb-4'>Your Notes:</h1>
        <Notebox 
          notes={notes} 
          onEdit={handleEditNote} 
          onDelete={handleDeleteNote}
          onFavorite={handleFavoriteNote}
        />
        <NoteModal
          open={modalOpen}
          onClose={handleCloseModal}
          onAddNote={handleAddNote}
          editNote={editingNote ? { title: editingNote.title, description: editingNote.content } : undefined}
        />
      </div>
      
      {/* Right Side: Add and Prev/Next Buttons, Recents */}
      <div className="w-full lg:w-96 flex flex-col gap-4 items-center pt-2">
        <div className="w-full flex flex-col items-center gap-4">
          <Addbutton onClick={handleAddNewNote} />
          <div className="flex w-full justify-between gap-4">
            <PrevNextButtons />
          </div>
        </div>
        <div className="w-full mt-6">
          <div className="mb-2 font-medium">Recents:</div>
          <div className="bg-gray-200 rounded-lg h-20 mb-4" />
          <div className="bg-gray-200 rounded-lg h-20" />
        </div>
      </div>
    </div>
  );
};

export default Homepage; 