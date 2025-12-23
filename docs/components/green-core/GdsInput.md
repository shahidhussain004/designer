# GdsInput

An input component that lets users enter and edit text or numerical values in forms with built-in validation support.

## Overview

GdsInput is a comprehensive form input component that extends native HTML input capabilities with Green Core's design system integration. It provides built-in validation, character counting, clearable functionality, icon slots, and full form association support.

**Key Features:**
- **Built-in Validation**: Form validation using Constraint Validation API
- **Multiple Input Types**: text, email, password, number, date, tel, url, search, and more
- **Icon Slots**: Lead and trail slots for icons or badges
- **Clearable**: Optional clear button for quick text removal
- **Character Counter**: Automatic character counting with customizable badge
- **Supporting Text**: Regular and extended supporting text with info icon
- **Form Association**: Full form integration with ElementInternals
- **Accessibility**: ARIA support and semantic HTML
- **Sizing**: Large (default) and small size variants
- **Style Expressions**: Full style expression property support

## Anatomy

GdsInput (and similar form controls) are composed from three logical regions:

- **Header**: contains the `label`, optional supporting text, contextual help (info icon) and extended supporting content.
- **Body**: the input field itself with optional `lead` and `trail` slots (icons, badges, clear button).
- **Footer**: character counter, dynamic information and error message area.

Each region is configurable and can be hidden with the `plain` attribute while retaining proper accessibility.

## Variants

- **Default**: Standard input with visible label and supporting text.
- **Floating label (coming soon)**: label inside the field that floats when the field receives focus or has a value. Floating labels have additional accessibility considerations: placeholders should not be used as the primary label, and extended supporting text may be less discoverable. Use floating labels only in compact UIs where you can ensure sufficient contrast and visibility.

## Character counter behaviour

- When `maxlength` is set the character counter appears in the footer and shows remaining characters. The `charCounterCallback` can be used to customise the numeric display and badge variant (information/warning/negative) based on remaining characters.
- For accessibility, the counter is connected to the input via `aria-describedby` so screen readers announce remaining characters when relevant.

## Clear Button Accessibility

- The clear button is only rendered when `clearable` is true and the field has content. Ensure the clear button has an accessible label; the React wrapper adds a sensible label by default but you can override via the `aria-label` attribute on the clear button slot if needed.
- Keyboard: the clear button is reachable by Tab, and pressing Escape also clears the field when `clearable` is enabled.


## Import

