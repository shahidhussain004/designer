# GdsSegmentedControl & GdsSegment

Segmented control allows users to select a single option, immediately changing the display to reflect their selection. It is used for switching views or view options, not for navigation.

## Import

```tsx
import { GdsSegmentedControl, GdsSegment } from '@sebgroup/green-core/react'
```

**Important:** In React, always use `<GdsSegmentedControl>` and `<GdsSegment>` (PascalCase), NOT `<gds-segmented-control>` and `<gds-segment>` (lowercase web component tags). Similarly, use `<GdsTheme>` instead of `<gds-theme>`.

## Import

```tsx
import { GdsSegmentedControl, GdsSegment } from '@sebgroup/green-core/react'
```

**Important:** In React, always use `<GdsSegmentedControl>` and `<GdsSegment>` (PascalCase), NOT `<gds-segmented-control>` and `<gds-segment>` (lowercase web component tags). Similarly, use `<GdsTheme>` instead of `<gds-theme>`.

## Basic Usage

```tsx
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsSegmentedControl>
    <GdsSegment value="1">Item 1</GdsSegment>
    <GdsSegment value="2">Item 2</GdsSegment>
    <GdsSegment value="3">Item 3</GdsSegment>
  </GdsSegmentedControl>
</GdsTheme>
```

## Anatomy

1. Segment buttons container — the interactive container that holds the individual segments and manages keyboard/scroll behavior.
2. Segment button — an individual selectable segment (renders as an interactive control).
3. Leading icon — optional icon before the label used to reinforce meaning.
4. Label — the visible text that describes the segment.

## Size

The segmented control supports two visual sizes:
- `medium` (default) — used for most interfaces.
- `small` — used where space is constrained.

Keep segment sizing consistent within a single control. Avoid mixing `small` and `medium` segments in the same row.

## Behaviour

- Single selection: only one segment can be active at a time. Selecting a segment deactivates the previously active segment.
- Default selection: if no `value` is provided, implementations typically select the first segment by default.
- Activation: segments act like buttons and immediately trigger a change when activated (click, keyboard). Use the `change` event to respond to selection changes and update the view accordingly.
- Not for navigation: use segmented controls to switch views or toggle display options within the same page; prefer links or menu buttons for navigation between pages.

## Icons

- Each segment can include optional leading or trailing icons to reinforce the label meaning. Prefer consistent icon placement across all segments.
- When using icons only (no visible label), always provide an accessible name via an aria-label or visible text alternative.

## Overflow & Scroll Behavior

- Segments can vary in width to accommodate different label lengths. If segments exceed the available width, the control shows scroll affordances (scroll buttons) which allow navigating hidden segments.
- You can control individual segment width with `width`, `min-width`, and `max-width` style expression properties.
- Prefer keeping segment counts low (recommended max 5) to avoid excessive overflow on small viewports.

## Accessibility

- Semantics: a segmented control that switches views can be implemented using either a group of toggle buttons (`role="group"` with `aria-pressed`) or as a tablist (`role="tablist"` + `role="tab"`/`aria-selected`) depending on whether it controls view panels. Choose the pattern that matches the behavior:
  - Use `role="tablist"`/`tab` when segments show/hide associated content panels.
  - Use toggle buttons (`aria-pressed`) when segments behave like mutually exclusive toggles affecting the same page.
- Keyboard: support Left/Right (or Up/Down) to move focus between segments, Home/End to jump to first/last segment, and Space/Enter to activate the focused segment.
- Focus: provide a visible focus indicator for keyboard users and ensure that focus is moved to the activated view when the control switches major content.
- Labels: each segment must have a clear accessible label. If using icons only, provide an accessible name via `aria-label` or `label` attribute where supported.

## Keyboard interaction

- Tab: move focus into the control (to the currently selected or first segment) and out of the control normally.
- Arrow keys: move focus between segments. Optionally implement activation on focus or require explicit activation with Space/Enter — document chosen behavior consistently.
- Home / End: move focus to the first / last segment.

## Do's and Don'ts

