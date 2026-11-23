import { useState, useId } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import OrderReviewCard from '../components/OrderReviewCard';
import ReservationNotice from '../components/ReservationNotice';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import BuyerNav from '../../buyer/components/BuyerNav';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import { placeOrderAtomicallyApi } from '../../../services/ordersApi';
import type { ReviewOrderDetails, ReservationResult } from '../types';
import '../../buyer/buyer.css';

export default function ReviewMilkOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formSubmitId = useId();

  // Params
  const farmerId = searchParams.get('farmerId') || 'SRCH-001';
  const farmer =
    ALL_DEMO_FARMERS.find((f) => f.farmerId === farmerId || f.id === farmerId) || ALL_DEMO_FARMERS[0];

  const [requestedLitres, setRequestedLitres] = useState(Number(searchParams.get('litres')) || 30);
  const [collectionDate] = useState(
    searchParams.get('date') || new Date().toISOString().split('T')[0]
  );
  const [collectionType] = useState<'collector' | 'self'>(
    (searchParams.get('type') as 'collector' | 'self') || 'collector'
  );
  const [deliveryAddress] = useState(
    searchParams.get('address') || 'No. 45, Peradeniya Road, Kandy'
  );
  const [specialInstructions] = useState(
    searchParams.get('notes') || 'Morning delivery requested. Please ensure chilled containers.'
  );

  // In-flight & submission protection state (Feature 01: Submit-once confirmation button)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<ReservationResult | null>(null);
  const [isQuantityEditorOpen, setIsQuantityEditorOpen] = useState(false);
  const [tempLitres, setTempLitres] = useState(requestedLitres);

  const pricePerLitre = farmer.pricePerLitre;
  const calculatedEstimate = requestedLitres * pricePerLitre;

  const reviewDetails: ReviewOrderDetails = {
    farmerId: farmer.farmerId,
    farmerName: farmer.farmName,
    farmerDistrict: farmer.district,
    farmerVillage: farmer.village,
    farmerImage: farmer.image,
    requestedLitres,
    collectionDate,
    quotedPricePerLitre: pricePerLitre,
    calculatedEstimate,
    collectionType,
    deliveryAddress,
    specialInstructions,
    availableStockSnapshot: farmer.availableLitres,
    quoteValidUntil: '15 mins',
    priceLockToken: `TOKEN-${farmer.id}-${Date.now()}`,
  };

  /**
   * 02: Place Order online
   * 03: The server must atomically reserve litres, reject stale availability and prevent double submit.
   * Do not assume success before response.
   */
  const handlePlaceOrder = async () => {
    if (isSubmitting) return; // Prevent double submit

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const idempotencyKey = `SUBMIT-${formSubmitId}-${farmer.farmerId}-${requestedLitres}-${collectionDate}`;
      const result = await placeOrderAtomicallyApi(reviewDetails, idempotencyKey);

      if (result.success && result.orderId) {
        // Navigate to Order Details (Flow: Review order → Place → Order Details)
        navigate(`/buyer/orders/${result.orderId}`);
      } else {
        // 01: Server reservation error state (e.g. stale availability)
        setSubmissionError(result);
      }
    } catch {
      setSubmissionError({
        success: false,
        errorCode: 'OFFLINE',
        message: 'Network error communicating with the reservation server. Please verify your connection.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <Icon name="arrow-left" size={20} />
          </button>

          <div className="text-center">
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">Review & Place Order</h1>
            <p className="text-[11px] text-slate-500">Verify details before submission</p>
          </div>

          <span className="w-8" />
        </header>

        <main className="ml-buyer-content">
          {/* Order Lifecycle Progress */}
          <OrderTimeline currentStep={3} />

          {/* 01: Server Reservation Error State */}
          {submissionError && (
            <div
              className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 space-y-2 animate-in fade-in"
              role="alert"
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-black">⚠</span>
                <h4 className="font-bold text-xs">Server Reservation Failed</h4>
              </div>
              <p className="text-xs text-rose-800 leading-snug">
                {submissionError.message}
              </p>
              {submissionError.errorCode === 'STALE_AVAILABILITY' && (
                <div className="pt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (submissionError.updatedAvailableStock) {
                        setRequestedLitres(submissionError.updatedAvailableStock);
                      }
                      setSubmissionError(null);
                    }}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-rose-700"
                  >
                    Adjust to {submissionError.updatedAvailableStock || farmer.availableLitres}L
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/buyer/search')}
                    className="px-3 py-1.5 bg-white border border-rose-200 text-rose-800 rounded-xl text-xs font-bold"
                  >
                    Find Other Farmers
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 04: OrderReviewCard Component */}
          <OrderReviewCard
            details={reviewDetails}
            onEditQuantity={() => {
              setTempLitres(requestedLitres);
              setIsQuantityEditorOpen(true);
            }}
          />

          {/* 04: ReservationNotice Component */}
          <ReservationNotice
            litres={requestedLitres}
            farmerName={farmer.farmName}
            quoteValidUntil="15 minutes"
          />

          {/* 01: Submit-Once Confirmation Button */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              disabled={isSubmitting || requestedLitres <= 0}
              onClick={handlePlaceOrder}
              className={`w-full py-3.5 rounded-xl font-black text-sm text-white shadow-md flex items-center justify-center gap-2 transition ${
                isSubmitting
                  ? 'bg-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25 active:scale-[0.99]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Reserving Stock Atomically…</span>
                </>
              ) : (
                <>
                  <span>Place Order & Reserve ({requestedLitres}L)</span>
                  <Icon name="arrow" size={16} />
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-slate-400">
              🔒 Double-submit protected. Response is verified before confirmation.
            </p>
          </div>
        </main>

        <BuyerNav active="orders" />

        {/* Quick Quantity Edit Sheet */}
        {isQuantityEditorOpen && (
          <div className="ml-modal-backdrop" onClick={() => setIsQuantityEditorOpen(false)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-sm text-slate-900">Adjust Order Volume</h3>
                <button
                  type="button"
                  className="ml-modal-close-btn"
                  onClick={() => setIsQuantityEditorOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 space-y-3 text-xs">
                <div className="flex justify-between items-center font-bold text-slate-700">
                  <span>Selected Litres:</span>
                  <span className="text-sm font-black text-sky-700">{tempLitres} Litres</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={farmer.availableLitres}
                  step="5"
                  value={tempLitres}
                  onChange={(e) => setTempLitres(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
                <button
                  type="button"
                  onClick={() => {
                    setRequestedLitres(tempLitres);
                    setIsQuantityEditorOpen(false);
                  }}
                  className="w-full py-2.5 bg-sky-600 text-white font-bold rounded-xl shadow-xs"
                >
                  Apply {tempLitres} Litres (Rs. {(tempLitres * pricePerLitre).toLocaleString()})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
