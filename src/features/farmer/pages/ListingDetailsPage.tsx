import './ListingBanner.css';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, BottomNav, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { availableLitres, getFarmerListings, getFarmerOrders, listingRange } from '../data';

export default function ListingDetailsPage({ navigate, listingId }: { navigate: Nav; listingId: string }) {
  const account = getSession();
  if (!account) return null;
  const listing = getFarmerListings(account).find((item) => item.id === listingId);
  if (!listing) return null;
  const relatedOrders = getFarmerOrders(account).filter((order) => order.listingId === listing.id).slice(0, 2);

  return (
    <Screen
      className="farmer-listing-banner"
      account={account}
      navigate={navigate}
      title="Milk Listing Details"
      subtitle="View quantity, availability and related buyer orders."
      image="/images/farmer-my-listings.webp"
      eyebrow="FARMER • LISTING DETAIL"
      back="/farmer/listings"
      footer={<BottomNav navigate={navigate} active="Listings" />}
    >
      <Panel title={listing.id} icon="milk" action={<Chip tone={listing.status === 'active' ? 'green' : 'amber'}>{listing.status}</Chip>}>
        <div className="ml2-data-list">
          <div><span>Total Quantity</span><strong>{listing.quantity} L</strong></div>
          <div><span>Reserved Amount</span><strong>{listing.reserved} L</strong></div>
          <div><span>Available Balance</span><strong>{availableLitres(listing)} L</strong></div>
          <div><span>Price per Litre</span><strong>Rs. {listing.pricePerLitre}/L</strong></div>
          <div><span>Availability</span><strong>{listingRange(listing)}</strong></div>
        </div>
        <p className="ml2-notice">{listing.notes}</p>
        <div className="ml2-action-row" style={{ marginTop: 14 }}>
          <Action onClick={() => navigate(`/farmer/listings/${listing.id}/edit`)}>Edit Listing</Action>
          <Action secondary onClick={() => navigate('/farmer/orders')}>View Orders</Action>
        </div>
      </Panel>

      <Panel title={`Related Orders (${relatedOrders.length})`} icon="cart" action={<button onClick={() => navigate('/farmer/orders')}>View All</button>}>
        {relatedOrders.map((order) => (
          <div key={order.id} className="ml2-listing-row">
            <span className="ml2-info-icon"><Icon name="cart" /></span>
            <span>
              <strong>{order.id}</strong>
              <small>{order.requestedQuantity} L • {order.buyer}</small>
            </span>
            <Chip tone={order.status === 'accepted' ? 'green' : order.status === 'pending' ? 'amber' : 'red'}>{order.status}</Chip>
          </div>
        ))}
      </Panel>
    </Screen>
  );
}
