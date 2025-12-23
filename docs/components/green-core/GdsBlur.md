# GdsBlur Component

The `GdsBlur` component is used to apply a blur effect over content, often used to obscure sensitive or background information. This component is useful for privacy protection, focusing user attention, or creating visual hierarchy.

**Status**: Beta

## Features

- Applies visual blur effect to wrapped content
- Useful for obscuring sensitive information
- Can be used for privacy protection in demos or screenshots
- Helps create visual hierarchy by de-emphasizing background content
- Simple wrapper component with no configuration needed
- Supports all standard style expression properties

## Import

```tsx
import { GdsBlur } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsBlur>
  <GdsText>This text will be blurred</GdsText>
</GdsBlur>
```

## Public API

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `isDefined` | `boolean` | `false` | Whether the element is defined in the custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Style expression properties for this element will use this selector by default (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | The semantic version of this element. Can be used for troubleshooting to verify the version being used (read-only) |
| `gdsElementName` | `string` | `undefined` | The unscoped name of this element. This attribute is set automatically by the element and is intended to be read-only |

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `gds-element` | `string` | `undefined` | The unscoped name of this element. This attribute is set automatically by the element and is intended to be read-only |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | When the element is disconnected from the DOM |

### Slots

| Slot | Description |
|------|-------------|
| Default | Content to be blurred |

## Examples

### Default

Basic blur effect on text:

```tsx
<GdsBlur>
  <GdsText>This text is blurred</GdsText>
</GdsBlur>
```

### Blurring Sensitive Information

Obscure sensitive data like account numbers, personal information, or confidential details:

```tsx
<GdsFlex flex-direction="column" gap="m">
  <GdsFlex justify-content="space-between">
    <GdsText>Account Number:</GdsText>
    <GdsBlur>
      <GdsText>1234-5678-9012-3456</GdsText>
    </GdsBlur>
  </GdsFlex>
  
  <GdsFlex justify-content="space-between">
    <GdsText>Social Security Number:</GdsText>
    <GdsBlur>
      <GdsText>123-45-6789</GdsText>
    </GdsBlur>
  </GdsFlex>
  
  <GdsFlex justify-content="space-between">
    <GdsText>Email:</GdsText>
    <GdsBlur>
      <GdsText>user@example.com</GdsText>
    </GdsBlur>
  </GdsFlex>
</GdsFlex>
```

### Blurring Complex Content

The blur effect can be applied to any content, including cards, forms, or complex layouts:

```tsx
<GdsBlur>
  <GdsCard padding="l">
    <GdsText tag="h3" font="heading-m">Confidential Information</GdsText>
    <GdsText>This entire card content is blurred to protect sensitive data.</GdsText>
    <GdsFlex gap="m" margin-block="m">
      <GdsButton rank="primary">Action 1</GdsButton>
      <GdsButton rank="secondary">Action 2</GdsButton>
    </GdsFlex>
  </GdsCard>
</GdsBlur>
```

### Conditional Blurring

Toggle blur based on user interaction or state:

```tsx
const [isBlurred, setIsBlurred] = useState(true)

return (
  <GdsFlex flex-direction="column" gap="m">
    <GdsButton onClick={() => setIsBlurred(!isBlurred)}>
      {isBlurred ? 'Show' : 'Hide'} Sensitive Data
    </GdsButton>
    
    {isBlurred ? (
      <GdsBlur>
        <GdsText>Confidential banking information: Account #1234567890</GdsText>
      </GdsBlur>
    ) : (
      <GdsText>Confidential banking information: Account #1234567890</GdsText>
    )}
  </GdsFlex>
)
```

### Blurring Background Content

Use blur to de-emphasize background content when showing modals or overlays:

```tsx
<div>
  <GdsBlur>
    <GdsFlex flex-direction="column" gap="l" padding="xl">
      <GdsText tag="h2" font="heading-l">Background Content</GdsText>
      <GdsText>This content is blurred to focus attention on the foreground dialog.</GdsText>
      <GdsGrid columns="3" gap="m">
        <GdsCard>Card 1</GdsCard>
        <GdsCard>Card 2</GdsCard>
        <GdsCard>Card 3</GdsCard>
      </GdsGrid>
    </GdsFlex>
  </GdsBlur>
  
  <GdsDialog open>
    <GdsText tag="h3" font="heading-m">Important Dialog</GdsText>
    <GdsText>The background is blurred to focus on this dialog.</GdsText>
  </GdsDialog>
</div>
```

### Table Data Privacy

Blur sensitive columns in data tables:

```tsx
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Account Number</th>
      <th>Balance</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>
        <GdsBlur>
          <span>1234567890</span>
        </GdsBlur>
      </td>
      <td>
        <GdsBlur>
          <span>$10,000.00</span>
        </GdsBlur>
      </td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>
        <GdsBlur>
          <span>9876543210</span>
        </GdsBlur>
      </td>
      <td>
        <GdsBlur>
          <span>$25,500.00</span>
        </GdsBlur>
      </td>
    </tr>
  </tbody>
</table>
```

### Form Preview Mode

Blur form fields in preview or demo mode:

```tsx
const PreviewForm = ({ isPreview }: { isPreview: boolean }) => {
  const FormField = ({ children }: { children: React.ReactNode }) => (
    isPreview ? <GdsBlur>{children}</GdsBlur> : <>{children}</>
  )
  
  return (
    <GdsFlex flex-direction="column" gap="m">
      <FormField>
        <GdsInput label="First Name" value="John" />
      </FormField>
      
      <FormField>
        <GdsInput label="Last Name" value="Doe" />
      </FormField>
      
      <FormField>
        <GdsInput label="Email" value="john.doe@example.com" />
      </FormField>
      
      <FormField>
        <GdsInput label="Phone" value="+1 234 567 8900" />
      </FormField>
    </GdsFlex>
  )
}
```

### Screenshot Protection

Blur sensitive areas for documentation or presentations:

```tsx
<GdsFlex flex-direction="column" gap="l">
  <GdsText tag="h2" font="heading-l">Dashboard Overview</GdsText>
  
  <GdsGrid columns="2" gap="l">
    <GdsCard>
      <GdsText tag="h3" font="heading-m">Account Summary</GdsText>
      <GdsBlur>
        <GdsText>Available Balance: $15,234.56</GdsText>
        <GdsText>Account: 1234-5678-9012</GdsText>
      </GdsBlur>
    </GdsCard>
    
    <GdsCard>
      <GdsText tag="h3" font="heading-m">Recent Transactions</GdsText>
      <GdsBlur>
        <GdsFlex flex-direction="column" gap="s">
          <GdsText>Payment to ABC Corp - $500</GdsText>
          <GdsText>Deposit - $2,000</GdsText>
          <GdsText>Transfer to Savings - $1,000</GdsText>
        </GdsFlex>
      </GdsBlur>
    </GdsCard>
  </GdsGrid>
</GdsFlex>
```

## Use Cases

### Privacy Protection

- **Demo environments**: Blur real data in demo or staging environments
- **Screenshots**: Protect sensitive information in documentation screenshots
- **Screen sharing**: Obscure confidential data during presentations or video calls
- **Public displays**: Hide personal information on public-facing screens

### User Experience

- **Focus management**: Blur background content when displaying modals or dialogs
- **Progressive disclosure**: Initially blur content that requires authentication
- **Loading states**: Blur content while loading or processing
- **Preview mode**: Show layout without revealing actual data

### Compliance & Security

- **Data protection**: Comply with privacy regulations by obscuring PII
- **Access control**: Blur content for users without proper permissions
- **Audit trails**: Blur sensitive data in logs or reports
- **GDPR compliance**: Protect personal data in UI screenshots or recordings

## Best Practices

1. **Use for sensitive data**: Apply blur to:
   - Account numbers
   - Social security numbers
   - Credit card numbers
   - Personal email addresses
   - Phone numbers
   - Financial amounts
   - Personal identification information

2. **Provide visibility controls**: 
   - Allow authorized users to toggle blur on/off
   - Use clear button labels like "Show" / "Hide"
   - Consider password or authentication before revealing

3. **Semantic HTML**: 
   - Blur affects visual presentation only
   - Ensure underlying content remains accessible to screen readers when appropriate
   - Use ARIA attributes if blur indicates hidden or sensitive content

4. **Performance considerations**:
   - Blur effect uses CSS filters which can impact performance on large areas
   - Consider blurring specific elements rather than entire pages
   - Test performance on mobile devices

5. **User feedback**:
   - Make it clear that content is intentionally blurred
   - Provide visual cues or labels indicating blurred content
   - Consider adding hover states or tooltips explaining why content is blurred

6. **Combine with other security measures**:
   - Blur is a visual effect only - don't rely on it for actual security
   - Always implement proper backend security and access controls
   - Blur should complement, not replace, security measures

7. **Accessibility**:
   - Screen readers will still read blurred content
   - Use `aria-hidden="true"` if content should be hidden from assistive technologies
   - Provide alternative text descriptions when appropriate

## Common Patterns

### Toggle Blur with Authentication

```tsx
const SensitiveData = ({ data }: { data: string }) => {
  const [revealed, setRevealed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const handleReveal = async () => {
    // Authenticate user before revealing
    const auth = await authenticateUser()
    setIsAuthenticated(auth)
    if (auth) {
      setRevealed(true)
    }
  }
  
  return (
    <GdsFlex align-items="center" gap="m">
      {revealed ? (
        <GdsText>{data}</GdsText>
      ) : (
        <GdsBlur>
          <GdsText>{data}</GdsText>
        </GdsBlur>
      )}
      <GdsButton 
        rank="tertiary" 
        size="small"
        onClick={handleReveal}
      >
        {revealed ? 'Hide' : 'Show'}
      </GdsButton>
    </GdsFlex>
  )
}
```

### Blur List Items

```tsx
const TransactionList = ({ transactions, showAmounts }: Props) => (
  <GdsFlex flex-direction="column" gap="s">
    {transactions.map(tx => (
      <GdsFlex key={tx.id} justify-content="space-between">
        <GdsText>{tx.description}</GdsText>
        {showAmounts ? (
          <GdsText>{tx.amount}</GdsText>
        ) : (
          <GdsBlur>
            <GdsText>{tx.amount}</GdsText>
          </GdsBlur>
        )}
      </GdsFlex>
    ))}
  </GdsFlex>
)
```

### Conditional Blur Based on Permissions

```tsx
const SecureContent = ({ 
  content, 
  requiresPermission 
}: { 
  content: React.ReactNode
  requiresPermission: string 
}) => {
  const { hasPermission } = usePermissions()
  
  if (hasPermission(requiresPermission)) {
    return <>{content}</>
  }
  
  return (
    <GdsBlur>
      {content}
    </GdsBlur>
  )
}

// Usage
<SecureContent requiresPermission="VIEW_FINANCIAL_DATA">
  <GdsText>Balance: $10,000.00</GdsText>
</SecureContent>
```

## Related Components

- **GdsSignal**: For indicating status or states (see [GdsSignal.md](./GdsSignal.md))
- **GdsCard**: Often used with blur to obscure card content (see [GdsCard.md](./GdsCard.md))
- **GdsDialog**: Blur can be used with dialogs to de-emphasize background
- **GdsFlex**: For layout of blurred and non-blurred content (see [GdsFlex.md](./GdsFlex.md))
- **GdsGrid**: For grid layouts with selective blurring (see [GdsGrid.md](./GdsGrid.md))

## Notes
## Customization

You can control the visual strength of the blur using CSS variables in your theme or locally on the element. The design system exposes a sensible default token (for example `--gds-sys-blur-m`) — override it when you need a different intensity.

Example (CSS variable override):

```css
:root {
  --gds-sys-blur-m: 6px; /* increase default medium blur */
}
```

Example (local override):

```tsx
<GdsBlur style={{ '--gds-sys-blur-m': '10px' } as React.CSSProperties}>
  <GdsText>More heavily blurred content</GdsText>
</GdsBlur>
```

Implementation note: the concrete variable name may differ in your implementation. If your project exposes a different token name for blur intensity, prefer using the canonical token from `Tokens.md` (for example `--gds-sys-effect-blur-*`).

Reduced Motion

Respect users' motion preferences: when `prefers-reduced-motion: reduce` is set, avoid animating blur transitions and consider disabling the blur effect entirely for motion-sensitive users.

```css
@media (prefers-reduced-motion: reduce) {
  .gds-blur,
  gds-blur {
    filter: none !important;
    transition: none !important;
  }
}
```

JS Example (honour reduced motion in interactive toggles):

```tsx
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

return (
  <GdsBlur style={{ filter: prefersReduced ? 'none' : 'blur(var(--gds-sys-blur-m))' }}>
    <GdsText>Content</GdsText>
  </GdsBlur>
)
```

Interaction cautions

- Avoid blurring interactive elements that users need to click, type into, or navigate with the keyboard. Blurring can make interactive affordances harder to perceive and may interfere with usability.
- If you must blur interactive content, ensure that interactive controls remain visually and programmatically discoverable (focusable, with visible focus styles) and consider adding a non-visual clue (e.g., `aria-label`) about the blurred state.

## Notes
- Blur is a visual effect only and does not provide actual security
- Content inside `GdsBlur` is still present in the DOM and accessible via developer tools
- Always implement proper backend security and access controls
- Screen readers will still read content inside blur components
- The blur effect uses CSS filters which may impact performance on older devices
- Beta status indicates the API may change in future versions
- Test blur appearance across different browsers for consistency

## Security Considerations

⚠️ **Important**: The `GdsBlur` component is for visual privacy only:

1. **Not a security feature**: Blurred content is still in the DOM and can be inspected
2. **Use proper access controls**: Implement server-side authorization
3. **Don't send sensitive data**: If data shouldn't be visible, don't send it to the client
4. **Complement with real security**: Use blur as part of a defense-in-depth strategy
5. **Test thoroughly**: Verify blur works across all target browsers and devices

---

**Reference**: [SEB Green Core Storybook - Blur](https://storybook.seb.io/latest/core/?path=/docs/components-blur--docs)

**Status**: Beta

Generated: 2025-11-12
