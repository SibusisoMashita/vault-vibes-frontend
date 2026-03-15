import { formatCurrency } from '../../utils/currency';
import { safeDivide } from '../../utils/financial';

interface PoolSummaryCardProps {
  totalBalance: number;
  perShareValue: number;
  liquidityAvailable: number;
  activeLoans: number;
  yearEnd: string;
}

export function PoolSummaryCard({
  totalBalance,
  perShareValue,
  liquidityAvailable,
  activeLoans,
  yearEnd,
}: PoolSummaryCardProps) {
  return (
    <div className="hidden lg:block bg-card rounded-2xl p-6 border border-border sticky top-6">
      <h3 className="font-semibold mb-6">Pool Summary</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Total Shares</p>
          <p className="text-xl font-semibold tabular-nums">{Math.round(safeDivide(totalBalance, perShareValue))}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Liquidity Available</p>
          <p className="text-xl font-semibold tabular-nums">{formatCurrency(liquidityAvailable)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Active Loans</p>
          <p className="text-xl font-semibold tabular-nums">{activeLoans}</p>
        </div>
        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-1">Year End</p>
          <p className="font-medium">
            {new Date(yearEnd).toLocaleDateString('en-ZA', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

