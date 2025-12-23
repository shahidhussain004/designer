# GdsGrid Component

## Overview

`GdsGrid` is a flexible grid layout component from SEB Green Core that uses CSS Grid to arrange child elements into columns. It provides responsive, customizable grid layouts with support for breakpoints, auto-sizing columns, and comprehensive styling options.

> **Declarative Layout**: See [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) for understanding style expression properties and responsive patterns.

**Extends GdsDiv**: GdsGrid extends GdsDiv and inherits all its capabilities, including style expression properties. It uses CSS grid layout to arrange child elements into columns with automated column sizing based on content using the `auto-columns` attribute.

**Important**: Always use `<GdsGrid>` (React component) instead of `<gds-grid>` (HTML element) in React applications.

## Import

```typescript
import { GdsGrid } from '@sebgroup/green-core/react'
```

## Basic Usage

### Simple Grid

```tsx
import { GdsGrid, GdsCard, GdsFlex } from '@sebgroup/green-core/react'

function SimpleGrid() {
  return (
    <GdsGrid columns="4" gap="m">
      <GdsCard variant="secondary">
        <GdsFlex height="100px" align-items="center" justify-content="center">
          COL: 01
        </GdsFlex>
      </GdsCard>
      <GdsCard variant="secondary">
        <GdsFlex height="100px" align-items="center" justify-content="center">
          COL: 02
        </GdsFlex>
      </GdsCard>
      <GdsCard variant="secondary">
        <GdsFlex height="100px" align-items="center" justify-content="center">
          COL: 03
        </GdsFlex>
      </GdsCard>
      <GdsCard variant="secondary">
        <GdsFlex height="100px" align-items="center" justify-content="center">
          COL: 04
        </GdsFlex>
      </GdsCard>
    </GdsGrid>
  )
}
```

### Responsive Grid with Breakpoints

```tsx
<GdsGrid
  columns="l{8} m{4} s{2}"
  gap="l{xl} m{l} s{xs}"
  padding="l{2xl} m{l} s{xs}"
>
  {/* Child elements */}
</GdsGrid>
```

### Grid with Auto Columns

```tsx
<GdsGrid columns="4" gap="m" auto-columns="100">
  {/* Columns will be approximately 100px wide */}
  {/* Child elements */}
</GdsGrid>
```

### Fluid Grid (Auto-Responsive)

```tsx
<GdsGrid gap="s" auto-columns="s{200} m{220} l{240}">
  {/* Grid automatically adapts to content and available width */}
  {/* Child elements */}
</GdsGrid>
```

## Complete Public API

This section documents the public attributes, properties, and events from the Storybook documentation.

**Note**: GdsGrid extends GdsDiv and inherits all its capabilities including style expression properties.

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | `GdsColorLevel` | `'2'` | The level of the container is used to resolve color tokens from the corresponding level. Check the Color System documentation page for more information. Default for gds-grid is level 2. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element. This attribute is set automatically by the element and is intended to be read-only. |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | `string` | `undefined` | The number of columns to divide the space into. Accepts a unitless number. Example: `"1"` or `"m{2} l{4}"` to vary number of columns based on viewport size. |
| `auto-columns` | `string` | `undefined` | Defines the minimum column width. If set, the grid adjusts column size based on content and available width, even without other attributes. Accepts any valid CSS units. |
| `font` | `string` | `undefined` | Style Expression Property that controls the font property. Supports all font tokens from the design system. |
| `overflow-wrap` | `string` | `undefined` | Style Expression Property that controls the overflow-wrap property. Supports all valid CSS overflow-wrap values. |
| `white-space` | `string` | `undefined` | Style Expression Property that controls the white-space property. Supports all valid CSS white-space values. |
| `aspect-ratio` | `string` | `undefined` | Style Expression Property that controls the aspect-ratio property. Supports all valid CSS aspect-ratio values. |
| `cursor` | `string` | `undefined` | Style Expression Property that controls the cursor property. Supports all valid CSS cursor values. |
| `pointer-events` | `string` | `undefined` | Style Expression Property that controls the pointer-events property. Supports all valid CSS pointer-events values. |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry. Read-only. |
| `styleExpressionBaseSelector` | `string` | `':host'` | Style expression properties for this element will use this selector by default. Read-only. |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element. Can be used for troubleshooting to verify the version being used. Read-only. |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element. This attribute is set automatically by the element and is intended to be read-only. |

