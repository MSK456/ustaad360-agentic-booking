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

  // Determine city context from location string
  const loc = (intent.location || '').toLowerCase();
  let queryCity = 'Islamabad'; // DEFAULT CITY MUST BE ISLAMABAD

  if (loc.includes('lahore') || loc.includes('lhr') || loc.includes('johar') || loc.includes('gulberg')) {
    queryCity = 'Lahore';
  } else if (loc.includes('karachi') || loc.includes('khi') || loc.includes('clifton')) {
    queryCity = 'Karachi';
  } else if (loc.includes('islamabad') || loc.includes('isb') || loc.includes('rawalpindi') || loc.includes('pindi') || loc.match(/\b([fghi]-\d+)\b/i) || loc.includes('blue area') || loc.includes('bahria') || loc.includes('dha')) {
    queryCity = 'Islamabad';
  }

  // Step 2: Filter strictly by city if known
  let results = matched;
  let cityFiltered = false;
  if (queryCity) {
    const cityMatches = matched.filter(p => p.city.toLowerCase() === queryCity.toLowerCase());
    if (cityMatches.length > 0) {
      results = cityMatches;
      cityFiltered = true;
    } else {
      // Return empty if no provider in city, as per user requirement (or remote fallback)
      results = [];
    }
  }

  // Step 3: Apply pseudo-random dynamic provider rotation (Simulating live current load / fair dispatch)
  const hash = intent.originalText.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const final = results.map(p => {
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
    rationale: `Filtered ${MOCK_PROVIDERS.length} providers by category "${intent.serviceType}". ${cityFiltered ? `City match on "${queryCity}".` : 'No exact city match — returning general results.'} Applied dynamic load balancing rotation. Available: ${availableCount}/${final.length}.`,
    confidence: final.length > 0 ? 0.92 : 0.4,
    dataUsed: ['provider_pool', 'service_category_filter', 'location_filter', 'live_load_balancer'],
    nextAction: final.length > 0 ? 'RankingAgent' : 'Clarification or fallback',
    status: availableCount > 0 ? 'success' : 'warning',
    durationMs: Date.now() - t0,
  };

  return { providers: final, trace };
}
