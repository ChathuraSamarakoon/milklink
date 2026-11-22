import { useEffect, useMemo, useState } from 'react';
import WelcomePage from '../features/auth/pages/WelcomePage';
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterRolePage from '../features/auth/pages/RegisterRolePage';
import FarmerRegisterPage from '../features/auth/pages/FarmerRegisterPage';
import BuyerRegisterPage from '../features/auth/pages/BuyerRegisterPage';
import CollectorRegisterPage from '../features/auth/pages/CollectorRegisterPage';
import { Brand, Button, DemoDisclaimer, Icon, type Nav, type Role } from '../features/auth/components/AuthUI';
import { getSession, signOut } from '../features/auth/components/mockAuth';
import ProfilePage from '../features/profile/pages/ProfilePage';
import LocationSetupPage from '../features/location/pages/LocationSetupPage';
import SyncCenterPage from '../features/offline/pages/SyncCenterPage';
import SyncConflictPage from '../features/offline/pages/SyncConflictPage';
import InstallHelpPage from '../features/pwa/pages/InstallHelpPage';
import FarmerDashboardPage from '../features/farmer/pages/FarmerDashboardPage';
import FarmerListingsPage from '../features/farmer/pages/FarmerListingsPage';
import AddMilkListingPage from '../features/farmer/pages/AddMilkListingPage';
import ListingDetailsPage from '../features/farmer/pages/ListingDetailsPage';
import EditListingPage from '../features/farmer/pages/EditListingPage';
import IncomingOrdersPage from '../features/farmer/pages/IncomingOrdersPage';
import FarmerOrderDetailPage from '../features/farmer/pages/FarmerOrderDetailPage';
import FarmerHistoryPage from '../features/farmer/pages/FarmerHistoryPage';
import CollectorDashboardPage from '../features/collector/pages/CollectorDashboardPage';
import AssignedPickupsPage from '../features/collector/pages/AssignedPickupsPage';
import PickupDetailsPage from '../features/collector/pages/PickupDetailsPage';
import RecordCollectionPage from '../features/collector/pages/RecordCollectionPage';
import CollectionHistoryPage from '../features/collector/pages/CollectionHistoryPage';
import '../features/auth/pages/AuthPages.css';

