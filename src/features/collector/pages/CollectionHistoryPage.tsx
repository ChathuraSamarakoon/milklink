import { Chip, Panel, Screen } from '../../shared/components/NextUI';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import CollectorBottomNav from '../components/CollectorBottomNav';
import { amountFor, getCollectorMetrics, getCollectorPickups, money } from '../data';

export default function CollectionHistoryPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  if (!account) return null;
  const metrics = getCollectorMetrics(account);
  const completed = getCollectorPickups(account).filter((pickup) => pickup.status === 'completed');

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Collection History"
      subtitle="Your completed milk collections"
      image="/images/collector-history.webp"
      eyebrow="COLLECTOR • HISTORY"
      className="ml2-collector-pages ml2-collector-history"
      footer={<CollectorBottomNav navigate={navigate} active="History" />}
    >
      <div className="ml2-history-metrics">
        <div className="ml2-history-box"><span className="ml2-info-icon"><Icon name="drop" /></span><div><strong>{metrics.totalCollected.toFixed(1)} L</strong><small>Total Collected</small></div></div>
        <div className="ml2-history-box"><span className="ml2-info-icon"><Icon name="check" /></span><div><strong>{completed.length}</strong><small>Completed Orders</small></div></div>
      </div>
      <div className="ml2-date-chip" style={{ marginBottom: 14 }}><Icon name="calendar" size={16} /> Jan 1 – Jan 21, 2025</div>
      <Panel title={`Collections (${completed.length})`} icon="calendar">
        <div className="ml2-order-list">
          {completed.map((pickup) => (
            <div key={pickup.id} className="ml2-order-card static">
              <div className="ml2-order-main">
                <div className="ml2-inline-thumb"><img src={pickup.image} alt="Completed collection" /></div>
                <div>
                  <strong>{pickup.farmer}</strong>
                  <small>Jan 21, {pickup.scheduledTime}</small>
                  <small>{pickup.actualQuantity?.toFixed(1)} L • {money(amountFor(pickup))}</small>
                </div>
              </div>
              <div className="ml2-order-aside">
                <Chip tone="green">Completed</Chip>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </Screen>
  );
}
