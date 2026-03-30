import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Shield, HelpCircle, LogOut, Moon, Sun } from 'lucide-react';
import { useApp } from '../../app/providers';
import { useAuth } from '../../auth/AuthProvider';
import { useIsMobile } from '../ui/use-mobile';
import { startTour } from '../../features/onboarding/tourService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';

const itemBase =
  'flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary cursor-pointer';

function UserAvatar({ size = 36 }: { size?: number }) {
  const { currentUser, isUserLoading } = useApp();

  if (isUserLoading) {
    return (
      <div
        className="rounded-full bg-secondary animate-pulse"
        style={{ width: size, height: size }}
      />
    );
  }

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-full bg-accent/20 flex items-center justify-center font-semibold text-accent select-none"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  );
}

function ProfileMenuItems({ onClose }: { onClose: () => void }) {
  const { currentUser, currentStokvelName, isDarkMode, toggleDarkMode } = useApp();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="py-1">
      {/* Identity (non-clickable) */}
      <div className="px-3 py-2">
        <p className="font-semibold text-sm truncate max-w-[200px]">{currentUser.name}</p>
        <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
        <p className="text-xs text-muted-foreground">{currentStokvelName}</p>
      </div>

      <div className="h-px bg-border my-1" />

      {/* Account */}
      <button onClick={() => go('/profile')} className={itemBase}>
        <User className="w-4 h-4" /> Profile
      </button>
      <button onClick={() => go('/settings')} className={itemBase}>
        <Settings className="w-4 h-4" /> Account Settings
      </button>

      <div className="h-px bg-border my-1" />

      {/* Security */}
      <button onClick={() => go('/settings')} className={itemBase}>
        <Shield className="w-4 h-4" /> Security &amp; Sessions
      </button>

      <div className="h-px bg-border my-1" />

      {/* Support */}
      <button onClick={() => { startTour(); onClose(); }} className={itemBase}>
        <HelpCircle className="w-4 h-4" /> Help / Start Tour
      </button>

      <div className="h-px bg-border my-1" />

      {/* Dark Mode toggle */}
      <button
        onClick={(e) => { e.preventDefault(); toggleDarkMode(); }}
        className={`${itemBase} justify-between`}
      >
        <span className="flex items-center gap-2">
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          Dark Mode
        </span>
        <div className={`w-8 h-[18px] rounded-full relative transition-colors ${isDarkMode ? 'bg-accent' : 'bg-secondary border border-border'}`}>
          <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white shadow transition-transform ${isDarkMode ? 'translate-x-[16px]' : 'translate-x-[2px]'}`} />
        </div>
      </button>

      <div className="h-px bg-border my-1" />

      {/* Sign Out */}
      <button
        onClick={() => { logout(); onClose(); }}
        className={`${itemBase} text-destructive hover:bg-destructive/10`}
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </div>
  );
}

export function UserProfileMenu() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setOpen(true)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open profile menu"
        >
          <UserAvatar size={28} />
        </button>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto pb-8">
            <SheetHeader>
              <SheetTitle>Account</SheetTitle>
            </SheetHeader>
            <ProfileMenuItems onClose={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="rounded-full focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
          aria-label="Open profile menu"
        >
          <UserAvatar size={36} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-0">
        <ProfileMenuItems onClose={() => setOpen(false)} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
