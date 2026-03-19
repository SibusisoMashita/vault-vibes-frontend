import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PageHeaderProvider, usePageHeader } from './PageHeaderContext';
import { UserProfileMenu } from './UserProfileMenu';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { FEATURE_FLAGS } from '../../config/featureFlags';

function MainContent() {
  const { title, subtitle } = usePageHeader();

  return (
    <main className="lg:ml-64 min-h-screen flex flex-col">
      {/* Desktop header — page title + profile avatar */}
      <div className="hidden lg:flex items-center justify-between border-b border-border px-8 py-6">
        <div>
          {title && <h1 className="text-2xl font-semibold leading-tight">{title}</h1>}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {FEATURE_FLAGS.NOTIFICATIONS && <NotificationBell />}
          <UserProfileMenu />
        </div>
      </div>

      {/* Page content — same horizontal padding as header */}
      <div className="flex-1 p-4 md:p-6 lg:px-8 lg:py-8 pb-20 lg:pb-8">
        <Outlet />
      </div>
    </main>
  );
}

export function DashboardLayout() {
  return (
    <PageHeaderProvider>
      <Sidebar />
      <Topbar />
      <MainContent />
      <MobileNav />
    </PageHeaderProvider>
  );
}
