import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { Toaster } from '../components/ui/sonner';
import { LoanRequestModal } from '../features/loans';
import { ContributionModal } from '../features/pool';
import { AuthProvider } from '../auth/AuthProvider';
import { AuthGuard } from '../auth/AuthGuard';
import { isGroupAdmin } from '../auth/permissions';
import { useApp } from './context/AppContext';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { AuthCallback } from '../features/auth/pages/AuthCallback';
import { MyAccountPage } from '../features/account/pages/MyAccountPage';
import { InvitationsPage } from '../features/invitations/pages/InvitationsPage';
import { DashboardPage } from '../features/dashboard';
import { SharesPage } from '../features/shares';
import { PoolPage } from '../features/pool';
import { LedgerPage } from '../features/ledger';
import { LoansPage } from '../features/loans';
import { DistributionPage } from '../features/distribution';
import { AdminPage } from '../features/admin';
import { AdminLoansPage } from '../features/admin/pages/AdminLoansPage';
import { AdminMembersPage } from '../features/admin/pages/AdminMembersPage';
import { AdminStokvelConfigPage } from '../features/admin/pages/AdminStokvelConfigPage';
import { AdminBorrowingConfigPage } from '../features/admin/pages/AdminBorrowingConfigPage';
import { AdminRolesPage } from '../features/admin/pages/AdminRolesPage';
import { AdminBankInterestPage } from '../features/admin/pages/AdminBankInterestPage';
import { AdminContributionsPage } from '../features/admin/pages/AdminContributionsPage';
import { NotificationsPage } from '../features/notifications/pages/NotificationsPage';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AppProviders } from './providers';
import { NotFoundPage } from './pages/NotFoundPage';
import { OnboardingTour } from '../features/onboarding/OnboardingTour';

function ProtectedLayout() {
  return (
    <AppProviders>
      <DashboardLayout />
      <ContributionModal />
      <LoanRequestModal />
      <OnboardingTour />
      <Toaster />
    </AppProviders>
  );
}

/**
 * Route-level guard for admin pages. Rendered inside AppProviders so it has access
 * to AppContext. Shows a spinner while user data loads, then redirects non-admins
 * to /dashboard.
 */
function AdminGuard({ children }: { children: ReactNode }) {
  const { currentUser, isUserLoading } = useApp();

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (!isGroupAdmin(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected app routes */}
          <Route
            path="/"
            element={(
              <AuthGuard>
                <ProtectedLayout />
              </AuthGuard>
            )}
          >
            <Route index element={<DashboardPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="shares" element={<SharesPage />} />
            <Route path="pool" element={<PoolPage />} />
            <Route path="ledger" element={<LedgerPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="distributions" element={<DistributionPage />} />
            <Route path="distribution" element={<Navigate to="/distributions" replace />} />
            <Route path="invitations" element={<InvitationsPage />} />
            <Route path="me" element={<MyAccountPage />} />
            <Route path="admin" element={<AdminGuard><AdminPage /></AdminGuard>} />
            <Route path="admin/loans" element={<AdminGuard><AdminLoansPage /></AdminGuard>} />
            <Route path="admin/members" element={<AdminGuard><AdminMembersPage /></AdminGuard>} />
            <Route path="admin/stokvel-config" element={<AdminGuard><AdminStokvelConfigPage /></AdminGuard>} />
            <Route path="admin/borrowing-config" element={<AdminGuard><AdminBorrowingConfigPage /></AdminGuard>} />
            <Route path="admin/roles" element={<AdminGuard><AdminRolesPage /></AdminGuard>} />
            <Route path="admin/bank-interest" element={<AdminGuard><AdminBankInterestPage /></AdminGuard>} />
            <Route path="admin/contributions" element={<AdminGuard><AdminContributionsPage /></AdminGuard>} />
            {FEATURE_FLAGS.NOTIFICATIONS && <Route path="notifications" element={<NotificationsPage />} />}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Public fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
