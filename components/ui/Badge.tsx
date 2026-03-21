import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BadgeProps } from '@/types';

export const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'info',
  size = 'medium',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const getColorScheme = () => {
    switch (variant) {
      case 'success':
        return { bg: `${colors.success}20`, text: colors.success };
      case 'warning':
        return { bg: `${colors.warning}20`, text: colors.warning };
      case 'error':
        return { bg: `${colors.error}20`, text: colors.error };
      default:
        return { bg: `${colors.primary}20`, text: colors.primary };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10, borderRadius: 8 };
      default:
        return { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12, borderRadius: 12 };
    }
  };

  const { bg, text: textColor } = getColorScheme();
  const { paddingHorizontal, paddingVertical, fontSize, borderRadius } = getSizeStyles();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal,
          paddingVertical,
          borderRadius,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize,
          },
        ]}
      >
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});
