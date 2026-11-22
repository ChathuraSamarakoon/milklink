import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Smartphone, Monitor, Compass, ShieldCheck } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [showDemoNav, setShowDemoNav] = useState(true);

  return (
    <div className={`milklink-admin-shell ${isMobileFrame ? 'preview-device-frame-active' : ''}`}>
      {/* Interactive Admin Demo Toolbar */}
      {showDemoNav && (
        <div className="admin-demo-toolbar" role="toolbar" aria-label="Admin Navigation Demo Bar">
          <div className="demo-toolbar-left">
            <span className="demo-brand-pill">
              <ShieldCheck size={14} />
              <span>MilkLink Admin Mode</span>
            </span>
            <div className="demo-screen-pills">
              <button
                type="button"
                className={`demo-pill ${location.pathname === '/admin' ? 'active' : ''}`}
                onClick={() => navigate('/admin')}
              >
                Dashboard
              </button>
              <button
                type="button"
                className={`demo-pill ${location.pathname.startsWith('/admin/users') ? 'active' : ''}`}
                onClick={() => navigate('/admin/users')}
              >
                Users Table
              </button>
              <button
                type="button"
                className={`demo-pill ${location.pathname.includes('/usr-001') ? 'active' : ''}`}
                onClick={() => navigate('/admin/users/usr-001')}
              >
                User Detail
              </button>
              <button
                type="button"
                className={`demo-pill ${location.pathname === '/admin/listings' ? 'active' : ''}`}
                onClick={() => navigate('/admin/listings')}
              >
                Listings
              </button>
              <button
                type="button"
                className={`demo-pill ${location.pathname === '/admin/orders' ? 'active' : ''}`}
                onClick={() => navigate('/admin/orders')}
              >
                Orders
              </button>
              <button
                type="button"
                className={`demo-pill ${location.pathname === '/admin/sync' ? 'active' : ''}`}
                onClick={() => navigate('/admin/sync')}
              >
                Sync
              </button>
              <button
                type="button"
                className={`demo-pill ${location.pathname === '/admin/reports' ? 'active' : ''}`}
                onClick={() => navigate('/admin/reports')}
              >
                Reports
              </button>
              <button
                type="button"
                className="demo-pill pill-login"
                onClick={() => navigate('/login')}
              >
                Login Page
              </button>
            </div>
          </div>

          <div className="demo-toolbar-right">
            <button
              type="button"
              className={`frame-toggle-btn ${isMobileFrame ? 'active' : ''}`}
              onClick={() => setIsMobileFrame(!isMobileFrame)}
              title={isMobileFrame ? 'Switch to Full Width View' : 'Preview in Mobile Device Frame (matches mockup image)'}
            >
              {isMobileFrame ? <Monitor size={14} /> : <Smartphone size={14} />}
              <span>{isMobileFrame ? 'Full Width' : 'Phone Mockup'}</span>
            </button>
            <button
              type="button"
              className="toolbar-hide-btn"
              onClick={() => setShowDemoNav(false)}
              title="Minimize demo bar"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Floating Restore button if bar minimized */}
      {!showDemoNav && (
        <button
          type="button"
          className="demo-restore-btn"
          onClick={() => setShowDemoNav(true)}
          title="Open Admin navigation toolbar"
        >
          <Compass size={16} />
          <span>Admin Nav</span>
        </button>
      )}

      {/* Main Outlet */}
      <div className={isMobileFrame ? 'phone-device-wrapper' : 'page-view-wrapper'}>
        {isMobileFrame && (
          <div className="phone-notch-bar">
            <span className="notch-time">9:41</span>
            <div className="notch-speaker" />
            <div className="notch-icons">
              <span className="signal-bars">●●●●</span>
              <span className="battery-icon">100%</span>
            </div>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
