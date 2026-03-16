import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member } from '../../types';
import { UsersService } from '../../services/usersService';
import { ThemeProvider } from '../providers/ThemeProvider';

const DEFAULT_USER: Member = {
  id: '',
  name: 'Loading...',
  phoneNumber: '',
  sharesOwned: 0,
  totalCommitment: 0,
  paidSoFar: 0,
  remaining: 0,
  expectedToDate: 0,
  role: 'member',
  status: 'ACTIVE',
  onboardingCompleted: false,
  onboardingVersion: 0,
};

export interface AppContextType {
  currentUser: Member;
  isUserLoading: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isContributionModalOpen: boolean;
  setIsContributionModalOpen: (isOpen: boolean) => void;
  isLoanModalOpen: boolean;
  setIsLoanModalOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('vv_dark_mode');
    return stored === 'true';
  });
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member>(DEFAULT_USER);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, []);

  useEffect(() => {
    UsersService.getMe()
      .then(setCurrentUser)
      .catch(() => {
        // Keep default user if API is unavailable (e.g., during development without backend)
      })
      .finally(() => setIsUserLoading(false));
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('vv_dark_mode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <ThemeProvider>
      <AppContext.Provider
        value={{
          currentUser,
          isUserLoading,
          isDarkMode,
          toggleDarkMode,
          isContributionModalOpen,
          setIsContributionModalOpen,
          isLoanModalOpen,
          setIsLoanModalOpen,
        }}
      >
        {children}
      </AppContext.Provider>
    </ThemeProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
