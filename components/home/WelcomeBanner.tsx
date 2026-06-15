import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function WelcomeBanner() {
  const scheme = useColorScheme() ?? 'light';
  const brandBlue = Colors[scheme].info;
  console.log("Brand Blue:", brandBlue);

  return (
    <View style={[styles.container, { backgroundColor: brandBlue }]}>
      <ThemedText style={styles.greeting}>Welcome, designer!</ThemedText>
      <ThemedText style={styles.sub}>Pick a pattern to begin</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 24,
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
