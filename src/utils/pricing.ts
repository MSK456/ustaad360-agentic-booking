import { ParsedItem, PricingResult } from '../types/agent';

export interface PricingInput {
  serviceType: string;
  baseRate: number;
  distanceKm: number;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  complexity: 'basic' | 'intermediate' | 'complex';
  providerPremium?: number;
  isHighDemand?: boolean;
  isReturningUser?: boolean;
  userBudget?: number;
  items?: ParsedItem[];
  afterHoursFee?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────
const URGENCY_MULT     = { low: 1.0, medium: 1.0, high: 1.3, emergency: 1.5 };
const DEMAND_MULT_HIGH = 1.15;
const LOYALTY_DISC     = 50;

function getComplexityFee(serviceType: string, complexity: string): number {
  if (['grocery', 'fruits_vegetables', 'meat'].includes(serviceType)) return 0;
  
  if (complexity === 'basic') return 0;
  
  if (complexity === 'intermediate') {
    if (['plumber', 'electrician'].includes(serviceType)) return 400;
    if (['ac_technician', 'mechanic'].includes(serviceType)) return 600;
    if (['beautician'].includes(serviceType)) return 800;
    return 300;
  }
  
  // complex
  if (['plumber', 'electrician'].includes(serviceType)) return 1000;
  if (['ac_technician', 'mechanic'].includes(serviceType)) return 2000;
  return 1500;
}

export function calculatePrice(input: PricingInput): PricingResult {
  const isDailyEssential = ['grocery', 'fruits_vegetables', 'meat'].includes(input.serviceType);

  let distanceSurcharge = 0;
  if (isDailyEssential) {
    distanceSurcharge = Math.max(0, input.distanceKm - 2) * 25;
    distanceSurcharge = Math.min(distanceSurcharge, 200); // cap at 200
  } else {
    distanceSurcharge = Math.max(0, input.distanceKm - 3) * 30;
    distanceSurcharge = Math.min(distanceSurcharge, 250); // cap at 250
  }

  const urgencyMultiplier = URGENCY_MULT[input.urgency];
  const complexityFee     = getComplexityFee(input.serviceType, input.complexity);
  const providerPremium   = input.providerPremium ?? 0;
  const demandMultiplier  = input.isHighDemand ? DEMAND_MULT_HIGH : 1.0;
  const loyaltyDiscount   = input.isReturningUser ? LOYALTY_DISC : 0;

  let finalEstimate = 0;
  let explanation = '';
  
  let itemSubtotal = 0;
  let deliveryFee = 0;
  let packagingFee = 0;

  if (isDailyEssential) {
    itemSubtotal = input.items?.reduce((sum, item) => sum + item.subtotal, 0) || 0;
    deliveryFee = Math.round(distanceSurcharge);
    packagingFee = 50;

    let subtotal = (itemSubtotal + deliveryFee + packagingFee) * urgencyMultiplier * demandMultiplier;
    finalEstimate = Math.round(subtotal - loyaltyDiscount + (input.afterHoursFee || 0));

    explanation = 
      `Items ₨${itemSubtotal}` +
      ` + delivery ₨${deliveryFee}` +
      ` + packaging ₨${packagingFee}` +
      ` × urgency ${urgencyMultiplier}` +
      (input.isHighDemand ? ' × demand 1.15' : '') +
      (loyaltyDiscount ? ` − loyalty ₨${loyaltyDiscount}` : '') +
      (input.afterHoursFee ? ` + emergency fee ₨${input.afterHoursFee}` : '') +
      ` = ₨${finalEstimate}`;
  } else {
    let subtotal =
      (input.baseRate + Math.round(distanceSurcharge) + complexityFee + providerPremium)
      * urgencyMultiplier
      * demandMultiplier;
      
    finalEstimate = Math.round(subtotal - loyaltyDiscount + (input.afterHoursFee || 0));

    explanation =
      `Base ₨${input.baseRate}` +
      ` + travel ₨${Math.round(distanceSurcharge)}` +
      ` + complexity ₨${complexityFee}` +
      (providerPremium ? ` + premium ₨${providerPremium}` : '') +
      ` × urgency ${urgencyMultiplier}` +
      (input.isHighDemand ? ' × demand 1.15' : '') +
      (loyaltyDiscount ? ` − loyalty ₨${loyaltyDiscount}` : '') +
      (input.afterHoursFee ? ` + emergency fee ₨${input.afterHoursFee}` : '') +
      ` = ₨${finalEstimate}`;
  }

  // Budget fit
  let budgetFit: PricingResult['budgetFit'] = 'unknown';
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

  // Recovery suggestions when over budget
  let recoveryOptions: string[] | undefined;
  if (budgetFit === 'over_budget') {
    if (isDailyEssential) {
      recoveryOptions = [
        'Reduce the quantity of items',
        'Choose a lower-cost vendor',
        'Increase your budget to ₨' + Math.round(finalEstimate * 1.05),
      ];
    } else {
      recoveryOptions = [
        'Choose a lower-cost provider from the ranked list',
        'Book an off-peak morning slot to avoid demand surcharge',
        'Reduce scope to basic inspection first',
        'Increase your budget to ₨' + Math.round(finalEstimate * 1.05),
      ];
    }
  }

  return {
    pricingModel: isDailyEssential ? 'daily_essential' : 'service',
    baseRate: input.baseRate,
    distanceSurcharge: Math.round(distanceSurcharge),
    urgencyMultiplier,
    complexityFee,
    providerPremium,
    demandMultiplier,
    loyaltyDiscount,
    
    itemSubtotal,
    deliveryFee,
    packagingFee,
    items: input.items,
    afterHoursFee: input.afterHoursFee,

    finalEstimate,
    fairnessNoteForUser: isDailyEssential ? 'Prices are verified against Islamabad Mandi rates.' : 'Final quote protected by Ustaad360 Fair Price Guarantee.',
    fairnessNoteForProvider: 'Estimated total payout includes performance bonuses.',
    budgetFit,
    userBudget: input.userBudget,
    gapAmount: gapAmount > 0 ? gapAmount : undefined,
    gapPercent: gapPercent > 0 ? gapPercent : undefined,
    isBudgetMismatch: budgetFit === 'over_budget',
    explanation,
    recoveryOptions,
  };
}
