import { useState, useEffect } from 'react';
import { PoolService, PoolProjection } from '../services/poolService';

interface UsePoolProjectionResult {
  projection: PoolProjection | null;
  loading: boolean;
  error: string | null;
}

export function usePoolProjection(): UsePoolProjectionResult {
  const [projection, setProjection] = useState<PoolProjection | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    PoolService.getProjection()
      .then(data => { if (!cancelled) setProjection(data); })
      .catch(err  => { if (!cancelled) setError(err.message ?? 'Failed to load projection'); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, []);

  return { projection, loading, error };
}
