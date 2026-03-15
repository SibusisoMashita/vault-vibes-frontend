import { useState, useEffect } from 'react';
import { UsersService } from '../services/usersService';
import { Member } from '../types';

interface UseMembersResult {
  members: Member[];
  loading: boolean;
  error: string | null;
}

export function useMembers(): UseMembersResult {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    UsersService.listMembers()
      .then((data) => { if (!cancelled) setMembers(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Failed to load members'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { members, loading, error };
}
