# GdsDialog

A dialog appears in front of content to provide critical information or ask for a decision.

## Overview

The GdsDialog component creates modal dialogs that appear as overlays on top of the main content. Dialogs are used to focus user attention on important information, confirmations, or forms that require immediate action before continuing with the main workflow.

The component supports multiple variants (default modal and slide-out drawer), programmatic control, custom footers, and extensive event handling for user interactions.

## Modal Behavior and Backdrop

By default `GdsDialog` is modal: it renders a backdrop that prevents interaction with the rest of the page and traps keyboard focus inside the dialog while open. The default behavior closes the dialog when the backdrop is clicked. If you need to prevent closing on outside click, listen to `gds-ui-state` and call `preventDefault()` when `detail.open` is `false` and `detail.reason === 'click-outside'`.

If you require a non-modal panel (that does not block background interaction) consider using `GdsPopover` or a custom `slide-out` variant with `aria-hidden` adjustments handled by the app.

### Focus Management Details

- On open the dialog moves focus to the first focusable element inside the dialog (prefer buttons or the first form field). If no focusable element exists, focus is placed on the dialog container itself to ensure screen readers announce it.
- While open, focus is trapped inside the dialog. Tab/Shift+Tab will cycle through focusable elements within the dialog.
- On close, focus returns to the trigger that opened the dialog. When opening programmatically without a trigger, manage focus manually by calling `focus()` on a known element after calling `show()`.

### Reduced Motion

Animations respect the user's `prefers-reduced-motion` setting. If a user prefers reduced motion, dialog open/close animations are reduced or removed to prevent motion sickness.

### Mobile Guidance

- On small viewports prefer `variant="slide-out"` or a full-screen presentation to avoid cramped modal windows and ensure that the dialog content remains readable and tappable.
- Avoid multi-step, large forms in small modal windows; prefer dedicated pages or slide-out patterns for complex workflows.

## Import

```tsx
// Use as JSX element in React
import { GdsDialog } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsDialog heading="Dialog Heading">
    <GdsButton slot="trigger">Open Dialog</GdsButton>
    <GdsRichText>
      <p>Dialog content goes here.</p>
    </GdsRichText>
  </GdsDialog>
</GdsTheme>
```

## API

### Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `heading` | `string` | `undefined` | The dialog's heading. Always provide for accessibility |
| `variant` | `'default' \| 'slide-out'` | `'default'` | The dialog's variant. `'default'` shows centered modal, `'slide-out'` slides from side |
| `placement` | `'initial' \| 'top' \| 'bottom' \| 'left' \| 'right'` | `'initial'` | The dialog's placement on screen |
| `open` | `boolean` | `false` | Whether the dialog is open. Can be controlled programmatically |
| `scrollable` | `boolean` | `false` | Whether inner content should have scrollable overflow. Only affects default content slot |

### Style Expression Properties

GdsDialog supports style expressions for sizing and spacing:

| Property | Description |
|----------|-------------|
| `width` | Controls the width property. Supports space tokens and CSS width values |
| `min-width` | Controls the min-width property |
| `max-width` | Controls the max-width property |
| `inline-size` | Controls the inline-size property |
| `min-inline-size` | Controls the min-inline-size property |
| `max-inline-size` | Controls the max-inline-size property |
| `height` | Controls the height property. Supports space tokens and CSS height values |
| `min-height` | Controls the min-height property |
| `max-height` | Controls the max-height property |
| `block-size` | Controls the block-size property |
| `min-block-size` | Controls the min-block-size property |
| `max-block-size` | Controls the max-block-size property |
| `padding` | Controls the padding property. Only accepts space tokens |
| `padding-inline` | Controls the padding-inline property. Only accepts space tokens |
| `padding-block` | Controls the padding-block property. Only accepts space tokens |

### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `show()` | `reason?: string` | Opens the dialog. Optional reason parameter emitted in events |
| `close()` | `reason?: string` | Closes the dialog. Optional reason parameter emitted in events |

### Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-show` | `CustomEvent` | Fired when the dialog is opened |
| `gds-close` | `CustomEvent` | Fired when the dialog is closed |
| `gds-ui-state` | `CustomEvent` | Fired when dialog opens or closes. Can be cancelled with `preventDefault()` to prevent closing |

