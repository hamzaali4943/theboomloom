import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { PATTERN_META, type PatternIndex } from './weaving-data';

type Props = {
  current: PatternIndex;
  onSelect: (idx: PatternIndex) => void;
};

export const PatternSelector = React.memo(function PatternSelector({
  current,
  onSelect,
}: Props) {
  return (
    <View style={styles.container}>
      {PATTERN_META.map((meta, idx) => {
        const isActive = current === idx;
        return (
          <Pressable
            key={idx}
            onPress={() => onSelect(idx as PatternIndex)}
            style={[
              styles.button,
              isActive
                ? { backgroundColor: '#0F434F' }
                : { backgroundColor: '#E8F4F8', borderColor: '#C4E9F2', borderWidth: 1.5 },
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                { color: isActive ? '#ffffff' : '#0F434F' },
              ]}
            >
              {meta.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    fontSize: 13,
    textAlign: 'center',
  },
});
