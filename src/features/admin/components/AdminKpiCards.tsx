import React from 'react';
import { Users, Trees, Truck, ShoppingCart, Droplets, TrendingUp } from 'lucide-react';
import KpiStatCard from './KpiStatCard';
import type { RoleCounts, CollectionMetric } from '../types';

interface AdminKpiCardsProps {
  roleCounts: RoleCounts;
  collectionMetric: CollectionMetric;
  onNavigate?: (screen: string) => void;
}

export const AdminKpiCards: React.FC<AdminKpiCardsProps> = ({
  roleCounts,
  collectionMetric,
  onNavigate,
}) => {
  return (
    <section className="admin-kpi-section" aria-label="Key Performance Indicators">
      {/* 2x2 Grid of Role Counts - Exactly matching Mobile Screen 4 in mockup */}
      <div className="role-kpi-grid">
        <KpiStatCard
          icon={<Users size={22} />}
          iconBgColor="#eff6ff"
          iconColor="#2563eb"
          value={roleCounts.totalUsers}
          label="Total Users"
          onClick={() => onNavigate?.('/admin/users')}
        />

        <KpiStatCard
          icon={<Trees size={22} />}
          iconBgColor="#ecfdf5"
          iconColor="#10b981"
          value={roleCounts.farmers}
          label="Farmers"
          onClick={() => onNavigate?.('/admin/users?role=farmer')}
        />

        <KpiStatCard
          icon={<Truck size={22} />}
          iconBgColor="#f0f9ff"
          iconColor="#0284c7"
          value={roleCounts.collectors}
          label="Collectors"
          onClick={() => onNavigate?.('/admin/users?role=collector')}
        />

        <KpiStatCard
          icon={<ShoppingCart size={22} />}
          iconBgColor="#fdf2f8"
          iconColor="#db2777"
          value={roleCounts.buyers}
          label="Buyers"
          onClick={() => onNavigate?.('/admin/users?role=buyer')}
        />
      </div>

      {/* Milk Collection Metric Card - Matching the large card in Screen 4 */}
      <div className="milk-collection-hero-card" onClick={() => onNavigate?.('/admin/reports')}>
        <div className="milk-collection-content">
          <div className="milk-collection-header">
            <span className="milk-drop-icon" aria-hidden="true">
              <Droplets size={18} />
            </span>
            <span className="milk-collection-title">Milk Collection (This Month)</span>
          </div>

          <div className="milk-collection-val-row">
            <span className="milk-collection-value">
              {collectionMetric.totalLitresThisMonth.toLocaleString('en-US', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              L
            </span>
            <span className="milk-collection-trend">
              <TrendingUp size={14} className="trend-arrow" />
              <span>+{collectionMetric.percentChange}%</span>
            </span>
          </div>
          <div className="milk-collection-subtext">
            Daily Avg: ~{collectionMetric.dailyAvgLitres} L/day • {collectionMetric.collectedBatches} verified collections
          </div>
        </div>

        {/* Visual Bar Chart graphic matching image mockup */}
        <div className="collection-chart-bars" aria-label="Monthly collection trend chart">
          {collectionMetric.historicalBars.map((heightPercent, index) => (
            <div
              key={index}
              className={`chart-bar-pillar ${index === collectionMetric.historicalBars.length - 1 ? 'bar-active' : ''}`}
              style={{ height: `${Math.max(18, heightPercent * 0.58)}px` }}
              title={`Period ${index + 1}: ${heightPercent}%`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AdminKpiCards;
