import { AgentTrace, ParsedIntent, RankedProviderResult } from '../types/agent';
import { isoNow, addMinutes, formatTime } from '../utils/dateTime';

export interface SchedulingAgentOutput {
  scheduledAt: string;
  slot: string;
  isAfterHoursFallback: boolean;
  afterHoursFee: number;
  trace: AgentTrace;
}

export function runSchedulingAgent(provider: RankedProviderResult, intent: ParsedIntent): SchedulingAgentOutput {
  const t0 = Date.now();
  const prov = provider.provider;
  
  let scheduledAt = '';
  let slot = '';
  let isAfterHoursFallback = false;
  let afterHoursFee = 0;
  let rationale = '';

  const now = new Date();
  
  if (intent.isAfterHours) {
    if (prov.isEmergencyAvailable) {
      // It's after hours and provider handles emergency
      const eta = addMinutes(now, prov.emergencyResponseMinutes || 30 + provider.travelTimeMin);
      scheduledAt = eta.toISOString();
      slot = `ASAP (${formatTime(eta)})`;
      afterHoursFee = 500;
      rationale = `Requested time is after-hours. ${prov.name} is a 24/7 emergency provider. Assigned emergency slot with ₨500 fee. ETA: ${prov.emergencyResponseMinutes || 30} mins.`;
    } else {
      // It's after hours but provider does NOT handle emergency
      // Push to next morning 9am
      const nextMorning = new Date();
      if (nextMorning.getHours() >= 22 || intent.dateLabel === 'tomorrow') {
        nextMorning.setDate(nextMorning.getDate() + 1);
      }
      nextMorning.setHours(9, 0, 0, 0);
      scheduledAt = nextMorning.toISOString();
      slot = 'Tomorrow 09:00 AM';
      isAfterHoursFallback = true;
      rationale = `Requested time is outside ${prov.name}'s working hours (08:00 - 22:00) and they do not offer emergency service. Fallback to earliest safe slot: ${slot}.`;
    }
  } else if (intent.requestedDateTime) {
    const reqDate = new Date(intent.requestedDateTime);
    scheduledAt = reqDate.toISOString();
    slot = `${intent.dateLabel === 'tomorrow' ? 'Tomorrow' : 'Today'} ${formatTime(reqDate)}`;
    rationale = `Exact time requested: ${slot}. Provider is available within normal working hours.`;
  } else if (intent.timeWindow === 'now') {
    const eta = addMinutes(now, provider.travelTimeMin + 15);
    scheduledAt = eta.toISOString();
    slot = `ASAP (${formatTime(eta)})`;
    rationale = `Urgent request during working hours. Provider dispatched immediately. ETA: ${provider.travelTimeMin + 15} mins.`;
  } else {
    // fuzzy time like morning, evening, tomorrow
    const isTomorrow = intent.dateLabel === 'tomorrow';
    let label = isTomorrow ? 'Tomorrow' : 'Today';
    let hour = 10;
    if (intent.timeWindow === 'afternoon') hour = 14;
    if (intent.timeWindow === 'evening') hour = 17;
    
    const reqDate = new Date();
    if (isTomorrow) reqDate.setDate(reqDate.getDate() + 1);
    reqDate.setHours(hour, 0, 0, 0);
    
    scheduledAt = reqDate.toISOString();
    slot = `${label} ${formatTime(reqDate)} (Flexible window)`;
    rationale = `Flexible time preference '${intent.timePreference}'. Assigned standard window: ${slot}.`;
  }

  const trace: AgentTrace = {
    id: `trace-scheduling-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'SchedulingAgent',
    action: isAfterHoursFallback ? 'Apply after-hours fallback logic' : 'Reserve provider time slot',
    inputSummary: `provider: ${prov.name} | preference: ${intent.timePreference} | afterHours: ${intent.isAfterHours} | emergencyProvider: ${prov.isEmergencyAvailable}`,
    decision: `Slot: ${slot}`,
    rationale,
    confidence: isAfterHoursFallback ? 0.8 : 0.95,
    dataUsed: ['provider_working_hours', 'provider_emergency_flag', 'user_time_preference', 'current_device_time'],
    nextAction: 'PricingAgent',
    status: isAfterHoursFallback ? 'warning' : 'success',
    durationMs: Date.now() - t0,
  };

  return { scheduledAt, slot, isAfterHoursFallback, afterHoursFee, trace };
}
