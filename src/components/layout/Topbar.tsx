import { Moon, Sun, Settings } from 'lucide-react';
import { useApp } from '../../app/providers';
import { group } from '../../services/apiClient';

export function Topbar() {
  const { isDarkMode, toggleDarkMode, currentUser, setCurrentScreen } = useApp();

  return (
    <header className="lg:hidden sticky top-0 bg-card border-b border-border z-40 px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">{group.name}</h1>
          <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          {(currentUser.role === 'treasurer' || currentUser.role === 'admin') && (
            <button
              onClick={() => setCurrentScreen('admin')}
              className="w-10 h-10 rounded-xl hover:bg-secondary flex items-center justify-center transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
