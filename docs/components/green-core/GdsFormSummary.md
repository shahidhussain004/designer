# GdsFormSummary

Form summary shows all form errors in one place.

## Overview

GdsFormSummary is a component that displays validation errors from form controls in a centralized summary. It automatically collects and displays errors from Green Core form components (GdsInput, GdsDropdown, GdsCheckbox, GdsRadio, GdsDatepicker, etc.) or native HTML form controls with proper ARIA attributes.

The form summary helps users:
- **See all validation errors** at once
- **Navigate to error fields** via clickable links
- **Understand form validation state** without scrolling through the entire form
- **Improve accessibility** by announcing errors to screen readers

Form summary is especially useful for:
- **Long forms** with many fields
- **Complex validation** with multiple error conditions
- **Accessibility compliance** requiring error summaries
- **Multi-step forms** showing all accumulated errors

## Anatomy

The form summary is a compact card that typically contains:

- **Heading** — communicates the number of errors (for example: "3 errors found"). This heading should be localised and announced to assistive technologies.
- **Error list** — an unordered list of error items. Each item contains a short message and a target action to navigate to the problematic control.
- **Navigation control** — each error item acts as a link or button that moves focus to the associated form control and (optionally) scrolls it into view.
- **Optional dismiss / close** — an optional affordance to collapse or hide the summary when all errors are addressed.

## Import

```tsx
// Use as JSX element in React
import { GdsFormSummary } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <form>
    <GdsInput label="Name" required />
    <GdsDropdown label="Category" required>
      <GdsOption value="">Select...</GdsOption>
      <GdsOption value="a">Option A</GdsOption>
    </GdsDropdown>
    <GdsFormSummary reactive />
    <GdsButton type="submit">Submit</GdsButton>
  </form>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `reactive` | `boolean` | `false` | Whether to refresh summary automatically as form validation state changes |
| `hide-errors` | `boolean` | `false` | Whether to hide error messages under field labels (only show in summary) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `reactive` | `boolean` | Auto-refresh on validation changes |
| `hideErrors` | `boolean` | Hide inline error messages |
| `errorCount` | `number` | Current number of errors displayed (read-only) |
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `refresh()` | - | `void` | Manually refresh the form summary to update error list |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

## Examples

### Reactive Form Summary (Below Controls)

Place the summary below form controls with `reactive` attribute for automatic updates as the user interacts with the form.

```tsx
import { GdsFormSummary, GdsCard, GdsText, GdsCheckboxGroup, GdsCheckbox, 
         GdsRadioGroup, GdsRadio, GdsDropdown, GdsOption, GdsDatepicker, 
         GdsInput, GdsFlex, GdsButton } from '@sebgroup/green-core/react'
import { IconRocket } from '@sebgroup/green-core/react'

<GdsTheme>
  <form style={{ width: '450px' }} noValidate>
    <GdsCard 
      display="flex" 
      flex-direction="column" 
      gap="m" 
      variant="secondary" 
      border-color="subtle-01" 
      padding="l"
    >
      <GdsText tag="h2" font="heading-l">Launch control</GdsText>
      
      <GdsCheckboxGroup direction="row" label="Mission type" required>
        <GdsCheckbox value="exploration" label="Exploration" />
        <GdsCheckbox value="research" label="Research" />
        <GdsCheckbox value="rescue" label="Rescue" />
        <GdsCheckbox value="other" label="Other" />
      </GdsCheckboxGroup>
      
      <GdsRadioGroup direction="row" label="Rocket type" required>
        <GdsRadio value="falcon" label="Falcon" />
        <GdsRadio value="starship" label="Starship" />
        <GdsRadio value="saturn" label="Saturn" />
        <GdsRadio value="other" label="Other" />
      </GdsRadioGroup>
      
      <GdsDropdown label="Astronaut" required>
        <GdsOption value="">Pick your astronaut</GdsOption>
        <GdsOption value="dog">Dog</GdsOption>
        <GdsOption value="cat">Cat</GdsOption>
        <GdsOption value="fish">Fish</GdsOption>
      </GdsDropdown>
      
      <GdsDatepicker label="Launch date" required />
      
      <GdsInput label="Designation" required />
      
      <GdsFormSummary reactive />
      
      <GdsFlex gap="m" justify-content="center" margin="s 0 0 0">
        <GdsButton type="reset" rank="tertiary">Reset</GdsButton>
        <GdsButton type="submit">
          Launch
          <IconRocket slot="trail" />
        </GdsButton>
      </GdsFlex>
    </GdsCard>
  </form>