#### Event Detail Reasons

All events include a `detail.reason` property indicating why the dialog state changed:

- `btn-close` - Closed by clicking the close button
- `btn-cancel` - Closed by clicking default cancel button
- `btn-ok` - Closed by clicking default OK button
- `native-close` - Closed by native dialog action (e.g., Escape key)
- `click-outside` - Closed by clicking outside the dialog
- `slotted-trigger` - Opened by clicking slotted trigger button
- Custom string - When calling `show(reason)` or `close(reason)` with a parameter

### Backdrop and Close Control

- By default clicking the backdrop triggers a close with reason `click-outside`. To opt out, call `preventDefault()` on `gds-ui-state` when `detail.reason === 'click-outside'`.
- Use `gds-ui-state` to validate forms before closing; call `preventDefault()` to keep the dialog open when validation fails.

### Slots

| Slot | Description |
|------|-------------|
| `trigger` | The trigger button for the dialog. Automatically gets `aria-haspopup="dialog"` |
| `footer` | The footer of the dialog. Place action buttons here |
| `dialog` | Complete override of dialog content, including header and footer |
| (default) | Main content of the dialog. Wrap in `GdsRichText` for proper typography |

## Examples

### Basic Dialog with Trigger

```tsx
<GdsTheme>
  <GdsDialog heading="Confirm Action">
    <GdsButton slot="trigger">Open Dialog</GdsButton>
    <GdsRichText>
      <p>Are you sure you want to proceed with this action?</p>
      <p>This cannot be undone.</p>
    </GdsRichText>
    <GdsButton slot="footer" rank="secondary">Cancel</GdsButton>
    <GdsButton slot="footer" variant="positive">Confirm</GdsButton>
  </GdsDialog>
</GdsTheme>
```

### Slide-Out Variant

```tsx
<GdsTheme>
  <GdsDialog heading="Settings" variant="slide-out">
    <GdsButton slot="trigger">Open Settings</GdsButton>
    <GdsRichText>
      <h3>User Preferences</h3>
      <p>Configure your application settings here.</p>
    </GdsRichText>
    <GdsButton slot="footer">Save Changes</GdsButton>
  </GdsDialog>
</GdsTheme>
```

### Scrollable Content

```tsx
<GdsTheme>
  <GdsDialog 
    heading="Terms and Conditions" 
    scrollable={true}
    height="80vh"
  >
    <GdsButton slot="trigger">View Terms</GdsButton>
    <GdsRichText>
      <h3>1. Agreement to Terms</h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
      {/* Long content here */}
      <h3>2. Privacy Policy</h3>
      <p>More content...</p>
    </GdsRichText>
    <GdsButton slot="footer">Accept</GdsButton>
  </GdsDialog>
</GdsTheme>
```

### Programmatic Control

```tsx
import { useRef } from 'react'

function MyComponent() {
  const dialogRef = useRef<any>(null)

  const openDialog = () => {
    dialogRef.current?.show('opened-programmatically')
  }

  const closeDialog = () => {
    dialogRef.current?.close('closed-programmatically')
  }

  return (
    <GdsTheme>
      <GdsButton 
        aria-haspopup="dialog" 
        onClick={openDialog}
      >
        Open Dialog
      </GdsButton>

      <GdsDialog 
        ref={dialogRef}
        heading="Programmatic Dialog"
      >
        <GdsRichText>
          <p>This dialog was opened programmatically.</p>
        </GdsRichText>
        <GdsButton slot="footer" onClick={closeDialog}>
          Close
        </GdsButton>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Event Handling

```tsx
import { useState } from 'react'

