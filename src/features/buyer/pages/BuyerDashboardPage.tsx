import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '../../auth/components/AuthUI';
import { getSession, signOut } from '../../auth/components/mockAuth';
import {
  DEMO_NEARBY_FARMERS,
  BUYER_CATEGORIES,
  getBuyerFavorites,
  toggleBuyerFavorite,
  getBuyerOrders,
  createBuyerOrder,
  type FarmerListingSummary,
} from '../data';
import '../buyer.css';

// SVG Category Icons tailored to the design
function CategoryIcon({ type }: { type: string }) {
  if (type === 'bottle') {
    // Milk bottle with blue cap
    return (
      <svg className="ml-cat-icon-svg" viewBox="0 0 36 36" fill="none">
        <rect x="13" y="2" width="10" height="4" rx="1.5" fill="#38bdf8" />
        <path d="M14 6V10L10 14V31C10 32.6569 11.3431 34 13 34H23C24.6569 34 26 32.6569 26 31V14L22 10V6H14Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1.6" />
        <path d="M10 22C13 24 16 21 20 23C23 24.5 25 23 26 22V31C26 32.6569 24.6569 34 23 34H13C11.3431 34 10 32.6569 10 31V22Z" fill="#ffffff" />
        <line x1="18" y1="18" x2="18" y2="28" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="2 2" />
      </svg>
    );
  }
  if (type === 'cheese') {
    // Cheese wedge
    return (
      <svg className="ml-cat-icon-svg" viewBox="0 0 36 36" fill="none">
        <path d="M5 26L31 26C31 16 23 7 13 7L5 26Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.6" />
        <path d="M5 26V30C5 31.1046 5.89543 32 7 32H29C30.1046 32 31 31.1046 31 30V26H5Z" fill="#fde047" stroke="#ca8a04" strokeWidth="1.6" />
        <circle cx="14" cy="18" r="2.5" fill="#eab308" />
        <circle cx="23" cy="20" r="1.8" fill="#eab308" />
        <circle cx="19" cy="13" r="1.5" fill="#eab308" />
      </svg>
    );
  }
  if (type === 'cup') {
    // Yogurt cup
    return (
      <svg className="ml-cat-icon-svg" viewBox="0 0 36 36" fill="none">
        <ellipse cx="18" cy="8" rx="10" ry="3.5" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.4" />
        <path d="M8 8.5L11 29C11.3 30.5 12.8 32 15 32H21C23.2 32 24.7 30.5 25 29L28 8.5" fill="#f0f9ff" stroke="#0284c7" strokeWidth="1.6" />
        <path d="M11 18C14 20 18 17 21 19C23 20 24.5 19 25.5 18V29C25 30.5 23.5 32 21 32H15C12.5 32 11 30.5 11 29V18Z" fill="#bae6fd" />
      </svg>
    );
  }
  // Butter block
  return (
    <svg className="ml-cat-icon-svg" viewBox="0 0 36 36" fill="none">
      <path d="M8 17L22 10L30 14L16 21L8 17Z" fill="#fef08a" stroke="#eab308" strokeWidth="1.4" />
      <path d="M8 17V26C8 26.8 8.6 27.5 9.4 27.8L16 30.5V21L8 17Z" fill="#fde047" stroke="#eab308" strokeWidth="1.4" />
      <path d="M16 21V30.5L28.6 26.2C29.4 25.9 30 25.2 30 24.4V14L16 21Z" fill="#facc15" stroke="#eab308" strokeWidth="1.4" />
    </svg>
  );
}

