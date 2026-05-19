export interface PricingInput {
  baseRate: number;
  distanceKm: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  complexity: 'basic' | 'intermediate' | 'complex';
  providerPremium?: number;
  isHighDemand?: boolean;
  isReturningUser?: boolean;
  userBudget?: number;
}

export interface PricingOutput {
  baseRate: number;
  distanceSurcharge: number;
  urgencyMultiplier: number;
  complexityFee: number;
  providerPremium: number;
  demandMultiplier: number;
  loyaltyDiscount: number;
  finalEstimate: number;
  fairnessNoteForUser: string;
  fairnessNoteForProvider: string;
  budgetFit: 'unknown' | 'within_budget' | 'slightly_over' | 'over_budget';
  userBudget?: number;
  gapAmount?: number;
  gapPercent?: number;
  isBudgetMismatch: boolean;
  explanation: string;
  recoveryOptions?: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────
const COMPLEXITY_FEE   = { basic: 0, intermediate: 600, complex: 1200 };
const URGENCY_MULT     = { low: 1.0, medium: 1.0, high: 1.3, emergency: 1.5 };
const DISTANCE_FREE_KM = 2;
const DISTANCE_RATE    = 60;   // Rs per km after first 2km
const DEMAND_MULT_HIGH = 1.15;
const LOYALTY_DISC     = 100;

export function calculatePrice(input: PricingInput): PricingOutput {
  const distanceSurcharge = Math.max(0, input.distanceKm - DISTANCE_FREE_KM) * DISTANCE_RATE;
  const urgencyMultiplier = URGENCY_MULT[input.urgency];
  const complexityFee     = COMPLEXITY_FEE[input.complexity];
  const providerPremium   = input.providerPremium ?? 0;
  const demandMultiplier  = input.isHighDemand ? DEMAND_MULT_HIGH : 1.0;
  const loyaltyDiscount   = input.isReturningUser ? LOYALTY_DISC : 0;

  const subtotal =
    (input.baseRate + Math.round(distanceSurcharge) + complexityFee + providerPremium)
    * urgencyMultiplier
    * demandMultiplier;

  const finalEstimate = Math.round(subtotal - loyaltyDiscount);

  // Budget fit
  let budgetFit: PricingOutput['budgetFit'] = 'unknown';
  let gapAmount = 0;
  let gapPercent = 0;

  if (input.userBudget) {
    if (finalEstimate <= input.userBudget) {
      budgetFit = 'within_budget';
    } else if (finalEstimate <= input.userBudget * 1.15) {
      budgetFit = 'slightly_over';
    } else {
      budgetFit = 'over_budget';
    }

    if (finalEstimate > input.userBudget) {
      gapAmount = finalEstimate - input.userBudget;
      gapPercent = Math.round((gapAmount / input.userBudget) * 100);
    }
  }

  const explanation =
    `Base ₨${input.baseRate}` +
    ` + travel ₨${Math.round(distanceSurcharge)}` +
    ` + complexity ₨${complexityFee}` +
    (providerPremium ? ` + premium ₨${providerPremium}` : '') +
    ` × urgency ${urgencyMultiplier}` +
    (input.isHighDemand ? ' × demand 1.15' : '') +
    (loyaltyDiscount ? ` − loyalty ₨${loyaltyDiscount}` : '') +
    ` = ₨${finalEstimate}`;

  // Recovery suggestions when over budget
  const recoveryOptions: string[] | undefined = budgetFit === 'over_budget' ? [
    'Choose a lower-cost provider from the ranked list',
    'Book an off-peak morning slot to avoid demand surcharge',
    'Reduce scope to basic inspection first',
    'Increase your budget to ₨' + Math.round(finalEstimate * 1.05),
    'Request human escalation for a custom quote',
  ] : undefined;

  return {
    baseRate: input.baseRate,
    distanceSurcharge: Math.round(distanceSurcharge),
    urgencyMultiplier,
    complexityFee,
    providerPremium,
    demandMultiplier,
    loyaltyDiscount,
    finalEstimate,
    fairnessNoteForUser:
      `This price was calculated transparently using distance, urgency, and job complexity. Platform fee of 5% is included.`,
    fairnessNoteForProvider:
      `Provider receives ₨${Math.round(finalEstimate * 0.85)} after platform fee. Premium is added for providers with rating ≥ 4.5.`,
    budgetFit,
    userBudget: input.userBudget,
    gapAmount,
    gapPercent,
    isBudgetMismatch: budgetFit === 'over_budget',
    explanation,
    recoveryOptions,
  };
}
