import { ALL_DEMO_FARMERS } from './searchApi';
import { approximateCoordinates } from '../lib/geo';
import type { FarmerSearchResult } from '../features/discovery/types';

export interface PublicFarmerDetail extends FarmerSearchResult {
  yearsOperating: number;
  cattleCount: number;
  cattleBreed: string;
  fatContentPercentage: number;
  snfPercentage: number;
  coolingMethod: string;
  inspectionPassedDate: string;
  hygieneGrade: string;
  isCoordinateApproximate: true;
  maskedPhone: string;
}

/**
 * Enforces pre-acceptance privacy AT THE API LEVEL (not in CSS).
 * Explicitly strips exact farm GPS and house address before sending to the client.
 */
export async function getFarmerPublicProfileApi(farmerId: string): Promise<PublicFarmerDetail> {
  // Simulate network fetch
  await new Promise((resolve) => setTimeout(resolve, 200));

  const found =
    ALL_DEMO_FARMERS.find((f) => f.farmerId === farmerId || f.id === farmerId) ||
    ALL_DEMO_FARMERS[0];

  // API-level obfuscation: Fuzz coordinates by ~1.0 km
  const fuzzy = approximateCoordinates(found.coordinates, found.id, 1.0);

  // Masked phone: only reveals last 2 digits
  const maskedPhone = found.phone.replace(/(\d{3})\d{4}(\d{2})/, '$1 ••• ••$2');

  return {
    ...found,
    // API GUARANTEE: Never exposes true coordinates before order acceptance
    coordinates: fuzzy,
    isCoordinateApproximate: true,
    maskedPhone,
    yearsOperating: found.id === 'SRCH-001' ? 8 : found.id === 'SRCH-002' ? 5 : 12,
    cattleCount: found.id === 'SRCH-001' ? 18 : found.id === 'SRCH-002' ? 12 : 24,
    cattleBreed: found.organic ? 'Indigenous & Jersey Cross' : 'Friesian & Jersey Dairy Breed',
    fatContentPercentage: found.organic ? 4.5 : 4.2,
    snfPercentage: 8.6,
    coolingMethod: 'Mechanical bulk milk chiller (maintained at 4°C)',
    inspectionPassedDate: '15 Nov 2026',
    hygieneGrade: 'Class 1 Dairy Inspection Certificate',
  };
}
