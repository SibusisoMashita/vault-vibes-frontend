import { Home, PieChart, Wallet, FileText, TrendingUp, Calendar, Settings, Moon, Sun } from 'lucide-react';
import { useApp } from '../../app/providers';
import { group } from '../../services/apiClient';

export function Sidebar() {
  const { currentScreen, setCurrentScreen, currentUser, isDarkMode, toggleDarkMode } = useApp();

  const navItems = [
    { id: 'dashboard' as const, label: 'Home', icon: Home },
    { id: 'shares' as const, label: 'Shares', icon: PieChart },
    { id: 'pool' as const, label: 'Pool', icon: Wallet },
    { id: 'ledger' as const, label: 'Ledger', icon: FileText },
    { id: 'loans' as const, label: 'Loans', icon: TrendingUp },
    { id: 'distribution' as const, label: 'Distribution', icon: Calendar },
  ];

  if (currentUser.role === 'treasurer' || currentUser.role === 'admin') {
    navItems.push({ id: 'admin' as const, label: 'Admin', icon: Settings });
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-card border-r border-border fixed left-0 top-0">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-semibold">{group.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{currentUser.name}</p>
        <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-accent/10 text-accent capitalize">
          {currentUser.role}
        </span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentScreen(item.id)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
