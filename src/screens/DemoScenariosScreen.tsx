import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { RootStackParamList } from '../navigation/types';
import { useAgentStore } from '../store/agentStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface Scenario {
  id: string;
  letter: string;
  title: string;
  description: string;
  query: string;
  budget?: number;
  expectedOutcome: string;
  icon: string;
  color: string;
  variant: 'success' | 'warning' | 'danger' | 'primary';
  navigateTo: keyof RootStackParamList;
  navigateParams?: any;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'A',
    letter: 'A',
    title: 'Successful Booking',
    description: 'Full end-to-end booking flow. Agent finds best provider, calculates price, and confirms booking.',
    query: 'nala band ho gaya urgent help chahiye 1500 se kam DHA',
    budget: 1500,
    expectedOutcome: 'Booking confirmed with receipt, follow-up timeline generated.',
    icon: 'checkmark-circle-outline',
    color: Colors.success,
    variant: 'success',
    navigateTo: 'IntentReview',
    navigateParams: { query: 'nala band ho gaya urgent help chahiye 1500 se kam DHA' },
  },
  {
    id: 'B',
    letter: 'B',
    title: 'Budget Mismatch Recovery',
    description: 'PricingAgent detects quote exceeds budget. Shows recovery suggestions.',
    query: '500 rupay mein AC gas bharwa do abhi G-13',
    budget: 500,
    expectedOutcome: 'Budget mismatch detected. 5 recovery options offered.',
    icon: 'cash-outline',
    color: Colors.warning,
    variant: 'warning',
    navigateTo: 'IntentReview',
    navigateParams: { query: '500 rupay mein AC gas bharwa do abhi G-13' },
  },
  {
    id: 'C',
    letter: 'C',
    title: 'Misspelled Mixed Language',
    description: 'IntentAgent handles typos and Roman Urdu. Typo correction shown in trace.',
    query: 'Mujhe plmbr chye kal subh DHA',
    expectedOutcome: 'Typos corrected, intent parsed, pipeline continues.',
    icon: 'language-outline',
    color: Colors.primary,
    variant: 'primary',
    navigateTo: 'IntentReview',
    navigateParams: { query: 'Mujhe plmbr chye kal subh DHA' },
  },
  {
    id: 'D',
    letter: 'D',
    title: 'No Available Provider',
    description: 'DiscoveryAgent finds providers but none match the emergency slot. Fallback triggered.',
    query: 'AC technician chahiye tonight G-13 emergency immediately',
    expectedOutcome: 'Warning trace. Alternate slots suggested.',
    icon: 'alert-circle-outline',
    color: Colors.warning,
    variant: 'warning',
    navigateTo: 'AgentTrace' as any,
    navigateParams: undefined,
  },
  {
    id: 'E',
    letter: 'E',
    title: 'Provider Cancels After Booking',
    description: 'Original provider cancels. System finds backup, keeps price lock, sends updated notification.',
    query: 'plumber needed tmrw morning DHA phase 5',
    expectedOutcome: 'Recovered trace. Backup provider found. Reliability reduced for original.',
    icon: 'refresh-circle-outline',
    color: Colors.primary,
    variant: 'primary',
    navigateTo: 'AgentTrace' as any,
    navigateParams: undefined,
  },
  {
    id: 'F',
    letter: 'F',
    title: 'Price Dispute',
    description: 'User disputes final price. DisputeAgent evaluates and decides refund/compensation.',
    query: 'I need a plumber tomorrow morning in DHA',
    expectedOutcome: 'Dispute resolved with partial credit. Provider action logged.',
    icon: 'shield-outline',
    color: Colors.danger,
    variant: 'danger',
    navigateTo: 'DisputeCenter',
    navigateParams: undefined,
  },
];

