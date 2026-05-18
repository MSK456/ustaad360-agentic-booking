# Ustaad360 — GitHub Commit Milestone Plan

## Branching Strategy
- `main` — stable, demo-ready only
- `dev` — active development
- Feature branches: `feat/nlu-agent`, `feat/ranking`, etc.
- All PRs merge into `dev`, then `dev` → `main` at each milestone

---

## Milestone 0 — Planning Complete
**Tag:** `v0.1.0-planning`
```
feat: add complete project planning docs (11 docs)

- Product brief, task list, implementation plan
- File structure, data schemas, agent pipeline
- Matching algorithm, pricing formula
- Screen plan, demo video flow, commit milestones
```
**Files:** `docs/` directory (all 11 .md files)

---

## Milestone 1 — Project Skeleton
**Tag:** `v0.2.0-skeleton`
```
feat: initialize Expo project with navigation and theme system

- Expo SDK 51 + TypeScript configured
- React Navigation v6: bottom tabs + stack
- Theme system: colors, typography, spacing tokens
- Zustand stores: user, booking, provider, trace
- Firebase initialized (Auth + Firestore)
- Mock data seed files: 20 providers, services, reviews
- .env.example with all required keys
- ESLint + Prettier configured
```

---

## Milestone 2 — NLU Agent
**Tag:** `v0.3.0-nlu-agent`
```
feat: implement NLU agent with Gemini multilingual intent extraction

- Gemini 1.5 Flash API client (src/lib/gemini.ts)
- NLU agent with system prompt for Urdu/Roman Urdu/English
- Intent extraction: service, urgency, time, budget, location
- Slang normalization mappings (50+ terms)
- Clarification dialog when intent ambiguous
- Language detection utility
- NLInputBar component with mic icon
- Home screen wired to NLU agent
- Agent trace entry created per NLU call
```

---

## Milestone 3 — Provider Discovery & Ranking
**Tag:** `v0.4.0-ranking`
```
feat: provider discovery and 9-factor ranking algorithm

- DiscoveryAgent: filter by service, city, availability
- RankingAgent: 9-factor weighted scoring engine
- Scoring helpers: haversine distance, recency decay, Bayesian rating
- Ranked Results screen with top 3 provider cards
- Provider Profile screen with score breakdown chart
- RankingBar component
- ProviderCard component
- Agent trace entries for discovery + ranking steps
```

---

## Milestone 4 — Pricing & Booking Flow
**Tag:** `v0.5.0-booking`
```
feat: pricing agent, booking flow, confirmation and reminders

- PricingAgent: dynamic formula (base × complexity × urgency + travel + fee)
- Budget negotiation logic (4 outcome tiers)
- Booking Confirm screen with price breakdown
- BookingAgent: creates booking in Firestore
- Booking Success screen with Lottie animation
- ReminderAgent: schedules push notifications (simulated)
- BookingStatusBadge component
- useBookingStore fully wired
```

---

## Milestone 5 — Post-Service & Reputation
**Tag:** `v0.6.0-reputation`
```
feat: review flow, dispute handling, and reputation update agent

- Review screen: star rating + tags + comment
- ReputationAgent: recalculates rating, recency score, onTimeScore
- Dispute screen: reason + description + mock photo upload
- DisputeAgent: Gemini-powered fair resolution
- My Bookings screen with filter tabs
- Booking Detail screen with status timeline
```

---

## Milestone 6 — Agent Trace + Baseline Compare
**Tag:** `v0.7.0-trace-compare`
```
feat: agent trace screen and baseline comparison

- Agent Trace tab: full vertical timeline with expand/collapse reasoning
- AgentTraceCard and AgentTraceTimeline components
- LoadingTrace animated component (AI thinking state)
- Baseline Compare tab: split-view simple vs agentic
- BaselineCard component
- Failure scenarios: no providers, budget mismatch, provider cancellation
- Failure UI with graceful agent explanation
- Trace export (JSON) feature
```

---

## Milestone 7 — Polish, APK & Submission
**Tag:** `v1.0.0-release`
```
feat: final polish, APK build, complete README and documentation

- Urdu font support (Noto Nastaliq Urdu)
- React Native Reanimated 3 transitions on all screens
- Lottie animations: splash, success, failure, loading
- Dark mode support
- EAS Build configuration (eas.json)
- Generated signed APK → attached to GitHub Release
- README.md: setup, architecture, agents, demo instructions
- Privacy note: no real user data collected
- Cost note: Gemini Flash pricing, Firebase free tier
- Scalability note: horizontal scaling plan
- Demo video link in README
- GitHub Release: v1.0.0 with APK asset
```

---

## GitHub Release Checklist (v1.0.0)
- [ ] Tag `v1.0.0-release` on `main`
- [ ] Create GitHub Release with:
  - [ ] APK file attached (`ustaad360-v1.0.0.apk`)
  - [ ] Demo video link
  - [ ] Release notes summarizing all features
- [ ] README has: setup, screenshots, tech stack, agent diagram
- [ ] All 11 docs in `/docs` folder
- [ ] `.env.example` present (no real keys committed)

---

## Commit Message Convention
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
style:    Formatting, no logic change
refactor: Code restructure
test:     Tests
chore:    Build, config, tooling
```

Example:
```
feat(nlu): add Roman Urdu slang normalization for 50 terms

- Added slang-to-standard mapping in src/lib/language.ts
- Handles common misspellings: 'bijli' → 'electrician'
- Unit test coverage added for 20 slang terms

Closes #12
```

---

## Estimated Timeline

| Day | Focus | Milestone |
|---|---|---|
| Day 1 AM | Setup + skeleton | v0.2.0 |
| Day 1 PM | NLU agent | v0.3.0 |
| Day 1 PM | Discovery + ranking | v0.4.0 |
| Day 2 AM | Pricing + booking | v0.5.0 |
| Day 2 PM | Reputation + dispute | v0.6.0 |
| Day 2 PM | Trace + compare | v0.7.0 |
| Day 3 | Polish + APK + docs | v1.0.0 |