```tsx
// Use as JSX element in React
import { GdsInput } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsInput 
    label="Email Address"
    type="email"
    placeholder="Enter your email"
  />
</GdsTheme>
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | The label of the form control. |
| `size` | `'large' \| 'small'` | `'large'` | Controls the font-size of texts and height of the field. |
| `clearable` | `boolean` | `false` | Whether the field should be clearable. Displays a clear button when the field has a value. |
| `maxlength` | `number` | `undefined` | The maximum number of characters allowed in the field. |
| `plain` | `boolean` | `false` | Hides the header and footer, while keeping the accessible label. Always set the label attribute. |
| `type` | `string` | `'text'` | The type of input. Supported: `'text'`, `'email'`, `'password'`, `'number'`, `'date'`, `'datetime-local'`, `'tel'`, `'url'`, `'search'`, `'time'`, `'week'`, `'month'` |
| `min` | `number \| string` | `undefined` | The input's minimum value. Only applies to date and number input types. |
| `max` | `number \| string` | `undefined` | The input's maximum value. Only applies to date and number input types. |
| `step` | `number \| 'any'` | `undefined` | Specifies the granularity for numeric values. Only applies to date and number input types. |
| `autocapitalize` | `'off' \| 'none' \| 'on' \| 'sentences' \| 'words' \| 'characters'` | `'off'` | Controls automatic capitalization. |
| `autocorrect` | `boolean` | `false` | Indicates whether the browser's autocorrect feature is on or off. |
| `autocomplete` | `string` | `undefined` | Specifies browser assistance in filling form fields. See [MDN autocomplete values](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete). |
| `autofocus` | `boolean` | `false` | Indicates that the input should receive focus on page load. |
| `enterkeyhint` | `'' \| 'enter' \| 'done' \| 'go' \| 'next' \| 'previous' \| 'search' \| 'send'` | `''` | Customizes the label or icon of the Enter key on virtual keyboards. |
| `spellcheck` | `boolean` | `true` | Enables spell checking on the input. |
| `inputmode` | `'' \| 'none' \| 'text' \| 'decimal' \| 'numeric' \| 'tel' \| 'search' \| 'email' \| 'url'` | `''` | Tells the browser what type of data will be entered, allowing appropriate virtual keyboard display. |
| `value` | `string` | `''` | Get or set the value of the form control. |
| `required` | `boolean` | `false` | Indicates the control is required. Validation still needs to be done with a validator. |
| `invalid` | `boolean` | `false` | Validation state of the form control. Setting to true triggers invalid state. |
| `disabled` | `boolean` | `false` | If the input is disabled. |
| `supporting-text` | `string` | `''` | Supporting text displayed between the label and the field. |
| `show-extended-supporting-text` | `boolean` | `false` | Whether the extended supporting text should be displayed. |
| `aria-invalid` | `boolean` | `false` | Validation state for accessibility. |
| `error-message` | `string` | `''` | Manually control the error message displayed when the control is invalid. |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only). |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `supportingText` | `string` | `''` | Supporting text displayed between the label and field. |
| `showExtendedSupportingText` | `boolean` | `false` | Whether extended supporting text should be displayed. |
| `charCounterCallback` | `Function` | `charCounterCallbackDefault` | Callback for customizing character counter. Returns tuple: `[remainingChars, badgeVariant]`. |
| `formAssociated` | `boolean` | `true` | Whether the element is form-associated. |
| `validator` | `GdsValidator` | `undefined` | A validator for form control validation and error messages. |
| `errorMessage` | `string` | `''` | Manually control error message display. |
| `form` | `HTMLFormElement` | `undefined` | The form element that the control is associated with. |
| `validity` | `ValidityState` | - | Validity state object (read-only). |
| `validationMessage` | `string` | - | Validation message (read-only). |
| `willValidate` | `boolean` | - | Whether the element will be validated (read-only). |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only). |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only). |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of element (read-only). |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only). |

### Style Expression Properties

| Property | Description |
|----------|-------------|
| `width` | Controls width property. Supports space tokens and all valid CSS width values. |
| `min-width` | Controls min-width property. Supports space tokens and all valid CSS values. |
| `max-width` | Controls max-width property. Supports space tokens and all valid CSS values. |
| `inline-size` | Controls inline-size property. Supports space tokens and all valid CSS values. |
| `min-inline-size` | Controls min-inline-size property. Supports space tokens and all valid CSS values. |
| `max-inline-size` | Controls max-inline-size property. Supports space tokens and all valid CSS values. |
| `margin` | Controls margin property. Only accepts space tokens. |
| `margin-inline` | Controls margin-inline property. Only accepts space tokens. |
| `margin-block` | Controls margin-block property. Only accepts space tokens. |
| `align-self` | Controls align-self property. Supports all valid CSS values. |
| `justify-self` | Controls justify-self property. Supports all valid CSS values. |
| `place-self` | Controls place-self property. Supports all valid CSS values. |
| `grid-column` | Controls grid-column property. Supports all valid CSS values. |
| `grid-row` | Controls grid-row property. Supports all valid CSS values. |
| `grid-area` | Controls grid-area property. Supports all valid CSS values. |
| `flex` | Controls flex property. Supports all valid CSS values. |
| `order` | Controls order property. Supports all valid CSS values. |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-input-cleared` | `CustomEvent` | Fired when the clear button is clicked. |
| `gds-validity-state` | `CustomEvent` | Dispatched when validity state is changed by a validator. |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM. |

### Slots

| Slot | Description |
|------|-------------|
| `lead` | Accepts `IconComponent`. Use this to place an icon at the start of the field. |
| `trail` | Accepts `GdsBadge`. Use this to place a badge in the field (e.g., for displaying currency). |
| `extended-supporting-text` | Longer supporting text displayed in a panel when user clicks the info button. |

## Examples

### Basic Text Input

```tsx
<GdsInput 
  label="Full Name"
  placeholder="Enter your full name"
/>
```

### Email Input

```tsx
<GdsInput 
  label="Email Address"
  type="email"
  placeholder="your.email@example.com"
  autocomplete="email"
/>
```

### Password Input

```tsx
<GdsInput 
  label="Password"
  type="password"
  autocomplete="current-password"
/>
```

### Number Input

```tsx
<GdsInput 
  label="Age"
  type="number"
  min="18"
  max="120"
  step="1"
/>
```

### With Size Variants

```tsx
// Large (default)
<GdsInput 
  label="Large Input"
  size="large"
/>

// Small
<GdsInput 
  label="Small Input"
  size="small"
/>
```

