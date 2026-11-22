import React from 'react';
import {
  AlertTriangle,
  Clock,
  UserCheck,
  PackageX,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import type { AttentionItem } from '../types';

interface AttentionPanelProps {
  items: AttentionItem[];
  onActionClick?: (route: string) => void;
  className?: string;
}

export const AttentionPanel: React.FC<AttentionPanelProps> = ({
  items,
  onActionClick,
  className = '',
}) => {
  if (!items || items.length === 0) {
    return (
      <div className={`attention-panel-empty ${className}`}>
        <p>No urgent platform alerts. System is operating normally.</p>
      </div>
    );
  }

  const getCategoryIcon = (category: AttentionItem['category'], severity: AttentionItem['severity']) => {
    switch (category) {
      case 'sync':
        return <AlertTriangle size={18} className="attention-icon-sync" />;
      case 'orders':
        return <Clock size={18} className="attention-icon-orders" />;
      case 'verification':
        return <UserCheck size={18} className="attention-icon-users" />;
      case 'listings':
        return <PackageX size={18} className="attention-icon-listings" />;
      default:
        return <ShieldAlert size={18} />;
    }
  };

  return (
    <section className={`attention-panel-card ${className}`} aria-labelledby="attention-panel-heading">
      <div className="attention-panel-header">
        <div className="attention-header-left">
          <div className="attention-badge-pulse" aria-hidden="true" />
          <h2 id="attention-panel-heading" className="attention-title">
            Activity &amp; Attention Required
          </h2>
        </div>
        <span className="attention-count-pill">{items.length} Pending</span>
      </div>

      <div className="attention-items-list" role="list">
        {items.map((item) => (
          <div
            key={item.id}
            role="listitem"
            className={`attention-item-row severity-${item.severity}`}
            onClick={() => onActionClick?.(item.actionRoute)}
          >
            <div className={`attention-item-icon-wrapper sev-bg-${item.severity}`}>
              {getCategoryIcon(item.category, item.severity)}
            </div>

            <div className="attention-item-content">
              <div className="attention-item-top">
                <span className="attention-item-title">{item.title}</span>
                <span className="attention-item-time">{item.timestamp}</span>
              </div>
              <p className="attention-item-desc">{item.description}</p>
              
              <div className="attention-item-footer">
                <button
                  type="button"
                  className="attention-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onActionClick?.(item.actionRoute);
                  }}
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AttentionPanel;
