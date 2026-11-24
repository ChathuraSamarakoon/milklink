import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Menu,
  ArrowLeft,
  Search,
  Droplets,
  Milk,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Ban,
} from 'lucide-react';
import ListingManagementTable from '../components/ListingManagementTable';
import StatusFilter from '../components/StatusFilter';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import { fetchAdminListings, disableAdminListing } from '../../../services/adminApi';
import type { AdminMilkListing, ListingStatus, TimeRangeFilter } from '../types';

export const AdminListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState<AdminMilkListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('userId') || '');
  const [selectedStatus, setSelectedStatus] = useState<'all' | ListingStatus>('all');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');
  const [toastMessage, setToastMessage] = useState<{ text: string; variant?: 'success' | 'warning' } | null>(null);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminListings();
      setListings(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const handleDisableListing = async (listingId: string, reason: string) => {
    const res = await disableAdminListing(listingId, reason);
    if (res.success && res.listing) {
      setListings((prev) =>
        prev.map((l) => (l.id === listingId ? res.listing! : l))
      );
      setToastMessage({
        text: `Listing #${listingId} has been disabled under approved policy.`,
        variant: res.warning ? 'warning' : 'success',
      });
      setTimeout(() => setToastMessage(null), 5000);
    }
  };

  // Status counts for StatusFilter component
  const statusCounts = useMemo(() => {
    return {
      all: listings.length,
      active: listings.filter((l) => l.status === 'active').length,
      reserved: listings.filter((l) => l.status === 'reserved').length,
      expired: listings.filter((l) => l.status === 'expired').length,
      disabled: listings.filter((l) => l.status === 'disabled').length,
    };
  }, [listings]);

  // Aggregate Metrics
  const totalVolumeLitres = listings.reduce((acc, l) => acc + l.totalLitres, 0);
  const availableVolumeLitres = listings.reduce((acc, l) => acc + l.availableLitres, 0);
  const reservedVolumeLitres = listings.reduce((acc, l) => acc + l.reservedLitres, 0);

  // Filtered listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.division && item.division.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'all' || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [listings, searchTerm, selectedStatus]);

  return (
    <div className="admin-page-container">
      {/* Responsive Sidebar */}

      {/* Top Mobile/App Bar */}

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* Toast Alert */}
        {toastMessage && (
          <div
            className={`admin-toast-banner ${
              toastMessage.variant === 'warning' ? 'banner-warn' : ''
            }`}
            role="status"
          >
            <CheckCircle2 size={18} />
            <span>{toastMessage.text}</span>
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
            <span className="breadcrumb-item active">Milk Listings</span>
          </div>

          <div className="page-title-row">
            <div>
              <h2 className="admin-section-heading">Platform Milk Listings</h2>
              <p className="admin-section-sub">
                Review milk listings across the platform, including active and expired stock.
              </p>
            </div>
          </div>
        </section>

        {/* 4 Summary KPIs using reusable KpiStatCard */}
        <section className="users-kpi-summary-grid" aria-label="Milk listing metrics">
          <KpiStatCard
            icon={<Milk size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={`${totalVolumeLitres.toFixed(1)} L`}
            label="Total Listed Milk"
            sublabel={`${listings.length} batches recorded`}
          />
          <KpiStatCard
            icon={<Droplets size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={`${availableVolumeLitres.toFixed(1)} L`}
            label="Available Milk"
            sublabel="Unreserved capacity"
          />
          <KpiStatCard
            icon={<Lock size={22} />}
            iconBgColor="#fffbeb"
            iconColor="#b45309"
            value={`${reservedVolumeLitres.toFixed(1)} L`}
            label="Reserved Stock"
            sublabel="Locked in buyer orders"
          />
          <KpiStatCard
            icon={<Clock size={22} />}
            iconBgColor="#fdf2f8"
            iconColor="#db2777"
            value={statusCounts.expired}
            label="Expired Listings"
            sublabel="Past collection cutoff"
          />
        </section>

        {/* FilterPanel Component */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={loadListings}
          isRefreshing={loading}
        />

        {/* Policy & Reservation Constraint Banner */}
        <div className="admin-info-banner">
          <ShieldCheck size={20} className="info-banner-icon" />
          <div className="info-text-col">
            <strong>Stock Reservation Protection &amp; Moderation Policy:</strong>
            <p>
              Administrative moderation cannot bypass existing stock reservations. If an active listing
              already holds buyer reservations, disabling the listing prevents new inquiries while protecting
              pending order commitments. Disabling listings requires approved policy.
            </p>
          </div>
        </div>

        {/* Search Bar & StatusFilter Component */}
        <div className="users-table-controls">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="users-search-input"
              placeholder="Search by listing ID, farmer name, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search milk listings"
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

          {/* Reusable StatusFilter */}
          <StatusFilter
            selectedStatus={selectedStatus}
            onStatusChange={(status) => setSelectedStatus(status)}
            counts={statusCounts}
          />
        </div>

        {/* Reusable ListingManagementTable */}
        {loading ? (
          <div className="loading-skeleton-box">
            <div className="skeleton-line shimmer" />
            <div className="skeleton-line shimmer" />
          </div>
        ) : (
          <ListingManagementTable
            listings={filteredListings}
            onViewListing={(listingId) => navigate(`/admin/listings/${listingId}`)}
            onDisableListing={handleDisableListing}
          />
        )}
      </main>
    </div>
  );
};

export default AdminListingsPage;
