# GdsFab

Floating action button persists across screens for constant access to features that needs to be accessible at all times.

## Overview

The GdsFab (Floating Action Button) component provides a persistent, always-visible button that floats in the user's viewport, typically in the lower right corner. This button provides constant access to important features or actions that need to be accessible at all times.

Use GdsFab for:
- **Primary actions** that users need quick access to across multiple screens
- **Chat/support features** that should always be available
- **Quick actions** like "Add new item" or "Create"
- **Notification indicators** with signal badges

The FAB is always positioned fixed in the viewport, making it accessible regardless of scroll position.

## Import

```tsx
// Use as JSX element in React
import { GdsFab } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsFab>See what's new!</GdsFab>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `type` | `HTMLButtonElement['type']` | `undefined` | Button type (`button`, `submit`, `reset`) |
| `rank` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual hierarchy rank |
| `variant` | `'' \| 'brand' \| 'neutral' \| 'positive' \| 'negative' \| 'notice' \| 'warning'` | `'neutral'` | Semantic variant |
| `size` | `'xs' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `label` | `string` | `''` | Accessible label when no text in default slot |
| `href` | `string` | `''` | When set, renders as anchor element |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | `undefined` | Where to open linked URL (with `href`) |
| `rel` | `string` | `undefined` | Link relationship (defaults to `"noreferrer noopener"` when `target` is set) |
| `download` | `string` | `undefined` | Treats linked URL as download (with `href`) |
| `required` | `boolean` | `false` | Marks as required for assistive technology |
| `invalid` | `boolean` | `false` | Sets validation state to invalid |
| `value` | `any` | - | Value of the form control |
| `aria-invalid` | `boolean` | - | Validation state (use `invalid` instead) |
| `error-message` | `string` | `''` | Custom error message for validation |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `formAssociated` | `boolean` | Whether element is form-associated (true) |
| `validator` | `GdsValidator` | Custom validator for form validation |
| `errorMessage` | `string` | Custom error message |
| `form` | `HTMLFormElement` | Associated form element |
| `validity` | `ValidityState` | Validity state |
| `validationMessage` | `string` | Validation message |
| `willValidate` | `boolean` | Whether element will be validated |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `position` | Controls position property. Supports all CSS position values (default: `fixed`) |
| `transform` | Controls transform property. Supports all CSS transform values |
| `inset` | Controls inset property (shorthand for top/right/bottom/left). Use for positioning |
| `width` | Controls width. Supports space tokens and CSS values |
| `min-width` | Controls min-width. Supports space tokens and CSS values |
| `max-width` | Controls max-width. Supports space tokens and CSS values |
| `inline-size` | Controls inline-size. Supports space tokens and CSS values |
| `min-inline-size` | Controls min-inline-size. Supports space tokens and CSS values |
| `max-inline-size` | Controls max-inline-size. Supports space tokens and CSS values |
| `margin` | Controls margin. Only accepts space tokens |
| `margin-inline` | Controls margin-inline. Only accepts space tokens |
| `margin-block` | Controls margin-block. Only accepts space tokens |
| `align-self` | Controls align-self. Supports all CSS values |
| `justify-self` | Controls justify-self. Supports all CSS values |
| `place-self` | Controls place-self. Supports all CSS values |
| `grid-column` | Controls grid-column. Supports all CSS values |
| `grid-row` | Controls grid-row. Supports all CSS values |
| `grid-area` | Controls grid-area. Supports all CSS values |
| `flex` | Controls flex property. Supports all CSS values |
| `order` | Controls order property. Supports all CSS values |
| `justify-content` | Spreads the contents of the button |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `click` | `MouseEvent` | Fired when the button is clicked |
| `gds-validity-state` | `CustomEvent` | Fired when validation state changes |
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

### Slots

| Slot | Description |
|------|-------------|
| `lead` | Icon or content before the label (use `gds-icon-[name]`) |
| `trail` | Icon or content after the label (use `gds-icon-[name]` or `gds-signal`) |
| (default) | Button text or icon content |

## Examples

### Basic FAB

```tsx
<GdsTheme>
  <GdsFab>See what's new!</GdsFab>
</GdsTheme>
```

### With Signal Badge

