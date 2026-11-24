import type { FactorBreakdown } from '../types';

interface MatchCriteriaBreakdownProps {
  factors: {
    quantity: FactorBreakdown;
    distance: FactorBreakdown;
    price: FactorBreakdown;
    availability: FactorBreakdown;
  };
  totalScore: number;
  className?: string;
}

export default function MatchCriteriaBreakdown({
  factors,
  totalScore,
  className = '',
}: MatchCriteriaBreakdownProps) {
  const factorList = [
    { key: 'quantity', color: 'bg-emerald-500', barBg: 'bg-emerald-100', ...factors.quantity },
    { key: 'distance', color: 'bg-sky-500', barBg: 'bg-sky-100', ...factors.distance },
    { key: 'price', color: 'bg-blue-600', barBg: 'bg-blue-100', ...factors.price },
    { key: 'availability', color: 'bg-amber-500', barBg: 'bg-amber-100', ...factors.availability },
  ];

  return (
    <div className={`bg-slate-50 rounded-xl p-3 border border-slate-200/90 space-y-2.5 text-xs ${className}`}>
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
        <span className="font-extrabold text-slate-800">Criteria Score Breakdown</span>
        <span className="text-[11px] font-bold text-sky-700 bg-white px-2 py-0.5 rounded-full border border-sky-200">
          Total: {totalScore} / 100
        </span>
      </div>

      <div className="space-y-2">
        {factorList.map((f) => (
          <div key={f.key} className="space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <span className="font-bold text-slate-700">
                {f.label} <span className="text-slate-400 font-normal">({Math.round(f.weight * 100)}% weight)</span>
              </span>
              <span className="font-extrabold text-slate-800">
                +{f.weightedScore} pts <span className="text-slate-400 font-normal">({f.score}%)</span>
              </span>
            </div>

            <div className={`h-1.5 w-full rounded-full ${f.barBg} overflow-hidden`}>
              <div
                className={`h-full rounded-full ${f.color} transition-all duration-300`}
                style={{ width: `${f.score}%` }}
              />
            </div>

            <p className="text-[10px] text-slate-500 leading-tight">
              {f.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* 03: Behavior & Constraint Notice */}
      <div className="pt-1.5 border-t border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
        <span>⚖ Weighted Rule-Based Model</span>
        <span className="font-semibold text-slate-600">Non-ML • Fully Auditable</span>
      </div>
    </div>
  );
}
