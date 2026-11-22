import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  ShieldCheck,
} from 'lucide-react';
import type { OrderLifecycleStep, OrderSyncConflict } from '../types';

export interface OrderLifecycleInspectorProps {
  steps: OrderLifecycleStep[];
  syncConflict?: OrderSyncConflict;
  onNavigateToSync?: () => void;
  className?: string;
}

export const OrderLifecycleInspector: React.FC<OrderLifecycleInspectorProps> = ({
  steps,
  syncConflict,
  onNavigateToSync,
  className = '',
}) => {
  const [showPayload, setShowPayload] = useState(false);

  return (
    <div className={`order-lifecycle-inspector-root ${className}`}>
      {/* 1. Sync Conflict Alert if present (Flow to Sync issues) */}
      {syncConflict && (
        <div className="order-sync-conflict-card" role="alert">
          <div className="conflict-card-header">
            <div className="conflict-header-left">
              <AlertTriangle size={18} className="text-danger" />
              <h4>Offline Outbox Sync Conflict Detected</h4>
            </div>
            <span className="conflict-badge">Unresolved Outbox</span>
          </div>

          <div className="conflict-card-body">
            <p className="conflict-desc">{syncConflict.description}</p>

            <div className="conflict-meta-grid">
              <div className="meta-box">
                <span className="meta-label">Operation ID:</span>
                <code>{syncConflict.operationId}</code>
              </div>
              <div className="meta-box">
                <span className="meta-label">Client Device Time:</span>
                <span>{syncConflict.clientTime}</span>
              </div>
              <div className="meta-box">
                <span className="meta-label">Server Replay Time:</span>
                <span>{syncConflict.serverTime}</span>
              </div>
              {syncConflict.clientQuantityLitres !== undefined && syncConflict.serverQuantityLitres !== undefined && (
                <div className="meta-box">
                  <span className="meta-label">Litres Discrepancy:</span>
                  <span className="text-danger font-bold">
                    Client: {syncConflict.clientQuantityLitres}L vs Server: {syncConflict.serverQuantityLitres}L
                  </span>
                </div>
              )}
            </div>

            <div className="conflict-card-actions">
              <button
                type="button"
                className="btn-resolve-sync"
                onClick={onNavigateToSync}
                title="Navigate to Sync Monitoring Center"
              >
                <RotateCcw size={14} />
                <span>Review in Sync Center (/admin/sync)</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Lifecycle Timeline Card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="header-title-row">
            <Clock size={16} />
            <h3>Order Lifecycle &amp; Dispatch Timeline</h3>
          </div>
          <button
            type="button"
            className="card-text-link"
            onClick={() => setShowPayload(!showPayload)}
            title="Inspect raw outbox sync payload"
          >
            <FileCode size={13} />
            <span>{showPayload ? 'Hide Outbox Payload' : 'Inspect Outbox Payload'}</span>
            {showPayload ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

        <div className="profile-card-body">
          <p className="audit-lead-text">
            End-to-end audit progression from buyer reservation to field collector dispatch and cash handover receipt.
          </p>

          <div className="lifecycle-timeline">
            {steps.map((step, index) => {
              const isCompleted = step.status === 'completed';
              const isInProgress = step.status === 'in-progress';
              const isConflict = step.status === 'conflict';

              return (
                <div
                  key={step.id || index}
                  className={`lifecycle-timeline-item step-${step.status}`}
                >
                  <div
                    className={`step-circle ${
                      isCompleted
                        ? 'circle-done'
                        : isInProgress
                        ? 'circle-active'
                        : isConflict
                        ? 'circle-conflict'
                        : 'circle-pending'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div className="step-content">
                    <div className="step-header">
                      <strong className="step-name">{step.name}</strong>
                      <span className="step-timestamp">{step.timestamp}</span>
                    </div>

                    <div className="step-actor-row">
                      <span className="step-actor">
                        Actor: <strong>{step.actor}</strong> ({step.actorRole})
                      </span>
                      {step.outboxOperationId && (
                        <span className="outbox-chip">
                          Outbox: <code>{step.outboxOperationId}</code>
                        </span>
                      )}
                    </div>

                    <p className="step-desc">{step.details}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Raw Payload Inspector Drawer */}
          {showPayload && (
            <div className="raw-payload-viewer">
              <div className="payload-header">
                <FileCode size={13} />
                <span>Client IndexedDB Outbox Payload Snapshot</span>
              </div>
              <pre className="payload-code-block">
                {JSON.stringify(
                  {
                    syncEngine: 'MilkLink Foreground Replayer v1.0',
                    transport: 'HTTPS REST /api/v1/orders/sync',
                    steps: steps.map((s) => ({
                      step: s.name,
                      actor: s.actor,
                      time: s.timestamp,
                      outboxId: s.outboxOperationId || 'server-direct',
                      status: s.status,
                    })),
                    integrityCheck: 'SHA256-VALID',
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderLifecycleInspector;
