import type { FarmerSearchResult } from '../discovery/types';

export interface MatchingWeights {
  quantity: number; // e.g. 0.30
  distance: number; // e.g. 0.30
  price: number; // e.g. 0.25
  availability: number; // e.g. 0.15
}

export interface FactorBreakdown {
  score: number; // 0 - 100
  weight: number; // 0.0 - 1.0
  weightedScore: number;
  label: string;
  metric: string;
  explanation: string;
}

export interface RankedMatch {
  farmer: FarmerSearchResult;
  rank: number;
  totalScore: number; // 0 - 100
  factors: {
    quantity: FactorBreakdown;
    distance: FactorBreakdown;
    price: FactorBreakdown;
    availability: FactorBreakdown;
  };
}

export interface MatchingRequestParams {
  requestedLitres: number;
  collectionDate: string;
  maxRadiusKm: number;
  buyerDistrict?: string;
  organicOnly?: boolean;
  customWeights?: Partial<MatchingWeights>;
}
