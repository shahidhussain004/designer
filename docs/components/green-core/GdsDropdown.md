# GdsDropdown & GdsOption

A dropdown enables the user to choose one or multiple options from a list.

## Overview

The GdsDropdown component provides a versatile selection control that supports:
- **Single and multiple selection** - Choose one or many options
- **Searchable filtering** - Filter options by typing
- **Combobox mode** - Allow custom values with predefined options
- **Validation** - Built-in form validation support
- **Accessibility** - Full keyboard navigation and ARIA support

Use GdsDropdown when users need to select from a list of options. For large lists, enable search functionality to help users find options quickly.

## Import

```tsx
// Use as JSX elements in React
import { GdsDropdown, GdsOption } from '@sebgroup/green-core/react'
```

## Basic Usage

```tsx
<GdsTheme>
  <GdsDropdown label="Select a starship">
    <GdsOption value="1701-D-1">Enterprise 1701-D</GdsOption>
    <GdsOption value="falcon-1">Millenium Falcon</GdsOption>
    <GdsOption value="defiant-1">Defiant</GdsOption>
    <GdsOption value="voyager-1">Voyager</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

## API

### GdsDropdown Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | `string` | `''` | Label text for the dropdown (required for accessibility) |
| `open` | `boolean` | `false` | Controls the open state of the dropdown |
| `searchable` | `boolean` | `false` | Enables search functionality |
| `multiple` | `boolean` | `false` | Allows multiple selections with checkboxes |
| `clearable` | `boolean` | `false` | Shows a clear button to reset selection |
| `combobox` | `boolean` | `false` | Enables combobox mode (allows custom values) |
| `size` | `'medium' \| 'small'` | `'medium'` | Size of the dropdown |
| `plain` | `boolean` | `false` | Hides header/footer while keeping accessible label |
| `disabled` | `boolean` | `false` | Disables the dropdown |
| `required` | `boolean` | `false` | Marks field as required for accessibility |
| `invalid` | `boolean` | `false` | Sets validation state to invalid |
| `supporting-text` | `string` | `''` | Supporting text between label and field |
| `hide-label` | `boolean` | `false` | Hides the label visually (keeps it for screen readers) |
| `show-extended-supporting-text` | `boolean` | `false` | Shows extended supporting text |
| `sync-popover-width` | `boolean` | `false` | Locks popover width to trigger button width |
| `max-height` | `number` | `500` | Maximum height of dropdown list in pixels |
| `disable-mobile-styles` | `boolean` | `false` | Disables mobile-specific styles |
| `error-message` | `string` | `''` | Custom error message for validation |
| `aria-invalid` | `boolean` | - | Validation state (use `invalid` instead) |

### GdsDropdown Properties

| Property | Type | Description |
|----------|------|-------------|
| `value` | `any` | Current value (single mode) or array of values (multiple mode) |
| `supportingText` | `string` | Supporting text between label and field |
| `syncPopoverWidth` | `boolean` | Locks popover width to trigger width |
| `maxHeight` | `number` | Maximum height of dropdown list |
| `hideLabel` | `boolean` | Hides label visually |
| `showExtendedSupportingText` | `boolean` | Shows extended supporting text |
| `options` | `GdsOption[]` | Array of option elements |
| `placeholder` | `GdsOption \| undefined` | The placeholder option |
| `displayValue` | `string` | Display value as string (comma-separated for multiple) |
| `compareWith` | `(a: unknown, b: unknown) => boolean` | Custom comparison function for option values |
| `searchFilter` | `(q: string, o: GdsOption) => boolean` | Custom search filter function |
| `validator` | `GdsValidator` | Custom validator |
| `errorMessage` | `string` | Custom error message |

### GdsDropdown Style Expression Properties

| Property | Description |
|----------|-------------|
| `width` | Controls width. Supports space tokens and CSS values |
| `min-width` | Controls min-width. Supports space tokens and CSS values |
| `max-width` | Controls max-width. Supports space tokens and CSS values |
| `inline-size` | Controls inline-size. Supports space tokens and CSS values |
| `min-inline-size` | Controls min-inline-size. Supports space tokens and CSS values |
| `max-inline-size` | Controls max-inline-size. Supports space tokens and CSS values |
| `margin` | Controls margin. Only accepts space tokens |
| `margin-inline` | Controls margin-inline. Only accepts space tokens |
| `margin-block` | Controls margin-block. Only accepts space tokens |
| `align-self` | Controls align-self. Supports all CSS values |
| `justify-self` | Controls justify-self. Supports all CSS values |
| `place-self` | Controls place-self. Supports all CSS values |
| `grid-column` | Controls grid-column. Supports all CSS values |
| `grid-row` | Controls grid-row. Supports all CSS values |
| `grid-area` | Controls grid-area. Supports all CSS values |
| `flex` | Controls flex property. Supports all CSS values |
| `order` | Controls order property. Supports all CSS values |

### GdsDropdown Events

| Event | Type | Description |
|-------|------|-------------|
| `change` | `CustomEvent` | Fired when value changes through user interaction |
| `input` | `CustomEvent` | Fired when value changes through user interaction |
| `gds-ui-state` | `CustomEvent` | Fired when dropdown opens/closes (cancellable) |
| `gds-filter-input` | `CustomEvent` | Fired when user types in search field (cancellable) |
| `gds-input-cleared` | `CustomEvent` | Fired when user clears input using clear button |
| `gds-validity-state` | `CustomEvent` | Fired when validation state changes |
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

### GdsDropdown Slots

| Slot | Description |
|------|-------------|
| `trigger` | Custom content for trigger button |
| `extended-supporting-text` | Longer supporting text (shown in info panel) |
| `lead` | Icon or content at start of trigger |
| `message` | (deprecated) Error message - use `errorMessage` property |
| `sub-label` | (deprecated) Sub-label - use `supporting-text` property |

### GdsOption Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `value` | `any` | - | Value of the option (required) |
| `hidden` | `boolean` | `false` | Controls visibility of the option |
| `isPlaceholder` | `boolean` | `false` | Marks option as placeholder (no value, default option) |
| `aria-selected` | `boolean` | `false` | Selection state |

### GdsOption Properties

| Property | Type | Description |
|----------|------|-------------|
| `selected` | `boolean` | Whether the option is selected |
| `value` | `any` | Value of the option |

### GdsOption Events

| Event | Type | Description |
|-------|------|-------------|
| `gds-select` | `CustomEvent` | Fired when option is selected |
| `gds-blur` | `CustomEvent` | Fired when option loses focus |
| `gds-focus` | `CustomEvent` | Fired when option gains focus |
| `gds-element-disconnected` | `CustomEvent` | Fired when element disconnects from DOM |

## Examples

### Basic Dropdown

```tsx
<GdsTheme>
  <GdsDropdown label="Select a starship" supporting-text="Choose your preferred vessel">
    <span slot="extended-supporting-text">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    </span>
    <GdsOption value="1701-D-1">Enterprise 1701-D</GdsOption>
    <GdsOption value="falcon-1">Millenium Falcon</GdsOption>
    <GdsOption value="defiant-1">Defiant</GdsOption>
    <GdsOption value="voyager-1">Voyager</GdsOption>
    <GdsOption value="prometheus-1">Prometheus</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### With Icon Lead

