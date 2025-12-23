# GdsDatepicker

The datepicker allows users to select a date through an input field with calendar popover.

## Overview

The GdsDatepicker mimics the behavior of the native date input element as implemented in Chromium browsers. It provides a user-friendly interface for date selection with support for keyboard navigation, date validation, and customizable date ranges.

The input field displays three parts of the date: day, month, and year. Users can navigate between these parts using arrow keys, clicking, or tabbing. When a part has focus, it can be changed using arrow keys or by typing numbers.

Clicking the calendar icon opens a popover with a calendar view for visual date selection.

## Anatomy

The datepicker is composed of a compact input control with dedicated sub-controls to capture a well-formed date. Visually and semantically it contains the following parts:

1. **Label** — the visible label for the form control. Always set for accessibility; can be visually hidden with `hideLabel`.
2. **Input container** — the composite field that visually contains the date parts and optional lead icon.
3. **Spinbuttons** — three numeric spinbutton parts representing day, month and year. The order and separators are configurable through the `dateformat` setting so the control can match regional formats.
4. **Trailing icon button** — the calendar button which opens the calendar popover for visual date selection.
5. **Calendar popover** — an interactive `GdsCalendar` instance which shows a month grid, optional week numbers, disabled dates, and footer actions (Today, Clear, Close).

Notes:
- The spinbutton parts are real ARIA spinbuttons (see Accessibility) and accept keyboard input, arrow adjustments and direct typing of numbers.
- The calendar popover is focus-managed: focus moves into the calendar when opened and returns to the trigger when closed.
- The input and calendar work together: changes in one update the other and emit a `change` event for integration.

## Spinbutton Behavior and Accessibility

- Each date part (day, month, year) is exposed as an accessible spinbutton (`role="spinbutton"`) so assistive technologies announce its current value and step behavior.
- Keyboard support for a focused spinbutton:
  - Up/Down arrow: increment/decrement value
  - PageUp/PageDown: larger step (month/year depending on part)
  - Home/End: jump to min/max for that part if applicable
  - Typing numbers: replaces the current part value and commits when complete or on blur
- When the composite input has focus, use Left/Right arrow or Tab/Shift+Tab to move between parts. Enter opens the calendar popover. Escape closes the popover.
- Announceable attributes: spinbuttons expose `aria-valuenow`, `aria-valuemin`, `aria-valuemax` and a readable `aria-label` (constructed from the control label and the part name). Use `supportingText` for additional format hints rather than placing format examples in the label.

## Plain Mode

The `plain` variant removes visible header/footer UI from the calendar popover while preserving accessible information. Use `plain` when the surrounding UI already provides contextual labels or when embedding the control in very tight layouts — always keep the `label` attribute set so screen readers receive a descriptive label.

## Localization & Timezones

- Use `dateformat` to match regional date formats (for example `'d/m/y'`, `'m/d/y'`, `'y-m-d'`). The control renders parts in the order specified by the format string.
- `utcHours` affects how the component reads/writes Date objects when your application needs to normalise to UTC. For most typical date-only uses this can be left `undefined` and the component will use local dates.
- For timezone-sensitive logic (e.g., scheduling across timezones) normalise to UTC on the server and treat the datepicker as a date-only control in the UI.

## Do's and Don'ts

Do
- Use a datepicker when users must provide a complete date value (day, month and year).
- Use `supportingText` to explain restrictions (min/max, disabled days) or non-standard date formats.

Don't
- Don't put the date format example in the visual label text (avoid labels like "Date (DD/MM/YYYY)"). The control already enforces a configured `dateformat` and providing format text in the label harms screen reader clarity. If the format is ambiguous, put a short hint in `supportingText` instead.
- If you only need a single part (only a year, or only month + year), prefer separate inputs or selects instead of forcing users to navigate a full date control.
- Don't use a datepicker alone if you need time information — add a separate time input or use a combined datetime picker component.

## Import

