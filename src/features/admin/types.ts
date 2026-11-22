export type UserRole = 'farmer' | 'buyer' | 'collector' | 'admin';

export type UserStatus = 'active' | 'disabled' | 'pending';

export type ListingStatus = 'active' | 'expired' | 'disabled' | 'reserved';

export type OrderStatus = 'pending' | 'reserved' | 'accepted' | 'in-transit' | 'completed' | 'cancelled';

export type PaymentRecordStatus = 'recorded' | 'pending' | 'reconciled';

export type TimeRangeFilter = 'today' | 'week' | 'month' | 'quarter' | 'year';

export interface MatchingCriteriaWeights {
  distanceWeight: number; // 35%
  quantityWeight: number; // 30%
  priceWeight: number;    // 20%
  availabilityWeight: number; // 15%
}

export interface SampleMatchQuery {
  requestedLitres: number;
  maxRadiusKm: number;
  collectionDate: string;
  preferredSession: 'morning' | 'evening' | 'any';
}

export interface RankedMatchResult {
  rank: number;
  farmerId: string;
  farmerName: string;
  listingId: string;
  division: string;
  district: string;
  approxDistanceKm: number;
  availableLitres: number;
  unitPriceLkr: number;
  totalScore: number;
  scoreBreakdown: {
    distanceScore: number;
    quantityScore: number;
    priceScore: number;
    availabilityScore: number;
  };
  scoreExplanation: string;
  farmerRating?: number;
  farmerFulfillmentRate?: number;
  estimatedCostLkr?: number;
}

export type SyncOperationStatus = 'conflicted' | 'failed' | 'resolved' | 'pending-retry';

export type SyncConflictType =
  | 'quantity_mismatch'
  | 'replay_sequence'
  | 'status_race'
  | 'version_conflict'
  | 'validation_error';

export interface SyncOperationRecord {
  id: string;
  recordId: string;
  recordType: 'order' | 'listing' | 'payment';
  actorId: string;
  actorName: string;
  actorRole: 'collector' | 'farmer' | 'buyer';
  action: string;
  clientTime: string;
  serverReceivedAt: string;
  status: SyncOperationStatus;
  conflictType?: SyncConflictType;
  serverReason: string;
  clientPayload: {
    deviceId?: string;
    offlineDurationMinutes?: number;
    outboxSequence?: number;
    recordedLitres?: number;
    temperatureCelsius?: number;
    cashAmountLkr?: number;
    attemptCount?: number;
    rawPayloadSnippet?: string;
  };
  serverAuthoritativeState?: {
    currentStatus?: string;
    serverLitres?: number;
    certifiedVariance?: string;
    lastServerUpdate?: string;
  };
  resolutionStatus?: 'unresolved' | 'resolved' | 'overridden';
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNote?: string;
  authorizedOverrideAvailable?: boolean;
}

export interface SyncFilterState {
  role: 'all' | 'collector' | 'farmer' | 'buyer';
  status: 'all' | 'conflicted' | 'failed' | 'resolved';
  conflictType: 'all' | SyncConflictType;
  searchQuery: string;
}

export interface OrderSyncConflict {
  operationId: string;
  clientTime: string;
  serverTime: string;
  conflictType: 'quantity_mismatch' | 'replay_sequence' | 'status_race';
  description: string;
  clientQuantityLitres?: number;
  serverQuantityLitres?: number;
  resolutionStatus: 'unresolved' | 'resolved';
}

export interface OrderLifecycleStep {
  id: string;
  name: string;
  actor: string;
  actorRole: UserRole | 'system';
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending' | 'conflict';
  details: string;
  outboxOperationId?: string;
}

