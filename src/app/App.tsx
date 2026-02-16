import { AppProvider, useApp } from './context/AppContext';
import { MobileNav } from './components/navigation/MobileNav';
import { MobileHeader } from './components/navigation/MobileHeader';
import { DesktopNav } from './components/navigation/DesktopNav';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { SharesScreen } from './components/screens/SharesScreen';
import { PoolScreen } from './components/screens/PoolScreen';
import { LedgerScreen } from './components/screens/LedgerScreen';
import { LoansScreen } from './components/screens/LoansScreen';
import { DistributionScreen } from './components/screens/DistributionScreen';
import { AdminScreen } from './components/screens/AdminScreen';
import { ContributionModal } from './components/modals/ContributionModal';
import { LoanRequestModal } from './components/modals/LoanRequestModal';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <DashboardScreen />;
      case 'shares':
        return <SharesScreen />;
      case 'pool':
        return <PoolScreen />;
      case 'ledger':
        return <LedgerScreen />;
      case 'loans':
        return <LoansScreen />;
      case 'distribution':
        return <DistributionScreen />;
      case 'admin':
        return <AdminScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Navigation */}
      <DesktopNav />

      {/* Mobile Header */}
      <MobileHeader />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
          {renderScreen()}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Modals */}
      <ContributionModal />
      <LoanRequestModal />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}