import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  ShoppingCart,
  Trees,
  Truck,
  Droplets,
  Banknote,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ExternalLink,
  MapPin,
  Phone,
  Milk,
  RotateCcw,
} from 'lucide-react';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import OrderLifecycleInspector from '../components/OrderLifecycleInspector';
import CashRecordPanel from '../components/CashRecordPanel';
import { fetchAdminOrderById } from '../../../services/adminApi';
import type { AdminOrderRecord, TimeRangeFilter } from '../types';

export const AdminOrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<AdminOrderRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');

  const loadOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const found = await fetchAdminOrderById(orderId);
      if (found) setOrder(found);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="loading-state-box">
          <p>Loading milk order lifecycle and cash handover data...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-page-container">
        <div className="error-state-box">
          <h2>Order Not Found</h2>
          <p>The requested order ID does not exist in the platform registry.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/orders')}
          >
            Back to Orders List
          </button>
        </div>
      </div>
    );
  }

  const hasVariance =
    order.actualLitres !== undefined && order.actualLitres !== order.requestedLitres;

  return (
    <div className="admin-page-container">
      {/* Admin Sidebar */}

      {/* Top Header */}

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Breadcrumb Flow: Admin Order Detail → Order list */}
        <section className="page-header-section">
          <div className="breadcrumbs">
            <span
              className="breadcrumb-item link"
              onClick={() => navigate('/admin')}
            >
              Dashboard
            </span>
            <span className="breadcrumb-sep">/</span>
            <span
              className="breadcrumb-item link"
              onClick={() => navigate('/admin/orders')}
            >
              Orders
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">#{order.id}</span>
          </div>
        </section>

        {/* 1. Order Hero Overview Card */}
        <div className="user-detail-hero-card">
          <div className="hero-top-row">
            <div className="order-drop-avatar-lg" aria-hidden="true">
              <ShoppingCart size={28} />
            </div>
            <div className="hero-info-col">
              <div className="hero-name-row">
                <h2 className="user-hero-name">Milk Order #{order.id}</h2>
                <span className={`status-badge status-${order.status === 'completed' || order.status === 'accepted' ? 'active' : order.status === 'pending' ? 'pending' : 'disabled'}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>
              <p className="hero-farmer-name">
                Source Milk Batch:{' '}
                <button
                  type="button"
                  className="link-inline-btn"
                  onClick={() => navigate(`/admin/listings/${order.listingId}`)}
                  title="View Source Listing"
                >
                  <Milk size={13} />
                  <span>Listing #{order.listingId}</span>
                  <ExternalLink size={12} />
                </button>
              </p>
            </div>
          </div>

          <div className="hero-actions-toolbar">
            <div className="price-tag-badge">
              <span>Collection Date:</span>
              <strong>{order.collectionDate}</strong>
            </div>

            <div className="order-payment-status-tag">
              <Banknote size={14} />
              <span>Cash Record: {order.paymentRecord.status.toUpperCase()}</span>
            </div>

            {/* Flow to Sync issues if conflict is present */}
            {order.syncConflict && (
              <button
                type="button"
                className="btn-sync-conflict-jump"
                onClick={() => navigate('/admin/sync')}
                title="Review offline sync conflict"
              >
                <AlertTriangle size={13} />
                <span>Sync Conflict Exists</span>
                <RotateCcw size={12} />
              </button>
            )}
          </div>
        </div>

        {/* 2. Read-Only Default Governance Notice (Do not invent an override permission) */}
        <div className="admin-governance-card">
          <ShieldAlert size={20} className="gov-icon" />
          <div className="gov-text">
            <strong>Read-Only Inspection Notice (A17–A18, A20–A21):</strong>
            <p>
              In accordance with MilkLink architecture, <em>order completion and payment ownership are field-driven responsibilities</em>.
              This interface is read-only by default. Administrators <strong>do not have override permissions</strong> to cancel orders,
              fake completion, or manipulate cash records without parties' mutual consensus and digital outbox records.
            </p>
          </div>
        </div>

        {/* 3. Summary KPIs using reusable KpiStatCard */}
        <section className="users-kpi-summary-grid" aria-label="Order volume and value">
          <KpiStatCard
            icon={<Droplets size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={`${order.requestedLitres} L`}
            label="Requested Milk"
            sublabel="Volume booked by buyer"
          />
          <KpiStatCard
            icon={<Milk size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={order.actualLitres !== undefined ? `${order.actualLitres} L` : 'Pending Field Weighing'}
            label="Actual Collected Litres"
            sublabel={hasVariance ? 'Variance recorded' : 'Dipstick verified'}
          />
          <KpiStatCard
            icon={<Banknote size={22} />}
            iconBgColor="#f0fdf4"
            iconColor="#16a34a"
            value={`Rs. ${(order.recalculatedTotalPriceLkr || order.totalPriceLkr).toLocaleString()}`}
            label="Settled Cash Amount"
            sublabel={`@ Rs. ${order.unitPriceLkr} / L`}
          />
        </section>

        {/* FilterPanel Component */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={loadOrder}
          isRefreshing={loading}
        />

        {/* 4. Participating Parties Grid (Buyer • Farmer • Collector) */}
        <div className="parties-overview-grid">
          {/* Buyer Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <ShoppingCart size={16} className="text-blue" />
              <h3>Buyer (Customer)</h3>
            </div>
            <div className="profile-card-body">
              <div className="detail-field">
                <span className="field-name">Account Name</span>
                <button
                  type="button"
                  className="user-name-link font-bold"
                  onClick={() => navigate(`/admin/users/${order.buyerId}`)}
                  title="View Buyer Account"
                >
                  {order.buyerName}
                  <ExternalLink size={12} className="ml-1" />
                </button>
              </div>
              <div className="detail-field">
                <span className="field-name">Phone Number</span>
                <span className="field-val">
                  <Phone size={12} />
                  {order.buyerPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Farmer Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <Trees size={16} className="text-green" />
              <h3>Farmer (Producer)</h3>
            </div>
            <div className="profile-card-body">
              <div className="detail-field">
                <span className="field-name">Smallholder Name</span>
                <button
                  type="button"
                  className="user-name-link font-bold"
                  onClick={() => navigate(`/admin/users/${order.farmerId}`)}
                  title="View Farmer Account"
                >
                  {order.farmerName}
                  <ExternalLink size={12} className="ml-1" />
                </button>
              </div>
              <div className="detail-field">
                <span className="field-name">Protected Division Location</span>
                <span className="field-val">
                  <MapPin size={12} />
                  {order.farmerDivision}, {order.farmerDistrict}
                </span>
              </div>
              <div className="detail-field">
                <span className="field-name">Phone Number</span>
                <span className="field-val">
                  <Phone size={12} />
                  {order.farmerPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Collector Card */}
          <div className="profile-card">
            <div className="profile-card-header">
              <Truck size={16} className="text-sky" />
              <h3>Collector (Logistics)</h3>
            </div>
            <div className="profile-card-body">
              {order.collectorName ? (
                <>
                  <div className="detail-field">
                    <span className="field-name">Assigned Collector</span>
                    <button
                      type="button"
                      className="user-name-link font-bold"
                      onClick={() =>
                        order.collectorId && navigate(`/admin/users/${order.collectorId}`)
                      }
                      title="View Collector Profile"
                    >
                      {order.collectorName}
                      <ExternalLink size={12} className="ml-1" />
                    </button>
                  </div>
                  {order.collectorPhone && (
                    <div className="detail-field">
                      <span className="field-name">Contact Number</span>
                      <span className="field-val">
                        <Phone size={12} />
                        {order.collectorPhone}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="unassigned-collector-alert">
                  <AlertTriangle size={16} />
                  <span>Awaiting registered collector assignment for this route</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Reusable CashRecordPanel (Order vs Collected Litres & Cash Handover Receipt) */}
        <CashRecordPanel order={order} />

        {/* 6. Reusable OrderLifecycleInspector (Lifecycle Steps & Sync Conflict Alerts) */}
        <OrderLifecycleInspector
          steps={order.lifecycleSteps || []}
          syncConflict={order.syncConflict}
          onNavigateToSync={() => navigate('/admin/sync')}
        />
      </main>
    </div>
  );
};

export default AdminOrderDetailPage;