### With Lead Icon

```tsx
import { IconMagnifyingGlass, IconCreditCard, IconPeopleProfile } from '@sebgroup/green-core/react'

// Search with icon
<GdsInput label="Search">
  <IconMagnifyingGlass slot="lead" />
</GdsInput>

// Credit card with icon
<GdsInput label="Card Number">
  <IconCreditCard slot="lead" />
</GdsInput>

// Profile with icon
<GdsInput label="Username">
  <IconPeopleProfile slot="lead" />
</GdsInput>
```

### With Trail Badge

```tsx
// Currency badge
<GdsInput 
  label="Amount"
  type="number"
  value="10000.00"
  clearable
>
  <GdsBadge variant="information" slot="trail">USD</GdsBadge>
</GdsInput>

// Unit badge
<GdsInput 
  label="Weight"
  type="number"
>
  <GdsBadge variant="secondary" slot="trail">kg</GdsBadge>
</GdsInput>
```

### Clearable Input

```tsx
<GdsInput 
  label="Search Query"
  value="Clear this text"
  clearable
/>
```

### With Character Limit

```tsx
<GdsInput 
  label="Short Description"
  maxlength={100}
  supporting-text="Maximum 100 characters"
/>
```

### With Supporting Text

```tsx
// Basic supporting text
<GdsInput 
  label="Username"
  supporting-text="Must be at least 3 characters"
/>

// With extended supporting text
<GdsInput 
  label="Password"
  supporting-text="Create a strong password"
  type="password"
>
  <span slot="extended-supporting-text">
    Your password must be at least 8 characters long and include uppercase, 
    lowercase, numbers, and special characters.
  </span>
</GdsInput>

// Show extended text by default
<GdsInput 
  label="Terms"
  supporting-text="Please review"
  show-extended-supporting-text
>
  <span slot="extended-supporting-text">
    By using this service, you agree to our Terms of Service and Privacy Policy.
  </span>
</GdsInput>
```

### Form Validation

```tsx
// Using validator
<GdsInput
  label="Email"
  type="email"
  required
  validator={{
    validate: (el) => {
      if (!el.value.includes('@')) {
        return [
          {
            ...el.validity,
            valid: false,
            customError: true,
          },
          'Please enter a valid email address.',
        ]
      }
    },
  }}
/>

// Manual error message
<GdsInput 
  label="Username"
  value="ab"
  invalid
  error-message="Username must be at least 3 characters"
/>
```

### Complete Form Example

```tsx
import { IconEmail, IconLock, IconPeopleProfile } from '@sebgroup/green-core/react'

<GdsFlex flex-direction="column" gap="m" width="400px">
  <GdsInput 
    label="Full Name"
    required
    autocomplete="name"
  >
    <IconPeopleProfile slot="lead" />
  </GdsInput>
  
  <GdsInput 
    label="Email Address"
    type="email"
    required
    autocomplete="email"
  >
    <IconEmail slot="lead" />
  </GdsInput>
  
  <GdsInput 
    label="Password"
    type="password"
    required
    autocomplete="new-password"
    supporting-text="At least 8 characters"
  >
    <IconLock slot="lead" />
  </GdsInput>
  
  <GdsButton rank="primary" type="submit">
    Create Account
  </GdsButton>
</GdsFlex>
```

### Search Input

```tsx
import { IconMagnifyingGlass } from '@sebgroup/green-core/react'

<GdsInput 
  label="Search"
  type="search"
  placeholder="Search transactions..."
  clearable
  inputmode="search"
  enterkeyhint="search"
>
  <IconMagnifyingGlass slot="lead" />
</GdsInput>
```

### Telephone Input

```tsx
import { IconPhone } from '@sebgroup/green-core/react'

<GdsInput 
  label="Phone Number"
  type="tel"
  placeholder="+1 (555) 123-4567"
  autocomplete="tel"
  inputmode="tel"
>
  <IconPhone slot="lead" />
</GdsInput>
```

### Date and Time Inputs

```tsx
// Date
<GdsInput 
  label="Date of Birth"
  type="date"
  max="2006-01-01"
/>

// Datetime
<GdsInput 
  label="Appointment"
  type="datetime-local"
/>

// Time
<GdsInput 
  label="Meeting Time"
  type="time"
/>
```

### URL Input

```tsx
import { IconChainLink } from '@sebgroup/green-core/react'

<GdsInput 
  label="Website"
  type="url"
  placeholder="https://example.com"
  inputmode="url"
>
  <IconChainLink slot="lead" />
</GdsInput>
```

