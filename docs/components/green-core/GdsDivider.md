# GdsDivider

Divider creates visual and semantic separation between content.

## Overview

The GdsDivider component provides a horizontal rule that separates content sections both visually and semantically. It can be customized with different colors, sizes, and opacity levels using design system tokens.

Use dividers to create clear separation between related groups of content. For purely visual separation without semantic meaning, add `role="presentation"`.

**Important**: Dividers should not be used as borders for containers. Use the `border` property of the container component instead.

## Import

```tsx
// Use as JSX element in React
import { GdsDivider } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsDivider />
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `role` | `string` | `null` | Use `role="presentation"` for visual-only separation without semantic meaning |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `undefined` | Color token from the design system (e.g., `'subtle-01'`, `'interactive'`, `'strong'`) |
| `size` | `string` | `undefined` | Space token for spacing around divider (e.g., `'xl'`, `'2xl'`, `'4xl'`) |
| `opacity` | `string` | `undefined` | Opacity value (e.g., `'0.2'`, `'0.5'`, `'0.8'`) |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `width` | Controls the width property. Supports space tokens and all valid CSS width values |
| `min-width` | Controls the min-width property. Supports space tokens and all valid CSS values |
| `max-width` | Controls the max-width property. Supports space tokens and all valid CSS values |
| `inline-size` | Controls the inline-size property. Supports space tokens and all valid CSS values |
| `min-inline-size` | Controls the min-inline-size property. Supports space tokens and all valid CSS values |
| `max-inline-size` | Controls the max-inline-size property. Supports space tokens and all valid CSS values |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

## Orientation

By default `GdsDivider` renders a horizontal separator (the semantic equivalent of an `<hr>`). You can present a visual vertical divider by:

- setting `role="separator"` (or leaving the default semantic role) and using `aria-orientation="vertical"` so assistive technologies understand the orientation, and
- adjusting sizing via style expressions or inline styles (for example set `height` and `width` to create a thin vertical line).

Example (vertical toolbar divider):

```tsx
<GdsDivider role="separator" aria-orientation="vertical" style={{ height: '24px', width: '1px' }} />
```

Note: if the divider is purely decorative (for spacing only) use `role="presentation"` and omit `aria-orientation`.

## Thickness & Styling

The component intentionally focuses on semantic separation and spacing; thickness and exact line styles are left to the page styles so they can match the surrounding UI. To change thickness or line style, override with inline styles or style expressions:

```tsx
<GdsDivider style={{ height: '2px', backgroundColor: 'var(--gds-color-subtle-01)', border: 'none' }} />
```

Use `opacity` and `color` properties to quickly match design tokens. For advanced styling (dashed, dotted, or gradient dividers) use the `style` prop or a wrapping element and keep in mind contrast for accessibility.

## Examples

### Basic Divider

```tsx
<GdsTheme>
  <GdsText>Section 1</GdsText>
  <GdsDivider />
  <GdsText>Section 2</GdsText>
</GdsTheme>
```

### With Size (Spacing)

The `size` property controls the spacing around the divider, not the thickness of the line itself:

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column">
    <GdsText>Small spacing</GdsText>
    <GdsDivider size="xl" />
    <GdsText>Content</GdsText>
    
    <GdsText>Medium spacing</GdsText>
    <GdsDivider size="2xl" />
    <GdsText>Content</GdsText>
    
    <GdsText>Large spacing</GdsText>
    <GdsDivider size="4xl" />
    <GdsText>Content</GdsText>
    
    <GdsText>Extra large spacing</GdsText>
    <GdsDivider size="6xl" />
    <GdsText>Content</GdsText>
  </GdsFlex>
</GdsTheme>
```

### Color Variations

The divider accepts all border color tokens from the design system:

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="xl">
    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Interactive color</GdsText>
        <GdsDivider color="interactive" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Subtle color (subtle-01)</GdsText>
        <GdsDivider color="subtle-01" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Subtle color (subtle-02)</GdsText>
        <GdsDivider color="subtle-02" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Strong color</GdsText>
        <GdsDivider color="strong" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Inverse color</GdsText>
        <GdsDivider color="inverse" size="2xl" />
      </GdsFlex>
    </GdsCard>
  </GdsFlex>
</GdsTheme>
```

### Semantic Color Tokens

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="xl">
    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Information (information-01)</GdsText>
        <GdsDivider color="information-01" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Information (information-02)</GdsText>
        <GdsDivider color="information-02" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Positive (positive-01)</GdsText>
        <GdsDivider color="positive-01" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Positive (positive-02)</GdsText>
        <GdsDivider color="positive-02" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Negative (negative-01)</GdsText>
        <GdsDivider color="negative-01" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Negative (negative-02)</GdsText>
        <GdsDivider color="negative-02" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Warning (warning-01)</GdsText>
        <GdsDivider color="warning-01" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Warning (warning-02)</GdsText>
        <GdsDivider color="warning-02" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Notice (notice-01)</GdsText>
        <GdsDivider color="notice-01" size="2xl" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Notice (notice-02)</GdsText>
        <GdsDivider color="notice-02" size="2xl" />
      </GdsFlex>
    </GdsCard>
  </GdsFlex>
</GdsTheme>
```

