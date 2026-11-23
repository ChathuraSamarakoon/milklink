import { Icon, type IconName, type Role } from './AuthUI';

export interface RoleInfo {
  role: Role;
  title: string;
  subtitle: string;
  description: string;
  icon: IconName;
  badge: string;
  popularFor: string[];
}

export const ROLES_LIST: RoleInfo[] = [
  {
    role: 'farmer',
    title: 'Dairy Farmer',
    subtitle: 'Milk Producer',
    description: 'List daily milk supplies, set farm-gate prices, and connect directly with local buyers and collectors.',
    icon: 'farmer',
    badge: 'Producer',
    popularFor: ['Daily milk yield', 'Direct farm sales', 'Guaranteed orders'],
  },
  {
    role: 'buyer',
    title: 'Milk Buyer',
    subtitle: 'Dairy Shop & Processor',
    description: 'Discover nearby farms, order verified raw milk & dairy products, and track pickup schedules.',
    icon: 'cart',
    badge: 'Buyer',
    popularFor: ['Fresh supply', 'Verified quality', 'Transparent prices'],
  },
  {
    role: 'collector',
    title: 'Milk Collector',
    subtitle: 'Route & Quality Handler',
    description: 'Coordinate collection routes between local dairy farms and buyers with digital volume records.',
    icon: 'truck',
    badge: 'Logistics',
    popularFor: ['Pickup routes', 'Volume recording', 'Batch quality tests'],
  },
];

interface RoleIntroCardProps {
  roleInfo: RoleInfo;
  selected?: boolean;
  onSelect?: (role: Role) => void;
  showSelectButton?: boolean;
}

export default function RoleIntroCard({
  roleInfo,
  selected = false,
  onSelect,
  showSelectButton = false,
}: RoleIntroCardProps) {
  const { role, title, subtitle, description, icon, badge, popularFor } = roleInfo;

  return (
    <div
      className={`ml-role-intro-card ml-role-intro-card--${role} ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect?.(role)}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="ml-role-card-header">
        <div className={`ml-role-avatar ml-role-avatar--${role}`}>
          <Icon name={icon} size={26} />
        </div>
        <div className="ml-role-card-titles">
          <div className="ml-role-title-row">
            <h3>{title}</h3>
            <span className="ml-role-badge">{badge}</span>
          </div>
          <p className="ml-role-subtitle">{subtitle}</p>
        </div>
      </div>

      <p className="ml-role-card-desc">{description}</p>

      <div className="ml-role-card-tags">
        {popularFor.map((item) => (
          <span key={item} className="ml-role-tag">
            <Icon name="check" size={13} /> {item}
          </span>
        ))}
      </div>

      {showSelectButton && onSelect && (
        <button
          type="button"
          className={`ml-role-select-btn ${selected ? 'selected' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(role);
          }}
        >
          {selected ? 'Selected' : `Register as ${title}`}
        </button>
      )}
    </div>
  );
}
