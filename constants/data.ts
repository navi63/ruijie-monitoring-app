import { Device, SystemHealth, DataConsumer, MonthlySummary, WiFiSettings } from '@/types';

// ==============================
// Mock Data
// ==============================

export const MOCK_DEVICES: Device[] = [
  {
    id: '1',
    name: 'MacBook Pro M2',
    icon: 'laptop-mac',
    ip: '192.168.1.42',
    mac: '00:1B:44:11:3A:B7',
    band: '5GHz',
    signal: 'Excellent',
    speed: '124 MB/s',
    active: true,
    blocked: false,
    bandwidthLimit: 100,
  },
  {
    id: '2',
    name: 'iPhone 14 Pro',
    icon: 'smartphone',
    ip: '192.168.1.56',
    mac: '00:1B:44:22:3C:D8',
    band: '2.4GHz',
    signal: 'Good',
    speed: '4.2 MB/s',
    active: true,
    blocked: false,
    bandwidthLimit: 100,
  },
  {
    id: '3',
    name: 'Living Room TV',
    icon: 'tv',
    ip: '192.168.1.78',
    mac: '00:1B:44:33:4D:E9',
    band: '5GHz',
    signal: 'Excellent',
    speed: '18.5 MB/s',
    active: true,
    blocked: false,
    bandwidthLimit: 100,
  },
  {
    id: '4',
    name: 'HP LaserJet',
    icon: 'print',
    ip: '192.168.1.91',
    mac: '00:1B:44:44:5E:F0',
    band: '-',
    signal: '-',
    speed: '0 KB/s',
    active: false,
    blocked: false,
    bandwidthLimit: 100,
  },
  {
    id: '5',
    name: "Timmy's Xbox",
    icon: 'sports-esports',
    ip: '192.168.1.105',
    mac: '00:1B:44:55:6F:G1',
    band: '-',
    signal: '-',
    speed: '-',
    active: false,
    blocked: true,
    bandwidthLimit: 100,
  },
];

export const MOCK_SYSTEM_HEALTH: SystemHealth = {
  cpu: 45,
  ram: 62,
  temperature: 42,
};

export const MOCK_TOP_CONSUMERS: DataConsumer[] = [
  {
    id: '1',
    name: 'MacBook Pro M2',
    icon: 'laptop-mac',
    usage: '425 GB',
    percentage: 75,
    color: '#135bec',
  },
  {
    id: '2',
    name: 'PlayStation 5',
    icon: 'videogame-asset',
    usage: '210 GB',
    percentage: 45,
    color: '#a855f7',
  },
  {
    id: '3',
    name: 'iPhone 15 Pro',
    icon: 'smartphone',
    usage: '108 GB',
    percentage: 20,
    color: '#f97316',
  },
];

export const MOCK_MONTHLY_SUMMARY: MonthlySummary = {
  peakUsageTime: '8:00 PM - 11:00 PM',
  totalDevices: 14,
};

export const MOCK_WIFI_SETTINGS: WiFiSettings = {
  primarySSID: 'Stitch_Home_5G',
  primaryPassword: '••••••••••••',
  guestSSID: 'Stitch_Guest',
  guestPassword: 'guest1234',
  guestEnabled: true,
  guestDuration: '4h',
  currentChannel: '36',
  channelQuality: 'Good',
};

// ==============================
// Chart Data
// ==============================

export interface ChartDataPoint {
  x: number;
  y: number;
}

export const MOCK_CHART_DATA: ChartDataPoint[] = [
  { x: 0, y: 109 },
  { x: 36, y: 21 },
  { x: 72, y: 41 },
  { x: 108, y: 93 },
  { x: 145, y: 33 },
  { x: 181, y: 101 },
  { x: 217, y: 61 },
  { x: 254, y: 45 },
  { x: 290, y: 121 },
  { x: 326, y: 149 },
  { x: 363, y: 1 },
  { x: 399, y: 81 },
  { x: 435, y: 129 },
  { x: 472, y: 25 },
];

// ==============================
// Constants
// ==============================

export const GUEST_DURATION_OPTIONS = ['2h', '4h', '8h', 'Always'] as const;

export const TIME_FILTER_OPTIONS = ['Day', 'Week', 'Month', 'Year'] as const;

export const DEVICE_FILTER_OPTIONS = ['all', 'active', 'blocked'] as const;

export const SIGNAL_STRENGTH_COLORS = {
  Excellent: '#10b981',
  Good: '#f59e0b',
  Fair: '#f97316',
  Poor: '#ef4444',
} as const;

export const BAND_COLORS = {
  cpu: '#135bec',
  ram: '#a855f7',
  temp: '#f59e0b',
} as const;
