import { useState, type FormEvent } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, BottomNav, Panel, Screen } from '../../shared/components/NextUI';
import { getFarmerListings, saveFarmerListings, type FarmerListing } from '../data';
import { getSyncItems, saveSyncItems } from '../../shared/lib/demoData';

export default function EditListingPage({ navigate, listingId }: { navigate: Nav; listingId: string }) {
  const account = getSession();
  const listing = account ? getFarmerListings(account).find((item) => item.id === listingId) : undefined;
  const [quantity, setQuantity] = useState(String(listing?.quantity ?? ''));
  const [pricePerLitre, setPricePerLitre] = useState(String(listing?.pricePerLitre ?? ''));
  const [startDate, setStartDate] = useState(listing?.startDate ?? '');
  const [endDate, setEndDate] = useState(listing?.endDate ?? '');
  const [notes, setNotes] = useState(listing?.notes ?? '');
  const [active, setActive] = useState((listing?.status ?? 'active') === 'active');
  const [notice, setNotice] = useState('');
  if (!account || !listing) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const quantityValue = Number(quantity);
    const priceValue = Number(pricePerLitre);
    if (!(quantityValue > 0) || !(priceValue > 0) || !startDate || !endDate || endDate < startDate || quantityValue < listing.reserved) {
      setNotice('Check quantity, price, dates and reserved amount before saving.');
      return;
    }
    const next: FarmerListing[] = getFarmerListings(account).map((item) => item.id === listing.id ? { ...item, quantity: quantityValue, pricePerLitre: priceValue, startDate, endDate, notes, status: active ? 'active' : 'expired' } : item);
    saveFarmerListings(account, next);
    saveSyncItems(account, [{
      id: `sync-${Date.now()}`,
      kind: 'listing',
      title: `Milk listing updated: ${listing.id}`,
      meta: `${quantityValue} L • Rs. ${priceValue}/L`,
      state: 'pending',
      createdAt: new Date().toISOString(),
      note: 'Browser-local demo queue; real offline synchronization requires IndexedDB and API integration.',
    }, ...getSyncItems(account)]);
    navigate(`/farmer/listings/${listing.id}`);
  }

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Edit Milk Listing"
      subtitle="Update your listing details and visibility."
      image="/images/farmer-edit-listing.webp"
      eyebrow="FARMER • EDIT LISTING"
      back={`/farmer/listings/${listing.id}`}
      footer={<BottomNav navigate={navigate} active="Listings" />}
    >
      {notice && <Banner tone="amber"><Icon name="info" size={16} />{notice}</Banner>}
      <Panel title={listing.id} icon="milk">
        <form className="ml2-form" onSubmit={submit}>
          <label className="ml2-field">Milk Quantity (Litres)<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
          <label className="ml2-field">Price per Litre<input type="number" min="1" value={pricePerLitre} onChange={(event) => setPricePerLitre(event.target.value)} /></label>
          <div className="ml2-form-grid">
            <label className="ml2-field">Available From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
            <label className="ml2-field">Available To<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
          </div>
          <label className="ml2-field">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} /></label>
          <label className="ml2-switch-row"><span>Status</span><input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} /><small>{active ? 'Active (Visible to buyers)' : 'Expired'}</small></label>
          <Action type="submit" className="ml2-action-block"><Icon name="check" size={16} />Save Changes</Action>
        </form>
      </Panel>
    </Screen>
  );
}
