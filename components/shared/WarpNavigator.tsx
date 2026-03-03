import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { WARP_COUNT } from '@/components/pattern-studio/weaving-data';

type Props = {
  selectedWarpIndex: number;
  selectedColor: string;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onApplyColor: () => void;
};

export const WarpNavigator = React.memo(function WarpNavigator({
  selectedWarpIndex,
  selectedColor,
  onMoveLeft,
  onMoveRight,
  onApplyColor,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Navigation row */}
      <View style={styles.navRow}>
        <Pressable onPress={onMoveLeft} style={styles.arrowBtn}>
          <ThemedText style={styles.arrowText}>{'◀'}</ThemedText>
        </Pressable>

        <View style={styles.threadInfo}>
          <ThemedText style={styles.threadLabel}>
            Thread {selectedWarpIndex + 1} / {WARP_COUNT}
          </ThemedText>
        </View>

        <Pressable onPress={onMoveRight} style={styles.arrowBtn}>
          <ThemedText style={styles.arrowText}>{'▶'}</ThemedText>
        </Pressable>
      </View>

      {/* Apply color button */}
      <Pressable onPress={onApplyColor} style={styles.applyBtn}>
        <View style={[styles.colorSwatch, { backgroundColor: selectedColor }]} />
        <ThemedText style={styles.applyText}>Apply Color</ThemedText>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    gap: 10,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0F434F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 18,
  },
  threadInfo: {
    minWidth: 120,
    alignItems: 'center',
  },
  threadLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  applyBtn: {
    flexDirection: 'row',
    height: 44,
    backgroundColor: '#0F434F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  applyText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
});
