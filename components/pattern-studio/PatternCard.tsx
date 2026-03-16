import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/shared/Badge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Pattern } from '@/constants/appData';

type Props = {
  pattern: Pattern;
  onPress: (pattern: Pattern) => void;
};

export function PatternCard({ pattern, onPress }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: surface, borderColor: border, shadowColor: Colors[scheme].shadow }]}
      onPress={() => onPress(pattern)}
      activeOpacity={0.85}
    >
      {/* Color preview blocks */}
      <View style={styles.preview}>
        {pattern.colors.slice(0, 4).map((color, i) => (
          <View key={i} style={[styles.block, { backgroundColor: color }]} />
        ))}
      </View>

      {/* Emoji overlay */}
      <View style={[styles.emojiWrap, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
        <ThemedText style={styles.emoji}>{pattern.emoji}</ThemedText>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <ThemedText style={styles.name} numberOfLines={1}>{pattern.name}</ThemedText>
        <ThemedText style={[styles.origin, { color: Colors[scheme].textSecondary }]} numberOfLines={1}>
          {pattern.origin}
        </ThemedText>
        <View style={styles.badges}>
          <Badge label={pattern.category} type="category" />
          <Badge label={pattern.difficulty} type="difficulty" />
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    boxShadow: '0 3px 10px rgba(79,70,229,0.08)',
    flex: 1,
  },
  preview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    height: 90,
  },
  block: {
    width: '50%',
    height: '50%',
  },
  emojiWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  info: {
    padding: 12,
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
  },
  origin: {
    fontSize: 11,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
});
