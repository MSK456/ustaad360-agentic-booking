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

export const ProviderListScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { result } = useAgentStore();
  const providers = result?.rankedProviders ?? [];
  const count = providers.length > 0 ? providers.length : MOCK_PROVIDERS.length;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Summary bar */}
      <View style={styles.summaryBar}>
        <View style={styles.intentChip}>
          <Ionicons name="water-outline" size={14} color={Colors.primary} />
          <Text style={styles.intentChipText}>Plumber · Lahore · High urgency · ₨1,500</Text>
        </View>
      </View>

      {/* Results header */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsTitle}>{count} Providers Ranked</Text>
        <View style={styles.factorsBadge}>
          <Ionicons name="podium-outline" size={12} color={Colors.primary} />
          <Text style={styles.factorsText}>9 factors</Text>
        </View>
      </View>

      {/* Provider cards */}
      {providers.length > 0 ? providers.map((rp, i) => (
        <ProviderCard
          key={rp.provider.id}
          rankedProvider={rp}
          rank={i + 1}
          onPress={() => navigation.navigate('ProviderDetail', { providerId: rp.provider.id })}
          onBook={() => navigation.navigate('BookingConfirm', { providerId: rp.provider.id })}
        />
      )) : MOCK_PROVIDERS.slice(0, 4).map((p, i) => (
        <ProviderCard
          key={p.id}
          rankedProvider={{ provider: p, finalScore: 80 - i * 5, factorScores: {} as any, rankingReason: '', riskFlags: [], whyRecommended: '', badges: [], estimatedPrice: p.basePricePerHour, distanceKm: 2 + i, travelTimeMin: 7 + i * 3 }}
          rank={i + 1}
          onPress={() => navigation.navigate('ProviderDetail', { providerId: p.id })}
          onBook={() => navigation.navigate('BookingConfirm', { providerId: p.id })}
        />
      ))}

      {/* Ranking note */}
      <View style={styles.rankNote}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.textMuted} />
        <Text style={styles.rankNoteText}>
          Rankings use 9 factors: distance, travel time, availability, rating, review recency,
          reliability, price fit, skill match, and cancellation rate.
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
  intentChipText: { ...Typography.bodySm, color: Colors.textSecondary },
  resultsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: Spacing.md,
  },
  resultsTitle: { ...Typography.h4, color: Colors.textPrimary },
  factorsBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(20,184,166,0.12)', borderRadius: 999,
    paddingHorizontal: Spacing.sm, paddingVertical: 3,
  },
  factorsText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  rankNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.card, borderRadius: 10,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder,
    marginTop: Spacing.sm,
  },
  rankNoteText: { ...Typography.bodySm, color: Colors.textMuted, flex: 1, lineHeight: 18 },
});
