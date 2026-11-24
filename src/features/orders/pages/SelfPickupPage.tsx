import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import AuthorizationGate from '../components/AuthorizationGate';
import SelfPickupForm from '../components/SelfPickupForm';
import FarmerResultCard from '../../discovery/components/FarmerResultCard';
import BuyerNav from '../../buyer/components/BuyerNav';
import { getBuyerOrderByIdApi } from '../../../services/ordersApi';
import { recordOrderSelfCollection } from '../../buyer/data';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import type { BuyerOrderDetail } from '../types';
import '../../buyer/buyer.css';

export default function SelfPickupPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { isOnline } = useNetworkStatus();

  // State
  const [order, setOrder] = useState<BuyerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Business rule gate state: [DECIDE]
  // Default is false (Decision pending per spec: "Do not activate this permission until the project owner agrees")
  const [isBuyerAuthorized, setIsBuyerAuthorized] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collectionConfirmed, setCollectionConfirmed] = useState(false);
  const [confirmedVolume, setConfirmedVolume] = useState<number>(0);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getBuyerOrderByIdApi(orderId || 'ORD-2042');
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Order Validation: only accepted orders can be collected
  const isAccepted = order?.status === 'accepted';

  // Handle Recording Collection
  const handleRecordCollection = async (
    actualLitres: number,
    measurementMethod: string,
    notes: string
  ) => {
    if (!order) return;
    setIsSubmitting(true);

    // Simulate network delay / offline queue store
    await new Promise((res) => setTimeout(res, 450));

    recordOrderSelfCollection(order.id, actualLitres, `${measurementMethod} - ${notes}`);
    setConfirmedVolume(actualLitres);
    setIsSubmitting(false);
    setCollectionConfirmed(true);

    // Redirect to Order Tracking after confirmation display
    setTimeout(() => {
      navigate(`/buyer/orders/${order.id}`);
    }, 1500);
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
              Self-Pickup Collection
            </h1>
            <p className="text-[11px] text-slate-500">
              {order ? `Order #${order.id}` : 'Handover Verification'}
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
          {/* Order Timeline (Step 4: Collector / Pickup Route) */}
          <OrderTimeline currentStep={4} />

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
            /* Error State: Order must be in Accepted status */
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-start gap-3">
                <span className="p-2 bg-rose-100 text-rose-700 rounded-xl font-bold text-sm shrink-0">
                  🚫
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-800 bg-rose-200/60 px-2 py-0.5 rounded-full">
                    Invalid Order State
                  </span>
                  <h3 className="font-extrabold text-sm text-rose-950 mt-1">
                    Cannot Record Collection
                  </h3>
                  <p className="text-xs text-rose-900 mt-1 leading-relaxed">
                    Self-pickup collection can only be recorded for orders in <strong>ACCEPTED</strong> status. Order #{order.id} is currently in{' '}
                    <span className="font-black underline uppercase">{order.status}</span> status.
                  </p>
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
                  className="px-4 py-2.5 bg-white border border-rose-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Orders List
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Accepted Order Summary (Feature 01: Accepted order summary) */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs text-xs space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Farm Gate Collection
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
                    <span className="text-slate-400 block text-[10px]">Reserved Litres:</span>
                    <span className="font-extrabold text-slate-800">{order.quantity} L</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Unit Price:</span>
                    <span className="font-extrabold text-sky-800">Rs. {order.pricePerLitre} / L</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 text-slate-600">
                  <span>Supply Window:</span>
                  <span className="font-bold text-slate-900">{order.supplyWindow}</span>
                </div>
              </div>

              {/* Confirmation State (Feature 01: confirmation) */}
              {collectionConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2 animate-fadeIn">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white mx-auto flex items-center justify-center text-lg font-bold">
                    ✓
                  </div>
                  <h4 className="font-black text-sm text-emerald-950">
                    Collection Recorded Successfully!
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Verified {confirmedVolume} Litres collected from {order.farmerName}. Returning to order tracking…
                  </p>
                </div>
              )}

              {/* Conditional Interface: AuthorizationGate (Feature 03 & 04: AuthorizationGate) */}
              <AuthorizationGate
                isAuthorized={isBuyerAuthorized}
                onToggleAuthorize={setIsBuyerAuthorized}
                orderId={order.id}
                pickupInfo={{
                  farmName: order.farmerName,
                  village: order.farmerVillage,
                  district: order.farmerDistrict,
                  supplyWindow: order.supplyWindow,
                  exactAddress: order.exactAddress,
                  farmerPhone: order.farmerPhone,
                }}
              >
                {/* Child Form: SelfPickupForm (Feature 01 & 04: SelfPickupForm) */}
                <SelfPickupForm
                  requestedLitres={order.quantity}
                  unitPrice={order.pricePerLitre}
                  isOnline={isOnline}
                  onSubmit={handleRecordCollection}
                  isSubmitting={isSubmitting}
                />
              </AuthorizationGate>

              {/* Producer Details Preview (Feature 04: FarmerResultCard) */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 mt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Dairy Farm Context
                  </h4>
                  <button
                    type="button"
                    onClick={() => navigate(`/buyer/farmers/${order.farmerId}`)}
                    className="text-xs text-sky-700 font-bold hover:underline"
                  >
                    Farm Details →
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

              {/* Navigation Back button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/buyer/orders/${order.id}`)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Return to Order Details
                </button>
              </div>
            </>
          )}
        </main>

        {/* Bottom Navigation (Feature 04: BuyerNav) */}
        <BuyerNav active="orders" />
      </div>
    </div>
  );
}
