import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  GestureResponderEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { Header } from '@/components/shared/Header';
import { SafeScreen } from '@/components/shared/SafeScreen';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { DH, KB_WARP_COUNT, PATTERN_ASPECT } from '@/components/krokbragd/krokbragd-data';
import { SkiaKrokbragdGrid } from '@/components/krokbragd/SkiaKrokbragdGrid';
import {
  SkiaKrokbragdTreadleGrid,
  getKrokbragdTreadleGridWidth,
  getKrokbragdTreadleHitTest,
} from '@/components/krokbragd/SkiaKrokbragdTreadleGrid';
import { useKrokbragdState } from '@/components/krokbragd/useKrokbragdState';
import { ColorPickerModal } from '@/components/shared/ColorPickerModal';
import { LOOM_BOTTOM_PAD, LOOM_TOP_PAD, LoomFrame } from '@/components/shared/LoomFrame';
import { useDesignLoad } from '@/context/DesignLoadContext';
import type { KrokbragdSnapshot } from '@/types/saved-design';
import { saveDesign } from '@/utils/saveDesign';

const GRID_GAP = Math.round(1.0 * DH);

export function KrokbragdScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(-1);
  // The first tap on the treadle grid only pops it out to ~1/3 of the screen for
  // easier tapping; once expanded, taps toggle treadles. Tapping the pattern
  // workspace collapses it back.
  const [expanded, setExpanded] = useState(false);
  const { pendingLoad, clearPendingLoad } = useDesignLoad();

  // Weaving builds from the bottom up, so start the view resting at the bottom
  // of the loom (row 0) instead of the top. Scroll to the end once the content
  // has laid out; the guard keeps later content changes from yanking the view.
  const scrollRef = useRef<ScrollView>(null);
  const didInitialScroll = useRef(false);
  const scrollToBottom = useCallback(() => {
    if (didInitialScroll.current) return;
    didInitialScroll.current = true;
    scrollRef.current?.scrollToEnd({ animated: false });
  }, []);
  // On tab switch the content size may not change (the loom is already laid
  // out), so onContentSizeChange won't fire. Reset the view to the bottom
  // directly on focus. The Krokbragd loom is Skia-rendered and its final
  // height only settles a couple of frames after focus, so a single rAF fires
  // too early and the scroll lands short. Retry over several frames to catch
  // the settled layout.
  const resetViewToBottom = useCallback(() => {
    didInitialScroll.current = false;
    let frame = 0;
    const tick = () => {
      scrollRef.current?.scrollToEnd({ animated: false });
      if (frame++ < 5) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const screenWidth = Dimensions.get('window').width;

  // Natural (collapsed) treadle band width — drives the base pattern cell width.
  const naturalTreadleGridWidth = getKrokbragdTreadleGridWidth();

  // Treadle column width: DH normally, widened when expanded so the staggered
  // treadle band spans ~1/3 of the screen.
  const expandedTreadleCellWidth = useMemo(() => {
    // Invert getKrokbragdTreadleGridWidth() for a target width of screenWidth/3:
    // width = tr*cw + (tr-1)*hshift, hshift = (8.33/16.67)*cw → width = cw*(tr + (tr-1)*ratio)
    const ratio = 8.33 / 16.67;
    const factor = 3 + 2 * ratio; // KB_TREADLE_COUNT = 3
    return Math.max(DH, Math.round(screenWidth / 3 / factor));
  }, [screenWidth]);
  const treadleCellWidth = expanded ? expandedTreadleCellWidth : DH;
  const treadleGridWidth = getKrokbragdTreadleGridWidth(treadleCellWidth);

  // Base pattern cell width uses the natural treadle band so the collapsed
  // layout is unchanged. When expanded, the pattern grid compresses to fit.
  const baseCellWidth = useMemo(
    () => Math.floor((screenWidth - 16 - GRID_GAP - naturalTreadleGridWidth) / KB_WARP_COUNT),
    [screenWidth, naturalTreadleGridWidth],
  );
  const cellWidth = useMemo(() => {
    if (!expanded) return baseCellWidth;
    const available = screenWidth - treadleGridWidth - GRID_GAP - 16;
    const shrunk = Math.floor(available / KB_WARP_COUNT);
    return Math.max(2, Math.min(baseCellWidth, shrunk));
  }, [expanded, baseCellWidth, screenWidth, treadleGridWidth]);

  // gridHeight stays tied to the natural cell width so the loom height (and the
  // treadle/pattern row alignment) does not jump when expanding.
  const gridHeight = useMemo(
    () => Math.round(KB_WARP_COUNT * baseCellWidth * PATTERN_ASPECT),
    [baseCellWidth],
  );

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
      // Re-entering the tab starts in normal mode (treadle grid collapsed).
      setExpanded(false);
      setSelectedRowIndex(-1);
      // Reset the bottom-first view on every re-entry (e.g. switching patterns).
      resetViewToBottom();
      if (pendingLoad?.patternType === 'krokbragd') {
        loadDesign(pendingLoad.snapshot as KrokbragdSnapshot);
        clearPendingLoad();
      }
    }, [pendingLoad, loadDesign, clearPendingLoad, resetViewToBottom]),
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
  const KB_TOP_EXTEND = 0;
  const patternGridWidth = KB_WARP_COUNT * cellWidth;
  const loomTopPad = LOOM_TOP_PAD + KB_TOP_EXTEND;
  const loomBottomPad = LOOM_BOTTOM_PAD;
  const loomCanvasHeight = loomTopPad + gridHeight + loomBottomPad;
  const totalWidth = patternGridWidth + GRID_GAP + treadleGridWidth;

  // Touch handler for the staggered treadle grid
  const handleTreadleTouch = useCallback(
    (e: GestureResponderEvent) => {
      // First tap while collapsed only pops the band out — it does NOT toggle a
      // treadle. This stops accidental edits from a guess at the tiny collapsed
      // cells; you open the band first, then work on the comfortable wide cells.
      if (!expanded) {
        setExpanded(true);
        return;
      }

      const x = e.nativeEvent.locationX;
      const y = e.nativeEvent.locationY;
      const hit = getKrokbragdTreadleHitTest(x, y, loomTopPad, gridHeight, treadleCellWidth);
      if (hit && hit.row >= 0 && hit.row < sNum) {
        toggleTreadle(hit.row, hit.col);
      }
    },
    [expanded, loomTopPad, gridHeight, sNum, treadleCellWidth, toggleTreadle],
  );

  // Touch handler for pattern grid — row selection only (no warp coloring)
  const handlePatternTouch = useCallback(
    (e: GestureResponderEvent) => {
      const y = e.nativeEvent.locationY;
      // Tapping back on the main workspace collapses the expanded treadle grid.
      setExpanded(false);
      const row = Math.floor((loomTopPad + gridHeight - y) / cellHeight);
      if (row >= 0 && row < sNum) {
        setSelectedRowIndex((prev) => (prev === row ? -1 : row));
      }
    },
    [loomTopPad, gridHeight, cellHeight, sNum],
  );

  // Treadle column numbers (1, 2, 3) — positioned to match staggered columns
  const treadleColStep = treadleCellWidth + treadleCellWidth * (8.33 / 16.67); // cellWidth + hshift
  const treadleNumbers = [1, 2, 3];

  const handleReset = useCallback(() => {
    Alert.alert(
      'Reset Pattern',
      'Are you sure you want to clear the pattern?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset returns to the original collapsed layout.
            setExpanded(false);
            setSelectedRowIndex(-1);
            resetAll();
          },
        },
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
        title="krokbragd"
        subtitle="Scandinavian rug weave"
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onContentSizeChange={scrollToBottom}
      >
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
                {/* Pattern + treadle resize together on expand; fade the whole
                    row as one unit so the Skia canvas resize is hidden. */}
                <Animated.View style={{ flexDirection: 'row', opacity: fadeAnim }}>
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

                  {/* Krokbragd staggered treadle grid — widens when expanded */}
                  <View style={{ width: treadleGridWidth }}>
                    <Pressable onPress={handleTreadleTouch}>
                      <SkiaKrokbragdTreadleGrid
                        S={S}
                        colorCells={colorCells}
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

        {/* Current color button sits below the loom, near your focus at the
            bottom of the weave. */}
        <Pressable onPress={openColorPicker} style={styles.colorBtnRow}>
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: selectedColor, borderColor: '#708df4' },
            ]}
          />
          <View>
            <ThemedText style={styles.colorLabel}>current color</ThemedText>
            <ThemedText
              style={[styles.colorHint, { color: Colors[scheme].textSecondary }]}
            >
              tap to customize
            </ThemedText>
          </View>
        </Pressable>

        {/* Color sequence display — only shown once a pattern has been drawn */}
        {colorSequence.length > 0 && (
          <View style={[styles.seqContainer, { backgroundColor: Colors[scheme].surface }]}>
            <ThemedText style={styles.seqHeading}>
              Bar positions, from bottom to top
            </ThemedText>
            <View style={styles.seqBox}>
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
            </View>
          </View>
        )}

        <View style={styles.actionRow}>
          <Pressable onPress={handleSave} style={[styles.actionBtn, styles.saveBtn]}>
            <ThemedText style={styles.saveBtnText}>save design</ThemedText>
          </Pressable>
          <Pressable onPress={handleReset} style={[styles.actionBtn, styles.resetBtn]}>
            <ThemedText style={styles.resetText}>reset</ThemedText>
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
    color: '#708df4',
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
    color: '#708df4',
    fontSize: 18,
    fontWeight: '700',
  },
  seqNumber: {
    fontSize: 14,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
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
    borderColor: '#708df4',
  },
  saveBtnText: {
    color: '#708df4',
    fontSize: 15,
    fontWeight: '700',
  },
  resetBtn: {
    backgroundColor: '#ff3130',
  },
  resetText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
