import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { PriceBreakdown } from '../types';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface PriceBreakdownCardProps {
  breakdown: PriceBreakdown;
}

export const PriceBreakdownCard: React.FC<PriceBreakdownCardProps> = ({ breakdown }) => {
  const {
    baseLabour, complexityMultiplier, urgencyMultiplier,
    travelCharge, platformFee, total, userBudget,
    negotiationStatus, negotiationMessage,
  } = breakdown;

  const statusConfig = {
    within_budget: { color: Colors.success, icon: 'checkmark-circle' as const },
    slightly_over: { color: Colors.warning, icon: 'alert-circle' as const },
    over_budget:   { color: Colors.danger,  icon: 'close-circle' as const },
    mismatch:      { color: Colors.danger,  icon: 'close-circle' as const },
  };
  const { color, icon } = statusConfig[negotiationStatus];

  const complexityFee = Math.round(baseLabour * (complexityMultiplier - 1));
  const urgencyFee = urgencyMultiplier > 1
    ? Math.round((baseLabour + complexityFee) * (urgencyMultiplier - 1))
    : 0;

  const Row = ({ label, amount, highlight }: { label: string; amount: number; highlight?: boolean }) => (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, highlight && { color: Colors.textPrimary }]}>{label}</Text>
      <Text style={[styles.rowAmount, highlight && { color: Colors.textPrimary, fontWeight: '700' }]}>
        ₨{amount.toLocaleString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Price Breakdown</Text>

      <View style={styles.lines}>
        <Row label={`Base Labour (${Math.round(baseLabour / 800)}hr × ₨800)`} amount={baseLabour} />
        {complexityMultiplier > 1 && (
          <Row label={`Complexity ×${complexityMultiplier}`} amount={complexityFee} />
        )}
        {urgencyMultiplier > 1 && (
          <Row label={`Urgency ×${urgencyMultiplier}`} amount={urgencyFee} />
        )}
        <Row label="Travel Charge" amount={travelCharge} />
        <View style={styles.divider} />
        <Row label="Subtotal" amount={total - platformFee} />
        <Row label="Platform Fee (5%)" amount={platformFee} />
        <View style={styles.divider} />
        <Row label="Total Quoted" amount={total} highlight />
        <Row label="Your Budget" amount={userBudget} highlight />
      </View>

      {/* Negotiation result */}
      <View style={[styles.negotiation, { borderColor: color + '44', backgroundColor: color + '11' }]}>
        <Ionicons name={icon} size={18} color={color} />
        <Text style={[styles.negotiationText, { color }]}>{negotiationMessage}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardElevated,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: Spacing.base,
  },
  title: { ...Typography.h4, color: Colors.textPrimary, marginBottom: Spacing.md },
  lines: { gap: Spacing.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowLabel: { ...Typography.bodySm, color: Colors.textMuted },
  rowAmount: { ...Typography.bodySm, color: Colors.textSecondary },
  divider: { height: 1, backgroundColor: Colors.cardBorder, marginVertical: Spacing.xs },
  negotiation: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    marginTop: Spacing.md, padding: Spacing.sm,
    borderRadius: Radius.md, borderWidth: 1,
  },
  negotiationText: { ...Typography.bodySm, fontWeight: '600', flex: 1 },
});
