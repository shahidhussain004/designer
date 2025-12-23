# GdsButton

A button component that can be tapped or clicked to perform an action. The button component provides a comprehensive set of ranks, variants, and sizes to support various use cases from primary actions to navigation controls.

> **Related Components**: See also [GdsCardPattern01](./GdsCardPattern01.md) for using buttons in card footer actions.
> 
> **Architecture**: See [Green Design System Architecture](./GreenDesignSystemArchitecture.md) for understanding public API boundaries and consumption patterns.

> **Related tokens & styles**: See [Shadows](./Shadows.md), [Radius](./Radius.md), [Motion](./Motion.md), and [Accessibility](./Accessibility.md)

## Features

- **Multiple Ranks**: Primary, secondary, and tertiary visual hierarchy
- **Intent Variants**: Neutral, brand, positive, negative, notice, and warning states
- **Flexible Sizing**: XS, small, medium, and large sizes
- **Icon Support**: Leading and trailing icon slots with automatic icon button mode
- **Link Support**: Can render as an anchor element with href attribute
- **Form Integration**: Full form control support with validation
- **Accessibility**: Comprehensive ARIA support and keyboard navigation
- **Responsive**: Automatic text truncation for long content
- **Style Expressions**: Layout control through style expression properties

## Anatomy

1. Button label — The visible text or accessible label for the action
2. Container — The interactive element surface and hit target
3. Leading icon — Optional icon before the label (slot `lead`)
4. Trailing icon — Optional icon after the label (slot `trail`)

## When to use

Use buttons for actions, submissions and navigation controls. Prefer a single primary action per context (dialog, modal, card footer). Use secondary/tertiary for less important outcomes or destructive/neutral alternatives.

## Import

```tsx
import { GdsButton } from '@sebgroup/green-core/react'
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `disabled` | `boolean` | `false` | Whether the button is disabled |
| `type` | `HTMLButtonElement['type']` | `undefined` | The type of the button (button, submit, reset) |
| `rank` | `'primary' \| 'secondary' \| 'tertiary'` | `'primary'` | Visual importance rank of the button |
| `variant` | `'' \| 'brand' \| 'neutral' \| 'positive' \| 'negative' \| 'notice' \| 'warning'` | `'neutral'` | Intent variant defining button purpose |
| `size` | `'xs' \| 'small' \| 'medium' \| 'large'` | `'medium'` | Size of the button |
| `label` | `string` | `''` | Accessible label when no text is in default slot |
| `href` | `string` | `''` | When set, renders as anchor element |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top'` | `undefined` | Link target (only with href) |
| `rel` | `string` | `undefined` | Link relationship (defaults to "noreferrer noopener" for security when target is set) |
| `download` | `string` | `undefined` | Treats URL as download (only with href) |
| `required` | `boolean` | `false` | Communicates required state for assistive technology |
| `invalid` | `boolean` | `false` | Validation state of the form control |
| `aria-invalid` | `string` | `undefined` | Validation state for ARIA |
| `error-message` | `string` | `''` | Manual error message control |
| `gds-element` | `string` | `undefined` | Unscoped element name (read-only) |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `width` | Controls width property. Supports space tokens and CSS values |
| `min-width` | Controls min-width property |
| `max-width` | Controls max-width property |
| `inline-size` | Controls inline-size property |
| `min-inline-size` | Controls min-inline-size property |
| `max-inline-size` | Controls max-inline-size property |
| `margin` | Controls margin property. Only space tokens |
| `margin-inline` | Controls margin-inline property. Only space tokens |
| `margin-block` | Controls margin-block property. Only space tokens |
| `align-self` | Controls align-self property |
| `justify-self` | Controls justify-self property |
| `place-self` | Controls place-self property |
| `grid-column` | Controls grid-column property |
| `grid-row` | Controls grid-row property |
| `grid-area` | Controls grid-area property |
| `flex` | Controls flex property |
| `order` | Controls order property |
| `justify-content` | Spread contents of the button |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `formAssociated` | `boolean` | `true` | Whether element is form-associated |
| `validator` | `GdsValidator` | `undefined` | Validator for form control validation |
| `errorMessage` | `string` | `''` | Manual error message control |
| `form` | `HTMLFormElement` | - | Associated form element |
| `validity` | `ValidityState` | - | Validation state object |
| `validationMessage` | `string` | - | Validation message |
| `willValidate` | `boolean` | - | Whether validation will be performed |
| `isDefined` | `boolean` | `false` | Whether element is in custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expressions |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only) |

### Events

