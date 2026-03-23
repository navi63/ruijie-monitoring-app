import React from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card, Toggle, Badge } from '@/components/ui';
import { useDevices } from '@/hooks';
import { useRouterOverview } from '@/hooks/useRouterOverview';
import { DEVICE_FILTER_OPTIONS, SIGNAL_STRENGTH_COLORS } from '@/constants/data';

export default function ClientsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const {
    filteredDevices,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    toggleDeviceExpanded,
    toggleDeviceAccess,
    updateBandwidthLimit,
    stats,
  } = useDevices();

  const { downRate, upRate } = useRouterOverview();

  const getSignalColor = (signal: string) => {
    const key = signal as keyof typeof SIGNAL_STRENGTH_COLORS;
    return SIGNAL_STRENGTH_COLORS[key] || colors.textSecondary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.surface}40` }]}>
            <MaterialIcons name="arrow-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Connected Devices</Text>
          <TouchableOpacity style={[styles.iconButton, { backgroundColor: `${colors.surface}40` }]}>
            <MaterialIcons name="settings" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, backgroundColor: colors.surface }]}
            placeholder="Search by name, IP, or MAC..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <View style={styles.statIconRow}>
              <View style={[styles.statIconContainer, { backgroundColor: `${colors.success}10` }]}>
                <MaterialIcons name="arrow-downward" size={16} color={colors.success} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>DOWNLOAD</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {downRate.value} <Text style={[styles.statUnit, { color: colors.textSecondary }]}>{downRate.unit}</Text>
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <View style={styles.statIconRow}>
              <View style={[styles.statIconContainer, { backgroundColor: `${colors.primary}10` }]}>
                <MaterialIcons name="arrow-upward" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>UPLOAD</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.textPrimary }]}>
              {upRate.value} <Text style={[styles.statUnit, { color: colors.textSecondary }]}>{upRate.unit}</Text>
            </Text>
          </Card>
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {DEVICE_FILTER_OPTIONS.map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterTab,
                filter === filterOption && styles.filterTabActive,
                filter === filterOption
                  ? { backgroundColor: colors.primary }
                  : { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  filter === filterOption && styles.filterTabTextActive,
                  { color: filter === filterOption ? '#fff' : colors.textSecondary },
                ]}
              >
                {filterOption === 'all' && `All Devices (${stats.total})`}
                {filterOption === 'active' && `Active (${stats.active})`}
                {filterOption === 'blocked' && `Blocked (${stats.blocked})`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Device List */}
        <View style={styles.devicesContainer}>
          {/* Active Devices */}
          {filteredDevices.filter((d) => !d.blocked).length > 0 && (
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>CONNECTED DEVICES</Text>
          )}

          {filteredDevices.filter((d) => !d.blocked).map((device) => (
            <Card
              key={device.id}
              style={[
                styles.deviceCard,
                device.expanded && { borderColor: `${colors.primary}30` },
              ]}
              onPress={() => toggleDeviceExpanded(device.id)}
            >
              <View style={styles.deviceHeader}>
                <View style={styles.deviceLeft}>
                  <View style={[styles.deviceIcon, { backgroundColor: `${colors.background}40` }]}>
                    <MaterialIcons name={device.icon as any} size={22} color={device.active ? colors.primary : colors.textSecondary} />
                    {device.active && <View style={[styles.deviceStatusDot, { backgroundColor: colors.success }]} />}
                  </View>
                  <View>
                    <Text style={[styles.deviceName, { color: colors.textPrimary }]}>{device.name}</Text>
                    <View style={styles.deviceInfoRow}>
                      <MaterialIcons name="wifi" size={14} color={getSignalColor(device.signal)} />
                      <Text style={[styles.deviceInfo, { color: colors.textSecondary }]}>{device.ssid ? `${device.ssid} • ` : ''}{device.band} • {device.signal}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.deviceRight}>
                  <Text style={[styles.deviceSpeed, { color: colors.textSecondary }]}>{device.speed}</Text>
                  <Toggle value={!device.blocked} onValueChange={() => toggleDeviceAccess(device.id)} size="small" />
                </View>
              </View>

              {device.expanded && (
                <View style={[styles.expandedContent, { borderTopColor: colors.border }]}>
                  <View style={styles.deviceDetails}>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>IP Address</Text>
                      <TouchableOpacity style={styles.copyRow} onPress={() => { Clipboard.setStringAsync(device.ip); }}>
                        <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: 'monospace' }]}>{device.ip}</Text>
                        <MaterialIcons name="content-copy" size={12} color={colors.textSecondary} style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>MAC Address</Text>
                      <TouchableOpacity style={styles.copyRow} onPress={() => { Clipboard.setStringAsync(device.mac); }}>
                        <Text style={[styles.detailValue, { color: colors.textPrimary, fontFamily: 'monospace' }]}>{device.mac}</Text>
                        <MaterialIcons name="content-copy" size={12} color={colors.textSecondary} style={{ marginLeft: 6 }} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.bandwidthSection}>
                    <View style={styles.bandwidthHeader}>
                      <Text style={[styles.bandwidthLabel, { color: colors.textSecondary }]}>Bandwidth Limit</Text>
                      <Badge text={`${device.bandwidthLimit}%`} variant="info" size="small" />
                    </View>
                    <View style={[styles.progressBar, { backgroundColor: `${colors.background}40` }]}>
                      <View style={[styles.progressFill, { width: `${device.bandwidthLimit}%`, backgroundColor: colors.primary }]} />
                    </View>
                  </View>
                </View>
              )}
            </Card>
          ))}

          {/* Blocked */}
          {filteredDevices.filter((d) => d.blocked).length > 0 && (
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>BLOCKED DEVICES</Text>
          )}

          {filteredDevices.filter((d) => d.blocked).map((device) => (
            <Card
              key={device.id}
              style={[styles.deviceCard, { backgroundColor: colors.error + '10', borderColor: colors.error + '30' }]}
            >
              <View style={styles.deviceHeader}>
                <View style={styles.deviceLeft}>
                  <View style={[styles.deviceIcon, { backgroundColor: colors.error + '20' }]}>
                    <MaterialIcons name={device.icon as any} size={22} color={colors.error} />
                  </View>
                  <View>
                    <Text style={[styles.deviceName, { color: colors.error }]}>{device.name}</Text>
                    <Text style={[styles.deviceInfo, { color: colors.error }]}>Internet Access Blocked</Text>
                  </View>
                </View>
                <Toggle value={false} onValueChange={() => toggleDeviceAccess(device.id)} size="small" />
              </View>
            </Card>
          ))}
        </View>

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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: { position: 'absolute', left: 28 },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 16,
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: { flex: 1, padding: 16 },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.5 },
  statValue: { fontSize: 20, fontWeight: '700' },
  statUnit: { fontSize: 14, fontWeight: '400' },
  filterScroll: { paddingHorizontal: 16, marginBottom: 8 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterTabActive: {},
  filterTabText: { fontSize: 14, fontWeight: '500' },
  filterTabTextActive: { fontWeight: '600' },
  devicesContainer: { paddingHorizontal: 16, gap: 12 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  deviceCard: { padding: 16 },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  deviceStatusDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#1a212e',
  },
  deviceName: { fontSize: 16, fontWeight: '600' },
  deviceInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  deviceInfo: { fontSize: 12 },
  deviceRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  deviceSpeed: { fontSize: 14, fontWeight: '500' },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 16,
  },
  deviceDetails: {
    flexDirection: 'row',
    gap: 24,
  },
  detailRow: { flex: 1 },
  detailLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  detailValue: { fontSize: 12 },
  copyRow: { flexDirection: 'row', alignItems: 'center' },
  bandwidthSection: {},
  bandwidthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bandwidthLabel: { fontSize: 12, fontWeight: '500' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
});
