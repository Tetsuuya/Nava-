import React, { useState } from 'react';
import wordmarkIcon from '../../assets/wordmark.png';
import { useNavigate } from 'react-router-dom';
import { doSignOut } from '../../firbase/auth';
import { useAuth } from '../../context/authcontext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { userLoggedIn, currentUser } = useAuth();
  const [signingOut, setSigningOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleiconClick = () => navigate('/');
  const handleLogout = async () => {
    try {
      setSigningOut(true);
      await doSignOut();
      navigate('/login');
    } finally {
      setSigningOut(false);
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Get user's first name and first letter of username
  const getUserFirstName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  const getUsernameFirstLetter = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="bg-[#312E2E] p-4 sm:p-6 md:p-8 pl-4 sm:pl-8 md:pl-15 pr-4 sm:pr-8 md:pr-15">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img 
            src={wordmarkIcon} 
            alt="Nava Wordmark" 
            className="h-16 sm:h-20 md:h-22 cursor-pointer" 
            onClick={handleiconClick}
          />
          <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold cursor-pointer" onClick={handleiconClick}>
            NAVA
          </h1>
        </div>
        
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {userLoggedIn && (
            <>
              <div className="hidden sm:flex flex-col">
                <span className="text-gray-400 text-sm md:text-md">Hello 👋</span>
                <span className="text-white font-semibold text-base md:text-lg">{getUserFirstName()}</span>
              </div>
              
              <div className="relative">
                <div 
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={toggleDropdown}
                >
                  <span className="text-black font-bold text-lg sm:text-xl">{getUsernameFirstLetter()}</span>
                </div>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={handleLogout}
                      disabled={signingOut}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      {signingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );  
}

export default Header;
