// ─── Individual factor scoring functions (0.0 – 1.0) ──────────────────────

export const computeAvailabilityScore = (isAvailable: boolean, hasSlot: boolean): number => {
  if (isAvailable && hasSlot) return 1.0;
  if (isAvailable) return 0.7;
  return 0.0;
};

export const computeSkillMatchScore = (providerSkills: string[], required: string[]): number => {
  if (!required.length) return 0.75;
  const lower = required.map(s => s.toLowerCase());
  const hits = lower.filter(r =>
    providerSkills.some(ps => ps.toLowerCase().includes(r) || r.includes(ps.toLowerCase()))
  );
  return Math.min(hits.length / lower.length + 0.2, 1.0);
};

export const computeReliabilityScore = (onTimeScore: number): number =>
  Math.max(0, Math.min(1, onTimeScore));

export const computeRatingScore = (rating: number, reviewCount: number): number => {
  // Bayesian adjustment toward mean of 3.5 with 50 prior reviews
  const bayesian = (rating * reviewCount + 3.5 * 50) / (reviewCount + 50);
  return Math.max(0, (bayesian - 1) / 4);
};

export const computeReviewRecencyScore = (score: number): number =>
  Math.max(0, Math.min(1, score));

export const computeDistanceScore = (km: number): number => {
  if (km <= 0.5) return 1.0;
  if (km >= 20) return 0.0;
  return 1 - km / 20;
};

export const computeTravelTimeScore = (minutes: number): number => {
  if (minutes <= 3) return 1.0;
  if (minutes >= 60) return 0.0;
  return 1 - minutes / 60;
};

export const computePriceFitScore = (price: number, budget: number): number => {
  if (!budget) return 0.75;
  const r = price / budget;
  if (r <= 0.9) return 1.0;
  if (r <= 1.0) return 0.95;
  if (r <= 1.1) return 0.40;
  if (r <= 1.25) return 0.15;
  return 0.0;
};

export const computeCancellationScore = (rate: number): number =>
  Math.max(0, 1 - rate * 2.5);

export const computeFairnessScore = (reviewCount: number, yearsExp: number): number =>
  Math.min((reviewCount / 300) * 0.6 + (yearsExp / 15) * 0.4, 1.0);

// ─── Weighted final score (weights sum to 1.00) ───────────────────────────
export const RANKING_WEIGHTS = {
  availability:     0.16,
  skillMatch:       0.14,
  reliability:      0.13,
  rating:           0.09,
  reviewRecency:    0.09,
  distance:         0.10,
  travelTime:       0.07,
  priceFit:         0.15,
  lowCancellation:  0.05,
  fairness:         0.02,
} as const;

export interface FactorInputs {
  availabilityScore: number;
  skillMatchScore: number;
  reliabilityScore: number;
  ratingScore: number;
  reviewRecencyScore: number;
  distanceScore: number;
  travelTimeScore: number;
  priceFitScore: number;
  lowCancellationScore: number;
  providerFairnessScore: number;
}

export const computeFinalScore = (f: FactorInputs): number => {
  let score = (
    RANKING_WEIGHTS.availability    * f.availabilityScore +
    RANKING_WEIGHTS.skillMatch      * f.skillMatchScore +
    RANKING_WEIGHTS.reliability     * f.reliabilityScore +
    RANKING_WEIGHTS.rating          * f.ratingScore +
    RANKING_WEIGHTS.reviewRecency   * f.reviewRecencyScore +
    RANKING_WEIGHTS.distance        * f.distanceScore +
    RANKING_WEIGHTS.travelTime      * f.travelTimeScore +
    RANKING_WEIGHTS.priceFit        * f.priceFitScore +
    RANKING_WEIGHTS.lowCancellation * f.lowCancellationScore +
    RANKING_WEIGHTS.fairness        * f.providerFairnessScore
  );

  // Apply massive non-linear penalty for bad price fit to ensure they rank below budget-friendly options
  if (f.priceFitScore === 0) {
    score *= 0.1;
  } else if (f.priceFitScore <= 0.2) {
    score *= 0.5;
  }

  return Math.round(score * 100);
};