</GdsTheme>
```

### Manual Update (Above Controls)

Place the summary above form controls and update manually on form submission. Use this when the summary position might cause layout shifts with reactive updates.

```tsx
import { useRef } from 'react'

function ManualSummaryForm() {
  const summaryRef = useRef(null)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    summaryRef.current?.refresh()
  }
  
  return (
    <GdsTheme>
      <form style={{ width: '450px' }} noValidate onSubmit={handleSubmit}>
        <GdsFormSummary ref={summaryRef} />
        
        <GdsFlex flex-direction="column" gap="m" align-items="start">
          <GdsInput label="Designation" required />
          <GdsInput label="Mission Code" required />
          <GdsDropdown label="Priority" required>
            <GdsOption value="">Select priority</GdsOption>
            <GdsOption value="high">High</GdsOption>
            <GdsOption value="medium">Medium</GdsOption>
            <GdsOption value="low">Low</GdsOption>
          </GdsDropdown>
          
          <GdsButton type="submit">Submit</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### With Native HTML Controls

GdsFormSummary works with native HTML controls when using proper ARIA attributes and data attributes.

```tsx
<GdsTheme>
  <form style={{ width: '450px' }}>
    <GdsFlex flex-direction="column" gap="m">
      <GdsInput
        id="designation"
        label="Designation"
        type="text"
        invalid
        error-message="A designation is required"
        required
      />
      
      <GdsInput
        id="code"
        label="Mission Code"
        type="text"
        invalid
        error-message="Mission code must be 6 characters"
        minLength={6}
        required
      />
      
      <GdsFormSummary />
    </GdsFlex>
  </form>
</GdsTheme>
```

### Hide Inline Errors

Use `hide-errors` to only show errors in the summary, removing inline error messages under fields.

```tsx
<GdsTheme>
  <form>
    <GdsInput label="Email" type="email" required invalid error-message="Valid email required" />
    <GdsInput label="Password" type="password" required invalid error-message="Password required" />
    
    <GdsFormSummary reactive hide-errors />
    
    <GdsButton type="submit">Sign In</GdsButton>
  </form>
</GdsTheme>
```

### Error Count Display

```tsx
import { useRef, useState, useEffect } from 'react'

function FormWithErrorCount() {
  const summaryRef = useRef(null)
  const [errorCount, setErrorCount] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (summaryRef.current) {
        setErrorCount(summaryRef.current.errorCount)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <GdsTheme>
      <form>
        <GdsText font="heading-m">Form Errors: {errorCount}</GdsText>
        
        <GdsInput label="Name" required />
        <GdsInput label="Email" type="email" required />
        <GdsDropdown label="Country" required>
          <GdsOption value="">Select...</GdsOption>
        </GdsDropdown>
        
        <GdsFormSummary ref={summaryRef} reactive />
        <GdsButton type="submit">Submit</GdsButton>
      </form>
    </GdsTheme>
  )
}
```

### Validation on Submit

```tsx
function ValidateOnSubmit() {
  const summaryRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    summaryRef.current?.refresh()
    
    if (summaryRef.current?.errorCount === 0) {
      console.log('Form is valid!')
      // Submit form data
    }
  }
  
  return (
    <GdsTheme>
      <form onSubmit={handleSubmit} noValidate>
        <GdsFormSummary ref={summaryRef} />
        
        <GdsFlex flex-direction="column" gap="m">
          <GdsInput 
            label="Username" 
            required 
            invalid={submitted}
            error-message="Username is required"
          />
          <GdsInput 
            label="Email" 
            type="email" 
            required 
            invalid={submitted}
            error-message="Valid email required"
          />
          
          <GdsButton type="submit">Register</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### With React Hook Form

```tsx
import { useForm, Controller } from 'react-hook-form'
import { useRef, useEffect } from 'react'

function RHFForm() {
  const summaryRef = useRef(null)
  const { control, handleSubmit, formState: { errors, isSubmitted } } = useForm()
  
  useEffect(() => {
    if (isSubmitted) {
      summaryRef.current?.refresh()
    }
  }, [errors, isSubmitted])
  
  const onSubmit = (data) => {
    console.log('Form data:', data)
  }
  
  return (
    <GdsTheme>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <GdsFormSummary ref={summaryRef} />
        
        <GdsFlex flex-direction="column" gap="m">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <GdsInput
                {...field}
                label="Name"
                required
                invalid={!!errors.name}
                error-message={errors.name?.message}
              />
            )}
          />
          
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required' }}
            render={({ field }) => (
              <GdsDropdown
                {...field}
                label="Category"
                required
                invalid={!!errors.category}
                error-message={errors.category?.message}
              >
                <GdsOption value="">Select...</GdsOption>
                <GdsOption value="a">Category A</GdsOption>
                <GdsOption value="b">Category B</GdsOption>
              </GdsDropdown>
            )}
          />
          
          <GdsButton type="submit">Submit</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### Multi-Step Form with Summary

```tsx
function MultiStepForm() {
  const [step, setStep] = useState(1)
  const summaryRef = useRef(null)
  
  const handleNext = () => {
    summaryRef.current?.refresh()
    if (summaryRef.current?.errorCount === 0) {
      setStep(step + 1)
    }
  }
  
  return (
    <GdsTheme>
      <form noValidate>
        <GdsCard padding="l">
          <GdsText tag="h2" font="heading-l">Step {step} of 3</GdsText>
          
          <GdsFormSummary ref={summaryRef} />
          
          <GdsFlex flex-direction="column" gap="m" margin="m 0 0 0">
            {step === 1 && (
              <>
                <GdsInput label="First Name" required />
                <GdsInput label="Last Name" required />
                <GdsInput label="Email" type="email" required />
              </>
            )}
            
            {step === 2 && (
              <>
                <GdsInput label="Address" required />
                <GdsInput label="City" required />
                <GdsInput label="Postal Code" required />
              </>
            )}
            
            {step === 3 && (
              <>
                <GdsDropdown label="Payment Method" required>
                  <GdsOption value="">Select...</GdsOption>
                  <GdsOption value="card">Credit Card</GdsOption>
                  <GdsOption value="bank">Bank Transfer</GdsOption>
                </GdsDropdown>
                <GdsCheckbox label="I accept terms and conditions" required />
              </>
            )}
            
            <GdsFlex gap="m" justify-content="space-between">
              {step > 1 && (
                <GdsButton rank="tertiary" onClick={() => setStep(step - 1)}>
                  Back
                </GdsButton>
              )}
              {step < 3 ? (
                <GdsButton onClick={handleNext}>Next</GdsButton>
              ) : (
                <GdsButton type="submit">Submit</GdsButton>
              )}
            </GdsFlex>
          </GdsFlex>
        </GdsCard>
      </form>
    </GdsTheme>
  )
}
```

### Complex Validation

```tsx
function ComplexValidation() {
  const summaryRef = useRef(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const validateForm = () => {
    summaryRef.current?.refresh()
    
    // Custom validation logic
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    const passwordValid = formData.password.length >= 8
    const passwordsMatch = formData.password === formData.confirmPassword
    
    return emailValid && passwordValid && passwordsMatch
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('Form submitted:', formData)
    }
  }
  
  return (
    <GdsTheme>
      <form onSubmit={handleSubmit} noValidate>
        <GdsFormSummary ref={summaryRef} />
        
        <GdsFlex flex-direction="column" gap="m">
          <GdsInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            invalid={formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
            error-message="Please enter a valid email address"
          />
          
          <GdsInput
            label="Password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            invalid={formData.password && formData.password.length < 8}
            error-message="Password must be at least 8 characters"
          />
          
          <GdsInput
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            invalid={formData.confirmPassword && formData.password !== formData.confirmPassword}
            error-message="Passwords do not match"
          />
          
          <GdsButton type="submit">Create Account</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### Summary at Top of Long Form

```tsx
<GdsTheme>
  <form style={{ maxWidth: '600px' }} noValidate>
    <GdsCard padding="l">
      <GdsText tag="h1" font="heading-xl">Application Form</GdsText>
      
      {/* Summary at top for long forms */}
      <GdsFormSummary id="topSummary" />
      
      <GdsFlex flex-direction="column" gap="l" margin="l 0 0 0">
        {/* Personal Information Section */}
        <GdsFlex flex-direction="column" gap="m">
          <GdsText tag="h2" font="heading-l">Personal Information</GdsText>
          <GdsInput label="First Name" required />
          <GdsInput label="Last Name" required />
          <GdsInput label="Date of Birth" type="date" required />
          <GdsInput label="Phone" type="tel" required />
        </GdsFlex>
        
        {/* Address Section */}
        <GdsFlex flex-direction="column" gap="m">
          <GdsText tag="h2" font="heading-l">Address</GdsText>
          <GdsInput label="Street Address" required />
          <GdsInput label="City" required />
          <GdsInput label="State/Province" required />
          <GdsInput label="Postal Code" required />
        </GdsFlex>
        
        {/* Employment Section */}
        <GdsFlex flex-direction="column" gap="m">
          <GdsText tag="h2" font="heading-l">Employment</GdsText>
          <GdsInput label="Employer" required />
          <GdsInput label="Position" required />
          <GdsInput label="Years of Experience" type="number" required />
        </GdsFlex>
        
        <GdsButton 
          type="submit" 
          onClick={(e) => {
            e.preventDefault()
            document.getElementById('topSummary').refresh()
          }}
        >
          Submit Application
        </GdsButton>
      </GdsFlex>
    </GdsCard>
  </form>
</GdsTheme>
```

## Best Practices

### Placement
- **Below controls**: Use `reactive` attribute for automatic updates
- **Above controls**: Use manual `refresh()` to avoid layout shifts
- **Long forms**: Place at top with manual update on submit

### Reactive Mode
- Use for short to medium forms (up to ~10 fields)
- Avoid for summaries above form controls (causes jumping)
- Best when placed at bottom of form
- Provides immediate feedback as users correct errors

### Manual Update
- Use for long forms or complex layouts
- Update on form submission attempt
- Prevents layout shifts during form interaction
- Better performance for large forms

### Error Messages
- Keep error messages clear and actionable
- Use consistent error message format across form
- Consider using `hide-errors` to reduce visual clutter
- Ensure error messages are specific to the validation rule

### Accessibility
- Always use within a `<form>` element
- Ensure form controls have proper labels
- Error summary links navigate to corresponding fields
- Screen readers announce errors when summary updates

### Native Controls
- Use `aria-invalid="true"` to mark invalid fields
- Add `data-label` attribute with field label
- Add `data-errormessage` attribute with error text
- Works seamlessly with Green Core form components

## Common Patterns

### Reactive Summary Below Form
```tsx
<GdsFormSummary reactive />
```

### Manual Summary Above Form
```tsx
const summaryRef = useRef(null)
// On submit: summaryRef.current?.refresh()
<GdsFormSummary ref={summaryRef} />
```

### Hide Inline Errors
```tsx
<GdsFormSummary reactive hide-errors />
```

### Check Error Count
```tsx
if (summaryRef.current?.errorCount === 0) {
  // Form is valid
}
```

## TypeScript Types

```tsx
import type { GdsFormSummary } from '@sebgroup/green-core/react'

// Component props type
interface GdsFormSummaryProps extends React.HTMLAttributes<HTMLElement> {
  reactive?: boolean
  'hide-errors'?: boolean
  
  // Events
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}

// Ref type for accessing methods and properties
interface GdsFormSummaryElement extends HTMLElement {
  refresh(): void
  errorCount: number
  reactive: boolean
  hideErrors: boolean
}

// Usage with ref
const summaryRef = useRef<GdsFormSummaryElement>(null)
```

## Related Components

- [GdsInput](./GdsInput.md) — Text input with validation
- [GdsTextarea](./GdsTextarea.md) — Multi-line text input with validation
- [GdsDropdown](./GdsDropdown.md) — Dropdown with validation
- [GdsCheckbox](./GdsCheckbox.md) — Checkbox with validation
- [GdsRadioGroup](./GdsRadioGroup.md) — Radio buttons with validation for single selection
- [GdsDatepicker](./GdsDatepicker.md) — Date picker with validation
- [GdsButton](./GdsButton.md) — Form submission buttons
- [GdsCard](./GdsCard.md) — Card container for forms
- [GdsFlex](./GdsFlex.md) — Layout for form controls
- [GdsAlert](./GdsAlert.md) — Alternative for showing form-level messages

## Accessibility

- **ARIA Attributes**: Form summary uses proper ARIA landmarks and roles
- **Keyboard Navigation**: Error links are keyboard accessible
- **Screen Readers**: Summary announces errors and provides navigation to fields
- **Focus Management**: Clicking error link focuses corresponding field
- **Error Announcements**: Updates to summary are announced to assistive technology
- **Form Context**: Must be used within `<form>` element for proper functionality

## Linking & Navigation

- Each error item exposes a target (usually by `id` or `data-summary-id`) so clicking it moves focus to the associated control and scrolls it into view.
- If the target control is inside a collapsed region (accordion, details), ensure that region is expanded prior to focusing the field.
- For non-Green Core controls, add `data-label` and `data-errormessage` attributes so the summary can find and display them.

## Localization

- Localise the summary heading and error messages. When using the React wrappers you can provide translated strings via props or use your app's localisation provider.
- Ensure control-level error messages are translated consistently and passed to the summary.

## Performance

- Prefer manual `refresh()` for very large forms to avoid re-scanning the DOM on every change. Reactive mode is optimized for moderate-size forms but can be costly for extremely large or highly dynamic forms.
- Use `hide-errors` to avoid duplicate rendering when you only need a top-level summary.

## Accessibility Testing Checklist

- Keyboard only: submit form, ensure the summary is reachable and links focus respective fields.
- Screen reader: trigger validation and verify the summary heading and items are announced.
- Focus order: clicking a summary item should focus the control and scroll correctly.
- Collapsed containers: verify the summary expands any collapsed sections before focusing targets.
- Contrast: confirm summary text and icons meet contrast requirements.

## Notes

- Must be placed inside a `<form>` element
- Works with all Green Core form components automatically
- Supports native HTML form controls with proper data attributes
- Use `reactive` for automatic updates (best for summaries below controls)
- Use manual `refresh()` for summaries above controls to prevent layout shifts
- `errorCount` property provides current number of errors
- `hide-errors` removes inline error messages (errors only show in summary)
- Form validation must be triggered for summary to populate
- Error links automatically scroll and focus corresponding fields
- Best practice: one form summary per form
- For multi-step forms, refresh summary when changing steps
- Consider form length when choosing reactive vs manual update
