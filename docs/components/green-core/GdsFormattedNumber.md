# GdsFormattedNumber

GdsFormattedNumber extends GdsText and formats numbers to the desired format.

**@beta** - This component is in beta and may have API changes in future releases.

## Overview

GdsFormattedNumber is a specialized text component that automatically formats numbers according to specified formats, locales, and currency settings. It extends GdsText, inheriting all text styling capabilities while adding number formatting logic.

The component is useful for:
- **Displaying numbers** in a consistent, localized format
- **Currency formatting** with locale-aware symbols and positioning
- **International number formatting** with proper separators
- **Financial displays** (amounts, balances, prices)
- **Consistent formatting** across the application

## Import

```tsx
// Use as JSX element in React
import { GdsFormattedNumber } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsFormattedNumber>1234.5</GdsFormattedNumber>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `locale` | `string` | `undefined` | Locale for number formatting (e.g., `'sv-SE'`, `'en-US'`) |
| `currency` | `string` | `undefined` | Currency code for currency formatting (e.g., `'SEK'`, `'EUR'`, `'USD'`) |
| `format` | `NumberFormats` | `'decimalsAndThousands'` | Number format specification |
| `tag` | `string` | `'span'` | HTML tag to use (h1, h2, h3, h4, h5, h6, p, span, etc.) |
| `level` | `GdsColorLevel` | `'2'` | Color level for token resolution (see Color System docs) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `number \| string` | Numerical value to display |
| `locale` | `string` | Locale for formatting |
| `currency` | `string` | Currency code |
| `format` | `NumberFormats` | Format specification |
| `formattedValue` | `string` | Read-only formatted number string |
| `tag` | `string` | HTML tag for the element |
| `level` | `GdsColorLevel` | Color level for styling |
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

### Number Formats

| Format | Description | Example Output |
|--------|-------------|----------------|
| `'decimalsAndThousands'` | Decimals with thousands separator (default) | `1,234.50` |
| `'decimals'` | Decimals only, no thousands separator | `1234.50` |
| `'thousands'` | Thousands separator, no decimals | `1,235` |
| `'currency'` | Currency format with symbol | `$1,234.50` or `1 234,50 kr` |
| `'percent'` | Percentage format | `12.5%` |
| `'integer'` | Integer only, no decimals | `1235` |

### Style Expression Properties

GdsFormattedNumber extends GdsText and inherits all style expression properties:

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

### Basic Number Formatting

```tsx
<GdsTheme>
  <GdsFlex gap="m" flex-direction="column">
    <GdsFormattedNumber />
    <GdsFormattedNumber>1234.5</GdsFormattedNumber>
  </GdsFlex>
</GdsTheme>
```

### Using `value` Property

```tsx
<GdsTheme>
  <GdsFormattedNumber value={1234.5} />
  <GdsFormattedNumber value="1234.5" />
</GdsTheme>
```

### Currency Formatting

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>SEK:</GdsText>
      <GdsFormattedNumber currency="SEK" format="currency">
        1234.5
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>EUR:</GdsText>
      <GdsFormattedNumber currency="EUR" format="currency">
        1234.5
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsDivider />
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>USD:</GdsText>
      <GdsFormattedNumber currency="USD" format="currency">
        1234.5
      </GdsFormattedNumber>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### With Swedish Locale

```tsx
<GdsTheme>
  <GdsFormattedNumber locale="sv-SE" currency="SEK" format="currency">
    1234.5
  </GdsFormattedNumber>
</GdsTheme>
```

### Different Number Formats

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Decimals & Thousands:</GdsText>
      <GdsFormattedNumber format="decimalsAndThousands">
        1234567.89
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Decimals Only:</GdsText>
      <GdsFormattedNumber format="decimals">
        1234567.89
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Thousands Only:</GdsText>
      <GdsFormattedNumber format="thousands">
        1234567.89
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Integer:</GdsText>
      <GdsFormattedNumber format="integer">
        1234567.89
      </GdsFormattedNumber>
    </GdsFlex>
    
    <GdsFlex gap="l" justify-content="space-between">
      <GdsText>Percent:</GdsText>
      <GdsFormattedNumber format="percent">
        0.125
      </GdsFormattedNumber>
    </GdsFlex>
  </GdsFlex>
</GdsTheme>
```

