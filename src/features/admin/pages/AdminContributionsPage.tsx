import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FileText, ImageIcon, ExternalLink, CheckCircle, XCircle, Clock, AlertCircle, PlusCircle } from 'lucide-react';
import { ContributionsService, ContributionRecord } from '../../../services/contributionsService';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { useApp } from '../../../app/context/AppContext';
import { isGroupAdmin } from '../../../auth/permissions';
import { AdminRecordContributionModal } from '../components/AdminRecordContributionModal';

type FilterStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'ALL';

const STATUS_CONFIG: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  PENDING:  { label: 'Pending',  icon: Clock,         className: 'text-warning bg-warning/10 border-warning/20' },
  VERIFIED: { label: 'Verified', icon: CheckCircle,   className: 'text-chart-2 bg-chart-2/10 border-chart-2/20' },
  REJECTED: { label: 'Rejected', icon: XCircle,       className: 'text-destructive bg-destructive/10 border-destructive/20' },
};

export function AdminContributionsPage() {
  const { currentUser } = useApp();
  useSetPageHeader('Contributions', 'Verify or reject member proof of payment submissions');

  const [contributions, setContributions] = useState<ContributionRecord[]>([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState<FilterStatus>('PENDING');
  const [actionError, setActionError]     = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [recordModalOpen, setRecordModalOpen] = useState(false);

  // Reject form state per contribution id
  const [rejectOpen, setRejectOpen]   = useState<Record<string, boolean>>({});
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});

  function fetchContributions() {
    setLoading(true);
    ContributionsService.listRaw()
      .then(data => setContributions(data))
      .catch(() => setContributions([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchContributions(); }, []);

  // Page-level guard: all hooks must be called before any conditional return
  if (!isGroupAdmin(currentUser.role)) {
    return <Navigate to="/app/dashboard" replace />;
  }

  const filtered = contributions.filter(c =>
    filter === 'ALL' ? true : c.verificationStatus === filter,
  );

  const pendingCount = contributions.filter(c => c.verificationStatus === 'PENDING').length;

  async function handleViewProof(id: string) {
    try {
      const url = await ContributionsService.getProofUrl(id);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (e) {
      setActionError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Could not load proof' }));
    }
  }

  async function handleVerify(id: string) {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setActionError(prev => ({ ...prev, [id]: '' }));
    try {
      const updated = await ContributionsService.verify(id);
      setContributions(prev => prev.map(c => c.id === id ? updated : c));
    } catch (e) {
      setActionError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Failed to verify' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  async function handleReject(id: string) {
    const reason = rejectReason[id]?.trim();
    if (!reason) {
      setActionError(prev => ({ ...prev, [id]: 'A rejection reason is required.' }));
      return;
    }
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setActionError(prev => ({ ...prev, [id]: '' }));
    try {
      const updated = await ContributionsService.reject(id, reason);
      setContributions(prev => prev.map(c => c.id === id ? updated : c));
      setRejectOpen(prev => ({ ...prev, [id]: false }));
      setRejectReason(prev => ({ ...prev, [id]: '' }));
    } catch (e) {
      setActionError(prev => ({ ...prev, [id]: e instanceof Error ? e.message : 'Failed to reject' }));
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  }

  return (
    <div className="space-y-6">
      <AdminRecordContributionModal
        open={recordModalOpen}
        onClose={() => setRecordModalOpen(false)}
        onSuccess={fetchContributions}
      />

      {/* Filter tabs + action */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
      <div className="flex gap-2 flex-wrap">
        {(['PENDING', 'VERIFIED', 'REJECTED', 'ALL'] as FilterStatus[]).map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-accent text-accent-foreground'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
            {s === 'PENDING' && pendingCount > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Record Contribution
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
          <p className="text-sm">No {filter === 'ALL' ? '' : filter.toLowerCase() + ' '}contributions found.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map(c => {
            const cfg     = STATUS_CONFIG[c.verificationStatus] ?? STATUS_CONFIG['PENDING'];
            const StatusIcon = cfg.icon;
            const isLoading  = actionLoading[c.id];
            const err        = actionError[c.id];

            return (
              <li key={c.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="p-5">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{c.memberName}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatDate(c.contributionDate)} · {formatCurrency(c.amount)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${cfg.className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>

                  {/* Rejection reason */}
                  {c.verificationStatus === 'REJECTED' && c.rejectionReason && (
                    <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-xs text-destructive">{c.rejectionReason}</p>
                    </div>
                  )}

                  {/* Proof + action row */}
                  <div className="mt-4 flex items-center gap-2 flex-wrap">
                    {c.proofFileAvailable ? (
                      <button
                        onClick={() => handleViewProof(c.id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-secondary hover:bg-accent/10 text-foreground transition-colors"
                      >
                        {c.proofFileType === 'pdf'
                          ? <FileText className="w-3.5 h-3.5 text-accent" />
                          : <ImageIcon className="w-3.5 h-3.5 text-accent" />
                        }
                        View Proof
                        <ExternalLink className="w-3 h-3 text-muted-foreground" />
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground px-3 py-2">No proof uploaded</span>
                    )}

                    {c.verificationStatus === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleVerify(c.id)}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-chart-2/10 hover:bg-chart-2/20 text-chart-2 font-medium transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verify
                        </button>
                        <button
                          onClick={() => setRejectOpen(prev => ({ ...prev, [c.id]: !prev[c.id] }))}
                          disabled={isLoading}
                          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl bg-destructive/10 hover:bg-destructive/20 text-destructive font-medium transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>

                  {/* Inline reject form */}
                  {rejectOpen[c.id] && (
                    <div className="mt-3 space-y-2">
                      <textarea
                        rows={2}
                        value={rejectReason[c.id] ?? ''}
                        onChange={e => setRejectReason(prev => ({ ...prev, [c.id]: e.target.value }))}
                        placeholder="Reason for rejection (required)…"
                        className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-destructive/50"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReject(c.id)}
                          disabled={isLoading}
                          className="px-4 py-2 rounded-xl bg-destructive text-white text-xs font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Rejecting…' : 'Confirm Rejection'}
                        </button>
                        <button
                          onClick={() => setRejectOpen(prev => ({ ...prev, [c.id]: false }))}
                          className="px-4 py-2 rounded-xl bg-secondary text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {err && (
                    <p className="text-xs text-destructive mt-2">{err}</p>
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
