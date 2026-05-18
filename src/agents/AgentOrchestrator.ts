import { OrchestratorResult, BaselineComparison, BaselineFactorRow } from '../types/agent';
import { runIntentAgent } from './IntentAgent';
import { runDiscoveryAgent } from './DiscoveryAgent';
import { runRankingAgent } from './RankingAgent';
import { runPricingAgent } from './PricingAgent';
import { runSchedulingAgent } from './SchedulingAgent';
import { runBookingAgent } from './BookingAgent';
import { runNotificationAgent } from './NotificationAgent';
import { runFollowUpAgent } from './FollowUpAgent';
import { runReputationUpdateAgent } from './ReputationUpdateAgent';
import { Colors } from '../theme/colors';

function buildBaselineComparison(
  agenticResult: OrchestratorResult,
): BaselineComparison {
  const agenticTop  = agenticResult.rankedProviders[0];
  const baselineTop = agenticResult.rankedProviders.find(r =>
    // baseline picks by distance first
    r.distanceKm === Math.min(...agenticResult.rankedProviders.map(x => x.distanceKm))
  ) ?? agenticResult.rankedProviders[agenticResult.rankedProviders.length - 1];

  const agScore   = agenticTop?.finalScore ?? 0;
  // Baseline score: only availability + distance (no other factors)
  const bAvail    = baselineTop?.provider.isAvailable ? 100 : 0;
  const bDist     = Math.round((1 - Math.min(baselineTop?.distanceKm ?? 10, 20) / 20) * 100);
  const bScore    = Math.round(bAvail * 0.6 + bDist * 0.4);

  const factorRows: BaselineFactorRow[] = [
    {
      factor: 'Distance',
      baseline: { used: true,  value: `${baselineTop?.distanceKm ?? '?'}km (nearest)`, score: bDist, note: 'Primary sort criterion' },
      agentic:  { used: true,  value: `${agenticTop?.distanceKm ?? '?'}km (not primary)`, score: Math.round((agenticTop?.factorScores.distanceScore ?? 0) * 100), note: 'Weight: 10%' },
    },
    {
      factor: 'Travel Time',
      baseline: { used: true,  value: `${baselineTop?.travelTimeMin ?? '?'} min`, score: Math.round((1 - (baselineTop?.travelTimeMin ?? 30) / 60) * 100), note: 'Secondary sort criterion' },
      agentic:  { used: true,  value: `${agenticTop?.travelTimeMin ?? '?'} min`, score: Math.round((agenticTop?.factorScores.travelTimeScore ?? 0) * 100), note: 'Weight: 9%' },
    },
    {
      factor: 'Star Rating',
      baseline: { used: false, value: 'Not checked', score: 0, note: 'Ignored by baseline' },
      agentic:  { used: true,  value: `${agenticTop?.provider.rating ?? '?'}⭐ (Bayesian adj.)`, score: Math.round((agenticTop?.factorScores.ratingScore ?? 0) * 100), note: 'Weight: 12%' },
    },
    {
      factor: 'Review Recency',
      baseline: { used: false, value: 'Not checked', score: 0, note: 'Ignored by baseline' },
      agentic:  { used: true,  value: `${Math.round((agenticTop?.provider.reviewRecencyScore ?? 0) * 100)}%`, score: Math.round((agenticTop?.factorScores.reviewRecencyScore ?? 0) * 100), note: 'Weight: 11%' },
    },
    {
      factor: 'On-Time / Reliability',
      baseline: { used: false, value: 'Not checked', score: 0, note: 'Ignored by baseline' },
      agentic:  { used: true,  value: `${Math.round((agenticTop?.provider.onTimeScore ?? 0) * 100)}%`, score: Math.round((agenticTop?.factorScores.reliabilityScore ?? 0) * 100), note: 'Weight: 13%' },
    },
    {
      factor: 'Cancellation Rate',
      baseline: { used: false, value: 'Not checked', score: 0, note: 'Ignored by baseline' },
      agentic:  { used: true,  value: `${Math.round((agenticTop?.provider.cancellationRate ?? 0) * 100)}%`, score: Math.round((agenticTop?.factorScores.lowCancellationScore ?? 0) * 100), note: 'Weight: 5%' },
    },
    {
      factor: 'Skill Match',
      baseline: { used: false, value: 'Category only', score: 20, note: 'Broad category match' },
      agentic:  { used: true,  value: `${Math.round((agenticTop?.factorScores.skillMatchScore ?? 0) * 100)}%`, score: Math.round((agenticTop?.factorScores.skillMatchScore ?? 0) * 100), note: 'Weight: 14%' },
    },
    {
      factor: 'Price Fit',
      baseline: { used: false, value: 'Ignored', score: 0, note: 'No budget check' },
      agentic:  { used: true,  value: agenticResult.pricing?.budgetFit ?? 'N/A', score: Math.round((agenticTop?.factorScores.priceFitScore ?? 0) * 100), note: 'Weight: 8%' },
    },
  ];

  return {
    baselineProvider: baselineTop?.provider ?? null,
    baselineScore: bScore,
    agenticScore: agScore,
    factorRows,
  };
}

