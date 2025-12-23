# GdsFormattedAccount

GdsFormattedAccount extends GdsText and formats account numbers to the desired format.

**@beta** - This component is in beta and may have API changes in future releases.

## Overview

GdsFormattedAccount is a specialized text component that automatically formats account numbers according to specified formats. It extends GdsText, inheriting all text styling capabilities while adding account number formatting logic.

The component is useful for:
- **Displaying bank account numbers** in a standardized format
- **Improving readability** by adding spacing/grouping to long numbers
- **Consistent formatting** across the application
- **International account formats** (IBAN, etc.)

## Import

```tsx
// Use as JSX element in React
import { GdsFormattedAccount } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsFormattedAccount>54400023423</GdsFormattedAccount>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `account` | `number \| string` | `undefined` | Account number or identifier to display. For format 'seb-account', needs to be 11 characters |
| `format` | `AccountFormats` | `'seb-account'` | Specifies the account format |
| `tag` | `string` | `'span'` | HTML tag to use (h1, h2, h3, h4, h5, h6, p, span, etc.) |
| `level` | `GdsColorLevel` | `'2'` | Color level for token resolution (see Color System docs) |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `account` | `number \| string` | Account number to format |
| `format` | `AccountFormats` | Account format specification |
| `formattedValue` | `string` | Read-only formatted account string |
| `tag` | `string` | HTML tag for the element |
| `level` | `GdsColorLevel` | Color level for styling |
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

### Style Expression Properties

GdsFormattedAccount extends GdsText and inherits all style expression properties:

| Property | Description | Values |
|----------|-------------|---------|
| `font` | Font token from design system | Font tokens (e.g., `'heading-m'`, `'body-s'`) |
| `text-transform` | CSS text-transform | `'none'`, `'uppercase'`, `'lowercase'`, `'capitalize'` |
| `text-decoration` | CSS text-decoration | `'none'`, `'underline'`, `'line-through'` |
| `lines` | Number of lines to show | `number` (truncates with ellipsis) |
| `overflow-wrap` | CSS overflow-wrap | `'normal'`, `'break-word'`, `'anywhere'` |
| `white-space` | CSS white-space | `'normal'`, `'nowrap'`, `'pre'`, `'pre-wrap'` |
| `aspect-ratio` | CSS aspect-ratio | Valid CSS aspect-ratio values |
| `cursor` | CSS cursor | `'pointer'`, `'default'`, `'text'`, etc. |
| `pointer-events` | CSS pointer-events | `'auto'`, `'none'` |

Plus all layout style expression properties from GdsDiv (margin, padding, display, flex, grid, etc.)

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

## Examples

### Basic SEB Account Format

```tsx
<GdsTheme>
  <GdsFlex gap="m" flex-direction="column">
    <GdsFormattedAccount>54400023423</GdsFormattedAccount>
    <GdsFormattedAccount account="54400023423" />
  </GdsFlex>
</GdsTheme>
```

### Using `account` Attribute

```tsx
<GdsTheme>
  <GdsFormattedAccount account="54400023423" />
</GdsTheme>
```

### Empty/Placeholder State

```tsx
<GdsTheme>
  <GdsFormattedAccount />
</GdsTheme>
```

### Different Format Types

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="s">
    <GdsFormattedAccount format="seb-account">54400023423</GdsFormattedAccount>
    {/* Add other formats when available */}
  </GdsFlex>
</GdsTheme>
```

### With Custom Font

```tsx
<GdsTheme>
  <GdsFormattedAccount font="heading-m">54400023423</GdsFormattedAccount>
</GdsTheme>
```

### As Different HTML Tags

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="s">
    <GdsFormattedAccount tag="span">54400023423</GdsFormattedAccount>
    <GdsFormattedAccount tag="p">54400023423</GdsFormattedAccount>
    <GdsFormattedAccount tag="div">54400023423</GdsFormattedAccount>
  </GdsFlex>
</GdsTheme>
```

### In Card with Label

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="xs">
      <GdsText font="detail-s" text-transform="uppercase" opacity="0.6">
        Account Number
      </GdsText>
      <GdsFormattedAccount font="heading-s">54400023423</GdsFormattedAccount>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Multiple Accounts List

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Your Accounts</GdsText>
      
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="detail-s">Checking Account</GdsText>
            <GdsFormattedAccount>54400023423</GdsFormattedAccount>
          </GdsFlex>
          <GdsText font="heading-m">$12,345.67</GdsText>
        </GdsFlex>
        
        <GdsDivider />
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsFlex flex-direction="column" gap="xs">
            <GdsText font="detail-s">Savings Account</GdsText>
            <GdsFormattedAccount>54400056789</GdsFormattedAccount>
          </GdsFlex>
          <GdsText font="heading-m">$5,678.90</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Clickable Account Number

```tsx
<GdsTheme>
  <GdsFormattedAccount 
    cursor="pointer"
    onClick={() => console.log('Account clicked')}
  >
    54400023423
  </GdsFormattedAccount>
