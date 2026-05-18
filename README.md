# Ustaad360 🔧
**Pakistan's First Agentic Service Booking Platform**

> *"Har Kaam, Ek App"* — Every job, one app.

[![Platform](https://img.shields.io/badge/platform-Android-blue)]()
[![AI](https://img.shields.io/badge/AI-Google%20Gemini-orange)]()
[![Built with](https://img.shields.io/badge/built%20with-Expo%20%2B%20React%20Native-blueviolet)]()

---

## What is Ustaad360?

Ustaad360 is an AI-first mobile app that connects Pakistani households with verified local tradespeople (plumbers, electricians, AC technicians, carpenters, and more) using **natural language** — in Urdu, Roman Urdu, English, or any mix.

A user types: *"yaar nala band ho gaya urgent help chahiye 1500 se kam mein"*
The app understands, finds the best-matched provider, negotiates the price, books them, and follows up — all through an **8-agent AI pipeline powered by Google Gemini**.

---

## Key Features

- 🗣️ **Multilingual NLU** — Urdu, Roman Urdu, English, slang, misspellings, mixed
- 🤖 **8 Specialized AI Agents** — NLU → Discovery → Ranking → Pricing → Booking → Reminder → Reputation → Dispute
- 📊 **9-Factor Provider Ranking** — distance, travel time, availability, rating, review recency, reliability, price fit, skill match, cancellation rate
- 💰 **Dynamic Pricing** — formula-based with urgency/complexity multipliers and budget negotiation
- 🔍 **Agent Trace Screen** — full transparency of every AI decision and reasoning
- ⚖️ **Baseline Compare** — side-by-side simple system vs Ustaad360 agentic system
- ❌ **Failure Handling** — graceful recovery for no-provider, budget mismatch, and cancellation scenarios

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native (Expo SDK 51) → APK via EAS Build |
| AI | Google Gemini 1.5 Flash API |
| Auth & Database | Firebase (Authentication + Firestore) |
| State Management | Zustand |
| Animations | React Native Reanimated 3 + Lottie |

---

## Quick Setup

```bash
git clone https://github.com/MSK456/ustaad360-agentic-booking.git
cd ustaad360-agentic-booking
npm install
npx expo start --port 8083
```

To build the APK:
```bash
eas build --platform android --profile preview
```

---

## Running on Phone (Expo Go)

> ⚠️ This project uses **Expo SDK 51**. The Play Store version of Expo Go is SDK 54 and **will not work**.

**Step 1 — Install the correct Expo Go:**

👉 [Download Expo Go for SDK 51 (Android APK)](https://expo.dev/go?sdkVersion=51&platform=android&device=true)

**Step 2 — Start the dev server:**
```bash
npx expo start --port 8083
```

**Step 3 — Scan the QR code** shown in the terminal with the SDK 51 Expo Go app.

> ⚠️ Do NOT press `a` in the terminal unless you have Android Studio + ADB configured.
> See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for full details on SDK mismatch, ADB errors, and port conflicts.

---

## Documentation

| Document | Description |
|---|---|
| [Product Brief](./docs/product-brief.md) | Vision, problem, solution, metrics |
| [Implementation Plan](./docs/implementation-plan.md) | Architecture, tech stack, milestones |
| [Agent Pipeline](./docs/agent-pipeline.md) | All 8 agents + orchestrator spec |
| [Data Schema](./docs/data-schema.md) | TypeScript interfaces for all entities |
| [Matching & Pricing](./docs/matching-pricing.md) | 9-factor ranking + dynamic pricing formula |
| [Demo Flow](./docs/demo-flow.md) | Scene-by-scene video script |
| [GitHub Milestones](./docs/github-milestones.md) | Commit and release plan |

---

## Privacy & Cost

**Privacy:** No real user data is collected. All providers are fictional mock data. The Gemini API receives only the user's request text — no PII is transmitted.

**Cost:** Gemini 1.5 Flash and Firebase free tiers are sufficient for the hackathon demo. At production scale (10,000 bookings/day), estimated cost is ~$15–25/day. The agent pipeline is stateless and horizontally scalable on Cloud Run.

---

*Built for the Google Antigravity Hackathon — Agentic AI Track*