```tsx
// Use as JSX element in React
import { GdsDatepicker } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsDatepicker label="Pick a date" />
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | The label of the form control |
| `value` | `Date \| string \| undefined` | `undefined` | The Date value of the datepicker. Can be a string when set via attribute or a Date object when set programmatically |
| `min` | `Date \| string` | `new Date(new Date().getFullYear() - 10, 0, 1)` | The minimum date that can be selected |
| `max` | `Date \| string` | `new Date(new Date().getFullYear() + 10, 0, 1)` | The maximum date that can be selected |
| `open` | `boolean` | `false` | Controls whether the datepicker popover is open |
| `size` | `'large' \| 'small'` | `'large'` | Whether to use the small variant of the datepicker field |
| `plain` | `boolean` | `false` | Hides the header and footer, while keeping the accessible label. Always set the label attribute when using this |
| `clearable` | `boolean` | `false` | Whether the Clear button is shown under the calendar |
| `dateformat` | `string` | `'y-m-d'` | The date format to use. Accepts y, m, and d in any order with delimiters (e.g., `'y-m-d'`, `'d/m/y'`). All three characters must be present |
| `required` | `boolean` | `false` | Communicates to assistive technology that the control is required |
| `invalid` | `boolean` | `false` | Validation state of the form control |
| `aria-invalid` | `boolean` | `false` | Validation state for accessibility |
| `disabled` | `boolean` | `false` | If the input is disabled |
| `supporting-text` | `string` | `''` | Supporting text displayed between the label and the field |
| `show-week-numbers` | `boolean` | `false` | Whether to show a column of week numbers in the calendar |
| `hide-label` | `boolean` | `false` | Whether to hide the label above the input field |
| `hide-today-button` | `boolean` | `false` | Whether to hide the Today button under the calendar |
| `utc-hours` | `number` | `undefined` | Controls the time component of dates selected (set in UTC) |
| `disabled-weekends` | `boolean` | `false` | Whether to disable weekends in the calendar |
| `disabled-dates` | `string` | `undefined` | Comma-separated list of date strings to disable (e.g., `"2024-03-08, 2024-04-12"`) |
| `show-extended-supporting-text` | `boolean` | `false` | Whether the extended supporting text should be displayed |
| `error-message` | `string` | `''` | Manually control the error message displayed when invalid |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `supportingText` | `string` | `''` | The supporting text displayed between the label and the field |
| `showWeekNumbers` | `boolean` | `false` | Whether to show week numbers column |
| `hideLabel` | `boolean` | `false` | Whether to hide the label |
| `hideTodayButton` | `boolean` | `false` | Whether to hide the Today button |
| `utcHours` | `number` | `undefined` | Time component for dates (UTC) |
| `disabledWeekends` | `boolean` | `false` | Whether to disable weekends |
| `disabledDates` | `Date[]` | `undefined` | Array of Date objects to disable |
| `showExtendedSupportingText` | `boolean` | `false` | Whether extended supporting text is shown |
| `displayValue` | `string` | (readonly) | String representation of the current value matching dateformat |
| `validator` | `GdsValidator` | `undefined` | Validator for form control validation |
| `errorMessage` | `string` | `''` | Error message when control is invalid |
| `form` | `HTMLFormElement` | (readonly) | The form element associated with this control |
| `validity` | `ValidityState` | (readonly) | The validity state of the form control |
| `validationMessage` | `string` | (readonly) | The validation message |
| `willValidate` | `boolean` | (readonly) | Whether the control will be validated |

### Test Properties (for integration tests)

| Property | Type | Description |
|----------|------|-------------|
| `test_calendarButton` | `Promise<HTMLButtonElement>` | Reference to calendar button in shadow root |
| `test_clearButton` | `HTMLButtonElement` | Reference to clear button in shadow root |
| `test_todayButton` | `HTMLButtonElement` | Reference to today button in shadow root |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `Event` | Fired when the value is changed through user interaction |
| `gds-ui-state` | `CustomEvent` | Fired when the datepicker popover is opened or closed |
| `gds-validity-state` | `CustomEvent` | Dispatched when validity state is changed by a validator |

### Slots

| Slot | Description |
|------|-------------|
| `extended-supporting-text` | Longer supporting text displayed in a panel when user clicks info button |
| `message` | (deprecated) Error message below input when validation error occurs. Use `errorMessage` property instead |
| `sub-label` | (deprecated) Renders between label and trigger button. Use `supporting-text` property instead |
| `lead` | Icon slot before the input field |

## Examples

### With Supporting Text

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Birth Date"
    supportingText="Select your date of birth"
    onChange={(e) => console.log('Selected date:', e.target.value)}
  />
</GdsTheme>
```

### Week Numbers

Show week numbers in the calendar view:

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Project Start Date"
    showWeekNumbers={true}
  />
</GdsTheme>
```

### Min and Max Dates

Restrict the selectable date range:

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Appointment Date"
    min={new Date(2024, 0, 1)}
    max={new Date(2024, 11, 31)}
    supportingText="Select a date in 2024"
  />
</GdsTheme>
```

Using string format via attributes:

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Booking Date"
    min="2024-01-01"
    max="2024-12-31"
  />
</GdsTheme>
```

### Disabled Dates

Disable specific dates and weekends:

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Meeting Date"
    disabledWeekends={true}
    disabledDates={[
      new Date(2024, 2, 8),
      new Date(2024, 3, 12),
      new Date(2024, 2, 18)
    ]}
    supportingText="Weekends and holidays are not available"
  />
</GdsTheme>
```

