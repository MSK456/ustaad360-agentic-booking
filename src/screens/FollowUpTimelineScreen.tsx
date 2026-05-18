import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TIMELINE_EVENTS = [
  { id: 1, label: 'Booking Confirmed', time: '10:30 PM', date: 'May 18', icon: 'checkmark-circle', color: Colors.success, done: true },
  { id: 2, label: 'Reminder Sent', time: '9:00 AM', date: 'May 19', icon: 'notifications', color: Colors.primary, done: true },
  { id: 3, label: 'Ahmed is En Route', time: '8:50 AM', date: 'May 19', icon: 'navigate', color: Colors.primary, done: true, note: 'Arriving in ~10 min' },
  { id: 4, label: 'Work In Progress', time: '9:05 AM', date: 'May 19', icon: 'construct', color: Colors.warning, done: false },
  { id: 5, label: 'Work Completed', time: '—', date: '—', icon: 'flag', color: Colors.textDisabled, done: false },
  { id: 6, label: 'Leave a Review', time: '—', date: '—', icon: 'star', color: Colors.textDisabled, done: false },
];

export const FollowUpTimelineScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const currentStep = TIMELINE_EVENTS.findIndex((e) => !e.done);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      {/* Booking card */}
      <View style={styles.bookingCard}>
        <View style={styles.bookingRow}>
          <View>
            <Text style={styles.bookingId}>#B-U360-2847</Text>
            <Text style={styles.bookingService}>Plumber — Nala Repair</Text>
          </View>
          <Badge label="In Progress" variant="warning" dot />
        </View>
        <View style={styles.providerRow}>
          <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.providerName}>Ahmed Khan</Text>
          <Text style={styles.providerRating}>⭐ 4.8</Text>
          <Text style={styles.price}>₨1,354</Text>
        </View>
      </View>

      {/* Timeline */}
      <Text style={styles.sectionLabel}>Live Status</Text>
      <View style={styles.timeline}>
        {TIMELINE_EVENTS.map((event, idx) => {
          const isActive = idx === currentStep;
          const isDone = event.done;
          const color = isDone || isActive ? event.color : Colors.textDisabled;

          return (
            <View key={event.id} style={styles.timelineItem}>
              {/* Line + dot */}
              <View style={styles.lineCol}>
                <View style={[styles.dot, { backgroundColor: color, transform: [{ scale: isActive ? 1.3 : 1 }] }]}>
                  <Ionicons name={event.icon as any} size={10} color="#08111F" />
                </View>
                {idx < TIMELINE_EVENTS.length - 1 && (
                  <View style={[styles.line, { backgroundColor: isDone ? Colors.primary : Colors.cardBorder }]} />
                )}
              </View>

              {/* Content */}
              <View style={[styles.eventCard, isActive && styles.eventCardActive]}>
                <View style={styles.eventTop}>
                  <Text style={[styles.eventLabel, { color: isDone || isActive ? Colors.textPrimary : Colors.textDisabled }]}>
                    {event.label}
                  </Text>
                  <Text style={styles.eventTime}>{event.time} · {event.date}</Text>
                </View>
                {event.note && isActive && (
                  <Text style={styles.eventNote}>{event.note}</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* Actions */}
      <Button
        label="File a Dispute"
        onPress={() => navigation.navigate('DisputeCenter')}
        variant="outline"
        size="md"
        fullWidth
        style={styles.disputeBtn}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  bookingCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.lg,
  },
  bookingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  bookingId: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  bookingService: { ...Typography.h4, color: Colors.textPrimary, marginTop: 2 },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  providerName: { ...Typography.bodyMd, color: Colors.textSecondary, flex: 1 },
  providerRating: { ...Typography.bodySm, color: Colors.accent },
  price: { ...Typography.bodyMd, color: Colors.primary, fontWeight: '700' },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.md },
  timeline: { marginBottom: Spacing.lg },
  timelineItem: { flexDirection: 'row', gap: Spacing.md },
  lineCol: { alignItems: 'center', width: 24 },
  dot: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, marginVertical: 2 },
  eventCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.sm, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  eventCardActive: { borderColor: Colors.primary, backgroundColor: Colors.cardElevated },
  eventTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventLabel: { ...Typography.bodyMd, fontWeight: '600' },
  eventTime: { ...Typography.caption, color: Colors.textMuted },
  eventNote: { ...Typography.bodySm, color: Colors.primary, marginTop: 4 },
  disputeBtn: { marginTop: Spacing.sm },
});
