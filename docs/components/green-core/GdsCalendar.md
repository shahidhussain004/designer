# GdsCalendar

The calendar component displays a grid of selectable dates with comprehensive customization options for date ranges, disabled dates, and visual indicators.

## Features

- **Date Selection**: Single date selection with visual feedback
- **Date Range Control**: Configurable min/max date boundaries
- **Customizable Display**: Hide day names, week numbers, extraneous days
- **Disabled Dates**: Support for disabled weekends and specific dates
- **Custom Styling**: Apply custom colors and indicators to specific dates
- **Size Variants**: Large (default) and small sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Event Handling**: Change and focus events for integration
- **Month/Year Navigation**: Programmatic control of displayed month/year

## Datepicker vs. Calendar

- **Datepicker**: A composite component that provides an input (or spinners) and an attached calendar popover for picking dates. Use the datepicker for user input scenarios where keyboard or text entry is required. See [GdsDatepicker](./GdsDatepicker.md) for full documentation and examples.
- **Calendar**: Renders an inline grid of dates. Use the calendar when you need an always-visible month or multi-month view, for example dashboards, availability grids, or event calendars. The calendar can be interactive for selection or read-only for display purposes (highlighting holidays/events).

## When to use

- Use `GdsCalendar` when you need an inline visual representation of dates (schedules, availability, event heatmaps).
- Prefer `GdsDatepicker` when the primary interaction is text or form input and space is limited.
- Use read-only mode (no `onChange`) when you only need to display dates with indicators (holidays, events).

## Read-only / Display Mode

The calendar supports display-only usage by omitting selection handlers and styling dates via `customizedDates`. In read-only mode ensure the component is not interactive (no keyboard focus) or mark it with `aria-hidden` if purely decorative.

## Accessibility – ARIA Grid Notes

- The calendar is exposed as an ARIA grid where each date cell is a gridcell. Provide an accessible `label` for the calendar and a clear `dateLabelTemplate` for localized announcements.
- Ensure date cells include aria-disabled for non-selectable dates and `aria-selected="true"` for the currently selected date.
- When using multiple calendars on the same page (for example multi-month views), provide distinct `label` attributes and do not rely on visual proximity alone for context.

## Localization and Timezones

- The component uses JavaScript `Date` objects; formatting and localization should be handled via `dateLabelTemplate` or by passing localized strings from your application.
- Timezone handling: Dates are treated as local dates (no time). When your application works across timezones, normalize incoming date values to local date-only boundaries to avoid off-by-one errors when converting between UTC and local times.

## Performance notes

- For very large sets of `customizedDates`, batch updates via property assignment and avoid updating on every render loop. Use memoization for computed date arrays.
- If rendering multiple months, consider virtualization or lazy rendering of off-screen months to reduce DOM complexity.

## Import

```tsx
import { GdsCalendar } from '@sebgroup/green-core/react'
```

## Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `undefined` | Accessible label for the calendar |
| `value` | `Date` | `undefined` | Currently selected date |
| `min` | `Date` | 10 years ago | Minimum selectable date |
| `max` | `Date` | 10 years ahead | Maximum selectable date |
| `focusedDate` | `Date` | `new Date()` | Currently focused date |
| `focusedMonth` | `number` | Current month | Month currently displayed (0-11) |
| `focusedYear` | `number` | Current year | Year currently displayed |
| `size` | `'small' \| 'large'` | `'large'` | Size of the calendar grid |
| `showWeekNumbers` | `boolean` | `false` | Whether to show week numbers |
| `hideExtraneousDays` | `boolean` | `false` | Hide days outside current month |
| `hideDayNames` | `boolean` | `false` | Hide day name headers |
| `disabled-weekends` | `boolean` | `false` | Disable weekend dates |
| `disabled-dates` | `Date[]` | `undefined` | Array of disabled dates |
| `gds-element` | `string` | `undefined` | Unscoped element name (read-only) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `shadowRootOptions` | `ShadowRootInit` | `{ mode: 'open', delegatesFocus: true }` | Shadow DOM configuration |
| `disabledWeekends` | `boolean` | `false` | Whether to disable weekends |
| `disabledDates` | `Date[]` | `undefined` | Array of disabled dates |
| `customizedDates` | `CustomizedDate[]` | `undefined` | Array of dates with custom appearance (property-only) |
| `dateLabelTemplate` | `Function` | `undefined` | Template function for accessible date labels |
| `isDefined` | `boolean` | `false` | Whether element is in custom element registry |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expressions |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version for troubleshooting |
| `gdsElementName` | `string` | `undefined` | Unscoped element name (read-only) |

