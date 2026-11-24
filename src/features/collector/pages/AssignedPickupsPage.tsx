import { useMemo, useState } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Chip, Panel, Screen } from '../../shared/components/NextUI';
import CollectorBottomNav from '../components/CollectorBottomNav';
import { getCollectorPickups } from '../data';

export default function AssignedPickupsPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  const [tab, setTab] = useState<'all' | 'pending' | 'completed'>('all');
  const [query, setQuery] = useState('');
  const pickups = account ? getCollectorPickups(account) : [];
  const filtered = useMemo(
    () => pickups.filter((pickup) => {
      const matchesStatus = tab === 'all' || pickup.status === tab;
      const searchText = `${pickup.farmer} ${pickup.district} ${pickup.area} ${pickup.buyer}`.toLowerCase();
      return matchesStatus && searchText.includes(query.trim().toLowerCase());
    }),
    [pickups, tab, query],
  );
  if (!account) return null;

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Assigned Pickups"
      subtitle="Your collection orders and scheduled visits."
      image="/images/collector-assigned-pickups.webp"
      eyebrow="COLLECTOR • PICKUPS"
      className="ml2-collector-pages ml2-collector-list"
      footer={<CollectorBottomNav navigate={navigate} active="Pickups" />}
    >
      <label className="ml2-search-shell"><Icon name="milk" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search farmer, district..." aria-label="Search assigned pickups" /></label>
      <div className="ml2-page-tabs">
        <button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All ({pickups.length})</button>
        <button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>Pending ({pickups.filter((pickup) => pickup.status === 'pending').length})</button>
        <button className={tab === 'completed' ? 'active' : ''} onClick={() => setTab('completed')}>Completed ({pickups.filter((pickup) => pickup.status === 'completed').length})</button>
      </div>

      <Panel title="Pickup List" icon="truck">
        <div className="ml2-order-list">
          {filtered.length === 0 && <p className="ml2-notice">No pickups match your search or status filter.</p>}
          {filtered.map((pickup) => (
            <button key={pickup.id} className="ml2-order-card" onClick={() => navigate(`/collector/pickups/${pickup.id}`)}>
              <div className="ml2-order-main">
                <div className="ml2-inline-thumb"><img src={pickup.image} alt="Pickup visual" /></div>
                <div>
                  <strong>{pickup.farmer}</strong>
                  <small>{pickup.district}</small>
                  <small>{pickup.scheduledTime}</small>
                </div>
              </div>
              <div className="ml2-order-aside">
                <b>{pickup.requestedQuantity.toFixed(1)} L</b>
                <Chip tone={pickup.status === 'completed' ? 'green' : 'amber'}>{pickup.status}</Chip>
              </div>
            </button>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
