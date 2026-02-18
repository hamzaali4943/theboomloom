import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/shared/Badge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ColorPalette } from '@/constants/appData';

type Props = {
  palette: ColorPalette;
  onPress: (palette: ColorPalette) => void;
};

export function PaletteCard({ palette, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: border, shadowColor: Colors[scheme].shadow }]}
      onPress={() => onPress(palette)}
      activeOpacity={0.85}
    >
      {/* Colour swatches */}
      <View style={styles.swatches}>
        {palette.colors.map((color, i) => (
          <View
            key={i}
            style={[
              styles.swatch,
              { backgroundColor: color },
              i === 0 && styles.swatchFirst,
              i === palette.colors.length - 1 && styles.swatchLast,
            ]}
          />
        ))}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.name} numberOfLines={1}>{palette.name}</ThemedText>
          <Badge label={palette.category} type="category" />
        </View>
        <ThemedText style={[styles.desc, { color: Colors[scheme].textSecondary }]} numberOfLines={2}>
          {palette.description}
        </ThemedText>

        {/* Hex row */}
        <View style={styles.hexRow}>
          {palette.colors.map((color, i) => (
            <View key={i} style={styles.hexItem}>
              <View style={[styles.hexDot, { backgroundColor: color }]} />
              <ThemedText style={[styles.hexText, { color: Colors[scheme].textMuted }]}>
                {color}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  swatches: {
    flexDirection: 'row',
    height: 64,
  },
  swatch: {
    flex: 1,
  },
  swatchFirst: {
    borderTopLeftRadius: 14,
  },
  swatchLast: {
    borderTopRightRadius: 14,
  },
  info: {
    padding: 14,
    gap: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  desc: {
    fontSize: 13,
    lineHeight: 19,
  },
  hexRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  hexItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hexDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  hexText: {
    fontSize: 10,
    fontFamily: 'monospace',
  },
});
