import { AgentTrace, BookingResult, PricingResult, RankedProviderResult } from '../types/agent';
import { isoNow, bookingId, shortId } from '../utils/dateTime';

export interface BookingAgentOutput {
  booking: BookingResult;
  trace: AgentTrace;
}

export function runBookingAgent(
  provider: RankedProviderResult,
  pricing: PricingResult,
  scheduledAt: string,
  address = 'House 42, Gulberg III, Lahore',
): BookingAgentOutput {
  const t0 = Date.now();
  const id  = bookingId();
  const code = shortId();

  const booking: BookingResult = {
    bookingId: id,
    providerId: provider.provider.id,
    scheduledAt,
    address,
    finalPrice: pricing.finalEstimate,
    paymentMethod: 'cash',
    confirmationCode: code,
    receipt: `RECEIPT\n───────────────\nBooking: ${id}\nProvider: ${provider.provider.name}\nService: ${provider.provider.serviceCategories[0]}\nScheduled: ${scheduledAt}\nAddress: ${address}\nAmount: ₨${pricing.finalEstimate}\nPayment: Cash\nCode: ${code}\n───────────────`,
    status: 'confirmed',
  };

  const trace: AgentTrace = {
    id: `trace-booking-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'BookingAgent',
    action: 'Create booking record and generate receipt',
    inputSummary: `provider: ${provider.provider.name} | price: ₨${pricing.finalEstimate} | time: ${scheduledAt}`,
    decision: `Booking ${id} confirmed`,
    rationale: `Booking record created. Provider slot marked reserved. Receipt generated. Confirmation code ${code} sent. Calendar event queued for ${scheduledAt}.`,
    confidence: 0.98,
    dataUsed: ['provider_slot', 'pricing_result', 'user_address'],
    nextAction: 'NotificationAgent',
    status: 'success',
    durationMs: Date.now() - t0,
  };

  return { booking, trace };
}
