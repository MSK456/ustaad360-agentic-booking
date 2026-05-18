export const Colors = {
  // Backgrounds
  background: '#08111F',
  card: '#111827',
  cardElevated: '#172033',
  cardBorder: '#1E2D45',

  // Brand
  primary: '#14B8A6',       // teal
  primaryDark: '#0D9488',
  primaryLight: '#2DD4BF',
  accent: '#F59E0B',        // amber

  // Status
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Text
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textDisabled: '#475569',

  // Misc
  border: '#1E2D45',
  overlay: 'rgba(8, 17, 31, 0.85)',
  inputBg: '#0F1C2E',
  tabBar: '#0C1624',
  tabBarBorder: '#1A2A3E',

  // Score ring colors
  scoreHigh: '#22C55E',
  scoreMid: '#F59E0B',
  scoreLow: '#EF4444',
} as const;

export type ColorKey = keyof typeof Colors;
