# GdsCheckbox Component Documentation

## Overview
A checkbox is a form element that allows users to select one or multiple options. Checkboxes can be grouped together using `GdsCheckboxGroup`, which makes value management and validation easier.

## Radio vs. Checkbox

- **Radio**: Use when the user must choose exactly one option from a set (single-select). Radios should be grouped and always include a group label.
- **Checkbox**: Use when users can choose one or more options (multi-select). Use checkbox groups for related options and provide a group label.

## Anatomy (Header / Body / Footer)

- **Header**: Group label, optional optional-indicator, supporting text, contextual help (tooltip or info icon)
- **Body**: Individual checkbox rows (checkbox input + label + per-option supporting text)
- **Footer**: Validation or error message area

## Important React Usage Note
⚠️ **In React, always use the JSX element imports from `@sebgroup/green-core/react`:**
- `GdsCheckbox` (React component)
- `GdsCheckboxGroup` (React component)
- `GdsTheme` (React component)

**Never use the HTML custom elements directly:**
- ❌ `<gds-checkbox>` 
- ❌ `<gds-checkbox-group>`
- ❌ `<gds-theme>`

## Import

```tsx
import { GdsCheckboxGroup, GdsCheckbox, GdsTheme } from '@sebgroup/green-core/react'
```

## Basic Usage

### Single Checkbox

```tsx
<GdsCheckbox 
  label="Checkbox Label" 
  value="1" 
  checked={true}
/>
```

### Checkbox Group

```tsx
<GdsTheme>
  <GdsCheckboxGroup label="Pick an option" supporting-text="Label support text">
    <GdsCheckbox 
      label="Checkbox Option 1" 
      supporting-text="Supporting text" 
      value="1"
    />
    <GdsCheckbox 
      label="Checkbox Option 2" 
      supporting-text="Supporting text" 
      value="2" 
      checked={true}
    />
    <GdsCheckbox 
      label="Checkbox Option 3" 
      supporting-text="Supporting text" 
      value="3"
    />
  </GdsCheckboxGroup>
</GdsTheme>
```

## React Hook Form Integration

### Single Boolean Checkbox

```tsx
<Controller
  name="emailAlerts"
  control={control}
  render={({ field }) => (
    <GdsCheckbox
      label="Email alerts"
      supporting-text="Receive account notifications via email"
      checked={field.value as boolean}
      onChange={(ev: unknown) => {
        const maybe = ev as { detail?: { value?: boolean }; target?: { checked?: boolean } } | undefined
        field.onChange(maybe?.detail?.value ?? maybe?.target?.checked ?? false)
      }}
    />
  )}
/>
```

### Checkbox Array (Multiple Selection)

```tsx
const SERVICES = [
  { value: 'online-banking', label: 'Online Banking' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'phone-banking', label: 'Phone Banking' },
]

// In form defaultValues:
// bankingServices: []

{SERVICES.map((service) => (
  <Controller
    key={service.value}
    name="bankingServices"
    control={control}
    render={({ field }) => (
      <GdsCheckbox
        label={service.label}
        value={service.value}
        checked={field.value.includes(service.value)}
        onChange={(ev: unknown) => {
          const maybe = ev as { detail?: { value?: boolean }; target?: { checked?: boolean } } | undefined
          const checked = maybe?.detail?.value ?? maybe?.target?.checked ?? false
          const newValue = checked
            ? [...field.value, service.value]
            : field.value.filter((v) => v !== service.value)
          field.onChange(newValue)
        }}
      />
    )}
  />
))}
```

## GdsCheckboxGroup API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | The label of the form control |
| `size` | `'large' \| 'small'` | `'large'` | Controls the font-size of label and supporting text |
| `direction` | `'row' \| 'column'` | `'column'` | The direction in which checkbox buttons are displayed |
| `value` | `string[]` | - | Get or set the value of the form control |
| `required` | `boolean` | `false` | Whether the control is required |
| `invalid` | `boolean` | `false` | Validation state of the form control |
| `disabled` | `boolean` | `false` | If the input is disabled |
| `supporting-text` | `string` | `''` | Supporting text displayed between label and field |
| `show-extended-supporting-text` | `boolean` | `false` | Whether to display extended supporting text |
| `aria-invalid` | `boolean` | - | Validation state for accessibility |
| `error-message` | `string` | `''` | Error message displayed when invalid |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `supportingText` | `string` | The supporting text (JS property name) |
| `showExtendedSupportingText` | `boolean` | Whether to show extended text (JS property name) |
| `checkboxes` | `GdsCheckbox[]` | Returns array of checkbox elements in group |
| `validator` | `GdsValidator` | Validator for form control |
| `errorMessage` | `string` | Error message (JS property name) |
| `form` | `HTMLFormElement` | The form element that the control is associated with |
| `validity` | `ValidityState` | The validity state object |
| `validationMessage` | `string` | The validation message |
| `willValidate` | `boolean` | Whether the control will be validated |

