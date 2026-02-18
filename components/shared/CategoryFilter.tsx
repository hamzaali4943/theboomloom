import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type Category = {
  key: string;
  label: string;
};

type Props = {
  categories: Category[];
  selected: string;
  onSelect: (key: string) => void;
};

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = Colors[scheme].primary;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {categories.map((cat) => {
          const active = selected === cat.key;
          return (
            <TouchableOpacity
              key={cat.key}
              onPress={() => onSelect(cat.key)}
              style={[
                styles.pill,
                {
                  backgroundColor: active ? primary : surface,
                  borderColor: active ? primary : border,
                },
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.pillText,
                  { color: active ? '#FFFFFF' : Colors[scheme].textSecondary },
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 100,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
