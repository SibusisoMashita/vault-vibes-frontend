import { Shield, Users, TrendingUp, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { members, pool, loans, shares } from '../../../services/apiClient';
import { formatCurrency } from '../../../utils/currency';

export function AdminPage() {
  const pendingLoans = loans.filter(l => l.status === 'pending');
  const membersWithRemaining = members.filter(m => m.remaining > 0);
  const contributionRate = (pool.capitalReceived / pool.capitalCommitted) * 100;
  const loanExposureRate = (pool.totalLoansValue / pool.totalBalance) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <Shield className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Treasurer controls and group oversight
          </p>
        </div>
      </div>

      {/* Key Alerts */}
      {(loanExposureRate > 50 || membersWithRemaining.length > 3) && (
        <div className="space-y-3">
          {loanExposureRate > 50 && (
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-warning-foreground">High Loan Exposure</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {loanExposureRate.toFixed(0)}% of pool is in active loans. Consider limiting new approvals.
                </p>
              </div>
            </div>
          )}
          
          {membersWithRemaining.length > 3 && (
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Outstanding Commitments</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {membersWithRemaining.length} members have outstanding commitments totaling{' '}
                  {formatCurrency(membersWithRemaining.reduce((sum, m) => sum + m.remaining, 0))}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Admin Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-chart-2" />
            </div>
            <span className="text-sm font-semibold text-chart-2">{contributionRate.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Contribution Rate</p>
          <p className="text-2xl font-bold tabular-nums">{formatCurrency(pool.capitalReceived)}</p>
          <p className="text-xs text-muted-foreground mt-1">of {formatCurrency(pool.capitalCommitted)}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm font-semibold text-warning">{loanExposureRate.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Loan Exposure</p>
          <p className="text-2xl font-bold tabular-nums">{formatCurrency(pool.totalLoansValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">{pool.activeLoans} active loans</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Active Members</p>
          <p className="text-2xl font-bold tabular-nums">{members.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{shares.sharesSold} shares sold</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Pending Actions</p>
          <p className="text-2xl font-bold tabular-nums">{pendingLoans.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Loan requests</p>
        </div>
      </div>

      {/* Pending Loan Approvals */}
      {pendingLoans.length > 0 && (
        <div className="bg-card rounded-2xl border border-border">
          <div className="p-6 border-b border-border">
            <h3 className="font-semibold">Pending Loan Approvals</h3>
          </div>

          <div className="divide-y divide-border">
            {pendingLoans.map((loan) => (
              <div key={loan.id} className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-warning/10 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-6 h-6 text-warning" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold">{loan.memberName}</p>
                        <p className="text-sm text-muted-foreground">Loan request</p>
                      </div>
                      <p className="font-bold text-xl tabular-nums">{formatCurrency(loan.amount)}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Payment</p>
                        <p className="font-semibold tabular-nums">{formatCurrency(loan.monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">{loan.monthsRemaining} months</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Interest Rate</p>
                        <p className="font-semibold">{loan.interestRate}% APR</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Repayment</p>
                        <p className="font-semibold tabular-nums">
                          {formatCurrency(loan.monthlyPayment * loan.monthsRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-chart-2 text-white px-4 py-3 rounded-xl font-semibold hover:bg-chart-2/90 transition-colors flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Approve Loan
                  </button>
                  <button className="flex-1 bg-destructive/10 text-destructive px-4 py-3 rounded-xl font-semibold hover:bg-destructive/20 transition-colors flex items-center justify-center gap-2">
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Contribution Status */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">Member Contribution Status</h3>
        </div>

        <div className="divide-y divide-border">
          {members
            .sort((a, b) => (b.paidSoFar / b.totalCommitment) - (a.paidSoFar / a.totalCommitment))
            .map((member) => {
              const progress = (member.paidSoFar / member.totalCommitment) * 100;
              const isComplete = member.remaining === 0;
              
              return (
                <div key={member.id} className="p-6 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      isComplete 
                        ? 'bg-chart-2/10 text-chart-2' 
                        : progress > 75 
                        ? 'bg-accent/10 text-accent'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{member.name}</p>
                          <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold tabular-nums">{formatCurrency(member.paidSoFar)}</p>
                          <p className="text-sm text-muted-foreground tabular-nums">
                            of {formatCurrency(member.totalCommitment)}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              isComplete ? 'bg-chart-2' : progress > 75 ? 'bg-accent' : 'bg-warning'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{progress.toFixed(0)}% paid</span>
                          {!isComplete && (
                            <span className="font-semibold text-warning">
                              {formatCurrency(member.remaining)} remaining
                            </span>
                          )}
                          {isComplete && (
                            <span className="font-semibold text-chart-2">Complete</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="bg-card border border-border rounded-2xl p-6 hover:bg-secondary/50 transition-colors text-left">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-accent" />
            </div>
          </div>
          <h3 className="font-semibold mb-1">Issue New Shares</h3>
          <p className="text-sm text-muted-foreground">
            Create additional shares for new or existing members
          </p>
        </button>

        <button className="bg-card border border-border rounded-2xl p-6 hover:bg-secondary/50 transition-colors text-left">
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-chart-2" />
            </div>
          </div>
          <h3 className="font-semibold mb-1">Export Reports</h3>
          <p className="text-sm text-muted-foreground">
            Download financial reports and transaction history
          </p>
        </button>
      </div>
    </div>
  );
}
