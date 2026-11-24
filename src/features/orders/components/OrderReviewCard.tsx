import type { ReviewOrderDetails } from '../types';

interface OrderReviewCardProps {
  details: ReviewOrderDetails;
  onEditQuantity?: () => void;
}

export default function OrderReviewCard({
  details,
  onEditQuantity,
}: OrderReviewCardProps) {
  const {
    farmerName,
    farmerVillage,
    farmerDistrict,
    farmerImage,
    requestedLitres,
    collectionDate,
    quotedPricePerLitre,
    calculatedEstimate,
    collectionType,
    deliveryAddress,
    specialInstructions,
    availableStockSnapshot,
  } = details;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4 text-xs">
      {/* Selected Farmer Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={farmerImage || '/images/farm-green-valley.jpg'}
            alt={farmerName}
            className="w-13 h-13 rounded-full object-cover border-2 border-sky-100 shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
            }}
          />
          <div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              Selected Supplier
            </span>
            <h3 className="font-extrabold text-sm text-slate-900">{farmerName}</h3>
            <p className="text-[11px] text-slate-500">{farmerVillage}, {farmerDistrict}</p>
          </div>
        </div>

        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          Verified Farm
        </span>
      </div>

      {/* Litres, Date & Quoted Unit Price */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Ordered Volume</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-base font-black text-slate-900">{requestedLitres} L</span>
            {onEditQuantity && (
              <button
                type="button"
                onClick={onEditQuantity}
                className="text-[10px] font-bold text-sky-700 underline"
              >
                Edit
              </button>
            )}
          </div>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            Snapshot: {availableStockSnapshot}L in stock
          </span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Quoted Unit Rate</span>
          <span className="text-base font-black text-sky-700 block mt-0.5">
            Rs. {quotedPricePerLitre} / L
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold inline-block bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
            ✓ Price Locked
          </span>
        </div>

        <div className="pt-2 border-t border-slate-200/60 col-span-2 flex justify-between items-center text-[11px]">
          <span className="text-slate-500 font-medium">Scheduled Collection Date:</span>
          <span className="font-extrabold text-slate-800">{collectionDate} (Morning Window)</span>
        </div>
      </div>

      {/* Logistics & Address */}
      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 font-medium">Logistics Method:</span>
          <span className="font-bold text-slate-800 capitalize">
            {collectionType === 'collector' ? '🚚 MilkLink Collector Assigned' : '🏬 Buyer Self-Pickup'}
          </span>
        </div>

        <div className="flex justify-between items-start pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-medium shrink-0">Receiving Point:</span>
          <span className="font-semibold text-slate-700 text-right ml-2 text-[11px]">
            {deliveryAddress}
          </span>
        </div>

        {specialInstructions && (
          <div className="flex justify-between items-start pt-1 border-t border-slate-100 text-[11px]">
            <span className="text-slate-500 font-medium shrink-0">Instructions:</span>
            <span className="text-slate-600 text-right ml-2 italic">{specialInstructions}</span>
          </div>
        )}
      </div>

      {/* Calculated Estimate Breakdown */}
      <div className="space-y-1.5 pt-1">
        <div className="flex justify-between text-slate-600 text-xs">
          <span>Milk Subtotal ({requestedLitres} L × Rs. {quotedPricePerLitre}):</span>
          <span className="font-semibold text-slate-800">Rs. {calculatedEstimate.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-slate-600 text-xs">
          <span>Platform Verification & Quality Fee:</span>
          <span className="font-bold text-emerald-700">Rs. 0 (Free Promotion)</span>
        </div>

        <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
          <div>
            <span className="font-extrabold text-sm text-slate-900 block">Total Calculated Estimate:</span>
            <span className="text-[10px] text-slate-400">Fixed farm-gate rate guaranteed</span>
          </div>
          <span className="text-xl font-black text-sky-800">
            Rs. {calculatedEstimate.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
