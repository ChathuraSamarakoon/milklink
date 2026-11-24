import { ALL_DEMO_FARMERS } from './searchApi';
import { getBuyerOrders, createBuyerOrder } from '../features/buyer/data';
import type { ReviewOrderDetails, ReservationResult, BuyerOrderDetail } from '../features/orders/types';

// In-flight and processed idempotency tokens to prevent double submission
const processedIdempotencyTokens = new Set<string>();
const inFlightTokens = new Set<string>();

/**
 * Places order online with ATOMIC reservation logic.
 * Feature 03: The server must atomically reserve litres, reject stale availability and prevent double submit.
 * Do not assume success before response.
 */
export async function placeOrderAtomicallyApi(
  details: ReviewOrderDetails,
  idempotencyKey: string
): Promise<ReservationResult> {
  // Prevent double submit in-flight
  if (inFlightTokens.has(idempotencyKey)) {
    return {
      success: false,
      errorCode: 'DOUBLE_SUBMIT',
      message: 'Order submission is already in progress. Please wait for the server confirmation.',
    };
  }

  if (processedIdempotencyTokens.has(idempotencyKey)) {
    return {
      success: false,
      errorCode: 'DOUBLE_SUBMIT',
      message: 'This order has already been placed. Please view it in your Orders tab.',
    };
  }

  inFlightTokens.add(idempotencyKey);

  // Simulate network delay
  await new Promise((res) => setTimeout(res, 450));

  try {
    // Find farmer listing
    const farmer = ALL_DEMO_FARMERS.find(
      (f) => f.farmerId === details.farmerId || f.id === details.farmerId
    );

    if (!farmer) {
      return {
        success: false,
        errorCode: 'STALE_AVAILABILITY',
        message: 'The selected farm listing is no longer active or available.',
      };
    }

    // Atomic stock check: reject stale availability if requested litres exceed available stock
    if (farmer.availableLitres < details.requestedLitres) {
      return {
        success: false,
        errorCode: 'STALE_AVAILABILITY',
        message: `Available stock has changed. Only ${farmer.availableLitres}L remains available from this farmer.`,
        updatedAvailableStock: farmer.availableLitres,
      };
    }

    // Atomic reservation: subtract from available and lock in reserved
    farmer.availableLitres -= details.requestedLitres;
    farmer.reservedLitres += details.requestedLitres;

    // Record order in buyer storage
    const newOrder = createBuyerOrder({
      farmerName: details.farmerName,
      quantity: details.requestedLitres,
      pricePerLitre: details.quotedPricePerLitre,
      totalAmount: details.calculatedEstimate,
      status: 'pending',
      collectionType: details.collectionType,
    });

    processedIdempotencyTokens.add(idempotencyKey);

    return {
      success: true,
      orderId: newOrder.id,
      reservedLitres: details.requestedLitres,
      message: 'Quantity atomically reserved on server. Order request dispatched to farmer.',
      updatedAvailableStock: farmer.availableLitres,
    };
  } finally {
    inFlightTokens.delete(idempotencyKey);
  }
}

/**
 * Fetches order details by orderId
 */
export async function getBuyerOrderByIdApi(orderId: string): Promise<BuyerOrderDetail | null> {
  await new Promise((res) => setTimeout(res, 120));
  const orders = getBuyerOrders();
  const found = orders.find((o) => o.id === orderId);

  // Match farmer from ALL_DEMO_FARMERS
  const targetName = found ? found.farmerName : 'Green Valley Farm';
  const farmer =
    ALL_DEMO_FARMERS.find((f) => f.farmName === targetName || f.farmerId === found?.farmerId) ||
    ALL_DEMO_FARMERS[0];

  const requestedQty = found ? found.quantity : 30;
  const unitPrice = found ? found.pricePerLitre : farmer.pricePerLitre;
  const orderStatus = found ? found.status : 'pending';

  // For collected or completed, actual litres measured at collection
  const hasActual = orderStatus === 'collected' || orderStatus === 'completed';
  const actualQty = hasActual ? Number((requestedQty - 1.5).toFixed(1)) : undefined;
  const finalCash = actualQty ? Math.round(actualQty * unitPrice) : requestedQty * unitPrice;

  return {
    id: found ? found.id : orderId,
    farmerId: farmer.farmerId,
    farmerName: farmer.farmName,
    farmerOwner: farmer.ownerName,
    farmerPhone: farmer.phone || '077 123 4567',
    farmerDistrict: farmer.district,
    farmerVillage: farmer.village,
    // Precise location: exact address and GPS coordinates
    exactAddress: `No. ${Math.floor(20 + Math.random() * 80)}, Farm Valley Road, ${farmer.village}, ${farmer.district}`,
    exactCoordinates: farmer.coordinates,
    approximateLocation: `${farmer.village}, ${farmer.district} (~${farmer.distanceKm.toFixed(1)} km away)`,
    quantity: requestedQty,
    actualLitres: actualQty,
    pricePerLitre: unitPrice,
    totalAmount: requestedQty * unitPrice,
    finalCashAmount: finalCash,
    logisticsFee: found?.collectionType === 'collector' ? 0 : 0, // Zero fee cooperative model
    cashRecord: {
      receiptNumber: `CASH-${orderId.replace(/[^0-9]/g, '') || '2048'}`,
      paymentMethod: 'Cash on Handover',
      status: orderStatus === 'completed' ? 'verified_paid' : 'pending_collection',
      paidAt: orderStatus === 'completed' ? 'Yesterday, 09:15 AM' : undefined,
    },
    status: orderStatus,
    collectionDate: found?.collectionDate || 'Today',
    supplyWindow: farmer.supplyWindow,
    collectionType: found?.collectionType || 'collector',
    deliveryAddress: 'No. 45, Peradeniya Road, Kandy',
    collectorAssigned: found?.collectorAssigned ?? (orderStatus === 'collected' || orderStatus === 'completed'),
    collectorName: found?.collectorName || (orderStatus === 'collected' || orderStatus === 'completed' ? 'Sampath Fernando' : undefined),
    collectorPhone: found?.collectorPhone || (orderStatus === 'collected' || orderStatus === 'completed' ? '077 323 4567' : undefined),
    collectorVehicle: 'Chilled Milk Van (500L Tank)',
    placedAt: found?.orderDate || 'Today, 08:30 AM',
    qualityTested: orderStatus === 'collected' || orderStatus === 'completed',
    qualityMetrics: {
      fatPercentage: 4.2,
      snfPercentage: 8.6,
      temperatureC: 4.1,
      grade: 'Grade A Premium',
    },
  };
}
