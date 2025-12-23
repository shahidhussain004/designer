# GdsContextMenu Component Documentation

## Overview

A context menu displays a list of contextual actions in a popover. It's typically triggered by a button and provides users with a set of related actions or options.

**Key Features**:
- Popover-based menu with flexible placement
- Custom trigger button or default button
- Icon customization
- Label visibility control
- Keyboard accessible
- ARIA-compliant
- Event delegation for menu items
- Style expression properties for layout

## Important React Usage Note

⚠️ **In React, always use the JSX element imports from `@sebgroup/green-core/react`:**
- `GdsContextMenu` (React component)
- `GdsMenuItem` (React component)
- `GdsMenuHeading` (React component)
- `GdsTheme` (React component)

**Never use the HTML custom elements directly:**
- ❌ `<gds-context-menu>`
- ❌ `<gds-menu-item>`
- ❌ `<gds-menu-heading>`
- ❌ `<gds-theme>`

## Import

```tsx
import { GdsContextMenu, GdsMenuItem, GdsMenuHeading, GdsTheme } from '@sebgroup/green-core/react'
```

## Basic Usage

### Simple Context Menu

```tsx
<GdsTheme>
  <GdsContextMenu label="Select an action" button-label="Menu">
    <GdsMenuItem>Action 1</GdsMenuItem>
    <GdsMenuItem>Action 2</GdsMenuItem>
    <GdsMenuItem>Action 3</GdsMenuItem>
  </GdsContextMenu>
</GdsTheme>
```

### With Event Handling

```tsx
import { GdsContextMenu, GdsMenuItem } from '@sebgroup/green-core/react'

const [selectedAction, setSelectedAction] = useState('')

// Listen to individual menu item clicks
<GdsContextMenu label="Select an action" button-label="Actions">
  <GdsMenuItem onClick={() => setSelectedAction('Action 1')}>
    Action 1
  </GdsMenuItem>
  <GdsMenuItem onClick={() => setSelectedAction('Action 2')}>
    Action 2
  </GdsMenuItem>
  <GdsMenuItem onClick={() => setSelectedAction('Action 3')}>
    Action 3
  </GdsMenuItem>
</GdsContextMenu>

// Or listen to parent event
<GdsContextMenu 
  label="Select an action" 
  button-label="Actions"
  onGdsMenuItemClick={(e) => {
    console.log('Menu item clicked:', e.detail)
    setSelectedAction(e.detail.innerText)
  }}
>
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
  <GdsMenuItem>Action 3</GdsMenuItem>
</GdsContextMenu>
```

## Public API

### GdsContextMenu - Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `open` | `boolean` | `false` | Whether the context menu popover is open |
| `label` | `string` | `''` | **Important** - Label for popover and menu. Should describe context (e.g., "Select an action for XYZ") |
| `placement` | `Placement` | `'bottom-start'` | Placement relative to trigger. Accepts Floating UI placements |
| `button-label` | `string` | `''` | Label for the trigger button (accessibility) |
| `show-label` | `boolean` | `false` | Whether to show the label on trigger button |

### GdsContextMenu - Properties

| Property | Type | Description |
|----------|------|-------------|
| `buttonLabel` | `string` | Label for trigger button (JS property name) |
| `showLabel` | `boolean` | Whether to show label on trigger (JS property name) |

### GdsContextMenu - Style Expression Properties

| Property | Description |
|----------|-------------|
| `margin` | Controls the margin property. Only accepts space tokens |
| `margin-inline` | Controls the margin-inline property. Only accepts space tokens |
| `margin-block` | Controls the margin-block property. Only accepts space tokens |
| `align-self` | Controls the align-self property. Supports all valid CSS align-self values |
| `justify-self` | Controls the justify-self property. Supports all valid CSS justify-self values |
| `place-self` | Controls the place-self property. Supports all valid CSS place-self values |
| `grid-column` | Controls the grid-column property. Supports all valid CSS grid-column values |
| `grid-row` | Controls the grid-row property. Supports all valid CSS grid-row values |
| `grid-area` | Controls the grid-area property. Supports all valid CSS grid-area values |
| `flex` | Controls the flex property. Supports all valid CSS flex values |
| `order` | Controls the order property. Supports all valid CSS order values |

### GdsContextMenu - Events

| Event | Description |
|-------|-------------|
| `gds-menu-item-click` | Fired when a menu item is clicked |
| `gds-ui-state` | Fired when the menu is opened or closed |
| `gds-element-disconnected` | When element is disconnected from DOM |

