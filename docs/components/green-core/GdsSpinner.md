# GdsSpinner

An indeterminate progress indicator that provides visual feedback for loading states, ongoing processes, or when the duration of an operation is unknown. The spinner supports multiple sizes, label positioning, container overlay, and fullscreen modes.

**Status:** Beta

## Features

- Multiple sizes (sm, md, lg)
- Optional text label with flexible positioning (top, bottom, left, right)
- Container cover mode with semi-transparent backdrop
- Fullscreen mode covering entire viewport
- Accessibility support with screen reader labels
- Light/dark theme adaptation
- Style expression properties for layout control

## Import

```typescript
import { GdsSpinner } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
import { GdsSpinner, GdsTheme, GdsCard, GdsDiv, GdsText } from '@sebgroup/green-core/react'

function LoadingContainer() {
  return (
    <GdsTheme>
      <GdsCard position="relative" width="400px" height="300px" border-radius="xs" overflow="hidden">
        <GdsDiv padding="m">
          <GdsText tag="h3" margin-top="0">Container Content</GdsText>
          <GdsText tag="p">This is some sample content in the container.</GdsText>
          <GdsText tag="p">More content here...</GdsText>
        </GdsDiv>
        <GdsSpinner size="md" showLabel />
      </GdsCard>
    </GdsTheme>
  )
}
```

## Public API

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Size variant of the spinner |
| `showLabel` | `boolean` | `false` | Whether to display the label text visually. If false, label is still available for screen readers |
| `cover` | `boolean` | `false` | When true, covers the parent container with a semi-transparent backdrop. Parent must have `position: relative` |
| `fullscreen` | `boolean` | `false` | When true, covers the entire viewport with a fixed position backdrop |
| `label` | `string` | `'Loading...'` | The text to display as a label for the spinner |
| `label-position` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position of the label relative to the spinner |
| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `labelPosition` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | Position of the label relative to the spinner |
| `position` | `string` | `undefined` | Style Expression Property for CSS position |
| `transform` | `string` | `undefined` | Style Expression Property for CSS transform |
| `inset` | `string` | `undefined` | Style Expression Property for CSS inset |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |
| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |

### Style Expression Properties

GdsSpinner supports the following style expression properties for layout control:

#### Spacing
- `margin` — Controls all margins (space tokens only)
- `margin-inline` — Controls inline margins (space tokens only)
- `margin-block` — Controls block margins (space tokens only)

#### Positioning & Layout
- `align-self` — Controls alignment within parent flex/grid container
- `justify-self` — Controls justification within parent grid container
- `place-self` — Shorthand for `align-self` and `justify-self`

#### Grid Layout
- `grid-column` — Controls grid column placement
- `grid-row` — Controls grid row placement
- `grid-area` — Controls grid area placement

#### Flexbox
- `flex` — Controls flex grow, shrink, and basis
- `order` — Controls order in flex container

#### Sizing
- `width` — Controls width
- `min-width` — Controls minimum width
- `max-width` — Controls maximum width
- `inline-size` — Controls inline size
- `min-inline-size` — Controls minimum inline size
- `max-inline-size` — Controls maximum inline size

### Events

| Name | Type | Description |
|------|------|-------------|
| `gds-spinner-connected` | `CustomEvent` | Fired when the spinner is connected and visible |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from DOM |

## Examples

### Size Variants

```tsx
import { GdsSpinner, GdsTheme, GdsFlex, GdsDiv } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex gap="2xl" align-items="center">
    <GdsDiv text-align="center">
      <GdsSpinner size="sm" label="Small" showLabel />
    </GdsDiv>
    <GdsDiv text-align="center">
      <GdsSpinner size="md" label="Medium (default)" showLabel />
    </GdsDiv>
    <GdsDiv text-align="center">
      <GdsSpinner size="lg" label="Large" showLabel />
    </GdsDiv>
  </GdsFlex>
</GdsTheme>
```

### Label Options

The label is hidden by default but available to screen readers. Use `showLabel` to make it visible, and `label-position` to control placement:

