# Stitch Mobile App

A modern, minimalist mobile application for controlling and monitoring Stitch wireless routers. Built with React Native, Expo, and TypeScript.

## Overview

The Stitch Mobile App provides an intuitive, elegant interface for network management with real-time monitoring, client management, Wi-Fi configuration, and usage statistics. The design follows a premium, WiFiman-inspired aesthetic with OLED dark mode as the primary interface.

## Features

- **Dashboard Monitoring**: Real-time network traffic gauge, system health metrics (CPU, RAM, temperature)
- **Connected Clients Management**: View all devices, manage bandwidth limits, block/unblock devices
- **Wireless Configuration**: Manage SSID settings, guest networks, channel optimization
- **Usage Statistics**: Detailed bandwidth charts, top consumers tracking, monthly summaries
- **Modern UI**: Glassmorphism effects, electric blue glow accents, smooth animations

## Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet
- **Icons**: @expo/vector-icons (Material Icons)
- **Graphics**: react-native-svg, expo-linear-gradient
- **State Management**: React Hooks + Custom Hooks

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- Expo Go app (for development) or Android Studio / Xcode (for simulators)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd test-expo

# Install dependencies
npm install

# Start the development server
npm start
```

### Running the App

**On Android:**
```bash
npm run android
```

**On iOS:**
```bash
npm run ios
```

**On Web:**
```bash
npm run web
```

**With Expo Go:**
1. Run `npm start`
2. Scan the QR code with Expo Go app on your phone

## Project Structure

```
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Bottom tab navigation
│   │   ├── index.tsx       # Dashboard
│   │   ├── clients.tsx     # Connected devices
│   │   ├── settings.tsx    # Wi-Fi settings
│   │   └── stats.tsx       # Usage statistics
│   └── _layout.tsx         # Root layout
├── components/
│   └── ui/                # Reusable UI components
│       ├── Card.tsx
│       ├── Button.tsx
│       ├── Toggle.tsx
│       ├── Badge.tsx
│       └── Gauge.tsx
├── constants/
│   ├── theme.ts           # Color & theme constants
│   └── data.ts           # Mock data
├── hooks/
│   ├── useDevices.ts      # Device management
│   ├── useChart.tsx       # Chart logic
│   └── use-color-scheme.ts # Theme management
├── types/
│   └── index.ts          # TypeScript interfaces
├── assets/               # Static assets
└── scripts/              # Build scripts
```

## Design System

### Colors

The app uses a sophisticated dark theme with electric blue accents:

- **Primary**: Electric blue (#135bec) - main brand color
- **Background**: Deep dark (#0d1117) - OLED-optimized
- **Surface**: Semi-transparent overlays for glassmorphism
- **Success**: Green for positive status
- **Warning**: Yellow/Orange for alerts
- **Error**: Red for errors
- **Info**: Cyan/blue for informational states

### Typography

- **Headings**: Bold, 700 weight
- **Body**: Regular, 400-500 weight
- **Captions**: Light, 400 weight, uppercase
- **Consistent sizing scale** (10px to 36px)

### Components

All UI components follow these principles:
- **Reusable**: Can be used across different screens
- **Type-safe**: Full TypeScript prop definitions
- **Theme-aware**: Automatically adapt to light/dark mode
- **Accessible**: Proper touch targets and labels

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the Expo development server |
| `npm run android` | Run on Android emulator/device |
| `npm run ios` | Run on iOS simulator/device |
| `npm run web` | Run in web browser |
| `npm run lint` | Run ESLint to check code quality |
| `npm run reset-project` | Reset to blank template |

## Documentation

- [Architecture Guide](ARCHITECTURE.md) - Detailed architecture and patterns
- [Product Requirements](PRD.md) - Features and design specifications
- [Development Guide](DEVELOPMENT.md) - Developer workflows and guidelines
- [Component Documentation](COMPONENTS.md) - UI component reference

## Contributing

1. Follow the existing code style and conventions
2. Add TypeScript types for all new code
3. Write clear, descriptive component names
4. Use custom hooks for reusable logic
5. Test on both iOS and Android when possible

## License

Copyright © 2024 Stitch Wireless

## Support

For issues, questions, or feature requests, please open an issue in the repository.