### Slots

| Slot | Description |
|------|-------------|
| `extended-supporting-text` | Slot for extended supporting text content (HTML allowed) |

### Style Expression Properties

GdsCheckboxGroup supports style expression properties for layout control:

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

| Event | Description |
|-------|-------------|
| `gds-validity-state` | Dispatched when validity state changes |
| `gds-element-disconnected` | When element is disconnected from DOM |

## GdsCheckbox API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | **Required** - The label displayed next to the checkbox |
| `value` | `string` | - | **Required** - The value of the checkbox |
| `checked` | `boolean` | `false` | Whether the checkbox is checked |
| `indeterminate` | `boolean` | `false` | Indeterminate state for parent/group selections |
| `disabled` | `boolean` | `false` | Whether the checkbox is disabled |
| `required` | `boolean` | `false` | Whether the checkbox is required |
| `invalid` | `boolean` | `false` | Validation state |
| `supporting-text` | `string` | `''` | Supporting text displayed below the label |
| `aria-invalid` | `boolean` | - | Validation state for accessibility |
| `error-message` | `string` | `''` | Error message when invalid |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `supportingText` | `string` | The supporting text (JS property name) |
| `validator` | `GdsValidator` | Validator for form control |
| `errorMessage` | `string` | Error message (JS property name) |
| `form` | `HTMLFormElement` | The form element that the control is associated with |
| `validity` | `ValidityState` | The validity state object |
| `validationMessage` | `string` | The validation message |
| `willValidate` | `boolean` | Whether the control will be validated |

### Events

| Event | Description |
|-------|-------------|
| `input` | Dispatched when checkbox is checked/unchecked |
| `change` | Dispatched when checkbox is checked/unchecked |
| `gds-validity-state` | Dispatched when validity state changes |
| `gds-element-disconnected` | When element is disconnected from DOM |

## Features

### Sizes
Checkboxes support two sizes:
- **Large (default)**: Standard size for most use cases
- **Small**: Compact size for space-constrained layouts

```tsx
<GdsCheckboxGroup size="small">
  <GdsCheckbox label="Option 1" value="1" />
  <GdsCheckbox label="Option 2" value="2" />
</GdsCheckboxGroup>
```

### Direction
Checkboxes can be arranged in two directions:
- **Column (default)**: Vertical stacking for clear separation
- **Row**: Horizontal alignment for compact layouts (wraps to new line when needed)

```tsx
<GdsCheckboxGroup direction="row">
  <GdsCheckbox label="Option 1" value="1" />
  <GdsCheckbox label="Option 2" value="2" />
  <GdsCheckbox label="Option 3" value="3" />
</GdsCheckboxGroup>
```

### Indeterminate State
Used when a checkbox represents a group with mixed selected states:
- Parent checkboxes in tree structures
- "Select all" checkboxes when some items are selected
- Bulk actions with partial selections

```tsx
<GdsCheckbox 
  label="Select all" 
  value="all" 
  indeterminate={true}
/>
```

#### Group Accessibility (Fieldset + Legend)

When a group of checkboxes represent related options, prefer wrapping them in a `fieldset` with a `legend` (or ensure `GdsCheckboxGroup` provides an accessible legend). Use `aria-describedby` on the group to reference supporting text or error messages.

```tsx
<fieldset>
  <legend>Choose features</legend>
  <GdsCheckboxGroup supporting-text="Select available features">
    <GdsCheckbox label="Feature A" value="a" />
    <GdsCheckbox label="Feature B" value="b" />
  </GdsCheckboxGroup>
</fieldset>
```

#### Parent-Child Example (Indeterminate behaviour)

