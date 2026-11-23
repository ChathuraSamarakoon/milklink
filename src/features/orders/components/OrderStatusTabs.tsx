import type { BuyerOrderStatus } from '../types';

export type OrderTabOption = 'all' | BuyerOrderStatus;

interface OrderStatusTabsProps {
  activeTab: OrderTabOption;
  onSelectTab: (tab: OrderTabOption) => void;
  statusCounts: Record<OrderTabOption, number>;
  className?: string;
}

const TABS: { id: OrderTabOption; label: string; color: string }[] = [
  { id: 'all', label: 'All Orders', color: 'bg-slate-900 text-white' },
  { id: 'pending', label: 'Pending', color: 'bg-amber-600 text-white' },
  { id: 'accepted', label: 'Accepted', color: 'bg-emerald-600 text-white' },
  { id: 'collected', label: 'Collected', color: 'bg-blue-600 text-white' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-700 text-white' },
  { id: 'declined', label: 'Declined', color: 'bg-rose-600 text-white' },
  { id: 'expired', label: 'Expired', color: 'bg-slate-600 text-white' },
  { id: 'conflict', label: 'Sync Conflict', color: 'bg-purple-600 text-white' },
];

export default function OrderStatusTabs({
  activeTab,
  onSelectTab,
  statusCounts,
  className = '',
}: OrderStatusTabsProps) {
  return (
    <div className={`overflow-x-auto no-scrollbar py-1 ${className}`}>
      <div className="flex items-center gap-1.5 min-w-max px-0.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = statusCounts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                isActive
                  ? `${tab.color} shadow-xs font-extrabold`
                  : 'bg-slate-100/90 text-slate-600 hover:bg-slate-200/80 border border-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
