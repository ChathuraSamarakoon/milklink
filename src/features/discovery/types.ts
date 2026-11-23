export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FarmerSearchParams {
  litres: number;
  collectionDate: string;
  radiusKm: number;
  coordinates?: Coordinates | null;
  district: string;
  productType?: string;
  organicOnly?: boolean;
  maxPrice?: number;
}

export interface FarmerSearchResult {
  id: string;
  farmerId: string;
  farmName: string;
  ownerName: string;
  distanceKm: number;
  district: string;
  village: string;
  availableLitres: number;
  reservedLitres: number;
  pricePerLitre: number;
  rating: number;
  reviewsCount: number;
  qualityGrade: 'Grade A' | 'Grade B' | 'Organic Certified';
  organic: boolean;
  collectionDate: string;
  supplyWindow: string; // e.g. "06:00 AM - 08:30 AM"
  image: string;
  coordinates: Coordinates;
  verified: boolean;
  dailyCapacity: number;
  phone: string;
}

export type SearchSortOption = 'distance' | 'rating' | 'price_asc' | 'litres_desc';
