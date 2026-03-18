import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  icon: 'paintpalette.fill' | 'books.vertical.fill' | 'wand.and.stars' | 'rectangle.grid.2x2' | 'square.grid.3x3' | 'square.grid.2x2';
  label: string;
  description: string;
  accent: string;
  onPress: () => void;
};

export function QuickToolCard({ icon, label, description, accent, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = Colors[scheme].surface;
  const border = Colors[scheme].border;
  const shadow = Colors[scheme].shadow;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: border, shadowColor: shadow }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Coloured icon circle */}
      <View style={[styles.iconWrap, { backgroundColor: accent + '18' }]}>
        <IconSymbol name={icon} size={26} color={accent} />
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <ThemedText style={styles.label}>{label}</ThemedText>
        <ThemedText style={[styles.desc, { color: Colors[scheme].textSecondary }]} numberOfLines={1}>
          {description}
        </ThemedText>
      </View>

      {/* Arrow */}
      <View style={[styles.arrow, { backgroundColor: accent + '20' }]}>
        <IconSymbol name="chevron.right" size={16} color={accent} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
    // web-only shadow string removed for RN compatibility
    gap: 14,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  desc: {
    fontSize: 12,
    lineHeight: 16,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
