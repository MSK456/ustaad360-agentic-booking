# Implementation Plan — Ustaad360

## Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Mobile | React Native (Expo SDK 51) | Cross-platform, APK via EAS Build |
| AI/LLM | Google Gemini 1.5 Flash | Multilingual NLU, low latency, cost-efficient |
| Backend | JSON mock + Firestore | No server needed for hackathon demo |
| Auth | Firebase Authentication | Google Sign-In, phone OTP |
| State | Zustand | Lightweight, zero boilerplate |
| Navigation | React Navigation v6 | Industry standard |
| Animations | Reanimated 3 + Lottie | Smooth micro-interactions |
| Build | EAS Build (Expo) | Signed APK generation |

---

## Architecture

```
User Input (Text / Voice)
        │
        ▼
  ┌─────────────┐
  │  NLU Agent  │  ← Gemini: language detect, intent, entities
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │  Discovery  │  ← Filter mock DB by service + city + time
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │   Ranking   │  ← 9-factor weighted score per provider
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │   Pricing   │  ← Formula engine + budget negotiation
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │   Booking   │  ← Creates record, sends confirmation
  └──────┬──────┘
         │
  ┌──────▼──────┐
  │  Reminder   │  ← Schedules push notifications
  └──────┬──────┘
         │
  ┌──────▼──────┐     ┌───────────────┐
  │ Reputation  │     │ Dispute Agent │
  └─────────────┘     └───────────────┘

All agents → AgentTraceLog → Trace Screen
```

---

## Development Milestones

### M1 — Skeleton (Day 1 AM)
- Expo + TypeScript initialized
- Bottom tabs: Home, Bookings, Trace, Compare, Profile
- Theme system (colors, typography, spacing)
- Zustand stores + mock data seed files
- Firebase configured

### M2 — NLU Agent (Day 1 PM)
- Gemini API client (`src/lib/gemini.ts`)
- Intent extraction with multilingual system prompt
- Slang normalization (50+ mappings)
- Clarification dialog for ambiguous input
- Home screen wired to NLU agent

### M3 — Discovery & Ranking (Day 1 PM)
- DiscoveryAgent: filter by service/city/availability
- RankingAgent: 9-factor scoring engine
- Ranked Results screen + Provider Profile screen
- Score breakdown bar chart

### M4 — Pricing & Booking (Day 2 AM)
- PricingAgent: dynamic formula + negotiation logic
- Booking Confirm screen with price breakdown
- BookingAgent: Firestore record creation
- Booking Success screen (Lottie animation)
- ReminderAgent: notification scheduling (simulated)

### M5 — Post-Service (Day 2 PM)
- Review screen (stars + tags + comment)
- ReputationAgent: rolling score update
- Dispute screen + DisputeAgent (Gemini-powered resolution)
- My Bookings + Booking Detail screens

### M6 — Trace + Compare (Day 2 PM)
- Agent Trace tab: full timeline with expandable reasoning
- Baseline Compare tab: simple system vs Ustaad360
- Failure scenarios: no providers, budget mismatch, cancellation

### M7 — Polish + APK (Day 3)
- Urdu font (Noto Nastaliq)
- Animations + dark mode
- EAS Build → APK
- README + demo video
- GitHub Release `v1.0.0`

---

## Gemini Integration Strategy
- **Function calling** for structured JSON output from each agent
- Each agent has its own **system prompt** defining its role and output schema
- **Multi-turn chat** for context continuity across the pipeline
- All intermediate reasoning captured in `AgentTraceEntry[]`
