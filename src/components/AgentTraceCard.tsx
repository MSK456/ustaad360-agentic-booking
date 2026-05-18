import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { AgentTraceEntry } from '../types';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface AgentTraceCardProps {
  entry: AgentTraceEntry;
}

const agentIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  NLUAgent: 'chatbubble-ellipses-outline',
  DiscoveryAgent: 'search-outline',
  RankingAgent: 'podium-outline',
  PricingAgent: 'pricetag-outline',
  BookingAgent: 'calendar-outline',
  ReminderAgent: 'notifications-outline',
  ReputationAgent: 'star-outline',
  DisputeAgent: 'shield-outline',
};

const statusConfig = {
  success: { color: Colors.success, icon: 'checkmark-circle' as const, bg: 'rgba(34,197,94,0.1)' },
  failure: { color: Colors.danger, icon: 'close-circle' as const, bg: 'rgba(239,68,68,0.1)' },
  skipped: { color: Colors.textMuted, icon: 'remove-circle-outline' as const, bg: 'rgba(148,163,184,0.1)' },
};

export const AgentTraceCard: React.FC<AgentTraceCardProps> = ({ entry }) => {
  const [expanded, setExpanded] = useState(false);
  const { color, icon, bg } = statusConfig[entry.status];
  const agentIcon = agentIcons[entry.agentName] || 'hardware-chip-outline';

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      {/* Header Row */}
      <View style={styles.header}>
        <View style={[styles.iconBg, { backgroundColor: bg }]}>
          <Ionicons name={agentIcon} size={18} color={color} />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.agentName}>{entry.agentName}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.duration}>{entry.durationMs}ms</Text>
              <Ionicons name={icon} size={16} color={color} />
            </View>
          </View>
          <Text style={styles.step}>Step {entry.stepNumber}</Text>
        </View>
      </View>

      {/* I/O Summary */}
      <View style={styles.ioBlock}>
        <View style={styles.ioRow}>
          <Text style={styles.ioLabel}>IN</Text>
          <Text style={styles.ioText}>{entry.inputSummary}</Text>
        </View>
        <View style={[styles.ioRow, { marginTop: 4 }]}>
          <Text style={[styles.ioLabel, { color: color }]}>OUT</Text>
          <Text style={[styles.ioText, { color: Colors.textPrimary }]}>{entry.outputSummary}</Text>
        </View>
      </View>

      {/* Expand reasoning */}
      <TouchableOpacity style={styles.expandBtn} onPress={() => setExpanded(!expanded)}>
        <Text style={styles.expandLabel}>{expanded ? 'Hide' : 'Show'} Reasoning</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={Colors.primary} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.reasoning}>
          <Text style={styles.reasoningText}>{entry.reasoning}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    borderLeftWidth: 3,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm, marginBottom: Spacing.sm },
  iconBg: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  agentName: { ...Typography.label, color: Colors.textPrimary, fontSize: 14 },
  step: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  duration: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  ioBlock: { backgroundColor: Colors.inputBg, borderRadius: Radius.sm, padding: Spacing.sm, marginBottom: Spacing.sm },
  ioRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  ioLabel: { fontSize: 10, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5, width: 24, paddingTop: 1 },
  ioText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1 },
  expandBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  expandLabel: { ...Typography.caption, color: Colors.primary, fontWeight: '600' },
  reasoning: {
    backgroundColor: Colors.inputBg,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  reasoningText: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 18 },
});
