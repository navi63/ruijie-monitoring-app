# Stitch Mobile App - Clean Architecture Guide

## Overview
This project follows industry-standard best practices for React Native development with TypeScript, ensuring maintainability, scalability, and type safety.

## Project Structure

```
├── app/                    # Expo Router file-based routing
│   ├── (tabs)/            # Bottom tab navigation screens
│   │   ├── index.tsx       # Dashboard
│   │   ├── clients.tsx     # Connected devices
│   │   ├── settings.tsx    # Wi-Fi settings
│   │   └── stats.tsx       # Usage statistics
│   └── _layout.tsx         # Root navigation layout
├── components/
│   └── ui/                # Reusable UI components
│       ├── Card.tsx         # Generic card component
│       ├── Button.tsx        # Reusable button
│       ├── Toggle.tsx        # Switch/toggle component
│       ├── Badge.tsx         # Badge component
│       ├── Gauge.tsx         # Circular gauge component
│       └── index.tsx        # Component exports
├── constants/
│   ├── theme.ts            # Color & theme constants
│   └── data.ts            # Mock data & app constants
├── hooks/
│   ├── useDevices.ts       # Device management logic
│   ├── useChart.ts         # Chart rendering logic
│   └── index.tsx           # Hook exports
├── types/
│   └── index.ts           # TypeScript interfaces
└── assets/                # Static assets
```

## Architecture Principles

### 1. Separation of Concerns
- **Presentation Layer**: Components focus solely on UI rendering
- **Business Logic**: Custom hooks handle state and logic
- **Data Layer**: Constants and types define structure

### 2. Type Safety
All data structures are strictly typed with TypeScript interfaces:
- Domain models (Device, SystemHealth, etc.)
- Component props (CardProps, ButtonProps, etc.)
- Navigation types (TabParamList, RootStackParamList)

### 3. Reusability
Common UI patterns extracted into reusable components:
- **Card**: Consistent container with optional shadow/press handlers
- **Button**: Multiple variants (primary, secondary, outline, ghost)
- **Toggle**: Accessible switch component
- **Badge**: Status indicators with variants
- **GaugeCard**: Circular progress indicator

### 4. Custom Hooks
Reusable logic extracted into hooks:
- **useDevices**: Manages device state, filtering, search
- **useChart**: Handles chart path calculations and rendering
- **useColorScheme**: Theme management

### 5. Design System
Centralized theming with:
- OLED dark mode as default
- Electric blue (#135bec) as primary accent
- Consistent spacing, typography, and colors
- Glassmorphism effects for modern aesthetics

## Key Patterns

### Component Pattern
```typescript
interface ComponentProps {
  // Define props with TypeScript
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  const colors = useColors(); // Access theme
  return (
    // JSX with styles
  );
};
```

### Hook Pattern
```typescript
export const useCustomHook = () => {
  const [state, setState] = useState();
  
  const action = useCallback(() => {
    // Logic
  }, [deps]);
  
  return { state, action }; // Expose API
};
```

### Screen Pattern
```typescript
export default function Screen() {
  const { data, actions } = useCustomHook();
  const colors = useColors();
  
  return (
    <SafeAreaView>
      {/* Header */}
      {/* Content using components */}
    </SafeAreaView>
  );
}
```

## Best Practices

1. **Always use TypeScript interfaces** for props and data
2. **Extract reusable logic** into custom hooks
3. **Create type-safe components** with clear prop interfaces
4. **Centralize constants** (colors, data, configs)
5. **Use memoization** (useMemo, useCallback) for performance
6. **Follow naming conventions**: PascalCase for components, camelCase for functions
7. **Keep components small** and focused on single responsibility
8. **Organize imports**: Group React, third-party, then local imports

## Adding New Features

1. **Define types** in `types/index.ts`
2. **Add mock data** to `constants/data.ts`
3. **Create hook** if stateful logic is needed
4. **Build reusable components** if UI patterns repeat
5. **Implement screen** using existing components and hooks
6. **Add navigation route** if needed

## Maintenance

### Updating Colors
Edit `constants/theme.ts` - all components will update automatically.

### Modifying Data
Edit `constants/data.ts` - type-safe mock data source.

### Adding Components
1. Create in `components/ui/`
2. Export from `components/ui/index.tsx`
3. Use type definitions from `types/index.ts`

### State Management
For complex state, consider:
- **Context API** for global state
- **Zustand/Redux** for large apps
- Current: Local state with custom hooks

## Performance Considerations

- Uses `React.memo` where appropriate
- `useCallback` for event handlers
- `useMemo` for computed values
- Lazy loading for heavy screens (add via expo-router)

## Accessibility

- Use semantic HTML elements via React Native
- Proper touch targets (minimum 44x44)
- Color contrast ratios per WCAG AA
- Screen reader friendly text labels

## Testing Strategy (Future)

```
tests/
├── components/     # Component tests
├── hooks/         # Hook tests
└── screens/        # Screen integration tests
```

## Dependencies

- **expo**: React Native framework
- **expo-router**: File-based navigation
- **react-native-svg**: Vector graphics
- **expo-linear-gradient**: Gradient effects
- **@expo/vector-icons**: Icon library

## Deployment

```bash
# Development
npm start

# Android
npm run android

# iOS
npm run ios

# Production build
eas build --platform android
```

## License

Copyright © 2024 Stitch Wireless
