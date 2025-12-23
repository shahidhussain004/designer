# GdsGroupedList & GdsListItem

GdsGroupedList and GdsListItem are used to list many datapoints with labels in a structured way. They may be grouped under headings and they may have links or buttons added to act on the data being displayed.

## Overview

GdsGroupedList provides a structured way to display key-value pairs or data items in a list format. Each item in the list is represented by a GdsListItem component. The list can have an optional label/heading and supports flexible styling and content placement.

The components are useful for:
- **Displaying structured data** with labels and values
- **Key-value pair listings** (account details, transaction info, user profile data)
- **Action items** with links or buttons
- **Grouped information** under headings
- **Flexible layouts** (horizontal, vertical, left-aligned, space-between)

## Import

```tsx
// Use as JSX elements in React
import { GdsGroupedList, GdsListItem } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsGroupedList>
    <GdsListItem>Item 1</GdsListItem>
    <GdsListItem>Item 2</GdsListItem>
    <GdsListItem>Item 3</GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

## API

### GdsGroupedList

#### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | Label/heading for the list (renders as first element with class `gds-list-heading`) |

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `label` | `string` | Label/heading for the list |
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | Contains `GdsListItem` elements |

### GdsListItem

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `isDefined` | `boolean` | Whether element is defined in custom element registry |
| `styleExpressionBaseSelector` | `string` | Base selector for style expressions (`:host`) |
| `semanticVersion` | `string` | Semantic version of the element |
| `gdsElementName` | `string` | Unscoped name of the element (read-only) |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

#### Slots

| Slot | Description |
|------|-------------|
| (default) | Content of the list item (supports any HTML elements) |

#### Default Styling

- List items are displayed as **flex containers** by default
- Default `justify-content` is **space-between**
- Can be customized with inline styles or CSS classes

## Examples

### Basic List

```tsx
<GdsTheme>
  <GdsGroupedList>
    <GdsListItem>Item 1</GdsListItem>
    <GdsListItem>Item 2</GdsListItem>
    <GdsListItem>Item 3</GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### List with Label/Heading

```tsx
<GdsTheme>
  <GdsGroupedList label="Account Details">
    <GdsListItem>Account Number</GdsListItem>
    <GdsListItem>Account Type</GdsListItem>
    <GdsListItem>Balance</GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### Key-Value Pairs

```tsx
<GdsTheme>
  <GdsGroupedList label="Example with values">
    <GdsListItem>
      <div>Key 1</div>
      <strong>Value 1</strong>
    </GdsListItem>
    <GdsListItem>
      <div>Key 2</div>
      <strong>Value 2</strong>
    </GdsListItem>
    <GdsListItem>
      <div>Key 3</div>
      <strong>Value 3</strong>
    </GdsListItem>
    <GdsListItem>
      <div>Key 4</div>
      <strong>Value 4</strong>
    </GdsListItem>
    <GdsListItem>
      <div>Key 5</div>
      <strong>Value 5</strong>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### With Links or Actions

```tsx
<GdsTheme>
  <GdsGroupedList label="Example with links">
    <GdsListItem>
      <div>Key 1</div>
      <strong>Value 1</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
    <GdsListItem>
      <div>Key 2</div>
      <strong>Value 2</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
    <GdsListItem>
      <div>Key 3</div>
      <strong>Value 3</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
    <GdsListItem>
      <div>Key 4</div>
      <strong>Value 4</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
    <GdsListItem>
      <div>Key 5</div>
      <strong>Value 5</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### With Buttons

```tsx
<GdsTheme>
  <GdsGroupedList label="Transaction History">
    <GdsListItem>
      <div>Coffee Shop</div>
      <strong>-$4.50</strong>
      <GdsButton rank="tertiary" size="small">Details</GdsButton>
    </GdsListItem>
    <GdsListItem>
      <div>Grocery Store</div>
      <strong>-$56.78</strong>
      <GdsButton rank="tertiary" size="small">Details</GdsButton>
    </GdsListItem>
    <GdsListItem>
      <div>Salary</div>
      <strong>+$3,500.00</strong>
      <GdsButton rank="tertiary" size="small">Details</GdsButton>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### Left-Aligned Layout

