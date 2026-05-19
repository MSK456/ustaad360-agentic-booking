import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface AgentDecisionSummaryProps {
  intent: any;
  rankedProvidersCount: number;
}

export const AgentDecisionSummaryCard: React.FC<AgentDecisionSummaryProps> = ({ intent, rankedProvidersCount }) => {
  if (!intent) return null;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="hardware-chip" size={18} color={Colors.primary} />
        <Text style={styles.title}>Agent Decision Summary</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.text}>
          <Text style={styles.bold}>Understood:</Text> {intent.serviceType}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Location:</Text> {intent.location ?? 'Any'} ({intent.city ?? 'General'})
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Urgency:</Text> {intent.urgency}
        </Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Budget limit:</Text> {intent.maxBudget ? `₨${intent.maxBudget}` : 'Flexible'}
        </Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.decisionText}>
          <Text style={styles.bold}>Strategy:</Text> Found same-city {intent.serviceType} professionals, 
          ranked {rankedProvidersCount} options by availability, reliability, price fit, and cancellation risk.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.primary + '11',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primary + '33',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  title: {
    ...Typography.bodyMd,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  content: {
    gap: 4,
  },
  text: {
    ...Typography.bodySm,
    color: Colors.textSecondary,
  },
  bold: {
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.cardBorder,
    marginVertical: Spacing.sm,
  },
  decisionText: {
    ...Typography.bodySm,
    color: Colors.textPrimary,
    fontStyle: 'italic',
  },
});
