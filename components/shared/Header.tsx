import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';

type IconName = 'bell.fill' | 'square.and.arrow.up' | 'info.circle' | 'magnifyingglass';

type RightAction = {
  icon: IconName;
  onPress: () => void;
};

type Props = {
  title: string;
  subtitle?: string;
  rightIcon?: IconName;
  onRightPress?: () => void;
  rightActions?: RightAction[];
};

export function Header({ title, subtitle, rightIcon, onRightPress, rightActions }: Props) {
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const primary = Colors.light.primary;
  const bgColor = Colors.light.background;

  const actions: RightAction[] = [];

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
          <ThemedText style={[styles.subtitle, { color: Colors.light.textSecondary }]}>
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
