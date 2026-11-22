import type {
  AdminDashboardData,
  AdminUser,
  AdminMilkListing,
  TimeRangeFilter,
  UserStatus,
} from '../features/admin/types';

export const MOCK_ADMIN_DASHBOARD_DATA: AdminDashboardData = {
  roleCounts: {
    totalUsers: 124,
    farmers: 68,
    collectors: 12,
    buyers: 210,
    newThisMonth: 18,
  },
  collectionMetric: {
    totalLitresThisMonth: 12560.5,
    percentChange: 8.4,
    dailyAvgLitres: 418.7,
    collectedBatches: 284,
    pendingLitres: 640.0,
    historicalBars: [35, 45, 60, 50, 75, 70, 85, 95, 100],
  },
  listingStats: {
    activeCount: 45,
    expiredCount: 8,
    draftCount: 3,
    totalLitresAvailable: 2350.0,
    avgUnitPriceLkr: 215.0,
  },
  orderStats: {
    pending: 6,
    reserved: 9,
    accepted: 14,
    inTransit: 8,
    completed: 112,
    cancelled: 3,
  },
  attentionItems: [
    {
      id: 'att-1',
      title: 'Offline Sync Conflicts Detected',
      description: '2 collector batch uploads have quantity timestamp conflicts in Polonnaruwa route.',
      severity: 'critical',
      count: 2,
      category: 'sync',
      actionLabel: 'Review Conflicts',
      actionRoute: '/admin/sync',
      timestamp: '14 mins ago',
    },
    {
      id: 'att-2',
      title: 'Unassigned Collection Pickups',
      description: '3 accepted farmer orders awaiting registered collector assignment (> 4 hours).',
      severity: 'warning',
      count: 3,
      category: 'orders',
      actionLabel: 'Assign Collector',
      actionRoute: '/admin/orders',
      timestamp: '45 mins ago',
    },
    {
      id: 'att-3',
      title: 'Farmer Registrations Pending Verification',
      description: '5 new dairy smallholders submitted phone numbers needing admin contact verification.',
      severity: 'info',
      count: 5,
      category: 'verification',
      actionLabel: 'Verify Users',
      actionRoute: '/admin/users?status=pending',
      timestamp: '2 hours ago',
    },
    {
      id: 'att-4',
      title: 'Milk Listings Expiring Today',
      description: '8 active listings will expire at 18:00 PM without buyer reservation.',
      severity: 'info',
      count: 8,
      category: 'listings',
      actionLabel: 'View Listings',
      actionRoute: '/admin/listings',
      timestamp: 'Today, 09:30 AM',
    },
  ],
  regionalSummary: [
    { region: 'Anuradhapura Central', farmerCount: 28, activeLitres: 980 },
    { region: 'Kurunegala Dairy Hub', farmerCount: 22, activeLitres: 760 },
    { region: 'Polonnaruwa North', farmerCount: 11, activeLitres: 410 },
    { region: 'Kandy / Nuwara Eliya', farmerCount: 7, activeLitres: 200 },
  ],
};

