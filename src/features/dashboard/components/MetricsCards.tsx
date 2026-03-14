import { TrendingUp, Wallet, Users } from 'lucide-react';
import { ValueCard } from '../../../components/cards';
import { formatCurrency } from '../../../utils/currency';

interface MetricsCardsProps {
  perShareValue: number;
  estimatedPayout: number;
  poolBalance: number;
  totalMembers: number;
}

export function MetricsCards({ perShareValue, estimatedPayout, poolBalance, totalMembers }: MetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ValueCard
        icon={TrendingUp}
        iconClassName="text-accent"
        iconContainerClassName="bg-accent/10"
        label="Per Share Value"
        value={formatCurrency(perShareValue)}
      />

      <ValueCard
        icon={Wallet}
        iconClassName="text-chart-2"
        iconContainerClassName="bg-chart-2/10"
        label="Estimated Payout"
        value={formatCurrency(estimatedPayout)}
      />

      <ValueCard
        icon={Users}
        className="md:col-span-2 lg:col-span-1"
        iconClassName="text-chart-3"
        iconContainerClassName="bg-chart-3/10"
        label="Group Pool"
        value={formatCurrency(poolBalance)}
        footnote={`${totalMembers} members`}
      />
    </div>
  );
}
