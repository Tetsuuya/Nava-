import React from 'react';
import { useNotes } from '../../context/notescontext';
import Notebox from '../../components/notebox/notebox';

const Trash: React.FC = () => {
  const { trash, loading, error, restoreFromTrash, permanentlyDeleteNote } = useNotes();

  const handleRestore = async (note: any) => {
    try {
      await restoreFromTrash(note.id);
    } catch (err) {
      console.error('Failed to restore note:', err);
    }
  };

  const handlePermanentDelete = async (note: any) => {
    if (window.confirm('Are you sure you want to permanently delete this note? This action cannot be undone.')) {
      try {
        // Delete from Firestore first
        await permanentlyDeleteNote(note.id);
        // The context will automatically update the UI
      } catch (err) {
        console.error('Failed to permanently delete note:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-gray-500">Loading trash...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Trash</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {trash.length} {trash.length === 1 ? 'note' : 'notes'} in trash
        </p>
      </div>

      {trash.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-gray-400 text-lg mb-2">🗑️</div>
          <p className="text-gray-500">No notes in trash</p>
          <p className="text-gray-400 text-sm">Deleted notes will appear here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trash.map((note) => (
            <div
              key={note.id}
              className="bg-gray-100 rounded-lg p-3 sm:p-4 border-l-4 border-red-400"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-gray-600 mb-3 text-sm sm:text-base">{note.content}</p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Deleted on: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 sm:ml-4">
                  <button
                    onClick={() => handleRestore(note)}
                    className="px-3 py-1 bg-blue-500 text-white text-xs sm:text-sm rounded hover:bg-blue-600 transition-colors"
                    title="Restore note"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(note)}
                    className="px-3 py-1 bg-red-500 text-white text-xs sm:text-sm rounded hover:bg-red-600 transition-colors"
                    title="Permanently delete"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Trash; 