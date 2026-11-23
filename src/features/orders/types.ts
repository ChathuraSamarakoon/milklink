export type BuyerOrderStatus =
  | 'pending'
  | 'accepted'
  | 'collected'
  | 'completed'
  | 'declined'
  | 'expired'
  | 'conflict';

export type OrderStatus = BuyerOrderStatus | 'in_transit' | 'cancelled';

export interface BuyerOrder {
  id: string;
  farmerId?: string;
  farmerName: string;
  farmerDistrict?: string;
  farmerVillage?: string;
  quantity: number;
  actualLitres?: number;
  pricePerLitre: number;
  totalAmount: number;
  status: BuyerOrderStatus;
  orderDate: string;
  collectionDate?: string;
  monthKey?: string;
  collectionType: 'collector' | 'self';
  collectorAssigned?: boolean;
  collectorName?: string;
  collectorPhone?: string;
  conflictId?: string;
  declineReason?: string;
  expireReason?: string;
  cashReceiptNumber?: string;
  cashPaymentStatus?: 'recorded_cash' | 'pending_settlement';
}

export interface ReviewOrderDetails {
  farmerId: string;
  farmerName: string;
  farmerDistrict: string;
  farmerVillage: string;
  farmerImage?: string;
  requestedLitres: number;
  collectionDate: string;
  quotedPricePerLitre: number;
  calculatedEstimate: number;
  collectionType: 'collector' | 'self';
  deliveryAddress: string;
  specialInstructions?: string;
  availableStockSnapshot: number;
  quoteValidUntil: string;
  priceLockToken: string;
}

export interface ReservationResult {
  success: boolean;
  orderId?: string;
  reservedLitres?: number;
  errorCode?: 'STALE_AVAILABILITY' | 'PRICE_EXPIRED' | 'OFFLINE' | 'DOUBLE_SUBMIT';
  message: string;
  updatedAvailableStock?: number;
}

export interface BuyerOrderDetail {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerOwner?: string;
  farmerPhone?: string;
  farmerDistrict: string;
  farmerVillage: string;
  exactAddress?: string;
  exactCoordinates?: { lat: number; lng: number };
  approximateLocation?: string;
  quantity: number; // Requested litres
  actualLitres?: number; // Actual litres measured upon collection
  pricePerLitre: number;
  totalAmount: number; // Estimated amount
  finalCashAmount?: number; // Final cash amount calculated from actual litres
  logisticsFee?: number;
  cashRecord?: {
    receiptNumber: string;
    paymentMethod: 'Cash on Handover' | 'Direct Transfer';
    status: 'pending_collection' | 'verified_paid';
    paidAt?: string;
  };
  status: OrderStatus;
  collectionDate: string;
  supplyWindow: string;
  collectionType: 'collector' | 'self';
  deliveryAddress: string;
  collectorAssigned?: boolean;
  collectorName?: string;
  collectorPhone?: string;
  collectorVehicle?: string;
  placedAt: string;
  orderDate?: string;
  qualityTested?: boolean;
  qualityMetrics?: {
    fatPercentage: number;
    snfPercentage: number;
    temperatureC: number;
    grade: string;
  };
}