function DialogWithEvents() {
  const [lastAction, setLastAction] = useState('')

  const handleShow = (e: CustomEvent) => {
    console.log('Dialog opened:', e.detail.reason)
    setLastAction(`Opened: ${e.detail.reason}`)
  }

  const handleClose = (e: CustomEvent) => {
    console.log('Dialog closed:', e.detail.reason)
    setLastAction(`Closed: ${e.detail.reason}`)
  }

  const handleUIState = (e: CustomEvent) => {
    console.log('UI State changed:', e.detail)
  }

  return (
    <GdsTheme>
      <GdsDialog
        heading="Event Demo"
        onGdsShow={handleShow}
        onGdsClose={handleClose}
        onGdsUiState={handleUIState}
      >
        <GdsButton slot="trigger">Open Dialog</GdsButton>
        <GdsRichText>
          <p>Last action: {lastAction}</p>
        </GdsRichText>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Preventing Close

```tsx
function ConfirmDialog() {
  const handleUIState = (e: CustomEvent) => {
    if (!e.detail.open) {
      // Dialog is trying to close
      const confirmed = window.confirm('Are you sure you want to close?')
      if (!confirmed) {
        e.preventDefault() // Prevent closing
      }
    }
  }

  return (
    <GdsTheme>
      <GdsDialog
        heading="Unsaved Changes"
        onGdsUiState={handleUIState}
      >
        <GdsButton slot="trigger">Open Form</GdsButton>
        <GdsRichText>
          <p>You have unsaved changes. Closing will discard them.</p>
        </GdsRichText>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Custom Footer Buttons

```tsx
function ActionDialog() {
  const dialogRef = useRef<any>(null)

  const handlePrimary = () => {
    // Perform action
    dialogRef.current?.close('primary-action')
  }

  const handleSecondary = () => {
    dialogRef.current?.close('secondary-action')
  }

  return (
    <GdsTheme>
      <GdsDialog ref={dialogRef} heading="Choose Action">
        <GdsButton slot="trigger">Open Actions</GdsButton>
        <GdsRichText>
          <p>What would you like to do?</p>
        </GdsRichText>
        <GdsButton 
          slot="footer" 
          rank="secondary" 
          onClick={handleSecondary}
        >
          Cancel
        </GdsButton>
        <GdsButton 
          slot="footer" 
          variant="positive" 
          onClick={handlePrimary}
        >
          Proceed
        </GdsButton>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Custom Dialog Content

```tsx
<GdsTheme>
  <GdsDialog heading="Custom Layout">
    <GdsButton slot="trigger">Open Custom</GdsButton>
    <div slot="dialog">
      <div style={{ padding: '24px' }}>
        <h2>Custom Header</h2>
        <p>Completely custom dialog content with your own layout.</p>
        <div style={{ marginTop: '24px' }}>
          <button>Custom Button 1</button>
          <button>Custom Button 2</button>
        </div>
      </div>
    </div>
  </GdsDialog>
</GdsTheme>
```

### Confirmation Dialog

```tsx
function DeleteConfirmation({ itemName, onConfirm }: Props) {
  const dialogRef = useRef<any>(null)

  const handleConfirm = () => {
    onConfirm()
    dialogRef.current?.close('confirmed')
  }

  return (
    <GdsTheme>
      <GdsDialog 
        ref={dialogRef}
        heading="Confirm Deletion"
      >
        <GdsButton slot="trigger" variant="negative">
          Delete
        </GdsButton>
        <GdsRichText>
          <p>Are you sure you want to delete <strong>{itemName}</strong>?</p>
          <p>This action cannot be undone.</p>
        </GdsRichText>
        <GdsButton slot="footer" rank="secondary">
          Cancel
        </GdsButton>
        <GdsButton 
          slot="footer" 
          variant="negative" 
          onClick={handleConfirm}
        >
          Delete
        </GdsButton>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Form Dialog

```tsx
function FormDialog() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const dialogRef = useRef<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting:', formData)
    dialogRef.current?.close('form-submitted')
  }

  return (
    <GdsTheme>
      <GdsDialog ref={dialogRef} heading="User Information">
        <GdsButton slot="trigger">Add User</GdsButton>
        <form onSubmit={handleSubmit}>
          <GdsInput
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <GdsInput
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </form>
        <GdsButton slot="footer" rank="secondary">
          Cancel
        </GdsButton>
        <GdsButton 
          slot="footer" 
          variant="positive" 
          onClick={handleSubmit}
        >
          Save
        </GdsButton>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Controlled Open State

```tsx
function ControlledDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <GdsTheme>
      <GdsButton onClick={() => setIsOpen(true)}>
        Open Dialog
      </GdsButton>

      <GdsDialog
        heading="Controlled Dialog"
        open={isOpen}
        onGdsClose={() => setIsOpen(false)}
      >
        <GdsRichText>
          <p>This dialog's open state is controlled by React state.</p>
        </GdsRichText>
        <GdsButton 
          slot="footer" 
          onClick={() => setIsOpen(false)}
        >
          Close
        </GdsButton>
      </GdsDialog>
    </GdsTheme>
  )
}
```

### Different Placements

```tsx
<GdsTheme>
  <GdsDialog heading="Top Dialog" placement="top">
    <GdsButton slot="trigger">Open at Top</GdsButton>
    <GdsRichText>
      <p>This dialog appears at the top of the screen.</p>
    </GdsRichText>
  </GdsDialog>

  <GdsDialog heading="Right Dialog" placement="right">
    <GdsButton slot="trigger">Open at Right</GdsButton>
    <GdsRichText>
      <p>This dialog appears at the right side.</p>
    </GdsRichText>
  </GdsDialog>
</GdsTheme>
```

### Custom Size with Style Expressions

```tsx
<GdsTheme>
  <GdsDialog
    heading="Custom Sized Dialog"
    width="90vw"
    max-width="1200px"
    height="80vh"
    padding="xl"
  >
    <GdsButton slot="trigger">Open Large Dialog</GdsButton>
    <GdsRichText>
      <p>This dialog uses style expressions for custom sizing.</p>
    </GdsRichText>
  </GdsDialog>
</GdsTheme>
```

### Alert Dialog

```tsx
function AlertDialog({ title, message, onClose }: Props) {
  return (
    <GdsTheme>
      <GdsDialog heading={title}>
        <GdsAlert variant="notice">
          <p>{message}</p>
        </GdsAlert>
        <GdsButton slot="footer" onClick={onClose}>
          OK
        </GdsButton>
      </GdsDialog>
    </GdsTheme>
  )
}
```

## Best Practices

### Always Provide a Heading
- The `heading` attribute is required for accessibility
- Even when using custom dialog content, set the heading for screen readers
- Keep headings clear and descriptive

### Use Appropriate Variants
- Use `variant="default"` for confirmations and important decisions
- Use `variant="slide-out"` for settings panels or supplementary information
- Default variant centers the dialog; slide-out creates a drawer effect

### Button Placement
- Place primary action on the right in footer
- Place cancel/secondary action on the left
- Use appropriate button variants (positive for confirm, negative for delete)

### Content Structure
- Wrap text content in `GdsRichText` for proper typography
- Keep dialog content concise and focused
- Use scrollable for long content instead of making dialog too tall

### Event Handling
- Listen to `gds-close` to perform cleanup actions
- Use `gds-ui-state` with `preventDefault()` to validate before closing
- Check `event.detail.reason` to determine how dialog was closed

### Programmatic Control
- Add `aria-haspopup="dialog"` to external trigger buttons
- Store dialog ref to call `show()` and `close()` methods
- Pass reason strings to track user actions

### Accessibility
- Always set the `heading` attribute
- Ensure keyboard navigation works (Tab, Escape)
- Test with screen readers
- Provide clear action button labels

### Accessible Close Button
- The dialog header includes a close icon button by default. Ensure the button has an accessible label (for example `aria-label="Close dialog"`) when icon-only so screen reader users can understand its purpose.

### Native `<dialog>` support
- `GdsDialog` leverages native dialog semantics where available, but browser support for the native `<dialog>` API varies. The component provides behavior fallbacks; include a polyfill if your app needs native API parity across older browsers.

## Common Patterns

### Confirmation Pattern
```tsx
<GdsDialog heading="Confirm">
  <GdsButton slot="trigger">Delete</GdsButton>
  <p>Are you sure?</p>
  <GdsButton slot="footer" rank="secondary">Cancel</GdsButton>
  <GdsButton slot="footer" variant="negative">Delete</GdsButton>
</GdsDialog>
```

### Form Pattern
```tsx
<GdsDialog heading="Edit Item">
  <GdsButton slot="trigger">Edit</GdsButton>
  <form>{/* form fields */}</form>
  <GdsButton slot="footer" rank="secondary">Cancel</GdsButton>
  <GdsButton slot="footer" variant="positive">Save</GdsButton>
</GdsDialog>
```

### Settings Drawer Pattern
```tsx
<GdsDialog heading="Settings" variant="slide-out">
  <GdsButton slot="trigger">Settings</GdsButton>
  {/* settings content */}
  <GdsButton slot="footer">Apply</GdsButton>
</GdsDialog>
```

### Alert Pattern
```tsx
<GdsDialog heading="Error">
  <GdsAlert variant="negative">Error message</GdsAlert>
  <GdsButton slot="footer">OK</GdsButton>
</GdsDialog>
```

## TypeScript Types

```tsx
import type { GdsDialog } from '@sebgroup/green-core/react'

// Dialog variant types
type DialogVariant = 'default' | 'slide-out'

// Dialog placement types
type DialogPlacement = 'initial' | 'top' | 'bottom' | 'left' | 'right'

// Event types
interface DialogShowEvent extends CustomEvent {
  detail: {
    reason: string
  }
}

interface DialogCloseEvent extends CustomEvent {
  detail: {
    reason: string
  }
}

interface DialogUIStateEvent extends CustomEvent {
  detail: {
    open: boolean
    reason: string
  }
}

// Close reasons
type DialogCloseReason = 
  | 'btn-close'
  | 'btn-cancel'
  | 'btn-ok'
  | 'native-close'
  | 'click-outside'
  | 'slotted-trigger'
  | string // custom reason

// Component props type
interface DialogProps {
  heading: string
  variant?: DialogVariant
  placement?: DialogPlacement
  open?: boolean
  scrollable?: boolean
  // Style expressions
  width?: string
  'min-width'?: string
  'max-width'?: string
  height?: string
  'min-height'?: string
  'max-height'?: string
  padding?: string
  'padding-inline'?: string
  'padding-block'?: string
  // Events
  onGdsShow?: (event: DialogShowEvent) => void
  onGdsClose?: (event: DialogCloseEvent) => void
  onGdsUiState?: (event: DialogUIStateEvent) => void
}
```

## Related Components

- [GdsButton](./GdsButton.md) — For dialog triggers and footer actions
- [GdsFab](./GdsFab.md) — For floating action buttons that open dialogs
- [GdsPopover](./GdsPopover.md) — For less prominent temporary overlay content
- [GdsRichText](./GdsRichText.md) — For properly styled dialog content
- [GdsAlert](./GdsAlert.md) — For alert messages within dialogs
- [GdsFlex](./GdsFlex.md) — For layout of dialog content
- [Icons](./Icons.md) — Available icons for dialog content

## Accessibility

- **ARIA Labels**: Always provide `heading` attribute for accessible name
- **Keyboard Navigation**:
  - Escape key closes the dialog
  - Tab/Shift+Tab navigate within dialog
  - Focus is trapped within open dialog
  - Focus returns to trigger on close
- **Trigger Buttons**: Slotted triggers automatically get `aria-haspopup="dialog"`
- **External Triggers**: Add `aria-haspopup="dialog"` manually to external buttons
- **Screen Readers**: Dialog role and labels are properly announced
- **Focus Management**: Focus is automatically managed when opening/closing

## Browser Support

GdsDialog is built on the native HTML `<dialog>` element and works in all modern browsers. The component provides consistent behavior and styling across different platforms.

## Notes

- Dialog automatically closes when clicking outside (can be prevented with `gds-ui-state` event)
- Escape key automatically closes dialog (native behavior)
- Slotted trigger buttons automatically get proper ARIA attributes
- When using `dialog` slot for complete customization, footer slot is ignored
- `scrollable` property only affects default content slot, not custom dialog slot
- Event `detail.reason` can be used to track how dialogs are closed
- `gds-ui-state` is the only event that can be cancelled with `preventDefault()`
