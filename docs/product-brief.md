# Product Brief — Ustaad360

## Vision
Ustaad360 is Pakistan's first agentic mobile platform that connects households and businesses with verified local tradespeople using natural language — in Urdu, Roman Urdu, English, or any mix.

## Problem
Pakistan's informal service economy (₨2.5T+) runs on word-of-mouth and WhatsApp:
- No price transparency or quality assurance
- Workers have no digital reputation
- Language barriers block digital adoption
- Booking is chaotic — calls, middlemen, no guarantees

## Solution
A mobile app where users speak or type naturally. Eight AI agents (powered by Google Gemini) handle everything: intent understanding → provider discovery → 9-factor ranking → dynamic pricing → booking → reminders → reviews → dispute resolution.

## Target Users
| Segment | Profile |
|---|---|
| Homeowners | Middle-class households needing repair/maintenance |
| Small Businesses | Shops and offices needing tradespeople |
| Service Providers | Skilled workers wanting verified digital bookings |

## Key Differentiators
- **Multilingual NLU** — Urdu, Roman Urdu, English, slang, misspellings, mixed
- **Agentic Pipeline** — 8 specialized Gemini agents, fully orchestrated
- **9-Factor Ranking** — distance, travel time, availability, rating, review recency, reliability, price fit, skill match, cancellation rate
- **Full Lifecycle** — request → booking → reminder → review → dispute
- **Agent Trace Screen** — every AI decision is visible and explainable
- **Baseline Compare** — side-by-side simple vs agentic system

## Platform
- React Native (Expo) → APK via EAS Build
- Google Gemini 1.5 Flash API (AI backbone)
- Firebase (Auth + Firestore + Notifications)
- Mock data for hackathon demo

## Success Metrics (Demo)
| Scenario | Expected Result |
|---|---|
| Urdu slang request | Correct intent extracted |
| 20-provider pool | Top provider ranked correctly |
| Budget mismatch | Graceful failure + alternatives |
| Booking confirmed | Price negotiated, reminder set |
| Agent trace | Every step visible with reasoning |

## Privacy Note
No real user data is collected. All providers are fictional mock data. The Gemini API receives only the request text — no PII. For production: Firebase encryption at rest + PDPA-compliant handling.

## Cost Note
- Gemini 1.5 Flash: ~$0.075/1M tokens (free tier sufficient for demo)
- Firebase: Free Spark plan (50K reads/day)
- At 10,000 bookings/day production scale: ~$15–25/day
