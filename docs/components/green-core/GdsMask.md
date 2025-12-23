# GdsMask

The Mask component creates gradient overlay effects that can be used to improve content visibility or create visual hierarchy. It's particularly useful when placing text over images or creating fade effects.

## Overview

GdsMask is a visual overlay component that applies gradient masks to improve content readability and create visual hierarchy. It combines background colors with transparency, gradient masks, and optional backdrop filters to create sophisticated overlay effects for images, videos, and content sections.

**Key Features:**
- **Gradient Overlays**: Create smooth gradient masks over content
- **Background Control**: Color tokens with transparency support
- **Mask Positioning**: Multiple mask-image presets (top, bottom, left, right)
- **Backdrop Filters**: Blur and filter effects with responsive breakpoints
- **Full Positioning**: Absolute/relative positioning with inset control
- **Flexbox Layout**: Built-in flex display for content arrangement
- **Level System**: Color token resolution based on level hierarchy
- **Style Expressions**: Complete style expression property support
- **Responsive**: Breakpoint syntax for all properties

## Import

```tsx
// Use as JSX element in React
import { GdsMask } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="path/to/image.jpg" />
  <GdsMask
    background="neutral-01/0.9"
    mask-image="top"
    position="absolute"
    inset="50% 0 0 0"
    level="3"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-l">Overlay Content</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens from corresponding level. See Color System documentation. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only). |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mask-image` | `string` | `undefined` | Gradient mask image preset. Common values: `'top'`, `'bottom'`, `'left'`, `'right'`, or custom CSS mask-image value. |
| `mask-size` | `string` | `'cover'` | Controls mask-size property. Supports all valid CSS mask-size values. |
| `mask-repeat` | `string` | `'no-repeat'` | Controls mask-repeat property. Supports all valid CSS mask-repeat values. |
| `mask-position` | `string` | `'center'` | Controls mask-position property. Supports all valid CSS mask-position values. |
| `backdrop-filter` | `string` | `undefined` | Controls backdrop-filter property for blur effects. Supports breakpoint syntax: `"s{20px} m{40px} l{60px}"`. |
| `font` | `string` | `undefined` | Style Expression Property for font. Supports all font tokens from design system. |
| `overflow-wrap` | `string` | `undefined` | Style Expression Property for overflow-wrap. Supports all valid CSS values. |
| `white-space` | `string` | `undefined` | Style Expression Property for white-space. Supports all valid CSS values. |
| `aspect-ratio` | `string` | `undefined` | Style Expression Property for aspect-ratio. Supports all valid CSS values. |
| `cursor` | `string` | `undefined` | Style Expression Property for cursor. Supports all valid CSS values. |
| `pointer-events` | `string` | `undefined` | Style Expression Property for pointer-events. Supports all valid CSS values. |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only). |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only). |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of element (read-only). |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only). |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `background` | Controls background property. Only accepts color tokens with optional transparency: `"tokenName/transparency"` (e.g., `"neutral-01/0.9"`). |
| `position` | Controls position property. Supports all valid CSS position values. Default: `'relative'`. |
| `display` | Controls display property. Supports all valid CSS display values. Default: `'flex'`. |
| `inset` | Controls inset property. Supports all valid CSS inset values. Default: `'0'`. |
| `width` | Controls width property. Supports space tokens and all valid CSS width values. |
| `min-width` | Controls min-width property. Supports space tokens and all valid CSS values. |
| `max-width` | Controls max-width property. Supports space tokens and all valid CSS values. |
| `inline-size` | Controls inline-size property. Supports space tokens and all valid CSS values. |
| `min-inline-size` | Controls min-inline-size property. Supports space tokens and all valid CSS values. |
| `max-inline-size` | Controls max-inline-size property. Supports space tokens and all valid CSS values. |
| `height` | Controls height property. Supports space tokens and all valid CSS height values. |
| `min-height` | Controls min-height property. Supports space tokens and all valid CSS values. |
| `max-height` | Controls max-height property. Supports space tokens and all valid CSS values. |
| `block-size` | Controls block-size property. Supports space tokens and all valid CSS values. |
| `min-block-size` | Controls min-block-size property. Supports space tokens and all valid CSS values. |
| `max-block-size` | Controls max-block-size property. Supports space tokens and all valid CSS values. |
| `margin` | Controls margin property. Only accepts space tokens. |
| `margin-inline` | Controls margin-inline property. Only accepts space tokens. |
| `margin-block` | Controls margin-block property. Only accepts space tokens. |
| `padding` | Controls padding property. Only accepts space tokens. |
| `padding-inline` | Controls padding-inline property. Only accepts space tokens. |
| `padding-block` | Controls padding-block property. Only accepts space tokens. |
| `align-self` | Controls align-self property. Supports all valid CSS values. |
| `justify-self` | Controls justify-self property. Supports all valid CSS values. |
| `place-self` | Controls place-self property. Supports all valid CSS values. |
| `grid-column` | Controls grid-column property. Supports all valid CSS values. |
| `grid-row` | Controls grid-row property. Supports all valid CSS values. |
| `grid-area` | Controls grid-area property. Supports all valid CSS values. |
| `flex` | Controls flex property. Supports all valid CSS values. |
| `order` | Controls order property. Supports all valid CSS values. |
| `transform` | Controls transform property. Supports all valid CSS values. |
| `color` | Controls color property. Only accepts color tokens with optional transparency: `"tokenName/transparency"`. |
| `border` | Controls border property. Format: `"4xs solid subtle-01/0.2"` (size accepts space tokens, color accepts color tokens with transparency). |
| `border-color` | Controls border-color property. Only accepts color tokens with optional transparency. |
| `border-width` | Controls border-width property. Only accepts space tokens. |
| `border-style` | Controls border-style property. Supports all valid CSS values. |
| `border-radius` | Controls border-radius property. Only accepts space tokens. |
| `box-shadow` | Controls box-shadow property. Accepts shadow tokens: `xs`, `s`, `m`, `l`, `xl`. |
| `opacity` | Controls opacity property. Supports all valid CSS opacity values. |
| `overflow` | Controls overflow property. Supports all valid CSS overflow values. |
| `box-sizing` | Controls box-sizing property. Supports all valid CSS values. |
| `z-index` | Controls z-index property. Supports all valid CSS values. |
| `font-weight` | Controls font-weight property. Supports all typography weight tokens. |
| `text-align` | Controls text-align property. Supports all valid CSS values. |
| `text-wrap` | Controls text-wrap property. Supports all valid CSS values. |
| `gap` | Controls gap property. Only accepts space tokens. |
| `align-items` | Controls align-items property. Supports all valid CSS values. |
| `align-content` | Controls align-content property. Supports all valid CSS values. |
| `justify-content` | Controls justify-content property. Supports all valid CSS values. |
| `justify-items` | Controls justify-items property. Supports all valid CSS values. |
| `flex-direction` | Controls flex-direction property. Supports all valid CSS values. |
| `flex-wrap` | Controls flex-wrap property. Supports all valid CSS values. |
| `place-items` | Controls place-items property. Supports all valid CSS values. |
| `place-content` | Controls place-content property. Supports all valid CSS values. |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM. |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Content to be displayed within the mask overlay. |

