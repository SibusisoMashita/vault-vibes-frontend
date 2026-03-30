import { useState, useEffect } from 'react';
import { X, Check, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../app/providers';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { LoansService } from '../../../services/loansService';
import { ConfigService } from '../../../services/configService';
import { formatCurrency } from '../../../utils/currency';

type Step = 'calculator' | 'preview' | 'success';

export function LoanRequestModal() {
  const { isLoanModalOpen, setIsLoanModalOpen, currentUser } = useApp();
  const { pool } = useDashboardData();
  const [step, setStep] = useState<Step>('calculator');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [interestRate, setInterestRate] = useState(20);

  useEffect(() => {
    if (!isLoanModalOpen) return;
    ConfigService.getBorrowing()
      .then(cfg => setInterestRate(cfg.interestRate))
      .catch(() => { /* keep default */ });
  }, [isLoanModalOpen]);

  const handleClose = () => {
    setIsLoanModalOpen(false);
    setTimeout(() => {
      setStep('calculator');
      setAmount('');
      setSubmitError(null);
    }, 300);
  };

  const numAmount = parseFloat(amount) || 0;
  const interest = numAmount * (interestRate / 100);
  const totalRepayment = numAmount + interest;

  const liquidityAvailable = pool?.liquidityAvailable ?? 0;
  const maxLoanAmount = pool?.availableToBorrow ?? 0;

  const handleSubmit = async () => {
    if (!currentUser.id) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await LoansService.request({
        userId: currentUser.id,
        amount: numAmount,
      });
      setStep('success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Requested amount exceeds your borrowing limit.';
      setSubmitError(message);
      setStep('calculator');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoanModalOpen && (
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
            onClick={(e) => e.stopPropagation()}
            className="bg-card w-full lg:max-w-2xl lg:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between lg:rounded-t-3xl">
              <h2 className="text-xl font-semibold">Request Borrowing</h2>
              <button
                onClick={handleClose}
                className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {step === 'calculator' && (
                <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
                  {/* Left: Input */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Loan Amount</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">R</span>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0"
                          className="w-full pl-12 pr-4 py-4 text-2xl font-semibold bg-secondary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent tabular-nums"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Maximum available: {formatCurrency(maxLoanAmount)}
                      </p>
                      {pool !== null && maxLoanAmount <= 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Borrowing is not available. You may not hold sufficient shares or the pool limit has been reached.
                        </p>
                      )}
                      {numAmount > maxLoanAmount && maxLoanAmount > 0 && (
                        <p className="text-xs text-destructive mt-1">
                          Requested amount exceeds your borrowing limit.
                        </p>
                      )}
                      {submitError && (
                        <p className="text-xs text-destructive mt-1">{submitError}</p>
                      )}
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
                      <div className="flex items-start gap-2">
                        <Calculator className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold mb-1">Interest Rate</p>
                          <p className="text-sm text-muted-foreground">
                            {interestRate}% flat rate - repayment due end of month
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Breakdown */}
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

              {step === 'preview' && (
                <div className="space-y-6 max-w-md mx-auto">
                  <div className="bg-secondary rounded-2xl p-6 space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Loan Request</p>
                      <p className="text-4xl font-bold tabular-nums">{formatCurrency(numAmount)}</p>
                    </div>

                    <div className="pt-4 border-t border-border space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Interest Rate</span>
                        <span className="font-semibold">{interestRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Interest</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(interest)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">Total Repayment</span>
                        <span className="font-bold tabular-nums">{formatCurrency(totalRepayment)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
                    <p className="text-sm">
                      Your loan request will be reviewed by the treasurer. Full repayment of {formatCurrency(totalRepayment)} is due by end of the approval month.
                    </p>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-8 space-y-6 max-w-md mx-auto">
                  <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-10 h-10 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">Request Submitted!</h3>
                    <p className="text-muted-foreground">
                      Your borrowing request for {formatCurrency(numAmount)} has been submitted for approval.
                    </p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-6 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(numAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Repayment</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(totalRepayment)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Status</span>
                      <span className="text-sm px-2 py-1 rounded-full bg-warning/10 text-warning">Pending Approval</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="sticky bottom-0 bg-card p-6 border-t border-border lg:rounded-b-3xl">
              {step === 'success' ? (
                <button
                  onClick={handleClose}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
                >
                  Done
                </button>
              ) : (
                <div className="flex gap-3">
                  {step === 'preview' && (
                    <button
                      onClick={() => setStep('calculator')}
                      className="flex-1 bg-secondary text-foreground py-4 rounded-2xl font-semibold hover:bg-secondary/80 transition-colors"
                    >
                      Back
                    </button>
                  )}
                  <button
                    onClick={() => step === 'calculator' ? setStep('preview') : handleSubmit()}
                    disabled={numAmount <= 0 || maxLoanAmount <= 0 || numAmount > maxLoanAmount || submitting}
                    className="flex-1 bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : step === 'calculator' ? 'Continue' : 'Submit Request'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
