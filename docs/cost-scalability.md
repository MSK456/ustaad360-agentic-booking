# Cost & Scalability — Ustaad360

## Current Demo Mode

The current version runs **entirely offline** with deterministic mock data. There are **zero cloud API calls** during a demo session.

| Component | Demo Mode | Cost |
|-----------|-----------|------|
| NLU / Intent parsing | Local keyword engine | $0 |
| Provider data | In-memory mock (6 providers) | $0 |
| Ranking | Local TypeScript computation | $0 |
| Pricing | Local formula (src/utils/pricing.ts) | $0 |
| Booking records | In-memory (Zustand) | $0 |
| Notifications | Simulated (logged, not sent) | $0 |
| Agent traces | In-memory array | $0 |
| **Total per booking** | | **$0** |

## Production Mode (Future)

### NLU with Gemini Flash

For production multilingual parsing at scale:
- **Model:** Gemini 1.5 Flash (`gemini-1.5-flash`)
- **Input:** ~200 tokens per user query
- **Output:** ~100 tokens (structured JSON intent)
- **Cost:** ~$0.075 per 1M input tokens, $0.30 per 1M output tokens
- **Per query cost:** ~$0.000015 (1.5 paisa)
- **At 10,000 queries/day:** ~$0.15/day for NLU alone

### Database (Firestore)

| Operation | Firestore Cost (per million) |
|-----------|------------------------------|
| Reads | $0.06 |
| Writes | $0.18 |
| Deletes | $0.02 |
| Per booking (10 ops) | ~$0.0000024 |
| At 10,000 bookings/day | ~$0.024/day |

### Notifications (FCM)

Firebase Cloud Messaging: **free** for all notification types.

### Full Cost Estimate at Scale

| Scale | Daily cost (NLU + DB + infra) |
|-------|-------------------------------|
| 1,000 bookings/day | < $1/day |
| 10,000 bookings/day | ~$5–15/day |
| 100,000 bookings/day | ~$50–150/day |

At 100K bookings/day generating ₨1,000 avg commission → **₨100M/day revenue vs ~$150/day infra cost** → 99.9%+ margin on infrastructure.

## Migration Path: Demo → Production

```
Demo (current)          Production (future)
─────────────           ─────────────────────
In-memory providers  →  Cloud Firestore
Local ranking        →  Cloud Functions (scalable)
Keyword NLU          →  Gemini Flash API
Simulated notifs     →  Firebase Cloud Messaging
Mock booking IDs     →  Firestore auto-IDs
In-process traces    →  BigQuery + Looker Studio
```

### Phase 1: Database (1 week)
- Move 6 mock providers to Firestore
- Real-time availability updates
- Persistent booking records

### Phase 2: Real NLU (1–2 weeks)
- Gemini Flash API integration
- Structured output for ParsedIntent
- Fallback to keyword engine if API unavailable

### Phase 3: Notifications (1 week)
- FCM for push notifications
- WhatsApp Business API for booking confirmations
- SMS fallback via Twilio

### Phase 4: Scale (ongoing)
- Cloud Functions for agent pipeline (parallelisable)
- Redis caching for provider availability
- BigQuery for trace analytics and model improvement

## Why Offline-First for Demo

1. **Reliability**: No network dependency = 100% uptime during presentations
2. **Speed**: Local computation = < 100ms pipeline total (vs 1–3s with APIs)
3. **Cost**: Zero cost during development and demo phases
4. **Transparency**: All logic is visible in source code, not hidden behind API calls
5. **Determinism**: Same input always produces same output — makes QA predictable
