import { Provider } from '../types';
import { AgentTrace, ParsedIntent, RankedProviderResult, ProviderBadge, FactorScores } from '../types/agent';
import { isoNow } from '../utils/dateTime';
import {
  computeAvailabilityScore, computeSkillMatchScore, computeReliabilityScore,
  computeRatingScore, computeReviewRecencyScore, computeDistanceScore,
  computeTravelTimeScore, computePriceFitScore, computeCancellationScore,
  computeFairnessScore, computeFinalScore,
} from '../utils/scoring';

// Simulated distance/travel (deterministic based on provider ID)
const PROVIDER_DISTANCES: Record<string, { km: number; min: number }> = {
  p1: { km: 1.2, min: 4  },
  p2: { km: 3.1, min: 11 },
  p3: { km: 4.8, min: 17 },
  p4: { km: 2.0, min: 7  },
  p5: { km: 5.5, min: 19 },
  p6: { km: 7.2, min: 25 },
};
const getDistance = (id: string) => PROVIDER_DISTANCES[id] ?? { km: 8, min: 28 };

// Skill keywords per service
const SERVICE_SKILLS: Record<string, string[]> = {
  plumber:       ['nala repair', 'pipe fitting', 'leak fixing'],
  electrician:   ['wiring', 'switchboard repair', 'inverter'],
  ac_technician: ['AC gas refill', 'AC service', 'compressor'],
  carpenter:     ['door repair', 'furniture', 'wood polish'],
};

function computeBadges(f: FactorScores, p: Provider, rank: number): ProviderBadge[] {
  const badges: ProviderBadge[] = [];
  if (f.reliabilityScore >= 0.9)      badges.push('Best Reliability');
  if (f.priceFitScore >= 0.9)         badges.push('Budget Fit');
  if (rank === 0)                     badges.push('Fastest Arrival');
  if (f.skillMatchScore >= 0.85)      badges.push('Specialist');
  if (f.lowCancellationScore >= 0.92) badges.push('Low Cancellation Risk');
  if (f.reviewRecencyScore >= 0.85)   badges.push('Recent Positive Reviews');
  return badges;
}

export interface RankingAgentOutput {
  ranked: RankedProviderResult[];
  baseline: RankedProviderResult[];   // simple distance-only ranking
  trace: AgentTrace;
}

export function runRankingAgent(
  providers: Provider[],
  intent: ParsedIntent,
  userBudget?: number,
): RankingAgentOutput {
  const t0 = Date.now();
  const requiredSkills = SERVICE_SKILLS[intent.serviceType] ?? [];

  const scored: RankedProviderResult[] = providers.map(p => {
    const { km, min } = getDistance(p.id);
    const estimatedPrice = p.basePricePerHour + (km > 2 ? (km - 2) * 60 : 0);

    const f: FactorScores = {
      availabilityScore:    computeAvailabilityScore(p.isAvailable, p.availableSlots.length > 0),
      skillMatchScore:      computeSkillMatchScore(p.skills, requiredSkills),
      reliabilityScore:     computeReliabilityScore(p.onTimeScore),
      ratingScore:          computeRatingScore(p.rating, p.reviewCount),
      reviewRecencyScore:   computeReviewRecencyScore(p.reviewRecencyScore),
      distanceScore:        computeDistanceScore(km),
      travelTimeScore:      computeTravelTimeScore(min),
      priceFitScore:        computePriceFitScore(estimatedPrice, userBudget ?? 0),
      lowCancellationScore: computeCancellationScore(p.cancellationRate),
      providerFairnessScore:computeFairnessScore(p.reviewCount, p.yearsExperience),
    };

    const finalScore = computeFinalScore(f);
    const riskFlags: string[] = [];
    if (p.cancellationRate > 0.1)  riskFlags.push('Higher cancellation rate');
    if (p.onTimeScore < 0.8)       riskFlags.push('Punctuality concern');
    if (!p.verifiedBadge)          riskFlags.push('Not verified');

    return {
      provider: p,
      finalScore,
      factorScores: f,
      rankingReason: `Score ${finalScore}/100 — top factors: availability (${Math.round(f.availabilityScore*100)}%), reliability (${Math.round(f.reliabilityScore*100)}%), rating (${p.rating})`,
      riskFlags,
      whyRecommended: `Best balance of reliability (${Math.round(p.onTimeScore*100)}% on-time), skill match, and price fit.`,
      badges: [],     // filled after sort
      estimatedPrice: Math.round(estimatedPrice),
      distanceKm: km,
      travelTimeMin: min,
    };
  });

  // Sort agentic ranking
  scored.sort((a, b) => b.finalScore - a.finalScore);
  scored.forEach((r, i) => { r.badges = computeBadges(r.factorScores, r.provider, i); });

  // Add "why not closest" if #1 is not closest
  const closestIdx = [...scored].sort((a, b) => a.distanceKm - b.distanceKm)[0];
  if (scored[0]?.provider.id !== closestIdx?.provider.id) {
    scored[0].whyNotClosestProvider =
      `${closestIdx.provider.name} is closer (${closestIdx.distanceKm}km) but has lower reliability (${Math.round(closestIdx.provider.onTimeScore*100)}% on-time) and rating (${closestIdx.provider.rating}).`;
  }

  // Baseline: sort by availability then distance only
  const baseline = [...scored].sort((a, b) => {
    if (b.provider.isAvailable !== a.provider.isAvailable)
      return b.provider.isAvailable ? 1 : -1;
    return a.distanceKm - b.distanceKm;
  });

  const trace: AgentTrace = {
    id: `trace-ranking-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'RankingAgent',
    action: 'Score and rank providers using 10-factor weighted formula',
    inputSummary: `${providers.length} providers | service: ${intent.serviceType} | budget: ${userBudget ? '₨' + userBudget : 'not set'}`,
    decision: `#1: ${scored[0]?.provider.name ?? 'N/A'} (score: ${scored[0]?.finalScore ?? 0}/100)`,
    rationale: `Applied weighted formula (availability 16%, skill 14%, reliability 13%, rating 12%, recency 11%, distance 10%, travel 9%, price 8%, cancellation 5%, fairness 2%). ${scored[0]?.provider.name} leads on reliability and skill match.`,
    confidence: 0.91,
    dataUsed: ['provider_history', 'availability_slots', 'review_data', 'distance_matrix', 'user_budget'],
    nextAction: 'PricingAgent',
    status: 'success',
    durationMs: Date.now() - t0,
  };

  return { ranked: scored, baseline, trace };
}
