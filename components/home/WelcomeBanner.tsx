import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function WelcomeBanner() {
  const scheme = useColorScheme() ?? 'light';
  const primary = Colors[scheme].primary;

  return (
    <View style={[styles.container, { backgroundColor: primary }]}>
      <View style={[styles.decorCircle, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
      <View style={[styles.decorCircle2, { backgroundColor: 'rgba(255,255,255,0.05)' }]} />
      <ThemedText style={styles.greeting}>Welcome, designer!</ThemedText>
      <ThemedText style={styles.sub}>Pick a pattern to begin</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
});
