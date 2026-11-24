// Route paths for MilkLink according to the 46-page tracker specification

export const PATHS = {
  // Public & Common
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  REGISTER_FARMER: '/register/farmer',
  REGISTER_BUYER: '/register/buyer',
  REGISTER_COLLECTOR: '/register/collector',
  PROFILE: '/app/profile',
  LOCATION: '/app/location',
  SYNC: '/app/sync',
  SYNC_CONFLICTS: '/app/sync/conflicts/:operationId',
  INSTALL: '/install',

  // Farmer Routes
  FARMER_DASHBOARD: '/farmer',
  FARMER_LISTINGS: '/farmer/listings',
  FARMER_LISTING_NEW: '/farmer/listings/new',
  FARMER_LISTING_DETAIL: '/farmer/listings/:listingId',
  FARMER_LISTING_EDIT: '/farmer/listings/:listingId/edit',
  FARMER_ORDERS: '/farmer/orders',
  FARMER_ORDER_DETAIL: '/farmer/orders/:orderId',
  FARMER_HISTORY: '/farmer/history',

  // Buyer Routes
  BUYER_DASHBOARD: '/buyer',
  BUYER_SEARCH: '/buyer/search',
  BUYER_MAP: '/buyer/search/map',
  BUYER_MATCHES: '/buyer/matches',
  BUYER_FARMER_DETAIL: '/buyer/farmers/:farmerId',
  BUYER_ORDER_NEW: '/buyer/orders/new',
  BUYER_ORDER_REVIEW: '/buyer/orders/review',
  BUYER_ORDERS: '/buyer/orders',
  BUYER_ORDER_DETAIL: '/buyer/orders/:orderId',
  BUYER_ASSIGN_COLLECTOR: '/buyer/orders/:orderId/assign-collector',
  BUYER_HISTORY: '/buyer/history',
  BUYER_SELF_PICKUP: '/buyer/orders/:orderId/self-pickup',

  // Collector Routes
  COLLECTOR_DASHBOARD: '/collector',
  COLLECTOR_PICKUPS: '/collector/pickups',
  COLLECTOR_PICKUP_DETAIL: '/collector/pickups/:pickupId',
  COLLECTOR_RECORD: '/collector/pickups/:pickupId/collect',
  COLLECTOR_HISTORY: '/collector/history',

  // Administrator Routes (A-P01 to A-P10)
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USER_DETAIL: '/admin/users/:userId',
  ADMIN_LISTINGS: '/admin/listings',
  ADMIN_LISTING_DETAIL: '/admin/listings/:listingId',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ORDER_DETAIL: '/admin/orders/:orderId',
  ADMIN_MATCHES: '/admin/matches',
  ADMIN_SYNC: '/admin/sync',
  ADMIN_REPORTS: '/admin/reports',
} as const;

export type PathKeys = keyof typeof PATHS;
