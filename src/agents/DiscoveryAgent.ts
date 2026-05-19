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
  const candidates = results.length > 0 ? results : MOCK_PROVIDERS.filter(p => p.isAvailable);

  // Step 4: Apply pseudo-random dynamic provider rotation (Simulating live current load / fair dispatch)
  // We hash the query text so the demo remains deterministic for a specific query, but varies across queries.
  const hash = intent.originalText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const final = candidates.map(p => {
    // Determine if this provider is "temporarily busy" based on query hash and provider id
    const pHash = p.id.charCodeAt(p.id.length - 1);
    const isBusyNow = (hash + pHash) % 5 === 0; // ~20% chance to be busy right now
    
    if (isBusyNow) {
      return { ...p, isAvailable: false, availableSlots: p.availableSlots.slice(1) };
    }
    return p;
  });

  const availableCount = final.filter(p => p.isAvailable).length;

  const trace: AgentTrace = {
    id: `trace-discovery-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'DiscoveryAgent',
    action: 'Query provider pool by service type and location',
    inputSummary: `service: ${intent.serviceType} | location: ${intent.location ?? 'any'} | urgency: ${intent.urgency}`,
    decision: `${final.length} provider(s) found, ${availableCount} available`,
    rationale: `Filtered ${MOCK_PROVIDERS.length} providers by category "${intent.serviceType}". ${areaMatched.length > 0 ? `Area match on "${intent.location}".` : 'No exact area match — returning city-level results.'} Applied dynamic load balancing rotation. Available: ${availableCount}/${final.length}.`,
    confidence: final.length > 0 ? 0.92 : 0.4,
    dataUsed: ['provider_pool', 'service_category_filter', 'location_filter', 'live_load_balancer'],
    nextAction: final.length > 0 ? 'RankingAgent' : 'Clarification or fallback',
    status: availableCount > 0 ? 'success' : 'warning',
    durationMs: Date.now() - t0,
  };

  return { providers: final, trace };
}
