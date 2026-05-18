# Matching Algorithm & Pricing Formula — Ustaad360

---

## Part 1: 9-Factor Matching Algorithm

### Composite Score Formula
```
TotalScore (0–100) = 100 × Σ(weight_i × normalizedScore_i)   for i = 1..9
```

All individual scores normalized to **[0, 1]** before weighting.

### Factor Weights

| # | Factor | Weight | Direction |
|---|--------|--------|-----------|
| 1 | Rating | 0.20 | Higher = better |
| 2 | Distance | 0.15 | Closer = better |
| 3 | Availability | 0.15 | Slot match = better |
| 4 | Reliability / On-Time | 0.12 | Higher = better |
| 5 | Travel Time | 0.10 | Shorter = better |
| 6 | Price vs Budget | 0.10 | Within budget = better |
| 7 | Review Recency | 0.08 | More recent = better |
| 8 | Skill Specialization | 0.07 | Exact match = better |
| 9 | Cancellation Rate | 0.03 | Lower = better |
| **Total** | | **1.00** | |

### Individual Score Formulas

**1. Distance Score**
```
distanceKm = haversine(userLocation, providerLocation)
distanceScore = max(0, 1 - distanceKm / 20)
// 20km cap — beyond that scores 0
```

**2. Travel Time Score**
```
travelTimeMin = distanceKm × 3.5   // 3.5 min/km (city traffic)
travelTimeScore = max(0, 1 - travelTimeMin / 60)
// 60 min cap
```

**3. Availability Score**
```
exactSlotMatch  → 1.0
nearbySlot (±2h) → 0.6
sameDay          → 0.3
unavailable      → 0.0
```

**4. Rating Score (Bayesian-smoothed)**
```
// Prevents providers with 1 review gaming the score
adjustedRating = (reviewCount × rating + 10 × globalMean) / (reviewCount + 10)
ratingScore = (adjustedRating - 1) / 4    // maps [1,5] → [0,1]
```

**5. Review Recency Score**
```
recencyScore = mean( exp(-0.02 × daysSinceReview_i) )
// λ = 0.02 → half-life ≈ 35 days
```

**6. Reliability Score**
```
reliabilityScore = provider.onTimeScore   // historical [0,1]
```

**7. Price Fit Score**
```
ratio = estimatedPrice / userBudget
if ratio ≤ 1.0:  priceFitScore = 1.0
elif ratio ≤ 1.2: priceFitScore = 1 - (ratio - 1) / 0.2
else:             priceFitScore = 0.0
```

**8. Skill Match Score**
```
skillScore = |intersection(requestedSkills, providerSkills)| / |requestedSkills|
// +0.1 bonus if provider has specialization badge (capped at 1.0)
```

**9. Cancellation Rate Score**
```
cancellationScore = 1 - provider.cancellationRate
```

### Tie-Breaking (scores within 2 points)
1. Higher `rating`
2. Shorter `distanceKm`
3. Lower `estimatedPrice`

---

## Part 2: Dynamic Pricing Formula

### Formula
```
QuotedPrice = (BaseLabour × ComplexityMultiplier × UrgencyMultiplier)
            + TravelCharge
            + PlatformFee (5%)

Where:
  BaseLabour           = max(minCharge, hourlyRate × estimatedHours)
  ComplexityMultiplier = 1.0 – 3.0 (from NLU keyword analysis)
  UrgencyMultiplier    = { low:1.0, medium:1.1, high:1.3, emergency:1.6 }
  TravelCharge         = distanceKm × provider.travelChargePerKm
  PlatformFee          = subtotal × 0.05
```

### Base Price Table (PKR)

| Service | Min Charge | Hourly Rate |
|---|---|---|
| Plumber | ₨500 | ₨800/hr |
| Electrician | ₨600 | ₨900/hr |
| Carpenter | ₨700 | ₨1,000/hr |
| AC Technician | ₨1,000 | ₨1,200/hr |
| Painter | ₨800 | ₨700/hr |
| Welder | ₨800 | ₨1,100/hr |
| Mason | ₨900 | ₨1,000/hr |
| Cleaner | ₨400 | ₨500/hr |
| Mechanic | ₨700 | ₨1,000/hr |
| Pest Control | ₨1,500 | flat |

### Complexity Detection (via NLU)

| Signal | Multiplier |
|---|---|
| "thoda sa", "chhoti si" | 1.0 |
| "repair", "theek karo" | 1.2 |
| "toot gaya" | 1.5 |
| "leak", "paani aa raha" | 1.7 |
| "bilkul nahi chal raha" | 2.0 |
| "burst", "short circuit", "emergency" | 2.5 |

### Price Breakdown Display
```
Base Labour:         ₨1,200
Complexity (×1.5):   ₨600
Travel Charge:        ₨150
──────────────────────────
Subtotal:            ₨1,950
Platform Fee (5%):   ₨98
──────────────────────────
Total Quoted:        ₨2,048
Your Budget:         ₨2,000

⚠️ Slightly over by ₨48 — proceeding (within 2%)
```

### Negotiation Logic
```typescript
function negotiate(quoted: number, budget: number): NegotiationResult {
  const ratio = quoted / budget;
  if (ratio <= 1.0)  return { accepted: true,  message: 'Within budget ✅' };
  if (ratio <= 1.2)  return { accepted: true,  message: `Slightly over by ₨${quoted-budget}` };
  if (ratio <= 1.5)  return { accepted: false, action: 'suggest_alternatives' };
  return              { accepted: false, action: 'hard_reject' };
}
```

### Failure Scenario: Budget Mismatch
- User: *"500 rupay mein AC gas bharwa do"*
- Budget extracted: ₨500 | Quoted: ₨1,800 | Ratio: 3.6
- PricingAgent → `hard_reject`
- Agent reply: *"Maafi chahta hoon, AC gas refill ki minimum cost ₨1,200 hai. Kya aap ₨1,200 mein proceed karna chahenge?"*
- Trace: `PricingAgent → FAILURE → budget_mismatch`

---

## Baseline Compare: Simple vs Agentic

| Criterion | Simple System | Ustaad360 Agentic |
|---|---|---|
| Language | English only | All + slang |
| Matching factors | 0 (random) | 9 weighted |
| Price | Fixed list | Dynamic formula |
| Budget negotiation | ❌ | ✅ |
| Failure handling | Crash / blank | Graceful + explanation |
| Transparency | None | Full agent trace |
| Multilingual | ❌ | ✅ |