Do
- Use segmented controls to switch views or filter/sort content within the current page.
- Keep the number of segments small and the labels concise (recommendation: 2–5 segments).
- Keep icon usage consistent (either all segments have icons or none).

Don't
- Don't use segmented controls for primary page navigation between unrelated pages.
- Don't use as a replacement for primary action buttons — segments should change a view, not perform destructive actions.
- Don't mix segment sizes in the same control.

## Complete Public API

### GdsSegmentedControl

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `string` | `'1'` | The value of the currently selected segment. Setting this property will select the segment with the matching value. |
| `size` | `'small' \| 'medium'` | `'medium'` | Size of the segmented control |
| `gds-element` | `string` | `undefined` | Read-only. The unscoped name of this element. Set automatically. |

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `segments` | Array | - | Read-only. Returns the segments in the control |
| `intersectionObserver` | `IntersectionObserver \| null` | `null` | Intersection observer for segment visibility |
| `isDefined` | `boolean` | `false` | Read-only. Whether the element is defined in the custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Read-only. Base selector for style expression properties |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Read-only. The semantic version of this element for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Read-only. The unscoped name of this element |

#### Style Expression Properties

All properties support responsive syntax and space tokens where applicable.

| Property | Description |
|----------|-------------|
| `align-self` | Controls the align-self CSS property. Supports all valid CSS align-self values. |
| `justify-self` | Controls the justify-self CSS property. Supports all valid CSS justify-self values. |
| `place-self` | Controls the place-self CSS property. Supports all valid CSS place-self values. |
| `grid-column` | Controls the grid-column CSS property. Supports all valid CSS grid-column values. |
| `grid-row` | Controls the grid-row CSS property. Supports all valid CSS grid-row values. |
| `grid-area` | Controls the grid-area CSS property. Supports all valid CSS grid-area values. |
| `flex` | Controls the flex CSS property. Supports all valid CSS flex values. |
| `order` | Controls the order CSS property. Supports all valid CSS order values. |
| `width` | Controls the width CSS property. Supports space tokens and all valid CSS width values. |
| `min-width` | Controls the min-width CSS property. Supports space tokens and all valid CSS min-width values. |
| `max-width` | Controls the max-width CSS property. Supports space tokens and all valid CSS max-width values. |
| `inline-size` | Controls the inline-size CSS property. Supports space tokens and all valid CSS inline-size values. |
| `min-inline-size` | Controls the min-inline-size CSS property. Supports space tokens and all valid CSS min-inline-size values. |
| `max-inline-size` | Controls the max-inline-size CSS property. Supports space tokens and all valid CSS max-inline-size values. |
| `margin` | Controls the margin CSS property. Only accepts space tokens. |
| `margin-inline` | Controls the margin-inline CSS property. Only accepts space tokens. |
| `margin-block` | Controls the margin-block CSS property. Only accepts space tokens. |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `CustomEvent` | Fires when the selected segment is changed |
| `gds-element-disconnected` | `CustomEvent` | Fires when the element is disconnected from the DOM |

