import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Menu,
  ArrowLeft,
  Search,
  ShoppingCart,
  Droplets,
  Banknote,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import OrdersManagementTable from '../components/OrdersManagementTable';
import OrderStatusFilter from '../components/OrderStatusFilter';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import { fetchAdminOrders } from '../../../services/adminApi';
import type { AdminOrderRecord, OrderStatus, TimeRangeFilter } from '../types';

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('userId') || searchParams.get('listingId') || '');
  const [selectedStatus, setSelectedStatus] = useState<'all' | OrderStatus>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminOrders();
      setOrders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Status counts for OrderStatusFilter
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === 'pending').length,
      accepted: orders.filter((o) => o.status === 'accepted').length,
      inTransit: orders.filter((o) => o.status === 'in-transit').length,
      completed: orders.filter((o) => o.status === 'completed').length,
      cancelled: orders.filter((o) => o.status === 'cancelled').length,
    };
  }, [orders]);

  // Aggregate Metrics
  const totalVolumeLitres = orders.reduce((acc, o) => acc + o.requestedLitres, 0);
  const totalValueLkr = orders.reduce((acc, o) => acc + o.totalPriceLkr, 0);
  const completedOrdersCount = statusCounts.completed;

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchesSearch =
        ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ord.collectorName && ord.collectorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ord.farmerDistrict.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ord.listingId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || ord.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, selectedStatus]);

  return (
    <div className="admin-page-container">
      {/* Responsive Sidebar */}

      {/* Top Mobile/App Header */}

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Breadcrumb Navigation Flow */}
        <section className="page-header-section">
          <div className="breadcrumbs">
            <span
              className="breadcrumb-item link"
              onClick={() => navigate('/admin')}
            >
              Dashboard
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">Orders</span>
          </div>

          <div className="page-title-row">
            <div>
              <h2 className="admin-section-heading">Platform Milk Orders</h2>
              <p className="admin-section-sub">
                View and filter milk orders across the platform, tracking buyers, farmers, collectors, and cash receipts.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Summary KPIs using reusable KpiStatCard */}
        <section className="users-kpi-summary-grid" aria-label="Order metrics summary">
          <KpiStatCard
            icon={<ShoppingCart size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={orders.length}
            label="Total Orders"
            sublabel={`${statusCounts.accepted + statusCounts.inTransit} in progress`}
          />
          <KpiStatCard
            icon={<Droplets size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={`${totalVolumeLitres.toFixed(1)} L`}
            label="Ordered Volume"
            sublabel="Committed milk litres"
          />
          <KpiStatCard
            icon={<Banknote size={22} />}
            iconBgColor="#f0fdf4"
            iconColor="#16a34a"
            value={`Rs. ${totalValueLkr.toLocaleString()}`}
            label="Order Value"
            sublabel="Cash record tracking"
          />
          <KpiStatCard
            icon={<CheckCircle2 size={22} />}
            iconBgColor="#fdf2f8"
            iconColor="#db2777"
            value={completedOrdersCount}
            label="Completed Orders"
            sublabel="Verified field pickups"
          />
        </section>

        {/* FilterPanel Component */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={loadOrders}
          isRefreshing={loading}
        />

        {/* Informational Policy Banner */}
        <div className="admin-info-banner">
          <ShieldCheck size={20} className="info-banner-icon" />
          <div className="info-text-col">
            <strong>Supervisory Oversight &amp; Cash Record Protocol:</strong>
            <p>
              MilkLink orders are fulfilled directly in the field with cash payment recorded upon collection.
              Administrators maintain supervisory visibility but cannot fabricate order completion, unilateral cancellations,
              or payment overrides.
            </p>
          </div>
        </div>

        {/* Search Bar & OrderStatusFilter */}
        <div className="users-table-controls">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="users-search-input"
              placeholder="Search by order #, buyer, farmer, collector, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search orders"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Reusable OrderStatusFilter */}
          <OrderStatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={(status) => setSelectedStatus(status)}
            counts={statusCounts}
          />
        </div>

        {/* Reusable OrdersManagementTable */}
        {loading ? (
          <div className="loading-skeleton-box">
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line shimmer" />
          </div>
        ) : (
          <OrdersManagementTable
            orders={filteredOrders}
            onOpenOrder={(orderId) => navigate(`/admin/orders/${orderId}`)}
          />
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;
