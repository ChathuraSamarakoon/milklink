import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Smartphone,
  Server,
  Eye,
  User,
  FileText,
  Clock,
} from 'lucide-react';
import type { SyncOperationRecord, SyncFilterState, SyncConflictType } from '../types';
import ConflictBadge from './ConflictBadge';
import RoleBadge from './RoleBadge';

interface SyncMonitoringTableProps {
  operations: SyncOperationRecord[];
  onInspectOperation: (op: SyncOperationRecord) => void;
  onNavigateRecord: (recordType: string, recordId: string) => void;
  onNavigateUser: (userId: string) => void;
  className?: string;
}

export const SyncMonitoringTable: React.FC<SyncMonitoringTableProps> = ({
  operations,
  onInspectOperation,
  onNavigateRecord,
  onNavigateUser,
  className = '',
}) => {
  const [filters, setFilters] = useState<SyncFilterState>({
    role: 'all',
    status: 'all',
    conflictType: 'all',
    searchQuery: '',
  });

  // Filtered operations
  const filteredOperations = useMemo(() => {
    return operations.filter((op) => {
      // Role filter
      if (filters.role !== 'all' && op.actorRole !== filters.role) {
        return false;
      }
      // Status filter
      if (filters.status !== 'all' && op.status !== filters.status) {
        return false;
      }
      // Conflict type filter
      if (filters.conflictType !== 'all' && op.conflictType !== filters.conflictType) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesRecord = op.recordId.toLowerCase().includes(query);
        const matchesId = op.id.toLowerCase().includes(query);
        const matchesActor = op.actorName.toLowerCase().includes(query);
        const matchesAction = op.action.toLowerCase().includes(query);
        const matchesReason = op.serverReason.toLowerCase().includes(query);
        if (!matchesRecord && !matchesId && !matchesActor && !matchesAction && !matchesReason) {
          return false;
        }
      }
      return true;
    });
  }, [operations, filters]);

  // Counts for pills
  const counts = useMemo(() => {
    return {
      all: operations.length,
      conflicted: operations.filter((o) => o.status === 'conflicted').length,
      failed: operations.filter((o) => o.status === 'failed').length,
      resolved: operations.filter((o) => o.status === 'resolved').length,
      collectors: operations.filter((o) => o.actorRole === 'collector').length,
      farmers: operations.filter((o) => o.actorRole === 'farmer').length,
      buyers: operations.filter((o) => o.actorRole === 'buyer').length,
    };
  }, [operations]);

  return (
    <div className={`sync-monitoring-table-container ${className}`}>
      {/* FILTER CONTROLS BAR */}
      <div className="sync-table-filters-card">
        {/* Search Input */}
        <div className="sync-search-row">
          <div className="sync-search-input-box">
            <Search size={16} className="sync-search-icon" />
            <input
              type="text"
              placeholder="Search by Record ID (e.g. ord-501), Actor, Action, or Reason..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              className="sync-search-field"
              aria-label="Search offline sync operations"
            />
            {filters.searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              >
                Clear
              </button>
            )}
          </div>

          {/* Conflict Type Select */}
          <div className="sync-type-select-box">
            <Filter size={14} className="filter-select-icon" />
            <select
              value={filters.conflictType}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  conflictType: e.target.value as 'all' | SyncConflictType,
                }))
              }
              className="sync-type-select"
              aria-label="Filter by conflict category"
            >
              <option value="all">All Conflict Types</option>
              <option value="quantity_mismatch">Quantity Mismatch</option>
              <option value="replay_sequence">Replay Sequence</option>
              <option value="status_race">Status Race</option>
              <option value="version_conflict">Version Conflict</option>
              <option value="validation_error">Validation Error</option>
            </select>
          </div>
        </div>

        {/* Filter Pills: Status & Role */}
        <div className="sync-filter-pills-row">
          {/* Status Pills */}
          <div className="pill-group" role="tablist" aria-label="Filter by status">
            <span className="pill-group-label">Status:</span>
            <button
              type="button"
              className={`filter-chip ${filters.status === 'all' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'all' }))}
            >
              All ({counts.all})
            </button>
            <button
              type="button"
              className={`filter-chip warn ${filters.status === 'conflicted' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'conflicted' }))}
            >
              Conflicted ({counts.conflicted})
            </button>
            <button
              type="button"
              className={`filter-chip critical ${filters.status === 'failed' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'failed' }))}
            >
              Failed ({counts.failed})
            </button>
            <button
              type="button"
              className={`filter-chip positive ${filters.status === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, status: 'resolved' }))}
            >
              Resolved ({counts.resolved})
            </button>
          </div>

          {/* Role Pills */}
          <div className="pill-group" role="tablist" aria-label="Filter by offline role">
            <span className="pill-group-label">Offline Role:</span>
            <button
              type="button"
              className={`filter-chip ${filters.role === 'all' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, role: 'all' }))}
            >
              All
            </button>
            <button
              type="button"
              className={`filter-chip ${filters.role === 'collector' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, role: 'collector' }))}
            >
              Collectors ({counts.collectors})
            </button>
            <button
              type="button"
              className={`filter-chip ${filters.role === 'farmer' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, role: 'farmer' }))}
            >
              Farmers ({counts.farmers})
            </button>
            <button
              type="button"
              className={`filter-chip ${filters.role === 'buyer' ? 'active' : ''}`}
              onClick={() => setFilters((prev) => ({ ...prev, role: 'buyer' }))}
            >
              Buyers ({counts.buyers})
            </button>
          </div>
        </div>
      </div>

      {/* OPERATIONS LIST / TABLE */}
      {filteredOperations.length === 0 ? (
        <div className="sync-empty-state">
          <AlertTriangle size={32} className="empty-icon" />
          <h4>No Synchronization Operations Found</h4>
          <p>No offline queued operations or conflicts match your selected filter criteria.</p>
        </div>
      ) : (
        <div className="sync-operations-stack">
          {filteredOperations.map((op) => (
            <div
              key={op.id}
              className={`sync-op-card ${
                op.status === 'conflicted'
                  ? 'border-conflicted'
                  : op.status === 'failed'
                  ? 'border-failed'
                  : 'border-resolved'
              }`}
            >
              {/* TOP HEADER ROW */}
              <div className="op-card-top-row">
                <div className="op-id-group">
                  <span className="op-seq-id">{op.id}</span>
                  {/* Record ID clickable button */}
                  <button
                    type="button"
                    className="record-link-badge"
                    onClick={() => onNavigateRecord(op.recordType, op.recordId)}
                    title={`Go to ${op.recordType} ${op.recordId}`}
                  >
                    <FileText size={12} />
                    <span>{op.recordId}</span>
                    <ExternalLink size={10} />
                  </button>
                </div>

                <div className="op-badges-group">
                  <ConflictBadge type={op.conflictType} size="sm" />
                  <ConflictBadge status={op.status} size="sm" />
                </div>
              </div>

              {/* ACTOR & ACTION ROW */}
              <div className="op-actor-action-row">
                <div className="actor-info-cell">
                  <span className="cell-label">Offline Submitter:</span>
                  <div className="actor-btn-wrap">
                    <button
                      type="button"
                      className="actor-profile-btn"
                      onClick={() => onNavigateUser(op.actorId)}
                      title={`Inspect profile of ${op.actorName}`}
                    >
                      <User size={13} />
                      <strong>{op.actorName}</strong>
                    </button>
                    <RoleBadge role={op.actorRole} size="sm" />
                  </div>
                </div>

                <div className="action-info-cell">
                  <span className="cell-label">Queued Action:</span>
                  <code className="op-action-code">{op.action}</code>
                </div>

                <div className="timestamp-info-cell">
                  <span className="cell-label">Client Time:</span>
                  <span className="time-val">
                    <Clock size={12} />
                    {op.clientTime}
                  </span>
                </div>
              </div>

              {/* SERVER REASON & EXPLANATION */}
              <div className="op-reason-row">
                <div className="server-reason-label">Authoritative Server Reason:</div>
                <p className="server-reason-text">{op.serverReason}</p>
              </div>

              {/* TELEMETRY CHIPS */}
              <div className="op-telemetry-chips">
                <span className="telemetry-chip">
                  <Smartphone size={11} />
                  <span>{op.clientPayload.deviceId || 'Mobile PWA'}</span>
                </span>
                {op.clientPayload.recordedLitres !== undefined && (
                  <span className="telemetry-chip">
                    <span>Recorded: <strong>{op.clientPayload.recordedLitres} L</strong></span>
                  </span>
                )}
                {op.serverAuthoritativeState?.serverLitres !== undefined && (
                  <span className="telemetry-chip">
                    <span>Server: <strong>{op.serverAuthoritativeState.serverLitres} L</strong></span>
                  </span>
                )}
                <span className="telemetry-chip">
                  <span>Server Received: {op.serverReceivedAt.split(' ')[1]}</span>
                </span>
              </div>

              {/* ACTIONS FOOTER */}
              <div className="op-card-footer">
                <button
                  type="button"
                  className="btn-inspect-conflict"
                  onClick={() => onInspectOperation(op)}
                >
                  <Eye size={14} />
                  <span>
                    {op.status === 'resolved' ? 'Inspect Telemetry' : 'Review & Resolve Conflict'}
                  </span>
                </button>

                <button
                  type="button"
                  className="btn-open-record"
                  onClick={() => onNavigateRecord(op.recordType, op.recordId)}
                >
                  <ExternalLink size={13} />
                  <span>View Record Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SyncMonitoringTable;
