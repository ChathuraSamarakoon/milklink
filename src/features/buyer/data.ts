export interface FarmerListingSummary {
  id: string;
  name: string;
  distance: string;
  tag: string;
  rating: number;
  reviewsCount: number;
  image: string;
  location: string;
  availableLitres: number;
  pricePerLitre: number;
  productType: 'Raw Milk' | 'Dairy Products' | 'Yogurt' | 'Butter';
  organic?: boolean;
}

import type { BuyerOrder, BuyerOrderStatus } from '../orders/types';

export type { BuyerOrder, BuyerOrderStatus };

export interface MilkCollector {
  id: string;
  name: string;
  phone: string;
  rating: number;
  tripsCount: number;
  vehicleType: string;
  currentZone: string;
  etaMinutes: number;
  chilledTank: boolean;
}

export const AVAILABLE_COLLECTORS: MilkCollector[] = [
  {
    id: 'col-1',
    name: 'Sampath Fernando',
    phone: '077 323 4567',
    rating: 4.9,
    tripsCount: 142,
    vehicleType: 'Chilled Milk Van (500L Tank)',
    currentZone: 'Kundasale / Digana',
    etaMinutes: 20,
    chilledTank: true,
  },
  {
    id: 'col-2',
    name: 'Kamal Bandara',
    phone: '071 890 1234',
    rating: 4.8,
    tripsCount: 98,
    vehicleType: 'Insulated Three-Wheeler (180L)',
    currentZone: 'Peradeniya / Galaha',
    etaMinutes: 35,
    chilledTank: true,
  },
  {
    id: 'col-3',
    name: 'Ruwan Wijesinghe',
    phone: '076 543 2198',
    rating: 4.7,
    tripsCount: 76,
    vehicleType: 'Refrigerated Light Truck (1200L)',
    currentZone: 'Katugastota / Polgolla',
    etaMinutes: 45,
    chilledTank: true,
  },
];

export const DEMO_NEARBY_FARMERS: FarmerListingSummary[] = [
  {
    id: 'farm-1',
    name: 'Green Valley Farm',
    distance: '2.4 km away',
    tag: 'Fresh Milk • Daily Supply',
    rating: 4.8,
    reviewsCount: 34,
    image: '/images/farm-green-valley.jpg',
    location: 'Kundasale, Kandy',
    availableLitres: 120,
    pricePerLitre: 195,
    productType: 'Raw Milk',
  },
  {
    id: 'farm-2',
    name: 'Ruwan Dairy Farm',
    distance: '3.1 km away',
    tag: 'Fresh Milk • Organic',
    rating: 4.6,
    reviewsCount: 28,
    image: '/images/farm-ruwan.jpg',
    location: 'Peradeniya, Kandy',
    availableLitres: 85,
    pricePerLitre: 210,
    productType: 'Raw Milk',
    organic: true,
  },
  {
    id: 'farm-3',
    name: 'Hillside Farm',
    distance: '4.7 km away',
    tag: 'Fresh Milk • High Quality',
    rating: 4.7,
    reviewsCount: 42,
    image: '/images/farm-hillside.jpg',
    location: 'Gampola Valley',
    availableLitres: 150,
    pricePerLitre: 190,
    productType: 'Raw Milk',
  },
];

