import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Svg, Path, Defs, LinearGradient as SvgLinearGradient, Stop, Circle } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card, Badge } from '@/components/ui';
import { MOCK_TOP_CONSUMERS, MOCK_MONTHLY_SUMMARY, MOCK_CHART_DATA, TIME_FILTER_OPTIONS } from '@/constants/data';

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [timeFilter, setTimeFilter] = useState<'Day' | 'Week' | 'Month' | 'Year'>('Week');

  const chartWidth = 400;
  const chartHeight = 150;

  // Generate SVG path from data points
  const generateChartPath = (data: typeof MOCK_CHART_DATA, width: number, height: number) => {
    if (data.length === 0) return '';
    let d = `M${data[0].x * (width / 472)},${height - data[0].y}`;
    for (let i = 1; i < data.length; i++) {
      const point = data[i];
      const prev = data[i - 1];
      const cp1x = prev.x + (point.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (point.x - prev.x) / 2;
      const cp2y = point.y;
      const x = point.x * (width / 472);
      const y = height - point.y;
      d += ` C${cp1x * (width / 472)},${height - cp1y} ${cp2x * (width / 472)},${height - cp2y} ${x},${y}`;
    }
    return d;
  };

  const chartPath = generateChartPath(MOCK_CHART_DATA, chartWidth, chartHeight);
  const areaPath = `${chartPath} V${chartHeight} H0 Z`;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: `${colors.surface}40` }]}>
            <MaterialIcons name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Usage Statistics</Text>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: `${colors.surface}40` }]}>
            <MaterialIcons name="more-horiz" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Time Filter */}
        <View style={styles.timeFilter}>
          {TIME_FILTER_OPTIONS.map((period) => (
            <TouchableOpacity
              key={period}
              style={[
                styles.timeFilterButton,
                timeFilter === period && styles.timeFilterButtonActive,
                timeFilter === period
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.surfaceCard, borderColor: colors.borderLight },
              ]}
              onPress={() => setTimeFilter(period)}
            >
              <Text
                style={[
                  styles.timeFilterButtonText,
                  timeFilter === period && styles.timeFilterButtonTextActive,
                  { color: timeFilter === period ? '#fff' : colors.textTertiary },
                ]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={[styles.chartLabel, { color: colors.textSecondary }]}>Total Bandwidth</Text>
            <View style={styles.bandwidthRow}>
              <Text style={[styles.bandwidthValue, { color: colors.textPrimary }]}>1.2 TB</Text>
              <Badge text="+5.2%" variant="success" size="small" />
            </View>
            <Text style={[styles.bandwidthSubtext, { color: colors.textSecondary }]}>vs. last week</Text>
          </View>

          <View style={[styles.chartContainer, { backgroundColor: `${colors.primary}05`, borderColor: `${colors.border}10` }]}>
            <Svg width={chartWidth} height={chartHeight} style={{ width: '100%', height: '100%' }} preserveAspectRatio="none">
              <Defs>
                <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.4" />
                  <Stop offset="100%" stopColor={colors.primary} stopOpacity="0" />
                </SvgLinearGradient>
              </Defs>
              <Path d={areaPath} fill="url(#chartGradient)" />
              <Path d={chartPath} fill="none" stroke={colors.primary} strokeWidth="3" strokeLinecap="round" />
            </Svg>

            {/* Axis Labels */}
            <View style={styles.axisLabels}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <Text key={day} style={[styles.axisLabel, { color: colors.textSecondary }]}>{day}</Text>
              ))}
            </View>
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary, shadowColor: colors.primary }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Download</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.legendText, { color: colors.textSecondary }]}>Upload</Text>
            </View>
          </View>
        </View>

        {/* Top Consumers */}
        <View style={styles.topConsumersSection}>
          <View style={styles.topConsumersHeader}>
            <Text style={[styles.topConsumersTitle, { color: colors.textPrimary }]}>Top Consumers</Text>
          </View>

          <View style={styles.topConsumersList}>
            {MOCK_TOP_CONSUMERS.map((device) => (
              <Card
                key={device.id}
                style={[styles.consumerCard, { backgroundColor: colors.surfaceCard, borderColor: `${colors.border}10` }]}
              >
                <View style={[styles.consumerIcon, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
                  <MaterialIcons name={device.icon as any} size={22} color={device.color} />
                </View>
                <View style={styles.consumerInfo}>
                  <View style={styles.consumerNameRow}>
                    <Text style={[styles.consumerName, { color: colors.textPrimary }]}>{device.name}</Text>
                    <Text style={[styles.consumerUsage, { color: colors.textSecondary }]}>{device.usage}</Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: colors.background }]}>
                    <View style={[styles.progressFill, { width: `${device.percentage}%`, backgroundColor: device.color }]} />
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* Monthly Summary */}
        <Card style={[styles.summaryCard, { backgroundColor: colors.surfaceCard, borderColor: `${colors.border}10` }]}>
          <View style={styles.summaryHeader}>
            <MaterialIcons name="insights" size={20} color={colors.primary} />
            <Text style={[styles.summaryTitle, { color: colors.textPrimary }]}>Monthly Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Peak Usage Time</Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{MOCK_MONTHLY_SUMMARY.peakUsageTime}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Devices</Text>
              <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{MOCK_MONTHLY_SUMMARY.totalDevices} Active</Text>
            </View>
          </View>
        </Card>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  timeFilter: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  timeFilterButton: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  timeFilterButtonActive: {},
  timeFilterButtonText: { fontSize: 14, fontWeight: '500' },
  timeFilterButtonTextActive: {},
  chartSection: {
    padding: 16,
    gap: 16,
  },
  chartHeader: { gap: 4 },
  chartLabel: { fontSize: 14, fontWeight: '500' },
  bandwidthRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
  },
  bandwidthValue: { fontSize: 36, fontWeight: '700' },
  bandwidthSubtext: { fontSize: 12, marginTop: 4 },
  chartContainer: {
    height: 256,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  axisLabels: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: { fontSize: 10, fontWeight: '500' },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  legendText: { fontSize: 12 },
  topConsumersSection: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  topConsumersHeader: {
    marginBottom: 16,
  },
  topConsumersTitle: { fontSize: 18, fontWeight: '700' },
  topConsumersList: { gap: 16 },
  consumerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12,
    borderWidth: 1,
  },
  consumerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  consumerInfo: { flex: 1, gap: 6 },
  consumerNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consumerName: { fontSize: 14, fontWeight: '500' },
  consumerUsage: { fontSize: 12, fontWeight: '500' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  summaryTitle: { fontSize: 14, fontWeight: '600' },
  summaryGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  summaryItem: { flex: 1 },
  summaryLabel: { fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: '500' },
});
