import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface Props {
  children: ReactNode;
  requireRole?: string;
}

export function AuthGuard({ children, requireRole }: Props) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  const publicRoutes = ['/login', '/auth/callback'];
  if (publicRoutes.includes(location.pathname)) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