```tsx
import { IconPush } from '@sebgroup/green-core/icons'

<GdsTheme>
  <GdsDropdown label="Select option">
    <IconPush slot="lead" />
    <GdsOption value="1">Option 1</GdsOption>
    <GdsOption value="2">Option 2</GdsOption>
    <GdsOption value="3">Option 3</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Option Headings

Use `GdsMenuHeading` to create group headings:

```tsx
import { GdsMenuHeading } from '@sebgroup/green-core/react'

<GdsTheme>
  <GdsDropdown label="Select a vehicle">
    <GdsMenuHeading>Space vehicles</GdsMenuHeading>
    <GdsOption value="1701-D-1">Enterprise 1701-D</GdsOption>
    <GdsOption value="falcon-1">Millenium Falcon</GdsOption>
    <GdsOption value="defiant-1">Defiant</GdsOption>
    
    <GdsMenuHeading>Ground vehicles</GdsMenuHeading>
    <GdsOption value="at-at">AT-AT</GdsOption>
    <GdsOption value="at-st">AT-ST</GdsOption>
    <GdsOption value="at-te">AT-TE</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Searchable Dropdown

```tsx
<GdsTheme>
  <GdsDropdown label="Select technology" searchable>
    <GdsOption value="" isPlaceholder>Select a technology</GdsOption>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
    <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
    <GdsOption value="ai">Artificial Intelligence</GdsOption>
    <GdsOption value="robotics">Robotics</GdsOption>
    <GdsOption value="quantum">Quantum Computing</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Multiple Selection

```tsx
<GdsTheme>
  <GdsDropdown 
    label="Select technologies" 
    multiple 
    searchable 
    clearable
  >
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
    <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
    <GdsOption value="cloning">Cloning</GdsOption>
    <GdsOption value="teleportation">Teleportation</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Small Size

