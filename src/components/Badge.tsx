import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Spacing } from '../theme';

type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'primary' | 'muted';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
  dot?: boolean;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  success: { bg: 'rgba(34,197,94,0.15)', text: Colors.success },
  danger:  { bg: 'rgba(239,68,68,0.15)',  text: Colors.danger },
  warning: { bg: 'rgba(245,158,11,0.15)', text: Colors.warning },
  info:    { bg: 'rgba(59,130,246,0.15)', text: Colors.info },
  primary: { bg: 'rgba(20,184,166,0.15)', text: Colors.primary },
  muted:   { bg: 'rgba(148,163,184,0.1)', text: Colors.textMuted },
};

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style, dot = false }) => {
  const { bg, text } = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      {dot && <View style={[styles.dot, { backgroundColor: text }]} />}
      <Text style={[styles.text, { color: text }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3 },
});
