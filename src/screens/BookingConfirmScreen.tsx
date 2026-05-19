import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { FairPriceMeter } from '../components/FairPriceMeter';
import { useAgentStore } from '../store/agentStore';
import { runBookingAgent } from '../agents/BookingAgent';
import { runFollowUpAgent } from '../agents/FollowUpAgent';
import { runSchedulingAgent } from '../agents/SchedulingAgent';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'BookingConfirm'>;

const PAYMENT_METHODS = [
  { id: 'cash',      label: 'Cash',      icon: 'cash-outline' },
  { id: 'easypaisa', label: 'Easypaisa', icon: 'phone-portrait-outline' },
  { id: 'jazzcash',  label: 'JazzCash',  icon: 'card-outline' },
];

export const BookingConfirmScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { providerId } = route.params;

  const [payment, setPayment]     = useState('cash');
  const [confirmed, setConfirmed] = useState(false);

  const { result, selectedProviderId } = useAgentStore();

  // Find provider from ranked list
  const rankedProvider = result?.rankedProviders.find(r => r.provider.id === providerId)
    ?? result?.rankedProviders[0];
  const pricing  = result?.pricing ?? null;
  const provider = rankedProvider?.provider;

  // Use orchestrator booking or generate on-the-fly
  const existingBooking = result?.booking?.providerId === providerId ? result.booking : null;

  // Local booking generation if orchestrator result is for a different provider
  const [localBooking, setLocalBooking] = useState(existingBooking);

  const bookingData = localBooking ?? existingBooking;
  const bookingId   = bookingData?.bookingId ?? 'B-U360-DEMO';
  const confCode    = bookingData?.confirmationCode ?? 'DEMO01';
  const price       = bookingData?.finalPrice ?? pricing?.finalEstimate ?? rankedProvider?.estimatedPrice ?? 1354;
  const slot        = bookingData?.scheduledAt ?? 'Tomorrow at 09:00 AM';
  const address     = bookingData?.address ?? 'House 42, Gulberg III, Lahore';

  const handleConfirm = () => {
    // If we don't have a booking for this provider, generate one now
    if (!bookingData && rankedProvider && pricing) {
      const { scheduledAt } = runSchedulingAgent(rankedProvider, result!.intent);
      const { booking } = runBookingAgent(rankedProvider, pricing, scheduledAt);
      setLocalBooking(booking);
    }
    setConfirmed(true);
    setTimeout(() => navigation.navigate('FollowUpTimeline', { bookingId }), 1400);
  };

  if (!provider) {
    return (
      <View style={styles.fallback}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.fallbackTitle}>No Booking Data</Text>
        <Text style={styles.fallbackSub}>Please run a search from the home screen first.</Text>
        <Button label="Go Home" onPress={() => navigation.navigate('MainTabs' as any)}
          variant="outline" size="md" fullWidth style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  if (confirmed) {
    return (
      <View style={styles.successRoot}>
        <View style={styles.successCircle}>
          <Ionicons name="checkmark" size={52} color="#08111F" />
        </View>
        <Text style={styles.successTitle}>Booking Confirmed!</Text>
        <Text style={styles.successId}>#{bookingId}</Text>
        <Text style={styles.successCode}>Code: {confCode}</Text>
        <Text style={styles.successNote}>{provider.name} · {slot}</Text>
        <Text style={styles.successReminder}>📲 WhatsApp simulated · 📅 Calendar updated · ⏰ Reminder set</Text>
        
        <View style={{ flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.md, width: '100%', marginBottom: Spacing.md }}>
          <Button 
            label="Call Provider" 
            variant="outline" 
            size="md" 
            style={{ flex: 1 }}
            onPress={() => Alert.alert('Call Simulated', `Dialing simulated number ${provider.phone} via Ustaad360 relay.`)}
          />
          <Button 
            label="View WhatsApp" 
            variant="outline" 
            size="md" 
            style={{ flex: 1 }}
            onPress={() => Alert.alert('WhatsApp Simulated', `Message: "Salam ${provider.name}, I have booked you for ${slot}. My address is ..."`)}
          />
        </View>

        <View style={styles.successBtns}>
          <Button label="View Follow-up Timeline →" variant="primary" size="lg" fullWidth
            onPress={() => navigation.navigate('FollowUpTimeline', { bookingId })} />
          <Button label="View Agent Trace" variant="outline" size="md" fullWidth
            onPress={() => (navigation as any).navigate('MainTabs', { screen: 'AgentTrace' })} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Provider bar */}
      <View style={styles.providerBar}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarInitial}>{provider.name[0]}</Text>
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerMeta}>
            ⭐ {provider.rating.toFixed(1)} · {slot}
          </Text>
          <Text style={styles.providerAddr}>{address}</Text>
        </View>
        {provider.verifiedBadge && <Badge label="Verified" variant="success" />}
      </View>

      {/* Booking details */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>BOOKING DETAILS</Text>
        {[
          { label: 'Booking ID',   value: bookingId,                                                         mono: true  },
          { label: 'Conf. Code',   value: confCode,                                                          mono: true  },
          { label: 'Service',      value: provider.serviceCategories[0]?.replace('_', ' ') ?? 'Service',    mono: false },
          { label: 'Scheduled',    value: slot,                                                              mono: false },
          { label: 'Address',      value: address,                                                           mono: false },
          { label: 'Payment',      value: payment.charAt(0).toUpperCase() + payment.slice(1),               mono: false },
        ].map(row => (
          <View key={row.label} style={styles.detailRow}>
            <Text style={styles.detailLabel}>{row.label}</Text>
            <Text style={[styles.detailVal, row.mono && { fontFamily: 'monospace' }]}>{row.value}</Text>
          </View>
        ))}
      </View>

      {/* FairPrice Meter */}
      {pricing && (
        <FairPriceMeter 
          userBudget={pricing.userBudget}
          finalEstimate={pricing.finalEstimate}
          budgetFit={pricing.budgetFit}
          isBudgetMismatch={pricing.isBudgetMismatch}
          pricingModel={pricing.pricingModel}
        />
      )}

      {/* Price receipt */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>PRICE RECEIPT</Text>

        {pricing ? (
          <>
            {pricing.pricingModel === 'daily_essential' ? (
              <>
                {pricing.items?.map((item: any, i: number) => (
                  <View key={`item-${i}`} style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>{item.name} {item.quantity}{item.unit} × ₨{item.unitPrice}</Text>
                    <Text style={styles.receiptVal}>₨{item.subtotal}</Text>
                  </View>
                ))}
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Delivery Fee</Text>
                  <Text style={styles.receiptVal}>₨{pricing.deliveryFee}</Text>
                </View>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Packaging Fee</Text>
                  <Text style={styles.receiptVal}>₨{pricing.packagingFee}</Text>
                </View>
              </>
            ) : (
              <>
                {[
                  { label: 'Visit / Base Rate',   value: `₨${pricing.baseRate}`                },
                  { label: 'Distance Surcharge',  value: `₨${pricing.distanceSurcharge}`       },
                  { label: 'Complexity Fee',      value: `₨${pricing.complexityFee}`           },
                  { label: 'Provider Premium',    value: `₨${pricing.providerPremium}`         },
                ].map(r => (
                  <View key={r.label} style={styles.receiptRow}>
                    <Text style={styles.receiptLabel}>{r.label}</Text>
                    <Text style={styles.receiptVal}>{r.value}</Text>
                  </View>
                ))}
              </>
            )}
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Urgency ×{pricing.urgencyMultiplier}</Text>
              <Text style={[styles.receiptVal, { color: Colors.warning }]}>×{pricing.urgencyMultiplier}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Demand ×{pricing.demandMultiplier}</Text>
              <Text style={[styles.receiptVal, { color: Colors.warning }]}>×{pricing.demandMultiplier}</Text>
            </View>
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Loyalty Discount</Text>
              <Text style={[styles.receiptVal, { color: Colors.success }]}>−₨{pricing.loyaltyDiscount}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.receiptNote}>Full breakdown available after pipeline run.</Text>
        )}

        <View style={styles.receiptDivider} />
        <View style={styles.receiptTotal}>
          <Text style={styles.totalLabel}>TOTAL</Text>
          <Text style={styles.totalVal}>₨{price.toLocaleString()}</Text>
        </View>
        <View style={styles.priceLock}>
          <Ionicons name="lock-closed-outline" size={13} color={Colors.success} />
          <Text style={styles.priceLockText}>Price locked · No hidden charges</Text>
        </View>
        {pricing?.fairnessNoteForUser && (
          <Text style={styles.fairnessNote}>{pricing.fairnessNoteForUser}</Text>
        )}
        {pricing?.recoveryOptions && (
          <View style={styles.recoveryBox}>
            <Text style={styles.recoveryTitle}>⚠️ Budget Recovery Options</Text>
            {pricing.recoveryOptions.map((r: string, i: number) => (
              <Text key={i} style={styles.recoveryItem}>• {r}</Text>
            ))}
          </View>
        )}
      </View>

      {/* Notifications */}
      <View style={styles.card}>
        <Text style={styles.sectionLabel}>NOTIFICATIONS QUEUED</Text>
        {[
          { icon: 'logo-whatsapp',  label: 'WhatsApp booking confirmation' },
          { icon: 'notifications',  label: 'Reminder 1 hour before service' },
          { icon: 'calendar',       label: 'Calendar event created' },
        ].map(n => (
          <View key={n.label} style={styles.notifyRow}>
            <Ionicons name={n.icon as any} size={16} color={Colors.primary} />
            <Text style={styles.notifyText}>{n.label}</Text>
            <Badge label="Queued" variant="success" />
          </View>
        ))}
      </View>

      {/* Payment selection */}
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
          Free cancellation within 30 min of booking. ₨100 fee if cancelled within 2h of service.
          Provider no-show → full automatic refund.
        </Text>
      </View>

      {pricing?.isBudgetMismatch && (
        <View style={{ backgroundColor: Colors.danger + '11', padding: 12, borderRadius: 8, marginBottom: 12, borderColor: Colors.danger, borderWidth: 1 }}>
          <Text style={{ color: Colors.danger, fontWeight: 'bold', marginBottom: 4 }}>⚠️ Proceeding Over Budget</Text>
          <Text style={{ color: Colors.danger, fontSize: 13 }}>
            This quote (₨{pricing.finalEstimate}) exceeds your target budget (₨{pricing.userBudget}). Pressing confirm means you accept this higher rate.
          </Text>
        </View>
      )}

      <Button label={`Confirm Booking — ₨${price.toLocaleString()}`}
        onPress={handleConfirm} variant={pricing?.isBudgetMismatch ? 'danger' : 'primary'} size="lg" fullWidth style={styles.cta} />
      <Button label="← Change Provider" onPress={() => navigation.goBack()}
        variant="ghost" size="md" fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, gap: Spacing.md, paddingBottom: Spacing.xxxl },
  fallback: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  fallbackTitle: { ...Typography.h4, color: Colors.textPrimary },
  fallbackSub: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
  providerBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder },
  avatarBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary + '22', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.primary },
  avatarInitial: { fontSize: 22, fontWeight: '700', color: Colors.primary },
  providerInfo: { flex: 1 },
  providerName: { ...Typography.h4, color: Colors.textPrimary },
  providerMeta: { ...Typography.bodySm, color: Colors.textMuted, marginTop: 2 },
  providerAddr: { ...Typography.caption, color: Colors.textDisabled, marginTop: 1 },
  card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  sectionLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  detailLabel: { ...Typography.bodySm, color: Colors.textMuted, width: 90 },
  detailVal: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600', flex: 1, textAlign: 'right' },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptLabel: { ...Typography.bodySm, color: Colors.textMuted },
  receiptVal: { ...Typography.bodySm, color: Colors.textSecondary, fontWeight: '600' },
  receiptNote: { ...Typography.bodySm, color: Colors.textMuted, fontStyle: 'italic' },
  receiptDivider: { height: 1, backgroundColor: Colors.cardBorder },
  receiptTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { ...Typography.label, color: Colors.textPrimary, letterSpacing: 1 },
  totalVal: { ...Typography.h4, color: Colors.primary, fontWeight: '800' },
  priceLock: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  priceLockText: { ...Typography.caption, color: Colors.success },
  fairnessNote: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', lineHeight: 16 },
  recoveryBox: { backgroundColor: Colors.warning + '11', borderRadius: Radius.sm, padding: Spacing.sm, gap: 4 },
  recoveryTitle: { ...Typography.label, color: Colors.warning },
  recoveryItem: { ...Typography.bodySm, color: Colors.textSecondary },
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
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.success, alignItems: 'center', justifyContent: 'center' },
  successTitle: { ...Typography.h2, color: Colors.textPrimary },
  successId: { ...Typography.bodySm, color: Colors.textMuted, fontFamily: 'monospace' },
  successCode: { ...Typography.bodySm, color: Colors.primary, fontFamily: 'monospace' },
  successNote: { ...Typography.body, color: Colors.textSecondary, textAlign: 'center' },
  successReminder: { ...Typography.bodySm, color: Colors.primary, textAlign: 'center' },
  successBtns: { width: '100%', gap: Spacing.sm, marginTop: Spacing.sm },
});
