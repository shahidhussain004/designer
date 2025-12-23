# GdsDiv

`GdsDiv` is a base element in the declarative layout system that provides access to all style expression properties.

> **Declarative Layout**: See [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) for comprehensive guide to style expression properties, responsive design patterns, and the philosophy behind the system.

> **Related tokens & styles**: See [Shadows](./Shadows.md), [Radius](./Radius.md), [Viewport](./Viewport.md), [Motion](./Motion.md), and [Accessibility](./Accessibility.md)

## Overview

GdsDiv is the foundation component for the Green Core layout system. It accepts all available style expression properties and serves as the base class for specialized components like `GdsFlex`, `GdsGrid`, `GdsCard`, and `GdsText`.

Use GdsDiv when you need a generic container with complete control over styling through the declarative layout system, without the pre-configured behaviors of its specialized variants.

## Import

```tsx
// Use as JSX element in React
import { GdsDiv } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsDiv background="neutral-01" padding="l">
    Content goes here
  </GdsDiv>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens. See Color System documentation |

### Style Expression Properties

GdsDiv supports all style expression properties from the declarative layout system:

#### Display & Layout

| Property | Description | Accepts |
|----------|-------------|---------|
| `display` | Controls the display property | All valid CSS display values |
| `position` | Controls the position property | All valid CSS position values |
| `overflow` | Controls the overflow property | All valid CSS overflow values |
| `overflow-wrap` | Controls the overflow-wrap property | All valid CSS overflow-wrap values |
| `box-sizing` | Controls the box-sizing property | All valid CSS box-sizing values |
| `z-index` | Controls the z-index property | All valid CSS z-index values |
| `cursor` | Controls the cursor property | All valid CSS cursor values |
| `pointer-events` | Controls the pointer-events property | All valid CSS pointer-events values |
| `aspect-ratio` | Controls the aspect-ratio property | All valid CSS aspect-ratio values |

#### Sizing

| Property | Description | Accepts |
|----------|-------------|---------|
| `width` | Controls the width property | Space tokens and all valid CSS width values |
| `min-width` | Controls the min-width property | Space tokens and all valid CSS values |
| `max-width` | Controls the max-width property | Space tokens and all valid CSS values |
| `height` | Controls the height property | Space tokens and all valid CSS height values |
| `min-height` | Controls the min-height property | Space tokens and all valid CSS values |
| `max-height` | Controls the max-height property | Space tokens and all valid CSS values |
| `inline-size` | Controls the inline-size property | Space tokens and all valid CSS values |
| `min-inline-size` | Controls the min-inline-size property | Space tokens and all valid CSS values |
| `max-inline-size` | Controls the max-inline-size property | Space tokens and all valid CSS values |
| `block-size` | Controls the block-size property | Space tokens and all valid CSS values |
| `min-block-size` | Controls the min-block-size property | Space tokens and all valid CSS values |
| `max-block-size` | Controls the max-block-size property | Space tokens and all valid CSS values |

#### Spacing

| Property | Description | Accepts |
|----------|-------------|---------|
| `margin` | Controls the margin property | Space tokens only |
| `margin-inline` | Controls the margin-inline property | Space tokens only |
| `margin-block` | Controls the margin-block property | Space tokens only |
| `padding` | Controls the padding property | Space tokens only |
| `padding-inline` | Controls the padding-inline property | Space tokens only |
| `padding-block` | Controls the padding-block property | Space tokens only |
| `gap` | Controls the gap property | Space tokens only |

#### Colors & Appearance

| Property | Description | Accepts |
|----------|-------------|---------|
| `background` | Controls the background property | Color tokens with optional transparency (`token/opacity`) |
| `color` | Controls the color property | Color tokens with optional transparency (`token/opacity`) |
| `opacity` | Controls the opacity property | All valid CSS opacity values |

#### Borders

| Property | Description | Accepts |
|----------|-------------|---------|
| `border` | Controls the border property | CSS border format with space tokens for width and color tokens for color |
| `border-width` | Controls the border-width property | Space tokens only |
| `border-style` | Controls the border-style property | All valid CSS border-style values |
| `border-color` | Controls the border-color property | Color tokens with optional transparency (`token/opacity`) |
| `border-radius` | Controls the border-radius property | Space tokens only |
| `box-shadow` | Controls the box-shadow property | Shadow tokens: `xs`, `s`, `m`, `l`, `xl` |

#### Flexbox

| Property | Description | Accepts |
|----------|-------------|---------|
| `flex-direction` | Controls the flex-direction property | All valid CSS flex-direction values |
| `flex-wrap` | Controls the flex-wrap property | All valid CSS flex-wrap values |
| `flex` | Controls the flex property | All valid CSS flex values |
| `align-items` | Controls the align-items property | All valid CSS align-items values |
| `align-content` | Controls the align-content property | All valid CSS align-content values |
| `align-self` | Controls the align-self property | All valid CSS align-self values |
| `justify-content` | Controls the justify-content property | All valid CSS justify-content values |
| `justify-items` | Controls the justify-items property | All valid CSS justify-items values |
| `justify-self` | Controls the justify-self property | All valid CSS justify-self values |
| `place-items` | Controls the place-items property | All valid CSS place-items values |
| `place-content` | Controls the place-content property | All valid CSS place-content values |
| `place-self` | Controls the place-self property | All valid CSS place-self values |
| `order` | Controls the order property | All valid CSS order values |

#### Grid

| Property | Description | Accepts |
|----------|-------------|---------|
| `grid-column` | Controls the grid-column property | All valid CSS grid-column values |
| `grid-row` | Controls the grid-row property | All valid CSS grid-row values |
| `grid-area` | Controls the grid-area property | All valid CSS grid-area values |

#### Typography

| Property | Description | Accepts |
|----------|-------------|---------|
| `font` | Controls the font property | Font tokens from the design system |
| `font-weight` | Controls the font-weight property | Typography weight tokens from the design system |
| `text-align` | Controls the text-align property | All valid CSS text-align values |
| `text-wrap` | Controls the text-wrap property | All valid CSS text-wrap values |
| `white-space` | Controls the white-space property | All valid CSS white-space values |

#### Transform & Position

| Property | Description | Accepts |
|----------|-------------|---------|
| `transform` | Controls the transform property | All valid CSS transform values |
| `inset` | Controls the inset property | All valid CSS inset values |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

## Examples

### Basic Container

```tsx
<GdsTheme>
  <GdsDiv 
    width="400px" 
    height="200px" 
    background="neutral-01"
    padding="l"
  >
    Basic container with styling
  </GdsDiv>
