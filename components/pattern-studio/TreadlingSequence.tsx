import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  sequence: number[];
};

export const TreadlingSequence = React.memo(function TreadlingSequence({
  sequence,
}: Props) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[scheme].surface }]}
    >
      <ThemedText style={styles.heading}>
        Treadling Sequence (bottom → top)
      </ThemedText>
      <View style={[styles.seqBox, { backgroundColor: '#e5f0ff' }]}>
        <ThemedText style={styles.seqText}>
          {sequence.length > 0
            ? sequence.join('  ')
            : 'Tap the treadling grid to start weaving'}
        </ThemedText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  heading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F434F',
    textAlign: 'center',
  },
  seqBox: {
    width: '100%',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  seqText: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#0F434F',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
