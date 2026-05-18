import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RankedProvider } from '../types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { ScoreRing } from './ScoreRing';
import { Badge } from './Badge';

interface ProviderCardProps {
  rankedProvider: RankedProvider;
  rank: number;
  onPress: () => void;
  onBook: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ rankedProvider, rank, onPress, onBook }) => {
  const { provider, totalScore, estimatedPrice, distanceKm, travelTimeMin } = rankedProvider;

  const rankColor = rank === 1 ? Colors.accent : rank === 2 ? Colors.textMuted : Colors.textDisabled;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Rank badge */}
      <View style={[styles.rankBadge, { backgroundColor: rankColor + '22' }]}>
        <Text style={[styles.rankText, { color: rankColor }]}>#{rank}</Text>
      </View>

      <View style={styles.row}>
        {/* Avatar */}
        <Image source={{ uri: provider.profilePhotoUrl }} style={styles.avatar} />

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{provider.name}</Text>
            {provider.verifiedBadge && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
            )}
          </View>
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
          </View>
        </View>

        {/* Score Ring */}
        <ScoreRing score={totalScore} size={60} label="score" />
      </View>

      {/* Skills */}
      <View style={styles.skillRow}>
        {provider.skills.slice(0, 3).map((s) => (
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
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.base,
    marginBottom: Spacing.md,
  },
  rankBadge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: Radius.full,
  },
  rankText: { fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  avatar: { width: 52, height: 52, borderRadius: Radius.full, borderWidth: 2, borderColor: Colors.primary },
  info: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { ...Typography.h4, color: Colors.textPrimary },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { ...Typography.bodySm, color: Colors.textMuted },
  dot: { color: Colors.textDisabled, fontSize: 12 },
  tagRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginTop: 2 },
  skillRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: Spacing.md },
  skillChip: {
    backgroundColor: Colors.cardElevated,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
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