</GdsTheme>
```

### With Text Styling

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="s">
    <GdsFormattedAccount 
      font="body-m" 
      text-decoration="underline"
    >
      54400023423
    </GdsFormattedAccount>
    
    <GdsFormattedAccount 
      font="detail-l" 
      text-transform="uppercase"
    >
      54400023423
    </GdsFormattedAccount>
  </GdsFlex>
</GdsTheme>
```

### In Table/Grid Layout

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="s">
      <GdsFlex gap="m" padding="s" background="level-1">
        <GdsText font="detail-s" flex="1">Account</GdsText>
        <GdsText font="detail-s" flex="1">Type</GdsText>
        <GdsText font="detail-s" flex="1">Balance</GdsText>
      </GdsFlex>
      
      <GdsFlex gap="m" padding="s">
        <GdsFormattedAccount flex="1">54400023423</GdsFormattedAccount>
        <GdsText flex="1">Checking</GdsText>
        <GdsText flex="1">$10,000</GdsText>
      </GdsFlex>
      
      <GdsFlex gap="m" padding="s">
        <GdsFormattedAccount flex="1">54400056789</GdsFormattedAccount>
        <GdsText flex="1">Savings</GdsText>
        <GdsText flex="1">$25,000</GdsText>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### With Copy Functionality

