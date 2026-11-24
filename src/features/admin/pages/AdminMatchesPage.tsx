import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Menu,
  GitCompare,
  ShieldCheck,
  Compass,
  CheckCircle2,
  Sliders,
  Scale,
} from 'lucide-react';
import KpiStatCard from '../components/KpiStatCard';
import FilterPanel from '../components/FilterPanel';
import CriteriaWeightsView from '../components/CriteriaWeightsView';
import MatchingDiagnosticsPanel from '../components/MatchingDiagnosticsPanel';
import { DEFAULT_MATCHING_WEIGHTS } from '../../../services/adminApi';
import type { TimeRangeFilter } from '../types';

export const AdminMatchesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'diagnostics' | 'weights'>('diagnostics');
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('today');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  return (
    <div className="admin-page-container">
      {/* SIDEBAR NAVIGATION DRAWER */}

      {/* MOBILE TOPBAR */}

      {/* MAIN CONTENT AREA */}
      <main className="admin-main-content">
        {/* BREADCRUMB NAVIGATION */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <span className="breadcrumb-item link" onClick={() => navigate('/admin')}>
            Dashboard
          </span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item active">Matching Overview</span>
        </nav>

        {/* PAGE HEADER */}
        <div className="page-header-section">
          <div className="page-title-row">
            <div>
              <h2 className="admin-section-heading">Rule-Based Matching Overview</h2>
              <p className="admin-section-sub">
                Supervisory inspection of the deterministic multi-criteria scoring algorithm and live query diagnostic simulation.
              </p>
            </div>
          </div>
        </div>

        {/* TIMEFRAME & REFRESH FILTER PANEL */}
        <FilterPanel
          selectedRange={timeRange}
          onRangeChange={(range) => setTimeRange(range)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          className="admin-matching-filter-panel"
        />

        {/* KPI STAT CARDS ROW */}
        <div className="kpi-cards-grid-4">
          <KpiStatCard
            icon={<GitCompare size={20} />}
            iconBgColor="#e0f2fe"
            iconColor="#0284c7"
            value="4 Factors"
            label="Scoring Formula"
            sublabel="Distance, Vol, Price, Rel"
            badge={{ text: 'Fixed Rules', variant: 'neutral' }}
          />

          <KpiStatCard
            icon={<Compass size={20} />}
            iconBgColor="#dcfce7"
            iconColor="#16a34a"
            value="35% Max"
            label="Proximity Bias"
            sublabel="Freshness priority"
            badge={{ text: 'Primary', variant: 'positive' }}
          />

          <KpiStatCard
            icon={<CheckCircle2 size={20} />}
            iconBgColor="#fef3c7"
            iconColor="#d97706"
            value="94.2%"
            label="Avg Match Rate"
            sublabel="Within 15km radius"
            badge={{ text: 'Optimal', variant: 'positive' }}
          />

          <KpiStatCard
            icon={<ShieldCheck size={20} />}
            iconBgColor="#ede9fe"
            iconColor="#7c3aed"
            value="Deterministic"
            label="Algorithm Engine"
            sublabel="Auditable (Zero ML)"
            badge={{ text: 'Spec A19', variant: 'info' }}
          />
        </div>

        {/* SECTION NAVIGATION TABS */}
        <div className="matching-tabs-nav" role="tablist" aria-label="Matching Engine Tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'diagnostics'}
            className={`matching-tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagnostics')}
          >
            <Sliders size={16} />
            <span>Interactive Diagnostic Tester</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'weights'}
            className={`matching-tab-btn ${activeTab === 'weights' ? 'active' : ''}`}
            onClick={() => setActiveTab('weights')}
          >
            <Scale size={16} />
            <span>Criteria Weights & Rules</span>
          </button>
        </div>

        {/* TAB 1: DIAGNOSTIC SIMULATOR & RANKED RESULTS */}
        {activeTab === 'diagnostics' && (
          <div className="tab-pane-fade-in">
            <MatchingDiagnosticsPanel
              onNavigateFarmer={(farmerId) => navigate(`/admin/users/${farmerId}`)}
              onNavigateListing={(listingId) => navigate(`/admin/listings/${listingId}`)}
            />
          </div>
        )}

        {/* TAB 2: CRITERIA WEIGHTS & TRANSPARENT RULE SPEC */}
        {activeTab === 'weights' && (
          <div className="tab-pane-fade-in">
            <CriteriaWeightsView weights={DEFAULT_MATCHING_WEIGHTS} />
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminMatchesPage;
