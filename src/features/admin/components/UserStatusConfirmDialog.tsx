import React from 'react';
import {
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { RoleBadge, StatusBadge } from './RoleBadge';
import type { AdminUser, UserStatus } from '../types';

export interface UserStatusConfirmDialogProps {
  isOpen: boolean;
  user: AdminUser;
  targetStatus: UserStatus;
  reason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const UserStatusConfirmDialog: React.FC<UserStatusConfirmDialogProps> = ({
  isOpen,
  user,
  targetStatus,
  reason,
  onReasonChange,
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null;

  const isDeactivating = targetStatus === 'disabled';
  const isActivating = targetStatus === 'active';

  const isReasonValid = reason.trim().length >= 8;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="modal-card">
        {/* Header with severity badge */}
        <div className="modal-header">
          <div
            className={`modal-icon-badge ${
              isDeactivating ? 'sev-bg-critical' : 'sev-bg-warning'
            }`}
          >
            {isDeactivating ? (
              <XCircle size={24} className="text-danger" />
            ) : (
              <CheckCircle2 size={24} className="text-success" />
            )}
          </div>
          <div>
            <h3 id="confirm-dialog-title" className="modal-title">
              {isDeactivating
                ? 'Confirm Account Deactivation'
                : 'Confirm Account Activation'}
            </h3>
            <p className="modal-subtitle">
              Administrator Authorization &amp; Policy Confirmation
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Target User Summary Box */}
          <div className="user-confirm-summary">
            <div className="summary-row">
              <span className="summary-label">Target Account:</span>
              <strong>{user.name}</strong>
            </div>
            <div className="summary-row">
              <span className="summary-label">Platform Role:</span>
              <RoleBadge role={user.role} size="sm" />
            </div>
            <div className="summary-row">
              <span className="summary-label">Status Transition:</span>
              <div className="transition-pills">
                <StatusBadge status={user.status} size="sm" />
                <span className="arrow-sep">→</span>
                <StatusBadge status={targetStatus} size="sm" />
              </div>
            </div>
          </div>

          {/* Behavior, validations & constraints notice */}
          <div className="compliance-policy-box">
            <ShieldCheck size={16} className="policy-icon" />
            <div className="policy-text">
              <strong>Compliance Policy Constraint:</strong>
              <p>
                Account deactivate/activate actions are design recommendations and require
                explicit administrator authorization. All status transitions are logged
                with full audit justification and cannot circumvent offline collection outboxes.
              </p>
            </div>
          </div>

          {/* Audit Reason Input */}
          <div className="audit-reason-field">
            <label htmlFor="modal-audit-reason" className="field-label">
              Justification &amp; Audit Trail Note (Required minimum 8 chars):
            </label>
            <textarea
              id="modal-audit-reason"
              className="audit-textarea"
              rows={3}
              placeholder={
                isDeactivating
                  ? 'State specific reason: e.g. Repeated unfulfilled orders, farmer complaint, expired credentials...'
                  : 'State verification reason: e.g. Telephone verification confirmed with smallholder, ID validated...'
              }
              value={reason}
              onChange={(e) => onReasonChange(e.target.value)}
              required
            />
            {!isReasonValid && reason.length > 0 && (
              <span className="field-hint text-warning">
                Please provide at least 8 characters explaining the administrative reason.
              </span>
            )}
          </div>
        </div>

        {/* Modal Actions */}
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
              isDeactivating ? 'btn-danger' : 'btn-primary'
            }`}
            onClick={onConfirm}
            disabled={isSubmitting || !isReasonValid}
          >
            {isSubmitting
              ? 'Authorizing...'
              : isDeactivating
              ? 'Authorize Deactivation [D]'
              : 'Authorize Activation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusConfirmDialog;