### GdsSegment

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `selected` | `boolean` | `false` | Whether the segment is selected |
| `value` | `string` | `undefined` | Value used to tie arbitrary data to the segment. Required. |
| `disabled` | `boolean` | `false` | Whether the segment is disabled |
| `gds-element` | `string` | `undefined` | Read-only. The unscoped name of this element. Set automatically. |

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isVisible` | `boolean` | `true` | Whether the segment is currently visible |
| `_isVisible` | `boolean` | `true` | Internal visibility state |
| `width` | `string` | `undefined` | Controls the width CSS property. Supports space tokens and all valid CSS width values. |
| `min-width` | `string` | `undefined` | Controls the min-width CSS property. Supports space tokens and all valid CSS min-width values. |
| `max-width` | `string` | `undefined` | Controls the max-width CSS property. Supports space tokens and all valid CSS max-width values. |
| `inline-size` | `string` | `undefined` | Controls the inline-size CSS property. Supports space tokens and all valid CSS inline-size values. |
| `min-inline-size` | `string` | `undefined` | Controls the min-inline-size CSS property. Supports space tokens and all valid CSS min-inline-size values. |
| `max-inline-size` | `string` | `undefined` | Controls the max-inline-size CSS property. Supports space tokens and all valid CSS max-inline-size values. |
| `isDefined` | `boolean` | `false` | Read-only. Whether the element is defined in the custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Read-only. Base selector for style expression properties |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Read-only. The semantic version of this element for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Read-only. The unscoped name of this element |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fires when the element is disconnected from the DOM |

## Examples

### 1. Basic Segmented Control

## Examples

### 1. Basic Segmented Control

```tsx
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function BasicExample() {
  return (
    <GdsTheme>
      <GdsSegmentedControl>
        <GdsSegment value="1">Item 1</GdsSegment>
        <GdsSegment value="2">Item 2</GdsSegment>
        <GdsSegment value="3">Item 3</GdsSegment>
      </GdsSegmentedControl>
    </GdsTheme>
  )
}
```

### 2. Controlled with Value and onChange

The `value` property corresponds to the value of the selected segment. Each segment needs a unique `value` property.

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function ControlledExample() {
  const [selected, setSelected] = useState('2')

  return (
    <GdsTheme>
      <GdsSegmentedControl 
        value={selected} 
        onChange={(e) => setSelected((e.target as any).value)}
      >
        <GdsSegment value="1">First</GdsSegment>
        <GdsSegment value="2">Second</GdsSegment>
        <GdsSegment value="3">Third</GdsSegment>
        <GdsSegment value="4">Fourth</GdsSegment>
        <GdsSegment value="5">Fifth</GdsSegment>
      </GdsSegmentedControl>
      <div style={{ marginTop: '1rem' }}>Selected: {selected}</div>
    </GdsTheme>
  )
}
```

### 3. Small Size Variant

```tsx
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function SmallExample() {
  return (
    <GdsTheme>
      <GdsSegmentedControl size="small" value="2">
        <GdsSegment value="1">First</GdsSegment>
        <GdsSegment value="2">Second</GdsSegment>
        <GdsSegment value="3">Third</GdsSegment>
      </GdsSegmentedControl>
    </GdsTheme>
  )
}
```

### 4. Segment Width Control

Segments can have different widths depending on content. If there are too many segments to fit in the container, scroll buttons will appear. You can control individual segment widths using `width`, `min-width`, and `max-width` style expression properties.

```tsx
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function WidthControlExample() {
  return (
    <GdsTheme>
      <div style={{ width: '90vw', maxWidth: '556px' }}>
        <GdsSegmentedControl value="1">
          <GdsSegment value="1" min-width="200px">
            Min-width
          </GdsSegment>
          <GdsSegment value="flaschenabfüllmaschine" max-width="150px">
            Flaschenabfüllmaschine
          </GdsSegment>
          <GdsSegment value="longlonglong">Long long label</GdsSegment>
          <GdsSegment value="longlabel">An even longer long label</GdsSegment>
          <GdsSegment value="pinetrees">Pinetrees</GdsSegment>
        </GdsSegmentedControl>
      </div>
    </GdsTheme>
  )
}
```

### 5. Disabled Segments

```tsx
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function DisabledExample() {
  return (
    <GdsTheme>
      <GdsSegmentedControl>
        <GdsSegment value="1">Enabled</GdsSegment>
        <GdsSegment value="2" disabled>Disabled</GdsSegment>
        <GdsSegment value="3">Enabled</GdsSegment>
      </GdsSegmentedControl>
    </GdsTheme>
  )
}
```

### 6. With Icons

Use icons from the [Icons documentation](./Icons.md). Use the `Icon` prefix (e.g., `IconHome`, `IconSettings`), NOT the `Gds` prefix.

```tsx
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'
import { IconHome, IconCog, IconPeople } from '@sebgroup/green-core/react'

function WithIconsExample() {
  return (
    <GdsTheme>
      <GdsSegmentedControl>
        <GdsSegment value="home">
          <IconHome slot="lead" />
          Home
        </GdsSegment>
        <GdsSegment value="settings">
          <IconCog slot="lead" />
          Settings
        </GdsSegment>
        <GdsSegment value="people">
          <IconPeople slot="lead" />
          People
        </GdsSegment>
      </GdsSegmentedControl>
    </GdsTheme>
  )
}
```

