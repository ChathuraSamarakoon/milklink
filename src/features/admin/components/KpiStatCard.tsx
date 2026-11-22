import React from 'react';

export interface KpiStatCardProps {
  icon: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string | number;
  label: string;
  badge?: {
    text: string;
    variant: 'positive' | 'negative' | 'neutral' | 'info';
  };
  sublabel?: string;
  onClick?: () => void;
  className?: string;
}

export const KpiStatCard: React.FC<KpiStatCardProps> = ({
  icon,
  iconBgColor = '#f1f5f9',
  iconColor = '#0f172a',
  value,
  label,
  badge,
  sublabel,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`kpi-stat-card ${onClick ? 'clickable' : ''} ${className}`}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="kpi-stat-card-header">
        <div
          className="kpi-stat-card-icon-box"
          style={{ backgroundColor: iconBgColor, color: iconColor }}
          aria-hidden="true"
        >
          {icon}
        </div>
        {badge && (
          <span className={`kpi-stat-card-badge badge-${badge.variant}`}>
            {badge.text}
          </span>
        )}
      </div>

      <div className="kpi-stat-card-body">
        <div className="kpi-stat-card-value">{value}</div>
        <div className="kpi-stat-card-label">{label}</div>
        {sublabel && <div className="kpi-stat-card-sublabel">{sublabel}</div>}
      </div>
    </div>
  );
};

export default KpiStatCard;
