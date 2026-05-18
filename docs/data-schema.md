# Data Schema — Ustaad360

All interfaces are written in TypeScript and live in `src/types/`.

---

## User
```typescript
interface User {
  id: string;
  name: string;
  phone: string;
  city: string;
  preferredLanguage: 'ur' | 'en' | 'roman_ur';
  location: { lat: number; lng: number };
  createdAt: string; // ISO
}
```

---

## Provider
```typescript
interface Provider {
  id: string;
  name: string;
  phone: string;
  city: string;
  location: { lat: number; lng: number };
  serviceCategories: ServiceCategory[];
  skills: string[];
  yearsExperience: number;

  // Ranking inputs
  rating: number;              // 0–5
  reviewCount: number;
  reviewRecencyScore: number;  // 0–1, exponential decay
  onTimeScore: number;         // 0–1
  cancellationRate: number;    // 0–1 (lower = better)

  // Availability
  isAvailable: boolean;
  availableSlots: TimeSlot[];

  // Pricing
  basePricePerHour: number;    // PKR
  minCharge: number;           // PKR flat
  travelChargePerKm: number;   // PKR/km

  verifiedBadge: boolean;
  profilePhotoUrl: string;
  joinedAt: string;
}

type ServiceCategory =
  | 'plumber' | 'electrician' | 'carpenter'
  | 'ac_technician' | 'painter' | 'welder'
  | 'mason' | 'cleaner' | 'mechanic' | 'pest_control';

interface TimeSlot {
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  endTime: string;
  isBooked: boolean;
}
```

---

## Booking
```typescript
interface Booking {
  id: string;
  userId: string;
  providerId: string;
  serviceCategory: ServiceCategory;
  description: string;        // original user request text
  status: BookingStatus;
  scheduledAt: string;        // ISO datetime
  address: string;
  location: { lat: number; lng: number };
  quotedPrice: number;        // PKR
  userBudget: number;         // PKR (from NLU)
  finalPrice: number;         // after negotiation
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash';
  createdAt: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  disputeId?: string;
}

type BookingStatus =
  | 'pending' | 'confirmed' | 'en_route'
  | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
```

---

## Review
```typescript
interface Review {
  id: string;
  bookingId: string;
  userId: string;
  providerId: string;
  rating: number;       // 1–5
  comment: string;
  tags: string[];       // ['punctual', 'skilled', 'clean']
  createdAt: string;
}
```

---

## Dispute
```typescript
interface Dispute {
  id: string;
  bookingId: string;
  raisedBy: 'user' | 'provider';
  reason: string;
  evidence: string[];              // image URLs (mock)
  status: 'open' | 'resolved' | 'escalated';
  resolution?: string;
  agentDecision?: string;          // Gemini output
  createdAt: string;
  resolvedAt?: string;
}
```

---

## AgentTraceEntry
```typescript
interface AgentTraceEntry {
  id: string;
  bookingId: string;
  agentName: AgentName;
  stepNumber: number;
  inputSummary: string;     // 1-line description of what agent received
  outputSummary: string;    // 1-line description of what agent decided
  reasoning: string;        // Gemini chain-of-thought (expandable in UI)
  durationMs: number;
  timestamp: string;
  status: 'success' | 'failure' | 'skipped';
}

type AgentName =
  | 'NLUAgent' | 'DiscoveryAgent' | 'RankingAgent' | 'PricingAgent'
  | 'BookingAgent' | 'ReminderAgent' | 'ReputationAgent' | 'DisputeAgent';
```

---

## IntentResult (NLU Output)
```typescript
interface IntentResult {
  detectedLanguage: string;       // 'urdu' | 'roman_urdu' | 'english' | 'mixed'
  normalizedText: string;         // cleaned, standardized
  serviceCategory: ServiceCategory;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredTime: string;          // natural: 'kal subah'
  preferredTimeISO?: string;      // resolved ISO datetime
  budgetPKR?: number;
  locationHint?: string;
  clarificationNeeded: boolean;
  clarificationQuestion?: string;
}
```

---

## RankedProvider (Ranking Output)
```typescript
interface RankedProvider {
  provider: Provider;
  scores: {
    distance: number;        // 0–1
    travelTime: number;      // 0–1
    availability: number;    // 0–1
    rating: number;          // 0–1
    reviewRecency: number;   // 0–1
    reliability: number;     // 0–1
    priceFit: number;        // 0–1
    skillMatch: number;      // 0–1
    cancellationRate: number;// 0–1 (inverted)
  };
  totalScore: number;        // weighted composite, 0–100
  estimatedPrice: number;    // PKR
  distanceKm: number;
  travelTimeMin: number;
}
```
