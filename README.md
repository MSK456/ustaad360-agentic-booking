# Ustaad360 — Agentic Home Services Booking Platform

> **AI-powered, multilingual booking system with a local 10-agent orchestration pipeline, transparent decision rationale, and fully offline demo mode.**

---

## Problem Statement

Booking a home service in Pakistan (or any emerging market) is broken:
- Workers are discovered via WhatsApp groups and word-of-mouth
- No standardised pricing — every job is a negotiation
- No reliability data — you don't know if the provider will show up
- Language barrier — apps are English-only; customers speak Urdu, Roman Urdu, or mixed
- No dispute resolution — if something goes wrong, you're on your own

## What Ustaad360 Does

Ustaad360 is **not** a listing app. It is an **agentic booking platform** that:

1. Understands your request in **Urdu, Roman Urdu, English, or mixed-language input** — including typos
2. **Discovers** available service providers matching your criteria
3. **Ranks** them using a **10-factor weighted formula** (not just distance)
4. **Calculates a fair dynamic price** with full transparency and budget-fit detection
5. **Schedules** the optimal time slot and **confirms a booking** automatically
6. **Sends simulated notifications** (WhatsApp, SMS, calendar)
7. **Tracks** the full service lifecycle via a follow-up timeline
8. **Handles disputes** automatically using an AI mediator agent
9. **Logs every decision** so users and judges can see the full chain of reasoning

---

## Why This Is Agentic, Not Just a Booking App

A traditional booking app shows a list and lets you pick. Ustaad360 runs a **10-step autonomous agent pipeline**:

| Step | Agent | Role |
|------|-------|------|
| 1 | **IntentAgent** | Multilingual NLU — parses service, urgency, location, budget, time |
| 2 | **DiscoveryAgent** | Filters provider pool by service, availability, location |
| 3 | **RankingAgent** | Scores all providers on 10 weighted factors |
| 4 | **PricingAgent** | Dynamic pricing: base + distance + urgency + complexity + demand − loyalty |
| 5 | **SchedulingAgent** | Picks optimal slot with travel buffer |
| 6 | **BookingAgent** | Creates booking record with receipt and confirmation code |
| 7 | **NotificationAgent** | Queues WhatsApp/SMS/calendar notifications |
| 8 | **FollowUpAgent** | Builds 8-step lifecycle timeline |
| 9 | **DisputeAgent** | Evaluates price/no-show/quality disputes with policy |
| 10 | **ReputationUpdateAgent** | Adjusts provider reliability scores post-service |

Every agent logs a **trace entry**: action taken, data used, confidence score, decision rationale, and next step. Nothing is hidden.

---

## Architecture

```
User Input (any language)
        │
        ▼
  [IntentAgent] ──────────────────── Typo correction + NLU classification
        │
        ▼
  [DiscoveryAgent] ─────────────────  Filter by service/location/availability
        │
        ▼
  [RankingAgent] ──────────────────── 10-factor weighted scoring
        │
        ▼
  [PricingAgent] ──────────────────── Dynamic price + budget fit check
        │
        ▼
  [SchedulingAgent] ───────────────── Time slot selection + travel buffer
        │
        ▼
  [BookingAgent] ──────────────────── Record creation + receipt
        │
        ├── [NotificationAgent] ───── WhatsApp/SMS/calendar simulation
        │
        ├── [FollowUpAgent] ─────────  8-step lifecycle timeline
        │
        ├── [DisputeAgent] ──────────  On-demand dispute resolution
        │
        └── [ReputationUpdateAgent] ─ Provider score update
```

**State management:** Zustand (`useAgentStore`)  
**Navigation:** React Navigation (Stack + Bottom Tabs)  
**Data:** Fully deterministic local mock data — no cloud dependencies in demo mode

---

## Screens

| Screen | Description |
|--------|-------------|
| **Home** | Multilingual search bar, quick prompts, platform stats |
| **Intent Review** | Shows parsed intent: language, service, urgency, location, confidence |
| **Provider List** | Ranked providers with scores, badges, and real-time summary chip |
| **Provider Detail** | Full 10-factor breakdown, price receipt, risk flags, availability slots, CTA |
| **Booking Confirm** | Receipt, payment selection, notifications preview, success state |
| **Follow-up Timeline** | 8-step lifecycle with live status indicators |
| **Agent Trace** | Filter chips, per-agent logs, confidence bars, Decision Rationale toggle |
| **Baseline Compare** | Side-by-side: distance-only system vs 10-factor agentic system |
| **Demo Scenarios** | 6 interactive scenarios running real pipeline |
| **Dispute Center** | 4 dispute types, AI mediator decision, compensation output |

---

## Multilingual Input Handling

The IntentAgent handles:

| Language | Example |
|----------|---------|
| English | "I need a plumber tomorrow morning in DHA" |
| Roman Urdu | "Kal subah plumber chahiye DHA mein" |
| Misspelled Roman Urdu | "Mujhe plmbr chye kal subh DHA" |
| Mixed | "plumber needed tmrw morning DHA phase 5" |
| Full Urdu (Roman) | "AC bilkul kaam nahi kar raha, kal subah G-13 mein technician chahiye, budget zyada nahi hai" |

**Typo correction map** covers 20+ common Urdu/English shorthand misspellings.  
**Language detection** uses script analysis (`/[\u0600-\u06FF]/`) + Roman Urdu keyword vocabulary.

---

## Matching Factors (10-Factor Ranking)

