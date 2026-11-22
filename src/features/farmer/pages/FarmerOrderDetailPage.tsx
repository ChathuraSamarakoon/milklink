import { useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, BottomNav, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { availableLitres, formatDate, formatDateTime, getFarmerListings, getFarmerOrders, saveFarmerListings, saveFarmerOrders } from '../data';
import { getSyncItems, saveSyncItems } from '../../shared/lib/demoData';

export default function FarmerOrderDetailPage({ navigate, orderId }: { navigate: Nav; orderId: string }) {
  const account = getSession();
  const [notice, setNotice] = useState('');
  if (!account) return null;
  const orders = getFarmerOrders(account);
  const order = orders.find((item) => item.id === orderId);
  const listing = order ? getFarmerListings(account).find((item) => item.id === order.listingId) : null;
  if (!order) return null;

  function updateStatus(status: 'accepted' | 'declined') {
    const freshOrders = getFarmerOrders(account);
    const latestOrder = freshOrders.find((item) => item.id === order.id);
    if (!latestOrder || latestOrder.status !== 'pending') {
      setNotice('This order is no longer pending. Refresh the page to review its latest status.');
      return;
    }
    const freshListings = getFarmerListings(account);
    const currentListing = freshListings.find((item) => item.id === latestOrder.listingId);
    if (status === 'accepted') {
      if (!currentListing || currentListing.status !== 'active' || availableLitres(currentListing) < latestOrder.requestedQuantity) {
        setNotice('Not enough available milk to accept this order. Please review the listing quantity.');
        return;
      }
      saveFarmerListings(account, freshListings.map((item) => item.id === currentListing.id
        ? { ...item, reserved: item.reserved + latestOrder.requestedQuantity }
        : item));
    }
    saveFarmerOrders(account, freshOrders.map((item) => item.id === order.id ? { ...item, status } : item));
    saveSyncItems(account, [{
      id: `sync-${Date.now()}`,
      kind: 'order',
      title: `Order ${status}: ${order.id}`,
      meta: `${order.buyer} • ${order.requestedQuantity} L`,
      state: 'pending',
      createdAt: new Date().toISOString(),
      note: 'Saved locally for frontend demonstration. Backend syncing is not connected.',
    }, ...getSyncItems(account)]);
    setNotice(`Order ${order.id} marked as ${status} and saved locally (demo).`);
  }

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Order Details"
      subtitle="Review and respond to the buyer order."
      image="/images/farmer-order-detail.webp"
      eyebrow="FARMER • ORDER DETAIL"
      back="/farmer/orders"
      footer={<BottomNav navigate={navigate} active="Orders" />}
    >
      {notice && <Banner tone={notice.startsWith('Not enough') || notice.startsWith('This order') ? 'amber' : 'green'}><Icon name="info" size={16} />{notice}</Banner>}
      <Panel title={order.id} icon="cart" action={<Chip tone={order.status === 'pending' ? 'amber' : order.status === 'accepted' ? 'green' : order.status === 'declined' ? 'red' : 'blue'}>{order.status}</Chip>}>
        <div className="ml2-data-list">
          <div><span>Buyer Details</span><strong>{order.buyer}</strong><small>{order.district} • {order.phone}</small></div>
          <div><span>Requested Quantity</span><strong>{order.requestedQuantity} L</strong></div>
          <div><span>Price per Litre</span><strong>Rs. {order.pricePerLitre}/L</strong></div>
          <div><span>Estimated Amount</span><strong>Rs. {(order.requestedQuantity * order.pricePerLitre).toLocaleString()}</strong></div>
          <div><span>Collection Date</span><strong>{formatDate(order.collectionDate)}</strong></div>
          <div><span>From Listing</span><strong>{listing?.id ?? order.listingId}</strong></div>
        </div>
      </Panel>

      <Panel title="Order Timeline" icon="calendar">
        <div className="ml2-timeline">
          <div className="done"><strong>Order Placed</strong><small>{formatDateTime(order.placedAt)}</small></div>
          <div className={order.status !== 'pending' ? 'done' : 'current'}><strong>{order.status === 'pending' ? 'Pending Your Response' : `Order ${order.status}`}</strong><small>Buyer is waiting for confirmation</small></div>
          <div><strong>Collection</strong><small>{formatDate(order.collectionDate)}</small></div>
        </div>
        {order.status === 'pending' && !notice.includes('marked as') && (
          <div className="ml2-action-row" style={{ marginTop: 14 }}>
            <Action onClick={() => updateStatus('accepted')}>Accept Order</Action>
            <Action secondary onClick={() => updateStatus('declined')}>Decline</Action>
          </div>
        )}
      </Panel>
    </Screen>
  );
}
