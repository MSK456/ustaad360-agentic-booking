import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { useAgentStore } from '../store/agentStore';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'BookingConfirm'>;

const PAYMENT_METHODS = [
  { id: 'cash',      label: 'Cash',       icon: 'cash-outline' },
  { id: 'easypaisa', label: 'Easypaisa',  icon: 'phone-portrait-outline' },
  { id: 'jazzcash',  label: 'JazzCash',   icon: 'card-outline' },
];

export const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { providerId } = route.params;

  const [payment, setPayment]   = useState('cash');
  const [confirmed, setConfirmed] = useState(false);

  const { result } = useAgentStore();

  const rankedProvider = result?.rankedProviders.find(r => r.provider.id === providerId)
    ?? result?.rankedProviders[0];
  const pricing  = result?.pricing;
  const booking  = result?.booking;
  const provider = rankedProvider?.provider;

  const bookingId = booking?.bookingId ?? 'B-U360-DEMO';
  const confCode  = booking?.confirmationCode ?? 'DEMO01';
  const price     = pricing?.finalEstimate ?? rankedProvider?.estimatedPrice ?? 1354;
  const slot      = booking?.scheduledAt ?? 'Tomorrow at 09:00 AM';

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => navigation.navigate('FollowUpTimeline', { bookingId }), 1200);
  };

  if (!provider) {
    return (
      <View style={styles.fallback}>
        <Ionicons name="alert-circle-outline" size={40} color={Colors.textMuted} />
        <Text style={styles.fallbackText}>No booking data found. Run a search first.</Text>
        <Button label="Go Home" onPress={() => navigation.navigate('MainTabs' as any)}
          variant="outline" size="md" fullWidth style={{ marginTop: Spacing.md }} />
      </View>
    );
  }

  if (confirmed) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={48} color="#08111F" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successId}>#{bookingId}</Text>
        <Text style={styles.successCode}>Confirmation Code: {confCode}</Text>
        <Text style={styles.successNote}>{provider.name} will arrive {slot}</Text>
        <Text style={styles.successReminder}>📲 Reminder set · 📅 Calendar updated · 💬 WhatsApp sent</Text>
        <View style={styles.successBtns}>
          <Button label="View Follow-up Timeline" variant="primary" size="lg" fullWidth
            onPress={() => navigation.navigate('FollowUpTimeline', { bookingId })} />
          <Button label="View Agent Trace" variant="outline" size="md" fullWidth
            onPress={() => navigation.navigate('AgentTrace' as any)} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Provider bar */}
      <View style={styles.providerBar}>
        <View style={styles.avatarBox}><Text style={styles.avatarInitial}>{provider.name[0]}</Text></View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerMeta}>
            ⭐ {provider.rating.toFixed(1)} · {slot} · Gulberg III
          </Text>
        </View>
        {provider.verifiedBadge && <Badge label="Verified" variant="success" />}
      </View>

      {/* Booking info */}
      <View style={styles.infoCard}>
        <Text style={styles.sectionLabel}>BOOKING DETAILS</Text>
        {[
          { label: 'Booking ID',    value: bookingId, mono: true },
          { label: 'Confirm Code',  value: confCode,  mono: true },
          { label: 'Service',       value: provider.serviceCategories[0]?.replace('_', ' ') ?? 'Service' },
          { label: 'Time Slot',     value: slot },
          { label: 'Location',      value: booking?.address ?? 'House 42, Gulberg III' },
          { label: 'Payment',       value: payment.charAt(0).toUpperCase() + payment.slice(1) },
        ].map(row => (
          <View key={row.label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={[styles.infoVal, row.mono && { fontFamily: 'monospace' }]}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* Price receipt */}
      <View style={styles.receiptCard}>
        <Text style={styles.sectionLabel}>PRICE RECEIPT</Text>
        {pricing ? [
          { label: 'Base Rate',          value: `₨${pricing.baseRate}` },
          { label: 'Distance Surcharge', value: `₨${pricing.distanceSurcharge}` },
          { label: 'Complexity Fee',     value: `₨${pricing.complexityFee}` },
          { label: 'Provider Premium',   value: `₨${pricing.providerPremium}` },
          { label: `Urgency ×${pricing.urgencyMultiplier}`, value: '' },
          { label: `Demand ×${pricing.demandMultiplier}`,   value: '' },
          { label: 'Loyalty Discount',   value: `−₨${pricing.loyaltyDiscount}` },
        ].filter(r => r.value).map(row => (
          <View key={row.label} style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>{row.label}</Text>
            <Text style={styles.receiptVal}>{row.value}</Text>
          </View>
        )) : null}
        <View style={styles.receiptDivider} />
        <View style={styles.receiptTotal}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalVal}>₨{price.toLocaleString()}</Text>
        </View>
        <View style={styles.priceLock}>
          <Ionicons name="lock-closed-outline" size={13} color={Colors.success} />
          <Text style={styles.priceLockText}>Price locked for 30 minutes</Text>
        </View>
        {pricing?.fairnessNoteForUser && (
          <Text style={styles.fairnessNote}>{pricing.fairnessNoteForUser}</Text>
        )}
      </View>

      {/* Notifications preview */}
      <View style={styles.notifyCard}>
        <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>
        {[
          { icon: 'logo-whatsapp',     label: 'WhatsApp confirmation message' },
          { icon: 'notifications',     label: 'Reminder 1 hour before' },
          { icon: 'calendar',          label: 'Calendar event created' },
        ].map(n => (
          <View key={n.label} style={styles.notifyRow}>
            <Ionicons name={n.icon as any} size={16} color={Colors.primary} />
            <Text style={styles.notifyText}>{n.label}</Text>
            <Badge label="Queued" variant="success" />
          </View>
        ))}
      </View>

      {/* Payment */}
      <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>
      <View style={styles.paymentRow}>
        {PAYMENT_METHODS.map(m => (
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

      {/* Cancellation policy */}
      <View style={styles.policyBox}>
        <Ionicons name="information-circle-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.policyText}>
          Cancellation policy: Free within 30 min of booking. ₨100 fee if cancelled within 2h of service.
          No-show by provider triggers full refund automatically.
        </Text>
      </View>

      <Button label={`Confirm Booking — ₨${price.toLocaleString()}`}
        onPress={handleConfirm} variant="primary" size="lg" fullWidth style={styles.cta} />
      <Button label="Change Provider" onPress={() => navigation.goBack()}
        variant="ghost" size="md" fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  fallback: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  fallbackText: { ...Typography.body, color: Colors.textMuted, textAlign: 'center' },
  providerBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  avatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary + '22', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.primary },
  avatarInitial: { fontSize: 20, fontWeight: '700', color: Colors.primary },
  providerInfo: { flex: 1 },
  providerName: { ...Typography.h4, color: Colors.textPrimary },
  providerMeta: { ...Typography.bodySm, color: Colors.textMuted, marginTop: 2 },
  sectionLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1, marginBottom: Spacing.xs },
  infoCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoLabel: { ...Typography.bodySm, color: Colors.textMuted },
  infoVal: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600', textAlign: 'right', flex: 1, marginLeft: Spacing.sm },
  receiptCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptLabel: { ...Typography.bodySm, color: Colors.textMuted },
  receiptVal: { ...Typography.bodySm, color: Colors.textSecondary, fontWeight: '600' },
  receiptDivider: { height: 1, backgroundColor: Colors.cardBorder },
  receiptTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...Typography.label, color: Colors.textPrimary, letterSpacing: 1 },
  totalVal: { ...Typography.h4, color: Colors.primary, fontWeight: '800' },
  priceLock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceLockText: { ...Typography.caption, color: Colors.success },
  fairnessNote: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', lineHeight: 16 },
  notifyCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  notifyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifyText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1 },
  paymentRow: { flexDirection: 'row', gap: Spacing.sm },
  paymentBtn: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: Spacing.md, backgroundColor: Colors.card, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.cardBorder },
  paymentBtnActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  paymentLabel: { ...Typography.bodySm, color: Colors.textMuted },
  policyBox: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start', backgroundColor: Colors.cardElevated, borderRadius: Radius.md, padding: Spacing.sm },
  policyText: { ...Typography.caption, color: Colors.textMuted, flex: 1, lineHeight: 17 },
  cta: {},
  successRoot: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: Spacing.xl },
  successCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  successTitle: { ...Typography.h2, color: Colors.textPrimary },
  successId: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  successCode: { ...Typography.bodySm, color: Colors.primary, fontFamily: 'monospace' },
  successNote: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  successReminder: { ...Typography.bodySm, color: Colors.primary, textAlign: 'center' },
  successBtns: { width: '100%', gap: Spacing.sm },
});
