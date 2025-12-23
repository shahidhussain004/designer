# GdsBadge Component

The `GdsBadge` component is a compact visual indicator for status, counts, and notifications. It provides a consistent way to display status information, counters, and notification badges throughout the application.

## Features

- Multiple variants for different contextual uses (information, notice, positive, warning, negative, disabled)
- Size control (default and small)
- Notification mode for notification indicators
- Lead and trail slots for icons and additional content
- Rounded corners option
- Disabled state support
- Supports style expression properties for layout customization

## Anatomy

1. **Container** — The outer element that defines background, padding, and shape.
2. **Status text** — The label or number conveying the badge meaning.
3. **Icon** — Optional leading or trailing icon that enhances meaning.

## Usage

Badges are especially useful for status indicators, counters and contextual highlights. Use badges sparingly — too many badges create visual noise and reduce their impact. Always ensure that the badge color, icon and label clearly support the intended message.

## Import

```tsx
import { GdsBadge } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsBadge variant="positive">Success</GdsBadge>
```

## Public API

### Attributes & Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"information" \| "notice" \| "positive" \| "warning" \| "negative" \| "disabled"` | `""` | Controls the variant of the badge |
| `size` | `"default" \| "small"` | `"default"` | Defines the size of the badge |
| `notification` | `boolean` | `false` | When `true`, the badge acts as a notification badge with only positive or negative variants |
| `rounded` | `boolean` | `false` | When `true`, the badge will have fully rounded corners |

### Style Expression Properties

The component supports various style expression properties for layout customization:

| Property | Description |
|----------|-------------|
| `width` | Controls the width property. Supports space tokens and all valid CSS width values |
| `min-width` | Controls the min-width property |
| `max-width` | Controls the max-width property |
| `inline-size` | Controls the inline-size property |
| `min-inline-size` | Controls the min-inline-size property |
| `max-inline-size` | Controls the max-inline-size property |
| `margin` | Controls the margin property. Only accepts space tokens |
| `margin-inline` | Controls the margin-inline property. Only accepts space tokens |
| `margin-block` | Controls the margin-block property. Only accepts space tokens |
| `align-self` | Controls the align-self property |
| `justify-self` | Controls the justify-self property |
| `place-self` | Controls the place-self property |
| `grid-column` | Controls the grid-column property |
| `grid-row` | Controls the grid-row property |
| `grid-area` | Controls the grid-area property |
| `flex` | Controls the flex property |
| `order` | Controls the order property |

### Slots

| Slot | Description |
|------|-------------|
| `lead` | For adding leading content such as icons |
| `trail` | For adding trailing content such as currency symbols or units |
| Default | Main badge content (text, numbers, etc.) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

## Examples

### Default

Basic badge without icons:

```tsx
<GdsBadge variant="information">Information</GdsBadge>
```

### Variants

Badges are available in multiple variants to indicate different types of information:

```tsx
<GdsFlex gap="xl">
  <GdsBadge variant="information">Information</GdsBadge>
  <GdsBadge variant="notice">Notice</GdsBadge>
  <GdsBadge variant="positive">Positive</GdsBadge>
  <GdsBadge variant="warning">Warning</GdsBadge>
  <GdsBadge variant="negative">Negative</GdsBadge>
  <GdsBadge variant="disabled">Disabled</GdsBadge>
</GdsFlex>
```

#### Variant Descriptions

- **information**: Default variant for general informational badges
- **notice**: For badges that require attention
- **positive**: For success states and positive feedback
- **warning**: For warning states or caution indicators
- **negative**: For error states and critical issues
- **disabled**: For inactive or disabled states

### With Icons

Use the `lead` slot to add icons to badges. See [Icons documentation](./Icons.md) for available icons.

```tsx
import { IconCircleInfo, IconCircleCheck, IconTriangleExclamation, IconRocket } from '@sebgroup/green-core/react'

<GdsFlex gap="xl">
  <GdsBadge variant="information">
    <IconCircleInfo slot="lead" />
    Information
  </GdsBadge>
  
  <GdsBadge variant="positive">
    <IconCircleCheck slot="lead" />
    Positive
  </GdsBadge>
  
  <GdsBadge variant="negative">
    <IconTriangleExclamation slot="lead" />
    Negative
  </GdsBadge>
  
  <GdsBadge variant="positive">
    <IconRocket slot="lead" />
    Launch
  </GdsBadge>
</GdsFlex>
```