### Declarative Layout / Style Expression Properties

All the following properties support space tokens and/or CSS values as documented:

**Sizing Properties:**
- `gap` - Defines the gap size between grid items. Uses same format as CSS gap property, and expects space tokens. Can be single value or breakpoint string: `"l{xl} m{l} s{xs}"`
- `padding` - Only accepts space tokens
- `width`, `min-width`, `max-width` - Supports space tokens and all valid CSS width values
- `inline-size`, `min-inline-size`, `max-inline-size` - Supports space tokens and all valid CSS inline-size values
- `height`, `min-height`, `max-height` - Supports space tokens and all valid CSS height values
- `block-size`, `min-block-size`, `max-block-size` - Supports space tokens and all valid CSS block-size values

**Spacing Properties:**
- `margin`, `margin-inline`, `margin-block` - Only accepts space tokens
- `padding-inline`, `padding-block` - Only accepts space tokens

**Grid Item Positioning:**
- `align-self`, `justify-self`, `place-self` - Supports all valid CSS values
- `grid-column`, `grid-row`, `grid-area` - Supports all valid CSS grid values. [MDN grid-column documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)
- `flex`, `order` - Supports all valid CSS flex/order values

**Display & Positioning:**
- `position`, `transform`, `inset` - Supports all valid CSS values
- `display` - Controls the display property. Supports all valid CSS display values

**Visual Styling:**
- `color` - Only accepts color tokens and optional transparency value, format: `tokenName/transparency` (e.g., `"neutral-01/0.2"`)
- `background` - Only accepts color tokens and optional transparency value, format: `tokenName/transparency` (e.g., `"neutral-01/0.2"`)
- `border` - Accepts string same format as CSS border property (e.g., `"4xs solid subtle-01/0.2"` where size accepts space tokens and color accepts color tokens with transparency)
- `border-color` - Only accepts color tokens and optional transparency value
- `border-width` - Only accepts space tokens
- `border-style` - Supports all valid CSS border-style values
- `border-radius` - Only accepts space tokens
- `box-shadow` - Accepts shadow tokens from design system: `xs`, `s`, `m`, `l`, `xl`
- `opacity`, `overflow`, `box-sizing`, `z-index` - Supports all valid CSS values

**Typography:**
- `font-weight` - Supports all typography weight tokens from design system
- `text-align`, `text-wrap` - Supports all valid CSS values

**Grid-Specific Alignment:**
- `align-items`, `align-content` - Supports all valid CSS values
- `justify-content`, `justify-items` - Supports all valid CSS values
- `flex-direction`, `flex-wrap` - Supports all valid CSS values
- `place-items`, `place-content` - Supports all valid CSS values

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM. |

## TypeScript

### GdsGridProps Interface

```typescript
interface GdsGridProps {
  // Attributes
  level?: GdsColorLevel // '2' default
  'gds-element'?: string // Read-only, auto-set
  
  // Core Grid Properties
  columns?: string // Number of columns, supports breakpoints: "l{8} m{4} s{2}"
  'auto-columns'?: string // Minimum column width, enables auto-responsive behavior
  gap?: string // Gap between grid items (space tokens only)
  
  // Sizing Properties
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  height?: string
  'min-height'?: string
  'max-height'?: string
  'block-size'?: string
  'min-block-size'?: string
  'max-block-size'?: string
  'aspect-ratio'?: string
  
  // Spacing Properties
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  padding?: string
  'padding-inline'?: string
  'padding-block'?: string
  
  // Grid Item Positioning
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  
  // Visual Styling Properties
  color?: string // Color tokens with optional transparency
  background?: string // Color tokens with optional transparency
  border?: string // Format: "4xs solid subtle-01/0.2"
  'border-color'?: string
  'border-width'?: string
  'border-style'?: string
  'border-radius'?: string
  'box-shadow'?: string // Shadow tokens: xs, s, m, l, xl
  opacity?: string
  
  // Typography Properties
  font?: string
  'font-weight'?: string
  'text-align'?: string
  'text-wrap'?: string
  'white-space'?: string
  'overflow-wrap'?: string
  
  // Display & Positioning Properties
  display?: string
  position?: string
  inset?: string
  'z-index'?: string
  overflow?: string
  'box-sizing'?: string
  cursor?: string
  'pointer-events'?: string
  transform?: string
  
  // Grid Alignment Properties
  'align-items'?: string
  'align-content'?: string
  'justify-content'?: string
  'justify-items'?: string
  'flex-direction'?: string
  'flex-wrap'?: string
  'place-items'?: string
  'place-content'?: string
  
  // Events
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  // Standard
  children?: React.ReactNode
}
```

