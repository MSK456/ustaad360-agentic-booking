# Ustaad360 — Data Schemas

## 1. User
```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  city: string;                  // e.g. "Lahore", "Karachi"
  preferredLanguage: 'ur' | 'en' | 'roman_ur';
  location: GeoPoint;
  createdAt: Timestamp;
}
```

## 2. Provider (Ustaad)
```typescript
interface Provider {
  id: string;
  name: string;
  phone: string;
  city: string;
  location: GeoPoint;
  serviceCategories: ServiceCategory[];  // ['plumber','electrician']
  skills: string[];                       // ['pipe fitting', 'bore repair']
  yearsExperience: number;

  // Ranking factors
  rating: number;                // 0–5, weighted average
  reviewCount: number;
  reviewRecencyScore: number;    // 0–1, decays with time
  onTimeScore: number;           // 0–1, % of on-time arrivals
  cancellationRate: number;      // 0–1, lower is better
  reliabilityScore: number;      // composite (onTime - cancellation)

  // Availability
  isAvailable: boolean;
  availableSlots: TimeSlot[];

  // Pricing
  basePricePerHour: number;      // PKR
  minCharge: number;             // PKR flat minimum
  travelChargePerKm: number;     // PKR/km

  verifiedBadge: boolean;
  profilePhotoUrl: string;
  joinedAt: Timestamp;
}
```

## 3. ServiceCategory
```typescript
type ServiceCategory =
  | 'plumber'
  | 'electrician'
  | 'carpenter'
  | 'ac_technician'
  | 'painter'
  | 'welder'
  | 'mason'
  | 'cleaner'
  | 'mechanic'
  | 'pest_control';
```

## 4. TimeSlot
```typescript
interface TimeSlot {
  date: string;        // 'YYYY-MM-DD'
  startTime: string;   // 'HH:mm'
  endTime: string;
  isBooked: boolean;
}
```

## 5. Booking
```typescript
interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceCategory: ServiceCategory;
  description: string;           // original user request text
  status: BookingStatus;
  scheduledAt: Timestamp;
  address: string;
  location: GeoPoint;
  quotedPrice: number;           // PKR
  userBudget: number;            // PKR (from NLU)
  finalPrice: number;            // after negotiation
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  cancelledAt?: Timestamp;
  cancelReason?: string;
  disputeId?: string;
}

type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'en_route'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'disputed';
```

## 6. Review
```typescript
interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;          // 1–5
  comment: string;
  tags: string[];          // ['punctual','skilled','clean']
  createdAt: Timestamp;
}
```

## 7. Dispute
```typescript
interface Dispute {
  id: string;
  bookingId: string;
  raisedBy: 'user' | 'provider';
  reason: string;
  evidence: string[];           // image URLs
  status: 'open' | 'resolved' | 'escalated';
  resolution?: string;
  agentDecision?: string;       // Gemini dispute agent output
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
}
```

## 8. AgentTraceEntry
```typescript
interface AgentTraceEntry {
  id: string;
  bookingId: string;
  agentName: AgentName;
  stepNumber: number;
  inputSummary: string;         // what the agent received
  outputSummary: string;        // what the agent decided
  reasoning: string;            // Gemini's chain-of-thought
  durationMs: number;
  timestamp: Timestamp;
  status: 'success' | 'failure' | 'skipped';
}

type AgentName =
  | 'NLUAgent'
  | 'DiscoveryAgent'
  | 'RankingAgent'
  | 'PricingAgent'
  | 'BookingAgent'
  | 'ReminderAgent'
  | 'ReputationAgent'
  | 'DisputeAgent';
```

## 9. IntentResult (NLU Output)
```typescript
interface IntentResult {
  detectedLanguage: string;      // 'urdu', 'roman_urdu', 'english', 'mixed'
  normalizedText: string;        // cleaned, standardized text
  serviceCategory: ServiceCategory;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredTime: string;         // natural language: 'kal subah'
  preferredTimeISO?: string;     // resolved ISO datetime
  budgetPKR?: number;
  locationHint?: string;         // 'Gulberg', 'DHA Phase 5'
  clarificationNeeded: boolean;
  clarificationQuestion?: string;
}
```

## 10. RankedProvider (Ranking Output)
```typescript
interface RankedProvider {
  provider: Provider;
  scores: {
    distance: number;         // 0–1
    travelTime: number;       // 0–1
    availability: number;     // 0–1
    rating: number;           // 0–1
    reviewRecency: number;    // 0–1
    reliability: number;      // 0–1
    priceFit: number;         // 0–1
    skillMatch: number;       // 0–1
    cancellationRate: number; // 0–1 (inverted)
  };
  totalScore: number;         // weighted composite 0–100
  estimatedPrice: number;     // PKR
  distanceKm: number;
  travelTimeMin: number;
}
```
