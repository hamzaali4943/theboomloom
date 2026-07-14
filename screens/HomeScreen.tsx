import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { HowTosSection } from '@/components/home/HowTosSection';
import { InstructionsModal } from '@/components/home/InstructionsModal';
import { PatternGridCard } from '@/components/home/PatternGridCard';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { Header } from '@/components/shared/Header';
import { SafeScreen } from '@/components/shared/SafeScreen';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TOOLS = [
  {
    key: 'plain' as const,
    letter: 'P',
    icon: require('@/assets/images/plainweave.png'),
    label: 'plain weave',
    description: 'classic over-under pattern',
    accent: '#D97706',
    bg: '#FFFFFF', // white
  },
  {
    key: 'twill' as const,
    letter: 'T',
    icon: require('@/assets/images/22twill.png'),
    label: '2/2 twill',
    description: 'diagonal rib',
    accent: '#B45309',
    bg: '#FF3130', // red
  },
  {
    key: 'diamond' as const,
    letter: 'D',
    icon: require('@/assets/images/diamond.png'),
    label: 'diamond',
    description: 'diamond twill',
    accent: '#9BA2DD',
    bg: '#C7C3F5', // lavender
  },
  {
    key: 'monks-belt' as const,
    letter: 'M',
    icon: require('@/assets/images/monksbelt.png'),
    label: "monk's belt",
    description: "grid of floats on plain weave",
    accent: '#7C3AED',
    bg: '#B0B0B0', // grey
  },
  {
    key: 'krokbragd' as const,
    letter: 'K',
    icon: require('@/assets/images/krokbragd.png'),
    label: 'krokbragd',
    description: 'Scandinavian rug weave',
    accent: '#0F434F',
    bg: '#BFF747', // lime green
  },
  {
    key: 'saved' as const,
    letter: 'S',
    icon: undefined,
    label: 'saved',
    description: 'your saved designs',
    accent: '#0F434F',
    bg: '#F5F5F5', // off-white
  },
];

export function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const surface = Colors[scheme].surface;
  const border = Colors[scheme].border;
  const shadow = Colors[scheme].shadow;
  const textSecondary = Colors[scheme].textSecondary;
  const accent = Colors[scheme].info;

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

        {/* New-here? → opens the in-app instructions */}
        <Pressable
          style={[styles.helpBtn, { backgroundColor: surface, borderColor: border, shadowColor: shadow }]}
          onPress={() => setInstructionsOpen(true)}
          android_ripple={{ color: accent + '22' }}
        >
          <View style={[styles.helpIcon, { backgroundColor: accent + '18' }]}>
            <IconSymbol name="info.circle" size={22} color={accent} />
          </View>
          <View style={styles.helpText}>
            <ThemedText style={styles.helpTitle}>how weaving works</ThemedText>
            <ThemedText style={[styles.helpDesc, { color: textSecondary }]} numberOfLines={1}>
              New here? A quick tour of the studio
            </ThemedText>
          </View>
          <View style={[styles.helpArrow, { backgroundColor: accent + '20' }]}>
            <IconSymbol name="chevron.right" size={16} color={accent} />
          </View>
        </Pressable>

        <View style={styles.grid}>
          {TOOLS.map((tool) => (
            <PatternGridCard
              key={tool.key}
              letter={tool.letter}
              icon={tool.icon}
              iconBg={tool.bg}
              label={tool.label}
              accent={tool.accent}
              onPress={() => router.push(`/(tabs)/${tool.key}`)}
            />
          ))}
        </View>
        <HowTosSection />
      </ScrollView>

      <InstructionsModal
        visible={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 12,
    rowGap: 12,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  helpIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  helpText: {
    flex: 1,
    gap: 2,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  helpDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  helpArrow: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
