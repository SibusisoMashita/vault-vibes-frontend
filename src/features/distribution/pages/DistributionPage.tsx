import { Calendar, TrendingUp, Users, Sparkles } from 'lucide-react';
import { pool, members, shares, group, currentUser } from '../../../services/apiClient';
import { formatCurrency } from '../../../utils/currency';

export function DistributionPage() {
  const distributionDate = new Date(group.yearEnd);
  const daysUntil = Math.ceil((distributionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate estimated distribution
  const estimatedPoolValue = pool.totalBalance + (pool.totalLoansValue * 0.08); // Assume full loan repayment with interest
  const estimatedPerShare = estimatedPoolValue / shares.sharesSold;
  const userPayout = currentUser.sharesOwned * estimatedPerShare;

  // Sort members by expected payout
  const sortedMembers = [...members]
    .map(m => ({
      ...m,
      estimatedPayout: m.sharesOwned * estimatedPerShare,
    }))
    .sort((a, b) => b.estimatedPayout - a.estimatedPayout);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Year-End Distribution</h1>
        <p className="text-sm text-muted-foreground">
          Projected member payouts
        </p>
      </div>

      {/* Countdown */}
      <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-8 text-accent-foreground">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-2">Distribution Date</p>
            <p className="text-3xl md:text-4xl font-bold mb-2">
              {distributionDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <p className="text-lg font-semibold">{daysUntil} days remaining</p>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-accent-foreground/20 flex items-center justify-center">
            <Sparkles className="w-7 h-7" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-accent-foreground/20">
          <div>
            <p className="text-sm opacity-90 mb-1">Your Estimated Payout</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums">{formatCurrency(userPayout)}</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Your Shares</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums">{currentUser.sharesOwned}</p>
          </div>
        </div>
      </div>

      {/* Distribution Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Projected Pool Value</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(estimatedPoolValue)}</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Est. Per Share Value</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(estimatedPerShare)}</p>
          <p className="text-xs text-chart-2 mt-1">
            +{(((estimatedPerShare - shares.pricePerShare) / shares.pricePerShare) * 100).toFixed(1)}% growth
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-chart-3" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Members</p>
          <p className="text-3xl font-bold tabular-nums">{members.length}</p>
        </div>
      </div>

      {/* Your Distribution Breakdown */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold mb-6">Your Distribution Breakdown</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Shares Owned</span>
            <span className="font-semibold tabular-nums">{currentUser.sharesOwned}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Est. Value Per Share</span>
            <span className="font-semibold tabular-nums">{formatCurrency(estimatedPerShare)}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Total Paid In</span>
            <span className="font-semibold tabular-nums">{formatCurrency(currentUser.paidSoFar)}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Estimated Payout</span>
            <span className="font-bold text-xl tabular-nums">{formatCurrency(userPayout)}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-chart-2/10 rounded-xl px-4">
            <span className="font-semibold text-chart-2">Estimated Gain</span>
            <span className="font-bold text-xl tabular-nums text-chart-2">
              +{formatCurrency(userPayout - currentUser.paidSoFar)}
            </span>
          </div>
        </div>
      </div>

      {/* All Member Payouts */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">Projected Member Payouts</h3>
        </div>

        <div className="divide-y divide-border">
          {sortedMembers.map((member, index) => {
            const gain = member.estimatedPayout - member.paidSoFar;
            const gainPercent = (gain / member.paidSoFar) * 100;
            
            return (
              <div key={member.id} className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground font-semibold shrink-0">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.sharesOwned} shares • Paid {formatCurrency(member.paidSoFar)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg tabular-nums">
                          {formatCurrency(member.estimatedPayout)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-secondary rounded-xl px-4 py-2">
                      <span className="text-muted-foreground">Estimated gain</span>
                      <span className="font-semibold text-chart-2 tabular-nums">
                        +{formatCurrency(gain)} ({gainPercent > 0 ? '+' : ''}{gainPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-warning" />
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>These are <strong>estimated</strong> payouts based on current pool performance and projected loan repayments.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Actual distribution amounts may vary based on final pool balance and outstanding loans.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Distribution will occur on {distributionDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Members with outstanding commitments should complete payments before distribution date.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
