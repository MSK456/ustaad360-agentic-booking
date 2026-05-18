import { TextStyle } from 'react-native';

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  base: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
} as const;

export const FontWeight: Record<string, TextStyle['fontWeight']> = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export const Typography = {
  h1: { fontSize: FontSize.xxxl, fontWeight: FontWeight.bold, letterSpacing: -0.5 } as TextStyle,
  h2: { fontSize: FontSize.xxl, fontWeight: FontWeight.bold, letterSpacing: -0.3 } as TextStyle,
  h3: { fontSize: FontSize.xl, fontWeight: FontWeight.semibold } as TextStyle,
  h4: { fontSize: FontSize.lg, fontWeight: FontWeight.semibold } as TextStyle,
  body: { fontSize: FontSize.base, fontWeight: FontWeight.regular } as TextStyle,
  bodyMd: { fontSize: FontSize.md, fontWeight: FontWeight.regular } as TextStyle,
  bodySm: { fontSize: FontSize.sm, fontWeight: FontWeight.regular } as TextStyle,
  caption: { fontSize: FontSize.xs, fontWeight: FontWeight.regular } as TextStyle,
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, letterSpacing: 0.5 } as TextStyle,
  mono: { fontSize: FontSize.sm, fontFamily: 'monospace' } as TextStyle,
} as const;
