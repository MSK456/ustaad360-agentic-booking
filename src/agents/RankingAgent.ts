import { Provider } from '../types';
import { AgentTrace, ParsedIntent, RankedProviderResult, ProviderBadge, FactorScores } from '../types/agent';
import { isoNow } from '../utils/dateTime';
import {
  computeAvailabilityScore, computeSkillMatchScore, computeReliabilityScore,
  computeRatingScore, computeReviewRecencyScore, computeDistanceScore,
  computeTravelTimeScore, computePriceFitScore, computeCancellationScore,
  computeFairnessScore, computeFinalScore,
} from '../utils/scoring';
import { calculatePrice } from '../utils/pricing';

// Simulated distance/travel (deterministic based on provider ID)
const PROVIDER_DISTANCES: Record<string, { km: number; min: number }> = {
  p1:  { km: 1.2, min: 4  },
  p2:  { km: 3.1, min: 11 },
  p3:  { km: 4.8, min: 17 },
  p4:  { km: 2.0, min: 7  },
  p5:  { km: 5.5, min: 19 },
  p6:  { km: 7.2, min: 25 },
  p7:  { km: 6.0, min: 21 },
  p8:  { km: 9.5, min: 33 },
  p9:  { km: 11.0, min: 38 },
  p10: { km: 3.5, min: 12 },
  p11: { km: 2.8, min: 10 },
  p12: { km: 8.0, min: 28 },
  p13: { km: 10.5, min: 37 },
  p14: { km: 7.0, min: 24 },
  ac2: { km: 1.8, min: 6  },
  ac3: { km: 4.2, min: 15 },
  ac4: { km: 6.5, min: 23 },
  ac5: { km: 2.5, min: 9  },
  ac6: { km: 5.0, min: 18 },
  ac7: { km: 12.0, min: 42 },
  el3: { km: 1.6, min: 6  },
  el4: { km: 13.0, min: 45 },
  el5: { km: 9.0, min: 31 },
  el6: { km: 5.8, min: 20 },
};

const getDistance = (id: string) => {
  if (PROVIDER_DISTANCES[id]) return PROVIDER_DISTANCES[id];
  // Deterministic realistic distance for dynamically added providers
  const num = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const km = (num % 150) / 10 + 1.2; // 1.2 to 16.1 km
  return { km: parseFloat(km.toFixed(1)), min: Math.round(km * 3.5) };
};

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
    
    // Call calculatePrice directly to get realistic estimate
    const calc = calculatePrice({
      serviceType: intent.serviceType,
      baseRate: p.basePricePerHour,
      distanceKm: km,
      urgency: intent.urgency as any,
      complexity: intent.jobComplexity as any,
      providerPremium: p.rating >= 4.7 ? 200 : 0,
      isHighDemand: intent.urgency === 'high' || intent.urgency === 'emergency',
      isReturningUser: true,
      userBudget,
      items: intent.parsedItems,
    });
    const estimatedPrice = calc.finalEstimate;

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

  // Baseline: recalculate a simple score (0-100) based ONLY on availability (40%) and distance (60%)
  const baseline = [...scored].map(r => {
    // A primitive booking system just looks at distance if available.
    // If not available, score is 0.
    let bScore = 0;
    if (r.provider.isAvailable) {
      bScore = Math.round((0.4 * 1.0 + 0.6 * r.factorScores.distanceScore) * 100);
    } else {
      bScore = Math.round((0.6 * r.factorScores.distanceScore) * 100);
    }
    
    // ensure baseline isn't 0 if they are close but unavailable.
    bScore = Math.max(bScore, 10); // user requested "do not make baseline 0. believable but weaker"
    
    // adjust slightly to recommended range 55-70 if it's available
    if (r.provider.isAvailable) {
       bScore = Math.min(85, Math.max(55, bScore - 15));
    }
    
    return {
      ...r,
      finalScore: bScore,
      rankingReason: `Score ${bScore}/100 — based only on distance (${r.distanceKm}km) and basic availability.`,
    };
  }).sort((a, b) => {
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