### CustomizedDate Interface

```typescript
interface CustomizedDate {
  date: Date                    // The date to customize
  color?: string                // Background color (CSS custom property or value)
  indicator?: 'dot' | 'icon'    // Visual indicator type
  disabled?: boolean            // Whether the date is disabled
}
```

### Events

| Event | Description |
|-------|-------------|
| `change` | Fired when a date is selected |
| `gds-date-focused` | Fired when focus changes (cancellable with `event.preventDefault()`) |
| `gds-element-disconnected` | When element is disconnected from DOM |

## Usage Examples

### Basic Calendar

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'

function BasicCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  const handleChange = (e: CustomEvent) => {
    setSelectedDate(e.target.value)
  }

  return (
    <GdsTheme>
      <GdsCalendar 
        label="Select a date"
        value={selectedDate}
        onChange={handleChange}
      />
    </GdsTheme>
  )
}
```

### Minimal Calendar

Use `hideDayNames` and `hideExtraneousDays` for a condensed version:

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'

function MinimalCalendar() {
  return (
    <GdsTheme>
      <GdsCalendar 
        label="Pick a day"
        hideDayNames={true}
        hideExtraneousDays={true}
      />
    </GdsTheme>
  )
}
```

### Small Calendar with Week Numbers

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'

function SmallCalendar() {
  return (
    <GdsTheme>
      <GdsCalendar 
        label="Pick a day"
        size="small"
        showWeekNumbers={true}
      />
    </GdsTheme>
  )
}
```

### Calendar with Date Range

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'

function DateRangeCalendar() {
  const today = new Date()
  const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear(), today.getMonth() + 3, today.getDate())

  return (
    <GdsTheme>
      <GdsCalendar 
        label="Select a date (next 3 months)"
        min={minDate}
        max={maxDate}
      />
    </GdsTheme>
  )
}
```

### Disabled Weekends

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'

function WeekdaysOnlyCalendar() {
  return (
    <GdsTheme>
      <GdsCalendar 
        label="Select a weekday"
        disabledWeekends={true}
      />
    </GdsTheme>
  )
}
```

### Disabled Specific Dates

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'

function CalendarWithDisabledDates() {
  const disabledDates = [
    new Date(2025, 11, 25), // Christmas
    new Date(2025, 11, 26), // Boxing Day
    new Date(2026, 0, 1),   // New Year's Day
  ]

  return (
    <GdsTheme>
      <GdsCalendar 
        label="Select a date (holidays disabled)"
        disabledDates={disabledDates}
      />
    </GdsTheme>
  )
}
```

### Calendar with Custom Dates

The `customizedDates` property allows you to customize the appearance of specific dates with colors and indicators:

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'
import { useRef, useEffect } from 'react'

function CustomizedCalendar() {
  const calendarRef = useRef<any>(null)

  useEffect(() => {
    if (calendarRef.current) {
      // customizedDates must be set via property, not attribute
      calendarRef.current.customizedDates = [
        {
          date: new Date(2025, 7, 25),
          color: 'var(--intent-danger-background)',
        },
        {
          date: new Date(2025, 7, 27),
          color: 'var(--intent-danger-background)',
          indicator: 'dot',
        },
        {
          date: new Date(2025, 7, 28),
          color: 'var(--intent-positive-background)',
          indicator: 'icon',
        },
        {
          date: new Date(2025, 7, 29),
          disabled: true,
        },
      ]
    }
  }, [])

  return (
    <GdsTheme>
      <GdsCalendar 
        ref={calendarRef}
        label="Calendar with customized dates"
      />
    </GdsTheme>
  )
}
```

### Complete Inline Datepicker

A full-featured inline datepicker with month/year dropdowns:

```tsx
import { 
  GdsCalendar, 
  GdsTheme, 
  GdsFlex, 
  GdsDropdown,
  GdsOption 
} from '@sebgroup/green-core/react'
import { useState, useRef, useEffect } from 'react'