```tsx
import { GdsSignal } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFab>
    See what's new!
    <GdsSignal slot="trail" />
  </GdsFab>
</GdsTheme>
```

### Icon-Only FAB

```tsx
import { IconBubbles } from '@sebgroup/green-core/icons'

<GdsTheme>
  <GdsFab label="Chat with us">
    <IconBubbles />
  </GdsFab>
</GdsTheme>
```

### Button Ranks

```tsx
<GdsTheme>
  <GdsFlex height="600px">
    <GdsFab inset="auto 100px 300px auto">
      Primary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    <GdsFab inset="auto 100px 200px auto" rank="secondary">
      Secondary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    <GdsFab inset="auto 100px 100px auto" rank="tertiary">
      Tertiary
      <GdsSignal slot="trail" />
    </GdsFab>
  </GdsFlex>
</GdsTheme>
```

### Semantic Variants

```tsx
<GdsTheme>
  <GdsFlex height="600px">
    {/* Positive variant */}
    <GdsFab inset="auto 300px 300px auto" variant="positive">
      Primary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    <GdsFab inset="auto 300px 200px auto" variant="positive" rank="secondary">
      Secondary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    <GdsFab inset="auto 300px 100px auto" variant="positive" rank="tertiary">
      Tertiary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    {/* Negative variant */}
    <GdsFab inset="auto 500px 300px auto" variant="negative">
      Primary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    <GdsFab inset="auto 500px 200px auto" variant="negative" rank="secondary">
      Secondary
      <GdsSignal slot="trail" />
    </GdsFab>
    
    <GdsFab inset="auto 500px 100px auto" variant="negative" rank="tertiary">
      Tertiary
      <GdsSignal slot="trail" />
    </GdsFab>
  </GdsFlex>
</GdsTheme>
```

### Icon Buttons with Variants

```tsx
<GdsTheme>
  <GdsFlex height="600px">
    {/* Default */}
    <GdsFab inset="auto 100px 300px auto" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 100px 200px auto" rank="secondary" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 100px 100px auto" rank="tertiary" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    {/* Positive */}
    <GdsFab inset="auto 300px 300px auto" size="medium" variant="positive" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 300px 200px auto" size="medium" variant="positive" rank="secondary" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 300px 100px auto" size="medium" variant="positive" rank="tertiary" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    {/* Negative - Small size */}
    <GdsFab inset="auto 500px 300px auto" size="small" variant="negative" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 500px 200px auto" size="small" variant="negative" rank="secondary" label="Chat">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 500px 100px auto" size="small" variant="negative" rank="tertiary" label="Chat">
      <IconBubbles />
    </GdsFab>
  </GdsFlex>
</GdsTheme>
```

### Custom Signal Color

```tsx
<GdsTheme>
  <GdsFlex height="300px">
    <GdsFab inset="auto 48px 48px auto" rank="secondary" variant="positive">
      Secondary
      <GdsSignal slot="trail" level="3" color="positive-01" />
    </GdsFab>
  </GdsFlex>
</GdsTheme>
```

### Positioning with Inset

The `inset` property controls the FAB's position using CSS inset values (top, right, bottom, left):

```tsx
<GdsTheme>
  {/* Bottom right corner (typical placement) */}
  <GdsFab inset="auto 48px 48px auto">
    I'm a FAB
  </GdsFab>
  
  {/* Bottom left corner */}
  <GdsFab inset="auto auto 48px 48px">
    Bottom left
  </GdsFab>
  
  {/* Top right corner */}
  <GdsFab inset="48px 48px auto auto">
    Top right
  </GdsFab>
</GdsTheme>
```

### Custom Position Property

```tsx
<GdsTheme>
  <GdsFlex height="300px">
    <GdsFab inset="auto 48px 48px auto" position="absolute">
      Absolute Position
    </GdsFab>
  </GdsFlex>
</GdsTheme>
```

### Z-Index and Scrollable Content

The FAB has a default z-index of 1050 to stay above other content:

