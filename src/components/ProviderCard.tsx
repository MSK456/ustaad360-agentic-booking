import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RankedProviderResult } from '../types/agent';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { ScoreRing } from './ScoreRing';
import { Badge } from './Badge';

interface ProviderCardProps {
  rankedProvider: RankedProviderResult;
  rank: number;
  onPress: () => void;
  onBook: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ rankedProvider, rank, onPress, onBook }) => {
  const { provider, finalScore, estimatedPrice, distanceKm, travelTimeMin, badges, riskFlags } = rankedProvider;

  const rankColor = rank === 1 ? Colors.accent : rank === 2 ? Colors.textMuted : Colors.textDisabled;

  // Derive display initials and service
  const initial   = provider.name[0].toUpperCase();
  const serviceLabel = provider.serviceCategories[0]?.replace(/_/g, ' ') ?? 'Service';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>

      {/* Rank badge */}
      <View style={[styles.rankBadge, { backgroundColor: rankColor + '22' }]}>
        <Text style={[styles.rankText, { color: rankColor }]}>#{rank}</Text>
      </View>

      <View style={styles.row}>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{provider.name}</Text>
            {provider.verifiedBadge && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
            )}
          </View>
          <Text style={styles.serviceLabel}>{serviceLabel}</Text>
          <View style={styles.statRow}>
            <Ionicons name="star" size={12} color={Colors.accent} />
            <Text style={styles.statText}>{provider.rating.toFixed(1)}</Text>
            <Text style={styles.dot}>·</Text>
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.statText}>{distanceKm}km</Text>
            <Text style={styles.dot}>·</Text>
            <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
            <Text style={styles.statText}>{travelTimeMin} min</Text>
          </View>
          <View style={styles.tagRow}>
            {provider.isAvailable
              ? <Badge label="Available Now" variant="success" dot />
              : <Badge label="Unavailable" variant="muted" />
            }
            <Badge label={`₨${estimatedPrice.toLocaleString()}`} variant="primary" />
            {riskFlags.length > 0 && <Badge label="⚠ Risk" variant="warning" />}
          </View>
        </View>

        {/* Score Ring */}
        <ScoreRing score={Math.round(finalScore)} size={60} label="score" />
      </View>

      {/* Badges row */}
      {badges.length > 0 && (
        <View style={styles.badgeRow}>
          {badges.slice(0, 3).map(b => (
            <View key={b} style={styles.badgeChip}>
              <Text style={styles.badgeChipText}>{b}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      <View style={styles.skillRow}>
        {provider.skills.slice(0, 4).map((s) => (
          <View key={s} style={styles.skillChip}>
            <Text style={styles.skillText}>{s}</Text>
          </View>
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.profileBtn} onPress={onPress}>
          <Text style={styles.profileBtnText}>View Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
          <Text style={styles.bookBtnText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: Spacing.base, marginBottom: Spacing.md,
  },
  rankBadge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full,
  },
  rankText: { fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.primary + '22', borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  info: { flex: 1, gap: 3 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { ...Typography.h4, color: Colors.textPrimary },
  serviceLabel: { ...Typography.caption, color: Colors.primary, textTransform: 'capitalize' },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { ...Typography.bodySm, color: Colors.textMuted },
  dot: { color: Colors.textDisabled, fontSize: 12 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  badgeRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: Spacing.xs },
  badgeChip: {
    backgroundColor: Colors.primary + '18', borderRadius: Radius.full,
    paddingHorizontal: 8, paddingVertical: 2, borderWidth: 1, borderColor: Colors.primary + '44',
  },
  badgeChipText: { fontSize: 10, color: Colors.primary, fontWeight: '600' },
  skillRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: Spacing.md },
  skillChip: {
    backgroundColor: Colors.cardElevated, paddingHorizontal: Spacing.sm,
    paddingVertical: 3, borderRadius: Radius.full,
  },
  skillText: { fontSize: 11, color: Colors.textSecondary },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  profileBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.primary, alignItems: 'center',
  },
  profileBtnText: { color: Colors.primary, fontWeight: '600', fontSize: 13 },
  bookBtn: {
    flex: 1, paddingVertical: Spacing.sm, borderRadius: Radius.md,
    backgroundColor: Colors.primary, alignItems: 'center',
  },
  bookBtnText: { color: '#08111F', fontWeight: '700', fontSize: 13 },
});
