import { useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { BottomNav, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { formatDate, getFarmerOrders } from '../data';

export default function IncomingOrdersPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  const [tab, setTab] = useState<'pending' | 'accepted' | 'declined'>('pending');
  if (!account) return null;
  const orders = getFarmerOrders(account);
  const counts = {
    pending: orders.filter((order) => order.status === 'pending').length,
    accepted: orders.filter((order) => order.status === 'accepted').length,
    declined: orders.filter((order) => order.status === 'declined').length,
  };
  const filtered = orders.filter((order) => order.status === tab);

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Incoming Orders"
      subtitle="Review buyer requests for your milk listings."
      image="/images/farmer-incoming-orders.webp"
      eyebrow="FARMER • ORDERS"
      footer={<BottomNav navigate={navigate} active="Orders" />}
    >
      <div className="ml2-page-tabs">
        <button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>Pending ({counts.pending})</button>
        <button className={tab === 'accepted' ? 'active' : ''} onClick={() => setTab('accepted')}>Accepted ({counts.accepted})</button>
        <button className={tab === 'declined' ? 'active' : ''} onClick={() => setTab('declined')}>Declined ({counts.declined})</button>
      </div>
      <Panel title="Orders from Buyers" icon="cart">
        <div className="ml2-order-list">
          {filtered.map((order) => (
            <button key={order.id} className="ml2-order-card" onClick={() => navigate(`/farmer/orders/${order.id}`)}>
              <div>
                <strong>{order.id}</strong>
                <small>Buyer: {order.buyer}</small>
                <small>{order.requestedQuantity} L • {formatDate(order.collectionDate)}</small>
              </div>
              <div className="ml2-order-aside">
                <Chip tone={order.status === 'pending' ? 'amber' : order.status === 'accepted' ? 'green' : 'red'}>{order.status}</Chip>
                <b>Rs. {(order.requestedQuantity * order.pricePerLitre).toLocaleString()}</b>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
