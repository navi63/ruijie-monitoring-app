import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useRouterAuth } from '@/context/RouterAuthContext';
import { RouterWebView } from '@/components/RouterWebView';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const { width } = Dimensions.get('window');

export default function RouterScreen() {
  const { authState, logout, testConnection, routerConfig, updateRouterConfig } = useRouterAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const [showWebView, setShowWebView] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  const [ipAddress, setIpAddress] = useState(routerConfig.ip);
  const [password, setPassword] = useState(routerConfig.password || '');
  const [tunnelUrl, setTunnelUrl] = useState(routerConfig.tunnelUrl || '');
  const [activeTab, setActiveTab] = useState<'local' | 'tunnel'>(routerConfig.useTunnel ? 'tunnel' : 'local');
  const [webViewUrl, setWebViewUrl] = useState<string | undefined>(undefined);

  React.useEffect(() => {
    setIpAddress(routerConfig.ip);
    setPassword(routerConfig.password || '');
    setTunnelUrl(routerConfig.tunnelUrl || '');
    setActiveTab(routerConfig.useTunnel ? 'tunnel' : 'local');
  }, [routerConfig.ip, routerConfig.password, routerConfig.tunnelUrl, routerConfig.useTunnel]);

  const handleSaveConfig = async () => {
    await updateRouterConfig({ 
      ip: ipAddress, 
      password, 
      tunnelUrl: activeTab === 'tunnel' ? tunnelUrl : routerConfig.tunnelUrl,
      useTunnel: activeTab === 'tunnel'
    });
    Alert.alert('Configuration Saved', 'Router connection details securely saved.');
  };

  const handleInitializeConnection = async () => {
    let finalTunnelUrl = tunnelUrl;
    let extractedBaseUrl = '';

    if (activeTab === 'tunnel') {
      try {
        const urlObj = new URL(tunnelUrl);
        extractedBaseUrl = `${urlObj.protocol}//${urlObj.host}`;
      } catch (e) {
        Alert.alert('Invalid URL', 'Please enter a valid tunnel URL.');
        return;
      }
    }

    await updateRouterConfig({ 
      ip: ipAddress, 
      password, 
      tunnelUrl: extractedBaseUrl || routerConfig.tunnelUrl,
      useTunnel: activeTab === 'tunnel'
    });

    if (activeTab === 'tunnel') {
      setWebViewUrl(tunnelUrl);
    } else {
      setWebViewUrl(undefined);
    }
    
    setShowWebView(true);
  };

  const handleAuthSuccess = () => {
    setShowWebView(false);
    setWebViewUrl(undefined);
    Alert.alert('Success', 'Successfully authenticated with router!');
  };

  const handleAuthFailure = (error: string) => {
    Alert.alert('Authentication Failed', error);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Disconnect',
      'Are you sure you want to clear your session and disconnect from the router?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            await logout();
            setShowWebView(false);
            setWebViewUrl(undefined);
          },
        },
      ]
    );
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const isConnected = await testConnection();
      if (isConnected) {
        Alert.alert('Connection Test', 'Successfully connected to router!');
      } else {
        Alert.alert('Connection Test', 'Failed to connect to router. Please re-authenticate.');
      }
    } catch {
      Alert.alert('Connection Test', 'An error occurred while testing connection.');
    } finally {
      setTestingConnection(false);
    }
  };

  if (showWebView) {
    return <RouterWebView onAuthSuccess={handleAuthSuccess} onAuthFailure={handleAuthFailure} initialUrl={webViewUrl} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.primary + '25', colors.background, colors.background]}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Router Console</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Ruijie Network • {activeTab === 'tunnel' ? 'Cloud Tunnel' : routerConfig.ip}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(600)}>
          <Card shadow style={[styles.statusCard, { borderColor: colors.borderLight, backgroundColor: colors.surfaceCard }]}>
            <View style={styles.statusHeader}>
              <View style={styles.statusRow}>
                <View style={[styles.iconBox, { backgroundColor: authState.routerConnected ? colors.primary + '15' : colors.error + '15' }]}>
                  <MaterialIcons
                    name={authState.routerConnected ? 'wifi' : 'wifi-off'}
                    size={28}
                    color={authState.routerConnected ? colors.primary : colors.error}
                  />
                </View>
                <View>
                  <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Connection Status</Text>
                  <Text style={[styles.statusText, { color: colors.text }]}>
                    {authState.routerConnected ? 'Connected' : 'Disconnected'}
                  </Text>
                </View>
              </View>
              {authState.isAuthenticated && (
                <View style={styles.badgeWrapper}>
                  <Badge text="Secured" variant="success" size="small" />
                </View>
              )}
            </View>
            {authState.error && (
              <View style={[styles.errorContainer, { backgroundColor: colors.error + '15' }]}>
                <MaterialIcons name="error-outline" size={20} color={colors.error} />
                <Text style={[styles.errorText, { color: colors.error }]}>{authState.error}</Text>
              </View>
            )}
           </Card>
        </Animated.View>

        {!authState.isAuthenticated ? (
          <Animated.View entering={FadeInUp.delay(300).duration(600)}>
            <Card shadow style={[styles.authCard, { borderColor: colors.borderLight, backgroundColor: colors.surfaceCard }]}>
              <LinearGradient
                colors={[colors.primary + '10', 'transparent']}
                style={StyleSheet.absoluteFillObject}
              />
              
              <View style={[styles.tabContainer, { backgroundColor: colors.borderLight }]}>
                <TouchableOpacity 
                  onPress={() => setActiveTab('local')}
                  style={[styles.tab, activeTab === 'local' && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <MaterialIcons name="router" size={20} color={activeTab === 'local' ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.tabText, { color: activeTab === 'local' ? colors.primary : colors.textSecondary }]}>Local IP</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setActiveTab('tunnel')}
                  style={[styles.tab, activeTab === 'tunnel' && { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}
                >
                  <MaterialIcons name="cloud" size={20} color={activeTab === 'tunnel' ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.tabText, { color: activeTab === 'tunnel' ? colors.primary : colors.textSecondary }]}>Cloud Tunnel</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.glowIconContainer, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
                <MaterialIcons name={activeTab === 'local' ? "admin-panel-settings" : "vpn-lock"} size={42} color={colors.primary} />
              </View>
              <Text style={[styles.authTitle, { color: colors.text }]}>
                {activeTab === 'local' ? 'Secure Authentication' : 'Tunnel Connection'}
              </Text>
              <Text style={[styles.authDescription, { color: colors.textSecondary }]}>
                {activeTab === 'local' 
                  ? 'Connect to your Ruijie router to manage network configurations and real-time diagnostics.'
                  : 'Access your router remotely through the Ruijie Cloud tunnel URL.'}
              </Text>
              
              <View style={[styles.authInfoBox, { backgroundColor: colors.background, borderColor: colors.borderLight }]}>
                <MaterialIcons name="info-outline" size={20} color={colors.info} />
                <Text style={[styles.authInfoText, { color: colors.textSecondary }]}>
                  {activeTab === 'local' 
                    ? 'Please confirm your router network target and admin password below.'
                    : 'Paste the full tunnel URL from Ruijie Cloud to initialize connection.'}
                </Text>
              </View>

              <View style={{ width: '100%', gap: 16, marginBottom: 28 }}>
                {activeTab === 'local' ? (
                  <>
                    <Input
                      label="Router IP Address"
                      value={ipAddress}
                      onChangeText={setIpAddress}
                      placeholder="e.g. 192.168.110.1"
                      keyboardType="numeric"
                      icon="router"
                    />
                    <Input
                      label="Router Password"
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter admin password"
                      secureTextEntry={true}
                      icon="lock"
                    />
                  </>
                ) : (
                  <Input
                    label="Tunnel URL"
                    value={tunnelUrl}
                    onChangeText={setTunnelUrl}
                    placeholder="https://...ruijiecloud.net/..."
                    icon="link"
                    multiline
                  />
                )}
                <Button 
                  title="Save Configuration" 
                  onPress={handleSaveConfig} 
                  variant="outline" 
                  size="medium"
                  style={{ borderRadius: 14, borderColor: colors.primary + '40' }}
                  textStyle={{ fontWeight: '700' }}
                  icon={<MaterialIcons name="save" size={18} color={colors.primary} />}
                />
              </View>

              <Button
                title={activeTab === 'local' ? "Initialize Connection" : "Connect via Tunnel"}
                onPress={handleInitializeConnection}
                isLoading={authState.isLoading}
                size="medium"
                style={[
                  styles.connectButton, 
                  { 
                    backgroundColor: colors.primary,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }
                ]}
                textStyle={{ fontWeight: '700' }}
                icon={<MaterialIcons name={activeTab === 'local' ? "vpn-key" : "login"} size={20} color="#ffffff" />}
              />
              <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                {activeTab === 'local' 
                  ? "Ensure your device is connected to the router's local network target."
                  : "The app will extract the base URL and attempt to capture the session cookie."}
              </Text>
            </Card>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.delay(300).duration(600)} style={styles.connectedContainer}>
            <View style={styles.gridContainer}>
              <Card shadow style={[styles.gridCard, { borderColor: colors.borderLight, backgroundColor: colors.surfaceCard }]}>
                <View style={[styles.gridIconBox, { backgroundColor: colors.primary + '15' }]}>
                  <MaterialIcons name="dns" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Target Host</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>{routerConfig.ip}</Text>
              </Card>

              <Card shadow style={[styles.gridCard, { borderColor: colors.borderLight, backgroundColor: colors.surfaceCard }]}>
                <View style={[styles.gridIconBox, { backgroundColor: colors.success + '15' }]}>
                  <MaterialIcons name="https" size={24} color={colors.success} />
                </View>
                <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Protocol</Text>
                <Text style={[styles.gridValue, { color: colors.text }]}>HTTPS (TLS)</Text>
              </Card>
            </View>

            <Card shadow style={[styles.actionCard, { borderColor: colors.borderLight, backgroundColor: colors.surfaceCard }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Network Actions</Text>
              <View style={styles.actionButtons}>
                <Button
                  title="Ping Test"
                  onPress={handleTestConnection}
                  isLoading={testingConnection}
                  size="medium"
                  icon={<MaterialIcons name="network-ping" size={18} color="#ffffff" />}
                  style={[
                    styles.actionButton,
                    {
                      backgroundColor: colors.primary,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    }
                  ]}
                  textStyle={{ fontWeight: '700' }}
                />
                <Button
                  title="Renew Auth"
                  onPress={() => setShowWebView(true)}
                  size="medium"
                  variant="outline"
                  icon={<MaterialIcons name="autorenew" size={18} color={colors.primary} />}
                  style={[styles.actionButton, { borderRadius: 14, borderColor: colors.primary + '40' }]}
                  textStyle={{ fontWeight: '700' }}
                />
              </View>
            </Card>

            <Button
              title="Terminate Session"
              onPress={handleLogout}
              variant="outline"
              size="large"
              icon={<MaterialIcons name="power-settings-new" size={20} color={colors.error} />}
              style={[styles.logoutButton, { borderColor: colors.error + '40', backgroundColor: colors.error + '10' }]}
              textStyle={{ color: colors.error }}
            />
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 60,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  statusCard: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  badgeWrapper: {
    alignSelf: 'flex-start',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: '500',
  },
  statusText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  errorContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  authCard: {
    padding: 28,
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  glowIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#135bec',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
  },
  authTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  authDescription: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  authInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  authInfoText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  connectButton: {
    width: '100%',
    borderRadius: 16,
  },
  hintText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 20,
    opacity: 0.8,
  },
  connectedContainer: {
    gap: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  gridCard: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
  },
  gridIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  gridLabel: {
    fontSize: 13,
    marginBottom: 4,
    fontWeight: '500',
  },
  gridValue: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  actionCard: {
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 14,
  },
  logoutButton: {
    marginTop: 12,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 6,
    marginBottom: 24,
    width: '100%',
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
