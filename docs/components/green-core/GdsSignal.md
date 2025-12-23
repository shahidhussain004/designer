# GdsSignal````markdown

# GdsSignal

A visual indicator component used to draw attention to notifications and new content. GdsSignal renders a small, circular marker that can be customized with color tokens and is commonly used as a notification badge on buttons and other interactive elements.

A short reference and usage guide for `GdsSignal` (from @sebgroup/green-core).

## Import

A Signal is used to draw attention to notifications and new content. It renders a small visual marker that inherits color tokens from button ranks/variants by default but can be customized using the `color` attribute.

```typescript

import { GdsSignal } from '@sebgroup/green-core/react'## Import

```

React JSX:

## Basic Usage

```tsx

```tsximport { GdsSignal } from '@sebgroup/green-core/react'

import { GdsSignal, GdsTheme } from '@sebgroup/green-core/react'```



<GdsTheme>Web component / other frameworks:

  <GdsSignal />

</GdsTheme>```html

```<gds-signal></gds-signal>

```

## Public API

## Purpose

### Attributes

Use `GdsSignal` when you need a compact attention indicator — e.g., as a trail element on a FAB (floating action button), or next to links/titles that have new/unseen content.

| Name | Type | Default | Description |

|------|------|---------|-------------|## Public API (selected)

| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

- isDefined: boolean — Whether the element is defined in the custom element registry. (readonly)

### Style Expression Properties- styleExpressionBaseSelector: string — Default selector used by style expressions (default: `':host'`).

- semanticVersion: string — The element's semantic version (for troubleshooting).

| Name | Type | Default | Description |- gdsElementName / `gds-element` attribute: string — The unscoped name for the element (set automatically).

|------|------|---------|-------------|

| `color` | `string` | `undefined` | Changes signal color based on variant. Accepts all content color tokens from the design system. |Events:


---

# GdsSignal

A small, decorative visual indicator used to draw attention to notifications, new content, or status on interactive elements. `GdsSignal` is typically shown as a small circular marker and is commonly used in the `trail` slot of buttons, FABs, and menu items.

## Import

```ts
import { GdsSignal } from '@sebgroup/green-core/react'
```

## Overview

