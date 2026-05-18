import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { PriceBreakdownCard } from '../components/PriceBreakdownCard';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { PriceBreakdown } from '../types';
import { MOCK_RANKED_PROVIDERS } from '../data/mockData';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'BookingConfirm'>;

const MOCK_BREAKDOWN: PriceBreakdown = {
  baseLabour: 800,
  complexityMultiplier: 1.7,
  urgencyMultiplier: 1.3,
  travelCharge: 60,
  platformFee: 74,
  total: 1354,
  userBudget: 1500,
  negotiationStatus: 'within_budget',
  negotiationMessage: 'Within your budget ✅ — proceeding with booking',
};

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Cash', icon: 'cash-outline' },
  { id: 'easypaisa', label: 'Easypaisa', icon: 'phone-portrait-outline' },
  { id: 'jazzcash', label: 'JazzCash', icon: 'card-outline' },
];

export const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { providerId } = route.params;
  const [payment, setPayment] = useState('cash');
  const [confirmed, setConfirmed] = useState(false);

  const rankedProvider = MOCK_RANKED_PROVIDERS.find((r) => r.provider.id === providerId)
    ?? MOCK_RANKED_PROVIDERS[0];
  const { provider } = rankedProvider;

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigation.navigate('FollowUpTimeline', { bookingId: 'B-U360-2847' }), 1500);
  };

  if (confirmed) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={48} color="#08111F" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successSub}>#{`B-U360-2847`}</Text>
        <Text style={styles.successNote}>{provider.name} will arrive tomorrow at 9:00 AM</Text>
        <Text style={styles.successReminder}>📲 Reminder set for 1 hour before</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Provider summary */}
      <View style={styles.providerBar}>
        <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerMeta}>
            ⭐ {provider.rating.toFixed(1)} · Tomorrow 9:00 AM · House 42, Gulberg III
          </Text>
        </View>
        {provider.verifiedBadge && <Badge label="Verified" variant="success" />}
      </View>

      {/* Price breakdown */}
      <PriceBreakdownCard breakdown={MOCK_BREAKDOWN} />

      {/* Payment method */}
      <Text style={styles.sectionLabel}>Payment Method</Text>
      <View style={styles.paymentRow}>
        {PAYMENT_METHODS.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={[styles.paymentBtn, payment === m.id && styles.paymentBtnActive]}
            onPress={() => setPayment(m.id)}
          >
            <Ionicons name={m.icon as any} size={20} color={payment === m.id ? Colors.primary : Colors.textMuted} />
            <Text style={[styles.paymentLabel, payment === m.id && { color: Colors.primary }]}>{m.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Terms note */}
      <View style={styles.termsNote}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.termsText}>
          By confirming, you agree to Ustaad360 service terms. Cancellation within 2 hours incurs a ₨100 fee.
        </Text>
      </View>

      <Button
        label="Confirm Booking →"
        onPress={handleConfirm}
        variant="primary"
        size="lg"
        fullWidth
        style={styles.cta}
      />
      <Button
        label="Change Provider"
        onPress={() => navigation.goBack()}
        variant="ghost"
        size="md"
        fullWidth
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  providerBar: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  providerInfo: { flex: 1 },
  providerName: { ...Typography.h4, color: Colors.textPrimary },
  providerMeta: { ...Typography.bodySm, color: Colors.textMuted, marginTop: 2 },
  sectionLabel: { ...Typography.label, color: Colors.textMuted },
  paymentRow: { flexDirection: 'row', gap: Spacing.sm },
  paymentBtn: {
    flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.md,
    backgroundColor: Colors.card, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  paymentBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  paymentLabel: { ...Typography.bodySm, color: Colors.textMuted },
  termsNote: {
    flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start',
    backgroundColor: Colors.cardElevated, borderRadius: Radius.md, padding: Spacing.sm,
  },
  termsText: { ...Typography.caption, color: Colors.textMuted, flex: 1, lineHeight: 17 },
  cta: {},
  successRoot: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl,
  },
  successCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center',
  },
  successTitle: { ...Typography.h2, color: Colors.textPrimary },
  successSub: { ...Typography.bodySm, color: Colors.textMuted, fontFamily: 'monospace' },
  successNote: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  successReminder: { ...Typography.bodySm, color: Colors.primary },
});
