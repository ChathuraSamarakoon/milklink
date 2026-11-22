import { useMemo, useState, type FormEvent } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Banner, Chip, Panel, Screen } from '../../shared/components/NextUI';
import CollectorBottomNav from '../components/CollectorBottomNav';
import { amountFor, completeCollectorPickup, getCollectorPickups, money } from '../data';
import { getSyncItems, saveSyncItems } from '../../shared/lib/demoData';

export default function RecordCollectionPage({ navigate, pickupId }: { navigate: Nav; pickupId?: string }) {
  const account = getSession();
  const [notice, setNotice] = useState('');
  const pickups = account ? getCollectorPickups(account) : [];
  const pickup = pickupId
    ? pickups.find((item) => item.id === pickupId)
    : (pickups.find((item) => item.status === 'pending') ?? pickups[0]);
  const [actualQuantity, setActualQuantity] = useState(String(pickup?.actualQuantity ?? pickup?.requestedQuantity ?? ''));
  const [notes, setNotes] = useState(pickup?.notes ?? '');

  const amount = useMemo(() => pickup ? amountFor(pickup, Number(actualQuantity) || 0) : 0, [pickup, actualQuantity]);
  if (!account || !pickup) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const quantity = Number(actualQuantity);
    if (!Number.isFinite(quantity) || quantity <= 0 || quantity > 2000) {
      setNotice('Enter a valid collected quantity greater than 0 L and at most 2,000 L.');
      return;
    }
    if (pickup.status === 'completed') {
      setNotice('This pickup is already completed. Open History to view it.');
      return;
    }
    completeCollectorPickup(account, pickup.id, quantity, notes.trim());
    const existingQueue = getSyncItems(account);
    // Demo-only offline outbox: it does not transmit to a server.
    if (!existingQueue.some((item) => item.id === `collector-${pickup.id}`)) {
      saveSyncItems(account, [
        {
          id: `collector-${pickup.id}`,
          kind: 'collection',
          title: `Collection ${pickup.id} recorded`,
          meta: `${pickup.farmer} • ${quantity.toFixed(1)} L • stored locally`,
          state: 'pending',
          createdAt: new Date().toISOString(),
          localQty: quantity,
          note: notes.trim(),
        },
        ...existingQueue,
      ]);
    }
    navigate('/collector/history');
  }

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Record Collection"
      subtitle="Enter actual collected quantity"
      image="/images/collector-record-collection.webp"
      eyebrow="COLLECTOR • RECORD COLLECTION"
      className="ml2-collector-pages ml2-collector-record"
      back={pickupId ? `/collector/pickups/${pickup.id}` : '/collector/pickups'}
      footer={<CollectorBottomNav navigate={navigate} active="Collect" />}
    >
      {notice && <Banner tone="amber"><Icon name="info" size={16} />{notice}</Banner>}
      <Panel title={pickup.farmer} icon="milk" action={<Chip tone={pickup.status === 'completed' ? 'green' : 'amber'}>{pickup.status}</Chip>}>
        <div className="ml2-hero-image-card"><img src="/images/collector-record-collection.webp" alt="Milk collection action" /></div>
        <form className="ml2-form" onSubmit={submit}>
          <div className="ml2-data-list ml2-data-list-single">
            <div><span>Requested Quantity</span><strong>{pickup.requestedQuantity.toFixed(1)} L</strong></div>
          </div>
          <label className="ml2-field">Collected Quantity <span className="ml2-required-star">*</span><input type="number" min="0.1" max="2000" step="0.1" required value={actualQuantity} onChange={(event) => setActualQuantity(event.target.value)} /></label>
          <div className="ml2-pill-row">
            {[pickup.requestedQuantity - 0.5, pickup.requestedQuantity, pickup.requestedQuantity + 0.5].map((value) => (
              <button key={value} type="button" className={Number(actualQuantity) === value ? 'active' : ''} onClick={() => setActualQuantity(String(value))}>{value.toFixed(1)} L</button>
            ))}
          </div>
          <label className="ml2-field">Notes (Optional)<textarea rows={4} maxLength={200} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add details about this collection..." /></label>
          {Number(actualQuantity) > 0 && Math.abs(Number(actualQuantity) - pickup.requestedQuantity) > 0.001 && (
            <div className="ml2-difference-hint"><Icon name="info" size={15} /> Actual quantity differs from the requested {pickup.requestedQuantity.toFixed(1)} L. Check before confirming.</div>
          )}
          <div className="ml2-summary-card">
            <span className="ml2-info-icon"><Icon name="sparkle" /></span>
            <div>
              <small>Final Amount (Est.)</small>
              <strong>{money(amount)}</strong>
              <p>({Number(actualQuantity || 0).toFixed(1)} L × Rs. {pickup.ratePerLitre.toFixed(2)} / L)</p>
            </div>
          </div>
          <div className="ml2-offline-note"><Icon name="wifi-off" size={16} /><span>This demo saves the collection on this device and adds a pending item to Sync Center. Real server synchronization is not connected yet.</span></div>
          <Action type="submit" disabled={pickup.status === 'completed'} className="ml2-action-block ml2-collector-primary"><Icon name="check" size={16} /> Confirm Collection</Action>
        </form>
      </Panel>
    </Screen>
  );
}
