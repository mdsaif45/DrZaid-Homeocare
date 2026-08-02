import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Search, Bell, LayoutDashboard, Users, PlusCircle, UserCheck, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { CommandSearchModal } from '../ui/CommandSearchModal';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../../lib/cn';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: 'Patients',
    href: '/dashboard/patients',
    icon: <Users className="w-5 h-5" />,
  },
];

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname.startsWith(href);
}

interface SidebarContentProps {
  mobile?: boolean;
  pathname: string;
  user: { full_name?: string; role?: string } | null;
  onCloseMobile: () => void;
  onLogout: () => void;
}

function SidebarContent({ mobile = false, pathname, user, onCloseMobile, onLogout }: SidebarContentProps) {
  return (
    <aside className={cn('flex flex-col h-full bg-sidebar-bg border-r border-sidebar-border', mobile ? 'w-full' : 'w-64')}>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-sidebar-border flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <svg className="w-5 h-5 text-text-on-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-extrabold text-sidebar-text">Dr. ZAID's</p>
            <p className="text-xs font-semibold text-sidebar-accent tracking-wide">Homeo Care</p>
          </div>
        </Link>
        {mobile && (
          <button onClick={onCloseMobile} className="text-sidebar-muted hover:text-sidebar-text p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-sidebar-muted uppercase tracking-widest px-3 mb-3">Main</p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all',
                active
                  ? 'bg-primary text-text-on-brand shadow-lg shadow-primary/20'
                  : 'text-sidebar-muted hover:text-sidebar-text hover:bg-sidebar-hover'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary-subtle border border-primary-border flex items-center justify-center text-primary-subtle-text font-bold text-sm shrink-0">
            {user?.full_name?.[0] ?? 'D'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-sidebar-text truncate">{user?.full_name}</p>
            <p className="text-xs text-sidebar-muted capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-sidebar-muted hover:text-danger hover:bg-danger-subtle transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-bg text-text overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-shrink-0">
        <SidebarContent
          pathname={location.pathname}
          user={user}
          onCloseMobile={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0">
            <SidebarContent
              mobile
              pathname={location.pathname}
              user={user}
              onCloseMobile={() => setSidebarOpen(false)}
              onLogout={handleLogout}
            />
          </div>
          <div className="flex-1 bg-overlay backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden pb-16 lg:pb-0">
        {/* Topbar */}
        <header className="bg-surface border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 z-30 transition-colors">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl text-text-muted hover:bg-surface-hover transition cursor-pointer"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Desktop Global Search Bar */}
            <div
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-3 px-4 py-2 bg-bg-subtle hover:bg-surface-hover border border-border rounded-xl cursor-pointer transition w-72 lg:w-96"
            >
              <Search className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-xs text-text-muted font-medium flex-1 truncate">
                Search patients, records, reminders...
              </span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-surface border border-border rounded-md shadow-2xs">
                Ctrl + K
              </kbd>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Icon button */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="md:hidden p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-xl transition cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative p-2 text-text-muted hover:text-text hover:bg-surface-hover rounded-xl transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-surface" />
            </button>

            {/* Central Reusable Theme Toggle */}
            <ThemeToggle />

            <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

            {/* User Profile Badge & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 sm:gap-3 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-surface-hover transition cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-primary-subtle border border-primary-border flex items-center justify-center text-primary-subtle-text font-bold text-xs">
                  {user?.full_name?.[0] ?? 'D'}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-tight">
                  <p className="text-xs font-bold text-text">{user?.full_name || 'Dr. MD Zaid'}</p>
                  <p className="text-[10px] text-text-muted capitalize">{user?.role || 'Doctor'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted hidden sm:block" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-raised rounded-xl shadow-xl border border-border py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-border sm:hidden">
                    <p className="text-xs font-bold text-text">{user?.full_name}</p>
                    <p className="text-[10px] text-text-muted capitalize">{user?.role}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      navigate('/dashboard/patients/new');
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-text hover:bg-surface-hover flex items-center gap-2 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-primary" />
                    New Patient
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-semibold text-danger hover:bg-danger-subtle flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-danger" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-bg text-text">{children}</main>
      </div>

      {/* Global Ctrl+K Search Modal */}
      <CommandSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border px-4 py-2 flex items-center justify-around shadow-lg">
        <Link
          to="/dashboard"
          className={cn(
            'flex flex-col items-center gap-1 text-[10px] font-bold transition',
            isActive(location.pathname, '/dashboard') && location.pathname === '/dashboard'
              ? 'text-primary'
              : 'text-text-muted hover:text-text'
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/dashboard/patients"
          className={cn(
            'flex flex-col items-center gap-1 text-[10px] font-bold transition',
            isActive(location.pathname, '/dashboard/patients')
              ? 'text-primary'
              : 'text-text-muted hover:text-text'
          )}
        >
          <Users className="w-5 h-5" />
          <span>Patients</span>
        </Link>
        <button
          onClick={() => navigate('/dashboard/patients/new')}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-text-muted hover:text-primary transition cursor-pointer"
        >
          <PlusCircle className="w-5 h-5 text-primary" />
          <span>Actions</span>
        </button>
        <button
          onClick={() => setUserDropdownOpen((prev) => !prev)}
          className="flex flex-col items-center gap-1 text-[10px] font-bold text-text-muted hover:text-text transition cursor-pointer"
        >
          <UserCheck className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </div>
  );
}