### Usage Example

```typescript
import { GdsGrid, GdsCard, GdsFlex } from '@sebgroup/green-core/react'
import { useState } from 'react'

function ResponsiveGrid() {
  const [columnCount, setColumnCount] = useState('4')
  
  const handleDisconnect = (event: CustomEvent) => {
    console.log('Grid element disconnected:', event)
  }
  
  return (
    <GdsGrid
      columns={`l{${columnCount}} m{${Math.ceil(Number(columnCount) / 2)}} s{1}`}
      gap="l{xl} m{l} s{m}"
      padding="xl"
      background="primary/0.05"
      border-radius="m"
      onGdsElementDisconnected={handleDisconnect}
    >
      {Array.from({ length: 8 }, (_, i) => (
        <GdsCard key={i} variant="secondary">
          <GdsFlex height="100px" align-items="center" justify-content="center">
            COL: {String(i + 1).padStart(2, '0')}
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsGrid>
  )
}
```

## API Reference

### Core Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `columns` | `string` | `undefined` | Number of columns. Supports breakpoints: `"l{8} m{4} s{2}"` or single value: `"4"` |
| `auto-columns` | `string` | `undefined` | Minimum column width in pixels. Enables auto-responsive behavior. Supports breakpoints |
| `gap` | `string` | `undefined` | Gap between grid items. Accepts space tokens. Supports breakpoints: `"l{xl} m{l} s{xs}"` |
| `padding` | `string` | `undefined` | Padding around grid. Accepts space tokens. Supports breakpoints |
| `level` | `GdsColorLevel` | `'2'` | Color level for token resolution (inherited from container) |

### Breakpoint Format

Grid properties support responsive values using breakpoint syntax:

- **Single value**: `"4"` - applies to all screen sizes
- **Breakpoint values**: `"l{8} m{4} s{2}"` - different values per screen size
  - `l` - Large (desktop)
  - `m` - Medium (tablet)
  - `s` - Small (mobile)

### Layout Properties (Style Expressions)

| Property | Type | Description |
|----------|------|-------------|
| `width` | `string` | Width. Accepts space tokens and CSS values |
| `min-width` | `string` | Minimum width. Accepts space tokens and CSS values |
| `max-width` | `string` | Maximum width. Accepts space tokens and CSS values |
| `inline-size` | `string` | Inline size (logical width) |
| `min-inline-size` | `string` | Minimum inline size |
| `max-inline-size` | `string` | Maximum inline size |
| `height` | `string` | Height. Accepts space tokens and CSS values |
| `min-height` | `string` | Minimum height |
| `max-height` | `string` | Maximum height |
| `block-size` | `string` | Block size (logical height) |
| `min-block-size` | `string` | Minimum block size |
| `max-block-size` | `string` | Maximum block size |

### Spacing Properties

| Property | Type | Description |
|----------|------|-------------|
| `margin` | `string` | Margin. Accepts space tokens |
| `margin-inline` | `string` | Horizontal margin (logical) |
| `margin-block` | `string` | Vertical margin (logical) |
| `padding-inline` | `string` | Horizontal padding (logical) |
| `padding-block` | `string` | Vertical padding (logical) |

### Grid Item Positioning

| Property | Type | Description |
|----------|------|-------------|
| `grid-column` | `string` | Grid column placement. [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column) |
| `grid-row` | `string` | Grid row placement |
| `grid-area` | `string` | Grid area placement |
| `align-items` | `string` | Align items on cross axis |
| `align-content` | `string` | Align content when extra space |
| `justify-content` | `string` | Justify content on main axis |
| `justify-items` | `string` | Justify items in grid cells |
| `place-items` | `string` | Shorthand for align-items + justify-items |
| `place-content` | `string` | Shorthand for align-content + justify-content |

