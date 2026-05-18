# Ustaad360 — Matching Algorithm (9-Factor Ranking)

## Composite Score Formula

```
TotalScore = Σ (weight_i × normalizedScore_i)   for i = 1..9
```

All individual scores are normalized to **[0, 1]** before weighting.  
Final `TotalScore` is on a **0–100** scale (multiply sum by 100).

---

## The 9 Factors

| # | Factor | Weight | Description |
|---|--------|--------|-------------|
| 1 | Distance | 0.15 | Proximity of provider to job location |
| 2 | Travel Time | 0.10 | Estimated commute time (traffic-aware) |
| 3 | Availability | 0.15 | Slot match to requested time |
| 4 | Rating | 0.20 | Weighted star rating (1–5) |
| 5 | Review Recency | 0.08 | How recent the reviews are |
| 6 | Reliability / On-Time | 0.12 | % of jobs completed on time |
| 7 | Price vs Budget | 0.10 | How well quoted price fits user budget |
| 8 | Skill Specialization | 0.07 | Exact skill match to requested task |
| 9 | Cancellation Rate | 0.03 | Lower cancellation = higher score |

**Total weights = 1.00**

---

## Individual Score Calculations

### 1. Distance Score
```
distanceKm = haversine(userLocation, providerLocation)
distanceScore = max(0, 1 - distanceKm / MAX_DISTANCE_KM)
// MAX_DISTANCE_KM = 20 (beyond 20km = score 0)
```

### 2. Travel Time Score
```
// Simulated using distanceKm × city traffic factor
travelTimeMin = distanceKm × TRAFFIC_FACTOR  // TRAFFIC_FACTOR = 3.5 min/km (Lahore default)
travelTimeScore = max(0, 1 - travelTimeMin / MAX_TRAVEL_MIN)
// MAX_TRAVEL_MIN = 60
```

### 3. Availability Score
```
// Check if provider has a slot matching user's requested time (±2 hours)
if (exactSlotMatch)       availabilityScore = 1.0
else if (nearbySlotMatch) availabilityScore = 0.6
else if (dayMatch)        availabilityScore = 0.3
else                      availabilityScore = 0.0
```

### 4. Rating Score
```
ratingScore = (provider.rating - 1) / 4   // maps [1,5] → [0,1]
// Apply Bayesian smoothing for providers with < 10 reviews:
adjustedRating = (provider.reviewCount × provider.rating + 10 × GLOBAL_MEAN_RATING)
                 / (provider.reviewCount + 10)
ratingScore = (adjustedRating - 1) / 4
```

### 5. Review Recency Score
```
// Exponential decay — recent reviews count more
recencyScore = Σ exp(-λ × daysSinceReview_i) / reviewCount
// λ = 0.02 (half-life ~35 days)
```

### 6. Reliability / On-Time Score
```
reliabilityScore = provider.onTimeScore   // already [0,1] from historical data
```

### 7. Price vs Budget Score
```
quotedPrice = pricingAgent.estimate(provider, intent)
ratio = quotedPrice / userBudget

if (ratio <= 1.0)   priceFitScore = 1.0            // within budget
elif (ratio <= 1.2) priceFitScore = 1 - (ratio-1)/0.2  // up to 20% over: linear decay
else                priceFitScore = 0.0             // over 20%: disqualify
```

### 8. Skill Specialization Score
```
requestedSkills = intentResult.skills   // e.g. ['bore pump repair']
providerSkills = provider.skills

matchCount = intersection(requestedSkills, providerSkills).length
skillScore = matchCount / max(requestedSkills.length, 1)
// Bonus: if provider has specialization badge for this category → +0.1 (capped at 1)
```

### 9. Cancellation Rate Score
```
cancellationScore = 1 - provider.cancellationRate   // lower rate = higher score
// cancellationRate ∈ [0,1]
```

---

## Final Score Computation
```typescript
function computeScore(provider: Provider, intent: IntentResult, user: User): RankedProvider {
  const scores = {
    distance:         w1 * distanceScore(provider, user),
    travelTime:       w2 * travelTimeScore(provider, user),
    availability:     w3 * availabilityScore(provider, intent),
    rating:           w4 * ratingScore(provider),
    reviewRecency:    w5 * recencyScore(provider),
    reliability:      w6 * provider.onTimeScore,
    priceFit:         w7 * priceFitScore(provider, intent),
    skillMatch:       w8 * skillScore(provider, intent),
    cancellationRate: w9 * (1 - provider.cancellationRate),
  };
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0) * 100;
  return { provider, scores, totalScore, ... };
}
```

---

## Tie-Breaking
If two providers have `totalScore` within 2 points:
1. Prefer higher `rating`
2. Prefer closer `distanceKm`
3. Prefer lower `quotedPrice`

---

## Baseline Compare: Simple vs Agentic

| Criterion | Baseline (Simple) | Ustaad360 (Agentic) |
|---|---|---|
| Matching logic | Keyword → category lookup | 9-factor weighted score |
| Language support | English only | All languages + slang |
| Ranking | Random / first available | Multi-factor optimized |
| Pricing | Fixed list price | Dynamic + negotiation |
| Personalization | None | Budget, location, time-aware |
| Transparency | None | Full agent trace |
