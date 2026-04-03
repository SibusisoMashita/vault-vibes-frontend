import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, ReactNode, Suspense } from 'react';
import { Toaster } from '../components/ui/sonner';
import { LoanRequestModal } from '../features/loans';
import { ContributionModal } from '../features/pool';
import { AuthProvider } from '../auth/AuthProvider';
import { AuthGuard } from '../auth/AuthGuard';
import { isGroupAdmin } from '../auth/permissions';
import { useApp } from './context/AppContext';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { AuthCallback } from '../features/auth/pages/AuthCallback';
import { ProfilePage } from '../features/account/pages/ProfilePage';
import { AccountSettingsPage } from '../features/account/pages/AccountSettingsPage';
import { InvitationsPage } from '../features/invitations/pages/InvitationsPage';
import { DashboardPage } from '../features/dashboard';
import { SharesPage } from '../features/shares';
import { PoolPage } from '../features/pool';
import { LedgerPage } from '../features/ledger';
import { LoansPage } from '../features/loans';
import { DistributionPage } from '../features/distribution';
import { FEATURE_FLAGS } from '../config/featureFlags';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { AppProviders } from './providers';
import { NotFoundPage } from './pages/NotFoundPage';
import { OnboardingTour } from '../features/onboarding/OnboardingTour';
import { MarketingPage } from '../features/marketing/pages/MarketingPage';

