import { TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { useMembers } from '../../../hooks/useMembers';
import { usePoolStats } from '../../../hooks/usePoolStats';
import { formatCurrency } from '../../../utils/currency';
import { safeDivide } from '../../../utils/financial';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';

export function SharesPage() {
  const { members, loading: membersLoading } = useMembers();
  const { pool, shares, loading: poolLoading } = usePoolStats();

  const loading = membersLoading || poolLoading;

  useSetPageHeader('Share Overview', 'Group ownership and distribution');

  if (loading || !pool || !shares) {
    return <div className="space-y-4 animate-pulse"><div className="h-32 bg-secondary rounded-2xl" /><div className="h-64 bg-secondary rounded-2xl" /></div>;
  }

  const sharesAvailablePercent = safeDivide(shares.sharesAvailable, shares.totalShares) * 100;
  const sharesSoldPercent = safeDivide(shares.sharesSold, shares.totalShares) * 100;

  // Sort members by shares owned (descending)
  const sortedMembers = [...members].sort((a, b) => b.sharesOwned - a.sharesOwned);

  return (
    <div className="space-y-6">
      {/* Share Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">{sharesSoldPercent.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Shares Sold</p>
          <p className="text-3xl font-bold tabular-nums">{shares.sharesSold}</p>
          <p className="text-xs text-muted-foreground mt-1">of {shares.totalShares} total</p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-chart-2" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Per Share Value</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(pool.perShareValue)}</p>
          {shares.pricePerShare > 0 && (
            <p className="text-xs text-chart-2 mt-1">+{((safeDivide(pool.perShareValue, shares.pricePerShare) - 1) * 100).toFixed(1)}% growth</p>
          )}
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-warning" />
            </div>
            <span className="text-sm text-muted-foreground">{sharesAvailablePercent.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Shares Available</p>
          <p className="text-3xl font-bold tabular-nums">{shares.sharesAvailable}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatCurrency(shares.pricePerShare)} each</p>
        </div>
      </div>

      {/* Visual Distribution */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold mb-4">Share Distribution</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 h-12 bg-secondary rounded-xl overflow-hidden flex">
              <div
                className="bg-accent flex items-center justify-center text-accent-foreground text-sm font-semibold"
                style={{ width: `${sharesSoldPercent}%` }}
              >
                {sharesSoldPercent > 10 && `${shares.sharesSold} sold`}
              </div>
              <div
                className="bg-muted flex items-center justify-center text-muted-foreground text-sm"
                style={{ width: `${sharesAvailablePercent}%` }}
              >
                {sharesAvailablePercent > 10 && `${shares.sharesAvailable} available`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <span className="text-muted-foreground">Sold ({shares.sharesSold})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-muted-foreground">Available ({shares.sharesAvailable})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Ownership */}
      <div className="bg-card rounded-2xl border border-border">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Member Ownership</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{members.length} members</span>
          </div>
        </div>

        <div className="divide-y divide-border">
          {sortedMembers.map((member, index) => {
            const ownershipPercent = safeDivide(member.sharesOwned, shares.sharesSold) * 100;
            const memberValue = member.sharesOwned * pool.perShareValue;

            return (
              <div key={member.id} className="p-6 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-accent-foreground font-semibold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-semibold tabular-nums">{member.sharesOwned} shares</p>
                        <p className="text-sm text-muted-foreground tabular-nums">{ownershipPercent.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Desktop: Progress bar and value */}
                    <div className="hidden md:block space-y-2">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all"
                          style={{ width: `${ownershipPercent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {formatCurrency(member.paidSoFar)} paid
                        </span>
                        <span className="font-semibold tabular-nums">
                          {formatCurrency(memberValue)} value
                        </span>
                      </div>
                    </div>

                    {/* Mobile: Compact info */}
                    <div className="md:hidden flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">Paid {formatCurrency(member.paidSoFar)}</span>
                      <span className="font-semibold tabular-nums">{formatCurrency(memberValue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