</GdsTheme>
```

### Flex Layout (Alternative to GdsFlex)

```tsx
<GdsTheme>
  <GdsDiv 
    display="flex" 
    gap="xl" 
    justify-content="center" 
    align-items="center"
  >
    <GdsDiv width="4xl" height="4xl" background="neutral-01" />
    <GdsDiv width="4xl" height="4xl" background="neutral-02" />
    <GdsDiv width="4xl" height="4xl" background="03" />
  </GdsDiv>
</GdsTheme>
```

### Responsive Sizing

```tsx
<GdsTheme>
  <GdsDiv
    width="4xl; l{ 6xl }"
    height="4xl; l{ 6xl }"
    background="neutral-02"
    border="4xs"
  >
    Responsive container - larger on large viewports
  </GdsDiv>
</GdsTheme>
```

### Card-like Container

```tsx
<GdsTheme>
  <GdsDiv
    width="100%"
    max-width="500px"
    background="03"
    border-radius="s"
    padding="xl"
    box-shadow="m"
  >
    <h3>Card Title</h3>
    <p>Content with card styling</p>
  </GdsDiv>
</GdsTheme>
```

### Border Styling

```tsx
<GdsTheme>
  {/* Simple 1px border */}
  <GdsDiv border="4xs" padding="m">
    1px border all around
  </GdsDiv>

  {/* Bottom border only */}
  <GdsDiv 
    border-width="0 0 4xs 0" 
    padding="m"
  >
    Bottom border only
  </GdsDiv>

  {/* Custom color border */}
  <GdsDiv 
    border-width="0 0 4xs 0" 
    border-color="strong" 
    padding="m"
  >
    Colored bottom border
  </GdsDiv>

  {/* All sides with custom color */}
  <GdsDiv 
    border="2xs" 
    border-color="strong" 
    padding="m"
  >
    Colored border all sides
  </GdsDiv>
