import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAgentStore } from '../store/agentStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'IntentReview'>;

// Mock NLU analysis
const analyzeIntent = (query: string) => {
  const lower = query.toLowerCase();
  let service = 'General Service';
  let serviceKey = 'plumber';
  let urgency = 'medium';
  let budget: number | null = null;

  if (lower.includes('nala') || lower.includes('paani') || lower.includes('pipe') || lower.includes('plumb')) {
    service = 'Plumber'; serviceKey = 'plumber';
  } else if (lower.includes('bijli') || lower.includes('electric') || lower.includes('wiring') || lower.includes('light')) {
    service = 'Electrician'; serviceKey = 'electrician';
  } else if (lower.includes('ac') || lower.includes('gas') || lower.includes('cool')) {
    service = 'AC Technician'; serviceKey = 'ac_technician';
  } else if (lower.includes('darwaza') || lower.includes('wood') || lower.includes('carpenter')) {
    service = 'Carpenter'; serviceKey = 'carpenter';
  }

  if (lower.includes('urgent') || lower.includes('abhi') || lower.includes('emergency') || lower.includes('jaldi')) {
    urgency = 'high';
  } else if (lower.includes('kal') || lower.includes('tomorrow') || lower.includes('baad mein')) {
    urgency = 'low';
  }

  const budgetMatch = query.match(/(\d+)/);
  if (budgetMatch) budget = parseInt(budgetMatch[1], 10);

  const lang = /[\u0600-\u06FF]/.test(query) ? 'Urdu' :
    query.match(/[a-z]/i) && lower.includes('nala') ? 'Roman Urdu' : 'English';

  return { service, serviceKey, urgency, budget, lang, confidence: 0.94 };
};

export const IntentReviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { query }  = route.params;

  const { result, isLoading } = useAgentStore();
  const intent = result?.intent ?? null;

  const fields = intent ? [
    { label: 'Language',   value: intent.detectedLanguage.replace('_', ' '),         icon: 'language-outline' },
    { label: 'Service',    value: intent.serviceType.replace('_', ' '),               icon: 'construct-outline' },
    { label: 'Urgency',    value: intent.urgency.toUpperCase(),                       icon: 'alert-circle-outline' },
    { label: 'Location',   value: intent.location ?? 'Not specified',                 icon: 'location-outline' },
    { label: 'Time',       value: intent.timePreference,                              icon: 'time-outline' },
    { label: 'Complexity', value: intent.jobComplexity,                               icon: 'layers-outline' },
    { label: 'Budget',     value: intent.budgetSensitivity + ' sensitivity',          icon: 'cash-outline' },
  ] : [];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <Card style={styles.queryCard}>
        <Text style={styles.queryLabel}>Your Request</Text>
        <Text style={styles.queryText}>"{query}"</Text>
      </Card>

      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>AI pipeline running…</Text>
          <Text style={styles.loadingSubtext}>Intent → Discovery → Ranking → Pricing → Booking</Text>
        </View>
      ) : intent ? (
        <>
          <Card elevated style={styles.intentCard}>
            <View style={styles.intentHeader}>
              <Ionicons name="hardware-chip-outline" size={20} color={Colors.primary} />
              <Text style={styles.intentTitle}>IntentAgent Result</Text>
              <Badge label={`${Math.round(intent.confidence * 100)}% conf`} variant="success" />
            </View>

            <View style={styles.fieldGrid}>
              {fields.map((f) => (
                <View key={f.label} style={styles.fieldRow}>
                  <Ionicons name={f.icon as any} size={16} color={Colors.primary} />
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <Text style={styles.fieldValue}>{f.value}</Text>
                </View>
              ))}
            </View>

            {intent.clarificationQuestion && (
              <View style={styles.clarificationBox}>
                <Ionicons name="help-circle-outline" size={16} color={Colors.warning} />
                <Text style={styles.clarificationText}>{intent.clarificationQuestion}</Text>
              </View>
            )}
          </Card>

          <View style={styles.urgencyRow}>
            <Badge
              label={intent.urgency === 'high' || intent.urgency === 'emergency' ? '🔴 High Priority' : '🟡 Medium Priority'}
              variant={intent.urgency === 'high' || intent.urgency === 'emergency' ? 'danger' : 'warning'}
              dot
            />
            <Text style={styles.urgencyNote}>
              {intent.urgency === 'high' ? 'Showing immediately available providers' : 'Flexible time slots available'}
            </Text>
          </View>

          <Button label="View Ranked Providers →" onPress={() => navigation.navigate('ProviderList')}
            variant="primary" size="lg" fullWidth style={styles.ctaBtn} />
          <Button label="Refine Request" onPress={() => navigation.goBack()}
            variant="outline" size="md" fullWidth />
        </>
      ) : (
        <View style={styles.loadingBox}>
          <Text style={styles.loadingText}>Type a request on the home screen first.</Text>
        </View>
      )}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.md },
  queryCard: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  queryLabel: { ...Typography.caption, color: Colors.textMuted, marginBottom: 4 },
  queryText: { ...Typography.h4, color: Colors.textPrimary, fontStyle: 'italic' },
  loadingBox: { alignItems: 'center', paddingVertical: Spacing.xxxl, gap: Spacing.md },
  loadingText: { ...Typography.body, color: Colors.textPrimary },
  loadingSubtext: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
  intentCard: { gap: Spacing.md },
  intentHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  intentTitle: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  fieldGrid: { gap: Spacing.sm },
  fieldRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.inputBg, borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
  fieldLabel: { ...Typography.bodySm, color: Colors.textMuted, width: 70 },
  fieldValue: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600', flex: 1 },
  clarificationBox: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.xs, backgroundColor: Colors.warning + '15', borderRadius: Radius.sm, padding: Spacing.sm },
  clarificationText: { ...Typography.bodySm, color: Colors.warning, flex: 1 },
  urgencyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  urgencyNote: { ...Typography.bodySm, color: Colors.textMuted, flex: 1 },
  ctaBtn: { marginTop: Spacing.sm },
});

