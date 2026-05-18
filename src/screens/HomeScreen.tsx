import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_PROMPTS = [
  { text: 'Nala band ho gaya', icon: 'water-outline', category: 'Plumber' },
  { text: 'Bijli ki problem hai', icon: 'flash-outline', category: 'Electrician' },
  { text: 'AC theek karo urgent', icon: 'snow-outline', category: 'AC Technician' },
  { text: 'Darwaza theek karna hai', icon: 'home-outline', category: 'Carpenter' },
];

const STATS = [
  { label: 'Ustaadn', value: '500+' },
  { label: 'Bookings', value: '12K+' },
  { label: 'Cities', value: '6' },
  { label: 'Avg Rating', value: '4.7★' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim().length > 2) {
      navigation.navigate('IntentReview', { query: query.trim() });
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salam! 👋</Text>
            <Text style={styles.subtitle}>Kya chahiye aaj?</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>U</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          {STATS.map((s) => (
            <View key={s.label} style={styles.statBox}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Search bar */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.searchCard}>
            <Text style={styles.searchTitle}>Request karo apni zuban mein</Text>
            <Text style={styles.searchHint}>
              Urdu, Roman Urdu, English — kuch bhi likhein
            </Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="e.g. nala band ho gaya urgent..."
                placeholderTextColor={Colors.textMuted}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                multiline
              />
              <TouchableOpacity
                style={[styles.searchBtn, !query.trim() && styles.searchBtnDisabled]}
                onPress={handleSearch}
                disabled={!query.trim()}
              >
                <Ionicons name="arrow-forward" size={22} color="#08111F" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>

        {/* Quick prompts */}
        <Text style={styles.sectionTitle}>Quick Requests</Text>
        <View style={styles.promptGrid}>
          {QUICK_PROMPTS.map((p) => (
            <TouchableOpacity
              key={p.text}
              style={styles.promptChip}
              onPress={() => navigation.navigate('IntentReview', { query: p.text })}
            >
              <Ionicons name={p.icon as any} size={20} color={Colors.primary} />
              <View>
                <Text style={styles.promptText}>{p.text}</Text>
                <Text style={styles.promptCategory}>{p.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nav shortcuts */}
        <Text style={styles.sectionTitle}>Explore Features</Text>
        <View style={styles.featureGrid}>
          {[
            { label: 'My Bookings', icon: 'calendar-outline', screen: 'FollowUpTimeline', params: { bookingId: 'B-U360-2847' } },
            { label: 'Find Providers', icon: 'search-outline', screen: 'ProviderList', params: undefined },
            { label: 'Dispute Center', icon: 'shield-outline', screen: 'DisputeCenter', params: undefined },
          ].map((f) => (
            <TouchableOpacity
              key={f.label}
              style={styles.featureCard}
              onPress={() => navigation.navigate(f.screen as any, f.params as any)}
            >
              <Ionicons name={f.icon as any} size={24} color={Colors.primary} />
              <Text style={styles.featureLabel}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Powered by */}
        <View style={styles.powered}>
          <Ionicons name="hardware-chip-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.poweredText}>Powered by Google Gemini AI</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  greeting: { ...Typography.h3, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 2 },
  avatarCircle: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#08111F', fontWeight: '800', fontSize: 18 },
  statsRow: {
    flexDirection: 'row', backgroundColor: Colors.card,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.cardBorder,
    marginBottom: Spacing.lg, justifyContent: 'space-around',
  },
  statBox: { alignItems: 'center' },
  statValue: { ...Typography.h4, color: Colors.primary },
  statLabel: { ...Typography.caption, color: Colors.textMuted, marginTop: 2 },
  searchCard: {
    backgroundColor: Colors.cardElevated,
    borderRadius: Radius.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.primary + '44',
    marginBottom: Spacing.lg,
  },
  searchTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  searchHint: { ...Typography.bodySm, color: Colors.textMuted, marginBottom: Spacing.md },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-end' },
  input: {
    flex: 1, backgroundColor: Colors.inputBg,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.cardBorder,
    color: Colors.textPrimary, padding: Spacing.md,
    ...Typography.body, minHeight: 52, maxHeight: 100,
  },
  searchBtn: {
    width: 52, height: 52, borderRadius: Radius.md,
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  searchBtnDisabled: { backgroundColor: Colors.textDisabled },
  sectionTitle: { ...Typography.label, color: Colors.textMuted, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  promptGrid: { gap: Spacing.sm, marginBottom: Spacing.lg },
  promptChip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder,
  },
  promptText: { ...Typography.bodyMd, color: Colors.textPrimary },
  promptCategory: { ...Typography.caption, color: Colors.primary, marginTop: 2 },
  featureGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  featureCard: {
    flex: 1, backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.md, alignItems: 'center', gap: Spacing.sm,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  featureLabel: { ...Typography.bodySm, color: Colors.textSecondary, textAlign: 'center' },
  powered: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing.lg },
  poweredText: { ...Typography.caption, color: Colors.textMuted },
});
