# GdsTheme

Theme utility component for controlling CSS variables, color schemes (light/dark mode), and design versions (2016/2023) for child components.

**Status:** Beta

> **Architecture**: See [Green Design System Architecture](./GreenDesignSystemArchitecture.md) for understanding how design tokens cascade through the system.

> **Localization**: For built-in component localization and initialization, see [Localization](./Localization.md).

> **Tokens**: For token usage and examples (colors, spacing, typography), see [Tokens](./Tokens.md).

> **Transitional Styles**: For instructions on applying and registering legacy 2016 styles during migration, see [TransitionalStyles](./TransitionalStyles.md).

> **Related tokens & features**: See [Shadows](./Shadows.md), [Viewport](./Viewport.md), [Motion](./Motion.md), and [Accessibility](./Accessibility.md)

## Import

```tsx
import { GdsTheme } from '@sebgroup/green-core/react'
```

**Important:** In React, always use `<GdsTheme>` (PascalCase), NOT `<gds-theme>` (lowercase web component tag).

## Basic Usage

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard>
    <GdsButton>Button with default theme</GdsButton>
  </GdsCard>
</GdsTheme>
```

## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `color-scheme` | `'light' \| 'dark' \| 'auto'` | `'light'` | The theme mode. 'auto' respects system preferences. |
| `design-version` | `'2016' \| '2023'` | `'2023'` | The design version to use. For 2016 styles, Transitional Styles must be imported and registered. |
| `gds-element` | `string` | `undefined` | Read-only. The unscoped name of this element. Set automatically. |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `colorScheme` | `'light' \| 'dark' \| 'auto'` | `'light'` | The theme mode. Can be light, dark, or auto. |
| `designVersion` | `'2016' \| '2023'` | `'2023'` | The design version to use. Can be 2016 or 2023. |
| `isDefined` | `boolean` | `false` | Read-only. Whether the element is defined in the custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Read-only. Base selector for style expression properties |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Read-only. The semantic version of this element for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Read-only. The unscoped name of this element |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-color-scheme-changed` | `CustomEvent` | Fires when the color scheme changes |
| `gds-design-version-changed` | `CustomEvent` | Fires when the design version changes |
| `gds-element-disconnected` | `CustomEvent` | Fires when the element is disconnected from the DOM |

## Examples

### 1. Default Theme (Light Mode, 2023 Design)

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

