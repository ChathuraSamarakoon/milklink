import { useState } from 'react';
import MatchCriteriaBreakdown from './MatchCriteriaBreakdown';
import type { RankedMatch } from '../types';

interface MatchCardProps {
  match: RankedMatch;
  requestedLitres: number;
  onSelect: (match: RankedMatch) => void;
  onViewFarm: (farmerId: string) => void;
}

export default function MatchCard({
  match,
  requestedLitres,
  onSelect,
  onViewFarm,
}: MatchCardProps) {
  const { farmer, rank, totalScore, factors } = match;
  const [showBreakdown, setShowBreakdown] = useState(false);

  const isTopMatch = rank === 1;
  const estimatedCost = farmer.pricePerLitre * (requestedLitres || 1);

  return (
    <div
      className={`bg-white rounded-2xl p-4 border transition-all space-y-3 ${
        isTopMatch
          ? 'border-sky-400 shadow-md ring-1 ring-sky-300/50'
          : 'border-slate-200/90 shadow-xs hover:border-sky-300'
      }`}
    >
      {/* Header: Rank + Score + Farm summary */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={farmer.image}
              alt={farmer.farmName}
              className="w-13 h-13 rounded-full object-cover border-2 border-sky-100 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
              }}
            />
            <span
              className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-xs ${
                isTopMatch
                  ? 'bg-amber-500 ring-2 ring-white'
                  : rank === 2
                  ? 'bg-slate-500 ring-2 ring-white'
                  : 'bg-sky-600 ring-2 ring-white'
              }`}
            >
              #{rank}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                {farmer.farmName}
              </h3>
              {farmer.verified && (
                <span className="text-sky-600 font-bold text-xs" title="Verified Dairy Farm">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {farmer.ownerName} • {farmer.village}, {farmer.district}
            </p>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-600">
              <span className="font-semibold">📍 {farmer.distanceKm.toFixed(1)} km away</span>
              <span className="text-amber-500 font-bold">★ {farmer.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Overall Match Score Badge */}
        <div className="text-right shrink-0">
          <div
            className={`inline-flex flex-col items-center px-2.5 py-1 rounded-xl font-extrabold ${
              totalScore >= 90
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : totalScore >= 80
                ? 'bg-sky-50 text-sky-800 border border-sky-200'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <span className="text-base leading-none font-black">{totalScore}%</span>
            <span className="text-[9px] uppercase tracking-wider font-bold">Match</span>
          </div>
        </div>
      </div>

      {/* 4 Weighted Metrics Grid (Price, Distance, Quantity Fit, Date Availability) */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Quantity Fit (30%)</span>
          <span className="font-bold text-slate-800">
            {farmer.availableLitres}L Available
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold block">
            {factors.quantity.score}% volume fit
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Price (25%)</span>
          <span className="font-extrabold text-sky-700">Rs. {farmer.pricePerLitre}/L</span>
          <span className="text-[10px] text-slate-400 block">
            Est: Rs. {estimatedCost.toLocaleString()} ({requestedLitres}L)
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Distance (30%)</span>
          <span className="font-bold text-slate-800">~{farmer.distanceKm.toFixed(1)} km</span>
          <span className="text-[10px] text-slate-500 block">Local transit route</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Availability (15%)</span>
          <span className="font-bold text-slate-800">{farmer.collectionDate}</span>
          <span className="text-[10px] text-slate-500 block">{farmer.supplyWindow}</span>
        </div>
      </div>

      {/* Criteria Breakdown Accordion Toggle */}
      <button
        type="button"
        onClick={() => setShowBreakdown((prev) => !prev)}
        className="w-full flex items-center justify-between text-[11px] font-bold text-sky-700 hover:text-sky-900 px-1 py-0.5"
      >
        <span>{showBreakdown ? 'Hide score breakdown' : 'Why this match score? (Criteria Explanation)'}</span>
        <span className="text-xs">{showBreakdown ? '▲' : '▼'}</span>
      </button>

      {/* 01: Criteria Breakdown */}
      {showBreakdown && (
        <MatchCriteriaBreakdown factors={factors} totalScore={totalScore} />
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          onClick={() => onViewFarm(farmer.farmerId)}
          className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
        >
          Farm Details
        </button>

        <button
          type="button"
          onClick={() => onSelect(match)}
          className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition"
        >
          Select Match & Order
        </button>
      </div>
    </div>
  );
}
