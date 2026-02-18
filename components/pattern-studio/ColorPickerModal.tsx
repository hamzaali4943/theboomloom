import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { COLOR_PRESETS } from './weaving-data';

type Props = {
  visible: boolean;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  onClose: () => void;
};

export function ColorPickerModal({
  visible,
  selectedColor,
  onSelectColor,
  onClose,
}: Props) {
  const scheme = useColorScheme() ?? 'light';
  const [hexInput, setHexInput] = React.useState(selectedColor);

  React.useEffect(() => {
    if (visible) setHexInput(selectedColor);
  }, [visible, selectedColor]);

  const applyHex = () => {
    const cleaned = hexInput.startsWith('#') ? hexInput : `#${hexInput}`;
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(cleaned)) {
      onSelectColor(cleaned);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={[
            styles.sheet,
            { backgroundColor: Colors[scheme].card },
          ]}
        >
          {/* Handle bar */}
          <View
            style={[styles.handle, { backgroundColor: Colors[scheme].border }]}
          />

          <ThemedText style={styles.title}>Select Color</ThemedText>

          {/* Current color preview */}
          <View
            style={[
              styles.preview,
              {
                backgroundColor: selectedColor,
                borderColor: Colors[scheme].border,
              },
            ]}
          />

          {/* Preset grid */}
          <View style={styles.presetGrid}>
            {COLOR_PRESETS.map((color) => (
              <Pressable
                key={color}
                onPress={() => onSelectColor(color)}
                style={[
                  styles.presetSwatch,
                  {
                    backgroundColor: color,
                    borderColor:
                      selectedColor === color
                        ? '#0F434F'
                        : Colors[scheme].border,
                    borderWidth: selectedColor === color ? 3 : 1,
                  },
                ]}
              />
            ))}
          </View>

          {/* Custom hex input */}
          <ThemedText
            style={[styles.label, { color: Colors[scheme].textSecondary }]}
          >
            Custom HEX
          </ThemedText>
          <View style={styles.hexRow}>
            <TextInput
              style={[
                styles.hexInput,
                {
                  color: Colors[scheme].text,
                  borderColor: Colors[scheme].border,
                  backgroundColor: Colors[scheme].background,
                },
              ]}
              value={hexInput}
              onChangeText={setHexInput}
              onSubmitEditing={applyHex}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="#5170ff"
              placeholderTextColor={Colors[scheme].textMuted}
              maxLength={7}
            />
            <Pressable
              onPress={applyHex}
              style={[styles.applyBtn, { backgroundColor: '#0F434F' }]}
            >
              <ThemedText style={styles.applyText}>Apply</ThemedText>
            </Pressable>
          </View>

          {/* Close */}
          <Pressable
            onPress={onClose}
            style={[
              styles.closeBtn,
              { borderColor: Colors[scheme].border },
            ]}
          >
            <ThemedText style={styles.closeBtnText}>Done</ThemedText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

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
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  preview: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    marginBottom: 20,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  presetSwatch: {
    width: 48,
    height: 48,
    borderRadius: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  hexRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginBottom: 20,
  },
  hexInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  applyBtn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  applyText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  closeBtn: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