```tsx
import { useState } from 'react'

function CopyableAccount() {
  const [copied, setCopied] = useState(false)
  const accountNumber = '54400023423'
  
  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <GdsTheme>
      <GdsFlex gap="s" align-items="center">
        <GdsFormattedAccount>{accountNumber}</GdsFormattedAccount>
        <GdsButton 
          rank="tertiary" 
          size="small" 
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </GdsButton>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Transaction Details

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Transaction Details</GdsText>
      
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s" opacity="0.6">From Account</GdsText>
        <GdsFormattedAccount font="body-m">54400023423</GdsFormattedAccount>
      </GdsFlex>
      
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s" opacity="0.6">To Account</GdsText>
        <GdsFormattedAccount font="body-m">54400056789</GdsFormattedAccount>
      </GdsFlex>
      
      <GdsDivider />
      
      <GdsFlex justify-content="space-between">
        <GdsText>Amount</GdsText>
        <GdsText font="heading-m">$500.00</GdsText>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Account Selector

```tsx
function AccountSelector() {
  const [selected, setSelected] = useState('54400023423')
  
  const accounts = [
    { number: '54400023423', type: 'Checking', balance: '$12,345' },
    { number: '54400056789', type: 'Savings', balance: '$5,678' },
    { number: '54400098765', type: 'Investment', balance: '$50,000' }
  ]
  
  return (
    <GdsTheme>
      <GdsFlex flex-direction="column" gap="s">
        {accounts.map(account => (
          <GdsCard
            key={account.number}
            padding="m"
            cursor="pointer"
            border-color={selected === account.number ? 'interactive' : 'subtle-01'}
            onClick={() => setSelected(account.number)}
          >
            <GdsFlex justify-content="space-between" align-items="center">
              <GdsFlex flex-direction="column" gap="xs">
                <GdsText font="detail-s">{account.type}</GdsText>
                <GdsFormattedAccount>{account.number}</GdsFormattedAccount>
              </GdsFlex>
              <GdsText font="heading-m">{account.balance}</GdsText>
            </GdsFlex>
          </GdsCard>
        ))}
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Responsive Account Display

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex 
      flex-direction="column" 
      gap="m"
      // On mobile, stack vertically; on desktop, use row
    >
      <GdsFlex flex-direction="column" gap="xs" flex="1">
        <GdsText font="detail-s" opacity="0.6">Primary Account</GdsText>
        <GdsFormattedAccount font="body-m">54400023423</GdsFormattedAccount>
      </GdsFlex>
      
      <GdsFlex flex-direction="column" gap="xs" flex="1">
        <GdsText font="detail-s" opacity="0.6">Available Balance</GdsText>
        <GdsText font="heading-l">$12,345.67</GdsText>
      </GdsFlex>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### With Status Badge

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex justify-content="space-between" align-items="center">
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="detail-s">Checking Account</GdsText>
        <GdsFormattedAccount>54400023423</GdsFormattedAccount>
      </GdsFlex>
      <GdsBadge variant="positive">Active</GdsBadge>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Truncated in Narrow Space

```tsx
<GdsTheme>
  <GdsDiv style={{ width: '200px' }}>
    <GdsFormattedAccount 
      lines={1}
      overflow-wrap="break-word"
    >
      54400023423
    </GdsFormattedAccount>
  </GdsDiv>
</GdsTheme>
```

## Best Practices

### Account Number Format
- Ensure account numbers match the required format length (11 characters for 'seb-account')
- Validate account numbers before passing to component
- Handle empty/null account numbers gracefully

### Display Context
- Always provide context (label) for what the account number represents
- Use consistent formatting across the application
- Consider adding copy functionality for user convenience

### Accessibility
- Use semantic HTML tags when appropriate (`tag` attribute)
- Provide sufficient color contrast
- Ensure account numbers are readable by screen readers

### Typography
- Use appropriate font sizes for the context
- Maintain hierarchy with surrounding text
- Consider readability on different screen sizes

### Layout
- Group related account information together
- Use consistent spacing with other account details
- Consider responsive behavior on mobile devices

## Common Patterns

### Basic Account Display
```tsx
<GdsFormattedAccount>54400023423</GdsFormattedAccount>
```

### Labeled Account
```tsx
<GdsFlex flex-direction="column" gap="xs">
  <GdsText font="detail-s">Account Number</GdsText>
  <GdsFormattedAccount>54400023423</GdsFormattedAccount>
</GdsFlex>
```

### Large Heading Style
```tsx
<GdsFormattedAccount font="heading-l">54400023423</GdsFormattedAccount>
```

### Clickable Account
```tsx
<GdsFormattedAccount cursor="pointer" onClick={handleClick}>
  54400023423
</GdsFormattedAccount>
```

## TypeScript Types

```tsx
import type { GdsFormattedAccount } from '@sebgroup/green-core/react'

// Account format types
type AccountFormats = 'seb-account' // More formats may be added

// Color level type
type GdsColorLevel = '1' | '2' | '3' | '4'

// Component props type
interface GdsFormattedAccountProps extends React.HTMLAttributes<HTMLElement> {
  account?: number | string
  format?: AccountFormats
  tag?: string
  level?: GdsColorLevel
  
  // Style expression properties (from GdsText)
  font?: string
  'text-transform'?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  'text-decoration'?: string
  lines?: number
  'overflow-wrap'?: string
  'white-space'?: string
  'aspect-ratio'?: string
  cursor?: string
  'pointer-events'?: string
  
  // Events
  onClick?: (event: MouseEvent) => void
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}

// Read-only formatted value
interface GdsFormattedAccountElement extends HTMLElement {
  formattedValue: string
}
```

## Related Components

- [GdsText](./GdsText.md) — Base text component (GdsFormattedAccount extends this)
- [GdsSensitiveAccount](./GdsSensitiveAccount.md) — Formatted account with blur privacy protection (beta)
- [GdsFormattedNumber](./GdsFormattedNumber.md) — For displaying account balances and amounts
- [GdsFormattedDate](./GdsFormattedDate.md) — For displaying transaction dates
- [GdsGroupedList](./GdsGroupedList.md) — For displaying accounts in structured lists
- [GdsCard](./GdsCard.md) — Card container for account displays
- [GdsFlex](./GdsFlex.md) — Layout for account information
- [GdsDivider](./GdsDivider.md) — Separating multiple accounts
- [GdsBadge](./GdsBadge.md) — Status indicators for accounts
- [GdsButton](./GdsButton.md) — Actions related to accounts (copy, select, etc.)
- [GdsDiv](./GdsDiv.md) — Generic container component

## Accessibility

- **Semantic HTML**: Use appropriate `tag` attribute (span, p, div) based on context
- **Screen Readers**: Account numbers are read as-is by screen readers
- **Contrast**: Ensure sufficient color contrast for readability
- **Focus**: Clickable accounts should have clear focus indicators
- **Labels**: Always provide context for what the account number represents

## Notes

- **@beta**: This component is in beta and API may change
- Extends GdsText, inheriting all text styling capabilities
- Default format is `'seb-account'` which requires 11-character account numbers
- Formatting is applied automatically based on the `format` attribute
- `formattedValue` property provides the formatted string (read-only)
- Supports all GdsText style expression properties
- Inherits color level system from GdsDiv (default level 2)
- Can be rendered as any HTML tag via `tag` attribute
- Empty account numbers render as empty (placeholder state)
- For 'seb-account' format: account must be exactly 11 characters
- Additional formats may be added in future versions
- Consider validation before passing account numbers to component
- Use consistent formatting across application for better UX
