import { PageFrame, DemoDisclaimer, Icon, type Nav, type IconName } from '../components/AuthUI';

const roleCards: { title: string; role: string; description: string; icon: IconName; className: string; to: string; caption: string }[] = [
  { title: 'Farmer', role: 'Sell fresh milk', description: 'Publish milk availability, set prices and respond to buyer orders.', icon: 'farmer', className: 'farmer', to: '/register/farmer', caption: 'List & sell' },
  { title: 'Buyer', role: 'Find suppliers', description: 'Find nearby farmers, compare matches and order milk.', icon: 'cart', className: 'buyer', to: '/register/buyer', caption: 'Search & order' },
  { title: 'Collector', role: 'Handle pickups', description: 'Manage assigned pickups and record actual collected litres.', icon: 'truck', className: 'collector', to: '/register/collector', caption: 'Collect & sync' },
  { title: 'Administrator', role: 'Manage MilkLink', description: 'Administrative accounts are created by the system.', icon: 'admin', className: 'admin', to: '/login', caption: 'Sign in only' },
];
export default function RegisterRolePage({ navigate }: { navigate: Nav }) {
  return <PageFrame image="/images/roles-smartphone.webp" theme="common" navigate={navigate} back="/" pageClass="ml-role-page"><section className="ml-sheet ml-role-sheet">
    <span className="ml-section-eyebrow"><Icon name="users" size={15}/> ONE PLATFORM, FOUR ROLES</span><h1>Select Your Role</h1><p className="ml-lead">How would you like to use MilkLink?</p>
    <div className="ml-role-cards">{roleCards.map(c => <button type="button" className={`ml-role-card ml-role-card--${c.className}`} key={c.role} onClick={() => navigate(c.to)}><span className="ml-role-icon"><Icon name={c.icon} size={26}/></span><span className="ml-role-copy"><strong>{c.title}</strong><span>{c.description}</span><small>{c.caption}</small></span><Icon name="chevron" size={21}/></button>)}</div>
    <div className="ml-info-card"><Icon name="info" size={20}/><p>Admin accounts cannot self-register. Choose Administrator to go to the sign-in page.</p></div>
    <p className="ml-switch-auth">Already registered? <button onClick={() => navigate('/login')}>Login</button></p><DemoDisclaimer/>
  </section></PageFrame>;
}
