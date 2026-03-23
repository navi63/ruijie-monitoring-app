import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ButtonProps } from '@/types';

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const isDisabled = disabled || isLoading;

  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    switch (variant) {
      case 'primary':
        return colors.primary;
      case 'secondary':
        return colors.success;
      case 'outline':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.textSecondary;
    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.primary; // Fixed to primary for better visibility on outline
      default:
        return '#fff';
    }
  };

  const getBorderColor = () => {
    switch (variant) {
      case 'outline':
        return colors.primary; // Use primary for outline border
      default:
        return 'transparent';
    }
  };

  const getContainerPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 16, paddingHorizontal: 32 };
      default:
        return { paddingVertical: 12, paddingHorizontal: 24 };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return 13;
      case 'large':
        return 18;
      default:
        return 15;
    }
  };

  const getContent = () => (
    <View style={[styles.content, iconPosition === 'right' && styles.contentReverse]}>
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor(), fontSize: getFontSize() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getContainerPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
        },
        style,
        disabled && { opacity: 0.5 },
      ]}
      onPress={isDisabled ? undefined : onPress}
      activeOpacity={0.7}
      disabled={isDisabled}
    >
      {getContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contentReverse: {
    flexDirection: 'row-reverse',
  },
  icon: {},
  text: {
    fontWeight: '600',
    fontSize: 14,
  },
});
