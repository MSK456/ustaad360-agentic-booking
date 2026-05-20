# Product Brief — Ustaad360

## 1. Vision
Ustaad360 is an AI-first, agentic mobile platform connecting Pakistani households with verified local service providers (ustaaDs) using natural language, Roman Urdu, and mixed-slang input, replacing chaotic WhatsApp chats and unvetted local listings.

## 2. Key Challenges Solved
- **No Verification/Trust**: Every provider possesses dynamic reputation tags based on real completion rates.
- **Opaque Pricing**: Avoids direct extortion with a FairPrice meter showing travel, base, and complexity breakdowns.
- **Language Barriers**: Converses seamlessly in Roman Urdu (e.g., "AC bilkul chal nahi raha, koi ustaad bhejo").
- **Booking Overlaps**: Prevents double-booking and alerts users of overlapping time slots.

## 3. Platform Architecture
- Frontend: Expo/React Native.
- State: Zustand + AsyncStorage for offline persistence.
- Agent Core: 10-agent local typescript deterministic orchestrator.
