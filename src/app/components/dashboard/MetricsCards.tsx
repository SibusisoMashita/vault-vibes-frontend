import { TrendingUp, Wallet, Users } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';

interface MetricsCardsProps {
  perShareValue: number;
  estimatedPayout: number;
  poolBalance: number;
  totalMembers: number;
}

export function MetricsCards({ perShareValue, estimatedPayout, poolBalance, totalMembers }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Per Share Value</p>
        <p className="text-3xl font-bold tabular-nums">
          {formatCurrency(perShareValue)}
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
            <Wallet className="w-5 h-5 text-chart-2" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Estimated Payout</p>
        <p className="text-3xl font-bold tabular-nums">
          {formatCurrency(estimatedPayout)}
        </p>
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border md:col-span-2 lg:col-span-1">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-chart-3/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-chart-3" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-1">Group Pool</p>
        <p className="text-3xl font-bold tabular-nums mb-1">
          {formatCurrency(poolBalance)}
        </p>
        <p className="text-xs text-muted-foreground">{totalMembers} members</p>
      </div>
    </div>
  );
}
