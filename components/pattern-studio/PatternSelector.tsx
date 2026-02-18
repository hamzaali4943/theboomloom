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
              {
                backgroundColor: meta.bg,
                borderColor: isActive ? '#0F434F' : '#C4E9F2',
              },
            ]}
          >
            <ThemedText
              style={[
                styles.label,
                { color: meta.fg, fontSize: idx === 1 ? 11 : 13 },
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
    gap: 10,
    justifyContent: 'center',
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    textAlign: 'center',
  },
});
