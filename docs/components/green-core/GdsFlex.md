````markdown
# GdsFlex - SEB Green Core Flexbox Layout Component

Complete reference for the `GdsFlex` component from SEB Green Core, with React usage patterns and comprehensive API documentation.

> **Declarative Layout**: See [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) for understanding style expression properties, responsive syntax, and micro-frontend optimization.

---

## Overview

`GdsFlex` extends `GdsDiv` and sets `display: flex` by default. It's a convenience wrapper for flexbox layouts with declarative style-expression properties. Use it for row/column layouts, alignment, and token-aware spacing.

**Key Features:**
- Automatic `display: flex` behavior
- Design token integration for spacing and sizing
- Comprehensive flexbox control properties
- All style-expression properties from `GdsDiv`
- Type-safe React props
- Extends GdsDiv with all its capabilities

---

## Import

```tsx
import { GdsFlex } from '@sebgroup/green-core/react'
```

---

## Basic Usage

### Simple Flex Container

```tsx
<GdsFlex align-items="center" justify-content="space-between">
  <GdsText>Left</GdsText>
  <GdsText>Right</GdsText>
</GdsFlex>
```

### With Gap Spacing

```tsx
<GdsFlex gap="m" align-items="center">
  <IconHomeOpen />
  <GdsText>Home</GdsText>
</GdsFlex>
```

### Column Layout

```tsx
<GdsFlex flex-direction="column" gap="l">
  <GdsText tag="h2">Title</GdsText>
  <GdsText>Body content goes here.</GdsText>
</GdsFlex>
```

---

## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens from the corresponding level. Check the Color System documentation for more information. Default for gds-div is level 2. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only, set automatically) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font` | `string` | `undefined` | Style Expression Property that controls the font property. Supports all font tokens from the design system |
| `overflow-wrap` | `string` | `undefined` | Style Expression Property that controls the overflow-wrap property. Supports all valid CSS overflow-wrap values |
| `white-space` | `string` | `undefined` | Style Expression Property that controls the white-space property. Supports all valid CSS white-space values |
| `aspect-ratio` | `string` | `undefined` | Style Expression Property that controls the aspect-ratio property. Supports all valid CSS aspect-ratio values |
| `cursor` | `string` | `undefined` | Style Expression Property that controls the cursor property. Supports all valid CSS cursor values |
| `pointer-events` | `string` | `undefined` | Style Expression Property that controls the pointer-events property. Supports all valid CSS pointer-events values |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Style expression properties for this element will use this selector by default (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element. Can be used for troubleshooting to verify the version being used (read-only) |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element (read-only, set automatically) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM |

---

## API Reference

### Core Flexbox Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `flex-direction` | Main axis direction | `row` \| `column` \| `row-reverse` \| `column-reverse` | `row` |
| `flex-wrap` | Wrapping behavior | `nowrap` \| `wrap` \| `wrap-reverse` | `nowrap` |
| `gap` | Space between children | Space tokens: `xs` \| `s` \| `m` \| `l` \| `xl` | `undefined` |
| `align-items` | Cross-axis alignment | `flex-start` \| `center` \| `flex-end` \| `stretch` \| `baseline` | `stretch` |
| `align-content` | Multi-line cross-axis alignment | `flex-start` \| `center` \| `flex-end` \| `space-between` \| `space-around` \| `stretch` | `stretch` |
| `justify-content` | Main-axis distribution | `flex-start` \| `center` \| `flex-end` \| `space-between` \| `space-around` \| `space-evenly` | `flex-start` |
| `justify-items` | Item justification in grid | All valid CSS `justify-items` values | `undefined` |
| `place-items` | Shorthand for align-items + justify-items | All valid CSS `place-items` values | `undefined` |
| `place-content` | Shorthand for align-content + justify-content | All valid CSS `place-content` values | `undefined` |

### Child Item Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `flex` | Flex grow/shrink/basis | All valid CSS `flex` values (e.g., `1`, `0 0 auto`) | `undefined` |
| `order` | Display order | Integer values | `undefined` |
| `align-self` | Individual item alignment | `auto` \| `flex-start` \| `center` \| `flex-end` \| `stretch` | `auto` |
| `justify-self` | Individual item justification | All valid CSS `justify-self` values | `undefined` |
| `place-self` | Shorthand for align-self + justify-self | All valid CSS `place-self` values | `undefined` |

### Sizing Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `width` | Width | Space tokens or CSS values | `undefined` |
| `min-width` | Minimum width | Space tokens or CSS values | `undefined` |
| `max-width` | Maximum width | Space tokens or CSS values | `undefined` |
| `height` | Height | Space tokens or CSS values | `undefined` |
| `min-height` | Minimum height | Space tokens or CSS values | `undefined` |
| `max-height` | Maximum height | Space tokens or CSS values | `undefined` |
| `inline-size` | Logical width | Space tokens or CSS values | `undefined` |
| `min-inline-size` | Logical min width | Space tokens or CSS values | `undefined` |
| `max-inline-size` | Logical max width | Space tokens or CSS values | `undefined` |
| `block-size` | Logical height | Space tokens or CSS values | `undefined` |
| `min-block-size` | Logical min height | Space tokens or CSS values | `undefined` |
| `max-block-size` | Logical max height | Space tokens or CSS values | `undefined` |
| `aspect-ratio` | Aspect ratio | All valid CSS `aspect-ratio` values | `undefined` |

### Spacing Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `margin` | Margin on all sides | Space tokens only | `undefined` |
| `margin-inline` | Horizontal margin | Space tokens only | `undefined` |
| `margin-block` | Vertical margin | Space tokens only | `undefined` |
| `padding` | Padding on all sides | Space tokens only | `undefined` |
| `padding-inline` | Horizontal padding | Space tokens only | `undefined` |
| `padding-block` | Vertical padding | Space tokens only | `undefined` |

**Space Tokens:** `xs`, `s`, `m`, `l`, `xl`, `2xs`, `3xs`, `4xs`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`

### Grid Positioning Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `grid-column` | Column position in grid parent | All valid CSS `grid-column` values | `undefined` |
| `grid-row` | Row position in grid parent | All valid CSS `grid-row` values | `undefined` |
| `grid-area` | Named grid area | All valid CSS `grid-area` values | `undefined` |

### Visual Styling Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `color` | Text color | Color tokens with optional transparency: `tokenName/transparency` | `undefined` |
| `background` | Background color | Color tokens with optional transparency: `tokenName/transparency` | `undefined` |
| `border` | Border (size style color) | E.g., `4xs solid subtle-01/0.2` | `undefined` |
| `border-color` | Border color | Color tokens with optional transparency | `undefined` |
| `border-width` | Border width | Space tokens only | `undefined` |
| `border-style` | Border style | All valid CSS `border-style` values | `undefined` |
| `border-radius` | Border radius | Space tokens only | `undefined` |
| `box-shadow` | Shadow | Shadow tokens: `xs` \| `s` \| `m` \| `l` \| `xl` | `undefined` |
| `opacity` | Opacity | `0` to `1` or percentage | `undefined` |

### Typography Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `font` | Font family and size | Font tokens from design system | `undefined` |
| `font-weight` | Font weight | Weight tokens from design system | `undefined` |
| `text-align` | Text alignment | All valid CSS `text-align` values | `undefined` |
| `text-wrap` | Text wrapping | All valid CSS `text-wrap` values | `undefined` |
| `white-space` | White space handling | All valid CSS `white-space` values | `undefined` |
| `overflow-wrap` | Word breaking | All valid CSS `overflow-wrap` values | `undefined` |

### Display & Positioning Properties

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `display` | Display type | All valid CSS `display` values | `flex` |
| `position` | Position type | `static` \| `relative` \| `absolute` \| `fixed` \| `sticky` | `undefined` |
| `inset` | Position offset | All valid CSS `inset` values | `undefined` |
| `z-index` | Stack order | Integer values | `undefined` |
| `overflow` | Overflow behavior | `visible` \| `hidden` \| `scroll` \| `auto` | `undefined` |
| `box-sizing` | Box model | `content-box` \| `border-box` | `undefined` |
| `cursor` | Cursor style | All valid CSS `cursor` values | `undefined` |
| `pointer-events` | Pointer interaction | All valid CSS `pointer-events` values | `undefined` |
| `transform` | Transforms | All valid CSS `transform` values | `undefined` |

### Level Property

| Property | Description | Values | Default |
|----------|-------------|--------|---------|
| `level` | Color token resolution level | `'1'` \| `'2'` \| `'3'` | `'2'` |

The `level` property determines which color palette is used when resolving color tokens. Check the Color System documentation for more details.

---

## Usage Patterns

### 1. Horizontal Button Group

```tsx
<GdsFlex gap="s" align-items="center">
  <GdsButton rank="secondary">Cancel</GdsButton>
  <GdsButton rank="primary">Save</GdsButton>
</GdsFlex>
```

### 2. Vertical Stack with Spacing

```tsx
<GdsFlex flex-direction="column" gap="m">
  <GdsText tag="h3">Section Title</GdsText>
  <GdsText>Description text goes here.</GdsText>
  <GdsButton>Action</GdsButton>
</GdsFlex>
```

### 3. Space Between Layout

```tsx
<GdsFlex align-items="center" justify-content="space-between">
  <GdsFlex gap="s" align-items="center">
    <IconHomeOpen />
    <GdsText>Dashboard</GdsText>
  </GdsFlex>
  <GdsButton rank="tertiary">
    <IconSettingsGear />
  </GdsButton>
</GdsFlex>
```

### 4. Centered Content

```tsx
<GdsFlex 
  align-items="center" 
  justify-content="center" 
  min-height="200px"
>
  <GdsText>Centered Content</GdsText>
</GdsFlex>
```

### 5. Equal-Height Card Internals

```tsx
<GdsCard style={{ height: '100%' }}>
  <GdsFlex flex-direction="column" height="100%">
    <GdsFlex flex="1">
      <GdsText>Main content area expands</GdsText>
    </GdsFlex>
    <GdsFlex padding="m" border="4xs solid subtle-01" background="secondary">
      <GdsText>Footer stays at bottom</GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsCard>
```

### 6. Wrapped Grid Pattern

```tsx
<GdsFlex flex-wrap="wrap" gap="m">
  <GdsFlex width="200px">Item 1</GdsFlex>
  <GdsFlex width="200px">Item 2</GdsFlex>
  <GdsFlex width="200px">Item 3</GdsFlex>
  <GdsFlex width="200px">Item 4</GdsFlex>
</GdsFlex>
```

### 7. Icon + Text Pattern

```tsx
<GdsFlex gap="xs" align-items="center">
  <IconCheckmark />
  <GdsText>Completed</GdsText>
</GdsFlex>
```

### 8. Toolbar with Divider

```tsx
<GdsFlex gap="m" align-items="center">
  <GdsFlex gap="s">
    <GdsButton rank="tertiary">Edit</GdsButton>
    <GdsButton rank="tertiary">Delete</GdsButton>
  </GdsFlex>
  <GdsFlex width="1px" height="24px" background="border" />
  <GdsButton rank="tertiary">Share</GdsButton>
</GdsFlex>
```

### 9. Form Row Layout

```tsx
<GdsFlex gap="m" align-items="flex-start">
  <GdsFlex flex="1" flex-direction="column" gap="s">
    <GdsLabel>First Name</GdsLabel>
    <GdsInput />
  </GdsFlex>
  <GdsFlex flex="1" flex-direction="column" gap="s">
    <GdsLabel>Last Name</GdsLabel>
    <GdsInput />
  </GdsFlex>
</GdsFlex>
```

### 10. Nested Flex Layout

```tsx
<GdsFlex flex-direction="column" gap="xl">
  <GdsFlex justify-content="space-between" align-items="center">
    <GdsText tag="h2">Settings</GdsText>
    <GdsButton>Save Changes</GdsButton>
  </GdsFlex>
  
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsText>Enable notifications</GdsText>
      <GdsCheckbox />
    </GdsFlex>
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsText>Dark mode</GdsText>
      <GdsCheckbox />
    </GdsFlex>
  </GdsFlex>
</GdsFlex>
```

---

## Best Practices

### ✅ DO

```tsx
// Use GdsFlex for flex layouts instead of inline styles
<GdsFlex gap="m" align-items="center">
  <IconHomeOpen />
  <GdsText>Home</GdsText>
</GdsFlex>

// Use design tokens for spacing
<GdsFlex gap="l" padding="xl">
  {/* content */}
</GdsFlex>

// Nest GdsFlex for complex layouts
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex justify-content="space-between">
    {/* header */}
  </GdsFlex>
  <GdsFlex flex="1">
    {/* main content */}
  </GdsFlex>
</GdsFlex>

// Use flex property for responsive sizing
<GdsFlex gap="m">
  <GdsFlex flex="1">Flexible item</GdsFlex>
  <GdsFlex flex="2">Takes twice the space</GdsFlex>
</GdsFlex>
```

### ❌ DON'T

```tsx
// Don't use inline styles for flex properties
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  {/* content */}
</div>

// Don't use pixel values instead of tokens
<GdsFlex gap="16px">  {/* Use gap="m" instead */}
  {/* content */}
</GdsFlex>

// Don't nest too many unnecessary GdsFlex wrappers
<GdsFlex>
  <GdsFlex>
    <GdsFlex>
      <GdsText>Over-nested</GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsFlex>

// Don't mix GdsFlex with custom CSS flexbox
<GdsFlex className="custom-flex-class">  {/* Avoid mixing approaches */}
  {/* content */}
</GdsFlex>
```

---

## Common Use Cases

### When to Use GdsFlex

- **Button groups** - Horizontal or vertical button arrangements
- **Icon + text combinations** - Labels with leading/trailing icons
- **Toolbars** - Action bars with multiple controls
- **Card internals** - Header/content/footer layouts within cards
- **Form rows** - Side-by-side form fields
- **Navigation items** - Menu items with consistent spacing
- **Status badges** - Icon + status text combinations
- **Split views** - Flexible panels with adjustable sizing
- **List items** - Horizontal layouts with multiple elements

### When NOT to Use GdsFlex

- **Grid layouts** - Use `GdsGrid` for column-based responsive layouts
- **Simple text flow** - Use `GdsText` directly for typography
- **Tables** - Use `GdsTable` for tabular data
- **Single elements** - Use `GdsDiv` if you don't need flexbox
- **Document flow** - Use semantic HTML elements (`<article>`, `<section>`)

---

## GdsFlex vs. GdsDiv

| Feature | GdsFlex | GdsDiv |
|---------|---------|--------|
| Default display | `flex` | `block` |
| Best for | Flexbox layouts | Generic containers |
| Flex properties | Full support | Basic support |
| Use case | Alignment, distribution | Blocks, wrappers |

---

## Accessibility

### Semantic HTML

`GdsFlex` is a presentational container. For semantic structure, use appropriate HTML5 elements:

```tsx
// ❌ Non-semantic
<GdsFlex>
  <GdsFlex>Navigation</GdsFlex>
  <GdsFlex>Main content</GdsFlex>
</GdsFlex>

// ✅ Semantic with flex styling
<header>
  <GdsFlex as="nav" gap="m" align-items="center">
    {/* navigation items */}
  </GdsFlex>
</header>
<main>
  <GdsFlex flex-direction="column" gap="xl">
    {/* main content */}
  </GdsFlex>
</main>
```

### ARIA Labels

Add ARIA attributes when GdsFlex contains interactive regions:

```tsx
<GdsFlex role="toolbar" aria-label="Document actions" gap="s">
  <GdsButton>Edit</GdsButton>
  <GdsButton>Delete</GdsButton>
  <GdsButton>Share</GdsButton>
</GdsFlex>
```

### Keyboard Navigation

Ensure interactive children are keyboard accessible:

```tsx
<GdsFlex gap="s">
  <GdsButton>Tab accessible</GdsButton>
  <GdsButton>Tab accessible</GdsButton>
</GdsFlex>
```

---

## Browser Support

`GdsFlex` supports all modern browsers with CSS Flexbox support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

---

## TypeScript

```tsx
import { GdsFlex } from '@sebgroup/green-core/react'

interface GdsFlexProps {
  // Attributes
  level?: '1' | '2' | '3' | '4'
  'gds-element'?: string
  
  // Core Flexbox Properties
  'flex-direction'?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  'flex-wrap'?: 'nowrap' | 'wrap' | 'wrap-reverse'
  gap?: string
  'align-items'?: string
  'align-content'?: string
  'justify-content'?: string
  'justify-items'?: string
  'place-items'?: string
  'place-content'?: string
  
  // Child Item Properties
  flex?: string
  order?: string
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  
  // Sizing Properties
  width?: string
  'min-width'?: string
  'max-width'?: string
  height?: string
  'min-height'?: string
  'max-height'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
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
  
  // Grid Positioning Properties
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  
  // Visual Styling Properties
  color?: string
  background?: string
  border?: string
  'border-color'?: string
  'border-width'?: string
  'border-style'?: string
  'border-radius'?: string
  'box-shadow'?: string
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
  
  // Events
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  // Standard
  children?: React.ReactNode
}

// Usage example
const FlexLayout: React.FC = () => {
  const handleDisconnected = (e: CustomEvent) => {
    console.log('Component disconnected', e)
  }

  return (
    <GdsFlex
      gap="m"
      align-items="center"
      justify-content="space-between"
      padding="l"
      background="primary/0.1"
      border-radius="m"
      onGdsElementDisconnected={handleDisconnected}
    >
      <GdsText>Left Content</GdsText>
      <GdsText>Right Content</GdsText>
    </GdsFlex>
  )
}
```

---

## Events

| Event | Description | Type |
|-------|-------------|------|
| `gds-element-disconnected` | Fired when element disconnects from DOM | `CustomEvent` |

---

## Related Components

- **Spacing** - Spacing system and gap tokens for flex layouts (see [Spacing.md](./Spacing.md))
- **GdsGrid** - Column-based responsive layouts with breakpoints
- **GdsDiv** - Generic container without flexbox defaults
- **GdsDivider** - For separating flex content sections
- **GdsMask** - For flexbox layout of mask content
- **GdsMenuButton** - For menu buttons in flex layouts
- **GdsInput** - For text inputs within flex form layouts
- **GdsTextarea** - Multi-line text input component
- **GdsRadioGroup** - For radio button groups within flex form layouts
- **GdsRichText** - For rich text content within flex layouts
- **GdsSegmentedControl** - For view switchers within flex layouts
- **GdsLink** - For navigation links within flex layouts
- **GdsDropdown** - For form controls within flex layouts
- **GdsFilterChip** - For filter chips within flex layouts
- **GdsFormattedAccount** - For formatted account numbers within flex layouts
- **GdsSensitiveAccount** - Formatted account with blur privacy protection (beta)
- **GdsFormattedDate** - For formatted dates within flex layouts
- **GdsSensitiveDate** - Formatted date with blur privacy protection (beta)
- **GdsFormattedNumber** - For formatted numbers and amounts within flex layouts
- **GdsSensitiveNumber** - Formatted number with blur privacy protection (beta)
- **GdsFormSummary** - For form error summaries within flex layouts
- **GdsGroupedList** - For structured lists within flex layouts
- **GdsSpinner** - Loading indicators positioned within flex layouts
- **GdsCard** - Card container component
- **GdsText** - Typography component
- **GdsButton** - Button component
- **GdsTheme** - Theme utility for controlling color schemes (beta)
- **GdsVideo** - Video component with responsive aspect ratios
- **Icons** - See `docs/components/green-core/Icons.md` for icon components (use Icon prefix, not Gds)

---

## Architecture Notes

- Green Core components include self-contained styles (Lit CSS)
- No external stylesheet imports required
- Design tokens automatically resolve based on `level` property
- Type-safe props when using TypeScript
- Full Web Components Custom Elements API support

---

## Troubleshooting

### Items Not Aligning

**Problem:** Children don't align as expected.

**Solution:** Check `align-items` vs. `justify-content`. Remember:
- `align-items` - Cross axis (vertical in row, horizontal in column)
- `justify-content` - Main axis (horizontal in row, vertical in column)

```tsx
// For vertical centering in row
<GdsFlex align-items="center">...</GdsFlex>

// For horizontal centering in row
<GdsFlex justify-content="center">...</GdsFlex>

// For both
<GdsFlex align-items="center" justify-content="center">...</GdsFlex>
```

### Gap Not Showing

**Problem:** Gap between items not visible.

**Solution:** Ensure you're using valid space tokens:

```tsx
// ❌ Wrong
<GdsFlex gap="16px">...</GdsFlex>

// ✅ Correct
<GdsFlex gap="m">...</GdsFlex>
```

### Flex Children Not Growing

**Problem:** Children don't expand to fill space.

**Solution:** Use `flex` property on child items:

```tsx
<GdsFlex>
  <GdsFlex flex="1">Grows to fill</GdsFlex>
  <GdsFlex>Fixed width</GdsFlex>
</GdsFlex>
```

---

## Migration Guide

### From Inline Styles

```tsx
// Before
<div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
  <span>Item 1</span>
  <span>Item 2</span>
</div>

// After
<GdsFlex gap="m" align-items="center">
  <GdsText>Item 1</GdsText>
  <GdsText>Item 2</GdsText>
</GdsFlex>
```

### From CSS Classes

```tsx
// Before
<div className="flex-container">
  <div className="flex-item">Item 1</div>
  <div className="flex-item">Item 2</div>
</div>

// After
<GdsFlex gap="m">
  <GdsFlex>Item 1</GdsFlex>
  <GdsFlex>Item 2</GdsFlex>
</GdsFlex>
```

---

## Examples in Context

See these files for real-world usage:
- `src/pages/PaymentSetup.tsx` - Multi-step wizard with GdsFlex layouts
- `src/components/layout/Sidebar.tsx` - Navigation with GdsFlex
- `src/pages/Dashboard.tsx` - Card layouts with GdsFlex internals

---

## Recommendation for This Project

- **Always use `GdsFlex`** instead of `<div style={{ display: 'flex' }}>` for flex layouts
- **Use design tokens** for `gap`, `padding`, `margin` (e.g., `gap="m"` not `gap="16px"`)
- **Combine with `GdsGrid`** for complex responsive layouts
- **Use appropriate icons** from `docs/components/green-core/Icons.md` with `Icon` prefix (e.g., `IconHomeOpen`)
- **Nest GdsFlex** for complex layouts instead of using many inline styles

---

## See Also

- `docs/components/green-core/GdsGrid.md` - Grid layout and responsive patterns
- `docs/components/green-core/GdsDiv.md` - Generic container component
- `docs/components/green-core/GdsText.md` - Typography component
- `docs/components/green-core/Icons.md` - Icon component reference
- `docs/components/green-core/README.md` - Green Core documentation overview
- `docs/guides/requirements.md` - Project requirements and guidelines
- `docs/guides/DEVELOPMENT-PLAN.md` - Development roadmap

---

**Last Updated:** November 8, 2025