```tsx
<GdsTheme>
  <GdsDropdown size="small" label="Select tech">
    <GdsOption value="">Select tech</GdsOption>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
    <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Hidden Label

Useful for constrained spaces like table cells:

```tsx
<GdsTheme>
  <GdsDropdown label="Select tech" hide-label>
    <GdsOption value="">Select tech</GdsOption>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Placeholder Option

```tsx
<GdsTheme>
  <GdsDropdown label="Select tech">
    <GdsOption value="" isPlaceholder>This is a placeholder</GdsOption>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
    <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Clearable Dropdown

```tsx
<GdsTheme>
  <GdsDropdown label="Select tech" value="teleportation" clearable>
    <GdsOption isPlaceholder>None</GdsOption>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
    <GdsOption value="teleportation">Teleportation</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Combobox Mode

Allows custom values with predefined options:

```tsx
<GdsTheme>
  <GdsDropdown label="Favorite sci-fi tech" combobox>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
    <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
    <GdsOption value="ai">Artificial Intelligence</GdsOption>
    <GdsOption value="robotics">Robotics</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Custom Trigger Content

```tsx
<GdsTheme>
  <GdsDropdown width="250px" onChange={(e) => console.log(e.target.value)}>
    <GdsFlex gap="xs" width="100%" justify-content="space-between" slot="trigger">
      <GdsFlex flex-direction="column" gap="2xs">
        <GdsText font="detail-regular-s">Account</GdsText>
        <GdsText>123 456</GdsText>
      </GdsFlex>
      <GdsFlex flex-direction="column" gap="2xs">
        <GdsText font="detail-regular-s" text-align="end">Balance</GdsText>
        <GdsText text-align="end">9 654,00</GdsText>
      </GdsFlex>
    </GdsFlex>
    
    <GdsOption value="v1">
      <GdsFlex gap="xs" width="100%" justify-content="space-between">
        <GdsFlex flex-direction="column" gap="2xs">
          <GdsText font="detail-regular-s">Account</GdsText>
          <GdsText>123 456</GdsText>
        </GdsFlex>
        <GdsFlex flex-direction="column" gap="2xs">
          <GdsText font="detail-regular-s" text-align="end">Balance</GdsText>
          <GdsText text-align="end">9 654,00</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsOption>
    
    <GdsOption value="v2">
      <GdsFlex gap="xs" width="100%" justify-content="space-between">
        <GdsFlex flex-direction="column" gap="2xs">
          <GdsText font="detail-regular-s">Account</GdsText>
          <GdsText>789 012</GdsText>
        </GdsFlex>
        <GdsFlex flex-direction="column" gap="2xs">
          <GdsText font="detail-regular-s" text-align="end">Balance</GdsText>
          <GdsText text-align="end">15 234,50</GdsText>
        </GdsFlex>
      </GdsFlex>
    </GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Synced Popover Width

```tsx
<GdsTheme>
  <GdsDropdown 
    label="Synced popover width" 
    sync-popover-width 
    style={{ width: '200px' }}
  >
    <GdsOption value="1701-D-1">
      Enterprise 1701-D is a starship from the TNG series
    </GdsOption>
    <GdsOption value="falcon-1">Millenium Falcon</GdsOption>
    <GdsOption value="defiant-1">Defiant</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Validation

```tsx
import { useState } from 'react'

