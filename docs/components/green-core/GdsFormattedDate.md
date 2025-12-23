# GdsFormattedDate

GdsFormattedDate extends GdsText and formats dates and times to the desired format.

**@beta** - This component is in beta and may have API changes in future releases.

## Overview

GdsFormattedDate is a specialized text component that automatically formats dates and times according to specified formats and locales. It extends GdsText, inheriting all text styling capabilities while adding date/time formatting logic.

The component is useful for:
- **Displaying dates and times** in a consistent, localized format
- **International date formatting** with locale support
- **Various date/time representations** (short, long, with/without weekday, time only)
- **Consistent formatting** across the application

## Import

```tsx
// Use as JSX element in React
import { GdsFormattedDate } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsFormattedDate>
    Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
  </GdsFormattedDate>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `locale` | `string` | `undefined` | Locale for date formatting (e.g., `'sv-SE'`, `'en-US'`) |
| `format` | `DateTimeFormat` | `'dateOnlyNumbers'` | Date/time format specification |
| `tag` | `string` | `'span'` | HTML tag to use (h1, h2, h3, h4, h5, h6, p, span, etc.) |
| `level` | `GdsColorLevel` | `'2'` | Color level for token resolution (see Color System docs) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `Date \| string` | Date value to format (Date object or ISO string) |
| `locale` | `string` | Locale for formatting |
| `format` | `DateTimeFormat` | Format specification |
| `formattedValue` | `string` | Read-only formatted date string |
| `tag` | `string` | HTML tag for the element |
| `level` | `GdsColorLevel` | Color level for styling |
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

### Date/Time Formats

| Format | Description | Example Output |
|--------|-------------|----------------|
| `'dateOnlyNumbers'` | Date with numbers only (default) | `2025-02-25` |
| `'dateLong'` | Long date format | `25 February 2025` |
| `'dateLongWithWeekday'` | Long date with weekday | `Tuesday, 25 February 2025` |
| `'dateShort'` | Short date format | `25 Feb 2025` |
| `'dateShortWithWeekday'` | Short date with weekday | `Tue, 25 Feb 2025` |
| `'timeShort'` | Short time format | `14:17` |
| `'timeLong'` | Long time format | `14:17:30` |

### Style Expression Properties

GdsFormattedDate extends GdsText and inherits all style expression properties:

| Property | Description | Values |
|----------|-------------|---------|
| `font` | Font token from design system | Font tokens (e.g., `'heading-m'`, `'body-s'`) |
| `font-weight` | CSS font-weight | Weight tokens from design system |
| `text-transform` | CSS text-transform | `'none'`, `'uppercase'`, `'lowercase'`, `'capitalize'` |
| `text-decoration` | CSS text-decoration | `'none'`, `'underline'`, `'line-through'` |
| `text-align` | CSS text-align | `'left'`, `'center'`, `'right'`, `'justify'` |
| `lines` | Number of lines to show | `number` (truncates with ellipsis) |
| `overflow-wrap` | CSS overflow-wrap | `'normal'`, `'break-word'`, `'anywhere'` |
| `white-space` | CSS white-space | `'normal'`, `'nowrap'`, `'pre'`, `'pre-wrap'` |
| `cursor` | CSS cursor | `'pointer'`, `'default'`, `'text'`, etc. |
| `pointer-events` | CSS pointer-events | `'auto'`, `'none'` |

Plus all layout style expression properties from GdsDiv (margin, padding, display, flex, grid, color, background, border, etc.)

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

## Examples

### All Date/Time Formats

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Date Only Numbers:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="dateOnlyNumbers" />
        <GdsFormattedDate format="dateOnlyNumbers">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Date Long:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="dateLong" />
        <GdsFormattedDate format="dateLong">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Date Long With Weekday:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="dateLongWithWeekday" />
        <GdsFormattedDate format="dateLongWithWeekday">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Date Short:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="dateShort" />
        <GdsFormattedDate format="dateShort">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Date Short With Weekday:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="dateShortWithWeekday" />
        <GdsFormattedDate format="dateShortWithWeekday">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Time Short:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="timeShort" />
        <GdsFormattedDate format="timeShort">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Time Long:</GdsText>
      <GdsFlex gap="m" flex-direction="column">
        <GdsFormattedDate format="timeLong" />
        <GdsFormattedDate format="timeLong">
          Tue Feb 25 2025 14:17:30 GMT+0100 (Central European Standard Time)
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Using `value` Property

```tsx
<GdsTheme>
  <GdsFormattedDate value={new Date()} />
  <GdsFormattedDate value="2025-02-25T13:17:30.000Z" />
