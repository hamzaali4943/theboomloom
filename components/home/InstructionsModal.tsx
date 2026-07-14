import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SCREEN_H = Dimensions.get('window').height;

// A short, friendly guide to designing on the loom. Each tip is one quick,
// scannable line so a new weaver actually stops and reads it.
const TIPS: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '🧵',
    title: 'Pick your pattern',
    body: 'Tap any tile on the home screen to open its loom and start designing.',
  },
  {
    emoji: '🎨',
    title: 'Choose a color',
    body: 'Tap the color button, grab a swatch or mix your own, then hit save.',
  },
  {
    emoji: '⬆️',
    title: 'Build from the bottom up',
    body: 'Just like real weaving, your design grows upward, one row at a time.',
  },
  {
    emoji: '👆',
    title: 'Tap to weave',
    body: 'Tap a thread or row to color it. Tap again to undo. That is it!',
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function InstructionsModal({ visible, onClose }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const card = Colors[scheme].card;
  const border = Colors[scheme].border;
  const textSecondary = Colors[scheme].textSecondary;
  const accent = Colors[scheme].info;

  // The RN Modal's built-in "slide" animation slides the backdrop along with
  // the sheet, which looks off. Instead we keep the Modal animation off and
  // drive only the sheet ourselves; the backdrop just shows (no fade/slide).
  // `mounted` keeps the Modal alive during the out-animation.
  const [mounted, setMounted] = useState(false);
  const sheetTranslate = useRef(new Animated.Value(SCREEN_H)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      sheetTranslate.setValue(SCREEN_H);
      // Spring gives a smooth ease-out glide as the sheet settles, instead of
      // the flat, slightly snappy feel of linear timing. No bounce/overshoot.
      Animated.spring(sheetTranslate, {
        toValue: 0,
        damping: 22,
        stiffness: 220,
        mass: 0.9,
        overshootClamping: true,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(sheetTranslate, {
        toValue: SCREEN_H,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setMounted(false);
      });
    }
  }, [visible, sheetTranslate]);

  // Drag-to-close state — drag lives on the header zone only so the steps
  // ScrollView below keeps its own scroll gesture without conflict.
  const dragStartRef = useRef<number | null>(null);
  const dragDyRef = useRef(0);

  const onHeaderResponderGrant = (e: any) => {
    dragStartRef.current = e.nativeEvent.pageY;
    dragDyRef.current = 0;
  };

  const onHeaderResponderMove = (e: any) => {
    if (dragStartRef.current == null) return;
    const dy = e.nativeEvent.pageY - dragStartRef.current;
    dragDyRef.current = dy;
    if (dy > 0) sheetTranslate.setValue(dy);
  };

  const onHeaderResponderRelease = () => {
    const dy = dragDyRef.current;
    dragStartRef.current = null;
    dragDyRef.current = 0;
    if (dy > 120) {
      // Past the threshold — the close effect animates out from the
      // sheet's current dragged position.
      onClose();
    } else {
      Animated.timing(sheetTranslate, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    }
  };

  return (
    <Modal visible={mounted} animationType="none" transparent onRequestClose={onClose}>
      <View style={styles.root}>
        {/* Backdrop — static (no fade/slide); tap → close */}
        <Pressable style={styles.backdrop} onPress={onClose} />

        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: card, transform: [{ translateY: sheetTranslate }] },
          ]}
        >
          {/* Header zone — drag down here to close */}
          <View
            style={styles.headerZone}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={onHeaderResponderGrant}
            onResponderMove={onHeaderResponderMove}
            onResponderRelease={onHeaderResponderRelease}
            onResponderTerminate={onHeaderResponderRelease}
          >
            {/* Drag handle */}
            <View style={[styles.handle, { backgroundColor: border }]} />

            {/* Title */}
            <ThemedText style={styles.title}>How weaving works</ThemedText>
          </View>

          <ThemedText style={[styles.intro, { color: textSecondary }]}>
            New here? Weaving is easy. Here are four quick tips to get you going.
          </ThemedText>

          <ScrollView
            style={styles.steps}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stepsContent}
          >
            {TIPS.map((tip, i) => (
              <View key={i} style={[styles.tip, { backgroundColor: accent + '12' }]}>
                <View style={[styles.emojiWrap, { backgroundColor: accent + '20' }]}>
                  <ThemedText style={styles.emoji}>{tip.emoji}</ThemedText>
                </View>
                <View style={styles.tipText}>
                  <ThemedText style={styles.tipTitle}>{tip.title}</ThemedText>
                  <ThemedText style={[styles.tipBody, { color: textSecondary }]}>
                    {tip.body}
                  </ThemedText>
                </View>
              </View>
            ))}
          </ScrollView>

          <Pressable onPress={onClose} style={[styles.doneBtn, { backgroundColor: accent }]}>
            <ThemedText style={styles.doneBtnText}>Let’s weave!</ThemedText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    gap: 14,
    maxHeight: '82%',
  },
  headerZone: {
    gap: 14,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  intro: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: -4,
  },
  steps: {
    flexGrow: 0,
  },
  stepsContent: {
    gap: 10,
    paddingVertical: 4,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 12,
  },
  emojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  tipText: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  tipBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  doneBtn: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
