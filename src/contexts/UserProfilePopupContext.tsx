
"use client";

import type { User } from '@/types';
import type React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';
import { UserProfilePopup as PopupComponent } from '@/components/shared/UserProfilePopup';

interface UserProfilePopupContextType {
  openPopup: (user: User) => void;
  closePopup: () => void;
  isPopupOpen: boolean;
  popupUser: User | null;
}

const UserProfilePopupContext = createContext<UserProfilePopupContextType | undefined>(undefined);

export const UserProfilePopupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupUser, setPopupUser] = useState<User | null>(null);

  const openPopup = useCallback((user: User) => {
    // Prevent opening for the current user or placeholder users
    // This check might need to be more robust based on your actual user data structure
    if (user.id === 'currentUser' || user.name === 'You' || user.name?.includes('(You)')) {
      console.log("UserProfilePopup: Attempted to open popup for current user or placeholder; prevented.");
      return;
    }
    // Also prevent if essential details are missing (e.g. if it's a dummy user object)
    if (!user.id || !user.name) {
        console.log("UserProfilePopup: Attempted to open popup for user with missing ID or name; prevented.");
        return;
    }
    setPopupUser(user);
    setIsPopupOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsPopupOpen(false);
    // Delay clearing user to allow for fade-out animation if any
    setTimeout(() => {
      setPopupUser(null);
    }, 300); // Adjust delay as needed
  }, []);

  return (
    <UserProfilePopupContext.Provider value={{ openPopup, closePopup, isPopupOpen, popupUser }}>
      {children}
      {popupUser && ( // Render popup only if there's a user
        <PopupComponent
          user={popupUser}
          isOpen={isPopupOpen} // Pass the current open state
          onOpenChange={(openStatus) => {
            if (!openStatus) {
              closePopup();
            }
          }}
        />
      )}
    </UserProfilePopupContext.Provider>
  );
};

export const useUserProfilePopup = (): UserProfilePopupContextType => {
  const context = useContext(UserProfilePopupContext);
  if (context === undefined) {
    throw new Error('useUserProfilePopup must be used within a UserProfilePopupProvider');
  }
  return context;
};
