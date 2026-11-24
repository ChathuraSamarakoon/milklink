import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  Droplets,
  ShoppingCart,
  Star,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import UserDetailPanel from '../components/UserDetailPanel';
import UserStatusConfirmDialog from '../components/UserStatusConfirmDialog';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import { fetchAdminUserById, updateUserAccountStatus } from '../../../services/adminApi';
import type { AdminUser, UserStatus, TimeRangeFilter } from '../types';

export const AdminUserDetailPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Status Change Confirmation Dialog State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    targetStatus: UserStatus;
    reason: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    targetStatus: 'active',
    reason: '',
    isSubmitting: false,
  });

  const loadUserData = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const found = await fetchAdminUserById(userId);
      if (found) {
        setUser(found);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const handleOpenStatusDialog = (targetStatus: UserStatus) => {
    setConfirmModal({
      isOpen: true,
      targetStatus,
      reason: '',
      isSubmitting: false,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!user) return;
    setConfirmModal((prev) => ({ ...prev, isSubmitting: true }));
    try {
      const res = await updateUserAccountStatus(
        user.id,
        confirmModal.targetStatus,
        confirmModal.reason
      );
      if (res.success && res.user) {
        setUser(res.user);
        setConfirmModal((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
        setToastMessage(
          `Account status updated to ${confirmModal.targetStatus.toUpperCase()}. Audit entry successfully filed.`
        );
        setTimeout(() => setToastMessage(null), 4000);
      }
    } finally {
      setConfirmModal((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="loading-state-box">
          <p>Loading user profile &amp; activity history...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="admin-page-container">
        <div className="error-state-box">
          <h2>User Account Not Found</h2>
          <p>The requested account ID does not exist in the platform registry.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/users')}
          >
            Back to Users List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Responsive Admin Sidebar */}

      {/* Top Mobile/App Header */}

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="admin-toast-banner" role="status">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

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
            <span
              className="breadcrumb-item link"
              onClick={() => navigate('/admin/users')}
            >
              Users
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">{user.name}</span>
          </div>
        </section>

        {/* User-Level KPI Summary using reusable KpiStatCard */}
        <section className="users-kpi-summary-grid" aria-label="User metrics">
          <KpiStatCard
            icon={<Droplets size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={
              user.metrics?.totalLitres !== undefined
                ? `${user.metrics.totalLitres.toLocaleString()} L`
                : '0 L'
            }
            label={user.role === 'farmer' ? 'Milk Listed' : 'Milk Volume'}
            sublabel="Recorded platform volume"
          />

          <KpiStatCard
            icon={<ShoppingCart size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={user.metrics?.completedOrders || 0}
            label="Completed Orders"
            sublabel="Fulfilled transactions"
          />

          <KpiStatCard
            icon={<Star size={22} />}
            iconBgColor="#fffbeb"
            iconColor="#b45309"
            value={user.metrics?.rating ? `${user.metrics.rating} / 5.0` : 'N/A'}
            label="Reliability Score"
            sublabel="Cooperative feedback"
          />

          <KpiStatCard
            icon={<Percent size={22} />}
            iconBgColor="#fdf2f8"
            iconColor="#db2777"
            value={
              user.metrics?.fulfilmentRate !== undefined
                ? `${user.metrics.fulfilmentRate}%`
                : '100%'
            }
            label="Fulfilment Rate"
            sublabel="On-time delivery / pickup"
          />
        </section>

        {/* Timeframe Filter for User Activity History */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={loadUserData}
          isRefreshing={loading}
        />

        {/* Reusable UserDetailPanel (Account info, Associated listings/orders, Activity Review, Manage Account [D]) */}
        <UserDetailPanel
          user={user}
          onManageAccount={handleOpenStatusDialog}
          onNavigateToListings={(uId) => navigate(`/admin/listings?userId=${uId}`)}
          onNavigateToOrders={(uId) => navigate(`/admin/orders?userId=${uId}`)}
          onSelectListing={(_listingId) => navigate('/admin/listings')}
          onSelectOrder={(_orderId) => navigate('/admin/orders')}
        />
      </main>

      {/* Reusable UserStatusConfirmDialog for Policy-Governed Status Changes */}
      <UserStatusConfirmDialog
        isOpen={confirmModal.isOpen}
        user={user}
        targetStatus={confirmModal.targetStatus}
        reason={confirmModal.reason}
        onReasonChange={(val) =>
          setConfirmModal((prev) => ({ ...prev, reason: val }))
        }
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        isSubmitting={confirmModal.isSubmitting}
      />
    </div>
  );
};

export default AdminUserDetailPage;