```tsx
<GdsTheme>
  <GdsGroupedList label="Example of left aligned list">
    <GdsListItem style={{ justifyContent: 'left' }}>
      <div>Key 1</div>
      <strong>Value 1</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
    <GdsListItem style={{ justifyContent: 'left' }}>
      <div>Key 2</div>
      <strong>Value 2</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
    <GdsListItem style={{ justifyContent: 'left' }}>
      <div>Key 3</div>
      <strong>Value 3</strong>
      <div>
        <a href="#">Link</a>
      </div>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### Vertical Layout

```tsx
<GdsTheme>
  <GdsGroupedList label="Example of vertical list">
    <GdsListItem style={{ flexDirection: 'column', borderWidth: 0 }}>
      <div>Key 1</div>
      <strong>Value 1</strong>
    </GdsListItem>
    <GdsListItem style={{ flexDirection: 'column', borderWidth: 0 }}>
      <div>Key 2</div>
      <strong>Value 2</strong>
    </GdsListItem>
    <GdsListItem style={{ flexDirection: 'column', borderWidth: 0 }}>
      <div>Key 3</div>
      <strong>Value 3</strong>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### Account Information

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsGroupedList label="Account Information">
      <GdsListItem>
        <GdsText>Account Number</GdsText>
        <GdsFormattedAccount>54400023423</GdsFormattedAccount>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Account Type</GdsText>
        <GdsText font="body-m">Checking</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Available Balance</GdsText>
        <GdsFormattedNumber format="currency" currency="SEK">
          15250.75
        </GdsFormattedNumber>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Last Updated</GdsText>
        <GdsFormattedDate format="dateShort">
          2025-02-25T13:17:30.000Z
        </GdsFormattedDate>
      </GdsListItem>
    </GdsGroupedList>
  </GdsCard>
</GdsTheme>
```

### Multiple Grouped Lists

```tsx
<GdsTheme>
  <GdsFlex flex-direction="column" gap="m">
    <GdsGroupedList label="Personal Information">
      <GdsListItem>
        <GdsText>Full Name</GdsText>
        <GdsText font="body-m">John Doe</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Email</GdsText>
        <GdsText font="body-m">john.doe@example.com</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Phone</GdsText>
        <GdsText font="body-m">+46 70 123 4567</GdsText>
      </GdsListItem>
    </GdsGroupedList>
    
    <GdsGroupedList label="Address">
      <GdsListItem>
        <GdsText>Street</GdsText>
        <GdsText font="body-m">123 Main Street</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>City</GdsText>
        <GdsText font="body-m">Stockholm</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Postal Code</GdsText>
        <GdsText font="body-m">123 45</GdsText>
      </GdsListItem>
    </GdsGroupedList>
  </GdsFlex>
</GdsTheme>
```

### With Icons

```tsx
import { IconUser, IconMail, IconPhone } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsGroupedList label="Contact Details">
    <GdsListItem>
      <GdsFlex gap="s" align-items="center">
        <IconUser />
        <GdsText>Name</GdsText>
      </GdsFlex>
      <GdsText font="body-m">John Doe</GdsText>
    </GdsListItem>
    <GdsListItem>
      <GdsFlex gap="s" align-items="center">
        <IconMail />
        <GdsText>Email</GdsText>
      </GdsFlex>
      <GdsText font="body-m">john@example.com</GdsText>
    </GdsListItem>
    <GdsListItem>
      <GdsFlex gap="s" align-items="center">
        <IconPhone />
        <GdsText>Phone</GdsText>
      </GdsFlex>
      <GdsText font="body-m">+46 70 123 4567</GdsText>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### Transaction Details

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Transaction Details</GdsText>
      
      <GdsGroupedList label="Basic Information">
        <GdsListItem>
          <GdsText>Transaction ID</GdsText>
          <GdsText font="detail-m">TXN-2025-0001234</GdsText>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Date</GdsText>
          <GdsFormattedDate format="dateLongWithWeekday">
            2025-02-25T13:17:30.000Z
          </GdsFormattedDate>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Status</GdsText>
          <GdsBadge variant="positive">Completed</GdsBadge>
        </GdsListItem>
      </GdsGroupedList>
      
      <GdsGroupedList label="Amount Details">
        <GdsListItem>
          <GdsText>Amount</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            1234.50
          </GdsFormattedNumber>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Fee</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            5.00
          </GdsFormattedNumber>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Total</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK" font="heading-s">
            1239.50
          </GdsFormattedNumber>
        </GdsListItem>
      </GdsGroupedList>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Settings List with Actions

