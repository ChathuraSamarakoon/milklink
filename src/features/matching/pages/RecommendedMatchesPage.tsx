import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import MatchCard from '../components/MatchCard';
import BuyerNav from '../../buyer/components/BuyerNav';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import { getRecommendedMatchesApi, DEFAULT_MATCHING_WEIGHTS } from '../../../services/matchingApi';
import { createBuyerOrder } from '../../buyer/data';
import type { RankedMatch, MatchingWeights } from '../types';
import '../../buyer/buyer.css';

export default function RecommendedMatchesPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Inputs
  const [requestedLitres, setRequestedLitres] = useState(Number(searchParams.get('litres')) || 30);
  const [collectionDate] = useState(searchParams.get('date') || new Date().toISOString().split('T')[0]);
  const [radiusKm] = useState(Number(searchParams.get('radius')) || 25);
  const [district] = useState(searchParams.get('district') || 'Kandy');

  // Filter / Sort States
  const [minScoreFilter, setMinScoreFilter] = useState<number>(0);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'score' | 'distance' | 'price' | 'quantity'>('score');
  const [weights] = useState<MatchingWeights>(DEFAULT_MATCHING_WEIGHTS);

  // Data state
  const [matches, setMatches] = useState<RankedMatch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMatch, setSelectedMatch] = useState<RankedMatch | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(requestedLitres);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [weightsExplained, setWeightsExplained] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [requestedLitres, collectionDate, radiusKm, district, organicOnly]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await getRecommendedMatchesApi({
        requestedLitres,
        collectionDate,
        maxRadiusKm: radiusKm,
        buyerDistrict: district,
        organicOnly,
        customWeights: weights,
      });
      setMatches(data);
    } catch (e) {
      console.warn('Matching algorithm error', e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered & Sorted matches
  const displayedMatches = useMemo(() => {
    return matches
      .filter((m) => {
        if (minScoreFilter > 0 && m.totalScore < minScoreFilter) return false;
        if (organicOnly && !m.farmer.organic) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.totalScore - a.totalScore;
        if (sortBy === 'distance') return a.farmer.distanceKm - b.farmer.distanceKm;
        if (sortBy === 'price') return a.farmer.pricePerLitre - b.farmer.pricePerLitre;
        if (sortBy === 'quantity') return b.farmer.availableLitres - a.farmer.availableLitres;
        return 0;
      });
  }, [matches, minScoreFilter, organicOnly, sortBy]);

  const handleSelectMatch = (match: RankedMatch) => {
    setSelectedMatch(match);
    setOrderQuantity(requestedLitres);
    setOrderModalOpen(true);
  };

  const handleConfirmOrder = () => {
    if (!selectedMatch) return;
    createBuyerOrder({
      farmerName: selectedMatch.farmer.farmName,
      quantity: orderQuantity,
      pricePerLitre: selectedMatch.farmer.pricePerLitre,
      totalAmount: orderQuantity * selectedMatch.farmer.pricePerLitre,
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
            aria-label="Back to search"
          >
            <Icon name="arrow-left" size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Recommended Matches</h1>
            <p className="text-[11px] text-slate-500">
              Rule-based scoring ({requestedLitres}L • {district})
            </p>
          </div>

          <button
            type="button"
            className="p-2 text-xs font-bold text-sky-700 bg-sky-50 rounded-xl"
            onClick={() => navigate('/buyer/search/map')}
          >
            🗺 Map
          </button>
        </header>

        <main className="ml-buyer-content">
          {/* Order Lifecycle Timeline */}
          <OrderTimeline currentStep={1} />

          {/* 01: Four Weighted Factors Explainer Card */}
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200/90 rounded-2xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-sky-600 text-white rounded-lg text-xs font-black">⚖</span>
                <div>
                  <h2 className="text-xs font-bold text-slate-900">Four Weighted Factors</h2>
                  <p className="text-[10px] text-slate-600">Deterministic rule-based ranking</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setWeightsExplained((prev) => !prev)}
                className="text-[11px] font-bold text-sky-700 underline"
              >
                {weightsExplained ? 'Close' : 'Weights'}
              </button>
            </div>

            {/* Weights summary badges */}
            <div className="grid grid-cols-4 gap-1.5 pt-1 text-center">
              <div className="bg-white/90 p-1.5 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-400 block font-bold">Quantity</span>
                <span className="text-xs font-black text-emerald-700">30%</span>
              </div>
              <div className="bg-white/90 p-1.5 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-400 block font-bold">Distance</span>
                <span className="text-xs font-black text-sky-700">30%</span>
              </div>
              <div className="bg-white/90 p-1.5 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-400 block font-bold">Price</span>
                <span className="text-xs font-black text-blue-700">25%</span>
              </div>
              <div className="bg-white/90 p-1.5 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-400 block font-bold">Availability</span>
                <span className="text-xs font-black text-amber-700">15%</span>
              </div>
            </div>

            {weightsExplained && (
              <div className="mt-2 p-2.5 bg-white rounded-xl text-[11px] text-slate-600 space-y-1 border border-sky-100 animate-in fade-in">
                <p>
                  <strong>Rule-based mathematical formula:</strong><br />
                  <code>Score = (0.30 × QuantityFit) + (0.30 × Proximity) + (0.25 × PriceCompetitiveness) + (0.15 × Availability)</code>
                </p>
                <p className="text-[10px] text-slate-500 pt-0.5">
                  Notice: Ranking is calculated strictly by rule-based constraints, not opaque machine learning.
                </p>
              </div>
            )}
          </div>

          {/* Volume Adjuster Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700">Needed Volume:</span>
            <div className="flex items-center gap-2">
              {[15, 30, 50, 100].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setRequestedLitres(v)}
                  className={`px-2 py-1 rounded-lg font-bold text-xs transition ${
                    requestedLitres === v
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v}L
                </button>
              ))}
            </div>
          </div>

          {/* Filter & Sort Controls [D] */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Filter Matches:</span>
              <label className="flex items-center gap-1.5 cursor-pointer font-bold text-slate-700 select-none text-[11px]">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-sky-600"
                />
                <span>Organic only</span>
              </label>
            </div>

            <div className="flex items-center justify-between gap-2">
              {/* Min score chips */}
              <div className="flex gap-1">
                {[
                  { label: 'All', score: 0 },
                  { label: '80%+', score: 80 },
                  { label: '90%+', score: 90 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setMinScoreFilter(item.score)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition ${
                      minScoreFilter === item.score
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <span className="text-[11px] text-slate-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 outline-none"
                >
                  <option value="score">Overall Score</option>
                  <option value="distance">Distance</option>
                  <option value="price">Lowest Price</option>
                  <option value="quantity">Max Litres</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Ranked Supplier Matches ({displayedMatches.length})
              </h2>
              <span className="text-[11px] text-slate-400">Updated today</span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 font-semibold bg-white rounded-2xl border border-slate-100">
                Calculating weighted rule scores…
              </div>
            ) : displayedMatches.length === 0 ? (
              <div className="p-6 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
                <p className="font-bold text-sm text-slate-800">No matches above {minScoreFilter}%</p>
                <p className="text-xs text-slate-400">Try lowering the minimum score or clearing filters.</p>
                <button
                  type="button"
                  onClick={() => {
                    setMinScoreFilter(0);
                    setOrganicOnly(false);
                  }}
                  className="text-xs font-bold text-sky-700 underline"
                >
                  Reset Match Filters
                </button>
              </div>
            ) : (
              displayedMatches.map((match) => (
                <MatchCard
                  key={match.farmer.id}
                  match={match}
                  requestedLitres={requestedLitres}
                  onSelect={handleSelectMatch}
                  onViewFarm={(farmerId) => navigate(`/buyer/farmers/${farmerId}`)}
                />
              ))
            )}
          </div>
        </main>

        <BuyerNav active="search" />

        {/* Order Modal */}
        {orderModalOpen && selectedMatch && (
          <div className="ml-modal-backdrop" onClick={() => setOrderModalOpen(false)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black px-1.5 py-0.5 bg-amber-500 text-white rounded-md">
                      #{selectedMatch.rank} Match
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">{selectedMatch.farmer.farmName}</h3>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Match Score: {selectedMatch.totalScore}% • ~{selectedMatch.farmer.distanceKm.toFixed(1)} km away
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
                    <span className="font-bold text-slate-900">{selectedMatch.farmer.availableLitres} Litres Available</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[11px]">Price:</span>
                    <span className="font-extrabold text-sky-700">Rs. {selectedMatch.farmer.pricePerLitre} / L</span>
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
                    max={Math.min(selectedMatch.farmer.availableLitres, 150)}
                    step="5"
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Min: 5L</span>
                    <span>Total: Rs. {(orderQuantity * selectedMatch.farmer.pricePerLitre).toLocaleString()}</span>
                    <span>Max: {Math.min(selectedMatch.farmer.availableLitres, 150)}L</span>
                  </div>
                </div>

                {orderSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center text-xs font-bold">
                    ✓ Recommended Match Order Placed! Routing to My Orders…
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmOrder}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-md shadow-sky-600/25 transition"
                  >
                    Confirm Order (Rs. {(orderQuantity * selectedMatch.farmer.pricePerLitre).toLocaleString()})
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
