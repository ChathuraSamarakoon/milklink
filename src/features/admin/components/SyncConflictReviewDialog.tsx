import React, { useState } from 'react';
import {
  X,
  ShieldAlert,
  Server,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  User,
  Clock,
  FileText,
  Lock,
} from 'lucide-react';
import type { SyncOperationRecord } from '../types';
import ConflictBadge from './ConflictBadge';
import RoleBadge from './RoleBadge';

interface SyncConflictReviewDialogProps {
  operation: SyncOperationRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onResolve: (
    opId: string,
    resolution: {
      action: 'accept_server' | 'accept_client' | 'force_retry';
      supervisorJustification: string;
      supervisorName: string;
    }
  ) => Promise<void>;
  onNavigateRecord: (recordType: string, recordId: string) => void;
  onNavigateUser: (userId: string) => void;
}

export const SyncConflictReviewDialog: React.FC<SyncConflictReviewDialogProps> = ({
  operation,
  isOpen,
  onClose,
  onResolve,
  onNavigateRecord,
  onNavigateUser,
}) => {
  if (!isOpen || !operation) return null;

  const [resolutionAction, setResolutionAction] = useState<
    'accept_server' | 'accept_client' | 'force_retry'
  >('accept_server');
  const [justification, setJustification] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [supervisorName, setSupervisorName] = useState('Admin Supervisor');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAlreadyResolved = operation.status === 'resolved';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!justification.trim()) return;
    if (resolutionAction !== 'accept_server' && !isAuthorized) return;

    setIsSubmitting(true);
    try {
      await onResolve(operation.id, {
        action: resolutionAction,
        supervisorJustification: justification.trim(),
        supervisorName: supervisorName.trim() || 'Admin Supervisor',
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="admin-modal-box sync-review-modal">
        {/* MODAL HEADER */}
        <div className="admin-modal-header">
          <div className="modal-title-with-icon">
            <div className="modal-icon-badge warn">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 id="dialog-title" className="admin-modal-title">
                Offline Sync Conflict Telemetry
              </h3>
              <p className="admin-modal-subtitle">
                Operation: <strong>{operation.id}</strong> • Record:{' '}
                <strong>{operation.recordId}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="admin-modal-body">
          {/* CONFLICT SUMMARY PILL ROW */}
          <div className="conflict-telemetry-summary-row">
            <div className="summary-pill">
              <span className="summary-pill-label">Action:</span>
              <span className="summary-pill-val">{operation.action}</span>
            </div>
            <div className="summary-pill">
              <span className="summary-pill-label">Conflict Type:</span>
              <ConflictBadge type={operation.conflictType} size="sm" />
            </div>
            <div className="summary-pill">
              <span className="summary-pill-label">Status:</span>
              <ConflictBadge status={operation.status} size="sm" />
            </div>
          </div>

          {/* ACTOR & RECORD LINKS */}
          <div className="sync-parties-card">
            <div className="party-item">
              <span className="party-title">Submitting Offline Actor:</span>
              <div className="party-val-row">
                <button
                  type="button"
                  className="party-link-btn"
                  onClick={() => onNavigateUser(operation.actorId)}
                  title={`Open user profile for ${operation.actorName}`}
                >
                  <User size={14} />
                  <strong>{operation.actorName}</strong>
                </button>
                <RoleBadge role={operation.actorRole} size="sm" />
              </div>
            </div>

            <div className="party-item">
              <span className="party-title">Associated Business Record:</span>
              <div className="party-val-row">
                <button
                  type="button"
                  className="party-link-btn primary"
                  onClick={() => onNavigateRecord(operation.recordType, operation.recordId)}
                  title={`Open ${operation.recordType} ${operation.recordId}`}
                >
                  <FileText size={14} />
                  <strong>
                    {operation.recordType.toUpperCase()}: {operation.recordId}
                  </strong>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* SIDE-BY-SIDE: CLIENT OUTBOX VS SERVER STATE */}
          <div className="sync-comparison-grid">
            {/* CLIENT OUTBOX PANEL */}
            <div className="sync-comparison-col client-col">
              <div className="comparison-col-header">
                <Smartphone size={16} className="col-header-icon" />
                <div>
                  <h4 className="comparison-col-title">Client IndexedDB Outbox</h4>
                  <span className="comparison-col-sub">Offline Queued Mutation</span>
                </div>
              </div>
              <div className="comparison-fields-list">
                <div className="comp-field">
                  <span>Client Device:</span>
                  <strong>{operation.clientPayload.deviceId || 'Mobile PWA'}</strong>
                </div>
                <div className="comp-field">
                  <span>Client Queued Time:</span>
                  <strong>{operation.clientTime}</strong>
                </div>
                <div className="comp-field">
                  <span>Offline Duration:</span>
                  <strong>{operation.clientPayload.offlineDurationMinutes ?? 0} mins</strong>
                </div>
                <div className="comp-field">
                  <span>Outbox Monotonic Seq:</span>
                  <strong>#{operation.clientPayload.outboxSequence ?? 1}</strong>
                </div>
                {operation.clientPayload.recordedLitres !== undefined && (
                  <div className="comp-field highlight">
                    <span>Recorded Volume:</span>
                    <strong className="text-amber">
                      {operation.clientPayload.recordedLitres} Litres
                    </strong>
                  </div>
                )}
                {operation.clientPayload.temperatureCelsius !== undefined && (
                  <div className="comp-field">
                    <span>Milk Gate Temp:</span>
                    <strong>{operation.clientPayload.temperatureCelsius} °C</strong>
                  </div>
                )}
                {operation.clientPayload.cashAmountLkr !== undefined && (
                  <div className="comp-field">
                    <span>Cash Payment Recorded:</span>
                    <strong>Rs. {operation.clientPayload.cashAmountLkr.toLocaleString()}</strong>
                  </div>
                )}
              </div>
            </div>

            {/* AUTHORITATIVE SERVER PANEL */}
            <div className="sync-comparison-col server-col">
              <div className="comparison-col-header">
                <Server size={16} className="col-header-icon" />
                <div>
                  <h4 className="comparison-col-title">Authoritative Server State</h4>
                  <span className="comparison-col-sub">Official Database Master</span>
                </div>
              </div>
              <div className="comparison-fields-list">
                <div className="comp-field">
                  <span>Server Received At:</span>
                  <strong>{operation.serverReceivedAt}</strong>
                </div>
                <div className="comp-field">
                  <span>Authoritative Status:</span>
                  <strong className="text-blue">
                    {operation.serverAuthoritativeState?.currentStatus || 'Synchronized'}
                  </strong>
                </div>
                {operation.serverAuthoritativeState?.serverLitres !== undefined && (
                  <div className="comp-field highlight">
                    <span>Certified Baseline Volume:</span>
                    <strong className="text-emerald">
                      {operation.serverAuthoritativeState.serverLitres} Litres
                    </strong>
                  </div>
                )}
                {operation.serverAuthoritativeState?.certifiedVariance && (
                  <div className="comp-field">
                    <span>Variance Discrepancy:</span>
                    <strong className="text-critical">
                      {operation.serverAuthoritativeState.certifiedVariance}
                    </strong>
                  </div>
                )}
                <div className="comp-field">
                  <span>Authority Policy:</span>
                  <strong>Server Wins by Default (A20)</strong>
                </div>
              </div>
            </div>
          </div>

          {/* SERVER REJECTION REASON */}
          <div className="sync-server-reason-box">
            <div className="reason-title-row">
              <AlertTriangle size={14} className="reason-icon" />
              <span>Authoritative Rejection / Conflict Explanation:</span>
            </div>
            <p className="reason-text">{operation.serverReason}</p>
          </div>

          {/* RESOLUTION SECTION */}
          {isAlreadyResolved ? (
            <div className="already-resolved-banner">
              <CheckCircle2 size={18} className="resolved-banner-icon" />
              <div>
                <strong>Conflict Has Been Resolved</strong>
                <p>
                  Resolved by: {operation.resolvedBy || 'System'}&nbsp;•&nbsp;
                  {operation.resolvedAt || 'Completed'}
                </p>
                {operation.resolutionNote && (
                  <span className="resolved-note-text">{operation.resolutionNote}</span>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="sync-resolution-form">
              <div className="form-section-header">
                <Lock size={15} />
                <h4 className="form-section-title">Administrative Conflict Reconciliation</h4>
              </div>

              {/* Mode Selection */}
              <div className="resolution-mode-selector">
                <label
                  className={`mode-radio-card ${
                    resolutionAction === 'accept_server' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="res-action"
                    checked={resolutionAction === 'accept_server'}
                    onChange={() => setResolutionAction('accept_server')}
                  />
                  <div className="mode-card-content">
                    <div className="mode-title-row">
                      <strong>Enforce Authoritative Server State</strong>
                      <span className="mode-tag recommend">Recommended</span>
                    </div>
                    <p className="mode-desc">
                      Dismiss the conflicted client outbox mutation. Authoritative server database
                      record remains canonical (Spec A20).
                    </p>
                  </div>
                </label>

                <label
                  className={`mode-radio-card ${
                    resolutionAction === 'accept_client' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="res-action"
                    checked={resolutionAction === 'accept_client'}
                    onChange={() => setResolutionAction('accept_client')}
                  />
                  <div className="mode-card-content">
                    <div className="mode-title-row">
                      <strong>Authorize Client Offline Value (Override)</strong>
                      <span className="mode-tag warning">Supervisor Approval Required</span>
                    </div>
                    <p className="mode-desc">
                      Approve client physical measurement (e.g. verified signed carbon slip #402).
                      Mutates authoritative server database.
                    </p>
                  </div>
                </label>

                <label
                  className={`mode-radio-card ${
                    resolutionAction === 'force_retry' ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="res-action"
                    checked={resolutionAction === 'force_retry'}
                    onChange={() => setResolutionAction('force_retry')}
                  />
                  <div className="mode-card-content">
                    <div className="mode-title-row">
                      <strong>Force Outbox Re-attempt on Client Reconnect</strong>
                      <span className="mode-tag info">Queue Retry</span>
                    </div>
                    <p className="mode-desc">
                      Reset the client outbox sequence monotonic lock and request retry during the
                      next network heartbeat.
                    </p>
                  </div>
                </label>
              </div>

              {/* Mandatory Justification */}
              <div className="form-group-justification">
                <label htmlFor="supervisor-justification" className="form-label">
                  Supervisor Audit Justification & Voucher Reference{' '}
                  <span className="required-star">*</span>
                </label>
                <textarea
                  id="supervisor-justification"
                  rows={2}
                  value={justification}
                  onChange={(e) => setJustification(e.target.value)}
                  placeholder="e.g. Cross-referenced signed physical collection slip #402 with calibrated dipstick measurement of 28.0L. Verified by route supervisor."
                  className="justification-textarea"
                  required
                />
              </div>

              {/* Explicit Authorization Checkbox */}
              {resolutionAction !== 'accept_server' && (
                <div className="authorization-checkbox-container">
                  <label className="auth-checkbox-label">
                    <input
                      type="checkbox"
                      checked={isAuthorized}
                      onChange={(e) => setIsAuthorized(e.target.checked)}
                      required
                    />
                    <span>
                      I declare supervisor authorization for this manual override in compliance
                      with MilkLink audit specifications A20, A22–A23.
                    </span>
                  </label>
                </div>
              )}

              {/* SUBMIT BUTTONS */}
              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="admin-dialog-btn secondary"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-dialog-btn primary"
                  disabled={
                    isSubmitting ||
                    !justification.trim() ||
                    (resolutionAction !== 'accept_server' && !isAuthorized)
                  }
                >
                  {isSubmitting ? 'Recording Resolution...' : 'Confirm Reconciliation'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SyncConflictReviewDialog;
