import React from 'react';
import RoleGuard from './RoleGuard';
import type { Role } from '../../features/auth/components/AuthUI';
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

// Buyer Pages & Layout
import BuyerDashboardPage from '../../features/buyer/pages/BuyerDashboardPage';
import FindFarmersPage from '../../features/discovery/pages/FindFarmersPage';
import NearbyFarmersMapPage from '../../features/discovery/pages/NearbyFarmersMapPage';
import RecommendedMatchesPage from '../../features/matching/pages/RecommendedMatchesPage';
import FarmerPublicDetailPage from '../../features/discovery/pages/FarmerPublicDetailPage';
import CreateMilkOrderPage from '../../features/orders/pages/CreateMilkOrderPage';
import ReviewMilkOrderPage from '../../features/orders/pages/ReviewMilkOrderPage';
import BuyerOrderDetailPage from '../../features/orders/pages/BuyerOrderDetailPage';
import AssignCollectorPage from '../../features/orders/pages/AssignCollectorPage';
import SelfPickupPage from '../../features/orders/pages/SelfPickupPage';
import MyOrdersPage from '../../features/orders/pages/MyOrdersPage';
import BuyerOrderHistoryPage from '../../features/orders/pages/BuyerOrderHistoryPage';

import CollectorDashboardPage from '../../features/collector/pages/CollectorDashboardPage';
import AssignedPickupsPage from '../../features/collector/pages/AssignedPickupsPage';
import PickupDetailsPage from '../../features/collector/pages/PickupDetailsPage';
import RecordCollectionPage from '../../features/collector/pages/RecordCollectionPage';
import CollectionHistoryPage from '../../features/collector/pages/CollectionHistoryPage';

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

function PickupDetailsAdapter() {
  const navigate = useNavigate();
  const { pickupId } = useParams<{ pickupId: string }>();
  return <PickupDetailsPage navigate={(to) => navigate(to)} pickupId={pickupId || ''} />;
}

function RecordCollectionAdapter() {
  const navigate = useNavigate();
  const { pickupId } = useParams<{ pickupId: string }>();
  return <RecordCollectionPage navigate={(to) => navigate(to)} pickupId={pickupId} />;
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

  // Buyer Flow (Full Mobile PWA Dashboard & Features)
  {
    path: '/buyer',
    element: <BuyerDashboardPage />,
  },
  {
    path: '/buyer/search',
    element: <FindFarmersPage />,
  },
  {
    path: '/buyer/search/map',
    element: <NearbyFarmersMapPage />,
  },
  {
    path: '/buyer/matches',
    element: <RecommendedMatchesPage />,
  },
  {
    path: '/buyer/farmers/:farmerId',
    element: <FarmerPublicDetailPage />,
  },
  {
    path: '/buyer/orders/new',
    element: <CreateMilkOrderPage />,
  },
  {
    path: '/buyer/orders/review',
    element: <ReviewMilkOrderPage />,
  },
  {
    path: '/buyer/orders/:orderId/assign-collector',
    element: <AssignCollectorPage />,
  },
  {
    path: '/buyer/orders/:orderId/self-pickup',
    element: <SelfPickupPage />,
  },
  {
    path: '/buyer/orders/:orderId',
    element: <BuyerOrderDetailPage />,
  },
  {
    path: '/buyer/orders',
    element: <MyOrdersPage />,
  },
  {
    path: '/buyer/history',
    element: <BuyerOrderHistoryPage />,
  },
  {
    path: '/buyer/favorites',
    element: <BuyerDashboardPage />,
  },
  {
    path: '/collector',
    element: <PageAdapter Component={CollectorDashboardPage} />,
  },

  { path: "/collector/pickups", element: <PageAdapter Component={AssignedPickupsPage} /> },
  { path: "/collector/pickups/:pickupId", element: <PickupDetailsAdapter /> },
  { path: "/collector/collect", element: <RecordCollectionAdapter /> },
  { path: "/collector/collect/:pickupId", element: <RecordCollectionAdapter /> },
  { path: "/collector/pickups/:pickupId/collect", element: <RecordCollectionAdapter /> },
  { path: "/collector/history", element: <PageAdapter Component={CollectionHistoryPage} /> },

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
 ].map((route) => {
  const role = (['farmer', 'buyer', 'collector', 'admin'] as Role[]).find(
    (candidate) => route.path === `/${candidate}` || route.path?.startsWith(`/${candidate}/`),
  );
  if (role || route.path?.startsWith('/app/') || route.path === '/install') {
    return { ...route, element: <RoleGuard allowedRoles={role ? [role] : undefined}>{route.element}</RoleGuard> };
  }
  return route;
}));

export default router;