| Event | Description |
|-------|-------------|
| `click` | Fired when the button is clicked |
| `gds-validity-state` | Dispatched when validity state changes via validator |
| `gds-element-disconnected` | When element is disconnected from DOM |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Button text content |
| `lead` | Optional icon before the label (use icon components from [Icons.md](./Icons.md)) |
| `trail` | Optional icon after the label (use icon components from [Icons.md](./Icons.md)) |

## Usage Examples

### Basic Button

```tsx
import { GdsButton, GdsTheme } from '@sebgroup/green-core/react'

function Example() {
  return (
    <GdsTheme>
      <GdsButton>Button</GdsButton>
    </GdsTheme>
  )
}
```

### Ranks and Variants

Buttons support three ranks (primary, secondary, tertiary) and six variants (neutral, brand, positive, negative, notice, warning):

```tsx
import { GdsButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

function RanksExample() {
  return (
    <GdsTheme>
      <GdsFlex flexDirection="column" gap="4xl" padding="4xl">
        {/* Neutral Variant */}
        <GdsFlex gap="xl" alignItems="center">
          <GdsButton variant="neutral">Primary</GdsButton>
          <GdsButton variant="neutral" rank="secondary">Secondary</GdsButton>
          <GdsButton variant="neutral" rank="tertiary">Tertiary</GdsButton>
        </GdsFlex>

        {/* Brand Variant */}
        <GdsFlex gap="xl" alignItems="center">
          <GdsButton variant="brand">Primary</GdsButton>
          <GdsButton variant="brand" rank="secondary">Secondary</GdsButton>
          <GdsButton variant="brand" rank="tertiary">Tertiary</GdsButton>
        </GdsFlex>

        {/* Positive Variant */}
        <GdsFlex gap="xl" alignItems="center">
          <GdsButton variant="positive">Primary</GdsButton>
          <GdsButton variant="positive" rank="secondary">Secondary</GdsButton>
          <GdsButton variant="positive" rank="tertiary">Tertiary</GdsButton>
        </GdsFlex>

        {/* Negative Variant */}
        <GdsFlex gap="xl" alignItems="center">
          <GdsButton variant="negative">Primary</GdsButton>
          <GdsButton variant="negative" rank="secondary">Secondary</GdsButton>
          <GdsButton variant="negative" rank="tertiary">Tertiary</GdsButton>
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Button Sizes

Four sizes available: XS, small, medium (default), and large:

```tsx
import { GdsButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

function SizesExample() {
  return (
    <GdsTheme>
      <GdsFlex gap="l" alignItems="center">
        <GdsButton size="large">Large</GdsButton>
        <GdsButton>Medium</GdsButton>
        <GdsButton size="small">Small</GdsButton>
        <GdsButton size="xs">XS</GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Desktop placements

- **Left**: In overviews and widgets where content reads top-to-bottom, place primary buttons to the left for easier scanning.
- **Right**: In dialogs, modals, and flows (left→right progression), place the primary action to the right to match user expectations for progression.

## Mobile placements

- **One button**: Use full width for a single primary action to improve tap targets.
- **Two buttons**: Place side-by-side where space allows; stack vertically only when space is constrained.
- **Three buttons**: Re-evaluate necessity — consider placing two primary/secondary actions side-by-side and a tertiary action beneath or in a header as an icon.

### Buttons with Icons

Use lead and trail slots for icons. See [Icons.md](./Icons.md) for available icons:

```tsx
import { 
  GdsButton, 
  GdsTheme, 
  GdsFlex,
  IconCreditCard 
} from '@sebgroup/green-core/react'

function IconButtonsExample() {
  return (
    <GdsTheme>
      <GdsFlex gap="l">
        {/* Leading icon */}
        <GdsButton>
          <IconCreditCard slot="lead" />
          Leading icon
        </GdsButton>

        {/* Trailing icon */}
        <GdsButton>
          Trailing icon
          <IconCreditCard slot="trail" />
        </GdsButton>

        {/* Both icons */}
        <GdsButton size="large">
          <IconCreditCard slot="lead" size="xl" />
          Large with Icon
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Icon-Only Buttons

When a single icon is the only child, renders as a circular icon button. Always provide a `label` attribute for accessibility:

```tsx
import { 
  GdsButton, 
  GdsTheme, 
  GdsFlex,
  IconArrowRight 
} from '@sebgroup/green-core/react'

function IconOnlyExample() {
  return (
    <GdsTheme>
      <GdsFlex gap="l" alignItems="center">
        <GdsButton size="xs" label="Next step 1">
          <IconArrowRight size="s" />
        </GdsButton>
        <GdsButton size="small" label="Next step 2">
          <IconArrowRight size="m" />
        </GdsButton>
        <GdsButton label="Next step 3">
          <IconArrowRight size="l" />
        </GdsButton>
        <GdsButton size="large" label="Next step 4">
          <IconArrowRight size="xl" />
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Navigation Buttons (Next/Previous)

Use `justify-content="space-between"` to maximize space between icon and text:

```tsx
import { 
  GdsButton, 
  GdsTheme, 
  GdsFlex,
  IconArrowLeft,
  IconArrowRight 
} from '@sebgroup/green-core/react'

function NavigationExample() {
  return (
    <GdsTheme>
      <GdsFlex gap="xl">
        {/* Previous button */}
        <GdsButton justifyContent="space-between">
          <IconArrowLeft slot="lead" />
          Previous
        </GdsButton>

        {/* Next button */}
        <GdsButton justifyContent="space-between">
          Next
          <IconArrowRight slot="trail" />
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Link Buttons

Render as an anchor element with `href` attribute:

```tsx
import { GdsButton, GdsTheme } from '@sebgroup/green-core/react'

function LinkButtonExample() {
  return (
    <GdsTheme>
      <GdsButton 
        href="https://github.com/seb-oss/green"
        target="_blank"
      >
        Visit GitHub
      </GdsButton>
    </GdsTheme>
  )
}
```

### Form Integration

Buttons can be integrated with forms and support validation:

```tsx
import { GdsButton, GdsTheme } from '@sebgroup/green-core/react'

function FormExample() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
  }

  return (
    <GdsTheme>
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <GdsButton type="submit" variant="positive">
          Submit Form
        </GdsButton>
        <GdsButton type="reset" rank="secondary">
          Reset
        </GdsButton>
      </form>
    </GdsTheme>
  )
}
```

### Disabled State

Use sparingly - it's often better to show error messages than disable buttons:

```tsx
import { GdsButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

function DisabledExample() {
  return (
    <GdsTheme>
      <GdsFlex gap="l">
        <GdsButton disabled>Primary</GdsButton>
        <GdsButton rank="secondary" variant="positive" disabled>
          Secondary
        </GdsButton>
        <GdsButton rank="tertiary" disabled>
          Tertiary
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Do’s and Don’ts

- **Do**: Use one primary action per context to avoid user confusion.
- **Do**: Provide accessible labels for icon-only buttons using the `label` attribute.
- **Do**: Use `rank` to visually emphasize the most important action in a group.
- **Don't**: Use more than one primary button in the same UI region.
- **Don't**: Rely on color alone to convey the intent — pair with clear labels and affordances.
- **Don't**: Use icon-only buttons for unclear actions; provide a visible label or tooltip.

### ARIA Attributes

Forward ARIA attributes to inner button element using `gds-aria-*` prefix:

```tsx
import { GdsButton, GdsTheme } from '@sebgroup/green-core/react'

function AriaExample() {
  return (
    <GdsTheme>
      <GdsButton 
        label="Open dialog"
        aria-haspopup="dialog"
        aria-expanded="false"
        gds-aria-description="This opens a confirmation dialog"
      >
        Open Dialog
      </GdsButton>
    </GdsTheme>
  )
}
```

### Text Truncation

Long text content is automatically truncated:

```tsx
import { GdsButton, GdsTheme, IconCreditCard } from '@sebgroup/green-core/react'

function TruncationExample() {
  return (
    <GdsTheme>
      <div style={{ width: '30ch' }}>
        <GdsButton>
          <IconCreditCard slot="lead" />
          This is a long text that will be truncated
        </GdsButton>
      </div>
    </GdsTheme>
  )
}
```

### Layout with Style Expressions

Use style expression properties for layout control:

```tsx
import { GdsButton, GdsTheme, GdsGrid } from '@sebgroup/green-core/react'

function LayoutExample() {
  return (
    <GdsTheme>
      <GdsGrid columns="3" gap="l">
        <GdsButton width="100%">
          Full Width
        </GdsButton>
        <GdsButton margin="s">
          With Margin
        </GdsButton>
        <GdsButton flex="1">
          Flexible
        </GdsButton>
      </GdsGrid>
    </GdsTheme>
  )
}
```

## Use Cases

### Primary Actions
- Form submissions
- Confirming operations
- Primary navigation

### Secondary Actions
- Cancel operations
- Alternative options
- Secondary navigation

### Tertiary Actions
- Less important actions
- Auxiliary functions
- Inline actions

### Variant-Specific Use Cases

**Brand**: Marketing actions, brand-specific features
**Neutral**: Standard actions without semantic meaning
**Positive**: Confirmations, success actions, proceed operations
**Negative**: Delete, remove, destructive actions
**Notice**: Important notifications, alerts
**Warning**: Caution-required actions

## Best Practices

### Do's
- ✅ Use primary rank for the most important action on a page
- ✅ Provide `label` attribute for icon-only buttons
- ✅ Use appropriate variants for semantic meaning
- ✅ Keep button text concise and action-oriented
- ✅ Use leading icons to reinforce action meaning
- ✅ Use `justify-content="space-between"` for navigation buttons
- ✅ Set appropriate `rel` attributes for external links
- ✅ Use `variant="positive"` for submit/confirm actions
- ✅ Use `variant="negative"` for destructive actions

### Don'ts
- ❌ Don't overuse disabled state - prefer showing errors
- ❌ Don't use multiple primary buttons in the same context
- ❌ Don't omit `label` on icon-only buttons
- ❌ Don't use unclear button text like "Click here"
- ❌ Don't mix too many ranks/variants in one group
- ❌ Don't forget to set `target` and `rel` for external links
- ❌ Don't use buttons for navigation - use links instead (unless styled as button)

## Common Patterns

### Action Groups

```tsx
import { GdsButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

function ActionGroupExample() {
  return (
    <GdsTheme>
      <GdsFlex gap="m" justifyContent="flex-end">
        <GdsButton rank="secondary">Cancel</GdsButton>
        <GdsButton variant="positive">Save</GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Navigation with Icons

```tsx
import { 
  GdsButton, 
  GdsTheme, 
  GdsFlex,
  IconArrowLeft,
  IconArrowRight 
} from '@sebgroup/green-core/react'

function NavigationPattern() {
  return (
    <GdsTheme>
      <GdsFlex justifyContent="space-between">
        <GdsButton 
          rank="secondary"
          justifyContent="space-between"
        >
          <IconArrowLeft slot="lead" />
          Previous
        </GdsButton>
        <GdsButton 
          variant="positive"
          justifyContent="space-between"
        >
          Next
          <IconArrowRight slot="trail" />
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Confirmation Dialog Actions

```tsx
import { GdsButton, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'

function ConfirmationActions() {
  return (
    <GdsTheme>
      <GdsFlex gap="m" justifyContent="center">
        <GdsButton 
          rank="secondary" 
          onClick={() => console.log('Cancelled')}
        >
          Cancel
        </GdsButton>
        <GdsButton 
          variant="negative"
          onClick={() => console.log('Confirmed deletion')}
        >
          Delete
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Loading State

```tsx
import { useState } from 'react'
import { GdsButton, GdsTheme, GdsSpinner } from '@sebgroup/green-core/react'

function LoadingButtonExample() {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    // Perform async operation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <GdsTheme>
      <GdsButton 
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? <GdsSpinner size="small" /> : 'Submit'}
      </GdsButton>
    </GdsTheme>
  )
}
```

### Download Button

```tsx
import { GdsButton, GdsTheme, IconDownload } from '@sebgroup/green-core/react'

function DownloadExample() {
  return (
    <GdsTheme>
      <GdsButton 
        href="/path/to/file.pdf"
        download="document.pdf"
      >
        <IconDownload slot="lead" />
        Download PDF
      </GdsButton>
    </GdsTheme>
  )
}
```

### Button Groups by Variant

```tsx
import { 
  GdsButton, 
  GdsTheme, 
  GdsFlex,
  GdsGrid,
  GdsText,
  GdsDivider,
  IconArrowLeft,
  IconArrowRight 
} from '@sebgroup/green-core/react'

function VariantGroups() {
  return (
    <GdsTheme>
      <GdsFlex flexDirection="column" gap="4xl" padding="4xl">
        {/* Neutral Navigation */}
        <GdsFlex flexDirection="column" gap="m">
          <GdsText>Neutral Variant</GdsText>
          <GdsDivider opacity="0.2" />
          <GdsGrid columns="3" gap="xl">
            <GdsButton justifyContent="space-between">
              <IconArrowLeft slot="lead" />
              Previous
            </GdsButton>
            <GdsButton rank="secondary" justifyContent="space-between">
              <IconArrowLeft slot="lead" />
              Previous
            </GdsButton>
            <GdsButton rank="tertiary" justifyContent="space-between">
              <IconArrowLeft slot="lead" />
              Previous
            </GdsButton>
          </GdsGrid>
        </GdsFlex>

        {/* Positive Actions */}
        <GdsFlex flexDirection="column" gap="m">
          <GdsText>Positive Variant</GdsText>
          <GdsDivider opacity="0.2" />
          <GdsGrid columns="3" gap="xl">
            <GdsButton variant="positive" justifyContent="space-between">
              Next
              <IconArrowRight slot="trail" />
            </GdsButton>
            <GdsButton 
              rank="secondary" 
              variant="positive" 
              justifyContent="space-between"
            >
              Next
              <IconArrowRight slot="trail" />
            </GdsButton>
            <GdsButton 
              rank="tertiary" 
              variant="positive" 
              justifyContent="space-between"
            >
              Next
              <IconArrowRight slot="trail" />
            </GdsButton>
          </GdsGrid>
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Related Components

- [Radius](./Radius.md) — Corner radius tokens for button roundness
- [Colors](./Colors.md) — Color palette and state color usage for buttons
- [GdsFab](./GdsFab.md) — Floating action button (extends GdsButton with fixed positioning)
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling button color schemes
- [GdsMenuButton](./GdsMenuButton.md) — Menu button for navigation menus
- [GdsLink](./GdsLink.md) — For standard navigation links
- [GdsMask](./GdsMask.md) — For CTA buttons within gradient overlays
- [GdsIconButton](./GdsIconButton.md) — Dedicated icon button component (if available)
- [GdsFilterChip](./GdsFilterChip.md) — For filter chips (button-like selection controls)
- [GdsFormattedAccount](./GdsFormattedAccount.md) — For account actions (copy, select)
- [GdsFormSummary](./GdsFormSummary.md) — For form submission and validation summary
- [GdsInput](./GdsInput.md) — For form inputs with button integration
- [GdsRadioGroup](./GdsRadioGroup.md) — Radio button groups in forms
- [GdsSegmentedControl](./GdsSegmentedControl.md) — For view switching and option selection
- [GdsVideo](./GdsVideo.md) — For video play/pause controls
- [GdsSpinner](./GdsSpinner.md) — Loading indicator for button loading states
- [GdsSignal](./GdsSignal.md) — Notification indicator for trail slot badges
- [GdsFlex](./GdsFlex.md) — For button group layouts
- [GdsGrid](./GdsGrid.md) — For button grid layouts
- [Icons](./Icons.md) — Available icons for lead/trail slots
- [GdsDropdown](./GdsDropdown.md) — For form dropdowns with button triggers
- [GdsDialog](./GdsDialog.md) — For dialog actions with buttons
- [GdsPopover](./GdsPopover.md) — Popover trigger for overlay content
- [GdsAlert](./GdsAlert.md) — For alert actions with buttons
- [GdsCalendar](./GdsCalendar.md) — Calendar navigation controls
- [GdsDatepicker](./GdsDatepicker.md) — Date picker with calendar button
- [GdsCoachmark](./GdsCoachmark.md) — For coachmark action buttons
- [GdsContextMenu](./GdsContextMenu.md) — For custom menu triggers using buttons

## Accessibility

- **Keyboard Navigation**: Fully keyboard accessible with standard tab and enter/space activation
- **Screen Readers**: Use `label` attribute for icon-only buttons to provide accessible labels
- **ARIA Support**: Forward ARIA attributes using `gds-aria-*` prefix for custom announcements
- **Focus Management**: Clear focus indicators for all button states
- **Semantic HTML**: Renders proper `<button>` or `<a>` elements based on presence of `href`
- **Form Integration**: Proper `type` attribute support for form submissions and resets
- **Disabled State**: Properly communicates disabled state to assistive technologies (but use sparingly)

### ARIA Best Practices

```tsx
// Icon-only button with label
<GdsButton label="Close dialog">
  <IconClose />
</GdsButton>

// Button with expanded state
<GdsButton 
  aria-haspopup="menu"
  aria-expanded={menuOpen}
>
  Options
</GdsButton>

// Button with description
<GdsButton 
  label="Delete account"
  gds-aria-description="This action cannot be undone"
  variant="negative"
>
  Delete
</GdsButton>
```

## Notes

- Text content automatically truncates if it doesn't fit within the button width
- When using `href`, the component renders as an anchor element with button styling
- For external links with `target="_blank"`, `rel` defaults to "noreferrer noopener" for security
- Icon sizes should match button sizes: xs→s, small→m, medium→l, large→xl
- Single icon children automatically trigger circular icon button mode
- The `justify-content` property is particularly useful for navigation buttons with icons
- Disabled state should be used sparingly - prefer showing validation errors instead
- Style expression properties enable fine-grained layout control without custom CSS
