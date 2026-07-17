import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const SCREEN_H = Dimensions.get('window').height;

// The how-to resource on theboomloom.com
const HELP_URL = 'https://www.theboomloom.com/';

// A short, friendly guide to designing on the loom. Each step is numbered so it
// reads as a clear, premium walkthrough rather than a loose list of tips.
const STEPS: { emoji: string; title: string; body: string }[] = [
  {
    emoji: '◧',
    title: 'Pick your pattern',
    body: 'Tap any tile on the home screen to open a workspace.',
  },
  {
    emoji: '🎨',
    title: 'Choose a color',
    body: 'Tap the current color circle to change it. Pick one of the preset colors or select from the palette and hit save.',
  },
  {
    emoji: '👆',
    title: 'Tap to weave',
    body: 'Your loom is warped (vertical) with grey. To color a warp thread, tap on it and tap again to undo.\n\nTo weave a weft row (horizontal), tap in the pop-out grid on the right. Tap again to undo or change the color. Each number is one of the pattern-bar positions. Experiment with different bar positions to change the pattern. Boom, you are weaving!',
  },
  {
    emoji: '🧶',
    title: 'Now weave it IRL!',
    body: 'When you’re done designing, find the bar positions to make your piece on the Boss at the bottom of the screen. Save your pattern for later by tapping Save.',
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
  const text = Colors[scheme].text;
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
            {
              backgroundColor: card,
              borderColor: border,
              shadowColor: accent,
              transform: [{ translateY: sheetTranslate }],
            },
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

            {/* Eyebrow + title + subtitle */}
            <ThemedText style={[styles.eyebrow, { color: accent }]}>GETTING STARTED</ThemedText>
            <ThemedText style={[styles.title, { color: text }]}>How to use this app</ThemedText>
            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
              a quick tour of the studio ›
            </ThemedText>
          </View>

          {/* Intro card — sets the brand context with a soft accent wash */}
          <View style={[styles.introCard, { backgroundColor: accent + '0F', borderColor: accent + '22' }]}>
            <ThemedText style={[styles.introText, { color: text }]}>
              This app is made to work with the{' '}
              <ThemedText style={[styles.introStrong, { color: text }]}>Boss from Boomloom</ThemedText>,
              but the patterns can be woven on any loom.
            </ThemedText>
          </View>

          <ScrollView
            style={styles.steps}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.stepsContent}
          >
            {STEPS.map((step, i) => (
              <View
                key={i}
                style={[styles.step, { backgroundColor: card, borderColor: border, shadowColor: accent }]}
              >
                {/* Emoji glyph in a soft accent tile */}
                <View style={[styles.stepIcon, { backgroundColor: accent + '18' }]}>
                  <ThemedText style={styles.stepEmoji}>{step.emoji}</ThemedText>
                </View>

                <View style={styles.stepText}>
                  <ThemedText style={[styles.stepTitle, { color: text }]}>{step.title}</ThemedText>
                  <ThemedText style={[styles.stepBody, { color: textSecondary }]}>
                    {step.body}
                  </ThemedText>
                </View>
              </View>
            ))}

            {/* Help link out to theboomloom.com */}
            <ThemedText style={[styles.help, { color: textSecondary }]}>
              For weaving help and sample projects, check out the how-to videos at{' '}
              <ThemedText
                style={[styles.helpLink, { color: accent }]}
                onPress={() => Linking.openURL(HELP_URL).catch(() => {})}
              >
                theboomloom.com
              </ThemedText>
            </ThemedText>
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={[styles.doneBtn, { backgroundColor: accent, shadowColor: accent }]}
          >
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
    backgroundColor: 'rgba(15,16,40,0.55)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 36,
    gap: 16,
    maxHeight: '86%',
    // Soft lift off the backdrop
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
  },
  headerZone: {
    gap: 4,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
    opacity: 0.7,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 3,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  introCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 13,
    paddingHorizontal: 15,
  },
  introText: {
    fontSize: 13.5,
    lineHeight: 20,
  },
  introStrong: {
    fontWeight: '800',
  },
  steps: {
    flexGrow: 0,
  },
  stepsContent: {
    gap: 12,
    paddingVertical: 2,
    paddingBottom: 6,
  },
  step: {
    flexDirection: 'row',
    gap: 14,
    borderRadius: 18,
    borderWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15,
    // Subtle card elevation for depth
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepEmoji: {
    fontSize: 20,
    lineHeight: 24,
  },
  stepText: {
    flex: 1,
    gap: 4,
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  stepBody: {
    fontSize: 13,
    lineHeight: 19,
  },
  help: {
    fontSize: 12,
    lineHeight: 18,
    paddingHorizontal: 4,
    paddingTop: 4,
    textAlign: 'center',
  },
  helpLink: {
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  doneBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    // Accent glow lifts the primary CTA
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});
