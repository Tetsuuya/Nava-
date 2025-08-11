import React from 'react';

interface PrevNextButtonsProps {
  onPrevious?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  className?: string;
}

const PrevNextButtons: React.FC<PrevNextButtonsProps> = ({
  onPrevious,
  onNext,
  disablePrev = false,
  disableNext = false,
  className = ""
}) => {
  return (
    <div className={`flex gap-19 ml-25 ${className}`}>
      <button
        onClick={onPrevious}
        disabled={disablePrev}
        className={`flex items-center gap-1 px-3 py-1 rounded text-sm
                    transition-all duration-200 ease-in-out hover:bg-gray-200
             active:bg-gray-300 focus:outline-none focus:ring-1
              focus:ring-blue-200 disabled:opacity-50
               disabled:cursor-not-allowed bg-[#D9D9D9]`}
      >
        <span className="mr-1">←</span>
        Prev
      </button>
      
      <button
        onClick={onNext}
        disabled={disableNext}
        className="flex items-center gap-1 px-3 py-1  rounded text-sm
                   transition-all duration-200 ease-in-out hover:bg-gray-200
                   active:bg-gray-300 focus:outline-none focus:ring-1
                   focus:ring-blue-200 disabled:opacity-50
                   disabled:cursor-not-allowed bg-[#D9D9D9]"
      >
        Next    
        <span className="ml-1">→</span>
      </button>
    </div>
  );
};

export default PrevNextButtons;
