import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Typography } from '../theme';
import { ProviderCard } from '../components/ProviderCard';
import { useAgentStore } from '../store/agentStore';
import { MOCK_PROVIDERS } from '../data/providers';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Service icon map
const SERVICE_ICONS: Record<string, string> = {
  plumber: 'water-outline', electrician: 'flash-outline',
  ac_technician: 'snow-outline', carpenter: 'hammer-outline',
  painter: 'color-palette-outline', welder: 'flame-outline',
  mason: 'construct-outline', cleaner: 'sparkles-outline',
  mechanic: 'car-outline', pest_control: 'bug-outline',
};

export const ProviderListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { result, selectProvider } = useAgentStore();

  const providers = result?.rankedProviders ?? [];
  const intent    = result?.intent;
  const count     = providers.length > 0 ? providers.length : MOCK_PROVIDERS.length;

  // Build summary chip text from real intent, or fallback
  const serviceName = (intent?.serviceType ?? 'plumber').replace('_', ' ');
  const location    = intent?.location ?? 'Lahore';
  const urgencyTag  = intent?.urgency === 'high' || intent?.urgency === 'emergency'
    ? 'High urgency' : 'Flexible timing';
  const serviceIcon = SERVICE_ICONS[intent?.serviceType ?? 'plumber'] ?? 'construct-outline';
  const chipText    = `${serviceName} · ${location} · ${urgencyTag}`;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.intentChip}>
          <Ionicons name={serviceIcon as any} size={14} color={Colors.primary} />
          <Text style={styles.intentChipText}>{chipText}</Text>
        </View>
      </View>

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>{count} Providers Ranked</Text>
        <View style={styles.factorsBadge}>
          <Ionicons name="podium-outline" size={12} color={Colors.primary} />
          <Text style={styles.factorsText}>10 factors</Text>
        </View>
      </View>

      {/* No-results state */}
      {count === 0 && (
        <View style={styles.emptyBox}>
          <Ionicons name="alert-circle-outline" size={36} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No providers found</Text>
          <Text style={styles.emptyHint}>Try a different location or service type.</Text>
        </View>
      )}

      {/* Provider cards — real ranked or fallback */}
      {providers.length > 0
        ? providers.map((rp, i) => (
            <ProviderCard
              key={rp.provider.id}
              rankedProvider={rp}
              rank={i + 1}
              onPress={() => {
                selectProvider(rp.provider.id);
                navigation.navigate('ProviderDetail', { providerId: rp.provider.id });
              }}
              onBook={() => {
                selectProvider(rp.provider.id);
                navigation.navigate('BookingConfirm', { providerId: rp.provider.id });
              }}
            />
          ))
        : MOCK_PROVIDERS.slice(0, 4).map((p, i) => (
            <ProviderCard
              key={p.id}
              rankedProvider={{
                provider: p,
                finalScore: 80 - i * 5,
                factorScores: {
                  availabilityScore: 0.9, skillMatchScore: 0.85, reliabilityScore: 0.88,
                  ratingScore: 0.9, reviewRecencyScore: 0.8, distanceScore: 0.85,
                  travelTimeScore: 0.8, priceFitScore: 0.9, lowCancellationScore: 0.92,
                  providerFairnessScore: 0.87,
                },
                rankingReason: 'Fallback demo provider',
                riskFlags: [],
                whyRecommended: 'Strong local track record and availability',
                badges: [],
                estimatedPrice: p.basePricePerHour,
                distanceKm: 2 + i,
                travelTimeMin: 7 + i * 3,
              }}
              rank={i + 1}
              onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })}
              onBook={() => navigation.navigate('BookingConfirm', { providerId: p.id })}
            />
          ))
      }

      {/* Ranking note */}
      <View style={styles.rankNote}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.rankNoteText}>
          Rankings use 10 factors: availability, skill match, reliability, rating, review recency,
          distance, travel time, price fit, cancellation rate, and provider fairness.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  summaryBar: { marginBottom: Spacing.md },
  intentChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.cardElevated, borderRadius: 999,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    alignSelf: 'flex-start', borderWidth: 1, borderColor: Colors.primary + '44',
  },
  intentChipText: { ...Typography.bodySm, color: Colors.textSecondary, textTransform: 'capitalize' },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  resultsTitle: { ...Typography.h4, color: Colors.textPrimary },
  factorsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(20,184,166,0.12)', borderRadius: 999,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  factorsText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  emptyBox: { alignItems: 'center', paddingVertical: Spacing.xxxl, gap: Spacing.md },
  emptyTitle: { ...Typography.h4, color: Colors.textPrimary },
  emptyHint: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
  rankNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.card, borderRadius: 10,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, marginTop: Spacing.sm,
  },
  rankNoteText: { ...Typography.bodySm, color: Colors.textMuted, flex: 1, lineHeight: 18 },
});
