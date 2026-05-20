# Core Acceptance Test Coverage

1. **Urdu Query**: `"Mujhe plmbr chye kal subh DHA"`
- *IntentAgent*: Matches Plumber category, sector DHA, scheduling window tomorrow morning.
- *Status*: Passed ✅

2. **Budget Mismatch**: `"Ac gas refill karani hai abhi, 500 rupay mein"`
- *IntentAgent*: Urgency High, Budget limit 500, category AC Technician.
- *PricingAgent*: Final quote Rs. 1,450.
- *Output*: Displays RED Budget Mismatch Card, halts standard flow, lists clear cost explanations.
- *Status*: Passed ✅

3. **Grocery Item parsing**: `"mjhay 2kg chicken or 1 kg beef chahiay"`
- *IntentAgent*: Identifies grocery/essentials category. Parses exact items and quantities.
- *PricingAgent*: Multiplies catalog values correctly, adds fixed delivery flat rate (Rs. 200).
- *Status*: Passed ✅

4. **Provider Double-Booking Block**:
- *Action*: Attempting to book a provider already locked in for the same time window.
- *Output*: Blocks with Alert preventing double-schedule.
- *Status*: Passed ✅
