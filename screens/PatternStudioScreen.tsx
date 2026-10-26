/**
 * PatternStudioScreen — the single screen behind Plain, 2/2 Twill, Diamond
 * and Waffle.
 *
 * These four patterns share one state engine (useWeavingState): 40 warps,
 * 4 treadles, one treadle active per row, one weft colour per row. They
 * differed only in a pattern index and a few labels, so they are driven from
 * here instead of four near-identical copies.
 *
 * Each tab route is a thin wrapper that supplies the props below, e.g.
 *   <PatternStudioScreen patternType="waffle" patternIndex={3} … />
 *
 * NOT used by Monk's Belt (different snapshot shape — see WAFFLE_PATTERN_PLAN
 * §5) or Krokbragd (different grid, treadle count, colour model and renderer).
 */

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useWeavingState } from '@/components/pattern-studio/useWeavingState';
import type { PatternIndex } from '@/components/pattern-studio/pattern-data';
import { WARP_COUNT, TREADLE_COUNT, DH, PATTERN_ASPECT } from '@/components/shared/weaving-data';
import { ColorPickerModal } from '@/components/shared/ColorPickerModal';
import { WeavingLoom } from '@/components/shared/WeavingLoom';
import { TreadlingSequence } from '@/components/shared/TreadlingSequence';
import { useDesignLoad } from '@/context/DesignLoadContext';
import { saveDesign } from '@/utils/saveDesign';
import type { PatternType, WeavingSnapshot } from '@/types/saved-design';

const TREADLE_WIDTH = TREADLE_COUNT * DH;
const GRID_GAP = Math.round(1.5 * DH);

type Props = {
  /** Which saved-design bucket this screen reads and writes. */
  patternType: PatternType;
  /** Index into PATTERN_ROWS — 0 plain, 1 twill, 2 diamond, 3 waffle. */
  patternIndex: PatternIndex;
  title: string;
  subtitle: string;
};

export function PatternStudioScreen({
  patternType,
  patternIndex,
  title,
  subtitle,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [tapMode, setTapMode] = useState<'thread' | 'row'>('thread');
  // Bumped on reset to force the treadle grid back to collapsed.
  const [resetKey, setResetKey] = useState(0);
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
  // directly on focus after layout has settled.
  const resetViewToBottom = useCallback(() => {
    didInitialScroll.current = false;
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: false }));
  }, []);

  const screenWidth = Dimensions.get('window').width;
  const cellWidth = useMemo(
    () => Math.floor((screenWidth - 16 - GRID_GAP - TREADLE_WIDTH) / WARP_COUNT),
    [screenWidth],
  );
  const gridHeight = useMemo(
    () => Math.round(WARP_COUNT * cellWidth * PATTERN_ASPECT),
    [cellWidth],
  );

  const {
    selectedColor,
    loomData,
    treadlingSequence,
    colorWarp,
    resetWarp,
    toggleTreadle,
    setSelectedColor,
    setSelectedWarp,
    resetAll,
    loadDesign,
    getSnapshot,
  } = useWeavingState(gridHeight, patternIndex);

  // When this screen gains focus and a design for this pattern is pending,
  // restore it.
  useFocusEffect(
    useCallback(() => {
      // Re-entering the tab defaults to warp mode (treadle grid not expanded).
      setTapMode('thread');
      // Reset the bottom-first view on every re-entry (e.g. switching patterns).
      resetViewToBottom();
      if (pendingLoad?.patternType === patternType) {
        loadDesign(pendingLoad.snapshot as WeavingSnapshot);
        clearPendingLoad();
      }
    }, [pendingLoad, patternType, loadDesign, clearPendingLoad, resetViewToBottom]),
  );

  const handleSave = useCallback(() => {
    saveDesign(patternType, getSnapshot())
      .then(() => Alert.alert('Saved', 'Design saved to your collection.'))
      .catch((err) => Alert.alert('Cannot Save', err?.message ?? 'Could not save the design.'));
  }, [patternType, getSnapshot]);

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
            // Reset returns to the default warp mode and collapsed layout.
            setTapMode('thread');
            setResetKey((k) => k + 1);
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

  const handleTapModeChange = useCallback((mode: 'thread' | 'row') => {
    setTapMode(mode);
    if (mode === 'row') setSelectedWarp(-1);
  }, [setSelectedWarp]);

  return (
    <SafeScreen>
      <Header
        title={title}
        subtitle={subtitle}
      />

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        onContentSizeChange={scrollToBottom}
      >
        <WeavingLoom
          currentPattern={loomData.currentPattern}
          colorWa={loomData.colorWa}
          colorS={loomData.colorS}
          S={loomData.S}
          pattern={loomData.pattern}
          sNum={loomData.sNum}
          cellWidth={cellWidth}
          cellHeight={loomData.cellHeight}
          gridHeight={gridHeight}
          selectedWarpIndex={loomData.selectedWarpIndex}
          tapMode={tapMode}
          resetKey={resetKey}
          onColorWarp={colorWarp}
          onResetWarp={resetWarp}
          onSelectWarp={setSelectedWarp}
          onToggleTreadle={toggleTreadle}
        />

        {/* Color + mode controls sit below the loom, near your focus at the
            bottom of the weave. */}
        <Pressable
          onPress={openColorPicker}
          style={styles.colorBtnRow}
        >
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: selectedColor, borderColor: '#708df4' },
            ]}
          />
          <View>
            <ThemedText style={styles.colorLabel}>current color</ThemedText>
            <ThemedText
              style={[
                styles.colorHint,
                { color: Colors[scheme].textSecondary },
              ]}
            >
              tap to customize
            </ThemedText>
          </View>
        </Pressable>

        <View style={styles.modeToggle}>
          <Pressable
            style={[styles.modeBtn, tapMode === 'thread' && styles.modeBtnActive]}
            onPress={() => handleTapModeChange('thread')}
          >
            <ThemedText style={[styles.modeBtnText, tapMode === 'thread' && styles.modeBtnTextActive]}>
              warp
            </ThemedText>
          </Pressable>
          <Pressable
            style={[styles.modeBtn, tapMode === 'row' && styles.modeBtnActive]}
            onPress={() => handleTapModeChange('row')}
          >
            <ThemedText style={[styles.modeBtnText, tapMode === 'row' && styles.modeBtnTextActive]}>
              weft
            </ThemedText>
          </Pressable>
        </View>

        <TreadlingSequence sequence={treadlingSequence} />

        <View style={styles.actionRow}>
          <Pressable onPress={handleSave} style={[styles.actionBtn, styles.saveBtn]}>
            <ThemedText style={styles.saveBtnText}>save design</ThemedText>
          </Pressable>
          <Pressable onPress={handleReset} style={[styles.actionBtn, styles.resetBtn]}>
            <ThemedText style={styles.resetText}>reset</ThemedText>
          </Pressable>
        </View>
      </ScrollView>

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
  modeToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#E8F4F8',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C4E9F2',
    padding: 3,
    gap: 3,
  },
  modeBtn: {
    flex: 1,
    height: 36,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#708df4',
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#708df4',
  },
  modeBtnTextActive: {
    color: '#ffffff',
  },
});