### GdsContextMenu - Slots

| Slot | Description |
|------|-------------|
| (default) | Menu items and headings |
| `trigger` | Custom trigger element (should be focusable, preferably GdsButton) |
| `icon` | Custom icon for default trigger button |

### GdsMenuItem - Public API

GdsMenuItem is a simple wrapper component for menu items.

**Events:**
- `click` - Standard click event
- `gds-element-disconnected` - When element is disconnected

**Properties:**
- `onblur` - Blur event handler
- `onfocus` - Focus event handler

**Content:** Accepts any HTML content as children

## Features

### Placement Options

The context menu supports all Floating UI placement options:

```tsx
// Primary placements
<GdsContextMenu placement="top">...</GdsContextMenu>
<GdsContextMenu placement="bottom">...</GdsContextMenu>
<GdsContextMenu placement="left">...</GdsContextMenu>
<GdsContextMenu placement="right">...</GdsContextMenu>

// Start-aligned
<GdsContextMenu placement="top-start">...</GdsContextMenu>
<GdsContextMenu placement="bottom-start">...</GdsContextMenu>

// End-aligned
<GdsContextMenu placement="top-end">...</GdsContextMenu>
<GdsContextMenu placement="bottom-end">...</GdsContextMenu>
```

### Custom Trigger

Replace the default button with a custom trigger:

```tsx
import { GdsButton } from '@sebgroup/green-core/react'
import { IconDotGridOneHorizontal } from '@sebgroup/green-core/react'

<GdsContextMenu label="Actions menu">
  <GdsButton slot="trigger" rank="tertiary">
    Custom trigger
    <IconDotGridOneHorizontal slot="trail" />
  </GdsButton>
  
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
  <GdsMenuItem>Action 3</GdsMenuItem>
</GdsContextMenu>
```

### Show Label

Display the label text on the trigger button:

```tsx
<GdsContextMenu 
  label="Select an action" 
  button-label="Menu" 
  show-label={true}
>
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
  <GdsMenuItem>Action 3</GdsMenuItem>
</GdsContextMenu>
```

### Custom Icon

Provide a custom icon for the default trigger:

```tsx
import { IconArrowUp } from '@sebgroup/green-core/react'

<GdsContextMenu label="Actions" button-label="Options">
  <IconArrowUp slot="icon" />
  
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
  <GdsMenuItem>Action 3</GdsMenuItem>
</GdsContextMenu>
```

### Menu Headings

Organize menu items with headings using GdsMenuHeading:

```tsx
<GdsContextMenu label="File operations" button-label="File">
  <GdsMenuHeading>Recent Files</GdsMenuHeading>
  <GdsMenuItem>Document 1.pdf</GdsMenuItem>
  <GdsMenuItem>Report 2023.xlsx</GdsMenuItem>
  
  <GdsMenuHeading>Actions</GdsMenuHeading>
  <GdsMenuItem>New File</GdsMenuItem>
  <GdsMenuItem>Open File</GdsMenuItem>
  <GdsMenuItem>Save As</GdsMenuItem>
</GdsContextMenu>
```

### Custom Content in Menu Items

Menu items can contain custom markup:

```tsx
import { IconDelete } from '@sebgroup/green-core/react'

<GdsContextMenu label="Item actions" button-label="Actions">
  <GdsMenuItem>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <strong>Edit</strong>
      <em>Ctrl+E</em>
    </div>
  </GdsMenuItem>
  
  <GdsMenuItem>
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      width: '100%',
      color: 'var(--intent-danger-background)'
    }}>
      <span>Delete</span>
      <IconDelete />
    </div>
  </GdsMenuItem>
</GdsContextMenu>
```

## Usage Examples

### Table Row Actions

