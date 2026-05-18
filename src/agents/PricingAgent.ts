import { AgentTrace, ParsedIntent, PricingResult, RankedProviderResult } from '../types/agent';
import { calculatePrice } from '../utils/pricing';
import { isoNow } from '../utils/dateTime';

const URGENCY_MAP: Record<string, 'low' | 'medium' | 'high' | 'emergency'> = {
  low: 'low', medium: 'medium', high: 'high', emergency: 'emergency',
};

const COMPLEXITY_MAP: Record<string, 'basic' | 'intermediate' | 'complex'> = {
  basic: 'basic', intermediate: 'intermediate', complex: 'complex',
};

export interface PricingAgentOutput {
  pricing: PricingResult;
  trace: AgentTrace;
}

export function runPricingAgent(
  provider: RankedProviderResult,
  intent: ParsedIntent,
  userBudget?: number,
  isReturningUser = true,
): PricingAgentOutput {
  const t0 = Date.now();

  const providerPremium = provider.provider.rating >= 4.7 ? 200 : 0;
  const isHighDemand = intent.urgency === 'high' || intent.urgency === 'emergency';

  const calc = calculatePrice({
    baseRate:        provider.provider.basePricePerHour,
    distanceKm:      provider.distanceKm,
    urgency:         URGENCY_MAP[intent.urgency] ?? 'medium',
    complexity:      COMPLEXITY_MAP[intent.jobComplexity] ?? 'intermediate',
    providerPremium,
    isHighDemand,
    isReturningUser,
    userBudget,
  });

  const pricing: PricingResult = {
    ...calc,
    fairnessNoteForUser: calc.fairnessNoteForUser,
    fairnessNoteForProvider: calc.fairnessNoteForProvider,
  };

  const trace: AgentTrace = {
    id: `trace-pricing-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'PricingAgent',
    action: 'Calculate dynamic price with fairness checks',
    inputSummary: `provider: ${provider.provider.name} | base: ₨${provider.provider.basePricePerHour} | dist: ${provider.distanceKm}km | urgency: ${intent.urgency}`,
    decision: `₨${pricing.finalEstimate} — budget fit: ${pricing.budgetFit}`,
    rationale: calc.explanation + (pricing.budgetMismatchRecovery ? ' Recovery options available.' : ''),
    confidence: pricing.budgetFit !== 'over_budget' ? 0.93 : 0.6,
    dataUsed: ['provider_base_rate', 'distance_matrix', 'urgency_factor', 'demand_data', 'user_loyalty'],
    nextAction: pricing.budgetFit !== 'over_budget' ? 'SchedulingAgent' : 'Budget recovery options',
    status: pricing.budgetFit !== 'over_budget' ? 'success' : 'warning',
    durationMs: Date.now() - t0,
  };

  return { pricing, trace };
}
