import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  WARP_COUNT,
  TREADLE_COUNT,
  DH,
} from './weaving-data';
import { LoomFrame, LOOM_TOP_PAD, LOOM_BOTTOM_PAD } from '@/components/shared/LoomFrame';
import { SkiaPatternGrid } from './SkiaPatternGrid';
import { SkiaTreadleGrid } from './SkiaTreadleGrid';

const GRID_GAP = Math.round(1.0 * DH); // ~12px gap between pattern and treadle grid

// ── Types ──────────────────────────────────────────────
type Props = {
  currentPattern: number;
  colorWa: string[];
  colorS: string[];
  S: boolean[][];
  pattern: number[][];
  sNum: number;
  cellWidth: number;
  cellHeight: number;
  /** Fixed pixel height for the grid area — keeps layout stable during slider changes */
  gridHeight: number;
  selectedWarpIndex: number;
  tapMode: 'thread' | 'row';
  onColorWarp: (col: number) => void;
  onResetWarp: (col: number) => void;
  onSelectWarp: (col: number) => void;
  onToggleTreadle: (row: number, col: number) => void;
};

// ── Main Loom Component ────────────────────────────────
export const WeavingLoom = React.memo(function WeavingLoom({
  currentPattern,
  colorWa,
  colorS,
  S,
  pattern,
  sNum,
  cellWidth,
  cellHeight,
  gridHeight,
  selectedWarpIndex,
  tapMode,
  onColorWarp,
  onResetWarp,
  onSelectWarp,
  onToggleTreadle,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  // Weft mode widens the treadling grid to ~1/3 of the screen (and compresses
  // the pattern grid) so the treadle cells are comfortable to tap.
  const expanded = tapMode === 'row';

  // Reset row highlight when switching to thread mode
  useEffect(() => {
    if (tapMode === 'thread') setSelectedRowIndex(-1);
  }, [tapMode]);

  // ── Treadle column width: normal vs. expanded ──────────
  // Expanded width makes the 4 treadle columns span ~1/3 of the screen so the
  // cells are comfortable to tap. Only the width grows — row height stays tied
  // to the pattern grid, so the two grids remain vertically aligned.
  const screenWidth = Dimensions.get('window').width;
  const expandedTreadleCellWidth = useMemo(
    () => Math.max(DH, Math.round(screenWidth / 3 / TREADLE_COUNT)),
    [screenWidth],
  );
  const treadleCellWidth = expanded ? expandedTreadleCellWidth : DH;
  const treadleGridWidth = TREADLE_COUNT * treadleCellWidth;

  // When expanded, shrink the pattern grid so the whole loom still fits on
  // screen (no horizontal scroll). The pattern cell width is compressed to fill
  // whatever room is left after the wider treadle band + gap + outer padding.
  const patternCellWidth = useMemo(() => {
    if (!expanded) return cellWidth;
    const available = screenWidth - treadleGridWidth - GRID_GAP - 16; // 16 = outer scroll padding
    const shrunk = Math.floor(available / WARP_COUNT);
    // Never enlarge past the natural width; keep a sane minimum so cells stay tappable.
    return Math.max(2, Math.min(cellWidth, shrunk));
  }, [expanded, cellWidth, screenWidth, treadleGridWidth]);

  const patternGridWidth = WARP_COUNT * patternCellWidth;
  const totalWidth = patternGridWidth + GRID_GAP + treadleGridWidth;

  // Animate the treadle band width when toggling expand so it grows/collapses smoothly.
  const widthAnim = useRef(new Animated.Value(TREADLE_COUNT * DH)).current;
  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: treadleGridWidth,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [treadleGridWidth, widthAnim]);

  // Use fixed gridHeight for the outer container so layout doesn't shift
  const loomTopPad = LOOM_TOP_PAD;
  const loomBottomPad = LOOM_BOTTOM_PAD;
  const loomCanvasHeight = loomTopPad + gridHeight + loomBottomPad;

  // Touch handler for treadling grid — content draws from bottom up
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      const col = Math.floor(x / treadleCellWidth);
      // Row n=0 is at the bottom of the content band; content starts at loomTopPad in canvas
      const row = Math.floor((loomTopPad + gridHeight - y) / cellHeight);
      if (
        col >= 0 &&
        col < TREADLE_COUNT &&
        row >= 0 &&
        row < sNum
      ) {
        onToggleTreadle(row, col);
      }
    },
    [treadleCellWidth, cellHeight, loomTopPad, gridHeight, sNum, onToggleTreadle],
  );

  // Touch handler for pattern grid — behaviour depends on tapMode
  const handlePatternTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;

      if (tapMode === 'thread') {
        // Thread mode: tap colors that warp column; tap same column again to deselect
        const col = Math.floor(x / patternCellWidth);
        if (col >= 0 && col < WARP_COUNT) {
          if (col === selectedWarpIndex) {
            // Same thread tapped again → reset color back to default
            onResetWarp(col);
          } else {
            // New thread → apply current color and track selection (no visual highlight)
            onColorWarp(col);
            onSelectWarp(col);
          }
        }
      } else {
        // Row mode: tap selects/deselects a weft row (highlights both grids).
        const row = Math.floor((loomTopPad + gridHeight - y) / cellHeight);
        if (row >= 0 && row < sNum) {
          setSelectedRowIndex((prev) => (prev === row ? -1 : row));
        }
      }
    },
    [tapMode, selectedWarpIndex, patternCellWidth, cellHeight, loomTopPad, gridHeight, sNum, onColorWarp, onResetWarp, onSelectWarp],
  );

  // Treadle column numbers
  const treadleNumbers = useMemo(
    () => Array.from({ length: TREADLE_COUNT }, (_, i) =>
      currentPattern === 0 ? (i % 2) + 1 : i + 1,
    ),
    [currentPattern],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.outerScroll}
    >
      <View style={{ width: totalWidth }}>
        {/* Loom frame + pattern grid area — full loom height with grid inset */}
        <View style={{ position: 'relative', height: loomCanvasHeight }}>
          {/* LoomFrame SVG — spikes protrude above and below the grid, matching web */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          >
            <LoomFrame
              loomWidth={patternGridWidth}
              canvasHeight={loomCanvasHeight}
              spikeSpacing={patternCellWidth * 2}
            />
          </View>

          {/* Treadle column numbers (top) — positioned in the clean space
              between loom spikes (end at y=26) and grid top (y=loomTopPad). */}
          <View
            style={[
              styles.numbersRow,
              {
                position: 'absolute',
                top: loomTopPad - 16,
                left: patternGridWidth + GRID_GAP,
                zIndex: 2,
              },
            ]}
          >
            {treadleNumbers.map((num, i) => (
              <ThemedText
                key={i}
                style={[
                  styles.treadleNum,
                  {
                    width: treadleCellWidth,
                    color: Colors[scheme].textSecondary,
                    fontSize: Math.max(DH - 1, 8),
                    lineHeight: 14,
                  },
                ]}
              >
                {num}
              </ThemedText>
            ))}
          </View>

          {/* Grid area: pattern + gap + treadling.
              Canvases span loomCanvasHeight (same as LoomFrame) so spikes
              show through the transparent top/bottom bands. */}
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
              {/* Pattern grid — tap to open floater */}
              <Pressable onPress={handlePatternTouch}>
                <SkiaPatternGrid
                  pattern={pattern}
                  colorWa={colorWa}
                  colorS={colorS}
                  sNum={sNum}
                  cellWidth={patternCellWidth}
                  cellHeight={cellHeight}
                  gridHeight={gridHeight}
                  topOffset={loomTopPad}
                  selectedWarpIndex={selectedWarpIndex}
                  selectedRowIndex={selectedRowIndex}
                />
              </Pressable>

              {/* Gap */}
              <View style={{ width: GRID_GAP }} />

              {/* Treadling grid (touch area) — widens when expanded for easier tapping */}
              <Animated.View style={{ width: widthAnim, overflow: 'hidden' }}>
                <Pressable onPress={handleTreadleTouch}>
                  <SkiaTreadleGrid
                    S={S}
                    colorS={colorS}
                    sNum={sNum}
                    gridHeight={gridHeight}
                    topOffset={loomTopPad}
                    selectedRowIndex={selectedRowIndex}
                    cellWidth={treadleCellWidth}
                  />
                </Pressable>
              </Animated.View>
            </View>
          </View>

          {/* Treadle column numbers (bottom) — positioned just below the grid */}
          <View
            style={[
              styles.numbersRow,
              {
                position: 'absolute',
                top: loomTopPad + gridHeight,
                left: patternGridWidth + GRID_GAP,
                zIndex: 2,
              },
            ]}
          >
            {treadleNumbers.map((num, i) => (
              <ThemedText
                key={i}
                style={[
                  styles.treadleNum,
                  {
                    width: treadleCellWidth,
                    color: Colors[scheme].textSecondary,
                    fontSize: Math.max(DH - 1, 8),
                    lineHeight: 14,
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
  );
});

const styles = StyleSheet.create({
  outerScroll: {
    paddingHorizontal: 8,
  },
  numbersRow: {
    flexDirection: 'row',
    height: 16,
  },
  treadleNum: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
