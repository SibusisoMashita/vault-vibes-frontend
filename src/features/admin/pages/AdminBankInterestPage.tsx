import { useState } from 'react';
import { Landmark } from 'lucide-react';
import { LedgerService } from '../../../services/ledgerService';
import { Transaction } from '../../../types';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

export function AdminBankInterestPage() {
  useSetPageHeader('Bank Interest', 'Record interest earned on the stokvel bank account');

  const [amount, setAmount]           = useState('');
  const [postedAt, setPostedAt]       = useState('');
  const [reference, setReference]     = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [recent, setRecent]           = useState<Transaction[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }
    if (!postedAt) {
      setError('Date is required.');
      return;
    }

    setSubmitting(true);
    try {
      const entry = await LedgerService.recordBankInterest({
        amount: numAmount,
        postedAt,
        reference: reference.trim() || undefined,
        description: description.trim() || undefined,
      });
      setRecent(prev => [entry, ...prev]);
      setAmount('');
      setReference('');
      setDescription('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to record bank interest');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5">Amount (R)</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent tabular-nums"
            />
            <p className="text-xs text-muted-foreground mt-1">Interest amount credited to the pool</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input
              type="date"
              value={postedAt}
              onChange={e => setPostedAt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">Date the bank credited the interest</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Bank Reference</label>
            <input
              type="text"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder="e.g. INT-2024-03"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Notes</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Savings account interest – March 2024"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Recording…' : 'Record Bank Interest'}
          </button>
        </form>
      </div>

      {/* Info box */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <Landmark className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground">Pool-level income</p>
            <p>Bank interest is added directly to the pool balance. It is not allocated to any individual member and will appear in the transaction ledger.</p>
          </div>
        </div>
      </div>

      {/* Recent entries recorded this session */}
      {recent.length > 0 && (
        <div className="bg-card border border-border rounded-2xl">
          <div className="p-4 border-b border-border">
            <h3 className="font-semibold text-sm">Recorded This Session</h3>
          </div>
          <div className="divide-y divide-border">
            {recent.map(entry => (
              <div key={entry.id} className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{entry.description || 'Bank interest'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.date)}</p>
                </div>
                <p className="font-semibold tabular-nums text-green-600">
                  +{formatCurrency(entry.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
