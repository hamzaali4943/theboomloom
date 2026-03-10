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
  // Always use light mode
  const colorScheme: Scheme = 'light';
  const toggleTheme = useCallback(() => {}, []);

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
