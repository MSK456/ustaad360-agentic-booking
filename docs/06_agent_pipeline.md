# Ustaad360 — Agent Pipeline

## Overview
The agent pipeline is a sequential, orchestrated chain of 8 specialized AI agents. Each agent has a single responsibility, a defined Gemini system prompt, and writes a trace entry after every execution. The Orchestrator coordinates the chain and handles failures.

---

## Agent 1: NLU Agent
**Trigger:** User submits natural language input  
**Input:** Raw text string (any language)  
**Output:** `IntentResult` JSON  

**Gemini Prompt Strategy:**
```
System: You are a multilingual intent extraction agent for a Pakistani home services platform.
You understand Urdu, Roman Urdu, English, mixed language, slang, and misspellings.
Extract: service type, urgency, time preference, budget, location hint.
Return structured JSON only.

Slang mappings:
- "biji" / "bijli" → electrician
- "nala" / "nala band" → plumber
- "darwaza" → carpenter
- "AC theek" → ac_technician
- "rang" / "painting" → painter
- "abhi chahiye" → urgency: emergency
- "kal subah" → tomorrow morning
```

**Failure Handling:** If confidence < 0.6, set `clarificationNeeded: true` and generate a clarifying question.

---

## Agent 2: Discovery Agent
**Trigger:** After valid `IntentResult`  
**Input:** `IntentResult` (serviceCategory, city, time)  
**Output:** List of `Provider[]` (raw, unranked)  

**Logic:**
1. Filter mock DB by `serviceCategory`
2. Filter by `city` match
3. Filter by slot availability at `preferredTimeISO`
4. Return up to 20 candidates

**Failure:** If 0 providers found → trigger failure scenario flow

---

## Agent 3: Ranking Agent
**Trigger:** After discovery returns candidates  
**Input:** `Provider[]` + `IntentResult` + `User.location`  
**Output:** `RankedProvider[]` (sorted by `totalScore` desc)  

**Logic:** Apply 9-factor weighted scoring (see `07_matching_algorithm.md`)  
**Top 3** presented to user; full list available on demand.

---

## Agent 4: Pricing Agent
**Trigger:** User selects or confirms top provider  
**Input:** `RankedProvider` + `IntentResult.budgetPKR`  
**Output:** `{ quotedPrice, breakdown, negotiatedPrice, accepted }`  

**Logic:** See `08_pricing_formula.md`  
**Negotiation:** If quoted > budget × 1.2 → suggest alternatives; if within 20% → auto-accept with note.

---

## Agent 5: Booking Agent
**Trigger:** After price accepted  
**Input:** `Provider`, `IntentResult`, `finalPrice`, `User`  
**Output:** `Booking` object (status: `confirmed`)  

**Logic:**
1. Create booking record in Firestore
2. Mark provider slot as booked
3. Generate booking confirmation message (in user's language)
4. Return `Booking` with ID

---

## Agent 6: Reminder Agent
**Trigger:** After booking confirmed  
**Input:** `Booking` (scheduledAt)  
**Output:** Scheduled notifications  

**Logic:**
1. Schedule push notification 24h before
2. Schedule push notification 1h before
3. Schedule SMS simulation at booking time
4. For demo: show simulated notification instantly

---

## Agent 7: Reputation Agent
**Trigger:** After `Booking.status = completed` + review submitted  
**Input:** `Review` + `Provider` current scores  
**Output:** Updated provider score fields  

**Logic:**
1. Recalculate `rating` (weighted rolling average, recent reviews count more)
2. Update `reviewRecencyScore`
3. Update `onTimeScore` (did provider arrive on time?)
4. Write updated scores to Firestore

---

## Agent 8: Dispute Agent
**Trigger:** User or provider files dispute  
**Input:** `Dispute` + `Booking` + `Review`  
**Output:** `resolution` string + `status` update  

**Gemini Prompt Strategy:**
```
System: You are a fair dispute mediator for a Pakistan home services platform.
Analyze the dispute reason, booking details, and any prior reviews.
Apply these policies:
- If provider cancelled < 2h before: user gets credit
- If work quality disputed: issue partial refund recommendation
- If user no-show: provider gets cancellation fee
Return a fair resolution in simple Urdu/English.
```

---

## Orchestrator
**File:** `src/agents/orchestrator.ts`

```typescript
async function runAgentPipeline(userInput: string, user: User) {
  const trace: AgentTraceEntry[] = [];

  // Step 1: NLU
  const intent = await nluAgent.run(userInput, trace);
  if (intent.clarificationNeeded) return { clarification: intent.clarificationQuestion };

  // Step 2: Discovery
  const providers = await discoveryAgent.run(intent, user, trace);
  if (providers.length === 0) return { failure: 'no_providers' };

  // Step 3: Ranking
  const ranked = await rankingAgent.run(providers, intent, user, trace);

  // Step 4: Pricing (after user selects provider)
  // ... user selection event ...
  const pricing = await pricingAgent.run(selectedProvider, intent, trace);

  // Step 5: Booking (after user confirms)
  const booking = await bookingAgent.run(selectedProvider, intent, pricing, user, trace);

  // Step 6: Reminders
  await reminderAgent.run(booking, trace);

  return { booking, trace };
}
```

---

## Trace Log Flow
Every agent call appends an `AgentTraceEntry`:
- **agentName** — which agent ran
- **inputSummary** — 1-line description of input
- **outputSummary** — 1-line description of result
- **reasoning** — Gemini's chain-of-thought (collapsed by default in UI)
- **durationMs** — latency
- **status** — success / failure / skipped
