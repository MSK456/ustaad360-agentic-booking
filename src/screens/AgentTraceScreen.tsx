import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { AgentTraceCard } from '../components/AgentTraceCard';
import { Badge } from '../components/Badge';
import { MOCK_AGENT_TRACE, FAILURE_SCENARIO_TRACE } from '../data/mockData';

const SCENARIOS = [
  { id: 'success', label: 'Successful Booking', trace: MOCK_AGENT_TRACE, variant: 'success' as const },
  { id: 'failure', label: 'Budget Mismatch', trace: FAILURE_SCENARIO_TRACE, variant: 'danger' as const },
];

export const AgentTraceScreen: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState('success');
  const scenario = SCENARIOS.find((s) => s.id === activeScenario)!;
  const totalMs = scenario.trace.reduce((sum, e) => sum + e.durationMs, 0);
  const failCount = scenario.trace.filter((e) => e.status === 'failure').length;

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
            <Text style={styles.metaText}>Total: {totalMs}ms</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="git-branch-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.metaText}>{scenario.trace.length} agents</Text>
          </View>
          {failCount > 0 && (
            <Badge label={`${failCount} failure`} variant="danger" />
          )}
        </View>
      </View>

      {/* Scenario selector */}
      <View style={styles.scenarioRow}>
        {SCENARIOS.map((s) => (
          <View
            key={s.id}
            style={[styles.scenarioBtn, activeScenario === s.id && styles.scenarioBtnActive]}
          >
            <Text
              style={[styles.scenarioLabel, activeScenario === s.id && { color: Colors.primary }]}
              onPress={() => setActiveScenario(s.id)}
            >
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      {/* Trace entries */}
      {scenario.trace.map((entry) => (
        <AgentTraceCard key={entry.id} entry={entry} />
      ))}

      {/* Pipeline summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Pipeline Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total Latency</Text>
          <Text style={styles.summaryValue}>{totalMs}ms</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Agents Run</Text>
          <Text style={styles.summaryValue}>{scenario.trace.length}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Outcome</Text>
          <Badge
            label={failCount > 0 ? 'Pipeline Failed' : 'Booking Confirmed'}
            variant={failCount > 0 ? 'danger' : 'success'}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  headerCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  headerTitle: { ...Typography.h4, color: Colors.textPrimary },
  headerSub: { ...Typography.bodySm, color: Colors.textMuted, marginBottom: Spacing.sm },
  metaRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.inputBg, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  metaText: { ...Typography.caption, color: Colors.textMuted },
  scenarioRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  scenarioBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.card, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  scenarioBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  scenarioLabel: { ...Typography.bodySm, color: Colors.textMuted, fontWeight: '600' },
  summaryCard: {
    backgroundColor: Colors.cardElevated, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm,
  },
  summaryTitle: { ...Typography.label, color: Colors.textMuted, marginBottom: 4 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { ...Typography.bodySm, color: Colors.textSecondary },
  summaryValue: { ...Typography.bodyMd, color: Colors.primary, fontWeight: '700', fontFamily: 'monospace' },
});