```tsx
import { GdsContextMenu, GdsMenuItem } from '@sebgroup/green-core/react'
import { IconEdit, IconDelete, IconDownload } from '@sebgroup/green-core/react'

const TableRow = ({ item }) => {
  const handleEdit = () => {
    console.log('Edit:', item.id)
  }
  
  const handleDelete = () => {
    if (confirm('Delete this item?')) {
      console.log('Delete:', item.id)
    }
  }
  
  const handleDownload = () => {
    console.log('Download:', item.id)
  }

  return (
    <tr>
      <td>{item.name}</td>
      <td>{item.status}</td>
      <td>
        <GdsContextMenu 
          label={`Actions for ${item.name}`}
          button-label="Actions"
        >
          <GdsMenuItem onClick={handleEdit}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <IconEdit />
              Edit
            </div>
          </GdsMenuItem>
          
          <GdsMenuItem onClick={handleDownload}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <IconDownload />
              Download
            </div>
          </GdsMenuItem>
          
          <GdsMenuItem onClick={handleDelete}>
            <div style={{ 
              display: 'flex', 
              gap: '8px', 
              alignItems: 'center',
              color: 'var(--intent-danger-background)'
            }}>
              <IconDelete />
              Delete
            </div>
          </GdsMenuItem>
        </GdsContextMenu>
      </td>
    </tr>
  )
}
```

### Grouped Actions

```tsx
import { GdsContextMenu, GdsMenuItem, GdsMenuHeading } from '@sebgroup/green-core/react'
import { IconCopy, IconCut, IconPaste, IconUndo, IconRedo } from '@sebgroup/green-core/react'

const EditorContextMenu = () => {
  return (
    <GdsContextMenu 
      label="Edit actions" 
      button-label="Edit"
      show-label={true}
    >
      <GdsMenuHeading>Clipboard</GdsMenuHeading>
      <GdsMenuItem>
        <IconCut slot="lead" />
        Cut
        <span slot="trail" style={{ fontSize: '0.875em', opacity: 0.7 }}>Ctrl+X</span>
      </GdsMenuItem>
      <GdsMenuItem>
        <IconCopy slot="lead" />
        Copy
        <span slot="trail" style={{ fontSize: '0.875em', opacity: 0.7 }}>Ctrl+C</span>
      </GdsMenuItem>
      <GdsMenuItem>
        <IconPaste slot="lead" />
        Paste
        <span slot="trail" style={{ fontSize: '0.875em', opacity: 0.7 }}>Ctrl+V</span>
      </GdsMenuItem>
      
      <GdsMenuHeading>History</GdsMenuHeading>
      <GdsMenuItem>
        <IconUndo slot="lead" />
        Undo
        <span slot="trail" style={{ fontSize: '0.875em', opacity: 0.7 }}>Ctrl+Z</span>
      </GdsMenuItem>
      <GdsMenuItem>
        <IconRedo slot="lead" />
        Redo
        <span slot="trail" style={{ fontSize: '0.875em', opacity: 0.7 }}>Ctrl+Y</span>
      </GdsMenuItem>
    </GdsContextMenu>
  )
}
```

### User Profile Menu

```tsx
import { GdsContextMenu, GdsMenuItem, GdsMenuHeading } from '@sebgroup/green-core/react'
import { IconUser, IconSettings, IconLogout } from '@sebgroup/green-core/react'

const ProfileMenu = ({ user }) => {
  const handleProfile = () => {
    navigate('/profile')
  }
  
  const handleSettings = () => {
    navigate('/settings')
  }
  
  const handleLogout = () => {
    logout()
  }

  return (
    <GdsContextMenu 
      label="User menu" 
      button-label={user.name}
      show-label={true}
      placement="bottom-end"
    >
      <GdsMenuHeading>Account</GdsMenuHeading>
      <GdsMenuItem onClick={handleProfile}>
        <IconUser />
        View Profile
      </GdsMenuItem>
      <GdsMenuItem onClick={handleSettings}>
        <IconSettings />
        Settings
      </GdsMenuItem>
      
      <GdsMenuHeading>Session</GdsMenuHeading>
      <GdsMenuItem onClick={handleLogout}>
        <IconLogout />
        Logout
      </GdsMenuItem>
    </GdsContextMenu>
  )
}
```

### Card Actions Menu

```tsx
import { GdsCard, GdsContextMenu, GdsMenuItem, GdsFlex, GdsText } from '@sebgroup/green-core/react'
import { IconShare, IconBookmark, IconFlag } from '@sebgroup/green-core/react'

const ArticleCard = ({ article }) => {
  return (
    <GdsCard padding="m">
      <GdsFlex justify-content="space-between" align-items="flex-start">
        <div>
          <GdsText tag="h3">{article.title}</GdsText>
          <GdsText>{article.excerpt}</GdsText>
        </div>
        
        <GdsContextMenu 
          label={`Actions for ${article.title}`}
          button-label="More"
        >
          <GdsMenuItem onClick={() => shareArticle(article.id)}>
            <IconShare />
            Share
          </GdsMenuItem>
          <GdsMenuItem onClick={() => bookmarkArticle(article.id)}>
            <IconBookmark />
            Save for later
          </GdsMenuItem>
          <GdsMenuItem onClick={() => reportArticle(article.id)}>
            <IconFlag />
            Report
          </GdsMenuItem>
        </GdsContextMenu>
      </GdsFlex>
    </GdsCard>
  )
}
```

