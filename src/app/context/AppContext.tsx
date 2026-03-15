import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member } from '../../types';
import { UsersService } from '../../services/usersService';
import { ThemeProvider } from '../providers/ThemeProvider';

const DEFAULT_USER: Member = {
  id: '',
  name: 'Loading...',
  sharesOwned: 0,
  totalCommitment: 0,
  paidSoFar: 0,
  remaining: 0,
  role: 'member',
};

export type Screen =
  | 'dashboard'
  | 'shares'
  | 'pool'
  | 'ledger'
  | 'loans'
  | 'distribution'
  | 'admin'
  | 'account'
  | 'invitations';

export interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  currentUser: Member;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isContributionModalOpen: boolean;
  setIsContributionModalOpen: (isOpen: boolean) => void;
  isLoanModalOpen: boolean;
  setIsLoanModalOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isContributionModalOpen, setIsContributionModalOpen] = useState(false);
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Member>(DEFAULT_USER);

  useEffect(() => {
    UsersService.getMe()
      .then(setCurrentUser)
      .catch(() => {
        // Keep default user if API is unavailable (e.g., during development without backend)
      });
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <ThemeProvider>
      <AppContext.Provider
        value={{
          currentScreen,
          setCurrentScreen,
          currentUser,
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
