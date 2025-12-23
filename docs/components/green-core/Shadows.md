# Shadows

Elevation and shadow styles define depth and layering across the interface. Shadows communicate elevation, hierarchy, and interactivity. Use the tokens below to maintain consistent elevation across components.

## Overview

Shadows in the Green Design System provide a limited, consistent set of elevation tokens. Each token represents an elevation level and should be applied according to component importance and context.

## Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `xs` | `xs` | Very subtle elevation — thin shadow for small lifted elements |
| `s`  | `s`  | Small elevation — slightly more pronounced |
| `m`  | `m`  | Medium elevation — default for many cards and overlays |
| `l`  | `l`  | Large elevation — for stronger separation |
| `xl` | `xl` | Extra large elevation — for prominent overlays |
| `2xl`| `2xl`| Maximum elevation — for top-most overlays like modals |

> Note: The token values above are symbolic names that map to concrete CSS `box-shadow` values in implementation layers (CSS variables or design tokens). Concrete shadow values depend on platform (web, native) and should be defined in the design token implementation.

## Using Shadows

### Via CSS Variables

```css
.my-card {
  box-shadow: var(--gds-sys-shadow-m);
}

.modal {
  box-shadow: var(--gds-sys-shadow-2xl);
}
```

### Declarative Usage (Style Expression Properties)

```tsx
<GdsCard shadow="m" padding="l" borderRadius="m">
  Content with medium elevation
</GdsCard>

<GdsDiv shadow="xs">Subtle lifted element</GdsDiv>
```

## Recommended Usage

- **xs**: Small icons, micro tooltips, and subtle lifts near content
- **s**: Small controls like menus and popovers
- **m**: Standard cards, dropdowns, and floating toolbars
- **l**: Prominent panels and elevated containers
- **xl / 2xl**: Modals, dialogs, and global overlays

## Accessibility

Shadows are decorative and do not impact keyboard or screen reader interaction. Ensure that shadows do not reduce contrast for important content. When using large shadows, verify that the elevated element still has sufficient contrast against the background.

## Examples

```tsx
<GdsCard shadow="m" padding="l">
  <h3>Product</h3>
</GdsCard>

<GdsDiv shadow="l" padding="m">Prominent panel</GdsDiv>
```

## Related Documentation

- [Tokens](./Tokens.md)
- [Radius](./Radius.md)
- [Spacing](./Spacing.md)
- [GdsCard](./GdsCard.md)
- [GdsPopover](./GdsPopover.md)
- [GdsTheme](./GdsTheme.md)
