import type { FarmerSearchResult } from '../types';

interface FarmerResultCardProps {
  farmer: FarmerSearchResult;
  requestedLitres: number;
  onSelect: (farmer: FarmerSearchResult) => void;
  onOrderNow?: (farmer: FarmerSearchResult) => void;
}

export default function FarmerResultCard({
  farmer,
  requestedLitres,
  onSelect,
  onOrderNow,
}: FarmerResultCardProps) {
  const estimatedTotal = farmer.pricePerLitre * (requestedLitres || 1);
  const fulfillsLitres = farmer.availableLitres >= requestedLitres;

  return (
    <div
      className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:border-sky-300 hover:shadow-md transition-all cursor-pointer space-y-3"
      onClick={() => onSelect(farmer)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            src={farmer.image}
            alt={farmer.farmName}
            className="w-13 h-13 rounded-full object-cover border-2 border-sky-100 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
            }}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-slate-900 leading-tight">
                {farmer.farmName}
              </h3>
              {farmer.verified && (
                <span className="text-sky-600 font-bold text-xs" title="Verified Producer">
                  ✓
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {farmer.ownerName} • {farmer.village}, {farmer.district}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                📍 {farmer.distanceKm.toFixed(1)} km away
              </span>
              <span className="text-[11px] text-amber-500 font-bold flex items-center gap-0.5">
                ★ {farmer.rating.toFixed(1)} <span className="text-slate-400 font-normal">({farmer.reviewsCount})</span>
              </span>
            </div>
          </div>
        </div>

        <span
          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${
            farmer.organic
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-sky-50 text-sky-700 border border-sky-200'
          }`}
        >
          {farmer.qualityGrade}
        </span>
      </div>

      {/* Litres Availability & Price Row */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-slate-500 text-[11px] block">Available Today:</span>
          <span className={`font-bold ${fulfillsLitres ? 'text-slate-800' : 'text-amber-700'}`}>
            {farmer.availableLitres} Litres
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Window: {farmer.supplyWindow}
          </span>
        </div>

        <div className="text-right">
          <span className="text-slate-500 text-[11px] block">Price per Litre:</span>
          <span className="font-bold text-sky-700 text-sm">Rs. {farmer.pricePerLitre} / L</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Est: Rs. {estimatedTotal.toLocaleString()} for {requestedLitres}L
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-0.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(farmer);
          }}
          className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
        >
          Farm Details
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onOrderNow) {
              onOrderNow(farmer);
            } else {
              onSelect(farmer);
            }
          }}
          className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-xs transition"
        >
          Order {requestedLitres}L Now
        </button>
      </div>
    </div>
  );
}
