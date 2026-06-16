import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

type Props = {
  letter: string;
  icon?: ImageSourcePropType;
  label: string;
  description: string;
  accent: string;
  onPress: () => void;
};

export function QuickToolCard({ letter, icon, label, description, accent, onPress }: Props) {
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
      {/* Icon badge — image when provided, otherwise the letter */}
      <View style={[styles.imageWrap, { backgroundColor: accent + '18' }]}>
        {icon ? (
          <Image source={icon} style={styles.iconImage} resizeMode="contain" />
        ) : (
          <Text style={[styles.letter, { color: accent }]}>{letter}</Text>
        )}
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
    gap: 14,
  },
  imageWrap: {
    width: 72,
    height: 72,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconImage: {
    width: 60,
    height: 48,
  },
  letter: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -1,
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
