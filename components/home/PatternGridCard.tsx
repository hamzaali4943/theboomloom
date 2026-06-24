import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  letter: string;
  icon?: ImageSourcePropType;
  iconBg?: string;
  label: string;
  accent: string;
  onPress: () => void;
};

/**
 * Compact square tile for the home grid: a colored icon panel on top with the
 * (black) logo, and the pattern name underneath. Sized to fit 3 per row.
 */
export function PatternGridCard({ letter, icon, iconBg, label, accent, onPress }: Props) {
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
      {/* Colored icon panel — fills the tile edge-to-edge */}
      <View style={[styles.iconPanel, { backgroundColor: iconBg ?? accent + '18' }]}>
        {icon ? (
          <Image source={icon} style={styles.iconImage} resizeMode="contain" />
        ) : (
          <Text style={[styles.letter, { color: accent }]}>{letter}</Text>
        )}
      </View>

      {/* Hairline between logo and label */}
      <View style={[styles.divider, { backgroundColor: border }]} />

      {/* Label — stretches full width */}
      <View style={styles.labelWrap}>
        <ThemedText style={styles.label} numberOfLines={1}>
          {label}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexBasis: '30%',
    maxWidth: '32%',
    flexGrow: 1,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  iconPanel: {
    width: '100%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
    opacity: 0.5,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  letter: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  labelWrap: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
