import './ListingBanner.css';
import './FarmerListingsPage.css';
import { useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, BottomNav, Screen } from '../../shared/components/NextUI';
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
      className="farmer-listings-page farmer-listing-banner"
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

      <div className="listing-collection-heading">
        <span className="listing-collection-title"><span className="listing-collection-icon"><Icon name="milk" size={24}/></span>Listing Collection</span>
        <Action secondary onClick={() => navigate('/farmer/listings/new')}><span aria-hidden="true">+</span> Add Listing</Action>
      </div>
      <div className="listing-collection" aria-live="polite">
        {filtered.map(listing => <button key={listing.id} className="milk-offer-card" onClick={() => navigate(`/farmer/listings/${listing.id}`)} aria-label={`View listing ${listing.id}`}>
          <span className="milk-offer-heading"><strong>{listing.id}</strong><span className={`milk-offer-status ${listing.status}`}><span/>{listing.status === 'active' ? 'Active' : 'Expired'}</span></span>
          <span className="milk-offer-body">
            <span className="milk-offer-stat"><Icon name="drop"/><b>{listing.quantity} L</b><span>Total</span></span>
            <span className="milk-offer-stat"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v4c0 4 16 4 16 0V5M4 9v4c0 4 16 4 16 0V9M4 13v4c0 4 16 4 16 0v-4"/></svg><b>Rs. {listing.pricePerLitre}/L</b><span>Price</span></span>
            <span className="milk-offer-stat"><Icon name="milk"/><b>{availableLitres(listing)} L</b><span>Available</span></span>
            <span className="milk-offer-open"><Icon name="chevron" size={19}/></span>
          </span>
          <span className="milk-offer-date"><Icon name="calendar" size={20}/>{listingRange(listing)}</span>
        </button>)}
        {filtered.length === 0 && <p className="milk-offer-empty">No {tab} listings yet.</p>}
      </div>
    </Screen>
  );
}