</GdsTheme>
```

### Border Radius Variations

```tsx
<GdsTheme>
  {/* Single value */}
  <GdsDiv 
    border-radius="m" 
    background="neutral-01" 
    padding="l"
  >
    Uniform border radius
  </GdsDiv>

  {/* Multiple corners (top-left, top-right, bottom-right, bottom-left) */}
  <GdsDiv 
    border-radius="s m l xl" 
    background="neutral-02" 
    padding="l"
  >
    Different radius per corner
  </GdsDiv>
</GdsTheme>
```

### Color Tokens with Transparency

```tsx
<GdsTheme>
  <GdsDiv
    background="neutral-01/0.5"
    border-color="subtle-01/0.2"
    border="4xs"
    padding="l"
  >
    Semi-transparent background and border
  </GdsDiv>
</GdsTheme>
```

### Positioned Container

```tsx
<GdsTheme>
  <GdsDiv position="relative" height="300px" background="neutral-01">
    <GdsDiv
      position="absolute"
      inset="m"
      background="neutral-02"
      padding="m"
    >
      Absolutely positioned with inset spacing
    </GdsDiv>
  </GdsDiv>
</GdsTheme>
```

### Grid Child

```tsx
<GdsTheme>
  <GdsGrid columns="3" gap="m">
    <GdsDiv 
      grid-column="1 / 3" 
      background="neutral-01" 
      padding="m"
    >
      Spans 2 columns
    </GdsDiv>
    <GdsDiv background="neutral-02" padding="m">
      Regular cell
    </GdsDiv>
  </GdsGrid>
</GdsTheme>
```

### Flex Child with Custom Alignment

```tsx
<GdsTheme>
  <GdsFlex height="300px" gap="m">
    <GdsDiv 
      flex="1" 
      align-self="flex-start" 
      background="neutral-01" 
      padding="m"
    >
      Aligned to start
    </GdsDiv>
    <GdsDiv 
      flex="1" 
      align-self="center" 
      background="neutral-02" 
      padding="m"
    >
      Centered
    </GdsDiv>
    <GdsDiv 
      flex="1" 
      align-self="flex-end" 
      background="neutral-03" 
      padding="m"
    >
      Aligned to end
    </GdsDiv>
  </GdsFlex>
</GdsTheme>
```

### Overflow Handling

```tsx
<GdsTheme>
  <GdsDiv
    width="300px"
    height="200px"
    overflow="auto"
    background="neutral-01"
    padding="m"
  >
    <p>Long content that will scroll...</p>
    <p>More content...</p>
    <p>Even more content...</p>
  </GdsDiv>
</GdsTheme>
```

### Shadow Variations

```tsx
<GdsTheme>
  <GdsFlex gap="xl">
    <GdsDiv box-shadow="xs" padding="l" background="03">
      Extra Small Shadow
    </GdsDiv>
    <GdsDiv box-shadow="s" padding="l" background="03">
      Small Shadow
    </GdsDiv>
    <GdsDiv box-shadow="m" padding="l" background="03">
      Medium Shadow
    </GdsDiv>
    <GdsDiv box-shadow="l" padding="l" background="03">
      Large Shadow
    </GdsDiv>
    <GdsDiv box-shadow="xl" padding="l" background="03">
      Extra Large Shadow
    </GdsDiv>
  </GdsFlex>
