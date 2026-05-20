# Runtime Trace Schema
Every step outputted by our AI agents conforms to this typescript structure:

```typescript
export interface AgentTrace {
  id: string;
  timestamp: string;      // ISO datetime
  agentName: string;      // IntentAgent, PricingAgent, etc.
  action: string;         // Short action description
  inputSummary: string;   // Summarized inputs
  decision: string;       // Primary output
  rationale: string;      // Detailed description of the logic
  confidence: number;     // 0.0 - 1.0 confidence score
  dataUsed: string[];     // Array of databases or vectors utilized
  nextAction: string;     // Next agent or block in queue
  status: 'success' | 'warning' | 'failed' | 'recovered';
  durationMs?: number;    // Latency
}
```
