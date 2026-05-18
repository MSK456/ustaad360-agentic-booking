import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useAgentStore } from '../store/agentStore';
import { runDisputeAgent, DisputeType } from '../agents/DisputeAgent';

const DISPUTE_TYPES: { id: DisputeType; label: string; icon: string; description: string }[] = [
  { id: 'price_dispute',     label: 'Price Dispute',      icon: 'cash-outline',       description: 'Final price different from quote' },
  { id: 'no_show',           label: 'Provider No-Show',   icon: 'person-remove-outline', description: 'Provider did not arrive' },
  { id: 'quality_complaint', label: 'Quality Complaint',  icon: 'star-half-outline',  description: 'Work quality was unsatisfactory' },
  { id: 'cancellation',      label: 'Cancellation',       icon: 'close-circle-outline', description: 'Cancelled booking refund request' },
];

export const DisputeCenterScreen: React.FC = () => {
  const [selectedType, setSelectedType] = useState<DisputeType | null>(null);
  const [description, setDescription]   = useState('');
  const [result, setResult]             = useState<ReturnType<typeof runDisputeAgent> | null>(null);

  const { result: storeResult } = useAgentStore();
  const booking  = storeResult?.booking;
  const provider = storeResult?.selectedProvider?.provider;
  const price    = storeResult?.pricing?.finalEstimate ?? 1354;

  const handleSubmit = () => {
    if (!selectedType) return;
    const res = runDisputeAgent({
      bookingId:   booking?.bookingId ?? 'B-U360-DEMO',
      type:        selectedType,
      description: description || 'User submitted dispute',
      finalPrice:  price,
    });
    setResult(res);
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="shield-outline" size={28} color={Colors.primary} />
        <Text style={styles.headerTitle}>Dispute Center</Text>
        <Text style={styles.headerSub}>
          Our AI mediator evaluates disputes fairly using booking data, payment records, and provider history.
        </Text>
      </View>

      {/* Booking context */}
      {booking && (
        <View style={styles.contextCard}>
          <Text style={styles.sectionLabel}>BOOKING CONTEXT</Text>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Booking ID</Text>
            <Text style={styles.contextVal}>{booking.bookingId}</Text>
          </View>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Provider</Text>
            <Text style={styles.contextVal}>{provider?.name ?? 'Unknown'}</Text>
          </View>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Amount Paid</Text>
            <Text style={styles.contextVal}>₨{price.toLocaleString()}</Text>
          </View>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Scheduled</Text>
            <Text style={styles.contextVal}>{booking.scheduledAt}</Text>
          </View>
        </View>
      )}

      {/* Result view */}
      {result ? (
        <View style={styles.resultOuter}>
          <View style={styles.resultHeader}>
            <Ionicons name="hardware-chip-outline" size={18} color={Colors.primary} />
            <Text style={styles.resultTitle}>DisputeAgent Decision</Text>
            <Badge label="Evaluated" variant="success" />
          </View>

          <View style={styles.resultBox}>
            <Text style={styles.resultDecision}>{result.decision}</Text>
          </View>

          <View style={styles.infoCard}>
            {[
              { label: 'Resolution',   value: result.resolution },
              result.compensation ? { label: 'Compensation', value: result.compensation } : null,
              result.providerAction ? { label: 'Provider Action', value: result.providerAction } : null,
            ].filter(Boolean).map((row, i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{row!.label}</Text>
                <Text style={styles.infoVal}>{row!.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tracePreview}>
            <Ionicons name="git-branch-outline" size={13} color={Colors.primary} />
            <Text style={styles.traceText}>Trace: {result.trace.decision}</Text>
          </View>

          <Button label="File Another Dispute" variant="outline" size="md" fullWidth
            onPress={() => { setResult(null); setSelectedType(null); setDescription(''); }} />
        </View>
      ) : (
        <>
          {/* Dispute type */}
          <Text style={styles.sectionLabel}>SELECT DISPUTE TYPE</Text>
          <View style={styles.typeGrid}>
            {DISPUTE_TYPES.map(dt => (
              <TouchableOpacity
                key={dt.id}
                style={[styles.typeCard, selectedType === dt.id && styles.typeCardActive]}
                onPress={() => setSelectedType(dt.id)}
              >
                <Ionicons name={dt.icon as any} size={22}
                  color={selectedType === dt.id ? Colors.primary : Colors.textMuted} />
                <Text style={[styles.typeLabel, selectedType === dt.id && { color: Colors.primary }]}>
                  {dt.label}
                </Text>
                <Text style={styles.typeDesc}>{dt.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionLabel}>DESCRIBE THE ISSUE</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what happened in detail..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          {/* What happens next */}
          <View style={styles.infoCard}>
            <Text style={styles.sectionLabel}>WHAT HAPPENS NEXT</Text>
            {[
              '🤖 AI mediator evaluates booking data and provider history',
              '⚖️ Fair decision made based on dispute policy',
              '💰 Refund/compensation issued automatically if applicable',
              '⚠️ Provider warned or escalated if needed',
              '👤 Human agent assigned if AI cannot resolve',
            ].map((step, i) => (
              <Text key={i} style={styles.stepText}>{step}</Text>
            ))}
          </View>

          <Button label="Submit Dispute to AI Mediator"
            onPress={handleSubmit} variant="danger" size="lg" fullWidth
            disabled={!selectedType} style={styles.submitBtn} />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  headerCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, alignItems: 'center', gap: Spacing.sm },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  headerSub: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center', lineHeight: 18 },
  contextCard: { backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  contextRow: { flexDirection: 'row', justifyContent: 'space-between' },
  contextLabel: { ...Typography.bodySm, color: Colors.textMuted },
  contextVal: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '600', fontFamily: 'monospace' },
  sectionLabel: { ...Typography.caption, color: Colors.textMuted, fontWeight: '700', letterSpacing: 1 },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  typeCard: { width: '47%', backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, alignItems: 'center', gap: 6 },
  typeCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  typeLabel: { ...Typography.bodyMd, color: Colors.textSecondary, fontWeight: '700', textAlign: 'center' },
  typeDesc: { ...Typography.caption, color: Colors.textMuted, textAlign: 'center', lineHeight: 15 },
  textArea: { backgroundColor: Colors.inputBg, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.cardBorder, color: Colors.textPrimary, padding: Spacing.md, ...Typography.body, minHeight: 100 },
  infoCard: { backgroundColor: Colors.cardElevated, borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm },
  infoRow: { gap: 4 },
  infoLabel: { ...Typography.caption, color: Colors.primary, fontWeight: '700', letterSpacing: 0.5 },
  infoVal: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 18 },
  stepText: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 20 },
  submitBtn: {},
  resultOuter: { gap: Spacing.md },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  resultTitle: { ...Typography.h4, color: Colors.textPrimary, flex: 1 },
  resultBox: { backgroundColor: Colors.success + '15', borderRadius: Radius.md, padding: Spacing.md, borderWidth: 1, borderColor: Colors.success + '44' },
  resultDecision: { ...Typography.bodyMd, color: Colors.success, fontWeight: '700' },
  tracePreview: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.card, borderRadius: Radius.sm, padding: Spacing.sm },
  traceText: { ...Typography.caption, color: Colors.textMuted, flex: 1 },
});
