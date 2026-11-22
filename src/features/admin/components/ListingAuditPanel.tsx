import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  Clock,
  History,
  CheckCircle2,
  FileSearch,
} from 'lucide-react';
import type { ListingAuditEntry } from '../types';

export interface ListingAuditPanelProps {
  entries: ListingAuditEntry[];
  listingId: string;
  onInvestigateClick?: () => void;
  className?: string;
}

export const ListingAuditPanel: React.FC<ListingAuditPanelProps> = ({
  entries,
  listingId,
  onInvestigateClick,
  className = '',
}) => {
  return (
    <div className={`listing-audit-panel-root ${className}`}>
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="header-title-row">
            <History size={16} />
            <h3>Listing Lifecycle &amp; Batch Audit Trail</h3>
          </div>
          {onInvestigateClick && (
            <button
              type="button"
              className="btn-investigate-action"
              onClick={onInvestigateClick}
              title="Add batch investigation finding"
            >
              <FileSearch size={14} />
              <span>Investigate Batch</span>
            </button>
          )}
        </div>

        <div className="profile-card-body">
          <p className="audit-lead-text">
            Immutable log of smallholder milking time, matching reservation locks, and administrative policy events for Listing #{listingId}.
          </p>

          {(!entries || entries.length === 0) ? (
            <div className="associated-empty-box">
              <p>No lifecycle events recorded for this listing.</p>
            </div>
          ) : (
            <div className="audit-timeline">
              {entries.map((entry) => {
                const isCrit = entry.severity === 'critical';
                const isWarn = entry.severity === 'warning';

                return (
                  <div key={entry.id} className="audit-log-entry">
                    <div
                      className={`audit-dot ${
                        isCrit ? 'dot-danger' : isWarn ? 'dot-warning' : 'dot-info'
                      }`}
                    />
                    <div className="audit-content">
                      <div className="audit-title-row">
                        <strong>{entry.event}</strong>
                        <span className="audit-timestamp">{entry.timestamp}</span>
                      </div>
                      <p className="audit-performer">Logged by: {entry.performedBy}</p>
                      <p className="audit-text">{entry.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingAuditPanel;
