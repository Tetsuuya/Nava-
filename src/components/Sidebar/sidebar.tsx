import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotesButton from '../Buttons/notes';
import ScratchPadButton from '../Buttons/scratchpad';
import FavoritesButton from '../Buttons/favorites';
import TrashButton from '../Buttons/trash';

interface SidebarProps{
    className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ className = ""}) => {
    const navigate = useNavigate();

    const handleNotesClick = () => navigate('/');
    const handleScratchpadClick = () => navigate('/scratchpad');
    const handleFavoritesClick = () => navigate('/favorites');
    const handleTrashClick = () => navigate('/trash');

    return (
        <aside className={`bg-[#F0F0F0] p-3 sm:p-4 md:p-5 w-16 sm:w-20 md:w-24 lg:w-90 min-h-screen ${className}`}>
            <div className="flex flex-col gap-1 sm:gap-2 md:gap-3">
                <NotesButton onClick={handleNotesClick} />
                <ScratchPadButton onClick={handleScratchpadClick}/>
                <FavoritesButton onClick={handleFavoritesClick}/>
                <TrashButton onClick={handleTrashClick}/>
            </div>
        </aside>
    );
}

export default Sidebar;