import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ConfigService, BorrowingConfig } from '../../../services/configService';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/context/AppContext';
import { isGroupAdmin } from '../../../auth/permissions';

export function AdminBorrowingConfigPage() {
  const { currentUser } = useApp();
  useSetPageHeader('Borrowing Rules', 'Set the interest rate for loans');

  const [config, setConfig]   = useState<BorrowingConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [interestRate, setInterestRate] = useState('');

  useEffect(() => {
    let cancelled = false;
    ConfigService.getBorrowing()
      .then(cfg => {
        if (!cancelled) {
          setConfig(cfg);
          setInterestRate(cfg.interestRate.toString());
        }
      })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // Page-level guard: all hooks must be called before any conditional return
  if (!isGroupAdmin(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const updated = await ConfigService.updateBorrowing({
        interestRate: parseFloat(interestRate),
      });
      setConfig(updated);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse max-w-lg">
        <div className="h-10 bg-secondary rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Interest rate for borrowing (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={interestRate}
              onChange={e => setInterestRate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">Annual interest rate applied to all new borrowings</p>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground">
            Loans must be repaid by the end of the month they are issued.
          </div>

          {error   && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">Configuration saved.</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {config && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Current Values</h3>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Interest Rate</p>
            <p className="text-2xl font-bold tabular-nums">{config.interestRate}%</p>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {new Date(config.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
