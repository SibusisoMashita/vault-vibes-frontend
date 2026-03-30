import { TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { useApp } from '../../../app/providers';
import { useLoans } from '../../../hooks/useLoans';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { safeDivide } from '../../../utils/financial';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

export function LoansPage() {
  const { setIsLoanModalOpen } = useApp();
  const { loans, loading: loansLoading, error: loansError, refetch: refetchLoans } = useLoans();
  const { pool, loading: poolLoading, error: poolError } = useDashboardData();

  const loading = loansLoading || poolLoading;
  const error = loansError ?? poolError;

  useSetPageHeader('Borrowing', 'Group borrowing activity');

  const totalActiveValue = loans.reduce((sum, loan) =>
    loan.status === 'active' ? sum + loan.remaining : sum, 0
  );

  if (loading || !pool) {
    if (!loading && error) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-destructive text-sm">{error}</p>
          <button onClick={refetchLoans} className="px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors">Try again</button>
        </div>
      );
    }
    return <div className="space-y-4 animate-pulse"><div className="h-32 bg-secondary rounded-2xl" /><div className="h-64 bg-secondary rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsLoanModalOpen(true)}
          className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-semibold hover:bg-accent/90 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Request Borrowing
        </button>
      </div>

      {/* Loan Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Active Loans</p>
          <p className="text-3xl font-bold tabular-nums">{pool.activeLoans}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(totalActiveValue)}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Available to Borrow</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(pool.availableToBorrow)}</p>
          <p className="text-xs text-muted-foreground mt-1">50% of your share value</p>
        </div>
      </div>

      {/* Mobile Request Button */}
      <button
        onClick={() => setIsLoanModalOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
      >
        <TrendingUp className="w-5 h-5" />
        Request Borrowing
      </button>

      {/* Active Loans */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">All Borrowings</h3>
        </div>

        <div className="divide-y divide-border">
          {loans.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm space-y-1">
              <p className="font-medium text-foreground">No active borrowings</p>
              <p>Use the button above to submit a borrowing request.</p>
            </div>
          )}
          {loans.map((loan) => {
            const progress = safeDivide(loan.amountRepaid, loan.totalRepayment) * 100;

            return (
              <div key={loan.id} className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    loan.status === 'active' ? 'bg-accent/10 text-accent' :
                    loan.status === 'approved' ? 'bg-chart-2/10 text-chart-2' :
                    loan.status === 'pending' ? 'bg-warning/10 text-warning' :
                    'bg-secondary text-muted-foreground'
                  }`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{loan.memberName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{loan.status}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold tabular-nums">{formatCurrency(loan.amount)}</p>
                        <p className="text-sm text-muted-foreground">{loan.interestRate}% interest</p>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Interest</p>
                        <p className="font-semibold tabular-nums">{formatCurrency(loan.interest)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Total Repayment</p>
                        <p className="font-semibold tabular-nums">{formatCurrency(loan.totalRepayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                        <p className="font-semibold tabular-nums">{formatCurrency(loan.remaining)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Issued</p>
                        <p className="font-semibold">{formatDate(loan.dateIssued)}</p>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Interest</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(loan.interest)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Total Repayment</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(loan.totalRepayment)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(loan.remaining)}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {loan.status === 'active' && (
                      <div className="space-y-1">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-chart-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{progress.toFixed(0)}% repaid</span>
                          <span>{formatCurrency(loan.amountRepaid)} paid</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Borrowing Terms Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent" />
          Borrowing Terms
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Interest rate: 20% flat on principal (configurable by admin)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Full repayment due by end of the month borrowing is approved</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Maximum borrowing: 50% of your share value or 50% of pool liquidity, whichever is lower</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Pool liquidity limit: 50% of pool cash (minus outstanding loans)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>All borrowing requests require treasurer approval</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Early repayment allowed with no penalties</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
