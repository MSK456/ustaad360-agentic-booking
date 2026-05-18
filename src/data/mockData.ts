import { AgentTraceEntry, Booking, Dispute, RankedProvider } from '../types';
import { MOCK_PROVIDERS } from './providers';

export const MOCK_BOOKING: Booking = {
  id: 'B-U360-2847',
  userId: 'u1',
  providerId: 'p1',
  serviceCategory: 'plumber',
  description: 'Nala band ho gaya hai — urgent repair needed',
  status: 'confirmed',
  scheduledAt: '2026-05-19T09:00:00',
  address: 'House 42, Block D, Gulberg III, Lahore',
  quotedPrice: 1354,
  userBudget: 1500,
  finalPrice: 1354,
  paymentMethod: 'cash',
  createdAt: '2026-05-18T22:30:00',
};

export const MOCK_RANKED_PROVIDERS: RankedProvider[] = [
  {
    provider: MOCK_PROVIDERS[0],
    scores: {
      distance: 0.94, travelTime: 0.88, availability: 1.0,
      rating: 0.95, reviewRecency: 0.91, reliability: 0.94,
      priceFit: 1.0, skillMatch: 0.9, cancellationRate: 0.97,
    },
    totalScore: 87,
    estimatedPrice: 1354,
    distanceKm: 1.2,
    travelTimeMin: 4,
  },
  {
    provider: MOCK_PROVIDERS[1],
    scores: {
      distance: 0.84, travelTime: 0.81, availability: 0.9,
      rating: 0.88, reviewRecency: 0.78, reliability: 0.87,
      priceFit: 1.0, skillMatch: 0.7, cancellationRate: 0.92,
    },
    totalScore: 74,
    estimatedPrice: 1100,
    distanceKm: 3.1,
    travelTimeMin: 11,
  },
  {
    provider: MOCK_PROVIDERS[2],
    scores: {
      distance: 0.76, travelTime: 0.72, availability: 0.85,
      rating: 0.78, reviewRecency: 0.65, reliability: 0.75,
      priceFit: 1.0, skillMatch: 0.6, cancellationRate: 0.88,
    },
    totalScore: 61,
    estimatedPrice: 900,
    distanceKm: 4.8,
    travelTimeMin: 17,
  },
];

export const MOCK_AGENT_TRACE: AgentTraceEntry[] = [
  {
    id: 't1', bookingId: 'B-U360-2847', agentName: 'NLUAgent', stepNumber: 1,
    inputSummary: '"yaar nala band ho gaya urgent help chahiye 1500 se kam mein"',
    outputSummary: 'Roman Urdu → plumber | urgency: high | budget: ₨1,500',
    reasoning: 'Detected Roman Urdu script. "nala band" is a known slang mapping for blocked drain/plumber. "urgent" maps to urgency:high. "1500 se kam mein" → budget constraint PKR 1500. No clarification needed. Confidence: 0.94.',
    durationMs: 312, timestamp: '2026-05-18T22:30:01', status: 'success',
  },
  {
    id: 't2', bookingId: 'B-U360-2847', agentName: 'DiscoveryAgent', stepNumber: 2,
    inputSummary: 'Service: plumber | City: Lahore | Time: ASAP',
    outputSummary: '11 plumbers found in Lahore matching availability',
    reasoning: 'Queried provider pool for serviceCategory=plumber, city=Lahore. Applied availability filter for today. 11 providers returned before ranking. 3 filtered out due to unavailability.',
    durationMs: 89, timestamp: '2026-05-18T22:30:01', status: 'success',
  },
  {
    id: 't3', bookingId: 'B-U360-2847', agentName: 'RankingAgent', stepNumber: 3,
    inputSummary: '11 providers + 9-factor scoring with user location Gulberg III',
    outputSummary: 'Ahmed Khan ranked #1 (Score: 87/100)',
    reasoning: 'Computed 9-factor weighted scores. Ahmed Khan leads: rating 4.8 (Bayesian adjusted), 1.2km distance, 94% on-time, exact skill match for nala repair, price ₨1,354 within budget. Review recency high — 23 reviews in last 30 days.',
    durationMs: 201, timestamp: '2026-05-18T22:30:02', status: 'success',
  },
  {
    id: 't4', bookingId: 'B-U360-2847', agentName: 'PricingAgent', stepNumber: 4,
    inputSummary: 'Ahmed Khan selected | Budget: ₨1,500 | Urgency: high',
    outputSummary: 'Quoted ₨1,354 — within budget ✅',
    reasoning: 'Base: 800×1hr = ₨800. Complexity×1.7 (leak/nala). Urgency×1.3 (high). Travel: 1.2km×₨50=₨60. Platform fee 5%=₨74. Total ₨1,354. Ratio 0.90 ≤ 1.0 → within budget. Negotiation: ACCEPTED.',
    durationMs: 145, timestamp: '2026-05-18T22:30:02', status: 'success',
  },
  {
    id: 't5', bookingId: 'B-U360-2847', agentName: 'BookingAgent', stepNumber: 5,
    inputSummary: 'Create booking: Ahmed Khan | ₨1,354 | Tomorrow 9AM',
    outputSummary: 'Booking #B-U360-2847 confirmed ✅',
    reasoning: 'Booking record created in Firestore. Provider slot marked as booked. Confirmation message generated in Roman Urdu. Booking ID assigned.',
    durationMs: 178, timestamp: '2026-05-18T22:30:02', status: 'success',
  },
  {
    id: 't6', bookingId: 'B-U360-2847', agentName: 'ReminderAgent', stepNumber: 6,
    inputSummary: 'Booking confirmed | Scheduled: 2026-05-19 09:00',
    outputSummary: '2 reminders scheduled (24h + 1h before)',
    reasoning: 'Notification 1: 2026-05-18 09:00 (24h reminder). Notification 2: 2026-05-19 08:00 (1h reminder). SMS simulation queued for 09:00.',
    durationMs: 45, timestamp: '2026-05-18T22:30:03', status: 'success',
  },
];

