# GdsCard

The card component groups related content into a single container with predefined styling and color variants. It extends `GdsDiv` with additional defaults optimized for card-based layouts.

> **Related Components**: See also [GdsCardPattern01](./GdsCardPattern01.md) for a pre-styled card pattern with built-in support for images, headers, and footer actions.
> 
> **Architecture**: See [Green Design System Architecture](./GreenDesignSystemArchitecture.md) for understanding how GdsCard fits into the component hierarchy.

## Features

- **Extends GdsDiv**: Inherits all layout and styling properties from GdsDiv
- **Color Variants**: Predefined variants for different semantic contexts
- **Shadow Styles**: Built-in box-shadow tokens (xs, s, m, l, xl, 2xl)
- **Responsive Design**: Style expression support for responsive layouts
- **Grid Integration**: Works seamlessly with GdsGrid for complex layouts
- **Level System**: Color token resolution based on nesting level
- **Flexible Content**: Accepts any HTML content or components
- **Self-Contained Styling**: No external CSS imports needed

## Anatomy

1. Card container — the outer surface and visual container
2. Media / Icon — optional decorative media (image, icon) placed at top or alongside content
3. Content area — title, body text and metadata
4. Actions area — buttons or links that act on the card content

## Variants & Brand

- **Brand 01**: Reserved for special contexts and curated content. Use sparingly and follow brand guidance. Currently supported in card slot content only (text, link, icon). Guidelines for action components in brand contexts will be added when available.


## Import

```tsx
import { GdsCard } from '@sebgroup/green-core/react'
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `level` | `GdsColorLevel` | `'2'` | Color token resolution level (1-4) |
| `gds-element` | `string` | `undefined` | Unscoped element name (read-only) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `string` | `undefined` | Shortcut for border, background, and text color. Options: `'primary'`, `'secondary'`, `'tertiary'`, `'brand-01'`, `'brand-02'`, `'positive'`, `'negative'`, `'notice'`, `'warning'`, `'information'`. Supports Style Expression syntax for responsive values. |
| `font` | `string` | `undefined` | Controls font property with design system tokens |
| `overflow-wrap` | `string` | `undefined` | Controls text overflow wrapping |
| `white-space` | `string` | `undefined` | Controls white-space CSS property |
| `aspect-ratio` | `string` | `undefined` | Controls aspect-ratio property |
| `cursor` | `string` | `undefined` | Controls cursor property |
| `pointer-events` | `string` | `undefined` | Controls pointer-events property |
| `isDefined` | `boolean` | `false` | Whether element is in custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expressions |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only) |

### Style Expression Properties (Layout & Spacing)

| Property | Description | Accepts |
|----------|-------------|---------|
| `padding` | Controls padding | Space tokens only |
| `padding-inline` | Controls horizontal padding | Space tokens only |
| `padding-block` | Controls vertical padding | Space tokens only |
| `margin` | Controls margin | Space tokens only |
| `margin-inline` | Controls horizontal margin | Space tokens only |
| `margin-block` | Controls vertical margin | Space tokens only |
| `width` | Controls width | Space tokens + CSS values |
| `min-width` | Controls min-width | Space tokens + CSS values |
| `max-width` | Controls max-width | Space tokens + CSS values |
| `inline-size` | Controls inline-size | Space tokens + CSS values |
| `min-inline-size` | Controls min-inline-size | Space tokens + CSS values |
| `max-inline-size` | Controls max-inline-size | Space tokens + CSS values |
| `height` | Controls height | Space tokens + CSS values |
| `min-height` | Controls min-height | Space tokens + CSS values |
| `max-height` | Controls max-height | Space tokens + CSS values |
| `block-size` | Controls block-size | Space tokens + CSS values |
| `min-block-size` | Controls min-block-size | Space tokens + CSS values |
| `max-block-size` | Controls max-block-size | Space tokens + CSS values |
| `gap` | Controls gap | Space tokens only |

### Style Expression Properties (Positioning & Display)

| Property | Description | Accepts |
|----------|-------------|---------|
| `display` | Controls display | All CSS display values |
| `position` | Controls position | All CSS position values |
| `inset` | Controls inset | All CSS inset values |
| `transform` | Controls transform | All CSS transform values |
| `z-index` | Controls z-index | All CSS z-index values |
| `align-self` | Controls align-self | All CSS align-self values |
| `justify-self` | Controls justify-self | All CSS justify-self values |
| `place-self` | Controls place-self | All CSS place-self values |

### Style Expression Properties (Grid & Flex)

| Property | Description | Accepts |
|----------|-------------|---------|
| `grid-column` | Controls grid-column span | CSS grid-column values |
| `grid-row` | Controls grid-row span | CSS grid-row values |
| `grid-area` | Controls grid-area | CSS grid-area values |
| `flex` | Controls flex property | CSS flex values |
| `order` | Controls order | CSS order values |
| `align-items` | Controls align-items | CSS align-items values |
| `align-content` | Controls align-content | CSS align-content values |
| `justify-content` | Controls justify-content | CSS justify-content values |
| `justify-items` | Controls justify-items | CSS justify-items values |
| `flex-direction` | Controls flex-direction | CSS flex-direction values |
| `flex-wrap` | Controls flex-wrap | CSS flex-wrap values |
| `place-items` | Controls place-items | CSS place-items values |
| `place-content` | Controls place-content | CSS place-content values |

### Style Expression Properties (Visual Styling)

| Property | Description | Accepts |
|----------|-------------|---------|
| `color` | Controls text color | Color tokens with optional transparency (`token/0.5`) |
| `background` | Controls background | Color tokens with optional transparency |
| `border` | Controls border | Format: `size style color` (e.g., `4xs solid subtle-01/0.2`) |
| `border-color` | Controls border-color | Color tokens with optional transparency |
| `border-width` | Controls border-width | Space tokens only |
| `border-style` | Controls border-style | CSS border-style values |
| `border-radius` | Controls border-radius | Space tokens only |
| `box-shadow` | Controls box-shadow | Shadow tokens: `xs`, `s`, `m`, `l`, `xl`, `2xl` |
| `opacity` | Controls opacity | CSS opacity values |
| `overflow` | Controls overflow | CSS overflow values |
| `box-sizing` | Controls box-sizing | CSS box-sizing values |

### Style Expression Properties (Typography)

| Property | Description | Accepts |
|----------|-------------|---------|
| `font-weight` | Controls font-weight | Typography weight tokens |
| `text-align` | Controls text-align | CSS text-align values |
| `text-wrap` | Controls text-wrap | CSS text-wrap values |

### Events

| Event | Description |
|-------|-------------|
| `gds-element-disconnected` | Fired when element is disconnected from DOM |

## Usage Examples

### Basic Card

```tsx
import { GdsCard, GdsTheme } from '@sebgroup/green-core/react'

