import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Users,
  Trees,
  Truck,
  Settings,
  ShieldCheck,
  Milk,
  Clock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  FileBarChart,
  LayoutDashboard,
  ExternalLink,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminKpiCards from '../components/AdminKpiCards';
import AttentionPanel from '../components/AttentionPanel';
import FilterPanel from '../components/FilterPanel';
import { fetchAdminDashboardData } from '../../../services/adminApi';
import type { AdminDashboardData, TimeRangeFilter } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeBottomTab, setActiveBottomTab] = useState<'dashboard' | 'users' | 'collections' | 'reports'>('dashboard');

  const loadData = async (filter: TimeRangeFilter) => {
    setLoading(true);
    try {
      const result = await fetchAdminDashboardData(filter);
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(timeRange);
  }, [timeRange]);

  const handleBottomTabClick = (tab: 'dashboard' | 'users' | 'collections' | 'reports') => {
    setActiveBottomTab(tab);
    if (tab === 'dashboard') navigate('/admin');
    if (tab === 'users') navigate('/admin/users');
    if (tab === 'collections') navigate('/admin/orders');
    if (tab === 'reports') navigate('/admin/reports');
  };

  return (
    <div className="admin-page-container">
      {/* Responsive Drawer & Desktop Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin"
        onNavigate={(path: string) => navigate(path)}
      />

      {/* Top Mobile/PWA App Bar matching the mockup */}
      <header className="admin-mobile-topbar" aria-label="MilkLink Administrator Header">
        <div className="topbar-left">
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Toggle navigation menu"
          >
            <Menu size={22} />
          </button>

          {/* Brand Mark with droplet matching image */}
          <div className="milklink-brand-container" onClick={() => navigate('/admin')}>
            <svg className="brand-drop-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
                fill="#2563eb"
                stroke="#1d4ed8"
                strokeWidth="1.5"
              />
            </svg>
            <span className="brand-wordmark">MilkLink</span>
          </div>
        </div>

        <div className="topbar-right">
          <button
            type="button"
            className="notification-bell-btn"
            onClick={() => navigate('/admin/sync')}
            aria-label="Notifications (2 alerts)"
          >
            <Bell size={21} />
            <span className="bell-badge-dot" />
          </button>

          <div
            className="admin-avatar-pill"
            onClick={() => setIsSidebarOpen(true)}
            title="Administrator Profile"
            role="button"
            tabIndex={0}
          >
            A
          </div>
        </div>
      </header>

      {/* Main Dashboard Scrollable Area */}
      <main className="admin-main-content">
        {/* 1. Hero Navy Banner Card - Matching Image 4 */}
        <section className="admin-hero-banner" aria-labelledby="dashboard-title">
          <div className="hero-text-col">
            <h1 id="dashboard-title" className="hero-title">Admin Dashboard</h1>
            <p className="hero-subtitle">System Overview</p>
          </div>

          {/* Ascending analytics bar graphic on right of hero banner */}
          <div className="hero-bars-graphic" aria-hidden="true">
            <div className="hero-bar h-bar-1" />
            <div className="hero-bar h-bar-2" />
            <div className="hero-bar h-bar-3" />
            <div className="hero-bar h-bar-4" />
            <div className="hero-bar h-bar-5" />
          </div>
        </section>

        {/* Filter Panel (Timeframe selection & refresh) */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={() => loadData(timeRange)}
          isRefreshing={loading}
        />

        {/* 2. Reusable AdminKpiCards (Role counts 2x2 + Milk Collection metric card) */}
        {data ? (
          <AdminKpiCards
            roleCounts={data.roleCounts}
            collectionMetric={data.collectionMetric}
            onNavigate={(route) => navigate(route)}
          />
        ) : (
          <div className="kpi-loading-skeleton">Loading metrics...</div>
        )}

        {/* 3. Quick Actions Section (2x2 Grid from mockup) */}
        <section className="quick-actions-section" aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title" className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button
              type="button"
              className="action-card action-card-users"
              onClick={() => navigate('/admin/users')}
            >
              <div className="action-icon-circle bg-blue">
                <Users size={22} className="text-blue" />
              </div>
              <span className="action-title">Manage Users</span>
            </button>

            <button
              type="button"
              className="action-card action-card-farmers"
              onClick={() => navigate('/admin/listings')}
            >
              <div className="action-icon-circle bg-green">
                <Trees size={22} className="text-green" />
              </div>
              <span className="action-title">Manage Farmers</span>
            </button>

            <button
              type="button"
              className="action-card action-card-routes"
              onClick={() => navigate('/admin/orders')}
            >
              <div className="action-icon-circle bg-sky">
                <Truck size={22} className="text-sky" />
              </div>
              <span className="action-title">Collection Routes</span>
            </button>

            <button
              type="button"
              className="action-card action-card-settings"
              onClick={() => navigate('/admin/sync')}
            >
              <div className="action-icon-circle bg-slate">
                <Settings size={22} className="text-slate" />
              </div>
              <span className="action-title">System Settings</span>
            </button>
          </div>
        </section>

        {/* 4. Active vs Expired Milk Listings Summary */}
        {data && (
          <section className="listings-overview-card" aria-labelledby="listings-summary-heading">
            <div className="card-top-header">
              <div className="title-with-icon">
                <Milk size={18} className="text-primary" />
                <h2 id="listings-summary-heading" className="card-title">Milk Listings Summary</h2>
              </div>
              <button
                type="button"
                className="card-text-link"
                onClick={() => navigate('/admin/listings')}
              >
                <span>View All</span>
                <ExternalLink size={13} />
              </button>
            </div>

            <div className="listings-metrics-row">
              <div className="listing-stat-pill">
                <span className="stat-pill-label">Active Listings</span>
                <span className="stat-pill-val val-green">{data.listingStats.activeCount}</span>
              </div>
              <div className="listing-stat-pill">
                <span className="stat-pill-label">Litres Available</span>
                <span className="stat-pill-val val-blue">{data.listingStats.totalLitresAvailable} L</span>
              </div>
              <div className="listing-stat-pill">
                <span className="stat-pill-label">Expired / Inactive</span>
                <span className="stat-pill-val val-amber">{data.listingStats.expiredCount}</span>
              </div>
              <div className="listing-stat-pill">
                <span className="stat-pill-label">Avg Price</span>
                <span className="stat-pill-val">Rs. {data.listingStats.avgUnitPriceLkr} / L</span>
              </div>
            </div>
          </section>
        )}

        {/* 5. Orders by Status Distribution */}
        {data && (
          <section className="orders-status-card" aria-labelledby="orders-status-heading">
            <div className="card-top-header">
              <div className="title-with-icon">
                <Clock size={18} className="text-blue" />
                <h2 id="orders-status-heading" className="card-title">Orders by Status</h2>
              </div>
              <button
                type="button"
                className="card-text-link"
                onClick={() => navigate('/admin/orders')}
              >
                <span>Manage Orders</span>
                <ExternalLink size={13} />
              </button>
            </div>

            {/* Distribution Visual Bar */}
            <div className="order-distribution-bar" aria-label="Order distribution visual bar">
              <div className="dist-segment seg-completed" style={{ flex: data.orderStats.completed }} title={`Completed: ${data.orderStats.completed}`} />
              <div className="dist-segment seg-accepted" style={{ flex: data.orderStats.accepted }} title={`Accepted: ${data.orderStats.accepted}`} />
              <div className="dist-segment seg-intransit" style={{ flex: data.orderStats.inTransit }} title={`In Transit: ${data.orderStats.inTransit}`} />
              <div className="dist-segment seg-reserved" style={{ flex: data.orderStats.reserved }} title={`Reserved: ${data.orderStats.reserved}`} />
              <div className="dist-segment seg-pending" style={{ flex: data.orderStats.pending }} title={`Pending: ${data.orderStats.pending}`} />
            </div>

            {/* Legend pills */}
            <div className="order-status-pills-grid">
              <div className="order-status-pill">
                <span className="status-dot dot-pending" />
                <span className="status-label">Pending</span>
                <strong>{data.orderStats.pending}</strong>
              </div>
              <div className="order-status-pill">
                <span className="status-dot dot-reserved" />
                <span className="status-label">Reserved</span>
                <strong>{data.orderStats.reserved}</strong>
              </div>
              <div className="order-status-pill">
                <span className="status-dot dot-accepted" />
                <span className="status-label">Accepted</span>
                <strong>{data.orderStats.accepted}</strong>
              </div>
              <div className="order-status-pill">
                <span className="status-dot dot-intransit" />
                <span className="status-label">In-Transit</span>
                <strong>{data.orderStats.inTransit}</strong>
              </div>
              <div className="order-status-pill">
                <span className="status-dot dot-completed" />
                <span className="status-label">Completed</span>
                <strong>{data.orderStats.completed}</strong>
              </div>
            </div>
          </section>
        )}

        {/* 6. Activity & Attention Required Panel (Reusable AttentionPanel) */}
        {data && (
          <AttentionPanel
            items={data.attentionItems}
            onActionClick={(route) => navigate(route)}
          />
        )}

        {/* 7. Privacy & Regional Summary (Safe approximate exposure, no raw GPS) */}
        {data && (
          <section className="regional-privacy-section" aria-labelledby="privacy-heading">
            <div className="privacy-card-banner">
              <div className="privacy-icon-box">
                <ShieldCheck size={20} />
              </div>
              <div className="privacy-text-col">
                <h3 id="privacy-heading" className="privacy-title">Informational Dashboard &amp; Privacy Safeguards</h3>
                <p className="privacy-body">
                  To protect dairy smallholders, exact farm locations and homestead coordinates are never exposed
                  on general admin overviews. Only aggregated district and hub totals are displayed. Unapproved admin
                  business actions that circumvent collector receipts or outbox logs are strictly prohibited.
                </p>
              </div>
            </div>

            <div className="regional-hubs-grid">
              {data.regionalSummary.map((hub) => (
                <div key={hub.region} className="regional-hub-card">
                  <div className="hub-name">{hub.region}</div>
                  <div className="hub-stats">
                    <span>{hub.farmerCount} Registered Smallholders</span>
                    <strong>{hub.activeLitres} L Active</strong>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fixed Bottom Navigation matching Screen 4 in mockup */}
      <nav className="admin-bottom-nav" aria-label="Administrator bottom tabs">
        <button
          type="button"
          className={`bottom-nav-tab ${activeBottomTab === 'dashboard' ? 'tab-active' : ''}`}
          onClick={() => handleBottomTabClick('dashboard')}
          aria-current={activeBottomTab === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard size={20} />
          <span className="tab-label">Dashboard</span>
        </button>

        <button
          type="button"
          className={`bottom-nav-tab ${activeBottomTab === 'users' ? 'tab-active' : ''}`}
          onClick={() => handleBottomTabClick('users')}
          aria-current={activeBottomTab === 'users' ? 'page' : undefined}
        >
          <Users size={20} />
          <span className="tab-label">Users</span>
        </button>

        <button
          type="button"
          className={`bottom-nav-tab ${activeBottomTab === 'collections' ? 'tab-active' : ''}`}
          onClick={() => handleBottomTabClick('collections')}
          aria-current={activeBottomTab === 'collections' ? 'page' : undefined}
        >
          <Truck size={20} />
          <span className="tab-label">Collections</span>
        </button>

        <button
          type="button"
          className={`bottom-nav-tab ${activeBottomTab === 'reports' ? 'tab-active' : ''}`}
          onClick={() => handleBottomTabClick('reports')}
          aria-current={activeBottomTab === 'reports' ? 'page' : undefined}
        >
          <FileBarChart size={20} />
          <span className="tab-label">Reports</span>
        </button>
      </nav>
    </div>
  );
};

export default AdminDashboardPage;