function InlineDatepicker() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [focusedYear, setFocusedYear] = useState(new Date().getFullYear())
  const [focusedMonth, setFocusedMonth] = useState(new Date().getMonth())
  const calendarRef = useRef<any>(null)

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const years = Array.from(
    { length: 3 }, 
    (_, i) => new Date().getFullYear() + i
  )

  useEffect(() => {
    if (calendarRef.current) {
      const customizedDates = [
        {
          date: new Date(2025, 7, 25),
          color: 'var(--intent-danger-background)',
        },
        {
          date: new Date(2025, 7, 27),
          color: 'var(--intent-danger-background)',
          indicator: 'dot',
        },
        {
          date: new Date(2025, 7, 28),
          color: 'var(--intent-danger-background)',
          indicator: 'icon',
        },
        {
          date: new Date(2025, 7, 29),
          disabled: true,
        },
      ]
      
      calendarRef.current.customizedDates = customizedDates
    }
  }, [])

  const handleYearChange = (e: CustomEvent) => {
    const year = parseInt(e.target.value)
    setFocusedYear(year)
    if (calendarRef.current) {
      calendarRef.current.focusedYear = year
    }
  }

  const handleMonthChange = (e: CustomEvent) => {
    const month = parseInt(e.target.value)
    setFocusedMonth(month)
    if (calendarRef.current) {
      calendarRef.current.focusedMonth = month
    }
  }

  const handleDateFocused = (e: CustomEvent) => {
    setFocusedYear(e.target.focusedYear)
    setFocusedMonth(e.target.focusedMonth)
  }

  const handleChange = (e: CustomEvent) => {
    setSelectedDate(e.target.value)
  }

  return (
    <GdsTheme>
      <div style={{ width: '362px' }}>
        <GdsFlex gap="m">
          <GdsDropdown 
            label="Year" 
            size="small"
            value={String(focusedYear)}
            onChange={handleYearChange}
          >
            {years.map(year => (
              <GdsOption key={year} value={String(year)}>
                {year}
              </GdsOption>
            ))}
          </GdsDropdown>
          
          <GdsDropdown 
            label="Month" 
            size="small"
            maxHeight="200"
            value={String(focusedMonth)}
            onChange={handleMonthChange}
          >
            {months.map((month, index) => (
              <GdsOption key={index} value={String(index)}>
                {month}
              </GdsOption>
            ))}
          </GdsDropdown>
        </GdsFlex>

        <GdsCalendar 
          ref={calendarRef}
          label="Calendar"
          value={selectedDate}
          onChange={handleChange}
          onGdsDateFocused={handleDateFocused}
        />

        <div>
          Selected date: 
          <span style={{ fontWeight: 'bold' }}>
            {selectedDate ? selectedDate.toDateString() : 'None'}
          </span>
        </div>
      </div>
    </GdsTheme>
  )
}
```

### Controlled Calendar

Full control over the calendar state:

```tsx
import { GdsCalendar, GdsTheme, GdsButton, GdsFlex } from '@sebgroup/green-core/react'
import { useState } from 'react'

