import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search…' }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const text = Colors[scheme].text;
  const icon = Colors[scheme].icon;
  const muted = Colors[scheme].textMuted;

  return (
    <View style={[styles.container, { backgroundColor: surface, borderColor: border }]}>
      <IconSymbol name="magnifyingglass" size={18} color={icon} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={muted}
        style={[styles.input, { color: text }]}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
});
