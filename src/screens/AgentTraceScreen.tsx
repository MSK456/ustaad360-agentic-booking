import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { useAgentStore } from '../store/agentStore';
import { AgentTrace } from '../types/agent';

const FALLBACK_TRACES: AgentTrace[] = [
  { id: 'demo-1', timestamp: new Date().toISOString(), agentName: 'IntentAgent', action: 'Parse user request', inputSummary: '"nala band ho gaya urgent DHA"', decision: 'plumber | roman_urdu | urgency: high | time: today', rationale: 'Roman Urdu detected. Service matched via keyword "nala". Location DHA found. Budget sensitivity: low.', confidence: 0.92, dataUsed: ['user_text', 'keyword_dictionary'], nextAction: 'DiscoveryAgent', status: 'success', durationMs: 12 },
  { id: 'demo-2', timestamp: new Date().toISOString(), agentName: 'DiscoveryAgent', action: 'Query provider pool', inputSummary: 'service: plumber | location: DHA | urgency: high', decision: '4 providers found', rationale: 'Filtered 12 providers by category "plumber". Area match on "DHA". Available: 4/4.', confidence: 0.92, dataUsed: ['provider_pool', 'location_filter'], nextAction: 'RankingAgent', status: 'success', durationMs: 8 },
  { id: 'demo-3', timestamp: new Date().toISOString(), agentName: 'RankingAgent', action: 'Score and rank providers', inputSummary: '4 providers | service: plumber | budget: ₨1500', decision: '#1: Ahmed Khan (score: 87/100)', rationale: 'Applied 10-factor weighted formula. Ahmed leads on reliability (94% on-time) and skill match.', confidence: 0.91, dataUsed: ['provider_history', 'review_data', 'distance_matrix'], nextAction: 'PricingAgent', status: 'success', durationMs: 23 },
  { id: 'demo-4', timestamp: new Date().toISOString(), agentName: 'PricingAgent', action: 'Calculate dynamic price', inputSummary: 'provider: Ahmed Khan | base: ₨800 | dist: 1.2km | urgency: high', decision: '₨1,354 — budget fit: good', rationale: 'Base ₨800 + travel ₨0 + complexity ₨600 + premium ₨0 × urgency 1.3 × demand 1.0 − loyalty ₨100 = ₨1,354.', confidence: 0.93, dataUsed: ['provider_base_rate', 'urgency_factor', 'user_loyalty'], nextAction: 'SchedulingAgent', status: 'success', durationMs: 15 },
  { id: 'demo-5', timestamp: new Date().toISOString(), agentName: 'SchedulingAgent', action: 'Reserve provider slot', inputSummary: 'provider: Ahmed Khan | preference: tomorrow morning | travel: 4min', decision: 'Slot confirmed: Tomorrow at 09:00 AM', rationale: 'First available slot matching "tomorrow morning". Added 20-min travel buffer. No conflicts.', confidence: 0.94, dataUsed: ['provider_availability', 'travel_time'], nextAction: 'BookingAgent', status: 'success', durationMs: 9 },
  { id: 'demo-6', timestamp: new Date().toISOString(), agentName: 'BookingAgent', action: 'Create booking record', inputSummary: 'provider: Ahmed Khan | price: ₨1,354 | time: Tomorrow at 09:00 AM', decision: 'Booking B-U360-DEMO confirmed', rationale: 'Booking record created. Provider slot reserved. Receipt generated. Confirmation code sent.', confidence: 0.98, dataUsed: ['provider_slot', 'pricing_result', 'user_address'], nextAction: 'NotificationAgent', status: 'success', durationMs: 6 },
  { id: 'demo-7', timestamp: new Date().toISOString(), agentName: 'NotificationAgent', action: 'Send confirmation', inputSummary: 'bookingId: B-U360-DEMO | scheduled: Tomorrow at 09:00 AM', decision: 'WhatsApp/SMS queued. 2 reminders scheduled.', rationale: 'Confirmation dispatched. Reminder 1: 24h before. Reminder 2: 1h before.', confidence: 0.97, dataUsed: ['booking_record', 'user_contact'], nextAction: 'FollowUpAgent', status: 'success', durationMs: 4 },
  { id: 'demo-8', timestamp: new Date().toISOString(), agentName: 'FollowUpAgent', action: 'Build lifecycle timeline', inputSummary: 'bookingId: B-U360-DEMO', decision: '8-step follow-up timeline generated', rationale: 'Timeline covers full lifecycle: confirmation → reminder → assignment → service → completion → checklist → feedback → reputation.', confidence: 0.95, dataUsed: ['booking_record', 'provider_schedule'], nextAction: 'Await completion', status: 'success', durationMs: 5 },
];

