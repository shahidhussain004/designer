# GdsRadioGroup & GdsRadio

Radio buttons allow users to select a single option from a predefined set of mutually exclusive choices. They are grouped using a radio group component which manages selection, keyboard navigation, and validation.

## Import

```typescript
import { GdsRadioGroup, GdsRadio } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRadioGroup label="Select an option">
    <GdsRadio label="Option 1" value="1" />
    <GdsRadio label="Option 2" value="2" />
    <GdsRadio label="Option 3" value="3" />
  </GdsRadioGroup>
</GdsTheme>
```

## Public API - GdsRadioGroup

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `''` | The label of the form control |
| `size` | `'large' \| 'small'` | `'large'` | Controls the font-size of label and supporting text on group form control header and single radio buttons respectively |
| `direction` | `'row' \| 'column'` | `'column'` | The direction in which radio buttons are displayed |
| `required` | `boolean` | `false` | The required attribute can be used to communicate to users of assistive technology that the control is required. Validation still needs to be done in a validator or equivalent |
| `invalid` | `boolean` | — | Validation state of the form control. Setting this to true triggers the invalid state of the control |
| `value` | `string` | — | Get or set the value of the form control |
| `disabled` | `boolean` | `false` | If the input is disabled |
| `supporting-text` | `string` | `''` | The supporting text displayed between the label and the field. This text provides additional context or information to the user |
| `show-extended-supporting-text` | `boolean` | `false` | Whether the supporting text should be displayed or not |
| `aria-invalid` | `boolean` | — | Validation state of the form control. Setting this to true triggers the invalid state of the control |
| `error-message` | `string` | `''` | This can be used to manually control the error message that will be displayed when the control is invalid |
| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `supportingText` | `string` | `''` | The supporting text displayed between the label and the field. This text provides additional context or information to the user |
| `showExtendedSupportingText` | `boolean` | `false` | Whether the supporting text should be displayed or not |
| `radios` | `GdsRadio[]` | — | Returns an array of `<GdsRadio>` elements in the radio group |
| `formAssociated` | `boolean` | `true` | Whether the element is form-associated |
| `validator` | `GdsValidator` | `undefined` | A validator that can be used to validate the form control and set an error message |
| `errorMessage` | `string` | `''` | This can be used to manually control the error message that will be displayed when the control is invalid |
| `form` | `HTMLFormElement` | — | The form element that the form control is associated with |
| `validity` | `ValidityState` | — | The validity state of the form control |
| `validationMessage` | `string` | — | The validation message |
| `willValidate` | `boolean` | — | Whether the control will be validated |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |
| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |

### Style Expression Properties

GdsRadioGroup extends GdsDiv and supports all style expression properties for layout:

| Property | Description |
|----------|-------------|
| `align-self` | Controls the align-self property. Supports all valid CSS align-self values |
| `justify-self` | Controls the justify-self property. Supports all valid CSS justify-self values |
| `place-self` | Controls the place-self property. Supports all valid CSS place-self values |
| `grid-column` | Controls the grid-column property. Supports all valid CSS grid-column values |
| `grid-row` | Controls the grid-row property. Supports all valid CSS grid-row values |
| `grid-area` | Controls the grid-area property. Supports all valid CSS grid-area values |
| `flex` | Controls the flex property. Supports all valid CSS flex values |
| `order` | Controls the order property. Supports all valid CSS order values |
| `margin` | Controls the margin property. Only accepts space tokens |
| `margin-inline` | Controls the margin-inline property. Only accepts space tokens |
| `margin-block` | Controls the margin-block property. Only accepts space tokens |
| `width` | Controls the width property. Supports space tokens and all valid CSS width values |
| `min-width` | Controls the min-width property. Supports space tokens and all valid CSS min-width values |
| `max-width` | Controls the max-width property. Supports space tokens and all valid CSS max-width values |
| `inline-size` | Controls the inline-size property. Supports space tokens and all valid CSS inline-size values |
| `min-inline-size` | Controls the min-inline-size property. Supports space tokens and all valid CSS min-inline-size values |
| `max-inline-size` | Controls the max-inline-size property. Supports space tokens and all valid CSS max-inline-size values |