### 7. View Switcher

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'
import { IconBulletList, IconSquareGridCircle } from '@sebgroup/green-core/react'

function ViewSwitcher() {
  const [view, setView] = useState('list')

  return (
    <GdsTheme>
      <GdsSegmentedControl 
        value={view} 
        onChange={(e) => setView((e.target as any).value)}
      >
        <GdsSegment value="list">
          <IconBulletList slot="lead" />
          List
        </GdsSegment>
        <GdsSegment value="grid">
          <IconSquareGridCircle slot="lead" />
          Grid
        </GdsSegment>
      </GdsSegmentedControl>
      
      {view === 'list' ? <ListView /> : <GridView />}
    </GdsTheme>
  )
}
```

### 8. Filter Toggle

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function FilterToggle() {
  const [filter, setFilter] = useState('all')

  return (
    <GdsTheme>
      <GdsSegmentedControl 
        size="small" 
        value={filter} 
        onChange={(e) => setFilter((e.target as any).value)}
      >
        <GdsSegment value="all">All</GdsSegment>
        <GdsSegment value="active">Active</GdsSegment>
        <GdsSegment value="completed">Completed</GdsSegment>
      </GdsSegmentedControl>
    </GdsTheme>
  )
}
```

## TypeScript

```tsx
import { GdsSegmentedControl, GdsSegment } from '@sebgroup/green-core/react'

interface GdsSegmentedControlProps {
  value?: string
  size?: 'small' | 'medium'
  'gds-element'?: string
  
  // Style Expression Properties
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  
  // Events
  onChange?: (event: CustomEvent) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  children?: React.ReactNode
}

interface GdsSegmentProps {
  value: string
  selected?: boolean
  disabled?: boolean
  'gds-element'?: string
  
  // Style Expression Properties
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  
  // Events
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  children?: React.ReactNode
}

// Usage
function TypedExample() {
  const [value, setValue] = useState<string>('1')
  
  const handleChange = (e: CustomEvent) => {
    setValue((e.target as any).value)
  }
  
  return (
    <GdsSegmentedControl value={value} onChange={handleChange} size="medium">
      <GdsSegment value="1">First</GdsSegment>
      <GdsSegment value="2">Second</GdsSegment>
      <GdsSegment value="3" disabled>Third</GdsSegment>
    </GdsSegmentedControl>
  )
}
```

## Best Practices

### Use Cases

✅ **Good use cases:**
```tsx
// Switching between different views
<GdsSegmentedControl>
  <GdsSegment value="list">List View</GdsSegment>
  <GdsSegment value="grid">Grid View</GdsSegment>
</GdsSegmentedControl>

// Filtering content
<GdsSegmentedControl size="small">
  <GdsSegment value="all">All</GdsSegment>
  <GdsSegment value="active">Active</GdsSegment>
  <GdsSegment value="completed">Completed</GdsSegment>
</GdsSegmentedControl>

// Toggling display options
<GdsSegmentedControl>
  <GdsSegment value="day">Day</GdsSegment>
  <GdsSegment value="week">Week</GdsSegment>
  <GdsSegment value="month">Month</GdsSegment>
</GdsSegmentedControl>
```

❌ **Avoid using for:**
```tsx
// Navigation (use navigation components instead)
<GdsSegmentedControl>
  <GdsSegment value="/home">Home</GdsSegment>
  <GdsSegment value="/about">About</GdsSegment>
  <GdsSegment value="/contact">Contact</GdsSegment>
</GdsSegmentedControl>

// Form submission (use radio buttons or dropdown)
<GdsSegmentedControl>
  <GdsSegment value="yes">Yes</GdsSegment>
  <GdsSegment value="no">No</GdsSegment>
</GdsSegmentedControl>
```

### Unique Values

