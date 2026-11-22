import React from 'react';
import { Calendar, RefreshCw } from 'lucide-react';
import type { TimeRangeFilter } from '../types';

interface PeriodSelectorProps {
  selectedPeriod: TimeRangeFilter;
  onSelectPeriod: (period: TimeRangeFilter) => void;
  periodLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  className?: string;
}

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onSelectPeriod,
  periodLabel,
  onRefresh,
  isRefreshing = false,
  className = '',
}) => {
  const periods: Array<{ id: TimeRangeFilter; label: string }> = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: 'year', label: 'Annual' },
  ];

  return (
    <div className={`period-selector-card ${className}`}>
      <div className="period-selector-left">
        <div className="period-icon-box" aria-hidden="true">
          <Calendar size={16} />
        </div>
        <div className="period-pills-stack" role="tablist" aria-label="Reporting Period Selector">
          {periods.map((p) => {
            const isActive = selectedPeriod === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`period-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectPeriod(p.id)}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="period-selector-right">
        {periodLabel && <span className="period-date-range-badge">{periodLabel}</span>}
        {onRefresh && (
          <button
            type="button"
            className={`period-refresh-btn ${isRefreshing ? 'spinning' : ''}`}
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh basic report aggregates"
            aria-label="Refresh report data"
          >
            <RefreshCw size={14} />
            <span className="refresh-btn-text">Refresh</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PeriodSelector;
