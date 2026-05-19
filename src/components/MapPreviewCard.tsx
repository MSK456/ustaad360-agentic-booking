import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors, Spacing, Radius, Typography } from '../theme';

interface Props {
  userArea: string;
  providerArea: string;
  distanceKm: number;
  travelTimeMin: number;
  providerName: string;
  city?: string;
}

export const MapPreviewCard: React.FC<Props> = ({
  userArea, providerArea, distanceKm, travelTimeMin, providerName, city = 'Lahore',
}) => {
  const openGoogleMaps = () => {
    const query = encodeURIComponent(`${providerArea}, ${city}, Pakistan`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="map-outline" size={16} color={Colors.primary} />
        <Text style={styles.title}>Map & ETA</Text>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Simulated</Text>
        </View>
      </View>

      {/* Map grid visualization */}
      <View style={styles.mapGrid}>
        {/* Route line */}
        <View style={styles.routeContainer}>
          <View style={styles.userMarker}>
            <Ionicons name="person" size={14} color={Colors.primary} />
          </View>
          <View style={styles.routeLine}>
            <View style={styles.routeDash} />
            <View style={styles.distanceLabel}>
              <Ionicons name="car-outline" size={11} color={Colors.textMuted} />
              <Text style={styles.distanceLabelText}>{distanceKm}km · ~{travelTimeMin} min</Text>
            </View>
          </View>
          <View style={styles.providerMarker}>
            <Ionicons name="construct" size={14} color="#08111F" />
          </View>
        </View>

        {/* Labels */}
        <View style={styles.labelRow}>
          <View style={styles.labelBox}>
            <Text style={styles.labelTitle}>Your Location</Text>
            <Text style={styles.labelSub}>{userArea}</Text>
          </View>
          <View style={[styles.labelBox, { alignItems: 'flex-end' }]}>
            <Text style={styles.labelTitle}>{providerName}</Text>
            <Text style={styles.labelSub}>{providerArea}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Ionicons name="location-outline" size={16} color={Colors.primary} />
          <Text style={styles.statVal}>{distanceKm} km</Text>
          <Text style={styles.statLbl}>Distance</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={16} color={Colors.success} />
          <Text style={styles.statVal}>{travelTimeMin} min</Text>
          <Text style={styles.statLbl}>ETA</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Ionicons name="car-outline" size={16} color={Colors.accent} />
          <Text style={styles.statVal}>{city}</Text>
          <Text style={styles.statLbl}>City</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.mapsBtn} onPress={openGoogleMaps}>
        <Ionicons name="navigate-outline" size={15} color={Colors.primary} />
        <Text style={styles.mapsBtnText}>Open Route in Google Maps</Text>
        <Ionicons name="open-outline" size={13} color={Colors.textMuted} />
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        ℹ️ Distance is simulated for demo. Production uses Google Maps Distance Matrix API.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.cardBorder,
    padding: Spacing.base, gap: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { ...Typography.label, color: Colors.textPrimary, flex: 1 },
  pill: { backgroundColor: Colors.primary + '22', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  pillText: { fontSize: 10, color: Colors.primary, fontWeight: '700' },
  mapGrid: {
    backgroundColor: Colors.inputBg, borderRadius: Radius.md,
    padding: Spacing.md, gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardBorder + '80',
  },
  routeContainer: { flexDirection: 'row', alignItems: 'center', gap: 0 },
  userMarker: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary + '22', borderWidth: 2, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  routeLine: { flex: 1, alignItems: 'center', gap: 4 },
  routeDash: { width: '100%', height: 2, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.primary + '60' },
  distanceLabel: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  distanceLabelText: { fontSize: 10, color: Colors.textMuted },
  providerMarker: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  labelBox: { gap: 1 },
  labelTitle: { fontSize: 11, color: Colors.textPrimary, fontWeight: '700' },
  labelSub: { fontSize: 10, color: Colors.textMuted },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.cardElevated,
    borderRadius: Radius.sm, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statVal: { ...Typography.bodySm, color: Colors.textPrimary, fontWeight: '700' },
  statLbl: { fontSize: 10, color: Colors.textMuted },
  statDivider: { width: 1, backgroundColor: Colors.cardBorder },
  mapsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, backgroundColor: Colors.primary + '11', borderRadius: Radius.sm,
    paddingVertical: 10, borderWidth: 1, borderColor: Colors.primary + '33',
  },
  mapsBtnText: { ...Typography.bodySm, color: Colors.primary, fontWeight: '600' },
  disclaimer: { fontSize: 10, color: Colors.textDisabled, fontStyle: 'italic', textAlign: 'center' },
});
