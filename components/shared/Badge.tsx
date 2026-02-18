import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral' | 'info';

const VARIANT_COLORS: Record<Variant, { bg: string; text: string }> = {
  primary: { bg: '#EEF2FF', text: '#4F46E5' },
  secondary: { bg: '#FEF3C7', text: '#D97706' },
  success: { bg: '#D1FAE5', text: '#065F46' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  error: { bg: '#FEE2E2', text: '#991B1B' },
  neutral: { bg: '#F3F4F6', text: '#374151' },
  info: { bg: '#DBEAFE', text: '#1E40AF' },
};

const DIFFICULTY_MAP: Record<string, Variant> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

const CATEGORY_MAP: Record<string, Variant> = {
  natural: 'success',
  synthetic: 'info',
  blended: 'primary',
  technical: 'neutral',
  warm: 'secondary',
  cool: 'info',
  earthy: 'success',
  seasonal: 'primary',
  neutral: 'neutral',
  geometric: 'primary',
  floral: 'error',
  abstract: 'warning',
  traditional: 'neutral',
  modern: 'info',
};

type Props = {
  label: string;
  variant?: Variant;
  type?: 'difficulty' | 'category';
  style?: ViewStyle;
  dark?: boolean;
};

export function Badge({ label, variant, type, style, dark = false }: Props) {
  let resolved: Variant = variant ?? 'neutral';
  if (type === 'difficulty') resolved = DIFFICULTY_MAP[label.toLowerCase()] ?? 'neutral';
  if (type === 'category') resolved = CATEGORY_MAP[label.toLowerCase()] ?? 'neutral';

  const colors = dark
    ? { bg: 'rgba(255,255,255,0.15)', text: '#FFFFFF' }
    : VARIANT_COLORS[resolved];

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
