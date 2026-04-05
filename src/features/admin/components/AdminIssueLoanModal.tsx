import { useEffect, useState } from 'react';
import { X, Check, Calculator, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LoansService } from '../../../services/loansService';
import { ConfigService } from '../../../services/configService';
import { UsersService } from '../../../services/usersService';
import { Member } from '../../../types';
import { formatCurrency } from '../../../utils/currency';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminIssueLoanModal({ open, onClose, onSuccess }: Props) {
  const [members, setMembers]           = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);

  const [selectedId, setSelectedId]     = useState('');
  const [amount, setAmount]             = useState('');
  const [interestRate, setInterestRate] = useState(20);

  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);

  // Load active members and interest rate once when modal opens
  useEffect(() => {
    if (!open) return;
    setMembersLoading(true);
    UsersService.listMembers()
      .then(all => setMembers(all.filter(m => m.status === 'ACTIVE')))
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));

    ConfigService.getBorrowing()
      .then(cfg => setInterestRate(cfg.interestRate))
      .catch(() => { /* keep default */ });
  }, [open]);

  function handleClose() {
    onClose();
    setTimeout(resetForm, 300);
  }

  function resetForm() {
    setSelectedId('');
    setAmount('');
    setSubmitError(null);
    setSuccess(false);
  }

  const numAmount      = parseFloat(amount) || 0;
  const interest       = numAmount * (interestRate / 100);
  const totalRepayment = numAmount + interest;

  async function handleSubmit() {
    if (!selectedId || numAmount <= 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await LoansService.issue(selectedId, numAmount);
      setSuccess(true);
      onSuccess();
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Failed to issue loan');
    } finally {
      setSubmitting(false);
    }
  }

  const canSubmit = !!selectedId && numAmount > 0;
  const selectedMember = members.find(m => m.id === selectedId);

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
            className="bg-card w-full lg:max-w-2xl lg:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between lg:rounded-t-3xl">
              <div>
                <h2 className="text-xl font-semibold">Issue Loan</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Issue directly on behalf of a member — active immediately</p>
              </div>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              {success ? (
                <div className="text-center py-8 space-y-5 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Loan Issued</h3>
                    <p className="text-sm text-muted-foreground">
                      A loan of{' '}
                      <span className="font-semibold text-foreground tabular-nums">{formatCurrency(numAmount)}</span>{' '}
                      has been issued to{' '}
                      <span className="font-medium text-foreground">{selectedMember?.name ?? 'the member'}</span>.
                    </p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-5 space-y-3 text-sm text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Loan amount</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(numAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Interest ({interestRate}%)</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(interest)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-muted-foreground">Total repayment</span>
                      <span className="font-bold tabular-nums">{formatCurrency(totalRepayment)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-5 lg:space-y-0">
                  {/* Left: inputs */}
                  <div className="space-y-5">
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

                    {/* Amount input */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold block">Loan amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">R</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={e => setAmount(e.target.value)}
                          placeholder="0"
                          min="1"
                          className="w-full pl-12 pr-4 py-4 text-2xl font-semibold bg-secondary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent tabular-nums"
                        />
                      </div>
                    </div>

                    {/* Interest rate info */}
                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-start gap-2">
                      <Calculator className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold mb-1">Interest Rate</p>
                        <p className="text-sm text-muted-foreground">{interestRate}% flat rate — repayment due end of month</p>
                      </div>
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
                        <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                        <p className="text-sm text-destructive">{submitError}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: live repayment preview */}
                  <div className="bg-secondary rounded-2xl p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      Repayment Summary
                    </h3>
                    {numAmount > 0 ? (
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total Repayment</p>
                          <p className="text-3xl font-bold tabular-nums">{formatCurrency(totalRepayment)}</p>
                        </div>
                        <div className="pt-4 border-t border-border space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Loan Amount</span>
                            <span className="font-semibold tabular-nums">{formatCurrency(numAmount)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Interest ({interestRate}%)</span>
                            <span className="font-semibold tabular-nums text-warning">{formatCurrency(interest)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                            <span className="text-muted-foreground">Total Repayment</span>
                            <span className="font-bold tabular-nums">{formatCurrency(totalRepayment)}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Enter an amount to see repayment details</p>
                      </div>
                    )}
                  </div>
                </div>
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
                  {submitting ? 'Issuing loan…' : 'Issue Loan'}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