```tsx
function ParentChildCheckboxes() {
  const [children, setChildren] = useState([false, true, false])

  const allChecked = children.every(Boolean)
  const someChecked = children.some(Boolean) && !allChecked

  return (
    <GdsTheme>
      <GdsCheckbox
        label="Select all"
        value="all"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={(e: any) => {
          const checked = e.detail?.value ?? e.target?.checked
          setChildren(children.map(() => !!checked))
        }}
      />

      {children.map((checked, i) => (
        <GdsCheckbox
          key={i}
          label={`Item ${i + 1}`}
          value={`item-${i}`}
          checked={checked}
          onChange={(e: any) => {
            const newChecked = e.detail?.value ?? e.target?.checked
            const next = [...children]
            next[i] = !!newChecked
            setChildren(next)
          }}
        />
      ))}
    </GdsTheme>
  )
}
```

### Validation
Checkbox groups support validation using Green Core's form validation API.

```tsx
<GdsTheme>
  <form method="dialog">
    <GdsCheckboxGroup 
      label="Required Selection" 
      name="checkbox-group"
      required={true}
      invalid={hasError}
      error-message="Please select at least one option"
    >
      <GdsCheckbox label="Option 1" value="1" />
      <GdsCheckbox label="Option 2" value="2" />
    </GdsCheckboxGroup>
    <GdsButton type="submit">Submit</GdsButton>
  </form>
</GdsTheme>
```

### Extended Supporting Text
Use the `extended-supporting-text` slot for longer explanatory text that supports the checkbox group:

```tsx
<GdsTheme>
  <form method="dialog">
    <GdsFlex flex-direction="column" align-items="flex-start" gap="m">
      <GdsCheckboxGroup 
        label="Group Label" 
        name="checkbox-group" 
        supporting-text="Support text for the group" 
        show-extended-supporting-text={true}
      >
        <span slot="extended-supporting-text">
          Extended supporting text for the group. This can contain more detailed
          information or instructions for users.
        </span>
        <GdsCheckbox 
          label="Checkbox Label" 
          value="1" 
          supporting-text="Example support text"
        />
        <GdsCheckbox 
          label="Checkbox Label" 
          value="2" 
          supporting-text="Example support text"
        />
      </GdsCheckboxGroup>
      <GdsButton type="submit">Submit</GdsButton>
    </GdsFlex>
  </form>
</GdsTheme>
```

## Best Practices

### ✅ DO
- Always provide both `label` and `value` attributes
- Use `supporting-text` for additional context
- Use checkbox groups for related options
- Provide clear, concise labels
- Use proper `label` attribute (not children)

### Accessibility tips

- Ensure group labels are programmatically associated with checkbox groups (fieldset/legend or accessible name on `GdsCheckboxGroup`).
- Use `aria-describedby` to point to supporting text or error messages.
- Always expose the indeterminate state via the `indeterminate` property — do not simulate it visually only.
- Avoid placing links inside checkbox labels; place links adjacent to the control and outside the interactive area.

```tsx
<GdsCheckbox 
  label="Accept terms and conditions" 
  supporting-text="You must accept to continue"
  value="terms"
/>
```

### ❌ DON'T
- Never exclude the label
- Never exclude the value
- Don't use children for label text
- Don't use disabled state unless absolutely necessary

- Don't use checkboxes to toggle settings (use `GdsSwitch` for on/off toggles).
- Don't overwhelm users with long lists of checkboxes — use a multi-select dropdown for large option sets.
- Don't mix default and contained checkbox variants within the same group.

```tsx
{/* ❌ WRONG - Using children for label */}
<GdsCheckbox value="1">
  My Label
</GdsCheckbox>

{/* ❌ WRONG - Missing value */}
<GdsCheckbox label="My Label" />

{/* ✅ CORRECT */}
<GdsCheckbox label="My Label" value="1" />
```

## Disabled State
⚠️ **Avoid using disabled state** - In general, this state should never be used. Instead, explain to users why a choice is wrong in an error message and help them understand how to correct it.

```tsx
<GdsCheckbox 
  label="Option" 
  value="1" 
  disabled={true}
/>
```

## Common Patterns

### Checkbox with Helper Text
```tsx
<GdsCheckbox
  label="Two-Factor Authentication"
  supporting-text="Extra security for transactions"
  value="2fa"
  checked={twoFactorEnabled}
  onChange={handleChange}
/>
```

### Checkbox Group without Label
While not recommended, groups can omit the main label in space-limited scenarios:

```tsx
<GdsCheckboxGroup>
  <GdsCheckbox label="Option 1" value="1" />
  <GdsCheckbox label="Option 2" value="2" />
</GdsCheckboxGroup>
```

