import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import PublicFarmerProfile from '../components/PublicFarmerProfile';
import MilkAvailabilitySummary from '../components/MilkAvailabilitySummary';
import OrderTimeline from '../components/OrderTimeline';
import BuyerNav from '../../buyer/components/BuyerNav';
import { getFarmerPublicProfileApi, type PublicFarmerDetail } from '../../../services/farmersApi';
import { createBuyerOrder } from '../../buyer/data';
import '../../buyer/buyer.css';

export default function FarmerPublicDetailPage() {
  const { farmerId } = useParams<{ farmerId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [farmer, setFarmer] = useState<PublicFarmerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderLitres, setOrderLitres] = useState<number>(Number(searchParams.get('litres')) || 25);
  const [collectionDate, setCollectionDate] = useState<string>(
    searchParams.get('date') || new Date().toISOString().split('T')[0]
  );
  const [collectionType, setCollectionType] = useState<'collector' | 'self'>('collector');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [farmerId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // 03: Enforce privacy at API level, not CSS
      const data = await getFarmerPublicProfileApi(farmerId || 'SRCH-001');
      setFarmer(data);
    } catch (e) {
      console.warn('Failed to load farmer profile', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!farmer) return;
    createBuyerOrder({
      farmerName: farmer.farmName,
      quantity: orderLitres,
      pricePerLitre: farmer.pricePerLitre,
      totalAmount: orderLitres * farmer.pricePerLitre,
      status: 'pending',
      collectionType,
    });
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setOrderModalOpen(false);
      navigate('/buyer/orders');
    }, 1500);
  };

  const handleProceedToCreateOrderPage = () => {
    if (!farmer) return;
    navigate(`/buyer/orders/new?farmerId=${farmer.farmerId}&litres=${orderLitres}&date=${collectionDate}&type=${collectionType}`);
  };

  return (
    <div className="ml-buyer-screen">
      <div className="ml-buyer-phone-frame">
        {/* iOS-style Status Bar */}
        <div className="ml-buyer-status-bar">
          <span className="ml-status-time">9:41</span>
          <div className="ml-status-icons">
            <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
              <rect x="0" y="8" width="3" height="3" rx="0.5" fill="#0f172a" />
              <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" fill="#0f172a" />
              <rect x="9" y="3" width="3" height="8" rx="0.5" fill="#0f172a" />
              <rect x="13.5" y="0.5" width="3" height="10.5" rx="0.5" fill="#0f172a" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5ZM8 6C10.3 6 12.3 7 13.7 8.5L12.3 9.9C11.2 8.7 9.7 8 8 8C6.3 8 4.8 8.7 3.7 9.9L2.3 8.5C3.7 7 5.7 6 8 6ZM8 2C11.5 2 14.6 3.5 16.7 5.9L15.3 7.3C13.5 5.3 10.9 4 8 4C5.1 4 2.5 5.3 0.7 7.3L-0.7 5.9C1.4 3.5 4.5 2 8 2Z" fill="#0f172a" />
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#0f172a" />
              <rect x="2" y="2" width="13" height="7" rx="1.5" fill="#0f172a" />
              <path d="M20 3.5V7.5" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Top Header */}
        <header className="ml-buyer-topbar">
          <button
            type="button"
            className="ml-icon-btn"
            onClick={() => navigate('/buyer/search')}
            aria-label="Back to search list"
          >
            <Icon name="arrow-left" size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Farmer Details</h1>
            <p className="text-[11px] text-slate-500">Public listing & credentials</p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/buyer/matches')}
            className="p-2 text-xs font-bold text-sky-700 bg-sky-50 rounded-xl"
          >
            Matches
          </button>
        </header>

        <main className="ml-buyer-content">
          {/* Order Lifecycle Progress */}
          <OrderTimeline currentStep={2} />

          {loading || !farmer ? (
            <div className="p-8 text-center text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100">
              Loading verified farm profile…
            </div>
          ) : (
            <>
              {/* 04: PublicFarmerProfile Component */}
              <PublicFarmerProfile farmer={farmer} />

              {/* 04: MilkAvailabilitySummary Component */}
              <MilkAvailabilitySummary farmer={farmer} requestedLitres={orderLitres} />

              {/* 01: Order Milk CTA Section */}
              <section className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-900">Choose Order Volume</h3>
                  <span className="text-xs font-black text-sky-700">Rs. {farmer.pricePerLitre}/L</span>
                </div>

                {/* Litres Volume Slider & Inputs */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Requested Milk Volume:</span>
                    <span className="text-sm font-black text-sky-700 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200">
                      {orderLitres} Litres
                    </span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max={Math.min(farmer.availableLitres, 200)}
                    step="5"
                    value={orderLitres}
                    onChange={(e) => setOrderLitres(Number(e.target.value))}
                    className="w-full accent-sky-600 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Min: 5L</span>
                    <span>Available: {farmer.availableLitres}L</span>
                    <span>Max: {Math.min(farmer.availableLitres, 200)}L</span>
                  </div>
                </div>

                {/* Collection Method Choice */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">Collection Logistics:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCollectionType('collector')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                        collectionType === 'collector'
                          ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block">🚚 Assign Collector</span>
                      <small className="font-normal text-[10px] text-slate-500">Scheduled route pickup</small>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCollectionType('self')}
                      className={`p-2.5 rounded-xl border text-left text-xs font-bold transition ${
                        collectionType === 'self'
                          ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="block">🏬 Self Pickup</span>
                      <small className="font-normal text-[10px] text-slate-500">Pick up from farm location</small>
                    </button>
                  </div>
                </div>

                {/* Collection Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Collection Date:</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={collectionDate}
                    onChange={(e) => setCollectionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>

                {/* Total Cost Summary */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 font-bold block text-[10px]">Estimated Total Cost:</span>
                    <span className="font-black text-slate-900 text-base">
                      Rs. {(orderLitres * farmer.pricePerLitre).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    ({orderLitres} L @ Rs. {farmer.pricePerLitre})
                  </span>
                </div>

                {/* 05: Screen Flow CTA Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setOrderModalOpen(true)}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-xl shadow-md shadow-sky-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
                  >
                    <span>Order Milk Now ({orderLitres}L)</span>
                    <Icon name="arrow" size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleProceedToCreateOrderPage}
                    className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Custom Order Details Form →
                  </button>
                </div>
              </section>
            </>
          )}
        </main>

        {/* 04: Reusable Buyer Bottom Navigation */}
        <BuyerNav active="search" />

        {/* Instant Order Confirmation Modal */}
        {orderModalOpen && farmer && (
          <div className="ml-modal-backdrop" onClick={() => setOrderModalOpen(false)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Confirm Milk Order</h3>
                  <p className="text-[11px] text-slate-500">Direct booking with {farmer.farmName}</p>
                </div>
                <button
                  type="button"
                  className="ml-modal-close-btn"
                  onClick={() => setOrderModalOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 space-y-3">
                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Producer:</span>
                    <span className="font-bold text-slate-900">{farmer.farmName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Volume:</span>
                    <span className="font-bold text-sky-800">{orderLitres} Litres</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Unit Price:</span>
                    <span>Rs. {farmer.pricePerLitre} / L</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Collection Date:</span>
                    <span className="font-semibold">{collectionDate} ({farmer.supplyWindow})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Logistics:</span>
                    <span className="capitalize">{collectionType} pickup</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-sky-200/80 font-bold">
                    <span>Total Amount:</span>
                    <span className="text-slate-900 font-black text-sm">
                      Rs. {(orderLitres * farmer.pricePerLitre).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-snug">
                  🔒 Note: Your reservation will be sent directly to {farmer.ownerName}. You will receive a notification as soon as the farm confirms stock availability.
                </p>

                {orderSuccess ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-center text-xs font-bold">
                    ✓ Order placed successfully! Directing to My Orders…
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/25 transition"
                  >
                    Confirm & Send Order Request
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
