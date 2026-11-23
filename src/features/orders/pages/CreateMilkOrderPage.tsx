import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import BuyerNav from '../../buyer/components/BuyerNav';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import '../../buyer/buyer.css';

export default function CreateMilkOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const farmerId = searchParams.get('farmerId') || 'SRCH-001';
  const farmer = ALL_DEMO_FARMERS.find((f) => f.farmerId === farmerId || f.id === farmerId) || ALL_DEMO_FARMERS[0];

  const [quantity, setQuantity] = useState(Number(searchParams.get('litres')) || 30);
  const [collectionDate, setCollectionDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [collectionType, setCollectionType] = useState<'collector' | 'self'>(
    (searchParams.get('type') as 'collector' | 'self') || 'collector'
  );
  const [deliveryAddress, setDeliveryAddress] = useState('No. 45, Peradeniya Road, Kandy');
  const [orderNotes, setOrderNotes] = useState('');

  const pricePerLitre = farmer.pricePerLitre;
  const totalAmount = quantity * pricePerLitre;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/buyer/orders/review?farmerId=${farmer.farmerId}&litres=${quantity}&date=${collectionDate}&type=${collectionType}&address=${encodeURIComponent(
        deliveryAddress
      )}&notes=${encodeURIComponent(orderNotes)}`
    );
  };

  return (
    <div className="ml-buyer-screen">
      <div className="ml-buyer-phone-frame">
        {/* Top Header */}
        <header className="ml-buyer-topbar">
          <button
            type="button"
            className="ml-icon-btn"
            onClick={() => navigate(`/buyer/farmers/${farmer.farmerId}`)}
            aria-label="Back to farmer"
          >
            <Icon name="arrow-left" size={20} />
          </button>
          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Create Milk Order</h1>
            <p className="text-[11px] text-slate-500">Order from {farmer.farmName}</p>
          </div>
          <span className="w-8" />
        </header>

        <main className="ml-buyer-content">
          {/* Order Lifecycle Timeline */}
          <OrderTimeline currentStep={2} />

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Farm Banner Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={farmer.image}
                  alt={farmer.farmName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-sky-100"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
                  }}
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{farmer.farmName}</h3>
                  <p className="text-xs text-slate-500">{farmer.village}, {farmer.district}</p>
                  <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                    {farmer.availableLitres}L Available @ Rs. {farmer.pricePerLitre}/L
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity & Calculation */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <label className="text-xs font-bold text-slate-700 flex justify-between">
                <span>Milk Volume (Litres) *</span>
                <span className="text-sm font-black text-sky-700">{quantity} Litres</span>
              </label>

              <input
                type="range"
                min="5"
                max={Math.min(farmer.availableLitres, 200)}
                step="5"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Unit Price</span>
                  <span className="font-bold text-slate-800">Rs. {pricePerLitre} / L</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">Total Payable</span>
                  <span className="font-black text-sky-800 text-sm">Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Collection Logistics */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Collection & Logistics Method</h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCollectionType('collector')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                    collectionType === 'collector'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block text-sm">🚚 Assign Collector</span>
                  <small className="font-normal text-[10px] text-slate-500">Pick up & verify milk</small>
                </button>

                <button
                  type="button"
                  onClick={() => setCollectionType('self')}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                    collectionType === 'self'
                      ? 'bg-sky-50 border-sky-500 text-sky-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <span className="block text-sm">🏬 Self Pickup</span>
                  <small className="font-normal text-[10px] text-slate-500">Buyer collects directly</small>
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Collection Date:</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Delivery / Receiving Address:</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none"
                  placeholder="Enter dairy shop / factory address"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 block">Special Instructions (Optional):</label>
                <textarea
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-none"
                  placeholder="e.g. Bring chilled milk storage cans, morning arrival before 8:00 AM."
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-sm rounded-xl shadow-md shadow-sky-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              <span>Review & Place Order (Rs. {totalAmount.toLocaleString()})</span>
              <Icon name="arrow" size={16} />
            </button>
          </form>
        </main>

        <BuyerNav active="orders" />
      </div>
    </div>
  );
}
