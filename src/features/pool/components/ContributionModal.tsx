import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../../app/providers';
import { pool } from '../../../services/apiClient';
import { formatCurrency } from '../../../utils/currency';

type Step = 'amount' | 'preview' | 'success';

export function ContributionModal() {
  const { isContributionModalOpen, setIsContributionModalOpen, currentUser } = useApp();
  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState('');

  const handleClose = () => {
    setIsContributionModalOpen(false);
    setTimeout(() => {
      setStep('amount');
      setAmount('');
    }, 300);
  };

  const handleContinue = () => {
    if (step === 'amount') {
      setStep('preview');
    } else if (step === 'preview') {
      setStep('success');
    }
  };

  const handleConfirm = () => {
    handleClose();
  };

  const numAmount = parseFloat(amount) || 0;
  const additionalShares = numAmount > 0 ? Math.floor(numAmount / pool.perShareValue) : 0;
  const remainingBalance = numAmount % pool.perShareValue;

  return (
    <AnimatePresence>
      {isContributionModalOpen && (
        <>
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
              className="bg-card w-full lg:max-w-md lg:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-card p-6 border-b border-border flex items-center justify-between lg:rounded-t-3xl">
                <h2 className="text-xl font-semibold">Make Contribution</h2>
                <button
                  onClick={handleClose}
                  className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="px-6 pt-6">
                <div className="flex items-center gap-2 mb-8">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'amount' ? 'bg-accent text-accent-foreground' : 'bg-chart-2 text-chart-2-foreground'
                  }`}>
                    {step !== 'amount' ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div className={`h-1 flex-1 rounded ${
                    step === 'amount' ? 'bg-border' : 'bg-accent'
                  }`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'preview' ? 'bg-accent text-accent-foreground' :
                    step === 'success' ? 'bg-chart-2 text-chart-2-foreground' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    {step === 'success' ? <Check className="w-4 h-4" /> : '2'}
                  </div>
                  <div className={`h-1 flex-1 rounded ${
                    step === 'success' ? 'bg-accent' : 'bg-border'
                  }`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step === 'success' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'
                  }`}>
                    3
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 pb-6">
                {step === 'amount' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        Enter Amount
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
                          className="w-full pl-12 pr-4 py-4 text-3xl font-semibold bg-secondary border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent tabular-nums"
                          autoFocus
                        />
                      </div>
                    </div>

                    {currentUser.remaining > 0 && (
                      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
                        <p className="text-sm text-warning-foreground">
                          You have {formatCurrency(currentUser.remaining)} remaining on your commitment
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      {[1000, 2500, 5000].map((preset) => (
                        <button
                          key={preset}
                          onClick={() => setAmount(preset.toString())}
                          className="py-3 px-4 rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground transition-colors font-semibold"
                        >
                          R{preset}
                        </button>
                      ))}
                    </div>

                    {numAmount > 0 && additionalShares > 0 && (
                      <div className="bg-secondary rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Additional Shares</span>
                          <span className="font-semibold">{additionalShares}</span>
                        </div>
                        {remainingBalance > 0 && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">To Balance</span>
                            <span className="font-semibold">{formatCurrency(remainingBalance)}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {step === 'preview' && (
                  <div className="space-y-6">
                    <div className="bg-secondary rounded-2xl p-6 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Contribution Amount</p>
                        <p className="text-3xl font-bold tabular-nums">{formatCurrency(numAmount)}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-border space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Current Shares</span>
                          <span className="font-semibold">{currentUser.sharesOwned}</span>
                        </div>
                        {additionalShares > 0 && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Additional Shares</span>
                            <span className="font-semibold text-chart-2">+{additionalShares}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-muted-foreground">New Total</span>
                          <span className="text-xl font-bold">{currentUser.sharesOwned + additionalShares}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4">
                      <p className="text-sm">
                        Your contribution will be processed immediately and reflected in your ownership balance.
                      </p>
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="text-center py-8 space-y-6">
                    <div className="w-20 h-20 bg-chart-2/10 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-10 h-10 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-2">Contribution Successful!</h3>
                      <p className="text-muted-foreground">
                        Your {formatCurrency(numAmount)} contribution has been recorded.
                      </p>
                    </div>
                    <div className="bg-secondary rounded-2xl p-6">
                      <p className="text-sm text-muted-foreground mb-1">New Share Balance</p>
                      <p className="text-4xl font-bold tabular-nums">{currentUser.sharesOwned + additionalShares}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="sticky bottom-0 bg-card p-6 border-t border-border lg:rounded-b-3xl">
                {step === 'success' ? (
                  <button
                    onClick={handleConfirm}
                    className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
                  >
                    Done
                  </button>
                ) : (
                  <div className="flex gap-3">
                    {step === 'preview' && (
                      <button
                        onClick={() => setStep('amount')}
                        className="flex-1 bg-secondary text-foreground py-4 rounded-2xl font-semibold hover:bg-secondary/80 transition-colors"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={handleContinue}
                      disabled={step === 'amount' && numAmount <= 0}
                      className="flex-1 bg-accent text-accent-foreground py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {step === 'amount' ? 'Continue' : 'Confirm'}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