function ControlledCalendar() {
  const [value, setValue] = useState<Date | undefined>()
  const [focusedMonth, setFocusedMonth] = useState(new Date().getMonth())
  const [focusedYear, setFocusedYear] = useState(new Date().getFullYear())

  const handlePreviousMonth = () => {
    if (focusedMonth === 0) {
      setFocusedMonth(11)
      setFocusedYear(focusedYear - 1)
    } else {
      setFocusedMonth(focusedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (focusedMonth === 11) {
      setFocusedMonth(0)
      setFocusedYear(focusedYear + 1)
    } else {
      setFocusedMonth(focusedMonth + 1)
    }
  }

  const handleToday = () => {
    const today = new Date()
    setValue(today)
    setFocusedMonth(today.getMonth())
    setFocusedYear(today.getFullYear())
  }

  return (
    <GdsTheme>
      <GdsFlex flexDirection="column" gap="m">
        <GdsFlex gap="m" justifyContent="space-between">
          <GdsButton rank="secondary" onClick={handlePreviousMonth}>
            Previous
          </GdsButton>
          <GdsButton rank="secondary" onClick={handleToday}>
            Today
          </GdsButton>
          <GdsButton rank="secondary" onClick={handleNextMonth}>
            Next
          </GdsButton>
        </GdsFlex>

        <GdsCalendar 
          label="Controlled calendar"
          value={value}
          focusedMonth={focusedMonth}
          focusedYear={focusedYear}
          onChange={(e: CustomEvent) => setValue(e.target.value)}
        />
      </GdsFlex>
    </GdsTheme>
  )
}
```

## Use Cases

### Date Selection in Forms
- Booking systems
- Appointment scheduling
- Date of birth input
- Event date selection

### Date Range Selection
- Vacation booking
- Report date ranges
- Availability calendars

### Visual Indicators
- Availability calendars (available/unavailable dates)
- Event calendars (dates with events)
- Booking calendars (booked/available dates)
- Holiday calendars (public holidays highlighted)

### Inline Datepickers
- Alternative to popup datepickers
- Dashboard widgets
- Embedded date selection

## Best Practices

### Do's
- ✅ Always provide a `label` attribute for accessibility
- ✅ Set appropriate `min` and `max` dates for your use case
- ✅ Use `customizedDates` to highlight special dates (holidays, events)
- ✅ Handle both `change` and `gds-date-focused` events for full control
- ✅ Use `hideExtraneousDays` for cleaner minimal calendars
- ✅ Set `disabledWeekends` for business day selection
- ✅ Use `size="small"` when space is limited
- ✅ Store selected date in controlled component state
- ✅ Validate selected date against business rules

### Don'ts
- ❌ Don't forget to set `customizedDates` via property, not attribute
- ❌ Don't use calendar without a label (accessibility issue)
- ❌ Don't set overly restrictive date ranges without user guidance
- ❌ Don't disable dates without visual indication or explanation
- ❌ Don't forget to handle the `change` event
- ❌ Don't use calendar for far-future dates without year/month controls
- ❌ Don't customize dates with unclear color meanings

## Common Patterns

### Appointment Booking Calendar

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'
import { useRef, useEffect, useState } from 'react'

function AppointmentCalendar() {
  const calendarRef = useRef<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()

  useEffect(() => {
    if (calendarRef.current) {
      // Mark unavailable dates
      const unavailableDates = [
        new Date(2025, 11, 24),
        new Date(2025, 11, 25),
        new Date(2025, 11, 31),
      ]

      // Mark dates with available slots
      const availableDates = [
        { date: new Date(2025, 11, 20), color: 'var(--intent-positive-background)' },
        { date: new Date(2025, 11, 21), color: 'var(--intent-positive-background)' },
        { date: new Date(2025, 11, 22), color: 'var(--intent-positive-background)' },
      ]

      calendarRef.current.disabledDates = unavailableDates
      calendarRef.current.customizedDates = availableDates
    }
  }, [])

  return (
    <GdsTheme>
      <GdsCalendar 
        ref={calendarRef}
        label="Select appointment date"
        disabledWeekends={true}
        min={new Date()}
        value={selectedDate}
        onChange={(e: CustomEvent) => setSelectedDate(e.target.value)}
      />
    </GdsTheme>
  )
}
```

### Event Calendar

```tsx
import { GdsCalendar, GdsTheme, GdsFlex } from '@sebgroup/green-core/react'
import { useRef, useEffect } from 'react'

function EventCalendar() {
  const calendarRef = useRef<any>(null)

  useEffect(() => {
    if (calendarRef.current) {
      const events = [
        { 
          date: new Date(2025, 11, 15), 
          color: 'var(--intent-notice-background)',
          indicator: 'dot'
        },
        { 
          date: new Date(2025, 11, 20), 
          color: 'var(--intent-positive-background)',
          indicator: 'dot'
        },
        { 
          date: new Date(2025, 11, 25), 
          color: 'var(--intent-danger-background)',
          indicator: 'icon'
        },
      ]

      calendarRef.current.customizedDates = events
    }
  }, [])

  return (
    <GdsTheme>
      <GdsFlex flexDirection="column" gap="m">
        <GdsCalendar 
          ref={calendarRef}
          label="Events calendar"
        />
        
        <GdsFlex gap="m" alignItems="center">
          <span style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            background: 'var(--intent-notice-background)'
          }} />
          <span>Meeting</span>
          
          <span style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            background: 'var(--intent-positive-background)',
            marginLeft: '16px'
          }} />
          <span>Deadline</span>
          
          <span style={{ 
            width: '12px', 
            height: '12px', 
            borderRadius: '50%',
            background: 'var(--intent-danger-background)',
            marginLeft: '16px'
          }} />
          <span>Holiday</span>
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Date of Birth Selector

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'
import { useState } from 'react'

function DateOfBirthSelector() {
  const [birthDate, setBirthDate] = useState<Date | undefined>()
  
  const today = new Date()
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
  const minDate = new Date(today.getFullYear() - 120, 0, 1)

  return (
    <GdsTheme>
      <GdsCalendar 
        label="Date of birth"
        value={birthDate}
        min={minDate}
        max={maxDate}
        focusedYear={today.getFullYear() - 30}
        onChange={(e: CustomEvent) => setBirthDate(e.target.value)}
      />
    </GdsTheme>
  )
}
```

### Business Days Only

```tsx
import { GdsCalendar, GdsTheme } from '@sebgroup/green-core/react'
import { useRef, useEffect } from 'react'

function BusinessDaysCalendar() {
  const calendarRef = useRef<any>(null)

  useEffect(() => {
    if (calendarRef.current) {
      // Disable public holidays
      const publicHolidays = [
        new Date(2025, 0, 1),   // New Year
        new Date(2025, 11, 25), // Christmas
        new Date(2025, 11, 26), // Boxing Day
      ]

      calendarRef.current.disabledDates = publicHolidays
      
      // Highlight holidays with indicator
      calendarRef.current.customizedDates = publicHolidays.map(date => ({
        date,
        color: 'var(--intent-danger-background)',
        disabled: true
      }))
    }
  }, [])

  return (
    <GdsTheme>
      <GdsCalendar 
        ref={calendarRef}
        label="Select business day"
        disabledWeekends={true}
        min={new Date()}
      />
    </GdsTheme>
  )
}
```

## Related Components

- [GdsDatepicker](./GdsDatepicker.md) — For date selection with input field and calendar popover
- [GdsFormattedDate](./GdsFormattedDate.md) — For displaying selected dates
- **GdsDropdown**: For month/year selection in inline datepickers (see [Dropdown docs](https://storybook.seb.io/latest/core/?path=/docs/components-dropdown--docs))
- **GdsFlex**: For layout of calendar controls (see [GdsFlex.md](./GdsFlex.md))
- **GdsButton**: For navigation controls (see [GdsButton.md](./GdsButton.md))

## Accessibility

- **Keyboard Navigation**: Full arrow key navigation within calendar grid
- **Screen Readers**: Proper ARIA labels and date announcements
- **Focus Management**: Clear focus indicators and logical tab order
- **Labels**: Always provide `label` attribute for accessible name
- **Date Labels**: Customize with `dateLabelTemplate` for localization
- **Disabled States**: Properly communicated to assistive technologies

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Arrow Keys | Navigate between dates |
| Enter/Space | Select focused date |
| Page Up/Down | Change month |
| Home/End | Jump to first/last day of month |

### ARIA Support

```tsx
// Proper labeling
<GdsCalendar label="Select appointment date" />

// Custom date label template
<GdsCalendar 
  label="Calendar"
  dateLabelTemplate={(date) => 
    `${date.toLocaleDateString()}, ${getDayOfWeek(date)}`
  }
/>
```

## Notes

- The `customizedDates` property must be set via JavaScript property, not HTML attribute
- Use CSS custom properties (design tokens) for custom date colors for consistency
- The calendar uses zero-based month indexing (0 = January, 11 = December)
- Extraneous days (dates outside current month) can be hidden with `hideExtraneousDays`
- Week numbers follow ISO 8601 standard when `showWeekNumbers` is enabled
- The component handles leap years and varying month lengths automatically
- Selected date value is a JavaScript Date object
- Min/max dates are inclusive
- Disabled dates take precedence over enabled dates when overlapping
- The `gds-date-focused` event is cancellable - use `event.preventDefault()` to prevent focus change

## TypeScript Types

```typescript
interface CustomizedDate {
  date: Date
  color?: string
  indicator?: 'dot' | 'icon'
  disabled?: boolean
}

interface GdsCalendarProps {
  label?: string
  value?: Date
  min?: Date
  max?: Date
  focusedDate?: Date
  focusedMonth?: number
  focusedYear?: number
  size?: 'small' | 'large'
  showWeekNumbers?: boolean
  hideExtraneousDays?: boolean
  hideDayNames?: boolean
  disabledWeekends?: boolean
  disabledDates?: Date[]
  customizedDates?: CustomizedDate[]
  dateLabelTemplate?: (date: Date) => string
  onChange?: (event: CustomEvent) => void
  onGdsDateFocused?: (event: CustomEvent) => void
}
```
