import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Canvas, LinearGradient, Rect, vec } from '@shopify/react-native-skia';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { COLOR_PRESETS } from './weaving-data';

// ── Color conversion helpers ───────────────────────────────────────────────

function hexToHsv(hex: string): [number, number, number] {
  const c = hex.replace('#', '').padEnd(6, '0');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return [h * 360, s, v];
}

function hsvToHex(h: number, s: number, v: number): string {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60)       { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else              { r = c; b = x; }
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── Constants ──────────────────────────────────────────────────────────────

const PANEL_W = 260;
const PANEL_H = 160;
const HUE_H   = 22;

// Rainbow stops for the hue bar
const HUE_COLORS: string[] = [
  '#ff0000', '#ffff00', '#00ff00',
  '#00ffff', '#0000ff', '#ff00ff', '#ff0000',
];
const HUE_POS: number[] = [0, 1/6, 2/6, 3/6, 4/6, 5/6, 1];

// ── Component ──────────────────────────────────────────────────────────────

type Props = {
  visible: boolean;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
};

export function ColorPickerModal({ visible, selectedColor, onSelectColor, onClose }: Props) {
  const scheme = useColorScheme() ?? 'light';

  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(1);
  const [val, setVal] = useState(1);
  // sheet drag state for slide-to-close
  const [dragTranslate, setDragTranslate] = useState(0);
  const dragStartRef = useRef<number | null>(null);

  // Initialise picker to current color whenever the modal opens
  useEffect(() => {
    if (visible) {
      const [h, s, v] = hexToHsv(selectedColor);
      setHue(h);
      setSat(s);
      setVal(v);
    }
  }, [visible, selectedColor]);

  // Pure-color at current hue (used as the right-edge of the SV panel)
  const hueColor   = hsvToHex(hue, 1, 1);
  // Live preview as the user drags
  const previewColor = hsvToHex(hue, sat, val);

  // Fallback touch handlers using responder events (works reliably over Skia canvas)
  const handlePanelResponder = (e: any) => {
    const { locationX, locationY } = e.nativeEvent;
    setSat(Math.max(0, Math.min(1, locationX / PANEL_W)));
    setVal(Math.max(0, Math.min(1, 1 - locationY / PANEL_H)));
  };

  const handleHueResponder = (e: any) => {
    const { locationX } = e.nativeEvent;
    setHue(Math.max(0, Math.min(360, (locationX / PANEL_W) * 360)));
  };

  // Cursor positions (clamped so they don't overflow the panel)
  const svCursorX = Math.max(0, Math.min(PANEL_W - 16, sat * PANEL_W - 8));
  const svCursorY = Math.max(0, Math.min(PANEL_H - 16, (1 - val) * PANEL_H - 8));
  const hueCursorX = Math.max(0, Math.min(PANEL_W - 10, (hue / 360) * PANEL_W - 5));

  // sheet responder handlers to allow sliding down to close
  const onSheetResponderGrant = (e: any) => {
    dragStartRef.current = e.nativeEvent.pageY;
    setDragTranslate(0);
  };

  const onSheetResponderMove = (e: any) => {
    if (dragStartRef.current == null) return;
    const dy = e.nativeEvent.pageY - dragStartRef.current;
    if (dy > 0) setDragTranslate(dy);
  };

  const onSheetResponderRelease = () => {
    const threshold = 120;
    if (dragTranslate > threshold) {
      setDragTranslate(0);
      dragStartRef.current = null;
      onClose();
      return;
    }
    setDragTranslate(0);
    dragStartRef.current = null;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      {/* Tap outside sheet → close */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Stop sheet taps from bubbling to backdrop but allow gesture-handler touches */}
        <View
          style={[
            styles.sheet,
            { backgroundColor: Colors[scheme].card, transform: [{ translateY: dragTranslate }] },
          ]}
          onStartShouldSetResponder={() => true}
          onResponderGrant={onSheetResponderGrant}
          onResponderMove={onSheetResponderMove}
          onResponderRelease={onSheetResponderRelease}
        >

          {/* Drag handle */}
          <View style={[styles.handle, { backgroundColor: Colors[scheme].border }]} />

          <ThemedText style={styles.title}>Select Color</ThemedText>
          {/* save — commits the current preview color (the parent closes the modal) */}
          <Pressable onPress={() => onSelectColor(previewColor)} style={styles.closeBtn}>
            <ThemedText style={styles.closeBtnText}>save</ThemedText>
          </Pressable>

          {/* Live preview circle */}
          <View style={[styles.preview, { backgroundColor: previewColor, borderColor: '#708df4' }]} />

          {/* ── Saturation-Value picker ── */}
          {/*
            Canvas is purely visual — Skia intercepts native touches so we CANNOT
            wrap it with GestureDetector directly.
            Instead: render Canvas first (bottom), then a transparent GestureDetector
            overlay on top. The overlay captures all touches; Canvas just draws.
          */}
          <View style={styles.panelOuter}>
            <Canvas style={StyleSheet.absoluteFillObject}>
              <Rect x={0} y={0} width={PANEL_W} height={PANEL_H}>
                <LinearGradient
                  start={vec(0, 0)} end={vec(PANEL_W, 0)}
                  colors={['#ffffff', hueColor]}
                />
              </Rect>
              <Rect x={0} y={0} width={PANEL_W} height={PANEL_H}>
                <LinearGradient
                  start={vec(0, 0)} end={vec(0, PANEL_H)}
                  colors={['rgba(0,0,0,0)', '#000000']}
                />
              </Rect>
            </Canvas>
            {/* Cursor — above canvas, below touch overlay */}
            <View
              style={[styles.svCursor, { left: svCursorX, top: svCursorY, pointerEvents: 'none' }]}
            />
            {/* Transparent touch overlay — responder captures touches over Skia */}
            <View
              style={StyleSheet.absoluteFillObject}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handlePanelResponder}
              onResponderMove={handlePanelResponder}
            />
          </View>

          {/* ── Hue rainbow bar ── */}
          <View style={styles.hueOuter}>
            <Canvas style={StyleSheet.absoluteFillObject}>
              <Rect x={0} y={0} width={PANEL_W} height={HUE_H}>
                <LinearGradient
                  start={vec(0, 0)} end={vec(PANEL_W, 0)}
                  colors={HUE_COLORS}
                  positions={HUE_POS}
                />
              </Rect>
            </Canvas>
            <View
              style={[styles.hueCursor, { left: hueCursorX, pointerEvents: 'none' }]}
            />
            <View
              style={StyleSheet.absoluteFillObject}
              onStartShouldSetResponder={() => true}
              onResponderGrant={handleHueResponder}
              onResponderMove={handleHueResponder}
            />
          </View>

          {/* ── 6 preset swatches (3 × 2 grid) ── */}
          <View style={styles.paletteGrid}>
            {COLOR_PRESETS.map((color) => (
              <Pressable
                key={color}
                onPress={() => onSelectColor(color)}
                style={[
                  styles.swatch,
                  {
                    backgroundColor: color,
                    borderColor: selectedColor === color ? '#708df4' : Colors[scheme].border,
                    borderWidth: selectedColor === color ? 4 : 1,
                  },
                ]}
              />
            ))}
          </View>

          </View>
        </Pressable>
    </Modal>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 14,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  preview: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 4,
  },
  // SV panel
  panelOuter: {
    width: PANEL_W,
    height: PANEL_H,
    borderRadius: 10,
    overflow: 'hidden',
  },
  svCursor: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    boxShadow: '0 0 3px rgba(0,0,0,0.5)',
  },
  // Hue bar
  hueOuter: {
    width: PANEL_W,
    height: HUE_H,
    borderRadius: 11,
    overflow: 'hidden',
  },
  hueCursor: {
    position: 'absolute',
    top: -3,
    width: 10,
    height: HUE_H + 6,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
    boxShadow: '0 0 2px rgba(0,0,0,0.5)',
  },
  // Presets
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 20,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
