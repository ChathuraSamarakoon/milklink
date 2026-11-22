import React from 'react';
import {
  Users,
  Milk,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Truck,
  Building,
  Info,
} from 'lucide-react';
import type { SummaryReportData } from '../types';

interface SummaryReportCardsProps {
  report: SummaryReportData;
  onNavigateUsers: (role?: string) => void;
  onNavigateListings: (status?: string) => void;
  onNavigateOrders: (status?: string) => void;
  className?: string;
}

export const SummaryReportCards: React.FC<SummaryReportCardsProps> = ({
  report,
  onNavigateUsers,
  onNavigateListings,
  onNavigateOrders,
  className = '',
}) => {
  const { userSummary, listingSummary, orderSummary, regionalBreakdown } = report;

  return (
    <div className={`summary-report-cards-container ${className}`}>
      {/* RECORDED VOLUME & TURNOVER HERO SUMMARY */}
      <div className="report-hero-card">
        <div className="hero-metrics-grid">
          <div className="hero-metric-item">
            <div className="hero-metric-head">
              <div className="hero-icon-box milk">
                <Milk size={20} />
              </div>
              <span className="hero-metric-title">Recorded Milk Collected</span>
            </div>
            <div className="hero-metric-val-row">
              <span className="hero-value-huge">
                {report.totalRecordedLitres.toLocaleString()} L
              </span>
            </div>
            <p className="hero-subtext">
              Final physical volume measured via calibrated dipsticks & meters
            </p>
          </div>

          <div className="hero-metric-item">
            <div className="hero-metric-head">
              <div className="hero-icon-box cash">
                <DollarSign size={20} />
              </div>
              <span className="hero-metric-title">Recorded Cash Turnover</span>
            </div>
            <div className="hero-metric-val-row">
              <span className="hero-value-huge text-emerald">
                Rs. {report.totalTurnoverLkr.toLocaleString()}
              </span>
            </div>
            <p className="hero-subtext">
              Reconciled collector cash handovers (Avg: Rs. {report.avgUnitPriceLkr.toFixed(2)}/L)
            </p>
          </div>
        </div>
      </div>

      {/* 3 SUMMARY CARDS: USERS, LISTINGS, ORDERS */}
      <div className="report-domain-cards-grid">
        {/* 1. USERS SUMMARY CARD */}
        <div className="report-domain-card">
          <div className="domain-card-header">
            <div className="domain-header-left">
              <div className="domain-icon-circle blue">
                <Users size={18} />
              </div>
              <div>
                <h3 className="domain-title">Platform Users</h3>
                <span className="domain-sub">Active smallholder ecosystem</span>
              </div>
            </div>
            <div className="domain-total-count">{userSummary.totalUsers} Total</div>
          </div>

          {/* Role Counts Row */}
          <div className="domain-stat-chips-grid">
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateUsers('farmer')}
              title="View all registered smallholder farmers"
            >
              <span className="chip-label">Farmers</span>
              <strong className="chip-val">{userSummary.farmers}</strong>
            </button>
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateUsers('collector')}
              title="View registered milk route collectors"
            >
              <span className="chip-label">Collectors</span>
              <strong className="chip-val">{userSummary.collectors}</strong>
            </button>
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateUsers('buyer')}
              title="View buyers and dairy cooperatives"
            >
              <span className="chip-label">Buyers</span>
              <strong className="chip-val">{userSummary.buyers}</strong>
            </button>
          </div>

          {/* Account Status Breakdown */}
          <div className="status-progress-breakdown">
            <div className="breakdown-labels-row">
              <span className="status-text green">
                ● Active: <strong>{userSummary.activeUsers}</strong>
              </span>
              <span className="status-text amber">
                ● Pending: <strong>{userSummary.pendingUsers}</strong>
              </span>
              <span className="status-text red">
                ● Disabled: <strong>{userSummary.disabledUsers}</strong>
              </span>
            </div>
            <div className="breakdown-mini-bar" aria-label="Users status bar">
              <div
                style={{
                  width: `${(userSummary.activeUsers / userSummary.totalUsers) * 100}%`,
                  backgroundColor: '#22c55e',
                }}
              />
              <div
                style={{
                  width: `${(userSummary.pendingUsers / userSummary.totalUsers) * 100}%`,
                  backgroundColor: '#f59e0b',
                }}
              />
              <div
                style={{
                  width: `${(userSummary.disabledUsers / userSummary.totalUsers) * 100}%`,
                  backgroundColor: '#ef4444',
                }}
              />
            </div>
          </div>

          {/* Card Footer Link */}
          <div className="domain-card-footer">
            <button
              type="button"
              className="domain-navigate-btn"
              onClick={() => onNavigateUsers()}
            >
              <span>Manage Platform Users</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 2. MILK LISTINGS SUMMARY CARD */}
        <div className="report-domain-card">
          <div className="domain-card-header">
            <div className="domain-header-left">
              <div className="domain-icon-circle green">
                <Milk size={18} />
              </div>
              <div>
                <h3 className="domain-title">Milk Listings</h3>
                <span className="domain-sub">Daily smallholder yields</span>
              </div>
            </div>
            <div className="domain-total-count">{listingSummary.totalListings} Listings</div>
          </div>

          {/* Listing Quantities Row */}
          <div className="domain-stat-chips-grid">
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateListings('active')}
              title="View active market listings"
            >
              <span className="chip-label">Active</span>
              <strong className="chip-val text-emerald">{listingSummary.activeCount}</strong>
            </button>
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateListings('reserved')}
              title="View reserved listings"
            >
              <span className="chip-label">Reserved</span>
              <strong className="chip-val text-blue">{listingSummary.reservedCount}</strong>
            </button>
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateListings('expired')}
              title="View expired listings"
            >
              <span className="chip-label">Expired</span>
              <strong className="chip-val text-neutral">{listingSummary.expiredCount}</strong>
            </button>
          </div>

          {/* Litres Volume Summary */}
          <div className="domain-volume-bar-box">
            <div className="vol-item">
              <span className="vol-label">Available Volume:</span>
              <strong className="vol-val">
                {listingSummary.totalAvailableLitres.toLocaleString()} Litres
              </strong>
            </div>
            <div className="vol-item">
              <span className="vol-label">Reserved Volume:</span>
              <strong className="vol-val text-blue">
                {listingSummary.totalReservedLitres.toLocaleString()} Litres
              </strong>
            </div>
          </div>

          {/* Card Footer Link */}
          <div className="domain-card-footer">
            <button
              type="button"
              className="domain-navigate-btn"
              onClick={() => onNavigateListings()}
            >
              <span>Manage Milk Listings</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* 3. ORDERS SUMMARY CARD */}
        <div className="report-domain-card">
          <div className="domain-card-header">
            <div className="domain-header-left">
              <div className="domain-icon-circle purple">
                <ShoppingCart size={18} />
              </div>
              <div>
                <h3 className="domain-title">Milk Orders</h3>
                <span className="domain-sub">Lifecycle & collection status</span>
              </div>
            </div>
            <div className="domain-total-count">{orderSummary.totalOrders} Orders</div>
          </div>

          {/* Status Breakdown Chips */}
          <div className="domain-stat-chips-grid">
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateOrders('completed')}
              title="View completed pickups"
            >
              <span className="chip-label">Completed</span>
              <strong className="chip-val text-emerald">{orderSummary.completedOrders}</strong>
            </button>
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateOrders('in-transit')}
              title="View in-transit routes"
            >
              <span className="chip-label">In-Transit</span>
              <strong className="chip-val text-blue">{orderSummary.inTransitOrders}</strong>
            </button>
            <button
              type="button"
              className="domain-stat-chip clickable"
              onClick={() => onNavigateOrders('accepted')}
              title="View accepted orders"
            >
              <span className="chip-label">Accepted</span>
              <strong className="chip-val">{orderSummary.acceptedOrders}</strong>
            </button>
          </div>

          {/* Cash Reconciled Sub-Bar */}
          <div className="domain-volume-bar-box">
            <div className="vol-item">
              <span className="vol-label">Fulfilled Milk Volume:</span>
              <strong className="vol-val">
                {orderSummary.totalCompletedLitres.toLocaleString()} L
              </strong>
            </div>
            <div className="vol-item">
              <span className="vol-label">Reconciled Cash Handover:</span>
              <strong className="vol-val text-emerald">
                Rs. {orderSummary.totalRecordedCashLkr.toLocaleString()}
              </strong>
            </div>
          </div>

          {/* Card Footer Link */}
          <div className="domain-card-footer">
            <button
              type="button"
              className="domain-navigate-btn"
              onClick={() => onNavigateOrders()}
            >
              <span>Manage Milk Orders</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* REGIONAL VOLUME & TURNOVER TABLE */}
      <div className="report-regional-card">
        <div className="regional-card-header">
          <div className="regional-header-left">
            <Building size={18} className="regional-header-icon" />
            <div>
              <h4 className="regional-card-title">Regional Milk Distribution Summary</h4>
              <p className="regional-card-sub">
                Summary across key Sri Lankan dairy production hubs
              </p>
            </div>
          </div>
        </div>

        <div className="regional-table-wrapper">
          <table className="regional-summary-table">
            <thead>
              <tr>
                <th>Production District</th>
                <th>Active Farmers</th>
                <th>Orders</th>
                <th>Recorded Litres</th>
                <th>Turnover (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {regionalBreakdown.map((row) => (
                <tr key={row.district}>
                  <td>
                    <strong>{row.district}</strong>
                  </td>
                  <td>{row.activeFarmers}</td>
                  <td>{row.orderCount}</td>
                  <td>
                    <strong>{row.totalLitres.toLocaleString()} L</strong>
                  </td>
                  <td className="text-emerald">
                    <strong>Rs. {row.turnoverLkr.toLocaleString()}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* BASIC REPORTING SCOPE DISCLAIMER */}
      <div className="admin-policy-alert">
        <Info size={16} className="policy-shield-icon" />
        <div className="policy-callout-text">
          <strong>Basic Prototype Reporting Scope (A24, A06):</strong>
          <p>
            In accordance with system specifications, this summary utilizes recorded final amounts
            and litres collected on routes and verified via collector cash handovers. This is basic
            reporting for prototype evaluation, not enterprise analytics, predictive modeling, or financial forecasting.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryReportCards;
