import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { UsersService } from '../../../services/usersService';
import { Member } from '../../../types';
import { formatCurrency, getProgressPercentage } from '../../../utils/currency';
import { useSetPageHeader } from '../../../components/layout/useSetPageHeader';
import { usePoolProjection } from '../../../hooks/usePoolProjection';

export function MyAccountPage() {
  const [member, setMember]   = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const { projection, loading: projectionLoading } = usePoolProjection();

  useSetPageHeader('My Account');

  useEffect(() => {
    let cancelled = false;
    UsersService.getMe()
      .then(m => { if (!cancelled) setMember(m); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/10 text-destructive rounded-xl p-4 text-sm">{error}</div>
      </div>
    );
  }

  if (!member) return null;

  const stats = [
    { label: 'Shares Owned',       value: member.sharesOwned.toString() },
    { label: 'Total Commitment',   value: formatCurrency(member.totalCommitment) },
    { label: 'Paid So Far',        value: formatCurrency(member.paidSoFar) },
    { label: 'Remaining',          value: formatCurrency(member.remaining) },
  ];

  // Progress bar calculations
  const memberProjectedPayout = member.sharesOwned * (projection?.projectedPerShareValue ?? 0);
  const progressPct = getProgressPercentage(member.paidSoFar, memberProjectedPayout);

  return (
    <div className="max-w-2xl space-y-6">
      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-2xl font-bold text-accent">
            {member.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold">{member.name}</h2>
            <span className="inline-block text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize mt-1">
              {member.role}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {member.id && (
            <div className="flex justify-between">
              <span>Member ID</span>
              <span className="font-mono text-xs text-foreground">{member.id}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className="text-xl font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Commitment Progress Bar */}
      <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Contribution Progress</h3>
          <Link
            to="/distributions"
            className="flex items-center gap-1 text-xs text-accent hover:underline"
          >
            View projected payout
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {projectionLoading ? (
          <div className="space-y-2">
            <div className="h-3 rounded-full bg-secondary animate-pulse" />
            <div className="h-3 w-32 rounded bg-secondary animate-pulse" />
          </div>
        ) : memberProjectedPayout === 0 ? (
          <p className="text-sm text-muted-foreground">
            Projection not yet available.
          </p>
        ) : (
          <>
            {/* Bar */}
            <div
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Contribution progress: ${progressPct}% of projected December payout`}
              className="relative h-3 bg-secondary rounded-full overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 h-full bg-accent rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Labels */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatCurrency(member.paidSoFar)} contributed
              </span>
              <span className="font-bold tabular-nums text-accent">{progressPct}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(memberProjectedPayout)} projected December value
            </p>
          </>
        )}
      </div>
    </div>
  );
}
