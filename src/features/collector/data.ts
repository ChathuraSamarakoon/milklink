import type { MockAccount } from '../auth/components/mockAuth';

export type CollectorPickupStatus = 'pending' | 'completed';

export type CollectorPickup = {
  id: string;
  farmer: string;
  buyer: string;
  district: string;
  area: string;
  phone: string;
  scheduledTime: string;
  collectionDate: string;
  requestedQuantity: number;
  actualQuantity?: number;
  ratePerLitre: number;
  status: CollectorPickupStatus;
  image: string;
  notes?: string;
};

function key(account: MockAccount, section: string) {
  return `milklink-collector-${section}-${account.id}`;
}

function read<T>(storageKey: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(storageKey: string, value: T) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore storage limitations in the prototype.
  }
}

export function getCollectorPickups(account: MockAccount): CollectorPickup[] {
  return read(key(account, 'pickups'), [
    {
      id: 'COL-2101',
      farmer: 'Green Valley Farm',
      buyer: 'Fresh Milk Foods Pvt Ltd',
      district: 'Kandy',
      area: 'Peradeniya',
      phone: '+94 77 123 4567',
      scheduledTime: '07:30 AM',
      collectionDate: '2025-01-21',
      requestedQuantity: 28,
      actualQuantity: 28,
      ratePerLitre: 190,
      status: 'completed',
      image: '/images/collector-dashboard-hero.webp',
      notes: 'Morning pickup completed smoothly.',
    },
    {
      id: 'COL-2102',
      farmer: 'Ruwan Dairy Farm',
      buyer: 'Milky Way Traders',
      district: 'Matale',
      area: 'Ukuwela',
      phone: '+94 77 456 1122',
      scheduledTime: '08:15 AM',
      collectionDate: '2025-01-21',
      requestedQuantity: 32.5,
      actualQuantity: 32.5,
      ratePerLitre: 190,
      status: 'completed',
      image: '/images/collector-assigned-pickups.webp',
      notes: 'Collected and marked complete.',
    },
    {
      id: 'COL-2103',
      farmer: 'Hillside Farm',
      buyer: 'Fresh Milk Foods Pvt Ltd',
      district: 'Kegalle',
      area: 'Warakapola',
      phone: '+94 77 777 3344',
      scheduledTime: '09:00 AM',
      collectionDate: '2025-01-21',
      requestedQuantity: 30,
      ratePerLitre: 190,
      status: 'pending',
      image: '/images/collector-pickup-details.webp',
      notes: 'Farmer requested slight quantity adjustment if needed.',
    },
    {
      id: 'COL-2104',
      farmer: 'Sunrise Dairy',
      buyer: 'Lanka Dairy House',
      district: 'Nuwara Eliya',
      area: 'Talawakele',
      phone: '+94 77 998 1023',
      scheduledTime: '09:45 AM',
      collectionDate: '2025-01-21',
      requestedQuantity: 25,
      ratePerLitre: 190,
      status: 'pending',
      image: '/images/collector-record-collection.webp',
      notes: 'Check milk cans before loading.',
    },
    {
      id: 'COL-2105',
      farmer: 'Lakeside Farm',
      buyer: 'Ceylon Dairy Point',
      district: 'Kurunegala',
      area: 'Mawathagama',
      phone: '+94 77 555 8899',
      scheduledTime: '10:30 AM',
      collectionDate: '2025-01-21',
      requestedQuantity: 40,
      ratePerLitre: 190,
      status: 'pending',
      image: '/images/collector-history.webp',
      notes: 'Final pickup for the morning route.',
    },
  ] satisfies CollectorPickup[]);
}

export function saveCollectorPickups(account: MockAccount, pickups: CollectorPickup[]) {
  write(key(account, 'pickups'), pickups);
}

export function completeCollectorPickup(
  account: MockAccount,
  pickupId: string,
  actualQuantity: number,
  notes: string,
) {
  const next = getCollectorPickups(account).map((pickup) =>
    pickup.id === pickupId
      ? { ...pickup, status: 'completed' as const, actualQuantity, notes }
      : pickup,
  );
  saveCollectorPickups(account, next);
  return next.find((pickup) => pickup.id === pickupId) ?? null;
}

export function getCollectorMetrics(account: MockAccount) {
  const pickups = getCollectorPickups(account);
  const assigned = pickups.length;
  const completed = pickups.filter((pickup) => pickup.status === 'completed');
  const pending = pickups.filter((pickup) => pickup.status === 'pending');
  const totalCollected = completed.reduce((sum, pickup) => sum + (pickup.actualQuantity ?? 0), 0);
  return {
    assigned,
    completedCount: completed.length,
    pendingCount: pending.length,
    totalCollected,
    todayVisits: new Set(pickups.map((pickup) => pickup.farmer)).size,
  };
}

export function money(value: number) {
  return `Rs. ${value.toLocaleString('en-LK', { minimumFractionDigits: value % 1 === 0 ? 0 : 1, maximumFractionDigits: 1 })}`;
}

export function amountFor(pickup: CollectorPickup, quantity = pickup.actualQuantity ?? pickup.requestedQuantity) {
  return quantity * pickup.ratePerLitre;
}

export function formatDate(iso: string) {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return iso;
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