```tsx
<GdsTheme>
  <GdsGroupedList label="Account Settings">
    <GdsListItem>
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">Email Notifications</GdsText>
        <GdsText font="detail-s" opacity="0.6">
          Receive updates via email
        </GdsText>
      </GdsFlex>
      <GdsCheckbox checked />
    </GdsListItem>
    <GdsListItem>
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">SMS Notifications</GdsText>
        <GdsText font="detail-s" opacity="0.6">
          Receive alerts via SMS
        </GdsText>
      </GdsFlex>
      <GdsCheckbox />
    </GdsListItem>
    <GdsListItem>
      <GdsFlex flex-direction="column" gap="xs">
        <GdsText font="body-m">Two-Factor Authentication</GdsText>
        <GdsText font="detail-s" opacity="0.6">
          Add extra security to your account
        </GdsText>
      </GdsFlex>
      <GdsButton rank="secondary" size="small">Configure</GdsButton>
    </GdsListItem>
  </GdsGroupedList>
</GdsTheme>
```

### Product Specifications

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsGroupedList label="Technical Specifications">
      <GdsListItem>
        <GdsText>Processor</GdsText>
        <GdsText font="body-m">Intel Core i7-12700K</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Memory</GdsText>
        <GdsText font="body-m">32 GB DDR5</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Storage</GdsText>
        <GdsText font="body-m">1 TB NVMe SSD</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Graphics</GdsText>
        <GdsText font="body-m">NVIDIA RTX 4070</GdsText>
      </GdsListItem>
      <GdsListItem>
        <GdsText>Display</GdsText>
        <GdsText font="body-m">27" 4K UHD</GdsText>
      </GdsListItem>
    </GdsGroupedList>
  </GdsCard>
</GdsTheme>
```

### Order Summary

```tsx
<GdsTheme>
  <GdsCard padding="m">
    <GdsFlex flex-direction="column" gap="m">
      <GdsText tag="h3" font="heading-m">Order Summary</GdsText>
      
      <GdsGroupedList>
        <GdsListItem>
          <GdsText>Subtotal</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            1499.00
          </GdsFormattedNumber>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Shipping</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            49.00
          </GdsFormattedNumber>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Tax (25%)</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK">
            387.00
          </GdsFormattedNumber>
        </GdsListItem>
        <GdsListItem>
          <GdsText>Discount</GdsText>
          <GdsFormattedNumber format="currency" currency="SEK" color="positive">
            -100.00
          </GdsFormattedNumber>
        </GdsListItem>
      </GdsGroupedList>
      
      <GdsDivider />
      
      <GdsFlex justify-content="space-between">
        <GdsText font="heading-m">Total</GdsText>
        <GdsFormattedNumber 
          format="currency" 
          currency="SEK" 
          font="heading-m"
        >
          1835.00
        </GdsFormattedNumber>
      </GdsFlex>
      
      <GdsButton width="100%">Proceed to Checkout</GdsButton>
    </GdsFlex>
  </GdsCard>
</GdsTheme>
```

### Dynamic List from State

```tsx
import { useState } from 'react'