```tsx
<GdsTheme>
  <GdsFlex 
    height="400px" 
    flex-direction="column" 
    gap="4xl" 
    padding="0" 
    overflow="hidden scroll" 
    border-radius="s"
  >
    <GdsFab inset="auto 40px 40px auto">
      Show above other things
    </GdsFab>
    
    <GdsDiv border-radius="s" width="100%" height="max-content" background="notice" padding="4xl">
      <GdsFlex gap="xl">
        <GdsFlex flex-direction="column" gap="xl" flex="1" align-items="flex-start" padding="m 0 0 0">
          <GdsText tag="h1">Title example</GdsText>
          <GdsText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </GdsText>
          <GdsLink href="#" variant="secondary">
            <IconCreditCard /> Click me!
          </GdsLink>
        </GdsFlex>
        <GdsCard variant="secondary" flex="1" height="300px" />
      </GdsFlex>
    </GdsDiv>
    
    {/* More scrollable content */}
    <GdsDiv border-radius="s" width="100%" height="max-content" background="notice" padding="4xl">
      <GdsFlex gap="xl">
        <GdsFlex flex-direction="column" gap="xl" flex="1" align-items="flex-start" padding="m 0 0 0">
          <GdsText tag="h1">Title example</GdsText>
          <GdsText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </GdsText>
        </GdsFlex>
        <GdsCard variant="secondary" flex="1" height="300px" />
      </GdsFlex>
    </GdsDiv>
  </GdsFlex>
</GdsTheme>
```

### With Click Handler

```tsx
import { useState } from 'react'

function NotificationFab() {
  const [count, setCount] = useState(3)
  
  const handleClick = () => {
    console.log('FAB clicked!')
    setCount(0)
  }
  
  return (
    <GdsTheme>
      <GdsFab onClick={handleClick}>
        Notifications
        {count > 0 && <GdsSignal slot="trail" />}
      </GdsFab>
    </GdsTheme>
  )
}
```

### As Link

```tsx
<GdsTheme>
  <GdsFab href="/help" target="_blank">
    Get Help
  </GdsFab>
</GdsTheme>
```

### Different Sizes

```tsx
<GdsTheme>
  <GdsFlex height="400px">
    <GdsFab inset="auto 300px 100px auto" size="xs" label="Extra small">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 200px 100px auto" size="small" label="Small">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 100px 100px auto" size="medium" label="Medium">
      <IconBubbles />
    </GdsFab>
    
    <GdsFab inset="auto 0px 100px auto" size="large" label="Large">
      <IconBubbles />
    </GdsFab>
  </GdsFlex>
</GdsTheme>
```

### Disabled State

```tsx
<GdsTheme>
  <GdsFab disabled>
    Disabled FAB
  </GdsFab>
</GdsTheme>
```

### Chat/Support FAB

```tsx
<GdsTheme>
  <GdsFab variant="positive" label="Chat with support">
    <IconBubbles />
    <GdsSignal slot="trail" />
  </GdsFab>
</GdsTheme>
```

### Add/Create FAB

```tsx
import { IconPlus } from '@sebgroup/green-core/icons'

<GdsTheme>
  <GdsFab variant="positive" label="Add new item">
    <IconPlus />
  </GdsFab>
</GdsTheme>
```

### Notification FAB

```tsx
import { IconBell } from '@sebgroup/green-core/icons'

<GdsTheme>
  <GdsFab label="Notifications">
    <IconBell />
    <GdsSignal slot="trail" />
  </GdsFab>
</GdsTheme>
```

## Best Practices

### Placement
- **Default position**: Bottom right corner (`inset="auto 48px 48px auto"`)
- Use consistent placement across your application
- Ensure FAB doesn't obscure important content
- Consider mobile viewport constraints
- Maintain adequate spacing from screen edges (typically 48px)

### Usage Guidelines
- **Use sparingly**: Only one FAB per screen
- **Primary actions only**: Reserve for most important actions
- **Always visible**: Should persist across scrolling
- **Clear purpose**: Action should be obvious from label/icon
- **Avoid overuse**: Not every screen needs a FAB

### When to Use FAB
- ✅ Chat/support features
- ✅ Create/add new items
- ✅ Quick actions needed across multiple screens
- ✅ Notifications or updates
- ❌ Navigation (use navigation components instead)
- ❌ Multiple actions (consider a menu instead)
- ❌ Low-priority actions