export interface AdminOrderRecord {
  id: string;
  listingId: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerDivision: string;
  farmerDistrict: string;
  collectorId?: string;
  collectorName?: string;
  collectorPhone?: string;
  requestedLitres: number;
  actualLitres?: number;
  unitPriceLkr: number;
  totalPriceLkr: number;
  recalculatedTotalPriceLkr?: number;
  collectionDate: string;
  orderDate: string;
  status: OrderStatus;
  collectionInfo?: {
    measurementMethod: 'Calibrated Dipstick' | 'Milk Meter' | 'Weight Scales';
    milkTemperatureCelsius?: number;
    qualityGrade?: string;
    routeBatchId?: string;
    collectedAtTime?: string;
  };
  paymentRecord: {
    type: 'cash'; // Strictly cash recording as specified by MilkLink proposal
    status: PaymentRecordStatus;
    amountLkr?: number;
    recordedAt?: string;
    recordedBy?: string;
    notes?: string;
  };
  syncConflict?: OrderSyncConflict;
  lifecycleSteps?: OrderLifecycleStep[];
  auditEvents?: Array<{
    id: string;
    action: string;
    actor: string;
    timestamp: string;
    notes: string;
  }>;
}

export interface ListingRelatedOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  requestedLitres: number;
  totalPriceLkr: number;
  status: OrderStatus;
  orderDate: string;
  collectorName?: string;
}

export interface ListingAuditEntry {
  id: string;
  event: string;
  performedBy: string;
  timestamp: string;
  details: string;
  severity?: 'info' | 'warning' | 'critical';
}

export interface AdminMilkListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  district: string;
  division: string;
  totalLitres: number;
  reservedLitres: number;
  availableLitres: number;
  unitPriceLkr: number;
  availableFrom: string;
  availableTo: string;
  status: ListingStatus;
  fatContentPercent?: number;
  milkingSession?: 'morning' | 'evening';
  activeReservationCount: number;
  notes?: string;
  disabledReason?: string;
  moderatedAt?: string;
  moderatedBy?: string;
  relatedOrders?: ListingRelatedOrder[];
  auditEntries?: ListingAuditEntry[];
}

export interface UserAssociatedListing {
  id: string;
  quantityLitres: number;
  reservedLitres: number;
  unitPriceLkr: number;
  availableDate: string;
  status: 'active' | 'expired' | 'completed' | 'draft';
}

export interface UserAssociatedOrder {
  id: string;
  counterpartyName: string;
  counterpartyRole: 'farmer' | 'buyer' | 'collector';
  quantityLitres: number;
  totalPriceLkr: number;
  orderDate: string;
  status: OrderStatus;
  collectorName?: string;
}

export interface UserAuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  reason: string;
  timestamp: string;
  previousStatus?: UserStatus;
  newStatus?: UserStatus;
}

export interface AdminUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  status: UserStatus;
  district: string;
  division?: string;
  joinedDate: string;
  verified: boolean;
  notes?: string;
  metrics?: {
    totalLitres?: number;
    completedOrders?: number;
    rating?: number;
    fulfilmentRate?: number;
  };
  associatedListings?: UserAssociatedListing[];
  associatedOrders?: UserAssociatedOrder[];
  auditLogs?: UserAuditLogEntry[];
}

export interface RoleCounts {
  totalUsers: number;
  farmers: number;
  collectors: number;
  buyers: number;
  newThisMonth: number;
}

export interface ListingStats {
  activeCount: number;
  expiredCount: number;
  draftCount: number;
  totalLitresAvailable: number;
  avgUnitPriceLkr: number;
}

export interface OrderStatusCounts {
  pending: number;
  reserved: number;
  accepted: number;
  inTransit: number;
  completed: number;
  cancelled: number;
}

export type AttentionSeverity = 'critical' | 'warning' | 'info';

export interface AttentionItem {
  id: string;
  title: string;
  description: string;
  severity: AttentionSeverity;
  count?: number;
  category: 'sync' | 'orders' | 'verification' | 'listings';
  actionLabel: string;
  actionRoute: string;
  timestamp: string;
}

export interface CollectionMetric {
  totalLitresThisMonth: number;
  percentChange: number;
  dailyAvgLitres: number;
  collectedBatches: number;
  pendingLitres: number;
  historicalBars: number[];
}

export interface AdminDashboardData {
  roleCounts: RoleCounts;
  collectionMetric: CollectionMetric;
  listingStats: ListingStats;
  orderStats: OrderStatusCounts;
  attentionItems: AttentionItem[];
  regionalSummary: Array<{
    region: string;
    farmerCount: number;
    activeLitres: number;
  }>;
}
