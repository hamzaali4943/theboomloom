import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useWeavingState } from '@/components/pattern-studio/useWeavingState';
import { WARP_COUNT, TREADLE_COUNT, DH, PATTERN_ASPECT } from '@/components/pattern-studio/weaving-data';
import { PatternSelector } from '@/components/pattern-studio/PatternSelector';
import { ColorPickerModal } from '@/components/pattern-studio/ColorPickerModal';
import { WeavingLoom } from '@/components/pattern-studio/WeavingLoom';
import { ThreadSliders } from '@/components/pattern-studio/ThreadSliders';
import { TreadlingSequence } from '@/components/pattern-studio/TreadlingSequence';
import { WarpNavigator } from '@/components/shared/WarpNavigator';

// Treadle grid width + gap are fixed (match web), pattern grid fills remaining space
const TREADLE_WIDTH = TREADLE_COUNT * DH;
const GRID_GAP = Math.round(1.5 * DH);

export function PatternStudioScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [warpNavVisible, setWarpNavVisible] = useState(false);

  // Pattern grid cellWidth: fit 40 warp columns into remaining screen width
  // after subtracting padding (8*2), gap, and treadle grid.
  // gridHeight preserves the web aspect ratio (784 / 660 ≈ 1.188) so the
  // canvas scales uniformly rather than stretching vertically.
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
    currentPattern,
    selectedColor,
    loomData,
    sliderData,
    navigatorData,
    treadlingSequence,
    selectPattern,
    colorWarp,
    toggleTreadle,
    setSelectedColor,
    setWarpThreadWidth,
    setWeftThreadHeight,
    moveWarpLeft,
    moveWarpRight,
    setSelectedWarp,
    resetAll,
  } = useWeavingState(gridHeight);

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

  const handleApplyColor = useCallback(
    () => colorWarp(navigatorData.selectedWarpIndex),
    [colorWarp, navigatorData.selectedWarpIndex],
  );

  const openWarpNav = useCallback(() => {
    setSelectedWarp(0);
    setWarpNavVisible(true);
  }, [setSelectedWarp]);
  const closeWarpNav = useCallback(() => {
    setSelectedWarp(-1);
    setWarpNavVisible(false);
  }, [setSelectedWarp]);

  return (
    <SafeScreen>
      <Header
        title="Pattern Studio"
        subtitle="Interactive weaving simulator"
      />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Pattern type selector */}
        <PatternSelector current={currentPattern} onSelect={selectPattern} />

        {/* Current color button → opens modal */}
        <Pressable
          onPress={openColorPicker}
          style={styles.colorBtnRow}
        >
          <View
            style={[
              styles.colorCircle,
              { backgroundColor: selectedColor, borderColor: '#0F434F' },
            ]}
          />
          <View>
            <ThemedText style={styles.colorLabel}>Current Color</ThemedText>
            <ThemedText
              style={[
                styles.colorHint,
                { color: Colors[scheme].textSecondary },
              ]}
            >
              Tap to customize
            </ThemedText>
          </View>
        </Pressable>

        {/* Weaving loom (grids) */}
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
          warpThreadWidth={loomData.warpThreadWidth}
          weftThreadHeight={loomData.weftThreadHeight}
          selectedWarpIndex={loomData.selectedWarpIndex}
          onColorWarp={colorWarp}
          onToggleTreadle={toggleTreadle}
        />

        {/* Thread width sliders */}
        <ThemedText
          style={[styles.sliderHint, { color: Colors[scheme].textSecondary }]}
        >
          Use the sliders to change the thickness of the warp and the weft.
        </ThemedText>
        <ThreadSliders
          warpThreadWidth={sliderData.warpThreadWidth}
          weftThreadHeight={sliderData.weftThreadHeight}
          onWarpThreadWidthChange={setWarpThreadWidth}
          onWeftThreadHeightChange={setWeftThreadHeight}
        />

        {/* Warp thread navigator — opens in a modal */}
        <Pressable onPress={openWarpNav} style={styles.warpNavBtn}>
          <ThemedText style={styles.warpNavBtnText}>Select Warp Thread</ThemedText>
        </Pressable>

        {/* Treadling sequence */}
        <TreadlingSequence sequence={treadlingSequence} />

        {/* Reset button */}
        <Pressable
          onPress={handleReset}
          style={styles.resetBtn}
        >
          <ThemedText style={styles.resetText}>Reset Pattern</ThemedText>
        </Pressable>
      </ScrollView>

      {/* Color picker modal */}
      <ColorPickerModal
        visible={colorPickerVisible}
        selectedColor={selectedColor}
        onSelectColor={handleSelectColor}
        onClose={closeColorPicker}
      />

      {/* Warp navigator modal */}
      <Modal
        visible={warpNavVisible}
        transparent
        animationType="slide"
        onRequestClose={closeWarpNav}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <WarpNavigator
              selectedWarpIndex={navigatorData.selectedWarpIndex}
              selectedColor={navigatorData.selectedColor}
              onMoveLeft={moveWarpLeft}
              onMoveRight={moveWarpRight}
              onApplyColor={handleApplyColor}
            />
            <Pressable onPress={closeWarpNav} style={styles.modalCloseBtn}>
              <ThemedText style={styles.modalCloseBtnText}>Done</ThemedText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: {
    paddingTop: 12,
    paddingBottom: 40,
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
  sliderHint: {
    fontSize: 12,
    textAlign: 'center',
  },
  resetBtn: {
    marginHorizontal: 16,
    height: 48,
    backgroundColor: '#0F434F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  warpNavBtn: {
    marginHorizontal: 16,
    height: 44,
    backgroundColor: '#E8F4F8',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#C4E9F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warpNavBtnText: {
    color: '#0F434F',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 16,
    gap: 16,
  },
  modalCloseBtn: {
    height: 44,
    backgroundColor: '#0F434F',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
