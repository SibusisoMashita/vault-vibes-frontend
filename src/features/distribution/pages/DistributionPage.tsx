import { Calendar, TrendingUp, Users, Sparkles, Info } from 'lucide-react';
import { useApp } from '../../../app/providers';
import { usePoolProjection } from '../../../hooks/usePoolProjection';
import { useMembers } from '../../../hooks/useMembers';
import { useDashboardData } from '../../../hooks/useDashboardData';
import { formatCurrency } from '../../../utils/currency';
import { safeDivide } from '../../../utils/financial';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

export function DistributionPage() {
  const { currentUser } = useApp();
  const { projection, loading: projLoading } = usePoolProjection();
  const { members, loading: membersLoading }  = useMembers();
  const { shares, group, loading: dashLoading } = useDashboardData();

  const loading = projLoading || membersLoading || dashLoading;

  useSetPageHeader('Year-End Distribution', 'Projected member payouts');

  if (loading || !projection || !group || !shares) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-48 bg-secondary rounded-3xl" />
        <div className="h-32 bg-secondary rounded-2xl" />
      </div>
    );
  }

  const distributionDate  = new Date(group.yearEnd);
  const daysUntil         = Math.ceil(
    (distributionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const { projectedPerShareValue, projectedPoolValue, monthsRemaining } = projection;

  // Member Value = Shares × Share Value
  const userProjectedPayout = currentUser.sharesOwned * projectedPerShareValue;

  const growthPct =
    shares.pricePerShare > 0
      ? safeDivide(projectedPerShareValue - shares.pricePerShare, shares.pricePerShare) * 100
      : 0;

  const sortedMembers = [...members]
    .map(m => ({ ...m, projectedPayout: m.sharesOwned * projectedPerShareValue }))
    .sort((a, b) => b.projectedPayout - a.projectedPayout);

  return (
    <div className="space-y-6">

      {/* ── Hero: Countdown + user payout ── */}
      <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-8 text-accent-foreground">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-2">Distribution Date</p>
            <p className="text-3xl md:text-4xl font-bold mb-2">
              {distributionDate.toLocaleDateString('en-ZA', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
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
            <p className="text-sm opacity-90 mb-1">Your Projected Payout</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums">
              {formatCurrency(userProjectedPayout)}
            </p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Your Shares</p>
            <p className="text-2xl md:text-3xl font-bold tabular-nums">
              {currentUser.sharesOwned}
            </p>
          </div>
        </div>
      </div>

      {/* ── Metrics ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-chart-2" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Projected Pool Value</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(projectedPoolValue)}</p>
          <p className="text-xs text-muted-foreground mt-1">at year-end</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Est. Per Share Value</p>
          <p className="text-3xl font-bold tabular-nums">
            {formatCurrency(projectedPerShareValue)}
          </p>
          {growthPct > 0 && (
            <p className="text-xs text-chart-2 mt-1">+{growthPct.toFixed(1)}% from purchase price</p>
          )}
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center mb-4">
            <Users className="w-5 h-5 text-chart-3" />
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Members</p>
          <p className="text-3xl font-bold tabular-nums">{members.length}</p>
        </div>
      </div>

      {/* ── Projection Breakdown ── */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold mb-6">How the Projection Is Calculated</h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">Current Pool Value</p>
              <p className="text-xs text-muted-foreground">Bank balance + outstanding loans</p>
            </div>
            <span className="font-semibold tabular-nums">
              {formatCurrency(projection.currentPoolValue)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">Remaining Contributions</p>
              <p className="text-xs text-muted-foreground">
                {formatCurrency(projection.monthlyPoolContribution)}/month × {monthsRemaining} months
              </p>
            </div>
            <span className="font-semibold tabular-nums text-chart-2">
              +{formatCurrency(projection.contributionsRemaining)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="text-sm font-medium">Expected Loan Interest</p>
              <p className="text-xs text-muted-foreground">Interest on active loans when repaid</p>
            </div>
            <span className="font-semibold tabular-nums text-chart-2">
              +{formatCurrency(projection.expectedLoanInterest)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-start gap-1.5">
              <div>
                <p className="text-sm font-medium">Estimated Bank Interest</p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(projection.avgMonthlyBankInterest)}/month avg × {monthsRemaining} months
                </p>
              </div>
            </div>
            <span className="font-semibold tabular-nums text-chart-2">
              +{formatCurrency(projection.projectedBankInterest)}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3">
            <p className="font-semibold">Projected Pool Value</p>
            <span className="text-xl font-bold tabular-nums text-accent">
              {formatCurrency(projectedPoolValue)}
            </span>
          </div>
        </div>

        {/* Bank interest note */}
        <div className="mt-5 flex items-start gap-2 bg-secondary rounded-xl p-4">
          <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Bank interest projection is based on the average of the most recent 3 months of recorded
            bank interest. If no bank interest has been recorded yet, this component is excluded.
          </p>
        </div>
      </div>

      {/* ── Your Breakdown ── */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold mb-6">Your Projected Breakdown</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Shares Owned</span>
            <span className="font-semibold tabular-nums">{currentUser.sharesOwned}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Projected Value Per Share</span>
            <span className="font-semibold tabular-nums">{formatCurrency(projectedPerShareValue)}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Total Paid In</span>
            <span className="font-semibold tabular-nums">{formatCurrency(currentUser.paidSoFar)}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <span className="text-muted-foreground">Projected Payout</span>
            <span className="font-bold text-xl tabular-nums">{formatCurrency(userProjectedPayout)}</span>
          </div>

          <div className="flex items-center justify-between py-3 bg-chart-2/10 rounded-xl px-4">
            <span className="font-semibold text-chart-2">Projected Gain</span>
            <span className="font-bold text-xl tabular-nums text-chart-2">
              +{formatCurrency(userProjectedPayout - currentUser.paidSoFar)}
            </span>
          </div>
        </div>
      </div>

      {/* ── All Member Payouts ── */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold">Projected Member Payouts</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Based on {formatCurrency(projectedPerShareValue)} per share at year-end
          </p>
        </div>

        <div className="divide-y divide-border">
          {sortedMembers.map((member, index) => {
            const gain        = member.projectedPayout - member.paidSoFar;
            const gainPercent = safeDivide(gain, member.paidSoFar) * 100;

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
                          {member.sharesOwned} shares · Paid {formatCurrency(member.paidSoFar)}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-lg tabular-nums">
                          {formatCurrency(member.projectedPayout)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm bg-secondary rounded-xl px-4 py-2">
                      <span className="text-muted-foreground">Projected gain</span>
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

      {/* ── Notes ── */}
      <div className="bg-warning/10 border border-warning/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-warning" />
          Important Notes
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>
              These are <strong>projected estimates</strong>, not guaranteed amounts.
              The projection assumes all members continue contributing until the distribution date.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>
              Bank interest is estimated from the 3-month historical average.
              Actual earnings may differ.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>
              Actual distribution amounts will be based on the final pool balance
              on {distributionDate.toLocaleDateString('en-ZA', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-warning mt-1">•</span>
            <span>Members with outstanding commitments should complete payments before the distribution date.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
