# GdsPopover

A temporary view that appears above other content, triggered by user interaction. GdsPopover provides flexible positioning, customizable behavior, and built-in accessibility features for displaying menus, dropdowns, tooltips, and other overlay content.

> **Related tokens & styles**: See [Shadows](./Shadows.md), [Viewport](./Viewport.md), [Motion](./Motion.md), and [Accessibility](./Accessibility.md)

## Import

```typescript
import { GdsPopover, applyTriggerAriaAttributes } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
import { GdsPopover, GdsTheme, GdsButton, IconChevronBottom } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsPopover>
    <GdsButton rank="secondary" slot="trigger">
      Show popover <IconChevronBottom slot="trail" />
    </GdsButton>
    <div style={{ padding: '1rem', paddingTop: 0 }}>
      <h3>This is a custom popover!</h3>
      <p>It can contain any content you need, including other components.</p>
      <GdsButton rank="primary">Such as buttons!</GdsButton>
    </div>
  </GdsPopover>
</GdsTheme>
```

## Public API

### Attributes

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `placement` | `Placement` | `'bottom-start'` | The placement of the popover relative to the trigger. Accepts any placements supported by Floating UI (e.g., 'bottom-center', 'top-start', 'right', etc.). |
| `open` | `boolean` | `false` | Whether the popover is open. |
| `label` | `string` | `undefined` | Optional label for the popover (accessibility). |
| `disableMobileStyles` | `boolean` | `false` | Whether to use a modal dialog in mobile viewport. |
| `autofocus` | `boolean` | `false` | Whether the popover should autofocus the first slotted child when opened. |
| `nonmodal` | `boolean` | `false` | Whether the popover is nonmodal. When true, the popover will not trap focus and other elements on the page will still be interactable while the popover is open. |
| `backdrop` | `string` | `undefined` | When set to true, the :backdrop pseudo-element will be visible if the popover is in modal mode. When not in modal mode (using nonmodal attribute), this can be set to a selector matching a `<GdsBackdrop>` element, which the popover will control. Example: `backdrop=".my-backdrop"` |
| `popup-role` | `'menu' \| 'listbox' \| 'tree' \| 'grid' \| 'dialog'` | `'dialog'` | Indicates the semantic role of the popover. Sets the aria-haspopup attribute on the trigger element. |
| `gds-element` | `string` | `undefined` | The unscoped element name (read-only, set automatically) |

