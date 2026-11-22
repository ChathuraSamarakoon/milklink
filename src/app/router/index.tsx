import React from 'react';
import { createBrowserRouter, Navigate, useNavigate, useParams } from 'react-router-dom';

// Auth & Public Pages
import WelcomePage from '../../features/auth/pages/WelcomePage';
import LoginPage from '../../features/auth/pages/LoginPage';
import RegisterRolePage from '../../features/auth/pages/RegisterRolePage';
import FarmerRegisterPage from '../../features/auth/pages/FarmerRegisterPage';
import BuyerRegisterPage from '../../features/auth/pages/BuyerRegisterPage';
import CollectorRegisterPage from '../../features/auth/pages/CollectorRegisterPage';

// Shared App Pages
import ProfilePage from '../../features/profile/pages/ProfilePage';
import LocationSetupPage from '../../features/location/pages/LocationSetupPage';
import SyncCenterPage from '../../features/offline/pages/SyncCenterPage';
import SyncConflictPage from '../../features/offline/pages/SyncConflictPage';
import InstallHelpPage from '../../features/pwa/pages/InstallHelpPage';

// Farmer Pages
import FarmerDashboardPage from '../../features/farmer/pages/FarmerDashboardPage';
import FarmerListingsPage from '../../features/farmer/pages/FarmerListingsPage';
import AddMilkListingPage from '../../features/farmer/pages/AddMilkListingPage';
import ListingDetailsPage from '../../features/farmer/pages/ListingDetailsPage';
import EditListingPage from '../../features/farmer/pages/EditListingPage';
import IncomingOrdersPage from '../../features/farmer/pages/IncomingOrdersPage';
import FarmerOrderDetailPage from '../../features/farmer/pages/FarmerOrderDetailPage';
import FarmerHistoryPage from '../../features/farmer/pages/FarmerHistoryPage';

// Admin Pages & Layout
import AdminLayout from '../../layouts/AdminLayout';
import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import AdminUsersPage from '../../features/admin/pages/AdminUsersPage';
import AdminUserDetailPage from '../../features/admin/pages/AdminUserDetailPage';
import AdminListingsPage from '../../features/admin/pages/AdminListingsPage';
import AdminListingDetailPage from '../../features/admin/pages/AdminListingDetailPage';
import AdminOrdersPage from '../../features/admin/pages/AdminOrdersPage';
import AdminOrderDetailPage from '../../features/admin/pages/AdminOrderDetailPage';
import AdminMatchesPage from '../../features/admin/pages/AdminMatchesPage';
import AdminSyncMonitoringPage from '../../features/admin/pages/AdminSyncMonitoringPage';
import AdminReportsPage from '../../features/admin/pages/AdminReportsPage';

// Demo components & auth helpers for Buyer/Collector
import { Brand, Button, DemoDisclaimer, Icon, type Role } from '../../features/auth/components/AuthUI';
import { getSession, signOut } from '../../features/auth/components/mockAuth';

// Adapter to provide navigate prop from react-router-dom to classic pages
function PageAdapter({ Component }: { Component: React.ComponentType<{ navigate: (to: string) => void }> }) {
  const navigate = useNavigate();
  return <Component navigate={(to: string) => navigate(to)} />;
}

// Param adapters for farmer details pages
function ListingDetailsAdapter() {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  return <ListingDetailsPage navigate={(to: string) => navigate(to)} listingId={listingId || ''} />;
}

function EditListingAdapter() {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  return <EditListingPage navigate={(to: string) => navigate(to)} listingId={listingId || ''} />;
}

function FarmerOrderDetailAdapter() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  return <FarmerOrderDetailPage navigate={(to: string) => navigate(to)} orderId={orderId || ''} />;
}

function SyncConflictAdapter() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  return <SyncConflictPage navigate={(to: string) => navigate(to)} id={id || ''} />;
}

