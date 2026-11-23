import { AVAILABLE_COLLECTORS, type MilkCollector } from '../../buyer/data';

interface AssignCollectorModalProps {
  order: { id: string; quantity: number; farmerName: string } | null;
  isOpen: boolean;
  onClose: () => void;
  onAssign: (orderId: string, collector: MilkCollector) => void;
}

export default function AssignCollectorModal({
  order,
  isOpen,
  onClose,
  onAssign,
}: AssignCollectorModalProps) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Collector Logistics
            </span>
            <h3 className="font-extrabold text-slate-900 text-base mt-1">
              Assign Milk Collector
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Order #{order.id} • {order.quantity} Litres from {order.farmerName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 text-xs text-sky-900">
          <p className="font-bold text-sky-950">Insulated & Cold-Chain Guarantee</p>
          <p className="text-[11px] text-sky-800 mt-0.5">
            Select a nearby certified MilkLink collector to pick up the morning yield with refrigerated containers and deliver to your address.
          </p>
        </div>

        {/* Available Collectors List */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Available Nearby Transporters ({AVAILABLE_COLLECTORS.length})
          </h4>

          {AVAILABLE_COLLECTORS.map((col) => (
            <div
              key={col.id}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/30 transition-all flex flex-col gap-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    {col.name}
                    <span className="text-sky-600 text-xs font-bold">✓ Certified</span>
                  </h5>
                  <p className="text-xs text-slate-500 mt-0.5">{col.vehicleType}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                    ★ {col.rating.toFixed(1)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{col.tripsCount} runs completed</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  📍 Zone: <strong>{col.currentZone}</strong>
                </span>
                <span className="font-semibold text-emerald-700">ETA ~{col.etaMinutes} mins</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">📞 {col.phone}</span>
                <button
                  type="button"
                  onClick={() => onAssign(order.id, col)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  Assign to Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
