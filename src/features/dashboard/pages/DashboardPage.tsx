import { Plus, TrendingUp } from 'lucide-react';
import { useApp } from '../../../app/providers';
import { group, pool, transactions } from '../../../services/apiClient';
import { PoolSummaryCard, ShareSummaryCard } from '../../../components/cards';
import { MetricsCards } from '../components/MetricsCards';
import { RecentActivity } from '../components/RecentActivity';

export function DashboardPage() {
  const { currentUser, setIsContributionModalOpen, setIsLoanModalOpen } = useApp();
  const estimatedPayout = currentUser.sharesOwned * pool.perShareValue;

  return (
    <div className="space-y-6">
      {/* Desktop/Mobile Layout */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 space-y-6 lg:space-y-0">
        {/* Main Content - Left Column on Desktop */}
        <div className="lg:col-span-2 space-y-6">
          <ShareSummaryCard member={currentUser} perShareValue={pool.perShareValue} />

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
          <PoolSummaryCard
            activeLoans={pool.activeLoans}
            liquidityAvailable={pool.liquidityAvailable}
            perShareValue={pool.perShareValue}
            totalBalance={pool.totalBalance}
            yearEnd={group.yearEnd}
          />
        </div>
      </div>

      {/* Recent Activity - Mobile */}
      <div className="lg:hidden">
        <RecentActivity transactions={transactions} />
      </div>
    </div>
  );
}