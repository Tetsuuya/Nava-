interface NotesButtonProps {
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  title?: string;
}

const NotesButton: React.FC<NotesButtonProps> = ({
  onClick,
  className = "",
  disabled = false,
  title = "Notes"
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        flex items-center gap-4
        p-2 mt-10 rounded-lg
        transition-all duration-200 ease-in-out
        hover:bg-gray-200 active:bg-gray-300
        focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <img 
        src="/src/assets/icons/notes.png" 
        alt="Notes"
        className="size-8"
      />
      <span className="text-[#000000] text-2xl">Notes</span>
    </button>
  );
};

export default NotesButton;
