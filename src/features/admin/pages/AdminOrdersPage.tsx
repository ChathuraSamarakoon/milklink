import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu, ShoppingCart, Truck, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const mockOrders = [
    { id: 'ord-501', buyer: 'Kavindu Silva', farmer: 'Nimal Perera', litres: 28.0, totalLkr: 5880, status: 'accepted', collector: 'Sampath Kumara' },
    { id: 'ord-502', buyer: 'Kasun Rajapaksha', farmer: 'Ruwan Dairy Farm', litres: 32.5, totalLkr: 6987.5, status: 'in-transit', collector: 'Sampath Kumara' },
    { id: 'ord-503', buyer: 'Local Dairy Co-op', farmer: 'Priyantha Dissanayake', litres: 28.0, totalLkr: 6160, status: 'pending', collector: 'Unassigned' },
    { id: 'ord-504', buyer: 'Nawalapitiya Sweets', farmer: 'Sunethra Bandara', litres: 15.0, totalLkr: 3375, status: 'completed', collector: 'Nuwan Jayawardena' },
  ];

  return (
    <div className="admin-page-container">
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentPath="/admin/orders"
        onNavigate={(path: string) => navigate(path)}
      />

      <header className="admin-mobile-topbar">
        <div className="topbar-left">
          <button type="button" className="topbar-icon-btn" onClick={() => setIsSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <button type="button" className="topbar-back-btn" onClick={() => navigate('/admin')}>
            <ArrowLeft size={20} />
          </button>
          <div className="topbar-title-block">
            <h1 className="topbar-title">Order Management</h1>
            <span className="topbar-badge">Admin Oversight</span>
          </div>
        </div>
        <div className="topbar-right">
          <div className="admin-avatar-pill">A</div>
        </div>
      </header>

      <main className="admin-main-content">
        <div className="breadcrumbs">
          <span className="breadcrumb-item link" onClick={() => navigate('/admin')}>Dashboard</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-item active">Orders</span>
        </div>

        <div className="page-header-section">
          <h2 className="admin-section-heading">Orders &amp; Collections Oversight</h2>
          <p className="admin-section-sub">Track order lifecycles from reservation to collector pickup and cash recording.</p>
        </div>

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Buyer</th>
                <th>Farmer</th>
                <th>Litres</th>
                <th>Total LKR</th>
                <th>Collector</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map((ord) => (
                <tr key={ord.id} className="user-table-row">
                  <td><strong>{ord.id}</strong></td>
                  <td>{ord.buyer}</td>
                  <td>{ord.farmer}</td>
                  <td><strong>{ord.litres} L</strong></td>
                  <td>Rs. {ord.totalLkr.toLocaleString()}</td>
                  <td>{ord.collector}</td>
                  <td>
                    <span className={`status-badge status-${ord.status === 'completed' ? 'active' : ord.status === 'pending' ? 'pending' : 'active'}`}>
                      {ord.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminOrdersPage;
