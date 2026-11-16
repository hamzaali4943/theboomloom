import { Tabs } from 'expo-router';
import React from 'react';
import { useWindowDimensions } from 'react-native';
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

  // Centring the two visible tabs.
  //
  // React Navigation renders the items inside its own content View, which is
  // `{ flex: 1, flexDirection: 'row' }` and is not exposed as a style prop.
  // Its justifyContent defaults to flex-start, so once the items stop
  // stretching (tabBarItemStyle flex: 0) they pack to the LEFT. Setting
  // justifyContent on tabBarStyle does nothing, because that targets the outer
  // container whose single child already fills it.
  //
  // So we centre by padding the outer container symmetrically instead. The bar
  // background and border still span the full width; only the items are inset.
  //
  // NOTE: VISIBLE_TABS must match the number of tabs WITHOUT `href: null`.
  const { width: screenWidth } = useWindowDimensions();
  // Each item centres its icon, so this width also sets the visual gap between
  // the two icons. Keep it comfortably above the ~48dp minimum touch target.
  const TAB_ITEM_WIDTH = 50;
  const VISIBLE_TABS = 2; // Home + Saved
  const tabSidePadding = Math.max(
    (screenWidth - TAB_ITEM_WIDTH * VISIBLE_TABS) / 2,
    0,
  );

  return (
    <DesignLoadProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].primary,
        tabBarInactiveTintColor: Colors[colorScheme].tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
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
          // Squeezes the inner content View so the items land centred.
          paddingHorizontal: tabSidePadding,
        },
        // flex:0 stops each item claiming an equal share of the bar; without
        // it they stretch and the padding above has nothing to centre.
        tabBarItemStyle: {
          flex: 0,
          width: TAB_ITEM_WIDTH,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="house.fill" color={color} />,
        }}
      />
      {/* Pattern routes stay registered and navigable — the Home grid and the
          Saved tab both push to them — but `href: null` keeps them out of the
          tab bar, leaving only Home and Saved. */}
      <Tabs.Screen name="plain" options={{ title: 'Plain', href: null }} />
      <Tabs.Screen name="twill" options={{ title: '2/2 Twill', href: null }} />
      <Tabs.Screen name="diamond" options={{ title: 'Diamond', href: null }} />
      <Tabs.Screen name="waffle" options={{ title: 'Waffle', href: null }} />
      <Tabs.Screen name="rosepath" options={{ title: 'Rosepath', href: null }} />
      <Tabs.Screen name="monks-belt" options={{ title: "Monk's Belt", href: null }} />
      <Tabs.Screen name="krokbragd" options={{ title: 'Krokbragd', href: null }} />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ color }) => <IconSymbol size={22} name="bookmark.fill" color={color} />,
        }}
      />
    </Tabs>
    </DesignLoadProvider>
  );
}
