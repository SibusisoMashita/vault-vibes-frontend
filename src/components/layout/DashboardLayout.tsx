import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { PageHeaderProvider, usePageHeader } from './PageHeaderContext';

function MainContent() {
  const { title, subtitle } = usePageHeader();

  return (
    <main className="lg:ml-64 min-h-screen flex flex-col">
      {/* Page title area — matches sidebar header height so divider is continuous */}
      <div className="hidden lg:flex items-end h-[120px] box-border px-8 pb-4 border-b border-border">
        <div>
          {title && <h1 className="text-2xl font-semibold leading-tight">{title}</h1>}
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Page content — starts below the divider */}
      <div className="flex-1 p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">
        <Outlet />
      </div>
    </main>
  );
}

export function DashboardLayout() {
  return (
    <PageHeaderProvider>
      {/* Desktop Navigation */}
      <Sidebar />

      {/* Mobile Header */}
      <Topbar />

      {/* Main Content */}
      <MainContent />

      {/* Mobile Navigation */}
      <MobileNav />
    </PageHeaderProvider>
  );
}