function ValidatedDropdown() {
  const [value, setValue] = useState('')
  const [showError, setShowError] = useState(false)
  
  const handleChange = (e) => {
    setValue(e.target.value)
    setShowError(!e.target.value)
  }
  
  return (
    <GdsTheme>
      <GdsDropdown 
        label="Select tech (required)" 
        value={value}
        onChange={handleChange}
        invalid={showError}
        error-message="Please select a technology"
        required
      >
        <GdsOption value="" isPlaceholder>Select a technology</GdsOption>
        <GdsOption value="warp">Warp Drive</GdsOption>
        <GdsOption value="cybernetics">Cybernetics</GdsOption>
        <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
      </GdsDropdown>
    </GdsTheme>
  )
}
```

### Disabled State

```tsx
<GdsTheme>
  <GdsDropdown label="Select tech" disabled>
    <GdsOption value="" isPlaceholder>This is a placeholder</GdsOption>
    <GdsOption value="warp">Warp Drive</GdsOption>
    <GdsOption value="cybernetics">Cybernetics</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

### Custom Compare Function

For comparing objects by field values:

```tsx
const dropdown = document.querySelector('gds-dropdown')
dropdown.compareWith = (a, b) => a.id === b.id
```

### Custom Search Filter

Filter by value instead of label:

```tsx
const dropdown = document.querySelector('gds-dropdown')
dropdown.searchFilter = (query, option) => 
  option.value.toLowerCase().includes(query.toLowerCase())
```

### Form Integration

```tsx
import { useState } from 'react'

function Form() {
  const [selectedTech, setSelectedTech] = useState('')
  const [selectedVehicles, setSelectedVehicles] = useState([])
  
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Tech:', selectedTech)
    console.log('Vehicles:', selectedVehicles)
  }
  
  return (
    <GdsTheme>
      <form onSubmit={handleSubmit}>
        <GdsFlex flex-direction="column" gap="m">
          <GdsDropdown 
            label="Primary Technology"
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            required
          >
            <GdsOption value="" isPlaceholder>Select technology</GdsOption>
            <GdsOption value="warp">Warp Drive</GdsOption>
            <GdsOption value="cybernetics">Cybernetics</GdsOption>
            <GdsOption value="nanotechnology">Nanotechnology</GdsOption>
          </GdsDropdown>
          
          <GdsDropdown 
            label="Vehicles"
            value={selectedVehicles}
            onChange={(e) => setSelectedVehicles(e.target.value)}
            multiple
            searchable
          >
            <GdsOption value="1701-D">Enterprise 1701-D</GdsOption>
            <GdsOption value="falcon">Millenium Falcon</GdsOption>
            <GdsOption value="defiant">Defiant</GdsOption>
            <GdsOption value="voyager">Voyager</GdsOption>
          </GdsDropdown>
          
          <GdsButton type="submit">Submit</GdsButton>
        </GdsFlex>
      </form>
    </GdsTheme>
  )
}
```

### With Event Handlers

```tsx
<GdsTheme>
  <GdsDropdown 
    label="Select option"
    onChange={(e) => console.log('Changed:', e.target.value)}
    onInput={(e) => console.log('Input:', e.target.value)}
    onGds-ui-state={(e) => console.log('UI State:', e.detail)}
    onGds-input-cleared={() => console.log('Input cleared')}
  >
    <GdsOption value="1">Option 1</GdsOption>
    <GdsOption value="2">Option 2</GdsOption>
    <GdsOption value="3">Option 3</GdsOption>
  </GdsDropdown>
</GdsTheme>
```

## Best Practices

### Label Requirements
- **Always** provide a `label` attribute for accessibility
- Use `hide-label` to hide it visually if needed (label remains for screen readers)
- Never omit the label entirely

### Single vs Multiple Selection
- Use single selection for mutually exclusive choices
- Use multiple selection when users can pick several options
- Consider using checkboxes instead for 5 or fewer visible options

