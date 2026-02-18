import { useEffect, useState } from 'react';
import { useThemeContext } from '@/contexts/ThemeContext';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web.
 * Also hooks into ThemeContext to respect manual light/dark overrides.
 */
export function useColorScheme(): 'light' | 'dark' {
  const { colorScheme } = useThemeContext();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? colorScheme : 'light';
}