Using string format via attributes:

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Delivery Date"
    disabled-weekends
    disabled-dates="2024-03-08, 2024-04-12, 2024-03-18"
  />
</GdsTheme>
```

### Small Size with Hidden Label

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Date"
    size="small"
    hideLabel={true}
  />
</GdsTheme>
```

### Invalid State

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Valid Until"
    invalid={true}
    errorMessage="Please select a future date"
    aria-invalid={true}
  />
</GdsTheme>
```

### Disabled State

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Locked Date"
    value={new Date(2024, 5, 15)}
    disabled={true}
  />
</GdsTheme>
```

### Clearable Date

Allow users to clear the selected date:

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Optional Date"
    clearable={true}
    supportingText="You can clear this selection"
  />
</GdsTheme>
```

### Simplified Calendar (No Today Button)

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Custom Date"
    hideTodayButton={true}
  />
</GdsTheme>
```

### Full Featured Example

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Event Date"
    supportingText="Select a date for your event"
    clearable={true}
    disabledWeekends={true}
    showWeekNumbers={true}
    min={new Date()}
    max={new Date(new Date().getFullYear() + 1, 11, 31)}
  />
</GdsTheme>
```

### Custom Date Format

```tsx
<GdsTheme>
  <GdsDatepicker
    label="European Format"
    dateformat="d/m/y"
    supportingText="Date will be displayed as DD/MM/YYYY"
  />
</GdsTheme>
```

### With Extended Supporting Text

```tsx
<GdsTheme>
  <GdsDatepicker
    label="Contract Date"
    supportingText="Select the contract signing date"
    showExtendedSupportingText={true}
  >
    <span slot="extended-supporting-text">
      Please note that the contract date must be within the current fiscal year.
      Weekends and public holidays are automatically excluded from selection.
      Contact support if you need to select a restricted date.
    </span>
  </GdsDatepicker>
</GdsTheme>
```

### With Lead Icon

```tsx
import { IconCalendar } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsDatepicker label="Scheduled Date">
    <IconCalendar slot="lead" />
  </GdsDatepicker>
</GdsTheme>
```

### Controlled Value with Event Handling

```tsx
import { useState } from 'react'

function BookingForm() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isOpen, setIsOpen] = useState(false)

  const handleChange = (e: Event) => {
    const target = e.target as any
    setSelectedDate(target.value)
    console.log('Date selected:', target.displayValue)
  }

  const handleUIState = (e: CustomEvent) => {
    setIsOpen(e.detail.open)
  }

  return (
    <GdsTheme>
      <GdsDatepicker
        label="Booking Date"
        value={selectedDate}
        open={isOpen}
        onChange={handleChange}
        onGdsUiState={handleUIState}
        min={new Date()}
        supportingText="Select your preferred booking date"
      />
    </GdsTheme>
  )
}
```

### Date Range Selection (Two Datepickers)

```tsx
import { useState } from 'react'

function DateRangeSelector() {
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()

  return (
    <GdsTheme>
      <div style={{ display: 'flex', gap: '16px' }}>
        <GdsDatepicker
          label="Start Date"
          value={startDate}
          max={endDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <GdsDatepicker
          label="End Date"
          value={endDate}
          min={startDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </GdsTheme>
  )
}
```

### Form Integration with Validation

```tsx
import { useState } from 'react'

function RegistrationForm() {
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  const [isInvalid, setIsInvalid] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!birthDate) {
      setIsInvalid(true)
      setErrorMsg('Birth date is required')
      return
    }

    const age = new Date().getFullYear() - birthDate.getFullYear()
    if (age < 18) {
      setIsInvalid(true)
      setErrorMsg('You must be at least 18 years old')
      return
    }

    setIsInvalid(false)
    setErrorMsg('')
    // Submit form
  }

  return (
    <GdsTheme>
      <form onSubmit={handleSubmit}>
        <GdsDatepicker
          label="Birth Date"
          value={birthDate}
          required={true}
          invalid={isInvalid}
          errorMessage={errorMsg}
          max={new Date()}
          supportingText="You must be at least 18 years old"
          onChange={(e) => {
            setBirthDate(e.target.value)
            setIsInvalid(false)
          }}
        />
        <button type="submit">Register</button>
      </form>
    </GdsTheme>
  )
}
```

## Best Practices

### Always Provide Labels
- Always set the `label` attribute for accessibility
- Use `hideLabel` if you need to hide it visually, but keep the label set for screen readers
- Provide clear, descriptive labels that indicate the expected date

### Use Supporting Text
- Add `supportingText` to provide context about date selection
- Explain any restrictions (min/max dates, disabled dates)
- Clarify date format if using non-standard format

### Date Validation
- Use `min` and `max` to enforce valid date ranges
- Use `disabledDates` for specific dates that should not be selectable
- Use `disabledWeekends` when business days are required
- Set `required` when the date is mandatory
- Provide clear error messages with `errorMessage`

### Accessibility
- Always use `label` attribute (required for screen readers)
- Set `aria-invalid` when validation fails
- Use proper `required` attribute for mandatory fields
- Ensure error messages are clear and helpful

### Date Format
- Use `dateformat` to match regional preferences
- Default format is `'y-m-d'` (ISO format)
- Common formats: `'d/m/y'` (European), `'m/d/y'` (US)
- Communicate the expected format in supporting text if ambiguous

### Performance
- Avoid setting large arrays in `disabledDates` - consider using date range restrictions instead
- Use `min` and `max` to limit the calendar range when appropriate

## Common Patterns

### Booking System Date Selector
```tsx
<GdsDatepicker
  label="Check-in Date"
  min={new Date()}
  disabledWeekends={false}
  clearable={true}
  supportingText="Select your arrival date"