</GdsTheme>
```

### With Swedish Locale

```tsx
<GdsTheme>
  <GdsFormattedDate locale="sv-SE" format="dateLong">
    2025-02-25T13:17:30.000Z
  </GdsFormattedDate>
</GdsTheme>
```

### With Different Locales

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="s">
    <GdsFormattedDate locale="en-US" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
    
    <GdsFormattedDate locale="sv-SE" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
    
    <GdsFormattedDate locale="de-DE" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
    
    <GdsFormattedDate locale="fr-FR" format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
</GdsTheme>
```

### With Custom Font

```tsx
<GdsTheme>
  <GdsFormattedDate font="heading-m" format="dateLong">
    2025-02-25T13:17:30.000Z
  </GdsFormattedDate>
</GdsTheme>
```

### As Different HTML Tags

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="s">
    <GdsFormattedDate tag="span" format="dateShort">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
    
    <GdsFormattedDate tag="p" format="dateShort">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
    
    <GdsFormattedDate tag="time" format="dateShort">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
</GdsTheme>
```

### In Card with Label

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" text-transform="uppercase" opacity="0.6">
        Transaction Date
      </GdsText>
      <GdsFormattedDate font="heading-s" format="dateLong">
        2025-02-25T13:17:30.000Z
      </GdsFormattedDate>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Transaction History

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Recent Transactions</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="body-m">Coffee Shop</GdsText>
            <GdsFormattedDate font="detail-s" format="dateLongWithWeekday">
              2025-02-25T13:17:30.000Z
            </GdsFormattedDate>
          </GdsFlex>
          <GdsText font="heading-m">-$4.50</GdsText>
        </GdsFlex>
        
        <GdsDivider />
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="body-m">Grocery Store</GdsText>
            <GdsFormattedDate font="detail-s" format="dateLongWithWeekday">
              2025-02-24T10:30:00.000Z
            </GdsFormattedDate>
          </GdsFlex>
          <GdsText font="heading-m">-$56.78</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Showing Date and Time

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="xs">
    <GdsFormattedDate format="dateLong">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
    <GdsFormattedDate format="timeLong" opacity="0.6">
      2025-02-25T13:17:30.000Z
    </GdsFormattedDate>
  </GdsFlex>
</GdsTheme>
```

### Appointment Card

```tsx
<GdsTheme>
  <GdsCard padding="m" border-color="interactive">
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText tag="h3" font="heading-m">Doctor Appointment</GdsText>
        <GdsBadge variant="positive">Confirmed</GdsBadge>
      </GdsFlex>
      
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s" opacity="0.6">Date</GdsText>
        <GdsFormattedDate font="body-m" format="dateLongWithWeekday">
          2025-03-15T10:00:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
      
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s" opacity="0.6">Time</GdsText>
        <GdsFormattedDate font="body-m" format="timeShort">
          2025-03-15T10:00:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
      
      <GdsFlex gap="m">
        <GdsButton rank="secondary">Reschedule</GdsButton>
        <GdsButton>Add to Calendar</GdsButton>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Event Timeline

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex gap="m" align-items="start">
      <GdsDiv 
        width="4px" 
        height="100%" 
        background="interactive"
        border-radius="2xl"
      />
      <GdsFlex flex-direction="column" gap="xs" flex="1">
        <GdsText font="body-m">Order Placed</GdsText>
        <GdsFormattedDate font="detail-s" format="dateShortWithWeekday" opacity="0.6">
          2025-02-20T09:00:00.000Z
        </GdsFormattedDate>
        <GdsFormattedDate font="detail-s" format="timeShort" opacity="0.6">
          2025-02-20T09:00:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsFlex gap="m" align-items="start">
      <GdsDiv 
        width="4px" 
        height="100%" 
        background="interactive"
        border-radius="2xl"
      />
      <GdsFlex flex-direction="column" gap="xs" flex="1">
        <GdsText font="body-m">Shipped</GdsText>
        <GdsFormattedDate font="detail-s" format="dateShortWithWeekday" opacity="0.6">
          2025-02-22T14:30:00.000Z
        </GdsFormattedDate>
        <GdsFormattedDate font="detail-s" format="timeShort" opacity="0.6">
          2025-02-22T14:30:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
    
    <GdsFlex gap="m" align-items="start">
      <GdsDiv 
        width="4px" 
        height="100%" 
        background="subtle-01"
        border-radius="2xl"
      />
      <GdsFlex flex-direction="column" gap="xs" flex="1">
        <GdsText font="body-m" opacity="0.6">Estimated Delivery</GdsText>
        <GdsFormattedDate font="detail-s" format="dateShortWithWeekday" opacity="0.6">
          2025-02-25T16:00:00.000Z
        </GdsFormattedDate>
      </GdsFlex>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### Relative Time Display

```tsx
import { useState, useEffect } from 'react'

