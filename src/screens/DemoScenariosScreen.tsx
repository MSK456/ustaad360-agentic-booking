import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';

import { RootStackParamList } from '../navigation/types';
import { Colors, Spacing, Radius, Typography } from '../theme';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SCENARIOS = [
  {
    id: '1', title: 'Successful Booking',
    description: 'Roman Urdu → plumber → ranked → priced → confirmed',
    query: 'yaar nala band ho gaya urgent help chahiye 1500 se kam mein',
    outcome: 'success', icon: 'checkmark-circle-outline',
  },
  {
    id: '2', title: 'Budget Mismatch Failure',
    description: 'AC gas refill quoted at ₨1,800 vs ₨500 budget',
    query: '500 rupay mein AC gas bharwa do abhi',
    outcome: 'failure', icon: 'close-circle-outline',
  },
  {
    id: '3', title: 'Urdu Script Input',
    description: 'Pure Urdu text — language detected and normalized',
    query: 'مجھے ابھی ایک پلمبر چاہیے، نالہ بند ہے',
    outcome: 'success', icon: 'language-outline',
  },
  {
    id: '4', title: 'Ambiguous Request',
    description: 'Vague input triggers clarification dialog',
    query: 'kuch theek karna hai ghar mein',
    outcome: 'clarify', icon: 'help-circle-outline',
  },
];

const outcomeColors = {
  success: Colors.success,
  failure: Colors.danger,
  clarify: Colors.warning,
};

export const DemoScenariosScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.headerCard}>
        <Ionicons name="play-circle-outline" size={28} color={Colors.primary} />
        <Text style={styles.title}>Demo Scenarios</Text>
        <Text style={styles.subtitle}>Tap any scenario to walk through the full agent pipeline</Text>
      </View>

      {SCENARIOS.map((s) => {
        const color = outcomeColors[s.outcome as keyof typeof outcomeColors];
        return (
          <TouchableOpacity
            key={s.id}
            style={styles.card}
            onPress={() => navigation.navigate('IntentReview', { query: s.query })}
            activeOpacity={0.8}
          >
            <View style={[styles.iconBox, { backgroundColor: color + '18' }]}>
              <Ionicons name={s.icon as any} size={26} color={color} />
            </View>
            <View style={styles.info}>
              <Text style={styles.cardTitle}>{s.title}</Text>
              <Text style={styles.cardDesc}>{s.description}</Text>
              <View style={styles.queryBox}>
                <Text style={styles.queryText}>"{s.query}"</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        );
      })}
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
  title: { ...Typography.h3, color: Colors.textPrimary },
  subtitle: { ...Typography.bodySm, color: Colors.textMuted, textAlign: 'center' },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.card, borderRadius: Radius.lg,
    padding: Spacing.base, borderWidth: 1, borderColor: Colors.cardBorder, marginBottom: Spacing.md,
  },
  iconBox: { width: 52, height: 52, borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  cardTitle: { ...Typography.h4, color: Colors.textPrimary, marginBottom: 4 },
  cardDesc: { ...Typography.bodySm, color: Colors.textMuted, marginBottom: Spacing.sm },
  queryBox: { backgroundColor: Colors.inputBg, borderRadius: Radius.sm, padding: Spacing.xs },
  queryText: { ...Typography.caption, color: Colors.textSecondary, fontStyle: 'italic' },
});
