import React from 'react';
import type { OrderStatus } from '../types';

export interface OrderStatusFilterProps {
  selectedStatus: 'all' | OrderStatus;
  onStatusChange: (status: 'all' | OrderStatus) => void;
  counts: {
    all: number;
    pending: number;
    accepted: number;
    inTransit: number;
    completed: number;
    cancelled: number;
  };
  className?: string;
}

export const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  counts,
  className = '',
}) => {
  const options: Array<{ label: string; value: 'all' | OrderStatus; count: number }> = [
    { label: 'All Orders', value: 'all', count: counts.all },
    { label: 'Pending', value: 'pending', count: counts.pending },
    { label: 'Accepted', value: 'accepted', count: counts.accepted },
    { label: 'In-Transit', value: 'in-transit', count: counts.inTransit },
    { label: 'Completed', value: 'completed', count: counts.completed },
    { label: 'Cancelled', value: 'cancelled', count: counts.cancelled },
  ];

  return (
    <div
      className={`status-filter-scroll ${className}`}
      role="tablist"
      aria-label="Filter orders by status"
    >
      {options.map((opt) => {
        const isActive = selectedStatus === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`status-filter-pill ${isActive ? 'active' : ''}`}
            onClick={() => onStatusChange(opt.value)}
          >
            <span className="pill-label">{opt.label}</span>
            <span className={`pill-counter ${isActive ? 'counter-active' : ''}`}>
              {opt.count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OrderStatusFilter;
