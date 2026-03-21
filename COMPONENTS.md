# Component Documentation

Complete reference for all reusable UI components in the Stitch Mobile App.

## Table of Contents

- [Card](#card)
- [Button](#button)
- [Toggle](#toggle)
- [Badge](#badge)
- [GaugeCard](#gaugecard)

---

## Card

A versatile container component with optional shadow, press handlers, and styling.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Content to display inside the card |
| `style` | `object` | No | - | Additional styles to apply |
| `backgroundColor` | `string` | No | Theme surface | Custom background color |
| `borderColor` | `string` | No | Theme border | Custom border color |
| `shadow` | `boolean` | No | `false` | Enable shadow effect |
| `onPress` | `function` | No | - | Press handler (makes card pressable) |

### Usage

```typescript
import { Card } from '@/components/ui';

// Basic card
<Card>
  <Text>Card content</Text>
</Card>

// With shadow and custom colors
<Card
  shadow={true}
  backgroundColor="#1c2230"
  borderColor="#333"
>
  <Text>Styled card</Text>
</Card>

// Pressable card
<Card onPress={() => console.log('pressed')}>
  <Text>Click me</Text>
</Card>
```

### Example Output

```
┌─────────────────┐
│  Card Content   │
└─────────────────┘
```

---

## Button

A customizable button component with multiple variants, sizes, and icon support.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `title` | `string` | Yes | - | Button text |
| `onPress` | `function` | Yes | - | Press handler |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | No | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | No | `'medium'` | Button size |
| `disabled` | `boolean` | No | `false` | Disable button |
| `icon` | `ReactNode` | No | - | Icon element |
| `iconPosition` | `'left' \| 'right'` | No | `'left'` | Icon position |

### Variants

- **Primary**: Solid background with white text (default)
- **Secondary**: Green background (for success actions)
- **Outline**: Transparent with border
- **Ghost**: Transparent, no border

### Usage

```typescript
import { Button } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';

// Primary button
<Button
  title="Submit"
  onPress={() => handleSubmit()}
/>

// Secondary with icon
<Button
  title="Continue"
  variant="secondary"
  icon={<MaterialIcons name="check" size={18} color="#fff" />}
  onPress={() => handleContinue()}
/>

// Outline variant
<Button
  title="Cancel"
  variant="outline"
  onPress={() => handleCancel()}
/>

// Disabled
<Button
  title="Disabled"
  disabled={true}
  onPress={() => {}}
/>
```

### Example Output

```
┌─────────┐  ┌───────────────┐
│ Submit  │  │ ✓ Continue    │
└─────────┘  └───────────────┘
   Primary       Secondary
```

---

## Toggle

A switch/toggle component for binary state control.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | `boolean` | Yes | - | Current state |
| `onValueChange` | `(value: boolean) => void` | Yes | - | Change handler |
| `size` | `'small' \| 'medium' \| 'large'` | No | `'medium'` | Toggle size |

### Sizes

- **Small**: 36x20 points
- **Medium**: 44x24 points (default)
- **Large**: 52x28 points

### Usage

```typescript
import { Toggle } from '@/components/ui';

const [enabled, setEnabled] = useState(false);

// Basic toggle
<Toggle
  value={enabled}
  onValueChange={setEnabled}
/>

// Small toggle
<Toggle
  value={enabled}
  onValueChange={setEnabled}
  size="small"
/>

// Large toggle
<Toggle
  value={enabled}
  onValueChange={setEnabled}
  size="large"
/>
```

### Example Output

```
○●●●●●○  (off)      ●●●●●●●●  (on)
Small: ───────         ────────
Medium: ─────────       ─────────
Large: ────────────     ───────────
```

---

## Badge

A status indicator component with color variants.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `text` | `string` | Yes | - | Badge text |
| `variant` | `'success' \| 'warning' \| 'error' \| 'info'` | No | `'info'` | Color variant |
| `size` | `'small' \| 'medium'` | No | `'medium'` | Badge size |

### Variants

- **Success**: Green - for positive status
- **Warning**: Yellow/Orange - for alerts
- **Error**: Red - for errors
- **Info**: Primary blue - default

### Sizes

- **Small**: 8px padding, 10px font
- **Medium**: 12px padding, 12px font (default)

### Usage

```typescript
import { Badge } from '@/components/ui';

// Success badge
<Badge text="Active" variant="success" />

// Warning badge
<Badge text="Warning" variant="warning" />

// Error badge
<Badge text="Error" variant="error" />

// Small info badge
<Badge text="+5%" variant="success" size="small" />
```

### Example Output

```
┌────────┐  ┌─────────┐  ┌──────┐  ┌─────┐
│ Active  │  │ Warning │  │ Error │  │ +5%  │
└────────┘  └─────────┘  └──────┘  └─────┘
  Success     Warning      Error    Small+Success
  (Green)     (Yellow)    (Red)
```

---

## GaugeCard

A circular gauge component with progress indicator, used for system health metrics.

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `label` | `string` | Yes | - | Gauge label |
| `value` | `number \| string` | Yes | - | Current value to display |
| `unit` | `string` | No | - | Unit text (e.g., '%', '°C') |
| `percentage` | `number` | Yes | - | Progress percentage (0-100) |
| `icon` | `ReactNode` | Yes | - | Icon element to display |
| `color` | `string` | Yes | - | Progress bar color |

### Usage

```typescript
import { GaugeCard } from '@/components/ui';
import { MaterialIcons } from '@expo/vector-icons';

// CPU usage
<GaugeCard
  label="CPU Load"
  value={75}
  unit="%"
  percentage={75}
  icon={<MaterialIcons name="memory" size={20} color="#135bec" />}
  color="#135bec"
/>

// Temperature
<GaugeCard
  label="Temperature"
  value={45}
  unit="°C"
  percentage={90}  // Scaled up for visualization
  icon={<MaterialIcons name="thermostat" size={20} color="#f59e0b" />}
  color="#f59e0b"
/>
```

### Example Output

```
    ┌─────────┐
    │ ┌───┐   │  75 %
    │ │ 🖥 │  │   CPU Load
    │ └───┘   │
    └─────────┘
     ┌─┐       ╭──╮
     │ └────╮  │  │
     └──────┘  │  │
               ╰──╯
    Empty     75% Full
```

---

## Component Patterns

### Using Multiple Components Together

```typescript
import { Card, Button, Badge, Toggle } from '@/components/ui';

<Card shadow={true}>
  <View style={{ gap: 12 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <Text>Device Status</Text>
      <Badge text="Online" variant="success" />
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Toggle value={enabled} onValueChange={setEnabled} />
      <Text>Enable Access</Text>
    </View>

    <Button
      title="Configure"
      variant="outline"
      onPress={() => openSettings()}
    />
  </View>
</Card>
```

---

## Theme Integration

All components automatically adapt to the app's theme (dark/light mode):

```typescript
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const colorScheme = useColorScheme();
const colors = Colors[colorScheme ?? 'dark'];

// Components use theme colors automatically
// Override if needed:
<Card backgroundColor={colors.background} borderColor={colors.primary} />
```

---

## Accessibility

All components include built-in accessibility:

- **Minimum touch targets**: 44x44 points
- **Semantic roles**: Button, toggle, etc.
- **Screen reader support**: Proper labels and hints
- **Color contrast**: WCAG AA compliant

### Custom Accessibility

```typescript
<TouchableOpacity
  accessibilityLabel="Close modal"
  accessibilityRole="button"
  accessibilityHint="Double tap to dismiss"
>
  <MaterialIcons name="close" size={24} />
</TouchableOpacity>
```

---

## Best Practices

1. **Use semantic components**: `Button` for actions, not `TouchableOpacity` directly
2. **Provide proper feedback**: Use `disabled` state appropriately
3. **Consistent spacing**: Use theme spacing constants
4. **Type safety**: Always use TypeScript props
5. **Icon consistency**: Use Material Icons throughout
6. **Color meaning**: Use color variants to convey meaning (success, error, etc.)

---

## Troubleshooting

### Component not rendering correctly

1. Check imports are from `@/components/ui`
2. Verify all required props are provided
3. Check TypeScript console for type errors

### Styles not applying

1. Ensure `StyleSheet.create()` is used
2. Check for style conflicts
3. Verify theme colors are accessible

### Theme not switching

1. Ensure `useColorScheme()` hook is used
2. Check Colors object in `constants/theme.ts`
3. Verify theme context provider is configured

---

For more information, see:
- [Development Guide](DEVELOPMENT.md) - Coding standards and workflow
- [Architecture Guide](ARCHITECTURE.md) - Architecture and patterns
- [README](README.md) - Project overview