## Examples

### Basic Image Overlay

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/image.jpg" />
  
  <GdsMask
    background="neutral-01/0.8"
    mask-image="top"
    position="absolute"
    inset="50% 0 0 0"
  >
    <GdsTheme color-scheme="dark">
      <GdsFlex flex-direction="column" gap="m" padding="xl">
        <GdsText font="display-m">Overlay Title</GdsText>
        <GdsText>Content description goes here</GdsText>
      </GdsFlex>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Full Cover Mask

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/background.jpg" />
  
  <GdsMask
    background="neutral-01/0.9"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="center"
    align-items="center"
    padding="2xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-xl">Centered Content</GdsText>
      <GdsButton rank="primary">Take Action</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Gradient from Top

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/hero.jpg" />
  
  <GdsMask
    background="neutral-01/0.9"
    mask-image="top"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="flex-end"
    padding="xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-l">Title at Bottom</GdsText>
      <GdsText>Gradient fades from top</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Gradient from Bottom

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/image.jpg" />
  
  <GdsMask
    background="neutral-01/0.85"
    mask-image="bottom"
    position="absolute"
    inset="0 0 60% 0"
    flex-direction="column"
    justify-content="flex-start"
    padding="xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-l">Title at Top</GdsText>
      <GdsText>Gradient fades from bottom</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Responsive Gradient

