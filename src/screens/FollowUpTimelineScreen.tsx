import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { RootStackParamList } from '../navigation/types';
import { useAgentStore } from '../store/agentStore';
import { useBookingStore } from '../store/bookingStore';
import { FollowUpEvent } from '../types/agent';
import { BookingStatus } from '../types/index';

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, 'FollowUpTimeline'>;

export const FollowUpTimelineScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { bookingId } = route.params;

  const { result } = useAgentStore();
  const { getBookingById, updateBookingStatus } = useBookingStore();

  const storeBooking = getBookingById(bookingId);
  const provider = result?.rankedProviders?.find(r => r.provider.id === storeBooking?.providerId)?.provider ?? result?.selectedProvider?.provider;
  const price = storeBooking?.quotedPrice ?? result?.pricing?.finalEstimate ?? 1354;

  const currentStatus = storeBooking?.status ?? 'pending';

  const statuses: BookingStatus[] = [
    'pending', 'confirmed', 'provider_assigned', 'en_route', 'in_progress', 'completed', 'feedback_pending', 'feedback_collected'
  ];

  const currentIndex = statuses.indexOf(currentStatus as any) >= 0 ? statuses.indexOf(currentStatus as any) : 0;

  const generateTimeline = (): FollowUpEvent[] => {
    return [
      { step:1, label:'Booking Confirmed', time:'10:30 PM', date:'Today', status: currentIndex >= 1 ? 'done' : currentIndex === 0 ? 'active' : 'pending', icon:'checkmark-circle', color:Colors.success, note:`ID: ${bookingId}` },
      { step:2, label:'Provider Assigned', time:'8:50 AM', date:'Tomorrow', status: currentIndex >= 2 ? 'done' : currentIndex === 1 ? 'active' : 'pending', icon:'person', color:Colors.primary, note: currentIndex === 1 ? 'Assigning provider...' : undefined },
      { step:3, label:'En Route', time:'9:00 AM', date:'Tomorrow', status: currentIndex >= 3 ? 'done' : currentIndex === 2 ? 'active' : 'pending', icon:'navigate', color:Colors.primary, note: currentIndex === 2 ? 'Arriving in ~10 min' : undefined },
      { step:4, label:'Service In Progress', time:'9:10 AM', date:'Tomorrow', status: currentIndex >= 4 ? 'done' : currentIndex === 3 ? 'active' : 'pending', icon:'construct', color:Colors.warning },
      { step:5, label:'Work Completed', time: currentIndex >= 5 ? '10:00 AM' : '—', date: currentIndex >= 5 ? 'Tomorrow' : '—', status: currentIndex >= 5 ? 'done' : currentIndex === 4 ? 'active' : 'pending', icon:'flag', color:Colors.success },
      { step:6, label:'Feedback Collected', time: currentIndex >= 7 ? '10:05 AM' : '—', date: currentIndex >= 7 ? 'Tomorrow' : '—', status: currentIndex >= 7 ? 'done' : currentIndex >= 5 ? 'active' : 'pending', icon:'star', color:Colors.warning },
      { step:7, label:'Reputation Updated', time: currentIndex >= 7 ? '10:05 AM' : '—', date: currentIndex >= 7 ? 'Tomorrow' : '—', status: currentIndex >= 7 ? 'done' : currentIndex >= 7 ? 'active' : 'pending', icon:'trending-up', color:Colors.primary },
    ];
  };

  const timeline = generateTimeline();

  const handleNextStep = () => {
    if (currentIndex < statuses.length - 1) {
      updateBookingStatus(bookingId, statuses[currentIndex + 1]);
    }
  };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

      {/* Booking card */}
      <View style={styles.bookingCard}>
        <View style={styles.bookingRow}>
          <View>
            <Text style={styles.bookingId}>#{bookingId}</Text>
            <Text style={styles.bookingService}>
              {storeBooking?.serviceCategory.replace('_', ' ') ?? 'Service'}
            </Text>
          </View>
          <Badge label={currentStatus.replace('_', ' ').toUpperCase()} variant={currentStatus === 'completed' ? 'success' : 'warning'} dot />
        </View>
        <View style={styles.providerRow}>
          <Ionicons name="person-circle-outline" size={20} color={Colors.primary} />
          <Text style={styles.providerName}>{provider?.name ?? 'Ustaad360 Provider'}</Text>
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
        {currentIndex < statuses.length - 1 && (
          <Button label="Progress Status (Demo)" variant="primary" size="md" fullWidth
            onPress={handleNextStep} style={{ marginBottom: Spacing.sm }} />
        )}
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