### With Trail Slot

Use the `trail` slot to add additional content like currency symbols or units:

```tsx
import { IconPlusSmall, IconMinusSmall } from '@sebgroup/green-core/react'

<GdsFlex gap="xl">
  <GdsBadge variant="positive">
    <IconPlusSmall slot="lead" />
    10,000.00
    <span slot="trail">SEK</span>
  </GdsBadge>
  
  <GdsBadge variant="negative">
    <IconMinusSmall slot="lead" />
    142.00
    <span slot="trail">EUR</span>
  </GdsBadge>
</GdsFlex>
```

### Size Variants

Badges support two sizes: `default` and `small`:

```tsx
<GdsFlex gap="xl">
  <GdsFlex flex-direction="column" gap="xl">
    <GdsText>Default Size</GdsText>
    <GdsBadge variant="information">140</GdsBadge>
    <GdsBadge variant="positive">Success</GdsBadge>
    <GdsBadge variant="warning">Warning</GdsBadge>
  </GdsFlex>
  
  <GdsFlex flex-direction="column" gap="xl">
    <GdsText>Small Size</GdsText>
    <GdsBadge variant="information" size="small">140</GdsBadge>
    <GdsBadge variant="positive" size="small">Success</GdsBadge>
    <GdsBadge variant="warning" size="small">Warning</GdsBadge>
  </GdsFlex>
</GdsFlex>
```

Small size is particularly useful for:
- Displaying counters
- Currency indicators
- Compact status labels

```tsx
<GdsFlex gap="xl">
  <GdsBadge size="small" variant="information">120</GdsBadge>
  <GdsBadge size="small" variant="positive">32</GdsBadge>
  <GdsBadge size="small" variant="warning">602</GdsBadge>
  <GdsBadge size="small" variant="negative">537</GdsBadge>
</GdsFlex>
```

### Notification Mode

When `notification` is set to `true`, the badge acts as a notification indicator. In notification mode, the badge only supports positive or negative variants.

```tsx
<GdsFlex gap="xl" align-items="center">
  {/* Empty notification dot */}
  <GdsBadge notification />
  
  {/* Notification with count */}
  <GdsBadge notification>9</GdsBadge>
  
  {/* Notification with large count */}
  <GdsBadge notification>999+</GdsBadge>
  
  {/* Notification with icon in trail slot */}
  <GdsBadge notification>
    999
    <IconPlusSmall slot="trail" />
  </GdsBadge>
</GdsFlex>
```

Notification badges are ideal for:
- Unread message counts
- Notification indicators
- Activity counters
- Alert badges

### Rounded Badges

Use the `rounded` property to create badges with fully rounded corners:

```tsx
<GdsFlex gap="xl">
  <GdsBadge rounded variant="information">01</GdsBadge>
  <GdsBadge rounded variant="notice">02</GdsBadge>
  <GdsBadge rounded variant="positive">03</GdsBadge>
  <GdsBadge rounded variant="warning">04</GdsBadge>
  <GdsBadge rounded variant="negative">05</GdsBadge>
</GdsFlex>
```

Rounded badges work well with both sizes:

```tsx
<GdsFlex gap="xl">
  <GdsBadge rounded size="small" variant="information">01</GdsBadge>
  <GdsBadge rounded size="small" variant="positive">02</GdsBadge>
  <GdsBadge rounded size="small" variant="warning">03</GdsBadge>
</GdsFlex>
```

### Disabled State

Badges can be disabled to indicate inactive states:

```tsx
<GdsFlex gap="xl">
  <GdsBadge variant="disabled">Disabled</GdsBadge>
  <GdsBadge variant="disabled">
    <IconTriangleExclamation slot="lead" />
    Inactive
  </GdsBadge>
</GdsFlex>
```

## Use Cases

### Status Indicators

Display status information for items, processes, or states:

