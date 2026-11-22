import type {
  AdminDashboardData,
  AdminUser,
  AdminMilkListing,
  AdminOrderRecord,
  TimeRangeFilter,
  UserStatus,
  MatchingCriteriaWeights,
  SampleMatchQuery,
  RankedMatchResult,
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

export const MOCK_ADMIN_ORDERS: AdminOrderRecord[] = [
  {
    id: 'ord-501',
    listingId: 'lst-101',
    buyerId: 'usr-002',
    buyerName: 'Kavindu Silva',
    buyerPhone: '+94 71 987 6543',
    farmerId: 'usr-001',
    farmerName: 'Nimal Perera',
    farmerPhone: '+94 77 123 4567',
    farmerDivision: 'Thirappane Division',
    farmerDistrict: 'Anuradhapura',
    collectorId: 'usr-003',
    collectorName: 'Sampath Kumara',
    collectorPhone: '+94 76 555 1290',
    requestedLitres: 28.0,
    actualLitres: 28.0,
    unitPriceLkr: 210,
    totalPriceLkr: 5880,
    recalculatedTotalPriceLkr: 5880,
    collectionDate: '2025-01-21',
    orderDate: 'Today, 07:15 AM',
    status: 'accepted',
    collectionInfo: {
      measurementMethod: 'Calibrated Dipstick',
      milkTemperatureCelsius: 4.0,
      qualityGrade: 'Grade A (Fat 4.4%)',
      routeBatchId: 'RT-PLN-08',
      collectedAtTime: 'Today, 07:30 AM',
    },
    paymentRecord: {
      type: 'cash',
      status: 'pending',
      amountLkr: 5880,
      recordedBy: 'Collector Sampath Kumara',
      notes: 'Cash payment due upon physical collection at farm gate.',
    },
    syncConflict: {
      operationId: 'op-sync-501',
      clientTime: '2025-01-21 07:35:10',
      serverTime: '2025-01-21 07:36:00',
      conflictType: 'quantity_mismatch',
      description: 'Collector offline outbox queued 28.0L while farmer local draft indicated 27.5L. Replay paused for verification.',
      clientQuantityLitres: 28.0,
      serverQuantityLitres: 27.5,
      resolutionStatus: 'unresolved',
    },
    lifecycleSteps: [
      {
        id: 'step-1',
        name: 'Order Reservation Placed',
        actor: 'Kavindu Silva',
        actorRole: 'buyer',
        timestamp: '2025-01-21 07:15:10',
        status: 'completed',
        details: 'Buyer reserved 28.0L from Listing #lst-101. Atomic reservation locked.',
      },
      {
        id: 'step-2',
        name: 'Farmer Accepted Order',
        actor: 'Nimal Perera',
        actorRole: 'farmer',
        timestamp: '2025-01-21 07:18:22',
        status: 'completed',
        details: 'Farmer confirmed morning delivery readiness via PWA outbox.',
        outboxOperationId: 'outbox-f-9912',
      },
      {
        id: 'step-3',
        name: 'Collector Route Dispatched',
        actor: 'Sampath Kumara',
        actorRole: 'collector',
        timestamp: '2025-01-21 07:22:00',
        status: 'completed',
        details: 'Assigned to North Central Tanker Route RT-PLN-08.',
      },
      {
        id: 'step-4',
        name: 'Actual Milk Weighing & Inspection',
        actor: 'Sampath Kumara',
        actorRole: 'collector',
        timestamp: '2025-01-21 07:30:00',
        status: 'in-progress',
        details: 'Measured 28.0 L at 4.0°C. Quality Grade A confirmed with farmer.',
      },
      {
        id: 'step-5',
        name: 'Cash Handover Record',
        actor: 'Sampath Kumara → Nimal Perera',
        actorRole: 'collector',
        timestamp: 'Pending Handover',
        status: 'pending',
        details: 'Direct cash handover of Rs. 5,880 upon completion receipt.',
      },
    ],
    auditEvents: [
      { id: 'evt-501-1', action: 'Order Placed', actor: 'Kavindu Silva (Buyer)', timestamp: '2025-01-21 07:15:10', notes: 'Reserved 28.0L from Listing #lst-101.' },
      { id: 'evt-501-2', action: 'Order Accepted', actor: 'Nimal Perera (Farmer)', timestamp: '2025-01-21 07:18:22', notes: 'Farmer confirmed morning delivery readiness.' },
      { id: 'evt-501-3', action: 'Collector Assigned', actor: 'Kavindu Silva (Buyer)', timestamp: '2025-01-21 07:22:00', notes: 'Sampath Kumara accepted route pickup.' },
    ],
  },
  {
    id: 'ord-502',
    listingId: 'lst-102',
    buyerId: 'usr-006',
    buyerName: 'Kasun Rajapaksha',
    buyerPhone: '+94 70 888 2311',
    farmerId: 'usr-008',
    farmerName: 'Ruwan Dairy Farm',
    farmerPhone: '+94 77 555 7712',
    farmerDivision: 'Nochchiyagama Area',
    farmerDistrict: 'Anuradhapura',
    collectorId: 'usr-003',
    collectorName: 'Sampath Kumara',
    collectorPhone: '+94 76 555 1290',
    requestedLitres: 32.5,
    actualLitres: 32.5,
    unitPriceLkr: 215,
    totalPriceLkr: 6987.5,
    recalculatedTotalPriceLkr: 6987.5,
    collectionDate: '2025-01-21',
    orderDate: 'Today, 07:45 AM',
    status: 'in-transit',
    collectionInfo: {
      measurementMethod: 'Calibrated Dipstick',
      milkTemperatureCelsius: 4.2,
      qualityGrade: 'Grade A (Fat 4.2%)',
      routeBatchId: 'RT-PLN-08',
      collectedAtTime: 'Today, 08:15 AM',
    },
    paymentRecord: {
      type: 'cash',
      status: 'recorded',
      amountLkr: 6987.5,
      recordedAt: '2025-01-21 08:15',
      recordedBy: 'Collector Sampath Kumara',
      notes: 'Full cash payment handed over to Ruwan Dairy Farm at farm gate.',
    },
    lifecycleSteps: [
      {
        id: 'step-502-1',
        name: 'Order Reservation Placed',
        actor: 'Kasun Rajapaksha',
        actorRole: 'buyer',
        timestamp: '2025-01-21 07:45:00',
        status: 'completed',
        details: 'Buyer reserved entire 32.5 L batch.',
      },
      {
        id: 'step-502-2',
        name: 'Farmer Accepted Order',
        actor: 'Ruwan Dairy Farm',
        actorRole: 'farmer',
        timestamp: '2025-01-21 07:50:00',
        status: 'completed',
        details: 'Farmer approved collection window.',
      },
      {
        id: 'step-502-3',
        name: 'Actual Collection & Weighing',
        actor: 'Sampath Kumara',
        actorRole: 'collector',
        timestamp: '2025-01-21 08:15:00',
        status: 'completed',
        details: '32.5 L loaded into tanker truck.',
      },
      {
        id: 'step-502-4',
        name: 'Cash Handover Recorded',
        actor: 'Sampath Kumara',
        actorRole: 'collector',
        timestamp: '2025-01-21 08:15:20',
        status: 'completed',
        details: 'Paid Rs. 6,987.50 cash in full. Digital receipt saved in outbox.',
      },
      {
        id: 'step-502-5',
        name: 'Transport Delivery to Buyer',
        actor: 'Sampath Kumara',
        actorRole: 'collector',
        timestamp: 'En route',
        status: 'in-progress',
        details: 'Tanker in-transit to buyer curd processing facility in Gampaha.',
      },
    ],
    auditEvents: [
      { id: 'evt-502-1', action: 'Actual Litres Weighed', actor: 'Sampath Kumara (Collector)', timestamp: '2025-01-21 08:15:00', notes: 'Calibrated dipstick confirmed 32.5 L. Cash paid in full at farm gate.' },
    ],
  },
  {
    id: 'ord-503',
    listingId: 'lst-103',
    buyerId: 'usr-002',
    buyerName: 'Local Dairy Co-op',
    buyerPhone: '+94 71 987 6543',
    farmerId: 'usr-004',
    farmerName: 'Priyantha Dissanayake',
    farmerPhone: '+94 77 444 8821',
    farmerDivision: 'Kuliyapitiya East',
    farmerDistrict: 'Kurunegala',
    requestedLitres: 28.0,
    unitPriceLkr: 220,
    totalPriceLkr: 6160,
    collectionDate: '2025-01-22',
    orderDate: 'Today, 08:00 AM',
    status: 'pending',
    paymentRecord: {
      type: 'cash',
      status: 'pending',
      amountLkr: 6160,
    },
    lifecycleSteps: [
      {
        id: 'step-503-1',
        name: 'Order Placed',
        actor: 'Local Dairy Co-op',
        actorRole: 'buyer',
        timestamp: 'Today, 08:00 AM',
        status: 'completed',
        details: '28.0 L advance order submitted.',
      },
      {
        id: 'step-503-2',
        name: 'Farmer Acceptance Pending',
        actor: 'Priyantha Dissanayake',
        actorRole: 'farmer',
        timestamp: 'Awaiting',
        status: 'in-progress',
        details: 'Awaiting farmer response.',
      },
    ],
    auditEvents: [
      { id: 'evt-503-1', action: 'Order Created', actor: 'Buyer Co-op', timestamp: 'Today, 08:00', notes: 'Awaiting farmer acceptance. Collector not yet assigned.' },
    ],
  },
  {
    id: 'ord-492',
    listingId: 'lst-106',
    buyerId: 'usr-006',
    buyerName: 'Kasun Rajapaksha',
    buyerPhone: '+94 70 888 2311',
    farmerId: 'usr-001',
    farmerName: 'Nimal Perera',
    farmerPhone: '+94 77 123 4567',
    farmerDivision: 'Thirappane Division',
    farmerDistrict: 'Anuradhapura',
    collectorId: 'usr-003',
    collectorName: 'Sampath Kumara',
    collectorPhone: '+94 76 555 1290',
    requestedLitres: 40.0,
    actualLitres: 40.0,
    unitPriceLkr: 205,
    totalPriceLkr: 8200,
    recalculatedTotalPriceLkr: 8200,
    collectionDate: '2025-01-20',
    orderDate: 'Yesterday, 07:00 AM',
    status: 'completed',
    paymentRecord: {
      type: 'cash',
      status: 'reconciled',
      amountLkr: 8200,
      recordedAt: '2025-01-20 07:40',
      recordedBy: 'Collector Sampath Kumara',
      notes: 'Cash fully settled and verified by farmer Nimal Perera.',
    },
    lifecycleSteps: [
      {
        id: 'step-492-1',
        name: 'Order Placed & Accepted',
        actor: 'Kasun & Nimal',
        actorRole: 'buyer',
        timestamp: '2025-01-20 07:00:00',
        status: 'completed',
        details: 'Order processed atomically.',
      },
      {
        id: 'step-492-2',
        name: 'Collection & Cash Handover',
        actor: 'Sampath Kumara',
        actorRole: 'collector',
        timestamp: '2025-01-20 07:40:00',
        status: 'completed',
        details: '40.0 L collected, Rs. 8,200 cash handed over.',
      },
      {
        id: 'step-492-3',
        name: 'Delivery Completed',
        actor: 'Kasun Rajapaksha',
        actorRole: 'buyer',
        timestamp: '2025-01-20 09:15:00',
        status: 'completed',
        details: 'Milk received and reconciled.',
      },
    ],
    auditEvents: [
      { id: 'evt-492-1', action: 'Collection Completed', actor: 'Sampath Kumara', timestamp: '2025-01-20 07:40:00', notes: '40.0 L received. Handover cash verified.' },
    ],
  },
  {
    id: 'ord-477',
    listingId: 'lst-101',
    buyerId: 'usr-002',
    buyerName: 'Dairy Co-op Hub',
    buyerPhone: '+94 71 987 6543',
    farmerId: 'usr-001',
    farmerName: 'Nimal Perera',
    farmerPhone: '+94 77 123 4567',
    farmerDivision: 'Thirappane Division',
    farmerDistrict: 'Anuradhapura',
    collectorId: 'usr-003',
    collectorName: 'Sampath Kumara',
    requestedLitres: 38.0,
    actualLitres: 38.0,
    unitPriceLkr: 205,
    totalPriceLkr: 7790,
    recalculatedTotalPriceLkr: 7790,
    collectionDate: '2025-01-19',
    orderDate: '2025-01-19, 07:35 AM',
    status: 'completed',
    paymentRecord: {
      type: 'cash',
      status: 'reconciled',
      amountLkr: 7790,
      recordedAt: '2025-01-19 08:00',
      recordedBy: 'Collector Sampath Kumara',
    },
  },
  {
    id: 'ord-380',
    listingId: 'lst-102',
    buyerId: 'usr-009',
    buyerName: 'Samantha Alwis',
    buyerPhone: '+94 71 222 3456',
    farmerId: 'usr-008',
    farmerName: 'Ruwan Dairy Farm',
    farmerPhone: '+94 77 555 7712',
    farmerDivision: 'Nochchiyagama Area',
    farmerDistrict: 'Anuradhapura',
    requestedLitres: 25.0,
    unitPriceLkr: 210,
    totalPriceLkr: 5250,
    collectionDate: '2024-12-14',
    orderDate: '2024-12-14',
    status: 'cancelled',
    paymentRecord: {
      type: 'cash',
      status: 'pending',
    },
    auditEvents: [
      { id: 'evt-380-1', action: 'Reservation Cancelled', actor: 'System Timeout Engine', timestamp: '2024-12-15 00:00:00', notes: 'Buyer unreached for 24 hours. Stock reservation released.' },
    ],
  },
];

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

export async function fetchAdminOrders(): Promise<AdminOrderRecord[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_ADMIN_ORDERS]);
    }, 100);
  });
}

export async function fetchAdminOrderById(id: string): Promise<AdminOrderRecord | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ADMIN_ORDERS.find((o) => o.id === id));
    }, 100);
  });
}
