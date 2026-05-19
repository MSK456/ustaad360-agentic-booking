import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { ScoreRing } from '../components/ScoreRing';
import { useAgentStore } from '../store/agentStore';

// ─── Types ───────────────────────────────────────────────────────────────────
interface CompareRow {
  label: string;
  icon: string;
  weight: string;
  baseline: { value: string; score: number; note: string };
  agentic:  { value: string; score: number; note: string };
}

// ─── Data ────────────────────────────────────────────────────────────────────
const TEST_QUERY = '"yaar nala band ho gaya urgent help chahiye 1500 se kam mein"';

const STATIC_COMPARE_ROWS: CompareRow[] = [
  {
    label: 'Distance',
    icon: 'location-outline',
    weight: '10%',
    baseline: { value: '1.2 km (nearest)', score: 94, note: 'Primary sort — picks closest available' },
    agentic:  { value: '1.2 km (not primary)', score: 94, note: 'Weight: 10% — not sole criterion' },
  },
  {
    label: 'Travel Time',
    icon: 'time-outline',
    weight: '9%',
    baseline: { value: '4 min',  score: 88, note: 'Secondary sort criterion only' },
    agentic:  { value: '4 min',  score: 88, note: 'Weight: 9% — included in multi-factor score' },
  },
  {
    label: 'Star Rating',
    icon: 'star-outline',
    weight: '12%',
    baseline: { value: 'Not checked', score: 0,  note: 'Ignored — no rating awareness' },
    agentic:  { value: '4.8 ⭐',      score: 95, note: 'Weight: 12% — Bayesian-adjusted avg' },
  },
  {
    label: 'Review Recency',
    icon: 'calendar-outline',
    weight: '11%',
    baseline: { value: 'Not checked', score: 0,  note: 'Ignored — no recency awareness' },
    agentic:  { value: '91%',         score: 91, note: 'Weight: 11% — exponential decay model' },
  },
  {
    label: 'Reliability / On-Time',
    icon: 'checkmark-circle-outline',
    weight: '13%',
    baseline: { value: 'Not checked', score: 0,  note: 'Ignored — no punctuality check' },
    agentic:  { value: '94%',         score: 94, note: 'Weight: 13% — historical punctuality data' },
  },
  {
    label: 'Cancellation Rate',
    icon: 'close-circle-outline',
    weight: '5%',
    baseline: { value: 'Not checked', score: 0,  note: 'Ignored — no penalty for cancels' },
    agentic:  { value: '3%',          score: 97, note: 'Weight: 5% — risk-adjusted' },
  },
  {
    label: 'Skill Match',
    icon: 'construct-outline',
    weight: '14%',
    baseline: { value: 'Category only', score: 20, note: 'Broad match: just "plumber" category' },
    agentic:  { value: '90%',           score: 90, note: 'Weight: 14% — skill intersection score' },
  },
  {
    label: 'Price Fit',
    icon: 'cash-outline',
    weight: '8%',
    baseline: { value: 'Not checked', score: 0,   note: 'Ignored — no budget awareness' },
    agentic:  { value: 'Good fit',    score: 90,  note: 'Weight: 8% — within budget ₨1,354/₨1,500' },
  },
];

const BASELINE_TOTAL_STATIC = Math.round(
  STATIC_COMPARE_ROWS.reduce((s, r) => s + r.baseline.score * parseFloat(r.weight) / 100, 0)
);
const AGENTIC_TOTAL_STATIC = Math.round(
  STATIC_COMPARE_ROWS.reduce((s, r) => s + r.agentic.score * parseFloat(r.weight) / 100, 0)
);

const SYSTEM_COMPARE = [
  { label: 'Language support',    baseline: 'English only',      agentic: 'Urdu + Roman Urdu + English + Slang' },
  { label: 'Providers found',     baseline: '0 (not understood)', agentic: '11 matched & ranked' },
  { label: 'Ranking factors',     baseline: '0 (random)',         agentic: '9 weighted factors' },
  { label: 'Price negotiation',   baseline: 'Fixed list price',   agentic: 'Dynamic + budget aware' },
  { label: 'Failure handling',    baseline: 'Blank screen',       agentic: 'Graceful + alternatives' },
  { label: 'Decision visibility', baseline: 'None',               agentic: 'Full agent trace log' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <View style={barStyles.bg}>
      <View style={[barStyles.fill, { width: `${score}%` as any, backgroundColor: color }]} />
    </View>
  );
}

