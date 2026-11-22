import { useState, type FormEvent } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, BottomNav, Panel, Screen } from '../../shared/components/NextUI';
import { createFarmerListing, getFarmerListings, saveFarmerListings } from '../data';
import { getSyncItems, saveSyncItems } from '../../shared/lib/demoData';

export default function AddMilkListingPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  const [quantity, setQuantity] = useState('80');
  const [pricePerLitre, setPricePerLitre] = useState('120');
  const [startDate, setStartDate] = useState('2026-11-23');
  const [endDate, setEndDate] = useState('2026-11-25');
  const [notes, setNotes] = useState('Fresh morning milk from Green Valley Farm. High quality and well cooled.');
  const [notice, setNotice] = useState('');
  if (!account) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const quantityValue = Number(quantity);
    const priceValue = Number(pricePerLitre);
    if (!(quantityValue > 0) || !(priceValue > 0) || !startDate || !endDate || endDate < startDate) {
      setNotice('Enter a positive quantity, price and a valid date range.');
      return;
    }

    const listing = createFarmerListing({ quantity: quantityValue, pricePerLitre: priceValue, startDate, endDate, notes });
    saveFarmerListings(account, [listing, ...getFarmerListings(account)]);
    saveSyncItems(account, [{
      id: `sync-${Date.now()}`,
      kind: 'listing',
      title: `Milk listing created: ${listing.id}`,
      meta: `${listing.quantity} L • Rs. ${listing.pricePerLitre}/L`,
      state: 'pending',
      createdAt: new Date().toISOString(),
      note: 'Browser-local demo queue; real offline synchronization requires IndexedDB and API integration.',
    }, ...getSyncItems(account)]);
    navigate('/farmer/listings');
  }

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Add Milk Listing"
      subtitle="Create a new milk offer for nearby buyers."
      image="/images/farmer-add-listing.webp"
      eyebrow="FARMER • NEW LISTING"
      back="/farmer/listings"
      footer={<BottomNav navigate={navigate} active="Listings" />}
    >
      {notice && <Banner tone="amber"><Icon name="info" size={16} />{notice}</Banner>}
      <Panel title="Listing Form" icon="milk">
        <form className="ml2-form" onSubmit={submit}>
          <label className="ml2-field">Milk Quantity (Litres)<input type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label>
          <label className="ml2-field">Price per Litre<input type="number" min="1" value={pricePerLitre} onChange={(event) => setPricePerLitre(event.target.value)} /></label>
          <div className="ml2-form-grid">
            <label className="ml2-field">Available From<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label>
            <label className="ml2-field">Available To<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label>
          </div>
          <label className="ml2-field">Notes<textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} /></label>
          <div className="ml2-upload-card">
            <img src="/images/farmer-add-listing.webp" alt="Milk can visual" />
            <span><strong>Listing Image</strong><small>Prototype preview image is attached automatically.</small></span>
          </div>
          <Action type="submit" className="ml2-action-block"><Icon name="check" size={16} />Create Listing</Action>
        </form>
      </Panel>
    </Screen>
  );
}
