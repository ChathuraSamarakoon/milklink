import { useState } from 'react';

interface SelfPickupFormProps {
  requestedLitres: number;
  unitPrice: number;
  isOnline: boolean;
  onSubmit: (actualLitres: number, measurementMethod: string, notes: string) => Promise<void> | void;
  isSubmitting?: boolean;
  className?: string;
}

export default function SelfPickupForm({
  requestedLitres,
  unitPrice,
  isOnline,
  onSubmit,
  isSubmitting = false,
  className = '',
}: SelfPickupFormProps) {
  const [actualLitres, setActualLitres] = useState<number>(requestedLitres);
  const [measurementMethod, setMeasurementMethod] = useState<string>('Calibrated Dipstick at Farm Vat');
  const [temperature, setTemperature] = useState<string>('4.1');
  const [qualityPassed, setQualityPassed] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Quick adjustment
  const handleAdjust = (delta: number) => {
    setActualLitres((prev) => {
      const next = Number((prev + delta).toFixed(1));
      return next > 0 ? next : 1;
    });
    setValidationError(null);
  };

  // Calculations
  const finalCashTotal = Math.round(actualLitres * unitPrice);
  const estimatedCashTotal = Math.round(requestedLitres * unitPrice);
  const litresDiff = Number((actualLitres - requestedLitres).toFixed(1));
  const cashDiff = finalCashTotal - estimatedCashTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualLitres || actualLitres <= 0) {
      setValidationError('Please enter a valid positive volume in litres.');
      return;
    }
    if (!qualityPassed) {
      setValidationError('You must verify on-site organoleptic and temperature quality before recording collection.');
      return;
    }
    setValidationError(null);
    onSubmit(
      actualLitres,
      measurementMethod,
      `Temp: ${temperature}°C, Method: ${measurementMethod}. ${notes}`
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4 text-xs ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Self-Collection Handover Record
          </span>
          <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
            Record Actual Collected Volume
          </h3>
        </div>

        {/* Offline Capability Gate Indicator (Feature 01: offline-capability gate) */}
        <span
          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
            isOnline
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-amber-50 text-amber-900 border-amber-300'
          }`}
        >
          <span>{isOnline ? '🌐' : '📶'}</span>
          <span>{isOnline ? 'Online Sync' : 'Offline Queue Ready'}</span>
        </span>
      </div>

      {/* Offline Notice if connection is severed */}
      {!isOnline && (
        <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-[11px] text-amber-950 space-y-1">
          <p className="font-extrabold">Farm Gate Offline Mode Active</p>
          <p className="text-amber-800 leading-snug">
            Internet connection is currently offline. Your collection record will be cryptographically queued locally on this device and automatically pushed to the cloud upon reconnection.
          </p>
        </div>
      )}

      {/* Actual Litres Input Section (Feature 01: actual litres input only if buyer may act as their own collector) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="actual-litres-input" className="text-slate-700 font-extrabold text-xs">
            Actual Measured Yield (Litres) <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] text-slate-500">
            Reserved: <strong>{requestedLitres} L</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleAdjust(-1)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition"
          >
            -1
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(-0.5)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            -½
          </button>

          <input
            id="actual-litres-input"
            type="number"
            step="0.1"
            min="1"
            value={actualLitres}
            onChange={(e) => {
              setActualLitres(Number(e.target.value) || 0);
              setValidationError(null);
            }}
            className="flex-1 py-2 text-center text-lg font-black text-sky-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:bg-white transition"
          />

          <button
            type="button"
            onClick={() => handleAdjust(0.5)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            +½
          </button>
          <button
            type="button"
            onClick={() => handleAdjust(1)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-sm transition"
          >
            +1
          </button>
        </div>

        {/* Variance Display */}
        {litresDiff !== 0 && (
          <div className="flex items-center justify-between text-[11px] p-2 bg-slate-50 rounded-lg border border-slate-100">
            <span className="text-slate-500">Yield Variance:</span>
            <span
              className={`font-black ${
                litresDiff < 0 ? 'text-amber-700' : 'text-emerald-700'
              }`}
            >
              {litresDiff > 0 ? `+${litresDiff}` : litresDiff} Litres (
              {cashDiff < 0 ? `-Rs. ${Math.abs(cashDiff)}` : `+Rs. ${cashDiff}`})
            </span>
          </div>
        )}
      </div>

      {/* Measurement Method & Temperature */}
      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
        <div>
          <label htmlFor="measurement-method-select" className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
            Measurement Method
          </label>
          <select
            id="measurement-method-select"
            value={measurementMethod}
            onChange={(e) => setMeasurementMethod(e.target.value)}
            className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
          >
            <option value="Calibrated Dipstick at Farm Vat">Calibrated Dipstick</option>
            <option value="Weight-to-Volume Scale">Scale (1.03 g/mL)</option>
            <option value="Standard 50L Graduated Milk Can">Graduated Milk Cans</option>
          </select>
        </div>

        <div>
          <label htmlFor="milk-temperature-input" className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
            Milk Temperature (°C)
          </label>
          <input
            id="milk-temperature-input"
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="w-full text-xs font-semibold p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-center"
            placeholder="e.g. 4.0"
          />
        </div>
      </div>

      {/* Quality Checkbox */}
      <label className="flex items-start gap-2.5 p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl cursor-pointer">
        <input
          type="checkbox"
          checked={qualityPassed}
          onChange={(e) => setQualityPassed(e.target.checked)}
          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
        />
        <span className="text-[11px] text-emerald-950 leading-snug">
          <strong>Quality Passed:</strong> Fresh aroma verified, normal white/cream color, temperature &lt; 4.5°C, no visible sediments.
        </span>
      </label>

      {/* Dynamic Recalculation Panel */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Locked Price per Litre:</span>
          <span className="font-bold text-slate-800">Rs. {unitPrice} / L</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>Final Volume:</span>
          <span className="font-bold text-slate-800">{actualLitres} Litres</span>
        </div>
        <div className="pt-1.5 border-t border-slate-200 flex justify-between items-baseline">
          <span className="font-black text-slate-900 text-xs">
            Final Handover Cash Amount:
          </span>
          <span className="font-black text-sky-800 text-base">
            Rs. {finalCashTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Optional Notes */}
      <div>
        <label htmlFor="self-pickup-notes" className="text-[10px] font-bold text-slate-400 block uppercase mb-1">
          Handover Notes / Farmer Witness (Optional)
        </label>
        <input
          id="self-pickup-notes"
          type="text"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Cleaned churns inspected by farmer"
          className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
          ⚠️ {validationError}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3.5 rounded-xl font-black text-xs transition shadow-sm flex items-center justify-center gap-2 ${
          isSubmitting
            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
        }`}
      >
        {isSubmitting ? (
          <>
            <span className="inline-block animate-spin">⏳</span> Recording Collection…
          </>
        ) : (
          `Record Self-Collection (${actualLitres} L • Rs. ${finalCashTotal.toLocaleString()})`
        )}
      </button>
    </form>
  );
}
