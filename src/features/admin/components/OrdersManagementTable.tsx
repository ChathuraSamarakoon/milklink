import React from 'react';
import {
  ShoppingCart,
  Trees,
  Truck,
  ExternalLink,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import type { AdminOrderRecord, OrderStatus } from '../types';

export interface OrdersManagementTableProps {
  orders: AdminOrderRecord[];
  onOpenOrder: (orderId: string) => void;
  className?: string;
}

export const OrdersManagementTable: React.FC<OrdersManagementTableProps> = ({
  orders,
  onOpenOrder,
  className = '',
}) => {
  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return <span className="status-badge status-active"><CheckCircle2 size={12} /> Completed</span>;
      case 'accepted':
        return <span className="status-badge status-active"><Clock size={12} /> Accepted</span>;
      case 'in-transit':
        return <span className="status-badge status-pending"><Truck size={12} /> In-Transit</span>;
      case 'pending':
        return <span className="status-badge status-pending"><AlertCircle size={12} /> Pending</span>;
      case 'cancelled':
        return <span className="status-badge status-disabled"><XCircle size={12} /> Cancelled</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const renderPaymentBadge = (payment: AdminOrderRecord['paymentRecord']) => {
    if (payment.status === 'reconciled') {
      return (
        <span className="payment-indicator-pill pay-reconciled" title="Cash fully settled & verified">
          <Banknote size={12} />
          <span>Cash Reconciled</span>
        </span>
      );
    }
    if (payment.status === 'recorded') {
      return (
        <span className="payment-indicator-pill pay-recorded" title="Cash payment recorded at collection">
          <Banknote size={12} />
          <span>Cash Recorded</span>
        </span>
      );
    }
    return (
      <span className="payment-indicator-pill pay-pending" title="Cash payment pending collection">
        <Clock size={12} />
        <span>Cash Pending</span>
      </span>
    );
  };

  return (
    <div className={`orders-management-table-root ${className}`}>
      {orders.length === 0 ? (
        <div className="table-empty-state">
          <p className="empty-title">No orders found matching the filter</p>
          <p className="empty-desc">Try clearing filters or search term to review milk orders.</p>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <table className="users-table" role="table">
            <thead>
              <tr>
                <th scope="col">Order &amp; Date</th>
                <th scope="col">Parties (Buyer • Farmer • Collector)</th>
                <th scope="col">Quantity</th>
                <th scope="col">Total Price</th>
                <th scope="col">Payment Record</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => {
                const hasVariance = ord.actualLitres !== undefined && ord.actualLitres !== ord.requestedLitres;

                return (
                  <tr key={ord.id} className="user-table-row">
                    {/* Order ID & Date */}
                    <td>
                      <div className="order-id-cell">
                        <button
                          type="button"
                          className="user-name-link font-bold"
                          onClick={() => onOpenOrder(ord.id)}
                        >
                          #{ord.id}
                        </button>
                        <span className="order-sub-date">
                          <Calendar size={11} />
                          {ord.orderDate}
                        </span>
                      </div>
                    </td>

                    {/* Parties Column (Buyer / Farmer / Collector) */}
                    <td>
                      <div className="parties-cell">
                        <div className="party-line">
                          <span className="party-role-tag role-buyer">
                            <ShoppingCart size={11} />
                            <span>Buyer:</span>
                          </span>
                          <span className="party-name">{ord.buyerName}</span>
                        </div>

                        <div className="party-line">
                          <span className="party-role-tag role-farmer">
                            <Trees size={11} />
                            <span>Farmer:</span>
                          </span>
                          <span className="party-name">{ord.farmerName}</span>
                          <span className="party-location-sub">({ord.farmerDistrict})</span>
                        </div>

                        <div className="party-line">
                          <span className="party-role-tag role-collector">
                            <Truck size={11} />
                            <span>Collector:</span>
                          </span>
                          <span className="party-name">
                            {ord.collectorName ? ord.collectorName : <em className="text-muted">Unassigned</em>}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Quantity (Requested vs Actual Litres) */}
                    <td>
                      <div className="volume-cell">
                        <div className="volume-val-row">
                          <strong className="order-litres-val">{ord.requestedLitres} L</strong>
                          <span className="text-muted">requested</span>
                        </div>
                        {ord.actualLitres !== undefined && (
                          <span className={`actual-litres-sub ${hasVariance ? 'text-warning' : 'text-success'}`}>
                            Actual: {ord.actualLitres} L {hasVariance && '(variance)'}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Total Price */}
                    <td>
                      <div className="price-cell">
                        <strong className="order-price-val">Rs. {ord.totalPriceLkr.toLocaleString()}</strong>
                        <span className="price-unit">@ Rs.{ord.unitPriceLkr}/L</span>
                      </div>
                    </td>

                    {/* Payment Record Indicator (Cash only, never payment gateway) */}
                    <td>{renderPaymentBadge(ord.paymentRecord)}</td>

                    {/* Status Badge */}
                    <td>{renderStatusBadge(ord.status)}</td>

                    {/* Actions: Open Order */}
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="view-details-btn btn-open-order"
                          onClick={() => onOpenOrder(ord.id)}
                          title="Open order details"
                        >
                          <span>Open Order</span>
                          <ExternalLink size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Behavior, Validations & Constraints Disclaimer */}
      <div className="admin-governance-card">
        <ShieldAlert size={18} className="gov-icon" />
        <div className="gov-text">
          <strong>Platform Governance Rule:</strong>
          <p>
            The order dashboard is an informational supervisory tool. In accordance with system policy,
            administrators <em>cannot fabricate or manually override field actions</em> to cancel orders,
            declare order completion, or overwrite cash recording receipts. Transactions are finalized
            directly between smallholders, buyers, and collectors in the field via offline outbox syncing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrdersManagementTable;