export const MOCK_DISPUTE: Dispute = {
  id: 'D-001',
  bookingId: 'B-U360-2847',
  raisedBy: 'user',
  reason: 'Provider arrived 2 hours late and charged extra',
  status: 'resolved',
  resolution: 'Platform credit of ₨200 issued to user account. Provider received a punctuality warning.',
  agentDecision: 'Booking logs confirm provider arrived at 11:05 AM vs scheduled 09:00 AM — 2h 5min late. Policy: >1h late → user compensation. Recommended ₨200 credit (15% of job value). No refund on completed work as quality not disputed.',
  createdAt: '2026-05-19T14:00:00',
};

export const FAILURE_SCENARIO_TRACE: AgentTraceEntry[] = [
  {
    id: 'f1', bookingId: 'FAIL-001', agentName: 'NLUAgent', stepNumber: 1,
    inputSummary: '"500 rupay mein AC gas bharwa do abhi"',
    outputSummary: 'ac_technician | emergency | budget: ₨500',
    reasoning: 'Detected Roman Urdu. "AC gas bharwa do" → ac_technician, gas refill task. "abhi" → emergency urgency. "500 rupay mein" → budget: ₨500.',
    durationMs: 298, timestamp: '2026-05-18T23:00:00', status: 'success',
  },
  {
    id: 'f2', bookingId: 'FAIL-001', agentName: 'DiscoveryAgent', stepNumber: 2,
    inputSummary: 'ac_technician | Lahore | emergency',
    outputSummary: '4 AC technicians found',
    reasoning: 'Found 4 AC technicians available today in Lahore area.',
    durationMs: 76, timestamp: '2026-05-18T23:00:01', status: 'success',
  },
  {
    id: 'f3', bookingId: 'FAIL-001', agentName: 'RankingAgent', stepNumber: 3,
    inputSummary: '4 providers | budget constraint ₨500',
    outputSummary: 'Kamran Iqbal ranked #1 (Score: 82/100)',
    reasoning: 'Ranked 4 providers. Kamran Iqbal leads. Note: price fit score will be 0 for all providers given budget vs minimum service cost.',
    durationMs: 188, timestamp: '2026-05-18T23:00:01', status: 'success',
  },
  {
    id: 'f4', bookingId: 'FAIL-001', agentName: 'PricingAgent', stepNumber: 4,
    inputSummary: 'Kamran Iqbal | Budget: ₨500 | emergency gas refill',
    outputSummary: '❌ Budget mismatch — quoted ₨1,896 vs budget ₨500 (ratio: 3.79)',
    reasoning: 'Base: ₨1000 minimum. Complexity×2.5 (gas refill). Emergency urgency×1.6. Travel ₨180. Platform fee ₨90. Total ₨1,896. Ratio 3.79 >> 1.5 threshold → HARD REJECT. User budget cannot be met by any available provider.',
    durationMs: 134, timestamp: '2026-05-18T23:00:02', status: 'failure',
  },
];