### Accessibility
- **Always provide `label`**: Especially for icon-only FABs
- Use semantic `variant` values appropriately
- Ensure sufficient color contrast
- Make FAB large enough for touch targets (minimum 44x44px)
- Provide clear focus indicators

### Icons and Signals
- Use clear, recognizable icons
- Add `GdsSignal` to indicate new content or notifications
- Signal color should match button rank and variant by default
- Use `slot="trail"` for icons/signals after text
- Icon-only FABs should have a descriptive `label`

### Z-Index Management
- Default z-index is 1050 (stays above most content)
- Only override if necessary
- Use CSS or wrap in container with higher z-index if needed
- Test with modals and other overlay components

### Positioning
- Use `inset` property for precise positioning
- Format: `inset="top right bottom left"` (use `auto` for unset sides)
- Default position is `fixed` (stays in viewport)
- Use `position="absolute"` if needed within a positioned container

## Common Patterns

### Bottom Right FAB (Standard)
```tsx
<GdsFab inset="auto 48px 48px auto">Action</GdsFab>
```

### Chat Support FAB
```tsx
<GdsFab variant="positive" label="Chat">
  <IconBubbles />
  <GdsSignal slot="trail" />
</GdsFab>
```

### Add/Create FAB
```tsx
<GdsFab variant="positive" label="Add new">
  <IconPlus />
</GdsFab>
```

### Notification FAB with Badge
```tsx
<GdsFab label="Notifications">
  <IconBell />
  {hasNotifications && <GdsSignal slot="trail" />}
</GdsFab>
```

## TypeScript Types

```tsx
import type { GdsFab } from '@sebgroup/green-core/react'

// Button rank
type FabRank = 'primary' | 'secondary' | 'tertiary'

// Button variant
type FabVariant = '' | 'brand' | 'neutral' | 'positive' | 'negative' | 'notice' | 'warning'

// Button size
type FabSize = 'xs' | 'small' | 'medium' | 'large'

// Component props type
interface GdsFabProps extends React.HTMLAttributes<HTMLElement> {
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  rank?: FabRank
  variant?: FabVariant
  size?: FabSize
  label?: string
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top'
  rel?: string
  download?: string
  required?: boolean
  invalid?: boolean
  value?: any
  'error-message'?: string
  
  // Style expression properties
  position?: string
  transform?: string
  inset?: string
  width?: string
  'min-width'?: string
  'max-width'?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  'justify-content'?: string
  
  // Events
  onClick?: (event: MouseEvent) => void
  'onGds-validity-state'?: (event: CustomEvent) => void
}
```

## Related Components

- [GdsButton](./GdsButton.md) — Standard button component (GdsFab extends this)
- [GdsSignal](./GdsSignal.md) — For notification badges on FAB
- [Icons](./Icons.md) — For icon-only FABs
- [GdsDialog](./GdsDialog.md) — For actions triggered by FAB
- [GdsPopover](./GdsPopover.md) — For menus attached to FAB
- [GdsContextMenu](./GdsContextMenu.md) — For multiple actions from FAB

## Accessibility

- **Label Requirement**: Always provide `label` attribute for icon-only FABs
- **Keyboard Navigation**: Fully keyboard accessible (Tab, Enter, Space)
- **Focus Indicators**: Clear focus state for keyboard users
- **Screen Readers**: Announced as button with label and role
- **Touch Targets**: Minimum 44x44px for touch accessibility
- **Color Contrast**: Meets WCAG AA standards for all variants
- **Disabled State**: Communicated to assistive technology
- **Link Semantics**: Properly announced when `href` is used

## Notes

- GdsFab extends GdsButton with fixed positioning
- Default z-index is 1050 to stay above content
- Only use one FAB per screen/page
- FAB persists in viewport regardless of scroll position
- Default position is `fixed` in bottom right corner
- Use `inset` property for precise positioning (format: `top right bottom left`)
- Signal badge automatically matches button rank and variant
- Can be used as link with `href` attribute
- Supports all GdsButton properties and events
- Icon-only FABs should always have accessible `label`
- Consider mobile viewport constraints when positioning
- Test z-index interactions with modals and overlays
- FAB should not obscure important content
- Use semantic `variant` values for meaning, not just color
