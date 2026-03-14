import { Home, PieChart, Wallet, FileText } from 'lucide-react';
import { useApp } from '../../app/providers';

export function MobileNav() {
  const { currentScreen, setCurrentScreen } = useApp();

  const navItems = [
    { id: 'dashboard' as const, label: 'Home', icon: Home },
    { id: 'shares' as const, label: 'Shares', icon: PieChart },
    { id: 'pool' as const, label: 'Pool', icon: Wallet },
    { id: 'ledger' as const, label: 'Ledger', icon: FileText },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