export async function runOrchestrator(
  text: string,
  userBudget?: number,
  userLocation?: string,
): Promise<OrchestratorResult> {
  const traces = [];

  // 1. Intent
  const { intent, trace: t1 } = runIntentAgent(text, userLocation);
  traces.push(t1);
  if (intent.confidence < 0.7) {
    return {
      intent, discoveredProviders: [], rankedProviders: [],
      selectedProvider: null, pricing: null, booking: null,
      followUpTimeline: [], traces,
      baselineComparison: { baselineProvider: null, baselineScore: 0, agenticScore: 0, factorRows: [] },
    };
  }

  // 2. Discovery
  const { providers, trace: t2 } = runDiscoveryAgent(intent);
  traces.push(t2);

  // 3. Ranking
  const { ranked, baseline, trace: t3 } = runRankingAgent(providers, intent, userBudget);
  traces.push(t3);

  const selected = ranked[0] ?? null;

  // 4. Pricing
  const { pricing, trace: t4 } = selected
    ? runPricingAgent(selected, intent, userBudget)
    : { pricing: null, trace: { id: 'skip', timestamp: '', agentName: 'PricingAgent', action: 'Skipped', inputSummary: '', decision: 'No provider', rationale: '', confidence: 0, dataUsed: [], nextAction: '', status: 'failed' as const, durationMs: 0 } };
  traces.push(t4);

  // 5. Scheduling
  const { scheduledAt, trace: t5 } = selected
    ? runSchedulingAgent(selected, intent)
    : { scheduledAt: 'TBD', trace: { id: 'skip', timestamp: '', agentName: 'SchedulingAgent', action: 'Skipped', inputSummary: '', decision: 'No provider', rationale: '', confidence: 0, dataUsed: [], nextAction: '', status: 'failed' as const, durationMs: 0 } };
  traces.push(t5);

  // 6. Booking
  const { booking, trace: t6 } = (selected && pricing)
    ? runBookingAgent(selected, pricing, scheduledAt)
    : { booking: null, trace: { id: 'skip', timestamp: '', agentName: 'BookingAgent', action: 'Skipped', inputSummary: '', decision: 'No provider', rationale: '', confidence: 0, dataUsed: [], nextAction: '', status: 'failed' as const, durationMs: 0 } } as any;
  traces.push(t6);

  // 7. Notification
  if (booking) {
    const { trace: t7 } = runNotificationAgent(booking);
    traces.push(t7);
  }

  // 8. Follow-up
  const { timeline, trace: t8 } = booking
    ? runFollowUpAgent(booking)
    : { timeline: [], trace: { id: 'skip', timestamp: '', agentName: 'FollowUpAgent', action: 'Skipped', inputSummary: '', decision: '', rationale: '', confidence: 0, dataUsed: [], nextAction: '', status: 'skipped' as const, durationMs: 0 } };
  traces.push(t8);

  // 9. Reputation (background)
  if (selected) {
    const { trace: t9 } = runReputationUpdateAgent(selected.provider.id, selected.provider.rating, false);
    traces.push(t9);
  }

  const result: OrchestratorResult = {
    intent,
    discoveredProviders: providers,
    rankedProviders: ranked,
    selectedProvider: selected,
    pricing: pricing ?? null,
    booking: booking ?? null,
    followUpTimeline: timeline,
    traces,
    baselineComparison: { baselineProvider: null, baselineScore: 0, agenticScore: 0, factorRows: [] },
  };

  result.baselineComparison = buildBaselineComparison(result);
  return result;
}
