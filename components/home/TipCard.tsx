import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/shared/Badge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Tip } from '@/constants/appData';

type Props = {
  tip: Tip;
};

export function TipCard({ tip }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');

  return (
    <View style={[styles.card, { backgroundColor: surface, borderColor: border, shadowColor: Colors[scheme].shadow }]}>
      <View style={styles.top}>
        <ThemedText style={styles.emoji}>{tip.emoji}</ThemedText>
        <View style={styles.meta}>
          <Badge label={tip.category} variant="primary" />
          <ThemedText style={[styles.readTime, { color: Colors[scheme].textMuted }]}>
            {tip.readTime} read
          </ThemedText>
        </View>
      </View>
      <ThemedText style={styles.title}>{tip.title}</ThemedText>
      <ThemedText style={[styles.content, { color: Colors[scheme].textSecondary }]} numberOfLines={3}>
        {tip.content}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    boxShadow: '0 2px 8px rgba(79,70,229,0.06)',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    gap: 12,
  },
  emoji: {
    fontSize: 20,
  },
  meta: {
    flex: 1,
    gap: 6,
  },
  readTime: {
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 21,
  },
});
