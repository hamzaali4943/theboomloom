import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Dimensions,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useKrokbragdState } from '@/components/krokbragd/useKrokbragdState';
import { KB_WARP_COUNT, DH, PATTERN_ASPECT } from '@/components/krokbragd/krokbragd-data';
import { useDesignLoad } from '@/context/DesignLoadContext';
import { saveDesign } from '@/utils/saveDesign';
import type { KrokbragdSnapshot } from '@/types/saved-design';
import { SkiaKrokbragdGrid } from '@/components/krokbragd/SkiaKrokbragdGrid';
import {
  SkiaKrokbragdTreadleGrid,
  getKrokbragdTreadleGridWidth,
  getKrokbragdTreadleHitTest,
} from '@/components/krokbragd/SkiaKrokbragdTreadleGrid';
import { LoomFrame, LOOM_TOP_PAD, LOOM_BOTTOM_PAD } from '@/components/shared/LoomFrame';
import { ColorPickerModal } from '@/components/shared/ColorPickerModal';

const GRID_GAP = Math.round(1.0 * DH);

export function KrokbragdScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  const { pendingLoad, clearPendingLoad } = useDesignLoad();

  const screenWidth = Dimensions.get('window').width;
  const treadleGridWidth = getKrokbragdTreadleGridWidth();
  const cellWidth = useMemo(
    () => Math.floor((screenWidth - 16 - GRID_GAP - treadleGridWidth) / KB_WARP_COUNT),
    [screenWidth, treadleGridWidth],
  );
  const gridHeight = useMemo(
    () => Math.round(KB_WARP_COUNT * cellWidth * PATTERN_ASPECT),
    [cellWidth],
  );

  const {
    selectedColor,
    colorWa,
    S,
    colorCells,
    sNum,
    cellHeight,
    colorSequence,
    toggleTreadle,
    setSelectedColor,
    resetAll,
    loadDesign,
    getSnapshot,
  } = useKrokbragdState(gridHeight);

  useFocusEffect(
    useCallback(() => {
      if (pendingLoad?.patternType === 'krokbragd') {
        loadDesign(pendingLoad.snapshot as KrokbragdSnapshot);
        clearPendingLoad();
      }
    }, [pendingLoad, loadDesign, clearPendingLoad]),
  );

  const handleSave = useCallback(() => {
    saveDesign('krokbragd', getSnapshot())
      .then(() => Alert.alert('Saved', 'Design saved to your collection.'))
      .catch((err) => Alert.alert('Cannot Save', err?.message ?? 'Could not save the design.'));
  }, [getSnapshot]);

  // Loom frame dimensions
  // KB_TOP_EXTEND matches the topExtend passed to SkiaKrokbragdGrid (default=5).
  // Adding it to loomTopPad ensures warp threads start exactly at the spike base
  // so top and bottom spikes appear the same visual height.
  const KB_TOP_EXTEND = 5;
  const patternGridWidth = KB_WARP_COUNT * cellWidth;
  const loomTopPad = LOOM_TOP_PAD + KB_TOP_EXTEND;
  const loomBottomPad = LOOM_BOTTOM_PAD;
  const loomCanvasHeight = loomTopPad + gridHeight + loomBottomPad;
  const totalWidth = patternGridWidth + GRID_GAP + treadleGridWidth;

  // Touch handler for the staggered treadle grid
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      const hit = getKrokbragdTreadleHitTest(x, y, loomTopPad, gridHeight);
      if (hit && hit.row >= 0 && hit.row < sNum) {
        toggleTreadle(hit.row, hit.col);
      }
    },
    [loomTopPad, gridHeight, sNum, toggleTreadle],
  );

  // Touch handler for pattern grid — row selection only (no warp coloring)
  const handlePatternTouch = useCallback(
    (e: GestureResponderEvent) => {
      const y = e.nativeEvent.locationY;
      const row = Math.floor((loomTopPad + gridHeight - y) / cellHeight);
      if (row >= 0 && row < sNum) {
        setSelectedRowIndex((prev) => (prev === row ? -1 : row));
      }
    },
    [loomTopPad, gridHeight, cellHeight, sNum],
  );

  // Treadle column numbers (1, 2, 3) — positioned to match staggered columns
  const treadleColStep = DH + DH * (8.33 / 16.67); // cellWidth + hshift
  const treadleNumbers = [1, 2, 3];

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Pattern',
      'Are you sure you want to clear the pattern?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAll },
      ],
    );
  }, [resetAll]);

  const openColorPicker = useCallback(() => setColorPickerVisible(true), []);
  const closeColorPicker = useCallback(() => setColorPickerVisible(false), []);
  const handleSelectColor = useCallback((c: string) => {
    setSelectedColor(c);
    setColorPickerVisible(false);
  }, [setSelectedColor]);

  return (
    <SafeScreen>
      <Header
        title="Pattern Picker"
        subtitle="Krokbragd bars"
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Current color button → opens modal */}
        <Pressable onPress={openColorPicker} style={styles.colorBtnRow}>
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: selectedColor, borderColor: '#0F434F' },
            ]}
          />
          <View>
            <ThemedText style={styles.colorLabel}>Current Color</ThemedText>
            <ThemedText
              style={[styles.colorHint, { color: Colors[scheme].textSecondary }]}
            >
              Tap to customize
            </ThemedText>
          </View>
        </Pressable>

        {/* Loom area with custom Krokbragd grids */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.outerScroll}
        >
          <View style={{ width: totalWidth }}>
            <View style={{ position: 'relative', height: loomCanvasHeight }}>
              {/* LoomFrame SVG behind */}
              <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}>
                <LoomFrame
                  loomWidth={patternGridWidth}
                  canvasHeight={loomCanvasHeight}
                  spikeSpacing={cellWidth * 2}
                  spikeHeight={18}
                />
              </View>

              {/* Treadle column numbers (top) */}
              <View
                style={{
                  position: 'absolute',
                  top: loomTopPad - 26,
                  left: patternGridWidth + GRID_GAP,
                  width: treadleGridWidth,
                  height: 16,
                  zIndex: 2,
                }}
              >
                {treadleNumbers.map((num, i) => (
                  <ThemedText
                    key={i}
                    style={[
                      styles.treadleNum,
                      {
                        position: 'absolute',
                        left: i * treadleColStep,
                        width: DH,
                        color: Colors[scheme].textSecondary,
                        fontSize: Math.max(DH - 1, 8),
                      },
                    ]}
                  >
                    {num}
                  </ThemedText>
                ))}
              </View>

              {/* Grid area: custom pattern grid + gap + custom treadle grid */}
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: loomCanvasHeight,
                  zIndex: 1,
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  {/* Krokbragd pattern grid (display only, row selection) */}
                  <Pressable onPress={handlePatternTouch}>
                    <SkiaKrokbragdGrid
                      S={S}
                      colorCells={colorCells}
                      colorWa={colorWa}
                      sNum={sNum}
                      cellWidth={cellWidth}
                      cellHeight={cellHeight}
                      gridHeight={gridHeight}
                      topOffset={loomTopPad}
                      topExtend={KB_TOP_EXTEND}
                      selectedRowIndex={selectedRowIndex}
                    />
                  </Pressable>

                  {/* Gap */}
                  <View style={{ width: GRID_GAP }} />

                  {/* Krokbragd staggered treadle grid */}
                  <Pressable onPress={handleTreadleTouch}>
                    <SkiaKrokbragdTreadleGrid
                      S={S}
                      colorCells={colorCells}
                      sNum={sNum}
                      gridHeight={gridHeight}
                      topOffset={loomTopPad}
                      selectedRowIndex={selectedRowIndex}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Treadle column numbers (bottom) */}
              <View
                style={{
                  position: 'absolute',
                  top: loomTopPad + gridHeight,
                  left: patternGridWidth + GRID_GAP,
                  width: treadleGridWidth,
                  height: 16,
                  zIndex: 2,
                }}
              >
                {treadleNumbers.map((num, i) => (
                  <ThemedText
                    key={i}
                    style={[
                      styles.treadleNum,
                      {
                        position: 'absolute',
                        left: i * treadleColStep,
                        width: DH,
                        color: Colors[scheme].textSecondary,
                        fontSize: Math.max(DH - 1, 8),
                      },
                    ]}
                  >
                    {num}
                  </ThemedText>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Color sequence display */}
        <View style={[styles.seqContainer, { backgroundColor: Colors[scheme].surface }]}>
          <ThemedText style={styles.seqHeading}>
            Bar positions, from bottom to top
          </ThemedText>
          <View style={styles.seqBox}>
            {colorSequence.length > 0 ? (
              <View style={styles.seqRow}>
                {colorSequence.map((group, i) => (
                  <View key={i} style={styles.seqGroup}>
                    <ThemedText style={styles.seqBracket}>(</ThemedText>
                    {group.map((item, j) => (
                      <ThemedText
                        key={j}
                        style={[styles.seqNumber, { color: item.color }]}
                      >
                        {item.treadle}
                      </ThemedText>
                    ))}
                    <ThemedText style={styles.seqBracket}>)</ThemedText>
                  </View>
                ))}
              </View>
            ) : (
              <ThemedText style={styles.seqEmpty}>
                Tap the treadle grid to start weaving
              </ThemedText>
            )}
          </View>
        </View>

        <View style={styles.actionRow}>
          <Pressable onPress={handleSave} style={[styles.actionBtn, styles.saveBtn]}>
            <ThemedText style={styles.saveBtnText}>Save Design</ThemedText>
          </Pressable>
          <Pressable onPress={handleReset} style={[styles.actionBtn, styles.resetBtn]}>
            <ThemedText style={styles.resetText}>Reset</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

      {/* Color picker modal */}
      <ColorPickerModal
        visible={colorPickerVisible}
        selectedColor={selectedColor}
        onSelectColor={handleSelectColor}
        onClose={closeColorPicker}
      />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingTop: 12,
    paddingBottom: 70,
    gap: 16,
  },
  outerScroll: {
    paddingHorizontal: 8,
  },
  colorBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  colorLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  colorHint: {
    fontSize: 12,
  },
  numbersRow: {
    flexDirection: 'row',
    height: 16,
  },
  treadleNum: {
    textAlign: 'center',
    fontWeight: '600',
  },
  seqContainer: {
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  seqHeading: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F434F',
    textAlign: 'center',
  },
  seqBox: {
    width: '100%',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#b9c7db',
    alignItems: 'center',
  },
  seqRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seqGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seqBracket: {
    color: '#0F434F',
    fontSize: 18,
    fontWeight: '700',
  },
  seqNumber: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  seqEmpty: {
    fontFamily: 'monospace',
    fontSize: 15,
    color: '#0F434F',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtn: {
    borderWidth: 2,
    borderColor: '#0F434F',
  },
  saveBtnText: {
    color: '#0F434F',
    fontSize: 15,
    fontWeight: '700',
  },
  resetBtn: {
    backgroundColor: '#0F434F',
  },
  resetText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