### Events

| Name | Type | Description |
|------|------|-------------|
| `change` | `Event` | Fired when a radio button selection changes |
| `input` | `Event` | Fired when a radio button selection changes |
| `gds-validity-state` | `CustomEvent` | Dispatched when the validity state of the form control is changed by a validator |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from DOM |

### Slots

| Name | Description |
|------|-------------|
| `extended-supporting-text` | A longer supporting text that will be displayed in a panel when the user clicks the info button |
| (default) | Radio button elements (`<GdsRadio>`) |

## Radio vs Checkbox

| Control | Purpose |
|---------|---------|
| Checkbox | Multiple-selection control — allows one or more options to be selected. |
| Radio | Single-selection control — allows selecting one option from a set of mutually exclusive choices. |

## Anatomy

The radio group and radio button composition follows a consistent form-control anatomy:

Header
- Label — short, descriptive label for the group.
- Label support — short helper text directly under the label.
- Contextual help — optional info icon that reveals extended supporting text.

Body
- The interactive set of radio buttons (`GdsRadio`) with optional per-option supporting text.

Footer
- Error message — displayed when the group is invalid or a validator reports an error.

## Variants

- Default — standard radios with label and optional supporting text.
- Contained — radios rendered in a contained layout alongside other contained form components (use when visual grouping requires a more prominent surface).
- Contained extended (coming soon) — contained variant that includes extended label support and contextual help integrated into the contained surface.

## Features

- Label: Every radio group should have a descriptive label. Use the `label` attribute on `GdsRadioGroup` to provide a group header.
- Label support: Use `supporting-text` to provide short instructions or clarification. For long help content, use the `extended-supporting-text` slot.
- Contextual help: The info icon exposes `extended-supporting-text`. If space is limited, consider a tooltip; for long content use a modal or dedicated help page.
- Error message: Use validators or the `error-message` attribute to describe problems. When invalid, the group receives the `invalid` state and the message is rendered in the footer.

## Behaviour

- Mutual exclusivity: Only one radio in a group may be selected. Changing selection will uncheck the previous item automatically.
- Form association: `GdsRadioGroup` is form-associated and participates in form submission. Use the `value` attribute to read or set the selected value.
- Controlled usage: You can control selection from frameworks (React/Vue) by setting the `value` attribute and reacting to `change`/`input` events.

## Alignment

- Vertical (column): Default — best for legibility and scanning.
- Horizontal (row): Use only for small sets of options where space is constrained. Avoid long rows that require horizontal scrolling.

## Accessibility

- Use native semantics: Render radio groups using native input semantics (the underlying `GdsRadio` presents a native radio input). When possible, also wrap the group with a `<fieldset>` + `<legend>` to provide a clear programmatic label.
- Group labeling: Ensure the group is labelled either with `label`/`legend` or `aria-labelledby` so assistive technologies can announce the purpose of the group.
- Role fallback: If you must render a custom radiogroup without native inputs, ensure `role="radiogroup"` is present on the container and each option uses `role="radio"` with `aria-checked` and proper keyboard handling.
- Error announcements: When a group becomes invalid, update `aria-invalid="true"` and ensure the error message is reachable via `aria-describedby` from the group and individual radios if necessary.
- Disabled options: Mark disabled radios with `disabled` and avoid hiding options required for context. If you must hide an option, ensure the user understands why via supporting text or a help link.

## Keyboard interaction

- Tab / Shift+Tab: Move focus into and out of the radio group. The first tab stops on the currently checked radio, or on the first radio if none are checked.
- Arrow keys: Use Left/Up and Right/Down (or Up/Down in vertical lists) to move focus and selection between radios when the group is focused. Selection should follow focus for most radio patterns.
- Space / Enter: Activate the focused radio and select it if selection doesn't follow focus.

## Do's and Don'ts