### Searchable Dropdowns
- Enable `searchable` for lists with more than 10 options
- Provide clear placeholder text
- Consider custom `searchFilter` for specialized filtering needs

### Combobox vs Searchable
- Use `searchable` when users must pick from predefined options
- Use `combobox` when users can enter custom values or pick from suggestions
- **Never** combine `searchable` and `combobox` attributes

### Placeholder Options
- Use `isPlaceholder` for initial "Select..." options
- Placeholder options don't appear in multiple selection lists
- Provide meaningful placeholder text, not just "Select an option"

### Size Selection
- Use `medium` (default) for most forms
- Use `small` for constrained spaces (tables, toolbars, dense layouts)
- Combine `small` with `hide-label` for very compact layouts

### Validation
- Use `required` attribute for required fields
- Set `invalid` when validation fails
- Provide clear `error-message` text
- Validate on blur or submit, not on every keystroke

### Performance
- For very large lists, consider server-side filtering
- Use `max-height` to limit visible options
- Enable `searchable` to help users find options quickly

### Mobile Considerations
- Mobile styles are enabled by default
- Disable with `disable-mobile-styles` if needed
- Test touch interactions on actual devices

## Common Patterns

### Basic Selection
```tsx
<GdsDropdown label="Country">
  <GdsOption value="us">United States</GdsOption>
  <GdsOption value="uk">United Kingdom</GdsOption>
  <GdsOption value="se">Sweden</GdsOption>
</GdsDropdown>
```

### Searchable with Many Options
```tsx
<GdsDropdown label="Country" searchable>
  <GdsOption value="" isPlaceholder>Select country</GdsOption>
  {/* Many options */}
</GdsDropdown>
```

### Multi-Select with Clear
```tsx
<GdsDropdown label="Tags" multiple searchable clearable>
  <GdsOption value="tag1">Tag 1</GdsOption>
  <GdsOption value="tag2">Tag 2</GdsOption>
</GdsDropdown>
```

### Compact Table Cell
```tsx
<GdsDropdown size="small" label="Status" hide-label>
  <GdsOption value="active">Active</GdsOption>
  <GdsOption value="inactive">Inactive</GdsOption>
</GdsDropdown>
```

## TypeScript Types

```tsx
import type { GdsDropdown, GdsOption } from '@sebgroup/green-core/react'

// Dropdown size
type DropdownSize = 'medium' | 'small'

// Component props types
interface GdsDropdownProps extends React.HTMLAttributes<HTMLElement> {
  label?: string
  open?: boolean
  searchable?: boolean
  multiple?: boolean
  clearable?: boolean
  combobox?: boolean
  size?: DropdownSize
  plain?: boolean
  disabled?: boolean
  required?: boolean
  invalid?: boolean
  'supporting-text'?: string
  'hide-label'?: boolean
  'show-extended-supporting-text'?: boolean
  'sync-popover-width'?: boolean
  'max-height'?: number
  'disable-mobile-styles'?: boolean
  'error-message'?: string
  value?: any
  
  // Events
  onChange?: (event: CustomEvent) => void
  onInput?: (event: CustomEvent) => void
  'onGds-ui-state'?: (event: CustomEvent) => void
  'onGds-filter-input'?: (event: CustomEvent) => void
  'onGds-input-cleared'?: (event: CustomEvent) => void
  'onGds-validity-state'?: (event: CustomEvent) => void
}

interface GdsOptionProps extends React.HTMLAttributes<HTMLElement> {
  value: any
  hidden?: boolean
  isPlaceholder?: boolean
  selected?: boolean
  
  // Events
  'onGds-select'?: (event: CustomEvent) => void
  'onGds-blur'?: (event: CustomEvent) => void
  'onGds-focus'?: (event: CustomEvent) => void
}

// Custom comparison function type
type CompareWithFunction = (a: unknown, b: unknown) => boolean

// Custom search filter type
type SearchFilterFunction = (query: string, option: GdsOption) => boolean
```

## Related Components

