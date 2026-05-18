import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ScoreRing } from '../components/ScoreRing';
import { MOCK_RANKED_PROVIDERS } from '../data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ProviderDetail'>;

const FACTOR_LABELS: Record<string, string> = {
  distance: 'Distance', travelTime: 'Travel Time', availability: 'Availability',
  rating: 'Rating', reviewRecency: 'Review Recency', reliability: 'Reliability',
  priceFit: 'Price Fit', skillMatch: 'Skill Match', cancellationRate: 'Reliability+',
};

export const ProviderDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { providerId } = route.params;

  const rankedProvider = MOCK_RANKED_PROVIDERS.find((r) => r.provider.id === providerId)
    ?? MOCK_RANKED_PROVIDERS[0];
  const { provider, scores, totalScore, estimatedPrice, distanceKm, travelTimeMin } = rankedProvider;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={styles.hero}>
        <Image source={{ uri: provider.profilePhotoUrl }} style={styles.avatar} />
        <View style={styles.heroInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{provider.name}</Text>
            {provider.verifiedBadge && <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />}
          </View>
          <View style={styles.statsRow}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.stat}>{provider.rating.toFixed(1)} ({provider.reviewCount} reviews)</Text>
          </View>
          <View style={styles.statsRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.stat}>{distanceKm}km · {travelTimeMin} min away</Text>
          </View>
          <Badge
            label={provider.isAvailable ? 'Available Now' : 'Unavailable'}
            variant={provider.isAvailable ? 'success' : 'muted'}
            dot
          />
        </View>
        <ScoreRing score={totalScore} size={72} label="score" />
      </View>

      {/* Quick stats */}
      <View style={styles.quickStats}>
        {[
          { label: 'Experience', value: `${provider.yearsExperience} yrs` },
          { label: 'On-Time', value: `${Math.round(provider.onTimeScore * 100)}%` },
          { label: 'Cancellation', value: `${Math.round(provider.cancellationRate * 100)}%` },
          { label: 'Est. Price', value: `₨${estimatedPrice.toLocaleString()}` },
        ].map((s) => (
          <View key={s.label} style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{s.value}</Text>
            <Text style={styles.quickStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Skills */}
      <Text style={styles.sectionLabel}>Skills</Text>
      <View style={styles.skillWrap}>
        {provider.skills.map((s) => (
          <View key={s} style={styles.skillChip}>
            <Text style={styles.skillText}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Score breakdown */}
      <Text style={styles.sectionLabel}>9-Factor Score Breakdown</Text>
      <View style={styles.scoreCard}>
        {Object.entries(scores).map(([key, val]) => (
          <View key={key} style={styles.scoreRow}>
            <Text style={styles.scoreLabel}>{FACTOR_LABELS[key] ?? key}</Text>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, {
                width: `${Math.round(val * 100)}%`,
                backgroundColor: val >= 0.75 ? Colors.success : val >= 0.5 ? Colors.warning : Colors.danger,
              }]} />
            </View>
            <Text style={styles.scoreVal}>{Math.round(val * 100)}</Text>
          </View>
        ))}
      </View>

      {/* CTA */}
      <Button
        label={`Book ${provider.name.split(' ')[0]} — ₨${estimatedPrice.toLocaleString()}`}
        onPress={() => navigation.navigate('BookingConfirm', { providerId: provider.id })}
        variant="primary"
        size="lg"
        fullWidth
        style={styles.cta}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  hero: {
    flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start',
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md,
  },
  avatar: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: Colors.primary },
  heroInfo: { flex: 1, gap: 6 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { ...Typography.h4, color: Colors.textPrimary },
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stat: { ...Typography.bodySm, color: Colors.textMuted },
  quickStats: {
    flexDirection: 'row', backgroundColor: Colors.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.cardBorder,
    justifyContent: 'space-around', marginBottom: Spacing.md,
  },
  quickStat: { alignItems: 'center' },
  quickStatValue: { ...Typography.h4, color: Colors.primary },
  quickStatLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  skillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  skillChip: {
    backgroundColor: Colors.cardElevated, borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  skillText: { ...Typography.bodySm, color: Colors.textSecondary },
  scoreCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder,
    gap: Spacing.sm, marginBottom: Spacing.md,
  },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  scoreLabel: { ...Typography.bodySm, color: Colors.textMuted, width: 100 },
  scoreBarBg: { flex: 1, height: 6, backgroundColor: Colors.cardBorder, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreVal: { ...Typography.caption, color: Colors.textMuted, width: 28, textAlign: 'right' },
  cta: { marginTop: Spacing.sm },
});