```tsx
// Different inset values for different breakpoints
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/woods-cabin.jpeg" />
  
  <GdsMask
    background="neutral-01/0.9"
    mask-image="top"
    position="absolute"
    inset="0; m{50% 0 0 0}"  // Full on small, bottom half on medium+
    level="3"
    flex-direction="column"
    justify-content="flex-end"
    padding="xl; s{2xl} m{6xl}"  // Responsive padding
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-s; m{display-xl}">Responsive Title</GdsText>
      <GdsText font="body-xs; body-s">Responsive description</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### With Backdrop Blur

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/image.jpg" />
  
  <GdsMask
    background="neutral-01/0.5"
    backdrop-filter="20px"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="center"
    align-items="center"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-xl">Blurred Background</GdsText>
      <GdsButton>Learn More</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Responsive Backdrop Blur

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/background.jpg" />
  
  <GdsMask
    background="neutral-01/0.6"
    backdrop-filter="s{20px} m{40px} l{60px}"  // Responsive blur
    position="absolute"
    inset="0"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-l">Progressive Blur</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Hero Section with Mask

```tsx
<GdsCard position="relative" padding="0" overflow="hidden" height="600px">
  <GdsImg 
    src="https://example.com/hero-image.jpg"
    object-fit="cover"
    width="100%"
    height="100%"
  />
  
  <GdsMask
    background="neutral-01/0.9"
    mask-image="top"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="flex-end"
    align-items="flex-start"
    gap="xl"
    padding="6xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsFlex flex-direction="column" gap="s" max-width="800px">
        <GdsText font="display-xl" font-weight="light">
          Sustainability
        </GdsText>
        <GdsText font="body-m">
          Actively supporting the net zero transition.
        </GdsText>
      </GdsFlex>
      <GdsButton rank="primary">Our Impact</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Card Grid with Overlays

```tsx
<GdsGrid columns="1; m{2} l{3}" gap="m">
  {/* Card 1 */}
  <GdsCard position="relative" padding="0" overflow="hidden">
    <GdsImg src="https://example.com/card1.jpg" aspect-ratio="16/9" />
    <GdsMask
      background="neutral-01/0.8"
      mask-image="top"
      position="absolute"
      inset="50% 0 0 0"
      padding="m"
    >
      <GdsTheme color-scheme="dark">
        <GdsText font="headline-m">Card Title</GdsText>
      </GdsTheme>
    </GdsMask>
  </GdsCard>
  
  {/* Card 2 */}
  <GdsCard position="relative" padding="0" overflow="hidden">
    <GdsImg src="https://example.com/card2.jpg" aspect-ratio="16/9" />
    <GdsMask
      background="neutral-01/0.8"
      mask-image="top"
      position="absolute"
      inset="50% 0 0 0"
      padding="m"
    >
      <GdsTheme color-scheme="dark">
        <GdsText font="headline-m">Another Card</GdsText>
      </GdsTheme>
    </GdsMask>
  </GdsCard>
  
  {/* Card 3 */}
  <GdsCard position="relative" padding="0" overflow="hidden">
    <GdsImg src="https://example.com/card3.jpg" aspect-ratio="16/9" />
    <GdsMask
      background="neutral-01/0.8"
      mask-image="top"
      position="absolute"
      inset="50% 0 0 0"
      padding="m"
    >
      <GdsTheme color-scheme="dark">
        <GdsText font="headline-m">Third Card</GdsText>
      </GdsTheme>
    </GdsMask>
  </GdsCard>
</GdsGrid>
```

### Left/Right Gradient Masks

```tsx
// Left gradient
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/wide-image.jpg" />
  
  <GdsMask
    background="neutral-01/0.85"
    mask-image="left"
    position="absolute"
    inset="0 50% 0 0"
    justify-content="flex-start"
    align-items="center"
    padding="xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-m">Left Content</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>

// Right gradient
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/wide-image.jpg" />
  
  <GdsMask
    background="neutral-01/0.85"
    mask-image="right"
    position="absolute"
    inset="0 0 0 50%"
    justify-content="flex-end"
    align-items="center"
    padding="xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-m">Right Content</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Multiple Content Sections

```tsx
<GdsCard position="relative" padding="0" overflow="hidden" height="500px">
  <GdsImg 
    src="https://example.com/background.jpg"
    object-fit="cover"
    width="100%"
    height="100%"
  />
  
  <GdsMask
    background="neutral-01/0.85"
    mask-image="top"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="space-between"
    padding="2xl"
  >
    <GdsTheme color-scheme="dark">
      {/* Header */}
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="headline-l">Section Title</GdsText>
        <GdsButton rank="tertiary">Menu</GdsButton>
      </GdsFlex>
      
      {/* Main content */}
      <GdsFlex flex-direction="column" gap="m">
        <GdsText font="display-xl">Main Message</GdsText>
        <GdsText font="body-l">Supporting information</GdsText>
      </GdsFlex>
      
      {/* Footer */}
      <GdsFlex gap="m">
        <GdsButton rank="primary">Primary Action</GdsButton>
        <GdsButton rank="secondary">Secondary Action</GdsButton>
      </GdsFlex>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Video Overlay

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <video 
    autoPlay 
    loop 
    muted 
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  >
    <source src="https://example.com/video.mp4" type="video/mp4" />
  </video>
  
  <GdsMask
    background="neutral-01/0.7"
    backdrop-filter="10px"
    position="absolute"
    inset="0"
    flex-direction="column"
    justify-content="center"
    align-items="center"
    gap="xl"
  >
    <GdsTheme color-scheme="dark">
      <GdsText font="display-2xl">Watch Our Story</GdsText>
      <GdsButton rank="primary">Play Video</GdsButton>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

