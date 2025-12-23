# Spacing

Spacing is a fundamental tool for structuring layouts. In Green, we use spacing to create hierarchy, balance, and visual rhythm, making interfaces feel intentional and easy to navigate.

## Designing with Space

Good spacing helps distinguish elements, making interactions more intuitive. Too little space creates clutter, while too much can weaken relationships between components.

Thoughtful spacing enhances readability and usability, ensuring every element has room to breathe.

## White Space Philosophy

White space isn't empty space—it's an active part of the design. It improves focus, increases legibility, and makes interfaces feel more open and approachable.

## Spacing System

Green uses space tokens based on a **4px grid system**. This scale applies to:
- **Margin** - Space outside elements
- **Padding** - Space inside elements
- **Gap** - Space between flex/grid items
- **Radius** - Border radius values
- **All spacing values** - Consistent measurement across the system

When designing layouts, spacing values range from **1px to 120px**, providing flexibility while maintaining consistency.

## Spacing Tokens

The spacing system uses a progressive scale with named tokens for easy reference and consistent application.

| Token | Value | Description |
|-------|-------|-------------|
| `0` | `0px` | No spacing |
| `5xs` | `1px` | Minimum spacing for fine details |
| `4xs` | `2px` | Very tight spacing |
| `3xs` | `4px` | Extra small spacing, grid baseline |
| `2xs` | `6px` | Compact spacing |
| `xs` | `8px` | Small spacing |
| `s` | `12px` | Small-medium spacing |
| `m` | `16px` | Medium spacing (default) |
| `l` | `20px` | Large spacing |
| `xl` | `24px` | Extra large spacing |
| `2xl` | `32px` | 2× extra large |
| `3xl` | `40px` | 3× extra large |
| `4xl` | `48px` | 4× extra large |
| `5xl` | `64px` | 5× extra large |
| `6xl` | `80px` | 6× extra large |
| `7xl` | `96px` | 7× extra large |
| `8xl` | `112px` | 8× extra large |
| `9xl` | `120px` | Maximum standard spacing |
| `max` | `999px` | Maximum spacing value |

## Using Spacing Tokens

### Via CSS Custom Properties

Access spacing tokens via CSS `var()` function:

```css
.my-component {
  padding: var(--gds-sys-space-m);
  margin-bottom: var(--gds-sys-space-xl);
  gap: var(--gds-sys-space-s);
  border-radius: var(--gds-sys-space-xs);
}
```

### Via Style Expression Properties

Use spacing tokens with declarative style expression properties on Green Core components:

```tsx
import { GdsDiv, GdsCard, GdsFlex } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsDiv padding="m" marginBottom="xl">
    <GdsCard padding="l">
      <h2>Card Title</h2>
      <GdsFlex gap="s" direction="column">
        <p>Card content with consistent spacing</p>
        <GdsButton>Action</GdsButton>
      </GdsFlex>
    </GdsCard>
  </GdsDiv>
</GdsTheme>
```

### Responsive Spacing

Use viewport-specific spacing tokens for responsive layouts:

```tsx
<GdsDiv 
  padding="s"
  padding-sm="m"
  padding-md="l"
  padding-lg="xl"
>
  Responsive padding that increases with viewport size
</GdsDiv>
```

## Spacing Guidelines

### Hierarchy Through Spacing

Use spacing to establish visual hierarchy:

- **Related elements**: Use smaller spacing (`xs`, `s`, `m`) to group related items
- **Sections**: Use medium spacing (`l`, `xl`, `2xl`) to separate distinct sections
- **Major divisions**: Use larger spacing (`3xl`, `4xl`, `5xl+`) for major layout divisions

### Common Patterns

#### Component Internal Spacing

```tsx
// Button padding
<GdsButton style={{ padding: 'var(--gds-sys-space-s) var(--gds-sys-space-m)' }}>
  Button Text
</GdsButton>

// Card padding
<GdsCard padding="l">
  Card Content
</GdsCard>
```

#### Layout Spacing

```tsx
// Stack items with consistent gap
<GdsFlex direction="column" gap="m">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</GdsFlex>

// Grid with responsive gap
<GdsGrid columns="3" gap="l" gap-sm="xl">
  <div>Grid Item 1</div>
  <div>Grid Item 2</div>
  <div>Grid Item 3</div>
</GdsGrid>
```

#### Section Spacing