export const DEMO_BUYER_ORDERS: BuyerOrder[] = [
  {
    id: 'ORD-2048',
    farmerId: 'farm-1',
    farmerName: 'Green Valley Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Kundasale',
    quantity: 50,
    pricePerLitre: 195,
    totalAmount: 9750,
    status: 'pending',
    orderDate: 'Today, 08:30 AM',
    collectionDate: 'Today',
    collectionType: 'collector',
    collectorAssigned: false, // Needs collector assignment marker!
  },
  {
    id: 'ORD-2042',
    farmerId: 'farm-2',
    farmerName: 'Ruwan Dairy Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Peradeniya',
    quantity: 35,
    pricePerLitre: 210,
    totalAmount: 7350,
    status: 'accepted',
    orderDate: 'Today, 07:15 AM',
    collectionDate: 'Today',
    collectionType: 'collector',
    collectorAssigned: false, // Pending collector assignment marker!
  },
  {
    id: 'ORD-2035',
    farmerId: 'farm-2',
    farmerName: 'Ruwan Dairy Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Peradeniya',
    quantity: 40,
    pricePerLitre: 210,
    totalAmount: 8400,
    status: 'accepted',
    orderDate: 'Yesterday, 04:15 PM',
    collectionDate: 'Today',
    collectionType: 'self',
    collectorAssigned: false,
  },
  {
    id: 'ORD-2029',
    farmerId: 'farm-3',
    farmerName: 'Hillside Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Gampola Valley',
    quantity: 60,
    pricePerLitre: 190,
    totalAmount: 11400,
    status: 'collected',
    orderDate: 'Yesterday, 09:00 AM',
    collectionDate: 'Yesterday',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Sampath Fernando',
    collectorPhone: '077 323 4567',
  },
  {
    id: 'ORD-1992',
    farmerId: 'farm-3',
    farmerName: 'Hillside Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Gampola Valley',
    quantity: 80,
    actualLitres: 78.5,
    pricePerLitre: 190,
    totalAmount: 14915,
    status: 'completed',
    orderDate: '21 Nov 2026',
    collectionDate: '21 Nov 2026',
    monthKey: '2026-11',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Sampath Fernando',
    collectorPhone: '077 323 4567',
    cashReceiptNumber: 'CASH-REC-1992',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1988',
    farmerId: 'farm-1',
    farmerName: 'Green Valley Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Kundasale',
    quantity: 50,
    actualLitres: 50.0,
    pricePerLitre: 195,
    totalAmount: 9750,
    status: 'completed',
    orderDate: '16 Nov 2026',
    collectionDate: '16 Nov 2026',
    monthKey: '2026-11',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Sampath Fernando',
    collectorPhone: '077 323 4567',
    cashReceiptNumber: 'CASH-REC-1988',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1982',
    farmerId: 'farm-2',
    farmerName: 'Ruwan Dairy Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Peradeniya',
    quantity: 40,
    actualLitres: 39.0,
    pricePerLitre: 210,
    totalAmount: 8190,
    status: 'completed',
    orderDate: '12 Nov 2026',
    collectionDate: '12 Nov 2026',
    monthKey: '2026-11',
    collectionType: 'self',
    collectorAssigned: false,
    cashReceiptNumber: 'CASH-REC-1982',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1890',
    farmerId: 'farm-3',
    farmerName: 'Hillside Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Gampola Valley',
    quantity: 120,
    actualLitres: 118.0,
    pricePerLitre: 190,
    totalAmount: 22420,
    status: 'completed',
    orderDate: '28 Oct 2026',
    collectionDate: '28 Oct 2026',
    monthKey: '2026-10',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Sampath Fernando',
    collectorPhone: '077 323 4567',
    cashReceiptNumber: 'CASH-REC-1890',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1855',
    farmerId: 'farm-1',
    farmerName: 'Green Valley Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Kundasale',
    quantity: 90,
    actualLitres: 90.0,
    pricePerLitre: 195,
    totalAmount: 17550,
    status: 'completed',
    orderDate: '18 Oct 2026',
    collectionDate: '18 Oct 2026',
    monthKey: '2026-10',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Kamal Bandara',
    collectorPhone: '071 890 1234',
    cashReceiptNumber: 'CASH-REC-1855',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1820',
    farmerId: 'farm-2',
    farmerName: 'Ruwan Dairy Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Peradeniya',
    quantity: 65,
    actualLitres: 64.5,
    pricePerLitre: 200,
    totalAmount: 12900,
    status: 'completed',
    orderDate: '06 Oct 2026',
    collectionDate: '06 Oct 2026',
    monthKey: '2026-10',
    collectionType: 'self',
    collectorAssigned: false,
    cashReceiptNumber: 'CASH-REC-1820',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1750',
    farmerId: 'farm-3',
    farmerName: 'Hillside Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Gampola Valley',
    quantity: 100,
    actualLitres: 98.0,
    pricePerLitre: 185,
    totalAmount: 18130,
    status: 'completed',
    orderDate: '24 Sep 2026',
    collectionDate: '24 Sep 2026',
    monthKey: '2026-09',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Sampath Fernando',
    collectorPhone: '077 323 4567',
    cashReceiptNumber: 'CASH-REC-1750',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1712',
    farmerId: 'farm-1',
    farmerName: 'Green Valley Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Kundasale',
    quantity: 85,
    actualLitres: 85.0,
    pricePerLitre: 185,
    totalAmount: 15725,
    status: 'completed',
    orderDate: '10 Sep 2026',
    collectionDate: '10 Sep 2026',
    monthKey: '2026-09',
    collectionType: 'collector',
    collectorAssigned: true,
    collectorName: 'Kamal Bandara',
    collectorPhone: '071 890 1234',
    cashReceiptNumber: 'CASH-REC-1712',
    cashPaymentStatus: 'recorded_cash',
  },
  {
    id: 'ORD-1980',
    farmerId: 'farm-1',
    farmerName: 'Green Valley Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Kundasale',
    quantity: 100,
    pricePerLitre: 195,
    totalAmount: 19500,
    status: 'declined',
    orderDate: '20 Nov 2026',
    collectionDate: '20 Nov 2026',
    collectionType: 'collector',
    collectorAssigned: false,
    declineReason: 'Farm capacity reached for morning collection window.',
  },
  {
    id: 'ORD-1974',
    farmerId: 'farm-2',
    farmerName: 'Ruwan Dairy Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Peradeniya',
    quantity: 45,
    pricePerLitre: 210,
    totalAmount: 9450,
    status: 'expired',
    orderDate: '19 Nov 2026',
    collectionDate: '19 Nov 2026',
    collectionType: 'self',
    collectorAssigned: false,
    expireReason: '15-minute reservation window expired without confirmation.',
  },
  {
    id: 'ORD-1965',
    farmerId: 'farm-3',
    farmerName: 'Hillside Farm',
    farmerDistrict: 'Kandy',
    farmerVillage: 'Gampola Valley',
    quantity: 75,
    pricePerLitre: 190,
    totalAmount: 14250,
    status: 'conflict',
    orderDate: '18 Nov 2026',
    collectionDate: '18 Nov 2026',
    collectionType: 'collector',
    collectorAssigned: false,
    conflictId: 'sync-01',
  },
];

