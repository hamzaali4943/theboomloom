import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { QuickToolCard } from '@/components/home/QuickToolCard';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { Header } from '@/components/shared/Header';
import { SafeScreen } from '@/components/shared/SafeScreen';

const TOOLS = [
  {
    key: 'plain' as const,
    letter: 'P',
    label: 'Plain Weave',
    description: 'Classic over-under pattern',
    accent: '#D97706',
  },
  {
    key: 'twill' as const,
    letter: 'T',
    label: '2/2 Twill',
    description: 'Diagonal weave pattern',
    accent: '#B45309',
  },
  {
    key: 'diamond' as const,
    letter: 'D',
    label: 'Diamond',
    description: 'Diamond weave pattern',
    accent: '#9BA2DD',
  },
  {
    key: 'monks-belt' as const,
    letter: 'M',
    label: "Monk's Belt",
    description: "Monk's belt bars",
    accent: '#7C3AED',
  },
  {
    key: 'krokbragd' as const,
    letter: 'K',
    label: 'Krokbragd',
    description: 'Krokbragd bars',
    accent: '#0F434F',
  },
];

export function HomeScreen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <Header
        title="BoomLoom"
        subtitle="Textile Design Studio"
      />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <WelcomeBanner />
        <View style={styles.toolsRow}>
          {TOOLS.map((tool) => (
            <QuickToolCard
              key={tool.key}
              letter={tool.letter}
              label={tool.label}
              description={tool.description}
              accent={tool.accent}
              onPress={() => router.push(`/(tabs)/${tool.key}`)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 70,
    paddingHorizontal: 20,
    gap: 10,
  },
  toolsRow: {
    flexDirection: 'column',
    gap: 10,
  },
});
