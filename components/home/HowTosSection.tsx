import React, { useCallback } from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type HowTo = {
  key: string;
  emoji: string;
  title: string;
  description: string;
  url: string;
  accent: string;
};

// The how-to resource on theboomloom.com
const HOW_TOS: HowTo[] = [
  {
    key: 'videos',
    emoji: '▶',
    title: 'videos & instructions',
    description: 'Setup videos, make-it projects, and printable step-by-step guides',
    url: 'https://www.theboomloom.com/boomloom-boss-videos',
    accent: '#ff3130',
  },
];

// The shop resource on theboomloom.com
const SHOP: HowTo[] = [
  {
    key: 'shop',
    emoji: '🛒',
    title: 'shop',
    description: 'Browse looms, pattern bars, and starter kits',
    url: 'https://www.theboomloom.com/shop',
    accent: '#708df4',
  },
];

export function HowTosSection() {
  const scheme = useColorScheme() ?? 'light';
  const surface = Colors[scheme].surface;
  const border = Colors[scheme].border;
  const shadow = Colors[scheme].shadow;
  const textSecondary = Colors[scheme].textSecondary;

  const openUrl = useCallback((url: string) => {
    Linking.openURL(url).catch(() => {
      /* If the link can't be opened, fail silently */
    });
  }, []);

  const renderCard = (item: HowTo) => (
    <TouchableOpacity
      key={item.key}
      style={[styles.card, { backgroundColor: surface, borderColor: border, shadowColor: shadow }]}
      onPress={() => openUrl(item.url)}
      activeOpacity={0.85}
    >
      {/* Icon badge */}
      <View style={[styles.iconWrap, { backgroundColor: item.accent + '18' }]}>
        <Text style={[styles.icon, { color: item.accent }]}>{item.emoji}</Text>
      </View>

      {/* Text */}
      <View style={styles.textBlock}>
        <ThemedText style={styles.label}>{item.title}</ThemedText>
        <ThemedText style={[styles.desc, { color: textSecondary }]} numberOfLines={2}>
          {item.description}
        </ThemedText>
      </View>

      {/* External-link arrow */}
      <View style={[styles.arrow, { backgroundColor: item.accent + '20' }]}>
        <IconSymbol name="chevron.right" size={16} color={item.accent} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* how-to's */}
      <View style={styles.wrap}>
        <View style={styles.heading}>
          <ThemedText style={styles.sectionTitle}>how-to&apos;s</ThemedText>
        </View>
        {HOW_TOS.map(renderCard)}
      </View>

      {/* shop */}
      <View style={styles.wrap}>
        <View style={styles.heading}>
          <ThemedText style={styles.sectionTitle}>shop</ThemedText>
        </View>
        {SHOP.map(renderCard)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 18,
    marginTop: 6,
  },
  wrap: {
    gap: 10,
  },
  heading: {
    marginBottom: 2,
    paddingHorizontal: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
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
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  icon: {
    fontSize: 26,
    fontWeight: '800',
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
