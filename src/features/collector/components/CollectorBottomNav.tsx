import { Icon, type IconName, type Nav } from '../../auth/components/AuthUI';

export default function CollectorBottomNav({ navigate, active = 'Home' }: { navigate: Nav; active?: string }) {
  const items: { label: string; icon: IconName; url: string }[] = [
    { label: 'Home', icon: 'home', url: '/collector' },
    { label: 'Pickups', icon: 'truck', url: '/collector/pickups' },
    { label: 'Collect', icon: 'milk', url: '/collector/collect' },
    { label: 'History', icon: 'calendar', url: '/collector/history' },
    { label: 'Sync', icon: 'wifi-off', url: '/app/sync' },
  ];

  return (
    <nav className="ml2-bottom-nav" aria-label="Collector navigation">
      {items.map((item) => (
        <button key={item.label} className={active === item.label ? 'ml2-active' : ''} onClick={() => navigate(item.url)}>
          <Icon name={item.icon} size={21} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
