import { TrendingUp } from 'lucide-react';
import { ProgressCircle } from '../../../components/ui/ProgressCircle';
import { formatCurrency, getProgressPercentage } from '../../../utils/currency';
import { safeNumber, safeDivide } from '../../../utils/financial';
import { Member } from '../../../types';

interface OwnershipCardProps {
  member: Member;
  perShareValue: number;
}

export function OwnershipCard({ member, perShareValue }: OwnershipCardProps) {
  const progress = getProgressPercentage(member.paidSoFar, member.totalCommitment);
  const estimatedValue = safeNumber(member.sharesOwned) * safeNumber(perShareValue);
  const estimatedGain = estimatedValue - safeNumber(member.paidSoFar);
  const gainPercentage = (safeDivide(estimatedGain, member.paidSoFar) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-6 md:p-8 text-accent-foreground">
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
        
        <div className="relative w-20 h-20 md:w-24 md:h-24">
          <ProgressCircle progress={progress} className="absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold">{progress}%</span>
          </div>
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

      <div className="mt-6 pt-6 border-t border-accent-foreground/20 flex items-center justify-between">
        <div>
          <p className="text-sm opacity-90 mb-1">Current Value</p>
          <p className="text-2xl font-bold tabular-nums">
            {formatCurrency(estimatedValue)}
          </p>
        </div>
        {estimatedGain > 0 && (
          <div className="flex items-center gap-1 text-sm bg-accent-foreground/20 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">+{gainPercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
