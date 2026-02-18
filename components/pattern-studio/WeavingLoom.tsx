import React, { useCallback } from 'react';
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
  TREADLING_BG,
  GRID_BORDER,
  PATTERN_META,
  type PatternIndex,
} from './weaving-data';

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
    <View style={[styles.heddle, { backgroundColor: meta.bg, width }]}>
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

// ── Warp Color Row ─────────────────────────────────────
const WarpColorRow = React.memo(function WarpColorRow({
  colorWa,
  cellWidth,
  onPress,
}: {
  colorWa: string[];
  cellWidth: number;
  onPress: (col: number) => void;
}) {
  // Use a touch handler on the entire row to determine column
  const handleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const col = Math.floor(x / cellWidth);
      if (col >= 0 && col < WARP_COUNT) {
        onPress(col);
      }
    },
    [cellWidth, onPress],
  );

  return (
    <Pressable onPress={handleTouch}>
      <View style={[styles.warpRow, { height: Math.max(cellWidth, 14) }]}>
        {colorWa.map((color, i) => (
          <View
            key={i}
            style={{
              width: cellWidth,
              height: Math.max(cellWidth, 14),
              backgroundColor: color,
              borderWidth: 0.5,
              borderColor: GRID_BORDER,
            }}
          />
        ))}
      </View>
    </Pressable>
  );
});

// ── Pattern Grid Row ───────────────────────────────────
const PatternRow = React.memo(function PatternRow({
  rowIndex,
  patternRow,
  colorWa,
  weftColor,
  cellWidth,
  cellHeight,
}: {
  rowIndex: number;
  patternRow: number[];
  colorWa: string[];
  weftColor: string;
  cellWidth: number;
  cellHeight: number;
}) {
  return (
    <View style={{ flexDirection: 'row', height: cellHeight }}>
      {patternRow.map((val, col) => (
        <View
          key={col}
          style={{
            width: cellWidth,
            height: cellHeight,
            backgroundColor: val === 0 ? weftColor : colorWa[col],
          }}
        />
      ))}
    </View>
  );
});

// ── Treadling Grid Row ─────────────────────────────────
const TreadleRow = React.memo(function TreadleRow({
  rowIndex,
  sRow,
  weftColor,
  cellWidth,
  cellHeight,
}: {
  rowIndex: number;
  sRow: boolean[];
  weftColor: string;
  cellWidth: number;
  cellHeight: number;
}) {
  return (
    <View style={{ flexDirection: 'row', height: cellHeight }}>
      {sRow.map((active, col) => (
        <View
          key={col}
          style={{
            width: cellWidth,
            height: cellHeight,
            backgroundColor: active ? weftColor : TREADLING_BG,
            borderWidth: 0.5,
            borderColor: GRID_BORDER,
          }}
        />
      ))}
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
  onColorWarp,
  onToggleTreadle,
}: Props) {
  const scheme = useColorScheme() ?? 'light';

  const patternGridWidth = WARP_COUNT * cellWidth;
  const treadleGridWidth = TREADLE_COUNT * cellWidth;
  const totalWidth = patternGridWidth + 4 + treadleGridWidth; // 4px gap

  // Touch handler for treadling grid
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      const col = Math.floor(x / cellWidth);
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
    [cellWidth, cellHeight, sNum, onToggleTreadle],
  );

  // Treadle column numbers
  const treadleNumbers = Array.from({ length: TREADLE_COUNT }, (_, i) =>
    currentPattern === 0 ? (i % 2) + 1 : i + 1,
  );

  // Build row indices from top to bottom (high index at top = last weft row)
  const rowIndices = Array.from({ length: sNum }, (_, i) => sNum - 1 - i);

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
          <View style={{ width: 4 }} />
          <View style={{ flexDirection: 'row', width: treadleGridWidth }}>
            {treadleNumbers.map((num, i) => (
              <ThemedText
                key={i}
                style={[
                  styles.treadleNum,
                  {
                    width: cellWidth,
                    color: Colors[scheme].textSecondary,
                    fontSize: Math.max(cellWidth - 1, 8),
                  },
                ]}
              >
                {num}
              </ThemedText>
            ))}
          </View>
        </View>

        {/* Warp color row */}
        <WarpColorRow
          colorWa={colorWa}
          cellWidth={cellWidth}
          onPress={onColorWarp}
        />

        {/* Grid area: pattern + gap + treadling */}
        <ScrollView
          style={styles.gridScroll}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
        >
          <View style={{ flexDirection: 'row' }}>
            {/* Pattern grid */}
            <View style={{ width: patternGridWidth }}>
              {rowIndices.map((ri) => (
                <PatternRow
                  key={ri}
                  rowIndex={ri}
                  patternRow={pattern[ri]}
                  colorWa={colorWa}
                  weftColor={colorS[ri]}
                  cellWidth={cellWidth}
                  cellHeight={cellHeight}
                />
              ))}
            </View>

            {/* Gap */}
            <View style={{ width: 4 }} />

            {/* Treadling grid (touch area) */}
            <Pressable onPress={handleTreadleTouch}>
              <View style={{ width: treadleGridWidth }}>
                {rowIndices.map((ri) => (
                  <TreadleRow
                    key={ri}
                    rowIndex={ri}
                    sRow={S[ri]}
                    weftColor={colorS[ri]}
                    cellWidth={cellWidth}
                    cellHeight={cellHeight}
                  />
                ))}
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Treadle column numbers (bottom) */}
        <View style={styles.numbersRow}>
          <View style={{ width: patternGridWidth }} />
          <View style={{ width: 4 }} />
          <View style={{ flexDirection: 'row', width: treadleGridWidth }}>
            {treadleNumbers.map((num, i) => (
              <ThemedText
                key={i}
                style={[
                  styles.treadleNum,
                  {
                    width: cellWidth,
                    color: Colors[scheme].textSecondary,
                    fontSize: Math.max(cellWidth - 1, 8),
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
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  heddleText: {
    fontWeight: '700',
  },
  warpRow: {
    flexDirection: 'row',
    marginBottom: 2,
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
  gridScroll: {
    maxHeight: 420,
  },
});
