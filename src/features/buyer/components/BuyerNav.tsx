import { useNavigate, useLocation } from 'react-router-dom';

interface BuyerNavProps {
  active?: 'home' | 'search' | 'orders' | 'favorites' | 'profile';
}

export default function BuyerNav({ active }: BuyerNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentTab = active || (
    location.pathname.startsWith('/buyer/search')
      ? 'search'
      : location.pathname.startsWith('/buyer/orders')
      ? 'orders'
      : location.pathname.startsWith('/buyer/favorites')
      ? 'favorites'
      : location.pathname.startsWith('/app/profile')
      ? 'profile'
      : 'home'
  );

  return (
    <nav className="ml-buyer-bottom-nav">
      <button
        type="button"
        className={`ml-nav-tab ${currentTab === 'home' ? 'is-active' : ''}`}
        onClick={() => navigate('/buyer')}
      >
        <span className="ml-nav-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={currentTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </span>
        <span className="ml-nav-label">Home</span>
      </button>

      <button
        type="button"
        className={`ml-nav-tab ${currentTab === 'search' ? 'is-active' : ''}`}
        onClick={() => navigate('/buyer/search')}
      >
        <span className="ml-nav-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={currentTab === 'search' ? '2.5' : '2'} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <span className="ml-nav-label">Search</span>
      </button>

      <button
        type="button"
        className={`ml-nav-tab ${currentTab === 'orders' ? 'is-active' : ''}`}
        onClick={() => navigate('/buyer/orders')}
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
        className={`ml-nav-tab ${currentTab === 'favorites' ? 'is-active' : ''}`}
        onClick={() => navigate('/buyer/favorites')}
      >
        <span className="ml-nav-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill={currentTab === 'favorites' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </span>
        <span className="ml-nav-label">Favorites</span>
      </button>

      <button
        type="button"
        className={`ml-nav-tab ${currentTab === 'profile' ? 'is-active' : ''}`}
        onClick={() => navigate('/app/profile')}
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
  );
}
