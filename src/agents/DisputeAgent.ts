import { AgentTrace } from '../types/agent';
import { isoNow } from '../utils/dateTime';

export type DisputeType = 'price_dispute' | 'no_show' | 'quality_complaint' | 'cancellation';

export interface DisputeAgentInput {
  bookingId: string;
  type: DisputeType;
  description: string;
  finalPrice: number;
}

export interface DisputeAgentOutput {
  decision: string;
  resolution: string;
  compensation?: string;
  providerAction?: string;
  trace: AgentTrace;
}

const DISPUTE_RULES: Record<DisputeType, (price: number) => Omit<DisputeAgentOutput, 'trace'>> = {
  no_show: (price) => ({
    decision: 'Full refund approved',
    resolution: 'Provider failed to appear. Full refund of ₨' + price + ' issued to user.',
    compensation: '₨' + price + ' credit applied',
    providerAction: 'Provider penalty applied. 2 no-shows → account suspension.',
  }),
  price_dispute: (price) => ({
    decision: 'Partial credit approved',
    resolution: 'Price was transparently calculated. Platform credit of ₨' + Math.round(price * 0.1) + ' issued as goodwill.',
    compensation: '₨' + Math.round(price * 0.1) + ' credit',
    providerAction: 'No action — price was within quoted range.',
  }),
  quality_complaint: () => ({
    decision: 'Human escalation initiated',
    resolution: 'Quality issue logged. Assigned to human mediator for review within 4 hours.',
    providerAction: 'Provider under review. Rating temporarily frozen.',
  }),
  cancellation: (price) => ({
    decision: 'Partial refund per cancellation policy',
    resolution: '80% refund of ₨' + Math.round(price * 0.8) + ' issued. ₨' + Math.round(price * 0.2) + ' retained as cancellation fee.',
    compensation: '₨' + Math.round(price * 0.8) + ' refund',
  }),
};

export function runDisputeAgent(input: DisputeAgentInput): DisputeAgentOutput {
  const t0 = Date.now();
  const rule = DISPUTE_RULES[input.type](input.finalPrice);

  const trace: AgentTrace = {
    id: `trace-dispute-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'DisputeAgent',
    action: `Process ${input.type} dispute`,
    inputSummary: `bookingId: ${input.bookingId} | type: ${input.type} | price: ₨${input.finalPrice}`,
    decision: rule.decision,
    rationale: `Applied dispute policy for "${input.type}". ${rule.resolution} ${rule.providerAction ? 'Provider: ' + rule.providerAction : ''}`,
    confidence: 0.88,
    dataUsed: ['booking_record', 'dispute_policy', 'provider_history', 'payment_record'],
    nextAction: input.type === 'quality_complaint' ? 'Human escalation' : 'ReputationUpdateAgent',
    status: 'recovered',
    durationMs: Date.now() - t0,
  };

  return { ...rule, trace };
}
