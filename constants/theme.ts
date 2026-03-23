/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#135bec';
const tintColorDark = '#135bec';

export const Colors = {
  light: {
    text: '#11181C',
    textPrimary: '#1a1a1a',
    textSecondary: '#64748b',
    background: '#f6f6f8',
    surface: '#ffffff',
    surfaceAlt: '#f1f5f9',
    surfaceCard: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    primary: '#135bec',
    primaryDark: '#0b45b8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  dark: {
    text: '#ECEDEE',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    textTertiary: '#9da6b9',
    background: '#101622',
    surface: '#1a212e',
    surfaceAlt: '#1c2230',
    surfaceCard: '#1c1f27',
    border: '#2d3648',
    borderLight: '#282e39',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    primary: '#135bec',
    primaryDark: '#0b45b8',
    primaryGlow: 'rgba(19, 91, 236, 0.5)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