- [GdsInput](./GdsInput.md) — For text input fields
- [GdsSelect](./GdsSelect.md) — Native select element (if available)
- [GdsFilterChip](./GdsFilterChip.md) — For filtering content with selectable chips (visual alternative)
- [GdsFormSummary](./GdsFormSummary.md) — For displaying form validation errors
- [GdsCheckbox](./GdsCheckbox.md) — For boolean or small multi-select (< 5 options)
- [GdsRadioGroup](./GdsRadioGroup.md) — For small single-select (< 5 options) with mutually exclusive choices
- [GdsSegmentedControl](./GdsSegmentedControl.md) — For view switching with 2-5 options
- [GdsMenuHeading](./GdsContextMenu.md) — For grouping dropdown options
- [GdsPopover](./GdsPopover.md) — Popover component used internally
- [GdsFlex](./GdsFlex.md) — For layout of form controls
- [GdsButton](./GdsButton.md) — For form submission
- [Code Splitting](./CodeSplitting.md) — Using pure imports with GdsDropdown and GdsOption for tree-shaking

## Accessibility

- **Label**: Always provide a `label` attribute (use `hide-label` to hide visually)
- **Keyboard Navigation**: Full keyboard support (Arrow keys, Enter, Escape, Tab)
- **Screen Readers**: Proper ARIA attributes and announcements
- **Focus Management**: Clear focus indicators and logical tab order
- **Required Fields**: Use `required` attribute to communicate to assistive technology
- **Validation**: Error messages are announced by screen readers
- **Multiple Selection**: Checkboxes provide clear selection state
- **Placeholder Options**: Properly marked as placeholders for assistive technology

### Accessibility Details

- Roles and semantics:
  - Single-select dropdowns use `role="listbox"` for the popup and `role="option"` for options, or the combobox pattern when `combobox` is enabled (`role="combobox"` on the input and `aria-controls` linking to the listbox).
  - Multi-select uses `aria-multiselectable="true"` and checkboxes inside the options to announce selection state.

- Keyboard interactions (single-select / listbox):
  - `Enter` or `Space` opens the list and selects the highlighted option.
  - `ArrowDown` / `ArrowUp` navigate options when the list is open.
  - `Home` / `End` jump to first/last option.
  - `Escape` closes the list without changing selection.
  - `Tab` moves focus out of the control (closes list).

- Keyboard interactions (combobox):
  - Typing filters the list and updates the input value.
  - `ArrowDown` opens the list and moves focus to the first option.
  - `Enter` accepts the highlighted option or the typed value in combobox mode.

- Multi-select keyboard considerations:
  - Use `Space` or `Enter` to toggle a checkbox inside an option.
  - Ensure screen readers announce change in selected count when values change.

- Focus management:
  - Keep predictable focus: focus returns to the trigger after the list is closed, and focus moves into the list when opened.

- Announcements:
  - Announce list size and grouping when the list opens (e.g., "12 options, 2 groups").
  - Use `aria-live` regions sparingly for dynamic announcements (filter results).

- Mobile behavior:
  - On mobile, the control may switch to a native-style picker for better usability; test on devices to ensure good touch targets.

- Avoid combining `searchable` and `combobox`. If you need both behaviors implement a custom wrapper that manages aria semantics carefully.

- Use `compareWith` for complex values to ensure deterministic selection and equality checks.

- Error messaging: ensure `errorMessage` is connected via `aria-describedby` to the input for screen reader announcement.

- When customizing options, ensure each `GdsOption` has a clear accessible name (text or `aria-label`).

## Notes

- GdsDropdown uses Green Core's popover system internally
- Single selection returns a string value
- Multiple selection returns an array of values
- Combobox mode allows custom text input
- Searchable mode filters existing options only
- **Never** combine `searchable` and `combobox` attributes
- Combobox doesn't work with `multiple` attribute
- Custom trigger content is not rendered in combobox mode
- Mobile styles provide optimized touch interactions
- Placeholder options don't show in multiple selection lists
- Use `compareWith` for comparing complex objects
- Use `searchFilter` for custom search logic
- Form integration works with standard form events
- Validation integrates with HTML5 form validation
