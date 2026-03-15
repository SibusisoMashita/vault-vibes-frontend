import { useState, useEffect } from 'react';
import { PoolService } from '../services/poolService';
import { Pool, Share } from '../types';

interface UsePoolStatsResult {
  pool: Pool | null;
  shares: Share | null;
  loading: boolean;
  error: string | null;
}

export function usePoolStats(): UsePoolStatsResult {
  const [pool, setPool] = useState<Pool | null>(null);
  const [shares, setShares] = useState<Share | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    PoolService.getStats()
      .then(({ pool: p, shares: s }) => {
        if (!cancelled) {
          setPool(p);
          setShares(s);
        }
      })
      .catch((err) => { if (!cancelled) setError(err.message ?? 'Failed to load pool stats'); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { pool, shares, loading, error };
}
