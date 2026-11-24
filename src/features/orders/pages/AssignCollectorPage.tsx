import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import PickupModeSelector from '../components/PickupModeSelector';
import CollectorPicker from '../components/CollectorPicker';
import FarmerResultCard from '../../discovery/components/FarmerResultCard';
import BuyerNav from '../../buyer/components/BuyerNav';
import {
  AVAILABLE_COLLECTORS,
  assignCollectorToOrder,
  setOrderSelfPickup,
  type MilkCollector,
} from '../../buyer/data';
import { getBuyerOrderByIdApi } from '../../../services/ordersApi';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import type { BuyerOrderDetail } from '../types';
import '../../buyer/buyer.css';

export default function AssignCollectorPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  // State
  const [order, setOrder] = useState<BuyerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [pickupMode, setPickupMode] = useState<'collector' | 'self'>('collector');
  const [selectedCollector, setSelectedCollector] = useState<MilkCollector | null>(
    AVAILABLE_COLLECTORS[0]
  );
  const [selfPickupAgreement, setSelfPickupAgreement] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Fetch Order
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getBuyerOrderByIdApi(orderId || 'ORD-2042');
        setOrder(data);
        if (data?.collectionType) {
          setPickupMode(data.collectionType);
        }
        if (data?.collectorName) {
          const matched = AVAILABLE_COLLECTORS.find(
            (c) => c.name.toLowerCase() === data.collectorName?.toLowerCase()
          );
          if (matched) setSelectedCollector(matched);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Validation: Only Accepted orders can be assigned (Feature 03 constraint)
  const isAccepted = order?.status === 'accepted';

  // Submission Handler
  const handleConfirmAssignment = async () => {
    if (!order) return;

    // Validate Status constraint
    if (!isAccepted) {
      setSubmissionError(
        `Assignment Rejected: Order #${order.id} is currently in '${order.status.toUpperCase()}' status. Only Accepted orders can be scheduled for transport.`
      );
      return;
    }

    if (pickupMode === 'collector' && !selectedCollector) {
      setSubmissionError('Please select a registered MilkLink transporter from the list.');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    // Simulate atomic network dispatch
    await new Promise((res) => setTimeout(res, 500));

    if (pickupMode === 'collector' && selectedCollector) {
      assignCollectorToOrder(order.id, {
        name: selectedCollector.name,
        phone: selectedCollector.phone,
        vehicle: selectedCollector.vehicleType,
      });
    } else {
      setOrderSelfPickup(order.id);
    }

    setIsSubmitting(false);
    setAssignmentSuccess(true);

    // Navigate to Order Details after brief confirmation feedback
    setTimeout(() => {
      navigate(`/buyer/orders/${order.id}`);
    }, 1200);
  };

  return (
    <div className="ml-buyer-screen">
      <div className="ml-buyer-phone-frame">
        {/* Top Header */}
        <header className="ml-buyer-topbar">
          <button
            type="button"
            className="ml-icon-btn"
            onClick={() => navigate(`/buyer/orders/${orderId || ''}`)}
            aria-label="Back to order"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">
              Assign Collector
            </h1>
            <p className="text-[11px] text-slate-500">
              {order ? `Order #${order.id}` : 'Logistics Schedule'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/buyer/orders')}
            className="text-xs font-bold text-sky-700 p-2"
          >
            Orders
          </button>
        </header>

        <main className="ml-buyer-content space-y-4 pb-24">
          {/* Order Timeline (Feature 04: OrderTimeline, Step 3: Farm Confirms / Collector Route) */}
          <OrderTimeline currentStep={3} />

          {loading ? (
            <div className="p-8 text-center text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100 shadow-xs">
              <span className="inline-block animate-spin mr-2">⏳</span> Loading order details…
            </div>
          ) : !order ? (
            <div className="p-6 bg-white rounded-2xl border border-rose-200 text-center space-y-2">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-sm font-bold text-slate-900">Order Not Found</h3>
              <p className="text-xs text-slate-500">
                Could not find the requested milk order reference #{orderId}.
              </p>
              <button
                type="button"
                onClick={() => navigate('/buyer/orders')}
                className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold"
              >
                Return to Orders
              </button>
            </div>
          ) : !isAccepted ? (
            /* Error State (Feature 01: error states & Feature 03: Only Accepted orders can be assigned) */
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-xl font-bold shrink-0">
                  🚫
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded-full">
                    Validation Rule B28
                  </span>
                  <h3 className="font-extrabold text-sm text-rose-950 mt-1">
                    Order Not Eligible For Collector Assignment
                  </h3>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    Only orders accepted by the dairy producer can be scheduled for transport. Order <strong>#{order.id}</strong> is currently in{' '}
                    <span className="font-black underline uppercase">{order.status}</span> status.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-rose-100 text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Farm Producer:</span>
                  <span className="font-bold text-slate-900">{order.farmerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reserved Volume:</span>
                  <span className="font-bold text-slate-900">{order.quantity} Litres</span>
                </div>
                <div className="flex justify-between">
                  <span>Supply Window:</span>
                  <span className="font-bold text-slate-900">{order.supplyWindow}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate(`/buyer/orders/${order.id}`)}
                  className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl text-xs transition"
                >
                  View Order Tracking
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/buyer/orders')}
                  className="px-4 py-2.5 bg-white border border-rose-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-rose-50/50"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Order Summary Snapshot */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Accepted Order Ready For Route
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm mt-0.5">
                      #{order.id} • {order.farmerName}
                    </h3>
                  </div>

                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    ● Order Accepted
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Volume:</span>
                    <span className="font-extrabold text-slate-800">{order.quantity} Litres</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Supply Window:</span>
                    <span className="font-extrabold text-slate-800">{order.supplyWindow}</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 flex items-center justify-between pt-1">
                  <span>Receiving Address:</span>
                  <span className="font-bold text-slate-900 truncate max-w-[200px]">
                    {order.deliveryAddress}
                  </span>
                </div>
              </div>

              {/* Submission Error Banner */}
              {submissionError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center justify-between">
                  <span>{submissionError}</span>
                  <button
                    type="button"
                    onClick={() => setSubmissionError(null)}
                    className="font-bold text-rose-700 ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Assignment Confirmation Success State (Feature 01: assignment confirmation) */}
              {assignmentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2 animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-lg font-bold">
                    ✓
                  </div>
                  <h4 className="font-black text-sm text-emerald-950">
                    {pickupMode === 'collector'
                      ? 'Transporter Assigned Successfully!'
                      : 'Self-Pickup Schedule Confirmed!'}
                  </h4>
                  <p className="text-xs text-emerald-800">
                    {pickupMode === 'collector'
                      ? `${selectedCollector?.name} has been assigned to pickup ${order.quantity}L from ${order.farmerName}.`
                      : 'Digital Farm Gate Pass generated. Directing to your order tracking details...'}
                  </p>
                </div>
              )}

              {/* Reusable PickupModeSelector (Feature 01 & 04: PickupModeSelector) */}
              <PickupModeSelector
                selectedMode={pickupMode}
                onSelectMode={(mode) => {
                  setPickupMode(mode);
                  setSubmissionError(null);
                }}
              />

              {/* Conditional Picker: Registered Collector vs Self-Pickup */}
              {pickupMode === 'collector' ? (
                /* Reusable CollectorPicker (Feature 01 & 04: CollectorPicker) */
                <CollectorPicker
                  collectors={AVAILABLE_COLLECTORS}
                  selectedCollectorId={selectedCollector?.id || null}
                  onSelectCollector={(col) => {
                    setSelectedCollector(col);
                    setSubmissionError(null);
                  }}
                />
              ) : (
                /* Self-Pickup Clearance Details */
                <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-amber-100 rounded-lg text-amber-800 font-bold">
                      🔑
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        Self-Pickup Farm Gate Pass
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Clearance token for {order.farmerName}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Gate Pass Reference:</span>
                      <span className="font-mono font-black text-sky-800">
                        GP-{order.id.replace('ORD-', '')}-PASS
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Pickup Location:</span>
                      <span className="font-bold text-slate-800">{order.farmerVillage}, {order.farmerDistrict}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Approved Window:</span>
                      <span className="font-extrabold text-slate-900">{order.supplyWindow}</span>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 p-2 bg-slate-50 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selfPickupAgreement}
                      onChange={(e) => setSelfPickupAgreement(e.target.checked)}
                      className="mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <span className="text-[11px] text-slate-700 leading-snug">
                      I confirm I will provide clean, food-grade milk cans and comply with on-farm dairy bio-security protocols.
                    </span>
                  </label>
                </div>
              )}

              {/* Assignment Confirmation Button */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  disabled={
                    isSubmitting ||
                    assignmentSuccess ||
                    (pickupMode === 'collector' && !selectedCollector) ||
                    (pickupMode === 'self' && !selfPickupAgreement)
                  }
                  onClick={handleConfirmAssignment}
                  className={`w-full py-3.5 rounded-xl font-black text-xs transition shadow-sm flex items-center justify-center gap-2 ${
                    isSubmitting || assignmentSuccess
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span> Dispatching Logistics Assignment…
                    </>
                  ) : pickupMode === 'collector' ? (
                    `Confirm Transporter: ${selectedCollector?.name || 'Select Collector'}`
                  ) : (
                    'Confirm Self-Pickup Schedule'
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`/buyer/orders/${order.id}`)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Cancel & Return to Order
                </button>
              </div>

              {/* Reusable FarmerResultCard for producer context (Feature 04: FarmerResultCard) */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Producer In Detail
                  </h4>
                  <button
                    type="button"
                    onClick={() => navigate(`/buyer/farmers/${order.farmerId}`)}
                    className="text-xs text-sky-700 font-bold hover:underline"
                  >
                    Farm Profile →
                  </button>
                </div>

                {ALL_DEMO_FARMERS.slice(0, 1).map((farm) => (
                  <FarmerResultCard
                    key={farm.id}
                    farmer={farm}
                    requestedLitres={order.quantity}
                    onSelect={(f) => navigate(`/buyer/farmers/${f.farmerId}`)}
                    onOrderNow={(f) =>
                      navigate(`/buyer/orders/new?farmerId=${f.farmerId}&litres=${order.quantity}`)
                    }
                  />
                ))}
              </div>
            </>
          )}
        </main>

        {/* Bottom Nav */}
        <BuyerNav active="orders" />
      </div>
    </div>
  );
}
