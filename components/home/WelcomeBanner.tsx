import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const STATS = [
  { value: '12', label: 'Lessons' },
  { value: '8', label: 'Palettes' },
  { value: '45', label: 'Day Streak' },
];

export function WelcomeBanner() {
  const scheme = useColorScheme() ?? 'light';
  const primary = Colors[scheme].primary;
  const secondary = Colors[scheme].secondary;

  return (
    <View style={[styles.container, { backgroundColor: primary }]}>
      {/* Decorative circle */}
      <View style={[styles.decorCircle, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[styles.decorCircle2, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />

      <ThemedText style={styles.greeting}>Hello, Designer 👋</ThemedText>
      <ThemedText style={styles.sub}>Ready to create something beautiful today?</ThemedText>

      {/* Stats row */}
      <View style={styles.statsRow}>
        {STATS.map((s, i) => (
          <React.Fragment key={s.label}>
            <View style={styles.statItem}>
              <ThemedText style={[styles.statValue, { color: secondary }]}>{s.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{s.label}</ThemedText>
            </View>
            {i < STATS.length - 1 && (
              <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  decorCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    right: -30,
    top: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    right: 40,
    bottom: -20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  sub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 36,
  },
});
