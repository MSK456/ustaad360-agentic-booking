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

## Platform & Architecture
- React Native (Expo) mobile app → APK deliverable

### Backend and Data Storage
- **Current Prototype**: The hackathon prototype uses offline deterministic local data for speed and reliability during demos.
- **Mock Data**: Provider data, reviews, pricing rules, and scenarios are synthetic mock data.
- **State Management**: `Zustand` manages app state.
- **Local Persistence**: `AsyncStorage` persists demo auth, sessions, bookings, and traces locally so the app remembers state between sessions.
- **Agent Pipeline**: The 10-agent orchestration pipeline runs entirely locally in TypeScript.
- **Privacy**: No real personal data is used.
- **Simulations**: WhatsApp/call interactions and maps are simulated safely without external API dependencies.

### Production Backend Plan
When transitioning to a full production release, the app will migrate to:
- **Auth**: Firebase Auth for real user login and verification.
- **Database**: Firestore collections for robust real-time synchronization (`users`, `providers`, `bookings`, `reviews`, `traces`, `disputes`, `categories`).
- **Orchestration**: Cloud Functions for secure agent orchestration off-device.
- **NLU Engine**: Gemini structured output for high-accuracy multilingual parsing.
- **Mapping**: Google Maps Places/Distance Matrix API for real distance and ETA calculation.
- **Notifications**: Twilio/WhatsApp Business or equivalent SMS provider for transactional notifications.

### Trace Logging
Ustaad360 provides full visibility into the AI's decision-making process through two trace layers:

1. **In-app Agent Trace**:
   - `IntentAgent`, `DiscoveryAgent`, `RankingAgent`, `PricingAgent`, `SchedulingAgent`, `BookingAgent`, `NotificationAgent`, `FollowUpAgent`, `DisputeAgent`, `ReputationUpdateAgent`.
   - *Visibility*: These traces are explicitly shown to the user and judges inside the app via the "Agent Trace" logs, demonstrating the chain of thought.

2. **Antigravity Development Logs**:
   - `workplans`, `task plans`, `prompts`, `debugging steps`, `terminal results`, `implementation notes`.
   - *Visibility*: These detailed background logs will be zipped and submitted as transparent proof of the hackathon development process.

## Success Metrics (Demo)
- User makes a request in Urdu slang → correct intent extracted ✅
- Top provider ranked correctly from mock pool ✅
- Booking confirmed with price negotiation ✅
- Failure scenario handled gracefully ✅
- Agent trace visible at every step ✅
