import { ALL_DEMO_FARMERS } from './searchApi';
import type { FarmerSearchResult } from '../features/discovery/types';
import type {
  MatchingWeights,
  RankedMatch,
  MatchingRequestParams,
  FactorBreakdown,
} from '../features/matching/types';

// Default rule-based algorithm weights (must sum to 1.0)
export const DEFAULT_MATCHING_WEIGHTS: MatchingWeights = {
  quantity: 0.3, // 30%
  distance: 0.3, // 30%
  price: 0.25, // 25%
  availability: 0.15, // 15%
};

/**
 * Deterministic, rule-based scoring engine (Non-Machine Learning)
 * Calculates multi-factor scores based on explicit mathematical rules.
 */
export function scoreFarmerMatch(
  farmer: FarmerSearchResult,
  params: MatchingRequestParams,
  weights: MatchingWeights = DEFAULT_MATCHING_WEIGHTS
): RankedMatch {
  const reqL = params.requestedLitres || 25;

  // 1. Quantity Fit Score (0 - 100)
  let qScore = 100;
  let qExplanation = `${farmer.availableLitres}L available fully satisfies ${reqL}L request`;
  if (farmer.availableLitres < reqL) {
    qScore = Math.round((farmer.availableLitres / reqL) * 75);
    qExplanation = `Partial supply: ${farmer.availableLitres}L of ${reqL}L requested (${Math.round((farmer.availableLitres / reqL) * 100)}% fit)`;
  } else if (farmer.availableLitres > reqL * 5) {
    qScore = 95; // slight penalty for extreme surplus to prevent small orders from blocking bulk buyers
    qExplanation = `Full fit: ${farmer.availableLitres}L capacity`;
  }
  const factorQuantity: FactorBreakdown = {
    score: qScore,
    weight: weights.quantity,
    weightedScore: Math.round(qScore * weights.quantity),
    label: 'Quantity Fit',
    metric: `${farmer.availableLitres}L available for ${reqL}L needed`,
    explanation: qExplanation,
  };

  // 2. Distance Proximity Score (0 - 100)
  const maxR = params.maxRadiusKm || 25;
  const distRatio = Math.min(1, farmer.distanceKm / maxR);
  const dScore = Math.max(20, Math.round(100 - distRatio * 70));
  const factorDistance: FactorBreakdown = {
    score: dScore,
    weight: weights.distance,
    weightedScore: Math.round(dScore * weights.distance),
    label: 'Distance Proximity',
    metric: `${farmer.distanceKm.toFixed(1)} km away (within ${maxR} km radius)`,
    explanation: `${farmer.distanceKm.toFixed(1)} km from delivery area in ${farmer.village}`,
  };

  // 3. Price Competitiveness Score (0 - 100)
  // Baseline price in Sri Lanka dairy market: ~Rs. 185 - 220
  const baselinePrice = 185;
  let pScore = 100;
  if (farmer.pricePerLitre > baselinePrice) {
    const diff = farmer.pricePerLitre - baselinePrice;
    pScore = Math.max(35, Math.round(100 - diff * 2.2));
  }
  const factorPrice: FactorBreakdown = {
    score: pScore,
    weight: weights.price,
    weightedScore: Math.round(pScore * weights.price),
    label: 'Price Value',
    metric: `Rs. ${farmer.pricePerLitre} / Litre`,
    explanation:
      pScore >= 90
        ? 'Competitive farm-gate market price'
        : pScore >= 75
        ? 'Standard regional dairy price'
        : 'Premium lot price for specialty/organic yield',
  };

  // 4. Availability & Lead Time Score (0 - 100)
  // Check collection date match and morning pickup window
  let aScore = 95;
  if (farmer.collectionDate === params.collectionDate) {
    aScore = 100;
  } else {
    aScore = 80;
  }
  const factorAvailability: FactorBreakdown = {
    score: aScore,
    weight: weights.availability,
    weightedScore: Math.round(aScore * weights.availability),
    label: 'Date Availability',
    metric: `${farmer.supplyWindow} (${farmer.collectionDate})`,
    explanation: `Available for pickup in ${farmer.supplyWindow} on ${farmer.collectionDate}`,
  };

  // Total Weighted Rule-Based Score
  const totalScore = Math.round(
    factorQuantity.weightedScore +
      factorDistance.weightedScore +
      factorPrice.weightedScore +
      factorAvailability.weightedScore
  );

  return {
    farmer,
    rank: 1, // calculated during sorting
    totalScore: Math.min(99, Math.max(45, totalScore)),
    factors: {
      quantity: factorQuantity,
      distance: factorDistance,
      price: factorPrice,
      availability: factorAvailability,
    },
  };
}

/**
 * Ranks all matching farmers according to the weighted rule-based model
 */
export async function getRecommendedMatchesApi(
  params: MatchingRequestParams
): Promise<RankedMatch[]> {
  // Simulate network delay
  await new Promise((res) => setTimeout(res, 250));

  const weights: MatchingWeights = {
    ...DEFAULT_MATCHING_WEIGHTS,
    ...(params.customWeights || {}),
  };

  const filtered = ALL_DEMO_FARMERS.filter((f) => {
    if (params.organicOnly && !f.organic) return false;
    if (params.maxRadiusKm && f.distanceKm > params.maxRadiusKm) return false;
    return true;
  });

  const scored = filtered.map((farmer) => scoreFarmerMatch(farmer, params, weights));

  // Deterministic stable sort: totalScore desc, then distance asc, then price asc
  scored.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.farmer.distanceKm !== b.farmer.distanceKm) return a.farmer.distanceKm - b.farmer.distanceKm;
    return a.farmer.pricePerLitre - b.farmer.pricePerLitre;
  });

  // Assign ranks
  scored.forEach((m, idx) => {
    m.rank = idx + 1;
  });

  return scored;
}
