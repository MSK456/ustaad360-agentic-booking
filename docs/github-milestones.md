# GitHub Commit Milestones — Ustaad360

## Branching Strategy
| Branch | Purpose |
|---|---|
| `main` | Stable, demo-ready only |
| `dev` | Active development |
| `feat/*` | Feature branches (merge into `dev`) |

Merge flow: `feat/*` → `dev` → `main` (at each milestone only)

---

## Milestone 0 — Planning Complete
**Tag:** `v0.1.0-planning`

```
feat: add complete project planning docs

- product-brief.md, implementation-plan.md, agent-pipeline.md
- data-schema.md, matching-pricing.md, demo-flow.md
- github-milestones.md, README.md (professional overview)
```

---

## Milestone 1 — Project Skeleton
**Tag:** `v0.2.0-skeleton`

```
feat: initialize Expo project with navigation and design system

- Expo SDK 51 + TypeScript
- React Navigation v6: bottom tabs + stack navigator
- Theme system: colors, typography, spacing tokens
- Zustand stores: user, booking, provider, trace
- Firebase init (Auth + Firestore)
- Mock seed data: 20 providers, 10 service categories
- ESLint + Prettier configured
- .env.example with all required keys
```

---

## Milestone 2 — NLU Agent
**Tag:** `v0.3.0-nlu`

```
feat: NLU agent with multilingual intent extraction

- Gemini 1.5 Flash API client (src/lib/gemini.ts)
- NLU agent system prompt (Urdu/Roman Urdu/English/slang)
- 50+ slang normalization mappings
- Entity extraction: service, urgency, time, budget, location
- Clarification dialog for ambiguous input
- Home screen NL input bar wired to agent
- Agent trace entry written per NLU call
```

---

## Milestone 3 — Discovery & Ranking
**Tag:** `v0.4.0-ranking`

```
feat: provider discovery and 9-factor ranking algorithm

- DiscoveryAgent: service/city/availability filtering
- RankingAgent: weighted 9-factor scoring engine
- Haversine distance, Bayesian rating, recency decay math
- Ranked Results screen (top 3 cards)
- Provider Profile screen with score breakdown chart
- Agent trace entries for discovery + ranking
```

---

## Milestone 4 — Pricing & Booking
**Tag:** `v0.5.0-booking`

```
feat: pricing agent, booking flow, confirmation, reminders

- PricingAgent: complexity × urgency × travel formula
- 4-tier budget negotiation logic
- Booking Confirm screen with full price breakdown
- BookingAgent: Firestore record + slot management
- Booking Success screen (Lottie animation)
- ReminderAgent: simulated push notifications
```

---

## Milestone 5 — Post-Service & Reputation
**Tag:** `v0.6.0-reputation`

```
feat: review flow, dispute handling, reputation update

- Review screen: stars + tags + comment
- ReputationAgent: rolling Bayesian score update
- Dispute screen + Gemini-powered DisputeAgent
- My Bookings screen (filter: all/active/completed/disputed)
- Booking Detail screen with status timeline
```

---

## Milestone 6 — Trace & Compare
**Tag:** `v0.7.0-trace`

```
feat: agent trace screen and baseline comparison

- Agent Trace tab: vertical timeline, expandable reasoning
- AgentTraceCard + AgentTraceTimeline components
- Baseline Compare tab: simple vs agentic split-view
- Failure scenarios: no providers, budget mismatch, cancellation
- Graceful failure UI with agent explanation in user's language
- Trace JSON export button
```

---

## Milestone 7 — Final Release
**Tag:** `v1.0.0`

```
feat: polish, APK build, docs, demo video

- Urdu font support (Noto Nastaliq)
- React Native Reanimated 3 transitions
- Lottie animations: splash, success, failure, loading
- Dark mode support
- EAS Build → signed APK
- README finalized with setup instructions
- Demo video link added
- Privacy + cost + scalability notes complete
```

**GitHub Release v1.0.0 checklist:**
- [ ] APK attached: `ustaad360-v1.0.0.apk`
- [ ] Demo video link in release notes
- [ ] All docs in `/docs` folder
- [ ] `.env.example` present (no real keys committed)
- [ ] Tag pushed: `git push origin v1.0.0`

---

## Estimated Timeline

| Phase | When | Tag |
|---|---|---|
| Planning complete | Day 0 | v0.1.0 |
| Skeleton | Day 1 AM | v0.2.0 |
| NLU agent | Day 1 PM | v0.3.0 |
| Ranking | Day 1 PM | v0.4.0 |
| Pricing + booking | Day 2 AM | v0.5.0 |
| Reputation + dispute | Day 2 PM | v0.6.0 |
| Trace + compare | Day 2 PM | v0.7.0 |
| Polish + APK | Day 3 | v1.0.0 |

---

## Commit Message Convention
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
refactor: Code restructure
chore:    Config, tooling, build

Example:
feat(nlu): add Roman Urdu slang normalization for 50 terms
```