✅ **Good - Unique values:**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="1">Option 1</GdsSegment>
  <GdsSegment value="2">Option 2</GdsSegment>
  <GdsSegment value="3">Option 3</GdsSegment>
</GdsSegmentedControl>
```

❌ **Bad - Duplicate values:**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="option">Option 1</GdsSegment>
  <GdsSegment value="option">Option 2</GdsSegment>
  <GdsSegment value="option">Option 3</GdsSegment>
</GdsSegmentedControl>
```

### Concise Labels

✅ **Good - Short, clear labels:**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="day">Day</GdsSegment>
  <GdsSegment value="week">Week</GdsSegment>
  <GdsSegment value="month">Month</GdsSegment>
</GdsSegmentedControl>
```

❌ **Bad - Long labels:**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="daily">Daily View of All Transactions</GdsSegment>
  <GdsSegment value="weekly">Weekly Summary Report</GdsSegment>
  <GdsSegment value="monthly">Monthly Financial Overview</GdsSegment>
</GdsSegmentedControl>
```

### Icon Usage

✅ **Good - Icons with text for clarity:**
```tsx
import { IconBulletList, IconSquareGridCircle } from '@sebgroup/green-core/react'

<GdsSegmentedControl>
  <GdsSegment value="list">
    <IconBulletList slot="lead" />
    List
  </GdsSegment>
  <GdsSegment value="grid">
    <IconSquareGridCircle slot="lead" />
    Grid
  </GdsSegment>
</GdsSegmentedControl>
```

❌ **Bad - Icons without context:**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="list">
    <IconBulletList slot="lead" />
  </GdsSegment>
  <GdsSegment value="grid">
    <IconSquareGridCircle slot="lead" />
  </GdsSegment>
</GdsSegmentedControl>
```

### Segment Count

✅ **Good - 2-5 segments:**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="1">One</GdsSegment>
  <GdsSegment value="2">Two</GdsSegment>
  <GdsSegment value="3">Three</GdsSegment>
</GdsSegmentedControl>
```

❌ **Bad - Too many segments (use dropdown instead):**
```tsx
<GdsSegmentedControl>
  <GdsSegment value="1">Option 1</GdsSegment>
  <GdsSegment value="2">Option 2</GdsSegment>
  {/* ... 10 more segments ... */}
  <GdsSegment value="12">Option 12</GdsSegment>
</GdsSegmentedControl>
```

## Common Use Cases

### 1. View Mode Switcher

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme, GdsCard } from '@sebgroup/green-core/react'
import { IconBulletList, IconSquareGridCircle } from '@sebgroup/green-core/react'

function ViewModeSwitcher() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  
  return (
    <GdsTheme>
      <GdsCard>
        <GdsSegmentedControl 
          value={viewMode} 
          onChange={(e) => setViewMode((e.target as any).value)}
          margin-block="m"
        >
          <GdsSegment value="list">
            <IconBulletList slot="lead" />
            List View
          </GdsSegment>
          <GdsSegment value="grid">
            <IconSquareGridCircle slot="lead" />
            Grid View
          </GdsSegment>
        </GdsSegmentedControl>
        
        {viewMode === 'list' ? (
          <div>List content here...</div>
        ) : (
          <div>Grid content here...</div>
        )}
      </GdsCard>
    </GdsTheme>
  )
}
```

### 2. Time Period Filter

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function TimePeriodFilter() {
  const [period, setPeriod] = useState('week')
  
  return (
    <GdsTheme>
      <GdsSegmentedControl 
        value={period} 
        onChange={(e) => setPeriod((e.target as any).value)}
      >
        <GdsSegment value="day">Day</GdsSegment>
        <GdsSegment value="week">Week</GdsSegment>
        <GdsSegment value="month">Month</GdsSegment>
        <GdsSegment value="year">Year</GdsSegment>
      </GdsSegmentedControl>
      
      <ChartComponent period={period} />
    </GdsTheme>
  )
}
```