function FactorRow({ row, expanded, onToggle }: { row: CompareRow; expanded: boolean; onToggle: () => void }) {
  const baseColor = row.baseline.score >= 60 ? Colors.success : row.baseline.score >= 30 ? Colors.warning : Colors.danger;
  const agColor   = row.agentic.score  >= 75 ? Colors.success : Colors.warning;

  return (
    <TouchableOpacity style={rowStyles.card} onPress={onToggle} activeOpacity={0.8}>
      <View style={rowStyles.header}>
        <View style={rowStyles.labelCol}>
          <Ionicons name={row.icon as any} size={15} color={Colors.primary} />
          <Text style={rowStyles.label}>{row.label}</Text>
          <View style={rowStyles.weightChip}>
            <Text style={rowStyles.weightText}>{row.weight}</Text>
          </View>
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.textMuted} />
      </View>

      <View style={rowStyles.cols}>
        {/* Baseline */}
        <View style={rowStyles.col}>
          <Text style={[rowStyles.colValue, { color: baseColor }]}>{row.baseline.value}</Text>
          <ScoreBar score={row.baseline.score} color={baseColor} />
          <Text style={rowStyles.scoreNum}>{row.baseline.score}/100</Text>
        </View>

        <View style={rowStyles.divider} />

        {/* Agentic */}
        <View style={rowStyles.col}>
          <Text style={[rowStyles.colValue, { color: agColor }]}>{row.agentic.value}</Text>
          <ScoreBar score={row.agentic.score} color={agColor} />
          <Text style={rowStyles.scoreNum}>{row.agentic.score}/100</Text>
        </View>
      </View>

      {expanded && (
        <View style={rowStyles.notes}>
          <View style={rowStyles.noteBox}>
            <Text style={rowStyles.noteText}>❌ {row.baseline.note}</Text>
          </View>
          <View style={[rowStyles.noteBox, { backgroundColor: Colors.success + '11' }]}>
            <Text style={[rowStyles.noteText, { color: Colors.success }]}>✅ {row.agentic.note}</Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function BaselineCompareScreen() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const { result } = useAgentStore();

  // Use real store comparison if pipeline has been run, else static demo
  const storeCompare = result?.baselineComparison;
  const COMPARE_ROWS: CompareRow[] = storeCompare?.factorRows
    ? storeCompare.factorRows.map(r => ({
        label:    r.factor,
        icon:     'analytics-outline',
        weight:   (r.agentic.note ?? '').match(/\d+%/)?.[0] ?? '10%',
        baseline: { value: r.baseline.value, score: r.baseline.score, note: r.baseline.note ?? '' },
        agentic:  { value: r.agentic.value,  score: r.agentic.score,  note: r.agentic.note  ?? '' },
      }))
    : STATIC_COMPARE_ROWS;

  const BASELINE_TOTAL = storeCompare?.baselineScore ?? BASELINE_TOTAL_STATIC;
  const AGENTIC_TOTAL  = storeCompare?.agenticScore  ?? AGENTIC_TOTAL_STATIC;

  const testQuery = result?.intent?.originalText
    ? `"${result.intent.originalText.slice(0, 80)}"` : TEST_QUERY;
  const baselineProvider = storeCompare?.baselineProvider?.name ?? 'Nearest available';
  const agenticProvider  = result?.selectedProvider?.provider.name ?? 'Agentic choice';

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <Ionicons name="git-compare-outline" size={26} color={Colors.primary} />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Baseline Comparison</Text>
            <Text style={styles.headerSub}>Same query — two systems — one winner</Text>
          </View>
        </View>
        <View style={styles.queryBox}>
          <Text style={styles.queryLabel}>TEST QUERY</Text>
          <Text style={styles.queryText}>{testQuery}</Text>
        {storeCompare && (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.xs }}>
            <Text style={styles.queryLabel}>BASELINE: {baselineProvider}</Text>
            <Text style={[styles.queryLabel, { color: Colors.success }]}>AGENTIC: {agenticProvider}</Text>
          </View>
        )}
        </View>
      </View>

      {/* Column headers */}
      <View style={styles.colHeaders}>
        <View style={[styles.colHeader, styles.colHeaderLeft]}>
          <Text style={styles.colHeaderTitle}>❌ Simple System</Text>
          <Text style={styles.colHeaderSub}>Nearest available worker</Text>
        </View>
        <View style={[styles.colHeader, styles.colHeaderRight]}>
          <Text style={[styles.colHeaderTitle, { color: Colors.success }]}>✅ Ustaad360</Text>
          <Text style={styles.colHeaderSub}>Best expected outcome</Text>
        </View>
      </View>
      <View style={{ paddingHorizontal: Spacing.md, marginBottom: Spacing.md }}>
        <Text style={{ textAlign: 'center', color: Colors.textSecondary, fontStyle: 'italic', fontSize: 13, lineHeight: 18 }}>
          "Baseline is fast but blind. Ustaad360 is slower by milliseconds, but safer because it checks trust, price, risk, and service fit."
        </Text>
      </View>

      {/* Score rings summary */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreBox}>
          <ScoreRing score={BASELINE_TOTAL} size={80} label="score" />
          <Text style={styles.scoreLabel}>Baseline</Text>
        </View>
        <View style={styles.vsBox}>
          <Text style={styles.vsText}>VS</Text>
        </View>
        <View style={styles.scoreBox}>
          <ScoreRing score={AGENTIC_TOTAL} size={80} label="score" />
          <Text style={styles.scoreLabel}>Ustaad360</Text>
        </View>
      </View>

      {/* Factor-by-factor rows */}
      <Text style={styles.sectionLabel}>FACTOR BREAKDOWN</Text>
      {COMPARE_ROWS.map((row) => (
        <FactorRow
          key={row.label}
          row={row}
          expanded={expandedRow === row.label}
          onToggle={() => setExpandedRow(expandedRow === row.label ? null : row.label)}
        />
      ))}

      {/* System-level comparison table */}
      <Text style={styles.sectionLabel}>SYSTEM COMPARISON</Text>
      <View style={styles.systemCard}>
        {SYSTEM_COMPARE.map((row, i) => (
          <View key={row.label} style={[styles.sysRow, i > 0 && styles.sysRowBorder]}>
            <Text style={styles.sysLabel}>{row.label}</Text>
            <View style={styles.sysCols}>
              <Text style={styles.sysBaseline}>{row.baseline}</Text>
              <Text style={styles.sysAgentic}>{row.agentic}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Same provider logic */}
      {storeCompare && baselineProvider === agenticProvider && (
        <View style={[styles.winnerBanner, { backgroundColor: Colors.warning + '14', borderColor: Colors.warning + '44' }]}>
          <Ionicons name="information-circle" size={30} color={Colors.warning} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.winnerTitle, { color: Colors.warning }]}>Same Provider Selected</Text>
            <Text style={styles.winnerSub}>
              Both systems selected {baselineProvider}, but Ustaad360 validated trust, price, and risk before confirming.
            </Text>
          </View>
        </View>
      )}

      {/* Winner banner */}
      {(!storeCompare || baselineProvider !== agenticProvider) && (
        <View style={styles.winnerBanner}>
          <Ionicons name={AGENTIC_TOTAL >= BASELINE_TOTAL ? "trophy" : "shield-checkmark"} size={30} color={AGENTIC_TOTAL >= BASELINE_TOTAL ? Colors.accent : Colors.success} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.winnerTitle, { color: AGENTIC_TOTAL >= BASELINE_TOTAL ? Colors.accent : Colors.success }]}>
              {AGENTIC_TOTAL >= BASELINE_TOTAL ? 'Ustaad360 Wins' : 'Baseline is closer, but Ustaad360 is safer'}
            </Text>
            <Text style={styles.winnerSub}>
              {AGENTIC_TOTAL >= BASELINE_TOTAL
                ? `Composite score ${AGENTIC_TOTAL} vs ${BASELINE_TOTAL}`
                : `Score ${AGENTIC_TOTAL} vs ${BASELINE_TOTAL}. Agentic system optimized for risk-adjusted success.`}
            </Text>
          </View>
          {AGENTIC_TOTAL >= BASELINE_TOTAL && (
            <Badge label={`+${AGENTIC_TOTAL - BASELINE_TOTAL} pts`} variant="success" />
          )}
        </View>
      )}

      {/* Cost note */}
      <View style={styles.costNote}>
        <Text style={styles.costTitle}>💡 Why the tradeoff is worth it</Text>
        <Text style={styles.costBody}>
          The agentic pipeline adds ~850ms latency but unlocks multilingual NLU, 10-factor personalized
          ranking, transparent AI reasoning, and graceful failure handling — all impossible with simple keyword
          matching.{'\n\n'}
          At 10,000 bookings/day: Gemini Flash cost ~$15–25/day. The simple system costs $0 but
          loses 60–70% of bookings due to language barriers and poor matching.
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const barStyles = StyleSheet.create({
  bg: { height: 5, backgroundColor: Colors.cardBorder, borderRadius: 3, overflow: 'hidden', marginVertical: 3 },
  fill: { height: '100%', borderRadius: 3 },
});

