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
import Slider from '@react-native-community/slider';
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
const MAX_WARP_ZOOM = 4;
// Horizontal padding of the loom's scroll area (styles.outerScroll).
const LOOM_SCROLL_PAD = 8;

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
  /** Bumped by the parent on reset to force the treadle grid back to collapsed. */
  resetKey?: number;
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
  resetKey = 0,
  onColorWarp,
  onResetWarp,
  onSelectWarp,
  onToggleTreadle,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  // The treadling grid can widen to ~1/3 of the screen (and compress the pattern
  // grid) so its cells are comfortable to tap. While collapsed, the first tap on
  // the treadle grid only pops it out (no toggle); once expanded, taps toggle
  // treadles. Tapping the pattern workspace collapses it again. Weft mode starts
  // expanded by default, so taps there act immediately.
  const [expanded, setExpanded] = useState(tapMode === 'row');
  // Zoom for warp mode: 1x–4x, set by the slider under the loom. Only the thread
  // spacing grows, so the loom height and page layout stay put while threads
  // become easier to tap.
  const [warpZoom, setWarpZoom] = useState(1);

  // Horizontal scroll bookkeeping, used to keep the middle of the view in place
  // when the zoom changes.
  const loomScrollRef = useRef<ScrollView>(null);
  const scrollXRef = useRef(0);
  const viewportWidthRef = useRef(0);
  const pendingScrollX = useRef<number | null>(null);

  // Back to 1x, with the view returned to the left edge.
  const resetZoom = useCallback(() => {
    pendingScrollX.current = 0;
    setWarpZoom(1);
  }, []);

  // Switching mode resets the layout: weft starts expanded, warp starts collapsed.
  useEffect(() => {
    if (tapMode === 'thread') setSelectedRowIndex(-1);
    setExpanded(tapMode === 'row');
    resetZoom();
  }, [tapMode, resetZoom]);

  // Reset always collapses the treadle grid, even if the mode didn't change
  // (e.g. reset pressed while already in warp mode).
  useEffect(() => {
    if (resetKey > 0) {
      setExpanded(false);
      resetZoom();
    }
  }, [resetKey, resetZoom]);

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
    if (!expanded) return cellWidth * warpZoom;
    const available = screenWidth - treadleGridWidth - GRID_GAP - 16; // 16 = outer scroll padding
    const shrunk = Math.floor(available / WARP_COUNT);
    // Never enlarge past the natural width; keep a sane minimum so cells stay tappable.
    return Math.max(2, Math.min(cellWidth, shrunk));
  }, [expanded, warpZoom, cellWidth, screenWidth, treadleGridWidth]);

  const patternGridWidth = WARP_COUNT * patternCellWidth;
  const totalWidth = patternGridWidth + GRID_GAP + treadleGridWidth;

  // The Skia canvas can't resize smoothly (its dimensions are discrete props),
  // so animating the wrapper width clips the canvas mid-transition. Instead the
  // band snaps to its new width while a quick opacity crossfade hides the jump.
  const fadeAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.25, duration: 90, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
    ]).start();
  }, [treadleGridWidth, fadeAnim]);

  // Slider moved to a new step. Work out where the view should scroll so the
  // point that was in the middle of the screen is still in the middle once the
  // threads have spread out; the scroll itself happens in
  // handleContentSizeChange, after the wider grid has laid out.
  const handleZoomChange = useCallback(
    (next: number) => {
      if (next === warpZoom) return;
      const viewport = viewportWidthRef.current;
      const centre = scrollXRef.current + viewport / 2 - LOOM_SCROLL_PAD;
      pendingScrollX.current =
        centre * (next / warpZoom) + LOOM_SCROLL_PAD - viewport / 2;
      setWarpZoom(next);
    },
    [warpZoom],
  );

  const handleContentSizeChange = useCallback((contentWidth: number) => {
    if (pendingScrollX.current === null) return;
    const maxX = Math.max(0, contentWidth - viewportWidthRef.current);
    const x = Math.min(Math.max(0, pendingScrollX.current), maxX);
    pendingScrollX.current = null;
    scrollXRef.current = x;
    loomScrollRef.current?.scrollTo({ x, animated: false });
  }, []);

  // Use fixed gridHeight for the outer container so layout doesn't shift
  const loomTopPad = LOOM_TOP_PAD;
  const loomBottomPad = LOOM_BOTTOM_PAD;
  const loomCanvasHeight = loomTopPad + gridHeight + loomBottomPad;

  // Touch handler for treadling grid — content draws from bottom up
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      // First tap while collapsed only pops the band out — it does NOT toggle a
      // treadle. This stops accidental edits from a guess at the tiny collapsed
      // cells; you open the band first, then work on the comfortable wide cells.
      if (!expanded) {
        setExpanded(true);
        resetZoom();
        return;
      }

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
    [expanded, treadleCellWidth, cellHeight, loomTopPad, gridHeight, sNum, onToggleTreadle, resetZoom],
  );

  // Touch handler for pattern grid — behaviour depends on tapMode
  const handlePatternTouch = useCallback(
    (e: GestureResponderEvent) => {
      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;

      // Tapping back on the main workspace collapses the expanded treadle grid.
      setExpanded(false);

      if (tapMode === 'thread') {
        if (expanded) return;

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
    [expanded, tapMode, selectedWarpIndex, patternCellWidth, cellHeight, loomTopPad, gridHeight, sNum, onColorWarp, onResetWarp, onSelectWarp],
  );

  // Treadle column numbers
  const treadleNumbers = useMemo(
    () => Array.from({ length: TREADLE_COUNT }, (_, i) =>
      currentPattern === 0 ? (i % 2) + 1 : i + 1,
    ),
    [currentPattern],
  );

  return (
    <View>
      <ScrollView
        ref={loomScrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.outerScroll}
        onLayout={(e) => {
          viewportWidthRef.current = e.nativeEvent.layout.width;
        }}
        onScroll={(e) => {
          scrollXRef.current = e.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
        onContentSizeChange={handleContentSizeChange}
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
              {/* Pattern + treadle resize together on expand; fade the whole
                  row as one unit so the Skia canvas resize is hidden. */}
              <Animated.View style={{ flexDirection: 'row', opacity: fadeAnim }}>
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
                <View style={{ width: treadleGridWidth }}>
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
                </View>
              </Animated.View>
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

      {/* Zoom slider — warp mode only. In weft mode it stays in the layout but
          hidden, so the controls below don't jump when the mode changes.
          Disabled while the treadle grid is expanded (zoom is 1x then). */}
      <View style={[styles.zoomRow, tapMode !== 'thread' && styles.zoomRowHidden]}>
        <ThemedText style={[styles.zoomText, { color: Colors[scheme].textSecondary }]}>
          zoom
        </ThemedText>
        <Slider
          style={styles.zoomSlider}
          minimumValue={1}
          maximumValue={MAX_WARP_ZOOM}
          step={0.5}
          value={warpZoom}
          onValueChange={handleZoomChange}
          disabled={expanded}
          minimumTrackTintColor="#708df4"
          maximumTrackTintColor="#C4E9F2"
          thumbTintColor="#708df4"
        />
        <ThemedText style={[styles.zoomText, styles.zoomValue, { color: Colors[scheme].textSecondary }]}>
          {warpZoom}x
        </ThemedText>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerScroll: {
    paddingHorizontal: LOOM_SCROLL_PAD,
  },
  zoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    gap: 8,
  },
  zoomRowHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  zoomSlider: {
    flex: 1,
    height: 40,
  },
  zoomText: {
    fontSize: 13,
    fontWeight: '600',
  },
  zoomValue: {
    width: 36,
    textAlign: 'right',
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