export const MOCK_ADMIN_LISTINGS: AdminMilkListing[] = [
  {
    id: 'lst-101',
    farmerId: 'usr-001',
    farmerName: 'Nimal Perera',
    farmerPhone: '+94 77 123 4567',
    district: 'Anuradhapura',
    division: 'Thirappane Division',
    totalLitres: 45.0,
    reservedLitres: 28.0,
    availableLitres: 17.0,
    unitPriceLkr: 210,
    availableFrom: '2025-01-21 06:30',
    availableTo: '2025-01-21 18:00',
    status: 'active',
    fatContentPercent: 4.4,
    milkingSession: 'morning',
    activeReservationCount: 1,
    notes: 'Morning milking batch. Cooled at 4°C immediately after milking.',
    relatedOrders: [
      {
        id: 'ord-501',
        buyerId: 'usr-002',
        buyerName: 'Kavindu Silva',
        buyerPhone: '+94 71 987 6543',
        requestedLitres: 28.0,
        totalPriceLkr: 5880,
        status: 'accepted',
        orderDate: 'Today, 07:15 AM',
        collectorName: 'Sampath Kumara',
      },
    ],
    auditEntries: [
      {
        id: 'ent-101-1',
        event: 'Milk Batch Created & Published',
        performedBy: 'Nimal Perera (Farmer via PWA Outbox)',
        timestamp: '2025-01-21 06:30:12',
        details: 'Initial quantity 45.0 L logged. Morning milking temperature 4.1°C.',
        severity: 'info',
      },
      {
        id: 'ent-101-2',
        event: 'Stock Reservation Locked',
        performedBy: 'MilkLink Matching Engine (Atomic lock)',
        timestamp: '2025-01-21 07:15:40',
        details: '28.0 L atomically reserved for Order #ord-501 (Buyer: Kavindu Silva). Unreserved stock: 17.0 L.',
        severity: 'info',
      },
      {
        id: 'ent-101-3',
        event: 'Collector Route Dispatched',
        performedBy: 'System Logistics Coordinator',
        timestamp: '2025-01-21 07:30:00',
        details: 'Registered collector Sampath Kumara assigned to pickup. Farm collection time estimated 07:30 AM.',
        severity: 'info',
      },
    ],
  },
  {
    id: 'lst-102',
    farmerId: 'usr-008',
    farmerName: 'Ruwan Dairy Farm',
    farmerPhone: '+94 77 555 7712',
    district: 'Anuradhapura',
    division: 'Nochchiyagama Area',
    totalLitres: 32.5,
    reservedLitres: 32.5,
    availableLitres: 0.0,
    unitPriceLkr: 215,
    availableFrom: '2025-01-21 07:00',
    availableTo: '2025-01-21 19:30',
    status: 'reserved',
    fatContentPercent: 4.2,
    milkingSession: 'morning',
    activeReservationCount: 1,
    notes: '100% reserved by Kasun Rajapaksha. Awaiting collector dispatch.',
    relatedOrders: [
      {
        id: 'ord-502',
        buyerId: 'usr-006',
        buyerName: 'Kasun Rajapaksha',
        buyerPhone: '+94 70 888 2311',
        requestedLitres: 32.5,
        totalPriceLkr: 6987.5,
        status: 'in-transit',
        orderDate: 'Today, 08:15 AM',
        collectorName: 'Sampath Kumara',
      },
    ],
    auditEntries: [
      {
        id: 'ent-102-1',
        event: 'Full Batch Reserved',
        performedBy: 'Buyer Kasun Rajapaksha',
        timestamp: '2025-01-21 07:10:00',
        details: 'All 32.5 L reserved. Listing marked 100% Reserved.',
        severity: 'info',
      },
    ],
  },
  {
    id: 'lst-103',
    farmerId: 'usr-004',
    farmerName: 'Priyantha Dissanayake',
    farmerPhone: '+94 77 444 8821',
    district: 'Kurunegala',
    division: 'Kuliyapitiya East',
    totalLitres: 28.0,
    reservedLitres: 0.0,
    availableLitres: 28.0,
    unitPriceLkr: 220,
    availableFrom: '2025-01-22 06:00',
    availableTo: '2025-01-22 18:00',
    status: 'active',
    fatContentPercent: 4.6,
    milkingSession: 'morning',
    activeReservationCount: 0,
    notes: 'Pure Jersey cattle milk. Available for advance order reservation.',
    relatedOrders: [],
    auditEntries: [
      {
        id: 'ent-103-1',
        event: 'Listing Scheduled for Tomorrow',
        performedBy: 'Priyantha Dissanayake',
        timestamp: 'Today, 08:00',
        details: 'Advance batch announcement for tomorrow morning collection.',
        severity: 'info',
      },
    ],
  },
  {
    id: 'lst-104',
    farmerId: 'usr-005',
    farmerName: 'Sunethra Bandara',
    farmerPhone: '+94 78 333 9102',
    district: 'Kandy',
    division: 'Kundasale Division',
    totalLitres: 15.0,
    reservedLitres: 0.0,
    availableLitres: 15.0,
    unitPriceLkr: 225,
    availableFrom: '2025-01-20 06:30',
    availableTo: '2025-01-20 18:00',
    status: 'expired',
    fatContentPercent: 4.1,
    milkingSession: 'morning',
    activeReservationCount: 0,
    notes: 'Listing expired past 18:00 cutoff without buyer reservation.',
    relatedOrders: [],
    auditEntries: [
      {
        id: 'ent-104-1',
        event: 'Automated Cutoff Expiry',
        performedBy: 'System Expiry Engine',
        timestamp: '2025-01-20 18:00:01',
        details: 'Listing expired automatically as collection window elapsed without buyer booking.',
        severity: 'warning',
      },
    ],
  },
  {
    id: 'lst-105',
    farmerId: 'usr-010',
    farmerName: 'Chaminda Silva',
    farmerPhone: '+94 75 999 1100',
    district: 'Badulla',
    division: 'Bandarawela Division',
    totalLitres: 20.0,
    reservedLitres: 0.0,
    availableLitres: 20.0,
    unitPriceLkr: 230,
    availableFrom: '2025-01-21 07:30',
    availableTo: '2025-01-21 17:00',
    status: 'disabled',
    fatContentPercent: 4.0,
    milkingSession: 'morning',
    activeReservationCount: 0,
    disabledReason: 'Administrative moderation: Pending telephone verification of herd inspection certificate.',
    moderatedAt: '2025-01-21 08:30',
    moderatedBy: 'System Administrator',
    relatedOrders: [],
    auditEntries: [
      {
        id: 'ent-105-1',
        event: 'Administrative Moderation [D]',
        performedBy: 'System Administrator',
        timestamp: '2025-01-21 08:30:00',
        details: 'Listing disabled: Pending telephone verification of herd inspection certificate.',
        severity: 'critical',
      },
    ],
  },
  {
    id: 'lst-106',
    farmerId: 'usr-001',
    farmerName: 'Nimal Perera',
    farmerPhone: '+94 77 123 4567',
    district: 'Anuradhapura',
    division: 'Thirappane Division',
    totalLitres: 40.0,
    reservedLitres: 40.0,
    availableLitres: 0.0,
    unitPriceLkr: 205,
    availableFrom: '2025-01-20 06:30',
    availableTo: '2025-01-20 18:00',
    status: 'expired',
    fatContentPercent: 4.3,
    milkingSession: 'morning',
    activeReservationCount: 1,
    relatedOrders: [],
    auditEntries: [],
  },
];

