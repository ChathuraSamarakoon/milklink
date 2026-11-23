import type { PublicFarmerDetail } from '../../../services/farmersApi';

interface MilkAvailabilitySummaryProps {
  farmer: PublicFarmerDetail;
  requestedLitres: number;
}

export default function MilkAvailabilitySummary({
  farmer,
  requestedLitres,
}: MilkAvailabilitySummaryProps) {
  const totalVolume = farmer.availableLitres + farmer.reservedLitres;
  const availablePercent = totalVolume > 0 ? Math.round((farmer.availableLitres / totalVolume) * 100) : 100;
  const estimatedCost = farmer.pricePerLitre * requestedLitres;

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3.5 text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-sm text-slate-800">Fresh Milk Listing Offer</h3>
          <p className="text-[11px] text-slate-500">Daily batch supply & quality test values</p>
        </div>

        <span
          className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full ${
            farmer.organic
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-sky-50 text-sky-800 border border-sky-200'
          }`}
        >
          {farmer.qualityGrade}
        </span>
      </div>

      {/* Litres Availability & Capacity Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Available Stock Today:</span>
          <span className="text-sky-700 text-sm font-extrabold">{farmer.availableLitres} Litres</span>
        </div>

        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-sky-600 transition-all duration-300"
            style={{ width: `${availablePercent}%` }}
            title={`${farmer.availableLitres}L Available`}
          />
          <div
            className="h-full bg-slate-300"
            style={{ width: `${100 - availablePercent}%` }}
            title={`${farmer.reservedLitres}L Reserved`}
          />
        </div>

        <div className="flex justify-between text-[10px] text-slate-400">
          <span>{farmer.availableLitres}L Free to Order</span>
          <span>{farmer.reservedLitres}L Pre-reserved</span>
          <span>{farmer.dailyCapacity}L Total Daily Yield</span>
        </div>
      </div>

      {/* Pricing & Window Grid */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Farm-Gate Price</span>
          <span className="text-sm font-black text-sky-800">Rs. {farmer.pricePerLitre} / L</span>
          <span className="text-[10px] text-slate-500 block">Transparent fixed rate</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Collection Window</span>
          <span className="font-bold text-slate-800 text-xs block">{farmer.supplyWindow}</span>
          <span className="text-[10px] text-emerald-700 font-semibold block">{farmer.collectionDate}</span>
        </div>
      </div>

      {/* Milk Quality Metrics (Fat % and SNF %) */}
      <div className="grid grid-cols-2 gap-2 pt-0.5">
        <div className="p-2 rounded-xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600">Fat Content:</span>
          <span className="font-extrabold text-sky-900">{farmer.fatContentPercentage}%</span>
        </div>

        <div className="p-2 rounded-xl bg-sky-50/50 border border-sky-100 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-600">SNF (Solids):</span>
          <span className="font-extrabold text-sky-900">{farmer.snfPercentage}%</span>
        </div>
      </div>

      {/* Estimated order cost preview */}
      <div className="p-2.5 bg-gradient-to-r from-sky-50 to-emerald-50 rounded-xl border border-sky-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-500 block">Sample Order Preview ({requestedLitres}L):</span>
          <span className="text-xs font-black text-slate-900">Rs. {estimatedCost.toLocaleString()}</span>
        </div>
        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md">
          {farmer.availableLitres >= requestedLitres ? '✓ Full Yield Available' : 'Partial'}
        </span>
      </div>
    </div>
  );
}