### With Custom Font

```tsx
<GdsTheme>
  <GdsFormattedNumber font="heading-m" format="currency" currency="SEK">
    1234.5
  </GdsFormattedNumber>
</GdsTheme>
```

### As Different HTML Tags

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="s">
    <GdsFormattedNumber tag="span">1234.5</GdsFormattedNumber>
    <GdsFormattedNumber tag="p">1234.5</GdsFormattedNumber>
    <GdsFormattedNumber tag="strong">1234.5</GdsFormattedNumber>
  </GdsFlex>
</GdsTheme>
```

### Account Balance Card

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" text-transform="uppercase" opacity="0.6">
        Available Balance
      </GdsText>
      <GdsFormattedNumber 
        font="heading-xl" 
        format="currency" 
        currency="SEK"
        locale="sv-SE"
      >
        15250.75
      </GdsFormattedNumber>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Transaction List with Amounts

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Recent Transactions</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="body-m">Coffee Shop</GdsText>
            <GdsFormattedDate font="detail-s" format="dateShort">
              2025-02-25T13:17:30.000Z
            </GdsFormattedDate>
          </GdsFlex>
          <GdsFormattedNumber 
            font="heading-m" 
            format="currency" 
            currency="SEK"
            color="negative"
          >
            -45.50
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsDivider />
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="body-m">Salary Deposit</GdsText>
            <GdsFormattedDate font="detail-s" format="dateShort">
              2025-02-20T09:00:00.000Z
            </GdsFormattedDate>
          </GdsFlex>
          <GdsFormattedNumber 
            font="heading-m" 
            format="currency" 
            currency="SEK"
            color="positive"
          >
            25000.00
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsDivider />
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="body-m">Grocery Store</GdsText>
            <GdsFormattedDate font="detail-s" format="dateShort">
              2025-02-18T16:45:00.000Z
            </GdsFormattedDate>
          </GdsFlex>
          <GdsFormattedNumber 
            font="heading-m" 
            format="currency" 
            currency="SEK"
            color="negative"
          >
            -567.80
          </GdsFormattedNumber>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Multi-Currency Display

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Currency Exchange Rates</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between">
          <GdsText>1 EUR =</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            11.45
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>1 USD =</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            10.25
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>1 GBP =</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            13.15
          </GdsFormattedNumber>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Portfolio Summary

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Investment Portfolio</GdsText>
      
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex flex-direction="column" gap="xs">
          <GdsText font="detail-s" opacity="0.6">Total Value</GdsText>
          <GdsFormattedNumber 
            font="heading-xl" 
            format="currency" 
            currency="SEK"
          >
            1250000
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsDivider />
        
        <GdsFlex justify-content="space-between">
          <GdsText>Today's Change</GdsText>
          <GdsFlex flex-direction="column" align-items="end" gap="xs">
            <GdsFormattedNumber 
              format="currency" 
              currency="SEK"
              color="positive"
            >
              12500
            </GdsFormattedNumber>
            <GdsFormattedNumber format="percent" color="positive">
              0.01
            </GdsFormattedNumber>
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Price Table

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Subscription Plans</GdsText>
      
      <GdsFlex gap="m">
        <GdsCard padding="m" flex="1" border-color="subtle-01">
          <GdsFlex flex-direction="column" gap="m" align-items="center">
            <GdsText font="heading-s">Basic</GdsText>
            <GdsFlex flex-direction="column" align-items="center">
              <GdsFormattedNumber 
                font="heading-xl" 
                format="currency" 
                currency="SEK"
              >
                99
              </GdsFormattedNumber>
              <GdsText font="detail-s" opacity="0.6">per month</GdsText>
            </GdsFlex>
            <GdsButton width="100%">Subscribe</GdsButton>
          </GdsFlex>
        </GdsCard>
        
        <GdsCard padding="m" flex="1" border-color="interactive">
          <GdsFlex flex-direction="column" gap="m" align-items="center">
            <GdsFlex gap="s" align-items="center">
              <GdsText font="heading-s">Premium</GdsText>
              <GdsBadge variant="positive">Popular</GdsBadge>
            </GdsFlex>
            <GdsFlex flex-direction="column" align-items="center">
              <GdsFormattedNumber 
                font="heading-xl" 
                format="currency" 
                currency="SEK"
              >
                199
              </GdsFormattedNumber>
              <GdsText font="detail-s" opacity="0.6">per month</GdsText>
            </GdsFlex>
            <GdsButton width="100%">Subscribe</GdsButton>
          </GdsFlex>
        </GdsCard>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Statistics Dashboard

```tsx
<GdsTheme>
  <GdsFlex gap="m">
    <GdsCard padding="m" flex="1">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s" opacity="0.6">Total Sales</GdsText>
        <GdsFormattedNumber 
          font="heading-l" 
          format="currency" 
          currency="SEK"
        >
          2450000
        </GdsFormattedNumber>
        <GdsFlex gap="xs" align-items="center">
          <GdsFormattedNumber format="percent" color="positive" font="detail-s">
            0.15
          </GdsFormattedNumber>
          <GdsText font="detail-s" opacity="0.6">vs last month</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
    
    <GdsCard padding="m" flex="1">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s" opacity="0.6">Active Users</GdsText>
        <GdsFormattedNumber 
          font="heading-l" 
          format="decimalsAndThousands"
        >
          45678
        </GdsFormattedNumber>
        <GdsFlex gap="xs" align-items="center">
          <GdsFormattedNumber format="percent" color="positive" font="detail-s">
            0.08
          </GdsFormattedNumber>
          <GdsText font="detail-s" opacity="0.6">vs last month</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  </GdsFlex>
