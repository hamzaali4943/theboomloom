import React from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  visible: boolean;
  onClose: () => void;
  title: string;
  emoji?: string;
  children: React.ReactNode;
};

export function InfoModal({ visible, onClose, title, emoji, children }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = Colors[scheme].primary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={[styles.sheet, { backgroundColor: surface, borderTopColor: border }]}>
        {/* Handle */}
        <View style={[styles.handle, { backgroundColor: Colors[scheme].border }]} />

        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.titleRow}>
            {emoji ? <ThemedText style={styles.emoji}>{emoji}</ThemedText> : null}
            <ThemedText style={styles.title}>{title}</ThemedText>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeBtn, { backgroundColor: Colors[scheme].background }]}
            activeOpacity={0.7}
          >
            <IconSymbol name="xmark" size={18} color={Colors[scheme].icon} />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {children}
        </ScrollView>

        {/* Share button */}
        <TouchableOpacity
          style={[styles.shareBtn, { backgroundColor: primary }]}
          activeOpacity={0.85}
        >
          <IconSymbol name="square.and.arrow.up" size={18} color="#FFFFFF" />
          <ThemedText style={styles.shareBtnText}>Share</ThemedText>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    paddingBottom: 32,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    flexWrap: 'wrap',
  },
  emoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
    flexWrap: 'wrap',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginTop: 12,
    paddingVertical: 14,
    borderRadius: 14,
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