```tsx
import { GdsSpinner, GdsTheme, GdsGrid, GdsFlex, GdsCard, GdsText } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsGrid gap="4xl" columns=">0{2}">
    <GdsFlex text-align="center" flex-direction="column" gap="m" flex="1">
      <GdsText tag="h4">Hidden Label</GdsText>
      <GdsCard>
        <GdsSpinner size="md" label="With hidden label (for screen readers)" />
      </GdsCard>
    </GdsFlex>
    
    <GdsFlex text-align="center" flex-direction="column" gap="m" flex="1">
      <GdsText tag="h4">Visible Label</GdsText>
      <GdsCard>
        <GdsSpinner size="md" label="With visible label" showLabel />
      </GdsCard>
    </GdsFlex>
    
    <GdsFlex text-align="center" flex-direction="column" gap="m" flex="1">
      <GdsText tag="h4">Label Top</GdsText>
      <GdsCard>
        <GdsSpinner size="md" label="With label on top" label-position="top" showLabel />
      </GdsCard>
    </GdsFlex>
    
    <GdsFlex text-align="center" flex-direction="column" gap="m" flex="1">
      <GdsText tag="h4">Label Left</GdsText>
      <GdsCard>
        <GdsSpinner size="md" label="With label on left" label-position="left" showLabel />
      </GdsCard>
    </GdsFlex>
    
    <GdsFlex text-align="center" flex-direction="column" gap="m" flex="1">
      <GdsText tag="h4">Label Right</GdsText>
      <GdsCard>
        <GdsSpinner size="md" label="With label on right" label-position="right" showLabel />
      </GdsCard>
    </GdsFlex>
  </GdsGrid>
</GdsTheme>
```

### Container Cover Mode

Set the parent container to `position="relative"`, then use `cover` attribute to overlay the spinner with a semi-transparent backdrop:

```tsx
import { GdsSpinner, GdsTheme, GdsCard, GdsDiv, GdsText } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard 
    position="relative" 
    width="400px" 
    height="300px" 
    border-radius="xs" 
    overflow="hidden"
  >
    <GdsDiv padding="m">
      <GdsText tag="h3" margin-top="0">Container Content</GdsText>
      <GdsText tag="p">This is some sample content in the container.</GdsText>
      <GdsText tag="p">More content here...</GdsText>
    </GdsDiv>
    
    <GdsSpinner cover showLabel size="md" />
  </GdsCard>
</GdsTheme>
```

### Fullscreen Mode

The fullscreen spinner covers the entire viewport and prevents scrolling:

```tsx
import { GdsSpinner, GdsTheme, GdsDiv } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsDiv height="400px">
    <GdsSpinner fullscreen showLabel />
  </GdsDiv>
</GdsTheme>
```

### Light & Dark Theme

The spinner automatically adapts to light and dark themes, with the label using `currentColor` to inherit text color:

```tsx
import { GdsSpinner, GdsTheme, GdsCard, GdsFlex, GdsText, GdsDiv } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsTheme color-scheme="light">
    <GdsCard variant="secondary" padding="2xl">
      <GdsText tag="h3">Theme Mode Demonstration</GdsText>
      <GdsText tag="p">
        The spinner automatically adapts to light and dark themes:
      </GdsText>

      <GdsFlex gap="2xl" margin-top="l" justify-content="center">
        <GdsCard padding="l" width="180px">
          <GdsFlex flex-direction="column" align-items="center" gap="m">
            <GdsText margin-top="m" font-weight="medium">Standard Spinner</GdsText>
            <GdsSpinner size="md" />
          </GdsFlex>
        </GdsCard>

        <GdsCard padding="l" width="180px">
          <GdsFlex flex-direction="column" align-items="center" gap="m">
            <GdsText margin-top="m" font-weight="medium">With Label</GdsText>
            <GdsSpinner size="md" showLabel />
          </GdsFlex>
        </GdsCard>

        <GdsCard padding="l" width="180px">
          <GdsText text-align="center" font-weight="medium">With Cover</GdsText>
          <GdsDiv 
            position="relative" 
            height="100px" 
            display="flex" 
            align-items="center" 
            justify-content="center" 
            background="surface" 
            margin-bottom="m"
          >
            <GdsText margin="0" color="neutral-01">Content</GdsText>
            <GdsSpinner size="md" cover />
          </GdsDiv>
        </GdsCard>
      </GdsFlex>
    </GdsCard>
  </GdsTheme>
</GdsTheme>
```

### Conditional Loading State

