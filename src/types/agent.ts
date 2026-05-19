import { Provider } from './index';

export type AgentStatus = 'success' | 'warning' | 'failed' | 'recovered';

export interface AgentTrace {
  id: string;
  timestamp: string;
  agentName: string;
  action: string;
  inputSummary: string;
  decision: string;
  rationale: string;
  confidence: number;
  dataUsed: string[];
  nextAction: string;
  status: AgentStatus;
  durationMs: number;
}

export interface ParsedIntent {
  originalText: string;
  detectedLanguage: 'urdu' | 'roman_urdu' | 'english' | 'mixed';
  confidence: number;
  confidenceExplanation?: string;
  serviceType: string;
  issueSummary: string;
  location: string | null;
  timePreference: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  budgetSensitivity: 'low' | 'medium' | 'high';
  maxBudget?: number;
  jobComplexity: 'basic' | 'intermediate' | 'complex';
  missingFields: string[];
  clarificationQuestion: string | null;
  parsedItems?: ParsedItem[];
}

export type ProviderBadge =
  | 'Best Reliability' | 'Budget Fit' | 'Fastest Arrival'
  | 'Specialist' | 'Low Cancellation Risk' | 'Recent Positive Reviews';

export interface FactorScores {
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

export interface RankedProviderResult {
  provider: Provider;
  finalScore: number;
  factorScores: FactorScores;
  rankingReason: string;
  riskFlags: string[];
  whyRecommended: string;
  whyNotClosestProvider?: string;
  badges: ProviderBadge[];
  estimatedPrice: number;
  distanceKm: number;
  travelTimeMin: number;
}

export interface ParsedItem {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface PricingResult {
  pricingModel: 'service' | 'daily_essential';
  baseRate: number;
  distanceSurcharge: number;
  urgencyMultiplier: number;
  complexityFee: number;
  providerPremium: number;
  demandMultiplier: number;
  loyaltyDiscount: number;
  
  // Daily essentials fields
  itemSubtotal?: number;
  deliveryFee?: number;
  packagingFee?: number;
  items?: ParsedItem[];

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

export interface BookingResult {
  bookingId: string;
  providerId: string;
  scheduledAt: string;
  address: string;
  finalPrice: number;
  paymentMethod: string;
  confirmationCode: string;
  receipt: string;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface FollowUpEvent {
  step: number;
  label: string;
  time: string;
  date: string;
  status: 'done' | 'active' | 'pending';
  note?: string;
  icon: string;
  color: string;
}

export interface BaselineFactorRow {
  factor: string;
  baseline: { used: boolean; value: string; score: number; note: string };
  agentic: { used: boolean; value: string; score: number; note: string };
}

export interface BaselineComparison {
  baselineProvider: Provider | null;
  baselineScore: number;
  agenticScore: number;
  factorRows: BaselineFactorRow[];
}

export interface OrchestratorResult {
  intent: ParsedIntent;
  discoveredProviders: Provider[];
  rankedProviders: RankedProviderResult[];
  baselineProviders: RankedProviderResult[];
  selectedProvider: RankedProviderResult | null;
  pricing: PricingResult | null;
  booking: BookingResult | null;
  followUpTimeline: FollowUpEvent[];
  traces: AgentTrace[];
  baselineComparison: BaselineComparison;
}
