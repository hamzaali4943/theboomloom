import { Platform } from 'react-native';

// ─── Brand palette ────────────────────────────────────────────────────────────
const PRIMARY = '#4F46E5';
const PRIMARY_DARK = '#3730A3';
const PRIMARY_LIGHT = '#818CF8';
const SECONDARY = '#F59E0B';
const SECONDARY_DARK = '#D97706';

// ─── Colors ───────────────────────────────────────────────────────────────────
export const Colors = {
  light: {
    text: '#1E1B4B',
    textSecondary: '#6B7280',
    textMuted: '#9CA3AF',
    background: '#F5F4FF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    primary: PRIMARY,
    primaryDark: PRIMARY_DARK,
    primaryLight: PRIMARY_LIGHT,
    secondary: SECONDARY,
    secondaryDark: SECONDARY_DARK,
    border: '#E5E7EB',
    divider: '#F3F4F6',
    tint: PRIMARY,
    icon: '#6B7280',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: PRIMARY,
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    shadow: '#4F46E5',
  },
  dark: {
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    background: '#0D0C1D',
    surface: '#1A1830',
    card: '#1A1830',
    primary: PRIMARY_LIGHT,
    primaryDark: PRIMARY,
    primaryLight: '#C7D2FE',
    secondary: SECONDARY,
    secondaryDark: SECONDARY_DARK,
    border: '#2D2B4E',
    divider: '#1E1C36',
    tint: PRIMARY_LIGHT,
    icon: '#9CA3AF',
    tabIconDefault: '#6B7280',
    tabIconSelected: PRIMARY_LIGHT,
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA',
    shadow: '#000000',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// ─── Border radii ─────────────────────────────────────────────────────────────
export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
