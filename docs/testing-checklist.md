# Testing Checklist — Ustaad360 v0.5.0

## QA Challenge Inputs

Run each of these in the Home screen search bar and verify the full flow:

| # | Input | Expected Language | Expected Service | Expected Location |
|---|-------|-----------------|-----------------|------------------|
| 1 | `I need a plumber tomorrow morning in DHA` | English | plumber | DHA |
| 2 | `Kal subah plumber chahiye DHA mein` | Roman Urdu | plumber | DHA |
| 3 | `Mujhe plmbr chye kal subh DHA` | Roman Urdu | plumber (typo corrected) | DHA |
| 4 | `plumber needed tmrw morning DHA phase 5` | English | plumber | DHA |
| 5 | `AC bilkul kaam nahi kar raha, kal subah G-13 mein technician chahiye, budget zyada nahi hai` | Roman Urdu | ac_technician | G-13 |

### For each input, verify:
- [ ] Intent Review shows correct service type
- [ ] Intent Review shows correct language detection
- [ ] Confidence ≥ 70% (or clarification shown if < 70%)
- [ ] Location is shown (or clarification question asks for it)
- [ ] Provider List shows ≥ 1 ranked provider
- [ ] Provider card shows score, distance, rating, price
- [ ] Provider Detail opens with full breakdown
- [ ] 10 factor scores visible in Provider Detail
- [ ] Price receipt shows all components
- [ ] "Book" CTA navigates to Booking Confirm
- [ ] Booking Confirm shows booking ID and confirmation code
- [ ] Booking Confirm shows price receipt
- [ ] Confirming navigates to Follow-up Timeline
- [ ] Follow-up Timeline shows 8 steps
- [ ] Agent Trace tab shows all agent logs
- [ ] Decision Rationale toggle works per agent
- [ ] Baseline Compare tab shows comparison

---

## Feature Checklist

### Language Support
- [ ] English input processed correctly
- [ ] Roman Urdu input processed correctly
- [ ] Urdu script input detected (language detection)
- [ ] Mixed language input processed
- [ ] Typos corrected silently (plmbr → plumber, tmrw → tomorrow, subh → subah)

### Provider Matching
- [ ] Availability filter applied
- [ ] Skill match computed
- [ ] Distance computed (Haversine)
- [ ] Travel time computed
- [ ] Rating shown (Bayesian adjusted)
- [ ] Review recency shown
- [ ] Reliability / on-time score shown
- [ ] Cancellation rate shown
- [ ] Price fit computed against budget
- [ ] Provider fairness score computed
- [ ] All 10 factors visible in Provider Detail

### Pricing
- [ ] Base rate shown
- [ ] Distance surcharge shown
- [ ] Urgency multiplier shown
- [ ] Complexity fee shown
- [ ] Provider premium shown
- [ ] Demand multiplier shown
- [ ] Loyalty discount shown
- [ ] Final estimate shown
- [ ] Budget fit category shown (excellent/good/tight/over_budget)
- [ ] Fairness note for user shown
- [ ] Budget mismatch recovery options shown when over_budget

### Booking
- [ ] Booking ID generated (format: B-U360-XXXXX)
- [ ] Confirmation code generated
- [ ] Scheduled time shown
- [ ] Address shown
- [ ] Payment method selection works
- [ ] "Confirm" button shows success state
- [ ] Simulated WhatsApp/SMS notification shown
- [ ] Simulated calendar update shown
- [ ] Cancellation policy shown

### Follow-up
- [ ] 8 timeline steps visible
- [ ] Steps 1-2 marked as done
- [ ] Step 3 marked as active
- [ ] Steps 4-8 marked as pending
- [ ] "View Agent Trace" button navigates to Trace tab
- [ ] "File a Dispute" button navigates to Dispute Center

### Agent Trace
- [ ] All agents listed (IntentAgent through ReputationUpdateAgent)
- [ ] Each card shows: agentName, action, inputSummary, decision
- [ ] Confidence bar visible per agent
- [ ] Decision Rationale toggle expands/collapses
- [ ] Filter chips work: All, Success, Warning, Failed, Recovered
- [ ] Pipeline summary shows total ms, agent count, outcome badge
- [ ] Fallback traces shown when no real run exists

### Baseline Compare
- [ ] Side-by-side factor comparison visible
- [ ] Score rings show baseline vs agentic total
- [ ] Factor breakdown is expandable
- [ ] System comparison table visible
- [ ] Winner banner shown
- [ ] Cost/benefit note visible
- [ ] Real query shown if pipeline has been run

### Demo Scenarios
- [ ] Scenario A (Successful Booking) runs pipeline and navigates to IntentReview
- [ ] Scenario B (Budget Mismatch) shows recovery options
- [ ] Scenario C (Misspelled) shows typo handling
- [ ] Scenario D (No Provider) shows warning trace
- [ ] Scenario E (Provider Cancels) shows recovered trace
- [ ] Scenario F (Price Dispute) navigates to Dispute Center
- [ ] Loading state shown while pipeline runs
- [ ] QA inputs panel visible at bottom

### Dispute Center
- [ ] 4 dispute types selectable
- [ ] Description text input works
- [ ] Booking context shown if store has booking
- [ ] Submit button disabled until type selected
- [ ] AI decision displayed after submission
- [ ] Resolution text shown
- [ ] Compensation shown if applicable
- [ ] Provider action shown if applicable
- [ ] "File Another Dispute" resets form

---

## Stress Test Scenarios

| Scenario | Input | Expected Outcome | Status |
|----------|-------|-----------------|--------|
| A: Success | "nala band ho gaya urgent 1500 DHA" | Full booking, receipt, timeline | ✅ |
| B: Budget | "500 rupay mein AC gas bharwa do abhi" | Budget mismatch + 5 recovery options | ✅ |
| C: Typos | "Mujhe plmbr chye kal subh DHA" | Typo corrected, pipeline continues | ✅ |
| D: No Slot | "AC technician chahiye tonight G-13 emergency" | Warning trace, alt slots | ✅ |
| E: Cancel | "plumber needed tmrw morning DHA phase 5" | Recovered trace, backup provider | ✅ |
| F: Dispute | (via Dispute Center) | AI decision with compensation | ✅ |

---

## TypeScript Check
```bash
npx tsc --noEmit
# Expected: Exit code 0 (no errors)
```

## Metro Bundler Check
```bash
npx expo start --clear --port 8083
# Expected: "Waiting on http://localhost:8083" with no errors in logs
```

## Runtime Checks (Manual)
- [ ] No "object is not valid as React child" errors
- [ ] No "cannot read property of undefined" errors
- [ ] No duplicate keys in lists
- [ ] Slots render as text (not [object Object])
- [ ] All navigation transitions work
- [ ] Tab bar visible on all tab screens
- [ ] Back button works on all stack screens
