import React, { useState, useMemo } from 'react';
import {
  Search,
  MoreVertical,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { RoleBadge, StatusBadge } from './RoleBadge';
import type { AdminUser, UserRole, UserStatus } from '../types';

export interface UsersDataTableProps {
  users: AdminUser[];
  onViewUser: (userId: string) => void;
  onUpdateStatus: (userId: string, newStatus: UserStatus, reason: string) => Promise<void>;
  className?: string;
}

export const UsersDataTable: React.FC<UsersDataTableProps> = ({
  users,
  onViewUser,
  onUpdateStatus,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | UserRole>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | UserStatus>('all');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Confirmation modal state for deactivate/activate actions
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    user: AdminUser | null;
    targetStatus: UserStatus;
    reason: string;
    isSubmitting: boolean;
  }>({
    isOpen: false,
    user: null,
    targetStatus: 'active',
    reason: '',
    isSubmitting: false,
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const handleOpenConfirm = (user: AdminUser, targetStatus: UserStatus) => {
    setOpenMenuId(null);
    setConfirmDialog({
      isOpen: true,
      user,
      targetStatus,
      reason: '',
      isSubmitting: false,
    });
  };

  const handleConfirmSubmit = async () => {
    if (!confirmDialog.user) return;
    setConfirmDialog((prev) => ({ ...prev, isSubmitting: true }));
    try {
      await onUpdateStatus(
        confirmDialog.user.id,
        confirmDialog.targetStatus,
        confirmDialog.reason || 'Admin status adjustment'
      );
      setConfirmDialog((prev) => ({ ...prev, isOpen: false, isSubmitting: false }));
    } catch {
      setConfirmDialog((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className={`users-data-table-container ${className}`}>
      {/* Search and Filters Header */}
      <div className="users-table-controls">
        <div className="search-bar-wrapper">
          <Search size={18} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            className="users-search-input"
            placeholder="Search by name, phone, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search users"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Role Filters */}
        <div className="filters-row">
          <div className="filter-pill-scroll" role="group" aria-label="Filter users by role">
            <button
              type="button"
              className={`table-filter-pill ${selectedRole === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedRole('all')}
            >
              All Roles ({users.length})
            </button>
            <button
              type="button"
              className={`table-filter-pill ${selectedRole === 'farmer' ? 'active' : ''}`}
              onClick={() => setSelectedRole('farmer')}
            >
              Farmers ({users.filter((u) => u.role === 'farmer').length})
            </button>
            <button
              type="button"
              className={`table-filter-pill ${selectedRole === 'buyer' ? 'active' : ''}`}
              onClick={() => setSelectedRole('buyer')}
            >
              Buyers ({users.filter((u) => u.role === 'buyer').length})
            </button>
            <button
              type="button"
              className={`table-filter-pill ${selectedRole === 'collector' ? 'active' : ''}`}
              onClick={() => setSelectedRole('collector')}
            >
              Collectors ({users.filter((u) => u.role === 'collector').length})
            </button>
          </div>

          {/* Status selector */}
          <div className="status-filter-select-wrapper">
            <select
              className="status-dropdown"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as 'all' | UserStatus)}
              aria-label="Filter by account status"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="pending">Pending Verification</option>
              <option value="disabled">Disabled / Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Informational Note */}
      <div className="table-meta-bar">
        <span className="results-count-text">
          Showing <strong>{filteredUsers.length}</strong> of {users.length} registered accounts
        </span>
        <span className="privacy-badge" title="Data Protection Notice">
          <ShieldCheck size={13} />
          <span>Approximate division locations only</span>
        </span>
      </div>

      {/* Users List / Table Card */}
      {filteredUsers.length === 0 ? (
        <div className="table-empty-state">
          <p className="empty-title">No users found</p>
          <p className="empty-desc">Try clearing filters or search term to see accounts.</p>
          <button
            type="button"
            className="empty-reset-btn"
            onClick={() => {
              setSearchTerm('');
              setSelectedRole('all');
              setSelectedStatus('all');
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table" role="table">
            <thead>
              <tr>
                <th scope="col">User Info</th>
                <th scope="col">Role</th>
                <th scope="col">Division / District</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isMenuOpen = openMenuId === user.id;

                return (
                  <tr key={user.id} className="user-table-row">
                    {/* User Info Column */}
                    <td>
                      <div className="user-primary-cell">
                        <div className="user-avatar-initial" aria-hidden="true">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-details-col">
                          <button
                            type="button"
                            className="user-name-link"
                            onClick={() => onViewUser(user.id)}
                          >
                            {user.name}
                          </button>
                          <div className="user-contact-subtext">
                            <span className="user-phone">
                              <Phone size={12} />
                              {user.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td>
                      <RoleBadge role={user.role} size="md" />
                    </td>

                    {/* District Column (Approximate, strictly no raw GPS coordinates) */}
                    <td>
                      <div className="location-cell" title="Protected division-level location">
                        <MapPin size={13} className="loc-pin" />
                        <span className="division-name">{user.division || user.district}</span>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td>
                      <StatusBadge status={user.status} size="md" />
                    </td>

                    {/* Action Column */}
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="view-details-btn"
                          onClick={() => onViewUser(user.id)}
                          title="View user details"
                        >
                          <Eye size={15} />
                          <span>View</span>
                        </button>

                        <div className="menu-container">
                          <button
                            type="button"
                            className={`actions-menu-trigger ${isMenuOpen ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(isMenuOpen ? null : user.id);
                            }}
                            aria-haspopup="true"
                            aria-expanded={isMenuOpen}
                            aria-label={`Actions for ${user.name}`}
                          >
                            <MoreVertical size={16} />
                          </button>

                          {isMenuOpen && (
                            <div className="actions-dropdown-menu" role="menu">
                              <button
                                type="button"
                                role="menuitem"
                                className="dropdown-item"
                                onClick={() => {
                                  setOpenMenuId(null);
                                  onViewUser(user.id);
                                }}
                              >
                                <Eye size={14} />
                                <span>Full Account Profile</span>
                              </button>

                              {user.status !== 'active' && (
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="dropdown-item activate-action"
                                  onClick={() => handleOpenConfirm(user, 'active')}
                                >
                                  <CheckCircle size={14} />
                                  <span>Activate Account</span>
                                </button>
                              )}

                              {user.status === 'pending' && (
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="dropdown-item verify-action"
                                  onClick={() => handleOpenConfirm(user, 'active')}
                                >
                                  <UserCheck size={14} />
                                  <span>Approve &amp; Verify</span>
                                </button>
                              )}

                              {user.status === 'active' && (
                                <button
                                  type="button"
                                  role="menuitem"
                                  className="dropdown-item deactivate-action"
                                  onClick={() => handleOpenConfirm(user, 'disabled')}
                                >
                                  <XCircle size={14} />
                                  <span>Deactivate / Suspend</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin Authorization & Confirmation Dialog */}
      {confirmDialog.isOpen && confirmDialog.user && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-icon-badge">
                <AlertTriangle size={24} className="modal-alert-icon" />
              </div>
              <div>
                <h3 className="modal-title">
                  {confirmDialog.targetStatus === 'active'
                    ? 'Confirm Account Activation'
                    : 'Confirm Account Suspension'}
                </h3>
                <p className="modal-subtitle">
                  Account deactivate/activate actions require administrator authorization.
                </p>
              </div>
            </div>

            <div className="modal-body">
              <div className="user-confirm-summary">
                <div className="summary-row">
                  <span className="summary-label">User:</span>
                  <strong>{confirmDialog.user.name}</strong>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Role:</span>
                  <RoleBadge role={confirmDialog.user.role} size="sm" />
                </div>
                <div className="summary-row">
                  <span className="summary-label">Target Status:</span>
                  <StatusBadge status={confirmDialog.targetStatus} size="sm" />
                </div>
              </div>

              <div className="audit-reason-field">
                <label htmlFor="audit-reason" className="field-label">
                  Audit Log Reason / Notes (Required for traceability):
                </label>
                <textarea
                  id="audit-reason"
                  className="audit-textarea"
                  rows={3}
                  placeholder="e.g. Phone number verified with farmer; or temporary suspension due to unfulfilled collection order."
                  value={confirmDialog.reason}
                  onChange={(e) =>
                    setConfirmDialog((prev) => ({ ...prev, reason: e.target.value }))
                  }
                />
              </div>

              <p className="audit-disclaimer">
                ⚠️ All administrator status overrides are permanently stored in the compliance audit trail.
              </p>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() =>
                  setConfirmDialog((prev) => ({ ...prev, isOpen: false }))
                }
                disabled={confirmDialog.isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={`modal-confirm-btn ${
                  confirmDialog.targetStatus === 'disabled' ? 'btn-danger' : 'btn-primary'
                }`}
                onClick={handleConfirmSubmit}
                disabled={confirmDialog.isSubmitting}
              >
                {confirmDialog.isSubmitting
                  ? 'Processing...'
                  : confirmDialog.targetStatus === 'active'
                  ? 'Authorize Activation'
                  : 'Authorize Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersDataTable;
