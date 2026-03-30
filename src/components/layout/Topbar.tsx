import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers';
import { isGroupAdmin } from '../../auth/permissions';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { FEATURE_FLAGS } from '../../config/featureFlags';
import { UserProfileMenu } from './UserProfileMenu';

export function Topbar() {
  const { currentUser, currentStokvelName } = useApp();
  const navigate = useNavigate();
  const isAdmin = isGroupAdmin(currentUser.role);

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
              onClick={() => navigate('/admin/members')}
              className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}

          <UserProfileMenu />
        </div>
      </div>
    </header>
  );
}
