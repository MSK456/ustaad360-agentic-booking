import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface TrustShieldProps {
  reliabilityScore: number;
  cancellationRate: number;
  rating: number;
  verifiedBadge: boolean;
  skillMatchScore: number;
}

export const TrustShieldCard: React.FC<TrustShieldProps> = ({
  reliabilityScore, cancellationRate, rating, verifiedBadge, skillMatchScore
}) => {
  let shieldStatus = "Low Risk";
  let shieldColor: string = Colors.success;
  let shieldIcon = "shield-checkmark";

  if (reliabilityScore < 0.8 || cancellationRate > 0.1 || rating < 4.0) {
    shieldStatus = "Watchlist";
    shieldColor = Colors.warning;
    shieldIcon = "shield-half";
  }
  if (cancellationRate > 0.2 || rating < 3.5) {
    shieldStatus = "High Risk";
    shieldColor = Colors.danger;
    shieldIcon = "shield-half"; // using standard icon as full outline doesn't look as dangerous
  }
  if (shieldStatus === "Low Risk" && rating >= 4.5 && verifiedBadge) {
    shieldStatus = "Excellent Trust";
    shieldColor = Colors.primary;
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name={shieldIcon as any} size={24} color={shieldColor} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>TrustShield™ Assured</Text>
          <Text style={[styles.status, { color: shieldColor }]}>{shieldStatus}</Text>
        </View>
      </View>
      
      <View style={styles.grid}>
        {[
          { label: 'Reliability', val: `${Math.round(reliabilityScore * 100)}%`, good: reliabilityScore >= 0.85 },
          { label: 'Cancel Risk', val: `${Math.round(cancellationRate * 100)}%`, good: cancellationRate <= 0.05 },
          { label: 'Skill Match', val: `${Math.round(skillMatchScore * 100)}%`, good: skillMatchScore >= 0.8 },
          { label: 'Verification', val: verifiedBadge ? 'Verified' : 'Unverified', good: verifiedBadge },
        ].map(item => (
          <View key={item.label} style={styles.gridItem}>
            <Ionicons name={item.good ? "checkmark-circle" : "alert-circle"} size={14} color={item.good ? Colors.success : Colors.warning} />
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemVal}>{item.val}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardElevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    ...Typography.bodyMd,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  status: {
    ...Typography.caption,
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  gridItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.background,
    padding: Spacing.sm,
    borderRadius: Radius.sm,
  },
  itemLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    flex: 1,
  },
  itemVal: {
    ...Typography.bodySm,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});