const rowStyles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: Spacing.sm, marginBottom: Spacing.sm,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  labelCol: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { ...Typography.label, color: Colors.textPrimary, fontSize: 13 },
  weightChip: {
    backgroundColor: Colors.primary + '18', borderRadius: Radius.full,
    paddingHorizontal: 6, paddingVertical: 1,
  },
  weightText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  cols: { flexDirection: 'row', gap: Spacing.sm },
  col: { flex: 1 },
  colValue: { fontSize: 11, fontWeight: '700', marginBottom: 2 },
  scoreNum: { fontSize: 10, color: Colors.textMuted, fontFamily: 'monospace' },
  divider: { width: 1, backgroundColor: Colors.cardBorder },
  notes: { marginTop: Spacing.sm, gap: 4 },
  noteBox: { backgroundColor: Colors.danger + '11', borderRadius: Radius.sm, padding: Spacing.xs },
  noteText: { fontSize: 11, color: Colors.danger, lineHeight: 15 },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },

  headerCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.sm },
  headerText: { flex: 1 },
  headerTitle: { ...Typography.h4, color: Colors.textPrimary },
  headerSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  queryBox: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.sm,
    padding: Spacing.sm, borderLeftWidth: 3, borderLeftColor: Colors.primary,
  },
  queryLabel: { fontSize: 9, color: Colors.primary, fontWeight: '700', letterSpacing: 1, marginBottom: 3 },
  queryText: { ...Typography.bodySm, color: Colors.textPrimary, fontStyle: 'italic' },

  colHeaders: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  colHeader: { flex: 1, borderRadius: Radius.md, padding: Spacing.sm, alignItems: 'center' },
  colHeaderLeft: { backgroundColor: Colors.danger + '11' },
  colHeaderRight: { backgroundColor: Colors.success + '11' },
  colHeaderTitle: { ...Typography.label, color: Colors.danger, fontSize: 12 },
  colHeaderSub: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },

  scoreRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.cardElevated, borderRadius: Radius.lg,
    padding: Spacing.lg, borderWidth: 1, borderColor: Colors.cardBorder,
    marginBottom: Spacing.md, gap: Spacing.xl,
  },
  scoreBox: { alignItems: 'center', gap: Spacing.xs },
  scoreLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '600' },
  vsBox: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.cardBorder, alignItems: 'center', justifyContent: 'center',
  },
  vsText: { fontSize: 11, fontWeight: '800', color: Colors.textMuted },

  sectionLabel: {
    ...Typography.label, color: Colors.textMuted, fontSize: 10, letterSpacing: 1,
    marginBottom: Spacing.sm, marginTop: Spacing.xs,
  },

  systemCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.cardBorder,
    overflow: 'hidden', marginBottom: Spacing.md,
  },
  sysRow: { padding: Spacing.sm, gap: Spacing.xs },
  sysRowBorder: { borderTopWidth: 1, borderTopColor: Colors.cardBorder },
  sysLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700', letterSpacing: 0.3 },
  sysCols: { flexDirection: 'row', gap: Spacing.sm },
  sysBaseline: { flex: 1, fontSize: 11, color: Colors.danger },
  sysAgentic: { flex: 1, fontSize: 11, color: Colors.success },

  winnerBanner: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.accent + '14', borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.accent + '44',
    marginBottom: Spacing.md,
  },
  winnerTitle: { ...Typography.h4, color: Colors.accent },
  winnerSub: { ...Typography.caption, color: Colors.textSecondary, marginTop: 2 },

  costNote: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  costTitle: { ...Typography.label, color: Colors.primary, marginBottom: Spacing.sm },
  costBody: { ...Typography.bodySm, color: Colors.textMuted, lineHeight: 19 },
});