export const BUYER_CATEGORIES = [
  { id: 'raw-milk', label: 'Raw Milk', icon: 'bottle', desc: 'Fresh farm milk' },
  { id: 'dairy-products', label: 'Dairy Products', icon: 'cheese', desc: 'Curd, paneer, ghee' },
  { id: 'yogurt', label: 'Yogurt', icon: 'cup', desc: 'Set & sweet yogurt' },
  { id: 'butter', label: 'Butter', icon: 'butter', desc: 'Pure dairy butter' },
] as const;

const STORAGE_FAVORITES = 'milklink_buyer_favorites_v1';
const STORAGE_ORDERS = 'milklink_buyer_orders_v1';

export function getBuyerFavorites(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_FAVORITES);
    return data ? JSON.parse(data) : ['farm-1', 'farm-3'];
  } catch {
    return ['farm-1', 'farm-3'];
  }
}

export function toggleBuyerFavorite(farmId: string): string[] {
  const current = getBuyerFavorites();
  const next = current.includes(farmId) ? current.filter((id) => id !== farmId) : [...current, farmId];
  try {
    localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(next));
  } catch (e) {
    console.warn('Unable to persist favorites to localStorage', e);
  }
  return next;
}

export function getBuyerOrders(): BuyerOrder[] {
  try {
    const data = localStorage.getItem(STORAGE_ORDERS);
    return data ? JSON.parse(data) : DEMO_BUYER_ORDERS;
  } catch {
    return DEMO_BUYER_ORDERS;
  }
}

export function createBuyerOrder(order: Omit<BuyerOrder, 'id' | 'orderDate'>): BuyerOrder {
  const current = getBuyerOrders();
  const newOrder: BuyerOrder = {
    ...order,
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    orderDate: 'Just now',
  };
  const updated = [newOrder, ...current];
  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Unable to persist orders to localStorage', e);
  }
  return newOrder;
}

export function assignCollectorToOrder(
  orderId: string,
  collector: { name: string; phone: string; vehicle?: string }
): BuyerOrder[] {
  const current = getBuyerOrders();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        collectionType: 'collector' as const,
        collectorAssigned: true,
        collectorName: collector.name,
        collectorPhone: collector.phone,
      };
    }
    return ord;
  });
  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Unable to persist assigned collector', e);
  }
  return updated;
}

export function setOrderSelfPickup(orderId: string): BuyerOrder[] {
  const current = getBuyerOrders();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        collectionType: 'self' as const,
        collectorAssigned: false,
        collectorName: undefined,
        collectorPhone: undefined,
      };
    }
    return ord;
  });
  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Unable to persist self pickup', e);
  }
  return updated;
}

export function updateBuyerOrderStatus(
  orderId: string,
  status: BuyerOrderStatus
): BuyerOrder[] {
  const current = getBuyerOrders();
  const updated = current.map((ord) => (ord.id === orderId ? { ...ord, status } : ord));
  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Unable to persist order status', e);
  }
  return updated;
}

export function recordOrderSelfCollection(
  orderId: string,
  actualLitres: number,
  notes?: string
): BuyerOrder[] {
  const current = getBuyerOrders();
  const updated = current.map((ord) => {
    if (ord.id === orderId) {
      return {
        ...ord,
        status: 'collected' as const,
        collectionType: 'self' as const,
        totalAmount: Math.round(actualLitres * ord.pricePerLitre),
        declineReason: notes ? `Self-pickup note: ${notes}` : undefined,
      };
    }
    return ord;
  });
  try {
    localStorage.setItem(STORAGE_ORDERS, JSON.stringify(updated));
  } catch (e) {
    console.warn('Unable to persist self collection', e);
  }
  return updated;
}
