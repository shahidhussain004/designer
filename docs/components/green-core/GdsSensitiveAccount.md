# GdsSensitiveAccount

A specialized component that displays a formatted account number with optional blur effect for sensitive information protection. When the `hide` property is set to `true`, the account number is hidden using a blur effect.

**Status:** Beta

## Import

```tsx
import { GdsSensitiveAccount } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsSensitiveAccount account="54400023423" />
```

## Complete Public API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `account` | `number \| string` | `undefined` | The account number or identifier to display. For format `'seb-account'`, it needs to be 11 characters |
| `hide` | `boolean` | `false` | When `true`, hides the sensitive account with blur effect |
| `tag` | `string` | `'span'` | Controls the HTML tag. Supports all valid HTML tags like `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `p`, `span`, etc. |
| `level` | `GdsColorLevel` | `'2'` | The level of the container used to resolve color tokens from the corresponding level (see Color System documentation) |
| `format` | `AccountFormats` | `'seb-account'` | Specifies the account format |
| `gds-element` | `string` | `undefined` | The unscoped name of this element (read-only, set automatically) |

### Style Expression Properties

#### Typography Properties

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

#### Size & Dimension Properties

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

#### Spacing Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `margin` | `string` | `undefined` | Controls the margin property (only accepts space tokens) |
| `margin-inline` | `string` | `undefined` | Controls the margin-inline property (only accepts space tokens) |
| `margin-block` | `string` | `undefined` | Controls the margin-block property (only accepts space tokens) |
| `padding` | `string` | `undefined` | Controls the padding property (only accepts space tokens) |
| `padding-inline` | `string` | `undefined` | Controls the padding-inline property (only accepts space tokens) |
| `padding-block` | `string` | `undefined` | Controls the padding-block property (only accepts space tokens) |
| `gap` | `string` | `undefined` | Controls the gap property (only accepts space tokens) |

#### Layout Properties

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

#### Grid Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `grid-column` | `string` | `undefined` | Controls the grid-column property ([MDN reference](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)) |
| `grid-row` | `string` | `undefined` | Controls the grid-row property (all valid CSS values) |
| `grid-area` | `string` | `undefined` | Controls the grid-area property (all valid CSS values) |

#### Flexbox Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `flex` | `string` | `undefined` | Controls the flex property (all valid CSS values) |
| `flex-direction` | `string` | `undefined` | Controls the flex-direction property (all valid CSS values) |
| `flex-wrap` | `string` | `undefined` | Controls the flex-wrap property (all valid CSS values) |
| `order` | `string` | `undefined` | Controls the order property (all valid CSS values) |

#### Visual Properties

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

#### Interaction Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `cursor` | `string` | `undefined` | Controls the cursor property (all valid CSS values) |
| `pointer-events` | `string` | `undefined` | Controls the pointer-events property (all valid CSS values) |

### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `formattedValue` | `string` | - | The formatted account number value (read-only) |
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Style expression properties for this element will use this selector by default (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element. Can be used for troubleshooting (read-only) |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element (read-only) |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from the DOM |

## Examples

### 1. Basic Account Display

```tsx
<GdsSensitiveAccount account="54400023423" />
```

### 2. Hidden Account (Blurred)

```tsx
<GdsSensitiveAccount 
  account="54400023423" 
  hide 
/>
```

**Note:** The `hide` property applies a blur effect to protect sensitive information from shoulder surfing or screen sharing.

### 3. Account Visibility Toggle

```tsx
import { useState } from 'react'
import { IconEye, IconEyeSlash } from '@sebgroup/green-core/react'

