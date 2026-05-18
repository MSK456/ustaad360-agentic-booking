import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { Colors, Radius, Spacing, Typography } from '../theme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label, onPress, variant = 'primary', size = 'md',
  disabled = false, loading = false, style, fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.75}
      style={[
        styles.base,
        styles[variant],
        styles[`size_${size}`],
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator color={variant === 'ghost' || variant === 'outline' ? Colors.primary : Colors.textPrimary} size="small" />
        : <Text style={[styles.label, styles[`label_${variant}`], styles[`labelSize_${size}`]]}>{label}</Text>
      }
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: { borderRadius: Radius.md, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.45 },
  // Variants
  primary: { backgroundColor: Colors.primary },
  secondary: { backgroundColor: Colors.cardElevated, borderWidth: 1, borderColor: Colors.cardBorder },
  danger: { backgroundColor: Colors.danger },
  ghost: { backgroundColor: 'transparent' },
  outline: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.primary },
  // Sizes
  size_sm: { paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md },
  size_md: { paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.lg },
  size_lg: { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  // Labels
  label: { ...Typography.label },
  label_primary: { color: '#08111F', fontWeight: '700' },
  label_secondary: { color: Colors.textPrimary },
  label_danger: { color: Colors.textPrimary },
  label_ghost: { color: Colors.primary },
  label_outline: { color: Colors.primary },
  labelSize_sm: { fontSize: 12 },
  labelSize_md: { fontSize: 14 },
  labelSize_lg: { fontSize: 16 },
});