function BasicCard() {
  return (
    <GdsTheme>
      <GdsCard style={{ maxWidth: '200px' }}>
        Card content
      </GdsCard>
    </GdsTheme>
  )
}
```

### Card Variants

Different color variants for semantic meaning:

```tsx
import { GdsCard, GdsTheme, GdsGrid } from '@sebgroup/green-core/react'

function CardVariants() {
  return (
    <GdsTheme>
      <GdsGrid columns="3" gap="l">
        <GdsCard variant="primary">Primary</GdsCard>
        <GdsCard variant="secondary">Secondary</GdsCard>
        <GdsCard variant="tertiary">Tertiary</GdsCard>
        
        <GdsCard variant="brand-01">Brand 01</GdsCard>
        <GdsCard variant="brand-02">Brand 02</GdsCard>
        
        <GdsCard variant="positive">Positive</GdsCard>
        <GdsCard variant="negative">Negative</GdsCard>
        <GdsCard variant="notice">Notice</GdsCard>
        <GdsCard variant="warning">Warning</GdsCard>
        <GdsCard variant="information">Information</GdsCard>
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Card with Shadow

Apply different shadow levels:

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsFlex } from '@sebgroup/green-core/react'

function CardShadows() {
  return (
    <GdsTheme>
      <GdsGrid columns="1; s{6}" gap="2xl" padding="2xl">
        <GdsCard 
          box-shadow="xs" 
          border-radius="xs" 
          variant="secondary"
          height="100px"
          border-width="0"
        >
        > 
        > **Related tokens & styles**: See [Shadows](./Shadows.md), [Radius](./Radius.md), [Motion](./Motion.md), and [Accessibility](./Accessibility.md)
          <GdsFlex alignItems="center" justifyContent="center">
            XS Shadow
          </GdsFlex>
        </GdsCard>
        
        <GdsCard 
          box-shadow="s" 
          border-radius="xs" 
          variant="secondary"
          height="100px"
          border-width="0"
        >
          <GdsFlex alignItems="center" justifyContent="center">
            S Shadow
          </GdsFlex>
        </GdsCard>
        
        <GdsCard 
          box-shadow="m" 
          border-radius="xs" 
          variant="secondary"
          height="100px"
          border-width="0"
        >
          <GdsFlex alignItems="center" justifyContent="center">
            M Shadow
          </GdsFlex>
        </GdsCard>
        
        <GdsCard 
          box-shadow="l" 
          border-radius="xs" 
          variant="secondary"
          height="100px"
          border-width="0"
        >
          <GdsFlex alignItems="center" justifyContent="center">
            L Shadow
          </GdsFlex>
        </GdsCard>
        
        <GdsCard 
          box-shadow="xl" 
          border-radius="xs" 
          variant="secondary"
          height="100px"
          border-width="0"
        >
          <GdsFlex alignItems="center" justifyContent="center">
            XL Shadow
          </GdsFlex>
        </GdsCard>
        
        <GdsCard 
          box-shadow="2xl" 
          border-radius="xs" 
          variant="secondary"
          height="100px"
          border-width="0"
        >
          <GdsFlex alignItems="center" justifyContent="center">
            2XL Shadow
          </GdsFlex>
        </GdsCard>
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Card with Content

```tsx
import { GdsCard, GdsTheme, GdsFlex, GdsText, GdsButton } from '@sebgroup/green-core/react'

function ContentCard() {
  return (
    <GdsTheme>
      <GdsCard border-radius="xs" padding="l">
        <GdsFlex gap="m" flexDirection="column" alignItems="flex-start">
          <GdsText tag="h3">Card Title</GdsText>
          <GdsText textWrap="balance">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </GdsText>
          <GdsButton>Action</GdsButton>
        </GdsFlex>
      </GdsCard>
    </GdsTheme>
  )
}
```

### Card Grid Layout

Using cards with grid for complex layouts:

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsDiv, GdsFlex, GdsText, GdsButton } from '@sebgroup/green-core/react'

function CardGridLayout() {
  return (
    <GdsTheme>
      <GdsGrid columns="4" gap="l">
        {/* Sidebar - 1 column */}
        <GdsDiv>
          <GdsCard border-radius="xs">
            <GdsFlex gap="m" flexDirection="column" alignItems="flex-start">
              <GdsText font="l{heading-s} m{heading-s} s{heading-s}">
                Sidebar
              </GdsText>
              <GdsText textWrap="balance">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </GdsText>
              <GdsButton>Action</GdsButton>
            </GdsFlex>
          </GdsCard>
        </GdsDiv>
        
        {/* Main content - Spans columns 2 to end, all rows */}
        <GdsDiv grid-column="2 / -1" grid-row="1 / -1" display="flex">
          <GdsCard border-radius="xs">
            <GdsFlex flexDirection="column" alignItems="flex-start" gap="m">
              <GdsText font="heading-s">Span Columns: [2 / -1]</GdsText>
              <GdsText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </GdsText>
              <GdsButton>Action</GdsButton>
            </GdsFlex>
          </GdsCard>
        </GdsDiv>
        
        {/* Footer - Spans all columns */}
        <GdsDiv grid-column="1 / -1">
          <GdsCard border-radius="xs">
            <GdsFlex flexDirection="column" alignItems="flex-start" gap="m">
              <GdsText font="heading-s">Span all columns [1 / -1]</GdsText>
              <GdsText textWrap="balance">
                This card spans the full width of the grid.
              </GdsText>
              <GdsButton>Action</GdsButton>
            </GdsFlex>
          </GdsCard>
        </GdsDiv>
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Responsive Card Layout

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsFlex, GdsText } from '@sebgroup/green-core/react'

function ResponsiveCards() {
  return (
    <GdsTheme>
      <GdsGrid columns="1; s{2}; m{3}; l{4}" gap="l">
        {[1, 2, 3, 4, 5, 6].map(num => (
          <gds-card 
            key={num}
            border-radius="xs" 
            padding="l"
            variant="secondary"
          >
            <GdsFlex flexDirection="column" gap="m">
              <GdsText font="heading-s">Card {num}</GdsText>
              <GdsText>Responsive card layout</GdsText>
            </GdsFlex>
          </gds-card>
        ))}
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Dark Mode Cards

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsFlex, GdsText } from '@sebgroup/green-core/react'

function DarkModeCards() {
  return (
    <GdsFlex gap="l" flexDirection="column">
      {/* Light mode */}
      <gds-card variant="secondary">
        <GdsFlex gap="l" flexDirection="column">
          <GdsText tag="h3">Light Mode</GdsText>
          <GdsGrid columns="3" gap="l">
            <gds-card variant="primary">Primary</gds-card>
            <gds-card variant="secondary">Secondary</gds-card>
            <gds-card variant="tertiary">Tertiary</gds-card>
          </GdsGrid>
        </GdsFlex>
      </gds-card>
      
      {/* Dark mode */}
      <GdsTheme colorScheme="dark">
        <gds-card level="1">
          <GdsFlex gap="l" flexDirection="column">
            <GdsText tag="h3">Dark Mode</GdsText>
            <GdsGrid columns="3" gap="l">
              <gds-card variant="primary">Primary</gds-card>
              <gds-card variant="secondary">Secondary</gds-card>
              <gds-card variant="tertiary">Tertiary</gds-card>
            </GdsGrid>
          </GdsFlex>
        </gds-card>
      </GdsTheme>
    </GdsFlex>
  )
}
```

### Interactive Card

```tsx
import { GdsCard, GdsTheme, GdsFlex, GdsText, GdsButton } from '@sebgroup/green-core/react'
import { IconArrowRight } from '@sebgroup/green-core/react'
import { useState } from 'react'

function InteractiveCard() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <GdsTheme>
      <gds-card 
        border-radius="xs" 
        padding="l"
        variant="secondary"
        cursor="pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <GdsFlex flexDirection="column" gap="m">
          <GdsFlex justifyContent="space-between" alignItems="center">
            <GdsText font="heading-s">Interactive Card</GdsText>
            <IconArrowRight 
              style={{ 
                transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }} 
            />
          </GdsFlex>
          
          {isExpanded && (
            <GdsText>
              This content is revealed when the card is clicked.
            </GdsText>
          )}
        </GdsFlex>
      </gds-card>
    </GdsTheme>
  )
}
```

### Card with Image

```tsx
import { GdsCard, GdsTheme, GdsFlex, GdsText, GdsButton, GdsImg } from '@sebgroup/green-core/react'

function ImageCard() {
  return (
    <GdsTheme>
      <gds-card border-radius="xs" overflow="hidden" max-width="300px">
        <GdsFlex flexDirection="column">
          <GdsImg 
            src="/path/to/image.jpg" 
            alt="Card image"
            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          />
          <gds-div padding="l">
            <GdsFlex flexDirection="column" gap="m">
              <GdsText font="heading-s">Image Card</GdsText>
              <GdsText>
                Card with an image at the top and content below.
              </GdsText>
              <GdsButton>Learn More</GdsButton>
            </GdsFlex>
          </gds-div>
        </GdsFlex>
      </gds-card>
    </GdsTheme>
  )
}
```

### Dashboard Card

```tsx
import { GdsCard, GdsTheme, GdsFlex, GdsText, GdsBadge } from '@sebgroup/green-core/react'
import { IconTrendingUp } from '@sebgroup/green-core/react'

function DashboardCard() {
  return (
    <GdsTheme>
      <gds-card border-radius="xs" padding="l" variant="secondary">
        <GdsFlex flexDirection="column" gap="m">
          <GdsFlex justifyContent="space-between" alignItems="center">
            <GdsText font="detail-m" color="secondary">Total Revenue</GdsText>
            <GdsBadge variant="positive" size="small">
              <IconTrendingUp slot="lead" size="xs" />
              +12%
            </GdsBadge>
          </GdsFlex>
          
          <GdsText font="heading-xl">$45,231.89</GdsText>
          
          <GdsText font="detail-s" color="secondary">
            +20.1% from last month
          </GdsText>
        </GdsFlex>
      </gds-card>
    </GdsTheme>
  )
}
```

## Use Cases

### Content Organization
- Grouping related information
- Section containers
- Panel layouts

### Dashboard Widgets
- Metric cards
- Status cards
- Summary panels

### Product Cards
- E-commerce product displays
- Service offerings
- Feature highlights

### Form Sections
- Multi-section forms
- Grouped input fields
- Step indicators

### List Items
- Feature lists
- Pricing tiers
- Comparison tables

### Modal Content
- Dialog content containers
- Popup panels

## Best Practices

### Do's
- ✅ Use appropriate `variant` for semantic meaning
- ✅ Apply consistent `border-radius` across cards
- ✅ Use `box-shadow` for elevation hierarchy
- ✅ Leverage `grid-column` and `grid-row` for complex layouts
- ✅ Combine with GdsFlex for internal layout
- ✅ Use responsive style expressions for adaptive layouts
- ✅ Set appropriate `padding` for content spacing
- ✅ Use `level` attribute for proper color token resolution in nested contexts
- ✅ Apply `overflow` when needed for content control

### Don'ts
- ❌ Don't nest cards too deeply (affects color resolution)
- ❌ Don't mix too many variants in the same context
- ❌ Don't forget to set `max-width` when cards should be constrained
- ❌ Don't overuse shadows - maintain visual hierarchy
- ❌ Don't ignore responsive design with fixed dimensions
- ❌ Don't use cards for everything - sometimes simple divs are better
- ❌ Don't forget accessibility when cards are interactive

## Common Patterns

### Three-Column Layout

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsFlex, GdsText, GdsButton } from '@sebgroup/green-core/react'

function ThreeColumnLayout() {
  return (
    <GdsTheme>
      <GdsGrid columns="1; m{3}" gap="l">
        {['Basic', 'Pro', 'Enterprise'].map(tier => (
          <gds-card key={tier} border-radius="xs" padding="xl" variant="secondary">
            <GdsFlex flexDirection="column" gap="l" alignItems="center">
              <GdsText font="heading-m">{tier}</GdsText>
              <GdsText font="heading-xl">$99</GdsText>
              <GdsButton variant="positive">Choose Plan</GdsButton>
            </GdsFlex>
          </gds-card>
        ))}
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Sidebar Layout

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsFlex, GdsText } from '@sebgroup/green-core/react'

function SidebarLayout() {
  return (
    <GdsTheme>
      <GdsGrid columns="1; l{250px 1fr}" gap="l">
        {/* Sidebar */}
        <gds-card border-radius="xs" padding="l">
          <GdsFlex flexDirection="column" gap="m">
            <GdsText font="heading-s">Navigation</GdsText>
            {/* Navigation items */}
          </GdsFlex>
        </gds-card>
        
        {/* Main content */}
        <gds-card border-radius="xs" padding="l">
          <GdsText font="heading-l">Main Content</GdsText>
        </gds-card>
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Masonry-Style Grid

```tsx
import { GdsCard, GdsTheme, GdsGrid, GdsText } from '@sebgroup/green-core/react'

function MasonryGrid() {
  const heights = ['200px', '300px', '250px', '350px', '200px', '280px']
  
  return (
    <GdsTheme>
      <GdsGrid columns="1; s{2}; m{3}" gap="l">
        {heights.map((height, index) => (
          <gds-card 
            key={index}
            border-radius="xs" 
            padding="l"
            height={height}
            variant="secondary"
          >
            <GdsText>Card {index + 1}</GdsText>
          </gds-card>
        ))}
      </GdsGrid>
    </GdsTheme>
  )
}
```

### Nested Cards

```tsx
import { GdsCard, GdsTheme, GdsFlex, GdsText } from '@sebgroup/green-core/react'

function NestedCards() {
  return (
    <GdsTheme>
      <gds-card border-radius="xs" padding="l" variant="secondary">
        <GdsFlex flexDirection="column" gap="l">
          <GdsText font="heading-m">Parent Card</GdsText>
          
          <gds-card 
            border-radius="xs" 
            padding="m" 
            variant="tertiary"
            level="3"
          >
            <GdsText>Nested Card - Note the level="3" for proper color resolution</GdsText>
          </gds-card>
        </GdsFlex>
      </gds-card>
    </GdsTheme>
  )
}
```

## Related Components

- [Radius](./Radius.md) — Corner radius tokens for card roundness
- [Spacing](./Spacing.md) — Spacing system for card padding and layout
- [GdsDiv](./GdsDiv.md) — Base container component (GdsCard extends this)
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling card color schemes
- [GdsDivider](./GdsDivider.md) — For separating card content sections
- [GdsInput](./GdsInput.md) — For text inputs in card forms
- [GdsLink](./GdsLink.md) — For navigation links in cards
- [GdsMask](./GdsMask.md) — For gradient overlays over card images
- [GdsDropdown](./GdsDropdown.md) — For dropdowns within cards
- [GdsFilterChip](./GdsFilterChip.md) — For filter chips in card lists
- [GdsFormattedAccount](./GdsFormattedAccount.md) — For displaying account numbers in cards
- [GdsFormattedDate](./GdsFormattedDate.md) — For displaying dates in cards
- [GdsFormattedNumber](./GdsFormattedNumber.md) — For displaying amounts and balances in cards
- [GdsFormSummary](./GdsFormSummary.md) — For form validation in cards
- [GdsRadioGroup](./GdsRadioGroup.md) — For radio button selections in card forms
- [GdsRichText](./GdsRichText.md) — For wrapping rich text content with design system typography
- [GdsPopover](./GdsPopover.md) — For overlay content triggered from cards
- [GdsSpinner](./GdsSpinner.md) — Loading indicator with cover mode for card overlays
- [GdsGrid](./GdsGrid.md) — For card grid layouts
- [GdsGroupedList](./GdsGroupedList.md) — For structured lists within cards
- [GdsImg](./GdsImg.md) — For images in card headers or content
- [GdsVideo](./GdsVideo.md) — For video content in cards
- [GdsFlex](./GdsFlex.md) — For card content layout
- [GdsText](./GdsText.md) — For typography within cards
- [GdsButton](./GdsButton.md) — For card actions
- [GdsBadge](./GdsBadge.md) — For status indicators in cards
- [GdsBlur](./GdsBlur.md) — For sensitive content in cards
- [GdsContextMenu](./GdsContextMenu.md) — For card action menus
- [Icons](./Icons.md) — For icons in card headers

## Accessibility

- **Semantic HTML**: Cards are `<div>` elements by default - add proper ARIA roles when needed
- **Interactive Cards**: Add `role="button"`, `tabindex="0"`, and keyboard handlers for clickable cards
- **Keyboard Navigation**: Ensure interactive elements within cards are keyboard accessible
- **Focus Management**: Provide clear focus indicators for interactive cards
- **Color Contrast**: All variants meet WCAG contrast requirements
- **Screen Readers**: Ensure card content has proper heading hierarchy

### Accessible Interactive Card

```tsx
import { GdsCard, GdsTheme } from '@sebgroup/green-core/react'

function AccessibleInteractiveCard() {
  return (
    <GdsTheme>
      <GdsCard 
        border-radius="xs" 
        padding="l"
        role="button"
        tabIndex={0}
        cursor="pointer"
        onClick={() => console.log('Card clicked')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            console.log('Card activated')
          }
        }}
        aria-label="Product card - Click to view details"
      >
        Card content
      </GdsCard>
    </GdsTheme>
  )
}
```

### Linked Card Accessibility

- For fully clickable cards (`GdsCardLinked` / `gds-card-linked`) ensure any decorative child elements (images, icons) are non-interactive. Do not include nested focusable elements inside a linked card — instead provide actions outside the card or use the default card variant which allows internal actions.
- If decorative anchors are necessary, set `tabIndex={-1}` and `aria-hidden="true"` where appropriate so keyboard and screen-reader users do not encounter unexpected focus targets.

## Notes

- **Extends GdsDiv**: All GdsDiv properties and style expressions are available
- **Level System**: Use `level` attribute (1-4) to ensure proper color token resolution in nested contexts
- **Default Level**: GdsCard uses level 2 by default (unlike GdsDiv which uses level 1)
- **Style Expressions**: Support responsive values with breakpoint syntax: `"value; s{value}; m{value}"`
- **Color Tokens**: Use design system color tokens for consistent theming
- **Space Tokens**: Padding, margin, and gap properties only accept space tokens
- **Shadow Tokens**: box-shadow accepts predefined shadow tokens (xs, s, m, l, xl, 2xl)
- **Grid Integration**: Use `grid-column` and `grid-row` for spanning multiple grid cells
- **Border Syntax**: border property accepts format: `size style color` where size is space token and color is color token
- **Transparency**: Color and background tokens support optional transparency: `token/0.5`

## TypeScript Types

```typescript
interface GdsCardProps {
  // Extends all GdsDiv properties
  variant?: 'primary' | 'secondary' | 'tertiary' | 'brand-01' | 'brand-02' | 
            'positive' | 'negative' | 'notice' | 'warning' | 'information'
  level?: '1' | '2' | '3' | '4'
  
  // Layout
  padding?: string
  margin?: string
  width?: string
  height?: string
  maxWidth?: string
  maxHeight?: string
  
  // Visual
  borderRadius?: string
  boxShadow?: 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl'
  background?: string
  border?: string
  
  // Grid & Flex
  gridColumn?: string
  gridRow?: string
  display?: string
  flexDirection?: string
  alignItems?: string
  justifyContent?: string
  gap?: string
  
  // Other
  cursor?: string
  overflow?: string
  position?: string
  
  // Events
  onClick?: (event: MouseEvent) => void
  onKeyDown?: (event: KeyboardEvent) => void
}
```
