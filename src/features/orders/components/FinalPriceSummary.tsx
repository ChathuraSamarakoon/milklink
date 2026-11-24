import type { BuyerOrderDetail } from '../types';

interface FinalPriceSummaryProps {
  order: BuyerOrderDetail;
  className?: string;
}

export default function FinalPriceSummary({
  order,
  className = '',
}: FinalPriceSummaryProps) {
  const {
    quantity: requestedLitres,
    actualLitres,
    pricePerLitre,
    totalAmount: estimatedTotal,
    finalCashAmount,
    cashRecord,
    qualityMetrics,
    qualityTested,
  } = order;

  // Final total uses actual litres (Feature 03 constraint)
  const effectiveActualLitres = actualLitres ?? requestedLitres;
  const computedFinalCash = finalCashAmount ?? Math.round(effectiveActualLitres * pricePerLitre);
  const litresDifference = actualLitres !== undefined ? actualLitres - requestedLitres : 0;
  const cashDifference = computedFinalCash - estimatedTotal;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4 text-xs ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Financial & Settlement Reconciliation
          </span>
          <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
            Estimate vs. Final Cash Total
          </h3>
        </div>

        <span
          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
            cashRecord?.status === 'verified_paid'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}
        >
          {cashRecord?.status === 'verified_paid'
            ? '✓ Cash Settled'
            : '● Cash Due on Handover'}
        </span>
      </div>

      {/* Litres Comparison: Requested vs Actual */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            Requested Volume
          </span>
          <span className="text-base font-black text-slate-800 mt-0.5 block">
            {requestedLitres} L
          </span>
          <span className="text-[10px] text-slate-500 block">Initial reservation</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">
            Actual Measured Yield
          </span>
          <span className="text-base font-black text-sky-700 mt-0.5 block">
            {effectiveActualLitres} L
          </span>
          <span className="text-[10px] text-slate-500 block">
            {actualLitres !== undefined
              ? 'Calibrated dipstick check'
              : 'Pending collection check'}
          </span>
        </div>

        {/* Variance Note if actual is different */}
        {litresDifference !== 0 && (
          <div className="col-span-2 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
            <span className="text-slate-600 font-medium">Measured Yield Variance:</span>
            <span
              className={`font-black ${
                litresDifference < 0 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {litresDifference > 0 ? `+${litresDifference}` : litresDifference} Litres (
              {cashDifference < 0 ? `-Rs. ${Math.abs(cashDifference)}` : `+Rs. ${cashDifference}`})
            </span>
          </div>
        )}
      </div>

      {/* Pricing Comparison Panel (Feature 01: Estimate versus final cash amount panel) */}
      <div className="space-y-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
        <div className="flex justify-between items-center text-slate-600">
          <span>Locked Unit Rate:</span>
          <span className="font-bold text-slate-900">Rs. {pricePerLitre} / Litre</span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Initial Estimated Total:</span>
          <span className="font-semibold text-slate-700 line-through">
            Rs. {estimatedTotal.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center text-slate-600">
          <span>Logistics / Cooperative Fee:</span>
          <span className="font-bold text-emerald-700">Rs. 0 (Subsidized Route)</span>
        </div>

        <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="text-xs font-black text-slate-900 block">
              Final Cash Payable:
            </span>
            <span className="text-[10px] text-slate-400">
              Based on {effectiveActualLitres}L actual volume
            </span>
          </div>
          <span className="text-lg font-black text-sky-800">
            Rs. {computedFinalCash.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Cash Record Display (Feature 01: cash record display) */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950">
        <div className="flex items-center justify-between">
          <span className="font-extrabold text-[11px] text-amber-950 flex items-center gap-1.5">
            <span>💵</span> Cash Handover Record
          </span>
          <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            {cashRecord?.receiptNumber || `CASH-${order.id.replace(/[^0-9]/g, '')}`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          <div>
            <span className="text-amber-800/80 block text-[10px]">Payment Protocol:</span>
            <span className="font-bold">{cashRecord?.paymentMethod || 'Cash on Handover'}</span>
          </div>

          <div className="text-right">
            <span className="text-amber-800/80 block text-[10px]">Settlement State:</span>
            <span className="font-extrabold">
              {cashRecord?.status === 'verified_paid'
                ? 'Paid in Full'
                : 'Pending Handover Cash'}
            </span>
          </div>
        </div>

        {cashRecord?.paidAt && (
          <p className="text-[10px] text-amber-800 pt-1 border-t border-amber-200/80">
            Reconciled by Collector & Farm at: <strong>{cashRecord.paidAt}</strong>
          </p>
        )}
      </div>

      {/* Quality Verification Metrics */}
      {qualityTested && qualityMetrics && (
        <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-emerald-950 flex items-center gap-1">
              <span>🔬</span> On-Site Quality Test Passed
            </span>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
              {qualityMetrics.grade}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 block">Fat %</span>
              <span className="font-extrabold text-slate-800 text-xs">
                {qualityMetrics.fatPercentage}%
              </span>
            </div>

            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 block">SNF %</span>
              <span className="font-extrabold text-slate-800 text-xs">
                {qualityMetrics.snfPercentage}%
              </span>
            </div>

            <div className="bg-white p-1.5 rounded-lg border border-emerald-100">
              <span className="text-slate-400 block">Temp</span>
              <span className="font-extrabold text-slate-800 text-xs">
                {qualityMetrics.temperatureC}°C
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
