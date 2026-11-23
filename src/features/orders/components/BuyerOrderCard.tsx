import { useNavigate } from 'react-router-dom';
import type { BuyerOrder, BuyerOrderStatus } from '../types';

interface BuyerOrderCardProps {
  order: BuyerOrder;
  onAssignCollector?: (order: BuyerOrder) => void;
}

export default function BuyerOrderCard({
  order,
  onAssignCollector,
}: BuyerOrderCardProps) {
  const navigate = useNavigate();

  // Status badge config
  const getStatusBadge = (status: BuyerOrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending Farmer Confirmation',
          badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
        };
      case 'accepted':
        return {
          label: 'Order Accepted by Farm',
          badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
        };
      case 'collected':
        return {
          label: 'Milk Collected • In Transit',
          badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
          dotClass: 'bg-blue-500',
        };
      case 'completed':
        return {
          label: 'Delivered & Quality Verified',
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          dotClass: 'bg-emerald-600',
        };
      case 'declined':
        return {
          label: 'Declined by Farm',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-500',
        };
      case 'expired':
        return {
          label: 'Reservation Expired',
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
          dotClass: 'bg-slate-400',
        };
      case 'conflict':
        return {
          label: 'Sync Conflict Detected',
          badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
          dotClass: 'bg-purple-500 animate-pulse',
        };
      default:
        return {
          label: status,
          badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-400',
        };
    }
  };

  const statusBadge = getStatusBadge(order.status);

  // Check if needs collector assignment
  const isPendingCollector =
    order.collectionType === 'collector' &&
    !order.collectorAssigned &&
    order.status !== 'declined' &&
    order.status !== 'expired' &&
    order.status !== 'completed';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all space-y-3">
      {/* Header: Order ID & Status */}
      <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black text-slate-900">
              #{order.id}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              • {order.orderDate}
            </span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 mt-1">
            {order.farmerName}
          </h3>
          {(order.farmerVillage || order.farmerDistrict) && (
            <p className="text-[11px] text-slate-500">
              {order.farmerVillage ? `${order.farmerVillage}, ` : ''}
              {order.farmerDistrict || 'Central Province'}
            </p>
          )}
        </div>

        {/* Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black shrink-0 ${statusBadge.badgeClass}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusBadge.dotClass}`} />
          <span>{statusBadge.label}</span>
        </div>
      </div>

      {/* Pending Collector Assignment Marker (Feature 01: pending collector assignment marker) */}
      {isPendingCollector && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
            <div>
              <p className="text-[11px] font-extrabold text-amber-950 leading-tight">
                Pending Collector Assignment
              </p>
              <p className="text-[10px] text-amber-800 leading-tight">
                No transport assigned for pickup yet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              onAssignCollector
                ? onAssignCollector(order)
                : navigate(`/buyer/orders/${order.id}/assign-collector`)
            }
            className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] rounded-lg transition shadow-xs shrink-0"
          >
            Assign Now
          </button>
        </div>
      )}

      {/* Collector Info if Assigned */}
      {order.collectorAssigned && order.collectorName && (
        <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-sky-950">
          <div className="flex items-center gap-2">
            <span className="text-sm">🚚</span>
            <div>
              <p className="text-[11px] font-extrabold text-sky-950">
                Collector: {order.collectorName}
              </p>
              {order.collectorPhone && (
                <p className="text-[10px] text-sky-800">Tel: {order.collectorPhone}</p>
              )}
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            Assigned
          </span>
        </div>
      )}

      {/* Decline Reason Banner */}
      {order.status === 'declined' && order.declineReason && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 text-xs text-rose-900">
          <p className="font-bold text-[11px] text-rose-950">Farmer Reason:</p>
          <p className="text-[10px] text-rose-800 mt-0.5">{order.declineReason}</p>
        </div>
      )}

      {/* Expired Reason Banner */}
      {order.status === 'expired' && order.expireReason && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800">
          <p className="font-bold text-[11px] text-slate-900">Notice:</p>
          <p className="text-[10px] text-slate-600 mt-0.5">{order.expireReason}</p>
        </div>
      )}

      {/* Conflict Banner */}
      {order.status === 'conflict' && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-2.5 text-xs text-purple-900 flex items-center justify-between">
          <div>
            <p className="font-bold text-[11px] text-purple-950">
              Offline Data Conflict
            </p>
            <p className="text-[10px] text-purple-800">
              Conflicting updates between local storage and sync server.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(`/app/sync/conflicts/${order.conflictId || 'sync-01'}`)}
            className="px-2.5 py-1 bg-purple-700 text-white rounded-lg text-[10px] font-bold shrink-0 hover:bg-purple-800 transition"
          >
            Resolve
          </button>
        </div>
      )}

      {/* Order Quantities & Amount */}
      <div className="grid grid-cols-3 gap-2 bg-slate-50/90 p-2.5 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Quantity</span>
          <span className="font-black text-slate-900 text-sm">{order.quantity} L</span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Unit Price</span>
          <span className="font-extrabold text-sky-700 text-sm">Rs. {order.pricePerLitre}</span>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Amount</span>
          <span className="font-black text-slate-900 text-sm">
            Rs. {order.totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Footer Actions & Navigation */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <span className="text-[11px] text-slate-500 font-medium">
          {order.collectionType === 'collector' ? '🚚 MilkLink Collector' : '🏬 Buyer Self-Pickup'}
        </span>

        <div className="flex items-center gap-2">
          {order.status === 'declined' || order.status === 'expired' ? (
            <button
              type="button"
              onClick={() => navigate('/buyer/search')}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold transition border border-sky-200"
            >
              Find Alternative
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => navigate(`/buyer/orders/${order.id}`)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
          >
            Order Details →
          </button>
        </div>
      </div>
    </div>
  );
}