### Multiple Selection with State Management
```tsx
const [selectedServices, setSelectedServices] = useState<string[]>([])

<GdsCheckboxGroup label="Banking Services">
  {SERVICES.map(service => (
    <GdsCheckbox
      key={service.value}
      label={service.label}
      value={service.value}
      checked={selectedServices.includes(service.value)}
      onChange={(ev) => {
        const checked = (ev as any)?.target?.checked ?? false
        setSelectedServices(prev => 
          checked 
            ? [...prev, service.value]
            : prev.filter(v => v !== service.value)
        )
      }}
    />
  ))}
</GdsCheckboxGroup>
```

### Size Comparison
```tsx
<GdsFlex gap="xl" margin="0 auto">
  <GdsFlex gap="s" flex-direction="column" flex="1">
    <GdsText tag="small">Size: Large (default)</GdsText>
    <GdsDivider opacity="0.1" />
    <GdsCheckboxGroup 
      label="Group Label" 
      supporting-text="Support text for the group"
      show-extended-supporting-text={true}
    >
      <span slot="extended-supporting-text">
        Extended supporting text for the group
      </span>
      <GdsCheckbox 
        label="Checkbox Label" 
        value="1" 
        supporting-text="Example support text" 
        checked={true}
      />
      <GdsCheckbox 
        label="Checkbox Label" 
        value="2" 
        supporting-text="Example support text"
      />
    </GdsCheckboxGroup>
  </GdsFlex>
  
  <GdsFlex gap="s" flex-direction="column" flex="1">
    <GdsText tag="small">Size: Small</GdsText>
    <GdsDivider opacity="0.1" />
    <GdsCheckboxGroup 
      label="Group Label" 
      supporting-text="Support text for the group" 
      size="small"
      show-extended-supporting-text={true}
    >
      <span slot="extended-supporting-text">
        Extended supporting text for the group
      </span>
      <GdsCheckbox 
        label="Checkbox Label" 
        value="1" 
        supporting-text="Example support text"
      />
      <GdsCheckbox 
        label="Checkbox Label" 
        value="2" 
        supporting-text="Example support text"
      />
    </GdsCheckboxGroup>
  </GdsFlex>
</GdsFlex>
```

### Direction Layout
```tsx
<GdsFlex gap="xl" margin="0 auto">
  <GdsFlex gap="s" flex-direction="column">
    <GdsText tag="small">Column (default)</GdsText>
    <GdsDivider opacity="0.1" />
    <GdsCheckboxGroup 
      label="Group Label" 
      supporting-text="Support text for the group"
      show-extended-supporting-text={true}
    >
      <span slot="extended-supporting-text">
        Extended supporting text for the group
      </span>
      <GdsCheckbox label="Checkbox Label" value="1" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="2" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="3" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="4" supporting-text="Example support text" />
    </GdsCheckboxGroup>
  </GdsFlex>
  
  <GdsFlex gap="s" flex="1" flex-direction="column">
    <GdsText tag="small">Row (wraps when needed)</GdsText>
    <GdsDivider opacity="0.1" />
    <GdsCheckboxGroup 
      label="Group Label" 
      supporting-text="Support text for the group" 
      size="small" 
      direction="row"
      show-extended-supporting-text={true}
    >
      <span slot="extended-supporting-text">
        Extended supporting text for the group
      </span>
      <GdsCheckbox label="Checkbox Label" value="1" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="2" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="3" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="4" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="5" supporting-text="Example support text" />
      <GdsCheckbox label="Checkbox Label" value="6" supporting-text="Example support text" />
    </GdsCheckboxGroup>
  </GdsFlex>
</GdsFlex>
```

### Hierarchical Selection with Indeterminate
```tsx
const [parentChecked, setParentChecked] = useState(false)
const [selectedChildren, setSelectedChildren] = useState<string[]>([])
const childOptions = ['child-1', 'child-2', 'child-3']

const isIndeterminate = selectedChildren.length > 0 && selectedChildren.length < childOptions.length

<GdsFlex flex-direction="column" gap="m">
  <GdsCheckbox 
    label="Select all" 
    value="parent" 
    checked={selectedChildren.length === childOptions.length}
    indeterminate={isIndeterminate}
    onChange={(ev) => {
      const checked = (ev as any)?.target?.checked ?? false
      setSelectedChildren(checked ? childOptions : [])
    }}
  />
  
  <GdsCheckboxGroup margin-inline="l">
    {childOptions.map(option => (
      <GdsCheckbox
        key={option}
        label={`Option ${option}`}
        value={option}
        checked={selectedChildren.includes(option)}
        onChange={(ev) => {
          const checked = (ev as any)?.target?.checked ?? false
          setSelectedChildren(prev => 
            checked 
              ? [...prev, option]
              : prev.filter(v => v !== option)
          )
        }}
      />
    ))}
  </GdsCheckboxGroup>
</GdsFlex>
```

