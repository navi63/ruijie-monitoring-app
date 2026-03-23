// ==============================
// Domain Types
// ==============================

export interface Device {
  id: string;
  name: string;
  icon: string;
  ip: string;
  mac: string;
  band: string;
  ssid?: string;
  signal: 'Excellent' | 'Good' | 'Fair' | 'Poor' | '-';
  speed: string;
  active: boolean;
  blocked: boolean;
  bandwidthLimit?: number;
}

export interface NetworkStats {
  totalBandwidth: number;
  uploadSpeed: number;
  downloadSpeed: number;
  trendPercentage: number;
  timeFilter: 'Day' | 'Week' | 'Month' | 'Year';
}

export interface SystemHealth {
  cpu: number;
  ram: number;
  temperature: number;
}

export interface DataConsumer {
  id: string;
  name: string;
  icon: string;
  usage: string;
  percentage: number;
  color: string;
}

export interface MonthlySummary {
  peakUsageTime: string;
  totalDevices: number;
}

export interface WiFiSettings {
  primarySSID: string;
  primaryPassword: string;
  guestSSID: string;
  guestPassword: string;
  guestEnabled: boolean;
  guestDuration: string;
  currentChannel: string;
  channelQuality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
}

// ==============================
// UI Component Props
// ==============================

export interface CardProps {
  children: React.ReactNode;
  style?: object;
  borderColor?: string;
  backgroundColor?: string;
  shadow?: boolean;
  onPress?: () => void;
}

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: any;
  textStyle?: any;
}

export interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  size?: 'small' | 'medium' | 'large';
}

export interface BadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium';
}

export interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label?: string;
  };
}

export interface GaugeCardProps {
  label: string;
  value: number | string;
  unit?: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

// ==============================
// Navigation Types
// ==============================

export type TabParamList = {
  index: undefined;
  clients: undefined;
  settings: undefined;
  stats: undefined;
  router: undefined;
};

export type RootStackParamList = {
  '(tabs)': TabParamList;
  modal: undefined;
};

// ==============================
// Router Authentication Types
// ==============================

export interface RouterConfig {
  ip: string;
  loginUrl: string;
  authApi: string;
  cookieName: string;
  password?: string;
}

export interface RouterOverviewStats {
  conntrack_max: number;
  uptime: number;
  showgame: string;
  online_users: number;
  mtkhnat: string;
  conntrack_count: number;
  study: string;
  runtime: number;
  game: string;
  cpuutil: string;
  flowctrl: string;
  status: string;
  up_rate: number;
  rcgame_enabled: string;
  down_rate: number;
}

export interface RouterPingMetrics {
  min: number;
  num: number;
  avg: number;
  loss: number;
  max: number;
  time: number;
}

export interface RouterClientNode {
  mac: string;
  userIp: string;
  name: string;
  connectType: string;
  sn: string;
  ssid: string;
  band: string;
  onlinetime: string;
  hardwareType: string;
  rssi: string;
  rxrate: string;
  channel: string;
  deviceAliasName: string;
  osType: string;
  manufacture: string;
  activeTime: string;
  wifiUpDown: string;
  hostName: string;
  groupId: string;
  groupName: string;
  up: string;
  down: string;
  flowUp: string;
  flowDown: string;
  ifname: string;
  psm: string;
  mlo: string;
  flow_cnt: string;
  awake: string;
}

export interface RouterMacFilterRule {
  mac: string;
  name: string;
}

export interface RouterMacFilterConfig {
  type: string;
  networkId: string;
  groupId: string;
  subConfigId: string;
  version: string;
  configId: string;
  configTime: string;
  currentTime: string;
  macList: RouterMacFilterRule[];
  axMacList: RouterMacFilterRule[];
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  cookie: string | null;
  routerConnected: boolean;
}

export interface RouterAuthContextType {
  authState: AuthState;
  routerConfig: RouterConfig;
  updateRouterConfig: (config: Partial<RouterConfig>) => Promise<void>;
  login: (cookie: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  testConnection: () => Promise<boolean>;
}
