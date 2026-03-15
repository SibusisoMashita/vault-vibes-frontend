import { useState, useEffect } from 'react';
import { ContributionsService } from '../services/contributionsService';
import { Transaction } from '../types';

interface UseContributionsResult {
  contributions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useContributions(): UseContributionsResult {
  const [contributions, setContributions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    ContributionsService.list()
      .then((data) => { if (!cancelled) setContributions(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Failed to load contributions'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tick]);

  return { contributions, loading, error, refetch: () => setTick((t) => t + 1) };
}
