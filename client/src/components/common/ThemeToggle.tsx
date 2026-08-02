import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../theme';
import { cn } from '../../lib/cn';

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showMenu?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, showMenu = false, ...props }) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (!showMenu) {
    const isDark = resolvedTheme === 'dark';
    const label = isDark ? 'Switch to light theme' : 'Switch to dark theme';

    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={label}
        title={label}
        className={cn(
          'relative inline-flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-surface-raised border border-border text-text-muted hover:text-text hover:bg-surface-hover',
          'transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring cursor-pointer',
          className
        )}
        {...props}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-warning transition-transform duration-200 hover:rotate-45" />
        ) : (
          <Moon className="w-5 h-5 text-text-muted transition-transform duration-200 hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <div className={cn('inline-flex items-center p-1 rounded-lg bg-bg-subtle border border-border', className)}>
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-label="Light theme"
        title="Light theme"
        className={cn(
          'p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
          theme === 'light'
            ? 'bg-surface text-text shadow-sm border border-border'
            : 'text-text-muted hover:text-text'
        )}
      >
        <Sun className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-label="Dark theme"
        title="Dark theme"
        className={cn(
          'p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
          theme === 'dark'
            ? 'bg-surface text-text shadow-sm border border-border'
            : 'text-text-muted hover:text-text'
        )}
      >
        <Moon className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => setTheme('system')}
        aria-label="System theme"
        title="System theme"
        className={cn(
          'p-1.5 rounded-md text-xs font-medium transition-all cursor-pointer',
          theme === 'system'
            ? 'bg-surface text-text shadow-sm border border-border'
            : 'text-text-muted hover:text-text'
        )}
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
};
