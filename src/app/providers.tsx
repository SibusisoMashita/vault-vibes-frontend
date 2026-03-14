import { ReactNode } from 'react';
import { AppProvider } from './context/AppContext';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <AppProvider>{children}</AppProvider>;
}

export { useApp } from './context/AppContext';

