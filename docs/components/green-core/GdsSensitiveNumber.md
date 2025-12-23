# GdsSensitiveNumber

A specialized component that displays a formatted number with optional blur effect for sensitive information protection. When the `hide` property is set to `true`, the number is hidden using a blur effect.

**Status:** Beta

## Import

```tsx
import { GdsSensitiveNumber } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsSensitiveNumber value={1234.5} />
```

## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `locale` | `string` | `undefined` | The locale used for number formatting (e.g., `'sv-SE'`, `'en-US'`) |
| `hide` | `boolean` | `false` | When `true`, hides the sensitive number with blur effect |
| `currency` | `string` | `undefined` | The currency used when formatting numbers (e.g., `'SEK'`, `'USD'`, `'EUR'`) |
| `tag` | `string` | `'span'` | Controls the HTML tag. Supports all valid HTML tags like `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`, etc. |
| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens from the corresponding level (see Color System documentation) |
| `format` | `NumberFormats` | `'decimalsAndThousands'` | Specifies the number format |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only, set automatically) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | `number \| string` | `undefined` | The numerical value to display |
| `formattedValue` | `string` | - | The formatted number value (read-only) |
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

### 1. Basic Number Display

```tsx
<GdsSensitiveNumber value={1234.5} />
```

### 2. Hidden Number (Blurred)

```tsx
<GdsSensitiveNumber 
  value={1234.5} 
  hide 
/>
```

**Note:** The `hide` property applies a blur effect to protect sensitive number information from shoulder surfing or screen sharing.

### 3. Number with Currency

```tsx
{/* Swedish currency */}
<GdsSensitiveNumber 
  value={1234.5}
  currency="SEK"
  locale="sv-SE"
/>

{/* US currency */}
<GdsSensitiveNumber 
  value={1234.5}
  currency="USD"
  locale="en-US"
/>

{/* Euro currency */}
<GdsSensitiveNumber 
  value={1234.5}
  currency="EUR"
  locale="de-DE"
/>
```

### 4. Number Visibility Toggle

```tsx
import { useState } from 'react'
import { IconEye, IconEyeSlash } from '@sebgroup/green-core/react'

function NumberWithToggle() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveNumber 
        value={45678.90}
        hide={isHidden}
        currency="SEK"
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

### 5. Account Balance with Privacy

```tsx
import { useState } from 'react'
import { IconEye, IconEyeSlash } from '@sebgroup/green-core/react'

