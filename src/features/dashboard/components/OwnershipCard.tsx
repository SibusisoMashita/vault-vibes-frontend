import { formatCurrency } from '../../../utils/currency';
import { safeNumber } from '../../../utils/financial';
import { Member } from '../../../types';

interface OwnershipCardProps {
  member: Member;
  perShareValue: number;
}

export function OwnershipCard({ member, perShareValue }: OwnershipCardProps) {
  // Member Value = Shares × Share Value
  const currentValue = safeNumber(member.sharesOwned) * safeNumber(perShareValue);
  // Profit = Current Value − Total Contributions Paid
  const profit = currentValue - safeNumber(member.paidSoFar);
  const isPositive = profit > 0;
  const isNegative = profit < 0;

  const profitLabel = profit === 0
    ? 'R0'
    : `${isPositive ? '+' : ''}${formatCurrency(profit)}`;

  const profitRingColor = isPositive
    ? 'border-green-400'
    : isNegative
      ? 'border-red-400'
      : 'border-accent-foreground/30';

  const profitTextColor = isPositive
    ? 'text-green-300'
    : isNegative
      ? 'text-red-300'
      : 'text-accent-foreground/70';

  return (
    <div data-tour="shares-card" className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 md:p-8 text-accent-foreground">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm opacity-90 mb-1">You Own</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl md:text-6xl font-bold tabular-nums">
              {member.sharesOwned}
            </span>
            <span className="text-xl opacity-90">shares</span>
          </div>
        </div>

        {/* Profit indicator — replaces progress circle */}
        <div
          title="Profit = Current Value − Contributions Paid"
          className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 ${profitRingColor} flex flex-col items-center justify-center shrink-0`}
        >
          <p className="text-xs opacity-75 leading-none mb-1">profit</p>
          <p className={`text-sm font-bold tabular-nums leading-none ${profitTextColor}`}>
            {profitLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm opacity-90 mb-1">Total Commitment</p>
          <p className="text-xl md:text-2xl font-semibold tabular-nums">
            {formatCurrency(member.totalCommitment)}
          </p>
        </div>
        <div>
          <p className="text-sm opacity-90 mb-1">Paid So Far</p>
          <p className="text-xl md:text-2xl font-semibold tabular-nums">
            {formatCurrency(member.paidSoFar)}
          </p>
        </div>
      </div>

      {member.remaining > 0 && (
        <div className="pt-4 border-t border-accent-foreground/20">
          <div className="flex items-center justify-between">
            <p className="text-sm opacity-90">Remaining</p>
            <p className="text-lg font-semibold tabular-nums">
              {formatCurrency(member.remaining)}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-6 border-t border-accent-foreground/20">
        <p className="text-sm opacity-90 mb-1">Current Value</p>
        <p className="text-2xl font-bold tabular-nums">
          {formatCurrency(currentValue)}
        </p>
      </div>
    </div>
  );
}
