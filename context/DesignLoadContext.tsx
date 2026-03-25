/**
 * DesignLoadContext — bridges SavedDesignsScreen and the pattern screens.
 *
 * Problem being solved:
 *   Pattern screens own their own state hooks (useWeavingState, etc.).
 *   SavedDesignsScreen needs to trigger a "load design" into one of those
 *   screens. But the screens live in separate tab routes — there's no direct
 *   prop channel between them.
 *
 * Solution: a lightweight context that stores a "pending load" object.
 *
 * Flow:
 *   1. User taps "Load" on a design in SavedDesignsScreen
 *   2. `scheduleLoad({ patternType, snapshot })` is called → context state updates
 *   3. `router.push('/(tabs)/plain')` navigates to the correct tab
 *   4. PlainScreen gains focus → its `useFocusEffect` fires
 *   5. It reads `pendingLoad` from context, calls `loadDesign(snapshot)`,
 *      then calls `clearPendingLoad()` so it doesn't reload on next focus
 *
 * DesignLoadProvider must wrap the Tabs component (done in app/(tabs)/_layout.tsx)
 * so all 5 pattern tabs AND SavedDesignsScreen share the same context instance.
 */

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { PatternType, DesignSnapshot } from '@/types/saved-design';

export interface PendingLoad {
  patternType: PatternType;
  snapshot: DesignSnapshot;
}

interface DesignLoadContextValue {
  pendingLoad: PendingLoad | null;
  /** Called by SavedDesignsScreen before navigating */
  scheduleLoad: (load: PendingLoad) => void;
  /** Called by the pattern screen after it has consumed the load */
  clearPendingLoad: () => void;
}

const DesignLoadContext = createContext<DesignLoadContextValue>({
  pendingLoad: null,
  scheduleLoad: () => {},
  clearPendingLoad: () => {},
});

export function DesignLoadProvider({ children }: { children: React.ReactNode }) {
  const [pendingLoad, setPendingLoad] = useState<PendingLoad | null>(null);

  const scheduleLoad = useCallback((load: PendingLoad) => {
    setPendingLoad(load);
  }, []);

  const clearPendingLoad = useCallback(() => {
    setPendingLoad(null);
  }, []);

  return (
    <DesignLoadContext.Provider value={{ pendingLoad, scheduleLoad, clearPendingLoad }}>
      {children}
    </DesignLoadContext.Provider>
  );
}

export function useDesignLoad() {
  return useContext(DesignLoadContext);
}
