import { useEffect, useState } from 'react';
import { TrendingUp, CheckCircle, XCircle, Clock, AlertCircle, DollarSign, RefreshCw } from 'lucide-react';
import { LoansService } from '../../../services/loansService';
import { Loan } from '../../../types';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

type FilterStatus = 'pending' | 'active' | 'repaid' | 'rejected' | 'all';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  pending:  { label: 'Pending',  icon: Clock,        className: 'text-warning bg-warning/10 border-warning/20' },
  active:   { label: 'Active',   icon: TrendingUp,   className: 'text-accent bg-accent/10 border-accent/20' },
  repaid:   { label: 'Repaid',   icon: CheckCircle,  className: 'text-chart-2 bg-chart-2/10 border-chart-2/20' },
  rejected: { label: 'Rejected', icon: XCircle,      className: 'text-destructive bg-destructive/10 border-destructive/20' },
};

export function AdminLoansPage() {
  useSetPageHeader('Loan Approvals', 'Review, approve and manage member borrowing requests');

  const [loans, setLoans]               = useState<Loan[]>([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState<FilterStatus>('pending');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [actionError, setActionError]   = useState<Record<string, string>>({});

  function fetchLoans() {
    setLoading(true);
    LoansService.list()
      .then(data => setLoans(data))
      .catch(() => setLoans([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchLoans(); }, []);

  const filtered = loans.filter(l => filter === 'all' ? true : l.status === filter);

  const pendingCount  = loans.filter(l => l.status === 'pending').length;
  const activeCount   = loans.filter(l => l.status === 'active').length;
  const repaidCount   = loans.filter(l => l.status === 'repaid').length;
  const rejectedCount = loans.filter(l => l.status === 'rejected').length;

  async function handleApprove(id: string) {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setActionError(prev => ({ ...prev, [id]: '' }));
    try {
      const updated = await LoansService.approve(id);
      setLoans(prev => prev.map(l => l.id === id ? updated : l));
    } catch (e) {
      setActionError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Failed to approve' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  async function handleReject(id: string) {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setActionError(prev => ({ ...prev, [id]: '' }));
    try {
      const updated = await LoansService.reject(id);
      setLoans(prev => prev.map(l => l.id === id ? updated : l));
    } catch (e) {
      setActionError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Failed to reject' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  async function handleRepay(id: string) {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setActionError(prev => ({ ...prev, [id]: '' }));
    try {
      const updated = await LoansService.repay(id);
      setLoans(prev => prev.map(l => l.id === id ? updated : l));
    } catch (e) {
      setActionError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Failed to mark as repaid' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="space-y-6">

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-warning/10 flex items-center justify-center mb-3">
            <Clock className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{pendingCount}</p>
          <p className="text-sm text-muted-foreground mt-0.5">Pending</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
            <TrendingUp className="w-4 h-4 text-accent" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{activeCount}</p>
          <p className="text-sm text-muted-foreground mt-0.5">Active</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-chart-2/10 flex items-center justify-center mb-3">
            <CheckCircle className="w-4 h-4 text-chart-2" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{repaidCount}</p>
          <p className="text-sm text-muted-foreground mt-0.5">Repaid</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center mb-3">
            <XCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold tabular-nums">{rejectedCount}</p>
          <p className="text-sm text-muted-foreground mt-0.5">Rejected</p>
        </div>
      </div>

      {/* Filter tabs + refresh */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {(['pending', 'active', 'repaid', 'rejected', 'all'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === s
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              {s === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={fetchLoans}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-xl hover:bg-secondary transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Loan list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
          <TrendingUp className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            No {filter === 'all' ? '' : filter + ' '}loan requests found.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map(loan => {
            const cfg        = STATUS_CONFIG[loan.status] ?? STATUS_CONFIG['pending'];
            const StatusIcon = cfg.icon;
            const busy       = actionLoading[loan.id];
            const err        = actionError[loan.id];

            return (
              <li key={loan.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-5 space-y-4">

                  {/* Top row: member + amount + status badge */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cfg.className}`}>
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{loan.memberName}</p>
                        <p className="text-sm text-muted-foreground">
                          Requested {formatDate(loan.dateIssued)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xl font-bold tabular-nums">{formatCurrency(loan.amount)}</p>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.className}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Detail grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm bg-secondary rounded-xl p-4">
                    <div>
                      <p className="text-muted-foreground mb-0.5">Interest Rate</p>
                      <p className="font-semibold">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Interest</p>
                      <p className="font-semibold tabular-nums">{formatCurrency(loan.interest)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Total Repayment</p>
                      <p className="font-semibold tabular-nums">{formatCurrency(loan.totalRepayment)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-0.5">Outstanding</p>
                      <p className="font-semibold tabular-nums">{formatCurrency(loan.remaining)}</p>
                    </div>
                  </div>

                  {/* Repayment progress bar — active loans only */}
                  {loan.status === 'active' && loan.totalRepayment > 0 && (
                    <div className="space-y-1">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-chart-2 rounded-full transition-all"
                          style={{ width: `${Math.min((loan.amountRepaid / loan.totalRepayment) * 100, 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{((loan.amountRepaid / loan.totalRepayment) * 100).toFixed(0)}% repaid</span>
                        <span>{formatCurrency(loan.amountRepaid)} of {formatCurrency(loan.totalRepayment)}</span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  {loan.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(loan.id)}
                        disabled={busy}
                        className="flex-1 flex items-center justify-center gap-2 bg-chart-2 text-white px-4 py-3 rounded-xl font-semibold hover:bg-chart-2/90 transition-colors disabled:opacity-50 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {busy ? 'Approving…' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(loan.id)}
                        disabled={busy}
                        className="flex-1 flex items-center justify-center gap-2 bg-destructive/10 text-destructive px-4 py-3 rounded-xl font-semibold hover:bg-destructive/20 transition-colors disabled:opacity-50 text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        {busy ? 'Rejecting…' : 'Reject'}
                      </button>
                    </div>
                  )}

                  {loan.status === 'active' && (
                    <button
                      onClick={() => handleRepay(loan.id)}
                      disabled={busy}
                      className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-3 rounded-xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 text-sm"
                    >
                      <DollarSign className="w-4 h-4" />
                      {busy ? 'Processing…' : 'Mark as Repaid'}
                    </button>
                  )}

                  {loan.status === 'repaid' && (
                    <div className="flex items-center gap-2 text-sm text-chart-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Loan fully repaid — {formatCurrency(loan.amountRepaid)} received</span>
                    </div>
                  )}

                  {loan.status === 'rejected' && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="w-4 h-4" />
                      <span>This request was rejected.</span>
                    </div>
                  )}

                  {err && (
                    <p className="text-xs text-destructive">{err}</p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
