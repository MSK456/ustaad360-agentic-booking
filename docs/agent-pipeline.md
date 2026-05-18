# Agent Pipeline — Ustaad360

## Pipeline Overview
8 specialized AI agents are orchestrated sequentially. Each agent has a single responsibility, a dedicated Gemini system prompt, and writes a trace entry after execution.

---

## Agent 1 — NLU Agent
**File:** `src/agents/nluAgent.ts`  
**Trigger:** User submits natural language input  
**Input:** Raw text string  
**Output:** `IntentResult` JSON  

**System Prompt (abbreviated):**
```
You are a multilingual intent extraction agent for a Pakistani home services platform.
Understand Urdu, Roman Urdu, English, mixed language, slang, and misspellings.
Extract: service_type, urgency, preferred_time, budget_pkr, location_hint.
Return valid JSON only. If confidence < 0.6, set clarification_needed: true.

Slang mappings:
- "biji/bijli" → electrician
- "nala/nala band" → plumber
- "darwaza" → carpenter
- "AC theek" → ac_technician
- "abhi chahiye" → urgency: emergency
```

**Failure:** Sets `clarification_needed: true` → app shows clarification dialog.

---

## Agent 2 — Discovery Agent
**File:** `src/agents/discoveryAgent.ts`  
**Input:** `IntentResult`  
**Output:** `Provider[]` (unranked, up to 20)  

**Logic:**
1. Filter by `serviceCategory`
2. Filter by `city`
3. Filter by slot availability within ±2 hours of `preferredTimeISO`

**Failure:** 0 results → Orchestrator triggers no-provider failure flow.

---

## Agent 3 — Ranking Agent
**File:** `src/agents/rankingAgent.ts`  
**Input:** `Provider[]` + `IntentResult` + `User.location`  
**Output:** `RankedProvider[]` sorted by `totalScore` descending  

**Logic:** 9-factor weighted scoring (see `matching-pricing.md`)  
Returns top 3 to UI; full list collapsible.

---

## Agent 4 — Pricing Agent
**File:** `src/agents/pricingAgent.ts`  
**Input:** Selected `RankedProvider` + `IntentResult.budgetPKR`  
**Output:** `{ quotedPrice, breakdown, negotiatedPrice, negotiationResult }`  

**Negotiation tiers:**
| Ratio (quoted/budget) | Outcome |
|---|---|
| ≤ 1.0 | ✅ Within budget — proceed |
| 1.0–1.2 | ⚠️ Slightly over — auto-accept with note |
| 1.2–1.5 | 🔄 Over budget — suggest cheaper alternatives |
| > 1.5 | ❌ Mismatch — hard reject with explanation |

---

## Agent 5 — Booking Agent
**File:** `src/agents/bookingAgent.ts`  
**Input:** Provider + intent + pricing + user  
**Output:** `Booking` object (status: `confirmed`)  

**Logic:**
1. Write booking record to Firestore
2. Mark provider slot as booked
3. Generate confirmation message in user's language
4. Return `Booking` with unique ID

---

## Agent 6 — Reminder Agent
**File:** `src/agents/reminderAgent.ts`  
**Input:** `Booking`  
**Output:** Scheduled notifications  

**Notifications scheduled:**
- 24 hours before appointment
- 1 hour before appointment
- At appointment time (SMS simulation)
- Demo: simulated notification shown immediately

---

## Agent 7 — Reputation Agent
**File:** `src/agents/reputationAgent.ts`  
**Trigger:** `Booking.status = completed` + review submitted  
**Input:** `Review` + current `Provider` scores  
**Output:** Updated provider score fields  

**Recalculations:**
- `rating`: Bayesian rolling average (recent reviews weighted more)
- `reviewRecencyScore`: exponential decay (λ = 0.02)
- `onTimeScore`: updated from booking punctuality flag
- `cancellationRate`: rolling 90-day window

---

## Agent 8 — Dispute Agent
**File:** `src/agents/disputeAgent.ts`  
**Trigger:** User or provider files dispute  
**Input:** `Dispute` + `Booking` + `Review`  
**Output:** Resolution text + status update  

**System Prompt (abbreviated):**
```
You are a fair dispute mediator for a Pakistan home services platform.
Policies:
- Provider cancelled < 2h before: user gets platform credit
- Work quality disputed: recommend partial refund
- User no-show: provider receives cancellation fee
Return a fair, empathetic resolution in simple Urdu/English.
```

---

## Orchestrator
**File:** `src/agents/orchestrator.ts`

```typescript
async function runBookingPipeline(input: string, user: User) {
  const trace: AgentTraceEntry[] = [];

  const intent = await nluAgent.run(input, trace);
  if (intent.clarificationNeeded) return { clarify: intent.clarificationQuestion };

  const providers = await discoveryAgent.run(intent, user, trace);
  if (!providers.length) return { failure: 'no_providers', trace };

  const ranked = await rankingAgent.run(providers, intent, user, trace);
  // UI shows ranked list — user selects provider

  const pricing = await pricingAgent.run(selectedProvider, intent, trace);
  if (!pricing.accepted) return { failure: 'budget_mismatch', pricing, trace };

  const booking = await bookingAgent.run(selectedProvider, intent, pricing, user, trace);
  await reminderAgent.run(booking, trace);

  return { booking, ranked, trace };
}
```

---

## Failure Scenarios

| Scenario | Trigger | Agent Response |
|---|---|---|
| No providers | 0 results from Discovery | "Abhi koi available nahi — time change karein?" |
| Budget mismatch | Pricing ratio > 1.5 | "Budget se zyada hai — alternatives dikhata hoon" |
| Provider cancels | Status → cancelled | "Ahmed ne cancel kar diya — naya ustaad dhundh raha hoon" |
| Ambiguous input | NLU confidence < 0.6 | Clarification question in user's language |

All failures are highlighted in red on the Agent Trace screen.
