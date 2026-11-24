import { useState, type ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Brand, Icon, type Role } from '../features/auth/components/AuthUI';
import { getSession, signOut } from '../features/auth/components/mockAuth';
import '../styles/tokens.css';

interface AppShellProps {
  children?: ReactNode;
  activeRole?: Role;
  title?: string;
}

export default function AppShell({ children, title }: AppShellProps) {
  const navigate = useNavigate();
  const session = getSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const role = session?.role || 'buyer';
  const roleDisplay = role.charAt(0).toUpperCase() + role.slice(1);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  return (
    <div className={`ml-app-shell ml-theme-${role} min-h-screen bg-slate-50 flex flex-col`}>
      {/* Top Header */}
      <header className="ml-app-header bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            onClick={() => setDrawerOpen(true)}
            aria-label="Toggle navigation drawer"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Brand />
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
            {roleDisplay}
          </span>
          <button
            type="button"
            onClick={() => navigate('/app/profile')}
            className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm border border-slate-300 hover:bg-slate-300 transition"
            title="Profile"
          >
            {session?.name ? session.name[0].toUpperCase() : 'U'}
          </button>
        </div>
      </header>

      {/* Slide-out Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 p-5 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <Brand />
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                aria-label="Close drawer"
              >
                ✕
              </button>
            </div>

            <div className="py-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4">
                <p className="text-xs text-slate-500 font-medium">Logged in as</p>
                <p className="font-semibold text-slate-800 text-sm">{session?.name || 'Guest User'}</p>
                <span className="inline-block mt-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                  {roleDisplay}
                </span>
              </div>

              <nav className="space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/${role}`);
                    setDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                >
                  <Icon name="home" size={18} />
                  <span>Dashboard</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/app/profile');
                    setDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                >
                  <Icon name="user" size={18} />
                  <span>My Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/app/location');
                    setDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                >
                  <Icon name="pin" size={18} />
                  <span>GPS & Location</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/app/sync');
                    setDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                >
                  <Icon name="wifi-off" size={18} />
                  <span>Offline Sync</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate('/install');
                    setDrawerOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                >
                  <Icon name="phone" size={18} />
                  <span>Install PWA</span>
                </button>
              </nav>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full px-3 py-2 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition"
              >
                <Icon name="logout" size={18} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Body */}
      <main className="flex-1">
        {title && (
          <div className="bg-white border-b border-slate-200 px-4 py-3">
            <h1 className="text-lg font-bold text-slate-800">{title}</h1>
          </div>
        )}
        {children || <Outlet />}
      </main>
    </div>
  );
}
