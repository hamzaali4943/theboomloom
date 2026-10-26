import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { DesignLoadProvider } from '@/context/DesignLoadContext';

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? 'light';
  const tabBg = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const { bottom: bottomInset } = useSafeAreaInsets();

  // Base tab bar height + device bottom inset (nav buttons / home indicator)
  const TAB_HEIGHT = 60;
  const tabBarHeight = TAB_HEIGHT + bottomInset;

  return (
    <DesignLoadProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        // Icon-only tabs. With nine tabs there is not enough width for text —
        // labels truncated to "2/2 T...", "Diam...", "Rose..." and so on, which
        // read worse than nothing. Each pattern's icon is its initial letter.
        // `title` is kept on every screen so screen readers still announce the
        // full name.
        tabBarShowLabel: false,
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
          // No label row to leave space for, so the icon centres in the bar.
          paddingBottom: bottomInset,
          paddingTop: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="plain"
        options={{
          title: 'Plain',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>P</Text>,
        }}
      />
      <Tabs.Screen
        name="twill"
        options={{
          title: '2/2 Twill',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>T</Text>,
        }}
      />
      <Tabs.Screen
        name="diamond"
        options={{
          title: 'Diamond',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>D</Text>,
        }}
      />
      <Tabs.Screen
        name="waffle"
        options={{
          title: 'Waffle',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>W</Text>,
        }}
      />
      <Tabs.Screen
        name="rosepath"
        options={{
          title: 'Rosepath',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>R</Text>,
        }}
      />
      <Tabs.Screen
        name="monks-belt"
        options={{
          title: "Monk's Belt",
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>M</Text>,
        }}
      />
      <Tabs.Screen
        name="krokbragd"
        options={{
          title: 'Krokbragd',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>K</Text>,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20, fontWeight: '800' }}>S</Text>,
        }}
      />
    </Tabs>
    </DesignLoadProvider>
  );
}
