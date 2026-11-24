import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import BuyerMonthlySummary, { type MonthOption } from '../components/BuyerMonthlySummary';
import CashPaymentBadge from '../components/CashPaymentBadge';
import FarmerResultCard from '../../discovery/components/FarmerResultCard';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import BuyerNav from '../../buyer/components/BuyerNav';
import { getBuyerOrders } from '../../buyer/data';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import type { BuyerOrder } from '../types';
import '../../buyer/buyer.css';

const MONTHS: MonthOption[] = [
  { key: 'all', label: 'All Purchases (All Time)' },
  { key: '2026-11', label: 'November 2026' },
  { key: '2026-10', label: 'October 2026' },
  { key: '2026-09', label: 'September 2026' },
];

export default function BuyerOrderHistoryPage() {
  const navigate = useNavigate();

  // State
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [orders] = useState<BuyerOrder[]>(() => getBuyerOrders());

  // Filter completed and previous purchases
  // Feature 03: Monthly values should use actual collected quantity and final amount
  const completedOrders = useMemo(() => {
    return orders.filter(
      (ord) => ord.status === 'completed' || ord.status === 'collected'
    );
  }, [orders]);

  // Filter by selected month
  const filteredOrders = useMemo(() => {
    if (selectedMonth === 'all') return completedOrders;
    return completedOrders.filter((ord) => {
      if (ord.monthKey) return ord.monthKey === selectedMonth;
      if (selectedMonth === '2026-11') return ord.orderDate.includes('Nov') || ord.orderDate.includes('Today') || ord.orderDate.includes('Yesterday');
      if (selectedMonth === '2026-10') return ord.orderDate.includes('Oct');
      if (selectedMonth === '2026-09') return ord.orderDate.includes('Sep');
      return true;
    });
  }, [completedOrders, selectedMonth]);

  // Summary Metrics: Sum of actual collected litres and final recorded cash amounts
  const summaryMetrics = useMemo(() => {
    let totalLitres = 0;
    let totalCash = 0;

    filteredOrders.forEach((ord) => {
      const litres = ord.actualLitres ?? ord.quantity;
      totalLitres += litres;
      totalCash += ord.totalAmount;
    });

    const avgRate = totalLitres > 0 ? totalCash / totalLitres : 0;

    return {
      totalLitres,
      totalCash,
      count: filteredOrders.length,
      avgRate,
    };
  }, [filteredOrders]);

  return (
    <div className="ml-buyer-screen">
      <div className="ml-buyer-phone-frame">
        {/* Top Header */}
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
            <h1 className="text-base font-extrabold text-slate-900 leading-tight">
              Order History & Ledger
            </h1>
            <p className="text-[11px] text-slate-500">
              Monthly Collected Volumes & Cash
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
          {/* Reusable BuyerMonthlySummary (Feature 01: month filter, MonthlyLitresCard, MonthlyAmountCard) */}
          <BuyerMonthlySummary
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            months={MONTHS}
            totalLitres={summaryMetrics.totalLitres}
            totalAmount={summaryMetrics.totalCash}
            ordersCount={summaryMetrics.count}
            avgRatePerLitre={summaryMetrics.avgRate}
          />

          {/* Quick Month Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {MONTHS.map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setSelectedMonth(m.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${
                  selectedMonth === m.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Previous Completed Orders List (Feature 01: Completed/previous order list) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Purchased Batches ({filteredOrders.length})
              </span>
              <span className="text-[11px] text-slate-500 font-semibold">
                Tap card to drill-down
              </span>
            </div>

            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const collectedLitres = order.actualLitres ?? order.quantity;

                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/buyer/orders/${order.id}`)}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer space-y-2.5"
                  >
                    {/* Header: Order ID, Date & Status */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-black text-slate-900">
                            #{order.id}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            • {order.orderDate}
                          </span>
                        </div>
                        <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">
                          {order.farmerName}
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          {order.farmerVillage ? `${order.farmerVillage}, ` : ''}
                          {order.farmerDistrict || 'Central Province'}
                        </p>
                      </div>

                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        ✓ {order.status === 'completed' ? 'Completed' : 'Collected'}
                      </span>
                    </div>

                    {/* Litres Breakdown: Actual collected vs requested */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Collected Vol
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          {collectedLitres} L
                        </span>
                        {order.actualLitres && order.actualLitres !== order.quantity && (
                          <span className="text-[9px] text-slate-400 block">
                            (Req: {order.quantity}L)
                          </span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Unit Rate
                        </span>
                        <span className="font-extrabold text-sky-700 text-sm">
                          Rs. {order.pricePerLitre}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">
                          Final Cash
                        </span>
                        <span className="font-black text-slate-900 text-sm">
                          Rs. {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Reusable CashPaymentBadge (Feature 01: recorded cash amount & Feature 04: CashPaymentBadge) */}
                    <div className="flex items-center justify-between pt-1">
                      <CashPaymentBadge
                        amount={order.totalAmount}
                        receiptNumber={order.cashReceiptNumber || `CASH-REC-${order.id.replace('ORD-', '')}`}
                        status={order.cashPaymentStatus || 'recorded_cash'}
                      />

                      {/* Order drill-down button (Feature 01 & 02: order drill-down) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/buyer/orders/${order.id}`);
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition shadow-2xs shrink-0"
                      >
                        Details →
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="text-2xl">📦</span>
                <h4 className="text-sm font-bold text-slate-800">
                  No purchase records for {MONTHS.find((m) => m.key === selectedMonth)?.label}
                </h4>
                <p className="text-xs text-slate-500">
                  Switch the period filter to view previous completed milk orders.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedMonth('all')}
                  className="mt-2 px-3.5 py-1.5 bg-sky-600 text-white rounded-xl text-xs font-bold"
                >
                  Show All Time
                </button>
              </div>
            )}
          </div>

          {/* Frequently Ordered Producers (Feature 04: FarmerResultCard) */}
          <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-2.5 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Re-Order from Trusted Producers
                </h4>
                <p className="text-[11px] text-slate-500">
                  Producers with highest verified quality rating
                </p>
              </div>
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
                requestedLitres={50}
                onSelect={(f) => navigate(`/buyer/farmers/${f.farmerId}`)}
                onOrderNow={(f) =>
                  navigate(`/buyer/orders/new?farmerId=${f.farmerId}&litres=50`)
                }
              />
            ))}
          </div>

          {/* Reusable OrderTimeline (Feature 04: OrderTimeline, Lifecycle Completed) */}
          <div className="pt-2">
            <OrderTimeline currentStep={5} />
          </div>
        </main>

        {/* Bottom Navigation (Feature 04: BuyerNav) */}
        <BuyerNav active="orders" />
      </div>
    </div>
  );
}
