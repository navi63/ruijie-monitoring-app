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
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
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
};

export type RootStackParamList = {
  '(tabs)': TabParamList;
  modal: undefined;
};