export default function BuyerDashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const session = getSession();

  // State
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'favorites' | 'profile'>(location.pathname === '/buyer/favorites' ? 'favorites' : 'home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>(getBuyerFavorites());
  const [orders, setOrders] = useState(getBuyerOrders());
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerListingSummary | null>(null);
  const [orderLitres, setOrderLitres] = useState(25);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Dynamic user name
  const userName = session?.name || 'Kavindu Silva';
  const userGreetingName = userName.split(' ')[0] ? `${userName.split(' ')[0]} Silva` : 'Kavindu Silva';

  // Filter farmers based on search and selected category
  const filteredFarmers = useMemo(() => {
    return DEMO_NEARBY_FARMERS.filter((farm) => {
      const matchSearch =
        farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farm.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        !selectedCategory ||
        (selectedCategory === 'raw-milk' && farm.productType === 'Raw Milk') ||
        (selectedCategory === 'dairy-products' && farm.productType === 'Dairy Products') ||
        (selectedCategory === 'yogurt' && farm.productType === 'Yogurt') ||
        (selectedCategory === 'butter' && farm.productType === 'Butter');

      return matchSearch && matchCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleToggleFavorite = (farmId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleBuyerFavorite(farmId);
    setFavorites(updated);
  };

  const handlePlaceOrder = () => {
    if (!selectedFarmer) return;
    const newOrder = createBuyerOrder({
      farmerName: selectedFarmer.name,
      quantity: orderLitres,
      pricePerLitre: selectedFarmer.pricePerLitre,
      totalAmount: orderLitres * selectedFarmer.pricePerLitre,
      status: 'pending',
      collectionType: 'collector',
    });
    setOrders((prev) => [newOrder, ...prev]);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setSelectedFarmer(null);
    }, 1800);
  };

  return (
    <div className="ml-buyer-screen">
      <div className="ml-buyer-phone-frame">
        {/* iOS-style Status Bar */}
        <div className="ml-buyer-status-bar">
          <span className="ml-status-time">9:41</span>
          <div className="ml-status-icons">
            {/* Cellular signal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
              <rect x="0" y="8" width="3" height="3" rx="0.5" fill="#0f172a" />
              <rect x="4.5" y="5.5" width="3" height="5.5" rx="0.5" fill="#0f172a" />
              <rect x="9" y="3" width="3" height="8" rx="0.5" fill="#0f172a" />
              <rect x="13.5" y="0.5" width="3" height="10.5" rx="0.5" fill="#0f172a" />
            </svg>
            {/* Wifi */}
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5C8.82843 9.5 9.5 10.1716 9.5 11C9.5 11.8284 8.82843 12.5 8 12.5C7.17157 12.5 6.5 11.8284 6.5 11C6.5 10.1716 7.17157 9.5 8 9.5ZM8 6C10.3 6 12.3 7 13.7 8.5L12.3 9.9C11.2 8.7 9.7 8 8 8C6.3 8 4.8 8.7 3.7 9.9L2.3 8.5C3.7 7 5.7 6 8 6ZM8 2C11.5 2 14.6 3.5 16.7 5.9L15.3 7.3C13.5 5.3 10.9 4 8 4C5.1 4 2.5 5.3 0.7 7.3L-0.7 5.9C1.4 3.5 4.5 2 8 2Z" fill="#0f172a" />
            </svg>
            {/* Battery */}
            <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="#0f172a" />
              <rect x="2" y="2" width="13" height="7" rx="1.5" fill="#0f172a" />
              <path d="M20 3.5V7.5" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Top App Bar matching screenshot */}
        <header className="ml-buyer-topbar">
          <button
            type="button"
            className="ml-icon-btn"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <div className="ml-buyer-logo" onClick={() => setActiveTab('home')}>
            <span className="ml-buyer-logo-drop">
              <Icon name="drop" size={24} />
            </span>
            <span className="ml-buyer-logo-text">MilkLink</span>
          </div>

          <div className="ml-buyer-actions">
            <button
              type="button"
              className="ml-icon-btn ml-notif-btn"
              onClick={() => setNotificationsOpen(true)}
              aria-label="Notifications"
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="ml-notif-badge" />
            </button>

            <button
              type="button"
              className="ml-avatar-btn"
              onClick={() => navigate('/app/profile')}
              aria-label="Profile"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
          </div>
        </header>

        {/* Dynamic Views based on activeTab */}
        {activeTab === 'home' && (
          <main className="ml-buyer-content">
            {/* Hero Greeting Card */}
            <section className="ml-buyer-hero-card">
              <div className="ml-buyer-hero-info">
                <p className="ml-buyer-greeting">Hello,</p>
                <div className="ml-buyer-name-row">
                  <h1 className="ml-buyer-name">{userGreetingName}</h1>
                  <span className="ml-wave-emoji" role="img" aria-label="Waving hand">👋</span>
                </div>
                <div className="ml-buyer-pill">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Buyer</span>
                </div>
              </div>

              {/* Milk Glass Illustration with splash */}
              <div className="ml-buyer-hero-visual">
                <img
                  src="/images/buyer-milk-splash.png"
                  alt="Glass of fresh milk with splash"
                  className="ml-buyer-hero-img"
                  onError={(e) => {
                    // Fallback to login-milk.webp if needed
                    (e.target as HTMLImageElement).src = '/images/login-milk.webp';
                  }}
                />
              </div>
            </section>

            {/* Search Bar */}
            <div className="ml-buyer-search-wrapper">
              <div className="ml-buyer-search-box">
                <span className="ml-search-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search milk, products or farmers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="ml-buyer-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="ml-search-clear"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <section className="ml-categories-section">
              <div className="ml-categories-grid">
                {BUYER_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`ml-category-tile ${isActive ? 'is-active' : ''}`}
                      onClick={() => setSelectedCategory(isActive ? null : cat.id)}
                    >
                      <div className="ml-cat-icon-wrap">
                        <CategoryIcon type={cat.icon} />
                      </div>
                      <span className="ml-cat-title">{cat.label}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Nearby Farmers Section */}
            <section className="ml-nearby-section">
              <div className="ml-section-header">
                <h2 className="ml-section-title">Nearby Farmers</h2>
                <button
                  type="button"
                  className="ml-section-link"
                  onClick={() => navigate('/buyer/search')}
                >
                  View All
                </button>
              </div>

              <div className="ml-farmers-list">
                {filteredFarmers.length === 0 ? (
                  <div className="p-6 text-center bg-white rounded-2xl border border-slate-100 text-slate-500">
                    <Icon name="pin" size={32} className="mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">No matching farms found</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search or category filter.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                      className="mt-3 text-xs font-bold text-sky-600 underline"
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  filteredFarmers.map((farmer) => {
                    return (
                      <div
                        key={farmer.id}
                        className="ml-farmer-card"
                        onClick={() => setSelectedFarmer(farmer)}
                      >
                        <div className="ml-farmer-avatar-wrap">
                          <img
                            src={farmer.image}
                            alt={farmer.name}
                            className="ml-farmer-avatar-img"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/images/welcome-pasture.webp';
                            }}
                          />
                        </div>

                        <div className="ml-farmer-info">
                          <h3 className="ml-farmer-title">{farmer.name}</h3>
                          <div className="ml-farmer-meta">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            <span>{farmer.distance}</span>
                          </div>
                          <p className="ml-farmer-tags">{farmer.tag}</p>
                        </div>

                        <div className="ml-farmer-right">
                          <div className="ml-rating-badge">
                            <span className="ml-star-icon">★</span>
                            <span>{farmer.rating.toFixed(1)}</span>
                          </div>
                          <span className="ml-chevron-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="9 18 15 12 9 6" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </main>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <main className="ml-buyer-content">
            <div className="flex items-center justify-between mt-1 mb-2">
              <h2 className="text-lg font-bold text-slate-800">My Milk Orders</h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full">
                {orders.length} Orders
              </span>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-50">
                    <span className="text-xs font-bold text-slate-400">#{ord.id}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        ord.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.status === 'pending'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-slate-800">{ord.farmerName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {ord.quantity} Litres @ Rs. {ord.pricePerLitre}/L
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm text-sky-800">Rs. {ord.totalAmount.toLocaleString()}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{ord.orderDate}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <main className="ml-buyer-content">
            <h2 className="text-lg font-bold text-slate-800 mt-1 mb-2">Saved Dairy Farms</h2>
            <div className="ml-farmers-list">
              {DEMO_NEARBY_FARMERS.filter((f) => favorites.includes(f.id)).map((farmer) => (
                <div
                  key={farmer.id}
                  className="ml-farmer-card"
                  onClick={() => setSelectedFarmer(farmer)}
                >
                  <div className="ml-farmer-avatar-wrap">
                    <img src={farmer.image} alt={farmer.name} className="ml-farmer-avatar-img" />
                  </div>
                  <div className="ml-farmer-info">
                    <h3 className="ml-farmer-title">{farmer.name}</h3>
                    <p className="ml-farmer-tags">{farmer.location} • {farmer.distance}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      {farmer.availableLitres}L Available @ Rs. {farmer.pricePerLitre}/L
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(farmer.id, e)}
                    className="p-2 text-rose-500"
                    aria-label="Remove favorite"
                  >
                    ♥
                  </button>
                </div>
              ))}
            </div>
          </main>
        )}

        {/* Profile Tab View */}
        {activeTab === 'profile' && (
          <main className="ml-buyer-content">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-sky-500 to-sky-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                {userName.charAt(0)}
              </div>
              <h2 className="text-base font-bold text-slate-900">{userName}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{session?.detail || 'Kandy Dairy Shop'}</p>
              <span className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-800">
                Verified Milk Buyer
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs space-y-2">
              <button
                type="button"
                onClick={() => navigate('/app/profile')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon name="user" size={18} />
                  <span className="text-sm font-semibold text-slate-700">Account Details</span>
                </div>
                <Icon name="chevron" size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/app/location')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon name="pin" size={18} />
                  <span className="text-sm font-semibold text-slate-700">Delivery Location</span>
                </div>
                <Icon name="chevron" size={16} />
              </button>

              <button
                type="button"
                onClick={() => navigate('/app/sync')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-3">
                  <Icon name="wifi-off" size={18} />
                  <span className="text-sm font-semibold text-slate-700">Offline Sync Center</span>
                </div>
                <Icon name="chevron" size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                signOut();
                navigate('/login');
              }}
              className="w-full py-3 rounded-xl border border-rose-200 text-rose-600 font-bold text-sm hover:bg-rose-50 transition"
            >
              Sign Out of MilkLink
            </button>
          </main>
        )}

        {/* Bottom Navigation Bar exactly matching the design */}
        <nav className="ml-buyer-bottom-nav">
          <button
            type="button"
            className={`ml-nav-tab ${activeTab === 'home' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            <span className="ml-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </span>
            <span className="ml-nav-label">Home</span>
          </button>

          <button
            type="button"
            className={`ml-nav-tab ${activeTab === 'orders' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <span className="ml-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            </span>
            <span className="ml-nav-label">Orders</span>
          </button>

          <button
            type="button"
            className={`ml-nav-tab ${activeTab === 'favorites' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            <span className="ml-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={activeTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </span>
            <span className="ml-nav-label">Favorites</span>
          </button>

          <button
            type="button"
            className={`ml-nav-tab ${activeTab === 'profile' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="ml-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
            </span>
            <span className="ml-nav-label">Profile</span>
          </button>
        </nav>

        {/* Farmer Detail / Quick Order Modal */}
        {selectedFarmer && (
          <div className="ml-modal-backdrop" onClick={() => setSelectedFarmer(null)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedFarmer.image}
                    alt={selectedFarmer.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-sky-100"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{selectedFarmer.name}</h3>
                    <p className="text-xs text-slate-500">{selectedFarmer.location} • {selectedFarmer.distance}</p>
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 mt-0.5">
                      ★ {selectedFarmer.rating} ({selectedFarmer.reviewsCount} reviews)
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="ml-modal-close-btn"
                  onClick={() => setSelectedFarmer(null)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 p-3.5 bg-sky-50/70 rounded-xl border border-sky-100 space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Available Today:</span>
                  <span className="font-bold text-slate-800">{selectedFarmer.availableLitres} Litres</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Price per Litre:</span>
                  <span className="font-bold text-sky-700">Rs. {selectedFarmer.pricePerLitre} / L</span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Product Quality:</span>
                  <span className="font-medium text-emerald-700">Daily Tested • Grade A</span>
                </div>
              </div>

              {/* Order quantity slider */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700">Select Quantity:</label>
                  <span className="text-sm font-extrabold text-sky-700">{orderLitres} L</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max={Math.min(selectedFarmer.availableLitres, 100)}
                  step="5"
                  value={orderLitres}
                  onChange={(e) => setOrderLitres(Number(e.target.value))}
                  className="w-full accent-sky-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Min: 5L</span>
                  <span>Total: Rs. {(orderLitres * selectedFarmer.pricePerLitre).toLocaleString()}</span>
                  <span>Max: {Math.min(selectedFarmer.availableLitres, 100)}L</span>
                </div>
              </div>

              {orderSuccess ? (
                <div className="mt-5 p-3 rounded-xl bg-emerald-50 text-emerald-800 text-center text-sm font-bold animate-in fade-in">
                  ✓ Order Placed Successfully! Collector Assigned.
                </div>
              ) : (
                <div className="mt-5 flex gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(selectedFarmer.id, e)}
                    className="px-4 py-3 rounded-xl border border-slate-200 text-rose-500 hover:bg-slate-50 font-bold"
                  >
                    {favorites.includes(selectedFarmer.id) ? '♥ Saved' : '♡ Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-md shadow-sky-600/20 transition"
                  >
                    Order {orderLitres}L (Rs. {(orderLitres * selectedFarmer.pricePerLitre).toLocaleString()})
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notifications Modal */}
        {notificationsOpen && (
          <div className="ml-modal-backdrop" onClick={() => setNotificationsOpen(false)}>
            <div className="ml-modal-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="ml-sheet-handle" />
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-base text-slate-900">Notifications</h3>
                <button
                  type="button"
                  className="ml-modal-close-btn"
                  onClick={() => setNotificationsOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="mt-3 space-y-2.5">
                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                  <p className="text-xs font-bold text-sky-900">Fresh Milk Supply Alert</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Green Valley Farm added 120L fresh morning milk at Rs. 195/L.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">10 mins ago</span>
                </div>

                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <p className="text-xs font-bold text-emerald-900">Order #ORD-2048 Confirmed</p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Your 50L milk order was accepted. Collector Sampath is assigned.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 inline-block">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide-out Menu Drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col z-10 p-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="ml-buyer-logo">
                  <span className="ml-buyer-logo-drop">
                    <Icon name="drop" size={22} />
                  </span>
                  <span className="ml-buyer-logo-text">MilkLink</span>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="py-4">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 mb-4">
                  <p className="text-xs text-sky-800 font-semibold">{userName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{session?.detail || 'Kandy Dairy Shop'}</p>
                  <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white">
                    Buyer Account
                  </span>
                </div>

                <nav className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('home');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                  >
                    <Icon name="home" size={18} />
                    <span>Home Dashboard</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/buyer/search');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                  >
                    <Icon name="pin" size={18} />
                    <span>Find Farmers (Search)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('orders');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                  >
                    <Icon name="cart" size={18} />
                    <span>My Orders</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('favorites');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                  >
                    <span className="text-rose-500">♥</span>
                    <span>Saved Farms</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/app/profile');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                  >
                    <Icon name="user" size={18} />
                    <span>Buyer Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/app/sync');
                      setDrawerOpen(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-3"
                  >
                    <Icon name="wifi-off" size={18} />
                    <span>Offline Sync</span>
                  </button>
                </nav>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    navigate('/login');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3 transition"
                >
                  <Icon name="logout" size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
