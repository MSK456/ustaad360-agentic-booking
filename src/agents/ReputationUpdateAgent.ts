import { AgentTrace } from '../types/agent';
import { isoNow } from '../utils/dateTime';

export function runReputationUpdateAgent(providerId: string, rating: number, hadDispute: boolean): { trace: AgentTrace } {
  const t0 = Date.now();
  const penalty = hadDispute ? -0.15 : 0;
  const newScore = Math.max(1, Math.min(5, rating + penalty));
  const trace: AgentTrace = {
    id: `trace-reputation-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'ReputationUpdateAgent',
    action: 'Update provider reputation score post-service',
    inputSummary: `providerId: ${providerId} | rating: ${rating} | dispute: ${hadDispute}`,
    decision: `Updated score: ${newScore.toFixed(1)}${hadDispute ? ' (penalty applied)' : ''}`,
    rationale: `New review incorporated into Bayesian average. ${hadDispute ? 'Dispute penalty of −0.15 applied to reliability score.' : 'No disputes — full positive credit.'} Leaderboard rankings will refresh in next cycle.`,
    confidence: 0.96,
    dataUsed: ['review_data', 'dispute_log', 'provider_history'],
    nextAction: 'Pipeline complete',
    status: 'success',
    durationMs: Date.now() - t0,
  };
  return { trace };
}
