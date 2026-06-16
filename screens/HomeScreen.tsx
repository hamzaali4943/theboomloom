import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { HowTosSection } from '@/components/home/HowTosSection';
import { QuickToolCard } from '@/components/home/QuickToolCard';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { Header } from '@/components/shared/Header';
import { SafeScreen } from '@/components/shared/SafeScreen';

const TOOLS = [
  {
    key: 'plain' as const,
    letter: 'P',
    label: 'plain weave',
    description: 'classic over-under pattern',
    accent: '#D97706',
  },
  {
    key: 'twill' as const,
    letter: 'T',
    icon: require('@/assets/images/22twill.png'),
    label: '2/2 twill',
    description: 'diagonal rib',
    accent: '#B45309',
  },
  {
    key: 'diamond' as const,
    letter: 'D',
    icon: require('@/assets/images/diamond.png'),
    label: 'diamond',
    description: 'diamond twill',
    accent: '#9BA2DD',
  },
  {
    key: 'monks-belt' as const,
    letter: 'M',
    icon: require('@/assets/images/monksbelt.png'),
    label: "monk's belt",
    description: "grid of floats on plain weave",
    accent: '#7C3AED',
  },
  {
    key: 'krokbragd' as const,
    letter: 'K',
    icon: require('@/assets/images/krokbragd.png'),
    label: 'krokbragd',
    description: 'Scandinavian rug weave',
    accent: '#0F434F',
  },
];

export function HomeScreen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <Header
        title="BoomLoom"
        subtitle="design studio"
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
              icon={tool.icon}
              label={tool.label}
              description={tool.description}
              accent={tool.accent}
              onPress={() => router.push(`/(tabs)/${tool.key}`)}
            />
          ))}
        </View>
        <HowTosSection />
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
