import { Icon } from '../../auth/components/AuthUI';
import { districts } from '../../shared/lib/demoData';
import type { Coordinates } from '../types';

interface GpsPermissionCardProps {
  coordinates: Coordinates | null;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  onRequestGps: () => void;
  loading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

export default function GpsPermissionCard({
  coordinates,
  selectedDistrict,
  onDistrictChange,
  onRequestGps,
  loading = false,
  error,
  disabled = false,
}: GpsPermissionCardProps) {
  const hasGps = !!coordinates;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${hasGps ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-sky-700'}`}>
            <Icon name="pin" size={17} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800">Delivery Location & Radius</h4>
            <p className="text-[11px] text-slate-500">
              {hasGps ? 'GPS coordinates active' : 'District fallback selected'}
            </p>
          </div>
        </div>

        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
          hasGps ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
        }`}>
          {hasGps ? 'GPS Consented' : 'Manual Area'}
        </span>
      </div>

      {hasGps ? (
        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-xs">
          <span className="font-semibold text-emerald-900">
            📍 {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)} ({selectedDistrict})
          </span>
          <button
            type="button"
            onClick={onRequestGps}
            className="text-[11px] font-bold text-emerald-700 underline hover:text-emerald-900"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={selectedDistrict}
              onChange={(e) => onDistrictChange(e.target.value)}
              disabled={disabled}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-sky-500"
            >
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={onRequestGps}
              disabled={disabled || loading}
              className="px-3 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Icon name="pin" size={14} />
              <span>{loading ? 'Locating…' : 'Use GPS'}</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
          ⚠ {error}
        </p>
      )}

      <p className="text-[10px] text-slate-400 leading-relaxed">
        🔒 Privacy notice: Exact coordinates remain private until you confirm an order with a nearby farmer.
      </p>
    </div>
  );
}
