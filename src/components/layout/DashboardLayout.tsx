import { ReactNode } from 'react';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      {/* Desktop Navigation */}
      <Sidebar />

      {/* Mobile Header */}
      <Topbar />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 md:p-6 lg:p-8 pb-20 lg:pb-8">{children}</div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </>
  );
}

