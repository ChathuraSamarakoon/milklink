import './CollectorDashboardPage.css';
import type { CSSProperties } from 'react';
import { Icon, type Nav } from '../../auth/components/AuthUI';
import { getSession } from '../../auth/components/mockAuth';
import { Action, Chip, Panel, Screen } from '../../shared/components/NextUI';
import CollectorBottomNav from '../components/CollectorBottomNav';
import { getCollectorMetrics, getCollectorPickups } from '../data';

export default function CollectorDashboardPage({ navigate }: { navigate: Nav }) {
  const account = getSession();
  if (!account) return null;

  const metrics = getCollectorMetrics(account);
  const pickups = getCollectorPickups(account);
  const todayList = pickups.slice(0, 3);

  return (
    <Screen
      account={account}
      navigate={navigate}
      title="Collector Dashboard"
      subtitle="Manage your route, assigned pickups and milk collection tasks."
      image="/images/collector-dashboard-hero.webp"
      eyebrow="COLLECTOR • FIRST PAGE"
      className="ml2-collector-pages ml2-collector-dashboard"
      footer={<CollectorBottomNav navigate={navigate} active="Home" />}
    >
      <div className="ml2-dashboard-hero ml2-dashboard-hero-custom ml2-collector-hero" style={{ '--hero-image': "url('/images/collector-dashboard-hero.webp')" } as CSSProperties}>
        <span className="ml2-hero-label">Collector</span>
        <h2>Hi, {account.name.split(' ')[0]} 👋</h2>
        <p>There are {metrics.assigned} assigned pickups, with {metrics.pendingCount} still pending.</p>
      </div>

      <div className="ml2-date-chip"><Icon name="calendar" size={16} /> Demo Schedule · Jan 21, 2025</div>

      <dl className="collector-summary" aria-label="Pickup overview">
        <div className="collector-summary-item">
          <dt><span className="collector-summary-icon"><Icon name="truck" size={19}/></span><span>Assigned<span className="collector-summary-label-tail"> pickups</span></span></dt>
          <dd>{metrics.assigned}</dd>
        </div>
        <div className="collector-summary-item">
          <dt><span className="collector-summary-icon"><Icon name="pin" size={19}/></span><span>Today?s<span className="collector-summary-label-tail"> visits</span></span></dt>
          <dd>{metrics.todayVisits}</dd>
        </div>
        <div className="collector-summary-item collector-summary-completed">
          <dt><span className="collector-summary-icon"><Icon name="check" size={19}/></span><span>Completed</span></dt>
          <dd>{metrics.completedCount}</dd>
        </div>
      </dl>

      <Action className="ml2-action-block ml2-collector-primary" onClick={() => navigate('/collector/pickups')}>
        <Icon name="truck" size={17} /> Start Collection Route
      </Action>

      <Panel title="Scheduled Pickups" icon="truck" action={<button onClick={() => navigate('/collector/pickups')}>View All</button>}>
        {todayList.map((pickup) => (
          <button key={pickup.id} className="ml2-listing-row ml2-listing-button" onClick={() => navigate(`/collector/pickups/${pickup.id}`)}>
            <span className="ml2-avatar-thumb"><img src={pickup.image} alt="Farm collection" /></span>
            <span>
              <strong>{pickup.farmer}</strong>
              <small>{pickup.district} • {pickup.scheduledTime}</small>
            </span>
            <span className="ml2-row-tail">
              <Chip tone={pickup.status === 'completed' ? 'green' : 'amber'}>{pickup.status}</Chip>
              <strong>{pickup.requestedQuantity.toFixed(1)} L</strong>
            </span>
          </button>
        ))}
      </Panel>
    </Screen>
  );
}
