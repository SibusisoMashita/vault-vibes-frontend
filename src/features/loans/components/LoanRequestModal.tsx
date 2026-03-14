import { useState } from 'react';
import { X, Check, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../app/providers';
import { pool } from '../../../services/apiClient';
import { formatCurrency } from '../../../utils/currency';

type Step = 'calculator' | 'preview' | 'success';

export function LoanRequestModal() {
  const { isLoanModalOpen, setIsLoanModalOpen } = useApp();
  const [step, setStep] = useState<Step>('calculator');
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('12');

  const handleClose = () => {
    setIsLoanModalOpen(false);
    setTimeout(() => {
      setStep('calculator');
      setAmount('');
      setMonths('12');
    }, 300);
  };

  const numAmount = parseFloat(amount) || 0;
  const numMonths = parseInt(months) || 12;
  const interestRate = 8; // 8% annual rate
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment = numAmount > 0 
    ? numAmount * (monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1)
    : 0;
  const totalRepayment = monthlyPayment * numMonths;
  const totalInterest = totalRepayment - numAmount;

  const maxLoanAmount = pool.liquidityAvailable * 0.4; // Max 40% of liquidity

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
              <h2 className="text-xl font-semibold">Request Loan</h2>
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
                  {/* Left: Inputs */}
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Loan Amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground">
                          R
                        </span>
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
                    </div>

                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Repayment Period
                      </label>
                      <select
                        value={months}
                        onChange={(e) => setMonths(e.target.value)}
                        className="w-full px-4 py-4 text-lg font-semibold bg-secondary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value="6">6 months</option>
                        <option value="12">12 months</option>
                        <option value="18">18 months</option>
                        <option value="24">24 months</option>
                      </select>
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
                      <div className="flex items-start gap-2">
                        <Calculator className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold mb-1">Interest Rate</p>
                          <p className="text-sm text-muted-foreground">
                            {interestRate}% annual rate applied to all group loans
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
                      <>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                            <p className="text-3xl font-bold tabular-nums">
                              {formatCurrency(monthlyPayment)}
                            </p>
                          </div>

                          <div className="pt-4 border-t border-border space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Loan Amount</span>
                              <span className="font-semibold tabular-nums">{formatCurrency(numAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Total Interest</span>
                              <span className="font-semibold tabular-nums text-warning">{formatCurrency(totalInterest)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                              <span className="text-muted-foreground">Total Repayment</span>
                              <span className="font-bold tabular-nums">{formatCurrency(totalRepayment)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-card rounded-xl p-4">
                          <p className="text-xs text-muted-foreground mb-2">Payment Schedule</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span>Payments</span>
                              <span className="font-semibold">{numMonths} months</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span>Each month</span>
                              <span className="font-semibold tabular-nums">{formatCurrency(monthlyPayment)}</span>
                            </div>
                          </div>
                        </div>
                      </>
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

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                        <p className="text-xl font-semibold tabular-nums">{formatCurrency(monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Duration</p>
                        <p className="text-xl font-semibold">{numMonths} months</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-border space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Interest Rate</span>
                        <span className="font-semibold">{interestRate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Total Interest</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(totalInterest)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-muted-foreground">Total Repayment</span>
                        <span className="font-bold tabular-nums">{formatCurrency(totalRepayment)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
                    <p className="text-sm">
                      Your loan request will be reviewed by the treasurer. You'll be notified once it's approved.
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
                      Your loan request for {formatCurrency(numAmount)} has been submitted for approval.
                    </p>
                  </div>
                  <div className="bg-secondary rounded-2xl p-6 space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Amount</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(numAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Payment</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(monthlyPayment)}</span>
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
                    onClick={() => step === 'calculator' ? setStep('preview') : setStep('success')}
                    disabled={numAmount <= 0 || numAmount > maxLoanAmount}
                    className="flex-1 bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {step === 'calculator' ? 'Continue' : 'Submit Request'}
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
