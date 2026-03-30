import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, CognitoUser } from './authService';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionExpired: boolean;
  user: CognitoUser | null;
  login: () => void | Promise<void>;
  logout: () => void;
  restoreSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading]             = useState(true);
  const [sessionExpired, setSessionExpired]   = useState(false);
  const [user, setUser]                       = useState<CognitoUser | null>(null);

  async function restoreSession(): Promise<boolean> {
    if (authService.isAuthenticated()) {
      setIsAuthenticated(true);
      setUser(authService.getUser());
      setSessionExpired(false);
      return true;
    }

    if (localStorage.getItem('vv_refresh_token')) {
      const tokens = await authService.refreshTokens();
      if (tokens) {
        setIsAuthenticated(true);
        setUser(authService.getUser());
        setSessionExpired(false);
        return true;
      }
      // Had a refresh token but it failed — session genuinely expired
      setSessionExpired(true);
    }

    setIsAuthenticated(false);
    setUser(null);
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    setUser(null);
    setSessionExpired(false);
    authService.logout();
  }

  useEffect(() => {
    async function init() {
      await restoreSession();
      setIsLoading(false);
    }
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        sessionExpired,
        user,
        login:  authService.login,
        logout,
        restoreSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
