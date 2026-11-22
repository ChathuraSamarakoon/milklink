import React from 'react';
import {
  LayoutDashboard,
  Users,
  Milk,
  ShoppingCart,
  GitCompare,
  RotateCcw,
  FileBarChart,
  Settings,
  X,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate,
}) => {
  const navItems = [
    {
      label: 'Admin Dashboard',
      path: '/admin',
      icon: <LayoutDashboard size={20} />,
      badge: undefined,
    },
    {
      label: 'User Management',
      path: '/admin/users',
      icon: <Users size={20} />,
      badge: '124',
    },
    {
      label: 'Milk Listings',
      path: '/admin/listings',
      icon: <Milk size={20} />,
      badge: '45 Active',
    },
    {
      label: 'Order Management',
      path: '/admin/orders',
      icon: <ShoppingCart size={20} />,
      badge: '14 Active',
    },
    {
      label: 'Matching Overview',
      path: '/admin/matches',
      icon: <GitCompare size={20} />,
      badge: undefined,
    },
    {
      label: 'Sync Monitoring',
      path: '/admin/sync',
      icon: <RotateCcw size={20} />,
      badge: '2 Issues',
      badgeVariant: 'warning',
    },
    {
      label: 'Platform Reports',
      path: '/admin/reports',
      icon: <FileBarChart size={20} />,
      badge: undefined,
    },
  ];

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? 'sidebar-open' : ''}`}
        aria-label="Admin Navigation"
      >
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-brand">
            <span className="brand-dot" />
            <div className="brand-text-col">
              <span className="sidebar-brand-title">MilkLink Admin</span>
              <span className="sidebar-brand-sub">Platform Management</span>
            </div>
          </div>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close navigation sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Security & Role pill */}
        <div className="sidebar-role-badge">
          <ShieldCheck size={16} />
          <span>Role: System Administrator</span>
        </div>

        {/* Navigation list */}
        <nav className="admin-sidebar-nav">
          <div className="sidebar-section-title">Core Modules</div>
          <ul className="sidebar-menu-list">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <li key={item.path}>
                  <button
                    type="button"
                    className={`sidebar-nav-item ${isActive ? 'nav-active' : ''}`}
                    onClick={() => {
                      onNavigate(item.path);
                      onClose();
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="nav-item-icon">{item.icon}</span>
                    <span className="nav-item-label">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`nav-item-badge ${
                          item.badgeVariant === 'warning' ? 'badge-warn' : ''
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="sidebar-section-title">System &amp; Security</div>
          <ul className="sidebar-menu-list">
            <li>
              <button
                type="button"
                className="sidebar-nav-item"
                onClick={() => {
                  alert('System settings & configuration are protected by multi-factor admin audit controls.');
                  onClose();
                }}
              >
                <span className="nav-item-icon">
                  <Settings size={20} />
                </span>
                <span className="nav-item-label">System Settings</span>
              </button>
            </li>
            <li>
              <a
                href="/"
                className="sidebar-nav-item"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/login');
                  onClose();
                }}
              >
                <span className="nav-item-icon">
                  <ExternalLink size={20} />
                </span>
                <span className="nav-item-label">Switch to Login / Portal</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Informational Privacy notice in sidebar footer */}
        <div className="sidebar-footer-notice">
          <p className="privacy-alert-text">
            <strong>Security Notice:</strong> Direct farmer GPS obfuscated to division level. Platform dashboard is strictly informational.
          </p>
          <div className="version-info">MilkLink PWA v1.0 • Admin Portal</div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