Do
- Provide a group label (or legend) for every set of radios.
- Default to vertical alignment for long option lists.
- Use `supporting-text` and `extended-supporting-text` to explain edge cases and complex choices.

Don't
- Don't use radio buttons for non-mutually exclusive choices; use checkboxes instead.
- Don't present too many radio options in a single group — switch to text input, a picker, or a select when options are numerous.
- Don't mix contained and default radio styles within the same group — keep a consistent visual treatment.

## Public API - GdsRadio

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | `''` | The label displayed next to the radio button |
| `value` | `string` | `''` | The value of the radio button |
| `checked` | `boolean` | `false` | Whether the radio button is checked or not |
| `disabled` | `boolean` | `false` | Whether the radio button is disabled or not |
| `invalid` | `boolean` | `false` | Whether the radio button is invalid or not |
| `errorMessage` | `string` | `undefined` | The accessible error message text for the radio button. This text is not visually rendered, but will be announced by screen readers when the radio button is in an invalid state |
| `supporting-text` | `string` | `''` | The supporting text displayed below the label. This text provides additional context or information to the user |
| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `supportingText` | `string` | `''` | The supporting text displayed below the label. This text provides additional context or information to the user |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |
| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |

### Events

| Name | Type | Description |
|------|------|-------------|
| `input` | `Event` | Dispatched when the radio button is checked |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from DOM |

## Examples

### Basic Radio Group

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRadioGroup label="Select an option">
    <GdsRadio label="Radio Option 1" supporting-text="Supporting text" value="1" />
    <GdsRadio label="Radio Option 2" supporting-text="Supporting text" value="2" />
    <GdsRadio label="Radio Option 3" supporting-text="Supporting text" value="3" />
  </GdsRadioGroup>
</GdsTheme>
```

### With Validation

Radio groups support validation using Green Core's form validation API. The error message appears below the radio group and can be set either through a validator or explicitly using the `error-message` attribute.

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsFlex, GdsButton } from '@sebgroup/green-core/react'

function ValidatedRadioGroup() {
  return (
    <GdsTheme>
      <form method="dialog">
        <GdsFlex flex-direction="column" align-items="flex-start" gap="m">
          <GdsRadioGroup 
            label="Group Label" 
            supporting-text="Support text for the group"
            show-extended-supporting-text
            required
          >
            <span slot="extended-supporting-text">
              Extended supporting text for the group
            </span>
            <GdsRadio label="Radio Label" value="1" supporting-text="Example support text" />
            <GdsRadio label="Radio Label" value="2" supporting-text="Example support text" />
          </GdsRadioGroup>
          <GdsButton type="submit">Submit</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### Size Variants

Radio buttons support two sizes: large (default) and small.

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsFlex, GdsText, GdsDivider } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex gap="xl" margin="0 auto">
    <GdsFlex gap="s" flex-direction="column" flex="1">
      <GdsText tag="small">Size: Large (default)</GdsText>
      <GdsDivider opacity="0.1" />
      <GdsRadioGroup label="Group Label" supporting-text="Support text for the group">
        <GdsRadio label="Radio Label" value="1" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="2" supporting-text="Example support text" />
      </GdsRadioGroup>
    </GdsFlex>
    
    <GdsFlex gap="s" flex-direction="column" flex="1">
      <GdsText tag="small">Size: Small</GdsText>
      <GdsDivider opacity="0.1" />
      <GdsRadioGroup label="Group Label" supporting-text="Support text for the group" size="small">
        <GdsRadio label="Radio Label" value="1" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="2" supporting-text="Example support text" />
      </GdsRadioGroup>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Direction Options

Radio buttons can be arranged vertically (column, default) or horizontally (row).

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsFlex, GdsText, GdsDivider } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex gap="xl" margin="0 auto">
    <GdsFlex gap="s" flex-direction="column">
      <GdsText tag="small">Column (default)</GdsText>
      <GdsDivider opacity="0.1" />
      <GdsRadioGroup 
        label="Group Label" 
        supporting-text="Support text for the group"
        direction="column"
      >
        <GdsRadio label="Radio Label" value="1" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="2" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="3" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="4" supporting-text="Example support text" />
      </GdsRadioGroup>
    </GdsFlex>
    
    <GdsFlex gap="s" flex="1" flex-direction="column">
      <GdsText tag="small">Row</GdsText>
      <GdsDivider opacity="0.1" />
      <GdsRadioGroup 
        label="Group Label" 
        supporting-text="Support text for the group"
        direction="row"
        size="small"
      >
        <GdsRadio label="Radio Label" value="1" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="2" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="3" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="4" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="5" supporting-text="Example support text" />
        <GdsRadio label="Radio Label" value="6" supporting-text="Example support text" />
      </GdsRadioGroup>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Disabled State

Disabled radio buttons cannot be interacted with and appear visually muted. **Note: In general, this state should never be used. Instead, aim to explain to the user why the choice is wrong in an error message and make sure they understand how to correct it.**

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRadioGroup 
    label="Group Label" 
    supporting-text="Support text for the group"
    value="4"
  >
    <GdsRadio label="Radio Label" value="1" disabled supporting-text="Example support text" />
    <GdsRadio label="Radio Label" value="2" disabled supporting-text="Example support text" />
  </GdsRadioGroup>
</GdsTheme>
```

