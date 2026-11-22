import type { CSSProperties } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, BottomNav, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { getDemoProfile } from '../../shared/lib/demoData';
import { availableLitres, formatDate, getFarmerListings, getFarmerOrders } from '../data';

export default function FarmerDashboardPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  if (!account) return null;

  const profile = getDemoProfile(account);
  const listings = getFarmerListings(account);
  const orders = getFarmerOrders(account);
  const activeListings = listings.filter((listing) => listing.status === 'active');
  const available = activeListings.reduce((sum, listing) => sum + availableLitres(listing), 0);
  const reserved = activeListings.reduce((sum, listing) => sum + listing.reserved, 0);
  const incoming = orders.filter((order) => order.status === 'pending' || order.status === 'accepted');
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .slice(0, 3);

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Farmer Dashboard"
      subtitle="Overview of your milk listings, orders and recent activity."
      image="/images/farmer-dashboard-hero.webp"
      eyebrow="FARMER • FIRST PAGE"
      footer={<BottomNav navigate={navigate} active="Home" />}
    >
      <div className="ml2-dashboard-hero ml2-dashboard-hero-custom" style={{ '--hero-image': "url('/images/farmer-dashboard-hero.webp')" } as CSSProperties}>
        <span className="ml2-hero-label">{profile.detail || 'My Dairy Farm'}</span>
        <h2>Good Morning,<br />{profile.name.split(' ')[0]} 👋</h2>
        <p>Track daily supply, manage listings and respond to buyer orders quickly.</p>
      </div>

      <div className="ml2-metric-grid">
        <div className="ml2-metric"><span className="ml2-metric-icon"><Icon name="milk" /></span><strong>{activeListings.length}</strong><span>Active Listings</span></div>
        <div className="ml2-metric"><span className="ml2-metric-icon"><Icon name="drop" /></span><strong>{available.toFixed(1)} L</strong><span>Available Milk</span></div>
        <div className="ml2-metric"><span className="ml2-metric-icon"><Icon name="sparkle" /></span><strong>{reserved.toFixed(1)} L</strong><span>Reserved Milk</span></div>
      </div>

      <Panel title="Quick Actions" icon="check" className="ml2-tight-panel">
        <div className="ml2-quick-grid">
          <button className="ml2-quick-tile featured" onClick={() => navigate('/farmer/listings/new')}>
            <Icon name="milk" size={24} />
            <span><strong>Add Listing</strong><small>Create a new milk offer</small></span>
          </button>
          <button className="ml2-quick-tile" onClick={() => navigate('/farmer/listings')}>
            <Icon name="calendar" size={22} />
            <span><strong>My Listings</strong><small>Manage {activeListings.length} active offers</small></span>
          </button>
          <button className="ml2-quick-tile" onClick={() => navigate('/farmer/orders')}>
            <Icon name="cart" size={22} />
            <span><strong>Orders</strong><small>{incoming.length} buyer requests</small></span>
          </button>
          <button className="ml2-quick-tile" onClick={() => navigate('/farmer/history')}>
            <Icon name="truck" size={22} />
            <span><strong>History</strong><small>Completed deliveries & earnings</small></span>
          </button>
        </div>
      </Panel>

      <Panel title="Recent Activity" icon="cart" action={<button onClick={() => navigate('/farmer/orders')}>View All</button>}>
        {recentOrders.map((order) => (
          <div className="ml2-listing-row" key={order.id}>
            <span className="ml2-info-icon"><Icon name="cart" /></span>
            <span>
              <strong>{order.id} • {order.buyer}</strong>
              <small>{order.requestedQuantity} L • {formatDate(order.collectionDate)}</small>
            </span>
            <Chip tone={order.status === 'pending' ? 'amber' : order.status === 'accepted' ? 'green' : order.status === 'completed' ? 'blue' : 'red'}>
              {order.status}
            </Chip>
          </div>
        ))}
      </Panel>

      <Panel title="Shortcuts" icon="admin">
        <div className="ml2-action-row">
          <Action secondary onClick={() => navigate('/app/profile')}>My Profile</Action>
          <Action secondary onClick={() => navigate('/app/sync')}>Offline Sync</Action>
        </div>
      </Panel>
    </Screen>
  );
}
