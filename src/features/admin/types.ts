export type UserRole = 'farmer' | 'buyer' | 'collector' | 'admin';

export type UserStatus = 'active' | 'disabled' | 'pending';

export type ListingStatus = 'active' | 'expired' | 'disabled' | 'reserved';

export type TimeRangeFilter = 'today' | 'week' | 'month' | 'quarter' | 'year';

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
  availableTo: string; // Expiry
  status: ListingStatus;
  fatContentPercent?: number;
  milkingSession?: 'morning' | 'evening';
  activeReservationCount: number;
  notes?: string;
  disabledReason?: string;
  moderatedAt?: string;
  moderatedBy?: string;
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
  status: 'pending' | 'accepted' | 'in-transit' | 'completed' | 'cancelled';
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
