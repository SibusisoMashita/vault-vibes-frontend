import { DashboardPage } from '../features/dashboard';
import { DistributionPage } from '../features/distribution';
import { LedgerPage } from '../features/ledger';
import { LoansPage } from '../features/loans';
import { PoolPage } from '../features/pool';
import { SharesPage } from '../features/shares';
import { AdminPage } from '../features/admin';
import { Screen } from './context/AppContext';

export function renderCurrentRoute(currentScreen: Screen) {
  switch (currentScreen) {
    case 'dashboard':
      return <DashboardPage />;
    case 'shares':
      return <SharesPage />;
    case 'pool':
      return <PoolPage />;
    case 'ledger':
      return <LedgerPage />;
    case 'loans':
      return <LoansPage />;
    case 'distribution':
      return <DistributionPage />;
    case 'admin':
      return <AdminPage />;
    default:
      return <DashboardPage />;
  }
}

