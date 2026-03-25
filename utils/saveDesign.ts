/**
 * saveDesign — standalone async utility used by each pattern screen's
 * "Save Design" button.
 *
 * Why a plain function instead of a hook?
 * The pattern screens only need to trigger a save — they don't need to
 * subscribe to the full saved-designs list. A plain async function keeps
 * the screen hooks lean and avoids 5 extra useState subscriptions.
 *
 * Flow:
 *  1. Reads current designs from AsyncStorage (always fresh from disk)
 *  2. Counts how many designs of this patternType already exist → auto-names
 *  3. Prepends the new design and writes back to AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PatternType, DesignSnapshot, SavedDesign } from '@/types/saved-design';

export const DESIGNS_STORAGE_KEY = '@boomloom_designs';
export const DESIGNS_PER_PATTERN_LIMIT = 5;

const PATTERN_LABELS: Record<PatternType, string> = {
  plain: 'Plain Weave',
  twill: '2/2 Twill',
  diamond: 'Diamond',
  'monks-belt': "Monk's Belt",
  krokbragd: 'Krokbragd',
};

export async function saveDesign(
  patternType: PatternType,
  snapshot: DesignSnapshot,
): Promise<SavedDesign> {
  // Always read fresh from disk so auto-numbering is accurate even across screens
  const raw = await AsyncStorage.getItem(DESIGNS_STORAGE_KEY);
  const existing: SavedDesign[] = raw ? JSON.parse(raw) : [];

  const count = existing.filter((d) => d.patternType === patternType).length;

  if (count >= DESIGNS_PER_PATTERN_LIMIT) {
    throw new Error(
      `You can save up to ${DESIGNS_PER_PATTERN_LIMIT} ${PATTERN_LABELS[patternType]} designs. Delete one to save a new design.`,
    );
  }
  const newDesign: SavedDesign = {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: `${PATTERN_LABELS[patternType]} #${count + 1}`,
    patternType,
    savedAt: Date.now(),
    snapshot,
  };

  // Newest design at the top of the list
  const updatedList = [newDesign, ...existing];
  await AsyncStorage.setItem(DESIGNS_STORAGE_KEY, JSON.stringify(updatedList));

  console.log('──────────────────────────────────────────');
  console.log('[saveDesign] Design saved successfully');
  console.log('  Name       :', newDesign.name);
  console.log('  ID         :', newDesign.id);
  console.log('  Pattern    :', newDesign.patternType);
  console.log('  Saved at   :', new Date(newDesign.savedAt).toLocaleString());
  console.log('  Snapshot   :', JSON.stringify(newDesign.snapshot, null, 2));
  console.log('  Total saved (this type):', updatedList.filter(d => d.patternType === patternType).length, '/', DESIGNS_PER_PATTERN_LIMIT);
  console.log('  Total saved (all types):', updatedList.length);
  console.log('──────────────────────────────────────────');

  return newDesign;
}