### Light Background Variant

```tsx
<GdsCard position="relative" padding="0" overflow="hidden">
  <GdsImg src="https://example.com/dark-image.jpg" />
  
  <GdsMask
    background="01/0.9"  // Light background
    mask-image="bottom"
    position="absolute"
    inset="0 0 60% 0"
    padding="xl"
  >
    <GdsTheme color-scheme="light">
      <GdsText font="display-l" color="neutral-01">
        Light Theme Content
      </GdsText>
      <GdsText>Works on dark backgrounds</GdsText>
    </GdsTheme>
  </GdsMask>
</GdsCard>
```

## TypeScript Types

```tsx
// GdsMask props interface
interface GdsMaskProps {
  // Mask properties
  'mask-image'?: string
  'mask-size'?: string
  'mask-repeat'?: string
  'mask-position'?: string
  'backdrop-filter'?: string
  
  // Level system
  level?: GdsColorLevel
  
  // Core style expressions
  background?: string  // Format: "tokenName/transparency"
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  display?: string
  inset?: string
  
  // Sizing
  width?: string
  'min-width'?: string
  'max-width'?: string
  height?: string
  'min-height'?: string
  'max-height'?: string
  
  // Spacing
  margin?: string
  padding?: string
  gap?: string
  
  // Flexbox
  'flex-direction'?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  'justify-content'?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  'align-items'?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  'align-content'?: string
  'flex-wrap'?: 'nowrap' | 'wrap' | 'wrap-reverse'
  
  // Visual
  color?: string
  opacity?: string
  'border-radius'?: string
  'box-shadow'?: 'xs' | 's' | 'm' | 'l' | 'xl'
  'z-index'?: string
  
  // Children
  children?: React.ReactNode
  
  // ... other style expression properties
}

// Usage example
const HeroMask = () => {
  return (
    <GdsCard position="relative" padding="0" overflow="hidden">
      <GdsImg src="/hero.jpg" />
      
      <GdsMask
        background="neutral-01/0.9"
        mask-image="top"
        position="absolute"
        inset="0; m{50% 0 0 0}"
        flex-direction="column"
        justify-content="flex-end"
        padding="xl; m{6xl}"
      >
        <GdsTheme color-scheme="dark">
          <GdsText font="display-xl">Hero Title</GdsText>
          <GdsButton rank="primary">CTA Button</GdsButton>
        </GdsTheme>
      </GdsMask>
    </GdsCard>
  )
}
```

## Mask Image Presets

| Value | Description | Use Case |
|-------|-------------|----------|
| `'top'` | Gradient fades from top to transparent | Content at bottom, fade from top |
| `'bottom'` | Gradient fades from bottom to transparent | Content at top, fade from bottom |
| `'left'` | Gradient fades from left to transparent | Content on left, fade to right |
| `'right'` | Gradient fades from right to transparent | Content on right, fade to left |
| Custom CSS | Full CSS mask-image value | Custom gradient directions and patterns |

## Best Practices

### Accessibility and Contrast
- **Ensure sufficient contrast**: Text within masks must meet WCAG contrast requirements
- **Use dark theme**: Apply `<GdsTheme color-scheme="dark">` for content over light images
- **Use light theme**: Apply `<GdsTheme color-scheme="light">` for content over dark images
- **Test readability**: Verify text is readable across different image brightness levels

```tsx
// Good - dark theme on light image
<GdsMask background="neutral-01/0.8">
  <GdsTheme color-scheme="dark">
    <GdsText>Readable text</GdsText>
  </GdsTheme>
</GdsMask>

// Good - light theme on dark image
<GdsMask background="01/0.8">
  <GdsTheme color-scheme="light">
    <GdsText>Readable text</GdsText>
  </GdsTheme>
</GdsMask>
```

