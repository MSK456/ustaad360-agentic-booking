import { ParsedIntent, AgentTrace } from '../types/agent';
import { isoNow } from '../utils/dateTime';

// ─── Keyword maps ─────────────────────────────────────────────────────────
const SERVICE_MAP: Record<string, string[]> = {
  plumber:       ['plumber', 'plmbr', 'plmber', 'nala', 'pipe', 'paani', 'water', 'drain', 'tap', 'bore', 'leak'],
  electrician:   ['electrician', 'bijli', 'wiring', 'electric', 'light', 'fan', 'switch', 'current', 'socket', 'breaker', 'meter', 'bulb', 'pankha'],
  ac_technician: ['ac', 'air condition', 'aircon', 'cooling', 'gas refill', 'thermostat', 'technician'],
  carpenter:     ['carpenter', 'wood', 'darwaza', 'door', 'furniture', 'cabinet', 'polish'],
  painter:       ['painter', 'paint', 'rang', 'colour', 'color'],
  cleaner:       ['cleaner', 'cleaning', 'safai', 'sweep', 'mop'],
  mason:         ['mason', 'tiles', 'cement', 'wall crack', 'plaster'],
  mechanic:      ['mechanic', 'car repair', 'engine', 'vehicle'],
  beautician:    ['beautician', 'salon', 'makeup', 'hair', 'facial', 'waxing', 'threading', 'beauty'],
  tutor:         ['tutor', 'teacher', 'padhai', 'study', 'math', 'science', 'english', 'tuition'],
  driver:        ['driver', 'driving', 'car drive', 'chauffeur', 'pick drop'],
  grocery:       ['grocery', 'kiryana', 'rashan', 'mart', 'super store', 'items'],
  fruits_vegetables: ['sabzi', 'vegetables', 'fruit', 'fruits', 'mandi'],
  meat:          ['meat', 'gosht', 'chicken', 'beef', 'mutton', 'qeema'],
};

const MISSPELL_MAP: Record<string, string> = {
  plmbr: 'plumber', plmber: 'plumber', plmbrs: 'plumbers',
  chye: 'chahiye', chai: 'chahiye', chy: 'chahiye',
  subh: 'subah', subhh: 'subah',
  tmrw: 'tomorrow', tmr: 'tomorrow', tmrow: 'tomorrow', tmrrow: 'tomorrow',
  kl: 'kal', kal: 'kal',
  urgnt: 'urgent', emrgncy: 'emergency',
};

const LOCATION_TOKENS = [
  'dha', 'g-13', 'g13', 'f-10', 'f10', 'i-8', 'i8', 'g-9', 'g9',
  'gulberg', 'bahria', 'johar', 'clifton', 'defence', 'nazimabad',
  'blue area', 'saddar', 'phase', 'sector', 'block',
  'rawalpindi', 'islamabad', 'lahore', 'karachi', 'peshawar',
];

// ─── Helpers ──────────────────────────────────────────────────────────────
function fixTypos(text: string): string {
  return text.split(/\s+/).map(w => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, '');
    return MISSPELL_MAP[lower] ?? w;
  }).join(' ');
}

function detectLanguage(text: string): ParsedIntent['detectedLanguage'] {
  if (/[\u0600-\u06FF]/.test(text)) return 'urdu';
  const romanWords = ['mujhe', 'chahiye', 'subah', 'mein', 'nahi', 'hai', 'kal',
                      'abhi', 'bilkul', 'kaam', 'zyada', 'sasta', 'aaj'];
  const englishWords = ['need', 'want', 'please', 'required', 'book', 'get'];
  const hasRoman = romanWords.some(w => text.toLowerCase().includes(w));
  const hasEng = englishWords.some(w => text.toLowerCase().includes(w));
  if (hasRoman && hasEng) return 'mixed';
  if (hasRoman) return 'roman_urdu';
  return 'english';
}

function detectService(raw: string): { service: string; baseConfidence: number; skills: string[] } {
  const text = fixTypos(raw).toLowerCase();
  // Special: AC + kaam nahi / not working → ac_technician
  if ((text.includes('ac') || text.includes('air con')) &&
      (text.includes('kaam nahi') || text.includes('not work') || text.includes('chal nahi'))) {
    return { service: 'ac_technician', baseConfidence: 0.96, skills: ['AC repair', 'AC service'] };
  }
  let best = { service: 'general', baseConfidence: 0.45, skills: [] as string[] };
  for (const [svc, kws] of Object.entries(SERVICE_MAP)) {
    const hits = kws.filter(k => text.includes(k));
    if (hits.length > 0) {
      const conf = Math.min(0.70 + hits.length * 0.10, 0.98);
      if (conf > best.baseConfidence) best = { service: svc, baseConfidence: conf, skills: hits };
    }
  }
  return best;
}