</GdsTheme>
```

### Complex Layout Example

```tsx
<GdsTheme>
  <GdsDiv
    display="flex"
    flex-direction="column"
    gap="l"
    max-width="1200px"
    margin-inline="auto"
    padding="xl"
  >
    {/* Header */}
    <GdsDiv
      background="neutral-01"
      padding="l"
      border-radius="m"
      border="4xs"
      border-color="subtle-01"
    >
      <h2>Header</h2>
    </GdsDiv>

    {/* Content area */}
    <GdsDiv display="flex" gap="l">
      {/* Sidebar */}
      <GdsDiv
        width="250px"
        background="neutral-02"
        padding="m"
        border-radius="s"
      >
        Sidebar
      </GdsDiv>

      {/* Main content */}
      <GdsDiv
        flex="1"
        background="03"
        padding="xl"
        border-radius="s"
        box-shadow="m"
      >
        Main Content
      </GdsDiv>
    </GdsDiv>
  </GdsDiv>
</GdsTheme>
```

### Interactive States

```tsx
import { useState } from 'react'

function InteractiveBox() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <GdsTheme>
      <GdsDiv
        width="200px"
        height="200px"
        background={isHovered ? "neutral-02" : "neutral-01"}
        border-radius="m"
        padding="l"
        cursor="pointer"
        transform={isHovered ? "scale(1.05)" : "scale(1)"}
        box-shadow={isHovered ? "l" : "m"}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Hover me!
      </GdsDiv>
    </GdsTheme>
  )
}
```

### Aspect Ratio Container

```tsx
<GdsTheme>
  <GdsDiv
    aspect-ratio="16/9"
    width="100%"
    max-width="800px"
    background="neutral-01"
    border-radius="m"
    overflow="hidden"
  >
    {/* Content maintains 16:9 ratio */}
    <img src="image.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
  </GdsDiv>
</GdsTheme>
```

### Z-Index Layering

```tsx
<GdsTheme>
  <GdsDiv position="relative" height="300px">
    <GdsDiv
      position="absolute"
      inset="0"
      background="neutral-01/0.8"
      z-index="1"
      padding="l"
    >
      Layer 1
    </GdsDiv>
    <GdsDiv
      position="absolute"
      inset="m"
      background="neutral-02/0.8"
      z-index="2"
      padding="l"
    >
      Layer 2 (on top)
    </GdsDiv>
  </GdsDiv>
</GdsTheme>
```

## Best Practices

### Use Specialized Components When Appropriate
- Use `GdsFlex` for flex layouts instead of `<GdsDiv display="flex">`
- Use `GdsGrid` for grid layouts instead of `<GdsDiv display="grid">`
- Use `GdsCard` for card containers with pre-configured styling
- Use `GdsText` for typography with semantic tags
- Use `GdsDiv` when you need complete control without pre-configured behaviors

### Spacing with Tokens
- Always use space tokens for `margin`, `padding`, `gap`, `border-width`, and `border-radius`
- Tokens ensure consistent spacing across the design system
- Examples: `4xs`, `3xs`, `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `4xl`

### Color Tokens
- Use color tokens for `background`, `color`, and `border-color`
- Add optional transparency: `neutral-01/0.5` (50% opacity)
- Color level system determines token resolution

### Responsive Design
- Use multi-viewport expressions for responsive styling
- Format: `value; breakpoint{ value }`
- Example: `width="100%; l{ 50% }"` (100% width, 50% on large screens)

### Border Shorthand
- `border="4xs"` creates a 1px solid border with default color
- `border="4xs solid strong"` specifies width, style, and color
- Individual properties: `border-width`, `border-style`, `border-color`

### Performance
- Avoid excessive nesting of GdsDiv elements
- Consider using CSS Grid or Flexbox at a higher level
- Style expression properties are optimized but should be used judiciously

## Common Patterns

### Container Pattern
```tsx
<GdsDiv 
  max-width="1200px" 
  margin-inline="auto" 
  padding-inline="xl"
>
  {/* Content */}
</GdsDiv>
```

### Card Pattern
```tsx
<GdsDiv 
  background="03" 
  border-radius="m" 
  padding="xl" 
  box-shadow="m"
>
  {/* Card content */}
</GdsDiv>
```

### Section Divider Pattern
```tsx
<GdsDiv 
  border-width="0 0 4xs 0" 
  border-color="subtle-01" 
  padding-block="l"
>
  {/* Section content */}
</GdsDiv>
```

### Centered Content Pattern
```tsx
<GdsDiv 
  display="flex" 
  justify-content="center" 
  align-items="center" 
  min-height="300px"
>
  {/* Centered content */}
</GdsDiv>
```