export const MOCK_ADMIN_USERS: AdminUser[] = [
  {
    id: 'usr-001',
    name: 'Nimal Perera',
    phone: '+94 77 123 4567',
    email: 'nimal.perera@example.lk',
    role: 'farmer',
    status: 'active',
    district: 'Anuradhapura',
    division: 'Thirappane Division',
    joinedDate: '2024-08-12',
    verified: true,
    notes: 'Primary dairy smallholder. Morning milking supply (40-45L daily) with high fat content.',
    metrics: { totalLitres: 1240.5, completedOrders: 28, rating: 4.8, fulfilmentRate: 98.2 },
    associatedListings: [
      { id: 'lst-101', quantityLitres: 45.0, reservedLitres: 28.0, unitPriceLkr: 210, availableDate: 'Today (Morning)', status: 'active' },
      { id: 'lst-089', quantityLitres: 40.0, reservedLitres: 40.0, unitPriceLkr: 205, availableDate: 'Yesterday', status: 'completed' },
      { id: 'lst-076', quantityLitres: 38.0, reservedLitres: 38.0, unitPriceLkr: 205, availableDate: '2025-01-19', status: 'completed' },
      { id: 'lst-062', quantityLitres: 42.0, reservedLitres: 0.0, unitPriceLkr: 210, availableDate: '2025-01-18', status: 'expired' },
    ],
    associatedOrders: [
      { id: 'ord-501', counterpartyName: 'Kavindu Silva', counterpartyRole: 'buyer', quantityLitres: 28.0, totalPriceLkr: 5880, orderDate: 'Today, 07:15 AM', status: 'accepted', collectorName: 'Sampath Kumara' },
      { id: 'ord-492', counterpartyName: 'Kasun Rajapaksha', counterpartyRole: 'buyer', quantityLitres: 40.0, totalPriceLkr: 8200, orderDate: 'Yesterday, 07:40 AM', status: 'completed', collectorName: 'Sampath Kumara' },
      { id: 'ord-477', counterpartyName: 'Dairy Co-op Hub', counterpartyRole: 'buyer', quantityLitres: 38.0, totalPriceLkr: 7790, orderDate: '2025-01-19, 07:35 AM', status: 'completed', collectorName: 'Sampath Kumara' },
    ],
    auditLogs: [
      { id: 'aud-101', action: 'Account Verification', performedBy: 'System Administrator', reason: 'Verified phone ownership & cooperative registration number via phone interview.', timestamp: '2024-08-12 11:20', previousStatus: 'pending', newStatus: 'active' },
      { id: 'aud-102', action: 'Listing Review', performedBy: 'System Audit Bot', reason: 'Daily listing published and passed unit price band checks.', timestamp: 'Today, 06:00' },
    ],
  },
  {
    id: 'usr-002',
    name: 'Kavindu Silva',
    phone: '+94 71 987 6543',
    email: 'kavindu.dairy@silvafoods.lk',
    role: 'buyer',
    status: 'active',
    district: 'Kurunegala',
    division: 'Kurunegala Town',
    joinedDate: '2024-09-05',
    verified: true,
    notes: 'Local dairy cooperative distributor. Regular bulk order placement.',
    metrics: { totalLitres: 1680.0, completedOrders: 34, rating: 4.9, fulfilmentRate: 100 },
    associatedOrders: [
      { id: 'ord-501', counterpartyName: 'Nimal Perera', counterpartyRole: 'farmer', quantityLitres: 28.0, totalPriceLkr: 5880, orderDate: 'Today, 07:15 AM', status: 'accepted', collectorName: 'Sampath Kumara' },
      { id: 'ord-488', counterpartyName: 'Ruwan Dairy Farm', counterpartyRole: 'farmer', quantityLitres: 30.0, totalPriceLkr: 6450, orderDate: 'Yesterday', status: 'completed', collectorName: 'Sampath Kumara' },
    ],
    auditLogs: [
      { id: 'aud-201', action: 'Buyer Onboarding Approval', performedBy: 'System Administrator', reason: 'Commercial buyer business registration verified.', timestamp: '2024-09-05 14:10', previousStatus: 'pending', newStatus: 'active' },
    ],
  },
  {
    id: 'usr-003',
    name: 'Sampath Kumara',
    phone: '+94 76 555 1290',
    email: 'sampath.k@milkroutes.lk',
    role: 'collector',
    status: 'active',
    district: 'Polonnaruwa',
    division: 'Hingurakgoda Hub',
    joinedDate: '2024-09-18',
    verified: true,
    notes: 'Certified collection tanker operator covering North Central routes.',
    metrics: { totalLitres: 3450.0, completedOrders: 62, rating: 4.9, fulfilmentRate: 99.1 },
    associatedOrders: [
      { id: 'ord-501', counterpartyName: 'Nimal Perera → Kavindu Silva', counterpartyRole: 'farmer', quantityLitres: 28.0, totalPriceLkr: 5880, orderDate: 'Today, 07:30 AM', status: 'accepted', collectorName: 'Sampath Kumara' },
      { id: 'ord-502', counterpartyName: 'Ruwan Dairy Farm → Kasun R.', counterpartyRole: 'farmer', quantityLitres: 32.5, totalPriceLkr: 6987.5, orderDate: 'Today, 08:15 AM', status: 'in-transit', collectorName: 'Sampath Kumara' },
    ],
    auditLogs: [
      { id: 'aud-301', action: 'Route Collector Certification', performedBy: 'Logistics Supervisor', reason: 'Mobile milk tank volume calibration & temperature sensor compliance certified.', timestamp: '2024-09-18 09:30', previousStatus: 'pending', newStatus: 'active' },
    ],
  },
  {
    id: 'usr-004',
    name: 'Priyantha Dissanayake',
    phone: '+94 77 444 8821',
    email: 'priyantha.farm@gmail.com',
    role: 'farmer',
    status: 'active',
    district: 'Kurunegala',
    division: 'Kuliyapitiya East',
    joinedDate: '2024-10-02',
    verified: true,
    notes: 'High-fat Jersey cross cow dairy farm.',
    metrics: { totalLitres: 950.0, completedOrders: 19, rating: 4.7, fulfilmentRate: 95.0 },
    associatedListings: [
      { id: 'lst-103', quantityLitres: 28.0, reservedLitres: 0.0, unitPriceLkr: 220, availableDate: 'Tomorrow, 08:00', status: 'active' },
    ],
    associatedOrders: [
      { id: 'ord-503', counterpartyName: 'Local Dairy Co-op', counterpartyRole: 'buyer', quantityLitres: 28.0, totalPriceLkr: 6160, orderDate: 'Today, 08:00', status: 'pending' },
    ],
    auditLogs: [],
  },
  {
    id: 'usr-005',
    name: 'Sunethra Bandara',
    phone: '+94 78 333 9102',
    role: 'farmer',
    status: 'pending',
    district: 'Kandy',
    division: 'Kundasale Division',
    joinedDate: '2025-01-19',
    verified: false,
    notes: 'Newly registered farmer. Awaiting telephone verification of herd size.',
    metrics: { totalLitres: 0, completedOrders: 0 },
    associatedListings: [
      { id: 'lst-104', quantityLitres: 15.0, reservedLitres: 0.0, unitPriceLkr: 225, availableDate: 'Yesterday', status: 'expired' },
    ],
    associatedOrders: [],
    auditLogs: [
      { id: 'aud-501', action: 'Self-Registration Received', performedBy: 'System Gateway', reason: 'Account created via PWA mobile registration form. Phone confirmation pending.', timestamp: '2025-01-19 16:40' },
    ],
  },
  {
    id: 'usr-009',
    name: 'Samantha Alwis',
    phone: '+94 71 222 3456',
    email: 'samantha.negombo@yahoo.com',
    role: 'buyer',
    status: 'disabled',
    district: 'Gampaha',
    division: 'Negombo Coastal',
    joinedDate: '2024-08-30',
    verified: false,
    notes: 'Account suspended on admin recommendation: repeated uncollected reservations.',
    metrics: { totalLitres: 40.0, completedOrders: 2, rating: 2.1, fulfilmentRate: 40.0 },
    associatedOrders: [
      { id: 'ord-380', counterpartyName: 'Ruwan Dairy Farm', counterpartyRole: 'farmer', quantityLitres: 25.0, totalPriceLkr: 5250, orderDate: '2024-12-14', status: 'cancelled' },
    ],
    auditLogs: [
      { id: 'aud-901', action: 'Account Suspension', performedBy: 'System Administrator', reason: 'Repeated uncollected milk reservations exceeding 24h expiration threshold without notice.', timestamp: '2024-12-15 10:15', previousStatus: 'active', newStatus: 'disabled' },
    ],
  },
];

