import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Server,
  Smartphone,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import SyncMonitoringTable from '../components/SyncMonitoringTable';
import SyncConflictReviewDialog from '../components/SyncConflictReviewDialog';
import {
  fetchSyncOperations,
  resolveSyncOperation,
} from '../../../services/adminApi';
import type { SyncOperationRecord, TimeRangeFilter } from '../types';

export const AdminSyncMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [operations, setOperations] = useState<SyncOperationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal State
  const [selectedOperation, setSelectedOperation] = useState<SyncOperationRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    text: string;
    type: 'success' | 'info';
  } | null>(null);

  useEffect(() => {
    loadOperations();
  }, []);

  const loadOperations = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSyncOperations();
      setOperations(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchSyncOperations();
      setOperations(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleInspectOperation = (op: SyncOperationRecord) => {
    setSelectedOperation(op);
    setIsModalOpen(true);
  };

  const handleResolveOperation = async (
    opId: string,
    resolution: {
      action: 'accept_server' | 'accept_client' | 'force_retry';
      supervisorJustification: string;
      supervisorName: string;
    }
  ) => {
    const res = await resolveSyncOperation(opId, resolution);
    if (res.success && res.operation) {
      setOperations((prev) =>
        prev.map((o) => (o.id === opId ? res.operation! : o))
      );
      setFeedbackMessage({
        text: res.message,
        type: 'success',
      });
      setTimeout(() => setFeedbackMessage(null), 6000);
    }
  };

  const handleNavigateRecord = (recordType: string, recordId: string) => {
    if (recordType === 'order') {
      navigate(`/admin/orders/${recordId}`);
    } else if (recordType === 'listing') {
      navigate(`/admin/listings/${recordId}`);
    } else {
      navigate('/admin/orders');
    }
  };

  const handleNavigateUser = (userId: string) => {
    navigate(`/admin/users/${userId}`);
  };

  // KPI Calculations
  const conflictedCount = operations.filter((o) => o.status === 'conflicted').length;
  const failedCount = operations.filter((o) => o.status === 'failed').length;
  const totalReplays = 428; // Cumulative outbox batches replay telemetry

  return (
    <div className="admin-page-container">
      {/* SIDEBAR NAVIGATION DRAWER */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/sync"
        onNavigate={(path: string) => navigate(path)}
      />

      {/* MOBILE TOPBAR */}
      <header className="admin-mobile-topbar">
        <div className="topbar-left">
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <button
            type="button"
            className="topbar-back-btn"
            onClick={() => navigate('/admin')}
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="topbar-title-block">
            <h1 className="topbar-title">Sync Monitoring</h1>
            <span
              className={`topbar-badge ${
                conflictedCount > 0 ? 'badge-critical' : 'badge-neutral'
              }`}
            >
              {conflictedCount} Conflicts
            </span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="admin-avatar-pill" title="System Administrator">
            A
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="admin-main-content">
        {/* BREADCRUMB NAVIGATION */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <span className="breadcrumb-item link" onClick={() => navigate('/admin')}>
            Dashboard
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item active">Synchronization Monitoring</span>
        </nav>

        {/* PAGE HEADER */}
        <div className="page-header-section">
          <div className="page-title-row">
            <div>
              <h2 className="admin-section-heading">Offline Synchronization Monitoring</h2>
              <p className="admin-section-sub">
                Review failed and conflicted queued operations across supported offline roles
                (Collectors, Farmers, and Buyers). Server state is canonical and authoritative (A20).
              </p>
            </div>
          </div>
        </div>

        {/* FEEDBACK BANNER */}
        {feedbackMessage && (
          <div className="admin-action-toast success-toast">
            <CheckCircle2 size={16} />
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* TIMEFRAME & REFRESH FILTER PANEL */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          className="admin-sync-filter-panel"
        />

        {/* KPI STAT CARDS ROW */}
        <div className="kpi-cards-grid-4">
          <KpiStatCard
            icon={<AlertTriangle size={20} />}
            iconBgColor="#fee2e2"
            iconColor="#dc2626"
            value={conflictedCount}
            label="Active Conflicts"
            sublabel={`${failedCount} rejected schemas`}
            badge={{
              text: conflictedCount > 0 ? 'Action Required' : 'Clean',
              variant: conflictedCount > 0 ? 'negative' : 'positive',
            }}
          />

          <KpiStatCard
            icon={<Activity size={20} />}
            iconBgColor="#e0f2fe"
            iconColor="#0284c7"
            value={totalReplays}
            label="Outbox Replays"
            sublabel="IndexedDB Batches"
            badge={{ text: 'Today', variant: 'neutral' }}
          />

          <KpiStatCard
            icon={<CheckCircle2 size={20} />}
            iconBgColor="#dcfce7"
            iconColor="#16a34a"
            value="99.3%"
            label="Sync Reliability"
            sublabel="Low variance rate"
            badge={{ text: 'High', variant: 'positive' }}
          />

          <KpiStatCard
            icon={<Server size={20} />}
            iconBgColor="#ede9fe"
            iconColor="#7c3aed"
            value="Authoritative"
            label="Server Master"
            sublabel="Spec A20 canonical"
            badge={{ text: 'Spec A20', variant: 'info' }}
          />
        </div>

        {/* SERVER AUTHORITY EXPLANATORY BANNER */}
        <div className="admin-info-banner sync-banner">
          <ShieldCheck size={20} className="info-banner-icon" />
          <div className="info-text-col">
            <strong>Server Authoritative Standard (Specifications A20, A22–A23):</strong>
            <p>
              Offline client PWA outbox mutations from collectors and farmers are queued in IndexedDB.
              Upon network reconnection, the server authoritative database resolves ordering and state races.
              Admin manual override or force-retry requires confirmed supervisor authorization and physical audit slip reference.
            </p>
          </div>
        </div>

        {/* SYNC MONITORING TABLE */}
        <div className="sync-table-section">
          <SyncMonitoringTable
            operations={operations}
            onInspectOperation={handleInspectOperation}
            onNavigateRecord={handleNavigateRecord}
            onNavigateUser={handleNavigateUser}
          />
        </div>
      </main>

      {/* CONFLICT REVIEW & AUTHORIZATION DIALOG */}
      <SyncConflictReviewDialog
        operation={selectedOperation}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onResolve={handleResolveOperation}
        onNavigateRecord={handleNavigateRecord}
        onNavigateUser={handleNavigateUser}
      />
    </div>
  );
};

export default AdminSyncMonitoringPage;
