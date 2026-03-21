import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ToggleProps } from '@/types';

export const Toggle: React.FC<ToggleProps> = ({
  value,
  onValueChange,
  size = 'medium',
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { width: 36, height: 20, knobSize: 16 };
      case 'large':
        return { width: 52, height: 28, knobSize: 24 };
      default:
        return { width: 44, height: 24, knobSize: 20 };
    }
  };

  const { width, height, knobSize } = getSizeStyles();

  return (
    <TouchableOpacity
      style={[
        styles.toggle,
        {
          width,
          height,
          backgroundColor: value ? colors.primary : colors.border,
        },
      ]}
      onPress={() => onValueChange(!value)}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.knob,
          {
            width: knobSize,
            height: knobSize,
            marginLeft: value ? width - knobSize - 4 : 4,
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggle: {
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  knob: {
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
