# Ustaad360 — Product Brief

## Vision
Ustaad360 is an AI-first, agentic mobile platform that connects Pakistani households and businesses with verified local service providers (ustaaDs) across trades like plumbing, electrical, carpentry, AC repair, painting, and more — using natural language, not forms.

## Problem Statement
Pakistan's informal service economy is a ₨2.5 trillion+ market where:
- Customers find workers through word-of-mouth or walk-ins
- No quality assurance, no price transparency
- Workers have no digital reputation or verified track record
- Booking is chaotic — calls, WhatsApp messages, middlemen
- Language barriers (Urdu/Roman Urdu/slang) prevent digital adoption

## Solution
An agentic mobile app powered by Google Gemini where a user types or speaks in any language/dialect and the AI:
1. Understands their need
2. Finds the best-matched service provider
3. Negotiates pricing within budget
4. Books, confirms, and reminds
5. Follows up, handles disputes, updates reputation

## Target Users
| Segment | Description |
|---|---|
| Homeowners | Middle-class households needing repair/maintenance |
| Small Businesses | Shops, offices needing tradespeople |
| Service Providers | Skilled workers (ustaaDs) wanting digital bookings |

## Key Differentiators
- **Multilingual NLU**: Urdu, Roman Urdu, English, mixed, slang, misspellings
- **Agentic Pipeline**: 8 specialized AI agents orchestrated by Gemini
- **Multi-Factor Ranking**: 9+ factors for provider matching
- **Full Lifecycle**: From request to dispute resolution
- **Agent Trace Screen**: Full transparency of every AI decision
- **Baseline Compare**: Side-by-side vs. simple non-agentic system

## Platform
- React Native (Expo) mobile app → APK deliverable
- Google Gemini API as the AI backbone
- Firebase (Auth, Firestore, Cloud Messaging)
- Mock/simulated backend for hackathon demo

## Success Metrics (Demo)
- User makes a request in Urdu slang → correct intent extracted ✅
- Top provider ranked correctly from mock pool ✅
- Booking confirmed with price negotiation ✅
- Failure scenario handled gracefully ✅
- Agent trace visible at every step ✅
