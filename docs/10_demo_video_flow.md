# Ustaad360 — Demo Video Flow

## Total Duration: 4–5 minutes

---

## Scene 1: Hook (0:00–0:20)
**Show:** Pakistani street, a leaking pipe, frustrated homeowner  
**Narration:** "Pakistan mein koi reliable worker dhundhna mushkil hai. No ratings. No price transparency. Just WhatsApp aur hope."  
**Cut to:** Ustaad360 logo animation on phone screen

---

## Scene 2: App Launch + Onboarding (0:20–0:40)
**Show:** Phone screen recording  
- Splash screen → Ustaad360 logo Lottie animation
- Language selection: Roman Urdu selected
- City: Lahore
- Onboarding swipe cards

**Narration:** "Ustaad360 — Pakistan ka pehla agentic service booking app"

---

## Scene 3: Natural Language Request — Urdu Slang (0:40–1:10)
**Show:** Home screen  
- User types: **"yaar nala band ho gaya urgent help chahiye 1500 se kam mein"**
- Agent Trace updates in real-time (animated)
- NLU Agent: detected Roman Urdu → intent: plumber → urgency: high → budget: ₨1,500

**Highlight:** "Koi form nahi bharna. Koi category select nahi karna. Sirf bolo."

**Show trace panel slide up:**
```
✅ NLUAgent        [312ms]  Roman Urdu detected
   → Service: plumber | Urgency: high | Budget: ₨1,500
✅ DiscoveryAgent  [89ms]   11 plumbers found in Lahore
✅ RankingAgent    [201ms]  9-factor score computed
```

---

## Scene 4: Ranked Results (1:10–1:40)
**Show:** Results screen with 3 provider cards  
- Card 1: Ahmed (Score: 87/100) — 1.2km, ⭐ 4.8, ₨1,350
- Card 2: Bilal (Score: 74/100) — 3.1km, ⭐ 4.5, ₨1,100
- Card 3: Zafar (Score: 61/100) — 4.8km, ⭐ 4.2, ₨900

**Narration:** "9 factors — distance, rating, on-time score, skill match, aur aur bhi — sab calculate ho gaye ek second mein."

Tap "View Profile" → Provider Profile screen  
- Show score breakdown bar chart
- Show reviews with recency indicator

---

## Scene 5: Pricing + Booking (1:40–2:15)
**Show:** Tap "Book This Ustaad" → Booking Confirm screen  
Price breakdown:
```
Base Labour:    ₨800
Complexity ×1.7: ₨560
Travel Charge:  ₨120
Platform Fee:   ₨74
─────────────────────
Total: ₨1,354   Budget: ₨1,500 ✅
```
**Narration:** "Price transparent hai. Budget ke andar hai. Negotiate karne ki zaroorat nahi."

Tap "Confirm Booking" → Success animation  
"Ahmed kal subah 9 baje aayega. Reminder set ho gaya."

---

## Scene 6: Failure Scenario (2:15–2:45)
**Show:** New request typed: **"500 rupay mein AC gas bharwa do abhi"**  
- Pricing Agent runs → quotes ₨1,800
- Budget mismatch: ratio = 3.6

**Show:** Failure screen (red trace highlight)  
```
❌ PricingAgent   Budget mismatch: ₨1,800 quoted vs ₨500 budget
```
Agent response (in Roman Urdu):  
"Maafi chahta hoon, AC gas refill ki kam se kam cost ₨1,200 hai. Kya ₨1,200 mein chalega?"

Action buttons: Accept ₨1,200 | Change Provider | Cancel

**Narration:** "Fail bhi gracefully hota hai. Agent samjhaata hai aur alternatives deta hai."

---

## Scene 7: Post-Service — Review + Reputation (2:45–3:10)
**Show:** Booking status → Completed  
- Review screen: 5 stars, tags: Punctual, Skilled
- Submit → Reputation Agent updates Ahmed's score
- Agent Trace: ReputationAgent → score updated 4.7 → 4.8

---

## Scene 8: Agent Trace Screen (3:10–3:35)
**Show:** Full Agent Trace tab  
- Vertical timeline: all 7 agents with icons, durations, statuses
- Expand NLU Agent → show full Gemini reasoning text
- Total pipeline: 847ms

**Narration:** "Har decision transparent hai. Judges aur users dono dekh sakte hain AI ne kya socha."

---

## Scene 9: Baseline Compare Screen (3:35–4:05)
**Show:** Compare tab  
Same query on both sides:  
"yaar nala band ho gaya urgent help chahiye"

| | Simple System | Ustaad360 |
|---|---|---|
| Language | ❌ Not understood | ✅ Roman Urdu |
| Providers | 0 found | 11 found |
| Ranking | ❌ None | ✅ 9 factors |
| Price | Fixed ₨800 | Dynamic ₨1,354 |
| Failure handling | ❌ Crash | ✅ Graceful |

**Narration:** "Yahi fark hai agentic aur simple system mein."

---

## Scene 10: The "WOW" Features (4:05–4:35)
**Show:** Quick montage of the unique features  
- **TrustShield™** showing Low Risk vs High Risk providers
- **FairPrice Meter™** checking budget fit
- **Explainability Card** ("Why not the closest?")
- **Local Reality Check** for impossible budgets
- **Rescue Mode** automatically finding a backup provider when the first cancels

**Narration:** "Ustaad360 is not just a booking app. It has TrustShield, FairPrice Meter, Explainability Cards, Local Reality Checks, and Rescue Mode. It's a true orchestration pipeline."

---

## Scene 10: Closing (4:05–4:30)
**Show:** App icon, tagline, GitHub QR code, APK QR code  
**Narration:** "Ustaad360 — Agentic. Multilingual. Transparent. Pakistan ke liye banaya gaya."

**Credits overlay:**
```
Built with:  Google Gemini API  •  React Native (Expo)  •  Firebase
GitHub:      github.com/MSK456/ustaad360-agentic-booking
```

---

## Recording Tools
- **Screen Recording:** Android emulator (AVD) or physical device via scrcpy
- **Narration:** OBS Studio or DaVinci Resolve
- **Captions:** Auto-generated + manual Urdu subtitles
- **Export:** 1080p MP4, max 500MB for submission
