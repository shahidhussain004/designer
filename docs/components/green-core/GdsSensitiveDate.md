# GdsSensitiveDate

A specialized component that displays a formatted date with optional blur effect for sensitive information protection. When the `hide` property is set to `true`, the date is hidden using a blur effect.

**Status:** Beta

## Import

```tsx
import { GdsSensitiveDate } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" />
```

## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `hide` | `boolean` | `false` | When `true`, hides the sensitive date with blur effect |
| `locale` | `string` | `undefined` | The locale used for date formatting (e.g., `'sv-SE'`, `'en-US'`) |
| `format` | `DateTimeFormat` | `'dateOnlyNumbers'` | Specifies the date format |
| `tag` | `string` | `'span'` | Controls the HTML tag. Supports all valid HTML tags like `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`, etc. |
| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens from the corresponding level (see Color System documentation) |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only, set automatically) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `Date \| string` | `undefined` | The date value to be formatted, either Date object or ISO string |
| `formattedValue` | `string` | - | The formatted date value (read-only) |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Style expression properties for this element will use this selector by default (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element. Can be used for troubleshooting (read-only) |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element (read-only) |

### Typography Style Expression Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `font` | `string` | `undefined` | Controls the font property. Supports all font tokens from the design system |
| `font-weight` | `string` | `undefined` | Controls the font-weight property. Supports all typography weight tokens |
| `text-transform` | `string` | `undefined` | Controls the text-transform property (all valid CSS values) |
| `text-decoration` | `string` | `undefined` | Controls the text-decoration property (all valid CSS values) |
| `text-align` | `string` | `undefined` | Controls the text-align property (all valid CSS values) |
| `text-wrap` | `string` | `undefined` | Controls the text-wrap property (all valid CSS values) |
| `white-space` | `string` | `undefined` | Controls the white-space property (all valid CSS values) |
| `overflow-wrap` | `string` | `undefined` | Controls the overflow-wrap property (all valid CSS values) |
| `lines` | `number` | `undefined` | Controls the number of lines to show |

### Size & Dimension Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `width` | `string` | `undefined` | Controls the width property (supports space tokens and CSS values) |
| `min-width` | `string` | `undefined` | Controls the min-width property (supports space tokens and CSS values) |
| `max-width` | `string` | `undefined` | Controls the max-width property (supports space tokens and CSS values) |
| `inline-size` | `string` | `undefined` | Controls the inline-size property (supports space tokens and CSS values) |
| `min-inline-size` | `string` | `undefined` | Controls the min-inline-size property (supports space tokens and CSS values) |
| `max-inline-size` | `string` | `undefined` | Controls the max-inline-size property (supports space tokens and CSS values) |
| `height` | `string` | `undefined` | Controls the height property (supports space tokens and CSS values) |
| `min-height` | `string` | `undefined` | Controls the min-height property (supports space tokens and CSS values) |
| `max-height` | `string` | `undefined` | Controls the max-height property (supports space tokens and CSS values) |
| `block-size` | `string` | `undefined` | Controls the block-size property (supports space tokens and CSS values) |
| `min-block-size` | `string` | `undefined` | Controls the min-block-size property (supports space tokens and CSS values) |
| `max-block-size` | `string` | `undefined` | Controls the max-block-size property (supports space tokens and CSS values) |
| `aspect-ratio` | `string` | `undefined` | Controls the aspect-ratio property (all valid CSS values) |

### Spacing Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `margin` | `string` | `undefined` | Controls the margin property (only accepts space tokens) |
| `margin-inline` | `string` | `undefined` | Controls the margin-inline property (only accepts space tokens) |
| `margin-block` | `string` | `undefined` | Controls the margin-block property (only accepts space tokens) |
| `padding` | `string` | `undefined` | Controls the padding property (only accepts space tokens) |
| `padding-inline` | `string` | `undefined` | Controls the padding-inline property (only accepts space tokens) |
| `padding-block` | `string` | `undefined` | Controls the padding-block property (only accepts space tokens) |
| `gap` | `string` | `undefined` | Controls the gap property (only accepts space tokens) |

### Layout Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `display` | `string` | `undefined` | Controls the display property (all valid CSS values) |
| `position` | `string` | `undefined` | Controls the position property (all valid CSS values) |
| `inset` | `string` | `undefined` | Controls the inset property (all valid CSS values) |
| `transform` | `string` | `undefined` | Controls the transform property (all valid CSS values) |
| `align-self` | `string` | `undefined` | Controls the align-self property (all valid CSS values) |
| `justify-self` | `string` | `undefined` | Controls the justify-self property (all valid CSS values) |
| `place-self` | `string` | `undefined` | Controls the place-self property (all valid CSS values) |
| `align-items` | `string` | `undefined` | Controls the align-items property (all valid CSS values) |
| `align-content` | `string` | `undefined` | Controls the align-content property (all valid CSS values) |
| `justify-content` | `string` | `undefined` | Controls the justify-content property (all valid CSS values) |
| `justify-items` | `string` | `undefined` | Controls the justify-items property (all valid CSS values) |
| `place-items` | `string` | `undefined` | Controls the place-items property (all valid CSS values) |
| `place-content` | `string` | `undefined` | Controls the place-content property (all valid CSS values) |

### Grid Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `grid-column` | `string` | `undefined` | Controls the grid-column property ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)) |
| `grid-row` | `string` | `undefined` | Controls the grid-row property (all valid CSS values) |
| `grid-area` | `string` | `undefined` | Controls the grid-area property (all valid CSS values) |

### Flexbox Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `flex` | `string` | `undefined` | Controls the flex property (all valid CSS values) |
| `flex-direction` | `string` | `undefined` | Controls the flex-direction property (all valid CSS values) |
| `flex-wrap` | `string` | `undefined` | Controls the flex-wrap property (all valid CSS values) |
| `order` | `string` | `undefined` | Controls the order property (all valid CSS values) |

### Visual Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `color` | `string` | `undefined` | Controls the color property (color tokens with optional transparency: `tokenName/transparency`) |
| `background` | `string` | `undefined` | Controls the background property (color tokens with optional transparency: `tokenName/transparency`) |
| `border` | `string` | `undefined` | Controls the border property (format: `width style color`, e.g., `4xs solid subtle-01/0.2`) |
| `border-color` | `string` | `undefined` | Controls the border-color property (color tokens with optional transparency) |
| `border-width` | `string` | `undefined` | Controls the border-width property (only accepts space tokens) |
| `border-style` | `string` | `undefined` | Controls the border-style property (all valid CSS values) |
| `border-radius` | `string` | `undefined` | Controls the border-radius property (only accepts space tokens) |
| `box-shadow` | `string` | `undefined` | Controls the box-shadow property (shadow tokens: `xs`, `s`, `m`, `l`, `xl`) |
| `opacity` | `string` | `undefined` | Controls the opacity property (all valid CSS values) |
| `overflow` | `string` | `undefined` | Controls the overflow property (all valid CSS values) |
| `box-sizing` | `string` | `undefined` | Controls the box-sizing property (all valid CSS values) |
| `z-index` | `string` | `undefined` | Controls the z-index property (all valid CSS values) |

### Interaction Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cursor` | `string` | `undefined` | Controls the cursor property (all valid CSS values) |
| `pointer-events` | `string` | `undefined` | Controls the pointer-events property (all valid CSS values) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM |

## Examples

### 1. Basic Date Display

```tsx
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" />
```

### 2. Hidden Date (Blurred)

```tsx
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z" 
  hide 
/>
```

**Note:** The `hide` property applies a blur effect to protect sensitive date information from shoulder surfing or screen sharing.

### 3. Date with Locale

```tsx
{/* Swedish locale */}
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  locale="sv-SE"
/>

{/* US locale */}
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  locale="en-US"
/>

{/* UK locale */}
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  locale="en-GB"
/>
```

### 4. Date Visibility Toggle

```tsx
import { useState } from 'react'
import { IconEye, IconEyeSlash } from '@sebgroup/green-core/react'

function DateWithToggle() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveDate 
        value="2025-02-25T13:17:30.000Z"
        hide={isHidden}
        locale="sv-SE"
      />
      <GdsButton 
        variant="tertiary"
        size="small"
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden ? <IconEye /> : <IconEyeSlash />}
        {isHidden ? 'Show' : 'Hide'}
      </GdsButton>
    </GdsFlex>
  )
}
```

### 5. Different HTML Tags

```tsx
{/* As heading */}
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  tag="h3"
/>

{/* As paragraph */}
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  tag="p"
/>

{/* As span (default) */}
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  tag="span"
/>
```

### 6. Custom Typography Styling

```tsx
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  font="heading-m"
  font-weight="bold"
  color="primary"
  locale="sv-SE"
/>
```

### 7. Transaction with Sensitive Date

```tsx
import { useState } from 'react'
import { IconEye, IconEyeSlash } from '@sebgroup/green-core/react'

function Transaction() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="detail-regular-s" color="secondary">
            Transaction Date
          </GdsText>
          <GdsButton 
            variant="tertiary"
            size="small"
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          >
            {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>
        
        <GdsSensitiveDate 
          value="2025-02-25T13:17:30.000Z"
          hide={isPrivacyMode}
          font="body-m"
          locale="sv-SE"
        />
        
        <GdsDivider opacity="0.2" />
        
        <GdsFlex justify-content="space-between">
          <GdsText font="detail-regular-s" color="secondary">Amount</GdsText>
          <GdsText font="body-m">1,234.50 SEK</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 8. Transaction History List

```tsx
import { useState } from 'react'

function TransactionHistory() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const transactions = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', description: 'Payment', amount: '-150.00' },
    { id: '2', date: '2025-02-20T10:30:00.000Z', description: 'Deposit', amount: '+500.00' },
    { id: '3', date: '2025-02-15T14:45:00.000Z', description: 'Transfer', amount: '-75.00' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Recent Transactions</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          {isPrivacyMode ? 'Show Dates' : 'Hide Dates'}
        </GdsButton>
      </GdsFlex>

      {transactions.map(tx => (
        <GdsCard key={tx.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{tx.description}</GdsText>
              <GdsSensitiveDate 
                value={tx.date}
                hide={isPrivacyMode}
                font="detail-regular-s"
                color="secondary"
                locale="sv-SE"
              />
            </GdsFlex>
            <GdsText font="body-m">{tx.amount} SEK</GdsText>
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 9. Date Object Input

```tsx
function DateDisplay() {
  const currentDate = new Date()
  const pastDate = new Date('2025-01-15')

  return (
    <GdsFlex flex-direction="column" gap="s">
      {/* Using Date object */}
      <GdsSensitiveDate value={currentDate} locale="en-US" />
      
      {/* Using ISO string */}
      <GdsSensitiveDate value="2025-02-25T13:17:30.000Z" locale="en-US" />
      
      {/* Using Date object from variable */}
      <GdsSensitiveDate value={pastDate} locale="en-US" />
    </GdsFlex>
  )
}
```

### 10. Global Privacy Mode for Dates

```tsx
import { useState, createContext, useContext } from 'react'

const PrivacyContext = createContext<{
  isPrivacyMode: boolean
  togglePrivacyMode: () => void
}>({
  isPrivacyMode: false,
  togglePrivacyMode: () => {},
})

function PrivacyProvider({ children }: { children: React.ReactNode }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  return (
    <PrivacyContext.Provider 
      value={{ 
        isPrivacyMode, 
        togglePrivacyMode: () => setIsPrivacyMode(!isPrivacyMode) 
      }}
    >
      {children}
    </PrivacyContext.Provider>
  )
}

function PrivacyToggle() {
  const { isPrivacyMode, togglePrivacyMode } = useContext(PrivacyContext)

  return (
    <GdsButton 
      variant="secondary"
      onClick={togglePrivacyMode}
    >
      {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
      {isPrivacyMode ? 'Show All Dates' : 'Hide All Dates'}
    </GdsButton>
  )
}

function DateDisplay({ date }: { date: string | Date }) {
  const { isPrivacyMode } = useContext(PrivacyContext)

  return (
    <GdsSensitiveDate 
      value={date}
      hide={isPrivacyMode}
      locale="sv-SE"
    />
  )
}

function App() {
  return (
    <PrivacyProvider>
      <GdsFlex flex-direction="column" gap="m">
        <PrivacyToggle />
        <DateDisplay date="2025-02-25T13:17:30.000Z" />
        <DateDisplay date="2025-01-15T10:30:00.000Z" />
      </GdsFlex>
    </PrivacyProvider>
  )
}
```

### 11. Responsive Date Display

```tsx
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  font="body-s; m{ body-m }; l{ body-l }"
  locale="sv-SE"
  hide={false}
/>
```

**Note:** Uses responsive style expressions to adjust font size based on viewport.

### 12. Medical Records with Privacy

```tsx
function MedicalRecord() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-s">Appointment History</GdsText>
          <GdsButton 
            variant="tertiary"
            onClick={() => setIsHidden(!isHidden)}
          >
            {isHidden ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">
              Last Visit
            </GdsText>
            <GdsSensitiveDate 
              value="2025-02-25T13:17:30.000Z"
              hide={isHidden}
              locale="en-US"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">
              Next Appointment
            </GdsText>
            <GdsSensitiveDate 
              value="2025-03-15T09:00:00.000Z"
              hide={isHidden}
              locale="en-US"
            />
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 13. Different Date Formats

```tsx
<GdsFlex flex-direction="column" gap="s">
  {/* Date only with numbers (default) */}
  <GdsSensitiveDate 
    value="2025-02-25T13:17:30.000Z"
    format="dateOnlyNumbers"
    locale="sv-SE"
  />
  
  {/* Custom format if supported */}
  <GdsSensitiveDate 
    value="2025-02-25T13:17:30.000Z"
    locale="en-US"
  />
</GdsFlex>
```

### 14. Timeline with Privacy Control

```tsx
function Timeline() {
  const [hideOldDates, setHideOldDates] = useState(false)
  const cutoffDate = new Date('2025-02-01')

  const events = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', title: 'Recent Event' },
    { id: '2', date: '2025-01-15T10:30:00.000Z', title: 'Old Event' },
    { id: '3', date: '2024-12-20T14:45:00.000Z', title: 'Older Event' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Timeline</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setHideOldDates(!hideOldDates)}
        >
          {hideOldDates ? 'Show' : 'Hide'} Old Dates
        </GdsButton>
      </GdsFlex>

      {events.map(event => {
        const eventDate = new Date(event.date)
        const shouldHide = hideOldDates && eventDate < cutoffDate

        return (
          <GdsCard key={event.id} padding="m">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{event.title}</GdsText>
              <GdsSensitiveDate 
                value={event.date}
                hide={shouldHide}
                font="detail-regular-s"
                color="secondary"
                locale="sv-SE"
              />
            </GdsFlex>
          </GdsCard>
        )
      })}
    </GdsFlex>
  )
}
```

## TypeScript

```tsx
import { GdsSensitiveDate } from '@sebgroup/green-core/react'

interface GdsSensitiveDateProps {
  // Core Attributes
  hide?: boolean
  locale?: string
  format?: 'dateOnlyNumbers'
  tag?: string
  level?: '1' | '2' | '3' | '4'
  'gds-element'?: string
  
  // Core Properties
  value?: Date | string
  
  // Typography Style Properties
  font?: string
  'font-weight'?: string
  'text-transform'?: string
  'text-decoration'?: string
  'text-align'?: string
  'text-wrap'?: string
  'white-space'?: string
  'overflow-wrap'?: string
  lines?: number
  
  // Size & Dimension Properties
  width?: string
  'min-width'?: string
  'max-width'?: string
  'inline-size'?: string
  'min-inline-size'?: string
  'max-inline-size'?: string
  height?: string
  'min-height'?: string
  'max-height'?: string
  'block-size'?: string
  'min-block-size'?: string
  'max-block-size'?: string
  'aspect-ratio'?: string
  
  // Spacing Properties
  margin?: string
  'margin-inline'?: string
  'margin-block'?: string
  padding?: string
  'padding-inline'?: string
  'padding-block'?: string
  gap?: string
  
  // Layout Properties
  display?: string
  position?: string
  inset?: string
  transform?: string
  'align-self'?: string
  'justify-self'?: string
  'place-self'?: string
  'align-items'?: string
  'align-content'?: string
  'justify-content'?: string
  'justify-items'?: string
  'place-items'?: string
  'place-content'?: string
  
  // Grid Properties
  'grid-column'?: string
  'grid-row'?: string
  'grid-area'?: string
  
  // Flexbox Properties
  flex?: string
  'flex-direction'?: string
  'flex-wrap'?: string
  order?: string
  
  // Visual Properties
  color?: string
  background?: string
  border?: string
  'border-color'?: string
  'border-width'?: string
  'border-style'?: string
  'border-radius'?: string
  'box-shadow'?: string
  opacity?: string
  overflow?: string
  'box-sizing'?: string
  'z-index'?: string
  
  // Interaction Properties
  cursor?: string
  'pointer-events'?: string
  
  // Events
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  // Standard
  children?: React.ReactNode
}

// Usage example
const SensitiveDateDisplay: React.FC = () => {
  const [isHidden, setIsHidden] = useState(true)
  const transactionDate = new Date('2025-02-25T13:17:30.000Z')

  const handleDisconnected = (e: CustomEvent) => {
    console.log('Component disconnected', e)
  }

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveDate
        value={transactionDate}
        hide={isHidden}
        locale="sv-SE"
        font="body-m"
        level="2"
        onGdsElementDisconnected={handleDisconnected}
      />
      <GdsButton 
        variant="tertiary"
        onClick={() => setIsHidden(!isHidden)}
      >
        {isHidden ? <IconEye /> : <IconEyeSlash />}
      </GdsButton>
    </GdsFlex>
  )
}
```

## Best Practices

### ✅ Good Practices

**1. Default to Hidden for Sensitive Dates**
```tsx
// ✅ Good - starts hidden for privacy
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" hide />

// ❌ Bad - exposed by default in sensitive context
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" />
```

**2. Provide Clear Toggle Controls**
```tsx
// ✅ Good - clear visibility control with icon
<GdsFlex gap="s" align-items="center">
  <GdsSensitiveDate value={date} hide={isHidden} locale="sv-SE" />
  <GdsButton onClick={toggleVisibility}>
    {isHidden ? <IconEye /> : <IconEyeSlash />}
    {isHidden ? 'Show' : 'Hide'}
  </GdsButton>
</GdsFlex>

// ❌ Bad - no way to toggle visibility
<GdsSensitiveDate value={date} hide />
```

**3. Always Specify Locale**
```tsx
// ✅ Good - explicit locale for consistent formatting
<GdsSensitiveDate 
  value="2025-02-25T13:17:30.000Z"
  locale="sv-SE"
/>

// ❌ Bad - relies on browser default (inconsistent)
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" />
```

**4. Provide Context Labels**
```tsx
// ✅ Good - clear labeling
<GdsFlex flex-direction="column" gap="2xs">
  <GdsText font="detail-regular-s" color="secondary">
    Transaction Date
  </GdsText>
  <GdsSensitiveDate value={date} hide locale="sv-SE" />
</GdsFlex>

// ❌ Bad - date without context
<GdsSensitiveDate value={date} />
```

**5. Use Proper Date Values**
```tsx
// ✅ Good - ISO string or Date object
<GdsSensitiveDate value="2025-02-25T13:17:30.000Z" locale="sv-SE" />
<GdsSensitiveDate value={new Date()} locale="sv-SE" />

// ❌ Bad - invalid date format
<GdsSensitiveDate value="25/02/2025" locale="sv-SE" />
```

## Common Use Cases

### 1. Banking Transaction List

```tsx
function TransactionList() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const transactions = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', description: 'Payment', amount: '-150.00' },
    { id: '2', date: '2025-02-20T10:30:00.000Z', description: 'Deposit', amount: '+500.00' },
    { id: '3', date: '2025-02-15T14:45:00.000Z', description: 'Transfer', amount: '-75.00' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Transactions</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          Privacy Mode
        </GdsButton>
      </GdsFlex>

      {transactions.map(tx => (
        <GdsCard key={tx.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{tx.description}</GdsText>
              <GdsSensitiveDate 
                value={tx.date}
                hide={isPrivacyMode}
                font="detail-regular-s"
                color="secondary"
                locale="sv-SE"
              />
            </GdsFlex>
            <GdsText font="body-m">{tx.amount} SEK</GdsText>
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 2. Medical Appointment History

```tsx
function AppointmentHistory() {
  const [showDates, setShowDates] = useState(false)

  const appointments = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', doctor: 'Dr. Smith', type: 'Checkup' },
    { id: '2', date: '2025-01-15T10:30:00.000Z', doctor: 'Dr. Johnson', type: 'Follow-up' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Appointment History</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setShowDates(!showDates)}
        >
          {showDates ? <IconEyeSlash /> : <IconEye />}
          {showDates ? 'Hide' : 'Show'} Dates
        </GdsButton>
      </GdsFlex>

      {appointments.map(apt => (
        <GdsCard key={apt.id} padding="m">
          <GdsFlex flex-direction="column" gap="s">
            <GdsFlex justify-content="space-between">
              <GdsText font="body-m">{apt.type}</GdsText>
              <GdsSensitiveDate 
                value={apt.date}
                hide={!showDates}
                locale="en-US"
              />
            </GdsFlex>
            <GdsText font="detail-regular-s" color="secondary">
              {apt.doctor}
            </GdsText>
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 3. Event Timeline

```tsx
function EventTimeline() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  const events = [
    { id: '1', date: '2025-02-25T13:17:30.000Z', title: 'Meeting with Client', status: 'completed' },
    { id: '2', date: '2025-03-01T09:00:00.000Z', title: 'Project Deadline', status: 'upcoming' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">Timeline</GdsText>
        <GdsButton 
          variant="tertiary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
        </GdsButton>
      </GdsFlex>

      {events.map(event => (
        <GdsFlex key={event.id} gap="m" align-items="center">
          <GdsBadge variant={event.status === 'completed' ? 'positive' : 'notice'}>
            {event.status}
          </GdsBadge>
          <GdsFlex flex-direction="column" gap="2xs">
            <GdsText font="body-m">{event.title}</GdsText>
            <GdsSensitiveDate 
              value={event.date}
              hide={isPrivacyMode}
              font="detail-regular-s"
              color="secondary"
              locale="sv-SE"
            />
          </GdsFlex>
        </GdsFlex>
      ))}
    </GdsFlex>
  )
}
```

### 4. Screen Share Protection

```tsx
function ScreenShareProtectedDates() {
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // Detect screen sharing (simplified example)
  useEffect(() => {
    const detectScreenShare = () => {
      // Implementation would detect actual screen sharing
      setIsScreenSharing(document.hidden)
    }

    document.addEventListener('visibilitychange', detectScreenShare)
    return () => document.removeEventListener('visibilitychange', detectScreenShare)
  }, [])

  return (
    <GdsFlex flex-direction="column" gap="m">
      {isScreenSharing && (
        <GdsAlert variant="notice">
          <GdsText>Privacy mode enabled during screen sharing</GdsText>
        </GdsAlert>
      )}

      <GdsSensitiveDate 
        value="2025-02-25T13:17:30.000Z"
        hide={isScreenSharing}
        locale="sv-SE"
      />
    </GdsFlex>
  )
}
```

### 5. Document Metadata with Privacy

```tsx
function DocumentMetadata() {
  const [hideMetadata, setHideMetadata] = useState(true)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-s">Document Information</GdsText>
          <GdsButton 
            variant="tertiary"
            onClick={() => setHideMetadata(!hideMetadata)}
          >
            {hideMetadata ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Created</GdsText>
            <GdsSensitiveDate 
              value="2025-01-15T10:30:00.000Z"
              hide={hideMetadata}
              locale="en-US"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Modified</GdsText>
            <GdsSensitiveDate 
              value="2025-02-25T13:17:30.000Z"
              hide={hideMetadata}
              locale="en-US"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Accessed</GdsText>
            <GdsSensitiveDate 
              value={new Date()}
              hide={hideMetadata}
              locale="en-US"
            />
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

## Related Components

- [GdsFormattedDate](./GdsFormattedDate.md) — Formatted date display without blur protection (beta)
- [GdsSensitiveAccount](./GdsSensitiveAccount.md) — Sensitive account display with blur protection (beta)
- [GdsSensitiveNumber](./GdsSensitiveNumber.md) — Sensitive number display with blur protection (beta)
- [GdsBlur](./GdsBlur.md) — General blur effect for sensitive content
- [GdsText](./GdsText.md) — Typography component (GdsSensitiveDate extends this)
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling color schemes
- [GdsCard](./GdsCard.md) — Container for date information
- [GdsButton](./GdsButton.md) — Buttons for visibility toggle
- [Icons](./Icons.md) — Icons for visibility controls (IconEye, IconEyeSlash)
- [GdsFlex](./GdsFlex.md) — Layout for date displays

## Accessibility

- **Semantic HTML**: Uses appropriate HTML tag via `tag` attribute (default: `span`)
- **Screen Readers**: Dates are announced regardless of blur state
- **Blur Effect**: Visual-only protection, doesn't hide from screen readers
- **Keyboard Navigation**: Toggle buttons are keyboard accessible
- **Focus Indicators**: Clear focus indicators on interactive controls
- **ARIA Support**: Proper ARIA attributes for sensitive content state
- **Color Independence**: Blur effect doesn't rely on color perception
- **Locale Support**: Respects user's locale for date formatting

## Notes

- **Beta Status**: Component API may change in future releases
- **Date Formats**: Currently supports `'dateOnlyNumbers'` format (default)
- **Locale Formatting**: Uses browser's `Intl.DateTimeFormat` for locale-specific formatting
- **Blur Effect**: Applied via CSS, provides visual privacy but doesn't encrypt or mask underlying value
- **Formatted Value**: Access formatted output via `formattedValue` property (read-only)
- **Color Levels**: Use `level` property to ensure proper color token resolution in nested contexts
- **Style Expressions**: Full support for declarative layout and styling via style expression properties
- **Responsive**: Supports responsive style expressions for adaptive typography and layout
- **Privacy vs Security**: Blur is for visual privacy (shoulder surfing), not data security
- **Screen Sharing**: Consider auto-hiding during screen share or presentation mode
- **Date Input Types**: Accepts both `Date` objects and ISO 8601 strings
- **Performance**: Lightweight blur effect with minimal performance impact
- **HTML Tag**: Choose appropriate semantic tag (`h1-h6`, `p`, `span`) based on content hierarchy
- **Read-only Properties**: Properties like `isDefined`, `styleExpressionBaseSelector`, `semanticVersion` are read-only
- **Event Handling**: Listen to `gds-element-disconnected` for lifecycle management
- **Typography Tokens**: Use design system font tokens for consistent typography
- **Extends GdsText**: Inherits all typography and styling capabilities from GdsText component
- **Locale Default**: If no locale specified, uses browser's default locale
- **ISO Format**: For string values, use ISO 8601 format (`YYYY-MM-DDTHH:mm:ss.sssZ`)
- **Timezone**: Dates are displayed in the user's local timezone
