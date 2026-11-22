import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, RotateCcw, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export const AdminSyncMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mockConflicts = [
    {
      id: 'sync-c-01',
      collector: 'Sampath Kumara',
      device: 'Samsung Galaxy A14 (PWA)',
      orderId: 'ord-501',
      clientTime: '2025-01-21 07:35:10',
      issue: 'Quantity mismatch: Collector outbox recorded 28.0L vs farmer draft 27.5L',
      status: 'pending-resolution',
    },
    {
      id: 'sync-c-02',
      collector: 'Nuwan Jayawardena',
      device: 'Redmi 12 (PWA)',
      orderId: 'ord-489',
      clientTime: '2025-01-20 18:14:00',
      issue: 'Outbox timestamp replay order sequence conflict on reconnect',
      status: 'pending-resolution',
    },
  ];

  return (
    <div className="admin-page-container">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/sync"
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
            <h1 className="topbar-title">Offline Sync Monitor</h1>
            <span className="topbar-badge badge-warn">2 Conflicts</span>
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
          <span className="breadcrumb-item active">Sync Monitor</span>
        </div>

        <div className="page-header-section">
          <h2 className="admin-section-heading">Offline Synchronization Monitoring</h2>
          <p className="admin-section-sub">Inspect client IndexedDB outbox replay events, deduplication, and conflict states.</p>
        </div>

        <div className="attention-panel-card">
          <div className="attention-panel-header">
            <div className="attention-header-left">
              <AlertTriangle size={18} className="attention-icon-sync" />
              <h3 className="attention-title">Active Outbox Conflicts Requiring Review</h3>
            </div>
          </div>

          <div className="attention-items-list">
            {mockConflicts.map((conf) => (
              <div key={conf.id} className="attention-item-row severity-critical">
                <div className="attention-item-content">
                  <div className="attention-item-top">
                    <strong>{conf.id}: {conf.collector}</strong>
                    <span className="attention-item-time">{conf.clientTime}</span>
                  </div>
                  <p className="attention-item-desc">{conf.issue}</p>
                  <div className="attention-item-footer">
                    <button
                      type="button"
                      className="attention-action-btn"
                      onClick={() => alert(`Reviewing conflict ${conf.id} with server authority.`)}
                    >
                      <span>Resolve Conflict</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminSyncMonitoringPage;
