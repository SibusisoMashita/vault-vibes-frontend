import { useState, useEffect } from 'react';
import { DashboardService, DashboardSummary, toPool, toShare, toGroup } from '../services/dashboardService';
import { Pool, Share, Group } from '../types';

interface DashboardData {
  summary: DashboardSummary | null;
  pool: Pool | null;
  shares: Share | null;
  group: Group | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboardData(): DashboardData {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    DashboardService.getSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message ?? 'Failed to load dashboard');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  return {
    summary,
    pool: summary ? toPool(summary) : null,
    shares: summary ? toShare(summary) : null,
    group: summary ? toGroup(summary) : null,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  };
}
