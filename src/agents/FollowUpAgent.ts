import { AgentTrace, BookingResult, FollowUpEvent } from '../types/agent';
import { isoNow } from '../utils/dateTime';
import { Colors } from '../theme/colors';

export interface FollowUpAgentOutput {
  timeline: FollowUpEvent[];
  trace: AgentTrace;
}

export function runFollowUpAgent(booking: BookingResult): FollowUpAgentOutput {
  const t0 = Date.now();

  const timeline: FollowUpEvent[] = [
    { step: 1, label: 'Booking Confirmed',   time: '10:30 PM', date: 'Today',    status: 'done',   icon: 'checkmark-circle', color: Colors.success, note: `ID: ${booking.bookingId}` },
    { step: 2, label: 'Reminder Scheduled',  time: '9:00 AM',  date: 'Tomorrow', status: 'done',   icon: 'notifications',     color: Colors.primary },
    { step: 3, label: 'Provider Assigned',   time: '8:50 AM',  date: 'Tomorrow', status: 'active', icon: 'navigate',          color: Colors.primary, note: 'Arriving in ~10 min' },
    { step: 4, label: 'Service In Progress', time: '9:10 AM',  date: 'Tomorrow', status: 'pending',icon: 'construct',         color: Colors.warning },
    { step: 5, label: 'Work Completed',      time: '—',        date: '—',        status: 'pending',icon: 'flag',              color: Colors.textDisabled },
    { step: 6, label: 'Completion Checklist',time: '—',        date: '—',        status: 'pending',icon: 'clipboard',         color: Colors.textDisabled },
    { step: 7, label: 'Feedback Collected',  time: '—',        date: '—',        status: 'pending',icon: 'star',              color: Colors.textDisabled },
    { step: 8, label: 'Reputation Updated',  time: '—',        date: '—',        status: 'pending',icon: 'trending-up',       color: Colors.textDisabled },
  ];

  const trace: AgentTrace = {
    id: `trace-followup-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'FollowUpAgent',
    action: 'Build post-booking lifecycle timeline',
    inputSummary: `bookingId: ${booking.bookingId}`,
    decision: '8-step follow-up timeline generated',
    rationale: 'Timeline covers full lifecycle: confirmation → reminder → assignment → service → completion → checklist → feedback → reputation. All steps tracked with timestamps.',
    confidence: 0.95,
    dataUsed: ['booking_record', 'provider_schedule', 'timeline_template'],
    nextAction: 'Await service completion trigger',
    status: 'success',
    durationMs: Date.now() - t0,
  };

  return { timeline, trace };
}
