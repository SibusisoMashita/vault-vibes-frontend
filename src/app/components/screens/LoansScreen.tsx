import { TrendingUp, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../lib/utils';
import { loans, pool } from '../../data/mockData';
import { useApp } from '../../context/AppContext';

export function LoansScreen() {
  const { setIsLoanModalOpen } = useApp();
  
  const totalActiveValue = loans.reduce((sum, loan) => 
    loan.status === 'active' ? sum + (loan.amount - loan.amountRepaid) : sum, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Loans</h1>
          <p className="text-sm text-muted-foreground">
            Group lending activity
          </p>
        </div>
        <button
          onClick={() => setIsLoanModalOpen(true)}
          className="hidden md:flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-xl font-semibold hover:bg-accent/90 transition-colors"
        >
          <TrendingUp className="w-4 h-4" />
          Request Loan
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
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(pool.liquidityAvailable * 0.4)}</p>
          <p className="text-xs text-muted-foreground mt-1">40% of liquidity</p>
        </div>
      </div>

      {/* Mobile Request Button */}
      <button
        onClick={() => setIsLoanModalOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
      >
        <TrendingUp className="w-5 h-5" />
        Request Loan
      </button>

      {/* Active Loans */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">All Loans</h3>
        </div>

        <div className="divide-y divide-border">
          {loans.map((loan) => {
            const remaining = loan.amount - loan.amountRepaid;
            const progress = (loan.amountRepaid / loan.amount) * 100;
            
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
                        <p className="text-sm text-muted-foreground">{loan.interestRate}% APR</p>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:grid md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Monthly Payment</p>
                        <p className="font-semibold tabular-nums">{formatCurrency(loan.monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                        <p className="font-semibold tabular-nums">{formatCurrency(remaining)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Months Left</p>
                        <p className="font-semibold">{loan.monthsRemaining} months</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Issued</p>
                        <p className="font-semibold">{formatDate(loan.dateIssued)}</p>
                      </div>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Monthly Payment</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(loan.monthlyPayment)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Remaining</span>
                        <span className="font-semibold tabular-nums">{formatCurrency(remaining)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duration</span>
                        <span className="font-semibold">{loan.monthsRemaining} months left</span>
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

      {/* Loan Terms Info */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-accent" />
          Loan Terms
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Interest rate: 8% annual percentage rate (APR)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Repayment periods: 6, 12, 18, or 24 months</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>Maximum loan amount: 40% of available liquidity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent mt-1">•</span>
            <span>All loans require treasurer approval</span>
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
