import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { ScoreRing } from '../components/ScoreRing';
import { MapPreviewCard } from '../components/MapPreviewCard';
import { FairPriceMeter } from '../components/FairPriceMeter';
import { TrustShieldCard } from '../components/TrustShieldCard';
import { AgentDecisionSummaryCard } from '../components/AgentDecisionSummaryCard';
import { useAgentStore } from '../store/agentStore';
import { MOCK_PROVIDERS } from '../data/providers';

type Nav   = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'ProviderDetail'>;

const FACTOR_LABELS: Record<string, { label: string; icon: string }> = {
  availabilityScore:    { label: 'Availability',     icon: 'calendar-outline' },
  skillMatchScore:      { label: 'Skill Match',       icon: 'construct-outline' },
  reliabilityScore:     { label: 'Reliability',       icon: 'shield-checkmark-outline' },
  ratingScore:          { label: 'Rating',             icon: 'star-outline' },
  reviewRecencyScore:   { label: 'Review Recency',    icon: 'time-outline' },
  distanceScore:        { label: 'Distance',           icon: 'location-outline' },
  travelTimeScore:      { label: 'Travel Time',        icon: 'car-outline' },
  priceFitScore:        { label: 'Price Fit',          icon: 'cash-outline' },
  lowCancellationScore: { label: 'Low Cancellation',  icon: 'close-circle-outline' },
  providerFairnessScore:{ label: 'Fairness Score',    icon: 'people-outline' },
};

