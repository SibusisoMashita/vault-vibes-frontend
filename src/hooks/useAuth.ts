import { useApp } from '../app/providers';

export function useAuth() {
  const { currentUser } = useApp();

  return {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    role: currentUser.role,
  };
}

