/**
 * SavedDesignsScreen — lists all designs saved by the user.
 *
 * Features:
 *  - Reloads from AsyncStorage every time the screen gains focus
 *    (so designs saved from pattern screens are always visible)
 *  - "Load" button: schedules the design in DesignLoadContext, then
 *    navigates to the correct pattern tab. That tab's useFocusEffect
 *    picks it up and restores the state.
 *  - "Delete" button: removes with an Alert confirmation.
 *  - Empty state when no designs exist yet.
 */

import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Header } from '@/components/shared/Header';
import { SafeScreen } from '@/components/shared/SafeScreen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDesignLoad } from '@/context/DesignLoadContext';
import { useSavedDesigns } from '@/hooks/useSavedDesigns';
import { DESIGNS_PER_PATTERN_LIMIT } from '@/utils/saveDesign';
import type { PatternType, SavedDesign } from '@/types/saved-design';

// Canonical display order for pattern sections
const PATTERN_ORDER: PatternType[] = ['plain', 'twill', 'diamond', 'monks-belt', 'krokbragd'];

// Maps each patternType to its tab route path
const TAB_PATH: Record<PatternType, string> = {
  plain: '/(tabs)/plain',
  twill: '/(tabs)/twill',
  diamond: '/(tabs)/diamond',
  'monks-belt': '/(tabs)/monks-belt',
  krokbragd: '/(tabs)/krokbragd',
};

// Accent colour per pattern — same as HomeScreen TOOLS array
const PATTERN_ACCENT: Record<PatternType, string> = {
  plain: '#D97706',
  twill: '#B45309',
  diamond: '#9BA2DD',
  'monks-belt': '#7C3AED',
  krokbragd: '#0F434F',
};

const PATTERN_LABEL: Record<PatternType, string> = {
  plain: 'Plain Weave',
  twill: '2/2 Twill',
  diamond: 'Diamond',
  'monks-belt': "Monk's Belt",
  krokbragd: 'Krokbragd',
};

function formatDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function SavedDesignsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const router = useRouter();
  const { scheduleLoad } = useDesignLoad();
  const { designs, loading, reload, deleteDesign } = useSavedDesigns();

  // Refresh list whenever the tab gains focus
  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  const handleLoad = useCallback(
    (design: SavedDesign) => {
      // 1. Put the snapshot into context
      scheduleLoad({ patternType: design.patternType, snapshot: design.snapshot });
      // 2. Navigate to the correct pattern tab
      router.push(TAB_PATH[design.patternType] as never);
    },
    [scheduleLoad, router],
  );

  const handleDelete = useCallback(
    (design: SavedDesign) => {
      Alert.alert(
        'Delete Design',
        `Remove "${design.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => deleteDesign(design.id),
          },
        ],
      );
    },
    [deleteDesign],
  );

  return (
    <SafeScreen>
      <Header title="saved" subtitle="Your designs" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {loading ? (
          <ActivityIndicator style={styles.loader} color={Colors[scheme].primary} />
        ) : designs.length === 0 ? (
          <View style={styles.emptyBox}>
            <ThemedText style={styles.emptyTitle}>No saved designs yet</ThemedText>
            <ThemedText style={[styles.emptyHint, { color: Colors[scheme].textSecondary }]}>
              Tap Save Design on any pattern screen to save your work here.
            </ThemedText>
          </View>
        ) : (
          PATTERN_ORDER
            .map((type) => ({ type, items: designs.filter((d) => d.patternType === type) }))
            .filter((g) => g.items.length > 0)
            .map(({ type, items }) => {
              const accent = PATTERN_ACCENT[type];
              const atLimit = items.length >= DESIGNS_PER_PATTERN_LIMIT;
              return (
                <View key={type}>
                  {/* Section header: pattern label + slot counter */}
                  <View style={styles.sectionHeader}>
                    <ThemedText style={[styles.sectionLabel, { color: accent }]}>
                      {PATTERN_LABEL[type]}
                    </ThemedText>
                    <View style={[
                      styles.slotPill,
                      { backgroundColor: atLimit ? '#FEE2E2' : accent + '18' },
                    ]}>
                      <ThemedText style={[
                        styles.slotText,
                        { color: atLimit ? '#DC2626' : accent },
                      ]}>
                        {items.length} / {DESIGNS_PER_PATTERN_LIMIT}
                        {atLimit ? '  ·  Delete to save more' : ''}
                      </ThemedText>
                    </View>
                  </View>

                  {/* Cards for this pattern */}
                  {items.map((design) => (
                    <View
                      key={design.id}
                      style={[styles.card, { backgroundColor: Colors[scheme].surface }]}
                    >
                      <ThemedText style={styles.designName}>{design.name}</ThemedText>
                      <ThemedText style={[styles.designDate, { color: Colors[scheme].textSecondary }]}>
                        Saved {formatDate(design.savedAt)}
                      </ThemedText>
                      <View style={styles.cardActions}>
                        <Pressable
                          onPress={() => handleLoad(design)}
                          style={[styles.cardBtn, { borderColor: accent }]}
                        >
                          <ThemedText style={[styles.cardBtnText, { color: accent }]}>load</ThemedText>
                        </Pressable>
                        <Pressable
                          onPress={() => handleDelete(design)}
                          style={styles.deleteBtn}
                        >
                          <ThemedText style={styles.deleteBtnText}>delete</ThemedText>
                        </Pressable>
                      </View>
                    </View>
                  ))}
                </View>
              );
            })
        )}
      </ScrollView>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 70,
    gap: 12,
  },
  loader: {
    marginTop: 60,
  },
  emptyBox: {
    marginTop: 60,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  slotPill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  slotText: {
    fontSize: 12,
    fontWeight: '600',
  },
  card: {
    borderRadius: 14,
    padding: 16,
    gap: 6,
    marginBottom: 12,
  },
  designName: {
    fontSize: 16,
    fontWeight: '700',
  },
  designDate: {
    fontSize: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cardBtn: {
    flex: 1,
    height: 38,
    borderRadius: 8,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBtnText: {
    fontSize: 14,
    fontWeight: '700',
  },
  deleteBtn: {
    height: 38,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