### Without Group Label

While radio groups can be created without a label, it's recommended to always provide one for clarity and accessibility. In certain cases when space is limited, the group label can be omitted.

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRadioGroup>
    <GdsRadio label="Radio Label" value="1" />
    <GdsRadio label="Radio Label" value="2" />
  </GdsRadioGroup>
</GdsTheme>
```

### Controlled Radio Group

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsButton, GdsFlex } from '@sebgroup/green-core/react'
import { useState } from 'react'

function ControlledRadioGroup() {
  const [selectedValue, setSelectedValue] = useState('1')

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    setSelectedValue(target.value)
  }

  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsRadioGroup 
          label="Select an option" 
          value={selectedValue}
          onChange={handleChange}
        >
          <GdsRadio label="Option 1" value="1" />
          <GdsRadio label="Option 2" value="2" />
          <GdsRadio label="Option 3" value="3" />
        </GdsRadioGroup>
        
        <GdsText>Selected value: {selectedValue}</GdsText>
        
        <GdsButton onClick={() => setSelectedValue('2')}>
          Select Option 2
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### With Extended Supporting Text

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsRadioGroup 
    label="Group Label" 
    supporting-text="Support text for the group"
    show-extended-supporting-text
  >
    <span slot="extended-supporting-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </span>
    <GdsRadio label="Radio Label" value="1" supporting-text="Example support text" />
    <GdsRadio label="Radio Label" value="2" supporting-text="Example support text" />
  </GdsRadioGroup>
</GdsTheme>
```

## TypeScript

```typescript
import type { GdsRadioGroupProps, GdsRadioProps } from '@sebgroup/green-core/react'

interface GdsRadioGroupProps {
  // Attributes
  label?: string
  size?: 'large' | 'small'
  direction?: 'row' | 'column'
  required?: boolean
  invalid?: boolean
  value?: string
  disabled?: boolean
  'supporting-text'?: string
  'show-extended-supporting-text'?: boolean
  'aria-invalid'?: boolean
  'error-message'?: string
  'gds-element'?: string

  // Properties
  supportingText?: string
  showExtendedSupportingText?: boolean
  validator?: GdsValidator
  errorMessage?: string

  // Style Expression Properties (extends GdsDiv)
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  flex?: string
  order?: string
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string

  // Events
  onChange?: (event: Event) => void
  onInput?: (event: Event) => void
  onGdsValidityState?: (event: CustomEvent) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void

  // Children
  children?: React.ReactNode
}

interface GdsRadioProps {
  // Attributes
  label?: string
  value?: string
  checked?: boolean
  disabled?: boolean
  invalid?: boolean
  errorMessage?: string
  'supporting-text'?: string
  'gds-element'?: string

  // Properties
  supportingText?: string

  // Events
  onInput?: (event: Event) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
}

// Usage example
const radioGroupProps: GdsRadioGroupProps = {
  label: 'Select an option',
  size: 'large',
  direction: 'column',
  required: true
}

const radioProps: GdsRadioProps = {
  label: 'Option 1',
  value: '1',
  'supporting-text': 'Additional information'
}
```