type FilterType = 'all' | 'success' | 'warning' | 'failed' | 'recovered';

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'success',   label: '✅ Success' },
  { id: 'warning',   label: '⚠️ Warning' },
  { id: 'failed',    label: '❌ Failed' },
  { id: 'recovered', label: '🔄 Recovered' },
];

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: string }> = {
  success:   { color: Colors.success, bg: Colors.success  + '18', icon: 'checkmark-circle'  },
  warning:   { color: Colors.warning, bg: Colors.warning  + '18', icon: 'warning'            },
  failed:    { color: Colors.danger,  bg: Colors.danger   + '18', icon: 'close-circle'       },
  recovered: { color: Colors.primary, bg: Colors.primary  + '18', icon: 'refresh-circle'     },
};

const AGENT_ICONS: Record<string, string> = {
  IntentAgent:           'chatbubble-ellipses-outline',
  DiscoveryAgent:        'search-outline',
  RankingAgent:          'podium-outline',
  PricingAgent:          'pricetag-outline',
  SchedulingAgent:       'calendar-outline',
  BookingAgent:          'checkmark-done-outline',
  NotificationAgent:     'notifications-outline',
  FollowUpAgent:         'time-outline',
  DisputeAgent:          'shield-outline',
  ReputationUpdateAgent: 'trending-up-outline',
};

