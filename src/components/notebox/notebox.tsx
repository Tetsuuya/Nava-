import React from 'react';
import EditIcon from '../../assets/icons/edit.png';
import TrashIcon from '../../assets/icons/Trash.png';
import type { Note } from '../../firbase/firestore';

interface NoteboxProps {
  notes: Note[];
  onEdit?: (note: Note) => void;
  onDelete?: (note: Note) => void;
  onFavorite?: (note: Note) => void;
}

// Helper function to safely convert timestamps
const safeTimestampToDate = (timestamp: any): Date => {
  if (timestamp && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (timestamp && timestamp.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
};

const Notebox: React.FC<NoteboxProps> = ({ notes, onEdit, onDelete, onFavorite }) => {
  return (
    <div className="mt-4">
      {notes.length === 0 ? (
        <div className="text-gray-500">No notes yet.</div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {notes.map((note) => (
            <li
              key={note.id}
              className="bg-gray-300 rounded-xl p-4 shadow flex flex-col justify-between min-h-[110px] relative"
            >
              <div className="relative">
                <button
                  className={`absolute top-0 right-0 p-1 text-black rounded transition-colors ${
                    note.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                  }`}
                  onClick={() => onFavorite && onFavorite(note)}
                  title={note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <svg 
                    className={`w-6 h-6 ${note.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'}`}
                    viewBox="0 0 24 24"
                    fill={note.isFavorite ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
                <h3 className="font-bold text-lg mb-1 pr-8">{note.title}</h3>
                <p className="text-gray-700 text-sm mb-1">{note.content || 'Content'}</p>
                <p className="text-gray-600 text-xs">
                  {safeTimestampToDate(note.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="absolute bottom-3 right-4 flex gap-5">
                <button
                  className="p-1 text-black rounded"
                  onClick={() => onEdit && onEdit(note)}
                  title="Edit"
                >
                  <img src={EditIcon} alt="Edit" className="w-4 h-4" />
                </button>
                <button
                  className="p-1 text-black rounded"
                  onClick={() => onDelete && onDelete(note)}
                  title="Delete"
                >
                  <img src={TrashIcon} alt="Delete" className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notebox;
