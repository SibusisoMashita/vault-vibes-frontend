import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Member } from '../types/stokvel';
import { currentUser } from '../data/mockData';
import { ThemeProvider } from '../components/ThemeProvider';

type Screen = 
  | 'dashboard' 
  | 'shares' 
  | 'pool' 
  | 'ledger' 
  | 'loans' 
  | 'distribution'
  | 'admin';

interface AppContextType {
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