import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
  User,
  ExternalLink,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Droplet,
  Compass,
} from 'lucide-react';
import type { SampleMatchQuery, RankedMatchResult } from '../types';
import {
  DEFAULT_SAMPLE_MATCH_QUERY,
  runSampleMatchSimulation,
} from '../../../services/adminApi';

interface MatchingDiagnosticsPanelProps {
  onNavigateFarmer: (farmerId: string) => void;
  onNavigateListing?: (listingId: string) => void;
  className?: string;
}

export const MatchingDiagnosticsPanel: React.FC<MatchingDiagnosticsPanelProps> = ({
  onNavigateFarmer,
  onNavigateListing,
  className = '',
}) => {
  // Query Form State
  const [query, setQuery] = useState<SampleMatchQuery>({ ...DEFAULT_SAMPLE_MATCH_QUERY });
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<RankedMatchResult[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [expandedRank, setExpandedRank] = useState<number | null>(1); // Default expand rank 1

  // Run initial simulation on mount
  useEffect(() => {
    executeSimulation(query);
  }, []);

  const executeSimulation = async (params: SampleMatchQuery) => {
    setIsRunning(true);
    try {
      const matchResults = await runSampleMatchSimulation(params);
      setResults(matchResults);
      setHasRun(true);
      // Auto expand top match
      if (matchResults.length > 0) {
        setExpandedRank(matchResults[0].rank);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    const defaultQuery = { ...DEFAULT_SAMPLE_MATCH_QUERY };
    setQuery(defaultQuery);
    executeSimulation(defaultQuery);
  };

  const toggleExpand = (rank: number) => {
    setExpandedRank((prev) => (prev === rank ? null : rank));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#16a34a'; // Emerald
    if (score >= 75) return '#0284c7'; // Sky blue
    if (score >= 60) return '#d97706'; // Amber
    return '#dc2626'; // Red
  };

  const getScoreBadgeClass = (score: number) => {
    if (score >= 90) return 'match-badge-emerald';
    if (score >= 75) return 'match-badge-blue';
    if (score >= 60) return 'match-badge-amber';
    return 'match-badge-neutral';
  };

  return (
    <div className={`matching-diagnostics-panel ${className}`}>
      {/* TESTER QUERY CONTROLS CARD */}
      <div className="diagnostics-query-card">
        <div className="query-card-header">
          <div className="query-card-title-group">
            <div className="query-icon-box">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="query-card-title">Diagnostic Query Simulator</h3>
              <p className="query-card-sub">
                Test multi-criteria matching behavior against active regional smallholder yields
              </p>
            </div>
          </div>
          <button
            type="button"
            className="query-reset-btn"
            onClick={handleReset}
            disabled={isRunning}
            title="Reset to default benchmark parameters"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
        </div>

        <form
          className="query-form-grid"
          onSubmit={(e) => {
            e.preventDefault();
            executeSimulation(query);
          }}
        >
          {/* Requested Litres Slider & Input */}
          <div className="query-form-group">
            <div className="query-label-row">
              <label htmlFor="req-litres">Requested Volume</label>
              <span className="query-val-indicator">{query.requestedLitres} Litres</span>
            </div>
            <div className="query-slider-input-combo">
              <input
                id="req-litres"
                type="range"
                min="10"
                max="200"
                step="5"
                value={query.requestedLitres}
                onChange={(e) =>
                  setQuery((prev) => ({ ...prev, requestedLitres: Number(e.target.value) }))
                }
                className="query-range-slider"
              />
              <input
                type="number"
                min="5"
                max="500"
                value={query.requestedLitres}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    requestedLitres: Math.max(1, Number(e.target.value)),
                  }))
                }
                className="query-number-input"
                aria-label="Requested milk volume in litres"
              />
            </div>
            <span className="field-hint">Buyer batch requirement</span>
          </div>

          {/* Max Radius Slider & Input */}
          <div className="query-form-group">
            <div className="query-label-row">
              <label htmlFor="max-radius">Search Radius</label>
              <span className="query-val-indicator">{query.maxRadiusKm} km</span>
            </div>
            <div className="query-slider-input-combo">
              <input
                id="max-radius"
                type="range"
                min="2"
                max="40"
                step="1"
                value={query.maxRadiusKm}
                onChange={(e) =>
                  setQuery((prev) => ({ ...prev, maxRadiusKm: Number(e.target.value) }))
                }
                className="query-range-slider"
              />
              <input
                type="number"
                min="1"
                max="100"
                value={query.maxRadiusKm}
                onChange={(e) =>
                  setQuery((prev) => ({
                    ...prev,
                    maxRadiusKm: Math.max(1, Number(e.target.value)),
                  }))
                }
                className="query-number-input"
                aria-label="Maximum search radius in kilometers"
              />
            </div>
            <span className="field-hint">Max pickup distance from collection hub</span>
          </div>

          {/* Preferred Session Selection */}
          <div className="query-form-group">
            <label className="query-group-label">Milking Session Preference</label>
            <div className="session-pill-selector" role="radiogroup" aria-label="Milking Session">
              <button
                type="button"
                role="radio"
                aria-checked={query.preferredSession === 'any'}
                className={`session-pill ${query.preferredSession === 'any' ? 'active' : ''}`}
                onClick={() => setQuery((prev) => ({ ...prev, preferredSession: 'any' }))}
              >
                Any Session
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={query.preferredSession === 'morning'}
                className={`session-pill ${query.preferredSession === 'morning' ? 'active' : ''}`}
                onClick={() => setQuery((prev) => ({ ...prev, preferredSession: 'morning' }))}
              >
                Morning
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={query.preferredSession === 'evening'}
                className={`session-pill ${query.preferredSession === 'evening' ? 'active' : ''}`}
                onClick={() => setQuery((prev) => ({ ...prev, preferredSession: 'evening' }))}
              >
                Evening
              </button>
            </div>
            <span className="field-hint">Filter candidate batch milking slot</span>
          </div>

          {/* Collection Date */}
          <div className="query-form-group">
            <label htmlFor="coll-date" className="query-group-label">
              Target Collection Date
            </label>
            <input
              id="coll-date"
              type="date"
              value={query.collectionDate}
              onChange={(e) => setQuery((prev) => ({ ...prev, collectionDate: e.target.value }))}
              className="query-date-input"
            />
            <span className="field-hint">Scheduled dispatch window</span>
          </div>

          {/* Submit Action Button */}
          <div className="query-submit-col">
            <button
              type="submit"
              disabled={isRunning}
              className={`run-diagnostic-btn ${isRunning ? 'running' : ''}`}
            >
              <Play size={16} fill="currentColor" />
              <span>{isRunning ? 'Calculating Scores...' : 'Run Match Simulation'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SIMULATION SUMMARY STATS BAR */}
      <div className="simulation-stats-bar">
        <div className="stat-pill-item">
          <span className="stat-label">Model:</span>
          <span className="stat-value-badge">Rule-Based Deterministic</span>
        </div>
        <div className="stat-pill-item">
          <span className="stat-label">Matches Found:</span>
          <span className="stat-count-badge">{results.length} Eligible</span>
        </div>
        <div className="stat-pill-item">
          <span className="stat-label">Evaluated Radius:</span>
          <span className="stat-meta">{query.maxRadiusKm} km window</span>
        </div>
      </div>

      {/* RANKED RESULTS LIST */}
      <div className="ranked-results-section">
        <div className="ranked-results-header">
          <h4 className="ranked-section-title">Ranked Matching Results</h4>
          <span className="ranked-section-subtitle">
            Ranked descending by multi-criteria compliance score
          </span>
        </div>

        {results.length === 0 ? (
          <div className="no-matches-found">
            <AlertCircle size={32} className="no-matches-icon" />
            <h5>No Smallholders Match Current Search Criteria</h5>
            <p>
              No active listings found within {query.maxRadiusKm} km yielding {query.requestedLitres} Litres. Try expanding the search radius or adjusting volume.
            </p>
          </div>
        ) : (
          <div className="ranked-cards-stack">
            {results.map((match) => {
              const isExpanded = expandedRank === match.rank;
              const isTop = match.rank === 1;

              return (
                <div
                  key={`${match.farmerId}-${match.listingId}`}
                  className={`ranked-match-card ${isTop ? 'top-match-card' : ''}`}
                >
                  {/* CARD HEADER */}
                  <div className="match-card-main-row">
                    <div className="match-rank-badge-col">
                      <div className={`rank-circle ${isTop ? 'top-rank' : ''}`}>
                        #{match.rank}
                      </div>
                      {isTop && <span className="top-match-pill">TOP MATCH</span>}
                    </div>

                    <div className="match-farmer-info-col">
                      <div className="farmer-name-row">
                        <button
                          type="button"
                          className="farmer-link-btn"
                          onClick={() => onNavigateFarmer(match.farmerId)}
                          title={`View profile for ${match.farmerName}`}
                        >
                          <User size={15} />
                          <strong>{match.farmerName}</strong>
                        </button>
                        {match.farmerRating && (
                          <span className="farmer-star-tag">★ {match.farmerRating}</span>
                        )}
                      </div>

                      {/* Privacy-Preserved Location */}
                      <div className="farmer-loc-row">
                        <MapPin size={13} className="loc-pin-icon" />
                        <span className="farmer-div-text">
                          {match.division}, {match.district}
                        </span>
                        <span className="dist-sep">•</span>
                        <span className="dist-km-text">
                          {match.approxDistanceKm} km away
                        </span>
                      </div>
                    </div>

                    {/* MATCH SCORE PILL */}
                    <div className="match-score-col">
                      <div
                        className={`match-score-bubble ${getScoreBadgeClass(match.totalScore)}`}
                      >
                        <span className="score-number">{match.totalScore}%</span>
                        <span className="score-subtext">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* KEY METRICS SUMMARY ROW */}
                  <div className="match-metrics-chips-row">
                    <div className="metric-chip">
                      <Droplet size={13} className="chip-icon-drop" />
                      <span>Yield: <strong>{match.availableLitres} L</strong></span>
                    </div>
                    <div className="metric-chip">
                      <span>Rate: <strong>Rs. {match.unitPriceLkr.toFixed(2)}/L</strong></span>
                    </div>
                    {match.estimatedCostLkr && (
                      <div className="metric-chip highlight-chip">
                        <span>Est. Batch: <strong>Rs. {match.estimatedCostLkr.toLocaleString()}</strong></span>
                      </div>
                    )}
                    {match.farmerFulfillmentRate && (
                      <div className="metric-chip">
                        <span>Reliability: <strong>{match.farmerFulfillmentRate}%</strong></span>
                      </div>
                    )}
                  </div>

                  {/* SCORE BREAKDOWN ACCORDION TOGGLE */}
                  <button
                    type="button"
                    className="score-breakdown-toggle"
                    onClick={() => toggleExpand(match.rank)}
                    aria-expanded={isExpanded}
                  >
                    <span>
                      {isExpanded ? 'Hide' : 'Inspect'} 4-Factor Deterministic Score Breakdown
                    </span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* EXPANDED ACCORDION PANEL */}
                  {isExpanded && (
                    <div className="score-breakdown-expanded-panel">
                      <div className="factor-meters-grid">
                        {/* Distance Factor */}
                        <div className="factor-meter-item">
                          <div className="meter-head">
                            <span className="meter-name">1. Distance Factor (35%)</span>
                            <strong className="meter-score">
                              {match.scoreBreakdown.distanceScore} / 35 pts
                            </strong>
                          </div>
                          <div className="meter-bar-track">
                            <div
                              className="meter-bar-fill"
                              style={{
                                width: `${(match.scoreBreakdown.distanceScore / 35) * 100}%`,
                                backgroundColor: '#0284c7',
                              }}
                            />
                          </div>
                          <span className="meter-caption">
                            {match.approxDistanceKm} km from hub vs {query.maxRadiusKm} km limit
                          </span>
                        </div>

                        {/* Quantity Factor */}
                        <div className="factor-meter-item">
                          <div className="meter-head">
                            <span className="meter-name">2. Volume Factor (30%)</span>
                            <strong className="meter-score">
                              {match.scoreBreakdown.quantityScore} / 30 pts
                            </strong>
                          </div>
                          <div className="meter-bar-track">
                            <div
                              className="meter-bar-fill"
                              style={{
                                width: `${(match.scoreBreakdown.quantityScore / 30) * 100}%`,
                                backgroundColor: '#16a34a',
                              }}
                            />
                          </div>
                          <span className="meter-caption">
                            {match.availableLitres} L yield for {query.requestedLitres} L request
                          </span>
                        </div>

                        {/* Price Factor */}
                        <div className="factor-meter-item">
                          <div className="meter-head">
                            <span className="meter-name">3. Price Factor (20%)</span>
                            <strong className="meter-score">
                              {match.scoreBreakdown.priceScore} / 20 pts
                            </strong>
                          </div>
                          <div className="meter-bar-track">
                            <div
                              className="meter-bar-fill"
                              style={{
                                width: `${(match.scoreBreakdown.priceScore / 20) * 100}%`,
                                backgroundColor: '#d97706',
                              }}
                            />
                          </div>
                          <span className="meter-caption">
                            Rs. {match.unitPriceLkr.toFixed(2)}/L vs Rs. 210 benchmark
                          </span>
                        </div>

                        {/* Reliability Factor */}
                        <div className="factor-meter-item">
                          <div className="meter-head">
                            <span className="meter-name">4. Reliability Factor (15%)</span>
                            <strong className="meter-score">
                              {match.scoreBreakdown.availabilityScore} / 15 pts
                            </strong>
                          </div>
                          <div className="meter-bar-track">
                            <div
                              className="meter-bar-fill"
                              style={{
                                width: `${(match.scoreBreakdown.availabilityScore / 15) * 100}%`,
                                backgroundColor: '#7c3aed',
                              }}
                            />
                          </div>
                          <span className="meter-caption">
                            {match.farmerFulfillmentRate}% on-time collection record
                          </span>
                        </div>
                      </div>

                      {/* Rule Explanation Box */}
                      <div className="deterministic-calc-box">
                        <div className="calc-title-row">
                          <CheckCircle2 size={14} className="calc-check-icon" />
                          <span>Audit Calculation Proof:</span>
                        </div>
                        <p className="calc-explanation-text">{match.scoreExplanation}</p>
                      </div>

                      {/* Actions Row */}
                      <div className="match-actions-footer">
                        <button
                          type="button"
                          className="match-primary-action-btn"
                          onClick={() => onNavigateFarmer(match.farmerId)}
                        >
                          <User size={15} />
                          <span>View Matched Farmer Details</span>
                        </button>

                        {onNavigateListing && (
                          <button
                            type="button"
                            className="match-secondary-action-btn"
                            onClick={() => onNavigateListing(match.listingId)}
                          >
                            <ExternalLink size={14} />
                            <span>Inspect Listing</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingDiagnosticsPanel;