### Contextual Actions with State

```tsx
import { useState } from 'react'
import { GdsContextMenu, GdsMenuItem, GdsMenuHeading } from '@sebgroup/green-core/react'
import { IconCheck } from '@sebgroup/green-core/react'

const FilterMenu = () => {
  const [sortBy, setSortBy] = useState('date')
  const [viewMode, setViewMode] = useState('grid')

  return (
    <GdsContextMenu 
      label="View options" 
      button-label="View"
      show-label={true}
    >
      <GdsMenuHeading>Sort By</GdsMenuHeading>
      <GdsMenuItem onClick={() => setSortBy('date')}>
        {sortBy === 'date' && <IconCheck />}
        Date
      </GdsMenuItem>
      <GdsMenuItem onClick={() => setSortBy('name')}>
        {sortBy === 'name' && <IconCheck />}
        Name
      </GdsMenuItem>
      <GdsMenuItem onClick={() => setSortBy('size')}>
        {sortBy === 'size' && <IconCheck />}
        Size
      </GdsMenuItem>
      
      <GdsMenuHeading>View Mode</GdsMenuHeading>
      <GdsMenuItem onClick={() => setViewMode('grid')}>
        {viewMode === 'grid' && <IconCheck />}
        Grid
      </GdsMenuItem>
      <GdsMenuItem onClick={() => setViewMode('list')}>
        {viewMode === 'list' && <IconCheck />}
        List
      </GdsMenuItem>
    </GdsContextMenu>
  )
}
```

### Dropdown Menu in Form

```tsx
import { GdsContextMenu, GdsMenuItem, GdsButton } from '@sebgreen/green-core/react'

const ActionDropdown = ({ onAction }) => {
  return (
    <GdsContextMenu 
      label="Select bulk action" 
      button-label="Bulk Actions"
      show-label={true}
      placement="bottom-start"
      onGdsMenuItemClick={(e) => {
        const action = e.detail.getAttribute('data-action')
        onAction(action)
      }}
    >
      <GdsMenuItem data-action="approve">Approve Selected</GdsMenuItem>
      <GdsMenuItem data-action="reject">Reject Selected</GdsMenuItem>
      <GdsMenuItem data-action="export">Export Selected</GdsMenuItem>
      <GdsMenuItem 
        data-action="delete"
        style={{ color: 'var(--intent-danger-background)' }}
      >
        Delete Selected
      </GdsMenuItem>
    </GdsContextMenu>
  )
}
```

## Best Practices

### ✅ DO

- **Always provide label**: Set descriptive `label` attribute for accessibility
- **Provide button-label**: Always set `button-label` for screen readers
- **Use semantic actions**: Make menu items clearly actionable
- **Consider placement**: Choose appropriate placement to avoid viewport edges
- **Use icons consistently**: Add icons to all items or none for visual consistency
- **Group related actions**: Use GdsMenuHeading to organize menu items

### Destructive items

- Mark destructive actions visually and semantically. Use a clear visual treatment (intent-danger color tokens) and include explicit wording (e.g., `Delete`, `Remove`). Provide a confirmation step when the action is destructive.
- For screen readers, ensure destructive items are still announced as normal menu items; avoid relying solely on color to communicate danger. Use clear labels and, where appropriate, add `aria-describedby` that points to a short confirmation hint.

```tsx
// ✅ Good: Descriptive labels and grouped actions
<GdsContextMenu 
  label="Actions for document.pdf" 
  button-label="Document actions"
>
  <GdsMenuHeading>File Operations</GdsMenuHeading>
  <GdsMenuItem>Download</GdsMenuItem>
  <GdsMenuItem>Share</GdsMenuItem>
  
  <GdsMenuHeading>Manage</GdsMenuHeading>
  <GdsMenuItem>Rename</GdsMenuItem>
  <GdsMenuItem>Delete</GdsMenuItem>
</GdsContextMenu>
```

### ❌ DON'T

