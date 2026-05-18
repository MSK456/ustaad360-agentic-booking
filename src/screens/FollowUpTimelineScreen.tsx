import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/types';
import { useAgentStore } from '../store/agentStore';
import { FollowUpEvent } from '../types/agent';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Static fallback timeline
const FALLBACK: FollowUpEvent[] = [
  { step:1, label:'Booking Confirmed',    time:'10:30 PM', date:'Today',    status:'done',   icon:'checkmark-circle', color:Colors.success, note:'ID: B-U360-DEMO' },
  { step:2, label:'Reminder Scheduled',   time:'9:00 AM',  date:'Tomorrow', status:'done',   icon:'notifications',    color:Colors.primary },
  { step:3, label:'Provider Assigned',    time:'8:50 AM',  date:'Tomorrow', status:'active', icon:'navigate',         color:Colors.primary, note:'Arriving in ~10 min' },
  { step:4, label:'Service In Progress',  time:'9:10 AM',  date:'Tomorrow', status:'pending',icon:'construct',        color:Colors.warning },
  { step:5, label:'Work Completed',       time:'—',        date:'—',        status:'pending',icon:'flag',             color:Colors.textDisabled },
  { step:6, label:'Completion Checklist', time:'—',        date:'—',        status:'pending',icon:'clipboard',        color:Colors.textDisabled },
  { step:7, label:'Feedback Collected',   time:'—',        date:'—',        status:'pending',icon:'star',             color:Colors.textDisabled },
  { step:8, label:'Reputation Updated',   time:'—',        date:'—',        status:'pending',icon:'trending-up',      color:Colors.textDisabled },
];

export const FollowUpTimelineScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { result } = useAgentStore();

  const timeline = (result?.followUpTimeline?.length ?? 0) > 0
    ? result!.followUpTimeline
    : FALLBACK;

  const booking = result?.booking;
  const provider = result?.selectedProvider?.provider;
  const price    = result?.pricing?.finalEstimate ?? 1354;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Booking card */}
      <View style={styles.bookingCard}>
        <View style={styles.bookingRow}>
          <View>
            <Text style={styles.bookingId}>#{booking?.bookingId ?? 'B-U360-DEMO'}</Text>
            <Text style={styles.bookingService}>
              {provider?.serviceCategories[0]?.replace('_', ' ') ?? 'Plumber'} — Repair Service
            </Text>
          </View>
          <Badge label="In Progress" variant="warning" dot />
        </View>
        <View style={styles.providerRow}>
          <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.providerName}>{provider?.name ?? 'Ahmed Khan'}</Text>
          <Text style={styles.rating}>⭐ {provider?.rating.toFixed(1) ?? '4.8'}</Text>
          <Text style={styles.price}>₨{price.toLocaleString()}</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Live Lifecycle Status</Text>

      {/* Timeline */}
      <View style={styles.timeline}>
        {timeline.map((event, idx) => {
          const isDone   = event.status === 'done';
          const isActive = event.status === 'active';
          const dotColor = isDone ? event.color : isActive ? event.color : Colors.cardBorder;

          return (
            <View key={event.step} style={styles.timelineItem}>
              <View style={styles.lineCol}>
                <View style={[styles.dot, { backgroundColor: dotColor, transform: [{ scale: isActive ? 1.25 : 1 }] }]}>
                  <Ionicons name={event.icon as any} size={10} color={isDone || isActive ? '#08111F' : Colors.textDisabled} />
                </View>
                {idx < timeline.length - 1 && (
                  <View style={[styles.line, { backgroundColor: isDone ? Colors.primary : Colors.cardBorder }]} />
                )}
              </View>
              <View style={[styles.eventCard, isActive && styles.eventCardActive]}>
                <View style={styles.eventTop}>
                  <View style={styles.eventLeft}>
                    <Text style={[styles.eventLabel, { color: isDone || isActive ? Colors.textPrimary : Colors.textDisabled }]}>
                      {event.label}
                    </Text>
                    {event.note && isActive && (
                      <Text style={styles.eventNote}>{event.note}</Text>
                    )}
                  </View>
                  <View style={styles.eventRight}>
                    <Text style={styles.eventTime}>{event.time}</Text>
                    <Text style={styles.eventDate}>{event.date}</Text>
                  </View>
                </View>
                {isDone && <View style={styles.doneBar} />}
              </View>
            </View>
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button label="View Agent Trace" variant="outline" size="md" fullWidth
          onPress={() => (navigation as any).navigate('MainTabs', { screen: 'AgentTrace' })} />
        <Button label="File a Dispute" variant="ghost" size="md" fullWidth
          onPress={() => navigation.navigate('DisputeCenter')} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  bookingCard: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.lg },
  bookingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  bookingId: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  bookingService: { ...Typography.h4, color: Colors.textPrimary, marginTop: 2 },
  providerRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  providerName: { ...Typography.bodyMd, color: Colors.textSecondary, flex: 1 },
  rating: { ...Typography.bodySm, color: Colors.accent },
  price: { ...Typography.bodyMd, color: Colors.primary, fontWeight: '700' },
  sectionLabel: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.md, letterSpacing: 0.5 },
  timeline: { marginBottom: Spacing.lg },
  timelineItem: { flexDirection: 'row', gap: Spacing.md, marginBottom: 2 },
  lineCol: { alignItems: 'center', width: 26 },
  dot: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  line: { width: 2, flex: 1, marginVertical: 2, minHeight: 16 },
  eventCard: { flex: 1, backgroundColor: Colors.card, borderRadius: Radius.md, padding: Spacing.sm, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.cardBorder },
  eventCardActive: { borderColor: Colors.primary, backgroundColor: Colors.cardElevated },
  eventTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eventLeft: { flex: 1 },
  eventLabel: { ...Typography.bodyMd, fontWeight: '600' },
  eventNote: { ...Typography.bodySm, color: Colors.primary, marginTop: 3 },
  eventRight: { alignItems: 'flex-end' },
  eventTime: { ...Typography.caption, color: Colors.textMuted, fontFamily: 'monospace' },
  eventDate: { ...Typography.caption, color: Colors.textDisabled },
  doneBar: { height: 1, backgroundColor: Colors.success + '33', marginTop: Spacing.xs },
  actions: { gap: Spacing.sm },
});