### 3. Status Filter

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function StatusFilter() {
  const [status, setStatus] = useState('all')
  
  const filteredItems = items.filter(item => 
    status === 'all' ? true : item.status === status
  )
  
  return (
    <GdsTheme>
      <GdsSegmentedControl 
        size="small"
        value={status} 
        onChange={(e) => setStatus((e.target as any).value)}
      >
        <GdsSegment value="all">All</GdsSegment>
        <GdsSegment value="active">Active</GdsSegment>
        <GdsSegment value="pending">Pending</GdsSegment>
        <GdsSegment value="completed">Completed</GdsSegment>
      </GdsSegmentedControl>
      
      <ItemList items={filteredItems} />
    </GdsTheme>
  )
}
```

### 4. Chart Type Selector

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme, GdsCard } from '@sebgroup/green-core/react'

function ChartTypeSelector() {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')
  
  return (
    <GdsTheme>
      <GdsCard>
        <GdsSegmentedControl 
          value={chartType} 
          onChange={(e) => setChartType((e.target as any).value)}
        >
          <GdsSegment value="bar">Bar Chart</GdsSegment>
          <GdsSegment value="line">Line Chart</GdsSegment>
          <GdsSegment value="pie">Pie Chart</GdsSegment>
        </GdsSegmentedControl>
        
        {chartType === 'bar' && <BarChart />}
        {chartType === 'line' && <LineChart />}
        {chartType === 'pie' && <PieChart />}
      </GdsCard>
    </GdsTheme>
  )
}
```

### 5. Transaction Type Filter

```tsx
import { useState } from 'react'
import { GdsSegmentedControl, GdsSegment, GdsTheme } from '@sebgroup/green-core/react'

function TransactionFilter() {
  const [transactionType, setTransactionType] = useState('all')
  
  return (
    <GdsTheme>
      <GdsSegmentedControl 
        value={transactionType} 
        onChange={(e) => setTransactionType((e.target as any).value)}
        margin-block="m"
      >
        <GdsSegment value="all">All Transactions</GdsSegment>
        <GdsSegment value="income">Income</GdsSegment>
        <GdsSegment value="expense">Expenses</GdsSegment>
      </GdsSegmentedControl>
      
      <TransactionList type={transactionType} />
    </GdsTheme>
  )
}
```

## Related Components

- [GdsButton](./GdsButton.md) — For individual actions
- [GdsRadioGroup](./GdsRadioGroup.md) — For form input selection with mutually exclusive options
- [GdsCheckbox](./GdsCheckbox.md) — For multiple selections
- [GdsDropdown](./GdsDropdown.md) — For selection from many options
- [GdsFlex](./GdsFlex.md) — For layout of segmented controls
- [Icons](./Icons.md) — Available icons for segments

## Accessibility

- **Keyboard Navigation**: Use arrow keys to navigate between segments, Space/Enter to select
- **ARIA Roles**: Segments have appropriate ARIA roles for screen readers
- **Focus Management**: Focus is properly managed when switching between segments
- **Disabled State**: Disabled segments are properly announced to screen readers

## Notes

- **For View Switching Only**: Segmented controls are designed for switching views or view options, NOT for navigation
- **Unique Values Required**: Each `GdsSegment` must have a unique `value` attribute
- **Automatic Scrolling**: If segments don't fit in the container, scroll buttons appear automatically
- **Size Variants**: Two sizes available - `small` for compact layouts, `medium` (default) for standard use
- **Width Control**: Individual segment widths can be controlled using `width`, `min-width`, and `max-width` style expression properties
- **Style Expression Properties**: Extends GdsDiv with all layout properties (margin, width, flex, grid, etc.)
- **Event Handling**: `change` event fires when selection changes, providing the new value
- **Icon Support**: Segments support icons using the `slot="lead"` pattern
- **React Compatibility**: Use PascalCase component names (`<GdsSegmentedControl>`, `<GdsSegment>`) in React
- **Theme Integration**: Works seamlessly with `<GdsTheme>` for consistent styling

---

*For icon usage, see [Icons documentation](./Icons.md). Use Icon prefix (IconHome, IconCog), NOT Gds prefix.*