### Disabled State

```tsx
<GdsInput 
  label="Disabled Field"
  value="Cannot edit this"
  disabled
/>
```

### Plain Mode (Hidden Header/Footer)

```tsx
<GdsInput 
  label="Hidden Label"
  placeholder="Label is accessible but not visible"
  plain
/>
```

### Custom Character Counter

```tsx
<GdsInput 
  label="Tweet"
  maxlength={280}
  charCounterCallback={(value, maxLength) => {
    const remaining = maxLength - value.length
    const variant = remaining < 20 ? 'negative' : 'information'
    return [remaining, variant]
  }}
/>
```

### Responsive Width

```tsx
// Full width
<GdsInput 
  label="Full Width"
  width="100%"
/>

// Constrained width
<GdsInput 
  label="Constrained"
  max-width="400px"
/>

// Responsive width
<GdsInput 
  label="Responsive"
  width="100%"
  max-width="600px"
  margin-inline="auto"
/>
```

## TypeScript Types

```tsx
// GdsInput props interface
interface GdsInputProps {
  // Required
  label: string
  
  // Common attributes
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'datetime-local' | 
         'tel' | 'url' | 'search' | 'time' | 'week' | 'month'
  value?: string
  placeholder?: string
  
  // Size and appearance
  size?: 'large' | 'small'
  clearable?: boolean
  plain?: boolean
  disabled?: boolean
  
  // Validation
  required?: boolean
  invalid?: boolean
  'error-message'?: string
  validator?: GdsValidator
  
  // Text content
  'supporting-text'?: string
  'show-extended-supporting-text'?: boolean
  
  // Constraints
  maxlength?: number
  min?: number | string
  max?: number | string
  step?: number | 'any'
  
  // Browser features
  autocomplete?: string
  autocapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  autocorrect?: boolean
  autofocus?: boolean
  spellcheck?: boolean
  inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'
  enterkeyhint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send'
  
  // Style expressions
  width?: string
  'max-width'?: string
  margin?: string
  // ... other style expression properties
}

// Validator interface
interface GdsValidator {
  validate: (element: GdsInput) => [ValidityState, string] | undefined
}

// Usage example
const LoginForm = () => {
  const [email, setEmail] = useState('')
  
  return (
    <GdsInput 
      label="Email Address"
      type="email"
      value={email}
      onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
      required
      autocomplete="email"
      validator={{
        validate: (el) => {
          if (!el.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return [
              { ...el.validity, valid: false, customError: true },
              'Please enter a valid email address',
            ]
          }
        },
      }}
    />
  )
}
```

## Input Types

| Type | Use Case | Mobile Keyboard |
|------|----------|-----------------|
| `text` | General text input | Standard keyboard |
| `email` | Email addresses | Email keyboard with @ |
| `password` | Password fields | Standard with obscured text |
| `number` | Numeric values | Numeric keypad |
| `tel` | Phone numbers | Phone number pad |
| `url` | Website URLs | URL keyboard with .com |
| `search` | Search queries | Search keyboard |
| `date` | Date selection | Date picker |
| `datetime-local` | Date and time | Date/time picker |
| `time` | Time selection | Time picker |
| `week` | Week selection | Week picker |
| `month` | Month selection | Month picker |

## Best Practices

### Labels and Accessibility
- **Always provide labels**: Every input must have a `label` attribute
- **Use plain mode carefully**: When using `plain`, label is still required but hidden
- **Descriptive labels**: Use clear, concise labels that describe the expected input
- **Supporting text**: Provide helpful context without being verbose

```tsx
// Good
<GdsInput label="Email Address" type="email" />

// Bad - no label
<GdsInput placeholder="Email" type="email" />
```

### Validation
- **Use validators**: Leverage the built-in validation system
- **Clear error messages**: Provide specific, actionable error messages
- **Real-time feedback**: Validate as users type for better UX
- **Required indicators**: Use `required` attribute for accessibility

### Icons and Visual Elements
- **Lead icons**: Use for input type indication (search, email, etc.)
- **Trail badges**: Use for units, currency, or supplementary info
- **Consistent iconography**: Match icons to input purpose
- **Icon size**: Icons automatically size appropriately

### Performance
- **Avoid autofocus**: Use sparingly, only for primary actions
- **Lazy validation**: Don't validate on every keystroke for expensive checks
- **Debounce inputs**: For search or live filtering, debounce user input