## Best Practices

### Labels and Values

1. **Always Provide Both Label and Value**: Every radio button must have both a label and a value:
   ```tsx
   // ✅ Good - both label and value provided
   <GdsRadio label="Radio Label" value="1" />
   
   // ❌ Bad - missing label
   <GdsRadio value="1" />
   
   // ❌ Bad - missing value
   <GdsRadio label="Radio Label" />
   ```

2. **Group Label**: Always provide a label for the radio group for clarity and accessibility:
   ```tsx
   // ✅ Good - clear group label
   <GdsRadioGroup label="Select your preferred method">
     <GdsRadio label="Email" value="email" />
     <GdsRadio label="Phone" value="phone" />
   </GdsRadioGroup>
   
   // ⚠️ Acceptable only in limited space situations
   <GdsRadioGroup>
     <GdsRadio label="Option 1" value="1" />
   </GdsRadioGroup>
   ```

### Selection Requirements

1. **Mutually Exclusive**: Radio buttons should represent mutually exclusive choices:
   ```tsx
   // ✅ Good - one choice from many
   <GdsRadioGroup label="Payment method">
     <GdsRadio label="Credit Card" value="card" />
     <GdsRadio label="Bank Transfer" value="bank" />
     <GdsRadio label="Invoice" value="invoice" />
   </GdsRadioGroup>
   
   // ❌ Bad - use checkboxes for multiple selections
   <GdsRadioGroup label="Select features">
     <GdsRadio label="Feature A" value="a" />
     <GdsRadio label="Feature B" value="b" />
   </GdsRadioGroup>
   ```

2. **Number of Options**: Use radio buttons for 2-5 options. For more options, consider a dropdown:
   ```tsx
   // ✅ Good - appropriate number of options
   <GdsRadioGroup label="Size">
     <GdsRadio label="Small" value="s" />
     <GdsRadio label="Medium" value="m" />
     <GdsRadio label="Large" value="l" />
   </GdsRadioGroup>
   ```

### Layout and Direction

1. **Choose Appropriate Direction**: Use column for clarity, row for compact layouts:
   ```tsx
   // ✅ Good - column for clear separation (default)
   <GdsRadioGroup label="Priority" direction="column">
     <GdsRadio label="High" value="high" />
     <GdsRadio label="Medium" value="medium" />
     <GdsRadio label="Low" value="low" />
   </GdsRadioGroup>
   
   // ✅ Good - row for compact layout
   <GdsRadioGroup label="Size" direction="row" size="small">
     <GdsRadio label="S" value="s" />
     <GdsRadio label="M" value="m" />
     <GdsRadio label="L" value="l" />
   </GdsRadioGroup>
   ```

2. **Size Selection**: Use small size for space-constrained layouts:
   ```tsx
   // ✅ Good - small size for compact forms
   <GdsRadioGroup label="Quick selection" size="small" direction="row">
     <GdsRadio label="Yes" value="yes" />
     <GdsRadio label="No" value="no" />
   </GdsRadioGroup>
   ```

### Disabled State

1. **Avoid Disabled State**: Instead of disabling, explain why an option is unavailable:
   ```tsx
   // ✅ Better - explain why option is unavailable
   <GdsRadioGroup label="Shipping method">
     <GdsRadio label="Express (Not available for your location)" value="express" />
     <GdsRadio label="Standard" value="standard" />
   </GdsRadioGroup>
   
   // ❌ Avoid - disabled without explanation
   <GdsRadioGroup label="Shipping method">
     <GdsRadio label="Express" value="express" disabled />
     <GdsRadio label="Standard" value="standard" />
   </GdsRadioGroup>
   ```

