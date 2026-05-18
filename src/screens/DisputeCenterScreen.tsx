import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { MOCK_DISPUTE } from '../data/mockData';

const REASONS = ['Quality Issue', 'Provider No-Show', 'Overcharged', 'Late Arrival', 'Safety Concern'];

export const DisputeCenterScreen: React.FC = () => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => setSubmitted(true);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerCard}>
        <Ionicons name="shield-outline" size={28} color={Colors.primary} />
        <Text style={styles.headerTitle}>Dispute Center</Text>
        <Text style={styles.headerSub}>
          Our AI mediator will review your case and provide a fair resolution within 24 hours.
        </Text>
      </View>

      {/* Existing resolved dispute */}
      <Text style={styles.sectionLabel}>Past Dispute</Text>
      <View style={styles.resolvedCard}>
        <View style={styles.resolvedTop}>
          <Text style={styles.resolvedId}>Booking #{MOCK_DISPUTE.bookingId}</Text>
          <Badge label="Resolved" variant="success" />
        </View>
        <Text style={styles.resolvedReason}>{MOCK_DISPUTE.reason}</Text>
        <View style={styles.resolutionBox}>
          <Text style={styles.resolutionLabel}>🤖 Agent Decision</Text>
          <Text style={styles.resolutionText}>{MOCK_DISPUTE.agentDecision}</Text>
        </View>
        <View style={styles.resolutionBox}>
          <Text style={styles.resolutionLabel}>✅ Resolution</Text>
          <Text style={styles.resolutionText}>{MOCK_DISPUTE.resolution}</Text>
        </View>
      </View>

      {/* New dispute form */}
      <Text style={styles.sectionLabel}>File a New Dispute</Text>
      {submitted ? (
        <View style={styles.successBox}>
          <Ionicons name="checkmark-circle" size={40} color={Colors.success} />
          <Text style={styles.successText}>Dispute Submitted</Text>
          <Text style={styles.successSub}>
            Our AI mediator will analyze your case and respond within 24 hours.
          </Text>
          <Badge label="Case ID: D-002" variant="primary" />
        </View>
      ) : (
        <>
          <Text style={styles.inputLabel}>Select Reason</Text>
          <View style={styles.reasonGrid}>
            {REASONS.map((r) => (
              <TouchableOpacity
                key={r}
                style={[styles.reasonChip, selectedReason === r && styles.reasonChipActive]}
                onPress={() => setSelectedReason(r)}
              >
                <Text style={[styles.reasonText, selectedReason === r && { color: Colors.primary }]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.inputLabel}>Describe the Issue</Text>
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

          <Button
            label="Submit Dispute"
            onPress={handleSubmit}
            variant="danger"
            size="lg"
            fullWidth
            disabled={!selectedReason}
            style={styles.submitBtn}
          />
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  headerCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder,
    alignItems: 'center', gap: Spacing.sm, marginBottom: Spacing.lg,
  },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  headerSub: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  resolvedCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, gap: Spacing.sm, marginBottom: Spacing.lg,
  },
  resolvedTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resolvedId: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  resolvedReason: { ...Typography.bodyMd, color: Colors.textPrimary },
  resolutionBox: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.sm, padding: Spacing.sm, gap: 4,
  },
  resolutionLabel: { ...Typography.caption, color: Colors.primary, fontWeight: '700' },
  resolutionText: { ...Typography.bodySm, color: Colors.textSecondary, lineHeight: 18 },
  inputLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  reasonGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.md },
  reasonChip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    backgroundColor: Colors.card, borderRadius: Radius.full,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  reasonChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '11' },
  reasonText: { ...Typography.bodySm, color: Colors.textMuted },
  textArea: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.cardBorder, color: Colors.textPrimary,
    padding: Spacing.md, ...Typography.body, minHeight: 100, marginBottom: Spacing.md,
  },
  submitBtn: {},
  successBox: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.md,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  successText: { ...Typography.h3, color: Colors.textPrimary },
  successSub: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
});
