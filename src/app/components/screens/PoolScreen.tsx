import { Wallet, TrendingUp, DollarSign, AlertCircle, Activity } from 'lucide-react';
import { formatCurrency } from '../../lib/utils';
import { pool, shares } from '../../data/mockData';

export function PoolScreen() {
  const capitalReceivedPercent = (pool.capitalReceived / pool.capitalCommitted) * 100;
  const liquidityPercent = (pool.liquidityAvailable / pool.totalBalance) * 100;
  const loansPercent = (pool.totalLoansValue / pool.totalBalance) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Pool Balance</h1>
        <p className="text-sm text-muted-foreground">
          Group financial overview and liquidity
        </p>
      </div>

      {/* Main Pool Balance */}
      <div className="bg-gradient-to-br from-accent to-accent/80 rounded-3xl p-8 text-accent-foreground">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-2">Total Pool Balance</p>
            <p className="text-5xl md:text-6xl font-bold tabular-nums">
              {formatCurrency(pool.totalBalance)}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-accent-foreground/20 flex items-center justify-center">
            <Wallet className="w-7 h-7" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-accent-foreground/20">
          <div>
            <p className="text-sm opacity-90 mb-1">Per Share Value</p>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(pool.perShareValue)}</p>
          </div>
          <div>
            <p className="text-sm opacity-90 mb-1">Total Shares</p>
            <p className="text-2xl font-bold tabular-nums">{shares.sharesSold}</p>
          </div>
        </div>
      </div>

      {/* Capital Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-chart-2/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-chart-2" />
            </div>
            <span className="text-sm font-semibold text-chart-2">{capitalReceivedPercent.toFixed(0)}%</span>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Capital Received</p>
          <p className="text-3xl font-bold tabular-nums mb-2">{formatCurrency(pool.capitalReceived)}</p>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-chart-2 rounded-full transition-all"
              style={{ width: `${capitalReceivedPercent}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            of {formatCurrency(pool.capitalCommitted)} committed
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Liquidity Available</p>
          <p className="text-3xl font-bold tabular-nums">{formatCurrency(pool.liquidityAvailable)}</p>
          <p className="text-xs text-muted-foreground mt-2">
            {liquidityPercent.toFixed(1)}% of total pool
          </p>
        </div>
      </div>

      {/* Pool Composition */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <h3 className="font-semibold mb-6">Pool Composition</h3>
        
        <div className="space-y-4">
          {/* Visual breakdown */}
          <div className="h-16 bg-secondary rounded-2xl overflow-hidden flex">
            <div 
              className="bg-chart-2 flex items-center justify-center text-white font-semibold transition-all"
              style={{ width: `${liquidityPercent}%` }}
            >
              {liquidityPercent > 15 && `${liquidityPercent.toFixed(0)}%`}
            </div>
            <div 
              className="bg-accent flex items-center justify-center text-accent-foreground font-semibold transition-all"
              style={{ width: `${loansPercent}%` }}
            >
              {loansPercent > 15 && `${loansPercent.toFixed(0)}%`}
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <div className="w-4 h-4 rounded bg-chart-2 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Available Liquidity</p>
                <p className="text-xs text-muted-foreground">Cash & investments</p>
              </div>
              <p className="font-bold tabular-nums">{formatCurrency(pool.liquidityAvailable)}</p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-secondary rounded-xl">
              <div className="w-4 h-4 rounded bg-accent shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Active Loans</p>
                <p className="text-xs text-muted-foreground">{pool.activeLoans} outstanding</p>
              </div>
              <p className="font-bold tabular-nums">{formatCurrency(pool.totalLoansValue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Exposure */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Loan Exposure</h3>
            <p className="text-sm text-muted-foreground">Current lending activity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Active Loans</p>
            <p className="text-2xl font-bold tabular-nums">{pool.activeLoans}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Value</p>
            <p className="text-2xl font-bold tabular-nums">{formatCurrency(pool.totalLoansValue)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">% of Pool</p>
            <p className="text-2xl font-bold tabular-nums">{loansPercent.toFixed(1)}%</p>
          </div>
        </div>

        {loansPercent > 50 && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-warning-foreground">High Loan Exposure</p>
              <p className="text-sm text-muted-foreground mt-1">
                More than 50% of pool assets are in active loans. Consider limiting new loan approvals.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Transparency Note */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-6">
        <h3 className="font-semibold mb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-accent" />
          Full Transparency
        </h3>
        <p className="text-sm text-muted-foreground">
          All pool balances are calculated in real-time based on member contributions, share purchases, 
          active loans, and investment returns. Every member has equal access to this information.
        </p>
      </div>
    </div>
  );
}
