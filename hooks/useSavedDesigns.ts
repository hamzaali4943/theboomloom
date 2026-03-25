/**
 * useSavedDesigns — used only by SavedDesignsScreen.
 *
 * Responsibilities:
 *  - Load all saved designs from AsyncStorage on mount
 *  - Expose `reload()` so the screen can refresh when it gains focus
 *    (a design may have been added from a pattern screen in the background)
 *  - Expose `deleteDesign(id)` to remove a single design
 *
 * Pattern screens do NOT use this hook — they call `saveDesign()` directly.
 */

import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DESIGNS_STORAGE_KEY } from '@/utils/saveDesign';
import type { SavedDesign } from '@/types/saved-design';

export function useSavedDesigns() {
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);

  // Read all designs from AsyncStorage and update local state
  const reload = useCallback(async () => {
    const raw = await AsyncStorage.getItem(DESIGNS_STORAGE_KEY);
    setDesigns(raw ? JSON.parse(raw) : []);
  }, []);

  // Initial load on mount
  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  const deleteDesign = useCallback(
    async (id: string) => {
      // Optimistic update: remove from local state immediately
      const updated = designs.filter((d) => d.id !== id);
      setDesigns(updated);
      await AsyncStorage.setItem(DESIGNS_STORAGE_KEY, JSON.stringify(updated));
    },
    [designs],
  );

  return { designs, loading, reload, deleteDesign };
}
