import { Moon, Sun, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../app/providers';
import { isGroupAdmin } from '../../auth/permissions';
import { NotificationBell } from '../../features/notifications/components/NotificationBell';
import { FEATURE_FLAGS } from '../../config/featureFlags';

const GROUP_NAME = 'Vault Vibes';

export function Topbar() {
  const { isDarkMode, toggleDarkMode, currentUser } = useApp();
  const navigate = useNavigate();

  const isAdmin = isGroupAdmin(currentUser.role);

  return (
    <header className="lg:hidden sticky top-0 bg-card border-b border-border z-40 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">{GROUP_NAME}</h1>
          <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
        </div>

        <div className="flex items-center gap-2">
          {FEATURE_FLAGS.NOTIFICATIONS && <NotificationBell />}

          <button
            onClick={toggleDarkMode}
            className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {isAdmin && (
            <button
              onClick={() => navigate('/admin/members')}
              className="min-w-[44px] min-h-[44px] rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