export const ProviderDetailScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { providerId } = route.params;

  const { result, selectedProviderId } = useAgentStore();

  // Find from store ranked list, fallback to mock
  const rankedProvider = result?.rankedProviders.find(r => r.provider.id === providerId)
    ?? result?.rankedProviders[0]
    ?? null;

  const pricing = result?.pricing ?? null;

  if (!rankedProvider) {
    return (
      <View style={styles.fallback}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.textMuted} />
        <Text style={styles.fallbackTitle}>No Provider Selected</Text>
        <Text style={styles.fallbackSub}>Please run a search from the home screen first.</Text>
        <Button label="← Go to Provider List" onPress={() => navigation.navigate('ProviderList')}
          variant="outline" size="md" fullWidth style={{ marginTop: Spacing.lg }} />
      </View>
    );
  }

  const { provider, finalScore, factorScores, badges, riskFlags,
          whyRecommended, whyNotClosestProvider, estimatedPrice, distanceKm, travelTimeMin } = rankedProvider;

  const pricingDisplay = pricing ?? {
    baseRate: provider.basePricePerHour,
    distanceSurcharge: Math.round(Math.max(0, distanceKm - 2) * 60),
    urgencyMultiplier: 1.0,
    complexityFee: 600,
    providerPremium: provider.rating >= 4.7 ? 200 : 0,
    demandMultiplier: 1.0,
    loyaltyDiscount: 100,
    finalEstimate: estimatedPrice,
    fairnessNoteForUser: 'Price calculated transparently using distance, urgency, and job complexity.',
    fairnessNoteForProvider: `Provider receives ₨${Math.round(estimatedPrice * 0.85)} after platform fee.`,
    budgetFit: 'unknown' as const,
    isBudgetMismatch: false,
    explanation: `Base ₨${provider.basePricePerHour} + distance + complexity × urgency - loyalty`,
    recoveryOptions: [],
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.avatarBox}>
          <Text style={styles.avatarInitial}>{provider.name[0]}</Text>
        </View>
        <View style={styles.heroInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{provider.name}</Text>
            {provider.verifiedBadge && <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />}
          </View>
          <Text style={styles.serviceType}>{provider.serviceCategories.join(', ').replace(/_/g, ' ')}</Text>
          <View style={styles.statRow}>
            <Ionicons name="star" size={13} color={Colors.accent} />
            <Text style={styles.statText}>{provider.rating.toFixed(1)} ({provider.reviewCount} reviews)</Text>
          </View>
          <View style={styles.statRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.statText}>{distanceKm}km · ~{travelTimeMin} min away</Text>
          </View>
          <Badge label={provider.isAvailable ? 'Available Now' : 'Unavailable'}
            variant={provider.isAvailable ? 'success' : 'muted'} dot />
        </View>
        <ScoreRing score={finalScore} size={72} label="score" />
      </View>

      <AgentDecisionSummaryCard intent={result?.intent} rankedProvidersCount={result?.rankedProviders.length ?? 0} />

      <TrustShieldCard 
        reliabilityScore={provider.onTimeScore}
        cancellationRate={provider.cancellationRate}
        rating={provider.rating}
        verifiedBadge={provider.verifiedBadge}
        skillMatchScore={factorScores.skillMatchScore}
      />

      <FairPriceMeter 
        userBudget={pricingDisplay.userBudget}
        finalEstimate={pricingDisplay.finalEstimate}
        budgetFit={pricingDisplay.budgetFit}
        isBudgetMismatch={pricingDisplay.isBudgetMismatch}
      />

      {/* Quick stats */}
      <View style={styles.quickStats}>
        {[
          { label: 'Experience', value: `${provider.yearsExperience}yr` },
          { label: 'On-Time',    value: `${Math.round(provider.onTimeScore * 100)}%` },
          { label: 'Cancel Rate',value: `${Math.round(provider.cancellationRate * 100)}%` },
          { label: 'Est. Price', value: `₨${estimatedPrice.toLocaleString()}` },
        ].map(s => (
          <View key={s.label} style={styles.quickStat}>
            <Text style={styles.quickValue}>{s.value}</Text>
            <Text style={styles.quickLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Badges */}
      {badges.length > 0 && (
        <View style={styles.badgeRow}>
          {badges.map(b => <Badge key={b} label={b} variant="primary" style={styles.badge} />)}
        </View>
      )}

      {/* Why recommended */}
      <View style={styles.reasonCard}>
        <View style={styles.reasonHeader}>
          <Ionicons name="bulb-outline" size={16} color={Colors.primary} />
          <Text style={styles.reasonTitle}>Why Recommended</Text>
        </View>
        <Text style={styles.reasonText}>{whyRecommended}</Text>
        {whyNotClosestProvider && (
          <View style={[styles.reasonCard, { borderColor: Colors.warning, backgroundColor: Colors.warning + '11', marginTop: Spacing.sm }]}>
            <View style={styles.reasonHeader}>
              <Ionicons name="git-branch-outline" size={16} color={Colors.warning} />
              <Text style={[styles.reasonTitle, { color: Colors.warning }]}>Why not the closest?</Text>
            </View>
            <Text style={[styles.reasonText, { color: Colors.textSecondary }]}>
              {whyNotClosestProvider}
              {'\n\n'}Ustaad360 selected a slightly farther provider with better expected success.
            </Text>
          </View>
        )}
      </View>

      {/* Risk flags */}
      {riskFlags.length > 0 && (
        <View style={styles.riskCard}>
          <Text style={styles.sectionLabel}>⚠️ Risk Flags</Text>
          {riskFlags.map(r => (
            <Text key={r} style={styles.riskItem}>• {r}</Text>
          ))}
        </View>
      )}

      {/* Provider Workload Balance */}
      <View style={[styles.reasonCard, { borderColor: Colors.success, backgroundColor: Colors.success + '11', marginTop: Spacing.sm }]}>
        <View style={styles.reasonHeader}>
          <Ionicons name="scale-outline" size={16} color={Colors.success} />
          <Text style={[styles.reasonTitle, { color: Colors.success }]}>Provider Workload Balance</Text>
        </View>
        <Text style={[styles.reasonText, { color: Colors.textSecondary }]}>
          Current load: 2 bookings / 5 capacity.{'\n'}
          Provider is not overloaded. Selected to ensure fair distribution of work.
        </Text>
      </View>

      {/* Skills */}
      <Text style={styles.sectionLabel}>Skills & Specialization</Text>
      <View style={styles.skillWrap}>
        {provider.skills.map(s => (
          <View key={s} style={styles.skillChip}><Text style={styles.skillText}>{s}</Text></View>
        ))}
      </View>

      {/* Available slots */}
      <Text style={styles.sectionLabel}>Available Slots</Text>
      <View style={styles.slotsRow}>
        {provider.availableSlots.length > 0
          ? provider.availableSlots.map((slot, idx) => {
              // slot is a TimeSlot object: { date, startTime, endTime, isBooked }
              const slotKey = typeof slot === 'string'
                ? `slot-${idx}-${slot}`
                : `slot-${idx}-${slot.date}-${slot.startTime}`;
              const slotLabel = typeof slot === 'string'
                ? slot
                : `${slot.date} • ${slot.startTime} – ${slot.endTime}`;
              const isBooked = typeof slot === 'object' && slot.isBooked;
              return (
                <View
                  key={slotKey}
                  style={[styles.slotChip, isBooked && styles.slotChipBooked]}
                >
                  <Text style={[styles.slotText, isBooked && styles.slotTextBooked]}>
                    {slotLabel}
                  </Text>
                  {isBooked && (
                    <Text style={styles.slotBookedBadge}>Booked</Text>
                  )}
                </View>
              );
            })
          : <Text style={styles.noSlots}>No slots available today</Text>
        }
      </View>

      {/* Map & ETA */}
      <Text style={styles.sectionLabel}>Route & Location</Text>
      <MapPreviewCard
        userArea={result?.intent?.location || 'Your Location'}
        providerArea={provider.city || 'Model Town'}
        city={provider.city || 'Lahore'}
        distanceKm={distanceKm}
        travelTimeMin={travelTimeMin}
        providerName={provider.name}
      />

      {/* 10-Factor Score Breakdown */}
      <Text style={styles.sectionLabel}>10-Factor Score Breakdown</Text>
      <View style={styles.scoreCard}>
        {Object.entries(factorScores).map(([key, val]) => {
          const pct = Math.round(val * 100);
          const col = pct >= 75 ? Colors.success : pct >= 50 ? Colors.warning : Colors.danger;
          const meta = FACTOR_LABELS[key];
          if (!meta) return null;
          return (
            <View key={key} style={styles.scoreRow}>
              <Ionicons name={meta.icon as any} size={13} color={Colors.textMuted} />
              <Text style={styles.scoreLabel}>{meta.label}</Text>
              <View style={styles.barBg}>
                <View style={[styles.barFill, { width: `${pct}%` as any, backgroundColor: col }]} />
              </View>
              <Text style={[styles.scoreVal, { color: col }]}>{pct}</Text>
            </View>
          );
        })}
      </View>

      {/* Price Breakdown */}
      <Text style={styles.sectionLabel}>Price Breakdown</Text>
      <View style={styles.priceCard}>
        {[
          { label: 'Base Rate',        value: `₨${pricingDisplay.baseRate}` },
          { label: 'Distance Surcharge', value: `₨${pricingDisplay.distanceSurcharge}` },
          { label: 'Complexity Fee',   value: `₨${pricingDisplay.complexityFee}` },
          { label: 'Provider Premium', value: `₨${pricingDisplay.providerPremium}` },
        ].map(row => (
          <View key={row.label} style={styles.priceRow}>
            <Text style={styles.priceLabel}>{row.label}</Text>
            <Text style={styles.priceVal}>{row.value}</Text>
          </View>
        ))}
        <View style={styles.priceDivider} />
        {[
          { label: `Urgency ×`, value: `×${pricingDisplay.urgencyMultiplier}` },
          { label: `Demand ×`,  value: `×${pricingDisplay.demandMultiplier}` },
          { label: 'Loyalty Discount', value: `−₨${pricingDisplay.loyaltyDiscount}` },
        ].map(row => (
          <View key={row.label} style={styles.priceRow}>
            <Text style={styles.priceLabel}>{row.label}</Text>
            <Text style={[styles.priceVal, { color: Colors.primary }]}>{row.value}</Text>
          </View>
        ))}
        <View style={styles.priceDivider} />
        <View style={styles.priceTotal}>
          <Text style={styles.priceTotalLabel}>Final Estimate</Text>
          <Text style={styles.priceTotalVal}>₨{pricingDisplay.finalEstimate.toLocaleString()}</Text>
        </View>
        {pricingDisplay.isBudgetMismatch && pricingDisplay.userBudget && pricingDisplay.gapAmount && (
          <View style={[styles.budgetFitBox, { backgroundColor: Colors.warning + '15', marginTop: 16, borderColor: Colors.warning, borderWidth: 1 }]}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8}}>
              <Ionicons name="compass-outline" size={18} color={Colors.warning} />
              <Text style={[styles.budgetFitText, { color: Colors.warning, fontWeight: 'bold' }]}>LOCAL REALITY CHECK</Text>
            </View>
            <Text style={{color: Colors.textSecondary, fontSize: 13, lineHeight: 18}}>
              ₨{pricingDisplay.userBudget.toLocaleString()} is below the verified market range for this service. 
              Ustaad360 can offer a basic inspection option, later slot, or waitlist instead of showing fake cheap results.
            </Text>
          </View>
        )}

        <View style={[styles.budgetFitBox, { backgroundColor:
          pricingDisplay.budgetFit === 'within_budget' ? Colors.success + '15' :
          pricingDisplay.budgetFit === 'slightly_over' ? Colors.warning + '15' :
          pricingDisplay.budgetFit === 'over_budget' ? Colors.danger + '15' : Colors.primary + '15'
        }]}>
          <Text style={styles.budgetFitText}>{pricingDisplay.budgetFit.replace('_', ' ').toUpperCase()} — {pricingDisplay.explanation}</Text>
        </View>
        <Text style={styles.fairnessNote}>{pricingDisplay.fairnessNoteForUser}</Text>
        
        {pricingDisplay.recoveryOptions && (
          <View style={styles.recoveryBox}>
            <Text style={styles.recoveryTitle}>💡 Budget Recovery Options</Text>
            {pricingDisplay.recoveryOptions.map((r: string, i: number) => (
              <Text key={i} style={styles.recoveryItem}>• {r}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={{ flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm }}>
        <Button 
          label="Call Provider" 
          variant="outline" 
          size="md" 
          style={{ flex: 1 }}
          onPress={() => Alert.alert('Call Simulated', `Dialing synthetic number ${provider.phone} securely through Ustaad360. No personal data shared.`)}
        />
        <Button 
          label="WhatsApp" 
          variant="outline" 
          size="md" 
          style={{ flex: 1 }}
          onPress={() => Alert.alert('WhatsApp Simulated', `Opening safe WhatsApp chat with ${provider.name}.`)}
        />
      </View>

      {/* CTA */}
      <Button
        label={pricingDisplay.isBudgetMismatch ? `Review budget options (Quote: ₨${pricingDisplay.finalEstimate.toLocaleString()})` : `Book this Ustaad — ₨${pricingDisplay.finalEstimate.toLocaleString()}`}
        onPress={() => navigation.navigate('BookingConfirm', { providerId: provider.id })}
        variant={pricingDisplay.isBudgetMismatch ? "danger" : "primary"} size="lg" fullWidth style={styles.cta}
      />
      <Button label="← Back to Providers" onPress={() => navigation.goBack()}
        variant="ghost" size="md" fullWidth />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  fallback: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.md },
  fallbackTitle: { ...Typography.h4, color: Colors.textPrimary },
  fallbackSub: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
  hero: { flexDirection: 'row', gap: Spacing.md, alignItems: 'flex-start', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md },
  avatarBox: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary + '22', borderWidth: 2, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { fontSize: 28, fontWeight: '700', color: Colors.primary },
  heroInfo: { flex: 1, gap: 4 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { ...Typography.h4, color: Colors.textPrimary },
  serviceType: { ...Typography.caption, color: Colors.primary, textTransform: 'capitalize', marginBottom: 2 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { ...Typography.bodySm, color: Colors.textMuted },
  quickStats: { flexDirection: 'row', backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, justifyContent: 'space-around', marginBottom: Spacing.md },
  quickStat: { alignItems: 'center' },
  quickValue: { ...Typography.h4, color: Colors.primary },
  quickLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  badge: {},
  reasonCard: { backgroundColor: Colors.cardElevated, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary + '33', marginBottom: Spacing.md, gap: 6 },
  reasonHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  reasonTitle: { ...Typography.label, color: Colors.primary },
  reasonText: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 18 },
  notClosestBox: { flexDirection: 'row', gap: 6, alignItems: 'flex-start', backgroundColor: Colors.warning + '11', borderRadius: Radius.sm, padding: Spacing.xs },
  notClosestText: { ...Typography.caption, color: Colors.warning, flex: 1, lineHeight: 16 },
  riskCard: { backgroundColor: Colors.danger + '11', borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.danger + '33', marginBottom: Spacing.sm },
  riskItem: { ...Typography.bodySm, color: Colors.danger, marginTop: 4 },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, marginTop: Spacing.sm, letterSpacing: 0.5 },
  skillWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  skillChip: { backgroundColor: Colors.cardElevated, borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderWidth: 1, borderColor: Colors.cardBorder },
  skillText: { ...Typography.bodySm, color: Colors.textSecondary },
  slotsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.md },
  slotChip: { backgroundColor: Colors.primary + '18', borderRadius: Radius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderWidth: 1, borderColor: Colors.primary + '44' },
  slotText: { ...Typography.bodySm, color: Colors.primary },
  slotChipBooked: { backgroundColor: Colors.cardBorder + '55', borderColor: Colors.textDisabled },
  slotTextBooked: { color: Colors.textDisabled, textDecorationLine: 'line-through' },
  slotBookedBadge: { fontSize: 9, color: Colors.textDisabled, fontWeight: '700', marginTop: 1 },
  noSlots: { ...Typography.bodySm, color: Colors.textMuted },
  scoreCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm, marginBottom: Spacing.md },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  scoreLabel: { ...Typography.bodySm, color: Colors.textMuted, width: 110, fontSize: 11 },
  barBg: { flex: 1, height: 5, backgroundColor: Colors.cardBorder, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  scoreVal: { ...Typography.caption, fontWeight: '700', width: 28, textAlign: 'right', fontFamily: 'monospace' },
  priceCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm, marginBottom: Spacing.md },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { ...Typography.bodySm, color: Colors.textMuted },
  priceVal: { ...Typography.bodySm, color: Colors.textSecondary, fontWeight: '600' },
  priceDivider: { height: 1, backgroundColor: Colors.cardBorder },
  priceTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceTotalLabel: { ...Typography.bodyMd, color: Colors.textPrimary, fontWeight: '700' },
  priceTotalVal: { ...Typography.h4, color: Colors.primary, fontWeight: '800' },
  budgetFitBox: { borderRadius: Radius.sm, padding: Spacing.sm },
  budgetFitText: { ...Typography.caption, color: Colors.textSecondary, lineHeight: 16 },
  fairnessNote: { ...Typography.caption, color: Colors.textMuted, fontStyle: 'italic', lineHeight: 16 },
  recoveryBox: { backgroundColor: Colors.warning + '11', borderRadius: Radius.sm, padding: Spacing.sm, gap: 4 },
  recoveryTitle: { ...Typography.label, color: Colors.warning },
  recoveryItem: { ...Typography.bodySm, color: Colors.textSecondary },
  cta: { marginTop: Spacing.sm, marginBottom: Spacing.sm },
});
