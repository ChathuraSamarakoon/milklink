import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, FileBarChart, Download, Droplets, TrendingUp, Calendar } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export const AdminReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-page-container">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/reports"
        onNavigate={(path: string) => navigate(path)}
      />

      <header className="admin-mobile-topbar">
        <div className="topbar-left">
          <button type="button" className="topbar-icon-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <button type="button" className="topbar-back-btn" onClick={() => navigate('/admin')}>
            <ArrowLeft size={20} />
          </button>
          <div className="topbar-title-block">
            <h1 className="topbar-title">Platform Reports</h1>
            <span className="topbar-badge">Monthly Summary</span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="admin-avatar-pill">A</div>
        </div>
      </header>

      <main className="admin-main-content">
        <div className="breadcrumbs">
          <span className="breadcrumb-item link" onClick={() => navigate('/admin')}>Dashboard</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item active">Reports</span>
        </div>

        <div className="page-header-section">
          <h2 className="admin-section-heading">Platform Summary &amp; Analytics</h2>
          <p className="admin-section-sub">Monthly aggregated milk volume, financial turnover, and regional distribution.</p>
        </div>

        <div className="milk-collection-hero-card">
          <div className="milk-collection-content">
            <div className="milk-collection-header">
              <Droplets size={18} />
              <span className="milk-collection-title">Total Monthly Volume</span>
            </div>
            <div className="milk-collection-val-row">
              <span className="milk-collection-value">12,560.5 L</span>
              <span className="milk-collection-trend">
                <TrendingUp size={14} />
                <span>+8.4% MoM</span>
              </span>
            </div>
            <p className="milk-collection-subtext">Estimated Platform Value: LKR 2,637,705</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage;