### Visual Styling Properties

| Property | Type | Description |
|----------|------|-------------|
| `color` | `string` | Text color. Accepts color tokens: `"neutral-01/0.2"` |
| `background` | `string` | Background color. Accepts color tokens: `"neutral-01/0.2"` |
| `border` | `string` | Border. Format: `"4xs solid subtle-01/0.2"` |
| `border-color` | `string` | Border color. Accepts color tokens |
| `border-width` | `string` | Border width. Accepts space tokens |
| `border-style` | `string` | Border style (solid, dashed, etc.) |
| `border-radius` | `string` | Border radius. Accepts space tokens |
| `box-shadow` | `string` | Box shadow. Accepts shadow tokens: `xs, s, m, l, xl` |
| `opacity` | `string` | Opacity (0-1) |

### Display & Positioning

| Property | Type | Description |
|----------|------|-------------|
| `display` | `string` | Display type |
| `position` | `string` | Position type (static, relative, absolute, fixed, sticky) |
| `inset` | `string` | Position inset (top, right, bottom, left) |
| `z-index` | `string` | Stacking order |
| `overflow` | `string` | Overflow behavior |
| `box-sizing` | `string` | Box sizing model |

### Transform & Effects

| Property | Type | Description |
|----------|------|-------------|
| `transform` | `string` | CSS transform |
| `cursor` | `string` | Cursor style |
| `pointer-events` | `string` | Pointer events handling |

## Usage Patterns

### 1. Responsive Dashboard Layout

```tsx
import { GdsGrid, GdsCard, GdsText } from '@sebgroup/green-core/react'

function Dashboard() {
  return (
    <GdsGrid
      columns="l{4} m{2} s{1}"
      gap="l{xl} m{l} s{m}"
      padding="l{2xl} m{xl} s{l}"
    >
      <GdsCard>
        <GdsText tag="h3">Total Revenue</GdsText>
        <GdsText tag="p" font="display-m">$24,500</GdsText>
      </GdsCard>
      <GdsCard>
        <GdsText tag="h3">Active Users</GdsText>
        <GdsText tag="p" font="display-m">1,234</GdsText>
      </GdsCard>
      <GdsCard>
        <GdsText tag="h3">Conversion Rate</GdsText>
        <GdsText tag="p" font="display-m">3.2%</GdsText>
      </GdsCard>
      <GdsCard>
        <GdsText tag="h3">Avg. Order Value</GdsText>
        <GdsText tag="p" font="display-m">$85</GdsText>
      </GdsCard>
    </GdsGrid>
  )
}
```

### 2. Form Layout with Auto Columns

```tsx
import { GdsGrid, GdsInput, Controller } from '@sebgroup/green-core/react'
import { useForm } from 'react-hook-form'

function FormGrid() {
  const { control } = useForm()
  
  return (
    <GdsGrid columns="2" gap="m" auto-columns="200">
      <Controller
        name="firstName"
        control={control}
        render={({ field }) => (
          <GdsInput label="First Name" {...field} />
        )}
      />
      <Controller
        name="lastName"
        control={control}
        render={({ field }) => (
          <GdsInput label="Last Name" {...field} />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <GdsInput label="Email" type="email" {...field} />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <GdsInput label="Phone" type="tel" {...field} />
        )}
      />
    </GdsGrid>
  )
}
```

### 3. Product Card Grid with Fluid Layout

```tsx
import { GdsGrid, GdsCard, GdsText, GdsButton } from '@sebgroup/green-core/react'

function ProductGrid({ products }) {
  return (
    <GdsGrid gap="m" auto-columns="s{200} m{220} l{240}">
      {products.map((product) => (
        <GdsCard key={product.id} variant="secondary">
          <img src={product.image} alt={product.name} />
          <GdsText tag="h4">{product.name}</GdsText>
          <GdsText>{product.price}</GdsText>
          <GdsButton>Add to Cart</GdsButton>
        </GdsCard>
      ))}
    </GdsGrid>
  )
}
```

### 4. Complex Grid with Custom Positioning

