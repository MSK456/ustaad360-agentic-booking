import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radius, Shadow, Spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, elevated = false, noPadding = false }) => (
  <View style={[
    styles.card,
    elevated ? styles.elevated : styles.base,
    noPadding ? styles.noPad : styles.withPad,
    style,
  ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadow.md,
  },
  base: { backgroundColor: Colors.card },
  elevated: { backgroundColor: Colors.cardElevated },
  withPad: { padding: Spacing.base },
  noPad: {},
});
