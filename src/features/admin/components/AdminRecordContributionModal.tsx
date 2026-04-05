import { useEffect, useState } from 'react';
import { X, Check, Wallet, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ContributionsService, ContributionPreview } from '../../../services/contributionsService';
import { UsersService } from '../../../services/usersService';
import { Member } from '../../../types';
import { formatCurrency } from '../../../utils/currency';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminRecordContributionModal({ open, onClose, onSuccess }: Props) {
  const [members, setMembers]         = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const [selectedId, setSelectedId]   = useState('');
  const [date, setDate]               = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes]             = useState('');

  const [preview, setPreview]         = useState<ContributionPreview | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError]     = useState<string | null>(null);

  const [submitting, setSubmitting]   = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);

  // Load active members once when modal opens
  useEffect(() => {
    if (!open) return;
    setMembersLoading(true);
    UsersService.listMembers()
      .then(all => setMembers(all.filter(m => m.status === 'ACTIVE')))
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, [open]);

  // Fetch contribution preview whenever the selected member changes
  useEffect(() => {
    if (!selectedId) { setPreview(null); return; }
    let cancelled = false;
    setPreviewLoading(true);
    setPreviewError(null);
    ContributionsService.preview(selectedId)
      .then(data => { if (!cancelled) setPreview(data); })
      .catch(e  => { if (!cancelled) setPreviewError(e.message ?? 'Could not load preview'); })
      .finally(() => { if (!cancelled) setPreviewLoading(false); });
    return () => { cancelled = true; };
  }, [selectedId]);

  function handleClose() {
    onClose();
    setTimeout(resetForm, 300);
  }

  function resetForm() {
    setSelectedId('');
    setDate(new Date().toISOString().slice(0, 10));
    setNotes('');
    setPreview(null);
    setPreviewError(null);
    setSubmitError(null);
    setSuccess(false);
  }

  async function handleSubmit() {
    if (!selectedId || !date) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await ContributionsService.add({ userId: selectedId, contributionDate: date, notes: notes || undefined });
      setSuccess(true);
      onSuccess();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to record contribution');
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !!selectedId && !!date && !previewLoading && !previewError && !(preview?.hasContributedThisMonth);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center p-0 lg:p-4"
        >
          <motion.div
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            className="bg-card w-full lg:max-w-md lg:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between lg:rounded-t-3xl">
              <div>
                <h2 className="text-xl font-semibold">Record Contribution</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Record on behalf of a member — auto-verified</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6 space-y-5">

              {success ? (
                <div className="text-center py-8 space-y-5">
                  <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Contribution Recorded</h3>
                    <p className="text-sm text-muted-foreground">
                      The contribution has been recorded and verified for{' '}
                      <span className="font-medium text-foreground">
                        {members.find(m => m.id === selectedId)?.name ?? 'the member'}
                      </span>.
                    </p>
                  </div>
                  {preview && (
                    <div className="bg-secondary rounded-2xl p-5 space-y-3 text-sm text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Contribution amount</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(preview.contributionAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-semibold">{date}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Member selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Member</label>
                    <div className="relative">
                      <select
                        value={selectedId}
                        onChange={e => setSelectedId(e.target.value)}
                        disabled={membersLoading}
                        className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50"
                      >
                        <option value="">{membersLoading ? 'Loading members…' : 'Select a member'}</option>
                        {members.map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Contribution preview */}
                  {selectedId && (
                    <div className="bg-secondary rounded-2xl p-5">
                      {previewLoading ? (
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent" />
                          Calculating amount…
                        </div>
                      ) : previewError ? (
                        <div className="flex items-start gap-2 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          {previewError}
                        </div>
                      ) : preview ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-accent" />
                            <p className="text-sm font-semibold">Payment breakdown</p>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Shares owned</span>
                            <span className="font-semibold tabular-nums">{Number(preview.shareUnits).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Price per share</span>
                            <span className="font-semibold tabular-nums">{formatCurrency(preview.sharePrice)}</span>
                          </div>
                          {preview.repaymentAmount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Active loan repayment</span>
                              <span className="font-semibold tabular-nums text-warning">{formatCurrency(preview.repaymentAmount)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-border">
                            <span className="text-sm text-muted-foreground">Total amount</span>
                            <span className="text-lg font-bold tabular-nums">{formatCurrency(preview.totalDue)}</span>
                          </div>
                          {preview.hasContributedThisMonth && (
                            <div className="flex items-start gap-2 mt-2 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                              <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                              <p className="text-xs text-destructive">This member already has a contribution this month.</p>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">Contribution date</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold block">
                      Notes <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. Cash received at meeting"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>

                  {submitError && (
                    <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                      <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{submitError}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-card px-6 pb-6 pt-4 border-t border-border lg:rounded-b-3xl">
              {success ? (
                <button
                  onClick={handleClose}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || submitting}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Recording…' : 'Record Contribution'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
