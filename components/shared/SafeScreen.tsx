import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/use-theme-color';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function SafeScreen({ children, style }: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }, style]}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