### Validation

1. **Provide Clear Error Messages**: Use meaningful error messages:
   ```tsx
   // ✅ Good - clear error message
   <GdsRadioGroup 
     label="Select your country" 
     required
     error-message="Please select a country to continue"
   >
     <GdsRadio label="Sweden" value="se" />
     <GdsRadio label="Norway" value="no" />
   </GdsRadioGroup>
   ```

2. **Required Fields**: Mark required fields clearly:
   ```tsx
   // ✅ Good - required attribute set
   <GdsRadioGroup 
     label="Terms and conditions" 
     required
     supporting-text="You must accept the terms to continue"
   >
     <GdsRadio label="I accept" value="accept" />
     <GdsRadio label="I decline" value="decline" />
   </GdsRadioGroup>
   ```

### Supporting Text

1. **Use Supporting Text Wisely**: Provide context without overwhelming:
   ```tsx
   // ✅ Good - concise supporting text
   <GdsRadioGroup 
     label="Newsletter frequency" 
     supporting-text="How often would you like to receive updates?"
   >
     <GdsRadio label="Daily" value="daily" />
     <GdsRadio label="Weekly" value="weekly" />
   </GdsRadioGroup>
   ```

2. **Extended Supporting Text**: Use for detailed explanations:
   ```tsx
   // ✅ Good - extended text for complex scenarios
   <GdsRadioGroup 
     label="Data sharing preference"
     show-extended-supporting-text
   >
     <span slot="extended-supporting-text">
       We may share your data with trusted partners to improve our services.
       You can change this preference at any time in your account settings.
     </span>
     <GdsRadio label="Allow" value="allow" />
     <GdsRadio label="Decline" value="decline" />
   </GdsRadioGroup>
   ```

## Common Use Cases

### Basic Selection Form

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsFlex, GdsButton } from '@sebgroup/green-core/react'
import { useState } from 'react'

function SelectionForm() {
  const [method, setMethod] = useState('')

  const handleSubmit = (e: Event) => {
    e.preventDefault()
    console.log('Selected method:', method)
  }

  return (
    <GdsTheme>
      <form onSubmit={handleSubmit}>
        <GdsFlex flex-direction="column" gap="m">
          <GdsRadioGroup 
            label="Contact method" 
            value={method}
            onChange={(e) => setMethod((e.target as HTMLInputElement).value)}
            required
          >
            <GdsRadio label="Email" value="email" supporting-text="We'll send updates to your email" />
            <GdsRadio label="Phone" value="phone" supporting-text="We'll call you during business hours" />
            <GdsRadio label="SMS" value="sms" supporting-text="You'll receive text messages" />
          </GdsRadioGroup>
          
          <GdsButton type="submit">Continue</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### Multi-Section Form

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsFlex, GdsCard } from '@sebgroup/green-core/react'
import { useState } from 'react'

function MultiSectionForm() {
  const [formData, setFormData] = useState({
    priority: '',
    category: '',
    urgency: ''
  })

  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="xl">
        <GdsCard padding="l">
          <GdsFlex flex-direction="column" gap="m">
            <GdsRadioGroup 
              label="Priority level" 
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: (e.target as HTMLInputElement).value})}
            >
              <GdsRadio label="High" value="high" />
              <GdsRadio label="Medium" value="medium" />
              <GdsRadio label="Low" value="low" />
            </GdsRadioGroup>
            
            <GdsRadioGroup 
              label="Category" 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: (e.target as HTMLInputElement).value})}
            >
              <GdsRadio label="Technical" value="technical" />
              <GdsRadio label="Billing" value="billing" />
              <GdsRadio label="General" value="general" />
            </GdsRadioGroup>
          </GdsFlex>
        </GdsCard>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Compact Horizontal Layout

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

