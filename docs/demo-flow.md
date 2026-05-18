# Demo Video Flow — Ustaad360

## Format: 4–5 minute screen recording with narration
## Language: Roman Urdu narration with English subtitles

---

## Scene 1 — Hook (0:00–0:20)
**Visual:** Splash screen → Ustaad360 logo Lottie animation  
**Narration:** *"Pakistan mein koi reliable worker dhundhna mushkil hai. No ratings, no price transparency, sirf WhatsApp aur hope. Ustaad360 yeh sab badal deta hai."*

---

## Scene 2 — Onboarding (0:20–0:35)
**Visual:** Language selector → Roman Urdu → City: Lahore → 3 onboarding cards → Home  
**Narration:** *"Setup? Sirf 30 seconds."*

---

## Scene 3 — Natural Language Request (0:35–1:10)
**Visual:** Home screen  
User types: **"yaar nala band ho gaya urgent help chahiye 1500 se kam mein"**  
Agent Trace panel slides up — updates in real time:
```
✅ NLUAgent       [312ms]  Roman Urdu detected
   → plumber | urgency: high | budget: ₨1,500 | time: ASAP
✅ DiscoveryAgent [89ms]   11 plumbers found in Lahore
✅ RankingAgent   [201ms]  9-factor scores computed
```
**Narration:** *"Koi form nahi, koi category nahi. Sirf bolo — AI samajh jaata hai."*

---

## Scene 4 — Ranked Results (1:10–1:40)
**Visual:** Results screen showing top 3 cards:
- 🥇 Ahmed Khan — Score 87/100 | ⭐4.8 | 1.2km | ₨1,350 | ✅ Available now
- 🥈 Bilal Hussain — Score 74/100 | ⭐4.5 | 3.1km | ₨1,100
- 🥉 Zafar Ali — Score 61/100 | ⭐4.2 | 4.8km | ₨900

Tap "View Profile" → score breakdown bar chart → reviews with recency tags  
**Narration:** *"9 factors: distance, rating, on-time score, skill match — sab ek second mein."*

---

## Scene 5 — Pricing & Booking (1:40–2:15)
**Visual:** Tap "Book This Ustaad" → Booking Confirm screen
```
Base Labour:       ₨800
Complexity ×1.7:   ₨560
Travel (1.2km):    ₨120
Platform Fee (5%): ₨74
─────────────────────────
Total:             ₨1,354   Budget: ₨1,500 ✅
```
Tap "Confirm" → Lottie success animation  
*"Ahmed kal subah 9 baje aayega. Reminder set ho gaya."*  
**Narration:** *"Transparent price. Budget ke andar. Book in one tap."*

---

## Scene 6 — Failure Scenario (2:15–2:45)
**Visual:** New request: **"500 rupay mein AC gas bharwa do abhi"**  
PricingAgent quotes ₨1,800 — ratio 3.6 → hard reject  
Trace panel shows:
```
❌ PricingAgent   Budget mismatch: ₨1,800 quoted vs ₨500 budget
```
Failure screen with agent message:  
*"Maafi chahta hoon, AC gas refill ki minimum cost ₨1,200 hai. Kya ₨1,200 mein chalega?"*  
Action buttons: Accept ₨1,200 | Change Provider | Cancel  
**Narration:** *"Fail bhi gracefully hota hai. Agent samjhaata hai aur alternatives deta hai."*

---

## Scene 7 — Post-Service: Review + Reputation (2:45–3:10)
**Visual:** Booking status → Completed → Review screen  
5 stars selected, tags: Punctual, Skilled  
Submit → Reputation Agent trace:  
`ReputationAgent → rating updated 4.7 → 4.8`  
**Narration:** *"Har review se ustaad ka score update hota hai — real-time."*

---

## Scene 8 — Agent Trace Screen (3:10–3:40)
**Visual:** Trace tab — full vertical timeline  
Expand NLU Agent → show full Gemini reasoning  
Expand RankingAgent → show all 9 factor scores  
Total pipeline: 847ms  
**Narration:** *"Har decision transparent hai. Judges aur users dono dekh sakte hain AI ne kya socha aur kyun."*

---

## Scene 9 — Baseline Compare (3:40–4:05)
**Visual:** Compare tab — same query on both sides

| | Simple System | Ustaad360 |
|---|---|---|
| Language understood | ❌ | ✅ Roman Urdu |
| Providers found | 0 | 11 |
| Ranking factors | 0 | 9 |
| Price negotiation | ❌ | ✅ |
| Failure handling | ❌ Blank screen | ✅ Graceful |

**Narration:** *"Yahi fark hai agentic aur simple system mein."*

---

## Scene 10 — Closing (4:05–4:30)
**Visual:** App logo + tagline + GitHub + APK QR code
```
Built with: Google Gemini API • React Native (Expo) • Firebase
GitHub: github.com/MSK456/ustaad360-agentic-booking
```
**Narration:** *"Ustaad360 — Agentic. Multilingual. Transparent. Pakistan ke liye banaya gaya."*

---

## Recording Checklist
- [ ] Android emulator (AVD Manager) or physical device via scrcpy
- [ ] OBS Studio for screen + audio capture
- [ ] DaVinci Resolve for editing + subtitles
- [ ] Export: 1080p MP4
- [ ] Upload to YouTube (unlisted) + attach link in README