function DefaultTheme() {
  return (
    <GdsTheme>
      <GdsCard variant="primary" align="center">
        <GdsButton>Default theme button</GdsButton>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 2. Dark Mode

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

function DarkTheme() {
  return (
    <GdsTheme color-scheme="dark">
      <GdsCard variant="primary" align="center">
        <GdsButton>Dark mode button</GdsButton>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 3. Auto Mode (System Preference)

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

function AutoTheme() {
  return (
    <GdsTheme color-scheme="auto">
      <GdsCard variant="primary" align="center">
        <GdsButton>Auto mode button (follows system preference)</GdsButton>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 4. 2016 Design Version

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

// Note: For 2016 styles, Transitional Styles must be imported and registered

function Legacy2016Theme() {
  return (
    <GdsTheme color-scheme="light" design-version="2016">
      <GdsCard variant="primary" align="center">
        <GdsButton>2016 design button</GdsButton>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 5. Comparing Design Versions

```tsx
import { GdsTheme, GdsCard, GdsButton, GdsGrid, GdsFlex } from '@sebgroup/green-core/react'

function DesignVersionComparison() {
  return (
    <GdsTheme>
      <GdsGrid gap="m" columns="2">
        <GdsFlex flex-direction="column" gap="m">
          <GdsTheme color-scheme="auto" design-version="2023">
            <GdsCard variant="primary" align="center">
              <GdsButton>Auto mode (2023)</GdsButton>
            </GdsCard>
          </GdsTheme>
          <GdsTheme color-scheme="light" design-version="2023">
            <GdsCard variant="primary" align="center">
              <GdsButton>Light mode (2023)</GdsButton>
            </GdsCard>
          </GdsTheme>
          <GdsTheme color-scheme="dark" design-version="2023">
            <GdsCard variant="primary" align="center">
              <GdsButton>Dark mode (2023)</GdsButton>
            </GdsCard>
          </GdsTheme>
        </GdsFlex>
        
        <GdsFlex flex-direction="column" gap="m">
          <GdsTheme color-scheme="auto" design-version="2016">
            <GdsCard variant="primary" align="center">
              <GdsButton>Auto mode (2016)</GdsButton>
            </GdsCard>
          </GdsTheme>
          <GdsTheme color-scheme="light" design-version="2016">
            <GdsCard variant="primary" align="center">
              <GdsButton>Light mode (2016)</GdsButton>
            </GdsCard>
          </GdsTheme>
          <GdsTheme color-scheme="dark" design-version="2016">
            <GdsCard variant="primary" align="center">
              <GdsButton>Dark mode (2016)</GdsButton>
            </GdsCard>
          </GdsTheme>
        </GdsFlex>
      </GdsGrid>
    </GdsTheme>
  )
}
```

### 6. Dynamic Theme Switching

```tsx
import { useState } from 'react'
import { GdsTheme, GdsCard, GdsButton, GdsFlex } from '@sebgroup/green-core/react'

function ThemeSwitcher() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>('light')
  
  return (
    <GdsTheme color-scheme={colorScheme}>
      <GdsCard>
        <GdsFlex gap="m" flex-direction="column">
          <GdsButton onClick={() => setColorScheme('light')}>
            Light Mode
          </GdsButton>
          <GdsButton onClick={() => setColorScheme('dark')}>
            Dark Mode
          </GdsButton>
          <GdsButton onClick={() => setColorScheme('auto')}>
            Auto Mode
          </GdsButton>
        </GdsFlex>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 7. Nested Themes

```tsx
import { GdsTheme, GdsCard, GdsButton, GdsFlex } from '@sebgroup/green-core/react'

function NestedThemes() {
  return (
    <GdsTheme color-scheme="light">
      <GdsCard>
        <GdsFlex gap="m" flex-direction="column">
          <GdsButton>Outer light theme</GdsButton>
          
          <GdsTheme color-scheme="dark">
            <GdsCard variant="tertiary">
              <GdsButton>Inner dark theme</GdsButton>
            </GdsCard>
          </GdsTheme>
        </GdsFlex>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 8. Theme with Event Handlers

```tsx
import { GdsTheme, GdsCard, GdsButton } from '@sebgroup/green-core/react'

function ThemeWithEvents() {
  const handleColorSchemeChange = (e: CustomEvent) => {
    console.log('Color scheme changed:', e.detail)
  }
  
  const handleDesignVersionChange = (e: CustomEvent) => {
    console.log('Design version changed:', e.detail)
  }
  
  return (
    <GdsTheme 
      color-scheme="auto"
      onGdsColorSchemeChanged={handleColorSchemeChange}
      onGdsDesignVersionChanged={handleDesignVersionChange}
    >
      <GdsCard>
        <GdsButton>Theme with event handlers</GdsButton>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 9. Application Root Theme

```tsx
import { GdsTheme } from '@sebgroup/green-core/react'

// Wrap your entire application
function App() {
  return (
    <GdsTheme color-scheme="auto" design-version="2023">
      <AppRouter />
      <AppContent />
    </GdsTheme>
  )
}
```

### 10. Theme Context Provider

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'
import { GdsTheme } from '@sebgroup/green-core/react'

type ColorScheme = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light')
  
  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      <GdsTheme color-scheme={colorScheme}>
        {children}
      </GdsTheme>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

// Usage
function ThemeToggle() {
  const { colorScheme, setColorScheme } = useTheme()
  
  return (
    <GdsButton onClick={() => 
      setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
    }>
      Toggle Theme
    </GdsButton>
  )
}
```

## TypeScript

```tsx
import { GdsTheme } from '@sebgroup/green-core/react'

interface GdsThemeProps {
  // Attributes
  'color-scheme'?: 'light' | 'dark' | 'auto'
  'design-version'?: '2016' | '2023'
  'gds-element'?: string
  
  // Properties
  colorScheme?: 'light' | 'dark' | 'auto'
  designVersion?: '2016' | '2023'
  
  // Events
  onGdsColorSchemeChanged?: (event: CustomEvent) => void
  onGdsDesignVersionChanged?: (event: CustomEvent) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  children?: React.ReactNode
}

// Usage
function TypedTheme() {
  const themeProps: Partial<GdsThemeProps> = {
    'color-scheme': 'auto',
    'design-version': '2023',
    onGdsColorSchemeChanged: (e) => console.log('Scheme changed', e.detail)
  }
  
  return (
    <GdsTheme {...themeProps}>
      <div>Themed content</div>
    </GdsTheme>
  )
}
```

## Best Practices

### Application-Wide Theme

✅ **Good - Single root theme:**
```tsx
// Wrap entire app for consistent theming
function App() {
  return (
    <GdsTheme color-scheme="auto" design-version="2023">
      <Router>
        <Routes />
      </Router>
    </GdsTheme>
  )
}
```

❌ **Bad - Multiple root themes:**
```tsx
// Don't wrap every component separately
function Page() {
  return (
    <>
      <GdsTheme><Header /></GdsTheme>
      <GdsTheme><Main /></GdsTheme>
      <GdsTheme><Footer /></GdsTheme>
    </>
  )
}
```

### Color Scheme Selection

✅ **Good - Use auto for system preference:**
```tsx
// Respect user's system preference
<GdsTheme color-scheme="auto">
  <App />
</GdsTheme>
```

❌ **Bad - Force light/dark without user control:**
```tsx
// Don't force dark mode without toggle
<GdsTheme color-scheme="dark">
  <App />
</GdsTheme>
```

### Design Version

✅ **Good - Use 2023 for new projects:**
```tsx
// Modern design for new applications
<GdsTheme design-version="2023">
  <App />
</GdsTheme>
```

❌ **Bad - Use 2016 for new projects:**
```tsx
// Only use 2016 for legacy support
<GdsTheme design-version="2016">
  <NewApp />
</GdsTheme>
```

### Nested Themes

✅ **Good - Nested for specific sections:**
```tsx
// Override theme for specific component
<GdsTheme color-scheme="light">
  <MainContent />
  <GdsTheme color-scheme="dark">
    <DarkSidebar />
  </GdsTheme>
</GdsTheme>
```

❌ **Bad - Unnecessary nesting:**
```tsx
// Don't nest without purpose
<GdsTheme color-scheme="light">
  <GdsTheme color-scheme="light">
    <Content />
  </GdsTheme>
</GdsTheme>
```

### Event Handling

✅ **Good - Listen to theme changes:**
```tsx
// Track theme changes for analytics
<GdsTheme 
  color-scheme="auto"
  onGdsColorSchemeChanged={(e) => analytics.track('theme-changed', e.detail)}
>
  <App />
</GdsTheme>
```

❌ **Bad - Ignore theme changes:**
```tsx
// Missing important theme change tracking
<GdsTheme color-scheme="auto">
  <App />
</GdsTheme>
```

## Common Use Cases

### 1. Application with Theme Toggle

```tsx
import { useState } from 'react'
import { GdsTheme, GdsButton, GdsCard } from '@sebgroup/green-core/react'
import { IconMoon, IconSun } from '@sebgroup/green-core/react'

function AppWithThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  
  return (
    <GdsTheme color-scheme={isDark ? 'dark' : 'light'}>
      <GdsCard>
        <GdsButton onClick={() => setIsDark(!isDark)}>
          {isDark ? <IconSun /> : <IconMoon />}
          Toggle Theme
        </GdsButton>
        <div>
          <h1>Application Content</h1>
          <p>Content that adapts to theme</p>
        </div>
      </GdsCard>
    </GdsTheme>
  )
}
```

### 2. Persistent Theme Preference

```tsx
import { useState, useEffect } from 'react'
import { GdsTheme } from '@sebgroup/green-core/react'

function AppWithPersistentTheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'auto'>(() => {
    return (localStorage.getItem('theme') as any) || 'auto'
  })
  
  useEffect(() => {
    localStorage.setItem('theme', colorScheme)
  }, [colorScheme])
  
  return (
    <GdsTheme color-scheme={colorScheme}>
      <App />
    </GdsTheme>
  )
}
```

### 3. Theme Switcher Component

```tsx
import { GdsSegmentedControl, GdsSegment } from '@sebgroup/green-core/react'
import { IconSun, IconMoon, IconCircleHalfStroke } from '@sebgroup/green-core/react'

interface ThemeSwitcherProps {
  value: 'light' | 'dark' | 'auto'
  onChange: (value: 'light' | 'dark' | 'auto') => void
}

function ThemeSwitcher({ value, onChange }: ThemeSwitcherProps) {
  return (
    <GdsSegmentedControl 
      size="small"
      value={value}
      onChange={(e) => onChange((e.target as any).value)}
    >
      <GdsSegment value="light">
        <IconSun slot="lead" />
        Light
      </GdsSegment>
      <GdsSegment value="dark">
        <IconMoon slot="lead" />
        Dark
      </GdsSegment>
      <GdsSegment value="auto">
        <IconCircleHalfStroke slot="lead" />
        Auto
      </GdsSegment>
    </GdsSegmentedControl>
  )
}
```

### 4. Dashboard with Mixed Themes

```tsx
import { GdsTheme, GdsCard, GdsGrid } from '@sebgroup/green-core/react'

function Dashboard() {
  return (
    <GdsTheme color-scheme="light" design-version="2023">
      <GdsGrid columns="3" gap="m">
        <GdsCard>
          <h3>Light Card</h3>
          <p>Standard light theme card</p>
        </GdsCard>
        
        <GdsTheme color-scheme="dark">
          <GdsCard>
            <h3>Dark Card</h3>
            <p>Dark theme card for emphasis</p>
          </GdsCard>
        </GdsTheme>
        
        <GdsCard>
          <h3>Light Card</h3>
          <p>Another light theme card</p>
        </GdsCard>
      </GdsGrid>
    </GdsTheme>
  )
}
```

### 5. Migration from 2016 to 2023

```tsx
import { useState } from 'react'
import { GdsTheme, GdsButton, GdsCard } from '@sebgroup/green-core/react'

function MigrationDemo() {
  const [designVersion, setDesignVersion] = useState<'2016' | '2023'>('2023')
  
  return (
    <>
      <GdsButton 
        onClick={() => setDesignVersion(
          designVersion === '2023' ? '2016' : '2023'
        )}
      >
        Switch to {designVersion === '2023' ? '2016' : '2023'} Design
      </GdsButton>
      
      <GdsTheme design-version={designVersion}>
        <GdsCard>
          <h2>Current Design: {designVersion}</h2>
          <p>Compare design versions side by side</p>
        </GdsCard>
      </GdsTheme>
    </>
  )
}
```

## Related Components

- [Colors](./Colors.md) — Complete color palette and usage guidelines for theming
- [Tokens](./Tokens.md) — Design token system including color tokens
- [GdsCard](./GdsCard.md) — Cards that adapt to theme
- [GdsButton](./GdsButton.md) — Buttons with theme variants
- [GdsText](./GdsText.md) — Typography that adapts to theme
- [GdsMask](./GdsMask.md) — Gradient overlays with theme support
- [GdsAlert](./GdsAlert.md) — Alerts that adapt to theme
- [GdsRichText](./GdsRichText.md) — Rich text with theme adaptation
- All Green Core components — All components respect theme settings

## Accessibility

- **System Preference**: Use `color-scheme="auto"` to respect user's system dark/light mode preference
- **High Contrast**: Both light and dark modes support high contrast settings
- **Focus Indicators**: Theme ensures proper focus indicators in both modes
- **Color Contrast**: All themes meet WCAG AA contrast requirements
- **Reduced Motion**: Respects `prefers-reduced-motion` system setting

## Notes

- **Application Root**: Typically used at the application root to control global theming
- **Color Scheme**: Three options - `light`, `dark`, or `auto` (follows system preference)
- **Design Versions**: `2023` (modern, default) or `2016` (legacy, requires Transitional Styles)
- **Auto Mode**: Automatically switches between light/dark based on system preference
- **Nested Themes**: Can be nested to override theme for specific sections
- **CSS Variables**: Controls CSS custom properties for colors, spacing, and other design tokens
- **Event Tracking**: Emits events when color scheme or design version changes
- **2016 Support**: For 2016 design version, Transitional Styles must be imported and registered
- **Performance**: Lightweight component with minimal performance impact
- **React Context**: Consider wrapping in a custom Context Provider for global theme state
- **Local Storage**: Persist user's theme preference in localStorage for better UX
- **Beta Status**: Component is in beta; API may change in future releases
- **Migration Path**: Provides smooth migration path from 2016 to 2023 design system

---

*For icon usage in theme toggles, see [Icons documentation](./Icons.md). Use Icon prefix (IconMoon, IconSun), NOT Gds prefix.*
