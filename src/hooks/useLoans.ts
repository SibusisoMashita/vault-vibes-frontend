import { useState, useEffect } from 'react';
import { LoansService } from '../services/loansService';
import { Loan } from '../types';

interface UseLoansResult {
  loans: Loan[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLoans(): UseLoansResult {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    LoansService.list()
      .then((data) => { if (!cancelled) setLoans(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Failed to load loans'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tick]);

  return { loans, loading, error, refetch: () => setTick((t) => t + 1) };
}
