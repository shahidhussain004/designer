# GdsCheckbox Component - Best Practices & Patterns

## ⚠️ Critical Pattern Update

### ✅ CORRECT Usage
Always use the `label` attribute on `GdsCheckbox`, never use children:

```tsx
// ✅ DO THIS
<GdsCheckbox label="Email notifications" value="email" checked={true} />

// ✅ DO THIS - With supporting text
<GdsCheckbox 
  label="Two-Factor Authentication"
  supporting-text="Extra security for transactions"
  value="2fa"
  checked={true}
/>
```

### ❌ WRONG Usage
Never use children for the label:

```tsx
// ❌ DON'T DO THIS
<GdsCheckbox value="email" checked={true}>
  Email notifications
</GdsCheckbox>

// ❌ DON'T DO THIS
<GdsCheckbox checked={true}>
  {service.label}
</GdsCheckbox>
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
      supporting-text="Receive notifications via email"
      value="email-alerts"
      checked={field.value as boolean}
      onChange={(ev: unknown) => {
        const maybe = ev as { detail?: { value?: boolean }; target?: { checked?: boolean } } | undefined
        field.onChange(maybe?.detail?.value ?? maybe?.target?.checked ?? false)
      }}
    />
  )}
/>
```

### Multiple Selection (Array)

```tsx
const BANKING_SERVICES = [
  { value: 'online-banking', label: 'Online Banking' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'phone-banking', label: 'Phone Banking' },
]

// In defaultValues:
// bankingServices: []

{BANKING_SERVICES.map((service) => (
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

## Common Mistakes to Avoid

### ❌ Mistake 1: Using children instead of label
```tsx
// WRONG
<GdsCheckbox value="1">
  {service.label}
</GdsCheckbox>

// CORRECT
<GdsCheckbox 
  label={service.label}
  value="1"
/>
```

### ❌ Mistake 2: Missing value attribute
```tsx
// WRONG - No value
<GdsCheckbox label="Option 1" checked={true} />

// CORRECT
<GdsCheckbox label="Option 1" value="opt1" checked={true} />
```

### ❌ Mistake 3: Incorrect onChange handler
```tsx
// WRONG - Only checking e.target
<GdsCheckbox
  label="Email"
  value="email"
  checked={value}
  onChange={(e) => field.onChange((e.target as HTMLInputElement).checked)}
/>

// CORRECT - Check both detail and target
<GdsCheckbox
  label="Email"
  value="email"
  checked={value}
  onChange={(ev: unknown) => {
    const maybe = ev as { detail?: { value?: boolean }; target?: { checked?: boolean } } | undefined
    field.onChange(maybe?.detail?.value ?? maybe?.target?.checked ?? false)
  }}
/>
```

### ❌ Mistake 4: Using separate GdsText for supporting text
```tsx
// WRONG - Manual supporting text
<GdsDiv>
  <GdsCheckbox label="Two-Factor Auth" value="2fa" />
  <GdsText font="detail-s" color="secondary">
    Extra security
  </GdsText>
</GdsDiv>

// CORRECT - Use supporting-text attribute
<GdsCheckbox 
  label="Two-Factor Authentication"
  supporting-text="Extra security for transactions"
  value="2fa"
/>
```

## Migration Guide

If you have existing components using the old pattern, update them:

### Before (Incorrect)
```tsx
<Controller
  name="primaryAccount"
  control={control}
  render={({ field }) => (
    <GdsDiv>
      <GdsCheckbox
        checked={field.value}
        onChange={(e) => field.onChange((e.target as HTMLInputElement).checked)}
      >
        Primary Account
      </GdsCheckbox>
      <GdsText font="detail-s" color="secondary">
        Main account for transactions
      </GdsText>
    </GdsDiv>
  )}
/>
```

### After (Correct)
```tsx
<Controller
  name="primaryAccount"
  control={control}
  render={({ field }) => (
    <GdsCheckbox
      label="Primary Account"
      supporting-text="Main account for transactions"
      value="primary-account"
      checked={field.value}
      onChange={(ev: unknown) => {
        const maybe = ev as { detail?: { value?: boolean }; target?: { checked?: boolean } } | undefined
        field.onChange(maybe?.detail?.value ?? maybe?.target?.checked ?? false)
      }}
    />
  )}
/>
```

## Checkbox Group Pattern

```tsx
<GdsTheme>
  <GdsCheckboxGroup 
    label="Communication Preferences"
    supporting-text="Select your preferred contact methods"
    direction="column"
    size="large"
  >
    <GdsCheckbox 
      label="Email notifications" 
      supporting-text="Daily summaries"
      value="email" 
    />
    <GdsCheckbox 
      label="SMS alerts" 
      supporting-text="Instant notifications"
      value="sms" 
    />
    <GdsCheckbox 
      label="Phone calls" 
      value="phone" 
    />
  </GdsCheckboxGroup>
</GdsTheme>
```

## Required Attributes

All GdsCheckbox elements **must have**:
1. `label` attribute (string) - The visible label text
2. `value` attribute (string) - The unique identifier

Optional but recommended:
- `supporting-text` - Helper text below the label
- `checked` - Boolean state
- `onChange` - Event handler
- `disabled` - Disable interaction
- `required` - Mark as required field

## Testing Checklist

When implementing GdsCheckbox:
- [ ] Label uses `label` attribute, not children
- [ ] Value attribute is present and unique
- [ ] onChange handler checks both `detail` and `target`
- [ ] Supporting text uses `supporting-text` attribute
- [ ] Checkbox works in both checked and unchecked states
- [ ] Array-based selections properly add/remove values
- [ ] Form validation works correctly
- [ ] Accessibility labels are correct

## References
- [Full Documentation](./GdsCheckbox.md)
- [Forms Specification](../guides/forms-specification.md)
- [BankAccountForm Example](../../src/pages/BankAccountForm.tsx)
