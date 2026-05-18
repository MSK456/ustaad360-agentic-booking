# Ustaad360 — Pricing Formula

## Philosophy
Pricing must be:
- **Transparent**: User sees a full breakdown
- **Dynamic**: Adapts to urgency, distance, complexity
- **Negotiable**: AI agent can adjust within policy bounds
- **Pakistan-realistic**: PKR ranges match informal market rates

---

## Base Price Table (PKR)

| Service | Min Charge | Hourly Rate | Complexity Multipliers |
|---|---|---|---|
| Plumber | 500 | 800/hr | pipe burst ×2.0, tap fix ×1.0 |
| Electrician | 600 | 900/hr | wiring ×1.8, switch fix ×1.0 |
| Carpenter | 700 | 1000/hr | furniture repair ×1.5, door fix ×1.2 |
| AC Technician | 1000 | 1200/hr | gas refill ×2.5, service ×1.0 |
| Painter | 800 | 700/hr | per wall/room pricing |
| Welder | 800 | 1100/hr | heavy job ×2.0 |
| Mason | 900 | 1000/hr | construction ×2.5 |
| Cleaner | 400 | 500/hr | deep clean ×1.8 |
| Mechanic | 700 | 1000/hr | engine job ×3.0 |
| Pest Control | 1500 | flat rate | per room ×500 |

---

## Dynamic Pricing Formula

```
QuotedPrice = (BasePrice × ComplexityMultiplier × UrgencyMultiplier)
            + TravelCharge
            + PlatformFee

Where:
  BasePrice            = max(MinCharge, HourlyRate × estimatedHours)
  ComplexityMultiplier = derived from keywords in user request (1.0 – 3.0)
  UrgencyMultiplier    = { low: 1.0, medium: 1.1, high: 1.3, emergency: 1.6 }
  TravelCharge         = distanceKm × provider.travelChargePerKm
  PlatformFee          = QuotedPrice × 0.05   (5% platform margin, shown to user)
```

---

## Complexity Detection (via NLU Agent)
The NLU agent extracts complexity signals from the request text:

| Signal Phrase | Complexity Multiplier |
|---|---|
| "thoda sa" / "chhoti si problem" | 1.0 (minor) |
| "repair", "theek karo" | 1.2 |
| "toot gaya", "broke" | 1.5 |
| "leak", "paani aa raha hai" | 1.7 |
| "completely dead", "bilkul nahi chal raha" | 2.0 |
| "burst", "shorted", "emergency" | 2.5+ |

---

## Price Breakdown Display (shown to user)

```
Base Labour:        ₨1,200
Complexity (×1.5):  ₨600
Travel Charge:      ₨150
Platform Fee (5%):  ₨98
─────────────────────────
Total Quoted:       ₨2,048
Your Budget:        ₨2,000

✅ Within budget range — proceeding with booking
```

---

## Negotiation Logic

```typescript
function negotiate(quotedPrice: number, userBudget: number): NegotiationResult {
  const ratio = quotedPrice / userBudget;

  if (ratio <= 1.0) {
    return { accepted: true, finalPrice: quotedPrice, message: 'Within your budget ✅' };
  }

  if (ratio <= 1.2) {
    // Within 20% over — auto-accept with message
    return {
      accepted: true,
      finalPrice: quotedPrice,
      message: `Slightly over budget by ₨${quotedPrice - userBudget}. Proceeding — provider quality justifies cost.`
    };
  }

  if (ratio <= 1.5) {
    // Try to find cheaper provider in ranked list
    return {
      accepted: false,
      finalPrice: null,
      message: 'Over budget. Showing lower-cost alternatives.',
      action: 'suggest_alternatives'
    };
  }

  // Over 50% above budget — hard reject, explain
  return {
    accepted: false,
    finalPrice: null,
    message: `Budget mismatch: quoted ₨${quotedPrice}, your budget ₨${userBudget}. Suggesting next available provider.`,
    action: 'next_provider'
  };
}
```

---

## Failure Scenario: Budget Mismatch
- User says: **"500 rupay mein AC theek karo"** (fix AC for 500 PKR)
- NLU extracts budget: ₨500, service: ac_technician
- Pricing agent quotes: ₨1,800 (gas refill + travel)
- Negotiation: ratio = 3.6 → hard reject
- Agent response: "Maafi chahta hoon, AC gas refill ki minimum cost ₨1,200 hai. Kya aap ₨1,200 mein proceed karna chahenge?"
- Trace shows: PricingAgent → FAILURE → budget_mismatch → user offered alternatives

---

## Scalability Note
- For production: pricing can be connected to a real-time materials cost API
- Platform fee (5%) is configurable per city/service via admin panel
- Surge pricing (×1.2–1.5) can activate during peak hours or rain/monsoon season
