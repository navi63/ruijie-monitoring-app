# Development Guide

This guide covers the development workflow, best practices, and coding standards for the Stitch Mobile App.

## Prerequisites

- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- TypeScript knowledge
- React Native experience (recommended)

## Development Workflow

### Setting Up

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd test-expo
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Choose a Platform**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for web
   - Scan QR code with Expo Go app

### Hot Reloading

The app supports hot reloading for fast development:
- **Hot Reload**: Reloads component on save (preserves state)
- **Fast Refresh**: Full refresh when state changes break

### Debugging

#### Using Expo DevTools

1. Start the development server
2. Open Expo DevTools (browser or press `d`)
3. Use React Native Debugger for network inspection

#### Console Logging

```typescript
console.log('Debug info', data);
console.warn('Warning message');
console.error('Error details', error);
```

#### React DevTools

Install React DevTools for React Native:
```bash
npm install --save-dev react-devtools
```

## Coding Standards

### TypeScript

Always use TypeScript for type safety:

```typescript
// ✅ Good - Interface for props
interface MyComponentProps {
  title: string;
  count?: number; // Optional
  onPress: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, count = 0, onPress }) => {
  // ...
};

// ❌ Bad - No types
export const MyComponent = ({ title, count, onPress }) => {
  // ...
};
```

### Component Structure

Organize components in this order:

```typescript
// 1. Imports (React first, then external, then local)
import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/theme';

// 2. Type definitions
interface Props {
  // ...
}

// 3. Component definition
export const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // 4. Hooks
  const [state, setState] = useState();
  const colors = useColorScheme();

  // 5. Memoized values
  const memoizedValue = useMemo(() => {
    // ...
  }, [deps]);

  // 6. Event handlers
  const handlePress = useCallback(() => {
    // ...
  }, [deps]);

  // 7. Render
  return (
    <View>
      {/* JSX */}
    </View>
  );
};
```

### Naming Conventions

- **Components**: PascalCase (`UserProfileCard`)
- **Hooks**: camelCase with `use` prefix (`useUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Functions/Variables**: camelCase (`getUserData`, `isLoading`)
- **Interfaces**: PascalCase with descriptive name (`UserProfileProps`)

### Import Organization

```typescript
// 1. React imports
import React, { useState, useEffect } from 'react';

// 2. React Native imports
import { View, Text, ScrollView } from 'react-native';

// 3. Third-party imports
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// 4. Local imports (grouped by location)
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '@/components/ui';
import { UserProfile } from '@/types';
```

### Styling Guidelines

#### Use StyleSheet.create

```typescript
// ✅ Good
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

// ❌ Bad - Inline styles
<View style={{ flex: 1, padding: 16 }}>
```

#### Reusable Style Patterns

```typescript
// Common spacing patterns
const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

// Common border radius
const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
```

## Adding New Features

### Step-by-Step Guide

1. **Define Types**
   ```typescript
   // types/index.ts
   export interface NewFeature {
     id: string;
     name: string;
     // ...
   }
   ```

2. **Add Mock Data**
   ```typescript
   // constants/data.ts
   export const MOCK_NEW_FEATURE: NewFeature[] = [
     // ...
   ];
   ```

3. **Create Hook (if needed)**
   ```typescript
   // hooks/useNewFeature.ts
   import { useState } from 'react';
   import { NewFeature } from '@/types';

   export const useNewFeature = () => {
     const [data, setData] = useState<NewFeature[]>([]);
     // ... logic
     return { data };
   };
   ```

4. **Build Components**
   ```typescript
   // components/ui/NewComponent.tsx
   export const NewComponent: React.FC<NewComponentProps> = () => {
     // ...
   };
   ```

5. **Implement Screen**
   ```typescript
   // app/(tabs)/new-feature.tsx
   import { useNewFeature } from '@/hooks/useNewFeature';

   export default function NewFeatureScreen() {
     const { data } = useNewFeature();
     // ...
   }
   ```

6. **Add Navigation**
   - For tabs: Add to `app/(tabs)` folder
   - For nested routes: Add to `app/` folder

## State Management

### When to Use What

| Scenario | Solution |
|----------|----------|
| Local component state | `useState` |
| Derived data | `useMemo` |
| Event handlers | `useCallback` |
| Global theme | Context API (implemented) |
| Complex global state | Consider Zustand/Redux |

### Custom Hooks Pattern

```typescript
export const useCustomHook = (params: Params) => {
  const [state, setState] = useState<State>(initialState);

  const action = useCallback(() => {
    setState(prev => ({ ...prev, updated: true }));
  }, []);

  const computedValue = useMemo(() => {
    return heavyCalculation(state);
  }, [state]);

  return {
    state,
    action,
    computedValue,
  };
};
```

## Performance Optimization

### React.memo for Components

```typescript
import React, { memo } from 'react';

export const ExpensiveComponent = memo(({ prop1, prop2 }) => {
  // Component implementation
});
```

### useMemo for Expensive Calculations

```typescript
const filteredItems = useMemo(() => {
  return items.filter(item => item.active);
}, [items]);
```

### useCallback for Event Handlers

```typescript
const handlePress = useCallback(() => {
  onPress(item.id);
}, [onPress, item.id]);
```

### Lazy Loading (Future)

```typescript
import { lazy } from 'react';

const HeavyScreen = lazy(() => import('./screens/HeavyScreen'));
```

## Testing

### Component Testing (Future)

```typescript
import { render } from '@testing-library/react-native';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent title="Test" />);
    expect(getByText('Test')).toBeTruthy();
  });
});
```

### Hook Testing (Future)

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useCustomHook } from './useCustomHook';

describe('useCustomHook', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useCustomHook());
    expect(result.current.state).toEqual(initialState);
  });
});
```

## Accessibility

### Best Practices

```typescript
// ✅ Good - Accessible button
<TouchableOpacity
  onPress={handlePress}
  accessibilityLabel="Close modal"
  accessibilityRole="button"
  accessibilityHint="Double tap to close"
>
  <MaterialIcons name="close" size={24} />
</TouchableOpacity>

// ✅ Good - Semantic text
<Text accessibilityRole="header" style={styles.heading}>
  Important Information
</Text>
```

### Minimum Touch Targets

- Buttons: 44x44 points minimum
- Icons: 44x44 points (touchable area can be larger than visual)

### Color Contrast

- Text: Minimum 4.5:1 contrast ratio
- Large text: Minimum 3:1 contrast ratio
- UI elements: Minimum 3:1 contrast ratio

## Code Review Checklist

Before submitting code, ensure:

- [ ] TypeScript compiles without errors
- [ ] ESLint passes (run `npm run lint`)
- [ ] All imports are organized and sorted
- [ ] Components are properly typed
- [ ] No console.log statements left in production code
- [ ] All files have appropriate comments only for complex logic
- [ ] Tested on both iOS and Android (if possible)
- [ ] Accessibility considerations addressed

## Troubleshooting

### Common Issues

#### Metro bundler cache issues
```bash
npx expo start -c
```

#### Dependency issues
```bash
rm -rf node_modules
npm install
```

#### iOS build issues
```bash
cd ios
pod install
cd ..
npm start
```

#### Android build issues
```bash
cd android
./gradlew clean
cd ..
npm start
```

## Useful Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Documentation](https://reactnative.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [React Navigation](https://reactnavigation.org)
- [Expo Router](https://docs.expo.dev/router/introduction)

## Questions?

Refer to the [README.md](README.md) for project overview or [ARCHITECTURE.md](ARCHITECTURE.md) for architecture details.
