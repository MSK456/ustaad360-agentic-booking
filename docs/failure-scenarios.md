# Failure Scenarios — Ustaad360

## Overview

Ustaad360 is designed to handle failure gracefully at every stage of the pipeline. All failure states produce:
1. A clear user-facing message (no raw errors)
2. A trace log entry with `status: 'warning' | 'failed' | 'recovered'`
3. Recovery options where applicable

---

## Scenario A: Successful Booking (Baseline)

**Input:** `"nala band ho gaya urgent help chahiye 1500 se kam DHA"`

**Pipeline result:**
- IntentAgent: plumber | roman_urdu | high urgency | DHA | confidence 0.92 ✅
- DiscoveryAgent: 4 providers found ✅
- RankingAgent: Ahmed Khan ranked #1 (score 87) ✅
- PricingAgent: ₨1,354 — budget fit: good ✅
- SchedulingAgent: Tomorrow at 09:00 AM ✅
- BookingAgent: B-U360-XXXXX confirmed ✅
- NotificationAgent: WhatsApp queued ✅
- FollowUpAgent: 8-step timeline generated ✅

**User sees:** Booking confirmation with receipt, timeline, trace logs

---

## Scenario B: Budget Mismatch

**Input:** `"500 rupay mein AC gas bharwa do abhi G-13"`

**Pipeline result:**
- IntentAgent: ac_technician | roman_urdu | emergency | G-13 | confidence 0.90 ✅
- DiscoveryAgent: 2 providers found ✅
- RankingAgent: Provider ranked ✅
- PricingAgent: ₨1,896 vs budget ₨500 — ratio 3.79 → **OVER BUDGET** ⚠️
  - Status: `warning`
  - Recovery options generated:
    1. Lower-cost provider (if available, ₨1,200)
    2. Off-peak slot (10% discount)
    3. Basic inspection only (₨600)
    4. Increase budget to ₨1,500+
    5. Human agent escalation

**User sees:** Budget mismatch card in Provider Detail and Booking Confirm, 5 recovery options

---

## Scenario C: Misspelled Mixed Language Input

**Input:** `"Mujhe plmbr chye kal subh DHA"`

**Pipeline result:**
- IntentAgent:
  - Raw: "plmbr" "chye" "subh" 
  - After typo correction: "plumber" "chahiye" "subah"
  - Service: plumber | roman_urdu | medium urgency | DHA | confidence 0.78 ✅
  - Rationale shows: "Typo normalisation applied. Original: plmbr → plumber, chye → chahiye, subh → subah"

**User sees:** Normal provider list — typo correction is transparent in trace log

---

## Scenario D: No Available Provider for Requested Slot

**Input:** `"AC technician chahiye tonight G-13 emergency"`

**Pipeline result:**
- IntentAgent: ac_technician | roman_urdu | emergency | G-13 ✅
- DiscoveryAgent: providers found, but availability for "tonight" is limited ⚠️
- SchedulingAgent: Requested emergency slot unavailable
  - Status: `warning`  
  - Decision: "No providers available for tonight emergency in G-13. Suggested alternative: Tomorrow morning 08:00 AM with same provider"

**User sees:** Warning trace visible in Agent Trace screen, alternative slot suggestion

---

## Scenario E: Provider Cancels After Booking

**Trigger:** Simulated post-booking cancellation

**Pipeline result:**
- Original booking confirmed ✅
- CancellationEvent triggered
- DiscoveryAgent (re-run): Finds backup provider ✅
- RankingAgent: Backup ranked, price lock checked
- PricingAgent: Original price maintained (price lock honored) ✅
- BookingAgent: Booking updated with new provider ✅
- NotificationAgent: "Provider changed" notification queued ✅
- ReputationUpdateAgent: Cancelled provider reliability reduced by 0.05 ⚠️

**Trace shows:** One `recovered` entry — "Backup provider found. Price lock maintained."

**User sees:** Updated booking in Booking Confirm, recovered badge in Agent Trace

---

## Scenario F: Price Dispute

**Trigger:** User submits dispute via Dispute Center

### Sub-scenario F1: Price Dispute
- **Policy:** Price was transparently calculated and within quoted range
- **Decision:** 10% goodwill credit issued
- **Provider action:** None

### Sub-scenario F2: Provider No-Show
- **Policy:** Provider did not arrive as scheduled
- **Decision:** Full refund issued automatically
- **Provider action:** Penalty applied. 2 no-shows → account suspension

### Sub-scenario F3: Quality Complaint
- **Policy:** Quality issues require human review
- **Decision:** Escalated to human mediator (4-hour SLA)
- **Provider action:** Rating frozen pending review

### Sub-scenario F4: Cancellation Refund
- **Policy:** 80% refund, 20% cancellation fee retained
- **Decision:** ₨X × 0.8 refunded
- **Provider action:** None

**DisputeAgent status:** Always `recovered` (issue was handled)

---

## Error Handling in UI

| Error condition | UI response |
|----------------|-------------|
| Low confidence (< 0.7) | Clarification question shown in IntentReview |
| No location detected | "Which area?" prompt in IntentReview |
| No providers found | Empty state with "Try different query" message |
| No booking in store | Provider Detail / BookingConfirm fallback screen with back button |
| Pipeline exception | Error caught silently, store remains in previous state |
| AgentTrace no real run | FALLBACK_TRACES displayed (8 demo entries) |
| DisputeCenter no booking | Booking context card hidden gracefully |

---

## Trace Status Taxonomy

| Status | Meaning | Colour |
|--------|---------|--------|
| `success` | Agent completed normally | Green |
| `warning` | Agent completed but with caveats (budget, no slot) | Amber |
| `failed` | Agent could not complete its task | Red |
| `recovered` | Agent failed but found an alternative | Teal (primary) |