```tsx
import { GdsSpinner, GdsTheme, GdsCard, GdsDiv, GdsText, GdsButton } from '@sebgroup/green-core/react'
import { useState, useEffect } from 'react'

function DataLoader() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      setData('Data loaded successfully!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GdsTheme>
      <GdsCard position="relative" padding="xl">
        <GdsText tag="h3">Data Loading Example</GdsText>
        <GdsButton onClick={fetchData} disabled={loading}>
          Load Data
        </GdsButton>
        
        {data && <GdsText margin-top="m">{data}</GdsText>}
        
        {loading && (
          <GdsSpinner 
            cover 
            size="md" 
            label="Loading data..." 
            showLabel 
          />
        )}
      </GdsCard>
    </GdsTheme>
  )
}
```

### Inline Spinner

```tsx
import { GdsSpinner, GdsTheme, GdsFlex, GdsText } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex gap="m" align-items="center">
    <GdsSpinner size="sm" label="Processing..." />
    <GdsText>Processing your request...</GdsText>
  </GdsFlex>
</GdsTheme>
```

### With Custom Label

```tsx
import { GdsSpinner, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsSpinner 
    size="lg" 
    label="Uploading files... Please wait" 
    label-position="top"
    showLabel 
  />
</GdsTheme>
```

## TypeScript

```typescript
import type { GdsSpinnerProps } from '@sebgroup/green-core/react'

interface GdsSpinnerProps {
  // Attributes
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  cover?: boolean
  fullscreen?: boolean
  label?: string
  'label-position'?: 'top' | 'bottom' | 'left' | 'right'
  'gds-element'?: string

  // Style Expression Properties
  position?: string
  transform?: string
  inset?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
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

  // Events
  onGdsSpinnerConnected?: (event: CustomEvent) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
}

// Usage example
const spinnerProps: GdsSpinnerProps = {
  size: 'md',
  label: 'Loading...',
  showLabel: true,
  cover: true
}
```

## Best Practices

### Accessibility

1. **Always Provide Label**: Even when `showLabel` is false, always set the `label` attribute for screen readers:
   ```tsx
   // ✅ Good - hidden label for screen readers
   <GdsSpinner label="Loading data..." />
   
   // ❌ Bad - no label
   <GdsSpinner />
   ```

2. **Descriptive Labels**: Use clear, specific labels that describe what's loading:
   ```tsx
   // ✅ Good - specific
   <GdsSpinner label="Loading customer data..." showLabel />
   
   // ❌ Bad - generic
   <GdsSpinner label="Loading..." showLabel />
   ```

3. **ARIA Live Regions**: The spinner automatically announces loading state to screen readers

### Size Selection

1. **Small (`sm`)**: Use for inline loading states, small components, or tight spaces
   ```tsx
   <GdsFlex gap="s" align-items="center">
     <GdsSpinner size="sm" />
     <GdsText>Saving...</GdsText>
   </GdsFlex>
   ```

2. **Medium (`md`)**: Default size for most use cases, container overlays
   ```tsx
   <GdsCard position="relative">
     <GdsSpinner size="md" cover />
   </GdsCard>
   ```

3. **Large (`lg`)**: Use for fullscreen loading, initial page loads, or emphasis
   ```tsx
   <GdsSpinner size="lg" fullscreen showLabel />
   ```

### Cover Mode

1. **Parent Container**: Parent must have `position: relative` for cover mode:
   ```tsx
   // ✅ Correct - parent has position relative
   <GdsCard position="relative">
     <GdsSpinner cover />
   </GdsCard>
   
   // ❌ Incorrect - parent doesn't have position
   <GdsCard>
     <GdsSpinner cover />
   </GdsCard>
   ```

2. **Overflow Control**: Use `overflow="hidden"` to prevent content from showing outside container:
   ```tsx
   <GdsCard position="relative" overflow="hidden">
     <GdsSpinner cover />
   </GdsCard>
   ```

### Fullscreen Mode

1. **Use Sparingly**: Reserve fullscreen spinners for critical loading operations:
   - Initial app load
   - Large data imports
   - Critical system updates

2. **Prevent Scrolling**: Fullscreen mode automatically prevents scrolling

3. **Conditional Rendering**: Only render when actively loading:
   ```tsx
   {isLoading && <GdsSpinner fullscreen showLabel />}
   ```

### Label Positioning

1. **Bottom (default)**: Most common, works well with all sizes
2. **Top**: Use when spinner is at the bottom of a container
3. **Left/Right**: Use for horizontal layouts, inline with text

### Performance

1. **Conditional Rendering**: Only render spinner when needed:
   ```tsx
   {loading && <GdsSpinner />}
   ```

2. **Avoid Multiple Fullscreen Spinners**: Only use one fullscreen spinner at a time