const AdminPage             = lazy(() => import('../features/admin').then(m => ({ default: m.AdminPage })));
const AdminLoansPage        = lazy(() => import('../features/admin/pages/AdminLoansPage').then(m => ({ default: m.AdminLoansPage })));
const AdminMembersPage      = lazy(() => import('../features/admin/pages/AdminMembersPage').then(m => ({ default: m.AdminMembersPage })));
const AdminMemberEditPage   = lazy(() => import('../features/admin/pages/AdminMemberEditPage').then(m => ({ default: m.AdminMemberEditPage })));
const AdminStokvelConfigPage   = lazy(() => import('../features/admin/pages/AdminStokvelConfigPage').then(m => ({ default: m.AdminStokvelConfigPage })));
const AdminBorrowingConfigPage = lazy(() => import('../features/admin/pages/AdminBorrowingConfigPage').then(m => ({ default: m.AdminBorrowingConfigPage })));
const AdminRolesPage        = lazy(() => import('../features/admin/pages/AdminRolesPage').then(m => ({ default: m.AdminRolesPage })));
const AdminBankInterestPage = lazy(() => import('../features/admin/pages/AdminBankInterestPage').then(m => ({ default: m.AdminBankInterestPage })));
const AdminContributionsPage = lazy(() => import('../features/admin/pages/AdminContributionsPage').then(m => ({ default: m.AdminContributionsPage })));
const AdminStokvelsPage     = lazy(() => import('../features/admin/pages/AdminStokvelsPage').then(m => ({ default: m.AdminStokvelsPage })));
const NotificationsPage     = lazy(() => import('../features/notifications/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));

function AdminFallback() {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
    </div>
  );
}

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
          <Route path="/" element={<MarketingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Protected app routes */}
          <Route
            path="/app"
            element={(
              <AuthGuard>
                <ProtectedLayout />
              </AuthGuard>
            )}
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="shares" element={<SharesPage />} />
            <Route path="pool" element={<PoolPage />} />
            <Route path="ledger" element={<LedgerPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="distributions" element={<DistributionPage />} />
            <Route path="distribution" element={<Navigate to="/app/distributions" replace />} />
            <Route path="invitations" element={<InvitationsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<AccountSettingsPage />} />
            {/* Redirect old /me and /account to /profile */}
            <Route path="me" element={<Navigate to="/app/profile" replace />} />
            <Route path="account" element={<Navigate to="/app/profile" replace />} />
            <Route path="admin" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminPage /></Suspense></AdminGuard>} />
            <Route path="admin/loans" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminLoansPage /></Suspense></AdminGuard>} />
            <Route path="admin/members" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminMembersPage /></Suspense></AdminGuard>} />
            <Route path="admin/members/:memberId/edit" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminMemberEditPage /></Suspense></AdminGuard>} />
            <Route path="admin/stokvel-config" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminStokvelConfigPage /></Suspense></AdminGuard>} />
            <Route path="admin/borrowing-config" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminBorrowingConfigPage /></Suspense></AdminGuard>} />
            <Route path="admin/roles" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminRolesPage /></Suspense></AdminGuard>} />
            <Route path="admin/bank-interest" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminBankInterestPage /></Suspense></AdminGuard>} />
            <Route path="admin/contributions" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminContributionsPage /></Suspense></AdminGuard>} />
            <Route path="admin/stokvels" element={<AdminGuard><Suspense fallback={<AdminFallback />}><AdminStokvelsPage /></Suspense></AdminGuard>} />
            {FEATURE_FLAGS.NOTIFICATIONS && <Route path="notifications" element={<Suspense fallback={<AdminFallback />}><NotificationsPage /></Suspense>} />}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Legacy app paths */}
          <Route path="/dashboard" element={<AuthGuard><Navigate to="/app/dashboard" replace /></AuthGuard>} />
          <Route path="/shares" element={<AuthGuard><Navigate to="/app/shares" replace /></AuthGuard>} />
          <Route path="/pool" element={<AuthGuard><Navigate to="/app/pool" replace /></AuthGuard>} />
          <Route path="/ledger" element={<AuthGuard><Navigate to="/app/ledger" replace /></AuthGuard>} />
          <Route path="/loans" element={<AuthGuard><Navigate to="/app/loans" replace /></AuthGuard>} />
          <Route path="/distributions" element={<AuthGuard><Navigate to="/app/distributions" replace /></AuthGuard>} />
          <Route path="/distribution" element={<AuthGuard><Navigate to="/app/distributions" replace /></AuthGuard>} />
          <Route path="/invitations" element={<AuthGuard><Navigate to="/app/invitations" replace /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Navigate to="/app/profile" replace /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Navigate to="/app/settings" replace /></AuthGuard>} />
          <Route path="/me" element={<AuthGuard><Navigate to="/app/profile" replace /></AuthGuard>} />
          <Route path="/account" element={<AuthGuard><Navigate to="/app/profile" replace /></AuthGuard>} />
          <Route path="/admin" element={<AuthGuard><Navigate to="/app/admin" replace /></AuthGuard>} />
          <Route path="/admin/loans" element={<AuthGuard><Navigate to="/app/admin/loans" replace /></AuthGuard>} />
          <Route path="/admin/members" element={<AuthGuard><Navigate to="/app/admin/members" replace /></AuthGuard>} />
          <Route path="/admin/stokvel-config" element={<AuthGuard><Navigate to="/app/admin/stokvel-config" replace /></AuthGuard>} />
          <Route path="/admin/borrowing-config" element={<AuthGuard><Navigate to="/app/admin/borrowing-config" replace /></AuthGuard>} />
          <Route path="/admin/roles" element={<AuthGuard><Navigate to="/app/admin/roles" replace /></AuthGuard>} />
          <Route path="/admin/bank-interest" element={<AuthGuard><Navigate to="/app/admin/bank-interest" replace /></AuthGuard>} />
          <Route path="/admin/contributions" element={<AuthGuard><Navigate to="/app/admin/contributions" replace /></AuthGuard>} />
          <Route path="/admin/stokvels" element={<AuthGuard><Navigate to="/app/admin/stokvels" replace /></AuthGuard>} />
          {FEATURE_FLAGS.NOTIFICATIONS && (
            <Route path="/notifications" element={<AuthGuard><Navigate to="/app/notifications" replace /></AuthGuard>} />
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
