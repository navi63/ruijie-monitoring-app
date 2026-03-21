import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { Card, Toggle, Button } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { MOCK_WIFI_SETTINGS, GUEST_DURATION_OPTIONS } from '@/constants/data';
import { WiFiSettings } from '@/types';

export default function WiFiSettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  const [settings, setSettings] = useState<WiFiSettings>(MOCK_WIFI_SETTINGS);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={[styles.headerButton, { backgroundColor: `${colors.surface}40` }]}>
            <MaterialIcons name="arrow-back" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Wi-Fi Settings</Text>
          <TouchableOpacity>
            <Text style={[styles.saveButton, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Network Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Primary Network</Text>
          </View>
          <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity style={styles.cardItem}>
              <View style={styles.cardItemLeft}>
                <View style={[styles.cardIcon, { backgroundColor: `${colors.primary}10` }]}>
                  <MaterialIcons name="wifi" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.cardItemLabel, { color: colors.textSecondary }]}>SSID Name</Text>
                  <Text style={[styles.cardItemValue, { color: colors.textPrimary }]}>{settings.primarySSID}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.cardItem}>
              <View style={styles.cardItemLeft}>
                <View style={[styles.cardIcon, { backgroundColor: colors.border }]}>
                  <MaterialIcons name="lock" size={24} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={[styles.cardItemLabel, { color: colors.textSecondary }]}>Password</Text>
                  <Text style={[styles.cardItemValue, { color: colors.textPrimary, fontFamily: 'monospace' }]}>{settings.primaryPassword}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="visibility-off" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Guest Network Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Guest Network</Text>
            <Toggle
              value={settings.guestEnabled}
              onValueChange={(v) => setSettings({ ...settings, guestEnabled: v })}
            />
          </View>
          <Card style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            {settings.guestEnabled && (
              <>
                <View style={styles.durationPicker}>
                  <Text style={[styles.durationLabel, { color: colors.textSecondary }]}>Duration</Text>
                  <View style={styles.durationButtons}>
                    {GUEST_DURATION_OPTIONS.map((duration) => (
                      <TouchableOpacity
                        key={duration}
                        style={[
                          styles.durationButton,
                          settings.guestDuration === duration ? styles.durationButtonActive : null,
                          settings.guestDuration === duration
                            ? { backgroundColor: colors.primary }
                            : { backgroundColor: colors.border },
                        ]}
                        onPress={() => setSettings({ ...settings, guestDuration: duration })}
                      >
                        <Text
                          style={[
                            styles.durationButtonText,
                            settings.guestDuration === duration ? styles.durationButtonTextActive : null,
                            { color: settings.guestDuration === duration ? '#fff' : colors.textSecondary },
                          ]}
                        >
                          {duration}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
              </>
            )}
            <TouchableOpacity style={styles.cardItem}>
              <View style={styles.cardItemLeft}>
                <View style={[styles.cardIcon, { backgroundColor: `${colors.primary}10` }]}>
                  <MaterialIcons name="wifi-tethering" size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={[styles.cardItemLabel, { color: colors.textSecondary }]}>Guest SSID</Text>
                  <Text style={[styles.cardItemValue, { color: colors.textPrimary }]}>{settings.guestSSID}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="edit" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <TouchableOpacity style={styles.cardItem}>
              <View style={styles.cardItemLeft}>
                <View style={[styles.cardIcon, { backgroundColor: colors.border }]}>
                  <MaterialIcons name="key" size={24} color={colors.textSecondary} />
                </View>
                <View>
                  <Text style={[styles.cardItemLabel, { color: colors.textSecondary }]}>Password</Text>
                  <Text style={[styles.cardItemValue, { color: colors.textPrimary, fontFamily: 'monospace' }]}>{settings.guestPassword}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <MaterialIcons name="content-copy" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </TouchableOpacity>
          </Card>
        </View>

        {/* Channel Optimization Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Channel Optimization</Text>
          </View>
          <Card style={[styles.channelCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.channelHeader}>
              <View>
                <Text style={[styles.channelLabel, { color: colors.textSecondary }]}>Current Channel</Text>
                <View style={styles.channelValueRow}>
                  <Text style={[styles.channelValue, { color: colors.textPrimary }]}>{settings.currentChannel}</Text>
                  <Badge text="Good Quality" variant="success" size="small" />
                </View>
              </View>
              <MaterialIcons name="router" size={48} color={colors.textSecondary} />
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                <View style={[styles.progressFill, { width: '85%', backgroundColor: colors.success }]} />
              </View>
            </View>
            <Button
              title="Scan & Optimize"
              onPress={() => {}}
              variant="outline"
              size="medium"
              icon={<MaterialIcons name="sync" size={20} color={colors.primary} />}
              iconPosition="left"
            />
          </Card>
        </View>

        {/* Advanced Settings Link */}
        <TouchableOpacity style={styles.advancedLink}>
          <Text style={[styles.advancedLinkText, { color: colors.textSecondary }]}>
            Advanced Settings
          </Text>
          <MaterialIcons name="chevron-right" size={16} color={colors.textSecondary} />
        </TouchableOpacity>

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
  headerTitle: { fontSize: 18, fontWeight: '600' },
  saveButton: { fontSize: 14, fontWeight: '600', paddingHorizontal: 8 },
  section: { marginTop: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardItemLabel: { fontSize: 14, marginBottom: 4 },
  cardItemValue: { fontSize: 16, fontWeight: '500' },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: { height: 1, marginHorizontal: 16 },
  durationPicker: { padding: 16 },
  durationLabel: { fontSize: 14, marginBottom: 12 },
  durationButtons: { flexDirection: 'row', gap: 8 },
  durationButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  durationButtonActive: {},
  durationButtonText: { fontSize: 14, fontWeight: '500' },
  durationButtonTextActive: {},
  channelCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  channelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  channelLabel: { fontSize: 14, marginBottom: 4 },
  channelValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelValue: { fontSize: 32, fontWeight: '700' },
  progressBarContainer: { marginTop: 16 },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  advancedLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    paddingVertical: 8,
  },
  advancedLinkText: { fontSize: 14 },
});
