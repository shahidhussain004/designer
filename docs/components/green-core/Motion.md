# Motion

Animation and transition tokens used throughout the Green Design System. Motion tokens standardize easing curves and durations to create consistent, pleasant motion across components.

## Easing Tokens

These tokens map to cubic-bezier curves for CSS animations and transitions.

| Token | Value | Description |
|-------|-------|-------------|
| `ease-in` | `cubic-bezier(0.64, 0, 0.78, 0)` | Accelerating from zero velocity |
| `ease-in-out` | `cubic-bezier(0.83, 0, 0.17, 1)` | Smooth acceleration and deceleration |
| `ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Decelerating to zero velocity |
| `linear` | `cubic-bezier(0, 0, 1, 1)` | Linear timing function |

## Duration Tokens

| Token | Value | Description |
|-------|-------|-------------|
| `fastest` | `0.2s` | Very quick interactions (micro-interactions) |
| `fast` | `0.4s` | Quick transitions (menus, simple reveals) |
| `default` | `0.5s` | Standard duration for larger transitions |
| `slow` | `1s` | Slower transitions for emphasis |
| `slowest` | `1.5s` | Long, attention-grabbing transitions |

## Using Motion Tokens

### CSS Variables

```css
.modal {
  transition: transform var(--gds-motion-duration-default) var(--gds-motion-easing-ease-in-out);
}

.tooltip {
  transition: opacity var(--gds-motion-duration-fast) var(--gds-motion-easing-ease-out);
}
```

### Declarative Usage

```tsx
<GdsDiv transitionDuration="fast" transitionEasing="ease-out">Content</GdsDiv>
```

## Best Practices

- Use motion sparingly and purposefully to avoid distraction.
- Prefer shorter durations for micro-interactions and longer durations for major state changes.
- Respect user preferences for reduced motion (`prefers-reduced-motion`) and provide alternatives when appropriate.

### Reduced Motion Example

```css
@media (prefers-reduced-motion: reduce) {
  .animated {
    transition: none !important;
    animation: none !important;
  }
}
```

## Related Documentation

- [Tokens](./Tokens.md)
- [Green Core Declarative Layout](./GreenCoreDeclarativeLayout.md)
- [GdsPopover](./GdsPopover.md)
- [GdsTheme](./GdsTheme.md)
