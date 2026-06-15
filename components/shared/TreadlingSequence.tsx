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

  // Keep the numbering box hidden until a pattern has been drawn.
  if (sequence.length === 0) {
    return null;
  }

  return (
    <View
      style={[styles.container, { backgroundColor: Colors[scheme].surface }]}
    >
      <ThemedText style={styles.heading}>
        bar positions, from bottom to top
      </ThemedText>
      <View style={[styles.seqBox, { backgroundColor: '#e5f0ff' }]}>
        <ThemedText style={styles.seqText}>
          {sequence.join('  ')}
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
    color: '#708df4',
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
    color: '#708df4',
    letterSpacing: 2,
    textAlign: 'center',
  },
});