## TypeScript Types

```tsx
import type { GdsDiv } from '@sebgroup/green-core/react'

// Color level type
type GdsColorLevel = '1' | '2' | '3' | '4'

// Style expression property values
type SpaceToken = '4xs' | '3xs' | '2xs' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl' | '4xl'
type ShadowToken = 'xs' | 's' | 'm' | 'l' | 'xl'
type ColorToken = string // Any valid color token from the design system
type ColorWithTransparency = `${ColorToken}/${number}` // e.g., 'neutral-01/0.5'

// Component props type
interface GdsDivProps extends React.HTMLAttributes<HTMLElement> {
  level?: GdsColorLevel
  
  // Display & Layout
  display?: string
  position?: string
  overflow?: string
  'overflow-wrap'?: string
  'box-sizing'?: string
  'z-index'?: string
  cursor?: string
  'pointer-events'?: string
  'aspect-ratio'?: string
  
  // Sizing
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
  
  // Spacing
  margin?: SpaceToken
  'margin-inline'?: SpaceToken
  'margin-block'?: SpaceToken
  padding?: SpaceToken
  'padding-inline'?: SpaceToken
  'padding-block'?: SpaceToken
  gap?: SpaceToken
  
  // Colors & Appearance
  background?: ColorToken | ColorWithTransparency
  color?: ColorToken | ColorWithTransparency
  opacity?: string
  
  // Borders
  border?: string
  'border-width'?: SpaceToken | string
  'border-style'?: string
  'border-color'?: ColorToken | ColorWithTransparency
  'border-radius'?: SpaceToken | string
  'box-shadow'?: ShadowToken
  
  // Flexbox
  'flex-direction'?: string
  'flex-wrap'?: string
  flex?: string
  'align-items'?: string
  'align-content'?: string
  'align-self'?: string
  'justify-content'?: string
  'justify-items'?: string
  'justify-self'?: string
  'place-items'?: string
  'place-content'?: string
  'place-self'?: string
  order?: string
  
  // Grid
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  
  // Typography
  font?: string
  'font-weight'?: string
  'text-align'?: string
  'text-wrap'?: string
  'white-space'?: string
  
  // Transform & Position
  transform?: string
  inset?: string
}
```

## Related Components

- [Radius](./Radius.md) — Corner radius tokens for border-radius styling
- [Spacing](./Spacing.md) — Spacing system and tokens for padding, margin, and gap
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) — Style expression properties guide
- [GdsFlex](./GdsFlex.md) — Specialized flexbox container (extends GdsDiv)
- [GdsGrid](./GdsGrid.md) — Specialized grid container (extends GdsDiv)
- [GdsCard](./GdsCard.md) — Pre-configured card container (extends GdsDiv)
- [GdsText](./GdsText.md) — Typography component (extends GdsDiv)
- [GdsRichText](./GdsRichText.md) — Rich text with automatic typography (extends GdsDiv)
- [GdsDivider](./GdsDivider.md) — For content separation (not for container borders)
- [GdsContainer](./GdsContainer.md) — Page-level container component

## Accessibility

- **Semantic HTML**: GdsDiv renders as a `<div>` element by default
- **ARIA Roles**: Add appropriate ARIA roles when needed for semantic meaning
- **Interactive Elements**: Add proper keyboard handlers and ARIA attributes for interactive divs
- **Color Contrast**: Ensure sufficient contrast when using color tokens
- **Focus Indicators**: Add visible focus states for interactive elements

## Notes

- GdsDiv is the foundation for other layout components (GdsFlex, GdsGrid, GdsCard, GdsText)
- All style expression properties use the declarative layout system
- Space tokens ensure consistent spacing across the design system
- Color tokens support optional transparency with `/opacity` syntax
- Multi-viewport expressions enable responsive design
- Default color level is `2` - affects color token resolution
- Border properties default to `subtle-01` color and `solid` style
- Use specialized components (GdsFlex, GdsGrid, GdsCard) when appropriate instead of configuring GdsDiv manually
