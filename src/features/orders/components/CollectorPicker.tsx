import { useState, useMemo } from 'react';
import type { MilkCollector } from '../../buyer/data';

interface CollectorPickerProps {
  collectors: MilkCollector[];
  selectedCollectorId: string | null;
  onSelectCollector: (collector: MilkCollector) => void;
  className?: string;
}

export default function CollectorPicker({
  collectors,
  selectedCollectorId,
  onSelectCollector,
  className = '',
}: CollectorPickerProps) {
  const [filterZone, setFilterZone] = useState<string>('all');

  const zones = useMemo(() => {
    const list = Array.from(new Set(collectors.map((c) => c.currentZone.split(' / ')[0])));
    return ['all', ...list];
  }, [collectors]);

  const filteredCollectors = useMemo(() => {
    if (filterZone === 'all') return collectors;
    return collectors.filter((c) => c.currentZone.toLowerCase().includes(filterZone.toLowerCase()));
  }, [collectors, filterZone]);

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Certified Transporters ({filteredCollectors.length})
          </span>
          <p className="text-[11px] text-slate-500">
            Select a verified collector on the morning route
          </p>
        </div>

        {/* Zone quick filter */}
        <select
          value={filterZone}
          onChange={(e) => setFilterZone(e.target.value)}
          className="text-xs font-bold text-slate-700 bg-slate-100 rounded-lg px-2 py-1 border border-slate-200 focus:outline-none"
        >
          <option value="all">All Zones</option>
          {zones.filter((z) => z !== 'all').map((z) => (
            <option key={z} value={z}>
              Zone: {z}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2.5">
        {filteredCollectors.map((collector) => {
          const isSelected = selectedCollectorId === collector.id;

          return (
            <div
              key={collector.id}
              onClick={() => onSelectCollector(collector)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-sky-500 bg-sky-50/80 shadow-xs ring-1 ring-sky-400'
                  : 'border-slate-200/90 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              {/* Radio selection circle */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <span className="text-[10px] font-bold">✓</span>}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {collector.name}
                      </h4>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100/70 px-1.5 py-0.2 rounded">
                        ✓ Registered
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {collector.vehicleType}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-600">
                      <span className="flex items-center gap-0.5 font-bold text-amber-600">
                        ★ {collector.rating.toFixed(1)}
                        <span className="text-[10px] text-slate-400 font-normal">
                          ({collector.tripsCount} runs)
                        </span>
                      </span>

                      <span>•</span>

                      <span className="flex items-center gap-1">
                        📍 <strong>{collector.currentZone}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 block">
                    ETA ~{collector.etaMinutes} mins
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    📞 {collector.phone}
                  </span>
                </div>
              </div>

              {/* Cold-Chain assurance row */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="text-sky-600 font-bold">❄️</span> Insulated 4°C chilled tank verified
                </span>
                <span className="font-semibold text-slate-600">
                  {isSelected ? 'Selected Transporter' : 'Tap to select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
