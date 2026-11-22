import React from 'react';
import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Scale,
  History,
  Flag,
  GitBranch,
  AlertCircle,
} from 'lucide-react';
import type { SyncConflictType, SyncOperationStatus } from '../types';

interface ConflictBadgeProps {
  type?: SyncConflictType;
  status?: SyncOperationStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const ConflictBadge: React.FC<ConflictBadgeProps> = ({
  type,
  status,
  size = 'md',
  className = '',
}) => {
  // If rendering a Conflict Type badge
  if (type) {
    switch (type) {
      case 'quantity_mismatch':
        return (
          <span className={`sync-badge badge-type-quantity size-${size} ${className}`} title="Discrepancy between client dipstick/meter and server baseline">
            <Scale size={size === 'sm' ? 12 : 14} />
            <span>Quantity Mismatch</span>
          </span>
        );
      case 'replay_sequence':
        return (
          <span className={`sync-badge badge-type-sequence size-${size} ${className}`} title="Outbox replay sequence inversion or timestamp skew">
            <History size={size === 'sm' ? 12 : 14} />
            <span>Replay Sequence</span>
          </span>
        );
      case 'status_race':
        return (
          <span className={`sync-badge badge-type-race size-${size} ${className}`} title="Concurrent server state transition while client was offline">
            <Flag size={size === 'sm' ? 12 : 14} />
            <span>Status Race</span>
          </span>
        );
      case 'version_conflict':
        return (
          <span className={`sync-badge badge-type-version size-${size} ${className}`} title="Record version conflict resolved via server timestamp">
            <GitBranch size={size === 'sm' ? 12 : 14} />
            <span>Version Conflict</span>
          </span>
        );
      case 'validation_error':
        return (
          <span className={`sync-badge badge-type-validation size-${size} ${className}`} title="Schema or NTP clock validation error">
            <AlertCircle size={size === 'sm' ? 12 : 14} />
            <span>Validation Error</span>
          </span>
        );
      default:
        return (
          <span className={`sync-badge badge-type-neutral size-${size} ${className}`}>
            <span>{type}</span>
          </span>
        );
    }
  }

  // If rendering a Sync Status badge
  if (status) {
    switch (status) {
      case 'conflicted':
        return (
          <span className={`sync-badge badge-status-conflicted size-${size} ${className}`} title="Conflicted operation requiring review">
            <AlertTriangle size={size === 'sm' ? 12 : 14} />
            <span>Conflicted</span>
          </span>
        );
      case 'failed':
        return (
          <span className={`sync-badge badge-status-failed size-${size} ${className}`} title="Operation rejected by authoritative server">
            <XCircle size={size === 'sm' ? 12 : 14} />
            <span>Failed</span>
          </span>
        );
      case 'resolved':
        return (
          <span className={`sync-badge badge-status-resolved size-${size} ${className}`} title="Reconciled and synced with server">
            <CheckCircle2 size={size === 'sm' ? 12 : 14} />
            <span>Resolved</span>
          </span>
        );
      case 'pending-retry':
        return (
          <span className={`sync-badge badge-status-retry size-${size} ${className}`} title="Queued for next client network heartbeat">
            <RotateCcw size={size === 'sm' ? 12 : 14} />
            <span>Pending Retry</span>
          </span>
        );
      default:
        return (
          <span className={`sync-badge badge-status-neutral size-${size} ${className}`}>
            <span>{status}</span>
          </span>
        );
    }
  }

  return null;
};

export default ConflictBadge;
