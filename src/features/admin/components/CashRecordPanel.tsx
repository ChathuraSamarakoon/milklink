import React from 'react';
import {
  Banknote,
  CheckCircle2,
  Clock,
  Droplets,
  Scale,
  Thermometer,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Lock,
} from 'lucide-react';
import type { AdminOrderRecord } from '../types';

export interface CashRecordPanelProps {
  order: AdminOrderRecord;
  className?: string;
}

export const CashRecordPanel: React.FC<CashRecordPanelProps> = ({
  order,
  className = '',
}) => {
  const hasVariance =
    order.actualLitres !== undefined && order.actualLitres !== order.requestedLitres;

  const finalAmount = order.recalculatedTotalPriceLkr || order.totalPriceLkr;

  return (
    <div className={`cash-record-panel-root ${className}`}>
      {/* 1. Order vs Collected Amount Comparison Card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <Droplets size={16} />
          <h3>Order vs. Actual Collected Volume &amp; Pricing</h3>
        </div>

        <div className="profile-card-body">
          <div className="comparison-grid">
            {/* Requested Volume */}
            <div className="comparison-box">
              <span className="comp-label">Requested Litres (Order)</span>
              <span className="comp-val">{order.requestedLitres} L</span>
              <span className="comp-sub">Quoted total: Rs. {order.totalPriceLkr.toLocaleString()}</span>
            </div>

            {/* Actual Litres Weighed */}
            <div className="comparison-box highlight-box">
              <span className="comp-label">Actual Collected Litres</span>
              <span className={`comp-val ${hasVariance ? 'text-warning' : 'text-success'}`}>
                {order.actualLitres !== undefined ? `${order.actualLitres} L` : 'Pending Field Weighing'}
              </span>
              <span className="comp-sub">
                {hasVariance ? (
                  <strong className="text-warning">Variance of {(order.actualLitres! - order.requestedLitres).toFixed(1)} L</strong>
                ) : (
                  'Verified by Collector dipstick'
                )}
              </span>
            </div>

            {/* Final Recalculated Amount */}
            <div className="comparison-box">
              <span className="comp-label">Final Cash Handover Total</span>
              <span className="comp-val font-bold text-success">
                Rs. {finalAmount.toLocaleString()}
              </span>
              <span className="comp-sub">Unit rate: Rs. {order.unitPriceLkr} / L</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Collection Measurements & Quality Info */}
      {order.collectionInfo && (
        <div className="profile-card">
          <div className="profile-card-header">
            <Scale size={16} />
            <h3>Physical Collection &amp; Quality Info</h3>
          </div>

          <div className="profile-card-body">
            <div className="detail-field">
              <span className="field-name">Measurement Method</span>
              <span className="field-val font-bold">
                <Scale size={13} className="val-icon" />
                {order.collectionInfo.measurementMethod}
              </span>
            </div>

            {order.collectionInfo.milkTemperatureCelsius !== undefined && (
              <div className="detail-field">
                <span className="field-name">Milk Temperature at Gate</span>
                <span className="field-val text-success">
                  <Thermometer size={13} className="val-icon" />
                  {order.collectionInfo.milkTemperatureCelsius}°C (Chilled Compliance)
                </span>
              </div>
            )}

            {order.collectionInfo.qualityGrade && (
              <div className="detail-field">
                <span className="field-name">Quality Grade Assessed</span>
                <span className="field-val font-bold">{order.collectionInfo.qualityGrade}</span>
              </div>
            )}

            {order.collectionInfo.routeBatchId && (
              <div className="detail-field">
                <span className="field-name">Route Batch Identifier</span>
                <span className="field-val">
                  <code>{order.collectionInfo.routeBatchId}</code>
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. Cash Payment Record & Role Policy Governance Card */}
      <div className="profile-card">
        <div className="profile-card-header">
          <Banknote size={16} />
          <h3>Recorded Cash Transaction</h3>
        </div>

        <div className="profile-card-body">
          <div className="cash-status-hero">
            <div className="cash-status-left">
              <span className="cash-amount-title">Settled Amount:</span>
              <span className="cash-amount-huge">Rs. {finalAmount.toLocaleString()}</span>
            </div>
            <div className="cash-status-right">
              <span
                className={`payment-indicator-pill ${
                  order.paymentRecord.status === 'reconciled'
                    ? 'pay-reconciled'
                    : order.paymentRecord.status === 'recorded'
                    ? 'pay-recorded'
                    : 'pay-pending'
                }`}
              >
                {order.paymentRecord.status === 'reconciled' ? (
                  <CheckCircle2 size={13} />
                ) : (
                  <Clock size={13} />
                )}
                <span>{order.paymentRecord.status.toUpperCase()}</span>
              </span>
            </div>
          </div>

          <div className="cash-fields-list">
            <div className="detail-field">
              <span className="field-name">Payment Channel</span>
              <span className="field-val font-bold">
                Cash on Collection (Direct Field Handover)
              </span>
            </div>

            {order.paymentRecord.recordedBy && (
              <div className="detail-field">
                <span className="field-name">Cash Handover Officer</span>
                <span className="field-val">{order.paymentRecord.recordedBy}</span>
              </div>
            )}

            {order.paymentRecord.recordedAt && (
              <div className="detail-field">
                <span className="field-name">Handover Timestamp</span>
                <span className="field-val">
                  <Calendar size={13} className="val-icon" />
                  {order.paymentRecord.recordedAt}
                </span>
              </div>
            )}

            {order.paymentRecord.notes && (
              <div className="detail-field full-width">
                <span className="field-name">Payment Notes</span>
                <p className="admin-notes-content">{order.paymentRecord.notes}</p>
              </div>
            )}
          </div>

          {/* Behavior, Validations & Constraints Policy Callout */}
          <div className="admin-policy-alert">
            <ShieldCheck size={18} className="policy-shield-icon" />
            <div className="policy-callout-text">
              <strong>Role-Policy &amp; Ownership Governance:</strong>
              <p>
                In the MilkLink architecture, order completion and cash recording ownership are strictly
                field-governed responsibilities between the farmer and collector.
                This administration interface operates in <em>read-only inspection mode by default</em>.
                Administrators cannot fabricate or exercise override permissions to manually force order completion
                or overwrite verified cash payment amounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashRecordPanel;
