import React, { useCallback, useMemo, useState } from 'react';
import {
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
  type PatternIndex,
} from './weaving-data';
import { LoomFrame, LOOM_TOP_PAD, LOOM_BOTTOM_PAD } from '@/components/shared/LoomFrame';
import { SkiaPatternGrid } from './SkiaPatternGrid';
import { SkiaTreadleGrid } from './SkiaTreadleGrid';

const GRID_GAP = Math.round(1.0 * DH); // ~12px gap between pattern and treadle grid

// ── Types ──────────────────────────────────────────────
type Props = {
  currentPattern: PatternIndex;
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
  onColorWarp: (col: number) => void;
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
  onColorWarp,
  onToggleTreadle,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);

  const patternGridWidth = WARP_COUNT * cellWidth;
  const treadleGridWidth = TREADLE_COUNT * DH;
  const totalWidth = patternGridWidth + GRID_GAP + treadleGridWidth;

  // Use fixed gridHeight for the outer container so layout doesn't shift
  const loomTopPad = LOOM_TOP_PAD;       // 126
  const loomBottomPad = LOOM_BOTTOM_PAD; // 126
  const loomCanvasHeight = loomTopPad + gridHeight + loomBottomPad;

  // Touch handler for treadling grid — content draws from bottom up
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      const col = Math.floor(x / DH);
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
    [cellHeight, loomTopPad, gridHeight, sNum, onToggleTreadle],
  );

  // Touch handler for pattern grid — select/deselect a row (highlights both grids)
  const handlePatternTouch = useCallback(
    (e: GestureResponderEvent) => {
      const y = e.nativeEvent.locationY;
      const row = Math.floor((loomTopPad + gridHeight - y) / cellHeight);
      if (row >= 0 && row < sNum) {
        setSelectedRowIndex((prev) => (prev === row ? -1 : row));
      }
    },
    [cellHeight, loomTopPad, gridHeight, sNum],
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
              spikeSpacing={cellWidth * 2}
            />
          </View>

          {/* Treadle column numbers (top) — positioned just above the grid */}
          <View
            style={[
              styles.numbersRow,
              {
                position: 'absolute',
                top: loomTopPad - 20,
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
                  cellWidth={cellWidth}
                  cellHeight={cellHeight}
                  gridHeight={gridHeight}
                  topOffset={loomTopPad}
                  selectedWarpIndex={selectedWarpIndex}
                  selectedRowIndex={selectedRowIndex}
                />
              </Pressable>

              {/* Gap */}
              <View style={{ width: GRID_GAP }} />

              {/* Treadling grid (touch area) — fixed-size Skia canvas */}
              <Pressable onPress={handleTreadleTouch}>
                <SkiaTreadleGrid
                  S={S}
                  colorS={colorS}
                  sNum={sNum}
                  gridHeight={gridHeight}
                  topOffset={loomTopPad}
                  selectedRowIndex={selectedRowIndex}
                />
              </Pressable>
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
