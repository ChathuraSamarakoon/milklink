import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  FileBarChart,
  Droplets,
  DollarSign,
  TrendingUp,
  Milk,
  ShoppingCart,
  Users,
  Download,
  Share2,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import PeriodSelector from '../components/PeriodSelector';
import SummaryReportCards from '../components/SummaryReportCards';
import { fetchSummaryReports } from '../../../services/adminApi';
import type { SummaryReportData, TimeRangeFilter } from '../types';

export const AdminReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<TimeRangeFilter>('month');
  const [report, setReport] = useState<SummaryReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  useEffect(() => {
    loadReport(selectedPeriod);
  }, [selectedPeriod]);

  const loadReport = async (period: TimeRangeFilter) => {
    setIsLoading(true);
    try {
      const data = await fetchSummaryReports(period);
      setReport(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchSummaryReports(selectedPeriod);
      setReport(data);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExportSummary = () => {
    setExportNotice('Exporting CSV summary report for evaluation...');
    setTimeout(() => {
      setExportNotice(null);
    }, 4000);
  };

  // Screen flow navigation
  const handleNavigateUsers = (role?: string) => {
    navigate(role ? `/admin/users?role=${role}` : '/admin/users');
  };

  const handleNavigateListings = (status?: string) => {
    navigate(status ? `/admin/listings?status=${status}` : '/admin/listings');
  };

  const handleNavigateOrders = (status?: string) => {
    navigate(status ? `/admin/orders?status=${status}` : '/admin/orders');
  };

  return (
    <div className="admin-page-container">
      {/* SIDEBAR NAVIGATION DRAWER */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/reports"
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
            <h1 className="topbar-title">Basic Reports</h1>
            <span className="topbar-badge">Spec A24</span>
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
          <span className="breadcrumb-item active">Basic Reports</span>
        </nav>

        {/* PAGE HEADER */}
        <div className="page-header-section">
          <div className="page-title-row">
            <div>
              <h2 className="admin-section-heading">Platform Summary &amp; Basic Reports</h2>
              <p className="admin-section-sub">
                Aggregated milk yield, recorded cash handover turnover, and domain status
                breakdowns for prototype evaluation (A24, A06).
              </p>
            </div>
            <div className="header-actions-right">
              <button
                type="button"
                className="export-report-btn"
                onClick={handleExportSummary}
                title="Export basic evaluation CSV summary"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* EXPORT TOAST NOTICE */}
        {exportNotice && (
          <div className="admin-action-toast success-toast">
            <span>{exportNotice}</span>
          </div>
        )}

        {/* PERIOD SELECTOR COMPONENT */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onSelectPeriod={(period) => setSelectedPeriod(period)}
          periodLabel={report?.periodLabel}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          className="admin-reports-period-selector"
        />

        {/* KPI STAT CARDS ROW */}
        {report && (
          <div className="kpi-cards-grid-4">
            <KpiStatCard
              icon={<Milk size={20} />}
              iconBgColor="#e0f2fe"
              iconColor="#0284c7"
              value={`${report.totalRecordedLitres.toLocaleString()} L`}
              label="Recorded Yield"
              sublabel="Physical collections"
              badge={{ text: 'Recorded', variant: 'positive' }}
              onClick={() => handleNavigateOrders('completed')}
            />

            <KpiStatCard
              icon={<DollarSign size={20} />}
              iconBgColor="#dcfce7"
              iconColor="#16a34a"
              value={`Rs. ${(report.totalTurnoverLkr / 1000).toFixed(1)}k`}
              label="Cash Turnover"
              sublabel={`@ Rs. ${report.avgUnitPriceLkr}/L`}
              badge={{ text: 'Reconciled', variant: 'positive' }}
              onClick={() => handleNavigateOrders('completed')}
            />

            <KpiStatCard
              icon={<Users size={20} />}
              iconBgColor="#fef3c7"
              iconColor="#d97706"
              value={report.userSummary.totalUsers}
              label="Registered Users"
              sublabel={`${report.userSummary.farmers} smallholders`}
              badge={{ text: 'Ecosystem', variant: 'neutral' }}
              onClick={() => handleNavigateUsers()}
            />

            <KpiStatCard
              icon={<ShoppingCart size={20} />}
              iconBgColor="#ede9fe"
              iconColor="#7c3aed"
              value={report.orderSummary.totalOrders}
              label="Platform Orders"
              sublabel={`${report.orderSummary.completedOrders} completed`}
              badge={{ text: 'Orders', variant: 'info' }}
              onClick={() => handleNavigateOrders()}
            />
          </div>
        )}

        {/* SUMMARY REPORT CARDS */}
        {report && (
          <div className="summary-reports-section">
            <SummaryReportCards
              report={report}
              onNavigateUsers={handleNavigateUsers}
              onNavigateListings={handleNavigateListings}
              onNavigateOrders={handleNavigateOrders}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReportsPage;
