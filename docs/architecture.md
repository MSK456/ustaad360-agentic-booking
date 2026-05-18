# Architecture — Ustaad360 Agentic Platform

## System Overview

Ustaad360 is a fully offline, deterministic multi-agent system built with React Native (Expo SDK 51) and TypeScript. It demonstrates a complete agentic booking lifecycle without any cloud dependencies.

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface                           │
│  Home · IntentReview · ProviderList · ProviderDetail            │
│  BookingConfirm · FollowUpTimeline · AgentTrace                 │
│  BaselineCompare · DemoScenarios · DisputeCenter                │
└─────────────────────┬───────────────────────────────────────────┘
                      │  user action / search query
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   useAgentStore (Zustand)                       │
│  result · isLoading · selectedProviderId · traces               │
│  run() · selectProvider() · reset()                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │  runOrchestrator(query, budget)
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AgentOrchestrator                             │
│                                                                 │
│  1. IntentAgent          → ParsedIntent + AgentTrace            │
│  2. DiscoveryAgent       → Provider[] + AgentTrace              │
│  3. RankingAgent         → RankedProviderResult[] + AgentTrace  │
│  4. PricingAgent         → PricingResult + AgentTrace           │
│  5. SchedulingAgent      → scheduledAt + AgentTrace             │
│  6. BookingAgent         → BookingResult + AgentTrace           │
│  7. NotificationAgent    → AgentTrace                           │
│  8. FollowUpAgent        → FollowUpEvent[] + AgentTrace         │
│  9. ReputationUpdateAgent→ AgentTrace                           │
│  10.DisputeAgent         → on-demand (DisputeCenter only)       │
│                                                                 │
│  └─→ buildBaselineComparison() → BaselineComparison             │
└─────────────────────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Local Mock Data Layer                         │
│  src/data/providers.ts   → 6 Provider records                   │
│  src/data/mockData.ts    → MOCK_BOOKING, traces, dispute        │
└─────────────────────────────────────────────────────────────────┘
```

## State Flow

```
HomeScreen.handleSearch(query)
  → useAgentStore.run(query, budget?)
      → runOrchestrator()
          → returns OrchestratorResult
      → set({ result })
  → navigate('IntentReview', { query })

IntentReviewScreen
  → reads result.intent from store
  → navigate('ProviderList')

ProviderListScreen
  → reads result.rankedProviders from store
  → selectProvider(id)
  → navigate('ProviderDetail', { providerId })

ProviderDetailScreen
  → reads result.rankedProviders[find by id] from store
  → reads result.pricing from store
  → navigate('BookingConfirm', { providerId })

BookingConfirmScreen
  → reads result.booking from store (or generates locally)
  → reads result.pricing from store
  → navigate('FollowUpTimeline', { bookingId })

FollowUpTimelineScreen
  → reads result.followUpTimeline from store
  → navigate('MainTabs' → 'AgentTrace')

AgentTraceScreen (tab)
  → reads result.traces from store

BaselineCompareScreen (tab)
  → reads result.baselineComparison from store

DisputeCenterScreen
  → calls runDisputeAgent() directly (on-demand)
```

## File Structure

```
src/
├── agents/
│   ├── AgentOrchestrator.ts   # Coordinates all agents
│   ├── IntentAgent.ts         # NLU + typo correction
│   ├── DiscoveryAgent.ts      # Provider filtering
│   ├── RankingAgent.ts        # 10-factor scoring
│   ├── PricingAgent.ts        # Dynamic pricing
│   ├── SchedulingAgent.ts     # Slot selection
│   ├── BookingAgent.ts        # Record creation
│   ├── NotificationAgent.ts   # Notification queuing
│   ├── FollowUpAgent.ts       # Lifecycle timeline
│   ├── DisputeAgent.ts        # Dispute resolution
│   └── ReputationUpdateAgent.ts
├── components/
│   ├── AgentTraceCard.tsx
│   ├── Badge.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── PriceBreakdownCard.tsx
│   ├── ProviderCard.tsx
│   └── ScoreRing.tsx
├── data/
│   ├── mockData.ts
│   └── providers.ts
├── navigation/
│   ├── index.tsx              # Stack + Tab navigator
│   └── types.ts               # RootStackParamList
├── screens/
│   ├── HomeScreen.tsx
│   ├── IntentReviewScreen.tsx
│   ├── ProviderListScreen.tsx
│   ├── ProviderDetailScreen.tsx
│   ├── BookingConfirmScreen.tsx
│   ├── FollowUpTimelineScreen.tsx
│   ├── AgentTraceScreen.tsx
│   ├── BaselineCompareScreen.tsx
│   ├── DemoScenariosScreen.tsx
│   └── DisputeCenterScreen.tsx
├── store/
│   └── agentStore.ts          # Zustand store
├── theme/
│   ├── colors.ts
│   ├── spacing.ts
│   ├── radius.ts
│   ├── typography.ts
│   └── index.ts
├── types/
│   ├── agent.ts               # OrchestratorResult and all agent types
│   └── index.ts               # Provider, Booking, Review, Dispute
└── utils/
    ├── dateTime.ts
    ├── geo.ts
    └── pricing.ts
```

## Key Design Decisions

### Offline-First
All agent logic runs synchronously in-process. No HTTP calls during demo. This ensures 100% reliability for presentations and demos without network dependency.

### Type Safety
Full TypeScript with strict mode. `OrchestratorResult` is the single source of truth for all screen data. `npx tsc --noEmit` passes with 0 errors.

### Zustand over Redux
Minimal boilerplate. Single flat store. All screens read from `result` and `selectedProviderId`. No prop-drilling.

### Deterministic Pipeline
Same input always produces same output. Provider scores are computed from fixed mock data. This makes QA and demo scripts predictable.

### Baseline Comparison Built-In
The orchestrator always runs `buildBaselineComparison()` after ranking. This provides automatic side-by-side comparison data without extra work.
