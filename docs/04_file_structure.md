# Ustaad360 — File Structure

```
ustaad360-agentic-booking/
├── docs/                          # All planning docs (you are here)
│   ├── 01_product_brief.md
│   ├── 02_task_list.md
│   ├── 03_implementation_plan.md
│   ├── 04_file_structure.md
│   ├── 05_data_schemas.md
│   ├── 06_agent_pipeline.md
│   ├── 07_matching_algorithm.md
│   ├── 08_pricing_formula.md
│   ├── 09_screen_plan.md
│   ├── 10_demo_video_flow.md
│   └── 11_commit_milestones.md
│
├── app/                           # Expo Router (file-based routing)
│   ├── (tabs)/
│   │   ├── index.tsx              # Home screen
│   │   ├── bookings.tsx           # My Bookings
│   │   ├── trace.tsx              # Agent Trace
│   │   ├── compare.tsx            # Baseline Compare
│   │   └── profile.tsx            # User Profile
│   ├── booking/
│   │   ├── [id].tsx               # Booking detail
│   │   └── confirm.tsx            # Confirmation screen
│   ├── provider/
│   │   └── [id].tsx               # Provider profile
│   ├── onboarding.tsx             # First-launch onboarding
│   ├── review.tsx                 # Post-service review
│   ├── dispute.tsx                # Dispute filing
│   └── _layout.tsx                # Root layout
│
├── src/
│   ├── agents/                    # AI Agent logic
│   │   ├── nluAgent.ts            # Intent extraction (Gemini)
│   │   ├── discoveryAgent.ts      # Provider search
│   │   ├── rankingAgent.ts        # 9-factor ranking
│   │   ├── pricingAgent.ts        # Pricing formula + negotiation
│   │   ├── bookingAgent.ts        # Booking creation
│   │   ├── reminderAgent.ts       # Notification scheduling
│   │   ├── reputationAgent.ts     # Review + score update
│   │   ├── disputeAgent.ts        # Dispute resolution
│   │   └── orchestrator.ts        # Master agent controller
│   │
│   ├── components/                # Reusable UI components
│   │   ├── AgentTraceCard.tsx     # Single trace entry
│   │   ├── AgentTraceTimeline.tsx # Full trace list
│   │   ├── ProviderCard.tsx       # Provider listing card
│   │   ├── RankingBar.tsx         # Visual score bar
│   │   ├── NLInputBar.tsx         # Natural language input
│   │   ├── BookingStatusBadge.tsx # Status pill
│   │   ├── StarRating.tsx         # Rating component
│   │   ├── BaselineCard.tsx       # Compare mode card
│   │   └── LoadingTrace.tsx       # Animated thinking state
│   │
│   ├── screens/                   # Screen-level components (if not using Expo Router)
│   │
│   ├── store/                     # Zustand state stores
│   │   ├── useBookingStore.ts
│   │   ├── useProviderStore.ts
│   │   ├── useTraceStore.ts
│   │   └── useUserStore.ts
│   │
│   ├── data/                      # Mock data (seed files)
│   │   ├── providers.ts           # 20+ mock providers
│   │   ├── bookings.ts            # Sample past bookings
│   │   ├── services.ts            # Service categories + base prices
│   │   └── reviews.ts             # Sample reviews
│   │
│   ├── lib/                       # Utilities & config
│   │   ├── gemini.ts              # Gemini API client
│   │   ├── firebase.ts            # Firebase init
│   │   ├── notifications.ts       # Expo notifications helper
│   │   ├── scoring.ts             # Scoring math helpers
│   │   └── language.ts            # Language detection helpers
│   │
│   ├── theme/                     # Design system
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   └── index.ts
│   │
│   └── types/                     # TypeScript interfaces
│       ├── provider.ts
│       ├── booking.ts
│       ├── agent.ts
│       └── user.ts
│
├── assets/
│   ├── fonts/                     # Urdu fonts
│   ├── icons/
│   ├── images/
│   └── animations/                # Lottie JSON files
│
├── .env                           # GEMINI_API_KEY, FIREBASE config
├── .env.example                   # Template for contributors
├── app.json                       # Expo config
├── eas.json                       # EAS Build config
├── package.json
├── tsconfig.json
├── README.md
└── .gitignore
```
