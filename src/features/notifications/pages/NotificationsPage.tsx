import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ArrowLeft } from 'lucide-react';
import { useNotifications } from '../useNotifications';
import { AppNotification } from '../notificationTypes';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30)  return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TYPE_COLORS: Record<AppNotification['type'], { dot: string; bg: string }> = {
  LOAN_APPROVED:         { dot: 'bg-green-500',   bg: 'bg-green-500/10' },
  LOAN_ISSUED:           { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10' },
  CONTRIBUTION_OVERDUE:  { dot: 'bg-red-500',     bg: 'bg-red-500/10' },
  DISTRIBUTION_EXECUTED: { dot: 'bg-blue-500',    bg: 'bg-blue-500/10' },
  MEMBER_INVITED:        { dot: 'bg-violet-500',  bg: 'bg-violet-500/10' },
  ROLE_UPDATED:          { dot: 'bg-amber-500',   bg: 'bg-amber-500/10' },
};

export function NotificationsPage() {
  const navigate = useNavigate();
  const { notifications, readIds, unreadCount, loading, markRead, markAllRead } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-secondary animate-pulse" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
          <Bell className="w-10 h-10 opacity-30" />
          <p className="text-sm">No notifications yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {notifications.map((n) => {
            const isRead = readIds.has(n.id);
            const colors = TYPE_COLORS[n.type];

            return (
              <li key={n.id}>
                <button
                  onClick={() => {
                    markRead(n.id);
                    if (n.link) navigate(n.link);
                  }}
                  className={`w-full text-left rounded-2xl border border-border p-4 flex gap-4 transition-colors hover:bg-secondary ${
                    isRead ? 'opacity-60' : colors.bg
                  }`}
                >
                  {/* Dot */}
                  <span
                    className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot} ${
                      isRead ? 'opacity-30' : ''
                    }`}
                  />

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className={`text-sm font-semibold ${isRead ? '' : ''}`}>{n.title}</p>
                      <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
