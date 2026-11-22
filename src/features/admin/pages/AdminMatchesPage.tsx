import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, GitCompare, ShieldCheck } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export const AdminMatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="admin-page-container">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/matches"
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
            <h1 className="topbar-title">Matching Engine</h1>
            <span className="topbar-badge">Rule-Based</span>
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
          <span className="breadcrumb-item active">Matching</span>
        </div>

        <div className="page-header-section">
          <h2 className="admin-section-heading">Rule-Based Matching Overview</h2>
          <p className="admin-section-sub">Weighted scoring formula parameters: Quantity, Distance, Unit Price, and Availability.</p>
        </div>

        <div className="admin-info-banner">
          <ShieldCheck size={18} className="info-banner-icon" />
          <div className="info-text-col">
            <strong>Deterministic Rule-Based System:</strong>
            <p>Matching scores are transparently calculated via weighted distance and quantity compliance. No black-box ML models are deployed in accordance with the MilkLink technical specification.</p>
          </div>
        </div>

        <div className="profile-details-grid">
          <div className="profile-card">
            <h3>Active Matching Weights</h3>
            <div className="detail-field"><span>Distance Weight:</span> <strong>35%</strong></div>
            <div className="detail-field"><span>Quantity Availability:</span> <strong>30%</strong></div>
            <div className="detail-field"><span>Unit Price Competitiveness:</span> <strong>20%</strong></div>
            <div className="detail-field"><span>Farmer Historical Rating:</span> <strong>15%</strong></div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminMatchesPage;