export const DemoScenariosScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { run, isLoading } = useAgentStore();
  const [runningId, setRunningId] = useState<string | null>(null);

  const handleRun = async (scenario: Scenario) => {
    setRunningId(scenario.id);
    try {
      await run(scenario.query, scenario.budget);
    } catch (e) {
      // silent fallback
    }
    setRunningId(null);
    navigation.navigate(scenario.navigateTo as any, scenario.navigateParams);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="play-circle-outline" size={28} color={Colors.primary} />
        <Text style={styles.headerTitle}>Demo Scenarios</Text>
        <Text style={styles.headerSub}>
          6 interactive scenarios showcasing the complete Ustaad360 agentic pipeline.
          Each runs real agent logic — no mocks.
        </Text>
        <View style={styles.headerStats}>
          <View style={styles.stat}><Text style={styles.statVal}>10</Text><Text style={styles.statLabel}>Agents</Text></View>
          <View style={styles.stat}><Text style={styles.statVal}>6</Text><Text style={styles.statLabel}>Scenarios</Text></View>
          <View style={styles.stat}><Text style={styles.statVal}>100%</Text><Text style={styles.statLabel}>Offline</Text></View>
        </View>
      </View>

      {/* Challenge inputs note */}
      <View style={styles.noteCard}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
        <Text style={styles.noteText}>
          Each scenario runs real agent pipeline. Tap "Run Scenario" to see the full lifecycle in action.
        </Text>
      </View>

      {/* Scenarios */}
      {SCENARIOS.map(s => {
        const isRunning = runningId === s.id;
        return (
          <View key={s.id} style={[styles.scenarioCard, { borderLeftColor: s.color }]}>
            <View style={styles.scenarioHeader}>
              <View style={[styles.letterBadge, { backgroundColor: s.color + '22', borderColor: s.color + '44' }]}>
                <Text style={[styles.letter, { color: s.color }]}>{s.letter}</Text>
              </View>
              <View style={styles.scenarioInfo}>
                <Text style={styles.scenarioTitle}>{s.title}</Text>
                <Text style={styles.scenarioDesc}>{s.description}</Text>
              </View>
            </View>

            {/* Input query */}
            <View style={styles.queryBox}>
              <Ionicons name="chatbubble-outline" size={13} color={Colors.textMuted} />
              <Text style={styles.queryText}>"{s.query}"</Text>
            </View>
            {s.budget && (
              <View style={styles.budgetBox}>
                <Ionicons name="cash-outline" size={13} color={Colors.warning} />
                <Text style={styles.budgetText}>Budget: ₨{s.budget}</Text>
              </View>
            )}

            {/* Expected outcome */}
            <View style={styles.outcomeBox}>
              <Text style={styles.outcomeLabel}>Expected:</Text>
              <Text style={styles.outcomeText}>{s.expectedOutcome}</Text>
            </View>

            {/* Run button */}
            <TouchableOpacity
              style={[styles.runBtn, { borderColor: s.color, opacity: isLoading ? 0.7 : 1 }]}
              onPress={() => handleRun(s)}
              disabled={isLoading}
            >
              {isRunning
                ? <ActivityIndicator size="small" color={s.color} />
                : <Ionicons name="play" size={15} color={s.color} />
              }
              <Text style={[styles.runText, { color: s.color }]}>
                {isRunning ? 'Running pipeline…' : 'Run Scenario →'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* QA note */}
      <View style={styles.qaCard}>
        <Text style={styles.qaTitle}>📋 Challenge Inputs Tested</Text>
        {[
          '"I need a plumber tomorrow morning in DHA"',
          '"Kal subah plumber chahiye DHA mein"',
          '"Mujhe plmbr chye kal subh DHA"',
          '"plumber needed tmrw morning DHA phase 5"',
          '"AC bilkul kaam nahi kar raha, kal subah G-13 mein technician chahiye, budget zyada nahi hai"',
        ].map((q, i) => (
          <Text key={i} style={styles.qaItem}>{i + 1}. {q}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  headerCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, alignItems: 'center', gap: Spacing.sm },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  headerSub: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  headerStats: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.sm },
  stat: { alignItems: 'center' },
  statVal: { ...Typography.h4, color: Colors.primary },
  statLabel: { ...Typography.caption, color: Colors.textMuted },
  noteCard: { flexDirection: 'row', gap: Spacing.sm, backgroundColor: Colors.primary + '11', borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '33', alignItems: 'flex-start' },
  noteText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1, lineHeight: 18 },
  scenarioCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, borderLeftWidth: 4, gap: Spacing.sm },
  scenarioHeader: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  letterBadge: { width: 38, height: 38, borderRadius: Radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  letter: { fontSize: 18, fontWeight: '800' },
  scenarioInfo: { flex: 1 },
  scenarioTitle: { ...Typography.bodyMd, color: Colors.textPrimary, fontWeight: '700', marginBottom: 2 },
  scenarioDesc: { ...Typography.bodySm, color: Colors.textMuted, lineHeight: 17 },
  queryBox: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: Colors.inputBg, borderRadius: Radius.sm, padding: Spacing.sm },
  queryText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1, fontStyle: 'italic', lineHeight: 17 },
  budgetBox: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  budgetText: { ...Typography.bodySm, color: Colors.warning, fontWeight: '600' },
  outcomeBox: { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  outcomeLabel: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  outcomeText: { ...Typography.caption, color: Colors.textMuted, flex: 1 },
  runBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderWidth: 1.5, borderRadius: Radius.md, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, alignSelf: 'flex-start', marginTop: 2 },
  runText: { ...Typography.bodyMd, fontWeight: '700' },
  qaCard: { backgroundColor: Colors.cardElevated, borderRadius: Radius.md, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  qaTitle: { ...Typography.label, color: Colors.textPrimary, marginBottom: 4 },
  qaItem: { ...Typography.caption, color: Colors.textMuted, lineHeight: 18 },
});
