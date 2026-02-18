import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/shared/Badge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Fabric } from '@/constants/appData';

type Props = {
  fabric: Fabric;
  onPress: (fabric: Fabric) => void;
};

export function FabricCard({ fabric, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: border, shadowColor: Colors[scheme].shadow }]}
      onPress={() => onPress(fabric)}
      activeOpacity={0.85}
    >
      {/* Emoji avatar */}
      <View style={[styles.avatar, { backgroundColor: fabric.color + '18' }]}>
        <ThemedText style={styles.emoji}>{fabric.emoji}</ThemedText>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.topRow}>
          <ThemedText style={styles.name}>{fabric.name}</ThemedText>
          <Badge label={fabric.difficulty} type="difficulty" />
        </View>

        <ThemedText style={[styles.fiber, { color: Colors[scheme].textSecondary }]}>
          {fabric.fiber} · {fabric.weight}
        </ThemedText>

        {/* Property chips */}
        <View style={styles.chips}>
          {fabric.properties.slice(0, 3).map((prop) => (
            <View key={prop} style={[styles.chip, { backgroundColor: fabric.color + '15', borderColor: fabric.color + '30' }]}>
              <ThemedText style={[styles.chipText, { color: fabric.color }]}>{prop}</ThemedText>
            </View>
          ))}
        </View>
      </View>

      {/* Category badge */}
      <Badge label={fabric.category} type="category" style={styles.catBadge} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 26,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  topRow: {
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
  fiber: {
    fontSize: 12,
    lineHeight: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
  },
  catBadge: {
    alignSelf: 'flex-start',
    marginTop: 2,
  },
});
