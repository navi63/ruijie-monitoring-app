import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Defs, LinearGradient as SvgLinearGradient, Stop, Path } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card, GaugeCard, Badge } from '@/components/ui';
import { MOCK_SYSTEM_HEALTH } from '@/constants/data';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.logoContainer, { backgroundColor: `${colors.primary}20` }]}>
              <MaterialIcons name="router" size={24} color={colors.primary} />
            </View>
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Stitch</Text>
              <View style={styles.statusContainer}>
                <View style={[styles.statusDot, { backgroundColor: colors.success, shadowColor: colors.success }]} />
                <Text style={[styles.statusText, { color: colors.textSecondary }]}>Online</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.surface}40` }]}>
              <MaterialIcons name="notifications" size={22} color={colors.textSecondary} />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.surface}40` }]}>
              <MaterialIcons name="person" size={22} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Network Traffic Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Network Traffic</Text>
            <TouchableOpacity>
              <Text style={[styles.viewHistoryText, { color: colors.primary }]}>View History</Text>
            </TouchableOpacity>
          </View>

          <Card style={[styles.card, { backgroundColor: `${colors.surface}cc`, borderColor: `${colors.border}30` }]}>
            <LinearGradient
              colors={[`${colors.primary}40`, 'transparent']}
              style={styles.glowBackground}
              start={{ x: 1, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            <View style={styles.cardContent}>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Total Bandwidth</Text>
              <View style={styles.bandwidthRow}>
                <Text style={[styles.bandwidthValue, { color: colors.textPrimary }]}>850</Text>
                <Text style={[styles.bandwidthUnit, { color: colors.primary }]}>Mbps</Text>
              </View>
              <View style={styles.trendRow}>
                <Badge text="+12%" variant="success" size="small" />
                <Text style={[styles.trendSubtext, { color: colors.textSecondary }]}>vs last 5 mins</Text>
              </View>
            </View>

            {/* Chart */}
            <View style={styles.chartContainer}>
              <Svg style={styles.chart} height={128} width="100%">
                <Defs>
                  <SvgLinearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor={colors.info} stopOpacity="0.4" />
                    <Stop offset="100%" stopColor={colors.info} stopOpacity="0" />
                  </SvgLinearGradient>
                </Defs>
                <Path
                  d="M0,128 L0,80 C50,80 75,50 125,65 C175,80 200,30 250,45 C300,60 325,15 375,25 C425,35 450,65 500,50 L500,128 Z"
                  fill="url(#chartGradient)"
                />
                <Path
                  d="M0,80 C50,80 75,50 125,65 C175,80 200,30 250,45 C300,60 325,15 375,25 C425,35 450,65 500,50"
                  fill="none"
                  stroke={colors.info}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </Svg>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <View style={[styles.statDot, { backgroundColor: colors.info }]} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Download</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  724 <Text style={[styles.statUnit, { color: colors.textSecondary }]}>Mbps</Text>
                </Text>
              </View>
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <View style={[styles.statDot, { backgroundColor: '#a855f7' }]} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Upload</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  126 <Text style={[styles.statUnit, { color: colors.textSecondary }]}>Mbps</Text>
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* System Health Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>System Health</Text>
          </View>

          <View style={styles.healthGrid}>
            <GaugeCard
              label="CPU Load"
              value={MOCK_SYSTEM_HEALTH.cpu}
              unit="%"
              percentage={MOCK_SYSTEM_HEALTH.cpu}
              icon={<MaterialIcons name="memory" size={20} color={colors.primary} />}
              color={colors.primary}
            />
            <GaugeCard
              label="RAM Usage"
              value={MOCK_SYSTEM_HEALTH.ram}
              unit="%"
              percentage={MOCK_SYSTEM_HEALTH.ram}
              icon={<MaterialIcons name="storage" size={20} color="#a855f7" />}
              color="#a855f7"
            />
            <GaugeCard
              label="Temp"
              value={MOCK_SYSTEM_HEALTH.temperature}
              unit="°C"
              percentage={MOCK_SYSTEM_HEALTH.temperature * 2}
              icon={<MaterialIcons name="thermostat" size={20} color={colors.warning} />}
              color={colors.warning}
            />
          </View>
        </View>

        {/* Speed Test Banner */}
        <Card style={[styles.banner, { backgroundColor: `${colors.surface}cc`, borderColor: `${colors.border}30` }]}>
          <View style={styles.bannerContent}>
            <View style={[styles.bannerIcon, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="speed" size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>Speed Test</Text>
              <Text style={[styles.bannerSubtitle, { color: colors.textSecondary }]}>Check your ISP speed</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bannerArrow}>
            <MaterialIcons name="arrow-forward-ios" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    gap: 4,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  statusText: { fontSize: 12, fontWeight: '500' },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#1c2230',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  viewHistoryText: { fontSize: 12, fontWeight: '600' },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  glowBackground: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 128,
    height: 128,
    borderRadius: 64,
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
  },
  cardLabel: { fontSize: 14, fontWeight: '500' },
  bandwidthRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginTop: 4,
  },
  bandwidthValue: { fontSize: 36, fontWeight: '700' },
  bandwidthUnit: { fontSize: 18, fontWeight: '600' },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  trendSubtext: { fontSize: 12 },
  chartContainer: {
    height: 128,
    marginTop: 24,
    position: 'relative',
  },
  chart: { height: '100%', width: '100%' },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statItem: { flex: 1 },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statDot: { width: 8, height: 8, borderRadius: 4 },
  statLabel: { fontSize: 12 },
  statValue: { fontSize: 18, fontWeight: '700' },
  statUnit: { fontSize: 12, fontWeight: '400' },
  healthGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 24,
    borderWidth: 1,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitle: { fontSize: 14, fontWeight: '700' },
  bannerSubtitle: { fontSize: 12 },
  bannerArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});
