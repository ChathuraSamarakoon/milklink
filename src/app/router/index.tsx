import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import AdminDashboardPage from '../../features/admin/pages/AdminDashboardPage';
import AdminUsersPage from '../../features/admin/pages/AdminUsersPage';
import AdminUserDetailPage from '../../features/admin/pages/AdminUserDetailPage';
import AdminListingsPage from '../../features/admin/pages/AdminListingsPage';
import AdminOrdersPage from '../../features/admin/pages/AdminOrdersPage';
import AdminMatchesPage from '../../features/admin/pages/AdminMatchesPage';
import AdminSyncMonitoringPage from '../../features/admin/pages/AdminSyncMonitoringPage';
import AdminReportsPage from '../../features/admin/pages/AdminReportsPage';
import AdminLayout from '../../layouts/AdminLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
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
        path: 'orders',
        element: <AdminOrdersPage />,
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
  {
    path: '*',
    element: <Navigate to="/admin" replace />,
  },
]);

export default router;