function RelativeTime() {
  const [now, setNow] = useState(new Date())
  
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="s">
        <GdsText font="detail-s" opacity="0.6">Current Time</GdsText>
        <GdsFormattedDate font="heading-m" format="timeLong" value={now} />
        <GdsFormattedDate font="body-m" format="dateLong" value={now} />
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Schedule Display

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Today's Schedule</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex gap="m" align-items="center">
          <GdsFormattedDate 
            font="heading-s" 
            format="timeShort"
            min-width="60px"
          >
            2025-02-25T09:00:00.000Z
          </GdsFormattedDate>
          <GdsText flex="1">Team Meeting</GdsText>
        </GdsFlex>
        
        <GdsFlex gap="m" align-items="center">
          <GdsFormattedDate 
            font="heading-s" 
            format="timeShort"
            min-width="60px"
          >
            2025-02-25T11:30:00.000Z
          </GdsFormattedDate>
          <GdsText flex="1">Client Call</GdsText>
        </GdsFlex>
        
        <GdsFlex gap="m" align-items="center">
          <GdsFormattedDate 
            font="heading-s" 
            format="timeShort"
            min-width="60px"
          >
            2025-02-25T14:00:00.000Z
          </GdsFormattedDate>
          <GdsText flex="1">Project Review</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Dynamic Date from State

```tsx
import { useState } from 'react'

function DateDisplay() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsDatepicker 
          label="Select a date" 
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        
        <GdsFlex flex-direction="column" gap="s">
          <GdsText font="detail-s">Selected Date:</GdsText>
          <GdsFormattedDate 
            font="heading-m" 
            format="dateLongWithWeekday"
            value={selectedDate}
          />
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Multi-Locale Display

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">International Dates</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between">
          <GdsText>English (US):</GdsText>
          <GdsFormattedDate locale="en-US" format="dateLong">
            2025-02-25T13:17:30.000Z
          </GdsFormattedDate>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>Swedish:</GdsText>
          <GdsFormattedDate locale="sv-SE" format="dateLong">
            2025-02-25T13:17:30.000Z
          </GdsFormattedDate>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>German:</GdsText>
          <GdsFormattedDate locale="de-DE" format="dateLong">
            2025-02-25T13:17:30.000Z
          </GdsFormattedDate>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>Japanese:</GdsText>
          <GdsFormattedDate locale="ja-JP" format="dateLong">
            2025-02-25T13:17:30.000Z
          </GdsFormattedDate>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

## Best Practices

### Date Format Selection
- Use `dateOnlyNumbers` for technical displays (sortable, compact)
- Use `dateLong` or `dateLongWithWeekday` for user-friendly displays
- Use `dateShort` for space-constrained layouts
- Use time formats (`timeShort`, `timeLong`) when showing time separately

### Locale Management
- Set locale based on user preferences or browser settings
- Use consistent locale throughout the application
- Test with multiple locales to ensure proper formatting
- Consider RTL (right-to-left) languages

### Accessibility
- Use semantic `<time>` tag when appropriate (`tag="time"`)
- Provide context for what the date represents
- Ensure sufficient color contrast
- Consider adding `datetime` attribute for machine-readable dates

### Typography
- Use appropriate font sizes for the context
- Maintain hierarchy with surrounding text
- Consider readability on different screen sizes
- Use opacity for less important dates (timestamps, metadata)

### Layout
- Group related date information together
- Use consistent formatting across similar displays
- Align dates in lists or tables
- Consider responsive behavior

## Common Patterns

### Basic Date Display
```tsx
<GdsFormattedDate>2025-02-25T13:17:30.000Z</GdsFormattedDate>
```

### Long Date with Weekday
```tsx
<GdsFormattedDate format="dateLongWithWeekday">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>
```

### Time Only
```tsx
<GdsFormattedDate format="timeShort">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>
```

### With Locale
```tsx
<GdsFormattedDate locale="sv-SE" format="dateLong">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>
```

### With Custom Styling
```tsx
<GdsFormattedDate font="heading-m" opacity="0.8">
  2025-02-25T13:17:30.000Z
</GdsFormattedDate>
```

## TypeScript Types

```tsx
import type { GdsFormattedDate } from '@sebgroup/green-core/react'

// Date/time format types
type DateTimeFormat = 
  | 'dateOnlyNumbers'
  | 'dateLong'
  | 'dateLongWithWeekday'
  | 'dateShort'
  | 'dateShortWithWeekday'
  | 'timeShort'
  | 'timeLong'

// Color level type
type GdsColorLevel = '1' | '2' | '3' | '4'

// Component props type
interface GdsFormattedDateProps extends React.HTMLAttributes<HTMLElement> {
  value?: Date | string
  locale?: string
  format?: DateTimeFormat
  tag?: string
  level?: GdsColorLevel
  
  // Style expression properties (from GdsText)
  font?: string
  'font-weight'?: string
  'text-transform'?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  'text-decoration'?: string
  'text-align'?: string
  lines?: number
  'overflow-wrap'?: string
  'white-space'?: string
  cursor?: string
  'pointer-events'?: string
  
  // Events
  onClick?: (event: MouseEvent) => void
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}

// Read-only formatted value
interface GdsFormattedDateElement extends HTMLElement {
  formattedValue: string
}
```

## Related Components

- [GdsText](./GdsText.md) — Base text component (GdsFormattedDate extends this)
- [GdsSensitiveDate](./GdsSensitiveDate.md) — Formatted date with blur effect for privacy protection (beta)
- [GdsFormattedNumber](./GdsFormattedNumber.md) — For displaying amounts with dates (transactions)
- [GdsFormattedAccount](./GdsFormattedAccount.md) — For displaying account numbers with dates
- [GdsGroupedList](./GdsGroupedList.md) — For displaying dates in structured lists
- [GdsDatepicker](./GdsDatepicker.md) — Date picker for selecting dates
- [GdsCalendar](./GdsCalendar.md) — Calendar component for date selection
- [GdsCard](./GdsCard.md) — Card container for date displays
- [GdsFlex](./GdsFlex.md) — Layout for date information
- [GdsDivider](./GdsDivider.md) — Separating date entries
- [GdsBadge](./GdsBadge.md) — Status indicators with dates
- [GdsDiv](./GdsDiv.md) — Generic container component

## Accessibility

- **Semantic HTML**: Use `tag="time"` for date/time content when appropriate
- **Screen Readers**: Formatted dates are read in locale-specific format
- **Contrast**: Ensure sufficient color contrast for readability
- **Context**: Always provide context for what the date represents
- **ISO Format**: Consider adding machine-readable datetime attribute

## Notes

- **@beta**: This component is in beta and API may change
- Extends GdsText, inheriting all text styling capabilities
- Default format is `'dateOnlyNumbers'`
- Formatting is locale-aware (respects `locale` attribute)
- `formattedValue` property provides the formatted string (read-only)
- Supports all GdsText style expression properties
- Can accept Date objects or ISO date strings as `value`
- Content (children) can also be used to provide date value
- Empty dates render as empty (placeholder state)
- Locale defaults to browser/system locale if not specified
- Multiple format options for different use cases
- Consider using `<time>` tag for semantic HTML
- Test with various locales and formats
- Use consistent date formatting across application
