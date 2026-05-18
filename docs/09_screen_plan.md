# Ustaad360 — Screen-by-Screen Plan

## Screen 1: Splash Screen
**Route:** `/splash`  
**Purpose:** Brand intro, auth check  
**Elements:**
- Animated Ustaad360 logo (Lottie)
- Tagline: "Har Kaam, Ek App" (Every job, one app)
- Auto-redirects to Onboarding (first launch) or Home (returning user)

---

## Screen 2: Onboarding
**Route:** `/onboarding`  
**Purpose:** Language & city setup  
**Elements:**
- 3 swipeable cards: (1) What is Ustaad360, (2) How it works, (3) Set your city
- Language selector: اردو / Roman Urdu / English
- City dropdown: Lahore, Karachi, Islamabad, Rawalpindi, Multan, Peshawar
- "Get Started" → Home

---

## Screen 3: Home Screen (Tab 1)
**Route:** `/(tabs)/`  
**Purpose:** Primary entry point — natural language request  
**Elements:**
- Header: "Salam [Name]! Kya chahiye aaj?" (greeting in user's language)
- **NL Input Bar** (large, prominent) — text + mic icon
- Suggested prompts carousel: "Nala band hai", "AC gas khatam", "Lights nahi chal rahi"
- Recent bookings (horizontal scroll, max 3)
- Quick category icons (Plumber, AC, Electrician, Carpenter…)

**Interaction Flow:**
1. User types/speaks request
2. "Searching..." animation plays
3. Agent trace updates in background
4. Navigates to → Ranked Results screen

---

## Screen 4: Ranked Results Screen
**Route:** `/results`  
**Purpose:** Show top 3 ranked providers  
**Elements:**
- Header: "Aapke liye best options 🔍"
- Intent summary chip: e.g. "AC Technician • Tomorrow 10am • Budget ₨2,000"
- **Provider Cards** (top 3, ranked):
  - Photo, name, rating stars, distance, availability badge
  - Score bar (visual 0–100)
  - Estimated price
  - "Book Now" + "View Profile" buttons
- "See All (12 providers)" collapse/expand
- Bottom: "How did we rank these? →" → links to Trace screen

---

## Screen 5: Provider Profile Screen
**Route:** `/provider/[id]`  
**Purpose:** Detailed provider info before booking  
**Elements:**
- Hero photo, name, verified badge
- Stat pills: ⭐ 4.7 | 📍 2.3km | ✅ 94% on-time | 🔧 Plumber
- Skills list (tags)
- Score breakdown: mini bar chart of 9 factors
- Reviews section (3 most recent, with recency indicator)
- Available time slots calendar
- Price estimate for this job
- **"Book This Ustaad"** CTA button

---

## Screen 6: Booking Confirmation Screen
**Route:** `/booking/confirm`  
**Purpose:** Review details and confirm  
**Elements:**
- Provider summary (photo, name, rating)
- Job description (normalized from NLU)
- Date/time slot selected
- Price breakdown card:
  - Base labour, complexity, travel, platform fee
  - Total quoted vs user budget
  - Negotiation result badge (✅ Within budget / ⚠️ Slightly over)
- Payment method selector (Cash / Easypaisa / JazzCash)
- **"Confirm Booking"** button
- **"Change Provider"** link

---

## Screen 7: Booking Success Screen
**Route:** `/booking/success`  
**Purpose:** Celebrate confirmed booking  
**Elements:**
- Lottie success animation
- Booking ID: #U360-2847
- "Ustaad Ahmed will arrive tomorrow at 10:00 AM"
- Reminder confirmation: "We'll remind you 1 hour before"
- Share button (share booking card via WhatsApp)
- "Track Booking" → Booking Detail screen
- "Go Home" button

---

## Screen 8: My Bookings Screen (Tab 2)
**Route:** `/(tabs)/bookings`  
**Purpose:** Full booking history  
**Elements:**
- Filter tabs: All | Active | Completed | Cancelled | Disputed
- Booking cards with status badge
- Tap → Booking Detail screen
- Empty state with CTA to book

---

## Screen 9: Booking Detail Screen
**Route:** `/booking/[id]`  
**Purpose:** Live status + post-service actions  
**Elements:**
- Status timeline: Confirmed → En Route → In Progress → Completed
- Provider contact card (call button, mock)
- Job description + address
- Price paid
- Post-completion (if status=completed):
  - "Leave a Review" CTA
  - "File a Dispute" CTA

---

## Screen 10: Review Screen
**Route:** `/review`  
**Purpose:** Rate and review the provider  
**Elements:**
- Star rating (1–5, tap to select)
- Tag selector: Punctual / Skilled / Clean / Overcharged / Late / Rude
- Text comment (optional)
- "Submit Review" → triggers Reputation Agent
- Thank you animation

---

## Screen 11: Dispute Screen
**Route:** `/dispute`  
**Purpose:** File a complaint  
**Elements:**
- Reason dropdown: Quality issue / Provider no-show / Overcharged / Safety concern
- Description text area
- Upload photo (mock)
- "Submit Dispute" → Dispute Agent runs → shows resolution
- Resolution card (from Gemini Dispute Agent)

---

## Screen 12: Agent Trace Screen (Tab 3)
**Route:** `/(tabs)/trace`  
**Purpose:** Full transparency of every AI decision  
**Elements:**
- Booking selector dropdown (which booking to inspect)
- Vertical timeline of `AgentTraceEntry[]`:
  - Agent name + icon
  - Status badge (✅ success / ❌ failure / ⏭ skipped)
  - Input summary
  - Output summary
  - Expandable "Reasoning" section (Gemini chain-of-thought)
  - Duration badge (e.g. "142ms")
- Total pipeline duration at bottom
- Export trace button (JSON)

---

## Screen 13: Baseline Compare Screen (Tab 4)
**Route:** `/(tabs)/compare`  
**Purpose:** Show Ustaad360 vs simple non-agentic system  
**Elements:**
- Same test query displayed at top
- **Split view (left/right)**:
  - Left: "Simple System" — keyword match, no ranking, fixed price, English only
  - Right: "Ustaad360 Agentic" — full NLU, ranked results, dynamic price
- Comparison table:
  - Language understood? ❌ / ✅
  - Providers found: 2 / 8
  - Ranking factors: 0 / 9
  - Price negotiation: ❌ / ✅
  - Failure handling: ❌ / ✅
  - Time to result: 3s / 2.1s
- Visual winner highlight

---

## Screen 14: Profile Screen (Tab 5)
**Route:** `/(tabs)/profile`  
**Purpose:** User account and settings  
**Elements:**
- Avatar, name, city
- Language preference toggle
- Past bookings summary stats
- Privacy policy link
- Cost/scalability note (for hackathon judges)
- "About Ustaad360" section
- Sign out

---

## Failure Scenario Screen (inline)
**Triggered on:** No providers found / Budget mismatch / Provider cancelled  
**Elements:**
- Sad Lottie animation
- Agent explanation in user's language: "Abhi is area mein koi plumber available nahi hai. Kya aap time change karna chahenge?"
- Action buttons: Change Time | Expand Search Radius | Notify When Available
- Agent Trace shows failure point highlighted in red
