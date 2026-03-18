import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Returns a numeric key that increments each time the app returns to the
 * foreground. Use it as the `key` prop on a Skia <Canvas> to force a remount
 * and restore the GPU surface after screen-lock / backgrounding.
 *
 * Example:
 *   const resumeKey = useSkiaResumeKey();
 *   <Canvas key={resumeKey} ...>
 */
export function useSkiaResumeKey(): number {
  const [key, setKey] = useState(0);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        setKey((k) => k + 1);
      }
      appState.current = nextState;
    });
    return () => sub.remove();
  }, []);

  return key;
}
