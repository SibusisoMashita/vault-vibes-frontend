import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Toaster } from '../components/ui/sonner';
import { LoanRequestModal } from '../features/loans';
import { ContributionModal } from '../features/pool';
import { AppProviders, useApp } from './providers';
import { renderCurrentRoute } from './routes';

function AppContent() {
  const { currentScreen } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <DashboardLayout>{renderCurrentRoute(currentScreen)}</DashboardLayout>
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
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}