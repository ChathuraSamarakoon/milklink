import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { useGeolocation } from '../../../hooks/useGeolocation';
import OnlineRequiredNotice from '../components/OnlineRequiredNotice';
import FarmerSearchForm from '../components/FarmerSearchForm';
import FarmerResultCard from '../components/FarmerResultCard';
import OrderTimeline from '../components/OrderTimeline';
import BuyerNav from '../../buyer/components/BuyerNav';
import { searchNearbyFarmersApi, ALL_DEMO_FARMERS } from '../../../services/searchApi';
import { createBuyerOrder } from '../../buyer/data';
import type { FarmerSearchParams, FarmerSearchResult, SearchSortOption } from '../types';
import '../../buyer/buyer.css';

export default function FindFarmersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isOnline } = useNetworkStatus();
  const { coordinates } = useGeolocation();

  // Search parameters
  const [params, setParams] = useState<FarmerSearchParams>({
    litres: Number(searchParams.get('litres')) || 25,
    collectionDate: searchParams.get('date') || new Date().toISOString().split('T')[0],
    radiusKm: Number(searchParams.get('radius')) || 15,
    district: searchParams.get('district') || 'Kandy',
    coordinates: coordinates,
    organicOnly: searchParams.get('organic') === 'true',
  });

  // State
  const [results, setResults] = useState<FarmerSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<SearchSortOption>('distance');
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerSearchResult | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(params.litres);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Initial auto-search on mount
  useEffect(() => {
    handleSearch(params);
  }, []);

  const handleSearch = async (searchArgs: FarmerSearchParams) => {
    setParams(searchArgs);
    setOrderQuantity(searchArgs.litres);
    setLoading(true);
    try {
      const data = await searchNearbyFarmersApi(searchArgs);
      setResults(data);
      setHasSearched(true);
    } catch (e) {
      console.warn('Search failed', e);
      setResults(ALL_DEMO_FARMERS.slice(0, 3));
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  // Sorted results
  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'distance') return a.distanceKm - b.distanceKm;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price_asc') return a.pricePerLitre - b.pricePerLitre;
    if (sortBy === 'litres_desc') return b.availableLitres - a.availableLitres;
    return 0;
  });

  const handlePlaceOrder = () => {
    if (!selectedFarmer) return;
    createBuyerOrder({
      farmerName: selectedFarmer.farmName,
      quantity: orderQuantity,
      pricePerLitre: selectedFarmer.pricePerLitre,
      totalAmount: orderQuantity * selectedFarmer.pricePerLitre,
      status: 'pending',
      collectionType: 'collector',
    });
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedFarmer(null);
      navigate('/buyer/orders');
    }, 1500);
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

        {/* Top Header Bar */}
        <header className="ml-buyer-topbar">
          <button
            type="button"
            className="ml-icon-btn"
            onClick={() => navigate('/buyer')}
            aria-label="Back to dashboard"
          >
            <Icon name="arrow-left" size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Find Farmers</h1>
            <p className="text-[11px] text-slate-500">Live dairy inventory search</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className={`p-2 rounded-xl text-xs font-bold transition ${
                viewMode === 'map' ? 'bg-sky-100 text-sky-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
              onClick={() => setViewMode((m) => (m === 'list' ? 'map' : 'list'))}
              title="Toggle Map View"
            >
              {viewMode === 'map' ? 'List' : '🗺 Map'}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="ml-buyer-content">
          {/* 01: Online Required Notice */}
          <OnlineRequiredNotice isOnline={isOnline} />

          {/* 04: Order Lifecycle Timeline */}
          <OrderTimeline currentStep={1} />

          {/* 01: FarmerSearchForm */}
          <FarmerSearchForm
            initialParams={params}
            onSearch={handleSearch}
            isOnline={isOnline}
            loading={loading}
          />

          {/* Matches & Recommended Quick Link */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-600 text-white rounded-lg text-xs font-bold">★</span>
              <div>
                <p className="text-xs font-bold text-slate-800">Need automatic supplier matching?</p>
                <p className="text-[10px] text-slate-500">View smart recommendations based on recurring volume</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/buyer/matches')}
              className="px-2.5 py-1.5 bg-white border border-sky-200 text-sky-700 rounded-xl text-xs font-bold hover:bg-sky-50"
            >
              Matches →
            </button>
          </div>

          {/* Results Header & Sort Controls */}
          {hasSearched && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Available Farmers ({sortedResults.length})
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Within {params.radiusKm} km radius for {params.litres}L
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SearchSortOption)}
                    className="bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2 py-1 outline-none shadow-2xs"
                  >
                    <option value="distance">Distance</option>
                    <option value="rating">Rating</option>
                    <option value="price_asc">Price (Low)</option>
                    <option value="litres_desc">Litres Available</option>
                  </select>
                </div>
              </div>

              {/* View Mode: Map View */}
              {viewMode === 'map' && (
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
                  <div className="h-56 bg-slate-100 rounded-xl relative overflow-hidden flex items-center justify-center border border-slate-200">
                    <img
                      src="/images/location-landscape.webp"
                      alt="Map view showing farmers"
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-sky-950/20 backdrop-blur-3xs" />
                    <div className="absolute text-center p-3 bg-white/95 rounded-xl shadow-md border border-slate-200 max-w-[85%]">
                      <p className="text-xs font-bold text-slate-800">📍 Interactive Geographic Map</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {sortedResults.length} registered farms found around {params.district} ({params.radiusKm} km radius).
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate('/buyer/search/map')}
                        className="mt-2 text-xs font-bold text-sky-700 underline"
                      >
                        Open Full Screen Map →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results List */}
              {sortedResults.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200 text-slate-600 space-y-2">
                  <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto text-xl">
                    🔍
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">No farmers meet these criteria</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Try expanding your search radius to 25 km or 50 km, or lowering the requested milk quantity.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleSearch({ ...params, radiusKm: 50, litres: 10 })}
                    className="mt-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-sky-700"
                  >
                    Expand to 50 km Radius
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedResults.map((farmer) => (
                    <FarmerResultCard
                      key={farmer.id}
                      farmer={farmer}
                      requestedLitres={params.litres}
                      onSelect={(f) => setSelectedFarmer(f)}
                      onOrderNow={(f) => {
                        setSelectedFarmer(f);
                        setOrderQuantity(params.litres);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        {/* 04: Reusable Buyer Bottom Navigation */}
        <BuyerNav active="search" />

        {/* Quick Order / Farm Details Sheet Modal */}
        {selectedFarmer && (
          <div className="ml-modal-backdrop" onClick={() => setSelectedFarmer(null)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />

              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedFarmer.image}
                    alt={selectedFarmer.farmName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-sky-100"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedFarmer.farmName}</h3>
                    <p className="text-xs text-slate-500">
                      {selectedFarmer.village}, {selectedFarmer.district} • {selectedFarmer.distanceKm.toFixed(1)} km
                    </p>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500 mt-0.5">
                      ★ {selectedFarmer.rating} ({selectedFarmer.reviewsCount} reviews)
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded-md ml-1">
                        {selectedFarmer.qualityGrade}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-modal-close-btn"
                  onClick={() => setSelectedFarmer(null)}
                >
                  ✕
                </button>
              </div>

              {/* Supply Details */}
              <div className="mt-3 p-3 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Available Stock:</span>
                  <span className="font-bold text-slate-900">{selectedFarmer.availableLitres} Litres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Price per Litre:</span>
                  <span className="font-bold text-sky-700">Rs. {selectedFarmer.pricePerLitre} / L</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Pickup Window:</span>
                  <span className="font-semibold">{selectedFarmer.supplyWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Daily Capacity:</span>
                  <span>{selectedFarmer.dailyCapacity} L/day</span>
                </div>
              </div>

              {/* Order Quantity Adjuster */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Order Quantity:</span>
                  <span className="text-sm font-extrabold text-sky-700">{orderQuantity} L</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={Math.min(selectedFarmer.availableLitres, 200)}
                  step="5"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Min: 5L</span>
                  <span>Total: Rs. {(orderQuantity * selectedFarmer.pricePerLitre).toLocaleString()}</span>
                  <span>Max: {Math.min(selectedFarmer.availableLitres, 200)}L</span>
                </div>
              </div>

              {orderSuccess ? (
                <div className="mt-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-bold animate-in fade-in">
                  ✓ Order submitted! Directing to My Orders…
                </div>
              ) : (
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/buyer/farmers/${selectedFarmer.farmerId}`);
                    }}
                    className="px-3.5 py-3 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Full Profile
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/25 transition"
                  >
                    Confirm Order • Rs. {(orderQuantity * selectedFarmer.pricePerLitre).toLocaleString()}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
