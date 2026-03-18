import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { QuickToolCard } from '@/components/home/QuickToolCard';
import { TipCard } from '@/components/home/TipCard';
import { WelcomeBanner } from '@/components/home/WelcomeBanner';
import { Header } from '@/components/shared/Header';
import { SafeScreen } from '@/components/shared/SafeScreen';
import { ThemedText } from '@/components/themed-text';
import { TEXTILE_TIPS } from '@/constants/appData';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const TOOLS = [
  {
    key: 'pattern-studio' as const,
    icon: 'wand.and.stars' as const,
    label: 'Plain, Twill & Diamond',
    description: 'Plain, twill, and diamond bars',
    accent: '#D97706',
  },
  {
    key: 'monks-belt' as const,
    icon: 'square.grid.2x2' as const,
    label: "Monk's Belt",
    description: "Monk's belt bars",
    accent: '#7C3AED',
  },
  {
    key: 'krokbragd' as const,
    icon: 'paintpalette.fill' as const,
    label: 'Krokbragd',
    description: 'Krokbragd bars',
    accent: '#0F434F',
  },
];

export function HomeScreen() {
  const router = useRouter();
  const scheme = useColorScheme() ?? 'light';
  const primary = Colors[scheme].primary;

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
        {/* Welcome */}
        <WelcomeBanner />

        {/* Quick Tools */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Quick Tools</ThemedText>
          <View style={styles.toolsRow}>
            {TOOLS.map((tool) => (
              <QuickToolCard
                key={tool.key}
                icon={tool.icon}
                label={tool.label}
                description={tool.description}
                accent={tool.accent}
                onPress={() => router.push(`/(tabs)/${tool.key}`)}
              />
            ))}
          </View>
        </View>

        {/* Today's Tip */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>{"Today's Tip"}</ThemedText>
          <TipCard tip={TEXTILE_TIPS[0]} />
        </View>

        {/* Inspiration banner */}
        <View style={[styles.inspirationCard, { backgroundColor: primary }]}>
          <ThemedText style={styles.quoteText}>
            {'"Fashion is the armor to survive the reality of everyday life."'}
          </ThemedText>
          <ThemedText style={styles.quoteAuthor}>— Bill Cunningham</ThemedText>
        </View>

        {/* More tips */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Learn More</ThemedText>
          {TEXTILE_TIPS.slice(1, 3).map((tip) => (
            <TipCard key={tip.id} tip={tip} />
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
    gap: 0,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  toolsRow: {
    flexDirection: 'column',
    gap: 10,
  },
  inspirationCard: {
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 16,
    padding: 20,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontWeight: '600',
  },
});
