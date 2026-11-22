import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Droplets,
  Milk,
  ShoppingCart,
  Truck,
  Star,
  Activity,
  History,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Clock,
} from 'lucide-react';
import { RoleBadge, StatusBadge } from './RoleBadge';
import type { AdminUser, UserStatus } from '../types';

export interface UserDetailPanelProps {
  user: AdminUser;
  onManageAccount: (targetStatus: UserStatus) => void;
  onNavigateToListings: (userId: string) => void;
  onNavigateToOrders: (userId: string) => void;
  onSelectListing?: (listingId: string) => void;
  onSelectOrder?: (orderId: string) => void;
  className?: string;
}

export const UserDetailPanel: React.FC<UserDetailPanelProps> = ({
  user,
  onManageAccount,
  onNavigateToListings,
  onNavigateToOrders,
  onSelectListing,
  onSelectOrder,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'associated' | 'activity'>('overview');

  const isFarmer = user.role === 'farmer';
  const isBuyer = user.role === 'buyer';
  const isCollector = user.role === 'collector';

  return (
    <div className={`user-detail-panel-root ${className}`}>
      {/* 1. Account / Role Hero Header Card */}
      <section className="user-detail-hero-card" aria-label="Account Overview">
        <div className="hero-top-row">
          <div className="user-avatar-lg" aria-hidden="true">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="hero-info-col">
            <div className="hero-name-row">
              <h2 className="user-hero-name">{user.name}</h2>
              {user.verified ? (
                <span className="verified-pill" title="Verified Smallholder / Buyer">
                  <CheckCircle2 size={13} />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="pending-pill" title="Verification Pending">
                  <Clock size={13} />
                  <span>Unverified</span>
                </span>
              )}
            </div>

            <div className="hero-badges-row">
              <RoleBadge role={user.role} size="md" />
              <StatusBadge status={user.status} size="md" />
              <span className="user-id-code">ID: {user.id}</span>
            </div>
          </div>
        </div>

        {/* Action Row: Review Activity & Manage Account [D] */}
        <div className="hero-actions-toolbar">
          <button
            type="button"
            className={`btn-toolbar-tab ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <History size={15} />
            <span>Review Activity</span>
          </button>

          {user.status === 'active' ? (
            <button
              type="button"
              className="btn-action-deactivate"
              onClick={() => onManageAccount('disabled')}
              title="Suspend or deactivate account in accordance with policy"
            >
              <XCircle size={15} />
              <span>Manage Account: Deactivate [D]</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-action-activate"
              onClick={() => onManageAccount('active')}
              title="Authorize and activate account"
            >
              <CheckCircle2 size={15} />
              <span>Manage Account: Activate [D]</span>
            </button>
          )}
        </div>
      </section>

      {/* 2. Privacy & Personal Data Protection Callout */}
      <div className="admin-privacy-callout">
        <ShieldAlert size={18} className="privacy-shield-icon" />
        <div className="privacy-callout-text">
          <strong>Personal Data Protection &amp; Farm Privacy:</strong>
          <p>
            Exact GPS coordinates, raw homestead addresses, and private phone metadata are strictly protected.
            Admin views display approximate division boundaries only (<em>{user.division || user.district}</em>).
            Administrative moderation actions are authorized only as permitted by confirmed platform policy.
          </p>
        </div>
      </div>

      {/* 3. Tab Navigation */}
      <div className="panel-tab-bar" role="tablist" aria-label="User details sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'overview'}
          className={`panel-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <FileText size={15} />
          <span>Account Information</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'associated'}
          className={`panel-tab-btn ${activeTab === 'associated' ? 'active' : ''}`}
          onClick={() => setActiveTab('associated')}
        >
          {isFarmer ? <Milk size={15} /> : <ShoppingCart size={15} />}
          <span>Associated Listings &amp; Orders</span>
          {((user.associatedListings?.length || 0) + (user.associatedOrders?.length || 0)) > 0 && (
            <span className="tab-count-badge">
              {(user.associatedListings?.length || 0) + (user.associatedOrders?.length || 0)}
            </span>
          )}
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'activity'}
          className={`panel-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <Activity size={15} />
          <span>Audit Log &amp; Moderation</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="tab-pane-content">
          <div className="profile-details-grid">
            {/* Account Details Box */}
            <div className="profile-card">
              <div className="profile-card-header">
                <FileText size={16} />
                <h3>Contact &amp; Registration</h3>
              </div>
              <div className="profile-card-body">
                <div className="detail-field">
                  <span className="field-name">Phone Number</span>
                  <span className="field-val">
                    <Phone size={13} className="val-icon" />
                    {user.phone}
                  </span>
                </div>

                {user.email && (
                  <div className="detail-field">
                    <span className="field-name">Email Address</span>
                    <span className="field-val">
                      <Mail size={13} className="val-icon" />
                      {user.email}
                    </span>
                  </div>
                )}

                <div className="detail-field">
                  <span className="field-name">Registered District &amp; Division</span>
                  <span className="field-val">
                    <MapPin size={13} className="val-icon" />
                    {user.division ? `${user.division}, ${user.district}` : user.district}
                  </span>
                </div>

                <div className="detail-field">
                  <span className="field-name">Registration Date</span>
                  <span className="field-val">
                    <Calendar size={13} className="val-icon" />
                    {user.joinedDate}
                  </span>
                </div>

                {user.notes && (
                  <div className="detail-field full-width">
                    <span className="field-name">Administrative Notes</span>
                    <p className="admin-notes-content">{user.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Metrics Box */}
            <div className="profile-card">
              <div className="profile-card-header">
                <Activity size={16} />
                <h3>Role Metrics Summary</h3>
              </div>
              <div className="profile-card-body">
                {user.metrics?.totalLitres !== undefined && (
                  <div className="metric-box">
                    <span className="metric-label">
                      {isFarmer ? 'Total Litres Listed / Supplied' : isCollector ? 'Total Litres Handled' : 'Total Litres Purchased'}
                    </span>
                    <div className="metric-val-row">
                      <Droplets size={20} className="metric-icon-litres" />
                      <span className="metric-huge">{user.metrics.totalLitres.toLocaleString()} L</span>
                    </div>
                  </div>
                )}

                <div className="detail-field">
                  <span className="field-name">Completed Platform Transactions</span>
                  <span className="field-val font-bold">{user.metrics?.completedOrders || 0} completed</span>
                </div>

                {user.metrics?.rating !== undefined && (
                  <div className="detail-field">
                    <span className="field-name">Cooperative Reliability Rating</span>
                    <span className="field-val rating-val">
                      <Star size={14} className="star-icon" fill="#f59e0b" color="#f59e0b" />
                      <strong>{user.metrics.rating}</strong> / 5.0
                    </span>
                  </div>
                )}

                {user.metrics?.fulfilmentRate !== undefined && (
                  <div className="detail-field">
                    <span className="field-name">Fulfilment Rate</span>
                    <span className="field-val text-success">
                      <strong>{user.metrics.fulfilmentRate}%</strong> (Reliable)
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ASSOCIATED LISTINGS & ORDERS (Screen Flow Requirement 05) */}
      {activeTab === 'associated' && (
        <div className="tab-pane-content">
          {/* Section: Associated Listings (If Farmer) */}
          {isFarmer && (
            <div className="associated-section">
              <div className="associated-header-row">
                <div className="title-with-badge">
                  <Milk size={18} className="text-primary" />
                  <h3 className="associated-title">Farmer Milk Listings</h3>
                  <span className="count-pill">{user.associatedListings?.length || 0}</span>
                </div>
                <button
                  type="button"
                  className="card-text-link"
                  onClick={() => onNavigateToListings(user.id)}
                  title="Navigate to Listings management filtered by this farmer"
                >
                  <span>View All in Listings Module</span>
                  <ExternalLink size={13} />
                </button>
              </div>

              {!user.associatedListings || user.associatedListings.length === 0 ? (
                <div className="associated-empty-box">
                  <p>No milk listings currently associated with this farmer.</p>
                </div>
              ) : (
                <div className="associated-cards-list">
                  {user.associatedListings.map((lst) => (
                    <div
                      key={lst.id}
                      className="associated-item-card"
                      onClick={() => onSelectListing?.(lst.id)}
                    >
                      <div className="item-card-left">
                        <div className="item-id-row">
                          <span className="item-id">Listing #{lst.id}</span>
                          <span className={`status-badge status-${lst.status === 'active' ? 'active' : 'disabled'}`}>
                            {lst.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="item-sub-row">
                          <span>Date: {lst.availableDate}</span>
                          <span>Unit Price: Rs. {lst.unitPriceLkr}/L</span>
                        </div>
                      </div>
                      <div className="item-card-right">
                        <span className="item-quantity-val">{lst.quantityLitres} L</span>
                        <span className="item-reserved-sub">
                          {lst.reservedLitres > 0 ? `${lst.reservedLitres} L reserved` : 'Available'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section: Associated Orders */}
          <div className="associated-section">
            <div className="associated-header-row">
              <div className="title-with-badge">
                <ShoppingCart size={18} className="text-blue" />
                <h3 className="associated-title">
                  {isFarmer ? 'Incoming Orders' : isBuyer ? 'Placed Milk Orders' : 'Assigned Collection Orders'}
                </h3>
                <span className="count-pill">{user.associatedOrders?.length || 0}</span>
              </div>
              <button
                type="button"
                className="card-text-link"
                onClick={() => onNavigateToOrders(user.id)}
                title="Navigate to Orders module filtered by this user"
              >
                <span>View All in Orders Module</span>
                <ExternalLink size={13} />
              </button>
            </div>

            {!user.associatedOrders || user.associatedOrders.length === 0 ? (
              <div className="associated-empty-box">
                <p>No orders recorded for this account.</p>
              </div>
            ) : (
              <div className="associated-cards-list">
                {user.associatedOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="associated-item-card"
                    onClick={() => onSelectOrder?.(ord.id)}
                  >
                    <div className="item-card-left">
                      <div className="item-id-row">
                        <span className="item-id">Order #{ord.id}</span>
                        <span className={`status-badge status-${ord.status === 'completed' || ord.status === 'accepted' ? 'active' : ord.status === 'pending' ? 'pending' : 'disabled'}`}>
                          {ord.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="item-sub-row">
                        <span>{isFarmer ? `Buyer: ${ord.counterpartyName}` : isBuyer ? `Farmer: ${ord.counterpartyName}` : `Route: ${ord.counterpartyName}`}</span>
                        {ord.collectorName && <span>Collector: {ord.collectorName}</span>}
                      </div>
                      <span className="item-date-text">{ord.orderDate}</span>
                    </div>
                    <div className="item-card-right">
                      <span className="item-quantity-val">{ord.quantityLitres} L</span>
                      <span className="item-price-val">Rs. {ord.totalPriceLkr.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG & MODERATION (Review Activity) */}
      {activeTab === 'activity' && (
        <div className="tab-pane-content">
          <div className="profile-card">
            <div className="profile-card-header">
              <ShieldCheck size={16} />
              <h3>Moderation &amp; Activity Audit Log</h3>
            </div>
            <div className="profile-card-body">
              <p className="audit-lead-text">
                All administrative state changes require documented justification in compliance with dairy trade policy.
              </p>

              {!user.auditLogs || user.auditLogs.length === 0 ? (
                <div className="associated-empty-box">
                  <p>No moderation events recorded. Account operating normally.</p>
                </div>
              ) : (
                <div className="audit-timeline">
                  {user.auditLogs.map((log) => (
                    <div key={log.id} className="audit-log-entry">
                      <div className="audit-dot" />
                      <div className="audit-content">
                        <div className="audit-title-row">
                          <strong>{log.action}</strong>
                          <span className="audit-timestamp">{log.timestamp}</span>
                        </div>
                        <p className="audit-performer">By: {log.performedBy}</p>
                        <p className="audit-text">{log.reason}</p>
                        {log.previousStatus && log.newStatus && (
                          <div className="audit-status-tag">
                            Status change: <code>{log.previousStatus}</code> → <code>{log.newStatus}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailPanel;
