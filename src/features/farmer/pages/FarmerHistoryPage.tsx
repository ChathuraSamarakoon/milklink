import { useState } from 'react';
import { BottomNav, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { getFarmerOrders } from '../data';

export default function FarmerHistoryPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  const [period, setPeriod] = useState('Nov 2026');
  if (!account) return null;
  const allCompleted = getFarmerOrders(account).filter((order) => order.status === 'completed');
  const completed = period === 'All' ? allCompleted : allCompleted.filter((order) => {
    const month = new Date(`${order.collectionDate}T12:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    return month === period;
  });
  const litres = completed.reduce((sum, order) => sum + order.requestedQuantity, 0);
  const income = completed.reduce((sum, order) => sum + order.requestedQuantity * order.pricePerLitre, 0);
  const stats = { litres, income };

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Order History"
      subtitle="Completed orders and earnings overview."
      image="/images/farmer-order-history.webp"
      eyebrow="FARMER • HISTORY"
      footer={<BottomNav navigate={navigate} active="History" />}
    >
      <div className="ml2-history-metrics">
        <div className="ml2-history-box"><span className="ml2-info-icon"><Icon name="milk" /></span><div><strong>{stats.litres.toLocaleString()} L</strong><small>This Month</small></div></div>
        <div className="ml2-history-box"><span className="ml2-info-icon"><Icon name="sparkle" /></span><div><strong>Rs. {stats.income.toLocaleString()}</strong><small>This Month Income</small></div></div>
      </div>
      <Panel title="History Filter" icon="calendar">
        <div className="ml2-pill-row">
          {['All', 'Nov 2026', 'Oct 2026', 'Sep 2026'].map((item) => (
            <button key={item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>
          ))}
        </div>
      </Panel>
      <Panel title="Completed Orders" icon="truck">
        {completed.length === 0 && <p className="ml2-notice">No completed orders for this period.</p>}
        <div className="ml2-order-list">
          {completed.map((order) => (
            <div key={order.id} className="ml2-order-card static">
              <div>
                <strong>{order.id}</strong>
                <small>{order.requestedQuantity} L • Rs. {order.pricePerLitre}/L</small>
                <small>{order.buyer}</small>
              </div>
              <div className="ml2-order-aside">
                <Chip tone="green">Completed</Chip>
                <b>Rs. {(order.requestedQuantity * order.pricePerLitre).toLocaleString()}</b>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
