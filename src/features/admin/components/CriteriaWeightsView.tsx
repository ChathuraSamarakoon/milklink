import React from 'react';
import { ShieldCheck, MapPin, Scale, DollarSign, Award, Info, Lock } from 'lucide-react';
import type { MatchingCriteriaWeights } from '../types';

interface CriteriaWeightsViewProps {
  weights: MatchingCriteriaWeights;
  className?: string;
}

export const CriteriaWeightsView: React.FC<CriteriaWeightsViewProps> = ({
  weights,
  className = '',
}) => {
  const criteriaList = [
    {
      id: 'distance',
      name: 'Geographical Proximity (Distance)',
      weight: weights.distanceWeight,
      color: '#0284c7', // Sky Blue
      bgColor: '#e0f2fe',
      icon: <MapPin size={18} />,
      metric: 'Max 35 Points',
      objective: 'Minimize transit time & cold-chain spoilage risk',
      formula: 'Score_dist = 35 × max(0, 1 - (Distance / SearchRadius × 0.75))',
      rules: [
        'Proximity directly correlates to milk freshness and lower transport fuel cost.',
        'Privacy protection: Farmer homestead GPS coordinates are obfuscated to Division level.',
        'Beyond 1.5× search radius, proximity score drops to zero.',
      ],
    },
    {
      id: 'quantity',
      name: 'Batch Volume Fulfillment (Quantity)',
      weight: weights.quantityWeight,
      color: '#16a34a', // Emerald Green
      bgColor: '#dcfce7',
      icon: <Scale size={18} />,
      metric: 'Max 30 Points',
      objective: 'Match buyer requested volume without order fragmentation',
      formula: 'Score_qty = 30 × min(1.0, AvailableLitres / RequestedLitres)',
      rules: [
        'Full 30 points awarded if candidate yield satisfies 100% of requested volume.',
        'Partial allocation receives proportional score to encourage single-source pickups.',
        'Prevents over-allocation by accounting for active stock reservations.',
      ],
    },
    {
      id: 'price',
      name: 'Fair Unit Price Competitiveness',
      weight: weights.priceWeight,
      color: '#d97706', // Amber
      bgColor: '#fef3c7',
      icon: <DollarSign size={18} />,
      metric: 'Max 20 Points',
      objective: 'Encourage fair smallholder pricing aligned with Dairy Board benchmarks',
      formula: 'Score_price = max(4, min(20, 20 - (UnitPrice - 210) × 0.6))',
      rules: [
        'Benchmark reference set at Rs. 210.00 / Litre (National Dairy standard).',
        'Transparent pricing avoids speculative surge premiums for rural buyers.',
        'Preserves farmer margin while protecting cooperative buyers.',
      ],
    },
    {
      id: 'availability',
      name: 'Smallholder Reliability & Quality Rating',
      weight: weights.availabilityWeight,
      color: '#7c3aed', // Purple
      bgColor: '#ede9fe',
      icon: <Award size={18} />,
      metric: 'Max 15 Points',
      objective: 'Prioritize consistent yield delivery and quality compliance',
      formula: 'Score_rel = 15 × (FulfillmentRate% / 100) × SessionBonus',
      rules: [
        'Historical fulfillment rate derived from successfully completed collector pickups.',
        'Includes milking session compatibility (Morning vs Evening chilling schedule).',
        'Rewards verified smallholder farmers with consistent collection track records.',
      ],
    },
  ];

  const totalWeight =
    weights.distanceWeight +
    weights.quantityWeight +
    weights.priceWeight +
    weights.availabilityWeight;

  return (
    <div className={`criteria-weights-view ${className}`}>
      {/* DETERMINISTIC ALGORITHM BANNER */}
      <div className="rule-engine-banner">
        <div className="rule-banner-icon-box">
          <ShieldCheck size={24} className="banner-shield-icon" />
        </div>
        <div className="rule-banner-content">
          <div className="rule-banner-tag-row">
            <span className="rule-engine-pill">DETERMINISTIC RULE ENGINE</span>
            <span className="rule-no-ml-pill">100% Non-ML / Non-Black-Box</span>
          </div>
          <h3 className="rule-banner-title">Transparent Multi-Criteria Scoring (A19)</h3>
          <p className="rule-banner-desc">
            The MilkLink matching engine matches milk buyers and dairy smallholders strictly through
            deterministic weighted criteria. There are <strong>no machine learning models, generative algorithms, or neural networks</strong> in compliance with project specification A19. Every match score is 100% auditable, reproducible, and explainable to farmers and buyers.
          </p>
        </div>
      </div>

      {/* WEIGHTS SUMMARY BAR */}
      <div className="weights-gauge-card">
        <div className="gauge-card-header">
          <div>
            <h4 className="gauge-title">Rule Scoring Weight Distribution</h4>
            <p className="gauge-subtitle">Cumulative factor balance: Total {totalWeight}%</p>
          </div>
          <div className="gauge-status-badge">
            <Lock size={12} />
            <span>Read-Only Policy Constant</span>
          </div>
        </div>

        {/* Multi-segment progress bar */}
        <div className="multi-weight-bar" aria-label="Weights breakdown bar">
          <div
            className="bar-segment"
            style={{ width: `${weights.distanceWeight}%`, backgroundColor: '#0284c7' }}
            title={`Distance: ${weights.distanceWeight}%`}
          />
          <div
            className="bar-segment"
            style={{ width: `${weights.quantityWeight}%`, backgroundColor: '#16a34a' }}
            title={`Quantity: ${weights.quantityWeight}%`}
          />
          <div
            className="bar-segment"
            style={{ width: `${weights.priceWeight}%`, backgroundColor: '#d97706' }}
            title={`Price: ${weights.priceWeight}%`}
          />
          <div
            className="bar-segment"
            style={{ width: `${weights.availabilityWeight}%`, backgroundColor: '#7c3aed' }}
            title={`Reliability: ${weights.availabilityWeight}%`}
          />
        </div>

        {/* Legend */}
        <div className="weights-legend-grid">
          {criteriaList.map((item) => (
            <div key={item.id} className="legend-chip">
              <span className="legend-dot" style={{ backgroundColor: item.color }} />
              <span className="legend-name">{item.name.split(' (')[0]}</span>
              <strong className="legend-val">{item.weight}%</strong>
            </div>
          ))}
        </div>
      </div>

      {/* 4 CRITERIA DETAILED CARDS */}
      <div className="criteria-cards-grid">
        {criteriaList.map((c) => (
          <div key={c.id} className="criterion-card">
            <div className="criterion-card-header">
              <div
                className="criterion-icon-wrapper"
                style={{ backgroundColor: c.bgColor, color: c.color }}
              >
                {c.icon}
              </div>
              <div className="criterion-title-wrap">
                <div className="criterion-name-row">
                  <h4 className="criterion-name">{c.name}</h4>
                </div>
                <span className="criterion-obj">{c.objective}</span>
              </div>
              <div className="criterion-weight-tag" style={{ color: c.color, borderColor: c.color }}>
                {c.weight}%
              </div>
            </div>

            <div className="criterion-formula-box">
              <div className="formula-label">Deterministic Formula:</div>
              <code className="formula-code">{c.formula}</code>
            </div>

            <div className="criterion-rules-list">
              {c.rules.map((rule, idx) => (
                <div key={idx} className="criterion-rule-item">
                  <span className="rule-bullet">•</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* POLICY & CONSTRAINTS FOOTNOTE */}
      <div className="admin-policy-alert">
        <Info size={16} className="policy-shield-icon" />
        <div className="policy-callout-text">
          <strong>Administrative Governance Note:</strong>
          <p>
            Weighted ranking criteria are strictly <strong>quantity, distance, price, and availability</strong>. Admin editing of weights is not defined in the MilkLink proposal and is intentionally locked to ensure absolute market fairness and non-discriminatory matching for rural Sri Lankan smallholders.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriteriaWeightsView;