### Opacity Variations

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="xl">
    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Opacity: 0.2 (lighter)</GdsText>
        <GdsDivider size="2xl" opacity="0.2" />
      </GdsFlex>
    </GdsCard>

    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Opacity: 0.4</GdsText>
        <GdsDivider size="4xl" opacity="0.4" />
      </GdsFlex>
    </GdsCard>

    <GdsCard>
      <GdsFlex flex-direction="column">
        <GdsText>Opacity: 0.6</GdsText>
        <GdsDivider size="2xl" opacity="0.6" />
      </GdsFlex>
    </GdsCard>

    <GdsCard variant="tertiary">
      <GdsFlex flex-direction="column">
        <GdsText>Opacity: 0.8 (darker)</GdsText>
        <GdsDivider size="6xl" opacity="0.8" />
      </GdsFlex>
    </GdsCard>
  </GdsFlex>
</GdsTheme>
```

### Presentational Divider (Visual Only)

Use `role="presentation"` when the divider is purely decorative and should not be announced by screen readers:

```tsx
<GdsTheme>
  <GdsText>This is visual separation only</GdsText>
  <GdsDivider role="presentation" />
  <GdsText>Screen readers won't announce this as a separator</GdsText>
</GdsTheme>
```

### Content Sections

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <div>
      <GdsText tag="h3">Introduction</GdsText>
      <GdsText>Lorem ipsum dolor sit amet...</GdsText>
    </div>

    <GdsDivider size="2xl" />

    <div>
      <GdsText tag="h3">Main Content</GdsText>
      <GdsText>Consectetur adipiscing elit...</GdsText>
    </div>

    <GdsDivider size="2xl" />

    <div>
      <GdsText tag="h3">Conclusion</GdsText>
      <GdsText>Sed do eiusmod tempor...</GdsText>
    </div>
  </GdsFlex>
</GdsTheme>
```

### Card Content Separation

```tsx
<GdsTheme>
  <GdsCard padding="xl">
    <GdsFlex flex-direction="column">
      <GdsText tag="h3">Account Information</GdsText>
      <GdsText>Account Number: 123456789</GdsText>
      
      <GdsDivider size="2xl" color="subtle-01" />
      
      <GdsText tag="h3">Balance</GdsText>
      <GdsText>Current Balance: $1,234.56</GdsText>
      
      <GdsDivider size="2xl" color="subtle-01" />
      
      <GdsText tag="h3">Recent Transactions</GdsText>
      <GdsText>Last transaction: $50.00</GdsText>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### List Item Separation

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column">
    <GdsFlex padding="m" justify-content="space-between">
      <GdsText>Item 1</GdsText>
      <GdsText>$10.00</GdsText>
    </GdsFlex>
    
    <GdsDivider role="presentation" />
    
    <GdsFlex padding="m" justify-content="space-between">
      <GdsText>Item 2</GdsText>
      <GdsText>$25.00</GdsText>
    </GdsFlex>
    
    <GdsDivider role="presentation" />
    
    <GdsFlex padding="m" justify-content="space-between">
      <GdsText>Item 3</GdsText>
      <GdsText>$15.00</GdsText>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Form Section Separation

```tsx
<GdsTheme>
  <form>
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3">Personal Information</GdsText>
      <GdsInput label="Name" />
      <GdsInput label="Email" />
      
      <GdsDivider size="3xl" color="subtle-01" />
      
      <GdsText tag="h3">Address</GdsText>
      <GdsInput label="Street" />
      <GdsInput label="City" />
      
      <GdsDivider size="3xl" color="subtle-01" />
      
      <GdsButton>Submit</GdsButton>
    </GdsFlex>
  </form>
</GdsTheme>
```

### Alert Separation

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsAlert variant="positive">
      Successfully saved changes
    </GdsAlert>
    
    <GdsDivider size="xl" opacity="0.3" />
    
    <GdsAlert variant="information">
      New feature available
    </GdsAlert>
    
    <GdsDivider size="xl" opacity="0.3" />
    
    <GdsAlert variant="warning">
      Please review your information
    </GdsAlert>
  </GdsFlex>
</GdsTheme>
```

### Custom Width

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" align-items="center" gap="xl">
    <GdsDivider width="50%" size="2xl" />
    <GdsDivider width="75%" size="2xl" />
    <GdsDivider width="100%" size="2xl" />
  </GdsFlex>
</GdsTheme>
```

### Navigation Menu Separation

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column">
    <GdsButton rank="tertiary">Dashboard</GdsButton>
    <GdsDivider role="presentation" size="xs" />
    
    <GdsButton rank="tertiary">Accounts</GdsButton>
    <GdsDivider role="presentation" size="xs" />
    
    <GdsButton rank="tertiary">Transfers</GdsButton>
    <GdsDivider role="presentation" size="xs" />
    
    <GdsButton rank="tertiary">Settings</GdsButton>
  </GdsFlex>
</GdsTheme>
```