</GdsTheme>
```

### Dynamic Value from State

```tsx
import { useState } from 'react'

function BalanceDisplay() {
  const [balance, setBalance] = useState(15250.75)
  
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex flex-direction="column" gap="xs">
          <GdsText font="detail-s">Account Balance:</GdsText>
          <GdsFormattedNumber 
            font="heading-xl" 
            format="currency" 
            currency="SEK"
            locale="sv-SE"
            value={balance}
          />
        </GdsFlex>
        
        <GdsFlex gap="m">
          <GdsButton onClick={() => setBalance(balance + 1000)}>
            Add 1000
          </GdsButton>
          <GdsButton rank="secondary" onClick={() => setBalance(balance - 500)}>
            Subtract 500
          </GdsButton>
        </GdsFlex>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Locale Comparison

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Number Formatting by Locale</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between">
          <GdsText>English (US):</GdsText>
          <GdsFormattedNumber 
            locale="en-US" 
            format="currency" 
            currency="USD"
          >
            1234567.89
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>Swedish:</GdsText>
          <GdsFormattedNumber 
            locale="sv-SE" 
            format="currency" 
            currency="SEK"
          >
            1234567.89
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>German:</GdsText>
          <GdsFormattedNumber 
            locale="de-DE" 
            format="currency" 
            currency="EUR"
          >
            1234567.89
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between">
          <GdsText>French:</GdsText>
          <GdsFormattedNumber 
            locale="fr-FR" 
            format="currency" 
            currency="EUR"
          >
            1234567.89
          </GdsFormattedNumber>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Percentage Displays

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Performance Metrics</GdsText>
      
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText>Conversion Rate</GdsText>
          <GdsFormattedNumber format="percent" font="heading-m">
            0.0345
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText>Bounce Rate</GdsText>
          <GdsFormattedNumber format="percent" font="heading-m">
            0.42
          </GdsFormattedNumber>
        </GdsFlex>
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText>Growth</GdsText>
          <GdsFormattedNumber format="percent" font="heading-m" color="positive">
            0.15
          </GdsFormattedNumber>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

## Best Practices

### Format Selection
- Use `decimalsAndThousands` (default) for general numeric displays
- Use `currency` for monetary amounts with appropriate currency code
- Use `percent` for percentages and ratios
- Use `integer` for whole numbers (counts, IDs)
- Use `thousands` for large rounded numbers

### Locale Management
- Set locale based on user preferences or browser settings
- Use consistent locale throughout the application
- Test with multiple locales to ensure proper formatting
- Consider different decimal and thousands separators

### Currency Handling
- Always specify currency code when using `format="currency"`
- Match locale to currency for correct symbol placement
- Consider using appropriate color for positive/negative amounts
- Display currency symbol consistently

### Accessibility
- Provide context for what the number represents
- Use semantic labels with numbers
- Ensure sufficient color contrast
- Consider screen reader announcements for large numbers

### Typography
- Use appropriate font sizes for the context
- Maintain hierarchy with surrounding text
- Consider readability on different screen sizes
- Use font-weight for emphasis when needed

### Layout
- Align numbers consistently (typically right-aligned in tables)
- Group related financial information
- Use consistent formatting across similar displays
- Consider responsive behavior for long numbers

## Common Patterns

### Basic Number Display
```tsx
<GdsFormattedNumber>1234.5</GdsFormattedNumber>
```

### Currency Display
```tsx
<GdsFormattedNumber format="currency" currency="SEK">
  1234.5
</GdsFormattedNumber>
```

### With Locale
```tsx
<GdsFormattedNumber locale="sv-SE" format="currency" currency="SEK">
  1234.5
</GdsFormattedNumber>
```

### Percentage Display
```tsx
<GdsFormattedNumber format="percent">0.125</GdsFormattedNumber>
```

### With Custom Styling
```tsx
<GdsFormattedNumber 
  font="heading-m" 
  color="positive"
  format="currency"
  currency="SEK"
>
  1234.5
</GdsFormattedNumber>
```

## TypeScript Types

```tsx
import type { GdsFormattedNumber } from '@sebgroup/green-core/react'

// Number format types
type NumberFormats = 
  | 'decimalsAndThousands'
  | 'decimals'
  | 'thousands'
  | 'currency'
  | 'percent'
  | 'integer'

// Color level type
type GdsColorLevel = '1' | '2' | '3' | '4'

// Component props type
interface GdsFormattedNumberProps extends React.HTMLAttributes<HTMLElement> {
  value?: number | string
  locale?: string
  currency?: string
  format?: NumberFormats
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
  
  // Color styling
  color?: string
  
  // Events
  onClick?: (event: MouseEvent) => void
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}

// Read-only formatted value
interface GdsFormattedNumberElement extends HTMLElement {
  formattedValue: string
}
```

## Related Components

- [GdsText](./GdsText.md) — Base text component (GdsFormattedNumber extends this)
- [GdsSensitiveNumber](./GdsSensitiveNumber.md) — Formatted number with blur effect for privacy protection (beta)
- [GdsFormattedAccount](./GdsFormattedAccount.md) — For formatted account numbers
- [GdsFormattedDate](./GdsFormattedDate.md) — For formatted dates and times
- [GdsGroupedList](./GdsGroupedList.md) — For displaying numbers in structured lists
- [GdsCard](./GdsCard.md) — Card container for number displays
- [GdsFlex](./GdsFlex.md) — Layout for financial information
- [GdsDivider](./GdsDivider.md) — Separating number entries
- [GdsBadge](./GdsBadge.md) — Status indicators with numbers
- [GdsDiv](./GdsDiv.md) — Generic container component

## Accessibility

- **Semantic HTML**: Consider using appropriate tags for context
- **Screen Readers**: Formatted numbers are read in locale-specific format
- **Contrast**: Ensure sufficient color contrast for readability
- **Context**: Always provide labels or context for numbers
- **Large Numbers**: Consider how screen readers announce large numbers

## Notes

- **@beta**: This component is in beta and API may change
- Extends GdsText, inheriting all text styling capabilities
- Default format is `'decimalsAndThousands'`
- Formatting is locale-aware (respects `locale` attribute)
- `formattedValue` property provides the formatted string (read-only)
- Supports all GdsText style expression properties
- Can accept number or string values via `value` property
- Content (children) can also be used to provide numeric value
- Empty values render as empty (placeholder state)
- Locale defaults to browser/system locale if not specified
- Currency format requires `currency` attribute
- Use appropriate color tokens for positive/negative amounts
- Test with various locales and currencies
- Use consistent number formatting across application
- Consider international users and their locale preferences
