import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type L from 'leaflet';
import { Icon } from '../../auth/components/AuthUI';
import LeafletMap from '../../../components/maps/LeafletMap';
import RadiusCircle from '../../../components/maps/RadiusCircle';
import ApproximateFarmMarker from '../../../components/maps/ApproximateFarmMarker';
import BuyerNav from '../../buyer/components/BuyerNav';
import FarmerResultCard from '../components/FarmerResultCard';
import OrderTimeline from '../components/OrderTimeline';
import { useNetworkStatus } from '../../../hooks/useNetworkStatus';
import { useGeolocation } from '../../../hooks/useGeolocation';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import { createBuyerOrder } from '../../buyer/data';
import { SRI_LANKA_DISTRICT_CENTRES, calculateDistanceKm, type GeoCoordinates } from '../../../lib/geo';
import type { FarmerSearchResult } from '../types';
import '../../buyer/buyer.css';

export default function NearbyFarmersMapPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isOnline } = useNetworkStatus();
  const { coordinates: gpsCoords } = useGeolocation();

  // Search parameters
  const [district, setDistrict] = useState(searchParams.get('district') || 'Kandy');
  const [radiusKm, setRadiusKm] = useState<number>(Number(searchParams.get('radius')) || 15);
  const [neededLitres] = useState<number>(Number(searchParams.get('litres')) || 25);

  // Map instance
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerSearchResult | null>(ALL_DEMO_FARMERS[0]);
  const [forceNonMapFallback, setForceNonMapFallback] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(neededLitres);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Determine buyer center point
  const buyerCenter: GeoCoordinates = useMemo(() => {
    if (gpsCoords) return gpsCoords;
    const center = SRI_LANKA_DISTRICT_CENTRES[district] || SRI_LANKA_DISTRICT_CENTRES.Kandy;
    return { lat: center[0], lng: center[1] };
  }, [gpsCoords, district]);

  // Compute nearby farms dynamically based on radius from buyerCenter
  const nearbyFarms = useMemo(() => {
    return ALL_DEMO_FARMERS.map((farmer) => {
      const liveDistance = calculateDistanceKm(buyerCenter, farmer.coordinates);
      return { ...farmer, distanceKm: liveDistance };
    }).filter((f) => f.distanceKm <= radiusKm);
  }, [buyerCenter, radiusKm]);

  const handleSelectFarmer = (farmer: FarmerSearchResult) => {
    setSelectedFarmer(farmer);
    if (mapInstance) {
      mapInstance.setView([farmer.coordinates.lat, farmer.coordinates.lng], 14, {
        animate: true,
      });
    }
  };

  const handleConfirmOrder = () => {
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
      setOrderModalOpen(false);
      navigate('/buyer/orders');
    }, 1500);
  };

  // Check whether to show the non-map fallback (offline, tile failure, or manual choice)
  const showFallback = forceNonMapFallback || !isOnline;

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
            onClick={() => navigate('/buyer/search')}
            aria-label="Back to search list"
          >
            <Icon name="arrow-left" size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Nearby Farmers Map</h1>
            <p className="text-[11px] text-slate-500">
              {nearbyFarms.length} farms within {radiusKm} km radius
            </p>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="px-2.5 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 rounded-xl hover:bg-sky-100 transition"
              onClick={() => navigate('/buyer/search')}
            >
              List View
            </button>
          </div>
        </header>

        {/* Pre-acceptance Privacy Notice Banner (Feature B10/B14) */}
        <div className="bg-sky-50 px-3.5 py-2 border-b border-sky-100 flex items-center justify-between text-[11px] text-sky-900">
          <span className="flex items-center gap-1.5 font-semibold">
            <Icon name="shield" size={14} />
            <span>Pre-acceptance privacy: Farm pins are approximate (~1 km buffer).</span>
          </span>
          <button
            type="button"
            onClick={() => setForceNonMapFallback((prev) => !prev)}
            className="text-[10px] font-bold underline text-sky-700 ml-2 shrink-0"
          >
            {showFallback ? 'Show Map' : 'Text Fallback'}
          </button>
        </div>

        {/* Main View Area */}
        <div className="relative flex-1 flex flex-col min-h-0 bg-slate-50">
          {showFallback ? (
            /* 03: Non-map tabular / list fallback when map or GPS is unavailable */
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-amber-900 text-xs">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <Icon name="info" size={16} />
                  <span>Non-Map Fallback Active</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  Live map tiles or GPS are currently unavailable or disabled. Below is the list of nearby verified dairy suppliers calculated from the {district} district center.
                </p>
              </div>

              {/* District & Radius selector in fallback */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] font-bold">Area Center:</span>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
                  >
                    {Object.keys(SRI_LANKA_DISTRICT_CENTRES).map((d) => (
                      <option key={d} value={d}>
                        {d} District
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-1">
                  {[5, 10, 15, 25].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadiusKm(r)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg ${
                        radiusKm === r ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {r} km
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <OrderTimeline currentStep={1} />

              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 pt-1">
                Farms in {district} Area ({nearbyFarms.length})
              </h2>

              <div className="space-y-2.5">
                {nearbyFarms.map((farm) => (
                  <FarmerResultCard
                    key={farm.id}
                    farmer={farm}
                    requestedLitres={neededLitres}
                    onSelect={(f) => handleSelectFarmer(f)}
                    onOrderNow={(f) => {
                      setSelectedFarmer(f);
                      setOrderModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* 01: Leaflet Interactive Map View */
            <div className="relative flex-1 w-full h-full min-h-[380px]">
              {/* Radius Control Filter Bar */}
              <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between bg-white/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <span>Radius:</span>
                  <span className="text-sky-700">{radiusKm} km</span>
                </div>

                <div className="flex gap-1">
                  {[5, 10, 15, 25, 50].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRadiusKm(r)}
                      className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                        radiusKm === r
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {r}km
                    </button>
                  ))}
                </div>
              </div>

              {/* Leaflet Map Component */}
              <LeafletMap
                center={buyerCenter}
                zoom={radiusKm > 20 ? 10 : radiusKm > 10 ? 12 : 13}
                onMapReady={(map) => setMapInstance(map)}
              >
                {/* 04: RadiusCircle rendering search perimeter */}
                <RadiusCircle map={mapInstance} center={buyerCenter} radiusKm={radiusKm} />

                {/* 04: ApproximateFarmMarker for each farm */}
                {nearbyFarms.map((farm) => (
                  <ApproximateFarmMarker
                    key={farm.id}
                    map={mapInstance}
                    farmer={farm}
                    isSelected={selectedFarmer?.id === farm.id}
                    onSelect={(f) => handleSelectFarmer(f)}
                  />
                ))}
              </LeafletMap>

              {/* Toggle Drawer Button */}
              <button
                type="button"
                onClick={() => setDrawerOpen((prev) => !prev)}
                className="absolute top-16 right-3 z-20 p-2.5 bg-white/95 backdrop-blur-md rounded-xl text-slate-700 border border-slate-200 shadow-md text-xs font-bold flex items-center gap-1 hover:bg-slate-50 transition"
              >
                <span>{drawerOpen ? '▼ Hide List' : '▲ Show Farms (' + nearbyFarms.length + ')'}</span>
              </button>

              {/* 01: Result List Drawer at Bottom */}
              {drawerOpen && (
                <div className="ml-map-drawer absolute bottom-0 left-0 right-0">
                  <div className="ml-map-drawer-header">
                    <div>
                      <h2 className="text-xs font-extrabold text-slate-900">
                        Nearby Farms in Perimeter ({nearbyFarms.length})
                      </h2>
                      <p className="text-[10px] text-slate-500">Tap a farm to view location & order</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate('/buyer/matches')}
                      className="text-[11px] font-bold text-sky-700 hover:underline"
                    >
                      Matches →
                    </button>
                  </div>

                  <div className="ml-map-drawer-body">
                    {selectedFarmer && (
                      <div className="bg-sky-50/70 p-3 rounded-2xl border border-sky-100 flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={selectedFarmer.image}
                            alt={selectedFarmer.farmName}
                            className="w-10 h-10 rounded-full object-cover border border-sky-200"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
                            }}
                          />
                          <div>
                            <h3 className="font-bold text-xs text-slate-900 leading-tight">
                              {selectedFarmer.farmName}
                            </h3>
                            <p className="text-[11px] text-slate-500">
                              ~{selectedFarmer.distanceKm.toFixed(1)} km • Rs. {selectedFarmer.pricePerLitre}/L
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => navigate(`/buyer/farmers/${selectedFarmer.farmerId}`)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold bg-white hover:bg-slate-50"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderModalOpen(true)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 text-white text-[11px] font-bold hover:bg-sky-700 shadow-xs"
                          >
                            Order
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {nearbyFarms.map((farm) => (
                        <div
                          key={farm.id}
                          onClick={() => handleSelectFarmer(farm)}
                          className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                            selectedFarmer?.id === farm.id
                              ? 'bg-sky-50 border-sky-300'
                              : 'bg-white border-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">🥛</span>
                            <div>
                              <p className="font-bold text-xs text-slate-800">{farm.farmName}</p>
                              <p className="text-[10px] text-slate-500">
                                ~{farm.distanceKm.toFixed(1)} km away • ★ {farm.rating}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="font-extrabold text-xs text-sky-700">
                              {farm.availableLitres}L
                            </span>
                            <span className="block text-[10px] text-slate-400">
                              Rs. {farm.pricePerLitre}/L
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 04: Buyer Bottom Navigation */}
        <BuyerNav active="search" />

        {/* Quick Order Modal */}
        {orderModalOpen && selectedFarmer && (
          <div className="ml-modal-backdrop" onClick={() => setOrderModalOpen(false)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Order from {selectedFarmer.farmName}</h3>
                  <p className="text-[11px] text-slate-500">
                    Approximate area: ~{selectedFarmer.distanceKm.toFixed(1)} km away
                  </p>
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
                <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Daily Supply:</span>
                    <span className="font-bold text-slate-900">{selectedFarmer.availableLitres} Litres Available</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Price:</span>
                    <span className="font-extrabold text-sky-700">Rs. {selectedFarmer.pricePerLitre} / L</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Order Quantity:</span>
                    <span className="text-sky-700 font-extrabold">{orderQuantity} Litres</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max={Math.min(selectedFarmer.availableLitres, 150)}
                    step="5"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Min: 5L</span>
                    <span>Total: Rs. {(orderQuantity * selectedFarmer.pricePerLitre).toLocaleString()}</span>
                    <span>Max: {Math.min(selectedFarmer.availableLitres, 150)}L</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-slate-600 border border-slate-200">
                  🔒 Exact pickup farm address is revealed automatically once {selectedFarmer.farmName} accepts your order reservation.
                </div>

                {orderSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-bold">
                    ✓ Order Placed! Routing to My Orders…
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/25 transition"
                  >
                    Confirm Order (Rs. {(orderQuantity * selectedFarmer.pricePerLitre).toLocaleString()})
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
