# GdsDetails Component

The `GdsDetails` component is a collapsible section that helps organize and hide content until needed. It provides an accessible and keyboard-navigable way to show/hide content with smooth animations.

## Features

- Expandable/collapsible content sections with smooth animations
- Group behavior: details with the same `name` will close each other automatically (accordion behaviour)
- Two size variants: `large` (default) and `small`
- Built with accessibility-first semantics (native `<details>`/`<summary>` when available) and ARIA fallbacks
- Keyboard navigation support and programmatic control via the `open` property
- Can contain any type of content, including other components

## Import

```tsx
import { GdsDetails } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsDetails summary="Click to expand">
  Details content goes here
</GdsDetails>
```

## Public API

### Attributes & Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `summary` | `string` | `"Summary"` | The text displayed in the details header |
| `open` | `boolean` | `false` | Controls if the details is expanded |
| `size` | `"large" \| "small"` | `"large"` | Controls the size of the details |
| `name` | `string` | `""` | Groups details together. Details with the same name will close each other when opened |

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

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-ui-state` | `CustomEvent` | Fired when details opens or closes. `detail` contains `{ open: boolean }` |
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

## Examples

### Default

Basic example of a details component:

```tsx
<GdsDetails summary="Click to expand">
  Details content goes here
</GdsDetails>
```

### Grouped Details

Details with the same `name` attribute will close each other when one is opened. This is useful for FAQ sections or when you want only one section open at a time.

```tsx
<GdsFlex flex-direction="column">
  <GdsDetails name="group-1" summary="First Details">
    <GdsText tag="h4">Heading Inside Details</GdsText>
    <GdsText>First content section</GdsText>
  </GdsDetails>
  
  <GdsDetails name="group-1" summary="Second Details">
    <GdsText tag="h4">Heading Inside Details</GdsText>
    <GdsText>Second content section</GdsText>
  </GdsDetails>
  
  <GdsDetails name="group-1" summary="Third Details">
    <GdsText tag="h4">Heading Inside Details</GdsText>
    <GdsText>Third content section</GdsText>
  </GdsDetails>
</GdsFlex>
```

### Size Variants

The details component supports two sizes: `large` (default) and `small`.

```tsx
<GdsFlex gap="xl">
  <GdsFlex flex-direction="column" flex="1">
    <GdsText tag="small" color="secondary">Large Size (Default)</GdsText>
    <GdsDetails summary="Summary example">Content goes here</GdsDetails>
    <GdsDetails summary="Summary example">Content goes here</GdsDetails>
    <GdsDetails summary="Summary example">Content goes here</GdsDetails>
  </GdsFlex>
  
  <GdsFlex flex-direction="column" flex="1">
    <GdsText tag="small" color="secondary">Small</GdsText>
    <GdsDetails size="small" summary="Summary example">
      Content goes here
    </GdsDetails>
    <GdsDetails size="small" summary="Summary example">
      Content goes here
    </GdsDetails>
    <GdsDetails size="small" summary="Summary example">
      Content goes here
    </GdsDetails>
  </GdsFlex>
</GdsFlex>
```

### Rich Content

Details can contain any type of content, including other components, lists, formatted text, and more.

```tsx
<GdsDetails summary="Rich Content Example">
  <GdsText tag="h3">Heading Inside Details</GdsText>
  <GdsText>This is a paragraph with <strong>rich</strong> formatting.</GdsText>
  <ul>
    <li>List item 1</li>
    <li>List item 2</li>
    <li>List item 3</li>
  </ul>
  <GdsAlert variant="information">
    You can even include alerts and other components!
  </GdsAlert>
</GdsDetails>
```

### Initially Open

Details can be initially opened using the `open` attribute.

```tsx
<GdsDetails open summary="Initially Open">
  This details starts in the open state.
</GdsDetails>
```

### With Form Fields

Details can be used to organize form sections:

```tsx
<GdsDetails summary="Personal Information">
  <GdsFlex flex-direction="column" gap="m">
    <GdsInput label="First Name" />
    <GdsInput label="Last Name" />
    <GdsInput label="Email" type="email" />
  </GdsFlex>
