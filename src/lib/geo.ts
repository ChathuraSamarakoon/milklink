export interface GeoCoordinates {
  lat: number;
  lng: number;
}

// Sri Lanka district town centres
export const SRI_LANKA_DISTRICT_CENTRES: Record<string, [number, number]> = {
  Colombo: [6.9271, 79.8612],
  Gampaha: [7.0873, 79.999],
  Kalutara: [6.5854, 79.9607],
  Kandy: [7.2906, 80.6337],
  Matale: [7.4675, 80.6234],
  'Nuwara Eliya': [6.9497, 80.7891],
  Galle: [6.0535, 80.221],
  Matara: [5.9549, 80.555],
  Hambantota: [6.1241, 81.1185],
  Anuradhapura: [8.3114, 80.4037],
  Polonnaruwa: [7.9403, 81.0188],
  Kurunegala: [7.4863, 80.3647],
  Puttalam: [8.0362, 79.8283],
  Badulla: [6.9934, 81.055],
  Monaragala: [6.8728, 81.3507],
  Ratnapura: [6.6828, 80.3992],
  Kegalle: [7.2513, 80.3464],
  Jaffna: [9.6615, 80.0255],
  Kilinochchi: [9.3803, 80.377],
  Mannar: [8.981, 79.9044],
  Vavuniya: [8.7542, 80.4982],
  Mullaitivu: [9.2671, 80.8142],
  Trincomalee: [8.5874, 81.2152],
  Batticaloa: [7.731, 81.6747],
  Ampara: [7.2975, 81.682],
};

/**
 * Calculates Haversine distance in kilometers between two coordinates
 */
export function calculateDistanceKm(c1: GeoCoordinates, c2: GeoCoordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((c2.lat - c1.lat) * Math.PI) / 180;
  const dLon = ((c2.lng - c1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((c1.lat * Math.PI) / 180) *
      Math.cos((c2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Obfuscates coordinates for pre-acceptance farm privacy (~1 km fuzzy offset)
 * Feature requirement: Pre-acceptance location is approximate (~1 km)
 */
export function approximateCoordinates(
  coords: GeoCoordinates,
  seedKey = 'farm-seed',
  fuzzRadiusKm = 1.0
): GeoCoordinates {
  // Deterministic hash from seed string to keep marker in consistent fuzzy location
  let hash = 0;
  for (let i = 0; i < seedKey.length; i++) {
    hash = (hash << 5) - hash + seedKey.charCodeAt(i);
    hash |= 0;
  }
  const angle = Math.abs(hash % 360) * (Math.PI / 180);
  const distance = (0.5 + Math.abs((hash % 100) / 200)) * fuzzRadiusKm; // ~0.5 - 1.0 km

  // 1 degree lat is approx 111km, 1 degree lng is approx 111*cos(lat)
  const deltaLat = (distance * Math.sin(angle)) / 111;
  const deltaLng = (distance * Math.cos(angle)) / (111 * Math.cos((coords.lat * Math.PI) / 180));

  return {
    lat: Math.round((coords.lat + deltaLat) * 1000) / 1000,
    lng: Math.round((coords.lng + deltaLng) * 1000) / 1000,
  };
}
