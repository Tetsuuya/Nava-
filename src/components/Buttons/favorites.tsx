import React from 'react';

interface FavoritesButtonProps{
    onClick?:() => void;
    className?: string;
    disabled?:boolean;
    title?: string;
}


const FavoritesButton: React.FC<FavoritesButtonProps> = ({
    onClick,
    className = "",
    disabled = false,
    title = "Scratch"
}) =>{
    return(
        <button
            onClick = {onClick}
            disabled={disabled}
            title = {title}
            className={`flex items-center gap-4 p-2 mt-2 rounded-lg
                transition-all duration-200 ease-in-out hover:bg-gray-200
                 active:bg-gray-300 focus:outline-none focus:ring-2
                  focus:ring-blue-200 focus:ring-offset-2 disabled:opacity-50
                   disabled:cursor-not-allowed ${className}`}
                   >
            <img src="/src/assets/icons/favorites.png" alt="favorites.png" />
            <span className = "Text-[#000000] text-2xl">Favorites</span>
        </button>
    )
}

export default FavoritesButton;