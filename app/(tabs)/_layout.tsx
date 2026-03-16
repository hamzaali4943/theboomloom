import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const tabBg = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const { bottom: bottomInset } = useSafeAreaInsets();

  // Base tab bar height + device bottom inset (nav buttons / home indicator)
  const TAB_HEIGHT = 60;
  const tabBarHeight = TAB_HEIGHT + bottomInset;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        // Position absolutely so the bar is flush with screen bottom on mobile
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: tabBg,
          borderTopColor: border,
          borderTopWidth: 1,
          height: tabBarHeight,
          paddingBottom: 8 + bottomInset,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="pattern-studio"
        options={{
          title: 'Patterns',
          tabBarIcon: ({ color }) => <IconSymbol size={24} name="wand.and.stars" color={color} />,
        }}
      />
    </Tabs>
  );
}
