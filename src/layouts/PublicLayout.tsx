import type { ReactNode } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Brand, Icon } from '../features/auth/components/AuthUI';
import '../styles/tokens.css';

interface PublicLayoutProps {
  children?: ReactNode;
  showBack?: boolean;
  backTo?: string;
}

export default function PublicLayout({ children, showBack = false, backTo = '/' }: PublicLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="ml-public-layout min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="ml-public-header flex items-center justify-between px-4 py-3 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(backTo)}
              aria-label="Back"
              className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <Icon name="arrow-left" size={20} />
            </button>
          )}
          <Brand />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-md hover:bg-slate-100 transition"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-xs font-semibold bg-emerald-600 text-white px-3 py-1.5 rounded-full hover:bg-emerald-700 shadow-sm transition"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {children || <Outlet />}
      </main>

      <footer className="ml-public-footer py-6 px-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="max-w-md mx-auto space-y-2">
          <p className="font-medium text-slate-700">MilkLink Sri Lanka • Farm-to-Market Dairy Platform</p>
          <p>
            Secure role-based marketplace for registered Dairy Farmers, Milk Buyers, and Milk Collectors.
          </p>
          <p className="text-slate-400">© 2026 MilkLink. Public Registration open for agricultural & dairy participants.</p>
        </div>
      </footer>
    </div>
  );
}
