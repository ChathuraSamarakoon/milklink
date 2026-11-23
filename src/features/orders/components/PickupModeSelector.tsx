interface PickupModeSelectorProps {
  selectedMode: 'collector' | 'self';
  onSelectMode: (mode: 'collector' | 'self') => void;
  className?: string;
}

export default function PickupModeSelector({
  selectedMode,
  onSelectMode,
  className = '',
}: PickupModeSelectorProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Collection Logistics Mode
        </span>
        <span className="text-[10px] text-sky-700 font-extrabold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
          Proposal Rule B27–B29
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Option 1: Registered Collector */}
        <button
          type="button"
          onClick={() => onSelectMode('collector')}
          className={`p-3.5 rounded-2xl border text-left transition-all relative ${
            selectedMode === 'collector'
              ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-1 ring-sky-400'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          {selectedMode === 'collector' && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </span>
          )}

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🚚</span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                Registered Collector
              </h4>
              <span className="text-[10px] text-emerald-700 font-bold block">
                Recommended Cold-Chain
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug">
            A verified MilkLink transporter collects the milk using insulated, refrigerated tanks and delivers directly to your receiving point.
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-sky-900 font-semibold">
            <span>❄️</span> Insulated Tanks • Temperature Monitored
          </div>
        </button>

        {/* Option 2: Buyer Self-Pickup */}
        <button
          type="button"
          onClick={() => onSelectMode('self')}
          className={`p-3.5 rounded-2xl border text-left transition-all relative ${
            selectedMode === 'self'
              ? 'border-sky-500 bg-sky-50/70 shadow-sm ring-1 ring-sky-400'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          {selectedMode === 'self' && (
            <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </span>
          )}

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🏬</span>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                Buyer Self-Pickup
              </h4>
              <span className="text-[10px] text-slate-500 font-bold block">
                Pickup at Farm Gate
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-snug">
            You collect the ordered volume directly from the dairy farm gate using your own sanitized containers during the agreed supply window.
          </p>

          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center gap-1.5 text-[10px] text-amber-800 font-semibold">
            <span>⚠️</span> Farm Gate Clearance Pass Required
          </div>
        </button>
      </div>

      {/* Feature 03 Constraint Notice: Self-pickup is allowed by proposal, but collection-entry permission needs clarification */}
      {selectedMode === 'self' && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs text-amber-950 space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-[11px] text-amber-900">
            <span>🛡️</span> Collection-Entry Permission Protocol
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Self-pickup is approved under MilkLink protocols. However, per dairy farm bio-security standards, you must present the digital Order Reference and arrive with sanitized, food-grade milk cans. Farm entry clearance is valid exclusively within the confirmed morning window.
          </p>
        </div>
      )}
    </div>
  );
}
