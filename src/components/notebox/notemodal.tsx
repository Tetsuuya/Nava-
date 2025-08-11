import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface NoteModalProps {
  open: boolean;
  onClose: () => void;
  onAddNote: (note: { title: string; description: string }) => Promise<void>;
  editNote?: { title: string; description: string };
}

const NoteModal: React.FC<NoteModalProps> = ({ open, onClose, onAddNote, editNote }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setDescription(editNote.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [editNote, open]);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please fill in both title and description');
      return;
    }

    try {
      // Close modal immediately for instant feedback
      const noteData = { title: title.trim(), description: description.trim() };
      setTitle('');
      setDescription('');
      onClose();
      
      // Create note in background (optimistic update will show it immediately)
      await onAddNote(noteData);
    } catch (err) {
      console.error('Failed to save note:', err);
      // Note: Error handling is done in the context, so we don't need to show loading here
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    onClose();
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-[90vw]">
        <h2 className="text-xl font-bold mb-4">{editNote ? 'Edit Note' : 'Add Note'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input
            className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            required
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editNote ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default NoteModal;