// DemoHome for Buyer and Collector roles
function DemoHome({ role }: { role: 'buyer' | 'collector' }) {
  const navigate = useNavigate();
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

  const actions: Record<string, string[]> = {
    buyer: ['Find Nearby Farmers', 'Recommended Matches', 'My Orders'],
    collector: ['Assigned Pickups', 'Record Collection', 'Collection History'],
  };

  return (
    <main className={`ml-ui ml-theme-${role}`}>
      <div className="ml-mobile-container ml-preview-home">
        <div className="ml-preview-header">
          <Brand />
          <span className="ml-pill">{role}</span>
        </div>
        <div className="ml-preview-banner">
          <span className="ml-smalltag">
            <Icon name="check" size={15} /> Demo sign-in successful
          </span>
          <h1>Welcome back, {user.name.split(' ')[0]}!</h1>
          <p>{user.detail}</p>
        </div>
        <section className="ml-sheet">
          <h2>{role[0].toUpperCase() + role.slice(1)} dashboard</h2>
          <p>
            This is a navigation preview. The full farmer and administrator modules are now implemented with full data tables, filters, details, and diagnostics.
          </p>
          <div className="ml-dashboard-tiles">
            {actions[role]?.map((action) => (
              <div className="ml-dashboard-tile" key={action}>
                <Icon name={role === 'buyer' ? 'cart' : 'truck'} />
                <span>{action}</span>
                <small>Preview</small>
              </div>
            ))}
          </div>
          <div className="ml-dashboard-tiles">
            <button className="ml-dashboard-tile" onClick={() => navigate('/app/profile')}>
              <Icon name="user" />
              <span>My Profile</span>
              <small>Shared screen</small>
            </button>
            <button className="ml-dashboard-tile" onClick={() => navigate('/app/location')}>
              <Icon name="pin" />
              <span>Location Setup</span>
              <small>Shared screen</small>
            </button>
            <button className="ml-dashboard-tile" onClick={() => navigate('/app/sync')}>
              <Icon name="wifi-off" />
              <span>Sync Center</span>
              <small>Shared screen</small>
            </button>
            <button className="ml-dashboard-tile" onClick={() => navigate('/install')}>
              <Icon name="phone" />
              <span>Install PWA</span>
              <small>Shared screen</small>
            </button>
          </div>
          <Button
            onClick={() => {
              signOut();
              navigate('/login');
            }}
            outline
          >
            <Icon name="logout" size={18} /> Sign out of demo
          </Button>
          <DemoDisclaimer />
        </section>
      </div>
    </main>
  );
}

export const router = createBrowserRouter([
  // Public & Authentication
  {
    path: '/',
    element: <PageAdapter Component={WelcomePage} />,
  },
  {
    path: '/login',
    element: <PageAdapter Component={LoginPage} />,
  },
  {
    path: '/register',
    element: <PageAdapter Component={RegisterRolePage} />,
  },
  {
    path: '/register/farmer',
    element: <PageAdapter Component={FarmerRegisterPage} />,
  },
  {
    path: '/register/buyer',
    element: <PageAdapter Component={BuyerRegisterPage} />,
  },
  {
    path: '/register/collector',
    element: <PageAdapter Component={CollectorRegisterPage} />,
  },

  // Shared App Screens
  {
    path: '/app/profile',
    element: <PageAdapter Component={ProfilePage} />,
  },
  {
    path: '/app/location',
    element: <PageAdapter Component={LocationSetupPage} />,
  },
  {
    path: '/app/sync',
    element: <PageAdapter Component={SyncCenterPage} />,
  },
  {
    path: '/app/sync/conflicts/:id',
    element: <SyncConflictAdapter />,
  },
  {
    path: '/install',
    element: <PageAdapter Component={InstallHelpPage} />,
  },

  // Farmer Flow
  {
    path: '/farmer',
    element: <PageAdapter Component={FarmerDashboardPage} />,
  },
  {
    path: '/farmer/listings',
    element: <PageAdapter Component={FarmerListingsPage} />,
  },
  {
    path: '/farmer/listings/new',
    element: <PageAdapter Component={AddMilkListingPage} />,
  },
  {
    path: '/farmer/listings/:listingId',
    element: <ListingDetailsAdapter />,
  },
  {
    path: '/farmer/listings/:listingId/edit',
    element: <EditListingAdapter />,
  },
  {
    path: '/farmer/orders',
    element: <PageAdapter Component={IncomingOrdersPage} />,
  },
  {
    path: '/farmer/orders/:orderId',
    element: <FarmerOrderDetailAdapter />,
  },
  {
    path: '/farmer/history',
    element: <PageAdapter Component={FarmerHistoryPage} />,
  },

  // Buyer & Collector Demos
  {
    path: '/buyer',
    element: <DemoHome role="buyer" />,
  },
  {
    path: '/collector',
    element: <DemoHome role="collector" />,
  },

  // FULL ADMINISTRATOR MODULE (Visual Mockup & 46-Page Specification)
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'users',
        element: <AdminUsersPage />,
      },
      {
        path: 'users/:userId',
        element: <AdminUserDetailPage />,
      },
      {
        path: 'listings',
        element: <AdminListingsPage />,
      },
      {
        path: 'listings/:listingId',
        element: <AdminListingDetailPage />,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      {
        path: 'orders/:orderId',
        element: <AdminOrderDetailPage />,
      },
      {
        path: 'matches',
        element: <AdminMatchesPage />,
      },
      {
        path: 'sync',
        element: <AdminSyncMonitoringPage />,
      },
      {
        path: 'reports',
        element: <AdminReportsPage />,
      },
    ],
  },

  // Fallback route
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
]);

export default router;
