import React, { useCallback, useMemo } from 'react';
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
  PATTERN_META,
  type PatternIndex,
} from './weaving-data';

const GRID_GAP = Math.round(1.4 * DH); // ~17px — reduced to give pattern grid more width
import { LoomFrame } from '@/components/shared/LoomFrame';
import { SkiaPatternGrid } from './SkiaPatternGrid';
import { SkiaTreadleGrid } from './SkiaTreadleGrid';

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
  /** Fixed pixel height for the grid area — scales with cellWidth to preserve web aspect ratio */
  gridHeight: number;
  warpThreadWidth: number;
  weftThreadHeight: number;
  selectedWarpIndex: number;
  onColorWarp: (col: number) => void;
  onToggleTreadle: (row: number, col: number) => void;
};

// ── Heddle Bar ─────────────────────────────────────────
const HeddleBar = React.memo(function HeddleBar({
  patternIdx,
  width,
}: {
  patternIdx: PatternIndex;
  width: number;
}) {
  const meta = PATTERN_META[patternIdx];
  return (
    <View style={[styles.heddle, { backgroundColor: meta.bg, width },{ zIndex: 1 }]}>
      <ThemedText
        style={[
          styles.heddleText,
          { color: meta.fg, fontSize: patternIdx === 1 ? 11 : 13 },
        ]}
      >
        {meta.label}
      </ThemedText>
    </View>
  );
});

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
  warpThreadWidth,
  weftThreadHeight,
  selectedWarpIndex,
  onColorWarp,
  onToggleTreadle,
}: Props) {
  const scheme = useColorScheme() ?? 'light';

  const patternGridWidth = WARP_COUNT * cellWidth;
  const treadleGridWidth = TREADLE_COUNT * DH;
  const totalWidth = patternGridWidth + GRID_GAP + treadleGridWidth;

  // LoomFrame vertical constants (must match LoomFrame.tsx)
  const loomVert0 = 8;   // top margin
  const loomVert1 = 34;  // spike height
  const loomVert2 = 134; // heddle bar height
  const loomVert3 = 84;  // frame curve depth
  const loomTopPad = loomVert0 + loomVert1 + loomVert2 + loomVert3; // 260
  const loomBottomPad = loomVert3 + loomVert1 + loomVert0;          // 126
  // gridHeight scales proportionally with cellWidth (web aspect ratio preserved).
  // The container stays this fixed size regardless of slider changes.
  const loomCanvasHeight = loomTopPad + gridHeight + loomBottomPad;
  const bracketOverhang = 30; // spikeWidth(10) + 20

  // Touch handler for treadling grid
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      const col = Math.floor(x / DH);
      const row = Math.floor(y / cellHeight);
      // Rows render top-to-bottom as (sNum-1) → 0
      const actualRow = sNum - 1 - row;
      if (
        col >= 0 &&
        col < TREADLE_COUNT &&
        actualRow >= 0 &&
        actualRow < sNum
      ) {
        onToggleTreadle(actualRow, col);
      }
    },
    [cellHeight, sNum, onToggleTreadle],
  );

  // Treadle column numbers
  const treadleNumbers = useMemo(
    () => Array.from({ length: TREADLE_COUNT }, (_, i) =>
      currentPattern === 0 ? (i % 2) + 1 : i + 1,
    ),
    [currentPattern],
  );

  // Build row indices from top to bottom (high index at top = last weft row)
  const rowIndices = useMemo(
    () => Array.from({ length: sNum }, (_, i) => sNum - 1 - i),
    [sNum],
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.outerScroll}
    >
      <View style={{ width: totalWidth }}>
        {/* Heddle bar */}
        <HeddleBar patternIdx={currentPattern} width={patternGridWidth} />

        {/* Treadle column numbers (top) */}
        <View style={styles.numbersRow}>
          <View style={{ width: patternGridWidth }} />
          <View style={{ width: GRID_GAP }} />
          <View style={{ flexDirection: 'row', width: treadleGridWidth }}>
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

        {/* Loom frame + pattern grid area — fixed height preserving web aspect ratio */}
        <View style={{ position: 'relative', height: gridHeight }}>
          {/* LoomFrame SVG — behind the grid */}
          <View
            style={{
              position: 'absolute',
              top: -loomTopPad,
              left: -bracketOverhang,
              zIndex: 0,
            }}
            pointerEvents="none"
          >
            <LoomFrame
              loomWidth={patternGridWidth}
              canvasHeight={loomCanvasHeight}
              spikeSpacing={cellWidth * 2}
            />
          </View>

          {/* Grid area: pattern + gap + treadling.
              Fixed height container with overflow hidden — content redraws
              inside without affecting outer layout (matches web behavior). */}
          <View
            style={{
              height: gridHeight,
              overflow: 'hidden',
              zIndex: 1,
            }}
          >
            {/* Align grid content to bottom so rows grow upward like the web */}
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <View style={{ flexDirection: 'row' }}>
                {/* Pattern grid — single Skia canvas */}
                <SkiaPatternGrid
                  pattern={pattern}
                  colorWa={colorWa}
                  colorS={colorS}
                  sNum={sNum}
                  cellWidth={cellWidth}
                  cellHeight={cellHeight}
                  warpThreadWidth={warpThreadWidth}
                  weftThreadHeight={weftThreadHeight}
                  selectedWarpIndex={selectedWarpIndex}
                  rowIndices={rowIndices}
                />

                {/* Gap — matches web's ~3*dh between pattern end and treadle start */}
                <View style={{ width: GRID_GAP }} />

                {/* Treadling grid (touch area) — single Skia canvas */}
                <Pressable onPress={handleTreadleTouch}>
                  <SkiaTreadleGrid
                    S={S}
                    colorS={colorS}
                    sNum={sNum}
                    cellHeight={cellHeight}
                    rowIndices={rowIndices}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Treadle column numbers (bottom) */}
        <View style={styles.numbersRow}>
          <View style={{ width: patternGridWidth }} />
          <View style={{ width: GRID_GAP }} />
          <View style={{ flexDirection: 'row', width: treadleGridWidth }}>
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
  heddle: {
    height: 80,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  heddleText: {
    fontWeight: '700',
  },
  numbersRow: {
    flexDirection: 'row',
    height: 16,
    alignItems: 'center',
  },
  treadleNum: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