### Properties

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `calcMaxWidth` | `() => string` | — | A callback that returns the maximum width of the popover. By default, the popover maxWidth will be set to auto and will grow as needed. |
| `DefaultMiddleware` | `Middleware[]` | `[offset(8), shift({ crossAxis: true, padding: 8 })]` | The default set of middleware for Floating UI positioning used by GdsPopover. |
| `popupRole` | `'menu' \| 'listbox' \| 'tree' \| 'grid' \| 'dialog'` | `'dialog'` | Semantic role of the popover. Sets aria-haspopup attribute on trigger element. |
| `triggerRef` | `Promise<HTMLElement> \| undefined` | `undefined` | Optional way to assign a trigger element for the popover programmatically. When using Lit, this can take a value from a @queryAsync decorator. |
| `anchorRef` | `Promise<HTMLElement> \| undefined` | `undefined` | Optional way to assign an anchor element for the popover programmatically. When using Lit, this can take a value from a @queryAsync decorator. |
| `calcMinWidth` | `() => string` | — | A callback that returns the minimum width of the popover. By default, the popover minWidth will be as wide as the trigger element. |
| `calcMinHeight` | `() => string` | — | A callback that returns the minimum height of the popover. By default, the popover minHeight will be set to auto. |
| `calcMaxHeight` | `() => string` | — | A callback that returns the maximum height of the popover. By default, the popover maxHeight will be set to a hard coded pixel value. |
| `floatingUIMiddleware` | `Middleware[]` | `[offset(8), flip()]` | An array of middleware for the Floating UI positioning algorithm. Pass an array of middleware to customize positioning. This array is passed directly to Floating UI. See [Floating UI middleware documentation](https://floating-ui.com/docs/middleware). |
| `isDefined` | `boolean` | `false` | Whether element is defined in custom element registry (read-only) |
| `styleExpressionBaseSelector` | `string` | `':host'` | Base selector for style expression properties (read-only) |
| `semanticVersion` | `string` | `'__GDS_SEM_VER__'` | Semantic version of this element (read-only) |
| `gdsElementName` | `string` | `undefined` | Unscoped name of this element (read-only) |

### Events

| Name | Type | Description |
|------|------|-------------|
| `gds-ui-state` | `CustomEvent<{ open: boolean, reason: 'show' \| 'close' \| 'cancel' }>` | Fired when the popover is opened or closed. Can be cancelled to prevent the popover from opening or closing. The detail object contains the `open` boolean to indicate the result of the state change, and the `reason` string which can be one of 'show', 'close', or 'cancel'. |
| `gds-element-disconnected` | `CustomEvent` | Fired when the element is disconnected from DOM |

### Slots

| Name | Description |
|------|-------------|
| `trigger` | Trigger element for the popover. If this slot is occupied, the popover will listen to keydown and click events on the trigger and automatically open when clicked or when the trigger is focused and ArrowDown is pressed. |
| (default) | Content to display inside the popover |

### Helper Function

#### applyTriggerAriaAttributes

```typescript
import { applyTriggerAriaAttributes } from '@sebgroup/green-core/react'
```

A helper function to apply proper ARIA attributes to trigger elements for accessibility.

## Examples

### Basic Popover

```tsx
import { GdsPopover, GdsTheme, GdsButton, IconChevronBottom } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsPopover>
    <GdsButton rank="secondary" slot="trigger">
      Show popover <IconChevronBottom slot="trail" />
    </GdsButton>
    <div style={{ padding: '1rem', paddingTop: 0 }}>
      <h3>This is a custom popover!</h3>
      <p>It can contain any content you need, including other components.</p>
      <GdsButton rank="primary">Such as buttons!</GdsButton>
    </div>
  </GdsPopover>
</GdsTheme>
```

### Custom Closing Behavior

By default, the popover will close when clicking outside or hitting the escape key. This behavior can be customized by listening to the `gds-ui-state` event and calling `preventDefault()`:

```tsx
import { GdsPopover, GdsTheme, GdsButton, IconChevronBottom } from '@sebgroup/green-core/react'

function CustomClosingPopover() {
  const handleStateChange = (e: CustomEvent<{ open: boolean, reason: string }>) => {
    // Prevent closing when clicking outside (only allow escape or explicit button click)
    if (e.detail.reason === 'close') {
      e.preventDefault()
    }
  }

  return (
    <GdsTheme>
      <GdsPopover onGdsUiState={handleStateChange}>
        <GdsButton rank="secondary" slot="trigger">
          Show popover <IconChevronBottom slot="trail" />
        </GdsButton>
        <div style={{ padding: '1rem', paddingTop: 0 }}>
          <h3>Customized closing behavior</h3>
          <p>
            This popover can only be closed by clicking the button below or hitting escape.
          </p>
          <GdsButton rank="primary">Close me!</GdsButton>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

State change reasons:
- `'show'` — The popover is being opened by the user by clicking the trigger
- `'close'` — The popover is being closed by the user by clicking outside
- `'cancel'` — The popover is being closed by the user by hitting the escape key

### Different Placements

```tsx
import { GdsPopover, GdsTheme, GdsFlex, GdsButton } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsFlex gap="m" flex-wrap="wrap">
    <GdsPopover placement="top">
      <GdsButton slot="trigger">Top</GdsButton>
      <div style={{ padding: '1rem' }}>Top placement</div>
    </GdsPopover>
    
    <GdsPopover placement="bottom">
      <GdsButton slot="trigger">Bottom</GdsButton>
      <div style={{ padding: '1rem' }}>Bottom placement</div>
    </GdsPopover>
    
    <GdsPopover placement="left">
      <GdsButton slot="trigger">Left</GdsButton>
      <div style={{ padding: '1rem' }}>Left placement</div>
    </GdsPopover>
    
    <GdsPopover placement="right">
      <GdsButton slot="trigger">Right</GdsButton>
      <div style={{ padding: '1rem' }}>Right placement</div>
    </GdsPopover>
    
    <GdsPopover placement="bottom-start">
      <GdsButton slot="trigger">Bottom Start</GdsButton>
      <div style={{ padding: '1rem' }}>Bottom start placement</div>
    </GdsPopover>
    
    <GdsPopover placement="bottom-center">
      <GdsButton slot="trigger">Bottom Center</GdsButton>
      <div style={{ padding: '1rem' }}>Bottom center placement</div>
    </GdsPopover>
  </GdsFlex>
</GdsTheme>
```

### With Custom Backdrop

```tsx
import { GdsPopover, GdsTheme, GdsMenuButton, GdsBackdrop, IconChevronBottom } from '@sebgroup/green-core/react'

<GdsTheme>
  <div>
    <GdsPopover nonmodal backdrop=".my-backdrop">
      <GdsMenuButton slot="trigger">
        <IconChevronBottom slot="trail" />
        With custom backdrop
      </GdsMenuButton>
      <div style={{ padding: '0 1rem' }}>
        <h3>Customized popover</h3>
        <p>
          In this popover, we're using custom Floating UI middleware to control 
          the positioning, and calcMaxWidth to set the size.
        </p>
        <p>
          We're also using a backdrop element, referenced by the backdrop attribute, 
          to dim the background.
        </p>
      </div>
    </GdsPopover>
    
    <GdsBackdrop className="my-backdrop" />
  </div>
</GdsTheme>
```

### Nonmodal Popover

Nonmodal popovers don't trap focus and allow interaction with other page elements:

```tsx
import { GdsPopover, GdsTheme, GdsButton } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsPopover nonmodal>
    <GdsButton slot="trigger">Show nonmodal popover</GdsButton>
    <div style={{ padding: '1rem' }}>
      <h3>Nonmodal Popover</h3>
      <p>You can interact with other elements while this is open.</p>
    </div>
  </GdsPopover>
</GdsTheme>
```

### With Autofocus

```tsx
import { GdsPopover, GdsTheme, GdsButton, GdsInput } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsPopover autofocus>
    <GdsButton slot="trigger">Open form</GdsButton>
    <div style={{ padding: '1rem' }}>
      <GdsInput label="Name" autofocus />
      <GdsButton margin-top="m">Submit</GdsButton>
    </div>
  </GdsPopover>
</GdsTheme>
```

### Menu Popover

```tsx
import { GdsPopover, GdsTheme, GdsButton, GdsMenuItem } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsPopover popup-role="menu">
    <GdsButton slot="trigger">Open menu</GdsButton>
    <div>
      <GdsMenuItem>Option 1</GdsMenuItem>
      <GdsMenuItem>Option 2</GdsMenuItem>
      <GdsMenuItem>Option 3</GdsMenuItem>
    </div>
  </GdsPopover>
</GdsTheme>
```

### Controlled Popover

```tsx
import { GdsPopover, GdsTheme, GdsButton } from '@sebgroup/green-core/react'
import { useState } from 'react'

function ControlledPopover() {
  const [open, setOpen] = useState(false)

  return (
    <GdsTheme>
      <GdsFlex gap="m">
        <GdsButton onClick={() => setOpen(true)}>
          Open programmatically
        </GdsButton>
        
        <GdsPopover open={open} onGdsUiState={() => setOpen(false)}>
          <GdsButton slot="trigger">Toggle popover</GdsButton>
          <div style={{ padding: '1rem' }}>
            <h3>Controlled Popover</h3>
            <p>This popover's state is controlled by React state.</p>
            <GdsButton onClick={() => setOpen(false)}>Close</GdsButton>
          </div>
        </GdsPopover>
      </GdsFlex>
    </GdsTheme>
  )
}
```

### Custom Sizing

```tsx
import { GdsPopover, GdsTheme, GdsButton } from '@sebgroup/green-core/react'

function CustomSizedPopover() {
  return (
    <GdsTheme>
      <GdsPopover
        calcMaxWidth={() => '400px'}
        calcMinHeight={() => '200px'}
      >
        <GdsButton slot="trigger">Show custom sized</GdsButton>
        <div style={{ padding: '1rem' }}>
          <h3>Custom Sizing</h3>
          <p>This popover has custom width and height constraints.</p>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

### With Floating UI Middleware

```tsx
import { GdsPopover, GdsTheme, GdsButton } from '@sebgroup/green-core/react'
import { offset, flip, shift, autoPlacement } from '@floating-ui/dom'

function CustomPositionedPopover() {
  const customMiddleware = [
    offset(16),
    flip(),
    shift({ padding: 16 }),
    autoPlacement()
  ]

  return (
    <GdsTheme>
      <GdsPopover floatingUIMiddleware={customMiddleware}>
        <GdsButton slot="trigger">Custom positioning</GdsButton>
        <div style={{ padding: '1rem' }}>
          <h3>Custom Positioning</h3>
          <p>This popover uses custom Floating UI middleware for positioning.</p>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

## TypeScript

```typescript
import type { GdsPopoverProps, Placement } from '@sebgroup/green-core/react'
import type { Middleware } from '@floating-ui/dom'

interface GdsPopoverProps {
  // Attributes
  placement?: Placement
  open?: boolean
  label?: string
  disableMobileStyles?: boolean
  autofocus?: boolean
  nonmodal?: boolean
  backdrop?: string
  'popup-role'?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'
  'gds-element'?: string

  // Properties
  calcMaxWidth?: () => string
  calcMinWidth?: () => string
  calcMinHeight?: () => string
  calcMaxHeight?: () => string
  floatingUIMiddleware?: Middleware[]
  triggerRef?: Promise<HTMLElement> | undefined
  anchorRef?: Promise<HTMLElement> | undefined
  popupRole?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'

  // Events
  onGdsUiState?: (event: CustomEvent<{ open: boolean, reason: 'show' | 'close' | 'cancel' }>) => void
  onGdsElementDisconnected?: (event: CustomEvent) => void

  // Children
  children?: React.ReactNode
}

// Helper function type
type ApplyTriggerAriaAttributes = (
  trigger: HTMLElement,
  popover: HTMLElement
) => void

// Usage example
const popoverProps: GdsPopoverProps = {
  placement: 'bottom-center',
  autofocus: true,
  'popup-role': 'menu'
}
```

## Best Practices

### Placement

1. **Choose Appropriate Placement**: Select placement based on available screen space:
   ```tsx
   // ✅ Good - considers layout
   <GdsPopover placement="bottom-start">...</GdsPopover>
   
   // ⚠️ May cause issues - fixed placement without considering space
   <GdsPopover placement="top">...</GdsPopover>
   ```

2. **Use Floating UI Middleware**: Let Floating UI handle positioning automatically:
   ```tsx
   // ✅ Good - uses flip middleware (default)
   <GdsPopover>...</GdsPopover>
   ```

### Accessibility

1. **Always Provide Trigger**: Use the trigger slot for accessible interaction:
   ```tsx
   // ✅ Good - clear trigger
   <GdsPopover>
     <GdsButton slot="trigger">Open menu</GdsButton>
     {/* content */}
   </GdsPopover>
   
   // ❌ Bad - no trigger
   <GdsPopover open={true}>{/* content */}</GdsPopover>
   ```

2. **Set Appropriate popup-role**: Use correct ARIA role for semantic meaning:
   ```tsx
   // ✅ Good - menu role for menu content
   <GdsPopover popup-role="menu">
     <GdsButton slot="trigger">Menu</GdsButton>
     <GdsMenuItem>...</GdsMenuItem>
   </GdsPopover>
   
   // ✅ Good - dialog role for general content (default)
   <GdsPopover popup-role="dialog">...</GdsPopover>
   ```

3. **Use Autofocus for Forms**: Enable autofocus when popover contains forms:
   ```tsx
   // ✅ Good - autofocus for form
   <GdsPopover autofocus>
     <GdsButton slot="trigger">Edit</GdsButton>
     <GdsInput label="Name" />
   </GdsPopover>
   ```

### Modal vs Nonmodal

1. **Modal (Default)**: Use for important interactions that require focus:
   ```tsx
   // ✅ Good - modal for critical actions
   <GdsPopover>
     <GdsButton slot="trigger">Delete account</GdsButton>
     <p>Are you sure?</p>
     <GdsButton rank="negative">Delete</GdsButton>
   </GdsPopover>
   ```

2. **Nonmodal**: Use when users should interact with other elements:
   ```tsx
   // ✅ Good - nonmodal for tooltips or persistent info
   <GdsPopover nonmodal>
     <GdsButton slot="trigger">Info</GdsButton>
     <p>Additional information that doesn't block interaction</p>
   </GdsPopover>
   ```

### Event Handling

1. **Prevent Default Closing**: Customize closing behavior when needed:
   ```tsx
   // ✅ Good - prevent closing on outside click
   const handleStateChange = (e: CustomEvent) => {
     if (e.detail.reason === 'close') {
       e.preventDefault()
     }
   }
   
   <GdsPopover onGdsUiState={handleStateChange}>...</GdsPopover>
   ```

2. **State Change Reasons**: Use reason to determine appropriate action:
   ```tsx
   // ✅ Good - different handling for different reasons
   const handleStateChange = (e: CustomEvent) => {
     if (e.detail.reason === 'show') {
       trackPopoverOpen()
     } else if (e.detail.reason === 'cancel') {
       // User hit escape - allow closing
     }
   }
   ```

### Sizing

1. **Use Callbacks for Dynamic Sizing**: Provide sizing callbacks for responsive behavior:
   ```tsx
   // ✅ Good - dynamic max width
   <GdsPopover calcMaxWidth={() => '90vw'}>...</GdsPopover>
   ```

2. **Match Trigger Width**: Default behavior matches trigger width - override when needed:
   ```tsx
   // ✅ Good - wider than trigger
   <GdsPopover calcMinWidth={() => '300px'}>...</GdsPopover>
   ```

### Backdrop

1. **Use for Modal Emphasis**: Add backdrop to draw attention to modal popovers:
   ```tsx
   // ✅ Good - backdrop for modal
   <GdsPopover backdrop="true">...</GdsPopover>
   ```

2. **Custom Backdrop for Nonmodal**: Use custom backdrop element for nonmodal:
   ```tsx
   // ✅ Good - custom backdrop for nonmodal
   <GdsPopover nonmodal backdrop=".my-backdrop">...</GdsPopover>
   <GdsBackdrop className="my-backdrop" />
   ```

### Performance

1. **Lazy Load Content**: Load popover content only when needed:
   ```tsx
   // ✅ Good - conditional content
   {open && <GdsPopover open>...</GdsPopover>}
   ```

2. **Avoid Heavy Content**: Keep popover content lightweight for better performance

## Common Use Cases

### Dropdown Menu

```tsx
import { GdsPopover, GdsTheme, GdsButton, GdsMenuItem, IconChevronBottom } from '@sebgroup/green-core/react'

function DropdownMenu() {
  return (
    <GdsTheme>
      <GdsPopover popup-role="menu" placement="bottom-start">
        <GdsButton rank="secondary" slot="trigger">
          Actions <IconChevronBottom slot="trail" />
        </GdsButton>
        <div>
          <GdsMenuItem>Edit</GdsMenuItem>
          <GdsMenuItem>Duplicate</GdsMenuItem>
          <GdsMenuItem>Delete</GdsMenuItem>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

### Confirmation Dialog

```tsx
import { GdsPopover, GdsTheme, GdsButton, GdsFlex } from '@sebgroup/green-core/react'

function ConfirmationDialog() {
  const [open, setOpen] = useState(false)

  const handleConfirm = () => {
    // Perform action
    setOpen(false)
  }

  return (
    <GdsTheme>
      <GdsPopover 
        open={open} 
        onGdsUiState={(e) => e.detail.reason === 'close' && e.preventDefault()}
      >
        <GdsButton rank="negative" slot="trigger" onClick={() => setOpen(true)}>
          Delete
        </GdsButton>
        <div style={{ padding: '1rem' }}>
          <h3>Confirm Deletion</h3>
          <p>Are you sure you want to delete this item?</p>
          <GdsFlex gap="s" margin-top="m">
            <GdsButton rank="negative" onClick={handleConfirm}>
              Delete
            </GdsButton>
            <GdsButton rank="secondary" onClick={() => setOpen(false)}>
              Cancel
            </GdsButton>
          </GdsFlex>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

### Form Popover

```tsx
import { GdsPopover, GdsTheme, GdsButton, GdsInput, GdsFlex } from '@sebgroup/green-core/react'
import { useState } from 'react'

function FormPopover() {
  const [name, setName] = useState('')

  const handleSubmit = () => {
    console.log('Submitted:', name)
  }

  return (
    <GdsTheme>
      <GdsPopover autofocus>
        <GdsButton slot="trigger">Edit Name</GdsButton>
        <div style={{ padding: '1rem' }}>
          <GdsInput 
            label="Name" 
            value={name}
            onChange={(e) => setName(e.detail.value)}
          />
          <GdsFlex gap="s" margin-top="m">
            <GdsButton rank="primary" onClick={handleSubmit}>
              Save
            </GdsButton>
            <GdsButton rank="secondary">Cancel</GdsButton>
          </GdsFlex>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

### Navigation Menu with Backdrop

```tsx
import { GdsPopover, GdsTheme, GdsMenuButton, GdsBackdrop, IconChevronBottom } from '@sebgroup/green-core/react'

function NavigationMenu() {
  return (
    <GdsTheme>
      <div>
        <GdsPopover nonmodal backdrop=".nav-backdrop" placement="bottom-start">
          <GdsMenuButton slot="trigger">
            <IconChevronBottom slot="trail" />
            Navigation
          </GdsMenuButton>
          <div style={{ padding: '1rem' }}>
            <GdsMenuItem href="/home">Home</GdsMenuItem>
            <GdsMenuItem href="/about">About</GdsMenuItem>
            <GdsMenuItem href="/contact">Contact</GdsMenuItem>
          </div>
        </GdsPopover>
        
        <GdsBackdrop className="nav-backdrop" />
      </div>
    </GdsTheme>
  )
}
```

### Tooltip-like Popover

```tsx
import { GdsPopover, GdsTheme, GdsButton, IconInformationCircle } from '@sebgroup/green-core/react'

function TooltipPopover() {
  return (
    <GdsTheme>
      <GdsPopover nonmodal placement="top">
        <GdsButton rank="tertiary" slot="trigger">
          <IconInformationCircle />
        </GdsButton>
        <div style={{ padding: '0.5rem 1rem', maxWidth: '250px' }}>
          <p style={{ margin: 0 }}>
            This provides additional context and information about the feature.
          </p>
        </div>
      </GdsPopover>
    </GdsTheme>
  )
}
```

## Related Components

- [GdsButton](./GdsButton.md) — Button component commonly used as popover trigger
- [GdsMenuButton](./GdsMenuButton.md) — Menu button for navigation popover triggers
- [GdsMenuItem](./GdsMenuItem.md) — Menu items for menu-type popovers
- [GdsBackdrop](./GdsBackdrop.md) — Backdrop element for dimming background
- [GdsDialog](./GdsDialog.md) — Modal dialog for more prominent overlays
- [GdsContextMenu](./GdsContextMenu.md) — Context menu with right-click behavior
- [GdsFlex](./GdsFlex.md) — Layout for popover content
- [GdsCard](./GdsCard.md) — Card container for structured popover content
- [Icons](./Icons.md) — Icons for trigger buttons
- [Code Splitting](./CodeSplitting.md) — Using pure imports for tree-shaking (GdsPopover has many internal dependencies)

## Notes

- **Positioning**: Uses Floating UI for intelligent positioning that adapts to available space
- **Default Middleware**: Includes `offset(8)` and `shift({ crossAxis: true, padding: 8 })` by default
- **Focus Management**: Modal popovers (default) trap focus; nonmodal popovers allow interaction with other elements
- **Keyboard Support**: Opens on ArrowDown when trigger is focused, closes on Escape
- **Mobile Behavior**: Uses modal dialog in mobile viewport unless `disableMobileStyles` is true
- **Backdrop**: Can use :backdrop pseudo-element (modal) or custom GdsBackdrop element (nonmodal)
- **Trigger Slot**: When trigger slot is occupied, popover automatically handles click and keyboard events
- **Programmatic Control**: Use `triggerRef` and `anchorRef` for programmatic trigger/anchor assignment
- **State Change Reasons**:
  - `'show'` — User clicked trigger or pressed ArrowDown
  - `'close'` — User clicked outside popover
  - `'cancel'` — User pressed Escape key
- **Cancellable Events**: Use `preventDefault()` on `gds-ui-state` event to prevent opening/closing
- **Autofocus**: When enabled, focuses first focusable child element on open
- **ARIA Support**: Automatically applies proper ARIA attributes via `applyTriggerAriaAttributes` helper
- **Popup Roles**: Supports menu, listbox, tree, grid, and dialog roles for proper semantics
- **Sizing Callbacks**: Provide `calcMaxWidth`, `calcMinWidth`, `calcMinHeight`, `calcMaxHeight` for custom sizing
- **Floating UI Middleware**: Customize positioning behavior with Floating UI middleware array
- **Shadow DOM**: Uses Shadow DOM with `delegatesFocus: true` for keyboard navigation

---

*Last updated: November 12, 2025*  
*Source: [GdsPopover Storybook Documentation](https://storybook.seb.io/latest/core/?path=/docs/components-popover--docs)*