```tsx
import { GdsGrid, GdsCard } from '@sebgroup/green-core/react'

function ComplexGrid() {
  return (
    <GdsGrid columns="4" gap="m">
      {/* Spans 2 columns */}
      <GdsCard grid-column="span 2">
        <GdsText>Wide card (2 columns)</GdsText>
      </GdsCard>
      
      {/* Spans 2 rows */}
      <GdsCard grid-row="span 2">
        <GdsText>Tall card (2 rows)</GdsText>
      </GdsCard>
      
      {/* Regular card */}
      <GdsCard>
        <GdsText>Regular card</GdsText>
      </GdsCard>
      
      {/* Takes remaining space */}
      <GdsCard grid-column="1 / -1">
        <GdsText>Full width card</GdsText>
      </GdsCard>
    </GdsGrid>
  )
}
```

### 5. Single Value vs. Breakpoint Values

```tsx
// Single value for all screen sizes
<GdsGrid columns="2" gap="xl" padding="2xl">
  {/* Children */}
</GdsGrid>

// Different values per screen size
<GdsGrid
  columns="l{8} m{4} s{2}"
  gap="l{xl} m{l} s{xs}"
  padding="l{2xl} m{l} s{xs}"
>
  {/* Children */}
</GdsGrid>
```

## Auto Columns Feature

The `auto-columns` attribute enables automatic responsive behavior without explicit breakpoints. It calculates the optimal number of columns based on available width.

### Formula

The grid uses this formula to calculate maximum column width:

```
MaxColumnWidth = (W - ((C - 1) × G)) / C
```

Where:
- **W** = Total container width
- **C** = Number of columns
- **G** = Gap width

### Example Calculation

Given:
- Total width: 500px
- Number of columns: 3
- Gap width: 10px

Calculation:
1. Total gap width: (3 - 1) × 10 = 20px
2. Remaining width: 500 - 20 = 480px
3. Max column width: 480 / 3 = **160px**

### Auto Columns Usage

```tsx
// Fixed minimum width for all breakpoints
<GdsGrid columns="2" gap="xl" auto-columns="200">
  {/* Columns will be ~200px wide */}
</GdsGrid>

// Different minimum widths per breakpoint
<GdsGrid
  columns="l{8} m{4} s{2}"
  auto-columns="l{200} m{100} s{80}"
>
  {/* Responsive minimum widths */}
</GdsGrid>

// Fully fluid - no columns attribute needed
<GdsGrid gap="s" auto-columns="s{200} m{220} l{240}">
  {/* Grid adapts automatically to content */}
</GdsGrid>
```

## Best Practices

### ✅ DO

```tsx
// Use React component syntax
<GdsGrid columns="4" gap="m">
  {children}
</GdsGrid>

// Use breakpoint syntax for responsive layouts
<GdsGrid columns="l{6} m{3} s{1}" gap="m">
  {children}
</GdsGrid>

// Use auto-columns for flexible, content-aware grids
<GdsGrid auto-columns="240" gap="m">
  {children}
</GdsGrid>

// Use space tokens for gap and padding
<GdsGrid gap="xl" padding="2xl">
  {children}
</GdsGrid>

// Combine columns with auto-columns for hybrid approach
<GdsGrid columns="4" auto-columns="100" gap="m">
  {children}
</GdsGrid>
```

### ❌ DON'T

```tsx
// Don't use HTML element syntax in React
<gds-grid columns="4">
  {children}
</gds-grid>

// Don't use pixel values without breakpoints for responsive designs
<GdsGrid gap="20px">
  {children}
</GdsGrid>

// Don't mix breakpoint and non-breakpoint syntax inconsistently
<GdsGrid columns="l{4} m{2} s{1}" gap="m">
  {/* Gap should also use breakpoints for consistency */}
</GdsGrid>

// Don't use inline styles when style properties are available
<GdsGrid style={{ gap: '20px' }}>
  {/* Use gap="m" instead */}
</GdsGrid>
```

## Common Use Cases

### When to Use GdsGrid

1. **Card Layouts**: Product grids, dashboard cards, gallery items
2. **Form Layouts**: Multi-column forms with responsive behavior
3. **Content Sections**: Blog posts, articles, feature sections
4. **Dashboard Widgets**: Stat cards, chart containers, metric displays
5. **Navigation Menus**: Grid-based navigation layouts