function CompactSelection() {
  return (
    <GdsTheme>
      <GdsRadioGroup 
        label="Size" 
        direction="row" 
        size="small"
      >
        <GdsRadio label="XS" value="xs" />
        <GdsRadio label="S" value="s" />
        <GdsRadio label="M" value="m" />
        <GdsRadio label="L" value="l" />
        <GdsRadio label="XL" value="xl" />
      </GdsRadioGroup>
    </GdsTheme>
  )
}
```

### Yes/No Decision

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme } from '@sebgroup/green-core/react'

function YesNoDecision() {
  return (
    <GdsTheme>
      <GdsRadioGroup 
        label="Do you accept the terms and conditions?" 
        direction="row"
        required
      >
        <GdsRadio label="Yes, I accept" value="yes" />
        <GdsRadio label="No, I decline" value="no" />
      </GdsRadioGroup>
    </GdsTheme>
  )
}
```

### With Conditional Content

```tsx
import { GdsRadioGroup, GdsRadio, GdsTheme, GdsFlex, GdsInput } from '@sebgroup/green-core/react'
import { useState } from 'react'

function ConditionalRadioForm() {
  const [contactMethod, setContactMethod] = useState('')

  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsRadioGroup 
          label="Preferred contact method" 
          value={contactMethod}
          onChange={(e) => setContactMethod((e.target as HTMLInputElement).value)}
        >
          <GdsRadio label="Email" value="email" />
          <GdsRadio label="Phone" value="phone" />
          <GdsRadio label="Mail" value="mail" />
        </GdsRadioGroup>
        
        {contactMethod === 'email' && (
          <GdsInput label="Email address" type="email" required />
        )}
        
        {contactMethod === 'phone' && (
          <GdsInput label="Phone number" type="tel" required />
        )}
        
        {contactMethod === 'mail' && (
          <GdsInput label="Postal address" required />
        )}
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Related Components

- [GdsCheckbox](./GdsCheckbox.md) — For multiple selections or boolean values
- [GdsSegmentedControl](./GdsSegmentedControl.md) — For view switching and immediate selection feedback
- [GdsDropdown](./GdsDropdown.md) — For single selection from many options (>5)
- [GdsInput](./GdsInput.md) — For text input fields
- [GdsFormSummary](./GdsFormSummary.md) — For form validation error summary
- [GdsButton](./GdsButton.md) — For form submission
- [GdsFlex](./GdsFlex.md) — For layout of form controls
- [GdsCard](./GdsCard.md) — For grouping related form sections
- [GdsDivider](./GdsDivider.md) — For separating form sections

## Accessibility

- **Labels**: Always provide labels for both the group and individual radio buttons
- **Keyboard Navigation**: Full keyboard support:
  - Tab to focus the radio group
  - Arrow keys to navigate between options
  - Space to select the focused option
- **Screen Readers**: Proper ARIA attributes and announcements
- **Required Fields**: Use `required` attribute to communicate to assistive technology
- **Error Messages**: Use `error-message` attribute for accessible error announcements
- **Supporting Text**: Additional context announced by screen readers

## Notes

- **Mutually Exclusive**: Radio buttons are for selecting one option from multiple choices
- **Group Management**: GdsRadioGroup handles selection state, keyboard navigation, and validation
- **Two Sizes**: Large (default) for standard forms, small for compact layouts
- **Two Directions**: Column (default) for clarity, row for horizontal compact layouts
- **Form Associated**: Radio groups are form-associated elements and integrate with native form validation
- **Validation**: Supports Green Core's form validation API with custom validators
- **Extended Supporting Text**: Use slot for longer explanatory text with info button
- **Disabled State**: Should be avoided - explain why choices are unavailable instead
- **Style Expression Properties**: Extends GdsDiv with all layout properties (margin, width, flex, grid, etc.)
- **Best Practice**: 2-5 options ideal for radio buttons; use dropdown for more options
- **Always Provide Value**: Each radio button must have a unique value attribute
- **Single Selection**: Only one radio button can be selected at a time within a group

---

*Last updated: November 12, 2025*  
*Source: [GdsRadio Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-radio--docs)*