3. **Clean Up**: Remove spinner from DOM when not loading to improve performance

### Theme Adaptation

1. **Automatic Colors**: Spinner colors automatically adapt to theme (light/dark)
2. **CurrentColor**: Label inherits text color from parent context
3. **No Manual Color Overrides**: Let the theme system handle colors

## Common Use Cases

### Page Loading

```tsx
import { GdsSpinner, GdsTheme } from '@sebgroup/green-core/react'
import { useState, useEffect } from 'react'

function PageLoader() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate page load
    setTimeout(() => setLoading(false), 2000)
  }, [])

  if (loading) {
    return (
      <GdsTheme>
        <GdsSpinner 
          fullscreen 
          size="lg" 
          label="Loading application..." 
          showLabel 
        />
      </GdsTheme>
    )
  }

  return <div>Page Content</div>
}
```

### Form Submission

```tsx
import { GdsSpinner, GdsTheme, GdsCard, GdsButton, GdsInput, GdsFlex } from '@sebgroup/green-core/react'
import { useState } from 'react'

function FormWithSpinner() {
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Form submitted!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <GdsTheme>
      <GdsCard position="relative" padding="xl">
        <form onSubmit={handleSubmit}>
          <GdsFlex flex-direction="column" gap="m">
            <GdsInput label="Name" required />
            <GdsInput label="Email" type="email" required />
            <GdsButton type="submit" disabled={submitting}>
              Submit
            </GdsButton>
          </GdsFlex>
        </form>
        
        {submitting && (
          <GdsSpinner 
            cover 
            size="md" 
            label="Submitting form..." 
            showLabel 
          />
        )}
      </GdsCard>
    </GdsTheme>
  )
}
```

### Data Table Loading

```tsx
import { GdsSpinner, GdsTheme, GdsCard, GdsText } from '@sebgroup/green-core/react'
import { useState, useEffect } from 'react'

function DataTable() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setData([/* table data */])
    } finally {
      setLoading(false)
    }
  }

  return (
    <GdsTheme>
      <GdsCard position="relative" padding="xl" min-height="400px">
        <GdsText tag="h2">Customer Data</GdsText>
        
        {!loading && (
          <table>{/* table content */}</table>
        )}
        
        {loading && (
          <GdsSpinner 
            cover 
            size="md" 
            label="Loading customer data..." 
            showLabel 
          />
        )}
      </GdsCard>
    </GdsTheme>
  )
}
```

### Inline Button Loading

```tsx
import { GdsSpinner, GdsTheme, GdsButton, GdsFlex } from '@sebgroup/green-core/react'
import { useState } from 'react'

function ButtonWithSpinner() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Action completed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <GdsTheme>
      <GdsButton onClick={handleClick} disabled={loading}>
        <GdsFlex gap="s" align-items="center">
          {loading && <GdsSpinner size="sm" label="Processing..." />}
          <span>{loading ? 'Processing...' : 'Click Me'}</span>
        </GdsFlex>
      </GdsButton>
    </GdsTheme>
  )
}
```

## Related Components

- [GdsButton](./GdsButton.md) — Button component with loading states
- [GdsCard](./GdsCard.md) — Card container for spinner overlays
- [GdsFlex](./GdsFlex.md) — Layout for spinner positioning
- [GdsGrid](./GdsGrid.md) — Grid layouts with spinners
- [GdsTheme](./GdsTheme.md) — Theme context for color adaptation
- [GdsText](./GdsText.md) — Typography for spinner labels
- [GdsDiv](./GdsDiv.md) — Container for relative positioning

## Notes

- **Beta Status**: This component is in beta and may receive updates
- **Indeterminate**: Spinner is for unknown/indefinite duration. Use progress bars for determinate progress
- **Theme Adaptation**: Automatically adapts to light/dark themes via user settings
- **Position Requirements**: Parent must have `position: relative` for cover mode to work
- **Fullscreen Behavior**: Fullscreen mode uses fixed positioning and covers entire viewport
- **Label Visibility**: Label is always present for accessibility, `showLabel` only controls visual display
- **Event Tracking**: Use `gds-spinner-connected` event to track when spinner becomes visible
- **Style Expressions**: Supports margin, alignment, grid, flex, and sizing properties
- **CurrentColor**: Label text uses `currentColor` to inherit from parent context
- **No Scrolling**: Fullscreen mode prevents page scrolling while active

---

*Last updated: November 12, 2025*  
*Source: [GdsSpinner Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-spinner--docs)*
