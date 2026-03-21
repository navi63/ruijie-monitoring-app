import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GaugeCardProps } from '@/types';

export const GaugeCard: React.FC<GaugeCardProps> = ({
  label,
  value,
  unit,
  percentage,
  icon,
  color,
}) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const circumference = 2 * Math.PI * 20;
  const strokeDasharray = `${(percentage / 100) * circumference}, ${circumference}`;

  return (
    <View style={[styles.container, { backgroundColor: `${colors.surface}cc`, borderColor: `${colors.border}30` }]}>
      <View style={styles.gaugeWrapper}>
        <Svg width={48} height={48} style={styles.svg}>
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke="#334155"
            strokeWidth="3"
            fill="none"
          />
          <Circle
            cx="24"
            cy="24"
            r="20"
            stroke={color}
            strokeWidth="3"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            transform="rotate(-90, 24, 24)"
            shadowColor={color}
            shadowBlur={6}
            shadowOffset={{ width: 0, height: 0 }}
          />
        </Svg>
        <View style={styles.iconContainer}>{icon}</View>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.valueRow}>
          <Text style={[styles.value, { color: colors.textPrimary }]}>{value}</Text>
          {unit && <Text style={[styles.unit, { color: colors.textSecondary }]}>{unit}</Text>}
        </View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  gaugeWrapper: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
  },
  unit: {
    fontSize: 14,
    fontWeight: '400',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
