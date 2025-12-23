# Radius

Corner radius tokens define the roundness of component corners, contributing to the visual style and softness of the interface. Consistent use of radius values creates a cohesive and polished design.

## Overview

Radius tokens in Green Design System provide a standardized scale for border-radius values, ranging from sharp corners (0px) to fully rounded elements (999px). These tokens ensure consistency across all components and help maintain the design language.

## Radius System

The radius system uses the same **4px grid foundation** as spacing tokens, providing a harmonious relationship between spacing and corner roundness throughout the interface.

## Radius Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `0` | `0px` | No radius, sharp corners |
| `none` | `0px` | Alias for zero radius |
| `5xs` | `1px` | Minimal radius |
| `4xs` | `2px` | Very slight radius |
| `3xs` | `4px` | Extra small radius |
| `2xs` | `6px` | Compact radius |
| `xs` | `8px` | Small radius |
| `s` | `12px` | Small-medium radius |
| `m` | `16px` | Medium radius (default for most components) |
| `l` | `20px` | Large radius |
| `xl` | `24px` | Extra large radius |
| `2xl` | `32px` | 2× extra large |
| `3xl` | `40px` | 3× extra large |
| `4xl` | `48px` | 4× extra large |
| `5xl` | `64px` | 5× extra large |
| `max` | `999px` | Fully rounded (pill shape) |

## Using Radius Tokens

### Via CSS Custom Properties

Access radius tokens via CSS `var()` function:

```css
.my-card {
  border-radius: var(--gds-sys-radius-m);
}

.my-button {
  border-radius: var(--gds-sys-radius-xs);
}

.my-avatar {
  border-radius: var(--gds-sys-radius-max); /* Fully rounded */
}
```

### Via Style Expression Properties

Use radius tokens with declarative style expression properties on Green Core components:

```tsx
import { GdsDiv, GdsCard, GdsButton } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard borderRadius="m" padding="l">
    <h2>Card with Medium Radius</h2>
    <GdsDiv borderRadius="xs" padding="m" background="neutral-02">
      Nested container with small radius
    </GdsDiv>
    <GdsButton borderRadius="max">Pill Button</GdsButton>
  </GdsCard>
</GdsTheme>
```

### Component-Specific Radius

Many components have default radius values that can be customized:

```tsx
// Button with custom radius
<GdsButton style={{ borderRadius: 'var(--gds-sys-radius-s)' }}>
  Button
</GdsButton>

// Input with custom radius
<GdsInput style={{ borderRadius: 'var(--gds-sys-radius-xs)' }} />

// Card with large radius
<GdsCard borderRadius="xl" padding="l">
  Large radius card
</GdsCard>
```

## Common Radius Usage

### Component Defaults

| Component Type | Recommended Radius | Token |
|----------------|-------------------|-------|
| **Cards** | Medium | `m` (16px) |
| **Buttons** | Small | `xs` (8px) |
| **Inputs** | Small | `xs` (8px) |
| **Badges** | Small | `xs` (8px) |
| **Pills/Tags** | Maximum | `max` (999px) |
| **Avatars** | Maximum | `max` (999px) |
| **Modals/Dialogs** | Medium-Large | `m` to `l` (16-20px) |
| **Tooltips** | Extra Small | `3xs` to `xs` (4-8px) |
| **Images** | Small-Medium | `xs` to `m` (8-16px) |
| **Dropdowns** | Small | `xs` (8px) |

### Hierarchy and Purpose

#### Sharp Corners (`0`, `none`)
Use for:
- Tables and data grids
- Dividers
- Strict, formal interfaces
- Technical or data-heavy components

#### Subtle Radius (`3xs`, `2xs`, `xs`)
Use for:
- Buttons
- Form inputs
- Dropdowns
- Compact UI elements
- Modern, clean interfaces

#### Medium Radius (`s`, `m`, `l`)
Use for:
- Cards
- Panels
- Modals
- Container elements
- Primary content areas

#### Large Radius (`xl`, `2xl`, `3xl`, `4xl`, `5xl`)
Use for:
- Feature cards
- Hero sections
- Special highlights
- Decorative elements
- Large containers

#### Maximum Radius (`max`)
Use for:
- Pills and tags
- Avatars and profile images
- Status indicators
- Circular buttons
- Toggle switches

## Responsive Radius

While radius typically remains consistent across viewport sizes, you can adjust radius for responsive designs:

```tsx
<GdsCard 
  borderRadius="s"
  borderRadius-sm="m"
  borderRadius-md="l"
  padding="m"
>
  Card with responsive radius
</GdsCard>
```

## Best Practices

### ✓ Do

- **Use consistent radius**: Apply the same radius token to similar components
- **Consider component size**: Larger components can use larger radius values
- **Maintain hierarchy**: Use more prominent radius for primary elements
- **Test visual harmony**: Ensure radius complements spacing and typography
- **Use max for circles**: Always use `max` token for circular elements

### ✗ Don't

- **Mix arbitrary values**: Avoid custom radius values outside the token system
- **Over-round small elements**: Very small components look better with subtle radius
- **Use excessive radius**: Too much roundness can appear unprofessional
- **Ignore context**: Match radius to the overall design style and brand

