# Tokens

Green Design System uses a token-based approach to design. Tokens (also referred to as variables in some contexts) are central design values — colors, spacing, typography, shadows, and breakpoints — defined in a single place and referenced across components.

## Token Collections

- **Colors**: Three-level color system. See [Colors](./Colors.md) for complete palette and guidelines
- **Text (Typography)**: Type scale from 82px to 12px with five style roles. See [Typography](./Typography.md) for complete font styles and usage
- **Spacing**: 4px grid system with tokens from 0px to 120px. See [Spacing](./Spacing.md) for complete scale and usage guidelines
- **Radius**: Corner radius tokens from 0px to 999px. See [Radius](./Radius.md) for complete scale and usage guidelines
- **Viewports**: Breakpoint tokens used by the responsive system. See [Viewport](./Viewport.md)
- **Shadows**: Box-shadow token definitions. See [Shadows](./Shadows.md)
- **Motion**: Motion tokens (easing & duration). See [Motion](./Motion.md)
- **Accessibility**: Accessibility guidance and checklist. See [Accessibility](./Accessibility.md)

## Tokens vs Variables

- **Token**: The abstract design concept (e.g., `space-m`).
- **Variable**: The concrete implementation in code (e.g., `--gds-sys-space-m`).

The tokens are exposed as CSS custom properties (variables) for use in styles and components.

## Using Tokens in CSS

Access tokens via the CSS `var()` function. Tokens are defined on the `:host` of components and propagate into descendants.

If your element is a child of a Green layout component (e.g., `gds-div`, `gds-grid`, `gds-flex`, `gds-card`), the tokens will already be available. If not, wrap your content in a `gds-theme` element to expose token variables to descendants.

### Example

```html
<gds-theme design-version="2023">
  <div style="background-color: var(--gds-sys-color-l2-neutral-02); color: var(--gds-sys-color-content-neutral-01); padding: var(--gds-sys-space-l);">
    Hello world
  </div>
</gds-theme>
```

Try changing `color-scheme` on `gds-theme` to `dark` to see token variations for dark mode.

## When to use tokens directly

- Rarely required for most layout tasks (use Declarative Layout where possible).
- Use tokens directly when creating custom components or when a specific style must be defined in CSS that does not map cleanly to SEPs.

## Related docs

- [Colors](./Colors.md) — Complete color palette and usage guidelines
- [Spacing](./Spacing.md) — Complete spacing system and layout guidelines
- [Radius](./Radius.md) — Complete radius system and corner roundness guidelines
- [Typography](./Typography.md) — Complete typography system and text hierarchy
- [GdsTheme](./GdsTheme.md)
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md)
- [Green Design System Architecture](./GreenDesignSystemArchitecture.md)
- Colors / Typography / Spacing references on https://seb.io/primitives
