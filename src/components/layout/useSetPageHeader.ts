import { useEffect, type ReactNode } from 'react';
import { usePageHeader } from './PageHeaderContext';

export function useSetPageHeader(title: string, subtitle?: string, extra?: ReactNode) {
  const { setHeader, setHeaderExtra } = usePageHeader();

  useEffect(() => {
    setHeader(title, subtitle);
    setHeaderExtra(extra);
  }, [title, subtitle, extra, setHeader, setHeaderExtra]);
}
