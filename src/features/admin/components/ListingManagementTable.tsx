import React, { useState } from 'react';
import {
  Eye,
  Ban,
  Clock,
  Droplets,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';
import type { AdminMilkListing } from '../types';

export interface ListingManagementTableProps {
  listings: AdminMilkListing[];
  onViewListing: (listingId: string) => void;
  onDisableListing: (listingId: string, reason: string) => Promise<void>;
  className?: string;
}

export const ListingManagementTable: React.FC<ListingManagementTableProps> = ({
  listings,
  onViewListing,
  onDisableListing,
  className = '',
}) => {
  // Modal state for disabling a listing under approved policy
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    listing: AdminMilkListing | null;
    reason: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    listing: null,
    reason: '',
    isSubmitting: false,
  });

  const handleOpenDisableModal = (listing: AdminMilkListing) => {
    setModalState({
      isOpen: true,
      listing,
      reason: '',
      isSubmitting: false,
    });
  };

  const handleConfirmDisable = async () => {
    if (!modalState.listing) return;
    setModalState((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await onDisableListing(
        modalState.listing.id,
        modalState.reason || 'Administrative policy moderation'
      );
      setModalState((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
    } catch {
      setModalState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const isReasonValid = modalState.reason.trim().length >= 8;

  const renderStatusBadge = (status: AdminMilkListing['status']) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">Active</span>;
      case 'reserved':
        return <span className="status-badge status-pending">100% Reserved</span>;
      case 'expired':
        return <span className="status-badge status-disabled">Expired</span>;
      case 'disabled':
        return <span className="status-badge status-disabled">Disabled [D]</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className={`listing-management-table-root ${className}`}>
      {listings.length === 0 ? (
        <div className="table-empty-state">
          <p className="empty-title">No milk listings match the filter</p>
          <p className="empty-desc">Try clearing filters or search term to see milk postings.</p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table" role="table">
            <thead>
              <tr>
                <th scope="col">Listing &amp; Farmer</th>
                <th scope="col">Volume (Available / Total)</th>
                <th scope="col">Unit Price</th>
                <th scope="col">Availability / Expiry</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((lst) => {
                const percentReserved = Math.round((lst.reservedLitres / lst.totalLitres) * 100);
                const hasReservations = lst.reservedLitres > 0;

                return (
                  <tr key={lst.id} className="user-table-row">
                    {/* Listing ID & Farmer Column */}
                    <td>
                      <div className="user-primary-cell">
                        <div className="listing-drop-avatar" aria-hidden="true">
                          <Droplets size={16} />
                        </div>
                        <div className="user-details-col">
                          <button
                            type="button"
                            className="user-name-link"
                            onClick={() => onViewListing(lst.id)}
                          >
                            Listing #{lst.id}
                          </button>
                          <span className="listing-farmer-sub">
                            {lst.farmerName} • <span className="text-muted">{lst.division || lst.district}</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Volume (Available / Total Litres) with Progress Bar */}
                    <td>
                      <div className="volume-cell">
                        <div className="volume-val-row">
                          <span className="available-litres-val">
                            <strong>{lst.availableLitres} L</strong> available
                          </span>
                          <span className="total-litres-sub">/ {lst.totalLitres} L</span>
                        </div>
                        {/* Visual reserve bar */}
                        <div className="reserve-progress-bar" title={`${lst.reservedLitres}L of ${lst.totalLitres}L reserved`}>
                          <div
                            className="reserve-progress-fill"
                            style={{ width: `${percentReserved}%` }}
                          />
                        </div>
                        {hasReservations && (
                          <span className="reservation-note">
                            <Lock size={10} />
                            {lst.reservedLitres} L locked in orders
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td>
                      <div className="price-cell">
                        <span className="price-primary">Rs. {lst.unitPriceLkr}</span>
                        <span className="price-unit">/ Litre</span>
                      </div>
                    </td>

                    {/* Availability Dates & Expiry */}
                    <td>
                      <div className="date-expiry-cell">
                        <span className="date-row">
                          <Calendar size={12} className="date-icon" />
                          <span>{lst.availableFrom.split(' ')[0]}</span>
                        </span>
                        <span className="expiry-row">
                          <Clock size={12} className="clock-icon" />
                          <span>Expires: {lst.availableTo.split(' ')[1] || lst.availableTo}</span>
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td>{renderStatusBadge(lst.status)}</td>

                    {/* Actions Column */}
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="view-details-btn"
                          onClick={() => onViewListing(lst.id)}
                          title="View full listing details"
                        >
                          <Eye size={14} />
                          <span>View</span>
                        </button>

                        {lst.status !== 'disabled' && (
                          <button
                            type="button"
                            className="btn-disable-action"
                            onClick={() => handleOpenDisableModal(lst)}
                            title="Disable listing under approved policy"
                          >
                            <Ban size={13} />
                            <span>Disable [D]</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Disabling Confirmation Modal with Reservation Constraints */}
      {modalState.isOpen && modalState.listing && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="disable-modal-title">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-icon-badge sev-bg-critical">
                <AlertTriangle size={24} className="text-danger" />
              </div>
              <div>
                <h3 id="disable-modal-title" className="modal-title">
                  Disable Milk Listing #{modalState.listing.id}
                </h3>
                <p className="modal-subtitle">
                  Administrative Moderation under Approved Platform Policy
                </p>
              </div>
            </div>

            <div className="modal-body">
              {/* Listing Summary */}
              <div className="user-confirm-summary">
                <div className="summary-row">
                  <span className="summary-label">Farmer:</span>
                  <strong>{modalState.listing.farmerName}</strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Total Volume:</span>
                  <strong>{modalState.listing.totalLitres} Litres</strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Reserved Volume:</span>
                  <strong className={modalState.listing.reservedLitres > 0 ? 'text-warning' : ''}>
                    {modalState.listing.reservedLitres} Litres locked
                  </strong>
                </div>
              </div>

              {/* Behavior & Constraint Enforcement: Moderation should not bypass existing stock reservations */}
              {modalState.listing.reservedLitres > 0 ? (
                <div className="reservation-warning-box">
                  <ShieldAlert size={18} className="warn-icon" />
                  <div className="warn-text">
                    <strong>Critical Reservation Constraint:</strong>
                    <p>
                      This listing has <strong>{modalState.listing.reservedLitres} L</strong> actively reserved by buyers.
                      In accordance with platform policy, <em>moderation cannot bypass or unilaterally wipe out existing stock reservations</em>.
                      Disabling will prevent any <em>new</em> reservations from being placed, while existing reserved orders must be fulfilled or mutually cancelled by the parties.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="compliance-policy-box">
                  <ShieldCheck size={16} className="policy-icon" />
                  <div className="policy-text">
                    <strong>Approved Policy Verification:</strong>
                    <p>
                      Disabling an active listing immediately removes it from buyer discovery and matching algorithms.
                      This action requires documented administrative justification.
                    </p>
                  </div>
                </div>
              )}

              {/* Reason Textarea */}
              <div className="audit-reason-field">
                <label htmlFor="disable-reason-input" className="field-label">
                  Administrative Reason / Policy Violation Note (Required min 8 chars):
                </label>
                <textarea
                  id="disable-reason-input"
                  className="audit-textarea"
                  rows={3}
                  placeholder="e.g. Milk quality failure report received; farmer requested emergency withdrawal; inaccurate pricing band..."
                  value={modalState.reason}
                  onChange={(e) =>
                    setModalState((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  required
                />
                {!isReasonValid && modalState.reason.length > 0 && (
                  <span className="field-hint text-warning">
                    Please provide at least 8 characters explaining the moderation justification.
                  </span>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
                disabled={modalState.isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="modal-confirm-btn btn-danger"
                onClick={handleConfirmDisable}
                disabled={modalState.isSubmitting || !isReasonValid}
              >
                {modalState.isSubmitting ? 'Processing...' : 'Confirm Disable Listing [D]'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingManagementTable;
