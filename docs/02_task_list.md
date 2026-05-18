# Ustaad360 — Master Task List

## Phase 0: Project Setup
- [ ] Initialize Expo + React Native project
- [ ] Configure ESLint, Prettier, absolute imports
- [ ] Set up Firebase project (Auth, Firestore, FCM)
- [ ] Add Google Gemini API key to env
- [ ] Create mock data seed files (providers, bookings, reviews)
- [ ] Set up GitHub repo with branch strategy
- [ ] Write initial README skeleton

## Phase 1: Core Navigation & Screens
- [ ] Bottom tab navigator (Home, Bookings, Trace, Compare, Profile)
- [ ] Stack navigator for booking flow
- [ ] Splash screen with Ustaad360 branding
- [ ] Onboarding screen (language selection, city)
- [ ] Home screen (NL input bar + recent bookings)
- [ ] Provider card component
- [ ] Booking detail screen
- [ ] Agent Trace screen
- [ ] Baseline Compare screen

## Phase 2: NLU & Intent Agent
- [ ] Gemini API integration (chat session)
- [ ] Language detection (Urdu/Roman Urdu/English/mixed)
- [ ] Intent extraction prompt engineering
- [ ] Entity parsing (service type, location, time, budget)
- [ ] Misspelling/slang normalization
- [ ] Clarification dialog (when intent is ambiguous)

## Phase 3: Provider Discovery & Ranking
- [ ] Mock provider database (20+ providers)
- [ ] Distance & travel time simulation
- [ ] Availability slot checking
- [ ] 9-factor scoring algorithm
- [ ] Ranked results list screen
- [ ] Provider profile screen

## Phase 4: Pricing Agent
- [ ] Base pricing table per service
- [ ] Dynamic pricing formula (urgency, distance, complexity)
- [ ] Budget vs. quoted price negotiation logic
- [ ] Price display with breakdown

## Phase 5: Booking & Confirmation
- [ ] Booking creation flow
- [ ] Confirmation screen with summary
- [ ] Push notification simulation (reminder)
- [ ] Booking state machine (pending → confirmed → in-progress → completed)

## Phase 6: Post-Service & Reputation
- [ ] Review & rating screen
- [ ] Dispute filing screen
- [ ] Reputation update agent
- [ ] Provider score recalculation

## Phase 7: Agent Trace & Baseline Compare
- [ ] Agent Trace timeline component
- [ ] Trace log data structure
- [ ] Baseline Compare split-screen UI
- [ ] Baseline: keyword-match only mock
- [ ] Side-by-side result comparison

## Phase 8: Failure Scenario
- [ ] No providers available scenario
- [ ] Provider cancels scenario
- [ ] Budget mismatch scenario
- [ ] Graceful error UI with agent explanation

## Phase 9: Polish & Demo Prep
- [ ] Urdu font support (Jameel Noori Nastaleeq or Noto Nastaliq)
- [ ] Animations (Lottie/Reanimated)
- [ ] Dark/light theme toggle
- [ ] Performance optimization
- [ ] EAS Build → APK generation
- [ ] Demo video recording
- [ ] Final README + docs

## Phase 10: GitHub & Submission
- [ ] Tag each milestone commit
- [ ] Push APK to releases
- [ ] Final push + submission link
