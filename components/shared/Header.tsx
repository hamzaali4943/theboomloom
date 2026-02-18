import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemeContext } from '@/contexts/ThemeContext';

type IconName = 'bell.fill' | 'square.and.arrow.up' | 'info.circle' | 'magnifyingglass' | 'sun.max.fill' | 'moon.fill';

type RightAction = {
  icon: IconName;
  onPress: () => void;
};

type Props = {
  title: string;
  subtitle?: string;
  /** Legacy single-icon support */
  rightIcon?: IconName;
  onRightPress?: () => void;
  /** Pass multiple right actions — rendered left to right */
  rightActions?: RightAction[];
  /** Show the light/dark mode toggle button (auto-switches icon based on current theme) */
  showThemeToggle?: boolean;
};

export function Header({ title, subtitle, rightIcon, onRightPress, rightActions, showThemeToggle }: Props) {
  const scheme = useColorScheme() ?? 'light';
  const { toggleTheme } = useThemeContext();
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = Colors[scheme].primary;
  const bgColor = Colors[scheme].background;

  // Build the full list of actions
  const actions: RightAction[] = [];

  if (showThemeToggle) {
    actions.push({
      icon: scheme === 'dark' ? 'sun.max.fill' : 'moon.fill',
      onPress: toggleTheme,
    });
  }

  if (rightActions) {
    actions.push(...rightActions);
  } else if (rightIcon && onRightPress) {
    actions.push({ icon: rightIcon, onPress: onRightPress });
  }

  return (
    <View style={[styles.container, { backgroundColor: surface, borderBottomColor: border }]}>
      <View style={styles.titleBlock}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {subtitle ? (
          <ThemedText style={[styles.subtitle, { color: Colors[scheme].textSecondary }]}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>

      {actions.length > 0 && (
        <View style={styles.actionsRow}>
          {actions.map((action, i) => (
            <TouchableOpacity
              key={i}
              onPress={action.onPress}
              style={[styles.iconBtn, { backgroundColor: bgColor }]}
              activeOpacity={0.7}
            >
              <IconSymbol name={action.icon} size={22} color={primary} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
