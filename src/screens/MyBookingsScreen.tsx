import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { useBookingStore } from '../store/bookingStore';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export const MyBookingsScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { bookings } = useBookingStore();
  const [filter, setFilter] = useState<'active' | 'past' | 'disputed'>('active');

  const filteredBookings = bookings.filter(b => {
    if (filter === 'active') return !['completed', 'cancelled', 'disputed'].includes(b.status);
    if (filter === 'past') return ['completed', 'cancelled'].includes(b.status);
    if (filter === 'disputed') return b.status === 'disputed';
    return true;
  });

  const getStatusVariant = (status: string): 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'muted' => {
    switch (status) {
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'disputed': return 'warning';
      case 'in_progress':
      case 'provider_assigned':
      case 'en_route': return 'primary';
      default: return 'muted';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterTabs}>
        {(['active', 'past', 'disputed'] as const).map(tab => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, filter === tab && styles.tabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[styles.tabText, filter === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filteredBookings.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="receipt-outline" size={48} color={Colors.border} />
            <Text style={styles.emptyText}>No {filter} bookings found.</Text>
            {filter !== 'active' && (
              <Button 
                label="Find a Provider" 
                onPress={() => navigation.navigate('MainTabs' as any)}
                style={{ marginTop: Spacing.md }}
              />
            )}
          </View>
        ) : (
          filteredBookings.map(b => (
            <View key={b.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.serviceType}>{b.serviceCategory.replace('_', ' ').toUpperCase()}</Text>
                  <Text style={styles.bookingId}>#{b.id}</Text>
                </View>
                <Badge label={getStatusLabel(b.status)} variant={getStatusVariant(b.status)} />
              </View>

              <View style={styles.divider} />

              <View style={styles.cardBody}>
                <View style={styles.row}>
                  <Ionicons name="time-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.rowText}>{new Date(b.scheduledAt).toLocaleString()}</Text>
                </View>
                <View style={styles.row}>
                  <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.rowText} numberOfLines={1}>{b.address}</Text>
                </View>
                <View style={styles.row}>
                  <Ionicons name="cash-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.rowText}>₨{b.quotedPrice} (Budget: ₨{b.userBudget})</Text>
                </View>
              </View>

              <View style={styles.actions}>
                {['pending', 'confirmed', 'provider_assigned', 'en_route', 'in_progress', 'feedback_pending'].includes(b.status) && (
                  <Button 
                    label="Track / Update" 
                    variant="primary" 
                    size="sm" 
                    fullWidth
                    onPress={() => navigation.navigate('FollowUpTimeline', { bookingId: b.id })}
                  />
                )}
                {b.status === 'completed' && (
                  <Button 
                    label="Rebook Provider" 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    onPress={() => navigation.navigate('ProviderDetail', { providerId: b.providerId })}
                  />
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingTop: 50,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.cardElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: { padding: Spacing.xs },
  headerTitle: { ...Typography.h3, color: Colors.textPrimary },
  filterTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.cardElevated,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { ...Typography.bodyMd, color: Colors.textMuted, fontWeight: '500' },
  tabTextActive: { color: Colors.primary, fontWeight: 'bold' },
  list: { flex: 1 },
  listContent: { padding: Spacing.md, gap: Spacing.md },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { ...Typography.body, color: Colors.textMuted, marginTop: Spacing.md },
  card: {
    backgroundColor: Colors.cardElevated,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  serviceType: { ...Typography.bodyMd, fontWeight: 'bold', color: Colors.textPrimary },
  bookingId: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm },
  cardBody: { gap: Spacing.sm, marginBottom: Spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  rowText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1 },
  actions: { flexDirection: 'row', gap: Spacing.sm },
});