`GdsSignal` is decorative by default and inherits its color from the surrounding component (for example a button's rank/variant). You can override the color using design system content color tokens (for example `positive-01`, `negative-01`, `notice-01`).

## Anatomy

1. Container — the signal element itself (small circular marker).
2. Context — the parent interactive element (button, FAB, menu button) that the signal decorates.

## Attributes / Props

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `undefined` | Use design token names to override the signal color (e.g., `notice-01`). If omitted, the signal inherits the context color. |
| `gds-element` | `string` | `undefined` | Read-only. Unscoped element name. |

The component supports the usual style expression properties and read-only diagnostic properties (`isDefined`, `semanticVersion`, etc.).

## Events

| Name | Type | Description |
|------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is removed from the DOM. |

## Examples

### Basic Signal (React)

```tsx
import { GdsTheme, GdsButton, GdsSignal } from '@sebgroup/green-core/react'

function Example() {
  return (
    <GdsTheme>
      <GdsButton>
        What's new? <GdsSignal slot="trail" />
      </GdsButton>
    </GdsTheme>
  )
}
```

### With Notification Count (visually-hidden text for screen readers)

```tsx
<GdsButton>
  Messages
  <span className="visually-hidden">3 unread</span>
  <GdsSignal slot="trail" color="notice-01" />
</GdsButton>
```

### FAB example

```tsx
<GdsFab aria-label="Create new item">
  Create <GdsSignal slot="trail" color="positive-01" />
</GdsFab>
```

### Menu button example

```tsx
<GdsMenuButton>
  Inbox <GdsSignal slot="trail" color="notice-01" />
</GdsMenuButton>
```

## Accessibility

- `GdsSignal` is decorative and does not convey semantic information to assistive technology by itself.
- If the signal indicates actionable information (e.g., unread count or required attention), provide that information as text in the accessible name or description of the parent control (visible or visually-hidden). Example: `aria-label="Notifications (3 unread)"` or include a visually-hidden count element.
- Avoid relying on color alone; pair color variants with textual context for clarity.

## Best Practices

- Use `GdsSignal` sparingly — one signal per interactive element.
- Prefer design system tokens for colors; do not apply inline custom color styles.
- Allow the signal to inherit context color unless you need a specific semantic color.

## Do's and Don'ts

Do
- Use `GdsSignal` to draw attention to new content, unread items, or status on interactive controls.
- Provide accessible text that communicates the meaning behind the signal.

Don't
- Don't rely on `GdsSignal` as the only way to communicate important information.
- Don't place multiple signals on the same element; prefer a single clear indicator.

## Related components

- `GdsFab`, `GdsButton`, `GdsMenuButton` — common parents for `GdsSignal`.
- `GdsBadge` — use when you need visible numeric counts with semantic meaning.


### Button Group with Status Indicators

```tsx
import { GdsSignal, GdsTheme, GdsFlex, GdsButton } from '@sebgroup/green-core/react'

function StatusButtons() {
  return (
    <GdsTheme>
      <GdsFlex gap="m">
        <GdsButton rank="secondary">
          Pending <GdsSignal slot="trail" color="notice-01" />
        </GdsButton>
        
        <GdsButton rank="secondary">
          Completed <GdsSignal slot="trail" color="positive-01" />
        </GdsButton>
        
        <GdsButton rank="secondary">
          Failed <GdsSignal slot="trail" color="negative-01" />
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Conditional Signal Display

```tsx
import { GdsSignal, GdsTheme, GdsButton } from '@sebgroup/green-core/react'
import { useState } from 'react'

function NotificationButton() {
  const [hasNotifications, setHasNotifications] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

  const handleClick = () => {
    setHasNotifications(false)
    setNotificationCount(0)
  }

  return (
    <GdsTheme>
      <GdsButton 
        onClick={handleClick}
        aria-label={`Notifications${hasNotifications ? ` (${notificationCount} unread)` : ''}`}
      >
        Notifications
        {hasNotifications && <GdsSignal slot="trail" color="notice-01" />}
      </GdsButton>
    </GdsTheme>
  )
}
```

### Different Color States

```tsx
import { GdsSignal, GdsTheme, GdsFlex, GdsCard, GdsText } from '@sebgroup/green-core/react'

function ColorStates() {
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsCard padding="m">
          <GdsFlex gap="m" align-items="center">
            <GdsSignal />
            <GdsText>Default - Matches component context</GdsText>
          </GdsFlex>
        </GdsCard>
        
        <GdsCard padding="m">
          <GdsFlex gap="m" align-items="center">
            <GdsSignal color="positive-01" />
            <GdsText>Positive - Success, completed, verified</GdsText>
          </GdsFlex>
        </GdsCard>
        
        <GdsCard padding="m">
          <GdsFlex gap="m" align-items="center">
            <GdsSignal color="negative-01" />
            <GdsText>Negative - Error, failed, critical</GdsText>
          </GdsFlex>
        </GdsCard>
        
        <GdsCard padding="m">
          <GdsFlex gap="m" align-items="center">
            <GdsSignal color="notice-01" />
            <GdsText>Notice - Info, update, attention needed</GdsText>
          </GdsFlex>
        </GdsCard>
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Related Components

- [GdsFab](./GdsFab.md) — Floating action button that commonly uses signal for notifications
- [GdsButton](./GdsButton.md) — Button component with trail/lead slots for signals
- [GdsMenuButton](./GdsMenuButton.md) — Menu button component with signal support
- [GdsBadge](./GdsBadge.md) — Badge component for displaying counts and labels
- [GdsAlert](./GdsAlert.md) — Alert component for notifications
- [GdsFlex](./GdsFlex.md) — Layout component for signal arrangements
- [GdsTheme](./GdsTheme.md) — Theme context for color system

## Notes

- **Decorative Only**: GdsSignal is purely decorative and doesn't carry semantic meaning for screen readers
- **Accessibility**: Always provide accessible text alternatives (aria-label, visually-hidden text, etc.)
- **Color Tokens**: Use design system color tokens from the Color System documentation (seb.io/studio/colors)
- **Default Behavior**: When no color is specified, signal inherits color from surrounding component context (button rank/variant)
- **Common Usage**: Most commonly used in trail slot of buttons, FABs, and menu buttons
- **Size**: Automatically sizes appropriately for its context
- **Spacing**: Built-in spacing when used in component slots
- **Semantic Colors**:
  - Default: Matches component context
  - `positive-01`: Success, completed, verified states
  - `negative-01`: Errors, failures, critical alerts
  - `notice-01`: Information, updates, attention needed
  - `information-01`: General information
- **Best Practices**: Use sparingly - one signal per component, supplement with accessible text, use semantic colors
- **Avoid Custom Styling**: Use design tokens, don't override size or spacing
- **Event Tracking**: Use `gds-element-disconnected` event to track when signal is removed

---

*Last updated: November 12, 2025*  
*Source: [GdsSignal Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-signal--docs)*
