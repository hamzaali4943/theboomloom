import { useThemeContext } from '@/contexts/ThemeContext';

export function useColorScheme(): 'light' | 'dark' {
  return useThemeContext().colorScheme;
}
