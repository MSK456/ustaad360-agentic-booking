import { AgentTrace, BookingResult } from '../types/agent';
import { isoNow } from '../utils/dateTime';

export interface NotificationAgentOutput { trace: AgentTrace }

export function runNotificationAgent(booking: BookingResult): NotificationAgentOutput {
  const t0 = Date.now();
  const trace: AgentTrace = {
    id: `trace-notify-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'NotificationAgent',
    action: 'Send booking confirmation and schedule reminders',
    inputSummary: `bookingId: ${booking.bookingId} | scheduled: ${booking.scheduledAt}`,
    decision: 'WhatsApp/SMS confirmation queued. 2 reminders scheduled.',
    rationale: `Confirmation message dispatched to user and provider. Reminder 1: 24h before (${booking.scheduledAt}). Reminder 2: 1h before. Both via simulated SMS gateway. Escalation contact stored.`,
    confidence: 0.97,
    dataUsed: ['booking_record', 'user_contact', 'provider_contact'],
    nextAction: 'FollowUpAgent',
    status: 'success',
    durationMs: Date.now() - t0,
  };
  return { trace };
}
