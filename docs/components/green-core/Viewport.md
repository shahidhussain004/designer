# Viewport

Responsive design breakpoints used by the Green Design System. These tokens provide canonical viewport widths for responsive rules, component behavior, and layout changes.

## Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `0`   | `0px`  | Minimal viewport (mobile down to 0) |
| `2xs` | `320px`| Small phones / very narrow screens |
| `xs`  | `425px`| Phones and narrow devices |
| `s`   | `768px`| Small tablets / large phones (portrait) |
| `m`   | `1024px`| Tablets / small desktops (landscape) |
| `l`   | `1280px`| Desktop standard width |
| `xl`  | `1440px`| Large desktop / HD screens |
| `2xl` | `2560px`| Very large screens / 4K contexts |
| `3xl` | `3840px`| Ultra-wide / 4K+ contexts |
| `4xl` | `4320px`| Higher-res wide displays |
| `5xl` | `6016px`| Specialty high-resolution displays |
| `6xl` | `7680px`| Extreme-resolution displays |

## Usage

These viewport tokens map to media queries used by components and layout primitives. Use them when creating responsive variants or when configuring style expression properties that accept breakpoint suffixes.

### Example (CSS)

```css
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Example (Style Expression Properties)

```tsx
<GdsDiv padding="s" padding-md="l" gap="s" gap-md="l">
  Responsive container
</GdsDiv>
```

## Notes

- The breakpoint names are intentionally generous to allow future expansion.
- `0` is useful for default/mobile-first fallbacks.
- Breakpoint usage should be consistent across components to avoid visual jank when transitioning between breakpoints.

## Related Documentation

- [Tokens](./Tokens.md)
- [Spacing](./Spacing.md)
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md)
- [GdsGrid](./GdsGrid.md)
- [GdsFlex](./GdsFlex.md)
