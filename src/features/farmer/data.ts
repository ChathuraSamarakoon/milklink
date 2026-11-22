import type { MockAccount } from '../auth/components/mockAuth';

export type FarmerListing = {
  id: string;
  quantity: number;
  reserved: number;
  pricePerLitre: number;
  startDate: string;
  endDate: string;
  notes: string;
  status: 'active' | 'expired';
  image: string;
};

export type FarmerOrderStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export type FarmerOrder = {
  id: string;
  buyer: string;
  district: string;
  phone: string;
  listingId: string;
  requestedQuantity: number;
  pricePerLitre: number;
  collectionDate: string;
  placedAt: string;
  status: FarmerOrderStatus;
};

function key(account: MockAccount, section: string) {
  return `milklink-farmer-${section}-${account.id}`;
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
    // Browser storage is optional for this prototype.
  }
}

const listingImages = [
  '/images/farmer-my-listings.webp',
  '/images/farmer-add-listing.webp',
  '/images/farmer-edit-listing.webp',
  '/images/farmer-listing-details.webp',
] as const;

export function getFarmerListings(account: MockAccount): FarmerListing[] {
  const listings = read(key(account, 'listings'), [
    {
      id: 'MLK-2045',
      quantity: 120,
      reserved: 45,
      pricePerLitre: 135,
      startDate: '2026-11-23',
      endDate: '2026-11-25',
      notes: 'Fresh morning milk from Green Valley Farm. High quality and well cooled.',
      status: 'active',
      image: '/images/farmer-my-listings.webp',
    },
    {
      id: 'MLK-2044',
      quantity: 80,
      reserved: 18,
      pricePerLitre: 120,
      startDate: '2026-11-22',
      endDate: '2026-11-24',
      notes: 'Evening collection milk suitable for daily supply orders.',
      status: 'active',
      image: '/images/farmer-add-listing.webp',
    },
    {
      id: 'MLK-2043',
      quantity: 35,
      reserved: 0,
      pricePerLitre: 120,
      startDate: '2026-11-22',
      endDate: '2026-11-23',
      notes: 'Small batch available for nearby buyers.',
      status: 'active',
      image: '/images/farmer-listing-details.webp',
    },
    {
      id: 'MLK-2042',
      quantity: 50,
      reserved: 10,
      pricePerLitre: 140,
      startDate: '2026-11-23',
      endDate: '2026-11-26',
      notes: 'High-fat milk lot, excellent for dairy processing.',
      status: 'active',
      image: '/images/farmer-edit-listing.webp',
    },
    {
      id: 'MLK-2037',
      quantity: 90,
      reserved: 50,
      pricePerLitre: 130,
      startDate: '2026-11-12',
      endDate: '2026-11-14',
      notes: 'Archived previous listing for reference.',
      status: 'expired',
      image: '/images/farmer-my-listings.webp',
    },
    {
      id: 'MLK-2036',
      quantity: 60,
      reserved: 0,
      pricePerLitre: 128,
      startDate: '2026-11-09',
      endDate: '2026-11-10',
      notes: 'Expired listing sample data.',
      status: 'expired',
      image: '/images/farmer-listing-details.webp',
    },
  ] satisfies FarmerListing[]);
  const today = new Date().toISOString().slice(0, 10);
  return listings.map((listing) => listing.status === 'active' && listing.endDate < today
    ? { ...listing, status: 'expired' as const }
    : listing);
}

export function saveFarmerListings(account: MockAccount, listings: FarmerListing[]) {
  write(key(account, 'listings'), listings);
}