### Background Transparency
- **High transparency (0.5-0.7)**: For subtle overlays with backdrop blur
- **Medium transparency (0.7-0.85)**: Balanced overlay for most use cases
- **High opacity (0.85-0.95)**: Strong overlay for maximum readability

### Positioning
- **Relative parent**: Always use `position="relative"` on parent container
- **Absolute mask**: Use `position="absolute"` on mask for overlay effect
- **Inset control**: Use inset to control overlay coverage area
- **Z-index**: Set appropriate z-index for layering multiple masks

### Performance
- **Backdrop filters**: Use sparingly, can impact performance on mobile
- **Responsive blur**: Reduce blur strength on smaller devices
- **Image optimization**: Optimize background images for faster loading
- **Minimize masks**: Avoid excessive masks on a single page

### Responsive Design
- **Breakpoint syntax**: Use responsive syntax for inset, padding, and backdrop-filter
- **Mobile-first**: Start with mobile values, enhance for larger screens
- **Test all breakpoints**: Verify mask coverage across device sizes

```tsx
// Responsive inset
inset="0; m{50% 0 0 0}"  // Full on mobile, bottom half on medium+

// Responsive padding
padding="xl; s{2xl} m{6xl}"  // Progressive padding increases

// Responsive blur
backdrop-filter="s{10px} m{20px} l{30px}"  // Progressive blur
```

## Common Use Cases

### 1. Image Overlays
Create readable text over images by adding gradient masks

```tsx
<GdsMask
  background="neutral-01/0.85"
  mask-image="top"
  position="absolute"
  inset="50% 0 0 0"
>
  <GdsTheme color-scheme="dark">
    <GdsText>Overlay content</GdsText>
  </GdsTheme>
</GdsMask>
```

### 2. Content Fading
Add fade effects to content edges for visual polish

```tsx
<GdsMask
  background="neutral-01/0.9"
  mask-image="bottom"
  position="absolute"
  inset="0 0 70% 0"
>
  <GdsText>Faded header</GdsText>
</GdsMask>
```

### 3. Visual Hierarchy
Draw attention to specific areas using gradient masks

```tsx
<GdsMask
  background="neutral-01/0.7"
  backdrop-filter="20px"
  position="absolute"
  inset="0"
  flex-direction="column"
  justify-content="center"
>
  <GdsText font="display-2xl">Focal Point</GdsText>
</GdsMask>
```

## Related Components

- [GdsCard](./GdsCard.md) — Card containers for masked content
- [GdsImg](./GdsImg.md) — Images used behind masks
- [GdsVideo](./GdsVideo.md) — Videos used behind masks
- [GdsTheme](./GdsTheme.md) — Theme control for mask content
- [GdsText](./GdsText.md) — Typography within masks
- [GdsButton](./GdsButton.md) — Call-to-action buttons in masks
- [GdsFlex](./GdsFlex.md) — Layout for mask content
- [GdsGrid](./GdsGrid.md) — Grid layouts with masked cards
- [GdsDiv](./GdsDiv.md) — Base container component

## Color System Integration

GdsMask uses the Green Core color system with the `level` attribute:

- **Level 1**: Root level, lightest
- **Level 2**: Default level for GdsMask
- **Level 3**: Elevated components
- **Level 4+**: Higher elevation levels

Color tokens resolve based on the level, ensuring proper color hierarchy.

## Notes

- **Display Default**: GdsMask defaults to `display="flex"` for easy content layout
- **Position Default**: Position defaults to `'relative'`, change to `'absolute'` for overlays
- **Inset Default**: Inset defaults to `'0'` (full coverage)
- **Mask Size**: mask-size defaults to `'cover'` for full coverage
- **Mask Repeat**: mask-repeat defaults to `'no-repeat'` to prevent tiling
- **Color Format**: Background and color use format: `"tokenName/transparency"` (e.g., `"neutral-01/0.8"`)
- **Responsive Syntax**: All properties support breakpoint syntax: `"s{value} m{value} l{value}"`
- **Theme Nesting**: Always nest `<GdsTheme>` inside mask for proper color scheme
- **Backdrop Filter**: Supports blur values with breakpoint syntax for progressive enhancement
- **Level System**: Default level is 2, adjust based on elevation needs

---

*Last updated: November 12, 2025*  
*Green Core version: 2.12.0+*  
*Documentation source: [Storybook Mask Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-mask--docs)*
