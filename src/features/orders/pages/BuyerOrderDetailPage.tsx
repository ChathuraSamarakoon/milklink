import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import PickupDetailsCard from '../components/PickupDetailsCard';
import FinalPriceSummary from '../components/FinalPriceSummary';
import AssignCollectorModal from '../components/AssignCollectorModal';
import FarmerResultCard from '../../discovery/components/FarmerResultCard';
import BuyerNav from '../../buyer/components/BuyerNav';
import { getBuyerOrderByIdApi } from '../../../services/ordersApi';
import { assignCollectorToOrder, type MilkCollector } from '../../buyer/data';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import type { BuyerOrderDetail } from '../types';
import '../../buyer/buyer.css';

export default function BuyerOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<BuyerOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getBuyerOrderByIdApi(orderId || 'ORD-2048');
        setOrder(data);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Compute Timeline Step based on Order Status
  const getTimelineStep = (status?: string): 1 | 2 | 3 | 4 | 5 => {
    switch (status) {
      case 'pending':
        return 2;
      case 'accepted':
        return 3;
      case 'collected':
        return 4;
      case 'completed':
        return 5;
      default:
        return 2;
    }
  };

  // Actions
  const handleAssignCollector = (ordId: string, collector: MilkCollector) => {
    assignCollectorToOrder(ordId, {
      name: collector.name,
      phone: collector.phone,
    });
    setOrder((prev) =>
      prev
        ? {
            ...prev,
            collectorAssigned: true,
            collectorName: collector.name,
            collectorPhone: collector.phone,
            collectorVehicle: collector.vehicleType,
          }
        : null
    );
    setIsAssignModalOpen(false);
  };

  const handleSwitchLogistics = (type: 'collector' | 'self') => {
    setOrder((prev) => (prev ? { ...prev, collectionType: type } : null));
  };

  return (
    <div className="ml-buyer-screen">
      <div className="ml-buyer-phone-frame">
        {/* Top Header */}
        <header className="ml-buyer-topbar">
          <button
            type="button"
            className="ml-icon-btn"
            onClick={() => navigate('/buyer/orders')}
            aria-label="Back to orders list"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">
              Order Tracking & Details
            </h1>
            <p className="text-[11px] text-slate-500">#{order?.id || orderId}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/buyer')}
            className="text-xs font-bold text-sky-700 p-2"
          >
            Home
          </button>
        </header>

        <main className="ml-buyer-content space-y-4 pb-24">
          {loading || !order ? (
            <div className="p-8 text-center text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100 shadow-xs">
              <span className="inline-block animate-spin mr-2">⏳</span> Loading order details…
            </div>
          ) : (
            <>
              {/* Order Status Timeline (Feature 01: Status timeline & Feature 04: OrderTimeline) */}
              <OrderTimeline currentStep={getTimelineStep(order.status)} />

              {/* Order Status Header Banner */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      Order Reference
                    </span>
                    <h2 className="text-base font-black text-slate-900">#{order.id}</h2>
                  </div>

                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                      order.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : order.status === 'collected'
                        ? 'bg-blue-50 text-blue-800 border-blue-200'
                        : order.status === 'accepted'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : order.status === 'declined'
                        ? 'bg-rose-50 text-rose-800 border-rose-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    ● {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block font-bold">Placed On</span>
                    <span className="font-bold text-slate-800">{order.placedAt}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block font-bold">Supply Window</span>
                    <span className="font-bold text-slate-800">{order.supplyWindow}</span>
                  </div>
                </div>
              </div>

              {/* Reusable PickupDetailsCard (Feature 01 & 04: PickupDetailsCard, Precise location only when accepted) */}
              <PickupDetailsCard
                order={order}
                onAssignCollector={() => setIsAssignModalOpen(true)}
                onSwitchLogistics={handleSwitchLogistics}
              />

              {/* Reusable FinalPriceSummary (Feature 01 & 04: FinalPriceSummary, Estimate vs final total, actual litres, cash record) */}
              <FinalPriceSummary order={order} />

              {/* Reusable FarmerResultCard for quick re-order or alternative farm view */}
              <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Explore Other Milk Listings
                  </h4>
                  <button
                    type="button"
                    onClick={() => navigate('/buyer/search')}
                    className="text-xs text-sky-700 font-bold hover:underline"
                  >
                    Search →
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

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => navigate('/buyer/orders')}
                  className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Back to My Orders
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/buyer')}
                  className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                >
                  Return to Dashboard
                </button>
              </div>
            </>
          )}
        </main>

        {/* Assign Collector Modal */}
        {order && (
          <AssignCollectorModal
            isOpen={isAssignModalOpen}
            order={order}
            onClose={() => setIsAssignModalOpen(false)}
            onAssign={handleAssignCollector}
          />
        )}

        {/* Bottom Nav */}
        <BuyerNav active="orders" />
      </div>
    </div>
  );
}
