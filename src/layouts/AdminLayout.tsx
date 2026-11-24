import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Truck, FileBarChart, Menu } from 'lucide-react';
import AdminSidebar from '../features/admin/components/AdminSidebar';

const tabs = [
  { label: 'Dashboard', path: '/admin', Icon: LayoutDashboard },
  { label: 'Users', path: '/admin/users', Icon: Users },
  { label: 'Collections', path: '/admin/orders', Icon: Truck },
  { label: 'Reports', path: '/admin/reports', Icon: FileBarChart },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="milklink-admin-shell">
      <AdminSidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} currentPath={pathname} onNavigate={navigate} />
      <Outlet />
      <nav className="admin-bottom-nav" aria-label="Administrator bottom tabs">
        {tabs.map(({ label, path, Icon }) => {
          const active = path === '/admin' ? pathname === path : pathname.startsWith(path);
          return <button key={path} type="button" className={`bottom-nav-tab ${active ? 'tab-active' : ''}`} aria-current={active ? 'page' : undefined} onClick={() => navigate(path)}>
            <Icon size={20} /><span className="tab-label">{label}</span>
          </button>;
        })}
        <button type="button" className={`bottom-nav-tab ${menuOpen ? 'tab-active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="More administration pages" aria-expanded={menuOpen}>
          <Menu size={20} /><span className="tab-label">More</span>
        </button>
      </nav>
    </div>
  );
}
