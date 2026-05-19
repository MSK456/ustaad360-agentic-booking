// ─── Service Categories ───────────────────────────────────────────────────────
export type ServiceCategory =
  | 'plumber' | 'electrician' | 'carpenter'
  | 'ac_technician' | 'painter' | 'welder'
  | 'mason' | 'cleaner' | 'mechanic' | 'pest_control'
  | 'beautician' | 'tutor' | 'driver'
  | 'grocery' | 'fruits_vegetables' | 'meat';

export type Urgency = 'low' | 'medium' | 'high' | 'emergency';
export type BookingStatus =
  | 'pending' | 'confirmed' | 'provider_assigned' | 'en_route'
  | 'in_progress' | 'completed' | 'feedback_pending' | 'feedback_collected' | 'cancelled' | 'disputed';
export type AgentName =
  | 'NLUAgent' | 'DiscoveryAgent' | 'RankingAgent' | 'PricingAgent'
  | 'BookingAgent' | 'ReminderAgent' | 'ReputationAgent' | 'DisputeAgent';

// ─── Entities ─────────────────────────────────────────────────────────────────
export interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Provider {
  id: string;
  name: string;
  phone: string;
  city: string;
  area?: string;
  location: { lat: number; lng: number };
  serviceCategories: ServiceCategory[];
  skills: string[];
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  reviewRecencyScore: number;
  onTimeScore: number;
  cancellationRate: number;
  isAvailable: boolean;
  availableSlots: TimeSlot[];
  basePricePerHour: number;
  minCharge: number;
  travelChargePerKm: number;
  priceTier?: 'budget' | 'standard' | 'premium';
  verifiedBadge: boolean;
  profilePhotoUrl: string;
  joinedAt: string;
  workingHours?: { start: string; end: string };
  isEmergencyAvailable?: boolean;
  emergencyResponseMinutes?: number;
  currentLoad?: number;
  capacityPerDay?: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  city: string;
  preferredLanguage: 'ur' | 'en' | 'roman_ur';
  location: { lat: number; lng: number };
}

export interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceCategory: ServiceCategory;
  description: string;
  status: BookingStatus;
  scheduledAt: string;
  address: string;
  quotedPrice: number;
  userBudget: number;
  finalPrice: number;
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash';
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  traces?: any[];
}

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  rating: number;
  comment: string;
  tags: string[];
  createdAt: string;
}

export interface Dispute {
  id: string;
  bookingId: string;
  raisedBy: 'user' | 'provider';
  reason: string;
  status: 'open' | 'resolved' | 'escalated';
  resolution?: string;
  agentDecision?: string;
  createdAt: string;
}

export interface AgentTraceEntry {
  id: string;
  bookingId: string;
  agentName: AgentName;
  stepNumber: number;
  inputSummary: string;
  outputSummary: string;
  reasoning: string;
  durationMs: number;
  timestamp: string;
  status: 'success' | 'failure' | 'skipped';
}

export interface IntentResult {
  detectedLanguage: string;
  normalizedText: string;
  serviceCategory: ServiceCategory;
  urgency: Urgency;
  preferredTime: string;
  budgetPKR?: number;
  locationHint?: string;
  clarificationNeeded: boolean;
  clarificationQuestion?: string;
}

export interface ProviderScores {
  distance: number;
  travelTime: number;
  availability: number;
  rating: number;
  reviewRecency: number;
  reliability: number;
  priceFit: number;
  skillMatch: number;
  cancellationRate: number;
}

export interface RankedProvider {
  provider: Provider;
  scores: ProviderScores;
  totalScore: number;
  estimatedPrice: number;
  distanceKm: number;
  travelTimeMin: number;
}

export interface PriceBreakdown {
  baseLabour: number;
  complexityMultiplier: number;
  urgencyMultiplier: number;
  travelCharge: number;
  platformFee: number;
  total: number;
  userBudget: number;
  negotiationStatus: 'within_budget' | 'slightly_over' | 'over_budget' | 'mismatch';
  negotiationMessage: string;
}