```tsx
<GdsFlex gap="m">
  <GdsText>Payment Status:</GdsText>
  <GdsBadge variant="positive">
    <IconCircleCheck slot="lead" />
    Completed
  </GdsBadge>
</GdsFlex>

<GdsFlex gap="m">
  <GdsText>Document Status:</GdsText>
  <GdsBadge variant="warning">
    <IconCircleInfo slot="lead" />
    Pending Review
  </GdsBadge>
</GdsFlex>

<GdsFlex gap="m">
  <GdsText>Account Status:</GdsText>
  <GdsBadge variant="negative">
    <IconTriangleExclamation slot="lead" />
    Suspended
  </GdsBadge>
</GdsFlex>
```

### Counters and Metrics

Display numerical information and counts:

```tsx
<GdsFlex gap="xl">
  <GdsBadge variant="information" size="small">
    Total: 1,234
  </GdsBadge>
  
  <GdsBadge variant="positive" size="small">
    Active: 856
  </GdsBadge>
  
  <GdsBadge variant="warning" size="small">
    Pending: 234
  </GdsBadge>
  
  <GdsBadge variant="negative" size="small">
    Errors: 12
  </GdsBadge>
</GdsFlex>
```

### Financial Information

Display monetary values with currency indicators:

```tsx
import { IconPlusSmall, IconMinusSmall } from '@sebgroup/green-core/react'

<GdsFlex flex-direction="column" gap="m">
  <GdsBadge variant="positive">
    <IconPlusSmall slot="lead" />
    5,250.00
    <span slot="trail">SEK</span>
  </GdsBadge>
  
  <GdsBadge variant="negative">
    <IconMinusSmall slot="lead" />
    1,890.50
    <span slot="trail">EUR</span>
  </GdsBadge>
  
  <GdsBadge variant="information">
    Balance: 15,340.00
    <span slot="trail">USD</span>
  </GdsBadge>
</GdsFlex>
```

### Notification Badges on UI Elements

Combine badges with other components to show notifications:

```tsx
<GdsButton rank="tertiary">
  Notifications
  <GdsBadge notification size="small" margin-inline="s">
    12
  </GdsBadge>
</GdsButton>

<GdsButton rank="tertiary">
  Messages
  <GdsBadge notification size="small" margin-inline="s" />
</GdsButton>
```

### Category Tags

Use badges to categorize or tag content:

```tsx
<GdsFlex gap="s" flex-wrap="wrap">
  <GdsBadge variant="information" size="small">Banking</GdsBadge>
  <GdsBadge variant="information" size="small">Investment</GdsBadge>
  <GdsBadge variant="information" size="small">Savings</GdsBadge>
  <GdsBadge variant="information" size="small">Mortgage</GdsBadge>
</GdsFlex>
```

### Progress Indicators

Show completion status or progress:

```tsx
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex align-items="center" gap="m">
    <GdsText>Step 1</GdsText>
    <GdsBadge variant="positive" size="small">
      <IconCircleCheck slot="lead" />
      Complete
    </GdsBadge>
  </GdsFlex>
  
  <GdsFlex align-items="center" gap="m">
    <GdsText>Step 2</GdsText>
    <GdsBadge variant="warning" size="small">
      In Progress
    </GdsBadge>
  </GdsFlex>
  
  <GdsFlex align-items="center" gap="m">
    <GdsText>Step 3</GdsText>
    <GdsBadge variant="disabled" size="small">
      Not Started
    </GdsBadge>
  </GdsFlex>
</GdsFlex>
```

## Best Practices

1. **Choose appropriate variants**: Match the variant to the semantic meaning of the information
   - Use `positive` for success, completion, active states
   - Use `negative` for errors, failures, critical states
   - Use `warning` for caution, pending actions
   - Use `information` for neutral, informational states
   - Use `notice` for items requiring attention

2. **Size selection**: 
   - Use default size for primary status indicators
   - Use small size for counters, tags, and compact displays
   - Use notification mode for notification dots and counts

3. **Icon usage**: Add icons to badges when they enhance understanding
   - Use consistent icons for similar states across the application
   - Refer to [Icons.md](./Icons.md) for available icons
   - Place icons in the `lead` slot for consistency

4. **Keep text concise**: Badges should contain brief, scannable text
   - Use short labels (1-3 words)
   - For counts, consider using "999+" for large numbers
   - Avoid full sentences

5. **Notification mode guidelines**:
   - Use for unread counts and notification indicators
   - Keep counts visible and up-to-date
   - Consider using empty badge (dot) for binary states

