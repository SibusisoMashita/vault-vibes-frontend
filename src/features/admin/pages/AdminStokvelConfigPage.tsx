import { useEffect, useState } from 'react';
import { ConfigService, StokvelConfig } from '../../../services/configService';
import { formatCurrency } from '../../../utils/currency';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

export function AdminStokvelConfigPage() {
  useSetPageHeader('Stokvel Setup', 'Configure share availability and pricing');

  const [config, setConfig]     = useState<StokvelConfig | null>(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState(false);

  const [totalShares, setTotalShares] = useState('');
  const [sharePrice, setSharePrice]   = useState('');

  useEffect(() => {
    let cancelled = false;
    ConfigService.getStokvel()
      .then(cfg => {
        if (!cancelled) {
          setConfig(cfg);
          setTotalShares(cfg.totalShares.toString());
          setSharePrice(cfg.sharePrice.toString());
        }
      })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);
    try {
      const updated = await ConfigService.updateStokvel({
        totalShares: parseFloat(totalShares),
        sharePrice: parseFloat(sharePrice),
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
        <div className="h-10 bg-secondary rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">How many shares are available?</label>
            <input
              type="number"
              min="1"
              step="1"
              value={totalShares}
              onChange={e => setTotalShares(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">Maximum shares the stokvel can issue</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Price per share (R)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={sharePrice}
              onChange={e => setSharePrice(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">Price each member pays per share at issuance</p>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Shares Available</p>
              <p className="text-2xl font-bold tabular-nums">{config.totalShares}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Price per Share</p>
              <p className="text-2xl font-bold tabular-nums">{formatCurrency(config.sharePrice)}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Last updated: {new Date(config.updatedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