function UserProfile() {
  const [user] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+46 70 123 4567',
    address: '123 Main Street, Stockholm',
    joined: '2023-01-15T10:00:00.000Z'
  })
  
  return (
    <GdsTheme>
      <GdsCard padding="m">
        <GdsGroupedList label="User Profile">
          <GdsListItem>
            <GdsText>Name</GdsText>
            <GdsText font="body-m">{user.name}</GdsText>
          </GdsListItem>
          <GdsListItem>
            <GdsText>Email</GdsText>
            <GdsText font="body-m">{user.email}</GdsText>
          </GdsListItem>
          <GdsListItem>
            <GdsText>Phone</GdsText>
            <GdsText font="body-m">{user.phone}</GdsText>
          </GdsListItem>
          <GdsListItem>
            <GdsText>Address</GdsText>
            <GdsText font="body-m">{user.address}</GdsText>
          </GdsListItem>
          <GdsListItem>
            <GdsText>Member Since</GdsText>
            <GdsFormattedDate format="dateLong">
              {user.joined}
            </GdsFormattedDate>
          </GdsListItem>
        </GdsGroupedList>
      </GdsCard>
    </GdsTheme>
  )
}
```

## Best Practices

### Content Organization
- Use descriptive labels for grouped lists
- Group related information together
- Keep key names concise and clear
- Use consistent value formatting

### Layout
- Default space-between works well for key-value pairs
- Use left alignment for multi-item rows
- Use vertical layout for stacked information
- Consider responsive behavior for mobile

### Actions
- Place action buttons/links at the end of each item
- Use appropriate button ranks (tertiary for list actions)
- Keep button text concise
- Consider icon-only buttons for space-constrained layouts

### Styling
- Use inline styles or CSS classes for customization
- Maintain consistent spacing between items
- Use appropriate fonts for keys vs values
- Consider using GdsText components for typography

### Accessibility
- Ensure proper heading hierarchy with `label` attribute
- Use semantic HTML elements (strong, em, etc.)
- Provide clear labels for all data
- Ensure sufficient color contrast

## Common Patterns

### Basic Key-Value List
```tsx
<GdsGroupedList label="Details">
  <GdsListItem>
    <div>Key</div>
    <strong>Value</strong>
  </GdsListItem>
</GdsGroupedList>
```

### With Actions
```tsx
<GdsGroupedList label="Items">
  <GdsListItem>
    <div>Item Name</div>
    <strong>Item Value</strong>
    <a href="#">Action</a>
  </GdsListItem>
</GdsGroupedList>
```

### Vertical Layout
```tsx
<GdsListItem style={{ flexDirection: 'column' }}>
  <div>Label</div>
  <strong>Content</strong>
</GdsListItem>
```

### With Formatted Components
```tsx
<GdsListItem>
  <GdsText>Label</GdsText>
  <GdsFormattedNumber format="currency" currency="SEK">
    1234.50
  </GdsFormattedNumber>
</GdsListItem>
```

## TypeScript Types

```tsx
import type { GdsGroupedList, GdsListItem } from '@sebgroup/green-core/react'

// GdsGroupedList props
interface GdsGroupedListProps extends React.HTMLAttributes<HTMLElement> {
  label?: string
  children?: React.ReactNode
  
  // Events
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}

// GdsListItem props
interface GdsListItemProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode
  style?: React.CSSProperties
  
  // Events
  'onGds-element-disconnected'?: (event: CustomEvent) => void
}
```

## Related Components

- [GdsCard](./GdsCard.md) — Card container for grouped lists
- [GdsFlex](./GdsFlex.md) — Flexible layout for list items
- [GdsLink](./GdsLink.md) — For navigation links in list items
- [GdsText](./GdsText.md) — Typography for labels and values
- [GdsDivider](./GdsDivider.md) — Separating list groups
- [GdsFormattedNumber](./GdsFormattedNumber.md) — For formatted values in lists
- [GdsFormattedDate](./GdsFormattedDate.md) — For date values in lists
- [GdsFormattedAccount](./GdsFormattedAccount.md) — For account numbers in lists
- [GdsButton](./GdsButton.md) — For action buttons in list items
- [GdsBadge](./GdsBadge.md) — For status indicators in lists
- [GdsCheckbox](./GdsCheckbox.md) — For toggleable list items
- [Icons](./Icons.md) — For icons in list items

## Accessibility

- **Semantic HTML**: Use appropriate tags for list content
- **Headings**: Label attribute creates proper heading structure
- **Screen Readers**: Ensure labels are descriptive and clear
- **Keyboard Navigation**: Links and buttons should be keyboard accessible
- **Color Contrast**: Ensure sufficient contrast for all text

## Notes

- GdsListItem components must be direct children of GdsGroupedList
- List items are flex containers by default with `justify-content: space-between`
- Custom styling can be applied via inline styles or CSS classes
- The label renders as the first element with class `gds-list-heading`
- Supports any HTML content within list items
- No predefined style expression properties (use inline styles/classes)
- Flexible layout allows for horizontal or vertical arrangements
- Works well with other Green Core components for rich content