export async function fetchAdminDashboardData(_filter: TimeRangeFilter = 'month'): Promise<AdminDashboardData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ADMIN_DASHBOARD_DATA);
    }, 100);
  });
}

export async function fetchAdminUsers(): Promise<AdminUser[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ADMIN_USERS]);
    }, 100);
  });
}

export async function fetchAdminUserById(id: string): Promise<AdminUser | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ADMIN_USERS.find((u) => u.id === id));
    }, 100);
  });
}

export async function updateUserAccountStatus(
  id: string,
  newStatus: UserStatus,
  auditReason: string
): Promise<{ success: boolean; user?: AdminUser }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_ADMIN_USERS.findIndex((u) => u.id === id);
      if (idx !== -1) {
        const prevStatus = MOCK_ADMIN_USERS[idx].status;
        const newLog = {
          id: `aud-${Date.now()}`,
          action: newStatus === 'active' ? 'Account Activation' : 'Account Suspension',
          performedBy: 'System Administrator',
          reason: auditReason,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          previousStatus: prevStatus,
          newStatus: newStatus,
        };

        MOCK_ADMIN_USERS[idx] = {
          ...MOCK_ADMIN_USERS[idx],
          status: newStatus,
          verified: newStatus === 'active' ? true : MOCK_ADMIN_USERS[idx].verified,
          auditLogs: [newLog, ...(MOCK_ADMIN_USERS[idx].auditLogs || [])],
        };
        resolve({ success: true, user: MOCK_ADMIN_USERS[idx] });
      } else {
        resolve({ success: false });
      }
    }, 150);
  });
}

