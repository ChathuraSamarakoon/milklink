import './FarmerHistoryPage.css';
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
      className="farmer-history-page"
      account={account}
      navigate={navigate}
      title="Order History"
      subtitle="Completed orders and earnings overview."
      image="/images/farmer-history-banner-v2.webp"
      cover={
        <div className="history-cover">
          <img src="/images/farmer-history-banner-v2.webp" alt="Fresh milk being poured into a can on a dairy farm"/>
          <div className="history-cover-title">Order History<Icon name="leaf" size={17}/><span/></div>
          <svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
            <path fill="#a1df63" d="M0 48C240-40 420 160 1000 0V100H0Z"/>
            <path fill="#00832d" d="M0 70C240-20 450 180 1000 20V100H0Z"/>
          </svg>
        </div>
      }
      eyebrow="FARMER • HISTORY"
      footer={<BottomNav navigate={navigate} active="History" />}
    >
      <div className="ml2-history-metrics">
        <div className="ml2-history-box history-milk-total"><span className="ml2-info-icon"><Icon name="milk" /></span><div><strong>{stats.litres.toLocaleString()} L</strong><small>{period === 'All' ? 'All Time' : period === 'Nov 2026' ? 'This Month' : period}</small></div><span className="history-milk-art" aria-hidden="true"><span/></span></div>
        <div className="ml2-history-box history-income-total"><span className="ml2-info-icon"><Icon name="sparkle" /></span><div><strong>Rs. {stats.income.toLocaleString()}</strong><small>{period === 'All' ? 'Total Income' : period === 'Nov 2026' ? 'This Month Income' : `${period} Income`}</small></div><span className="history-coins-art" aria-hidden="true"><i/><i/><b>Rs</b></span></div>
      </div>
      <Panel title="History Filter" icon="calendar">
        <div className="ml2-pill-row">
          {['All', 'Nov 2026', 'Oct 2026', 'Sep 2026'].map((item) => (
            <button key={item} aria-pressed={period === item} className={period === item ? 'active' : ''} onClick={() => setPeriod(item)}>{item}</button>
          ))}
        </div>
      </Panel>
      <Panel title="Completed Orders" icon="truck">
        {completed.length === 0 && <p className="ml2-notice">No completed orders for this period.</p>}
        <div className="ml2-order-list">
          {completed.map((order) => (
            <div key={order.id} className="ml2-order-card static">
              <span className="history-order-icon"><Icon name="check" size={23}/></span>
              <div className="history-order-copy">
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