### Mobile Optimization
- **Input types**: Use appropriate `type` for mobile keyboard
- **Inputmode**: Specify `inputmode` for numeric inputs as text type
- **Enterkeyhint**: Guide users with appropriate enter key labels
- **Touch targets**: Inputs meet minimum 44×44 px touch target size

### Do's and Don'ts

- Do: always provide a clear `label` and helpful `supporting-text` where necessary.
- Do: use `clearable` on search or filter inputs where quick reset improves UX.
- Do: use `maxlength` with a visible counter for constrained text fields (usernames, short descriptions).
- Don't: rely on placeholders as the only label or instruction.
- Don't: use floating labels for inputs that require long supporting text or where the label must always be visible for clarity.

### Floating Label (Example)

```tsx
// Floating label (coming soon) — ensure accessible hints are visible elsewhere
<GdsInput label="Card Number" type="text" placeholder="1234 5678 9012 3456" />
```

## Related Components

- [GdsButton](./GdsButton.md) — Form submission buttons
- [GdsCheckbox](./GdsCheckbox.md) — Checkbox inputs
- [GdsRadioGroup](./GdsRadioGroup.md) — Radio button inputs for single selection
- [GdsSelect](./GdsSelect.md) — Dropdown selection
- [GdsDropdown](./GdsDropdown.md) — Dropdown with search
- [GdsTextarea](./GdsTextarea.md) — Multi-line text input
- [GdsDatepicker](./GdsDatepicker.md) — Date picker component
- [GdsBadge](./GdsBadge.md) — Badges for trail slot
- [GdsSpinner](./GdsSpinner.md) — Loading indicators for form submission states
- [Icons](./Icons.md) — Icons for lead slot
- [GdsFlex](./GdsFlex.md) — Form layouts
- [GdsCard](./GdsCard.md) — Form containers

## Form Integration

### React Event Handling

```tsx
import { useState } from 'react'

const MyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
  })
  
  const handleInput = (field: string) => (e: Event) => {
    setFormData(prev => ({
      ...prev,
      [field]: (e.target as HTMLInputElement).value
    }))
  }
  
  return (
    <form>
      <GdsInput 
        label="Name"
        value={formData.name}
        onInput={handleInput('name')}
      />
      <GdsInput 
        label="Email"
        type="email"
        value={formData.email}
        onInput={handleInput('email')}
      />
      <GdsInput 
        label="Age"
        type="number"
        value={formData.age}
        onInput={handleInput('age')}
      />
    </form>
  )
}
```

### Form Validation Example

```tsx
const SignupForm = () => {
  const emailValidator: GdsValidator = {
    validate: (el) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(el.value)) {
        return [
          { ...el.validity, valid: false, customError: true },
          'Please enter a valid email address',
        ]
      }
    },
  }
  
  const passwordValidator: GdsValidator = {
    validate: (el) => {
      if (el.value.length < 8) {
        return [
          { ...el.validity, valid: false, customError: true },
          'Password must be at least 8 characters',
        ]
      }
    },
  }
  
  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsInput 
        label="Email"
        type="email"
        required
        validator={emailValidator}
      />
      <GdsInput 
        label="Password"
        type="password"
        required
        validator={passwordValidator}
      />
    </GdsFlex>
  )
}
```

## Accessibility Guidelines

### ARIA and Semantic HTML
- Component uses proper ARIA attributes automatically
- `aria-invalid` is set when validation fails
- `aria-required` is set when field is required
- Error messages are associated with inputs via `aria-describedby`

### Keyboard Navigation
- **Tab**: Move between inputs
- **Enter**: Submit form (when appropriate)
- **Escape**: Clear input (when clearable)
- All interactive elements are keyboard accessible

### Screen Reader Support
- Labels are always announced
- Supporting text provides additional context
- Error messages are announced when validation fails
- Character counters provide feedback

## Notes

- **Form Association**: GdsInput uses ElementInternals for full form integration
- **Validation**: Built on Constraint Validation API for native browser validation
- **Event Handling**: Use `onInput` in React (not `onChange`)
- **Character Counter**: Automatically appears when `maxlength` is set
- **Clear Button**: Only visible when input has value and `clearable` is true
- **Supporting Text**: Regular supporting text is always visible, extended text is toggleable
- **Plain Mode**: Hides header/footer but maintains accessibility with label
- **Style Expressions**: Full support for width, margin, and layout properties
- **Native Attributes**: Most standard HTML input attributes are forwarded

---

*Last updated: November 12, 2025*  
*Green Core version: 2.12.0+*  
*Documentation source: [Storybook Input Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-input--docs)*