| Factor | Weight | Description |
|--------|--------|-------------|
| Availability | 15% | Is provider currently available? |
| Skill Match | 14% | How well do provider skills match the service request? |
| Reliability (On-Time) | 13% | Historical on-time arrival rate |
| Star Rating | 12% | Bayesian-adjusted rating |
| Review Recency | 11% | Exponential decay of review freshness |
| Distance | 10% | Haversine distance to user location |
| Travel Time | 9% | City travel time model (3.5 min/km) |
| Price Fit | 8% | How well does estimated price fit user budget? |
| Provider Fairness | 6% | Ensures provider earns sustainable margin |
| Low Cancellation Rate | 5% | Risk-adjusted cancellation history |

**Formula:** `finalScore = Σ(weight_i × factorScore_i) × 100`

---

## Pricing Formula

```
finalPrice = (baseRate + complexityFee) × urgencyMultiplier × demandMultiplier
           + distanceSurcharge + providerPremium − loyaltyDiscount
```

| Component | Description |
|-----------|-------------|
| `baseRate` | Provider's hourly rate |
| `complexityFee` | Job complexity: basic 0%, intermediate +75%, complex +150% |
| `urgencyMultiplier` | low 1.0, medium 1.1, high 1.3, emergency 1.6 |
| `demandMultiplier` | 1.0 normally, 1.25 during high-demand periods |
| `distanceSurcharge` | ₨60/km beyond 2km threshold |
| `providerPremium` | ₨200 for providers rated ≥ 4.7★ |
| `loyaltyDiscount` | ₨100 for returning users |

Budget fit detection: `ratio = finalPrice / userBudget`
- ≤ 0.85 → `excellent` | 0.85–1.0 → `good` | 1.0–1.2 → `tight` | > 1.2 → `over_budget`

When `over_budget`: 5 recovery options generated (lower provider, off-peak, inspection only, increase budget, human escalation).

---

## Booking Lifecycle

```
Search → Intent parsed → Providers ranked → Price calculated
→ Slot confirmed → Booking created (ID + code)
→ WhatsApp/SMS sent (simulated) → Calendar updated (simulated)
→ 8-step follow-up timeline begins
→ Provider arrives → Service done → Checklist → Feedback → Reputation updated
```

---

## Failure Scenarios

| Scenario | Trigger | Outcome |
|----------|---------|---------|
| Budget Mismatch | Price > 1.2× budget | Recovery options shown |
| Misspelled Input | Typos in query | Corrected silently, trace shows fix |
| No Provider Available | Emergency slot at night | Warning trace, alternate slots suggested |
| Provider Cancels | Post-booking cancellation | Backup found, price lock maintained |
| Price Dispute | User disputes final price | DisputeAgent evaluates, credit issued |
| Quality Complaint | Work quality issue | Escalated to human mediator |

---

## Baseline Comparison

The **Compare** tab shows the same query processed by two systems:

| System | Strategy | Typical Score |
|--------|----------|---------------|
| Simple Baseline | Nearest available provider only (distance + availability) | ~34/100 |
| Ustaad360 Agent | 10-factor weighted reasoning | ~87/100 |

Key insight: The agent may select a provider **1–2 km farther** than the nearest option if that provider has significantly better reliability, rating, and skill match — reducing the chance of cancellation or poor quality service.

---

## Data Privacy Note

This demo uses **100% synthetic, deterministic mock data**. No real:
- User personal information
- Provider contact details
- Payment data
- Location data

All providers, bookings, traces, and prices are generated locally at runtime.

---

## Setup Steps

```bash
# Install dependencies
npm install

# Start development server
npx expo start --clear --port 8083

# Scan QR code with Expo Go (SDK 51)
# Install Expo Go SDK 51: expo.dev/go?sdkVersion=51&platform=android&device=true
```

---

## Running on Phone

1. Install **Expo Go SDK 51** on Android: [expo.dev/go?sdkVersion=51&platform=android&device=true](https://expo.dev/go?sdkVersion=51&platform=android&device=true)
2. Run `npx expo start --clear --port 8083`
3. Scan the QR code shown in terminal
4. If port is busy: use `--port 8084` or another free port

> ⚠️ **SDK Mismatch**: If Expo Go shows SDK mismatch, use the SDK 51 specific download link above. Do not upgrade project SDK.

---

## APK Build Steps

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo account
eas login

# Configure build
eas build:configure

# Build APK (Android)
eas build --platform android --profile preview
```

---

## Cost & Scalability

**Current demo mode:** Near-zero cost — all processing is local and synchronous.

**At scale (10K bookings/day):**
| Component | Option |
|-----------|--------|
| Provider data | Cloud Firestore |
| Booking records | Cloud Firestore |
| Agent traces | BigQuery (for analytics) |
| Multilingual NLU | Gemini Flash API (~$0.075/1K tokens) |
| Notifications | Firebase Cloud Messaging (free tier covers most usage) |
| Estimated cost | ~$15–25/day at 10K bookings |

---

## Limitations

- Mock data: all providers and bookings are synthetic
- No real-time availability tracking
- No actual payment processing
- No persistent user accounts
- Single booking session (navigating home resets state)
- Android emulator requires `adb` configured; use real device QR scan if not configured

---

## Team Submission Checklist

- [x] 10-agent local deterministic pipeline
- [x] Zustand state management
- [x] Multilingual input (Urdu/Roman Urdu/English/mixed)
- [x] Typo correction
- [x] 10-factor provider ranking
- [x] Dynamic pricing with full breakdown
- [x] Budget mismatch recovery
- [x] Booking lifecycle simulation
- [x] Follow-up timeline (8 steps)
- [x] Agent trace log with Decision Rationale
- [x] Baseline comparison (distance-only vs 10-factor)
- [x] 6 demo scenarios (interactive, real pipeline)
- [x] Dispute center (4 types, AI mediator)
- [x] Offline-first, no Gemini/Firebase dependency
- [x] TypeScript: 0 errors
- [x] Metro bundler: clean start
- [x] Git tagged: `v0.4.1-end-to-end-booking-flow`
