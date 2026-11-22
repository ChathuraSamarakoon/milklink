import { useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, BottomNav, Chip, Panel, Screen } from '../../shared/components/NextUI';
import { availableLitres, getFarmerListings, listingRange } from '../data';

export default function FarmerListingsPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  const [tab, setTab] = useState<'active' | 'expired'>('active');
  if (!account) return null;

  const listings = getFarmerListings(account);
  const filtered = listings.filter((listing) => listing.status === tab);
  const counts = {
    active: listings.filter((listing) => listing.status === 'active').length,
    expired: listings.filter((listing) => listing.status === 'expired').length,
  };

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="My Milk Listings"
      subtitle="Manage your active and expired milk offers."
      image="/images/farmer-my-listings.webp"
      eyebrow="FARMER • LISTINGS"
      footer={<BottomNav navigate={navigate} active="Listings" />}
    >
      <div className="ml2-page-tabs">
        <button className={tab === 'active' ? 'active' : ''} onClick={() => setTab('active')}>Active ({counts.active})</button>
        <button className={tab === 'expired' ? 'active' : ''} onClick={() => setTab('expired')}>Expired ({counts.expired})</button>
      </div>

      <Panel title="Listing Collection" icon="milk" action={<Action onClick={() => navigate('/farmer/listings/new')}>+ Add Listing</Action>}>
        <div className="ml2-card-stack">
          {filtered.map((listing) => (
            <button key={listing.id} className="ml2-rich-card" onClick={() => navigate(`/farmer/listings/${listing.id}`)}>
              <img src={listing.image} alt="Milk listing visual" />
              <div className="ml2-rich-card-copy">
                <div className="ml2-rich-card-head">
                  <strong>{listing.id}</strong>
                  <Chip tone={listing.status === 'active' ? 'green' : 'amber'}>{listing.status}</Chip>
                </div>
                <div className="ml2-rich-stats">
                  <span><b>{listing.quantity} L</b><small>Total</small></span>
                  <span><b>Rs. {listing.pricePerLitre}/L</b><small>Price</small></span>
                  <span><b>{availableLitres(listing)} L</b><small>Available</small></span>
                </div>
                <small>{listingRange(listing)}</small>
              </div>
              <Icon name="chevron" size={18} />
            </button>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
