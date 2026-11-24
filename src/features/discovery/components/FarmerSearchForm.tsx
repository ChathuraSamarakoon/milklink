import { useState, type FormEvent } from 'react';
import RadiusSelector from './RadiusSelector';
import GpsPermissionCard from './GpsPermissionCard';
import type { Coordinates, FarmerSearchParams } from '../types';

interface FarmerSearchFormProps {
  initialParams?: Partial<FarmerSearchParams>;
  onSearch: (params: FarmerSearchParams) => void;
  isOnline: boolean;
  loading?: boolean;
}

export default function FarmerSearchForm({
  initialParams,
  onSearch,
  isOnline,
  loading = false,
}: FarmerSearchFormProps) {
  // Today's date as minimum selectable date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // State
  const [litres, setLitres] = useState<number>(initialParams?.litres || 25);
  const [collectionDate, setCollectionDate] = useState<string>(initialParams?.collectionDate || todayStr);
  const [radiusKm, setRadiusKm] = useState<number>(initialParams?.radiusKm || 15);
  const [district, setDistrict] = useState<string>(initialParams?.district || 'Kandy');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(
    initialParams?.coordinates || { lat: 7.2906, lng: 80.6337 }
  );
  const [organicOnly, setOrganicOnly] = useState<boolean>(initialParams?.organicOnly || false);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(initialParams?.maxPrice);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleRequestGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoordinates({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGpsLoading(false);
      },
      () => {
        setGpsLoading(false);
        setGpsError('GPS permission denied. Using selected district fallback.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // 03: Behavior, validations & constraints
    if (!isOnline) {
      setValidationError('Internet connection is required to search live available farmers.');
      return;
    }

    if (!litres || litres <= 0) {
      setValidationError('Please enter a valid positive quantity of litres (e.g. 10 L or more).');
      return;
    }

    if (!collectionDate) {
      setValidationError('Please select a collection date.');
      return;
    }

    if (collectionDate < todayStr) {
      setValidationError('Collection date cannot be in the past. Please select today or a future date.');
      return;
    }

    if (!radiusKm || radiusKm <= 0) {
      setValidationError('Please select a valid search radius.');
      return;
    }

    onSearch({
      litres,
      collectionDate,
      radiusKm,
      coordinates,
      district,
      organicOnly,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800">Search Nearby Milk Supplies</h3>
          <p className="text-[11px] text-slate-500">Live matching by quantity, date and distance</p>
        </div>
        <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
          Step 1: Discover
        </span>
      </div>

      {/* Litres Input with quick chips */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Needed Milk Volume (Litres) *</span>
          <span className="text-[11px] font-extrabold text-sky-700">{litres} Litres</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            max="1000"
            step="1"
            required
            value={litres}
            onChange={(e) => setLitres(Math.max(1, Number(e.target.value)))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
            placeholder="e.g. 25"
          />
          <div className="flex gap-1 shrink-0">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setLitres(val)}
                className={`text-[11px] font-bold px-2 py-2 rounded-lg border transition ${
                  litres === val
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {val}L
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Collection Date */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
          <span>Required Collection Date *</span>
          <span className="text-[10px] text-slate-400">Today or future date</span>
        </label>
        <input
          type="date"
          min={todayStr}
          required
          value={collectionDate}
          onChange={(e) => setCollectionDate(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-sky-500 focus:bg-white"
        />
      </div>

      {/* Radius Selector */}
      <RadiusSelector value={radiusKm} onChange={setRadiusKm} />

      {/* GPS / Location Consent Card */}
      <GpsPermissionCard
        coordinates={coordinates}
        selectedDistrict={district}
        onDistrictChange={setDistrict}
        onRequestGps={handleRequestGps}
        loading={gpsLoading}
        error={gpsError}
      />

      {/* Additional Filter: Organic & Max Price */}
      <div className="pt-1 flex items-center justify-between text-xs">
        <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700 select-none">
          <input
            type="checkbox"
            checked={organicOnly}
            onChange={(e) => setOrganicOnly(e.target.checked)}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
          />
          <span>Organic Certified only</span>
        </label>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-500">Max Rs/L:</span>
          <input
            type="number"
            min="100"
            max="300"
            step="5"
            placeholder="No limit"
            value={maxPrice || ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
            className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none"
          />
        </div>
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold" role="alert">
          ⚠ {validationError}
        </div>
      )}

      {/* Primary Submit Action */}
      <button
        type="submit"
        disabled={loading || !isOnline}
        className={`w-full py-3 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-md transition ${
          loading || !isOnline
            ? 'bg-slate-300 cursor-not-allowed shadow-none'
            : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25 active:scale-[0.99]'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>{loading ? 'Searching Farmers…' : 'Search Live Available Farmers'}</span>
      </button>
    </form>
  );
}
