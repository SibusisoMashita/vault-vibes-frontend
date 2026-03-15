import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface PageHeaderContextType {
  title: string;
  subtitle?: string;
  setHeader: (title: string, subtitle?: string) => void;
  headerExtra?: ReactNode;
  setHeaderExtra: (extra?: ReactNode) => void;
}

const PageHeaderContext = createContext<PageHeaderContextType>({
  title: '',
  setHeader: () => {},
  setHeaderExtra: () => {},
});

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState<string | undefined>();
  const [headerExtra, setHeaderExtra] = useState<ReactNode>();

  const setHeader = useCallback((t: string, s?: string) => {
    setTitle(t);
    setSubtitle(s);
  }, []);

  return (
    <PageHeaderContext.Provider value={{ title, subtitle, setHeader, headerExtra, setHeaderExtra }}>
      {children}
    </PageHeaderContext.Provider>
  );
}

export function usePageHeader() {
  return useContext(PageHeaderContext);
}
