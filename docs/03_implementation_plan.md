# Ustaad360 — Implementation Plan

## Technology Stack

| Layer | Technology | Reason |
|---|---|---|
| Mobile Framework | React Native (Expo SDK 51) | Cross-platform, APK export via EAS Build |
| AI/LLM | Google Gemini 1.5 Flash API | Multilingual NLU, low latency, cheap |
| Backend (Mock) | JSON seed files + in-memory state | Hackathon speed; no server needed |
| Auth | Firebase Authentication | Google Sign-In, phone OTP |
| Database | Firebase Firestore | Real-time, offline-capable |
| Push Notifications | Expo Notifications (simulated) | No real FCM device token needed for demo |
| State Management | Zustand | Lightweight, boilerplate-free |
| Navigation | React Navigation v6 | Industry standard |
| Animations | React Native Reanimated 3 + Lottie | Smooth micro-animations |
| Styling | React Native StyleSheet + custom theme | No Tailwind in RN |
| Build | EAS Build (Expo) | Generates signed APK |

---

## Development Phases

### Milestone 1 — Skeleton (Day 1 Morning)
- Expo project initialized
- Navigation shell with 5 tabs
- Theme system (colors, typography, spacing)
- Mock data files created
- Firebase configured

**Commit:** `feat: project skeleton, navigation, theme system`

---

### Milestone 2 — NLU Agent (Day 1 Afternoon)
- Gemini API wired up
- Intent extraction agent prompt
- Language normalization
- Entity parsing (service, location, time, budget)
- Clarification flow

**Commit:** `feat: NLU agent with multilingual intent extraction`

---

### Milestone 3 — Provider Discovery & Ranking (Day 1 Evening)
- Mock provider pool (20+ providers with all attributes)
- 9-factor scoring engine
- Ranked list screen
- Provider profile screen

**Commit:** `feat: provider ranking with 9-factor scoring algorithm`

---

### Milestone 4 — Pricing & Booking (Day 2 Morning)
- Pricing formula engine
- Budget negotiation agent
- Booking creation + confirmation
- Booking state machine
- Reminder simulation

**Commit:** `feat: pricing agent, booking flow, confirmation & reminders`

---

### Milestone 5 — Post-Service & Reputation (Day 2 Afternoon)
- Review screen
- Dispute flow
- Reputation update agent
- Provider score update

**Commit:** `feat: post-service review, dispute, reputation update`

---

### Milestone 6 — Agent Trace + Baseline Compare (Day 2 Evening)
- Agent trace timeline (full log of every agent decision)
- Baseline Compare screen (keyword match vs agentic)
- Failure scenarios implemented

**Commit:** `feat: agent trace screen, baseline comparison, failure scenarios`

---

### Milestone 7 — Polish + APK (Day 3)
- Urdu font support
- Animations + transitions
- Dark mode
- EAS Build → APK
- Demo video recorded
- README finalized
- GitHub release tagged

**Commit:** `feat: final polish, APK build, README, demo video`

---

## Architecture Pattern

```
User Input (NL Text/Voice)
        │
        ▼
┌─────────────────┐
│  NLU Agent      │  ← Gemini: language detect, intent, entities
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Discovery Agent│  ← Query mock DB, filter by service type + city
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ranking Agent  │  ← 9-factor weighted score per provider
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Pricing Agent  │  ← Formula engine + budget negotiation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Booking Agent  │  ← Creates booking, sends confirmation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reminder Agent │  ← Schedules push notifications
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Reputation Agent│ ← Processes reviews, updates scores
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Dispute Agent  │  ← Mediates complaints, applies policies
└─────────────────┘

All agents → write to AgentTraceLog → displayed on Trace Screen
```

---

## Gemini Integration Strategy
- Use **function calling** for structured JSON output from agents
- Each agent has its own **system prompt** defining its role
- Chain agents using **multi-turn chat session** with history
- All intermediate reasoning is captured in trace log
