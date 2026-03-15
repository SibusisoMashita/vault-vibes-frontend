import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '../components/ui/sonner';
import { LoanRequestModal } from '../features/loans';
import { ContributionModal } from '../features/pool';
import { AuthProvider } from '../auth/AuthProvider';
import { AuthGuard } from '../auth/AuthGuard';
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

function ProtectedLayout() {
  return (
    <AppProviders>
      <DashboardLayout />
      <ContributionModal />
      <LoanRequestModal />
      <Toaster />
    </AppProviders>
  );
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
            <Route path="admin" element={<AdminPage />} />
            <Route path="admin/loans" element={<AdminLoansPage />} />
            <Route path="admin/members" element={<AdminMembersPage />} />
            <Route path="admin/stokvel-config" element={<AdminStokvelConfigPage />} />
            <Route path="admin/borrowing-config" element={<AdminBorrowingConfigPage />} />
            <Route path="admin/roles" element={<AdminRolesPage />} />
            <Route path="admin/bank-interest" element={<AdminBankInterestPage />} />
            <Route path="admin/contributions" element={<AdminContributionsPage />} />
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
