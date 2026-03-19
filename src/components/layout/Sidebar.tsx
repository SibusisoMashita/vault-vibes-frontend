import { useState, useEffect } from 'react';
import { Home, PieChart, Wallet, FileText, TrendingUp, Calendar, Users, Settings, Shield, BarChart3, ChevronDown, ChevronRight, Landmark, Bell, ClipboardCheck, BadgeDollarSign } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../app/providers';
import { isGroupAdmin } from '../../auth/permissions';
import { useNotifications } from '../../features/notifications/useNotifications';
import { useLoans } from '../../hooks/useLoans';
import { ContributionsService } from '../../services/contributionsService';
import { FEATURE_FLAGS } from '../../config/featureFlags';

const GROUP_NAME = 'Vault Vibes';

export function Sidebar() {
  const { currentUser } = useApp();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isAdmin = isGroupAdmin(currentUser.role);
  const { pathname } = useLocation();
  const { unreadCount } = useNotifications();
  const { loans } = useLoans();
  const pendingLoanCount = isAdmin ? loans.filter(l => l.status === 'pending').length : 0;

  const [pendingContribCount, setPendingContribCount] = useState(0);
  useEffect(() => {
    if (!isAdmin) return;
    ContributionsService.listRaw()
      .then(data => setPendingContribCount(data.filter(c => c.verificationStatus === 'PENDING').length))
      .catch(() => {});
  }, [isAdmin, pathname]);

  const mainNavItems = [
    { label: 'Dashboard',    icon: Home,       to: '/',              tourId: undefined },
    { label: 'Shares',       icon: PieChart,   to: '/shares',        tourId: undefined },
    { label: 'Pool',         icon: Wallet,     to: '/pool',          tourId: undefined },
    { label: 'Ledger',       icon: FileText,   to: '/ledger',        tourId: 'nav-ledger' },
    { label: 'Borrowing',    icon: TrendingUp, to: '/loans',         tourId: undefined },
    { label: 'Distribution', icon: Calendar,   to: '/distributions', tourId: undefined },
    ...(FEATURE_FLAGS.NOTIFICATIONS
      ? [{ label: 'Notifications', icon: Bell, to: '/notifications', badge: unreadCount, tourId: undefined }]
      : []),
  ];

  const settingsNavItems = [
    { label: 'Members', icon: Users,           to: '/admin/members',       badge: 0 },
    { label: 'Contributions',         icon: ClipboardCheck,  to: '/admin/contributions', badge: pendingContribCount },
    { label: 'Loan Approvals',        icon: BadgeDollarSign, to: '/admin/loans',         badge: pendingLoanCount },
    { label: 'Stokvel Setup',         icon: BarChart3,       to: '/admin/stokvel-config', badge: 0 },
    { label: 'Borrowing Rules',       icon: Settings,        to: '/admin/borrowing-config', badge: 0 },
    { label: 'Roles',                 icon: Shield,          to: '/admin/roles',          badge: 0 },
    { label: 'Bank Interest',         icon: Landmark,        to: '/admin/bank-interest',  badge: 0 },
  ];

  const navClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`;

  const subNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 w-full pl-9 pr-4 py-2 rounded-xl transition-all text-sm ${
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`;

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-card border-r border-border fixed left-0 top-0">
      <div className="px-6 py-6 border-b border-border flex items-center gap-3">
        <img src="/favicon.svg" alt="Vault Vibes logo" className="w-8 h-8" />
        <h1 className="text-xl font-semibold">{GROUP_NAME}</h1>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
          Vault Vibes
        </p>
        <div className="space-y-1 mb-4">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navClassName}
                {...(item.tourId ? { 'data-tour': item.tourId } : {})}
              >
                <Icon className="w-5 h-5" />
                <span className="flex-1">{item.label}</span>
                {'badge' in item && (item as any).badge > 0 && (
                  <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {(item as any).badge > 9 ? '9+' : (item as any).badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Settings section — admin only, collapsible */}
        {isAdmin && (
          <>
            <div className="border-t border-border my-3" />
            <button
              onClick={() => setIsSettingsOpen(open => !open)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-foreground hover:bg-secondary"
            >
              <Settings className="w-5 h-5 shrink-0" />
              <span className="flex-1 font-medium text-left">Settings</span>
              {isSettingsOpen
                ? <ChevronDown className="w-4 h-4 text-muted-foreground" />
                : <ChevronRight className="w-4 h-4 text-muted-foreground" />
              }
            </button>

            {isSettingsOpen && (
              <div className="space-y-0.5">
                {settingsNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.to} to={item.to} className={subNavClassName}>
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