function DemoHome({ role, navigate }: { role: Role; navigate: Nav }) {
  const user = getSession();
  if (!user || user.role !== role) {
    return (
      <main className="ml-ui ml-theme-common">
        <div className="ml-mobile-container">
          <section className="ml-sheet ml-404">
            <h1>Login required</h1>
            <p>Please sign in to view this demo dashboard.</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </section>
        </div>
      </main>
    );
  }
  const actions: Record<Role, string[]> = {
    farmer: ['My Milk Listings', 'Incoming Orders', 'Order History'],
    buyer: ['Find Nearby Farmers', 'Recommended Matches', 'My Orders'],
    collector: ['Assigned Pickups', 'Record Collection', 'Collection History'],
    admin: ['Users', 'Milk Listings', 'Orders'],
  };
  return (
    <main className={`ml-ui ml-theme-${role}`}>
      <div className="ml-mobile-container ml-preview-home">
        <div className="ml-preview-header"><Brand /><span className="ml-pill">{role}</span></div>
        <div className="ml-preview-banner">
          <span className="ml-smalltag"><Icon name="check" size={15} /> Demo sign-in successful</span>
          <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
          <p>{user.detail}</p>
        </div>
        <section className="ml-sheet">
          <h2>{role[0].toUpperCase() + role.slice(1)} dashboard</h2>
          <p>This prototype includes the full farmer flow and the collector flow with dashboard, pickups, collection recording and history pages.</p>
          <div className="ml-dashboard-tiles">{actions[role].map((action) => <div className="ml-dashboard-tile" key={action}><Icon name={role === 'farmer' ? 'milk' : role === 'buyer' ? 'cart' : role === 'collector' ? 'truck' : 'users'} /><span>{action}</span><small>Preview</small></div>)}</div>
          <div className="ml-dashboard-tiles">
            <button className="ml-dashboard-tile" onClick={() => navigate('/app/profile')}><Icon name="user" /><span>My Profile</span><small>Shared screen</small></button>
            <button className="ml-dashboard-tile" onClick={() => navigate('/app/location')}><Icon name="pin" /><span>Location Setup</span><small>Shared screen</small></button>
            <button className="ml-dashboard-tile" onClick={() => navigate('/app/sync')}><Icon name="wifi-off" /><span>Sync Center</span><small>Shared screen</small></button>
            <button className="ml-dashboard-tile" onClick={() => navigate('/install')}><Icon name="phone" /><span>Install PWA</span><small>Shared screen</small></button>
          </div>
          <Button onClick={() => { signOut(); navigate('/login'); }} outline><Icon name="logout" size={18} /> Sign out of demo</Button>
          <DemoDisclaimer />
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const [path, setPath] = useState(window.location.pathname.replace(/\/$/, '') || '/');
  useEffect(() => {
    const callback = () => setPath(window.location.pathname.replace(/\/$/, '') || '/');
    window.addEventListener('popstate', callback);
    return () => window.removeEventListener('popstate', callback);
  }, []);

  const navigate: Nav = (to) => {
    if (to !== window.location.pathname) window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const session = getSession();
  const protectedPath = path.startsWith('/app/') || path.startsWith('/install') || path.startsWith('/farmer') || path.startsWith('/collector');
  const routeParts = useMemo(() => path.split('/').filter(Boolean), [path]);

  if (protectedPath && !session) return <LoginPage navigate={navigate} />;
  if (path.startsWith('/app/sync/conflicts/')) return <SyncConflictPage navigate={navigate} id={decodeURIComponent(path.split('/').pop() || '')} />;

  if (path.startsWith('/farmer')) {
    if (session?.role !== 'farmer') return <DemoHome role="farmer" navigate={navigate} />;
    if (path === '/farmer') return <FarmerDashboardPage navigate={navigate} />;
    if (path === '/farmer/listings') return <FarmerListingsPage navigate={navigate} />;
    if (path === '/farmer/listings/new') return <AddMilkListingPage navigate={navigate} />;
    if (routeParts[0] === 'farmer' && routeParts[1] === 'listings' && routeParts[2] && routeParts[3] === 'edit') return <EditListingPage navigate={navigate} listingId={decodeURIComponent(routeParts[2])} />;
    if (routeParts[0] === 'farmer' && routeParts[1] === 'listings' && routeParts[2]) return <ListingDetailsPage navigate={navigate} listingId={decodeURIComponent(routeParts[2])} />;
    if (path === '/farmer/orders') return <IncomingOrdersPage navigate={navigate} />;
    if (routeParts[0] === 'farmer' && routeParts[1] === 'orders' && routeParts[2]) return <FarmerOrderDetailPage navigate={navigate} orderId={decodeURIComponent(routeParts[2])} />;
    if (path === '/farmer/history') return <FarmerHistoryPage navigate={navigate} />;
  }


  if (path.startsWith('/collector')) {
    if (session?.role !== 'collector') return <DemoHome role="collector" navigate={navigate} />;
    if (path === '/collector') return <CollectorDashboardPage navigate={navigate} />;
    if (path === '/collector/pickups') return <AssignedPickupsPage navigate={navigate} />;
    if (path === '/collector/collect') return <RecordCollectionPage navigate={navigate} />;
    if (routeParts[0] === 'collector' && routeParts[1] === 'pickups' && routeParts[2]) return <PickupDetailsPage navigate={navigate} pickupId={decodeURIComponent(routeParts[2])} />;
    if (routeParts[0] === 'collector' && routeParts[1] === 'collect' && routeParts[2]) return <RecordCollectionPage navigate={navigate} pickupId={decodeURIComponent(routeParts[2])} />;
    if (path === '/collector/history') return <CollectionHistoryPage navigate={navigate} />;
  }

  switch (path) {
    case '/': return <WelcomePage navigate={navigate} />;
    case '/login': return <LoginPage navigate={navigate} />;
    case '/register': return <RegisterRolePage navigate={navigate} />;
    case '/register/farmer': return <FarmerRegisterPage navigate={navigate} />;
    case '/register/buyer': return <BuyerRegisterPage navigate={navigate} />;
    case '/register/collector': return <CollectorRegisterPage navigate={navigate} />;
    case '/app/profile': return <ProfilePage navigate={navigate} />;
    case '/app/location': return <LocationSetupPage navigate={navigate} />;
    case '/app/sync': return <SyncCenterPage navigate={navigate} />;
    case '/install': return <InstallHelpPage navigate={navigate} />;
    case '/buyer': return <DemoHome role="buyer" navigate={navigate} />;
    case '/collector': return <DemoHome role="collector" navigate={navigate} />;
    case '/admin': return <DemoHome role="admin" navigate={navigate} />;
    default:
      return (
        <main className="ml-ui ml-theme-common">
          <div className="ml-mobile-container">
            <section className="ml-sheet ml-404">
              <Icon name="map" size={44} />
              <h1>Page not found</h1>
              <Button onClick={() => navigate('/')}>Back to MilkLink</Button>
            </section>
          </div>
        </main>
      );
  }
}
