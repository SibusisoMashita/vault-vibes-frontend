import { Home, PieChart, Wallet, FileText, TrendingUp } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function MobileNav() {
  const navItems = [
    { label: 'Home',      icon: Home,       to: '/' },
    { label: 'Shares',    icon: PieChart,   to: '/shares' },
    { label: 'Pool',      icon: Wallet,     to: '/pool' },
    { label: 'Ledger',    icon: FileText,   to: '/ledger' },
    { label: 'Borrowing', icon: TrendingUp, to: '/loans' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                  isActive ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
