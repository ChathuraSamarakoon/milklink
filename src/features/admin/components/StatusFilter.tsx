import React from 'react';
import type { ListingStatus } from '../types';

export interface StatusFilterProps {
  selectedStatus: 'all' | ListingStatus;
  onStatusChange: (status: 'all' | ListingStatus) => void;
  counts: {
    all: number;
    active: number;
    reserved: number;
    expired: number;
    disabled: number;
  };
  className?: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
  counts,
  className = '',
}) => {
  const options: Array<{ label: string; value: 'all' | ListingStatus; count: number }> = [
    { label: 'All Listings', value: 'all', count: counts.all },
    { label: 'Active', value: 'active', count: counts.active },
    { label: '100% Reserved', value: 'reserved', count: counts.reserved },
    { label: 'Expired', value: 'expired', count: counts.expired },
    { label: 'Disabled [D]', value: 'disabled', count: counts.disabled },
  ];

  return (
    <div className={`status-filter-scroll ${className}`} role="tablist" aria-label="Filter listings by status">
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

export default StatusFilter;
