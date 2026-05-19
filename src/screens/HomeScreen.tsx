import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';
import { Badge } from '../components/Badge';
import { useAgentStore } from '../store/agentStore';
import { useAuthStore } from '../store/authStore';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const QUICK_PROMPTS = [
  { text: 'Nala band ho gaya urgent help chahiye', icon: 'water-outline', category: 'Plumber' },
  { text: 'Bijli ki problem hai aaj fix karo', icon: 'flash-outline', category: 'Electrician' },
  { text: 'AC bilkul kaam nahi kar raha urgent', icon: 'snow-outline', category: 'AC Technician' },
  { text: 'Darwaza theek karna hai kal subah', icon: 'home-outline', category: 'Carpenter' },
];

const STATS = [
  { label: 'Ustaads', value: '500+' },
  { label: 'Bookings', value: '12K+' },
  { label: 'Cities', value: '6' },
  { label: 'Avg Rating', value: '4.7★' },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [query, setQuery] = useState('');
  const { run, isLoading } = useAgentStore();
  const { user, isGuest, logout } = useAuthStore();

  const handleSearch = async (text: string) => {
    const q = text.trim();
    if (q.length < 3) return;
    await run(q, undefined, user?.city);
    navigation.navigate('IntentReview', { query: q });
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'G';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Guest';

  const handleLogout = () => { logout(); };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* App Logo Header */}
        <View style={styles.appHeader}>
          <View style={styles.logoRow}>
            <Ionicons name="construct" size={24} color={Colors.primary} />
            <Text style={styles.appName}>Ustaad<Text style={styles.appVersion}>360</Text></Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Salam, {firstName}! 👋</Text>
            <Text style={styles.subtitle}>Kya chahiye aaj?</Text>
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
                onSubmitEditing={() => handleSearch(query)}
                multiline
              />
              <TouchableOpacity
                style={[styles.searchBtn, (!query.trim() || isLoading) && styles.searchBtnDisabled]}
                onPress={() => handleSearch(query)}
                disabled={!query.trim() || isLoading}
              >
                {isLoading
                  ? <ActivityIndicator size="small" color="#08111F" />
                  : <Ionicons name="arrow-forward" size={22} color="#08111F" />}
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
              onPress={() => handleSearch(p.text)}
            >
              <Ionicons name={p.icon as any} size={20} color={Colors.primary} />
              <View style={{flex: 1}}>
                <Text style={styles.promptText}>{p.text}</Text>
                <Text style={styles.promptCategory}>{p.category}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Why Ustaad360 */}
        <Text style={styles.sectionTitle}>Why Ustaad360?</Text>
        <View style={styles.whyCard}>
          <View style={styles.whyRow}>
            <Ionicons name="language" size={20} color={Colors.primary} />
            <Text style={styles.whyText}>Understands Urdu, Roman Urdu, English & typos</Text>
          </View>
          <View style={styles.whyRow}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.whyText}>Filters by city before checking distance</Text>
          </View>
          <View style={styles.whyRow}>
            <Ionicons name="podium" size={20} color={Colors.primary} />
            <Text style={styles.whyText}>Ranks by trust, not just nearest worker</Text>
          </View>
          <View style={styles.whyRow}>
            <Ionicons name="cash" size={20} color={Colors.primary} />
            <Text style={styles.whyText}>Shows transparent fair price breakdown</Text>
          </View>
          <View style={styles.whyRow}>
            <Ionicons name="refresh-circle" size={20} color={Colors.primary} />
            <Text style={styles.whyText}>Recovers automatically from cancellations</Text>
          </View>
          <View style={styles.whyRow}>
            <Ionicons name="hardware-chip" size={20} color={Colors.primary} />
            <Text style={styles.whyText}>Logs every agent decision transparently</Text>
          </View>
        </View>

        {/* Powered by */}
        <View style={styles.powered}>
          <Ionicons name="hardware-chip-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.poweredText}>Fully offline · 10-agent AI pipeline</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.base, paddingBottom: Spacing.xxxl },
  appHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg, paddingTop: 4 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  appName: { ...Typography.h3, color: '#FFFFFF', letterSpacing: 0.5 },
  appVersion: { color: Colors.primary },
  header: { marginBottom: Spacing.lg },
  greeting: { ...Typography.h2, color: Colors.textPrimary },
  subtitle: { ...Typography.body, color: Colors.textMuted, marginTop: 4 },
  avatarCircle: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.cardElevated, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  avatarText: { color: Colors.primary, fontWeight: '800', fontSize: 16 },
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
  whyCard: {
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.cardBorder,
    gap: Spacing.md, marginBottom: Spacing.lg,
  },
  whyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  whyText: { ...Typography.bodySm, color: Colors.textSecondary, flex: 1 },
  powered: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: Spacing.sm },
  poweredText: { ...Typography.caption, color: Colors.textMuted },
});