## Migration Notes

If you have existing code using children for labels, update it:

```tsx
{/* Before ❌ */}
<GdsCheckbox checked={value} onChange={handler}>
  My Label
</GdsCheckbox>

{/* After ✅ */}
<GdsCheckbox 
  label="My Label" 
  value="my-value"
  checked={value} 
  onChange={handler}
/>
```

## Related Components
- [GdsDropdown](./GdsDropdown.md) - For single/multiple selection from many options
- [GdsFilterChip](./GdsFilterChip.md) - For filtering content with selectable chips
- [GdsFormSummary](./GdsFormSummary.md) - For displaying form validation errors
- [GdsRadioGroup](./GdsRadioGroup.md) - For single-selection options
- [GdsSegmentedControl](./GdsSegmentedControl.md) - For view switching with single selection
- [GdsSwitch](./GdsSwitch.md) - For binary on/off states
- [GdsInput](./GdsInput.md) - For text input fields
- [GdsFlex](./GdsFlex.md) - For flexible layout of checkbox groups
- [GdsCard](./GdsCard.md) - For grouping related checkboxes visually
- [GdsButton](./GdsButton.md) - For form submission with checkbox data

## Accessibility

- Always provide clear, descriptive labels for checkboxes and groups
- Use `required` attribute to communicate required fields to assistive technology
- The `supporting-text` helps screen readers understand context
- Checkbox groups automatically associate labels with form controls
- Use `aria-invalid` for validation state communication
- Indeterminate state is announced by screen readers
- Keyboard navigation: Space to toggle, Tab to navigate between checkboxes

## References
- [Green Core Checkbox Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-checkbox--docs)
- [Form Validation](../../guides/forms-specification.md)
- [Icons Documentation](./Icons.md)

```markdown
# green-core-gdscheckbox

This document summarizes the SEB Green Core Checkbox and Checkbox Group components and provides usage guidance for this project.

## Overview

Checkboxes allow users to select one or more options. They can be used individually or grouped using `GdsCheckboxGroup` for easier value management and validation.

Groups support vertical and horizontal layouts, and can present supporting text beneath individual checkboxes.

## Import

React / JSX usage (Green Core React wrapper):

```tsx
import { GdsCheckbox, GdsCheckboxGroup } from '@sebgroup/green-core/react'
```

## Common attributes / props

- `label` — the label text for the checkbox or group.
- `supporting-text` / `supportingText` — additional descriptive text shown under the label.
- `value` — the value of the checkbox (useful in groups).
- `checked` / `defaultChecked` — boolean state for the checkbox.
- `direction` — `row` or `column` for checkbox group layout.
- `size` — `large` (default) or `small`.
- `disabled` — disables the control.
- `required` — sets the control as required for accessibility; validation still needed separately.

## Usage examples

### Single checkbox

```tsx
<GdsCheckbox checked={checked} onChange={(ev) => setChecked(ev?.target?.checked ?? false)}>Accept terms</GdsCheckbox>
```

### Checkbox group

```tsx
<GdsCheckboxGroup label="Pick an option" supporting-text="Label support text.">
  <GdsCheckbox label="Checkbox Option 1" supporting-text="Supporting text" value="1" />
  <GdsCheckbox label="Checkbox Option 2" supporting-text="Supporting text" value="2" checked />
  <GdsCheckbox label="Checkbox Option 3" supporting-text="Supporting text" value="3" />
</GdsCheckboxGroup>
```

## Validation

Checkbox groups support validation via Green Core's validator API or by manual validation in your form logic. Use the `error-message` attribute or the group's `invalid` prop to surface errors.

## Accessibility

- Always include a label for checkbox groups and individual checkboxes where appropriate.
- Use `required` and ARIA attributes to help assistive technologies announce state.

## Recommendation for this project

- Use `GdsCheckbox` and `GdsCheckboxGroup` in React forms (react-hook-form works well with controlled components and Green Core's event payloads).
- When integrating with react-hook-form, use the `Controller` to map Green Core change events to field values. See `src/pages/FormPage.tsx` for an example pattern.

Saved on: Nov 01, 2025
```