/>
```

### Business Days Only
```tsx
<GdsDatepicker
  label="Appointment Date"
  disabledWeekends={true}
  supportingText="Available Monday through Friday"
/>
```

### Birth Date Selector
```tsx
<GdsDatepicker
  label="Date of Birth"
  max={new Date()}
  dateformat="d/m/y"
  supportingText="Enter your date of birth"
/>
```

### Future Date Only
```tsx
<GdsDatepicker
  label="Deadline"
  min={new Date()}
  supportingText="Select a future date"
/>
```

### Compact Form Field
```tsx
<GdsDatepicker
  label="Date"
  size="small"
  hideLabel={true}
  clearable={true}
/>
```

## TypeScript Types

```tsx
import type { GdsDatepicker } from '@sebgroup/green-core/react'

// Date value can be Date object or undefined
type DateValue = Date | undefined

// Size options
type DatepickerSize = 'large' | 'small'

// Date format string (must contain y, m, d)
type DateFormat = string // e.g., 'y-m-d', 'd/m/y', 'm/d/y'

// Event types
interface DatepickerChangeEvent extends Event {
  target: GdsDatepicker
}

interface DatepickerUIStateEvent extends CustomEvent {
  detail: {
    open: boolean
  }
}

// Component props type
interface DatepickerProps {
  label: string
  value?: Date | string
  min?: Date | string
  max?: Date | string
  open?: boolean
  size?: DatepickerSize
  dateformat?: DateFormat
  supportingText?: string
  showWeekNumbers?: boolean
  hideLabel?: boolean
  hideTodayButton?: boolean
  disabledWeekends?: boolean
  disabledDates?: Date[]
  clearable?: boolean
  required?: boolean
  invalid?: boolean
  disabled?: boolean
  errorMessage?: string
  onChange?: (event: DatepickerChangeEvent) => void
  onGdsUiState?: (event: DatepickerUIStateEvent) => void
}
```

## Related Components

- [GdsInput](./GdsInput.md) — For general text input
- [GdsDropdown](./GdsDropdown.md) — For selecting from predefined options
- [GdsPopover](./GdsPopover.md) — Underlying popover component for calendar
- [GdsButton](./GdsButton.md) — For triggering date-related actions
- [GdsCalendar](./GdsCalendar.md) — Standalone calendar component
- [GdsFormattedDate](./GdsFormattedDate.md) — For displaying selected dates
- [GdsSensitiveDate](./GdsSensitiveDate.md) — For displaying sensitive dates with blur protection (beta)
- [Icons](./Icons.md) — Available icons for lead slot

## Accessibility

- **ARIA Labels**: Always provide a `label` attribute - it's essential for screen readers
- **Keyboard Navigation**: 
  - Arrow keys navigate between day/month/year parts
  - Arrow keys change values when part is focused
  - Tab/Shift+Tab move between parts
  - Enter opens calendar popover
  - Escape closes calendar popover
  - Arrow keys navigate calendar dates
  - Enter selects date in calendar
- **Required Fields**: Use `required` attribute for mandatory fields
- **Error States**: Set `aria-invalid` and provide `errorMessage` for validation errors
- **Focus Management**: Focus is maintained when opening/closing calendar popover
- **Screen Reader Support**: All interactive elements are properly labeled and announced

## Browser Support

The datepicker mimics native Chromium date input behavior and works across all modern browsers. The component provides consistent UX regardless of browser implementation differences.

## Notes

- The `value` property can be set as a Date object programmatically or as a string via the attribute
- When using controlled components in React, manage the `value` prop with state
- The `displayValue` property provides a formatted string representation of the current date
- Test properties (`test_*`) are intended for integration testing and should not be used in production code
- Deprecated slots (`message`, `sub-label`) should be replaced with properties (`errorMessage`, `supportingText`)
- UTC hours can be controlled with `utcHours` for precise time handling across time zones
