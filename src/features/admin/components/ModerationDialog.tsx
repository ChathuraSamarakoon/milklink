import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  FileSearch,
  Ban,
  Lock,
} from 'lucide-react';
import type { AdminMilkListing } from '../types';

export interface ModerationDialogProps {
  isOpen: boolean;
  mode: 'disable' | 'investigate';
  listing: AdminMilkListing;
  noteText: string;
  onNoteChange: (text: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ModerationDialog: React.FC<ModerationDialogProps> = ({
  isOpen,
  mode,
  listing,
  noteText,
  onNoteChange,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const isDisable = mode === 'disable';
  const hasActiveReservations = listing.reservedLitres > 0;
  const isTextValid = noteText.trim().length >= 8;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="moderation-dialog-title"
    >
      <div className="modal-card">
        {/* Header */}
        <div className="modal-header">
          <div
            className={`modal-icon-badge ${
              isDisable ? 'sev-bg-critical' : 'sev-bg-info'
            }`}
          >
            {isDisable ? (
              <Ban size={24} className="text-danger" />
            ) : (
              <FileSearch size={24} className="text-primary" />
            )}
          </div>
          <div>
            <h3 id="moderation-dialog-title" className="modal-title">
              {isDisable
                ? `Disable Milk Listing #${listing.id}`
                : `Investigate Listing #${listing.id}`}
            </h3>
            <p className="modal-subtitle">
              {isDisable
                ? 'Policy-Driven Moderation Control [D]'
                : 'Administrative Quality & Verification Audit'}
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Summary Box */}
          <div className="user-confirm-summary">
            <div className="summary-row">
              <span className="summary-label">Farmer:</span>
              <strong>{listing.farmerName}</strong>
            </div>
            <div className="summary-row">
              <span className="summary-label">Protected Location:</span>
              <span>{listing.division}, {listing.district}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Batch Volume:</span>
              <strong>{listing.totalLitres} Litres (Available: {listing.availableLitres}L)</strong>
            </div>
            {hasActiveReservations && (
              <div className="summary-row">
                <span className="summary-label text-warning">Active Reservations:</span>
                <strong className="text-warning">{listing.reservedLitres} Litres locked</strong>
              </div>
            )}
          </div>

          {/* Policy Constraints */}
          {isDisable && hasActiveReservations ? (
            <div className="reservation-warning-box">
              <ShieldAlert size={18} className="warn-icon" />
              <div className="warn-text">
                <strong>Reservation Protection Rule:</strong>
                <p>
                  This listing currently holds <strong>{listing.reservedLitres} Litres</strong> in active buyer reservations.
                  Administrative moderation cannot bypass existing stock commitments. Disabling will prevent new orders,
                  while existing reservations must be fulfilled or settled through standard order dispute channels.
                </p>
              </div>
            </div>
          ) : isDisable ? (
            <div className="compliance-policy-box">
              <ShieldCheck size={16} className="policy-icon" />
              <div className="policy-text">
                <strong>Approved Policy Requirement:</strong>
                <p>
                  Disabling rights remain optional policy-driven controls. Deactivating a listing unpublishes
                  it from buyer discovery and matching algorithms.
                </p>
              </div>
            </div>
          ) : (
            <div className="compliance-policy-box">
              <ShieldCheck size={16} className="policy-icon" />
              <div className="policy-text">
                <strong>Audit Trail Policy:</strong>
                <p>
                  Investigation notes are permanently appended to the batch lifecycle log to support
                  fair dairy trade compliance and quality traceability.
                </p>
              </div>
            </div>
          )}

          {/* Form field */}
          <div className="audit-reason-field">
            <label htmlFor="moderation-note-input" className="field-label">
              {isDisable
                ? 'Approved Policy Justification (Required min 8 chars):'
                : 'Administrative Finding & Inspection Notes (Required min 8 chars):'}
            </label>
            <textarea
              id="moderation-note-input"
              className="audit-textarea"
              rows={3}
              placeholder={
                isDisable
                  ? 'State approved policy grounds: e.g. Quality violation, farmer requested emergency delisting, temperature breach...'
                  : 'Document inspection findings: e.g. Verified cold storage at 4°C; confirmed Jersey cross herd registration with regional veterinary office...'
              }
              value={noteText}
              onChange={(e) => onNoteChange(e.target.value)}
              required
            />
            {!isTextValid && noteText.length > 0 && (
              <span className="field-hint text-warning">
                Please provide at least 8 characters explaining the administrative rationale.
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel-btn"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`modal-confirm-btn ${
              isDisable ? 'btn-danger' : 'btn-primary'
            }`}
            onClick={onConfirm}
            disabled={isSubmitting || !isTextValid}
          >
            {isSubmitting
              ? 'Recording...'
              : isDisable
              ? 'Authorize Disabling [D]'
              : 'Save Investigation Finding'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModerationDialog;
