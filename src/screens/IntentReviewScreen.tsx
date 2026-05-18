import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

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
  const route = useRoute<Route>();
  const { query } = route.params;

  const [loading, setLoading] = useState(true);
  const [intent, setIntent] = useState<ReturnType<typeof analyzeIntent> | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntent(analyzeIntent(query));
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {/* Original query */}
      <Card style={styles.queryCard}>
        <Text style={styles.queryLabel}>Your Request</Text>
        <Text style={styles.queryText}>"{query}"</Text>
      </Card>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>AI is analyzing your request...</Text>
          <Text style={styles.loadingSubtext}>Detecting language → Extracting intent → Parsing entities</Text>
        </View>
      ) : intent ? (
        <>
          {/* Intent result */}
          <Card elevated style={styles.intentCard}>
            <View style={styles.intentHeader}>
              <Ionicons name="hardware-chip-outline" size={20} color={Colors.primary} />
              <Text style={styles.intentTitle}>NLU Agent Result</Text>
              <Badge label={`${Math.round(intent.confidence * 100)}% confidence`} variant="success" />
            </View>

            <View style={styles.fieldGrid}>
              {[
                { label: 'Language', value: intent.lang, icon: 'language-outline' },
                { label: 'Service', value: intent.service, icon: 'construct-outline' },
                { label: 'Urgency', value: intent.urgency.toUpperCase(), icon: 'alert-circle-outline' },
                { label: 'Budget', value: intent.budget ? `₨${intent.budget.toLocaleString()}` : 'Not specified', icon: 'cash-outline' },
              ].map((f) => (
                <View key={f.label} style={styles.fieldRow}>
                  <Ionicons name={f.icon as any} size={16} color={Colors.primary} />
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <Text style={styles.fieldValue}>{f.value}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Urgency indicator */}
          <View style={styles.urgencyRow}>
            <Badge
              label={intent.urgency === 'high' ? '🔴 High Priority' : '🟡 Medium Priority'}
              variant={intent.urgency === 'high' ? 'danger' : 'warning'}
              dot
            />
            <Text style={styles.urgencyNote}>
              {intent.urgency === 'high' ? 'Providers showing immediate availability' : 'Flexible time slots available'}
            </Text>
          </View>

          {/* Actions */}
          <Button
            label="Find Providers →"
            onPress={() => navigation.navigate('ProviderList')}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.ctaBtn}
          />
          <Button
            label="Refine Request"
            onPress={() => navigation.goBack()}
            variant="outline"
            size="md"
            fullWidth
          />
        </>
      ) : null}
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
  urgencyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, flexWrap: 'wrap' },
  urgencyNote: { ...Typography.bodySm, color: Colors.textMuted, flex: 1 },
  ctaBtn: { marginTop: Spacing.sm },
});