function AccountWithToggle() {
  const [isHidden, setIsHidden] = useState(true)

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveAccount 
        account="54400023423" 
        hide={isHidden}
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

### 4. Different HTML Tags

```tsx
{/* As heading */}
<GdsSensitiveAccount 
  account="54400023423" 
  tag="h3"
/>

{/* As paragraph */}
<GdsSensitiveAccount 
  account="54400023423" 
  tag="p"
/>

{/* As span (default) */}
<GdsSensitiveAccount 
  account="54400023423" 
  tag="span"
/>
```

### 5. Custom Typography Styling

```tsx
<GdsSensitiveAccount 
  account="54400023423" 
  font="heading-m"
  font-weight="bold"
  color="primary"
/>
```

### 6. Account Card with Privacy Control

```tsx
import { useState } from 'react'
import { IconEye, IconEyeSlash, IconCopy } from '@sebgroup/green-core/react'

function AccountCard() {
  const [isHidden, setIsHidden] = useState(true)
  const accountNumber = "54400023423"

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNumber)
  }

  return (
    <GdsCard padding="m">
      <GdsFlex flex-direction="column" gap="s">
        <GdsText font="detail-regular-s" color="secondary">
          Account Number
        </GdsText>
        
        <GdsFlex justify-content="space-between" align-items="center">
          <GdsSensitiveAccount 
            account={accountNumber}
            hide={isHidden}
            font="body-m"
          />
          
          <GdsFlex gap="xs">
            <GdsButton 
              variant="tertiary"
              size="small"
              onClick={() => setIsHidden(!isHidden)}
            >
              {isHidden ? <IconEye /> : <IconEyeSlash />}
            </GdsButton>
            
            <GdsButton 
              variant="tertiary"
              size="small"
              onClick={handleCopy}
            >
              <IconCopy />
            </GdsButton>
          </GdsFlex>
        </GdsFlex>
      </GdsFlex>
    </GdsCard>
  )
}
```

### 7. Account List with Selective Hiding

```tsx
import { useState } from 'react'

function AccountList() {
  const [hiddenAccounts, setHiddenAccounts] = useState<Set<string>>(new Set())

  const accounts = [
    { id: '1', number: '54400023423', name: 'Checking Account', balance: '10,245.50' },
    { id: '2', number: '54400045678', name: 'Savings Account', balance: '25,890.00' },
    { id: '3', number: '54400067890', name: 'Investment Account', balance: '150,000.00' },
  ]

  const toggleAccount = (id: string) => {
    setHiddenAccounts(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <GdsFlex flex-direction="column" gap="s">
      {accounts.map(account => (
        <GdsCard key={account.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsText font="detail-regular-s" color="secondary">
                {account.name}
              </GdsText>
              <GdsSensitiveAccount 
                account={account.number}
                hide={hiddenAccounts.has(account.id)}
              />
            </GdsFlex>
            
            <GdsFlex flex-direction="column" gap="2xs" align-items="flex-end">
              <GdsText font="detail-regular-s" color="secondary">
                Balance
              </GdsText>
              <GdsText font="body-m">
                ${account.balance}
              </GdsText>
            </GdsFlex>
            
            <GdsButton 
              variant="tertiary"
              size="small"
              onClick={() => toggleAccount(account.id)}
            >
              {hiddenAccounts.has(account.id) ? <IconEye /> : <IconEyeSlash />}
            </GdsButton>
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 8. Global Privacy Mode

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
      {isPrivacyMode ? 'Show All' : 'Hide All'}
    </GdsButton>
  )
}

function AccountDisplay({ account }: { account: string }) {
  const { isPrivacyMode } = useContext(PrivacyContext)

  return (
    <GdsSensitiveAccount 
      account={account}
      hide={isPrivacyMode}
    />
  )
}

function App() {
  return (
    <PrivacyProvider>
      <GdsFlex flex-direction="column" gap="m">
        <PrivacyToggle />
        <AccountDisplay account="54400023423" />
        <AccountDisplay account="54400045678" />
      </GdsFlex>
    </PrivacyProvider>
  )
}
```

### 9. Responsive Account Display

```tsx
<GdsSensitiveAccount 
  account="54400023423"
  font="body-s; m{ body-m }; l{ body-l }"
  hide={false}
/>
```

**Note:** Uses responsive style expressions to adjust font size based on viewport.

### 10. Color Level Context

```tsx
<GdsCard level="1" background="neutral-01">
  <GdsFlex flex-direction="column" gap="s" padding="m">
    <GdsText font="detail-regular-s" color="secondary">
      Primary Account
    </GdsText>
    
    {/* Level 2 context for proper color resolution */}
    <GdsSensitiveAccount 
      account="54400023423"
      level="2"
    />
  </GdsFlex>
</GdsCard>
```

## TypeScript

```tsx
import { GdsSensitiveAccount } from '@sebgroup/green-core/react'

interface GdsSensitiveAccountProps {
  // Core Attributes
  account?: number | string
  hide?: boolean
  tag?: string
  level?: '1' | '2' | '3' | '4'
  format?: 'seb-account'
  'gds-element'?: string
  
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
const SensitiveAccountDisplay: React.FC = () => {
  const [isHidden, setIsHidden] = useState(true)
  const accountNumber = "54400023423"

  const handleDisconnected = (e: CustomEvent) => {
    console.log('Component disconnected', e)
  }

  return (
    <GdsFlex gap="m" align-items="center">
      <GdsSensitiveAccount
        account={accountNumber}
        hide={isHidden}
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

**1. Default to Hidden for Sensitive Data**
```tsx
// ✅ Good - starts hidden for privacy
<GdsSensitiveAccount account="54400023423" hide />

// ❌ Bad - exposed by default
<GdsSensitiveAccount account="54400023423" />
```

**2. Provide Clear Toggle Controls**
```tsx
// ✅ Good - clear visibility control with icon
<GdsFlex gap="s" align-items="center">
  <GdsSensitiveAccount account="54400023423" hide={isHidden} />
  <GdsButton onClick={toggleVisibility}>
    {isHidden ? <IconEye /> : <IconEyeSlash />}
    {isHidden ? 'Show' : 'Hide'}
  </GdsButton>
</GdsFlex>

// ❌ Bad - no way to toggle visibility
<GdsSensitiveAccount account="54400023423" hide />
```

**3. Use Correct Account Format**
```tsx
// ✅ Good - 11 characters for seb-account format
<GdsSensitiveAccount 
  account="54400023423" 
  format="seb-account"
/>

// ❌ Bad - incorrect length
<GdsSensitiveAccount 
  account="123" 
  format="seb-account"
/>
```

**4. Provide Context Labels**
```tsx
// ✅ Good - clear labeling
<GdsFlex flex-direction="column" gap="2xs">
  <GdsText font="detail-regular-s" color="secondary">
    Account Number
  </GdsText>
  <GdsSensitiveAccount account="54400023423" hide />
</GdsFlex>

// ❌ Bad - account number without context
<GdsSensitiveAccount account="54400023423" />
```

**5. Consider Global Privacy Mode**
```tsx
// ✅ Good - centralized privacy control
const { isPrivacyMode } = usePrivacyContext()
<GdsSensitiveAccount account="54400023423" hide={isPrivacyMode} />

// ❌ Bad - duplicated state for each account
const [hidden1, setHidden1] = useState(false)
const [hidden2, setHidden2] = useState(false)
const [hidden3, setHidden3] = useState(false)
```

## Common Use Cases

### 1. Banking Dashboard

```tsx
function BankingDashboard() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  return (
    <GdsFlex flex-direction="column" gap="l">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="heading-m">My Accounts</GdsText>
        <GdsButton 
          variant="secondary"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
          {isPrivacyMode ? 'Show All' : 'Hide All'}
        </GdsButton>
      </GdsFlex>

      <GdsGrid columns="1; m{ 2 }; l{ 3 }" gap="m">
        <GdsCard padding="m">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="secondary">
              Checking Account
            </GdsText>
            <GdsSensitiveAccount 
              account="54400023423"
              hide={isPrivacyMode}
              font="body-m"
            />
            <GdsText font="heading-s">$10,245.50</GdsText>
          </GdsFlex>
        </GdsCard>

        <GdsCard padding="m">
          <GdsFlex flex-direction="column" gap="s">
            <GdsText font="detail-regular-s" color="secondary">
              Savings Account
            </GdsText>
            <GdsSensitiveAccount 
              account="54400045678"
              hide={isPrivacyMode}
              font="body-m"
            />
            <GdsText font="heading-s">$25,890.00</GdsText>
          </GdsFlex>
        </GdsCard>
      </GdsGrid>
    </GdsFlex>
  )
}
```

### 2. Transaction History

```tsx
function TransactionList() {
  const [isPrivacyMode, setIsPrivacyMode] = useState(true)

  const transactions = [
    { id: '1', account: '54400023423', amount: '-$150.00', date: '2025-11-12' },
    { id: '2', account: '54400045678', amount: '+$500.00', date: '2025-11-11' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="m">
      {transactions.map(tx => (
        <GdsCard key={tx.id} padding="m">
          <GdsFlex justify-content="space-between" align-items="center">
            <GdsFlex flex-direction="column" gap="2xs">
              <GdsSensitiveAccount 
                account={tx.account}
                hide={isPrivacyMode}
                font="body-s"
              />
              <GdsText font="detail-regular-s" color="secondary">
                {tx.date}
              </GdsText>
            </GdsFlex>
            <GdsText font="body-m">{tx.amount}</GdsText>
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 3. Account Selector

```tsx
function AccountSelector({ onSelect }: { onSelect: (account: string) => void }) {
  const [isPrivacyMode, setIsPrivacyMode] = useState(false)

  const accounts = [
    { number: '54400023423', name: 'Checking' },
    { number: '54400045678', name: 'Savings' },
  ]

  return (
    <GdsFlex flex-direction="column" gap="s">
      <GdsFlex justify-content="space-between" align-items="center">
        <GdsText font="body-m">Select Account</GdsText>
        <GdsButton 
          variant="tertiary"
          size="small"
          onClick={() => setIsPrivacyMode(!isPrivacyMode)}
        >
          {isPrivacyMode ? <IconEye /> : <IconEyeSlash />}
        </GdsButton>
      </GdsFlex>

      {accounts.map(account => (
        <GdsCard 
          key={account.number}
          padding="m"
          cursor="pointer"
          onClick={() => onSelect(account.number)}
        >
          <GdsFlex justify-content="space-between">
            <GdsText font="detail-regular-s" color="secondary">
              {account.name}
            </GdsText>
            <GdsSensitiveAccount 
              account={account.number}
              hide={isPrivacyMode}
            />
          </GdsFlex>
        </GdsCard>
      ))}
    </GdsFlex>
  )
}
```

### 4. Copy-to-Clipboard with Privacy

```tsx
function AccountWithCopy() {
  const [isHidden, setIsHidden] = useState(true)
  const [copied, setCopied] = useState(false)
  const accountNumber = "54400023423"

  const handleCopy = async () => {
    await navigator.clipboard.writeText(accountNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <GdsFlex flex-direction="column" gap="s">
      <GdsText font="detail-regular-s" color="secondary">
        Account Number
      </GdsText>
      
      <GdsFlex gap="s" align-items="center">
        <GdsSensitiveAccount 
          account={accountNumber}
          hide={isHidden}
        />
        
        <GdsFlex gap="xs">
          <GdsButton 
            variant="tertiary"
            size="small"
            onClick={() => setIsHidden(!isHidden)}
          >
            {isHidden ? <IconEye /> : <IconEyeSlash />}
          </GdsButton>
          
          <GdsButton 
            variant="tertiary"
            size="small"
            onClick={handleCopy}
          >
            {copied ? <IconCheckCircle /> : <IconCopy />}
          </GdsButton>
        </GdsFlex>
      </GdsFlex>
      
      {copied && (
        <GdsText font="detail-regular-s" color="positive">
          Copied to clipboard!
        </GdsText>
      )}
    </GdsFlex>
  )
}
```

### 5. Screen Share Protection

```tsx
function ScreenShareProtection() {
  const [isScreenSharing, setIsScreenSharing] = useState(false)

  // Detect screen sharing (simplified example)
  useEffect(() => {
    const detectScreenShare = () => {
      // Implementation would detect actual screen sharing
      // This is a simplified example
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

      <GdsSensitiveAccount 
        account="54400023423"
        hide={isScreenSharing}
      />
    </GdsFlex>
  )
}
```

## Related Components

- [GdsFormattedAccount](./GdsFormattedAccount.md) — Formatted account display without blur protection
- [GdsSensitiveDate](./GdsSensitiveDate.md) — Sensitive date display with blur protection
- [GdsSensitiveNumber](./GdsSensitiveNumber.md) — Sensitive number display with blur protection
- [GdsBlur](./GdsBlur.md) — General blur effect for sensitive content
- [GdsText](./GdsText.md) — Typography component (GdsSensitiveAccount extends this)
- [GdsTheme](./GdsTheme.md) — Theme utility for controlling color schemes
- [GdsCard](./GdsCard.md) — Container for account information
- [GdsButton](./GdsButton.md) — Buttons for visibility toggle
- [Icons](./Icons.md) — Icons for visibility controls (IconEye, IconEyeSlash, IconCopy)
- [GdsFlex](./GdsFlex.md) — Layout for account displays

## Accessibility

- **Semantic HTML**: Uses appropriate HTML tag via `tag` attribute (default: `span`)
- **Screen Readers**: Account numbers are announced regardless of blur state
- **Blur Effect**: Visual-only protection, doesn't hide from screen readers
- **Keyboard Navigation**: Toggle buttons are keyboard accessible
- **Focus Indicators**: Clear focus indicators on interactive controls
- **ARIA Support**: Proper ARIA attributes for sensitive content state
- **Color Independence**: Blur effect doesn't rely on color perception

## Notes

- **Beta Status**: Component API may change in future releases
- **Account Format**: For `format="seb-account"`, account must be exactly 11 characters
- **Blur Effect**: Applied via CSS, provides visual privacy but doesn't encrypt or mask underlying value
- **Formatted Value**: Access formatted output via `formattedValue` property (read-only)
- **Color Levels**: Use `level` property to ensure proper color token resolution in nested contexts
- **Style Expressions**: Full support for declarative layout and styling via style expression properties
- **Responsive**: Supports responsive style expressions for adaptive typography and layout
- **Privacy vs Security**: Blur is for visual privacy (shoulder surfing), not data security
- **Screen Sharing**: Consider auto-hiding during screen share or presentation mode
- **Clipboard**: Account number copied to clipboard is unformatted, regardless of display format
- **Performance**: Lightweight blur effect with minimal performance impact
- **HTML Tag**: Choose appropriate semantic tag (`h1-h6`, `p`, `span`) based on content hierarchy
- **Read-only Properties**: Properties like `isDefined`, `styleExpressionBaseSelector`, `semanticVersion` are read-only
- **Event Handling**: Listen to `gds-element-disconnected` for lifecycle management
- **Typography Tokens**: Use design system font tokens for consistent typography
- **Extends GdsText**: Inherits all typography and styling capabilities from GdsText component
