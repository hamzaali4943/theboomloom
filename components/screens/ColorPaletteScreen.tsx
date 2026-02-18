import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { SearchBar } from '@/components/shared/SearchBar';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import { PaletteCard } from '@/components/color-palette/PaletteCard';
import { InfoModal } from '@/components/modals/InfoModal';
import { Badge } from '@/components/shared/Badge';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { COLOR_PALETTES, type ColorPalette, type PaletteCategory } from '@/constants/appData';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'warm', label: 'Warm' },
  { key: 'cool', label: 'Cool' },
  { key: 'earthy', label: 'Earthy' },
  { key: 'seasonal', label: 'Seasonal' },
  { key: 'neutral', label: 'Neutral' },
];

export function ColorPaletteScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PaletteCategory>('all');
  const [selected, setSelected] = useState<ColorPalette | null>(null);

  const filtered = useMemo(() => {
    return COLOR_PALETTES.filter((p) => {
      const matchCat = category === 'all' || p.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q));
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <SafeScreen>
      <Header
        title="Color Palette Studio"
        subtitle={`${COLOR_PALETTES.length} curated palettes`}
        rightIcon="info.circle"
        onRightPress={() => {}}
      />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search palettes…" />
      <CategoryFilter
        categories={CATEGORIES}
        selected={category}
        onSelect={(k) => setCategory(k as PaletteCategory)}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyEmoji}>🎨</ThemedText>
            <ThemedText style={[styles.emptyText, { color: Colors[scheme].textSecondary }]}>
              No palettes found for "{search}"
            </ThemedText>
          </View>
        ) : (
          filtered.map((palette) => (
            <PaletteCard key={palette.id} palette={palette} onPress={setSelected} />
          ))
        )}
      </ScrollView>

      {/* Palette Detail Modal */}
      <InfoModal
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        emoji="🎨"
      >
        {selected && (
          <View style={styles.modalContent}>
            {/* Large swatches */}
            <View style={styles.modalSwatches}>
              {selected.colors.map((color, i) => (
                <View key={i} style={[styles.modalSwatch, { backgroundColor: color }]}>
                  <ThemedText style={styles.modalHex}>{color}</ThemedText>
                </View>
              ))}
            </View>

            <View style={styles.modalRow}>
              <Badge label={selected.category} type="category" />
            </View>

            <ThemedText style={[styles.modalDesc, { color: Colors[scheme].textSecondary }]}>
              {selected.description}
            </ThemedText>

            <View style={styles.modalDivider} />

            <ThemedText style={styles.modalSubheading}>Tags</ThemedText>
            <View style={styles.tagsRow}>
              {selected.tags.map((tag) => (
                <Badge key={tag} label={tag} variant="neutral" />
              ))}
            </View>

            <ThemedText style={[styles.modalSubheading, { marginTop: 16 }]}>Hex Codes</ThemedText>
            <View style={styles.hexList}>
              {selected.colors.map((color, i) => (
                <View key={i} style={[styles.hexRow, { borderColor: Colors[scheme].border }]}>
                  <View style={[styles.hexDot, { backgroundColor: color }]} />
                  <ThemedText style={[styles.hexValue, { color: Colors[scheme].textSecondary }]}>
                    Swatch {i + 1}
                  </ThemedText>
                  <ThemedText style={[styles.hexCode, { color: Colors[scheme].text }]}>
                    {color}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        )}
      </InfoModal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingTop: 8, paddingBottom: 40 },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  modalContent: { gap: 10 },
  modalSwatches: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 4,
  },
  modalSwatch: {
    flex: 1,
    height: 72,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  modalHex: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
  },
  modalRow: { flexDirection: 'row' },
  modalDesc: { fontSize: 14, lineHeight: 21 },
  modalDivider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 8 },
  modalSubheading: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  hexList: { gap: 6 },
  hexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  hexDot: { width: 18, height: 18, borderRadius: 9 },
  hexValue: { flex: 1, fontSize: 13 },
  hexCode: { fontSize: 13, fontWeight: '600', fontFamily: 'monospace' },
});