</GdsDetails>

<GdsDetails summary="Address Information">
  <GdsFlex flex-direction="column" gap="m">
    <GdsInput label="Street Address" />
    <GdsInput label="City" />
    <GdsInput label="Postal Code" />
  </GdsFlex>
</GdsDetails>
```

### Handling Events

Listen to the `gds-ui-state` event to react when details open or close. Note: when using React wrappers the event prop is `onGdsUiState` (camelCase) and the handler receives a `CustomEvent` with `{ detail: { open: boolean } }`.

```tsx
const handleStateChange = (e: CustomEvent) => {
  console.log('Details state changed:', e.detail)
}

<GdsDetails 
  summary="Click me" 
  onGdsUiState={handleStateChange}
>
  Content here
</GdsDetails>
```

## Accessibility

- The component uses native HTML `<details>` and `<summary>` elements when possible for correct semantics and built-in keyboard support. Where native support is not sufficient the component exposes equivalent ARIA attributes.
- Keyboard navigation: Use `Space` or `Enter` to toggle the details; when grouped as an accordion, focus management ensures predictable movement between headers.
- Accordion behaviour: When details share a `name` the component enforces mutually exclusive open states. Implementations add ARIA attributes (for example `role="region"` on the content and `aria-controls` on the summary) so screen readers can surface the relationship between header and content.
- DOM rendering: content inside a closed details is visually hidden, but it is kept available to assistive technologies when necessary. If you require that content is removed from the accessibility tree entirely, manage focus/state yourself or avoid placing essential interactive controls inside collapsed content.
- Focus management: When opening, focus is moved into the content where appropriate; when closing, focus returns to the summary trigger.

## Use Cases

- **FAQ sections**: Group questions and answers, allowing only one answer visible at a time
- **Form organization**: Break long forms into collapsible sections
- **Content organization**: Hide secondary content until needed
- **Settings panels**: Organize settings into logical groups
- **Help documentation**: Show detailed help when needed without cluttering the UI

## Best Practices

1. **Use descriptive summaries**: The summary should clearly indicate what content is inside
2. **Group related details**: Use the `name` attribute to create mutually exclusive groups
3. **Don't nest too deeply**: Avoid nesting details inside details more than one level
4. **Consider initial state**: Use `open` for important content users should see first
5. **Keep content focused**: Each details section should contain related content
6. **Use appropriate size**: Use `small` for compact UIs, `large` for more spacious layouts
7. **Avoid hiding essential controls**: Do not place primary actions or required inputs exclusively inside closed details
8. **Icon-only summaries**: If using icons only in the summary, provide an accessible `aria-label` on the `GdsDetails` or include visible text in a visually-hidden element so screen readers receive descriptive text

## Notes


-- Details with the same `name` form a radio-group-like behaviour (accordion)
-- The component animates smoothly when opening/closing
-- Content is normally present in the DOM for accessibility; the component may hide it visually. If your use-case requires removing the node from the DOM for performance, wrap the content in a conditional render in your application code.
-- Use `GdsFlex` or `GdsGrid` to organize multiple details components

## Examples: Icon-only Summary

```tsx
<GdsDetails summary="" aria-label="More options" size="small">
  <GdsText>Hidden content shown with accessible label</GdsText>
</GdsDetails>
```

## Caution: Nesting

- Avoid deep nesting of details: more than one level of nested collapsible sections increases cognitive load and complicates keyboard navigation. If you need nested disclosure, ensure each nested control has a clear summary and consider alternative patterns (tabs, progressive reveal) for complex flows.

## Related Components

- **GdsAlert**: For displaying notifications and messages (see [GdsAlert.md](./GdsAlert.md))
- **GdsBadge**: For status indicators and counters (see [GdsBadge.md](./GdsBadge.md))
- **GdsFlex**: For layout organization (see [GdsFlex.md](./GdsFlex.md))
- **GdsGrid**: For grid-based layouts (see [GdsGrid.md](./GdsGrid.md))

---

**Reference**: [SEB Green Core Storybook - Details](https://storybook.seb.io/latest/core/?path=/docs/components-details--docs)

Generated: 2025-M11-11

