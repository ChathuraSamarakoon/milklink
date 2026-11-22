import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Chip, Panel, Screen } from '../../shared/components/NextUI';
import CollectorBottomNav from '../components/CollectorBottomNav';
import { formatDate, getCollectorPickups } from '../data';

export default function PickupDetailsPage({ navigate, pickupId }: { navigate: Nav; pickupId: string }) {
  const account = getSession();
  if (!account) return null;
  const pickup = getCollectorPickups(account).find((item) => item.id === pickupId);
  if (!pickup) return null;

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Pickup Details"
      subtitle="Collection order information"
      image="/images/collector-pickup-details.webp"
      eyebrow="COLLECTOR • PICKUP DETAIL"
      className="ml2-collector-pages ml2-collector-detail"
      back="/collector/pickups"
      footer={<CollectorBottomNav navigate={navigate} active="Pickups" />}
    >
      <Panel title="Order Status" icon="truck" action={<Chip tone={pickup.status === 'completed' ? 'green' : 'amber'}>{pickup.status}</Chip>}>
        <div className="ml2-hero-image-card"><img src={pickup.image} alt="Pickup farm scene" /></div>
        <div className="ml2-data-list">
          <div><span>Farmer</span><strong>{pickup.farmer}</strong></div>
          <div><span>Buyer</span><strong>{pickup.buyer}</strong></div>
          <div><span>Collection Date</span><strong>{formatDate(pickup.collectionDate)}</strong></div>
          <div><span>Requested Quantity</span><strong>{pickup.requestedQuantity.toFixed(1)} L</strong></div>
          <div><span>Pickup Location</span><strong>{pickup.area}, {pickup.district}</strong></div>
          <div><span>Contact Person</span><strong>{pickup.phone}</strong></div>
        </div>
        <p className="ml2-notice">{pickup.notes}</p>
        <div className="ml2-action-row" style={{ marginTop: 14 }}>
          {pickup.status === 'completed' ? (
            <Action onClick={() => navigate('/collector/history')}><Icon name="check" size={16} /> View History</Action>
          ) : (
            <Action onClick={() => navigate(`/collector/collect/${pickup.id}`)}><Icon name="milk" size={16} /> Record Collection</Action>
          )}
          <Action secondary onClick={() => navigate('/collector/pickups')}><Icon name="map" size={16} /> All Pickups</Action>
        </div>
      </Panel>
    </Screen>
  );
}