### Toolbar Separation

```tsx
<GdsTheme>
  <GdsFlex gap="m" align-items="center">
    <GdsButton>Save</GdsButton>
    <GdsButton>Cancel</GdsButton>
    
    <GdsDivider 
      role="presentation" 
      size="xs"
      style={{ height: '24px', width: '1px' }} 
    />
    
    <GdsButton rank="secondary">Export</GdsButton>
    <GdsButton rank="secondary">Print</GdsButton>
  </GdsFlex>
</GdsTheme>
```

## Best Practices

### Semantic vs Visual Separation
- Use default divider (without `role`) for semantic content separation
- Use `role="presentation"` for purely decorative visual separation
- Screen readers announce semantic dividers as separators or thematic breaks

### Spacing Control
- Use the `size` property to control spacing around the divider
- Size tokens: `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`
- The `size` property affects spacing, not the thickness of the line itself

### Color Selection
- Use `subtle-01` or `subtle-02` for most content separations
- Use `strong` for prominent separations
- Use semantic colors (`positive-01`, `negative-01`, etc.) to match nearby content
- Match divider color to the context (card variant, alert type, etc.)

### Opacity
- Use lower opacity (`0.2`, `0.3`) for subtle, background separations
- Use higher opacity (`0.6`, `0.8`) for more prominent separations
- Consider the background color when setting opacity

### Don't Use for Borders
- **Don't** use GdsDivider as a border for containers
- **Do** use the `border` property on the container component instead
- Dividers are for separating content, not outlining containers

### Accessibility
- Provide semantic meaning by default (without `role="presentation"`)
- Use `role="presentation"` only when the divider is purely decorative
- Ensure sufficient color contrast for visual users
- Consider spacing to create clear visual separation

## Common Patterns

### Section Divider
```tsx
<GdsDivider size="2xl" />
```

### Subtle List Separator
```tsx
<GdsDivider role="presentation" size="xs" opacity="0.3" />
```

### Prominent Content Break
```tsx
<GdsDivider size="4xl" color="strong" />
```

### Card Section Separator
```tsx
<GdsDivider size="xl" color="subtle-01" />
```

## TypeScript Types

```tsx
import type { GdsDivider } from '@sebgroup/green-core/react'

// Color tokens (border colors)
type DividerColor = 
  | 'interactive'
  | 'subtle-01'
  | 'subtle-02'
  | 'strong'
  | 'inverse'
  | 'information-01'
  | 'information-02'
  | 'positive-01'
  | 'positive-02'
  | 'negative-01'
  | 'negative-02'
  | 'warning-01'
  | 'warning-02'
  | 'notice-01'
  | 'notice-02'

// Space tokens for size
type SpaceToken = 
  | 'xs' | 's' | 'm' | 'l' | 'xl' 
  | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'

// Opacity values
type OpacityValue = string // e.g., '0.2', '0.5', '0.8'

// Component props type
interface GdsDividerProps extends React.HTMLAttributes<HTMLElement> {
  color?: DividerColor
  size?: SpaceToken
  opacity?: OpacityValue
  role?: 'presentation' | string
  
  // Style expression properties
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
}
```

## Related Components

- [GdsCard](./GdsCard.md) — For card containers with dividers
- [GdsFlex](./GdsFlex.md) — For layout of content with dividers
- [GdsFormattedAccount](./GdsFormattedAccount.md) — For separating account listings
- [GdsFormattedDate](./GdsFormattedDate.md) — For separating date/time entries
- [GdsFormattedNumber](./GdsFormattedNumber.md) — For separating amount/balance entries
- [GdsGroupedList](./GdsGroupedList.md) — For separating grouped lists
- [GdsDiv](./GdsDiv.md) — Base container (use its border property for container borders)
- [GdsText](./GdsText.md) — For text content separated by dividers
- [GdsAlert](./GdsAlert.md) — For alert messages with divider separation

## Accessibility

- **Semantic Role**: Default role is separator/thematic break (announced by screen readers)
- **Presentation Role**: Add `role="presentation"` for visual-only dividers
- **Color Contrast**: Ensure sufficient contrast for visual users
- **Spacing**: Use appropriate `size` values to create clear visual separation
- **Context**: Dividers should separate related groups of content logically

## Notes

- GdsDivider renders as a horizontal rule (`<hr>`) element
- The `size` property controls spacing around the divider, not line thickness
- All color tokens from the design system are supported
- Opacity can be adjusted independently of color
- Do not use dividers as container borders - use the container's `border` property instead
- Default semantic role helps screen reader users understand content structure
- Use `role="presentation"` to hide divider from assistive technologies when purely decorative
- Style expression properties allow customization of width and sizing
