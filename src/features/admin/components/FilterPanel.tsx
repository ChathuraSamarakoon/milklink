import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import type { TimeRangeFilter } from '../types';

interface FilterPanelProps {
  selectedRange: TimeRangeFilter;
  onRangeChange: (range: TimeRangeFilter) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedRange,
  onRangeChange,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  const options: Array<{ label: string; value: TimeRangeFilter }> = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Quarter', value: 'quarter' },
  ];

  return (
    <div className={`filter-panel-container ${className}`}>
      <div className="filter-panel-left">
        <span className="filter-calendar-icon" aria-hidden="true">
          <Calendar size={15} />
        </span>
        <div className="filter-pill-group" role="tablist" aria-label="Timeframe selection">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="tab"
              aria-selected={selectedRange === opt.value}
              className={`filter-range-pill ${selectedRange === opt.value ? 'active' : ''}`}
              onClick={() => onRangeChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-panel-right">
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing}
          className={`filter-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          aria-label="Refresh dashboard data"
          title="Refresh dashboard data"
        >
          <RefreshCw size={15} />
          <span className="refresh-label">Refresh</span>
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
