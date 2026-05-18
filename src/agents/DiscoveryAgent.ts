import { Provider } from '../types';
import { AgentTrace, ParsedIntent } from '../types/agent';
import { isoNow } from '../utils/dateTime';
import { MOCK_PROVIDERS } from '../data/providers';

export interface DiscoveryAgentOutput {
  providers: Provider[];
  trace: AgentTrace;
}

export function runDiscoveryAgent(intent: ParsedIntent): DiscoveryAgentOutput {
  const t0 = Date.now();

  // Step 1: filter by service category
  let matched = MOCK_PROVIDERS.filter(p =>
    p.serviceCategories.includes(intent.serviceType as any)
  );

  // Step 2: if location known, prefer area match; else fall through to city
  const loc = intent.location?.toLowerCase() ?? '';
  const areaMatched = matched.filter(p =>
    loc && p.city.toLowerCase().includes(loc.split(' ')[0])
  );
  const results = areaMatched.length > 0 ? areaMatched : matched;

  // Step 3: fallback — if still empty, return any available provider
  const final = results.length > 0 ? results : MOCK_PROVIDERS.filter(p => p.isAvailable);

  const trace: AgentTrace = {
    id: `trace-discovery-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'DiscoveryAgent',
    action: 'Query provider pool by service type and location',
    inputSummary: `service: ${intent.serviceType} | location: ${intent.location ?? 'any'} | urgency: ${intent.urgency}`,
    decision: `${final.length} provider(s) found`,
    rationale: `Filtered ${MOCK_PROVIDERS.length} providers by category "${intent.serviceType}". ${areaMatched.length > 0 ? `Area match on "${intent.location}".` : 'No exact area match — returning city-level results.'} Available: ${final.filter(p => p.isAvailable).length}/${final.length}.`,
    confidence: final.length > 0 ? 0.92 : 0.4,
    dataUsed: ['provider_pool', 'service_category_filter', 'location_filter'],
    nextAction: final.length > 0 ? 'RankingAgent' : 'Clarification or fallback',
    status: final.length > 0 ? 'success' : 'warning',
    durationMs: Date.now() - t0,
  };

  return { providers: final, trace };
}
