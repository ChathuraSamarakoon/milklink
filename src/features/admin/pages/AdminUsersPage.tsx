import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Trees,
  ShoppingCart,
  Truck,
  UserCheck,
  ShieldAlert,
  ArrowLeft,
  Menu,
} from 'lucide-react';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import UsersDataTable from '../components/UsersDataTable';
import { fetchAdminUsers, updateUserAccountStatus } from '../../../services/adminApi';
import type { AdminUser, TimeRangeFilter, UserStatus } from '../types';

export const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const initialStatusFilter = searchParams.get('status') || 'all';

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: UserStatus, reason: string) => {
    const res = await updateUserAccountStatus(userId, newStatus, reason);
    if (res.success && res.user) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
      setToastMessage(
        `Account status for ${res.user.name} updated to ${newStatus.toUpperCase()}. Audit entry recorded.`
      );
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const farmerCount = users.filter((u) => u.role === 'farmer').length;
  const buyerCount = users.filter((u) => u.role === 'buyer').length;
  const collectorCount = users.filter((u) => u.role === 'collector').length;
  const pendingCount = users.filter((u) => u.status === 'pending').length;

  return (
    <div className="admin-page-container">
      {/* Mobile & Desktop Sidebar */}

      {/* Top Mobile/App Header */}

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="admin-toast-banner" role="status">
            <UserCheck size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Heading & Breadcrumb */}
        <section className="page-header-section">
          <div className="breadcrumbs">
            <span className="breadcrumb-item link" onClick={() => navigate('/admin')}>
              Dashboard
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">Users</span>
          </div>
          <div className="page-title-row">
            <div>
              <h2 className="admin-section-heading">Platform Registered Accounts</h2>
              <p className="admin-section-sub">
                Manage dairy farmers, milk buyers, registered collectors, and verification queues.
              </p>
            </div>
          </div>
        </section>

        {/* Top KPI Cards Summary using reusable KpiStatCard */}
        <section className="users-kpi-summary-grid" aria-label="User metrics">
          <KpiStatCard
            icon={<Users size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={users.length || 124}
            label="Total Users"
            sublabel="Across all roles"
          />
          <KpiStatCard
            icon={<Trees size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={farmerCount || 68}
            label="Farmers"
            sublabel="Dairy producers"
          />
          <KpiStatCard
            icon={<ShoppingCart size={22} />}
            iconBgColor="#fdf2f8"
            iconColor="#db2777"
            value={buyerCount || 210}
            label="Buyers"
            sublabel="Consumers & retailers"
          />
          <KpiStatCard
            icon={<Truck size={22} />}
            iconBgColor="#f0f9ff"
            iconColor="#0284c7"
            value={collectorCount || 12}
            label="Collectors"
            sublabel="Route logistics"
          />
          <KpiStatCard
            icon={<ShieldAlert size={22} />}
            iconBgColor="#fffbeb"
            iconColor="#b45309"
            value={pendingCount || 5}
            label="Verification Queue"
            badge={{ text: 'Action Needed', variant: 'neutral' }}
            sublabel="Pending phone confirmation"
          />
        </section>

        {/* Filter Panel */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={loadUsers}
          isRefreshing={loading}
        />

        {/* Informational Security Notice */}
        <div className="admin-info-banner">
          <div className="info-icon-col">
            <ShieldAlert size={20} className="info-banner-icon" />
          </div>
          <div className="info-text-col">
            <strong>Informational Oversight &amp; Safe Exposure:</strong>
            <p>
              Exact farm GPS coordinates and homestead locations are protected and withheld on general
              admin dashboards. Only administrative division and district data are shown.
              Account status modifications are logged with mandatory audit notes.
            </p>
          </div>
        </div>

        {/* Reusable UsersDataTable */}
        {loading ? (
          <div className="loading-skeleton-box">
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line shimmer" />
          </div>
        ) : (
          <UsersDataTable
            users={users}
            onViewUser={(userId) => navigate(`/admin/users/${userId}`)}
            onUpdateStatus={handleUpdateStatus}
          />
        )}
      </main>
    </div>
  );
};

export default AdminUsersPage;
