import { useState, useEffect } from 'react';
import { LedgerService } from '../services/ledgerService';
import { Transaction } from '../types';

interface UseLedgerResult {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useLedger(): UseLedgerResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    LedgerService.list()
      .then((data) => { if (!cancelled) setTransactions(data); })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Failed to load ledger'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [tick]);

  return { transactions, loading, error, refetch: () => setTick((t) => t + 1) };
}
