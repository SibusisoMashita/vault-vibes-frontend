import { useRef, useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  return `${days}d ago`;
}

function dotColor(type: AppNotification['type']): string {
  switch (type) {
    case 'LOAN_APPROVED':         return 'bg-green-500';
    case 'LOAN_ISSUED':           return 'bg-emerald-500';
    case 'CONTRIBUTION_OVERDUE':  return 'bg-red-500';
    case 'DISTRIBUTION_EXECUTED': return 'bg-blue-500';
    case 'MEMBER_INVITED':        return 'bg-violet-500';
    case 'ROLE_UPDATED':          return 'bg-warning';
    default:                      return 'bg-muted-foreground';
  }
}

export function NotificationBell() {
  const { notifications, readIds, unreadCount, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const preview = notifications.slice(0, 5);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative min-w-[44px] min-h-[44px] rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-lg z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-accent hover:underline"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          {preview.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No notifications yet
            </p>
          ) : (
            <ul>
              {preview.map((n) => {
                const isRead = readIds.has(n.id);
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => {
                        markRead(n.id);
                        setOpen(false);
                        if (n.link) navigate(n.link);
                      }}
                      className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-secondary transition-colors ${
                        isRead ? 'opacity-60' : ''
                      }`}
                    >
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotColor(n.type)} ${isRead ? 'opacity-40' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{timeAgo(n.timestamp)}</p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Footer */}
          <div className="border-t border-border px-4 py-2">
            <button
              onClick={() => { setOpen(false); navigate('/notifications'); }}
              className="w-full text-xs text-center text-accent hover:underline py-1"
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
