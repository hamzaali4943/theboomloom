import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { SearchBar } from '@/components/shared/SearchBar';
import { CategoryFilter } from '@/components/shared/CategoryFilter';
import { FabricCard } from '@/components/fabric-library/FabricCard';
import { InfoModal } from '@/components/modals/InfoModal';
import { Badge } from '@/components/shared/Badge';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FABRICS, type Fabric, type FabricCategory } from '@/constants/appData';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'natural', label: 'Natural' },
  { key: 'synthetic', label: 'Synthetic' },
  { key: 'blended', label: 'Blended' },
  { key: 'technical', label: 'Technical' },
];

function InfoRow({ label, value, scheme }: { label: string; value: string; scheme: 'light' | 'dark' }) {
  return (
    <View style={[infoStyles.row, { borderColor: Colors[scheme].border }]}>
      <ThemedText style={[infoStyles.label, { color: Colors[scheme].textSecondary }]}>{label}</ThemedText>
      <ThemedText style={infoStyles.value}>{value}</ThemedText>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    paddingVertical: 9,
    borderBottomWidth: 1,
    gap: 8,
  },
  label: { width: 90, fontSize: 13, flexShrink: 0 },
  value: { flex: 1, fontSize: 13, fontWeight: '600' },
});

export function FabricLibraryScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<FabricCategory>('all');
  const [selected, setSelected] = useState<Fabric | null>(null);

  const filtered = useMemo(() => {
    return FABRICS.filter((f) => {
      const matchCat = category === 'all' || f.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || f.name.toLowerCase().includes(q) || f.fiber.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [search, category]);

  return (
    <SafeScreen>
      <Header
        title="Fabric Explorer"
        subtitle={`${FABRICS.length} fabrics in library`}
        rightIcon="info.circle"
        onRightPress={() => {}}
      />
      <SearchBar value={search} onChangeText={setSearch} placeholder="Search fabrics…" />
      <CategoryFilter
        categories={CATEGORIES}
        selected={category}
        onSelect={(k) => setCategory(k as FabricCategory)}
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText style={styles.emptyEmoji}>🧵</ThemedText>
            <ThemedText style={[styles.emptyText, { color: Colors[scheme].textSecondary }]}>
              No fabrics found for "{search}"
            </ThemedText>
          </View>
        ) : (
          filtered.map((fabric) => (
            <FabricCard key={fabric.id} fabric={fabric} onPress={setSelected} />
          ))
        )}
      </ScrollView>

      {/* Fabric Detail Modal */}
      <InfoModal
        visible={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ''}
        emoji={selected?.emoji}
      >
        {selected && (
          <View style={styles.modalContent}>
            <View style={styles.badgesRow}>
              <Badge label={selected.category} type="category" />
              <Badge label={selected.difficulty} type="difficulty" />
            </View>

            <ThemedText style={[styles.desc, { color: Colors[scheme].textSecondary }]}>
              {selected.description}
            </ThemedText>

            <ThemedText style={styles.subheading}>Fabric Details</ThemedText>
            <InfoRow label="Fiber" value={selected.fiber} scheme={scheme} />
            <InfoRow label="Weave" value={selected.weave} scheme={scheme} />
            <InfoRow label="Weight" value={selected.weight} scheme={scheme} />

            <ThemedText style={[styles.subheading, { marginTop: 14 }]}>Properties</ThemedText>
            <View style={styles.tags}>
              {selected.properties.map((p) => (
                <Badge key={p} label={p} variant="primary" />
              ))}
            </View>

            <ThemedText style={[styles.subheading, { marginTop: 14 }]}>Care Instructions</ThemedText>
            <View style={styles.tags}>
              {selected.care.map((c) => (
                <Badge key={c} label={c} variant="info" />
              ))}
            </View>

            <ThemedText style={[styles.subheading, { marginTop: 14 }]}>Common Uses</ThemedText>
            <View style={styles.tags}>
              {selected.uses.map((u) => (
                <Badge key={u} label={u} variant="neutral" />
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
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: 15, textAlign: 'center' },
  modalContent: { gap: 10 },
  badgesRow: { flexDirection: 'row', gap: 8 },
  desc: { fontSize: 14, lineHeight: 21 },
  subheading: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
