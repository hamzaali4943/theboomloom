import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';

type Scheme = 'light' | 'dark';

type ThemeContextType = {
  colorScheme: Scheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: 'light',
  toggleTheme: () => {},
});

const STORAGE_KEY = '@boomloom_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = (Appearance.getColorScheme() ?? 'light') as Scheme;
  const [override, setOverride] = useState<Scheme | null>(null);

  // Load persisted preference
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === 'light' || val === 'dark') {
        setOverride(val);
      }
    });
  }, []);

  const colorScheme: Scheme = override ?? systemScheme;

  const toggleTheme = useCallback(() => {
    const next: Scheme = colorScheme === 'light' ? 'dark' : 'light';
    setOverride(next);
    AsyncStorage.setItem(STORAGE_KEY, next);
  }, [colorScheme]);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