function AccountBalance() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="s">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="detail-regular-s" color="secondary">
            Available Balance
          </GdsText>
          <GdsButton 
            variant="tertiary"
            size="small"
            onClick={() => setIsPrivacyMode(!isPrivacyMode)}
          >
            {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>
        
        <GdsSensitiveNumber 
          value={45678.90}
          hide={isPrivacyMode}
          currency="SEK"
          locale="sv-SE"
          font="heading-l"
        />
        
        <GdsDivider opacity="0.2" />
        
        <GdsFlex justify-content="space-between">
          <GdsText font="detail-regular-s" color="secondary">Total Assets</GdsText>
          <GdsSensitiveNumber 
            value={125000.00}
            hide={isPrivacyMode}
            currency="SEK"
            locale="sv-SE"
            font="body-m"
          />
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 6. Transaction List with Amounts

```tsx
import { useState } from 'react'

function TransactionList() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const transactions = [
    { id: '1', date: '2025-02-25', description: 'Salary', amount: 35000.00, type: 'credit' },
    { id: '2', date: '2025-02-20', description: 'Rent Payment', amount: -12000.00, type: 'debit' },
    { id: '3', date: '2025-02-15', description: 'Grocery Shopping', amount: -850.50, type: 'debit' },
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
          {isPrivacyMode ? 'Show Amounts' : 'Hide Amounts'}
        </GdsButton>
      </GdsFlex>

      {transactions.map(tx => (
        <GdsCard key={tx.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{tx.description}</GdsText>
              <GdsText font="detail-regular-s" color="secondary">{tx.date}</GdsText>
            </GdsFlex>
            <GdsSensitiveNumber 
              value={tx.amount}
              hide={isPrivacyMode}
              currency="SEK"
              locale="sv-SE"
              font="body-m"
              color={tx.type === 'credit' ? 'positive' : 'secondary'}
            />
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 7. Different Number Formats

```tsx
<GdsFlex flex-direction="column" gap="s">
  {/* Decimals and thousands (default) */}
  <GdsSensitiveNumber 
    value={1234567.89}
    format="decimalsAndThousands"
    locale="sv-SE"
  />
  
  {/* With currency */}
  <GdsSensitiveNumber 
    value={1234567.89}
    currency="SEK"
    locale="sv-SE"
  />
  
  {/* Different locales */}
  <GdsSensitiveNumber 
    value={1234567.89}
    currency="USD"
    locale="en-US"
  />
</GdsFlex>
```

### 8. Investment Portfolio

```tsx
function InvestmentPortfolio() {
  const [isHidden, setIsHidden] = useState(true)

  const portfolio = [
    { name: 'Tech Stocks', value: 125000.00, change: 5.2 },
    { name: 'Bonds', value: 75000.00, change: 1.8 },
    { name: 'Real Estate', value: 250000.00, change: 3.5 },
  ]

  const totalValue = portfolio.reduce((sum, item) => sum + item.value, 0)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-m">Investment Portfolio</GdsText>
          <GdsButton 
            variant="tertiary"
            onClick={() => setIsHidden(!isHidden)}
          >
            {isHidden ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          {portfolio.map((item, index) => (
            <GdsFlex key={index} justify-content="space-between" align-items="center">
              <GdsFlex flex-direction="column" gap="2xs">
                <GdsText font="body-m">{item.name}</GdsText>
                <GdsText font="detail-regular-s" color={item.change > 0 ? 'positive' : 'negative'}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                </GdsText>
              </GdsFlex>
              <GdsSensitiveNumber 
                value={item.value}
                hide={isHidden}
                currency="SEK"
                locale="sv-SE"
              />
            </GdsFlex>
          ))}
        </GdsFlex>

        <GdsDivider />

        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-s">Total Value</GdsText>
          <GdsSensitiveNumber 
            value={totalValue}
            hide={isHidden}
            currency="SEK"
            locale="sv-SE"
            font="heading-m"
          />
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 9. Salary Information

```tsx
function SalaryCard() {
  const [showSalary, setShowSalary] = useState(false)

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-s">Monthly Compensation</GdsText>
          <GdsButton 
            variant="tertiary"
            onClick={() => setShowSalary(!showSalary)}
          >
            {showSalary ? <IconEyeSlash /> : <IconEye />}
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Base Salary</GdsText>
            <GdsSensitiveNumber 
              value={45000}
              hide={!showSalary}
              currency="SEK"
              locale="sv-SE"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Bonus</GdsText>
            <GdsSensitiveNumber 
              value={5000}
              hide={!showSalary}
              currency="SEK"
              locale="sv-SE"
            />
          </GdsFlex>

          <GdsDivider />

          <GdsFlex justify-content="space-between">
            <GdsText font="body-m">Total</GdsText>
            <GdsSensitiveNumber 
              value={50000}
              hide={!showSalary}
              currency="SEK"
              locale="sv-SE"
              font="body-m"
            />
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 10. Global Privacy Mode for Numbers

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
      {isPrivacyMode ? 'Show All Amounts' : 'Hide All Amounts'}
    </GdsButton>
  )
}

function AmountDisplay({ value, currency }: { value: number; currency?: string }) {
  const { isPrivacyMode } = useContext(PrivacyContext)

  return (
    <GdsSensitiveNumber 
      value={value}
      hide={isPrivacyMode}
      currency={currency}
      locale="sv-SE"
    />
  )
}

function App() {
  return (
    <PrivacyProvider>
      <GdsFlex flex-direction="column" gap="m">
        <PrivacyToggle />
        <AmountDisplay value={1234.56} currency="SEK" />
        <AmountDisplay value={9876.54} currency="SEK" />
      </GdsFlex>
    </PrivacyProvider>
  )
}
```

### 11. Different HTML Tags

```tsx
{/* As heading */}
<GdsSensitiveNumber 
  value={1234.5}
  currency="SEK"
  tag="h3"
  locale="sv-SE"
/>

{/* As paragraph */}
<GdsSensitiveNumber 
  value={1234.5}
  currency="SEK"
  tag="p"
  locale="sv-SE"
/>

{/* As span (default) */}
<GdsSensitiveNumber 
  value={1234.5}
  currency="SEK"
  tag="span"
  locale="sv-SE"
/>
```

### 12. Custom Typography Styling

```tsx
<GdsSensitiveNumber 
  value={1234567.89}
  currency="SEK"
  locale="sv-SE"
  font="heading-l"
  font-weight="bold"
  color="primary"
/>
```

### 13. Responsive Number Display

```tsx
<GdsSensitiveNumber 
  value={1234567.89}
  currency="SEK"
  locale="sv-SE"
  font="body-s; m{ body-m }; l{ body-l }"
  hide={false}
/>
```

**Note:** Uses responsive style expressions to adjust font size based on viewport.

### 14. Credit Card Balance

```tsx
function CreditCardBalance() {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <GdsCard padding="m" background="primary/0.1">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="detail-regular-s" color="secondary" text-transform="uppercase">
            Current Balance
          </GdsText>
          <GdsButton 
            variant="tertiary"
            size="small"
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <IconEyeSlash /> : <IconEye />}
          </GdsButton>
        </GdsFlex>

        <GdsSensitiveNumber 
          value={15678.45}
          hide={!isVisible}
          currency="SEK"
          locale="sv-SE"
          font="heading-xl"
        />

        <GdsFlex justify-content="space-between">
          <GdsText font="detail-regular-s" color="secondary">Available Credit</GdsText>
          <GdsSensitiveNumber 
            value={34321.55}
            hide={!isVisible}
            currency="SEK"
            locale="sv-SE"
            font="body-s"
          />
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

## TypeScript

```tsx
import { GdsSensitiveNumber } from '@sebgroup/green-core/react'

interface GdsSensitiveNumberProps {
  // Core Attributes
  locale?: string
  hide?: boolean
  currency?: string
  tag?: string
  level?: '1' | '2' | '3' | '4'
  format?: 'decimalsAndThousands'
  'gds-element'?: string
  
  // Core Properties
  value?: number | string
  
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
const SensitiveNumberDisplay: React.FC = () => {
  const [isHidden, setIsHidden] = useState(true)
  const accountBalance = 45678.90

  const handleDisconnected = (e: CustomEvent) => {
    console.log('Component disconnected', e)
  }

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveNumber
        value={accountBalance}
        hide={isHidden}
        currency="SEK"
        locale="sv-SE"
        font="heading-m"
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

**1. Default to Hidden for Sensitive Amounts**
```tsx
// ✅ Good - starts hidden for privacy
<GdsSensitiveNumber value={45678.90} currency="SEK" hide />

// ❌ Bad - exposed by default in sensitive context
<GdsSensitiveNumber value={45678.90} currency="SEK" />
```

**2. Provide Clear Toggle Controls**
```tsx
// ✅ Good - clear visibility control with icon
<GdsFlex gap="s" align-items="center">
  <GdsSensitiveNumber value={amount} hide={isHidden} currency="SEK" locale="sv-SE" />
  <GdsButton onClick={toggleVisibility}>
    {isHidden ? <IconEye /> : <IconEyeSlash />}
    {isHidden ? 'Show' : 'Hide'}
  </GdsButton>
</GdsFlex>

// ❌ Bad - no way to toggle visibility
<GdsSensitiveNumber value={amount} hide currency="SEK" />
```

**3. Always Specify Locale and Currency**
```tsx
// ✅ Good - explicit locale and currency
<GdsSensitiveNumber 
  value={1234.5}
  currency="SEK"
  locale="sv-SE"
/>

// ❌ Bad - relies on browser default (inconsistent)
<GdsSensitiveNumber value={1234.5} />
```

**4. Provide Context Labels**
```tsx
// ✅ Good - clear labeling
<GdsFlex flex-direction="column" gap="2xs">
  <GdsText font="detail-regular-s" color="secondary">
    Account Balance
  </GdsText>
  <GdsSensitiveNumber value={amount} hide currency="SEK" locale="sv-SE" />
</GdsFlex>

// ❌ Bad - number without context
<GdsSensitiveNumber value={amount} currency="SEK" />
```

**5. Use Proper Number Values**
```tsx
// ✅ Good - numeric value or string representation
<GdsSensitiveNumber value={1234.5} currency="SEK" locale="sv-SE" />
<GdsSensitiveNumber value="1234.5" currency="SEK" locale="sv-SE" />

// ❌ Bad - invalid number format
<GdsSensitiveNumber value="$1,234.50" currency="SEK" locale="sv-SE" />
```

## Common Use Cases

### 1. Banking Dashboard

```tsx
function BankingDashboard() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const accounts = [
    { name: 'Checking Account', balance: 45678.90, type: 'checking' },
    { name: 'Savings Account', balance: 125000.00, type: 'savings' },
    { name: 'Investment Account', balance: 250000.00, type: 'investment' },
  ]

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)

  return (
    <GdsFlex flex-direction="column" gap="m">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-l">My Accounts</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          Privacy Mode
        </GdsButton>
      </GdsFlex>

      {accounts.map((account, index) => (
        <GdsCard key={index} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="body-m">{account.name}</GdsText>
              <GdsText font="detail-regular-s" color="secondary">
                {account.type}
              </GdsText>
            </GdsFlex>
            <GdsSensitiveNumber 
              value={account.balance}
              hide={isPrivacyMode}
              currency="SEK"
              locale="sv-SE"
              font="heading-s"
            />
          </GdsFlex>
        </GdsCard>
      ))}

      <GdsCard padding="m" background="primary/0.1">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-m">Total Balance</GdsText>
          <GdsSensitiveNumber 
            value={totalBalance}
            hide={isPrivacyMode}
            currency="SEK"
            locale="sv-SE"
            font="heading-l"
          />
        </GdsFlex>
      </GdsCard>
    </GdsFlex>
  )
}
```

### 2. Payroll Information

```tsx
function PayrollDetails() {
  const [showAmounts, setShowAmounts] = useState(false)

  const payrollItems = [
    { label: 'Gross Salary', amount: 50000 },
    { label: 'Tax Deduction', amount: -12500 },
    { label: 'Insurance', amount: -2500 },
    { label: 'Pension', amount: -3500 },
    { label: 'Net Salary', amount: 31500, highlight: true },
  ]

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-m">Payroll Details</GdsText>
          <GdsButton 
            variant="secondary"
            onClick={() => setShowAmounts(!showAmounts)}
          >
            {showAmounts ? <IconEyeSlash /> : <IconEye />}
            {showAmounts ? 'Hide' : 'Show'} Amounts
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          {payrollItems.map((item, index) => (
            <div key={index}>
              <GdsFlex justify-content="space-between" align-items="center">
                <GdsText 
                  font={item.highlight ? 'body-m' : 'detail-regular-s'}
                  color={item.highlight ? 'primary' : 'secondary'}
                >
                  {item.label}
                </GdsText>
                <GdsSensitiveNumber 
                  value={item.amount}
                  hide={!showAmounts}
                  currency="SEK"
                  locale="sv-SE"
                  font={item.highlight ? 'heading-s' : 'body-m'}
                />
              </GdsFlex>
              {index < payrollItems.length - 1 && !item.highlight && <GdsDivider />}
              {item.highlight && index < payrollItems.length - 1 && <GdsDivider />}
            </div>
          ))}
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 3. E-commerce Order Summary

```tsx
function OrderSummary() {
  const [hidePayment, setHidePayment] = useState(false)

  const orderItems = [
    { name: 'Product A', price: 299.00, quantity: 2 },
    { name: 'Product B', price: 499.00, quantity: 1 },
    { name: 'Product C', price: 149.00, quantity: 3 },
  ]

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = 49.00
  const tax = subtotal * 0.25
  const total = subtotal + shipping + tax

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-m">Order Summary</GdsText>
          <GdsButton 
            variant="tertiary"
            onClick={() => setHidePayment(!hidePayment)}
          >
            {hidePayment ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          {orderItems.map((item, index) => (
            <GdsFlex key={index} justify-content="space-between">
              <GdsText font="detail-regular-s">
                {item.name} × {item.quantity}
              </GdsText>
              <GdsSensitiveNumber 
                value={item.price * item.quantity}
                hide={hidePayment}
                currency="SEK"
                locale="sv-SE"
              />
            </GdsFlex>
          ))}

          <GdsDivider />

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Subtotal</GdsText>
            <GdsSensitiveNumber 
              value={subtotal}
              hide={hidePayment}
              currency="SEK"
              locale="sv-SE"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Shipping</GdsText>
            <GdsSensitiveNumber 
              value={shipping}
              hide={hidePayment}
              currency="SEK"
              locale="sv-SE"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Tax (25%)</GdsText>
            <GdsSensitiveNumber 
              value={tax}
              hide={hidePayment}
              currency="SEK"
              locale="sv-SE"
            />
          </GdsFlex>

          <GdsDivider />

          <GdsFlex justify-content="space-between">
            <GdsText font="heading-s">Total</GdsText>
            <GdsSensitiveNumber 
              value={total}
              hide={hidePayment}
              currency="SEK"
              locale="sv-SE"
              font="heading-m"
            />
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 4. Screen Share Protection

```tsx
function ScreenShareProtectedAmounts() {
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

      <GdsSensitiveNumber 
        value={45678.90}
        hide={isScreenSharing}
        currency="SEK"
        locale="sv-SE"
      />
    </GdsFlex>
  )
}
```

### 5. Loan Calculator

```tsx
function LoanCalculator() {
  const [hideSensitive, setHideSensitive] = useState(true)
  const [loanAmount, setLoanAmount] = useState(500000)
  const [interestRate, setInterestRate] = useState(3.5)
  const [years, setYears] = useState(25)

  const monthlyPayment = (loanAmount * (interestRate / 100 / 12) * Math.pow(1 + (interestRate / 100 / 12), years * 12)) / 
                        (Math.pow(1 + (interestRate / 100 / 12), years * 12) - 1)
  const totalPayment = monthlyPayment * years * 12
  const totalInterest = totalPayment - loanAmount

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="m">
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsText font="heading-m">Loan Calculation</GdsText>
          <GdsButton 
            variant="tertiary"
            onClick={() => setHideSensitive(!hideSensitive)}
          >
            {hideSensitive ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
        </GdsFlex>

        <GdsFlex flex-direction="column" gap="s">
          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Loan Amount</GdsText>
            <GdsSensitiveNumber 
              value={loanAmount}
              hide={hideSensitive}
              currency="SEK"
              locale="sv-SE"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">Monthly Payment</GdsText>
            <GdsSensitiveNumber 
              value={monthlyPayment}
              hide={hideSensitive}
              currency="SEK"
              locale="sv-SE"
              font="body-m"
            />
          </GdsFlex>

          <GdsDivider />

          <GdsFlex justify-content="space-between">
            <GdsText font="body-m">Total Interest</GdsText>
            <GdsSensitiveNumber 
              value={totalInterest}
              hide={hideSensitive}
              currency="SEK"
              locale="sv-SE"
              font="body-m"
              color="secondary"
            />
          </GdsFlex>

          <GdsFlex justify-content="space-between">
            <GdsText font="heading-s">Total Payment</GdsText>
            <GdsSensitiveNumber 
              value={totalPayment}
              hide={hideSensitive}
              currency="SEK"
              locale="sv-SE"
              font="heading-m"
            />
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

## Related Components

- [GdsFormattedNumber](./GdsFormattedNumber.md) — Formatted number display without blur protection (beta)
- [GdsSensitiveAccount](./GdsSensitiveAccount.md) — Sensitive account display with blur protection (beta)
- [GdsSensitiveDate](./GdsSensitiveDate.md) — Sensitive date display with blur protection (beta)
- [GdsBlur](./GdsBlur.md) — General blur effect for sensitive content
- [GdsText](./GdsText.md) — Typography component (GdsSensitiveNumber extends this)
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling color schemes
- [GdsCard](./GdsCard.md) — Container for number information
- [GdsButton](./GdsButton.md) — Buttons for visibility toggle
- [Icons](./Icons.md) — Icons for visibility controls (IconEye, IconEyeSlash)
- [GdsFlex](./GdsFlex.md) — Layout for number displays

## Accessibility

- **Semantic HTML**: Uses appropriate HTML tag via `tag` attribute (default: `span`)
- **Screen Readers**: Numbers are announced regardless of blur state
- **Blur Effect**: Visual-only protection, doesn't hide from screen readers
- **Keyboard Navigation**: Toggle buttons are keyboard accessible
- **Focus Indicators**: Clear focus indicators on interactive controls
- **ARIA Support**: Proper ARIA attributes for sensitive content state
- **Color Independence**: Blur effect doesn't rely on color perception
- **Locale Support**: Respects user's locale for number formatting
- **Currency Symbols**: Currency symbols are announced by screen readers

## Notes

- **Beta Status**: Component API may change in future releases
- **Number Formats**: Currently supports `'decimalsAndThousands'` format (default)
- **Locale Formatting**: Uses browser's `Intl.NumberFormat` for locale-specific formatting
- **Currency Formatting**: When `currency` is specified, displays amount with currency symbol
- **Blur Effect**: Applied via CSS, provides visual privacy but doesn't encrypt or mask underlying value
- **Formatted Value**: Access formatted output via `formattedValue` property (read-only)
- **Color Levels**: Use `level` property to ensure proper color token resolution in nested contexts
- **Style Expressions**: Full support for declarative layout and styling via style expression properties
- **Responsive**: Supports responsive style expressions for adaptive typography and layout
- **Privacy vs Security**: Blur is for visual privacy (shoulder surfing), not data security
- **Screen Sharing**: Consider auto-hiding during screen share or presentation mode
- **Number Input Types**: Accepts both `number` and `string` values
- **Performance**: Lightweight blur effect with minimal performance impact
- **HTML Tag**: Choose appropriate semantic tag (`h1-h6`, `p`, `span`) based on content hierarchy
- **Read-only Properties**: Properties like `isDefined`, `styleExpressionBaseSelector`, `semanticVersion` are read-only
- **Event Handling**: Listen to `gds-element-disconnected` for lifecycle management
- **Typography Tokens**: Use design system font tokens for consistent typography
- **Extends GdsText**: Inherits all typography and styling capabilities from GdsText component
- **Locale Default**: If no locale specified, uses browser's default locale
- **Negative Numbers**: Properly formats negative amounts with locale-specific formatting
- **Decimal Precision**: Respects locale-specific decimal precision rules