export function getFarmerOrders(account: MockAccount): FarmerOrder[] {
  return read(key(account, 'orders'), [
    {
      id: 'ORD-8093',
      buyer: 'Ruwan Dairy',
      district: 'Kandy, Sri Lanka',
      phone: '077 345 6789',
      listingId: 'MLK-2045',
      requestedQuantity: 80,
      pricePerLitre: 120,
      collectionDate: '2026-11-24',
      placedAt: '2026-11-22T08:30:00',
      status: 'pending',
    },
    {
      id: 'ORD-8094',
      buyer: 'Hillside Milk',
      district: 'Nuwara Eliya, Sri Lanka',
      phone: '077 412 5678',
      listingId: 'MLK-2043',
      requestedQuantity: 35,
      pricePerLitre: 120,
      collectionDate: '2026-11-24',
      placedAt: '2026-11-22T10:10:00',
      status: 'pending',
    },
    {
      id: 'ORD-8095',
      buyer: 'Green Mart Dairy',
      district: 'Matale, Sri Lanka',
      phone: '077 556 1122',
      listingId: 'MLK-2045',
      requestedQuantity: 120,
      pricePerLitre: 135,
      collectionDate: '2026-11-25',
      placedAt: '2026-11-22T11:45:00',
      status: 'pending',
    },
    {
      id: 'ORD-8091',
      buyer: 'Ruwan Dairy',
      district: 'Kandy, Sri Lanka',
      phone: '077 345 6789',
      listingId: 'MLK-2045',
      requestedQuantity: 30,
      pricePerLitre: 135,
      collectionDate: '2026-11-23',
      placedAt: '2026-11-20T14:20:00',
      status: 'accepted',
    },
    {
      id: 'ORD-8092',
      buyer: 'Green Mart Dairy',
      district: 'Gampaha, Sri Lanka',
      phone: '077 998 4400',
      listingId: 'MLK-2044',
      requestedQuantity: 15,
      pricePerLitre: 120,
      collectionDate: '2026-11-24',
      placedAt: '2026-11-20T16:35:00',
      status: 'declined',
    },
    {
      id: 'ORD-8088',
      buyer: 'Kandy Fresh Foods',
      district: 'Kandy, Sri Lanka',
      phone: '077 765 1100',
      listingId: 'MLK-2037',
      requestedQuantity: 120,
      pricePerLitre: 135,
      collectionDate: '2026-11-20',
      placedAt: '2026-11-19T08:05:00',
      status: 'completed',
    },
    {
      id: 'ORD-8087',
      buyer: 'Lanka Milk Point',
      district: 'Kurunegala, Sri Lanka',
      phone: '077 457 3344',
      listingId: 'MLK-2036',
      requestedQuantity: 80,
      pricePerLitre: 120,
      collectionDate: '2026-11-19',
      placedAt: '2026-11-18T09:00:00',
      status: 'completed',
    },
    {
      id: 'ORD-8086',
      buyer: 'Matara Dairy House',
      district: 'Matara, Sri Lanka',
      phone: '077 889 2200',
      listingId: 'MLK-2036',
      requestedQuantity: 35,
      pricePerLitre: 120,
      collectionDate: '2026-11-18',
      placedAt: '2026-11-17T07:40:00',
      status: 'completed',
    },
  ] satisfies FarmerOrder[]);
}

export function saveFarmerOrders(account: MockAccount, orders: FarmerOrder[]) {
  write(key(account, 'orders'), orders);
}

export function createListingId() {
  return `MLK-${Math.floor(2000 + Math.random() * 8000)}`;
}

export function availableLitres(listing: FarmerListing) {
  return Math.max(0, listing.quantity - listing.reserved);
}

export function money(litres: number, rate: number) {
  return litres * rate;
}

export function formatDate(iso: string) {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return iso;
  return value.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function listingRange(listing: FarmerListing) {
  return `${formatDate(listing.startDate)} – ${formatDate(listing.endDate)}`;
}

export function formatDateTime(iso: string) {
  const value = new Date(iso);
  if (Number.isNaN(value.getTime())) return iso;
  return value.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function createFarmerListing(input: {
  quantity: number;
  pricePerLitre: number;
  startDate: string;
  endDate: string;
  notes: string;
}): FarmerListing {
  const image = listingImages[Math.floor(Math.random() * listingImages.length)];
  return {
    id: createListingId(),
    quantity: input.quantity,
    reserved: 0,
    pricePerLitre: input.pricePerLitre,
    startDate: input.startDate,
    endDate: input.endDate,
    notes: input.notes,
    status: 'active',
    image,
  };
}