function detectTimeIntelligence(raw: string): {
  urgency: ParsedIntent['urgency'];
  timePreference: string;
  dateLabel: 'today' | 'tomorrow' | 'unknown';
  timeWindow: 'now' | 'morning' | 'afternoon' | 'evening' | 'night' | 'exact' | 'unknown';
  requestedDateTime?: string;
  isAfterHours: boolean;
} {
  const t = fixTypos(raw).toLowerCase();
  
  let dateLabel: 'today' | 'tomorrow' | 'unknown' = 'unknown';
  if (['today', 'aaj', 'abhi', 'now', 'tonight', 'raat ko'].some(w => t.includes(w))) dateLabel = 'today';
  else if (['tomorrow', 'kal', 'tmrw'].some(w => t.includes(w))) dateLabel = 'tomorrow';

  let timeWindow: 'now' | 'morning' | 'afternoon' | 'evening' | 'night' | 'exact' | 'unknown' = 'unknown';
  if (['abhi', 'now', 'foran', 'forn', 'asap', 'jaldi'].some(w => t.includes(w))) timeWindow = 'now';
  else if (['morning', 'subah', 'subh'].some(w => t.includes(w))) timeWindow = 'morning';
  else if (['afternoon', 'dopehar'].some(w => t.includes(w))) timeWindow = 'afternoon';
  else if (['evening', 'shaam'].some(w => t.includes(w))) timeWindow = 'evening';
  else if (['night', 'raat', 'tonight'].some(w => t.includes(w))) timeWindow = 'night';

  let requestedDateTime: string | undefined = undefined;
  let isAfterHours = false;

  // Exact time regex: e.g., "2am", "2 am", "2 baje", "14:00"
  const timeMatch = t.match(/(\d{1,2})(?::\d{2})?\s*(am|pm|baje)/i);
  if (timeMatch) {
    timeWindow = 'exact';
    let hour = parseInt(timeMatch[1], 10);
    const ampm = timeMatch[2].toLowerCase();
    
    if (ampm === 'pm' && hour < 12) hour += 12;
    if (ampm === 'am' && hour === 12) hour = 0;
    
    // Check if baje implies AM/PM based on context
    if (ampm === 'baje') {
      if (t.includes('raat') && hour < 12) {
        if (hour >= 8) hour += 12; // 8 baje raat = 20:00
        else hour += 0; // 2 baje raat = 02:00
      } else if (t.includes('shaam') && hour < 12) hour += 12;
      else if (t.includes('dopehar') && hour < 12) hour += 12;
    }

    if (hour < 8 || hour >= 22) isAfterHours = true;

    // Build ISO string for today or tomorrow at that hour
    const now = new Date();
    if (dateLabel === 'tomorrow' || (dateLabel === 'unknown' && hour < now.getHours())) {
      now.setDate(now.getDate() + 1);
      dateLabel = 'tomorrow';
    } else {
      dateLabel = 'today';
    }
    now.setHours(hour, 0, 0, 0);
    requestedDateTime = now.toISOString();
  }

  // After hours heuristic
  if (timeWindow === 'night' || timeWindow === 'now') {
    const currentHour = new Date().getHours();
    if (timeWindow === 'now' && (currentHour < 8 || currentHour >= 22)) isAfterHours = true;
    if (timeWindow === 'night') isAfterHours = true;
  }

  let urgency: ParsedIntent['urgency'] = 'low';
  if (['emergency', 'fire', 'flood', 'burst'].some(w => t.includes(w))) urgency = 'emergency';
  else if (['urgent', 'abhi', 'now', 'asap', 'jaldi', 'foran'].some(w => t.includes(w))) urgency = 'high';
  else if (dateLabel === 'today') urgency = 'medium';

  if (isAfterHours && urgency === 'high') urgency = 'emergency';

  let timePreference = 'flexible';
  if (requestedDateTime) timePreference = `exact ${new Date(requestedDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  else if (timeWindow !== 'unknown') timePreference = timeWindow;
  else if (dateLabel !== 'unknown') timePreference = dateLabel;

  return { urgency, timePreference, dateLabel, timeWindow, requestedDateTime, isAfterHours };
}

function detectLocation(text: string): string | null {
  const lower = text.toLowerCase();
  for (const loc of LOCATION_TOKENS) {
    if (lower.includes(loc)) {
      const idx = lower.indexOf(loc);
      const snippet = text.slice(idx, idx + 20).split(/[\s,;.]/)[0];
      return snippet.trim() || loc.toUpperCase();
    }
  }
  return null;
}

function detectBudget(text: string): { sensitivity: ParsedIntent['budgetSensitivity']; max: number | undefined } {
  const t = text.toLowerCase();
  let max: number | undefined;

  // Exact matching for common patterns
  const p1 = text.match(/(\d{3,5})\s*(rs\.?|rupay|rupees|pkr|₨)/i);
  const p2 = text.match(/(?:under|below|se\s*kam|kam\s*se|budget|within)\s*(\d{3,5})/i);
  const p3 = text.match(/(\d{3,5})\s*(?:se\s*kam|mein|mai|me\b|tak|budget\s*hai)/i);
  
  if (p1) max = parseInt(p1[1], 10);
  else if (p2) max = parseInt(p2[1], 10);
  else if (p3) max = parseInt(p3[1], 10);
  else {
    const p4 = text.match(/\b([3-9]\d{2}|[1-4]\d{3}|5000)\b/);
    if (p4 && (t.includes('budget') || t.includes('rupay') || t.includes('rs') || t.includes('mein') || t.includes('tak'))) {
      max = parseInt(p4[1], 10);
    }
  }

  const budgetWords = ['zyada nahi', 'sasta', 'kam budget', 'affordable', 'cheap', 'mehnga nahi', 'budget', 'se kam', 'under', 'within'];
  if (budgetWords.some(w => t.includes(w))) return { sensitivity: 'high', max };
  if (max) return { sensitivity: 'medium', max };
  return { sensitivity: 'low', max };
}

function detectComplexity(text: string, serviceType?: string): ParsedIntent['jobComplexity'] {
  const t = text.toLowerCase();
  if (['grocery', 'fruits_vegetables', 'meat'].includes(serviceType ?? '')) return 'basic';
  if (['bilkul nahi', 'totally', 'installation', 'replace', 'new', 'badlo'].some(w => t.includes(w))) return 'complex';
  if (['check', 'dekho', 'small', 'chota', 'thora', 'minor'].some(w => t.includes(w))) return 'basic';
  return 'intermediate';
}

import { ITEM_CATALOG, CatalogItem } from '../data/itemCatalog';
import { ParsedItem } from '../types/agent';

function extractItems(text: string, serviceType: string): ParsedItem[] {
  if (!['grocery', 'fruits_vegetables', 'meat'].includes(serviceType)) return [];
  
  const items: ParsedItem[] = [];
  const t = text.toLowerCase();
  
  // Find matches in catalog
  for (const catalogItem of ITEM_CATALOG) {
    if (catalogItem.category !== serviceType) continue;
    
    // Check if item is mentioned
    let mentioned = false;
    for (const alias of catalogItem.aliases) {
      if (t.includes(alias.toLowerCase())) {
        mentioned = true;
        break;
      }
    }
    
    if (mentioned) {
      // Look for quantity nearby. e.g., "2kg", "2 kg", "half kg", "aadha kg", "1 dozen", "2 litre"
      const regex = new RegExp(`(?:(\\d+(?:\\.\\d+)?)\\s*(?:kg|kilo|dozen|litre|l|pack|unit)s?|aadha\\s*(?:kg|kilo)|half\\s*(?:kg|kilo))\\s*(?:${catalogItem.aliases.join('|')})`, 'i');
      const match1 = text.match(regex);
      
      const regex2 = new RegExp(`(?:${catalogItem.aliases.join('|')})\\s*(?:(\\d+(?:\\.\\d+)?)\\s*(?:kg|kilo|dozen|litre|l|pack|unit)s?|aadha\\s*(?:kg|kilo)|half\\s*(?:kg|kilo))`, 'i');
      const match2 = text.match(regex2);

      let quantity = 1; // default
      let matchStr = match1 ? match1[0] : (match2 ? match2[0] : '');
      
      if (matchStr.toLowerCase().includes('aadha') || matchStr.toLowerCase().includes('half')) {
        quantity = 0.5;
      } else if (match1 && match1[1]) {
        quantity = parseFloat(match1[1]);
      } else if (match2 && match2[1]) {
        quantity = parseFloat(match2[1]);
      }

      items.push({
        name: catalogItem.name,
        quantity,
        unit: catalogItem.unit,
        unitPrice: catalogItem.unitPrice,
        subtotal: quantity * catalogItem.unitPrice
      });
    }
  }
  
  return items;
}

// ─── Main export ─────────────────────────────────────────────────────────
export interface IntentAgentOutput {
  intent: ParsedIntent;
  trace: AgentTrace;
}

export function runIntentAgent(text: string, userLocation?: string): IntentAgentOutput {
  const t0 = Date.now();
  
  // Track typos
  const fixedText = fixTypos(text);
  const words = text.split(/\s+/);
  let typoCount = 0;
  for (const w of words) {
    const lower = w.toLowerCase().replace(/[^a-z]/g, '');
    if (MISSPELL_MAP[lower] && MISSPELL_MAP[lower] !== lower) typoCount++;
  }

  const { service, baseConfidence, skills } = detectService(text);
  const language = detectLanguage(text);
  const { urgency, timePreference, dateLabel, timeWindow, requestedDateTime, isAfterHours } = detectTimeIntelligence(text);
  const location = detectLocation(text) ?? userLocation ?? null;
  const { sensitivity: budgetSensitivity, max: maxBudget } = detectBudget(text);
  const complexity = detectComplexity(text, service);
  const parsedItems = extractItems(text, service);

  // Calculate dynamic confidence
  let confidence = baseConfidence;
  let explanations: string[] = [];

  if (typoCount > 0) {
    confidence -= (typoCount * 0.03); // penalty for typos (mild)
    explanations.push(`Recovered ${typoCount} typo(s)`);
  }
  
  const isGeneric = ['banda bhejo', 'help', 'masla', 'problem'].some(w => text.toLowerCase().includes(w));
  if (isGeneric && service === 'general') {
    confidence -= 0.15;
    explanations.push('Generic request detected');
  }

  if (language === 'mixed') {
    confidence -= 0.02; // slight penalty for mixed syntax
  }

  const missing: string[] = [];
  if (!location) {
    missing.push('location');
    confidence -= 0.10;
    explanations.push('Missing location context');
  }
  if (service === 'general') {
    missing.push('service type');
  }
  
  if (missing.length === 0 && !isGeneric) {
    explanations.push('High detail certainty');
  }

  // Bound confidence between 0.1 and 0.99
  confidence = Math.max(0.1, Math.min(confidence, 0.99));
  const explanationStr = explanations.join(' · ');

  const clarificationQuestion =
    confidence < 0.7 ? 'Could you specify what service you need and your area?'
    : !location      ? 'Which area or neighbourhood are you in?'
    : null;

  const intent: ParsedIntent = {
    originalText: text,
    detectedLanguage: language,
    confidence: Math.round(confidence * 100) / 100,
    confidenceExplanation: explanationStr,
    serviceType: service,
    issueSummary: `${service.replace('_', ' ')} needed — ${urgency} urgency`,
    location,
    timePreference,
    urgency,
    budgetSensitivity,
    maxBudget,
    jobComplexity: complexity,
    missingFields: missing,
    clarificationQuestion,
    parsedItems,
    dateLabel,
    timeWindow,
    requestedDateTime,
    isAfterHours,
  };

  const trace: AgentTrace = {
    id: `trace-intent-${Date.now()}`,
    timestamp: isoNow(),
    agentName: 'IntentAgent',
    action: 'Parse and classify user request',
    inputSummary: `"${text.slice(0, 90)}"`,
    decision: `${service} | ${language} | urgency: ${urgency} | time: ${timePreference}`,
    rationale: `Language: ${language} (confidence ${Math.round(confidence * 100)}%). ${explanationStr}. Service matched via keyword analysis. Location: ${location ?? 'not found'}.`,
    confidence,
    dataUsed: ['user_text', 'keyword_dictionary', 'typo_normalizer', 'language_detector'],
    nextAction: confidence >= 0.7 ? 'DiscoveryAgent' : 'Clarification required',
    status: confidence >= 0.7 ? 'success' : 'warning',
    durationMs: Date.now() - t0,
  };

  return { intent, trace };
}