function TraceCard({ entry }: { entry: AgentTrace }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[entry.status] ?? STATUS_CONFIG.success;
  const agentIcon = AGENT_ICONS[entry.agentName] ?? 'hardware-chip-outline';

  return (
    <View style={[cardStyles.card, { borderLeftColor: cfg.color }]}>
      <View style={cardStyles.header}>
        <View style={[cardStyles.iconBg, { backgroundColor: cfg.bg }]}>
          <Ionicons name={agentIcon as any} size={17} color={cfg.color} />
        </View>
        <View style={cardStyles.headerInfo}>
          <View style={cardStyles.titleRow}>
            <Text style={cardStyles.agentName}>{entry.agentName}</Text>
            <View style={cardStyles.metaRight}>
              <Text style={cardStyles.duration}>{entry.durationMs}ms</Text>
              <Ionicons name={cfg.icon as any} size={15} color={cfg.color} />
            </View>
          </View>
          <Text style={cardStyles.action}>{entry.action}</Text>
        </View>
      </View>

      <View style={cardStyles.ioBlock}>
        <View style={cardStyles.ioRow}>
          <Text style={cardStyles.ioLabel}>IN</Text>
          <Text style={cardStyles.ioText}>{entry.inputSummary}</Text>
        </View>
        <View style={[cardStyles.ioRow, { marginTop: 4 }]}>
          <Text style={[cardStyles.ioLabel, { color: cfg.color }]}>OUT</Text>
          <Text style={[cardStyles.ioText, { color: Colors.textPrimary }]}>{entry.decision}</Text>
        </View>
      </View>

      <View style={cardStyles.confRow}>
        <View style={cardStyles.confBar}>
          <View style={[cardStyles.confFill, { width: `${Math.round(entry.confidence * 100)}%` as any, backgroundColor: cfg.color }]} />
        </View>
        <Text style={[cardStyles.confVal, { color: cfg.color }]}>{Math.round(entry.confidence * 100)}%</Text>
        {entry.dataUsed.length > 0 && (
          <Text style={cardStyles.dataUsed}>{entry.dataUsed.slice(0, 2).join(' · ')}</Text>
        )}
      </View>

      <TouchableOpacity style={cardStyles.expandBtn} onPress={() => setExpanded(e => !e)}>
        <Text style={cardStyles.expandText}>{expanded ? 'Hide Decision Rationale' : 'Show Decision Rationale'}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={13} color={Colors.primary} />
      </TouchableOpacity>

      {expanded && (
        <View style={cardStyles.rationale}>
          <Text style={cardStyles.rationaleText}>{entry.rationale}</Text>
          <View style={cardStyles.nextRow}>
            <Text style={cardStyles.nextLabel}>Next:</Text>
            <Text style={cardStyles.nextVal}>{entry.nextAction}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export const AgentTraceScreen: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const { result } = useAgentStore();

  const rawTraces = (result?.traces?.length ?? 0) > 0
    ? result!.traces
    : FALLBACK_TRACES;

  const traces = filter === 'all' ? rawTraces : rawTraces.filter(t => t.status === filter);
  const totalMs = rawTraces.reduce((s, t) => s + (t.durationMs ?? 0), 0);
  const counts: Record<string, number> = rawTraces.reduce((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Ionicons name="hardware-chip-outline" size={22} color={Colors.primary} />
          <Text style={styles.headerTitle}>Agent Trace Log</Text>
        </View>
        <Text style={styles.headerSub}>Every AI decision, fully transparent</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="timer-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{totalMs}ms total</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="git-branch-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{rawTraces.length} agents</Text>
          </View>
          {(counts.failed ?? 0) > 0 && <Badge label={`${counts.failed} failed`} variant="danger" />}
          {(counts.recovered ?? 0) > 0 && <Badge label={`${counts.recovered} recovered`} variant="warning" />}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}
        contentContainerStyle={styles.filterRow}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterChip, filter === f.id && styles.filterChipActive]}
            onPress={() => setFilter(f.id)}
          >
            <Text style={[styles.filterText, filter === f.id && styles.filterTextActive]}>{f.label}</Text>
            {f.id !== 'all' && counts[f.id] > 0 && (
              <View style={styles.filterBadge}><Text style={styles.filterBadgeText}>{counts[f.id]}</Text></View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Trace cards */}
      {traces.length === 0
        ? <View style={styles.empty}><Text style={styles.emptyText}>No traces match this filter.</Text></View>
        : traces.map((t, i) => <TraceCard key={t.id ?? i} entry={t} />)
      }

      {/* Pipeline summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>PIPELINE SUMMARY</Text>
        {[
          { label: 'Total Latency', value: `${totalMs}ms` },
          { label: 'Agents Run',    value: `${rawTraces.length}` },
          { label: 'Successful',    value: `${counts.success ?? 0}` },
          { label: 'Warnings',      value: `${counts.warning ?? 0}` },
          { label: 'Recovered',     value: `${counts.recovered ?? 0}` },
        ].map(row => (
          <View key={row.label} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{row.label}</Text>
            <Text style={styles.summaryVal}>{row.value}</Text>
          </View>
        ))}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Outcome</Text>
          <Badge label={(counts.failed ?? 0) > 0 ? 'Pipeline Issue' : 'Booking Confirmed'} variant={(counts.failed ?? 0) > 0 ? 'danger' : 'success'} />
        </View>
      </View>
    </ScrollView>
  );
};

const cardStyles = StyleSheet.create({
  card: { backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.cardBorder, borderLeftWidth: 3, padding: Spacing.base, marginBottom: Spacing.md },
  header: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  iconBg: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  agentName: { ...Typography.label, color: Colors.textPrimary, fontSize: 14 },
  metaRight: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  duration: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  action: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  ioBlock: { backgroundColor: Colors.inputBg, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.sm },
  ioRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  ioLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5, width: 24, paddingTop: 1 },
  ioText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1 },
  confRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  confBar: { flex: 1, height: 4, backgroundColor: Colors.cardBorder, borderRadius: 2, overflow: 'hidden' },
  confFill: { height: '100%', borderRadius: 2 },
  confVal: { fontSize: 11, fontWeight: '700', fontFamily: 'monospace', width: 30 },
  dataUsed: { ...Typography.caption, color: Colors.textDisabled, fontSize: 10 },
  expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expandText: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  rationale: { marginTop: Spacing.sm, backgroundColor: Colors.inputBg, borderRadius: Radius.sm, padding: Spacing.sm, gap: Spacing.xs },
  rationaleText: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 18 },
  nextRow: { flexDirection: 'row', gap: 4, marginTop: 4 },
  nextLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700' },
  nextVal: { ...Typography.caption, color: Colors.primary },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  headerCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  headerTitle: { ...Typography.h4, color: Colors.textPrimary },
  headerSub: { ...Typography.bodySm, color: Colors.textMuted, marginBottom: Spacing.sm },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap', alignItems: 'center' },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.inputBg, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 3 },
  metaText: { ...Typography.caption, color: Colors.textMuted },
  filterScroll: { marginBottom: Spacing.md },
  filterRow: { flexDirection: 'row', gap: Spacing.sm, paddingBottom: 4 },
  filterChip: { paddingHorizontal: Spacing.md, paddingVertical: 6, borderRadius: Radius.full, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.cardBorder, flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '18' },
  filterText: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  filterTextActive: { color: Colors.primary },
  filterBadge: { backgroundColor: Colors.primary, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 1 },
  filterBadgeText: { fontSize: 9, color: '#08111F', fontWeight: '700' },
  empty: { alignItems: 'center', paddingVertical: Spacing.xl },
  emptyText: { ...Typography.body, color: Colors.textMuted },
  summaryCard: { backgroundColor: Colors.cardElevated, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  summaryTitle: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...Typography.bodySm, color: Colors.textSecondary },
  summaryVal: { ...Typography.bodyMd, color: Colors.primary, fontWeight: '700', fontFamily: 'monospace' },
});
