import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { SafeScreen } from '@/components/shared/SafeScreen';
import { Header } from '@/components/shared/Header';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { useWeavingState } from '@/components/pattern-studio/useWeavingState';
import { PatternSelector } from '@/components/pattern-studio/PatternSelector';
import { ColorPickerModal } from '@/components/pattern-studio/ColorPickerModal';
import { WeavingLoom } from '@/components/pattern-studio/WeavingLoom';
import { ThreadSliders } from '@/components/pattern-studio/ThreadSliders';
import { TreadlingSequence } from '@/components/pattern-studio/TreadlingSequence';

export function PatternStudioScreen() {
  const scheme = useColorScheme() ?? 'light';
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  const {
    currentPattern,
    colorWa,
    colorS,
    S,
    pattern,
    selectedColor,
    sNum,
    cellWidth,
    cellHeight,
    treadlingSequence,
    selectPattern,
    colorWarp,
    toggleTreadle,
    setSelectedColor,
    setCellWidth,
    setCellHeight,
    resetAll,
  } = useWeavingState();

  const handleReset = () => {
    Alert.alert(
      'Reset Pattern',
      'Are you sure you want to clear the pattern?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetAll },
      ],
    );
  };

  return (
    <SafeScreen>
      <Header
        title="Pattern Studio"
        subtitle="Interactive weaving simulator"
        showThemeToggle
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
          onPress={() => setColorPickerVisible(true)}
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
          currentPattern={currentPattern}
          colorWa={colorWa}
          colorS={colorS}
          S={S}
          pattern={pattern}
          sNum={sNum}
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          onColorWarp={colorWarp}
          onToggleTreadle={toggleTreadle}
        />

        {/* Thread width sliders */}
        <ThemedText
          style={[styles.sliderHint, { color: Colors[scheme].textSecondary }]}
        >
          Adjust thread thickness
        </ThemedText>
        <ThreadSliders
          cellWidth={cellWidth}
          cellHeight={cellHeight}
          onCellWidthChange={setCellWidth}
          onCellHeightChange={setCellHeight}
        />

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
        onSelectColor={(c) => {
          setSelectedColor(c);
          setColorPickerVisible(false);
        }}
        onClose={() => setColorPickerVisible(false)}
      />
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
});
