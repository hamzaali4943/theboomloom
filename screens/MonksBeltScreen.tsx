import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useMonksBeltState } from '@/components/monks-belt/useMonksBeltState';
import { WARP_COUNT, TREADLE_COUNT, DH, PATTERN_ASPECT } from '@/components/monks-belt/monks-belt-data';
import { ColorPickerModal } from '@/components/shared/ColorPickerModal';
import { WeavingLoom } from '@/components/shared/WeavingLoom';
import { TreadlingSequence } from '@/components/shared/TreadlingSequence';
import { useDesignLoad } from '@/context/DesignLoadContext';
import { saveDesign } from '@/utils/saveDesign';
import type { MonksBeltSnapshot } from '@/types/saved-design';

const TREADLE_WIDTH = TREADLE_COUNT * DH;
const GRID_GAP = Math.round(1.5 * DH);

export function MonksBeltScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [tapMode, setTapMode] = useState<'thread' | 'row'>('row');
  const { pendingLoad, clearPendingLoad } = useDesignLoad();

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
  } = useMonksBeltState(gridHeight);

  useFocusEffect(
    useCallback(() => {
      if (pendingLoad?.patternType === 'monks-belt') {
        loadDesign(pendingLoad.snapshot as MonksBeltSnapshot);
        clearPendingLoad();
      }
    }, [pendingLoad, loadDesign, clearPendingLoad]),
  );

  const handleSave = useCallback(() => {
    saveDesign('monks-belt', getSnapshot())
      .then(() => Alert.alert('Saved', 'Design saved to your collection.'))
      .catch((err) => Alert.alert('Cannot Save', err?.message ?? 'Could not save the design.'));
  }, [getSnapshot]);

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

  const handleTapModeChange = useCallback((mode: 'thread' | 'row') => {
    setTapMode(mode);
    if (mode === 'row') setSelectedWarp(-1);
  }, [setSelectedWarp]);

  return (
    <SafeScreen>
      <Header
        title="pattern picker"
        subtitle="monk's belt bars"
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
            <ThemedText style={styles.colorLabel}>current color</ThemedText>
            <ThemedText
              style={[styles.colorHint, { color: Colors[scheme].textSecondary }]}
            >
              tap to customize
            </ThemedText>
          </View>
        </Pressable>

        {/* Tap mode toggle */}
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
          selectedWarpIndex={loomData.selectedWarpIndex}
          tapMode={tapMode}
          onColorWarp={colorWarp}
          onResetWarp={resetWarp}
          onSelectWarp={setSelectedWarp}
          onToggleTreadle={toggleTreadle}
        />

        {/* Treadling sequence */}
        <TreadlingSequence sequence={treadlingSequence} />

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
    backgroundColor: '#0F434F',
  },
  modeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F434F',
  },
  modeBtnTextActive: {
    color: '#ffffff',
  },
});
