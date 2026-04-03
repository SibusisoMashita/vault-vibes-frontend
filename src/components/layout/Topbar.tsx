import { useState, useEffect } from 'react';
import { Settings, Users, ClipboardCheck, BadgeDollarSign, BarChart3, Shield, Landmark, Layers } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../../app/providers';
import { hasPermission, isGroupAdmin, Permission } from '../../auth/permissions';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { UserProfileMenu } from './UserProfileMenu';
import { useLoans } from '../../hooks/useLoans';
import { ContributionsService } from '../../services/contributionsService';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

export function Topbar() {
  const { currentUser, currentStokvelName } = useApp();
  const isAdmin = isGroupAdmin(currentUser.role);
  const canManageStokvels = hasPermission(currentUser.role, Permission.MANAGE_STOKVELS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { loans } = useLoans();
  const pendingLoanCount = isAdmin ? loans.filter(l => l.status === 'pending').length : 0;
  const [pendingContribCount, setPendingContribCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) return;
    ContributionsService.listRaw()
      .then(data => setPendingContribCount(data.filter(c => c.verificationStatus === 'PENDING').length))
      .catch(() => {});
  }, [isAdmin]);

  const settingsNavItems = [
    { label: 'Members',         icon: Users,           to: '/app/admin/members',          badge: 0 },
    { label: 'Contributions',   icon: ClipboardCheck,  to: '/app/admin/contributions',    badge: pendingContribCount },
    { label: 'Loan Approvals',  icon: BadgeDollarSign, to: '/app/admin/loans',            badge: pendingLoanCount },
    { label: 'Stokvel Setup',   icon: BarChart3,       to: '/app/admin/stokvel-config',   badge: 0 },
    { label: 'Borrowing Rules', icon: Settings,        to: '/app/admin/borrowing-config', badge: 0 },
    { label: 'Roles',           icon: Shield,          to: '/app/admin/roles',            badge: 0 },
    { label: 'Bank Interest',   icon: Landmark,        to: '/app/admin/bank-interest',    badge: 0 },
    ...(canManageStokvels
      ? [{ label: 'Stokvels', icon: Layers, to: '/app/admin/stokvels', badge: 0 }]
      : []),
  ];

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all text-sm ${
      isActive
        ? 'bg-accent text-accent-foreground'
        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
    }`;

  return (
    <header className="lg:hidden sticky top-0 bg-card border-b border-border z-40 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/favicon-32x32.png" alt="Vault Vibes logo" className="w-6 h-6" />
          <div>
            <h1 className="font-semibold">{currentStokvelName}</h1>
            <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {FEATURE_FLAGS.NOTIFICATIONS && <NotificationBell />}

          {isAdmin && (
            <button
              onClick={() => setSettingsOpen(true)}
              className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
              aria-label="Open settings menu"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          <UserProfileMenu />
        </div>
      </div>

      {isAdmin && (
        <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto pb-8">
            <SheetHeader>
              <SheetTitle>Settings</SheetTitle>
            </SheetHeader>
            <nav className="mt-2 space-y-0.5">
              {settingsNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={navItemClass}
                    onClick={() => setSettingsOpen(false)}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.badge > 9 ? '9+' : item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>
      )}
    </header>
  );
}
