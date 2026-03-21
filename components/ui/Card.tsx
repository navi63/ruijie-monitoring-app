import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CardProps } from '@/types';

export const Card: React.FC<CardProps> = ({
  children,
  style,
  borderColor,
  backgroundColor,
  shadow = false,
  onPress,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const cardStyle = [
    styles.card,
    {
      borderColor: borderColor || colors.border,
      backgroundColor: backgroundColor || colors.surface,
    },
    shadow && styles.shadow,
    style,
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component style={cardStyle} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
