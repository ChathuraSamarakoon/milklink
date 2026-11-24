import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import BuyerOrderCard from '../components/BuyerOrderCard';
import OrderStatusTabs, { type OrderTabOption } from '../components/OrderStatusTabs';
import AssignCollectorModal from '../components/AssignCollectorModal';
import OrderTimeline from '../../discovery/components/OrderTimeline';
import FarmerResultCard from '../../discovery/components/FarmerResultCard';
import BuyerNav from '../../buyer/components/BuyerNav';
import {
  getBuyerOrders,
  assignCollectorToOrder,
  type MilkCollector,
} from '../../buyer/data';
import { ALL_DEMO_FARMERS } from '../../../services/searchApi';
import type { BuyerOrder } from '../types';
import '../../buyer/buyer.css';

export default function MyOrdersPage() {
  const navigate = useNavigate();

  // State
  const [orders, setOrders] = useState<BuyerOrder[]>(() => getBuyerOrders());
  const [activeTab, setActiveTab] = useState<OrderTabOption>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [logisticsFilter, setLogisticsFilter] = useState<'all' | 'collector' | 'self'>('all');

  // Collector Assignment modal state
  const [selectedOrderForCollector, setSelectedOrderForCollector] = useState<BuyerOrder | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<OrderTabOption, number> = {
      all: orders.length,
      pending: 0,
      accepted: 0,
      collected: 0,
      completed: 0,
      declined: 0,
      expired: 0,
      conflict: 0,
    };
    orders.forEach((ord) => {
      if (counts[ord.status] !== undefined) {
        counts[ord.status]++;
      }
    });
    return counts;
  }, [orders]);

  // Pending collector count
  const pendingCollectorCount = useMemo(() => {
    return orders.filter(
      (o) =>
        o.collectionType === 'collector' &&
        !o.collectorAssigned &&
        o.status !== 'declined' &&
        o.status !== 'expired' &&
        o.status !== 'completed'
    ).length;
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }
      // Logistics filter
      if (logisticsFilter !== 'all' && order.collectionType !== logisticsFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesFarmer = order.farmerName.toLowerCase().includes(q);
        const matchesVillage = (order.farmerVillage || '').toLowerCase().includes(q);
        const matchesDistrict = (order.farmerDistrict || '').toLowerCase().includes(q);
        if (!matchesId && !matchesFarmer && !matchesVillage && !matchesDistrict) {
          return false;
        }
      }
      return true;
    });
  }, [orders, activeTab, logisticsFilter, searchQuery]);

  // Actions
  const handleOpenAssignCollector = (order: BuyerOrder) => {
    setSelectedOrderForCollector(order);
    setIsAssignModalOpen(true);
  };

  const handleAssignCollector = (orderId: string, collector: MilkCollector) => {
    const updated = assignCollectorToOrder(orderId, {
      name: collector.name,
      phone: collector.phone,
    });
    setOrders(updated);
    setIsAssignModalOpen(false);
    setSelectedOrderForCollector(null);
  };

  return (
    <div className="ml-buyer-screen"><div className="ml-buyer-phone-frame">
      {/* Top Header */}
      <header className="ml-buyer-topbar ml-orders-topbar">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/buyer')}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-200 transition"
            aria-label="Back to Buyer Dashboard"
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-900 leading-tight">
              My Orders
            </h1>
            <p className="text-[11px] text-slate-500">
              Manage milk requests, logistics & collection status
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => navigate('/buyer/history')}
            className="px-2.5 py-1.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition"
          >
            📊 Ledger
          </button>
          <button
            type="button"
            onClick={() => navigate('/buyer/search')}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 rounded-xl text-xs font-bold border border-sky-200 hover:bg-sky-100 transition flex items-center gap-1"
          >
            <span>+</span> New Order
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="ml-buyer-content space-y-4 pb-24">
        {/* Pending Collector Assignment Alert Banner */}
        {pendingCollectorCount > 0 && (
          <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-3.5 flex items-start gap-3">
            <span className="p-2 bg-amber-500 text-white rounded-xl font-black text-sm shrink-0">
              ⚠️
            </span>
            <div className="flex-1 text-xs">
              <h3 className="font-extrabold text-amber-950">
                Action Required: {pendingCollectorCount} Order{pendingCollectorCount > 1 ? 's' : ''} Need Transporters
              </h3>
              <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                You have orders ready for pickup with no MilkLink collector assigned. Tap &quot;Assign Collector&quot; on any card below to schedule transport.
              </p>
            </div>
          </div>
        )}

        {/* Search & Logistics Filter Bar (Feature 01: search/filter [D]) */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs space-y-2.5">
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, Farm or Location..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
            <span className="text-slate-500 text-[11px] font-medium">Logistics Filter:</span>
            <div className="flex items-center gap-1">
              {(
                [
                  { id: 'all', label: 'All Methods' },
                  { id: 'collector', label: '🚚 Collector' },
                  { id: 'self', label: '🏬 Self-Pickup' },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setLogisticsFilter(m.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                    logisticsFilter === m.id
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Order Status Tabs (Feature 01 & 04: OrderStatusTabs) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Filter by Order Lifecycle
            </span>
            <span className="text-[11px] text-slate-500">
              Showing {filteredOrders.length} of {orders.length}
            </span>
          </div>
          <OrderStatusTabs
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            statusCounts={statusCounts}
          />
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <BuyerOrderCard
                key={order.id}
                order={order}
                onAssignCollector={handleOpenAssignCollector}
              />
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl">
                📦
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                No orders match your filter
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {searchQuery
                  ? `No orders found matching "${searchQuery}". Try adjusting your keywords.`
                  : `There are currently no orders in the "${activeTab}" status category.`}
              </p>
              <div className="pt-2 flex justify-center gap-2">
                {(searchQuery || activeTab !== 'all' || logisticsFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTab('all');
                      setLogisticsFilter('all');
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => navigate('/buyer/search')}
                  className="px-3.5 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700"
                >
                  Find Milk & Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Suggested Nearby Farms fallback (Feature 04: FarmerResultCard reusable integration) */}
        {(activeTab === 'declined' || activeTab === 'expired' || filteredOrders.length === 0) && (
          <div className="bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Suggested Dairy Farms
                </h4>
                <p className="text-[11px] text-slate-500">
                  Ready to fulfill milk orders with active supply windows
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/buyer/search')}
                className="text-xs text-sky-700 font-bold hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {ALL_DEMO_FARMERS.slice(0, 2).map((farm) => (
                <FarmerResultCard
                  key={farm.id}
                  farmer={farm}
                  requestedLitres={30}
                  onSelect={(f) => navigate(`/buyer/farmers/${f.farmerId}`)}
                  onOrderNow={(f) =>
                    navigate(`/buyer/orders/new?farmerId=${f.farmerId}&litres=30`)
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* Reusable OrderTimeline (Feature 04: OrderTimeline) */}
        <div className="pt-2">
          <OrderTimeline currentStep={4} />
        </div>
      </main>

      {/* Assign Collector Modal */}
      <AssignCollectorModal
        isOpen={isAssignModalOpen}
        order={selectedOrderForCollector}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedOrderForCollector(null);
        }}
        onAssign={handleAssignCollector}
      />

      {/* Buyer Bottom Navigation (Feature 04: BuyerNav) */}
      <BuyerNav active="orders" />
    </div></div>
  );
}