- **Don't omit labels**: Always provide `label` and `button-label` attributes
- **Don't overload menus**: Keep menu items focused and under 10 items
- **Don't use for navigation**: Use navigation components for primary navigation
- **Don't mix custom triggers without testing**: Ensure custom triggers are focusable

- **Don't use for a single menu item**: If there is only one action, place it directly in the UI where it is discoverable rather than hiding it in a context menu.

```tsx
// ❌ Bad: No labels, too many items, unclear actions
<GdsContextMenu>
  <GdsMenuItem>Item 1</GdsMenuItem>
  <GdsMenuItem>Item 2</GdsMenuItem>
  {/* ... 15 more items ... */}
</GdsContextMenu>

// ✅ Good: Clear labels, focused actions
<GdsContextMenu label="Quick actions" button-label="Actions">
  <GdsMenuItem>Edit</GdsMenuItem>
  <GdsMenuItem>Delete</GdsMenuItem>
</GdsContextMenu>
```

## Common Patterns

### More Options Button

```tsx
<GdsContextMenu 
  label="Additional options" 
  button-label="More options"
>
  <GdsMenuItem>Option 1</GdsMenuItem>
  <GdsMenuItem>Option 2</GdsMenuItem>
  <GdsMenuItem>Option 3</GdsMenuItem>
</GdsContextMenu>
```

### Inline Actions

```tsx
<GdsFlex align-items="center" gap="m">
  <GdsText>Item Name</GdsText>
  <GdsContextMenu 
    label="Item actions" 
    button-label="Actions"
    placement="bottom-end"
  >
    <GdsMenuItem>Edit</GdsMenuItem>
    <GdsMenuItem>Duplicate</GdsMenuItem>
    <GdsMenuItem>Delete</GdsMenuItem>
  </GdsContextMenu>
</GdsFlex>
```

### Controlled Open State

```tsx
const [isOpen, setIsOpen] = useState(false)

<GdsContextMenu 
  label="Actions" 
  button-label="Actions"
  open={isOpen}
  onGdsUiState={(e) => setIsOpen(e.detail.open)}
>
  <GdsMenuItem>Action 1</GdsMenuItem>
  <GdsMenuItem>Action 2</GdsMenuItem>
</GdsContextMenu>
```

## TypeScript Types

```typescript
import type { Placement } from '@floating-ui/dom'

interface GdsContextMenuProps {
  // Attributes
  open?: boolean
  label?: string
  placement?: Placement
  'button-label'?: string
  'show-label'?: boolean
  
  // Properties
  buttonLabel?: string
  showLabel?: boolean
  
  // Events
  onGdsMenuItemClick?: (event: CustomEvent) => void
  onGdsUiState?: (event: CustomEvent<{ open: boolean }>) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void
  
  // Standard props
  children?: React.ReactNode
  ref?: React.Ref<any>
}

interface GdsMenuItemProps {
  // Events
  onClick?: (event: MouseEvent) => void
  onBlur?: (event: FocusEvent) => void
  onFocus?: (event: FocusEvent) => void
  
  // Data attributes
  [key: `data-${string}`]: string
  
  // Standard props
  children?: React.ReactNode
  style?: React.CSSProperties
}

interface GdsMenuHeadingProps {
  children?: React.ReactNode
}
```

## Related Components

- [GdsPopover](./GdsPopover.md) — For non-menu popovers
- [GdsDropdown](./GdsDropdown.md) — For form select dropdowns
- [GdsButton](./GdsButton.md) — For custom triggers
- [GdsFab](./GdsFab.md) — For floating action buttons with context menus
- [Icons](./Icons.md) — For menu item icons
- [GdsCard](./GdsCard.md) — For card-based layouts with context menus
- [GdsFlex](./GdsFlex.md) — For menu item layout

## Accessibility

- **ARIA Labels**: Always provide `label` and `button-label` attributes
- **Keyboard Navigation**: 
  - Tab/Shift+Tab to navigate to trigger
  - Enter/Space to open menu
  - Arrow keys to navigate menu items
  - Enter/Space to activate menu item
  - Escape to close menu
- **Focus Management**: Focus returns to trigger when menu closes
- **Screen Readers**: Menu structure and state announced correctly
- **Custom Triggers**: ARIA attributes automatically applied to custom triggers

## References

- [Green Core Context Menu Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-context-menu--docs)
- [Floating UI Placement](https://floating-ui.com/docs/computePosition#placement)
- [Icons Documentation](./Icons.md)