6. **Accessibility considerations**:
   - Ensure sufficient color contrast
   - Don't rely solely on color to convey meaning
   - Use descriptive text or ARIA labels when needed

### Accessibility Details

- **Text alternatives**: If the badge conveys information that is not otherwise available in nearby text, provide an accessible name via `aria-label` or visually hidden text.

Example (icon-only notification):

```tsx
<GdsBadge notification aria-label="5 unread messages" />
```

- **Contrast**: Ensure badge foreground and background meet WCAG contrast ratios for the intended size and usage.
- **Role**: Badges generally do not need ARIA roles; when used as status indicators for important information, consider `role="status"` on a nearby element or provide an accessible label.
- **Focus**: Badges are usually non-interactive. If a badge is interactive (clickable), ensure it is keyboard focusable and has a visible focus indicator.

7. **Layout and spacing**:
  8. **Use badges sparingly**:
    - Avoid placing too many badges in a single view. Reserve badges for high-priority or summary information to preserve visual emphasis.
   - Use appropriate gap between multiple badges
   - Align badges consistently with related content
   - Use style expression properties for precise positioning

## Common Patterns

### Status List

```tsx
<GdsFlex flex-direction="column" gap="m">
  {items.map(item => (
    <GdsFlex key={item.id} justify-content="space-between" align-items="center">
      <GdsText>{item.name}</GdsText>
      <GdsBadge variant={item.status === 'active' ? 'positive' : 'disabled'}>
        {item.status}
      </GdsBadge>
    </GdsFlex>
  ))}
</GdsFlex>
```

### Form Field Status

```tsx
<GdsFlex flex-direction="column" gap="s">
  <GdsFlex justify-content="space-between" align-items="center">
    <label htmlFor="email">Email Address</label>
    <GdsBadge variant="positive" size="small">
      <IconCircleCheck slot="lead" />
      Verified
    </GdsBadge>
  </GdsFlex>
  <GdsInput id="email" type="email" value={email} />
</GdsFlex>
```

### Transaction Amount

```tsx
const TransactionBadge = ({ amount, currency }) => {
  const isPositive = amount >= 0
  return (
    <GdsBadge variant={isPositive ? 'positive' : 'negative'}>
      {isPositive ? <IconPlusSmall slot="lead" /> : <IconMinusSmall slot="lead" />}
      {Math.abs(amount).toFixed(2)}
      <span slot="trail">{currency}</span>
    </GdsBadge>
  )
}
```

### Navigation with Notifications

```tsx
<GdsButton rank="tertiary">
  <IconBell slot="lead" />
  Notifications
  {unreadCount > 0 && (
    <GdsBadge notification margin-inline="s">
      {unreadCount > 99 ? '99+' : unreadCount}
    </GdsBadge>
  )}
</GdsButton>
```

## Related Components

- **GdsSignal**: For simple notification indicators without text (see [GdsSignal.md](./GdsSignal.md))
- **GdsAlert**: For displaying longer messages and notifications (see [GdsAlert.md](./GdsAlert.md))
- **GdsButton**: Often used together with badges for actions (see component docs)
- **GdsInput**: For input trail slot badges (currency, units) (see [GdsInput.md](./GdsInput.md))
- **GdsFormattedAccount**: For account status badges (see [GdsFormattedAccount.md](./GdsFormattedAccount.md))
- **GdsFormattedDate**: For date/appointment status badges (see [GdsFormattedDate.md](./GdsFormattedDate.md))
- **GdsFormattedNumber**: For displaying amounts with status badges (see [GdsFormattedNumber.md](./GdsFormattedNumber.md))
- **GdsFlex**: For layout of multiple badges (see [GdsFlex.md](./GdsFlex.md))
- **Icons**: For badge lead slot content (see [Icons.md](./Icons.md))

## Notes

- Badges are inline elements by default
- The `notification` property restricts variants to positive/negative only
- Icons in the `lead` slot are automatically styled to match the badge size
- Trail slot content inherits badge styling
- Use `GdsFlex` to organize multiple badges with proper spacing
- The component supports all standard style expression properties for flexible layout

---

**Reference**: [SEB Green Core Storybook - Badge](https://storybook.seb.io/latest/core/?path=/docs/components-badge--docs)

Generated: 2025-11-12
