export interface MonthOption {
  key: string; // e.g. 'all', '2026-11', '2026-10', '2026-09'
  label: string; // e.g. 'All Purchases', 'November 2026', 'October 2026', 'September 2026'
}

interface BuyerMonthlySummaryProps {
  selectedMonth: string;
  onSelectMonth: (monthKey: string) => void;
  months: MonthOption[];
  totalLitres: number;
  totalAmount: number;
  ordersCount: number;
  avgRatePerLitre: number;
  className?: string;
}

export default function BuyerMonthlySummary({
  selectedMonth,
  onSelectMonth,
  months,
  totalLitres,
  totalAmount,
  ordersCount,
  avgRatePerLitre,
  className = '',
}: BuyerMonthlySummaryProps) {
  const currentLabel = months.find((m) => m.key === selectedMonth)?.label || 'All Purchases';

  return (
    <div className={`space-y-3.5 ${className}`}>
      {/* Month Filter Selector (Feature 01: month filter) */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Accounting Ledger Period
          </span>
          <h3 className="font-extrabold text-xs text-slate-800">
            {currentLabel} Summary
          </h3>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => onSelectMonth(e.target.value)}
          className="text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1.5 shadow-2xs focus:outline-none focus:border-sky-500"
        >
          {months.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Grid: MonthlyLitresCard & MonthlyAmountCard (Feature 01: MonthlyLitresCard, MonthlyAmountCard) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: MonthlyLitresCard */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-xs space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-100">
              Collected Litres
            </span>
            <span className="text-base opacity-85">🥛</span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black tracking-tight">
              {totalLitres.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
            </span>
            <span className="text-xs font-bold text-sky-100">L</span>
          </div>

          <p className="text-[10px] text-sky-100 pt-1 border-t border-sky-400/50 leading-tight">
            Across <strong>{ordersCount}</strong> verified pickups
          </p>
        </div>

        {/* Card 2: MonthlyAmountCard */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xs space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
              Recorded Cash Total
            </span>
            <span className="text-base opacity-85">💵</span>
          </div>

          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xs font-bold text-slate-300">Rs.</span>
            <span className="text-2xl font-black tracking-tight">
              {totalAmount.toLocaleString()}
            </span>
          </div>

          <p className="text-[10px] text-slate-300 pt-1 border-t border-slate-700 leading-tight">
            Avg rate: <strong>Rs. {avgRatePerLitre.toFixed(1)}/L</strong>
          </p>
        </div>
      </div>

      {/* Cash Settlement Policy Notice (Feature 03: Cash is recorded, not processed digitally) */}
      <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px] text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="text-emerald-600 font-bold">✓</span> Cash Handover Reconciled
        </span>
        <span className="text-[10px] text-slate-400 font-medium">
          No credit card processing fees
        </span>
      </div>
    </div>
  );
}