```tsx
// Major page sections
<GdsDiv>
  <section style={{ marginBottom: 'var(--gds-sys-space-5xl)' }}>
    <h2>Section 1</h2>
    <p>Content...</p>
  </section>
  
  <section style={{ marginBottom: 'var(--gds-sys-space-5xl)' }}>
    <h2>Section 2</h2>
    <p>Content...</p>
  </section>
</GdsDiv>
```

## 4px Grid System

The spacing system is based on a **4px grid**. This provides:

1. **Consistency**: All spacing is predictable and aligned
2. **Flexibility**: Fine-grained control from 1px to 120px
3. **Harmony**: Visual rhythm across all components
4. **Accessibility**: Adequate touch targets and readable layouts

### Grid Alignment

Most spacing values are multiples of 4px:
- `3xs` = 4px (1× grid)
- `xs` = 8px (2× grid)
- `m` = 16px (4× grid)
- `xl` = 24px (6× grid)
- `3xl` = 40px (10× grid)

Exceptions (`5xs`, `4xs`, `2xs`, `s`, `l`) provide additional flexibility for specific use cases while maintaining visual consistency.

## Best Practices

### ✓ Do

- **Use tokens**: Always use spacing tokens instead of arbitrary values
- **Maintain consistency**: Use the same spacing token for similar relationships
- **Consider hierarchy**: Larger spacing for major divisions, smaller for related items
- **Test responsively**: Adjust spacing for different viewport sizes
- **Group related items**: Use smaller gaps between related elements

### ✗ Don't

- **Avoid arbitrary values**: Don't use spacing values outside the token system
- **Don't over-space**: Too much spacing weakens relationships
- **Don't under-space**: Too little spacing creates clutter
- **Avoid mixing patterns**: Be consistent with spacing choices across similar layouts

## Accessibility Considerations

### Touch Targets

Ensure interactive elements have adequate spacing:
- Minimum touch target size: **44×44px** (WCAG guideline)
- Use `padding="m"` or larger for buttons and clickable areas
- Provide sufficient gap between interactive elements: `gap="s"` minimum

### Readability

Proper spacing improves readability:
- Line spacing (leading) for text blocks
- Adequate margins around paragraphs: `marginBottom="m"` or `marginBottom="l"`
- White space around headings to create clear visual breaks

## Examples

### Card Layout with Proper Spacing

```tsx
import { GdsTheme, GdsCard, GdsFlex, GdsButton, GdsText } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsCard padding="l" marginBottom="xl">
    <GdsFlex direction="column" gap="m">
      <GdsText tag="h2" marginBottom="0">Card Title</GdsText>
      <GdsText tag="p" marginBottom="0">
        Card description with proper spacing between elements.
      </GdsText>
      <GdsFlex gap="s" justifyContent="flex-end">
        <GdsButton rank="secondary">Cancel</GdsButton>
        <GdsButton rank="primary">Confirm</GdsButton>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Form Layout with Spacing

```tsx
<GdsTheme>
  <GdsFlex direction="column" gap="l">
    <GdsInput label="First Name" />
    <GdsInput label="Last Name" />
    <GdsInput label="Email" type="email" />
    
    <GdsFlex gap="s" justifyContent="flex-end" marginTop="xl">
      <GdsButton rank="secondary">Cancel</GdsButton>
      <GdsButton rank="primary" type="submit">Submit</GdsButton>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Page Layout with Section Spacing

```tsx
<GdsTheme>
  <GdsDiv padding="2xl">
    <section style={{ marginBottom: 'var(--gds-sys-space-5xl)' }}>
      <GdsText tag="h1" marginBottom="l">Page Title</GdsText>
      <GdsText tag="p">Introduction paragraph</GdsText>
    </section>
    
    <section style={{ marginBottom: 'var(--gds-sys-space-4xl)' }}>
      <GdsText tag="h2" marginBottom="m">Section Title</GdsText>
      <GdsGrid columns="3" gap="l">
        <GdsCard padding="l">Card 1</GdsCard>
        <GdsCard padding="l">Card 2</GdsCard>
        <GdsCard padding="l">Card 3</GdsCard>
      </GdsGrid>
    </section>
  </GdsDiv>
</GdsTheme>
```

## Related Documentation

- [Tokens](./Tokens.md) — Complete design token system including colors and typography
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md) — Style expression properties for spacing
- [GdsDiv](./GdsDiv.md) — Base container with all spacing properties
- [GdsFlex](./GdsFlex.md) — Flex layout with gap property
- [GdsGrid](./GdsGrid.md) — Grid layout with gap property
- [GdsCard](./GdsCard.md) — Card component with padding property
- [Colors](./Colors.md) — Color system and usage guidelines
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md) — Overall system design principles
