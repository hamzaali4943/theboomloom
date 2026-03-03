import React from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type Props = {
  warpThreadWidth: number;
  weftThreadHeight: number;
  onWarpThreadWidthChange: (v: number) => void;
  onWeftThreadHeightChange: (v: number) => void;
};

export const ThreadSliders = React.memo(function ThreadSliders({
  warpThreadWidth,
  weftThreadHeight,
  onWarpThreadWidthChange,
  onWeftThreadHeightChange,
}: Props) {
  const scheme = useColorScheme() ?? 'light';

  return (
    <View style={styles.container}>
      <View style={styles.sliderWrap}>
        <ThemedText
          style={[styles.label, { color: Colors[scheme].textSecondary }]}
        >
          Warp Width
        </ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={13}
          step={1}
          value={warpThreadWidth}
          onValueChange={onWarpThreadWidthChange}
          minimumTrackTintColor="#0F434F"
          maximumTrackTintColor="#C4E9F2"
          thumbTintColor="#0F434F"
        />
      </View>

      <View style={styles.sliderWrap}>
        <ThemedText
          style={[styles.label, { color: Colors[scheme].textSecondary }]}
        >
          Weft Height
        </ThemedText>
        <Slider
          style={styles.slider}
          minimumValue={10}
          maximumValue={17}
          step={1}
          value={weftThreadHeight}
          onValueChange={onWeftThreadHeightChange}
          minimumTrackTintColor="#0F434F"
          maximumTrackTintColor="#C4E9F2"
          thumbTintColor="#0F434F"
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
  },
  sliderWrap: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
