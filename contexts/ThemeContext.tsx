import React, { createContext, useContext } from 'react';

type ThemeContextType = {
  colorScheme: 'light';
};

const ThemeContext = createContext<ThemeContextType>({ colorScheme: 'light' });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeContext.Provider value={{ colorScheme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext(): ThemeContextType {
  return useContext(ThemeContext);
}
