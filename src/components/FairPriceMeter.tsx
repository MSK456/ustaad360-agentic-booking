import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface FairPriceMeterProps {
  userBudget?: number;
  finalEstimate: number;
  marketMin?: number;
  marketMax?: number;
  budgetFit: 'unknown' | 'within_budget' | 'slightly_over' | 'over_budget';
  isBudgetMismatch: boolean;
}

export const FairPriceMeter: React.FC<FairPriceMeterProps> = ({
  userBudget, finalEstimate, marketMin = 1800, marketMax = 2500, budgetFit, isBudgetMismatch
}) => {
  let status = "Fair Price";
  let statusColor: string = Colors.primary;
  let recommendation = "Transparent fair quote generated based on urgency and distance.";

  if (isBudgetMismatch) {
    status = userBudget && userBudget < marketMin ? "Below realistic market range" : "Over budget";
    statusColor = Colors.danger;
    recommendation = "Inspection only or increase budget. The requested budget is below verified local rates.";
  } else if (budgetFit === 'slightly_over') {
    status = "Slightly over budget";
    statusColor = Colors.warning;
    recommendation = "Within 15% of your target budget. Excellent value.";
  } else if (budgetFit === 'within_budget') {
    status = "Within budget";
    statusColor = Colors.success;
    recommendation = "Great match for your budget.";
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="speedometer-outline" size={18} color={statusColor} />
        <Text style={[styles.title, { color: statusColor }]}>FairPrice Meter™</Text>
      </View>
      
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Your Budget</Text>
          <Text style={styles.statVal}>{userBudget ? `₨${userBudget}` : 'Flexible'}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Est. Quote</Text>
          <Text style={[styles.statVal, { color: statusColor }]}>₨{finalEstimate}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Market Range</Text>
          <Text style={styles.statVal}>₨{marketMin} - ₨{marketMax}</Text>
        </View>
      </View>

      <View style={[styles.statusBox, { backgroundColor: statusColor + '11', borderColor: statusColor + '33' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>Status: {status}</Text>
        <Text style={styles.recText}>{recommendation}</Text>
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
  title: {
    ...Typography.bodyMd,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  statVal: {
    ...Typography.bodyMd,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusBox: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1,
  },
  statusText: {
    ...Typography.bodySm,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  recText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
});