### When NOT to Use GdsGrid

1. **Linear Layouts**: Use `GdsFlex` for single-row/column layouts
2. **Tables**: Use `GdsTable` for tabular data
3. **Lists**: Use semantic HTML lists for sequential content
4. **Complex Overlapping Layouts**: Consider CSS Grid with custom CSS
5. **Horizontal Scrolling**: Use `GdsFlex` with overflow settings

## Accessibility Considerations

- Grid maintains semantic HTML structure
- Use appropriate heading levels within grid items
- Ensure sufficient color contrast in grid items
- Grid items are keyboard navigable
- Screen readers announce grid items sequentially

## Browser Support

GdsGrid uses modern CSS Grid features and is supported in:
- Chrome/Edge 88+
- Firefox 85+
- Safari 14.1+
- Mobile browsers (iOS 14.5+, Android Chrome 88+)

## Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element is disconnected from DOM |

## Additional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of element |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only) |

## Related Components

- **Spacing** - Spacing system and gap tokens for grid layouts (see [Spacing.md](./Spacing.md))
- **GdsFlex** - For flexbox layouts, horizontal/vertical stacks
- **GdsCard** - Common child component for grid items
- **GdsImg** - For image galleries in grids
- **GdsVideo** - For video galleries in grids (responsive aspect ratios)
- **GdsMask** - For gradient overlays in grid card images
- **GdsDiv** - Generic container with style expressions (base component)
- **GdsContainer** - Page-level container component
- **GdsContextMenu** - For table/grid row actions
- **GdsText** - Typography component for grid content
- **GdsButton** - Button component within grid items
- **GdsTheme** - Theme utility for controlling color schemes (beta)
- **GdsRichText** - For rich text content within grid items
- **GdsTextarea** - Multi-line text input component
- **GdsSegmentedControl** - For view switchers within grid items
- **GdsSensitiveAccount** - Formatted account with blur privacy protection (beta)
- **GdsSensitiveDate** - Formatted date with blur privacy protection (beta)
- **GdsSensitiveNumber** - Formatted number with blur privacy protection (beta)
- **Icons** - See `docs/components/green-core/Icons.md` for icon components (use Icon prefix, not Gds)

## Migration from Old Patterns

### Before (Custom CSS Grid)

```tsx
<div style={{ 
  display: 'grid', 
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '24px'
}}>
  {children}
</div>
```

### After (GdsGrid)

```tsx
<GdsGrid columns="4" gap="xl">
  {children}
</GdsGrid>
```

## Troubleshooting

### Grid Items Not Sizing Correctly

**Problem**: Grid items overflow or don't respect column sizes

**Solution**: Use `auto-columns` or ensure child elements have proper `min-width: 0`

```tsx
<GdsGrid columns="4" gap="m" auto-columns="100">
  <GdsCard min-width="0"> {/* Prevents overflow */}
    Content
  </GdsCard>
</GdsGrid>
```

### Breakpoints Not Working

**Problem**: Responsive values not applying

**Solution**: Ensure breakpoint syntax is correct with spaces between tokens

```tsx
// ❌ Wrong
<GdsGrid columns="l{4}m{2}s{1}">

// ✅ Correct
<GdsGrid columns="l{4} m{2} s{1}">
```

### Gap Not Showing

**Problem**: No visual gap between items

**Solution**: Use space tokens, not pixel values

```tsx
// ❌ Wrong
<GdsGrid gap="20px">

// ✅ Correct
<GdsGrid gap="m">
```

## Examples in Context

See these forms for real-world GdsGrid usage:
- `src/pages/PersonalInfoForm.tsx` - Form field grid layout
- `src/pages/AddressDetailsForm.tsx` - Responsive form sections
- `src/pages/BankAccountForm.tsx` - Multi-column form layout
- `src/pages/Dashboard.tsx` - Card grid layout

## Resources

- [SEB Green Core Documentation](https://storybook.seb.io/latest/green-core/)
- [CSS Grid Layout Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [MDN CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

---

*Documentation generated based on SEB Green Core specifications*
*Last updated: November 12, 2025*
