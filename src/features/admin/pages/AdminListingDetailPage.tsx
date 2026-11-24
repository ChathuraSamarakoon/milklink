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
  FileSearch,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import ListingAuditPanel from '../components/ListingAuditPanel';
import ModerationDialog from '../components/ModerationDialog';
import {
  fetchAdminListingById,
  disableAdminListing,
  addListingInvestigationNote,
} from '../../../services/adminApi';
import type { AdminMilkListing, TimeRangeFilter } from '../types';

export const AdminListingDetailPage: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();

  const [listing, setListing] = useState<AdminMilkListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('month');
  const [toastMessage, setToastMessage] = useState<{ text: string; variant?: 'success' | 'warning' } | null>(null);

  // Moderation Dialog State (supports 'disable' or 'investigate' modes)
  const [dialogState, setDialogState] = useState<{
    isOpen: boolean;
    mode: 'disable' | 'investigate';
    noteText: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    mode: 'disable',
    noteText: '',
    isSubmitting: false,
  });

  const loadListing = async () => {
    if (!listingId) return;
    setLoading(true);
    try {
      const found = await fetchAdminListingById(listingId);
      if (found) setListing(found);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListing();
  }, [listingId]);

  const handleOpenModeration = (mode: 'disable' | 'investigate') => {
    setDialogState({
      isOpen: true,
      mode,
      noteText: '',
      isSubmitting: false,
    });
  };

  const handleConfirmModeration = async () => {
    if (!listing) return;
    setDialogState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      if (dialogState.mode === 'disable') {
        const res = await disableAdminListing(listing.id, dialogState.noteText);
        if (res.success && res.listing) {
          setListing(res.listing);
          setDialogState((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
          setToastMessage({
            text: `Listing #${listing.id} disabled under administrative moderation policy.`,
            variant: res.warning ? 'warning' : 'success',
          });
          setTimeout(() => setToastMessage(null), 5000);
        }
      } else {
        const res = await addListingInvestigationNote(listing.id, dialogState.noteText);
        if (res.success && res.listing) {
          setListing(res.listing);
          setDialogState((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
          setToastMessage({
            text: `Investigation finding recorded in batch audit trail.`,
            variant: 'success',
          });
          setTimeout(() => setToastMessage(null), 4000);
        }
      }
    } finally {
      setDialogState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  if (loading) {
    return (
      <div className="admin-page-container">
        <div className="loading-state-box">
          <p>Loading milk listing details &amp; reservation records...</p>
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
            Back to All Listings
          </button>
        </div>
      </div>
    );
  }

  const percentReserved = Math.round((listing.reservedLitres / listing.totalLitres) * 100);

  return (
    <div className="admin-page-container">
      {/* Admin Sidebar Navigation */}

      {/* Top Header */}

      {/* Main Scrollable Area */}
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

        {/* Breadcrumb Navigation Flow: Listing Detail → Listing list */}
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

        {/* 1. Hero Listing Overview Card */}
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

              {/* Flow: Listing Detail → Farmer */}
              <div className="hero-farmer-name">
                <span>Farmer:</span>
                <button
                  type="button"
                  className="link-inline-btn"
                  onClick={() => navigate(`/admin/users/${listing.farmerId}`)}
                  title="Navigate to Farmer Account Profile"
                >
                  <User size={13} />
                  <span>{listing.farmerName}</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* Action Row: Investigate & Disable Controls [D] */}
          <div className="hero-actions-toolbar">
            <div className="price-tag-badge">
              <span>Price:</span>
              <strong>Rs. {listing.unitPriceLkr} / L</strong>
            </div>

            <div className="moderation-btn-group">
              <button
                type="button"
                className="btn-toolbar-tab"
                onClick={() => handleOpenModeration('investigate')}
                title="Investigate batch quality and add findings"
              >
                <FileSearch size={14} />
                <span>Investigate</span>
              </button>

              {listing.status !== 'disabled' ? (
                <button
                  type="button"
                  className="btn-action-deactivate"
                  onClick={() => handleOpenModeration('disable')}
                  title="Disable listing under approved policy"
                >
                  <Ban size={14} />
                  <span>Disable [D]</span>
                </button>
              ) : (
                <span className="disabled-notice-pill">
                  <Ban size={13} />
                  <span>Disabled by Admin</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Privacy-Aware Location Notice */}
        <div className="admin-privacy-callout">
          <ShieldAlert size={18} className="privacy-shield-icon" />
          <div className="privacy-callout-text">
            <strong>Privacy-Aware Location Safeguard:</strong>
            <p>
              In accordance with MilkLink smallholder privacy safeguards, exact farmstead coordinates
              are masked from platform administration screens. The listing displays the administrative division (
              <em>{listing.division}, {listing.district}</em>) only.
            </p>
          </div>
        </div>

        {/* 3. Stock Volume Breakdown KPIs using KpiStatCard */}
        <section className="users-kpi-summary-grid" aria-label="Stock volume breakdown">
          <KpiStatCard
            icon={<Milk size={22} />}
            iconBgColor="#eff6ff"
            iconColor="#2563eb"
            value={`${listing.totalLitres} L`}
            label="Total Batch Volume"
            sublabel="Offered by smallholder"
          />
          <KpiStatCard
            icon={<Droplets size={22} />}
            iconBgColor="#ecfdf5"
            iconColor="#10b981"
            value={`${listing.availableLitres} L`}
            label="Available Litres"
            sublabel="Open for reservations"
          />
          <KpiStatCard
            icon={<Lock size={22} />}
            iconBgColor="#fffbeb"
            iconColor="#b45309"
            value={`${listing.reservedLitres} L`}
            label="Reserved Stock"
            sublabel={`${percentReserved}% locked in orders`}
          />
        </section>

        {/* Timeframe Filter Panel */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={loadListing}
          isRefreshing={loading}
        />

        {/* 4. Reservation Summary & Policy Rule Box */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Lock size={16} />
            <h3>Reservation Summary &amp; Protection Rule</h3>
          </div>
          <div className="profile-card-body">
            <div className="detail-field">
              <span className="field-name">Reserved Capacity ({percentReserved}%)</span>
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
                  <strong>Stock Reservation Constraint:</strong>
                  <p>
                    <strong>{listing.reservedLitres} Litres</strong> of this batch are actively locked in buyer orders.
                    Administrative moderation cannot bypass existing buyer reservations. Disabling this listing
                    only prevents <em>new</em> reservations from being created; existing orders proceed normally.
                  </p>
                </div>
              </div>
            ) : (
              <div className="compliance-policy-box">
                <ShieldCheck size={16} className="policy-icon" />
                <div className="policy-text">
                  <strong>Open Capacity:</strong>
                  <p>
                    No buyer reservations currently locked. Editing and disabling rights remain optional policy-driven controls.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Flow: Listing Detail → Related Orders */}
        <div className="associated-section">
          <div className="associated-header-row">
            <div className="title-with-badge">
              <ShoppingCart size={18} className="text-blue" />
              <h3 className="associated-title">Related Buyer Orders</h3>
              <span className="count-pill">{listing.relatedOrders?.length || 0}</span>
            </div>
            <button
              type="button"
              className="card-text-link"
              onClick={() => navigate(`/admin/orders?listingId=${listing.id}`)}
              title="Navigate to Orders module"
            >
              <span>View in Orders Module</span>
              <ExternalLink size={13} />
            </button>
          </div>

          {(!listing.relatedOrders || listing.relatedOrders.length === 0) ? (
            <div className="associated-empty-box">
              <p>No buyer orders placed against this listing yet.</p>
            </div>
          ) : (
            <div className="associated-cards-list">
              {listing.relatedOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="associated-item-card"
                  onClick={() => navigate('/admin/orders')}
                >
                  <div className="item-card-left">
                    <div className="item-id-row">
                      <span className="item-id">Order #{ord.id}</span>
                      <span className={`status-badge status-${ord.status === 'accepted' ? 'active' : 'pending'}`}>
                        {ord.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="item-sub-row">
                      <span>Buyer: <strong>{ord.buyerName}</strong></span>
                      <span>{ord.buyerPhone}</span>
                    </div>
                    {ord.collectorName && (
                      <span className="item-collector-sub">
                        Collector: {ord.collectorName}
                      </span>
                    )}
                    <span className="item-date-text">{ord.orderDate}</span>
                  </div>

                  <div className="item-card-right">
                    <span className="item-quantity-val">{ord.requestedLitres} L</span>
                    <span className="item-price-val">Rs. {ord.totalPriceLkr.toLocaleString()}</span>
                    <span className="click-inspect-sub">
                      <span>Inspect</span>
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Listing Specifications & Privacy Location */}
        <div className="profile-card">
          <div className="profile-card-header">
            <Clock size={16} />
            <h3>Batch Quality Specifications</h3>
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
              <span className="field-name">Available From</span>
              <span className="field-val">
                <Calendar size={13} className="val-icon" />
                {listing.availableFrom}
              </span>
            </div>

            <div className="detail-field">
              <span className="field-name">Collection Cutoff / Expiry</span>
              <span className="field-val text-warning">
                <Clock size={13} className="val-icon" />
                {listing.availableTo}
              </span>
            </div>

            <div className="detail-field">
              <span className="field-name">Privacy-Protected Location</span>
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

        {/* 7. Reusable ListingAuditPanel (Lifecycle & Batch Audit Trail) */}
        <ListingAuditPanel
          entries={listing.auditEntries || []}
          listingId={listing.id}
          onInvestigateClick={() => handleOpenModeration('investigate')}
        />
      </main>

      {/* 8. Reusable ModerationDialog (Investigate / Disable [D]) */}
      <ModerationDialog
        isOpen={dialogState.isOpen}
        mode={dialogState.mode}
        listing={listing}
        noteText={dialogState.noteText}
        onNoteChange={(val) =>
          setDialogState((prev) => ({ ...prev, noteText: val }))
        }
        onConfirm={handleConfirmModeration}
        onCancel={() => setDialogState((prev) => ({ ...prev, isOpen: false }))}
        isSubmitting={dialogState.isSubmitting}
      />
    </div>
  );
};

export default AdminListingDetailPage;