export async function fetchAdminListings(): Promise<AdminMilkListing[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ADMIN_LISTINGS]);
    }, 100);
  });
}

export async function fetchAdminListingById(id: string): Promise<AdminMilkListing | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ADMIN_LISTINGS.find((l) => l.id === id));
    }, 100);
  });
}

export async function disableAdminListing(
  id: string,
  reason: string
): Promise<{ success: boolean; listing?: AdminMilkListing; warning?: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_ADMIN_LISTINGS.findIndex((l) => l.id === id);
      if (idx !== -1) {
        const current = MOCK_ADMIN_LISTINGS[idx];
        const hasActiveReservations = current.reservedLitres > 0;

        const newAuditEntry = {
          id: `ent-${Date.now()}`,
          event: 'Administrative Moderation [D]',
          performedBy: 'System Administrator',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          details: `Listing disabled by policy. Justification: ${reason}`,
          severity: 'critical' as const,
        };

        MOCK_ADMIN_LISTINGS[idx] = {
          ...current,
          status: 'disabled',
          disabledReason: reason,
          moderatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
          moderatedBy: 'System Administrator',
          auditEntries: [newAuditEntry, ...(current.auditEntries || [])],
        };

        resolve({
          success: true,
          listing: MOCK_ADMIN_LISTINGS[idx],
          warning: hasActiveReservations
            ? `Note: Listing had ${current.reservedLitres} L reserved by buyers. Existing reservations remain valid and must be fulfilled or cancelled by the parties.`
            : undefined,
        });
      } else {
        resolve({ success: false });
      }
    }, 150);
  });
}

export async function addListingInvestigationNote(
  id: string,
  findings: string
): Promise<{ success: boolean; listing?: AdminMilkListing }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const idx = MOCK_ADMIN_LISTINGS.findIndex((l) => l.id === id);
      if (idx !== -1) {
        const current = MOCK_ADMIN_LISTINGS[idx];
        const newEntry = {
          id: `ent-inv-${Date.now()}`,
          event: 'Administrative Batch Investigation',
          performedBy: 'System Administrator',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          details: findings,
          severity: 'info' as const,
        };

        MOCK_ADMIN_LISTINGS[idx] = {
          ...current,
          auditEntries: [newEntry, ...(current.auditEntries || [])],
        };

        resolve({ success: true, listing: MOCK_ADMIN_LISTINGS[idx] });
      } else {
        resolve({ success: false });
      }
    }, 150);
  });
}
