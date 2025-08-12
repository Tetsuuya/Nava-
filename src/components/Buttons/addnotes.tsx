import React from 'react';
import PlusButtonIcon from '../../assets/icons/Plusbutton.png';

interface AddbuttonProps {
  onClick: () => void;
}

const Addbutton: React.FC<AddbuttonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-4 pl-7 pt-3 pb-3 pr-7 m-1 ml-10 rounded-lg
                transition-all duration-200 ease-in-out hover:bg-gray-200
                 active:bg-gray-300 focus:outline-none focus:ring-2
                  focus:ring-blue-200 focus:ring-offset-2 bg-[#D9D9D9]"
                   >
            <img src={PlusButtonIcon} alt="Add" />
            <span className="Text-[#000000] text-2xl">Add Notes</span>
        </button>
    );
};

export default Addbutton;