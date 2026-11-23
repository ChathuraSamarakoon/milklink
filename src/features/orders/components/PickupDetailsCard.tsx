import { useNavigate } from 'react-router-dom';
import type { BuyerOrderDetail } from '../types';

interface PickupDetailsCardProps {
  order: BuyerOrderDetail;
  onAssignCollector?: () => void;
  onSwitchLogistics?: (type: 'collector' | 'self') => void;
  className?: string;
}

export default function PickupDetailsCard({
  order,
  onAssignCollector,
  onSwitchLogistics,
  className = '',
}: PickupDetailsCardProps) {
  const navigate = useNavigate();
  const handleAssignClick = onAssignCollector || (() => navigate(`/buyer/orders/${order.id}/assign-collector`));
  // B15: Exact farm location is revealed ONLY when accepted, collected, or completed
  const isAcceptedOrBeyond =
    order.status === 'accepted' ||
    order.status === 'collected' ||
    order.status === 'completed';

  const isPendingCollector =
    order.collectionType === 'collector' &&
    !order.collectorAssigned &&
    order.status !== 'declined' &&
    order.status !== 'expired';

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-4 text-xs ${className}`}>
      {/* Farm Location & Privacy Section (Feature 01 & 03: precise location only when accepted) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Producer Location & Privacy
          </span>

          {isAcceptedOrBeyond ? (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <span>✓</span> Exact Farm Gate Unlocked
            </span>
          ) : (
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
              <span>🔒</span> Location Masked
            </span>
          )}
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                {order.farmerName}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Owner: <strong>{order.farmerOwner || 'Registered Producer'}</strong>
              </p>
            </div>

            {order.farmerPhone && (
              <a
                href={`tel:${order.farmerPhone}`}
                className="px-2.5 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
              >
                <span>📞</span> Call Farm
              </a>
            )}
          </div>

          {/* Conditional Location Display: Precise only when accepted */}
          {isAcceptedOrBeyond ? (
            <div className="pt-2 border-t border-slate-200/80 space-y-1.5">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                  Precise Farm Gate Address
                </span>
                <p className="font-extrabold text-slate-800 text-xs">
                  {order.exactAddress || `${order.farmerVillage}, ${order.farmerDistrict}`}
                </p>
              </div>

              {order.exactCoordinates && (
                <div className="flex items-center justify-between text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60">
                  <span className="font-mono text-[10px]">
                    GPS: {order.exactCoordinates.lat.toFixed(4)}° N, {order.exactCoordinates.lng.toFixed(4)}° E
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${order.exactCoordinates.lat},${order.exactCoordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 font-bold text-[10px] hover:underline"
                  >
                    Open in Maps ↗
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-200/80 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Approximate Region (~1-2 km)
              </span>
              <p className="font-bold text-slate-700 text-xs">
                {order.approximateLocation || `${order.farmerVillage}, ${order.farmerDistrict}`}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight">
                Exact farm gates and GPS directions are securely hidden until the farmer reviews and accepts this order.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Logistics & Collector Section (Feature 01: Collector assignment call to action) */}
      <div className="space-y-2 pt-1 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Logistics & Transport
          </span>

          {/* Switch Logistics Type */}
          {onSwitchLogistics && (order.status === 'pending' || order.status === 'accepted') && (
            <button
              type="button"
              onClick={() =>
                onSwitchLogistics(order.collectionType === 'collector' ? 'self' : 'collector')
              }
              className="text-[10px] text-sky-700 font-extrabold underline"
            >
              Switch to {order.collectionType === 'collector' ? 'Buyer Self-Pickup' : 'MilkLink Collector'}
            </button>
          )}
        </div>

        {/* Collector Assignment CTA or Assigned Collector Details */}
        {order.collectionType === 'collector' ? (
          isPendingCollector ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-xs text-amber-950">
                      Collector Assignment Required
                    </h5>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                      No certified transporter is attached to this order. Assign a refrigerated transporter to ensure morning milk freshness.
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAssignClick}
                className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-lg text-xs transition shadow-xs"
              >
                🚚 Assign Certified Collector Now
              </button>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800">
                    Assigned Transporter
                  </span>
                  <h4 className="font-extrabold text-sm text-sky-950 mt-0.5">
                    {order.collectorName || 'Sampath Fernando'}
                  </h4>
                  <p className="text-[11px] text-sky-800">
                    {order.collectorVehicle || 'Chilled Milk Van (500L Tank)'}
                  </p>
                </div>

                {order.collectorPhone && (
                  <a
                    href={`tel:${order.collectorPhone}`}
                    className="px-2.5 py-1.5 bg-white text-sky-700 border border-sky-300 rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span>📞</span> Call
                  </a>
                )}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-sky-200/80 text-sky-900">
                <span className="flex items-center gap-1 font-semibold">
                  <span className="text-emerald-600">✓</span> Insulated Cold-Chain Verified
                </span>
                {(order.status === 'accepted' || order.status === 'pending') && (
                  <button
                    type="button"
                    onClick={handleAssignClick}
                    className="text-[10px] text-sky-700 font-bold underline"
                  >
                    Change Collector
                  </button>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Self-Pickup Protocol
            </span>
            <p className="font-extrabold text-xs text-slate-800">
              Buyer Arranged Pickup at Farm Gate
            </p>
            <p className="text-[11px] text-slate-500">
              Please bring clean, food-grade milk cans during the supply window ({order.supplyWindow}).
            </p>

            {isAcceptedOrBeyond && order.status === 'accepted' && (
              <button
                type="button"
                onClick={() => navigate(`/buyer/orders/${order.id}/self-pickup`)}
                className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>📝</span> Record Self-Pickup Collection
              </button>
            )}
          </div>
        )}

        {/* Destination / Drop-off point */}
        <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-start gap-2">
          <span className="text-sm mt-0.5">📍</span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Receiving Point / Delivery Destination
            </span>
            <p className="font-semibold text-slate-800 text-xs">
              {order.deliveryAddress}
            </p>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Scheduled Window: <strong>{order.supplyWindow}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
