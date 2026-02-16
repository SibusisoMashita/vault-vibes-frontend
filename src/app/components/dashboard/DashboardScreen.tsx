import { Plus, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { pool, group, transactions } from '../../data/mockData';
import { OwnershipCard } from './OwnershipCard';
import { MetricsCards } from './MetricsCards';
import { RecentActivity } from './RecentActivity';

export function DashboardScreen() {
  const { currentUser, setIsContributionModalOpen, setIsLoanModalOpen } = useApp();
  const estimatedPayout = currentUser.sharesOwned * pool.perShareValue;

  return (
    <div className="space-y-6">
      {/* Desktop/Mobile Layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Main Content - Left Column on Desktop */}
        <div className="lg:col-span-2 space-y-6">
          <OwnershipCard member={currentUser} perShareValue={pool.perShareValue} />
          
          <MetricsCards
            perShareValue={pool.perShareValue}
            estimatedPayout={estimatedPayout}
            poolBalance={pool.totalBalance}
            totalMembers={group.totalMembers}
          />

          {/* Action Buttons - Mobile Only */}
          <div className="lg:hidden grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsContributionModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Contribute
            </button>
            <button
              onClick={() => setIsLoanModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-card text-foreground px-6 py-4 rounded-2xl font-semibold border border-border hover:bg-secondary transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Request Loan
            </button>
          </div>

          {/* Recent Activity - Desktop */}
          <div className="hidden lg:block">
            <RecentActivity transactions={transactions} />
          </div>
        </div>

        {/* Sidebar - Right Column on Desktop */}
        <div className="space-y-6">
          {/* Action Buttons - Desktop Only */}
          <div className="hidden lg:block space-y-4">
            <button
              onClick={() => setIsContributionModalOpen(true)}
              className="flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground px-6 py-4 rounded-2xl font-semibold hover:bg-accent/90 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Contribute
            </button>
            <button
              onClick={() => setIsLoanModalOpen(true)}
              className="flex items-center justify-center gap-2 w-full bg-card text-foreground px-6 py-4 rounded-2xl font-semibold border border-border hover:bg-secondary transition-colors"
            >
              <TrendingUp className="w-5 h-5" />
              Request Loan
            </button>
          </div>

          {/* Pool Summary - Desktop */}
          <div className="hidden lg:block bg-card rounded-2xl p-6 border border-border sticky top-6">
            <h3 className="font-semibold mb-6">Pool Summary</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Shares</p>
                <p className="text-xl font-semibold tabular-nums">{pool.totalBalance / pool.perShareValue}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Liquidity Available</p>
                <p className="text-xl font-semibold tabular-nums">
                  {new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', minimumFractionDigits: 0 }).format(pool.liquidityAvailable)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Loans</p>
                <p className="text-xl font-semibold tabular-nums">{pool.activeLoans}</p>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-1">Year End</p>
                <p className="font-medium">{new Date(group.yearEnd).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity - Mobile */}
      <div className="lg:hidden">
        <RecentActivity transactions={transactions} />
      </div>
    </div>
  );
}