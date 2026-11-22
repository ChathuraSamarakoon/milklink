import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  Droplets,
  Milk,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Lock,
  Ban,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShoppingCart,
  User,
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import KpiStatCard from '../components/KpiStatCard';
import { fetchAdminListingById, disableAdminListing } from '../../../services/adminApi';
import type { AdminMilkListing } from '../types';

export const AdminListingDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<AdminMilkListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; variant?: 'success' | 'warning' } | null>(null);

  // Disable modal
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [disableReason, setDisableReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      if (!listingId) return;
      setLoading(true);
      try {
        const found = await fetchAdminListingById(listingId);
        if (found) setListing(found);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [listingId]);

  const handleConfirmDisable = async () => {
    if (!listing) return;
    setIsSubmitting(true);
    try {
      const res = await disableAdminListing(listing.id, disableReason);
      if (res.success && res.listing) {
        setListing(res.listing);
        setIsDisableModalOpen(false);
        setToastMessage({
          text: `Listing #${listing.id} disabled under administrative moderation policy.`,
          variant: res.warning ? 'warning' : 'success',
        });
        setTimeout(() => setToastMessage(null), 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="loading-state-box">
          <p>Loading milk listing details...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="admin-page-container">
        <div className="error-state-box">
          <h2>Listing Not Found</h2>
          <p>The requested milk listing could not be found in the platform registry.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/admin/listings')}
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const isReasonValid = disableReason.trim().length >= 8;
  const percentReserved = Math.round((listing.reservedLitres / listing.totalLitres) * 100);

  return (
    <div className="admin-page-container">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/listings"
        onNavigate={(path: string) => navigate(path)}
      />

      {/* Top Header */}
      <header className="admin-mobile-topbar" aria-label="MilkLink Listing Header">
        <div className="topbar-left">
          <button
            type="button"
            className="topbar-icon-btn"
            onClick={() => setIsSidebarOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>
          <button
            type="button"
            className="topbar-back-btn"
            onClick={() => navigate('/admin/listings')}
            aria-label="Back to All Listings"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="topbar-title-block">
            <h1 className="topbar-title">Listing Detail</h1>
            <span className="topbar-badge">#{listing.id}</span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="admin-avatar-pill">A</div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="admin-main-content">
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

        {/* Breadcrumb Flow: All Listings → Listing Detail */}
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
              onClick={() => navigate('/admin/listings')}
            >
              All Listings
            </span>
            <span className="breadcrumb-sep">/</span>
            <span className="breadcrumb-item active">#{listing.id}</span>
          </div>
        </section>

        {/* Hero Card for Listing */}
        <div className="user-detail-hero-card">
          <div className="hero-top-row">
            <div className="listing-drop-avatar-lg" aria-hidden="true">
              <Milk size={28} />
            </div>
            <div className="hero-info-col">
              <div className="hero-name-row">
                <h2 className="user-hero-name">Milk Listing #{listing.id}</h2>
                <span className={`status-badge status-${listing.status === 'active' ? 'active' : listing.status === 'reserved' ? 'pending' : 'disabled'}`}>
                  {listing.status.toUpperCase()}
                </span>
              </div>
              <p className="hero-farmer-name">
                Farmer:{' '}
                <button
                  type="button"
                  className="link-inline-btn"
                  onClick={() => navigate(`/admin/users/${listing.farmerId}`)}
                  title="View Farmer Account Profile"
                >
                  <User size={13} />
                  <span>{listing.farmerName}</span>
                </button>
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="hero-actions-toolbar">
            <div className="price-tag-badge">
              <span>Unit Price:</span>
              <strong>Rs. {listing.unitPriceLkr} / Litre</strong>
            </div>

            {listing.status !== 'disabled' ? (
              <button
                type="button"
                className="btn-action-deactivate"
                onClick={() => setIsDisableModalOpen(true)}
                title="Disable this listing under administrative policy"
              >
                <Ban size={15} />
                <span>Disable Listing [D]</span>
              </button>
            ) : (
              <span className="disabled-notice-pill">
                <Ban size={14} />
                <span>Listing Disabled by Administrator</span>
              </span>
            )}
          </div>
        </div>

        {/* Stock Volume KPIs */}
        <section className="users-kpi-summary-grid" aria-label="Listing volume breakdown">
          <KpiStatCard
            icon={<Milk size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={`${listing.totalLitres} L`}
            label="Total Quantity"
            sublabel="Offered by smallholder"
          />
          <KpiStatCard
            icon={<Droplets size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={`${listing.availableLitres} L`}
            label="Available Litres"
            sublabel="Unreserved capacity"
          />
          <KpiStatCard
            icon={<Lock size={22} />}
            iconBgColor="#fffbeb"
            iconColor="#b45309"
            value={`${listing.reservedLitres} L`}
            label="Reserved Litres"
            sublabel={`${percentReserved}% locked in orders`}
          />
        </section>

        {/* Stock Reservation Progress & Protection Rule */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Lock size={16} />
            <h3>Stock Reservation Status</h3>
          </div>
          <div className="profile-card-body">
            <div className="detail-field">
              <span className="field-name">Reservation Progress ({percentReserved}%)</span>
              <div className="reserve-progress-bar-lg">
                <div
                  className="reserve-progress-fill"
                  style={{ width: `${percentReserved}%` }}
                />
              </div>
            </div>

            {listing.reservedLitres > 0 ? (
              <div className="reservation-warning-box">
                <ShieldAlert size={18} className="warn-icon" />
                <div className="warn-text">
                  <strong>Active Stock Reservation Notice:</strong>
                  <p>
                    <strong>{listing.reservedLitres} Litres</strong> of this batch are actively reserved by registered buyers.
                    In compliance with platform policy: <em>administrative moderation must never bypass existing stock reservations</em>.
                    Any cancellation must follow mutual buyer-farmer dispute protocols.
                  </p>
                </div>
              </div>
            ) : (
              <div className="compliance-policy-box">
                <ShieldCheck size={16} className="policy-icon" />
                <div className="policy-text">
                  <strong>Open Stock:</strong>
                  <p>This batch has no active reservations and is fully available to nearby buyers via rule-based matching.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Listing Specifications Box */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Clock size={16} />
            <h3>Listing Specifications &amp; Dates</h3>
          </div>
          <div className="profile-card-body">
            <div className="detail-field">
              <span className="field-name">Milking Session</span>
              <span className="field-val font-bold capitalize">
                {listing.milkingSession || 'Morning'} Milking Batch
              </span>
            </div>

            {listing.fatContentPercent && (
              <div className="detail-field">
                <span className="field-name">Fat Content Tested</span>
                <span className="field-val">{listing.fatContentPercent}% Fat (Smallholder Certified)</span>
              </div>
            )}

            <div className="detail-field">
              <span className="field-name">Available From Date &amp; Time</span>
              <span className="field-val">
                <Calendar size={13} className="val-icon" />
                {listing.availableFrom}
              </span>
            </div>

            <div className="detail-field">
              <span className="field-name">Collection Cutoff / Expiry Date</span>
              <span className="field-val text-warning">
                <Clock size={13} className="val-icon" />
                {listing.availableTo}
              </span>
            </div>

            <div className="detail-field">
              <span className="field-name">Protected Division Location</span>
              <span className="field-val">
                <MapPin size={13} className="val-icon" />
                {listing.division}, {listing.district} (Approximate area)
              </span>
            </div>

            {listing.notes && (
              <div className="detail-field full-width">
                <span className="field-name">Farmer Batch Notes</span>
                <p className="admin-notes-content">{listing.notes}</p>
              </div>
            )}

            {listing.disabledReason && (
              <div className="detail-field full-width">
                <span className="field-name text-danger">Moderation Justification Note</span>
                <p className="admin-notes-content text-danger">{listing.disabledReason}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Disable Modal with Policy Check */}
      {isDisableModalOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-icon-badge sev-bg-critical">
                <AlertTriangle size={24} className="text-danger" />
              </div>
              <div>
                <h3 className="modal-title">Disable Milk Listing #{listing.id}</h3>
                <p className="modal-subtitle">
                  Requires approved administrative moderation policy
                </p>
              </div>
            </div>

            <div className="modal-body">
              {listing.reservedLitres > 0 && (
                <div className="reservation-warning-box">
                  <ShieldAlert size={18} className="warn-icon" />
                  <div className="warn-text">
                    <strong>Reservation Protection Constraint:</strong>
                    <p>
                      <strong>{listing.reservedLitres} L</strong> is already committed. Disabling will prevent new buyers
                      from reserving remaining litres, while current orders will proceed as scheduled.
                    </p>
                  </div>
                </div>
              )}

              <div className="audit-reason-field">
                <label htmlFor="detail-disable-reason" className="field-label">
                  Policy Justification Reason (Required min 8 chars):
                </label>
                <textarea
                  id="detail-disable-reason"
                  className="audit-textarea"
                  rows={3}
                  placeholder="State the reason for removing this listing from the public marketplace..."
                  value={disableReason}
                  onChange={(e) => setDisableReason(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setIsDisableModalOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-confirm-btn btn-danger"
                onClick={handleConfirmDisable}
                disabled={isSubmitting || !isReasonValid}
              >
                {isSubmitting ? 'Disabling...' : 'Confirm Disable Listing [D]'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminListingDetailPage;