## Accessibility Considerations

### Focus Indicators

Ensure focus indicators match the border-radius of the element:

```css
.my-button {
  border-radius: var(--gds-sys-radius-xs);
}

.my-button:focus-visible {
  outline: 2px solid var(--gds-color-border-interactive);
  outline-offset: 2px;
  border-radius: var(--gds-sys-radius-xs); /* Match button radius */
}
```

### Touch Targets

Border radius doesn't affect touch target size, but visual appearance should suggest the interactive area:

```tsx
// Button with adequate size and appropriate radius
<GdsButton 
  padding="s m"
  borderRadius="xs"
  style={{ minHeight: '44px', minWidth: '44px' }}
>
  Touch-friendly button
</GdsButton>
```

## Examples

### Card with Nested Elements

```tsx
import { GdsTheme, GdsCard, GdsDiv, GdsButton, GdsFlex } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard borderRadius="m" padding="l">
    <GdsDiv marginBottom="m">
      <h2>Product Card</h2>
      <p>Description of the product</p>
    </GdsDiv>
    
    <GdsDiv 
      borderRadius="xs" 
      padding="m" 
      background="neutral-02"
      marginBottom="m"
    >
      <strong>Price:</strong> $99.99
    </GdsDiv>
    
    <GdsFlex gap="s">
      <GdsButton borderRadius="xs" rank="secondary">
        Details
      </GdsButton>
      <GdsButton borderRadius="xs" rank="primary">
        Buy Now
      </GdsButton>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Profile Section with Avatar

```tsx
<GdsTheme>
  <GdsFlex gap="m" alignItems="center">
    <GdsDiv 
      width="64px" 
      height="64px"
      borderRadius="max"
      background="brand-01"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <span style={{ color: 'white', fontSize: '24px' }}>JD</span>
    </GdsDiv>
    
    <GdsDiv>
      <GdsText tag="h3" textStyle="heading-s" marginBottom="0">John Doe</GdsText>
      <GdsText tag="p" textStyle="body-book-s" marginBottom="0">john.doe@example.com</GdsText>
    </GdsDiv>
  </GdsFlex>
</GdsTheme>
```

### Tags/Pills Component

```tsx
<GdsTheme>
  <GdsFlex gap="s" flexWrap="wrap">
    <GdsDiv 
      borderRadius="max"
      padding="2xs s"
      background="positive-02"
      display="inline-flex"
    >
      <GdsText textStyle="detail-book-s" marginBottom="0">Active</GdsText>
    </GdsDiv>
    
    <GdsDiv 
      borderRadius="max"
      padding="2xs s"
      background="notice-02"
      display="inline-flex"
    >
      <GdsText textStyle="detail-book-s" marginBottom="0">Premium</GdsText>
    </GdsDiv>
    
    <GdsDiv 
      borderRadius="max"
      padding="2xs s"
      background="neutral-02"
      display="inline-flex"
    >
      <GdsText textStyle="detail-book-s" marginBottom="0">Verified</GdsText>
    </GdsDiv>
  </GdsFlex>
</GdsTheme>
```

### Form with Consistent Radius

```tsx
<GdsTheme>
  <GdsFlex direction="column" gap="l">
    <GdsInput 
      label="Email"
      type="email"
      style={{ borderRadius: 'var(--gds-sys-radius-xs)' }}
    />
    
    <GdsTextarea 
      label="Message"
      rows={4}
      style={{ borderRadius: 'var(--gds-sys-radius-xs)' }}
    />
    
    <GdsFlex gap="s" justifyContent="flex-end">
      <GdsButton 
        rank="secondary"
        borderRadius="xs"
      >
        Cancel
      </GdsButton>
      <GdsButton 
        rank="primary"
        borderRadius="xs"
      >
        Submit
      </GdsButton>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Mixed Radius Card Layout

```tsx
<GdsTheme>
  <GdsCard borderRadius="l" padding="0" overflow="hidden">
    {/* Image with no top radius (inherits from card) */}
    <GdsImg 
      src="/hero-image.jpg" 
      alt="Hero"
      style={{ borderRadius: 'var(--gds-sys-radius-l) var(--gds-sys-radius-l) 0 0' }}
    />
    
    <GdsDiv padding="l">
      <GdsText tag="h3" textStyle="heading-m" marginBottom="s">
        Featured Article
      </GdsText>
      <GdsText tag="p" textStyle="body-regular-m" marginBottom="m">
        Article description with consistent styling and proper hierarchy.
      </GdsText>
      
      <GdsButton borderRadius="xs" rank="primary">
        Read More
      </GdsButton>
    </GdsDiv>
  </GdsCard>
</GdsTheme>
```

## Related Documentation

- [Tokens](./Tokens.md) — Complete design token system including radius tokens
- [Spacing](./Spacing.md) — Spacing system using the same 4px grid foundation
- [Colors](./Colors.md) — Color system for borders and backgrounds
- [GdsCard](./GdsCard.md) — Card component with radius properties
- [GdsButton](./GdsButton.md) — Button component styling and radius
- [GdsDiv](./GdsDiv.md) — Base container with borderRadius property
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) — Style expression properties including borderRadius
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md) — Overall system design principles
